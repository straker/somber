import somber from '../src/somber.defaults.js';

describe('somber.defaults', () => {
  it('should add api', () => {
    assert.exists(somber.SomberElement);
    assert.exists(somber.watch);
  });
});
