import BypassHandlerError from '../../src/internal/BypassHandlerError';

describe('handle-io/internal/BypassHandlerError', () => {
  describe('instanceof', () => {
    test('is instance of BypassHandlerError', () => {
      expect(new BypassHandlerError()).toBeInstanceOf(BypassHandlerError);
    });

    test('is not instance of Error', () => {
      expect(new BypassHandlerError()).not.toBeInstanceOf(Error);
    });

    test('access to original Error', () => {
      expect(new BypassHandlerError().e).toBeInstanceOf(Error);
    });
  });

  describe('properties', () => {
    test('have .message', () => {
      expect(new BypassHandlerError('message').message).toBe('message');
    });

    test('have .stack', () => {
      expect(typeof new BypassHandlerError().stack).toBe('string');
    });

    test('have .toString', () => {
      expect(typeof new BypassHandlerError().toString).toBe('function');
    });
  });

  describe('toString', () => {
    test('call .toString()', () => {
      expect(new BypassHandlerError('message').toString()).toBe('BypassHandlerError: message');
    });
  });
});
