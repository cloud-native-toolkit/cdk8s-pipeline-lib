import { generateDeployerTasks, normalizedToPascalCase } from '../../src/deployerTektonTasks/DeployerTaskGenerator';

describe('testDeployerTektonTasks', () => {
  test('testCreateBuilder', async () => {
    // const deployerRepo = new DeployerRepoLink();
    // const testFn = path.join(__dirname, 'ibm-pak-0.2.yaml');
    // const actualCode = deployerRepo.createTaskVerFileContents('my_task_1_0', testFn);
    // console.log(actualCode);
    // expect(actualCode).toBeTruthy();
    generateDeployerTasks();
  });

  test('testNormalizedName', async () => {
    const fileName = '/Users/jexample/Code/cloud-native-toolkit/cdk8s-pipelines-libcache/tasks/ibm-pak/0.2/ibm-pak.yaml';
    const normalizedClassName = normalizedToPascalCase(fileName);
    expect(normalizedClassName).toBe('IbmPak02');
  });
});