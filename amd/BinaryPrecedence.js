define(["require", "exports", "./Precedence"], function (require, exports, Precedence_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryPrecedence = {
        '||': Precedence_1.default.LogicalOR,
        '&&': Precedence_1.default.LogicalAND,
        '|': Precedence_1.default.BitwiseOR,
        '^': Precedence_1.default.BitwiseXOR,
        '&': Precedence_1.default.BitwiseAND,
        '==': Precedence_1.default.Equality,
        '!=': Precedence_1.default.Equality,
        '===': Precedence_1.default.Equality,
        '!==': Precedence_1.default.Equality,
        'is': Precedence_1.default.Equality,
        'isnt': Precedence_1.default.Equality,
        '<': Precedence_1.default.Relational,
        '>': Precedence_1.default.Relational,
        '<=': Precedence_1.default.Relational,
        '>=': Precedence_1.default.Relational,
        'in': Precedence_1.default.Relational,
        'instanceof': Precedence_1.default.Relational,
        '<<': Precedence_1.default.BitwiseSHIFT,
        '>>': Precedence_1.default.BitwiseSHIFT,
        '>>>': Precedence_1.default.BitwiseSHIFT,
        '+': Precedence_1.default.Additive,
        '-': Precedence_1.default.Additive,
        '*': Precedence_1.default.Multiplicative,
        '%': Precedence_1.default.Multiplicative,
        '/': Precedence_1.default.Multiplicative
    };
    exports.default = exports.BinaryPrecedence;
});
