import expect from 'expect.js';
import { test } from 'async-describe';

module.exports = (handleIo) => (
  test('exposes handle-io api', () => {
    const api = ['io', 'handler', 'testHandler', 'catchError'];
    expect(handleIo).to.only.have.keys(api);

    api.forEach(f => {
      expect(handleIo[f]).to.be.a('function');
    })
  })
)
