import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

interface Props {
  itemsQeue: cdk.aws_sqs.IQueue;
}

export class Network extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const credentialsRole = new cdk.aws_iam.Role(this, "Role", {
      assumedBy: new cdk.aws_iam.ServicePrincipal("apigateway.amazonaws.com"),
    });

    credentialsRole.attachInlinePolicy(
      new cdk.aws_iam.Policy(this, "SendMessagePolicy", {
        statements: [
          new cdk.aws_iam.PolicyStatement({
            actions: ["sqs:SendMessage"],
            effect: cdk.aws_iam.Effect.ALLOW,
            resources: [props.itemsQeue.queueArn],
          }),
        ],
      })
    );

    const api = new cdk.aws_apigateway.RestApi(this, "main-api", {});

    const itemsApi = api.root.addResource("items");

    itemsApi.addMethod(
      "POST",
      new cdk.aws_apigateway.AwsIntegration({
        service: "sqs",
        path: props.itemsQeue.queueName,
        region: "eu-west-1",
        options: {
          credentialsRole: credentialsRole,

          integrationResponses: [
            {
              statusCode: "201",
              responseTemplates: {
                "application/json": `{"done": true}`,
              },
            },
          ],
        },
      }),
      { methodResponses: [{ statusCode: "201" }] }
    );
  }
}
