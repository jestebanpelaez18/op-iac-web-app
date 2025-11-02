import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* S3 Bucket for hosting the Web Application */
    const WebAppBucket = new s3.Bucket(this, 'WebAppBucket', {
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    /* Output the S3 Bucket Website URL */
    new cdk.CfnOutput(this, 'WebAppBucketOutputURL', {
      value: WebAppBucket.bucketWebsiteUrl,
    });

    /* API and Lambda setup will go here */

    /* Lambda function serving the backend API */
    const helloLambda = new NodejsFunction(this, 'HelloLambda', {
      runtime: lambda.Runtime.NODEJS_20_X, 
      entry: path.join(__dirname, '../../backend/src/hello.ts'),
      handler: 'hello',
    });

    /* API Gateway exposing the Lambda on GET */
    const api = new apigateway.RestApi(this, 'WebApi', {
      restApiName: 'WebApi',
      deployOptions: { stageName: 'prod' },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET'],
      },
    });

    /*API Method for the root */
    api.root.addMethod('GET', new apigateway.LambdaIntegration(helloLambda));
    
    /* API Resource and Method for /hello */
    const hello = api.root.addResource('hello');
    hello.addMethod('GET', new apigateway.LambdaIntegration(helloLambda));

    /* Output the API URL */  
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url! });

    /*Specifies bucket deployment sources are uploaded to S3*/
    new s3deploy.BucketDeployment(this, 'WebAppDeployment', {
      sources: [s3deploy.Source.asset('../frontend'),
        s3deploy.Source.data('config.js', `window.APP_CONFIG = { apiUrl: "${api.url}" };`),
      ],
      destinationBucket: WebAppBucket,
    });
  }
}
