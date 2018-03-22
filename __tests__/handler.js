import { applyTo, identity, inc } from 'ramda';
import BypassHandlerError from '../src/internal/BypassHandlerError';
import handler from '../src/handler';

describe('handle-io/handler', () => {
  describe('handler constructor', () => {
    test('handler is a function', () => {
      expect(typeof handler).toBe('function');
    });
    test('call handler return a function', () => {
      expect(typeof handler()).toBe('function');
    });
  });

  describe('handler instances', () => {
    describe('synchronous', () => {
      describe('default handler (noop)', () => {
        const defaultHandler = handler();
        test('is a function', () => {
          expect(typeof defaultHandler).toBe('function');
        });
        test('has "run" method', () => {
          expect(typeof defaultHandler.run).toBe('function');
        })
        test('calls run returns undefined', () => {
          expect(defaultHandler().run()).toBe(undefined);
        })
        test('calls run returns undefined when applied several times', () => {
          expect(defaultHandler()()().run()).toBe(undefined);
        })
      });

      describe('handler that takes several arguments and returns a value', () => {
        const listHandler = handler(function*(...args) {
          return args;
        });
        test('is a function', () => {
          expect(typeof listHandler).toBe('function');
        });
        test('has "run" method', () => {
          expect(typeof listHandler.run).toBe('function');
        })
        test('calls run returns [1, 2, 3]', () => {
          expect(listHandler(1, 2, 3).run()).toEqual([1, 2, 3]);
        })
        test('calls run returns [1, 2, 3] when applied several times', () => {
          expect(listHandler(0)(42)(1, 2, 3).run()).toEqual([1, 2, 3]);
        })
      });

      describe('handler with custom runner', () => {
        const mockedHandler = handler(function* (arg) {
          const a = yield { run: applyTo(arg) };
          const b = yield { run: applyTo(a) };
          const c = yield { run: applyTo(b) };
          return [arg, a, b ,c];
        });
        test('mockedHandler(42) returns [42, 43, 44, 45]', () => {
          expect(mockedHandler(42).run(inc)).toEqual([42, 43, 44, 45]);
        });
        test('mockedHandler(42) runs the runner 3 times', () => {
          const runner = jest.fn(inc);
          mockedHandler(42).run(runner);
          expect(runner.mock.calls).toHaveLength(3);
          expect(runner.mock.calls).toEqual([[42], [43], [44]])
        });
      });

      describe('handler with default runner', () => {
        const createMockedHandler = f => handler(function* (arg) {
          const a = yield { run: applyTo({ f, args: [arg] }) };
          const b = yield { run: applyTo({ f, args: [a] }) };
          const c = yield { run: applyTo({ f, args: [b] }) };
          return [arg, a, b ,c];
        });

        test('mockedHandler(42) returns [42, 43, 44, 45]', () => {
          const mockedHandler = createMockedHandler(inc);
          expect(mockedHandler(42).run()).toEqual([42, 43, 44, 45]);
        });

        test('mockedHandler(42) runs the runner 3 times', () => {
          const runner = jest.fn(inc);
          const mockedHandler = createMockedHandler(runner);
          mockedHandler(42).run();
          expect(runner.mock.calls).toHaveLength(3);
          expect(runner.mock.calls).toEqual([[42], [43], [44]])
        });
      });

      describe('nested handlers (with custom runner)', () => {
        const simpleHandler = handler(function* (arg) {
          const a = yield { run: applyTo(arg) };
          const b = yield { run: applyTo(arg) };
          return [a, b];
        });
        const composedHandler = handler(function* (arg) {
          const [a, b] = yield simpleHandler(arg);
          const [c, d] = yield simpleHandler(arg);
          return [a, b, c, d];
        });
        test('composedHandler(42) returns [42, 42, 42, 42]', () => {
          expect(composedHandler(42).run(identity)).toEqual([42, 42, 42, 42]);
        });
        test('composedHandler(42) runs the runner 4 times', () => {
          const runner = jest.fn(identity);
          composedHandler(42).run(runner);
          expect(runner.mock.calls).toHaveLength(4);
          expect(runner.mock.calls).toEqual([[42], [42], [42], [42]])
        });
      });

      describe('handler that throws Error', () => {
        const handlerWithError = handler(function* () {
          throw new Error('[error]');
        })
        test('throws an error', () => {
          expect(handlerWithError().run).toThrow('[error]');
        })
      });

      describe('nested handler that throws Error', () => {
        const handlerWithError = handler(function* () {
          yield handler(function* () {
            throw new Error('[error]');
          })()
        })
        test('throws an error', () => {
          expect(handlerWithError().run).toThrow('[error]');
        })
      });

      describe('nested handler that throws Error (catched)', () => {
        const handlerWithError = handler(function* () {
          try {
            yield handler(function* () {
              throw new Error('[error]');
            })()
          } catch (e) {
            return 'no error'
          }
        })
        test('throws an error', () => {
          expect(handlerWithError().run()).toBe('no error');
        })
      });

      describe('handler that throws BypassHandlerError', () => {
        const handlerWithError = handler(function* () {
          throw new BypassHandlerError('[error]');
        })
        test('throws an error', () => {
          expect(handlerWithError().run).toThrow('[error]');
        })
      });

      describe('nested handlers that throws BypassHandlerError', () => {
        const handleWithError = handler(function* () {
          yield handler(function* () {
            throw new BypassHandlerError('[error]');
          })()
        })
        test('throws an error', () => {
          expect(handleWithError().run).toThrow('[error]');
        })
      });

      describe('nested handlers that throws BypassHandlerError (cannot be catched)', () => {
        const handleWithError = handler(function* () {
          try {
            yield handler(function* () {
              throw new BypassHandlerError('[error]');
            })()
          } catch (e) {
            return 'no error'
          }
        })
        test('throws an error', () => {
          expect(handleWithError().run).toThrow('[error]');
        })
      });
    });

    describe('asynchronous handlers', () => {
      test('one async operation', async () => {
        const asyncHandler = handler(function*() {
          return yield { run: applyTo({ f: async x => x, args: [42] }) };
        });
        const result = await asyncHandler().run();
        expect(result).toBe(42);
      });

      test('several async operations', () => {
        const asyncHandler = handler(function*() {
          const a = yield { run: applyTo({ f: async x => x, args: [20] }) };
          const b = yield { run: applyTo({ f: async x => x, args: [20] }) };
          const c = yield { run: applyTo({ f: async x => x, args: [2] }) };
          return a + b + c
        });
        return expect(asyncHandler().run()).resolves.toBe(42);
      });

      test('mixed synchronous and asynchronous operations', () => {
        const asyncHandler = handler(function*() {
          const a = yield { run: applyTo({ f: async x => x, args: [10] }) };
          const b = yield { run: applyTo({ f: x => x, args: [10] }) };
          const c = yield { run: applyTo({ f: async x => x, args: [10] }) };
          const d = yield { run: applyTo({ f: x => x, args: [10] }) };
          const e = yield { run: applyTo({ f: async x => x, args: [2] }) };
          return a + b + c + d + e;
        });
        return expect(asyncHandler().run()).resolves.toBe(42);
      });

      test('mixed synchronous and asynchronous operations (nested)', () => {
        const asyncHandler = handler(function*() {
          return yield handler(function*() {
            const a = yield { run: applyTo({ f: async x => x, args: [10] }) };
            const b = yield { run: applyTo({ f: x => x, args: [10] }) };
            const c = yield { run: applyTo({ f: async x => x, args: [10] }) };
            const d = yield { run: applyTo({ f: x => x, args: [10] }) };
            const e = yield { run: applyTo({ f: async x => x, args: [2] }) };
            return a + b + c + d + e;
          })();
        });
        return expect(asyncHandler().run()).resolves.toBe(42);
      });

      test('rejected async operation', () => {
        const asyncHandler = handler(function*() {
          return yield { run: applyTo({ f: () => Promise.reject('rejected !'), args: [] }) }
        });
        return expect(asyncHandler().run()).rejects.toBe('rejected !')
      });

      test('rejected and catched async operation', () => {
        const asyncHandler = handler(function*() {
          let res, err;
          try {
            res = yield { run: applyTo({ f: () => Promise.reject('rejected !'), args: [] }) }
          } catch (e) {
            err = e
          }
          return [res, err];
        });
        return expect(asyncHandler().run()).resolves.toEqual([undefined, 'rejected !'])
      });

      test('rejected and catched async operation (nested)', () => {
        const asyncHandler = handler(function*() {
          return yield handler(function*() {
            let res, err;
            try {
              res = yield { run: applyTo({ f: () => Promise.reject('rejected !'), args: [] }) }
            } catch (e) {
              err = e
            }
            return [res, err];
          })();
        });
        return expect(asyncHandler().run()).resolves.toEqual([undefined, 'rejected !'])
      });
    });
  });
});
