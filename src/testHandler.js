import isEqual from 'lodash.isequal';
import { createTestRunner } from './internal/runners';

const createTestHandler = (h, mockedIOs = [], expectedRetValue, assertRet = false) => {
  return {
    matchIo: (io, ret) => createTestHandler(
      h,
      [...mockedIOs, [io, ret]],
      expectedRetValue,
      assertRet
    ),
    shouldReturn: (expected) => createTestHandler(h, mockedIOs, expected, true),
    run: () => {
      // 1. should be a handler
      if (typeof h !== 'function') {
        throw new Error('Handler should be a function')
      }

      // 2. run handler using testRunner to get a retValue
      const retValue = h.run(createTestRunner(mockedIOs))

      // 3. expectedRetValue and retValue should be equal
      if (assertRet && !isEqual(expectedRetValue, retValue)) {
        throw new Error(`Invalid returned value : expected ${expectedRetValue} but got ${retValue}`)
      }
    }
  }
}

export default handler => createTestHandler(handler)
