const { fxRunner } = require('./internal/runners');

const createFx = (f, args) => {
  const fxObject = (...args) => createFx(f, args)
  fxObject.f = f;
  fxObject.args = args;
  if (args) {
    fxObject.run = (runner = fxRunner) => {
      return runner(fxObject)
    }
  }
  return fxObject
}

module.exports = (f) => createFx(f, null);
