// __mocks__/fs.ts
const fs = jest.genMockFromModule('fs');
export default {
  writeFile: jest.fn((_path, _data, callback) => {
    console.log(_data);
    console.log('HERERERER!');
    callback(null);
  }),
};
module.exports = fs;