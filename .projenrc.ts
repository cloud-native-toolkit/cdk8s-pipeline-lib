import { cdk8s } from 'projen';

const project = new cdk8s.ConstructLibraryCdk8s({
  name: 'cdk8s-pipelines-lib',
  repositoryUrl: 'https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib.git',
  defaultReleaseBranch: 'main',
  author: 'Nathan Good',
  authorAddress: 'nathan.good@ibm.com',
  cdk8sVersion: '2.30.0',
  jsiiVersion: '~5.0.0',
  workflowNodeVersion: '18.x',
  projenrcTs: true,
  // deps: [
  //   'cdk8s-pipelines@^0.0.3',
  // ],
  bundledDeps: [
    'octokit',
    'axios',
    'cdk8s-pipelines',
  ],
  peerDeps: [
    'cdk8s',
    'constructs',
  ],
  devDeps: [
    '@cdk8s/projen-common',
  ],
  keywords: [
    'cdk8s',
    'kubernetes',
    'pipelines',
    'tekton',
  ],
  gitignore: [
    '.idea/',
  ],
});
project.synth();
