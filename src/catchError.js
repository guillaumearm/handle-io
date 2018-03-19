import handler from './handler';

const catchError = (yieldable) => handler(function*() {
  let res;
  let err;
  try {
    res = yield yieldable;
  } catch (e) {
    err = e;
  }
  return [res, err]
})();

export default catchError;
