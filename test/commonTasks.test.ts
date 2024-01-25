import { Chart, ChartProps, Testing } from 'cdk8s';
import { PipelineBuilder } from 'cdk8s-pipelines';
import { Construct } from 'constructs';
import { CreateNamespace, CreateOperatorGroup, RegisterIBMOperatorCatalog, Subscribe } from '../src';

class TestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);
    const labels = {
      'backup.eventstreams.ibm.com/component': 'catalogsource',
    };
    // Note: this pipeline would not necessarily make any sense to run.
    // It is just for testing only, so the pipeline exercises all the different
    // pre-built tasks.
    new PipelineBuilder(this, 'test-pipeline')
      .withTask(CreateNamespace(this, 'create-namespace', 'my-test-namespace'))
      .withTask(RegisterIBMOperatorCatalog(this, 'register-ibm-operators', labels, 45))
      .withTask(CreateOperatorGroup(this, 'create-operator-group', 'ibm-eventautomation-operatorgroup', 'ibm-eventstreams'))
      .withTask(Subscribe(this, 'install-eventstreams', 'ibm-eventstreams', 'ibm-eventstreams', 'ibm-operator-catalog'))
      .buildPipeline();
  }
}

describe('ApplyObjectTaskTest', () => {
  test('ApplyNamespaceObject', () => {
    const app = Testing.app();
    const chart = new TestChart(app, 'test');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});