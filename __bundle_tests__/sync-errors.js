import expect from 'expect.js';
import { test, describe } from 'async-describe';

module.exports = ({ io, handler, testHandler }) => (
  describe('synchronous errors', async () => {
    const isError = e => { expect(e).to.match(/\[error\]/) }
    const makeError = io(() => { throw new Error('[error]') });

    await describe('failed io', async () => {
      await test('run io', async () => {
        expect(makeError().run).to.throwError(isError);
      });
    });

    await describe('failed handler', async () => {
      const failedHandler = handler(function*() { throw new Error('[error]') });

      await test('run handler', async () => {
        expect(failedHandler().run).to.throwError(isError);
      });

      await test('run testHandler (failure)', async () => {
        expect(testHandler(failedHandler()).run).to.throwError(isError);
      });
    });

    await describe('failed handler (via failed io)', async () => {
      const failedHandler = handler(function*() {
        yield makeError();
        return 42;
      });

      await test('run handler', async () => {
        expect(failedHandler().run).to.throwError(isError);
      });

      await test('run testHandler (success)', async () => {
        testHandler(failedHandler())
          .matchIo(makeError())
          .shouldReturn(42)
          .run()
      });

      await test('run testHandler (failure)', async () => {
        expect(testHandler(failedHandler())
          .matchIo(makeError(1, 2, 3))
          .shouldReturn(42)
          .run
        ).to.throwError(e => {
          expect(e).to.match(/Invalid IO#0 function arguments/)
        })
      });
    });

    await describe('handler that catch failed io', async () => {
      const safeHandler = handler(function*() {
        try {
          yield makeError();
        } catch (e) {
          return 42;
        }
        return 'no error';
      });

      await test('run handler', async () => {
        expect(safeHandler().run()).to.be(42);
      });

      await test('run testHandler (success)', async () => {
        testHandler(safeHandler())
          .matchIo(makeError())
          .shouldReturn('no error')
          .run()
      });

      await test('run testHandler (failure)', async () => {
        expect(testHandler(safeHandler())
          .matchIo(makeError(1, 2, 3))
          .shouldReturn('no error')
          .run
        ).to.throwError(e => {
          expect(e).to.match(/Invalid IO#0 function arguments/)
        })
      });
    });

    await describe('failed handler (via other failed handler)', async () => {
      const failedHandler = handler(function*() {
        return yield (handler(function*() {
          yield makeError();
          return 42;
        }))();
      });

      await test('run handler', async () => {
        expect(failedHandler().run).to.throwError(isError);
      });

      await test('run testHandler (success)', async () => {
        testHandler(failedHandler())
          .matchIo(makeError())
          .shouldReturn(42)
          .run()
      });

      await test('run testHandler (failure)', async () => {
        expect(testHandler(failedHandler())
          .matchIo(makeError(1, 2, 3))
          .shouldReturn(42)
          .run
        ).to.throwError(e => {
          expect(e).to.match(/Invalid IO#0 function arguments/)
        })
      });
    });

    await describe('handler that catch another failed handler', async () => {
      const failedHandler = handler(function*() {
        return yield makeError();
      })
      const safeHandler = handler(function*() {
        try {
          yield failedHandler()
        } catch (e) {
          return 42;
        }
        return 'no error';
      });

      await test('run handler', async () => {
        expect(safeHandler().run()).to.be(42);
      });

      await test('run testHandler (success)', async () => {
        testHandler(safeHandler())
          .matchIo(makeError())
          .shouldReturn('no error')
          .run()
      });

      await test('run testHandler (failure)', async () => {
        expect(testHandler(safeHandler())
          .matchIo(makeError(1, 2, 3))
          .shouldReturn('no error')
          .run
        ).to.throwError(e => {
          expect(e).to.match(/Invalid IO#0 function arguments/)
        })
      });
    });
  })
)
