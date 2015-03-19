define(["require", "exports", 'davinci-mathscript/core', 'davinci-mathscript/esprima', 'davinci-mathscript/escodegen', 'davinci-mathscript/estraverse', 'davinci-mathscript/esutils'], function (require, exports, core, esprima, escodegen, estraverse, esutils) {
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
    return mathscript;
});
