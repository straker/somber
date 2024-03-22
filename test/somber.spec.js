import * as somberExports from '../src/somber.js';
import somber from '../src/somber.defaults.js';

describe('somber', () => {
  it('should export api', () => {
    assert.exists(somberExports.SomberElement);
    assert.exists(somberExports.watch);
  });

  it('should export somber object', () => {
    expect(somberExports.default).to.exist;
    expect(somberExports.default).to.equal(somber);
  });
});
