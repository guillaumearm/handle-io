const testHandleIo = (handleIo) => {
  test('should expose handle-io api', () => {
    const { io, handler, testHandler } = handleIo;
    expect(typeof io).toBe('function');
    expect(typeof handler).toBe('function');
    expect(typeof testHandler).toBe('function');
    expect(Object.keys(handleIo)).toEqual(['io', 'handler', 'testHandler']);
  });
}

describe('integration', () => {
  describe('commonjs', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('../lib/handle-io.js'));
  });

  describe('es module', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('../es/handle-io.js'));
  });

  describe('umd module', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('../dist/handle-io.js'));
  });
});
