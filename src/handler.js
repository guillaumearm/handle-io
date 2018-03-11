import ioRunner from './internal/ioRunner';
import BypassHandlerError from './internal/BypassHandlerError';

const noopGen = function*() {}

const createHandler = (ioGen = noopGen, args) => {
  const handlerObject = (...args) => createHandler(ioGen, args)
  if (args) {
    handlerObject.run = (runner = ioRunner) => {
      const gen = ioGen(...args)
      let genResult = gen.next()
      while (!genResult.done) {
        const { value: io } = genResult
        try {
          genResult = gen.next(io.run(runner))
        } catch (e) {
          if (e instanceof BypassHandlerError) {
            throw e
          }
          genResult = gen.throw(e)
        }
      }
      return genResult.value
    }
  }
  return handlerObject
}

export default (ioGen) => createHandler(ioGen)
