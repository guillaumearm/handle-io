const { fx, handler, testHandler } = require('./index');

describe('fx-handler', () => {
  describe('api', () => {
    test('fx is a function', () => {
      expect(typeof fx).toBe('function');
    });
    test('handler is a function', () => {
      expect(typeof handler).toBe('function');
    });
    test('testHandler is a function', () => {
      expect(typeof testHandler).toBe('function');
    });
  });
});
