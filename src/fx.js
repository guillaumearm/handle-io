const { fxRunner } = require('./internal/runners');

const createFx = (f, args) => {
  const fxObject = (...args) => createFx(f, args)
  fxObject.f = f;
  fxObject.args = args;
  fxObject.run = (runner = fxRunner) => {
    if (!args) {
      throw new Error('FX must be applied')
    }
    return runner(fxObject)
  }
  return fxObject
}

module.exports = (f) => createFx(f, null);
