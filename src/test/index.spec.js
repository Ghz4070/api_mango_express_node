const forgotPassword = () => {
  return true;
};

describe('forgotPassword()', () => {
  it('should return true', () => {
    //Testing a boolean
    expect(forgotPassword()).toBeTruthy();
    //Another way to test a boolean
    expect(forgotPassword()).toEqual(true);
  });
});
