# Redux Create State

A utility function for Redux to ease the process of creating a new state object, immutably.

**Features**

* Tiny (~1kb minified)
* Fast (clones only the necessary objects and arrays)
* Simple API (it's just one function)
* Works in IE9+ and all modern browsers

**Why do I need this?**

As stated on the [Redux website](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html):

> The key to updating nested data is **that every level of nesting must be copied and updated appropriately**. This is often a difficult concept for those learning Redux, and there are some specific problems that frequently occur when trying to update nested objects. These lead to accidental direct mutation, and should be avoided.

This function aims to make that problem go away. It works by first creating a *shallow* clone of the current state (object or array) and then cloning all the nested arrays and objects between the root object/array and the inserted values. So the whole state is not deep cloned automatically, only the necessary arrays and objects are cloned to make the function perform as fast as possible.

## Install

```console
$ npm install redux-create-state
```

## Usage

```javascript
import createState from 'redux-create-state';

const state = {
  items: [
    {id: 1, value: 'foo'},
    {id: 2, value: 'bar'}
  ],
  data: ['foo', 'bar']
};

const newState = createState(state,
  ['items.#1.value', 'newBar'],
  ['items.#2', {id: 3, value: 'baz'}],
  ['someNumbers', [1,2,3,4,5]],
  ['some.long.path', 'someValue'],
  ['items', (items) => {
    items.unshift({id: 0, value: 'first'});
    items.push({id: 4, value: 'last'});
    return items;
  }]
);

console.log(newState);
// Every inner object/array inside the new state
// that was subject to change is cloned.
// The new state data would look like this:
// {
//   items: [
//     {id: 0, value: 'first'},
//     {id: 1, value: 'foo'},
//     {id: 2, value: 'newBar'},
//     {id: 3, value: 'baz'},
//     {id: 4, value: 'last'}
//   ],
//   data: ['foo', 'bar'],
//   someNumbers: [1,2,3,4,5],
//   some: {
//     long: {
//       path: 'someValue'
//     }
//   }
// }
//
```

## API

### `reduxCreateState(state, [...insert])`

**Parameters**

* **state** &nbsp;&mdash;&nbsp; *array / object*
  * The current state object or array.
* **insert** &nbsp;&mdash;&nbsp; *array*
  * Optional.
  * You can provide any number of insert operations which will be applied to the new state. These operations do not mutate the current state object/array.
  * A single insert operation is defined with an array which consists of two items. The first item is the insert's path and the second item is the insert's value. The path is just a string where each path step (object key) is separated with a dot (e.g. `'foo.bar.baz'`). You can also use an array index as path step by prefixing the key with octothorpe (e.g. `'foo.bar.items.#1'`).
  * If the insert path does not exist it will be created. Every existing step in the path will be cloned.
  * If the insert operation's value is a function it will be called and it's return value will be set as the insert path's value. The function receives the current value (already cloned if object or array) as it's first argument and the parent object/array as it's second argument (also already cloned).

**Returns** &nbsp;&mdash;&nbsp; *array / object*

Returns a new state object or array, depending on the provided state.

## Examples

Here are some examples for common use cases. All the examples assume that you have imported the library as `createState`:
```javascript
import createState from 'redux-create-state';
```

**Update deeply nested object**

```javascript
const state = {a: {b: { c: 'foo' } } };
const newState = createState(state, ['a.b.c', 'bar']);
console.log(newState);
// => {a: {b: { c: 'foo' } } }
```

**Create deeply nested object**

```javascript
const state = {};
const newState = createState(state, ['a.b.c', 'foo']);
console.log(newState);
// => {a: {b: { c: 'foo' } } }
```

**Create a deeply nested object which has an array in it's path**

```javascript
const state = {};
const newState = createState(state, ['a.b.#0.c', 'foo']);
console.log(newState);
// => {a: {b: [ {c: 'foo'} ] } }
```

**Update an existing array item**

```javascript
const state = {items: ['foo', 'bar']};
const newState = createState(state, ['items.#1', 'baz']);
console.log(newState);
// => {items: ['foo', 'baz']}
```

**Append and prepend items to an array**

```javascript
const state = {items: ['foo', 'bar']};
const newState = createState(state, ['items', (items) => {
  items.unshift('start');
  items.push('end');
  return items;
}]);
console.log(newState);
// => {items: ['start', 'foo', 'bar', 'end']}
```

**Remove items from an array**

```javascript
const state = {items: ['foo', 'bar', 'baz']};
const newState = createState(state, ['items', (items) => {
  items.splice(1, 1);
  return items;
}]);
console.log(newState);
// => {items: ['foo', 'baz']}
```

**Do multiple modifications**

```javascript
const state = {items: ['foo', 'bar']};
const newState = createState(state,
  ['items.#1', 'baz'],
  ['foo.bar', 'baz']
);
console.log(newState);
// => {
//   items: ['foo', 'baz'],
//   foo: {bar: 'baz'}
// }
```

## Alternatives

As always, there's a [swarm of awesome alternatives](https://github.com/markerikson/redux-ecosystem-links/blob/master/immutable-data.md#immutable-update-utilities) for you to pick from.

## License

Copyright &copy; 2017 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
