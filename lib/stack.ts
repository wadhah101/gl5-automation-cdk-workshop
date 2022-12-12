import { Network } from "./constructs/NetwrokConstruct";
import { Compute } from "./constructs/compute/ComputeConstrust";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { QueuesConstruct } from "./constructs/QueuesConsturct";
import { StorageConstruct } from "./constructs/StorageConstruct";

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const storage = new StorageConstruct(this, "storage", {});
    const queues = new QueuesConstruct(this, "queues", {});
    const compute = new Compute(this, "compute", {
      itemsTable: storage.itemsTable,
      itemsFetchQueue: queues.processingQueue,
      itemsImagesBucket: storage.processedItemsBucket,
    });
    const network = new Network(this, "network", {
      itemsQeue: queues.processingQueue,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HelloCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
