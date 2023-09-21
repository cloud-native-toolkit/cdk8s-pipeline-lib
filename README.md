[![build](https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib/actions/workflows/build.yml/badge.svg)](https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib/actions/workflows/build.yml)

[![View on Construct Hub](https://constructs.dev/badge?package=cdk8s-pipelines-lib)](https://constructs.dev/packages/cdk8s-pipelines-lib)

# Pipeline Library of cdk8s Constructs

This is a library of several "pattern" pipelines that are intended to be
basic and therefore easily reusable.

Additionally, using the `TaskBuilder`, each `Task`
(see [Tasks](https://tekton.dev/docs/getting-started/tasks/))
from [Tekton Hub](https://hub.tekton.dev/) can be found in this library as a construct.

## Using tasks from Tekton Hub

The following is an example chart that uses a Tekton Hub Task for
an [OpenShift client](https://hub.tekton.dev/tekton/task/openshift-client).

```ts
import { App, Chart, ChartProps } from 'cdk8s';
import { ParameterBuilder, PipelineBuilder } from 'cdk8s-pipelines';
import { openshift_client } from 'cdk8s-pipelines-lib';
import { Construct } from 'constructs';

export class TektonHubTaskChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const projectName = 'my-project';

    const createProject = openshift_client(this, 'create-project')
      .withStringParam(new ParameterBuilder('SCRIPT')
        .withValue(`oc create ${projectName}`));

    const builder = new PipelineBuilder(this, 'create-some-namespace')
      .withDescription('Creates a namespace and then does some other stuff')
      .withTask(createProject);
    // ... more tasks go here
  }
}

const app = new App();
new TektonHubTaskChart(app, 'test');
app.synth()
```

