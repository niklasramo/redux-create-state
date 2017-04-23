# Redux Create State

A utility library (or actually just one function) to ease the process of creating a new state object immutably in Redux.

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
  ['items.#3', {id: 3, value: 'baz'}],
  ['someNumbers', [1,2,3,4,5]],
  ['some.long.path', 'someValue']
);
console.log(newState);
// {
//   items: [
//     {id: 1, value: 'foo'},
//     {id: 2, value: 'newBar'},
//     {id: 3, value: 'baz'}
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

## License

Copyright &copy; 2017 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
