System.register(["./Precedence"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Precedence_1, BinaryPrecedence;
    return {
        setters: [
            function (Precedence_1_1) {
                Precedence_1 = Precedence_1_1;
            }
        ],
        execute: function () {
            exports_1("BinaryPrecedence", BinaryPrecedence = {
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
            });
            exports_1("default", BinaryPrecedence);
        }
    };
});
