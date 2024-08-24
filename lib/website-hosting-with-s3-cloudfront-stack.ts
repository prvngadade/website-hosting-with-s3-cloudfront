// CDK code for S3 bucket with CloudFront ( Route53 ) to share s3 bucket data securely by Cloudfront
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

 
export class WebsiteHostingWithS3CloudfrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creates a distribution from an S3 bucket.
    //   const myBucket = new s3.Bucket(this, 'myBucket');
    //   new cloudfront.Distribution(this, 'myDist', {
    //     defaultBehavior: { origin: new origins.S3Origin(myBucket) },
    // });

    // Create an S3 bucket for assets
      const assetBucket = new s3.Bucket(this, 'AssetBucket', {
        bucketName: 'test-s3-bucket-hosting-cdn',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

    // Deploy files to the S3 bucket during deployment
      new s3deploy.BucketDeployment(this, 'DeployFiles', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'data'))], // 'data' is a folder containing your files
      destinationBucket: assetBucket,
    });

    // Get existing ACM certificate from N. Virginia (us-east-1) region
        const certificate = acm.Certificate.fromCertificateArn(this, 'ExistingCertificate', 'arn:aws:acm:us-east-1:448049819544:certificate/a751d5b1-6a6c-4bba-80c3-55ed2719c2cb');

   // Create a CloudFront distribution with S3 origin
      const distribution = new cloudfront.Distribution(this, 'Distribution', {
        defaultBehavior: { origin: new origins.S3Origin(assetBucket)
      },
        certificate: certificate,
        domainNames: ['www.testmyaws.work.gd']
      });

    // Fetch existing Route 53 hosted zone
      const hostedZone = route53.HostedZone.fromLookup(this, 'ExistingHostedZone', {
        domainName: 'testmyaws.work.gd', // Replace with your domain name
      });

    // Create DNS entry in Route 53
      new route53.ARecord(this, 'AppRecord', {
        zone: hostedZone,
        recordName: 'www',
        target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
      });


  }

}
