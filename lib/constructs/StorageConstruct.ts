import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

interface Props {}

export class StorageConstruct extends Construct {
  scrapingBucket: cdk.aws_s3.Bucket;
  processedItemsBucket: cdk.aws_s3.Bucket;
  itemsTable: cdk.aws_dynamodb.Table;
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.processedItemsBucket = new cdk.aws_s3.Bucket(
      scope,
      "ProcessItemsBucket",
      {
        bucketName: "processed-items-bucket",
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    this.itemsTable = new cdk.aws_dynamodb.Table(scope, "itemsTable", {
      tableName: "items-table",
      partitionKey: { name: "id", type: cdk.aws_dynamodb.AttributeType.STRING },
      sortKey: {
        name: "fetchdate",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });
  }
}
