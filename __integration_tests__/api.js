module.exports = (handleIo) => {
  test('should expose valid handle-io api', () => {
    expect(handleIo).toMatchSnapshot();
  });
}
