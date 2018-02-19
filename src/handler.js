const { fxRunner } = require('./internal/runners');

const createHandler = (fxGen, args) => {
  const handlerObject = (...args) => createHandler(fxGen, args)
  if (args) {
    handlerObject.run = (runner = fxRunner) => {
      const gen = fxGen(...args)
      let genResult = gen.next()
      while (!genResult.done) {
        const { value: fx } = genResult
        genResult = gen.next(fx.run(runner))
      }
      return genResult.value
    }
  }
  return handlerObject
}

module.exports = (fxGen) => createHandler(fxGen)
