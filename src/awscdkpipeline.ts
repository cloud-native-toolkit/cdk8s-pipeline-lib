import { TextDecoder } from 'node:util';
import { App, Chart, ChartProps } from 'cdk8s';
import { PipelineBuilder, PipelineTaskBuilder } from 'cdk8s-pipelines';
import { Construct } from 'constructs';
import { Octokit } from 'octokit';

/**
 * Initialization properties for the AWSCDKPipelineChart
 */
export interface AWSCDKPipelineChartProps extends ChartProps {
  readonly params?: string[];
}

/**
 * The chart for creating a Tekton Pipeline that will use an AWS CDK project
 * to create resources in AWS for re-usable artifacts.
 */
export class AWSCDKPipelineChart extends Chart {
  /**
   * Initializes an instance of the AWSCDKPipelineChart.
   *
   * @param scope
   * @param id
   * @param props
   */
  constructor(scope: Construct, id: string, props: AWSCDKPipelineChartProps = {}) {
    super(scope, id, props);
    // Create the pipeline that will run in the OpenShift or K8s cluster.
    // const  = new Pipeline(this, 'aws-cdk-pipeline', {
    //   name: 'aws-cdk-pipeline',
    // });
    // props.params?.forEach(s => {
    //   pipeline.addStringParam(s);
    // });
    const pipeline = new PipelineBuilder(this, 'aws-cdk-pipeline')
      .withName('deploy-cdk-project')
      .withDescription('A pipeline for deploying a AWS CDK project from a GitHub repository to a cluster.')
      .withTask(new PipelineTaskBuilder()
        .withName('fetch-project')
        .withTaskReference('git-clone')
        .withWorkspace('output', 'shared-data', 'The AWS CDK project files.')
        .withWorkspace('ssh-creds', 'ssh-credentials', 'The location of the SSH keys and credentials'),
      );

    // Now build out the
    const awsCdkTask = new PipelineTaskBuilder()
      .withName('synth-cdk-pipeline')
      .withTaskReference('aws-cdk-synth')
      .withWorkspace('projectdata', 'shared-data', 'The AWS CDK project files');

    props.params?.forEach((s) => {
      awsCdkTask.withStringParam(s, s, `$(params.${s})`, '');
    });
    pipeline.withTask(awsCdkTask);
    pipeline.buildPipeline();
  }
}

/**
 * Contains the information for the GitHub repo and the stack so we can go get
 * it and generate the AWS CDK pipeline.
 */
export interface GitRepoConfig {
  /**
   * The URL for the GitHub or GHE API. The value should look like https://api.github.com or
   * https://github.mycompany.com/api/v3.
   */
  readonly ghUrl?: string;
  /**
   * The owner of the GitHub repository.
   */
  readonly owner?: string;
  /**
   * The release tag for the release in which the AWS CDK template should be found.
   */
  readonly release?: string;
  /**
   * The name of the repository.
   */
  readonly repo?: string;
  /**
   * The name of the AWS CDK stack. This should be a generated template that is included
   * in the release.
   */
  readonly stackName?: string;
  /**
   * The personal access token (PAT) for accessing the library in GitHub.
   */
  readonly token?: string;
}

/**
 * Creator for the AWSCDKPipelineChart
 */
export class AWSCDKPipeline {

  /**
   * Generates the AWS CDK Pipeline (AWSCDKPipelineChart) based on the actual project
   * located in GitHub and specified by the configuration.
   * @param config
   */
  public static createFrom(config: GitRepoConfig): void {
    const octokit = new Octokit({
      auth: config.token,
      baseUrl: config.ghUrl,
    });

    octokit.rest.repos.getReleaseByTag({
      owner: config.owner!,
      repo: config.repo!,
      tag: config.release!,
    }).then(function (releaseResponse) {
      const releaseId = releaseResponse.data.id;
      octokit.rest.repos.listReleaseAssets({
        owner: config.owner!,
        repo: config.repo!,
        release_id: releaseId,
      }).then(function (templateResponse) {
        const asset = templateResponse.data.find(a => a.name == `${config.stackName}.template.json`);
        const assetId = asset?.id;
        // Now that I have my asset ID, I can download the asset...
        octokit.rest.repos.getReleaseAsset({
          owner: config.owner!,
          repo: config.repo!,
          asset_id: Number(assetId),
          headers: {
            accept: 'application/octet-stream',
          },
        }).then(function (assetResponse) {
          const template = JSON.parse(new TextDecoder().decode(assetResponse.data as unknown as ArrayBuffer));
          const app = new App();
          const templateParams: string[] = new Array<string>();
          // Now, we are going to automagically add the AWS-required parameters before adding the
          // template parameters.
          templateParams.push('AwsAccountId');
          templateParams.push('AwsAccessKeyId');
          templateParams.push('AwsSecretKeyId');
          templateParams.push('AwsRegion');
          Object.keys(template.Parameters).forEach(key => {
            templateParams.push(key);
          });
          new AWSCDKPipelineChart(app, 'example-cdk8s-pipeline', {
            params: templateParams,
          });
          app.synth();
        }).catch(function (assetErr) {
          console.error(assetErr);
        });
      }).catch(function (templateErr) {
        console.error(templateErr);
      });
    }).catch(function (releaseErr) {
      console.error(releaseErr);
    });
  }
}
