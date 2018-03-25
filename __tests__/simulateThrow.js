import SimulatedThrow from '../src/internal/SimulatedThrow';
import simulateThrow from '../src/simulateThrow';

describe('handle-io/simulateThrow', () => {
  describe('instanceof', () => {
    test('is instance of SimulatedThrow', () => {
      expect(simulateThrow()).toBeInstanceOf(SimulatedThrow);
    });

    test('access to original Error', () => {
      const e = {};
      expect(simulateThrow(e).e).toBe(e);
    });
  });
});
