define(["require", "exports", "./Precedence"], function (require, exports, Precedence_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryPrecedence = {
        '||': Precedence_1.Precedence.LogicalOR,
        '&&': Precedence_1.Precedence.LogicalAND,
        '|': Precedence_1.Precedence.BitwiseOR,
        '^': Precedence_1.Precedence.BitwiseXOR,
        '&': Precedence_1.Precedence.BitwiseAND,
        '==': Precedence_1.Precedence.Equality,
        '!=': Precedence_1.Precedence.Equality,
        '===': Precedence_1.Precedence.Equality,
        '!==': Precedence_1.Precedence.Equality,
        'is': Precedence_1.Precedence.Equality,
        'isnt': Precedence_1.Precedence.Equality,
        '<': Precedence_1.Precedence.Relational,
        '>': Precedence_1.Precedence.Relational,
        '<=': Precedence_1.Precedence.Relational,
        '>=': Precedence_1.Precedence.Relational,
        'in': Precedence_1.Precedence.Relational,
        'instanceof': Precedence_1.Precedence.Relational,
        '<<': Precedence_1.Precedence.BitwiseSHIFT,
        '>>': Precedence_1.Precedence.BitwiseSHIFT,
        '>>>': Precedence_1.Precedence.BitwiseSHIFT,
        '+': Precedence_1.Precedence.Additive,
        '-': Precedence_1.Precedence.Additive,
        '*': Precedence_1.Precedence.Multiplicative,
        '%': Precedence_1.Precedence.Multiplicative,
        '/': Precedence_1.Precedence.Multiplicative
    };
});
