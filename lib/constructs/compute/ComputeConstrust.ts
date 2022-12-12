import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";

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
      memorySize: 1024,
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      bundling: {
        externalModules: ["@aws-sdk"],
      },
    });

    this.api = new cdk.aws_lambda_nodejs.NodejsFunction(this, "api", {
      memorySize: 128,
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      environment: {
        TARGET_QUEUE_URL: props.itemsFetchQueue.queueUrl,
        TARGET_TABLE_NAME: props.itemsTable.tableName,
      },
      bundling: {
        externalModules: ["@aws-sdk/client-sqs"],
      },
    });

    // permissions
    props.itemsImagesBucket.grantWrite(this.fetch);
    props.itemsFetchQueue.grantConsumeMessages(this.fetch);
    props.itemsTable.grantWriteData(this.fetch);

    props.itemsFetchQueue.grantSendMessages(this.api);
    props.itemsTable.grantReadData(this.api);

    // linking to events
    this.fetch.addEventSource(
      new cdk.aws_lambda_event_sources.SqsEventSource(props.itemsFetchQueue, {
        batchSize: 10,
        maxBatchingWindow: Duration.minutes(1),
      })
    );
  }
}
