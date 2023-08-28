[![build](https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib/actions/workflows/build.yml/badge.svg)](https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib/actions/workflows/build.yml)

# Pipeline Library of cdk8s Constructs

This is a library of several "pattern" pipelines that are intended to be
basic and therefore easily reusable.


# To use Tekton Hub Task(s)

The following is an example chart that uses a Tekton Hub Task.

```ts
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { PipelineBuilder, PipelineTaskBuilder } from 'cdk8s-pipelines';
import { git_cli } from 'cdk8s-pipelines-lib';

export class TektonHubTaskChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
    new PipelineTaskBuilder();
    new PipelineBuilder(this, 'my-pipeline')
    .withName('clone-build-push')
    .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
    .withTask(git_cli)
    .buildPipeline();
  }
}
const app = new App();
new TektonHubTaskChart(app, 'test');
app.synth()
```