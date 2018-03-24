import expect from 'expect.js';
import { test } from 'async-describe';

import * as handleIoApi from '../src';

module.exports = (handleIo) => (
  test('exposes handle-io api', () => {
    const apiKeys = Object.keys(handleIoApi);
    expect(handleIo).to.only.have.keys(apiKeys);

    apiKeys.forEach(f => {
      expect(handleIo[f]).to.be.a('function');
    })
  })
)
