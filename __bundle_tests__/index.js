import { describe, test } from 'async-describe';
import { resolve } from 'path';
import rimraf from 'rimraf-promise';
import * as rollup from 'rollup';
import { pipe, ap, when, of } from 'ramda';
import { isNotArray } from 'ramda-adjunct';
import rollupConfigs from '../rollup.config.js';

const tmpFolder = resolve(__dirname, 'tmp');
const removeTmpFolder = async () => rimraf(tmpFolder);

const ensureArray = when(isNotArray, of);

const testHandleIo = pipe(
  ensureArray,
  ap([
    require('./api'),
  ]),
);

const buildModule = async ({ output, ...input }) => {
  const bundle = await rollup.rollup(input);
  return bundle.write({ ...output, file: resolve(__dirname, 'tmp', `bundle-${output.format}.js`) });
}

describe('bundle integration tests', async () => {
  await describe('build', async () => {
    const [cjsConfig, esConfig, umdConfig] = rollupConfigs;
    await test('build cjs bundle', async () => {
      await buildModule(cjsConfig);
    });
    await test('build es bundle', async () => {
      await buildModule(esConfig);
    });
    await test('build umd bundle', async () => {
      await buildModule(umdConfig);
    });
  });
  await describe('commonjs module', async () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('./tmp/bundle-cjs.js'));
  });

  await describe('es module', async () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('./tmp/bundle-es.js'));
  });

  await describe('umd module', async () => {
    // eslint-disable-next-line node/no-missing-require
    testHandleIo(require('./tmp/bundle-umd.js'));
  });

  await describe('clean', async () => {
    await test('remove tmp folder', async () => {
      await removeTmpFolder();
    })
  });
});
