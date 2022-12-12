import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { QueuesConstruct } from "./constructs/QueuesConsturct";
import { StorageConstruct } from "./constructs/StorageConstruct";

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const storage = new StorageConstruct(this, "storage", {});
    const queues = new QueuesConstruct(this, "queues", {});

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HelloCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
