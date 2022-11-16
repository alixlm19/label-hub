import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as process from 'process';
import { Construct } from 'constructs';
import { Backend } from './backend.mjs';
import { DevOps } from './devops.mjs';
import { Web } from './web.mjs';

export class LableHubStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Web(this, 'Web', {});
    new Backend(this, 'Backend', {});
    new DevOps(this, 'DevOps', {});
  }
}

export class LabelHubStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id);

    new LableHubStack(this, 'LabelHub', {});
  }
}

export class LabelHubPipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(
          'Zehua-Chen/label-hub',
          'main',
          {
            connectionArn: process.env.CODE_STAR_CONNECTION ?? '',
          }
        ),
        commands: ['npx cdk synth'],
      }),
    });

    pipeline.addStage(new LabelHubStage(this, 'LabelHubStage'));
  }
}

const app = new cdk.App();
new LabelHubPipeline(app, 'LabelHubPipeline', {});

app.synth();
