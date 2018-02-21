const testHandleIoApi = (handleApi) => {
  test('should expose handle-io api', () => {
    const { io, handler, testHandler } = handleApi;
    expect(typeof io).toBe('function');
    expect(typeof handler).toBe('function');
    expect(typeof testHandler).toBe('function');
    expect(Object.keys(handleApi)).toEqual(['io', 'handler', 'testHandler']);
  });
}

describe('packages', () => {
  describe('commonjs', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIoApi(require('../lib/handle-io.js'));
  });

  describe('es module', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIoApi(require('../es/handle-io.js'));
  });

  describe('umd module', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIoApi(require('../dist/handle-io.js'));
  });
});
