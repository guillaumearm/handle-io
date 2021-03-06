import BypassHandlerError from './internal/BypassHandlerError';
import SimulatedThrow from './internal/SimulatedThrow';
import isEqual from 'lodash.isequal';
import { stringify } from './internal/utils';

export const createTestHandler = (h, mockedIOs = [], expectedRetValue, assertRet = false, constructor = createTestHandler) => {
  if (typeof h !== 'function') {
    throw new Error('Handler should be a function')
  }
  return {
    matchIo: (io, ret) => constructor(
      h,
      [...mockedIOs, [io, ret]],
      expectedRetValue,
      assertRet,
      constructor
    ),
    shouldReturn: (expected) => constructor(h, mockedIOs, expected, true, constructor),
    run: () => {
      // run handler using a custom runner to get a retValue
      let mockIndex = 0;
      const retValue = h.run((io) => {
        if (!mockedIOs[mockIndex]) {
          throw new BypassHandlerError('Too much io ran');
        }
        const [expectedIO, mockedRetValue] = mockedIOs[mockIndex];
        if (!isEqual(io.f, expectedIO.f)) {
          throw new BypassHandlerError(`Invalid IO#${mockIndex} function`);
        }
        if (!isEqual(io.args, expectedIO.args)) {
          const expectedArgs = stringify(expectedIO.args);
          const ioArgs = stringify(io.args);
          throw new BypassHandlerError(`Invalid IO#${mockIndex} function arguments: expected \n${expectedArgs}\nbut got \n${ioArgs}`);
        }
        mockIndex += 1;
        if (mockedRetValue instanceof SimulatedThrow) {
          throw mockedRetValue.e;
        }
        return mockedRetValue;
      });

      if (mockIndex < mockedIOs.length) {
        throw new Error('Not enough io ran');
      }

      if (assertRet && !isEqual(expectedRetValue, retValue)) {
        throw new Error(`Invalid returned value : expected ${expectedRetValue} but got ${retValue}`)
      }
    }
  }
}

export default handler => createTestHandler(handler)
