System.register(["./core", "./esprima", "./escodegen", "./generateRandomId", "./getLoopProtectorBlocks", "./syntax"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function transpileTree(code, options) {
        var tree = esprima_1.parse(code, options, void 0);
        visit(tree, { timeout: 1000 });
        return tree;
    }
    function transpile(code, options) {
        var tree = transpileTree(code, options);
        var codeOut = escodegen_1.generate(tree, null);
        return codeOut;
    }
    function addInfiniteLoopProtection(statements, millis) {
        for (var i = statements.length; i--;) {
            var el = statements[i];
            if (el && el.type === syntax_1.Syntax.ForStatement || el.type === syntax_1.Syntax.WhileStatement || el.type === syntax_1.Syntax.DoWhileStatement) {
                var loop = el;
                var randomVariableName = '_' + generateRandomId_1.default(5);
                var insertionBlocks = getLoopProtectorBlocks_1.default(randomVariableName, millis);
                statements.splice(i, 0, insertionBlocks.before);
                if (!Array.isArray(loop.body)) {
                    loop.body = {
                        body: [loop.body],
                        type: syntax_1.Syntax.BlockStatement
                    };
                }
                var block = loop.body;
                block.body.unshift(insertionBlocks.inside);
            }
        }
        return statements;
    }
    function visit(node, options) {
        if (node && node.type) {
            switch (node.type) {
                case syntax_1.Syntax.BlockStatement: {
                    var block = node;
                    addInfiniteLoopProtection(block.body, options.timeout).forEach(function (part, index) { visit(part, options); });
                    break;
                }
                case syntax_1.Syntax.FunctionDeclaration: {
                    var funcDecl = node;
                    funcDecl.params.forEach(function (param, index) { visit(param, options); });
                    visit(funcDecl.body, options);
                    break;
                }
                case syntax_1.Syntax.Program: {
                    var script = node;
                    addInfiniteLoopProtection(script.body, options.timeout).forEach(function (node, index) {
                        visit(node, options);
                    });
                    break;
                }
                case syntax_1.Syntax.VariableDeclaration: {
                    var varDeclaration = node;
                    varDeclaration.declarations.forEach(function (declaration, index) { visit(declaration, options); });
                    break;
                }
                case syntax_1.Syntax.VariableDeclarator: {
                    var varDeclarator = node;
                    if (varDeclarator.init) {
                        visit(varDeclarator.init, options);
                    }
                    break;
                }
                case syntax_1.Syntax.ConditionalExpression: {
                    var condExpr = node;
                    visit(condExpr.test, options);
                    visit(condExpr.consequent, options);
                    visit(condExpr.alternate, options);
                    break;
                }
                case syntax_1.Syntax.BinaryExpression:
                case syntax_1.Syntax.LogicalExpression: {
                    var binExpr = node;
                    var callExpr = node;
                    if (binExpr.operator && binOp[binExpr.operator]) {
                        callExpr.type = syntax_1.Syntax.CallExpression;
                        callExpr.callee = {
                            type: syntax_1.Syntax.MemberExpression,
                            computed: false,
                            object: { type: syntax_1.Syntax.Identifier, name: MATHSCRIPT_NAMESPACE },
                            property: {
                                type: syntax_1.Syntax.Identifier, name: binOp[binExpr.operator]
                            }
                        };
                        visit(binExpr.left, options);
                        visit(binExpr.right, options);
                        callExpr.arguments = [binExpr.left, binExpr.right];
                    }
                    else {
                        visit(binExpr.left, options);
                        visit(binExpr.right, options);
                    }
                    break;
                }
                case syntax_1.Syntax.ExpressionStatement: {
                    var exprStmt = node;
                    visit(exprStmt.expression, options);
                    break;
                }
                case syntax_1.Syntax.ForStatement: {
                    var forStmt = node;
                    visit(forStmt.init, options);
                    visit(forStmt.test, options);
                    visit(forStmt.update, options);
                    visit(forStmt.body, options);
                    break;
                }
                case syntax_1.Syntax.ForInStatement: {
                    var forIn = node;
                    visit(forIn.left, options);
                    visit(forIn.right, options);
                    visit(forIn.body, options);
                    break;
                }
                case syntax_1.Syntax.IfStatement: {
                    var ifStmt = node;
                    visit(ifStmt.test, options);
                    visit(ifStmt.consequent, options);
                    visit(ifStmt.alternate, options);
                    break;
                }
                case syntax_1.Syntax.ArrayExpression: {
                    var arrayExpr = node;
                    arrayExpr.elements.forEach(function (elem, index) { visit(elem, options); });
                    break;
                }
                case syntax_1.Syntax.AssignmentExpression: {
                    var assignExpr = node;
                    if (assignExpr.operator && binOp[assignExpr.operator]) {
                        visit(assignExpr.left, options);
                        visit(assignExpr.right, options);
                    }
                    else {
                        visit(assignExpr.left, options);
                        visit(assignExpr.right, options);
                    }
                    break;
                }
                case syntax_1.Syntax.CallExpression: {
                    var callExpr = node;
                    visit(callExpr.callee, options);
                    callExpr.arguments.forEach(function (argument, index) { visit(argument, options); });
                    break;
                }
                case syntax_1.Syntax.CatchClause: {
                    var catchClause = node;
                    visit(catchClause.param, options);
                    visit(catchClause.body, options);
                    break;
                }
                case syntax_1.Syntax.FunctionExpression: {
                    var funcExpr = node;
                    visit(funcExpr.body, options);
                    break;
                }
                case syntax_1.Syntax.MemberExpression: {
                    var staticMemberExpr = node;
                    visit(staticMemberExpr.object, options);
                    break;
                }
                case syntax_1.Syntax.MemberExpression: {
                    var computedMemberExpr = node;
                    visit(computedMemberExpr.object, options);
                    break;
                }
                case syntax_1.Syntax.NewExpression: {
                    var newExpr = node;
                    visit(newExpr.callee, options);
                    newExpr.arguments.forEach(function (argument, index) { visit(argument, options); });
                    break;
                }
                case syntax_1.Syntax.ObjectExpression: {
                    var objExpr = node;
                    objExpr.properties.forEach(function (prop, index) { visit(prop, options); });
                    break;
                }
                case syntax_1.Syntax.ReturnStatement: {
                    var returnStmt = node;
                    visit(returnStmt.argument, options);
                    break;
                }
                case syntax_1.Syntax.SequenceExpression: {
                    var seqExpr = node;
                    seqExpr.expressions.forEach(function (expr, index) { visit(expr, options); });
                    break;
                }
                case syntax_1.Syntax.SwitchCase: {
                    var switchCase = node;
                    visit(switchCase.test, options);
                    switchCase.consequent.forEach(function (expr, index) { visit(expr, options); });
                    break;
                }
                case syntax_1.Syntax.SwitchStatement: {
                    var switchStmt = node;
                    visit(switchStmt.discriminant, options);
                    switchStmt.cases.forEach(function (kase, index) { visit(kase, options); });
                    break;
                }
                case syntax_1.Syntax.ThrowStatement: {
                    var throwStmt = node;
                    visit(throwStmt.argument, options);
                    break;
                }
                case syntax_1.Syntax.TryStatement: {
                    var tryStmt = node;
                    visit(tryStmt.block, options);
                    visit(tryStmt.handler, options);
                    visit(tryStmt.finalizer, options);
                    break;
                }
                case syntax_1.Syntax.UnaryExpression: {
                    var unaryExpr = node;
                    var callExpr = node;
                    if (unaryExpr.operator && unaryOp[unaryExpr.operator]) {
                        callExpr.type = syntax_1.Syntax.CallExpression;
                        callExpr.callee = {
                            type: syntax_1.Syntax.MemberExpression,
                            computed: false,
                            object: {
                                type: syntax_1.Syntax.Identifier,
                                name: MATHSCRIPT_NAMESPACE
                            },
                            property: {
                                type: syntax_1.Syntax.Identifier,
                                name: unaryOp[unaryExpr.operator]
                            }
                        };
                        visit(unaryExpr.argument, options);
                        callExpr.arguments = [unaryExpr.argument];
                    }
                    else {
                        visit(unaryExpr.argument, options);
                    }
                    break;
                }
                case syntax_1.Syntax.UpdateExpression: {
                    var updateExpr = node;
                    var callExpr = node;
                    if (updateExpr.operator && unaryOp[updateExpr.operator]) {
                        callExpr.type = syntax_1.Syntax.CallExpression;
                        callExpr.callee = {
                            type: syntax_1.Syntax.MemberExpression,
                            computed: false,
                            object: {
                                type: syntax_1.Syntax.Identifier,
                                name: MATHSCRIPT_NAMESPACE
                            },
                            property: {
                                type: syntax_1.Syntax.Identifier,
                                name: unaryOp[updateExpr.operator]
                            }
                        };
                        visit(updateExpr.argument, options);
                        callExpr.arguments = [updateExpr.argument];
                    }
                    else {
                        visit(updateExpr.argument, options);
                    }
                    break;
                }
                case syntax_1.Syntax.Property: {
                    var prop = node;
                    visit(prop.key, options);
                    visit(prop.value, options);
                    break;
                }
                case syntax_1.Syntax.WhileStatement: {
                    var whileStmt = node;
                    visit(whileStmt.test, options);
                    visit(whileStmt.body, options);
                    break;
                }
                case syntax_1.Syntax.BreakStatement:
                case syntax_1.Syntax.EmptyStatement:
                case syntax_1.Syntax.Literal:
                case syntax_1.Syntax.Identifier:
                case syntax_1.Syntax.ThisExpression:
                case syntax_1.Syntax.DebuggerStatement: {
                    break;
                }
                default: {
                    console.log(JSON.stringify(node, null, 2));
                }
            }
        }
        else {
            return;
        }
    }
    function specialMethod(x, name) {
        return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
    }
    function binEval(lhs, rhs, lprop, rprop, fallback) {
        var result;
        if (specialMethod(lhs, lprop)) {
            result = lhs[lprop](rhs);
            if (typeof result !== 'undefined') {
                return result;
            }
            else {
                if (specialMethod(rhs, rprop)) {
                    result = rhs[rprop](lhs);
                    if (typeof result !== 'undefined') {
                        return result;
                    }
                }
            }
        }
        else if (specialMethod(rhs, rprop)) {
            result = rhs[rprop](lhs);
            if (typeof result !== 'undefined') {
                return result;
            }
        }
        return fallback(lhs, rhs);
    }
    function add(p, q) { return binEval(p, q, '__add__', '__radd__', function (a, b) { return a + b; }); }
    function sub(p, q) { return binEval(p, q, '__sub__', '__rsub__', function (a, b) { return a - b; }); }
    function mul(p, q) { return binEval(p, q, '__mul__', '__rmul__', function (a, b) { return a * b; }); }
    function div(p, q) { return binEval(p, q, '__div__', '__rdiv__', function (a, b) { return a / b; }); }
    function mod(p, q) { return binEval(p, q, '__mod__', '__rmod__', function (a, b) { return a % b; }); }
    function bitwiseIOR(p, q) { return binEval(p, q, '__vbar__', '__rvbar__', function (a, b) { return a | b; }); }
    function bitwiseXOR(p, q) { return binEval(p, q, '__wedge__', '__rwedge__', function (a, b) { return a ^ b; }); }
    function lshift(p, q) { return binEval(p, q, '__lshift__', '__rlshift__', function (a, b) { return a << b; }); }
    function rshift(p, q) { return binEval(p, q, '__rshift__', '__rrshift__', function (a, b) { return a >> b; }); }
    function eq(p, q) { return binEval(p, q, '__eq__', '__req__', function (a, b) { return a === b; }); }
    function ne(p, q) { return binEval(p, q, '__ne__', '__rne__', function (a, b) { return a !== b; }); }
    function ge(p, q) { return binEval(p, q, '__ge__', '__rge__', function (a, b) { return a >= b; }); }
    function gt(p, q) { return binEval(p, q, '__gt__', '__rgt__', function (a, b) { return a > b; }); }
    function le(p, q) { return binEval(p, q, '__le__', '__rle__', function (a, b) { return a <= b; }); }
    function lt(p, q) { return binEval(p, q, '__lt__', '__rlt__', function (a, b) { return a < b; }); }
    function exp(x) {
        if (specialMethod(x, '__exp__')) {
            return x['__exp__']();
        }
        else {
            var s = x;
            var result = Math.exp(s);
            return result;
        }
    }
    function neg(x) {
        if (specialMethod(x, '__neg__')) {
            return x['__neg__']();
        }
        else {
            return -x;
        }
    }
    function pos(x) {
        if (specialMethod(x, '__pos__')) {
            return x['__pos__']();
        }
        else {
            return +x;
        }
    }
    function bang(x) {
        if (specialMethod(x, '__bang__')) {
            return x['__bang__']();
        }
        else {
            return !x;
        }
    }
    function tilde(x) {
        if (specialMethod(x, '__tilde__')) {
            return x['__tilde__']();
        }
        else {
            return ~x;
        }
    }
    function parse(code, options, delegate) {
        return esprima_1.parse(code, options, delegate);
    }
    exports_1("parse", parse);
    function parseScript(code, options, delegate) {
        return esprima_1.parseScript(code, options, delegate);
    }
    exports_1("parseScript", parseScript);
    function parseModule(code, options, delegate) {
        return esprima_1.parseModule(code, options, delegate);
    }
    exports_1("parseModule", parseModule);
    function tokenize(code, options, delegate) {
        return esprima_2.tokenize(code, options, delegate);
    }
    exports_1("tokenize", tokenize);
    var core_1, esprima_1, esprima_2, escodegen_1, generateRandomId_1, getLoopProtectorBlocks_1, syntax_1, MATHSCRIPT_NAMESPACE, binOp, unaryOp, Ms;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (esprima_1_1) {
                esprima_1 = esprima_1_1;
                esprima_2 = esprima_1_1;
            },
            function (escodegen_1_1) {
                escodegen_1 = escodegen_1_1;
            },
            function (generateRandomId_1_1) {
                generateRandomId_1 = generateRandomId_1_1;
            },
            function (getLoopProtectorBlocks_1_1) {
                getLoopProtectorBlocks_1 = getLoopProtectorBlocks_1_1;
            },
            function (syntax_1_1) {
                syntax_1 = syntax_1_1;
                exports_1({
                    "Syntax": syntax_1_1["Syntax"]
                });
            }
        ],
        execute: function () {
            MATHSCRIPT_NAMESPACE = "Ms";
            binOp = {
                '+': 'add',
                '-': 'sub',
                '*': 'mul',
                '/': 'div',
                '|': 'vbar',
                '^': 'wedge',
                '<<': 'lshift',
                '>>': 'rshift',
                '%': 'mod',
                '===': 'eq',
                '!==': 'ne',
                '>': 'gt',
                '>=': 'ge',
                '<': 'lt',
                '<=': 'le'
            };
            unaryOp = {
                '+': 'pos',
                '-': 'neg',
                '!': 'bang',
                '~': 'tilde'
            };
            exports_1("Ms", Ms = {
                'VERSION': core_1.VERSION,
                parse: esprima_1.parse,
                transpile: transpile,
                add: add,
                sub: sub,
                mul: mul,
                div: div,
                vbar: bitwiseIOR,
                wedge: bitwiseXOR,
                lshift: lshift,
                rshift: rshift,
                mod: mod,
                eq: eq,
                ne: ne,
                ge: ge,
                gt: gt,
                le: le,
                lt: lt,
                neg: neg,
                pos: pos,
                bang: bang,
                tilde: tilde,
                exp: exp
            });
            exports_1("default", Ms);
        }
    };
});
