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

  it('evaluates $data property', () => {
    const value = evaluate({ state: 'foo', $data: { value: 1 } }, 'state + value');
    assert.equal(value, 'foo1');
  });

  it("does not throw if it can't evaluate", () => {
    assert.doesNotThrow(() => {
      evaluate({ state: 'foo' }, 'foo');
    });
    assert.isTrue(
      warnStub.calledWith(
        sinon.match('Error when evaluating expression')
      )
    );
  });

  it('does not throw if expression is invalid', () => {
    assert.doesNotThrow(() => {
      evaluate({ state: 'foo' }, 'foo\bar');
    });
    assert.isTrue(
      errorStub.calledWith(sinon.match('Invalid or unexpected token'))
    );
  });
});
