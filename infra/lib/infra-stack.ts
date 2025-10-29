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

    // The code that defines your stack goes here

    const WebAppBucket = new s3.Bucket(this, 'WebAppBucket', {
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'WebAppDeployment', {
      sources: [s3deploy.Source.asset('../frontend')],
      destinationBucket: WebAppBucket,
    });

    new cdk.CfnOutput(this, 'WebAppBucketOutputURL', {
      value: WebAppBucket.bucketWebsiteUrl,
    });

    /* API and Lambda setup will go here */

    /* Lambda function */
    const helloLambda = new NodejsFunction(this, 'HelloLambda', {
      runtime: lambda.Runtime.NODEJS_20_X, /* Choose any supported Node.js runtime */
      entry: path.join(__dirname, '../../backend/src/hello.ts'),
      handler: 'hello',
    });

    /* API Gateway setup */
    const api = new apigateway.RestApi(this, 'WebApi', {
      restApiName: 'WebApi',
      deployOptions: { stageName: 'prod' },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET'],
      },
    });

    const hello = api.root.addResource('hello');
    hello.addMethod('GET', new apigateway.LambdaIntegration(helloLambda));

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url! });
  }
}
