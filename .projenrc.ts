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
  bundledDeps: [
    'octokit',
    'axios',
  ],
  peerDeps: [
    'cdk8s',
    'cdk8s-pipelines',
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
// Create the tekton hub tasks
project.projectBuild.preCompileTask.exec('npm run build:tekon-hub-task');
project.synth();
