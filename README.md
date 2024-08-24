# Welcome to your CDK TypeScript project

This repo for host static website using S3 Bucket and CloudFront to serve secure way.

1. Create S3 Bucket
2. Data deployment into S3 bucket
3. Create CloudFront distribution
4. Add additional domain name for domain name mapping
5. Import SSL certificate for additional domain.
   

## Architecture Diagram

![image](https://github.com/user-attachments/assets/22af6189-5abe-4859-9b97-5f6c466c2697)

Commands Used:
 aws configure
 npm install -g aws-cdk
 cdk init app --language typescript
 npm install
 npm audit fix
 cdk bootstrap
 cdk deploy --all


