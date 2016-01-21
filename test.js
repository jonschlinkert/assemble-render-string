'use strict';

require('mocha');
var assert = require('assert');
var assemble = require('assemble-core');
var renderString = require('./');
var app;

describe('app.renderString', function() {
  beforeEach(function() {
    app = assemble();
    app.use(renderString());
    app.create('page');
    app.engine('tmpl', require('engine-base'));
    app.engine('noop', function(str, locals, cb) {
      cb(null, str);
    });
  });

  it('should throw an error when no callback is given:', function(cb) {
    try {
      app.renderString('foo');
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'renderString is async and expects a callback function');
      cb();
    }
  });

  it('should throw an error when an engine is not defined:', function(cb) {
    app.renderString('foo', function(err) {
      assert.equal(err.message, 'Templates#render cannot find an engine for: <string>');
      cb();
    });
  });

  it('should render a string:', function(cb) {
    app.option('engine', 'noop');
    app.renderString('foo', function(err, content) {
      if (err) return cb(err);
      assert.equal(content, 'foo');
      cb();
    });
  });

  it('should use locals to render a string:', function(cb) {
    app.option('engine', 'tmpl');

    var str = 'a <%= name %> b';
    app.renderString(str, {name: 'Halle'}, function(err, content) {
      if (err) return cb(err);
      assert.equal(content, 'a Halle b');
      cb();
    });
  });

  it('should use globally defined data to render a string:', function(cb) {
    app.option('engine', 'tmpl');
    app.data({name: 'Halle'});

    var str = 'a <%= name %> b';
    app.renderString(str, function(err, content) {
      if (err) return cb(err);
      assert.equal(content, 'a Halle b');
      cb();
    });
  });

  it('should use helpers to render a string:', function(cb) {
    app.option('engine', 'tmpl');

    app.helper('upper', function(str) {
      return str.toUpperCase(str);
    });

    var str = 'a <%= upper(name) %> b';
    app.renderString(str, {name: 'Halle'}, function(err, content) {
      if (err) return cb(err);
      assert.equal(content, 'a HALLE b');
      cb();
    });
  });

  it('should render a template when contents is a buffer:', function(cb) {
    app.option('engine', 'tmpl');
    app.renderString(new Buffer('<%= a %>'), {a: 'b'}, function(err, content) {
      if (err) return cb(err);
      assert.equal(content, 'b');
      cb();
    });
  });

  it('should render a template when content is a string:', function(cb) {
    app.option('engine', 'tmpl');
    app.renderString('<%= a %>', {a: 'b'}, function(err, content) {
      if (err) return cb(err);
      assert.equal(content, 'b');
      cb();
    });
  });

  it('should use the engine defined on locals', function(cb) {
    app.renderString(new Buffer('<%= a %>'), {a: 'b', engine: 'tmpl'}, function(err, content) {
      if (err) return cb(err);
      assert.equal(content, 'b');
      cb();
    });
  });
});
