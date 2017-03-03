import { VERSION } from './core';
import { parse as esprimaParse, parseScript as esprimaParseScript, parseModule as esprimaParseModule } from './esprima';
import { tokenize as esprimaTokenize } from './esprima';
import { generate } from './escodegen';
import { Statement } from './nodes';
import { BlockStatement } from './nodes';
import { FunctionDeclaration } from './nodes';
import { VariableDeclaration } from './nodes';
import { VariableDeclarator } from './nodes';
import { ConditionalExpression } from './nodes';
import { BinaryExpression } from './nodes';
import { CallExpression } from './nodes';
import { ExpressionStatement } from './nodes';
import { ForStatement } from './nodes';
import { ForInStatement } from './nodes';
import { IfStatement } from './nodes';
import { ArrayExpression } from './nodes';
import { AssignmentExpression } from './nodes';
import { CatchClause } from './nodes';
import { FunctionExpression } from './nodes';
import { StaticMemberExpression } from './nodes';
import { ComputedMemberExpression } from './nodes';
import { ObjectExpression } from './nodes';
import { ReturnStatement } from './nodes';
import { NewExpression } from './nodes';
import { SequenceExpression } from './nodes';
import { SwitchCase } from './nodes';
import { SwitchStatement } from './nodes';
import { ThrowStatement } from './nodes';
import { TryStatement } from './nodes';
import { UnaryExpression } from './nodes';
import { UpdateExpression } from './nodes';
import { Property } from './nodes';
import { WhileStatement } from './nodes';
import { Script } from './nodes';
import { Syntax } from './syntax';

/**
 * Provides the MathScript module
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
    '~': 'tilde'/*,'++':'increment','--':'decrement'*/
};

function transpileTree(code, options) {
    var tree = esprimaParse(code, options, void 0);
    // console.log(JSON.stringify(tree), null, '\t');
    visit(tree);
    return tree;
}

function transpile(code, options) {
    var tree = transpileTree(code, options);
    return generate(tree, null);
}

function visit(node: { type: string } | null) {
    if (node && node.type) {
        switch (node.type) {
            case Syntax.BlockStatement: {
                const block = <BlockStatement>node;
                block.body.forEach(function (part, index) { visit(part); });
                break;
            }
            case Syntax.FunctionDeclaration: {
                const funcDecl = <FunctionDeclaration>node;
                funcDecl.params.forEach(function (param, index) { visit(param); });
                visit(funcDecl.body);
                break;
            }
            case Syntax.Program: {
                const script = <Script>node;
                script.body.forEach(function (node, index) {
                    visit(node);
                });
                break;
            }
            case Syntax.VariableDeclaration: {
                const varDeclaration = <VariableDeclaration>node;
                varDeclaration.declarations.forEach(function (declaration, index) { visit(declaration); });
                break;
            }
            case Syntax.VariableDeclarator: {
                const varDeclarator = <VariableDeclarator>node;
                if (varDeclarator.init) {
                    visit(varDeclarator.init);
                }
                break;
            }
            case Syntax.ConditionalExpression: {
                const condExpr = <ConditionalExpression>node;
                visit(condExpr.test);
                visit(condExpr.consequent);
                visit(condExpr.alternate);
                break;
            }
            case Syntax.BinaryExpression:
            case Syntax.LogicalExpression: {
                const binExpr = <BinaryExpression>node;
                const callExpr = <CallExpression>node;
                if (binExpr.operator && binOp[binExpr.operator]) {
                    callExpr.type = Syntax.CallExpression;
                    callExpr.callee = {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object: { type: Syntax.Identifier, name: MATHSCRIPT_NAMESPACE },
                        property: {
                            type: Syntax.Identifier, name: binOp[binExpr.operator]
                        }
                    };
                    visit(binExpr.left);
                    visit(binExpr.right);
                    callExpr.arguments = [binExpr.left, binExpr.right];
                }
                else {
                    visit(binExpr.left);
                    visit(binExpr.right);
                }
                break;
            }
            case Syntax.ExpressionStatement: {
                const exprStmt = <ExpressionStatement>node;
                visit(exprStmt.expression);
                break;
            }
            case Syntax.ForStatement: {
                const forStmt = <ForStatement>node;
                visit(forStmt.init);
                visit(forStmt.test);
                visit(forStmt.update);
                visit(forStmt.body);
                break;
            }
            case Syntax.ForInStatement: {
                const forIn = <ForInStatement>node;
                visit(forIn.left);
                visit(forIn.right);
                visit(forIn.body);
                break;
            }
            case Syntax.IfStatement: {
                const ifStmt = <IfStatement>node;
                visit(ifStmt.test);
                visit(ifStmt.consequent);
                visit(ifStmt.alternate);
                break;
            }
            case Syntax.ArrayExpression: {
                const arrayExpr = <ArrayExpression>node;
                arrayExpr.elements.forEach(function (elem, index) { visit(elem); });
                break;
            }
            case Syntax.AssignmentExpression: {
                const assignExpr = <AssignmentExpression>node;
                if (assignExpr.operator && binOp[assignExpr.operator]) {
                    visit(assignExpr.left);
                    visit(assignExpr.right);
                }
                else {
                    visit(assignExpr.left);
                    visit(assignExpr.right);
                }
                break;
            }
            case Syntax.CallExpression: {
                const callExpr = <CallExpression>node;
                visit(callExpr.callee);
                callExpr.arguments.forEach(function (argument, index) { visit(argument); });
                break;
            }
            case Syntax.CatchClause: {
                const catchClause = <CatchClause>node;
                visit(catchClause.param);
                visit(catchClause.body);
                break;
            }
            case Syntax.FunctionExpression: {
                const funcExpr = <FunctionExpression>node;
                visit(funcExpr.body);
                break;
            }
            case Syntax.MemberExpression: {
                const staticMemberExpr = <StaticMemberExpression>node;
                visit(staticMemberExpr.object);
                break;
            }
            // TODO: Problem?
            case Syntax.MemberExpression: {
                const computedMemberExpr = <ComputedMemberExpression>node;
                visit(computedMemberExpr.object);
                break;
            }
            case Syntax.NewExpression: {
                const newExpr = <NewExpression>node;
                visit(newExpr.callee);
                newExpr.arguments.forEach(function (argument, index) { visit(argument); });
                break;
            }
            case Syntax.ObjectExpression: {
                const objExpr = <ObjectExpression>node;
                objExpr.properties.forEach(function (prop, index) { visit(prop); });
                break;
            }
            case Syntax.ReturnStatement: {
                const returnStmt = <ReturnStatement>node;
                visit(returnStmt.argument);
                break;
            }
            case Syntax.SequenceExpression: {
                const seqExpr = <SequenceExpression>node;
                seqExpr.expressions.forEach(function (expr, index) { visit(expr); });
                break;
            }
            case Syntax.SwitchCase: {
                const switchCase = <SwitchCase>node;
                visit(switchCase.test);
                switchCase.consequent.forEach(function (expr, index) { visit(expr); });
                break;
            }
            case Syntax.SwitchStatement: {
                const switchStmt = <SwitchStatement>node;
                visit(switchStmt.discriminant);
                switchStmt.cases.forEach(function (kase, index) { visit(kase); });
                break;
            }
            case Syntax.ThrowStatement: {
                const throwStmt = <ThrowStatement>node;
                visit(throwStmt.argument);
                break;
            }
            case Syntax.TryStatement: {
                const tryStmt = <TryStatement>node;
                visit(tryStmt.block);
                visit(tryStmt.handler);
                visit(tryStmt.finalizer);
                break;
            }
            case Syntax.UnaryExpression: {
                const unaryExpr = <UnaryExpression>node;
                const callExpr = <CallExpression>node;
                if (unaryExpr.operator && unaryOp[unaryExpr.operator]) {
                    callExpr.type = Syntax.CallExpression;
                    callExpr.callee = {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object: {
                            type: Syntax.Identifier,
                            name: MATHSCRIPT_NAMESPACE
                        },
                        property: {
                            type: Syntax.Identifier,
                            name: unaryOp[unaryExpr.operator]
                        }
                    };
                    visit(unaryExpr.argument);
                    callExpr.arguments = [unaryExpr.argument];
                }
                else {
                    visit(unaryExpr.argument);
                }
                break;
            }
            case Syntax.UpdateExpression: {
                const updateExpr = <UpdateExpression>node;
                const callExpr = <CallExpression>node;
                if (updateExpr.operator && unaryOp[updateExpr.operator]) {
                    callExpr.type = Syntax.CallExpression;
                    callExpr.callee = {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object:
                        {
                            type: Syntax.Identifier,
                            name: MATHSCRIPT_NAMESPACE
                        },
                        property:
                        {
                            type: Syntax.Identifier,
                            name: unaryOp[updateExpr.operator]
                        }
                    };
                    visit(updateExpr.argument);
                    callExpr.arguments = [updateExpr.argument];
                }
                else {
                    visit(updateExpr.argument);
                }
                break;
            }
            case Syntax.Property: {
                const prop = <Property>node;
                visit(prop.key);
                visit(prop.value);
                break;
            }
            case Syntax.WhileStatement: {
                const whileStmt = <WhileStatement>node;
                visit(whileStmt.test);
                visit(whileStmt.body);
                break;
            }
            case Syntax.BreakStatement:
            case Syntax.EmptyStatement:
            case Syntax.Literal:
            case Syntax.Identifier:
            case Syntax.ThisExpression:
            case Syntax.DebuggerStatement: {
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

/**
 * Determines whether a property name is callable on an object.
 */
function specialMethod(x, name: string) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
}

function binEval(lhs, rhs, lprop: string, rprop: string, fallback) {
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

function exp<T>(x: T): T {
    if (specialMethod(x, '__exp__')) {
        return x['__exp__']();
    }
    else {
        var s: any = x;
        var result: any = Math.exp(s);
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

function tilde<T>(x: T): T {
    if (specialMethod(x, '__tilde__')) {
        return x['__tilde__']();
    }
    else {
        return <any>~x;
    }
}

export const Ms = {
    'VERSION': VERSION,
    parse: esprimaParse,
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

// For compatibility with esprima tests.
export function parse(code, options, delegate) {
    return esprimaParse(code, options, delegate);
}

export function parseScript(code, options, delegate) {
    return esprimaParseScript(code, options, delegate);
}

export function parseModule(code, options, delegate) {
    return esprimaParseModule(code, options, delegate);
}

export function tokenize(code, options, delegate) {
    return esprimaTokenize(code, options, delegate);
}
export { Syntax } from './syntax';

export default Ms;
