/*!
 * assemble-render-string <https://github.com/jonschlinkert/assemble-render-string>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function(options) {
  return function(app) {

    /**
     * Render a string with the given `locals` and `callback`.
     *
     * ```js
     * var locals = {title: 'Foo'};
     * app.renderString('Name: <%= title %>', locals, function(err, str) {
     *   if (err) throw err;
     *   console.log(str);
     *   //=> 'Name: Foo'
     * });
     * ```
     * @name .renderString
     * @param  {String} `string` The string to render
     * @param  {Object} `locals` Locals to pass to the rendering engine.
     * @param  {Function} `callback`
     * @api public
     */

    app.define('renderString', function(str, locals, cb) {
      if (isBuffer(str)) str = str.toString();
      if (typeof str !== 'string') {
        throw new TypeError('expected a string');
      }
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }

      if (typeof cb !== 'function') {
        throw new TypeError('renderString is async and expects a callback function');
      }

      var view = new app.View({content: str, path: '<string>'});
      locals = locals || {};

      return this.render(view, locals, function(err, res) {
        if (err) return cb(err);
        cb(null, res.content);
      });
    });
  };
};

function isBuffer(val) {
  if (val && val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}
