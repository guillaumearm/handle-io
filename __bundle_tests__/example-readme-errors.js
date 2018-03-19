import sinon from 'sinon';
import expect from 'expect.js';
import { test, describe } from 'async-describe';

module.exports = ({ io, handler, testHandler, catchError }) => (
  describe('[README.md] Deal with errors', async () => {
    await describe('try/catch', async () => {
      const handlerError = handler(function*() {
        throw '1';
      });

      // Synchronous IO
      const syncIoError = io(() => { throw '2' });

      // Asynchronous IO
      const asyncIoError = io(() => Promise.reject('3'));

      const catchError = handler(function*(yieldable) {
        try {
          yield yieldable
        } catch (e) {
          return e;
        }
      });

      await test('catch handler errors', () => {
        expect(catchError(handlerError()).run()).to.be('1');
      })

      await test('catch synchronous io errors', () => {
        expect(catchError(syncIoError()).run()).to.be('2');
      })

      await test('catch asynchronous io errors', async () => {
        const result = await catchError(asyncIoError()).run();
        expect(result).to.be('3');
      })
    });

    await describe('catchError', async () => {
      const consoleLog = sinon.spy();
      const log = io(consoleLog);
      const ioError = io(() => { throw 'error' });

      const myHandler = handler(function*() {
        const [res, err] = yield catchError(ioError());
        if (err) {
          yield log(err)
        }
        return res;
      })

      await test('test myHandler without error', () => {
        testHandler(myHandler())
          .matchIo(ioError(), 42)
          .shouldReturn(42)
          .run()
      });

      await test('run myHandler', async () => {
        consoleLog.resetHistory()
        myHandler().run();
        expect(consoleLog.calledWithExactly('error')).to.be.ok();
      });
    });
  })
)
