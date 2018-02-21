import ioRunner from './internal/ioRunner';

const createIo = (f, args) => {
  const ioObject = (...args) => createIo(f, args)
  ioObject.f = f;
  ioObject.args = args;
  if (args) {
    ioObject.run = (runner = ioRunner) => {
      return runner(ioObject)
    }
  }
  return ioObject;
}

export default (f) => createIo(f, null);
