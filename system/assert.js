System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function assert(condition, message) {
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }
    exports_1("assert", assert);
    return {
        setters: [],
        execute: function () {
        }
    };
});
