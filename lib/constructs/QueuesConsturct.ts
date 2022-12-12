import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

interface Props {}

export class QueuesConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const dlqprocessingQueue = new cdk.aws_sqs.Queue(scope, "processingQueue", {
      queueName: "processing-queue",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const processingQueue = new cdk.aws_sqs.Queue(scope, "processingQueue", {
      queueName: "processing-queue",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
