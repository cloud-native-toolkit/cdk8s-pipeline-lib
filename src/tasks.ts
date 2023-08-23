import { PipelineTaskBuilder } from 'cdk8s-pipelines';

export const GitCloneTask = new PipelineTaskBuilder()
  .withName('fetch-source')
  .withTaskReference('git-clone')
  .withWorkspace('output', 'shared-data', 'The files from the git repository')
  .withWorkspace('ssh-directory', 'ssh-creds', 'The SSH keys')
  .withStringParam('url', 'repo-url', '$(params.repo-url)')
;
