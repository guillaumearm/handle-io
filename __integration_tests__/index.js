import { pipe, ap, when, of } from 'ramda';
import { isNotArray } from 'ramda-adjunct';

const ensureArray = when(isNotArray, of);

const testHandleIo = pipe(
  ensureArray,
  ap([
    require('./api'),
  ]),
);

describe('integration', () => {
  describe('commonjs', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('../lib/handle-io.js'));
  });

  describe('es module', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('../es/handle-io.js'));
  });

  describe('umd module', () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('../dist/handle-io.js'));
  });
});
