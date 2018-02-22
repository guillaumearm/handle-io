module.exports = (handleIo) => {
  test('should expose handle-io api', () => {
    const { io, handler, testHandler } = handleIo;
    expect(typeof io).toBe('function');
    expect(typeof handler).toBe('function');
    expect(typeof testHandler).toBe('function');
    expect(Object.keys(handleIo)).toEqual(['io', 'handler', 'testHandler']);
  });
}
