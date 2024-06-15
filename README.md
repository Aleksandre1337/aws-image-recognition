# AWS Image Recognition with Next.js Frontend

This project combines AWS Lambda functions for image recognition with a Next.js frontend, providing a seamless integration for uploading images and displaying their classification results. The backend leverages various machine learning models hosted on Hugging Face for diverse image recognition tasks, including object detection, age classification, and emotion detection. The frontend is a simple yet powerful Next.js application that interacts with the Lambda functions to process and display the image recognition results.

## Features

- **Multiple Model Support**: Utilizes different models from Hugging Face for various image recognition tasks.
- **AWS Lambda Backend**: Processes image uploads and queries the ML models for recognition.
- **DynamoDB Integration**: Stores the recognition results for persistence and analytics.
- **S3 Integration**: Stores uploaded images to the S3 bucket
- **Next.js Frontend**: A modern web application for uploading images and viewing the recognition results.
- **Deployed on Vercel**: For easy access and high availability.

## Getting Started

### Prerequisites

- Node.js and npm/yarn/pnpm/bun installed.
- An AWS account with access to Lambda, S3, and DynamoDB.
- API tokens for accessing the Hugging Face models.

### Running the Development Server

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   npm install
   # or
   yarn
   # or
   pnpm install
   # or
   bun install
3. Start the development server:
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### API Routes

- The main API endpoint is located in the \`.env\` file, with the key \`AWS_API_GATEWAY_URL\` and API Gateway API key with the key \`AWS_API_GATEWAY_KEY\`.
- The API interacts with AWS Lambda functions to process image uploads and recognition so you'll need to host lambda and create appropriate resources on S3 if you wish to test it locally.

## Deployment

The frontend is deployed on Vercel for easy access and high availability. Visit the live site at [https://aws-image-recognition.vercel.app/](https://aws-image-recognition.vercel.app/).

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [AWS Lambda](https://aws.amazon.com/lambda/) - Learn about serverless computing with AWS Lambda.
- [Hugging Face Models](https://huggingface.co/models) - Explore the various machine learning models available for different tasks.

## Collaborations

This project was made by Konstantine Biganashvili and Aleksandre Mikashavidze.

## Additional Information

- DynamoDB table and S3 bucket values can be changed inside the Lambda code.

## License

This project is open source and available under the MIT license.
