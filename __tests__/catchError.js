import { always } from 'ramda';
import catchError from '../src/catchError';

const isHandler = (h) => typeof h().run === 'function'

describe('handle-io/catchError', () => {
  describe('type', () => {
    test('catchError is a function', () => {
      expect(typeof catchError).toBe('function');
    });
    test('catchError return a handler', () => {
      expect(isHandler(catchError())).toBe(true);
    });
  });

  describe('when there is no error', () => {
    test('run handler return a result', () => {
      const h = catchError({ run: always(42) });
      const [res, err] = h().run();
      expect(res).toBe(42);
      expect(err).toBe(undefined);
    });
  });

  describe('when there is an error', () => {
    test('run handler return an error', () => {
      const h = catchError({ run: () => { throw new Error() } });
      const [res, err] = h().run();
      expect(res).toBe(undefined);
      expect(err).toBeInstanceOf(Error);
    });
  });
});
