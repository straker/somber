import somber from '../src/somber.defaults.js';

describe('somber.defaults', () => {
  it('should add element class', () => {
    assert.exists(somber.SomberElement);
  });
});
