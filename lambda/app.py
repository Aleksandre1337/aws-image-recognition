import io
import json
import boto3
import base64
import time
import uuid
from pprint import pprint
from urllib.request import urlopen, Request
from datetime import datetime
from decimal import Decimal
from boto3.dynamodb.types import TypeSerializer
from botocore.exceptions import ClientError

MODEL_API_URLS = {
    "resnet50": "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    "mitb5": "https://api-inference.huggingface.co/models/nvidia/mit-b5",
    "food": "https://api-inference.huggingface.co/models/Kaludi/food-category-classification-v2.0",
    "age": "https://api-inference.huggingface.co/models/nateraw/vit-age-classifier",
    "bird": "https://api-inference.huggingface.co/models/dima806/bird_species_image_detection",
    "realestate": "https://api-inference.huggingface.co/models/andupets/real-estate-image-classification",
    "emotions": "https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection"
}

DYNAMODB_TABLE = 'image-recognition'
s3_client = boto3.client("s3")

def query_image(model_name, API_TOKEN, b64_image):
    api_url = MODEL_API_URLS.get(model_name)
    if not api_url:
        raise ValueError(f"Model name '{model_name}' is not valid.")

    print(f"Querying model: {model_name} at URL: {api_url}")

    image_bytes = base64.b64decode(b64_image)
    file = io.BytesIO(image_bytes)
    http_request = Request(api_url, data=file.read(), headers={
      "Authorization": f'Bearer {API_TOKEN}'
    })

    max_retries = 5
    backoff_factor = 1  # in seconds

    for attempt in range(max_retries):
        try:
            with urlopen(http_request) as response:
                result = response.read().decode()
                print(result)
            return result
        except Exception as e:
            if attempt < max_retries - 1:
                sleep_time = backoff_factor * (2 ** attempt)
                print(f"Request failed, retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print(f"Max retries reached. Error: {e}")
                raise e

def upload_image_to_s3(bucket_name, base_64, file):
    try:
        s3_client.put_object(Body=base_64, Bucket=bucket_name, Key=file)
        print("Successfully uploaded image to S3")
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        raise e

def save_to_dynamodb(data):
    dynamodb = boto3.client('dynamodb')
    timestamp = datetime.now().replace(microsecond=0).isoformat()
    serializer = TypeSerializer()

    dynamo_serialized_data = []
    for item in json.loads(data, parse_float=Decimal):
        dynamo_serialized_item = {'M': {}}
        for key, value in item.items():
            if isinstance(value, (float, Decimal)):
                dynamo_serialized_item['M'][key] = {'N': str(value)}
            elif isinstance(value, dict):
                dynamo_serialized_item['M'][key] = {
                    'M': {k: serializer.serialize(v) for k, v in value.items()}
                }
            else:
                dynamo_serialized_item['M'][key] = {'S': str(value)}
        dynamo_serialized_data.append(dynamo_serialized_item)

    data_ready_to_be_saved = {
        'id': {'S': str(uuid.uuid1())},
        'createdAt': {'S': timestamp},
        'updatedAt': {'S': timestamp},
        'huggingJson': {'L': dynamo_serialized_data},
        'huggingFaceStringData': {'S': data}
    }
    print(json.dumps(data_ready_to_be_saved))

    try:
        dynamodb.put_item(TableName=DYNAMODB_TABLE, Item=data_ready_to_be_saved)
    except ClientError as e:
        print(e.response['Error']['Message'])
        raise e

def lambda_handler(event, _):
    print("Event: ", event)

    body = json.loads(event.get('body', '{}'))

    required_keys = ['base64', 'model', 'apiToken']
    for key in required_keys:
        if key not in body:
            return {"statusCode": 400, "body": f"Missing required key: {key}"}

    b64_image = body['base64']
    model = body['model']
    api_token = body['apiToken']

    try:
        upload_image_to_s3("python-lambda-image-recognition", b64_image, 'image.png')
        query_response = query_image(model, api_token, b64_image)
        save_to_dynamodb(query_response)
    except Exception as e:
        print(f"Error in lambda handler: {e}")
        return {"statusCode": 500, "body": str(e)}

    return {"statusCode": 200, "body": query_response}
