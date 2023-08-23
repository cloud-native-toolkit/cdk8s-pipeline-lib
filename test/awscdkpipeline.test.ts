import { Testing } from 'cdk8s';
import { AWSCDKPipelineChart } from '../src';

describe('AWSCDKPipelineTest', () => {
  test('AWSCDKPipeline', () => {
    const app = Testing.app();
    const templateParams: string[] = new Array<string>();
    // Now, we are going to automagically add the AWS-required parameters before adding the
    // template parameters.
    templateParams.push('AwsAccountId');
    templateParams.push('AwsAccessKeyId');
    templateParams.push('AwsSecretKeyId');
    templateParams.push('AwsRegion');
    const chart = new AWSCDKPipelineChart(app, 'test-cdk-pipeline', {
      params: templateParams,
    });
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});