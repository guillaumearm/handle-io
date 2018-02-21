import { applyTo, identity, inc } from 'ramda';
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
    describe('default handler (noop)', () => {
      const defaultHandler = handler();
      test('is a function', () => {
        expect(typeof defaultHandler).toBe('function');
      });
      test('has no "run" method', () => {
        expect(defaultHandler.run).toBe(undefined);
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
      test('has no "run" method', () => {
        expect(listHandler.run).toBe(undefined);
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
  });
});
