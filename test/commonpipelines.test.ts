import { Chart, ChartProps, Testing } from 'cdk8s';
import { Construct } from 'constructs';
import { EchoMessage } from '../src';
import { InstallFromIBMOperatorPipeline } from '../src/commonpipelines';

class TestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);
    new InstallFromIBMOperatorPipeline(this, 'test-pipeline', 'ibm-eventstreams', 'ibm-eventstreams', 'v3.3')
      .withTask(EchoMessage(this, 'test-echo', 'Hello, world!'))
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