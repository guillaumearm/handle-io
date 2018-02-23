import expect from 'expect.js';
import { test, describe } from 'async-describe';

module.exports = ({ io, handler, testHandler }) => (
  describe('[README.md] addValues example', async () => {
    // here, process.env from example is replaced by a fake env
    const env = { VALUE1: 'Hello', VALUE2: 'World' };
    const getEnv = io(v => env[v]);

    const addValues = handler(function*() {
      const a = yield getEnv('VALUE1');
      const b = yield getEnv('VALUE2');
      return a + b;
    });

    await describe('runs getEnv io', async () => {
      await test('returns env.VALUE1 string', async () => {
        expect(getEnv('VALUE1').run()).to.be(env.VALUE1);
      });
      await test('returns env.VALUE2 string', async () => {
        expect(getEnv('VALUE2').run()).to.be(env.VALUE2);
      });
    });

    await describe('runs addValues handler', async () => {
      await test('returns env.VALUE1 + env.VALUE2', () => {
        expect(addValues().run()).to.be(env.VALUE1 + env.VALUE2);
      })
    });

    await describe('test addValues handler', async () => {
      await test('addValues() match IOs and returns env.VALUE1 + env.VALUE2', async () => {
        testHandler(addValues())
          .matchIo(getEnv('VALUE1'), env.VALUE1)
          .matchIo(getEnv('VALUE2'), env.VALUE2)
          .shouldReturn(env.VALUE1 + env.VALUE2)
          .run()
      });
    });
  })
)
