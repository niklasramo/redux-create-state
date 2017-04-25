/*!
 * redux-create-state v1.0.0
 * https://github.com/niklasramo/mezr
 * Copyright (c) 2017 Niklas Rämö <inramo@gmail.com>
 * Released under the MIT license
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.reduxCreateState = factory();
  }
}(this, function () {

  /**
   * Takes in the current state (array or object) and returns a new state which
   * is a shallow copy of the current state. Optionally you can provide any
   * number of insert operations which will modify the new state before it's
   * returned.
   *
   * @example
   * var state = {
   *   items: [
   *     {id: 1, value: 'foo'},
   *     {id: 2, value: 'bar'}
   *   ],
   *   data: ['foo', 'bar']
   * };
   * var newState = reduxCreateState(state,
   *   ['items.#1.value', 'newBar'],
   *   ['items.#3', {id: 3, value: 'baz'}],
   *   ['someNumbers', [1,2,3,4,5]],
   *   ['some.long.path', 'someValue']
   * );
   * console.log(newState);
   * // {
   * //   items: [
   * //     {id: 1, value: 'foo'},
   * //     {id: 2, value: 'newBar'},
   * //     {id: 3, value: 'baz'}
   * //   ],
   * //   data: ['foo', 'bar'],
   * //   someNumbers: [1,2,3,4,5],
   * //   some: {
   * //     long: {
   * //       path: 'someValue'
   * //     }
   * //   }
   * // };
   *
   * @public
   * @param {State} currentState
   * @param {...Insert} [insert]
   * @returns {State}
   */
  function createState(currentState) {

    // Clone (shallow) the current state object/array.
    var newState = cloneValue(currentState);

    // If the new state is the object as the current state, let's throw an
    // error. Basically this situation should only occur if the current state is
    // not a plain object or an array.
    if (newState === currentState) {
      throw new Error('[redux-create-state] State object must be a plain object or an array.');
    }

    // Cache arguments length.
    var argsLength = arguments.length;

    // Loop through the insert operations.
    for (var i = 1; i < argsLength; i++) {

      var insert = arguments[i];
      var pointer = newState;
      var insertPath = insert[0].split('.');
      var insertValue = insert[1];

      // Go to the path or create it if it does not exist yet, and set the
      // value. Make sure that each existing array and object is cloned to
      // guarantee immutability for the inserted values and their paths.
      for (var ii = 0; ii < insertPath.length; ii++) {

        if (!insertPath[ii]) {
          continue;
        }

        var key = insertPath[ii];
        var nextKey = insertPath[ii + 1];

        // If key is an array index, format it into a valid index.
        if (key.charAt(0) === '#') {
          key = parseInt(key.substring(1)) || 0;
          if (key < 0) {
            key = Math.max(0, pointer.length + key);
          }
        }

        // If this is the last key, let's set the value.
        if (!nextKey) {
          pointer[key] = typeof insertValue === 'function' ? insertValue(cloneValue(pointer[key]), pointer) : insertValue;
        }

        // Otherwise, let's create the path object/array.
        else {
          if (nextKey.charAt(0) === '#') {
            pointer[key] = Array.isArray(pointer[key]) ? pointer[key].concat() : [];
          }
          else {
            pointer[key] = isPlainObject(pointer[key]) ? cloneObject(pointer[key]) : {};
          }
          pointer = pointer[key];
        }

      }

    }

    // Return the new state.
    return newState;

  }

  /**
   * Check if a value is a plain object.
   *
   * @private
   * @param {*} val
   * @returns {Boolean}
   */
  function isPlainObject(val) {

    return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]';

  }

  /**
   * Shallow clone an object.
   *
   * @private
   * @param {Object} obj
   * @returns {Object}
   */
  function cloneObject(obj) {

    var ret = {};
    if (typeof Object.assign === 'function') {
      return Object.assign(ret, obj);
    }
    else {
      Object.keys().forEach(function (key) {
        ret[key] = obj[key];
      });
      return ret;
    }

  }

  /**
   * Shallow clone an object and an array, let other values pass through.
   *
   * @private
   * @param {*} value
   * @returns {*}
   */
  function cloneValue(value) {

    return isPlainObject(value) ? cloneObject(value) : Array.isArray(value) ? value.concat() : value;

  }

  /**
   * A state object must be either an array or object.
   *
   * @typedef {(Array|Object)} State
   */

  /**
   * A single insert operation is defined with an array consisting of two
   * items. The first item is the inserted value's path and the second item is
   * the actual value. The path is just a string where each path step (object
   * key) is separated with a dot (e.g. 'foo.bar.baz'). You can also use an
   * array index as path step by prefixing the key with octothorpe (e.g.
   * 'items.#1'). If the insert path does not exist it will be created. Every
   * existing step in the path will be cloned. If the insert operation's value
   * is a function it will be called and it's return value will be set as the
   * insert path's value. The function receives the current value (already
   * cloned if object or array) as it's first argument and the parent
   * object/array as it's second argument (also already cloned).
   *
   * @typedef {Array} Update
   * @param {String} path
   * @param {*} value
   */

  return createState;

}));
