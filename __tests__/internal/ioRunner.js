import * as RA from 'ramda-adjunct';
import ioRunner from '../../src/internal/ioRunner';

describe('handle-io/internal/ioRunner', () => {
  describe('run RA.list function', () => {
    const run = (...args) => ioRunner({ f: RA.list, args });
    test('with 1 argument', () => {
      expect(run(1)).toEqual([1]);
    });
    test('with 2 argument', () => {
      expect(run(1, 2)).toEqual([1, 2]);
    });
    test('with 3 argument', () => {
      expect(run(1, 2, 3)).toEqual([1, 2, 3]);
    });
  });
});
