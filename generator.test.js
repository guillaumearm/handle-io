describe('generator test', () => {
  test('es6 generators functions should work', () => {
    const gen = function*(){
      return yield 42;
    }
    expect(gen().next()).toEqual({ value: 42, done: false });
  })
});
