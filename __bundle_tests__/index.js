import { resolve, join } from 'path';
import { describe, test } from 'async-describe';
import rimraf from 'rimraf-promise';
import * as rollup from 'rollup';

import rollupConfigs from '../rollup.config.js';


const testSuites = [
  require('./api'),
  require('./errors'),
  require('./example-readme-logtwice'),
  require('./example-readme-addvalues'),
];

const bundlePrefix = 'bundle-'
const tmpFolder = resolve(__dirname, 'tmp');

const runTestSuites = async (handleIoApi) => {
  for (const testSuite of testSuites) {
    await testSuite(handleIoApi);
  }
}

const buildModule = async ({ output, ...input }) => {
  const bundle = await rollup.rollup(input);
  return bundle.write({
    ...output,
    file: join(tmpFolder, `${bundlePrefix}${output.format}.js`),
  });
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
    await runTestSuites(require(`${tmpFolder}/${bundlePrefix}cjs.js`));
  });

  await describe('es module', async () => {
    await runTestSuites(require(`${tmpFolder}/${bundlePrefix}es.js`));
  });

  await describe('umd module', async () => {
    await runTestSuites(require(`${tmpFolder}/${bundlePrefix}umd.js`));
  });

  await describe('clean', async () => {
    await test(`remove ${tmpFolder} folder`, async () => {
      await rimraf(tmpFolder);
    })
  });
});
