/* eslint-disable no-console */

import expect from 'expect.js';
import { test, describe } from 'async-describe';

module.exports = ({ io, handler, testHandler, createTestHandler }) => (
  describe('[README.md] Custom testHandler example', async () => {
    const log = io(console.log);

    const createCustomTestHandler = (h, mockedIOs = [], expectedRetValue, assertRet = false, constructor = createCustomTestHandler) => {
      return {
        ...createTestHandler(h, mockedIOs, expectedRetValue, assertRet, constructor),
        matchLog: (arg, ret) => constructor(
          h,
          [...mockedIOs, [io(console.log)(arg), ret]],
          expectedRetValue,
          assertRet,
          constructor,
        ),
      };
    };
    const customTestHandler = h => createCustomTestHandler(h);

    const myHandler = handler(function*(value) {
      yield log(value);
      yield log(value);
      return 42;
    });

    await describe('whith testHandler', async () => {
      await test('logs "hello world" twice and return 42', () => {
        testHandler(myHandler('hello world'))
          .matchIo(log('hello world'))
          .matchIo(log('hello world'))
          .shouldReturn(42)
          .run()
      });
    });

    await describe('with customTestHandler (success)', async () => {
      await test('logs "hello world" twice and return 42', async () => {
        customTestHandler(myHandler('hello world'))
          .matchLog('hello world')
          .matchLog('hello world')
          .shouldReturn(42)
          .run();

        customTestHandler(myHandler('hello world'))
          .shouldReturn(42)
          .matchLog('hello world')
          .matchIo(log('hello world'))
          .run();

        customTestHandler(myHandler('hello world'))
          .shouldReturn(42)
          .matchIo(log('hello world'))
          .matchLog('hello world')
          .run();
      });
    });

    await describe('with customTestHandler (failure)', async () => {
      await test('throws an error when arguments are invalid', async () => {
        expect(() => {
          customTestHandler(myHandler('hello world'))
            .matchLog('hello world 1')
            .matchLog('hello world')
            .shouldReturn(42)
            .run();
        }).to.throwError('Invalid IO#0 function arguments')
        expect(() => {
          customTestHandler(myHandler('hello world'))
            .matchLog('hello world')
            .matchLog('hello world 2')
            .shouldReturn(42)
            .run();
        }).to.throwError('Invalid IO#1 function arguments')
      });

      await test('throws an error when io functions are wrong', async () => {
        expect(() => {
          customTestHandler(myHandler('hello world'))
            .matchIo(io(() => {})('hello world'))
            .matchLog('hello world')
            .shouldReturn(42)
            .run();
        }).to.throwError('Invalid IO#0 function');
        expect(() => {
          customTestHandler(myHandler('hello world'))
            .matchLog('hello world')
            .matchIo(io(() => {})('hello world'))
            .shouldReturn(42)
            .run();
        }).to.throwError('Invalid IO#1 function');
      });

      await test('throws an error when returned value is wrong', async () => {
        expect(() => {
          customTestHandler(myHandler('hello world'))
            .matchLog('hello world')
            .matchLog('hello world')
            .shouldReturn(0)
            .run();
        }).to.throwError('Invalid returned value');
      });

      await test('throws an error when too much io ran', async () => {
        expect(() => {
          customTestHandler(myHandler('hello world'))
            .matchLog('hello world')
            .shouldReturn(42)
            .run();
        }).to.throwError('Too much io ran');
      });

      await test('throws an error when not enough io ran', async () => {
        expect(() => {
          customTestHandler(myHandler('hello world'))
            .matchLog('hello world')
            .matchLog('hello world')
            .matchLog('hello world')
            .shouldReturn(42)
            .run();
        }).to.throwError('Not enough io ran');
      });
    });
  })
)
