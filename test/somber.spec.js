import * as somberExports from '../src/somber.js';
import somber from '../src/somber.defaults.js';

describe('somber', () => {
  it('should export element class', () => {
    assert.exists(somberExports.SomberElement);
  });

  it('should export somber object', () => {
    expect(somberExports.default).to.exist;
    expect(somberExports.default).to.equal(somber);
  });
});
