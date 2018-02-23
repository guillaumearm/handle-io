import sinon from 'sinon';
import expect from 'expect.js';
import { test, describe } from 'async-describe';

module.exports = ({ io, handler, testHandler }) => (
  describe('[README.md] logTwice example', async () => {
    // here, console.log from example is replaced by a spy
    const consoleLog = sinon.spy();
    const log = io(consoleLog);

    const logTwice = handler(function*(...args) {
      yield log(...args);
      yield log(...args);
    });

    await test('runs log("Hello World")', () => {
      consoleLog.resetHistory()
      log('Hello World').run()
      expect(consoleLog.calledWithExactly('Hello World')).to.be.ok();
    })

    await test('runs logTwice(42) gives no error', () => {
      consoleLog.resetHistory()
      logTwice(42).run();
      expect(consoleLog.getCall(0).calledWithExactly(42)).to.be.ok();
      expect(consoleLog.getCall(1).calledWithExactly(42)).to.be.ok();
    })

    await test('logs hello world twice', () => {
      testHandler(logTwice('hello world'))
        .matchIo(log('hello world'))
        .matchIo(log('hello world'))
        .run()
    })
  })
)
