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
});
