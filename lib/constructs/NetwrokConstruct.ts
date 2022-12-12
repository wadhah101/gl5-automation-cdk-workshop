import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

interface Props {
  createItemHandler: cdk.aws_lambda.IFunction;
}

export class Network extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const api = new cdk.aws_apigateway.LambdaRestApi(this, "main-api", {
      handler: props.createItemHandler,
      proxy: false,
    });

    const itemsApi = api.root.addResource("items");
    itemsApi.addMethod("POST");
    itemsApi.addMethod("GET");
  }
}
