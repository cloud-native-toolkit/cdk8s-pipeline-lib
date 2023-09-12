import { TaskStep } from 'cdk8s-pipelines';

interface Resource {
  id: number;
  name: string;
}

interface Version {
  id: number;
  version: string;
  rawURL: string;
}

interface Platform {
  id: number;
  name: string;
}
/**
 * This is the expected format of the results from the Tekton API
 * @link https://api.hub.tekton.dev/v1/resources
 */
export interface TektonTask {
  id: number;
  name: string;
  catalog: {
    id: number;
    name: string;
    type: string;
  };
  categories: any[];
  kind: string;
  hubURLPath: string;
  latestVersion: Version;
  tags: any[];
  platforms: Platform[];
  rating: number;
}
