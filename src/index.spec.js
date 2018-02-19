const { io, handler, testHandler } = require('./index');

describe('handle-io', () => {
  describe('api', () => {
    test('io is a function', () => {
      expect(typeof io).toBe('function');
    });
    test('handler is a function', () => {
      expect(typeof handler).toBe('function');
    });
    test('testHandler is a function', () => {
      expect(typeof testHandler).toBe('function');
    });
  });
});
