System.register(["./esprima"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getLoopProtectorBlocks(varName, millis) {
        var ast1 = esprima_1.parse("var " + varName + " = Date.now()");
        var ast2 = esprima_1.parse("if (Date.now() - " + varName + " > " + millis + ") {throw new Error(\"Infinite loop\")}");
        return {
            before: ast1.body[0],
            inside: ast2.body[0]
        };
    }
    exports_1("default", getLoopProtectorBlocks);
    var esprima_1;
    return {
        setters: [
            function (esprima_1_1) {
                esprima_1 = esprima_1_1;
            }
        ],
        execute: function () {
        }
    };
});
