import expect from 'expect.js';
import { test, describe } from 'async-describe';

module.exports = ({ io, handler }) => (
  describe('[README.md] Deal with errors', async () => {
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
  })
)
