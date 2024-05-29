import io
import json
from pprint import pprint
from urllib.request import urlopen, Request
import boto3
from boto3.dynamodb.types import TypeSerializer
from botocore.exceptions import ClientError
from datetime import datetime
import uuid
from decimal import Decimal

API_TOKEN = "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"

headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Define a dictionary mapping model names to their corresponding URLs
MODEL_API_URLS = {
    "resnet50": "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    "mitb5": "https://api-inference.huggingface.co/models/nvidia/mit-b5",
    "food": "https://api-inference.huggingface.co/models/Kaludi/food-category-classification-v2.0",
    "age": "https://api-inference.huggingface.co/models/nateraw/vit-age-classifier",
    "bird": "https://api-inference.huggingface.co/models/dima806/bird_species_image_detection",
    "realestate": "https://api-inference.huggingface.co/models/andupets/real-estate-image-classification",
    "emotions": "https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection"
}

DYNAMODB_TABLE = 'your-dynamo-db'
s3_client = boto3.client("s3")


def query_image(model_name, f):
    # Select the appropriate API URL based on the model name
    api_url = MODEL_API_URLS[model_name]
    http_request = Request(api_url, data=f.read(), headers=headers)
    with urlopen(http_request) as response:
        result = response.read().decode()
        print(result)
    return result


def save_to_dynamodb(data):
  dynamodb = boto3.client('dynamodb')
  timestamp = datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()
  serializer = TypeSerializer()
  dynamo_serialized_data = []
  for item in json.loads(data, parse_float=Decimal):
    dynamo_serialized_item = {'M':{}}
    for key, value in item.items():
      if isinstance(value, (float, Decimal)):
        dynamo_serialized_item['M'][key] = {'N': str(value)}
      elif isinstance(value, dict):
        dynamo_serialized_item['M'][key] = {
          'M': {k: serializer.serialize(v)
                for k, v in value.items()}
        }
      else:
        dynamo_serialized_item['M'][key] = {'S': str(value)}
    dynamo_serialized_data.append(dynamo_serialized_item)

  data_ready_to_be_saved = {
    'id': {
      'S': str(uuid.uuid1())
    },
    'createdAt': {
      'S': timestamp
    },
    'updatedAt': {
      'S': timestamp
    },
    'huggingJson': {
      'L': dynamo_serialized_data
    },
    'huggingFaceStringData': {
      'S': data
    }
  }
  print(json.dumps(data_ready_to_be_saved))

  try:
    dynamodb.put_item(TableName=DYNAMODB_TABLE, Item=data_ready_to_be_saved)
    pass
  except ClientError as e:
    print(e.response['Error']['Message'])
    raise e
  return


def lambda_handler(event, _):
    pprint(event)
    for record in event.get("Records"):
        bucket = record.get("s3").get("bucket").get("name")
        key = record.get("s3").get("object").get("key")

        print("Bucket", bucket)
        print("Key", key)

        # Download file from bucket
        file = io.BytesIO()
        s3_client.download_fileobj(Bucket=bucket, Key=key, Fileobj=file)
        file.seek(0)

        # Extract the model name from the event
        model_name = event.get("model_name")  # Assuming the model name is passed in the event

        # Send file to Huggingface API using the selected model
        result = query_image(model_name, file)
        print("result", result)

        # Save data to DynamoDB
        save_to_dynamodb(result)

    return {"statusCode": 200, "body": "Done!"}
