import test from 'ava';
import createState from './redux-create-state';

test('Should shallow clone the state object', t => {
  const state = {foo: {}, bar: []};
  const newState = createState(state);
  t.not(state, newState);
  t.is(state.foo, newState.foo);
  t.is(state.bar, newState.bar);
});

test('Should shallow clone the state array', t => {
  const state = [{}, []];
  const newState = createState(state);
  t.not(state, newState);
  t.is(state[0], newState[0]);
  t.is(state[1], newState[1]);
});

test('Should throw an error if anything else than an array or a plain object is provided as the first argument', t => {
  t.notThrows(() => createState({}));
  t.notThrows(() => createState([]));
  t.throws(() => createState());
  t.throws(() => createState(1));
  t.throws(() => createState('foo'));
  t.throws(() => createState(true));
  t.throws(() => createState(false));
  t.throws(() => createState(null));
  t.throws(() => createState(undefined));
  t.throws(() => createState(() => {}));
  t.throws(() => createState(Symbol()));
});

test('Should clone all the arrays and objects in insert operation path', t => {
  const state = {a: {b: {c: ['foo', ['bar']]}}};
  const newState = createState(state,
    ['a.b.c.#1.#0', 'baz']
  );
  t.not(state.a, newState.a);
  t.not(state.a.b, newState.a.b);
  t.not(state.a.b.c, newState.a.b.c);
  t.not(state.a.b.c[1], newState.a.b.c[1]);
  t.is(newState.a.b.c[1][0], 'baz');
});

test('Should allow defining negative array indices in insert operation paths', t => {
  const state = {items: [1,2,3,4,5]};
  const newState = createState(state,
    ['items.#-1', 'foo'],
    ['items.#-2', 'bar'],
    ['items.#-100', 'baz']
  );
  t.is(newState.items.length, 5);
  t.is(newState.items[4], 'foo');
  t.is(newState.items[3], 'bar');
  t.is(newState.items[0], 'baz');
});

test('If insert operation`s value is a function it should be called and it`s return value should be set as the path`s value', t => {
  const state = {items: [1,2,3,4,5]};
  const newState = createState(state,
    ['items', (items, prev) => {
      t.not(items, state.items);
      t.not(state, prev);
      t.deepEqual(items, [1,2,3,4,5]);
      t.deepEqual(prev, {items: [1,2,3,4,5]});
      return items.push('foo') && items.push('bar') && items;
    }]
  );
  t.deepEqual(newState, {items: [1,2,3,4,5,'foo', 'bar']});
  t.not(state.items, newState.items);
});

test('Should allow doing a shitload of insert operations in a single batch', t => {
  const state = {a: {b: {c: 'foo'}}};
  const newState = createState(state,
    ['a.b.c', 'bar'],
    ['test', 'test'],
    ['items', []],
    ['items.#0', 'a'],
    ['items.#1', 'b']
  );
  t.deepEqual(newState, {
    a: {b: {c: 'bar'}},
    test: 'test',
    items: ['a', 'b']
  });
  t.not(state.a, newState.a);
  t.not(state.a.b, newState.a.b);
});