import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

interface Props {
  itemsTable: cdk.aws_dynamodb.ITable;
  itemsFetchQueue: cdk.aws_sqs.IQueue;
  itemsImagesBucket: cdk.aws_s3.IBucket;
}

export class Compute extends Construct {
  fetch: cdk.aws_lambda_nodejs.NodejsFunction;
  api: cdk.aws_lambda_nodejs.NodejsFunction;
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.fetch = new cdk.aws_lambda_nodejs.NodejsFunction(this, "fetch", {
      memorySize: 512,
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      bundling: {
        externalModules: ["@aws-sdk"],
      },
    });

    this.api = new cdk.aws_lambda_nodejs.NodejsFunction(this, "api", {
      memorySize: 512,
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      environment: {
        TARGET_QUEUE_NAME: props.itemsFetchQueue.queueName,
      },
      bundling: {
        externalModules: ["@aws-sdk"],
      },
    });

    props.itemsImagesBucket.grantWrite(this.fetch);
    props.itemsFetchQueue.grantConsumeMessages(this.fetch);
    props.itemsTable.grantReadWriteData(this.fetch);

    props.itemsFetchQueue.grantSendMessages(this.api);
  }
}
