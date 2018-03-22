import { always, identity } from 'ramda';
import { list } from 'ramda-adjunct';
import io from '../src/io';

describe('handle-io/io', () => {
  describe('io constructor', () => {
    test('io is a function', () => {
      expect(typeof io).toBe('function');
    });
    test('call io return a function', () => {
      expect(typeof io()).toBe('function');
    });
  });

  describe('io instances', () => {
    const identityIo = io(identity);

    describe('non-applied', () => {
      test('identityIo is a function', () => {
        expect(typeof identityIo).toBe('function');
      });
      test('identityIo has "run" method', () => {
        expect(typeof identityIo.run).toBe('function');
      })
      test('identityIo has "f" equals to identity', () => {
        expect(identityIo.f).toBe(identity);
      })
      test('identityIo has "args" equals to empty array', () => {
        expect(identityIo.args).toEqual([]);
      })
    });

    describe('applied once', () => {
      describe('single argument', () => {
        const get42 = io(identity)(42);

        test('get42 is a function', () => {
          expect(typeof get42).toBe('function');
        });
        test('get42 has "f" equals to identity', () => {
          expect(get42.f).toBe(identity);
        })
        test('get42 has "args" equals to [42]', () => {
          expect(get42.args).toEqual([42]);
        })
        test('get42.run() returns 42', () => {
          expect(get42.run()).toBe(42);
        })
      });

      describe('three arguments', () => {
        const get123 = io(list)(1, 2, 3);

        test('get123 is a function', () => {
          expect(typeof get123).toBe('function');
        });
        test('get123 has "f" equals to list', () => {
          expect(get123.f).toBe(list);
        });
        test('get123 has "args" equals to [1, 2, 3]', () => {
          expect(get123.args).toEqual([1, 2, 3]);
        });
        test('get123.run() returns [1, 2, 3]', () => {
          expect(get123.run()).toEqual([1, 2, 3]);
        });
      });
    });

    describe('several times applied', () => {
      describe('single argument', () => {
        const get42 = io(identity)(0)(21)(42);

        test('get42 is a function', () => {
          expect(typeof get42).toBe('function');
        });
        test('get42 has "f" equals to identity', () => {
          expect(get42.f).toBe(identity);
        });
        test('get42 has "args" equals to [42]', () => {
          expect(get42.args).toEqual([42]);
        });
        test('get42.run() returns 42', () => {
          expect(get42.run()).toBe(42);
        });
      });

      describe('three arguments', () => {
        const get123 = io(list)(0)(42)(1, 2, 3);

        test('get123 is a function', () => {
          expect(typeof get123).toBe('function');
        });
        test('get123 has "f" equals to list', () => {
          expect(get123.f).toBe(list);
        });
        test('get123 has "args" equals to [1, 2, 3]', () => {
          expect(get123.args).toEqual([1, 2, 3]);
        });
        test('get123.run() returns [1, 2, 3]', () => {
          expect(get123.run()).toEqual([1, 2, 3]);
        });
      });
    });
  });

  describe('custom runners', () => {
    const get0 = io(identity)(0);
    test('.run() method can take a custom runner', () => {
      expect(get0.run(always(42))).toEqual(42);
    })
    test('the instance io is passed to the runner', () => {
      get0.run(ioInstance => {
        expect(ioInstance).toBe(get0);
      })
    })
  });
});
