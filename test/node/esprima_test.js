'use strict';

var esprima = require('../../cjs/davinci-mathscript/esprima');
var assert = require('assert');
var vows = require('vows');

vows.describe('esprima').addBatch({
    'constructor': {
        'parse "23"': {
            topic: function() {
                return esprima.parse("23");
            },
            'should return 23 for the expression value': function(expectation) {
                assert.equal(expectation.body[0].expression.value, 23);
            },
        }
    }
}).export(module);