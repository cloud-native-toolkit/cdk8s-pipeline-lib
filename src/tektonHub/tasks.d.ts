
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

export interface TektonYaml {
  apiVersion: string = '';
  kind: string = '';
  metadata: {
    name: string;
    labels: { };
    annotations: { };
  };
  spec: {
    description: string;
    workspaces: Workspace[];
    params: Params[];
    results: [ [Object] ];
    steps: [ [Object] ];
  };
}

class Workspace {
  name = '';
  optional: boolean | undefined;
  description = '';
};
class Params {
  name: string = '';
  description: string = '';
  type: string = '';
  default: any;
}