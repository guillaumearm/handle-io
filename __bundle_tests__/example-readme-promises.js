import sinon from 'sinon';
import expect from 'expect.js';
import { test, describe } from 'async-describe';

module.exports = ({ io, handler, testHandler }) => (
  describe('[README.md] Promises support', async () => {
    // here, setTimeout from example is replaced by a spy
    const fakeSetTimeout = sinon.spy();

    // async io
    const sleep = io((ms) => new Promise(resolve => {
      fakeSetTimeout(ms);
      resolve();
    }));

    // create an async combination
    const sleepSecond = handler(function*(s) {
      yield sleep(s * 1000);
      return s;
    });

    await test('runs sleep(1000)', async () => {
      fakeSetTimeout.resetHistory()
      await sleep(1000).run()
      expect(fakeSetTimeout.calledWithExactly(1000)).to.be.ok();
    })

    await test('runs sleepSecond(2) gives no error', async () => {
      fakeSetTimeout.resetHistory()
      await sleepSecond(2).run();
      expect(fakeSetTimeout.calledWithExactly(2000)).to.be.ok();
    })

    await test('logs sleep 42 seconds', () => {
      testHandler(sleepSecond(42))
        .matchIo(sleep(42000))
        .shouldReturn(42)
        .run()
    })
  })
)
