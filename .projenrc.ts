import { cdk8s } from 'projen';
const project = new cdk8s.ConstructLibraryCdk8s({
  name: 'cdk8s-pipelines-lib',
  repositoryUrl: 'https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib.git',
  defaultReleaseBranch: 'main',
  author: 'Nathan Good',
  authorAddress: 'nathan.good@ibm.com',
  cdk8sVersion: '2.30.0',
  jsiiVersion: '~5.0.0',
  projenrcTs: true,
  bundledDeps: [
    'cdk8s-pipelines@github:cloud-native-toolkit/cdk8s-pipelines',
  ],
  peerDeps: [
    'cdk8s',
    'constructs',
  ],
  devDeps: [
    'axios',
    'octokit',
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
project.addTask('prepare', {
  exec: 'npx projen build',
});
project.synth();
