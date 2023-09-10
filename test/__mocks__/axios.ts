// __mocks__/axios.ts
import fetchData from './tektonHub.json';
const mockAxios = {
  get: jest.fn().mockResolvedValue({ data: fetchData, status: 200 }),
};

export default mockAxios;