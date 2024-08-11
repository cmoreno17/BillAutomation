import boto3
from botocore.exceptions import ClientError
import os

def get_secret():

    secret_name = "BillAutomationSecrets"
    region_name = "us-west-1"

    # Create a Secrets Manager client
    #session = boto3.session.Session()
    client = boto3.client(
        'secretsmanager',
        region_name=region_name,
        aws_access_key_id=os.environ.get('IAM_ACCESS_KEY'),
        aws_secret_access_key=os.environ.get('IAM_SECRET_ACCESS_KEY')
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    secret = get_secret_value_response['SecretString']
    return secret

    # Your code goes here.