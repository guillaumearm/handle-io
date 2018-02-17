const isEqual = require('lodash.isequal');
const { createTestRunner } = require('./internal/runners');

const createTestHandler = (h, mockedFxs = [], expectedRetValue, assertRet = false) => {
  return {
    matchFx: (fx, ret) => createTestHandler(
      h,
      [...mockedFxs, [fx, ret]],
      expectedRetValue,
      assertRet
    ),
    shouldReturn: (expected) => createTestHandler(h, mockedFxs, expected, true),
    run: () => {
      // 1. should be a handler
      if (typeof h !== 'function') {
        throw new Error('Handler should be a function')
      }

      // 2. run handler using testRunner to get a retValue
      const retValue = h.run(createTestRunner(mockedFxs))

      // 3. expectedRetValue and retValue should be equal
      if (assertRet && !isEqual(expectedRetValue, retValue)) {
        throw new Error(`Invalid returned value : expected ${expectedRetValue} but got ${retValue}`)
      }
    }
  }
}

module.exports = handler => createTestHandler(handler)
