const testHandleApi = (handleApi) => {
  const { io, handler, testHandler } = handleApi;
  expect(typeof io).toBe('function');
  expect(typeof handler).toBe('function');
  expect(typeof testHandler).toBe('function');
  expect(Object.keys(handleApi)).toEqual(['io', 'handler', 'testHandler']);
}

describe('packages', () => {
  describe('commonjs', () => {
    test('should expose handle-io api', () => {
      // eslint-disable-next-line node/no-missing-require
      testHandleApi(require('../lib/handle-io.js'));
    })
  });

  describe('es module', () => {
    test('should expose handle-io api', () => {
      // eslint-disable-next-line node/no-missing-require
      testHandleApi(require('../es/handle-io.js'));
    })
  });

  describe('umd module', () => {
    test('should expose handle-io api', () => {
      // eslint-disable-next-line node/no-missing-require
      testHandleApi(require('../dist/handle-io.js'));
    })
  });
});
