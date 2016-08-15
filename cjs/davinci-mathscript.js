"use strict";
var core_1 = require('./davinci-mathscript/core');
var esprima_1 = require('./davinci-mathscript/esprima');
var escodegen_1 = require('./davinci-mathscript/escodegen');
/**
 * Provides the MathScript module
 *
 * @module mathscript
 */
// This should match the global namespace (in build.js).
var MATHSCRIPT_NAMESPACE = "Ms";
// We're not really interested in those operators to do with ordering because many
// interesting mathematical structures don't have an ordering relation.
// In the following table, the first string is the operator symbol and the second
// string is the name of the function in the MATHSCRIPT_NAMESPACE.
var binOp = {
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
// The increment and decrement operators are problematic from a timing perspective.
var unaryOp = {
    '+': 'pos',
    '-': 'neg',
    '!': 'bang',
    '~': 'tilde' /*,'++':'increment','--':'decrement'*/
};
function parse(code, options) {
    var tree = esprima_1.esprimaParse(code, options);
    //console.log(JSON.stringify(tree), null, '\t');
    visit(tree);
    return tree;
}
function transpile(code, options) {
    var tree = parse(code, options);
    return escodegen_1.generate(tree, null);
}
function visit(node) {
    if (node && node.type) {
        switch (node.type) {
            case 'BlockStatement':
                {
                    node.body.forEach(function (part, index) { visit(part); });
                }
                break;
            case 'FunctionDeclaration':
                {
                    node.params.forEach(function (param, index) { visit(param); });
                    visit(node.body);
                }
                break;
            case 'Program':
                {
                    node.body.forEach(function (node, index) {
                        visit(node);
                    });
                }
                break;
            case 'VariableDeclaration':
                {
                    node.declarations.forEach(function (declaration, index) { visit(declaration); });
                }
                break;
            case 'VariableDeclarator':
                {
                    if (node.init) {
                        visit(node.init);
                    }
                }
                break;
            case 'ConditionalExpression':
                {
                    visit(node.test);
                    visit(node.consequent);
                    visit(node.alternate);
                }
                break;
            case 'BinaryExpression':
            case 'LogicalExpression':
                {
                    if (node.operator && binOp[node.operator]) {
                        node.type = 'CallExpression';
                        node.callee = {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': { 'type': 'Identifier', 'name': MATHSCRIPT_NAMESPACE },
                            'property': {
                                'type': 'Identifier', 'name': binOp[node.operator]
                            }
                        };
                        visit(node.left);
                        visit(node.right);
                        node['arguments'] = [node.left, node.right];
                    }
                    else {
                        visit(node.left);
                        visit(node.right);
                    }
                }
                break;
            case 'ExpressionStatement':
                {
                    visit(node.expression);
                }
                break;
            case 'ForStatement':
                {
                    visit(node.init);
                    visit(node.test);
                    visit(node.update);
                    visit(node.body);
                }
                break;
            case 'ForInStatement':
                {
                    visit(node.left);
                    visit(node.right);
                    visit(node.body);
                }
                break;
            case 'IfStatement':
                {
                    visit(node.test);
                    visit(node.consequent);
                    visit(node.alternate);
                }
                break;
            case 'ArrayExpression':
                {
                    node['elements'].forEach(function (elem, index) { visit(elem); });
                }
                break;
            case 'AssignmentExpression':
                {
                    if (node.operator && binOp[node.operator]) {
                        visit(node.left);
                        visit(node.right);
                    }
                    else {
                        visit(node.left);
                        visit(node.right);
                    }
                }
                break;
            case 'CallExpression':
                {
                    visit(node.callee);
                    node['arguments'].forEach(function (argument, index) { visit(argument); });
                }
                break;
            case 'CatchClause':
                {
                    visit(node.param);
                    visit(node.body);
                }
                break;
            case 'FunctionExpression':
                {
                    visit(node.body);
                }
                break;
            case 'MemberExpression':
                {
                    visit(node.object);
                }
                break;
            case 'NewExpression':
                {
                    visit(node.callee);
                    node['arguments'].forEach(function (argument, index) { visit(argument); });
                }
                break;
            case 'ObjectExpression':
                {
                    node['properties'].forEach(function (prop, index) { visit(prop); });
                }
                break;
            case 'ReturnStatement':
                {
                    visit(node.argument);
                }
                break;
            case 'SequenceExpression':
                {
                    node['expressions'].forEach(function (expr, index) { visit(expr); });
                }
                break;
            case 'SwitchCase':
                {
                    visit(node.test);
                    node['consequent'].forEach(function (expr, index) { visit(expr); });
                }
                break;
            case 'SwitchStatement':
                {
                    visit(node.discriminant);
                    node['cases'].forEach(function (kase, index) { visit(kase); });
                }
                break;
            case 'ThrowStatement':
                {
                    visit(node.argument);
                }
                break;
            case 'TryStatement':
                {
                    visit(node.block);
                    node['guardedHandlers'].forEach(function (guardedHandler, index) { visit(guardedHandler); });
                    node['handlers'].forEach(function (handler, index) { visit(handler); });
                    visit(node.finalizer);
                }
                break;
            case 'UnaryExpression':
                {
                    if (node.operator && unaryOp[node.operator]) {
                        node.type = 'CallExpression';
                        node.callee = {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': {
                                'type': 'Identifier',
                                'name': MATHSCRIPT_NAMESPACE
                            },
                            'property': {
                                'type': 'Identifier',
                                'name': unaryOp[node.operator]
                            }
                        };
                        visit(node.argument);
                        node['arguments'] = [node.argument];
                    }
                    else {
                        visit(node.argument);
                    }
                }
                break;
            case 'UpdateExpression':
                {
                    if (node.operator && unaryOp[node.operator]) {
                        node.type = 'CallExpression';
                        node.callee =
                            {
                                'type': 'MemberExpression',
                                'computed': false,
                                'object': {
                                    'type': 'Identifier',
                                    'name': MATHSCRIPT_NAMESPACE
                                },
                                'property': {
                                    'type': 'Identifier',
                                    'name': unaryOp[node.operator]
                                }
                            };
                        visit(node.argument);
                        node['arguments'] = [node.argument];
                    }
                    else {
                        visit(node.argument);
                    }
                }
                break;
            case 'Property':
                {
                    visit(node.key);
                    visit(node.value);
                }
                break;
            case 'WhileStatement':
                {
                    visit(node.test);
                    visit(node.body);
                }
                break;
            case 'BreakStatement':
            case 'EmptyStatement':
            case 'Literal':
            case 'Identifier':
            case 'ThisExpression':
            case 'DebuggerStatement':
                break;
            default: {
                console.log(JSON.stringify(node, null, 2));
            }
        }
    }
    else {
        return;
    }
}
/**
 * Determines whether a property name is callable on an object.
 */
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
    // The fallback is for native types.
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
var Ms = {
    'VERSION': core_1.VERSION,
    parse: parse,
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
};
module.exports = Ms;
