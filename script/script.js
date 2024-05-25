document.getElementById('authButton').addEventListener('click', showAuthPopup);

document.getElementById('uploadForm').addEventListener('submit', (event) => {
    // Prevent the default form submission
    event.preventDefault();

    const formData = new FormData(event.target);
    const imageFile = formData.get('image');
    const apitoken = formData.get('apitoken');
    const s3bucket = formData.get('s3bucket');
    const dynamodb = formData.get('dynamodb');
    const model = formData.get('model');

    // Validate the inputs
    if (!imageFile || !apitoken || !s3bucket || !dynamodb || !model) {
        console.error('All fields are required');
        return;
    }

    // Read the image file
    const reader = new FileReader();
    reader.onload = () => {
        // Prepare the data for Lambda invocation
        const payload = JSON.stringify({
            image: reader.result,
            apitoken,
            s3bucket,
            dynamodb,
            model
        });

        // Invoke the Lambda function
        fetch('YOUR_LAMBDA_FUNCTION_ENDPOINT', {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(responseData => console.log(responseData.body)) // Log the response from Lambda
        .catch(error => console.error('Error calling Lambda:', error));
    };
    reader.readAsDataURL(imageFile);
});

// Function to show the authentication popup
function showAuthPopup() {
    document.getElementById('authPopup').style.display = 'flex';
}

// Function to hide the authentication popup
function hideAuthPopup() {
    document.getElementById('authPopup').style.display = 'none';
}

// Function to save the entered credentials to.env file
function saveCredentials() {
    const accessKeyId = document.getElementById('accessKeyId').value;
    const secretAccessKey = document.getElementById('secretAccessKey').value;
    const regionName = document.getElementById('regionName').value;
    const sessionToken = document.getElementById('sessionToken').value;

    // Construct the.env content
    let envContent = `AWS_ACCESS_KEY_ID=${accessKeyId}\n`;
    envContent += `AWS_SECRET_ACCESS_KEY=${secretAccessKey}\n`;
    envContent += `AWS_REGION_NAME=${regionName}\n`;
    envContent += `AWS_SESSION_TOKEN=${sessionToken}`;

    // Save the.env content to a file
    const blob = new Blob([envContent], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = ".env";
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    hideAuthPopup(); // Hide the popup after saving
}