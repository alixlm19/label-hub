import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';

export class Web extends Construct {
  constructor(scope: Construct, id: string, props: unknown) {
    super(scope, id);

    const bucket = new cdk.aws_s3.Bucket(this, 'label-hub-hosting', {
      bucketName: 'lable-hub-hosting',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
    });

    bucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new cdk.aws_iam.AnyPrincipal()],
      })
    );

    new cdk.aws_s3_deployment.BucketDeployment(this, 'lable-hub-hosting', {
      sources: [cdk.aws_s3_deployment.Source.asset(path.join('web', 'public'))],
      destinationBucket: bucket,
    });
  }
}