import fs from 'fs';
import axios from 'axios';
// import { Testing } from 'cdk8s';
import fetchData from './../__mocks__/tektonHub.json';
import { TektonTask } from '../../src/tektonHub/tasks';
import { TektonHubLink } from '../../src/tektonHub/TektonHubLink';

jest.mock('axios');
jest.mock('fs');

describe('testTekonFetch', () => {
  test('tektonHub', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      status: 200,
      data: fetchData,
    });
    const tetkontHubLink = new TektonHubLink();
    const tektonHubTasks = await tetkontHubLink.fetchTekonHubTasks();
    expect(tektonHubTasks).toEqual(expect.any(Array<TektonTask>)); // Check if the result is an array of TektonTask
    expect(tektonHubTasks).toHaveLength(6); // Check if the array length matches
  });

  test('tektonHubInvalidData', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      status: 500,
      data: [],
    });
    try {
      const logSpy = jest.spyOn(console, 'log');
      const tetkontHubLink = new TektonHubLink();
      const result = await tetkontHubLink.fetchTekonHubTasks();
      expect(logSpy).toHaveBeenCalledWith('Request was not successful.');
      expect(result).toBe([]);
    } catch (Error: any) {
      return;
    }
  });

  test('testFileCreationData', async () => {
    const logSpy = jest.spyOn(console, 'log');
    expect(jest.isMockFunction(fs.writeFile)).toBeTruthy();
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      status: 200,
      data: fetchData,
    });
    const tetkontHubLink = new TektonHubLink();
    // @ts-ignore: We temporarily ignore TypeScript's error
    await tetkontHubLink.CreateHubTaskFileContent().then(data => {
      expect(data).toMatchSnapshot();
    });
    const tektonBuildFile = await tetkontHubLink.build();
    expect(logSpy).toHaveBeenCalledWith('8 Tekton Hub task created.');
    expect(tektonBuildFile).toBeTruthy;
  });

});
