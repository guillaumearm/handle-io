import ioRunner from './internal/ioRunner';
import BypassHandlerError from './internal/BypassHandlerError';

const noopGen = function*() {}

const runHandler = (runner, gen, genResult) => {
  if (genResult.done) {
    return genResult.value
  }
  const runNextHandler = result => runHandler(runner, gen, result);
  try {
    const { value: io } = genResult;
    const nextValue = io.run(runner);
    if (nextValue instanceof Promise) {
      return nextValue
        .then(value => runNextHandler(gen.next(value)))
        .catch(e => runNextHandler(gen.throw(e)))
    } else {
      return runNextHandler(gen.next(nextValue))
    }
  } catch (e) {
    if (e instanceof BypassHandlerError) {
      throw e
    }
    return runNextHandler(gen.throw(e));
  }
}

const createHandler = (ioGen = noopGen, args) => {
  const handlerObject = (...args) => createHandler(ioGen, args)
  if (args) {
    handlerObject.run = (runner = ioRunner) => {
      const gen = ioGen(...args)
      return runHandler(runner, gen, gen.next());
    }
  }
  return handlerObject
}

export default (ioGen) => createHandler(ioGen)
