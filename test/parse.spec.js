import parse from '../src/parse.js';
import watch from '../src/watch.js';

describe('parse', () => {
  it('returns object and key from expression', () => {
    const scope = { a: 1, b: 2 };
    const paths = parse(scope, 'a');
    assert.deepEqual(paths, [{ obj: scope, key: 'a' }]);
  });

  it('returns nested paths', () => {
    const scope = { a: { b: { c: 1 } } };
    const paths = parse(scope, 'a.b.c');
    assert.deepEqual(paths, [{ obj: scope.a.b, key: 'c' }]);
  });

  it('returns array paths', () => {
    const scope = { a: [1] };
    const paths = parse(scope, 'a[0]');
    assert.deepEqual(paths, [{ obj: scope.a, key: '0' }]);
  });

  it('returns nested array paths', () => {
    const scope = { a: [[[1]]] };
    const paths = parse(scope, 'a[0][0][1]');
    assert.deepEqual(paths, [{ obj: scope.a[0][0], key: '1' }]);
  });

  it('returns both property and array access paths', () => {
    const scope = { a: [{ b: { c: 1 } }] };
    const paths = parse(scope, 'a[0].b.c');
    assert.deepEqual(paths, [{ obj: scope.a[0].b, key: 'c' }]);
  });

  it('allows optional chained paths', () => {
    const scope = { a: [{ b: { c: 1 } }] };
    const paths = parse(scope, 'a[0]?.b.c');
    assert.deepEqual(paths, [{ obj: scope.a[0].b, key: 'c' }]);
  });

  it('allows optional chained paths on array access', () => {
    const scope = { a: [{ b: { c: 1 } }] };
    const paths = parse(scope, 'a?.[0].b.c');
    assert.deepEqual(paths, [{ obj: scope.a[0].b, key: 'c' }]);
  });

  it('discards function names', () => {
    const scope = { a: { b: { c: 1 } } };
    const paths = parse(scope, 'a.b.c()');
    assert.deepEqual(paths, []);
  });

  it('discards function names with space before parenthesis', () => {
    const scope = { a: { b: { c: 1 } } };
    const paths = parse(scope, 'a.b.c    ()');
    assert.deepEqual(paths, []);
  });

  it(`discards paths that don't match scope`, () => {
    const scope = { a: { b: { c: 1 } } };
    const paths = parse(scope, 'a.c.b');
    assert.deepEqual(paths, []);
  });

  it('returns key that may not exist on scope', () => {
    const scope = { a: { b: { c: 1 } } };
    const paths = parse(scope, 'a.b.d');
    assert.deepEqual(paths, [{ obj: scope.a.b, key: 'd' }]);
  });

  it('returns multiple paths (OR)', () => {
    const scope = { a: 1, b: 2 };
    const paths = parse(scope, 'a || b');
    assert.deepEqual(paths, [
      { obj: scope, key: 'a' },
      { obj: scope, key: 'b' }
    ]);
  });

  it('returns multiple paths (AND)', () => {
    const scope = { a: 1, b: 2 };
    const paths = parse(scope, 'a&&b');
    assert.deepEqual(paths, [
      { obj: scope, key: 'a' },
      { obj: scope, key: 'b' }
    ]);
  });

  it('returns multiple paths (ternary)', () => {
    const scope = { a: 1, b: 2, c: 3 };
    const paths = parse(scope, 'a    ?b:    c');
    assert.deepEqual(paths, [
      { obj: scope, key: 'a' },
      { obj: scope, key: 'b' },
      { obj: scope, key: 'c' }
    ]);
  });

  it('returns multiple paths (comma separate)', () => {
    const scope = { a: 1, b: 2, c: 3 };
    const paths = parse(scope, 'a,b,c');
    assert.deepEqual(paths, [
      { obj: scope, key: 'a' },
      { obj: scope, key: 'b' },
      { obj: scope, key: 'c' }
    ]);
  });

  it('returns multiple paths (semicolon separate)', () => {
    const scope = { a: 1, b: 2, c: 3 };
    const paths = parse(scope, 'a;b;c');
    assert.deepEqual(paths, [
      { obj: scope, key: 'a' },
      { obj: scope, key: 'b' },
      { obj: scope, key: 'c' }
    ]);
  });

  it('returns the object of a watched proxy', () => {
    const scope = { a: 1, b: 2, c: 3 };
    const paths = parse(watch(scope), 'a;b;c');
    assert.deepEqual(paths, [
      { obj: scope, key: 'a' },
      { obj: scope, key: 'b' },
      { obj: scope, key: 'c' }
    ]);
  });
});
