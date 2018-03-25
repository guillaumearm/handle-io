import { both, pipe, equals, where, keys, length } from 'ramda';
import { isFunction } from 'ramda-adjunct';

import SimulatedThrow from '../src/internal/SimulatedThrow';
import testHandler from '../src/testHandler';


const isTestHandlerApi = both(
  pipe(keys, length, equals(3)),
  where({
    run: isFunction,
    matchIo: isFunction,
    shouldReturn: isFunction
  })
);

expect.extend({
  toBeTestHandlerApi(received) {
    const pass = isTestHandlerApi(received);
    if (pass) {
      return {
        pass,
        message: () => `expected ${received} not to be a valid testHandler api`,
      };
    }
    return {
      pass,
      message: () => `expected ${received} to be a valid testHandler api`,
    };
  }
});

const createFakeHandler = run => {
  const fakeHandler = () => {};
  fakeHandler.run = run;
  return fakeHandler;
}

describe('handle-io/testHandler', () => {
  describe('testHandler api', () => {
    test('testHandler is a function', () => {
      expect(typeof testHandler).toBe('function');
    });

    test('testHandler function is not a testHandler api', () => {
      expect(testHandler).not.toBeTestHandlerApi();
    });

    describe('testHandler constructed with something other than function', () => {
      test('throws an Error', () => {
        const throwMsg = 'should be a function';
        expect(() => testHandler()).toThrow(throwMsg)
        expect(() => testHandler(null)).toThrow(throwMsg)
        expect(() => testHandler(true)).toThrow(throwMsg)
        expect(() => testHandler(false)).toThrow(throwMsg)
        expect(() => testHandler(42)).toThrow(throwMsg)
        expect(() => testHandler({})).toThrow(throwMsg)
        expect(() => testHandler([])).toThrow(throwMsg)
        expect(() => testHandler('')).toThrow(throwMsg)
        expect(() => testHandler(new Error())).toThrow(throwMsg)
        expect(() => testHandler(new Object())).toThrow(throwMsg)
        expect(() => testHandler(new Array())).toThrow(throwMsg)
        expect(() => testHandler(Promise.resolve(42))).toThrow(throwMsg)
      })
    });

    describe('testHandler constructed with a function', () => {
      const dummyTestHandler = testHandler(() => {});
      test('returns a valid testHandler api', () => {
        expect(dummyTestHandler).toBeTestHandlerApi();
      });

      describe('.matchIo()', () => {
        test('returns a valid testHandler api', () => {
          expect(dummyTestHandler.matchIo()).toBeTestHandlerApi();
        });
        test('chained returns a valid testHandler api', () => {
          expect(dummyTestHandler.matchIo().matchIo().matchIo()).toBeTestHandlerApi();
        });
      });

      describe('.shouldReturn()', () => {
        test('returns a valid testHandler api', () => {
          expect(dummyTestHandler.shouldReturn()).toBeTestHandlerApi();
        });
        test('chained returns a valid testHandler api', () => {
          expect(dummyTestHandler.shouldReturn().shouldReturn().shouldReturn()).toBeTestHandlerApi();
        });
      });

      describe('mixed .matchIo() and .shouldReturn()', () => {
        test('returns a valid testHandler api', () => {
          expect(
            dummyTestHandler.matchIo().shouldReturn().matchIo().shouldReturn()
          ).toBeTestHandlerApi();
        });
      });
    });
  });

  describe('testHandler .run() method', () => {
    const f1 = () => {};
    const f2 = () => {};
    const args1 = [1, 2, 3];
    const args2 = [4, 5, 6];
    const fakeHandler = createFakeHandler((runner) => {
      try {
        expect(runner({ f: f1, args: args1 })).toBe('a');
      } catch (e) {
        expect(e).toBe('error');
      }
      expect(runner({ f: f1, args: args2 })).toBe('b');
      expect(runner({ f: f2, args: args1 })).toBe('c');
      expect(runner({ f: f2, args: args2 })).toBe('d');
      return 42;
    });

    test('no errors', () => {
      testHandler(fakeHandler)
        .shouldReturn(42)
        .matchIo({ f: f1, args: args1 }, 'a')
        .matchIo({ f: f1, args: args2 }, 'b')
        .matchIo({ f: f2, args: args1 }, 'c')
        .matchIo({ f: f2, args: args2 }, 'd')
        .run()
    });

    test('with SimulatedThrow (catched)', () => {
      testHandler(fakeHandler)
        .shouldReturn(42)
        .matchIo({ f: f1, args: args1 }, new SimulatedThrow('error'))
        .matchIo({ f: f1, args: args2 }, 'b')
        .matchIo({ f: f2, args: args1 }, 'c')
        .matchIo({ f: f2, args: args2 }, 'd')
        .run()
    });

    test('with SimulatedThrow (not catched)', () => {
      expect(() =>
        testHandler(fakeHandler)
          .matchIo({ f: f1, args: args1 }, 'a')
          .matchIo({ f: f1, args: args2 }, 'b')
          .matchIo({ f: f2, args: args1 }, 'c')
          .matchIo({ f: f2, args: args2 }, new SimulatedThrow('error'))
          .run()
      ).toThrow('error');
    });

    test('too much io ran', () => {
      expect(() => testHandler(fakeHandler)
        .shouldReturn(42)
        .matchIo({ f: f1, args: args1 }, 'a')
        .matchIo({ f: f1, args: args2 }, 'b')
        .matchIo({ f: f2, args: args1 }, 'c')
        .run()
      ).toThrow('Too much runned io');
    });

    test('not enough io ran', () => {
      expect(() => testHandler(fakeHandler)
        .shouldReturn(42)
        .matchIo({ f: f1, args: args1 }, 'a')
        .matchIo({ f: f1, args: args2 }, 'b')
        .matchIo({ f: f2, args: args1 }, 'c')
        .matchIo({ f: f2, args: args2 }, 'd')
        .matchIo({ f: () => {}, args: [] }, 'x')
        .run()
      ).toThrow('Not enough runned io');
    });

    test('invalid io function', () => {
      expect(() => testHandler(fakeHandler)
        .shouldReturn(42)
        .matchIo({ f: f1, args: args1 }, 'a')
        .matchIo({ f: () => {}, args: args2 }, 'b')
        .matchIo({ f: f2, args: args1 }, 'c')
        .matchIo({ f: f2, args: args2 }, 'd')
        .run()
      ).toThrow('Invalid IO#1 function');
    });

    test('invalid io function arguments', () => {
      expect(() => testHandler(fakeHandler)
        .shouldReturn(42)
        .matchIo({ f: f1, args: args1 }, 'a')
        .matchIo({ f: f1, args: args2 }, 'b')
        .matchIo({ f: f2, args: args1 }, 'c')
        .matchIo({ f: f2, args: [] }, 'd')
        .run()
      ).toThrow('Invalid IO#3 function arguments');
    });

    test('invalid returned value', () => {
      expect(() => testHandler(fakeHandler)
        .shouldReturn(21)
        .matchIo({ f: f1, args: args1 }, 'a')
        .matchIo({ f: f1, args: args2 }, 'b')
        .matchIo({ f: f2, args: args1 }, 'c')
        .matchIo({ f: f2, args: args2 }, 'd')
        .run()
      ).toThrow('expected 21 but got 42');
    });
  });
});
