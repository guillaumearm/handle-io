import expect from 'expect.js';
import { test } from 'async-describe';

module.exports = (handleIo) => (
  test('exposes handle-io api', () => {
    expect(handleIo).to.only.have.keys(['io', 'handler', 'testHandler']);
    expect(handleIo.io).to.be.a('function');
    expect(handleIo.handler).to.be.a('function');
    expect(handleIo.testHandler).to.be.a('function');
  })
)
