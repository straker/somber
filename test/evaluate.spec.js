import evaluate from '../src/evaluate.js';

describe('evaluate', () => {
  const noop = () => {};
  const warnStub = sinon.stub(console, 'warn').callsFake(noop);
  const errorStub = sinon.stub(console, 'error').callsFake(noop);

  after(() => {
    warnStub.restore();
    errorStub.restore();
  });

  it('evaluates the expression', () => {
    const value = evaluate({ state: 'foo' }, 'state');
    assert.equal(value, 'foo');
  });

  it('evaluates empty expression', () => {
    const value = evaluate({ state: 'foo' }, '');
    assert.equal(value, '');
  });

  it('evaluates different scopes', () => {
    const value1 = evaluate({ state: 'foo' }, 'state');
    const value2 = evaluate({ state: 'bar' }, 'state');
    assert.equal(value1, 'foo');
    assert.equal(value2, 'bar');
  });

  it("does not throw if it can't evaluate", () => {
    assert.doesNotThrow(() => {
      evaluate({ state: 'foo' }, 'foo');
    });
  });
});
