import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

interface Props {}

export class ApiGatewayConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
  }
}
