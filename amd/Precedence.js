define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Precedence = {
        Sequence: 0,
        Yield: 1,
        Await: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        LogicalOR: 3,
        LogicalAND: 4,
        BitwiseAND: 5,
        Equality: 6,
        Relational: 7,
        Additive: 8,
        Multiplicative: 9,
        BitwiseXOR: 10,
        BitwiseOR: 11,
        BitwiseSHIFT: 12,
        Unary: 13,
        Postfix: 14,
        Call: 15,
        New: 16,
        TaggedTemplate: 17,
        Member: 18,
        Primary: 19
    };
});
