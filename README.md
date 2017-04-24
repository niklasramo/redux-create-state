# Redux Create State

A utility library (or actually just a single function) to ease the process of creating a new state object immutably in Redux.

As stated in the [Redux website](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html):
> The key to updating nested data is **that every level of nesting must be copied and updated appropriately**. This is often a difficult concept for those learning Redux, and there are some specific problems that frequently occur when trying to update nested objects. These lead to accidental direct mutation, and should be avoided.

This library provides a single function for creating a new state based on the current state, immutably. It works by first creating a shallow clone of the current state and then cloning all the nested arrays and objects between the root object and the inserted values. So the whole state is not deep cloned automatically, only the necessary arrays and objects.

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

`reduxCreateState(state, [...insert])`

**Parameters**

* **state** &nbsp;&mdash;&nbsp; *array / object*
  * The current state object or array.
* **insert** &nbsp;&mdash;&nbsp; *array*
  * Optional.
  * You can provide any number of insert operations which will be applied to the new state. These operations do not mutate the current state object.
  * A single insert operation is defined with an array consisting of two items. The first item is the inserted value's path and the second item is the actual value. The path is just a string where each path step (object key) is separated with a dot (e.g. 'foo.bar.baz'). You can also use an array index as path step by prefixing the key with octothorpe (e.g. 'items.#1').
  * If the insert path does not exist it will be created. Every existing step in the path will be cloned.
  * If the insert operation's value is a function it will be called and it's return value will be set as the insert path's value. The function receives the current value (already cloned if object or array) as it's first argument and the parent object/array as it's second argument (also already cloned).

**Returns** &nbsp;&mdash;&nbsp; *array / object*

Returns a new state object.

## License

Copyright &copy; 2017 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
