import { stringify } from '../../src/internal/utils';

describe('handle-io/internal/utils', () => {
  describe('stringify', () => {
    test('JSON.stringify with padding 2', () => {
      const obj = { a: true, b: true, c: ['d', 'e', 'f'] };
      expect(stringify(obj)).toMatchSnapshot();
    });
  });
});
