import isEqual from 'lodash.isequal';
import { stringify } from './utils';

export const createTestRunner = (mockedIOs = []) => {
  let mockIndex = 0;
  return io => {
    if (!mockedIOs[mockIndex]) {
      throw new Error('Mocked IOs should be exhaustive')
    }
    const [expectedIO, mockedRetValue] = mockedIOs[mockIndex];
    if (!isEqual(io.f, expectedIO.f)) {
      throw new Error(`Invalid IO#${mockIndex} function`)
    }
    if (!isEqual(io.args, expectedIO.args)) {
      const expectedArgs = stringify(expectedIO.args);
      const ioArgs = stringify(io.args);
      throw new Error(`Invalid IO#${mockIndex} function arguments: expected \n${expectedArgs}\nbut got \n${ioArgs}`)
    }
    mockIndex += 1;
    return mockedRetValue;
  }
};

export const ioRunner = ({ f, args }) => f(...args);
