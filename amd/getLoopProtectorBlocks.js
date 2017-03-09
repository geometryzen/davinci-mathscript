define(["require", "exports", "./esprima"], function (require, exports, esprima_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getLoopProtectorBlocks(varName, millis) {
        var ast1 = esprima_1.parse("var " + varName + " = Date.now()");
        var ast2 = esprima_1.parse("if (Date.now() - " + varName + " > " + millis + ") {break}");
        return {
            before: ast1.body[0],
            inside: ast2.body[0]
        };
    }
    exports.default = getLoopProtectorBlocks;
});
