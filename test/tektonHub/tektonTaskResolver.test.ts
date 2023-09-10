import { App, Yaml } from 'cdk8s';
import { TektonHubTask } from '../../src/tektonHub/tektonHubTasksResolver';

describe('tektonTaskResolver', () => {
  test('resolverWithoutWorkspace', async () => {
    const mockScope = new App();
    const mockReturnValue = Yaml.load(__dirname + '/gogit.yaml');
    const spyOnLoad = jest.spyOn(Yaml, 'load').mockReturnValue(mockReturnValue);
    const result = new TektonHubTask(mockScope, 'gogit', 'loaded gogit yaml content');
    result.build();
    expect(spyOnLoad).toHaveBeenCalledWith('loaded gogit yaml content');
    expect(result).toMatchSnapshot();
  });

  test('resolverWithWorkspace', async () => {
    const mockScope = new App();
    const mockReturnValue = Yaml.load(__dirname + '/git-cli.yaml');
    const spyOnLoad = jest.spyOn(Yaml, 'load').mockReturnValue(mockReturnValue);
    const result = new TektonHubTask(mockScope, 'gogit', 'loaded git-cli yaml content');
    result.build();
    expect(spyOnLoad).toHaveBeenCalledWith('loaded git-cli yaml content');
    expect(result).toMatchSnapshot();
  });
});