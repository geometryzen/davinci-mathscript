var core = require('davinci-mathscript/core');
var esprima = require('davinci-mathscript/esprima');
var escodegen = require('davinci-mathscript/escodegen');
var estraverse = require('davinci-mathscript/estraverse');
var esutils = require('davinci-mathscript/esutils');
/**
 * Provides the MathScript module
 *
 * @module mathscript
 */
var mathscript = {
    'VERSION': core.VERSION,
    esprima: esprima,
    escodegen: escodegen,
    estraverse: estraverse,
    esutils: esutils
};
module.exports = mathscript;
