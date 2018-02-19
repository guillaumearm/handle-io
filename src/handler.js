const { ioRunner } = require('./internal/runners');

const createHandler = (ioGen, args) => {
  const handlerObject = (...args) => createHandler(ioGen, args)
  if (args) {
    handlerObject.run = (runner = ioRunner) => {
      const gen = ioGen(...args)
      let genResult = gen.next()
      while (!genResult.done) {
        const { value: io } = genResult
        genResult = gen.next(io.run(runner))
      }
      return genResult.value
    }
  }
  return handlerObject
}

module.exports = (ioGen) => createHandler(ioGen)
