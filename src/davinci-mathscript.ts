import core = require('davinci-mathscript/core');
import esprima = require('davinci-mathscript/esprima');
import escodegen = require('davinci-mathscript/escodegen');
import estraverse = require('davinci-mathscript/estraverse');
import esutils = require('davinci-mathscript/esutils');

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
export = mathscript;