import * as fs from 'fs';
import axios from 'axios';
import { TektonTask } from './tasks';

export class TektonHubLink {
  /**
 * Grabs all of the Task defined on Tekton Hub.
 * @link https://hub.tekton.dev
 * @returns Promise<TektonTask[]>
 */
  public async fetchTekonHubTasks(): Promise<TektonTask[]> {
    try {
      const endpoint = 'https://api.hub.tekton.dev/v1/resources';
      const response = await axios.get(endpoint);
      if (response.status !== 200) {
        console.log('Request was not successful.');
        return [];
      }
      const jsonData = response.data;
      if (!jsonData.hasOwnProperty('data')) {
        console.log("'data' property not found in the JSON.");
        return [];
      }
      const data: TektonTask[] = jsonData.data;
      return data;
    } catch (error) {
      throw Error(`Error creating Tekton hub tasks file error: ${error}`);
    }
  }

  private CreateHubTaskFileContent(): Promise<string[]> {
    return this.fetchTekonHubTasks().then((task) => {
      // Make sure we have some tasks
      let fileContents: string[];
      fileContents = [];
      if (task.length === 0) {
        return fileContents;
      }
      // Let's create the tektonHubTask.ts
      // The following code is creating the imports for the Tekton Hub Task
      fileContents.push("import { TektonHubTask } from './tektonHubTasksResolver';");
      fileContents.push("import { Construct } from 'constructs';");
      fileContents.push("import { TaskBuilder } from 'cdk8s-pipelines';");
      task.forEach((item: TektonTask) => {
        if (item.kind !== 'Task') {
          return;
        }
        let name = item.name;
        name = name.replace(/-/g, '_');
        name = name.replace(/[0-9]/g, '');
        name = this.camelize(name);
        const url = item.latestVersion.rawURL;
        // We want to init an instance of tektonHubTaskResolver
        // let str = `export const ${name} = new TektonHubTask('${url}').build();`;
        let str = `export const ${name} = function(scope: Construct, id: string) : TaskBuilder { return new TektonHubTask(scope, id, '${url}').build(); };`;
        fileContents.push(str);
      });
      return fileContents;
    });
  }

  public build() {
    const fileContents = this.CreateHubTaskFileContent();
    const success = fileContents.then((data => {
      try {
        const fp = `${__dirname}/tektonHubTasks.ts`;
        const numberOfTasks = data.length;
        fs.writeFile(fp, data.join('\n'), (err: any) => {
          if (err) {
            throw Error(`Error creating Tekton hub tasks file error: ${err}`);
          }
        });
        console.log(`${numberOfTasks} Tekton Hub task created.`);
        return true;
      } catch (err: any) {
        console.error(err);
        return false;
      }
    }));
    return success;
  }
  /**
   * Helper function to camel case the Task names
   * @param str string to camel case
   * @returns string
   */
  private camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
}

