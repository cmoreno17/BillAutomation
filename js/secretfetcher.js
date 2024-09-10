// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require ("@aws-sdk/client-secrets-manager");
require('dotenv').config();

  async function fetchSecret()
  {
    let response;
    const secret_name = "BillAutomationSecrets";
    const client = new SecretsManagerClient({
      region: "us-west-1",
      credentials: {
        accessKeyId: process.env.IAM_ACCESS_KEY,
        secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY
      }
    });
    try {
      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name
        })
      );
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
      
    }
    return response.SecretString;
  }

  

// Your code goes here

module.exports = fetchSecret;