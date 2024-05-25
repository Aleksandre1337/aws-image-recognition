# AWS Hugging Face AI Processing

This project is a simple web application that allows users to upload an image file from their device, select a Hugging Face model, and submit the data to a Lambda function via an API Gateway. The Lambda function is intended to send the uploaded file to Hugging Face for processing and store the returned value in a DynamoDB table. The image file itself is stored in an S3 bucket.

## Current State of the Project

The project is currently in development and is not yet fully functional. The front-end of the application has been implemented, including the upload form and AWS authentication. However, the back-end implementation is still missing. This includes the setup and configuration of the AWS services (Lambda, API Gateway, S3, and DynamoDB) and the integration with Hugging Face.

## How to Use

1. Open `index.html` in your web browser.
2. Click the "Authenticate AWS" button and enter your AWS credentials. (Saves the input as .env file)
3. Select an image file to upload.
4. Enter your API token, S3 bucket name, and DynamoDB name.
5. Select a Hugging Face model from the dropdown menu.
6. Click the "Submit" button to send the data to the Lambda function.

## Future Work

The next steps for this project are to implement the back-end functionality. This includes setting up the Lambda function to receive the data from the front-end, send the image file to Hugging Face for processing, store the returned value in DynamoDB, and store the image file in the S3 bucket.

## Contributions

Contributions are welcome! Please feel free to submit a pull request or open an issue.