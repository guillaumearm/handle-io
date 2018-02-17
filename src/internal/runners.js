const isEqual = require('lodash.isequal');
const { stringify } = require('./utils')

const createTestRunner = (mockedFxs = []) => {
  let mockIndex = 0;
  return fx => {
    if (!mockedFxs[mockIndex]) {
      throw new Error('Mocked fxs should be exhaustive')
    }
    const [expectedFx, mockedRetValue] = mockedFxs[mockIndex];
    if (!isEqual(fx.f, expectedFx.f)) {
      throw new Error(`Invalid fx#${mockIndex} function`)
    }
    if (!isEqual(fx.args, expectedFx.args)) {
      const expectedArgs = stringify(expectedFx.args);
      const fxArgs = stringify(fx.args);
      throw new Error(`Invalid fx#${mockIndex} function arguments: expected \n${expectedArgs}\nbut got \n${fxArgs}`)
    }
    mockIndex += 1;
    return mockedRetValue;
  }
};

const fxRunner = ({ f, args }) => f(...args);

module.exports = {
  fxRunner,
  createTestRunner,
}
