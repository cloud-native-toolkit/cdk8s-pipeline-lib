import { Yaml } from 'cdk8s';
import { ParameterBuilder, Task, TaskBuilder, TaskStepBuilder, WorkspaceBuilder } from 'cdk8s-pipelines';
import { Construct } from 'constructs';

/**
 * This class handles turning a URL that points the YAML for the Tekton Hub Task into a PipelineTask
 */
export class TektonHubTask extends TaskBuilder {
  url: string;
  taskBuild: TaskBuilder;

  /**
   * Creates a new Instance of TektonHubTask with a URL that points to the Raw YAML for the task.
   * @link https://hub.tekton.dev/
   * @param scope
   * @param id
   * @param url string Url to the raw yaml for a Tekton Hub Task (i.e https://raw.githubusercontent.com/tektoncd/catalog/main/task/yq/0.4/yq.yaml)
   */
  constructor(scope: Construct, id: string, url: string) {
    super(scope, id);
    this.url = url;
    this.taskBuild = new TaskBuilder(scope, id);
  }

  private parseYAML(): Boolean {
    const task = this.readYamlFromUrl();
    this.taskBuild.withName(task.metadata?.name!);
    const workspaces = task.spec?.workspaces;
    if (workspaces !== undefined && workspaces?.length !== 0) {
      workspaces.forEach(workspace => {
        this.taskBuild.withWorkspace(new WorkspaceBuilder(workspace.name!)
          .withName(workspace.name!)
          .withDescription(workspace.description!));
      });
    }
    const params = task.spec?.params;
    if (params !== undefined && params.length !== 0) {
      params.forEach(param => {
        this.taskBuild.withStringParam(new ParameterBuilder(param.name!)
          .withDescription(param.description!)
          .withDefaultValue(param.default!)
          .withPiplineParameter(param.name!, param.default!));
      });
    }

    const steps = task.spec?.steps;
    if (steps) {
      steps.forEach(step => {
        const sb =
          new TaskStepBuilder()
            .withName(step.name!)
            .fromScriptData(step.script!)
            .withWorkingDir(step.workingDir!)
            .withArgs(step.args!)
            .withImage(step.image!);
        // step.env?.forEach(e => {
        //   sb.withEnv(e.name);
        // });
        this.taskBuild.withStep(sb);
      });
    }

    return true;
  }

  private readYamlFromUrl(): Task {
    try {
      // Parse the YAML content
      const parsedYaml = Yaml.load(this.url);
      return parsedYaml[0];
    } catch (error) {
      const errorMessage = (error as Error).message; // Type assertion
      throw new Error(`Error reading YAML from URL: ${errorMessage}`);
    }
  }

  /**
   * Returns an instance of PipelineTaskBuilder with the corresponding Tekton Hub Task Link.
   * @returns TaskBuilder
   */
  public build(): TaskBuilder {
    this.parseYAML();
    return this.taskBuild;
  }
}