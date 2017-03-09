import { VERSION } from './core';
import { parse as esprimaParse, ParseOptions, parseScript as esprimaParseScript, parseModule as esprimaParseModule } from './esprima';
import { tokenize as esprimaTokenize } from './esprima';
import { generate } from './escodegen';
import generateRandomId from './generateRandomId';
import getLoopProtectorBlocks from './getLoopProtectorBlocks';
import { Statement } from './nodes';
import { StatementListItem } from './nodes';
import { BlockStatement } from './nodes';
import { FunctionDeclaration } from './nodes';
import { VariableDeclaration } from './nodes';
import { VariableDeclarator } from './nodes';
import { ConditionalExpression } from './nodes';
import { BinaryExpression } from './nodes';
import { CallExpression } from './nodes';
import { DoWhileStatement } from './nodes';
import { ExpressionStatement } from './nodes';
import { ForStatement } from './nodes';
import { ForInStatement } from './nodes';
import { Identifier } from './nodes';
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
const MATHSCRIPT_NAMESPACE = "Ms";

// const INFINITE_LOOP_TIMEOUT = 1000;

// We're not really interested in those operators to do with ordering because many
// interesting mathematical structures don't have an ordering relation.
// In the following table, the first string is the operator symbol and the second
// string is the name of the function in the MATHSCRIPT_NAMESPACE.
const binOp = {
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
const unaryOp = {
    '+': 'pos',
    '-': 'neg',
    '!': 'bang',
    '~': 'tilde'/*,'++':'increment','--':'decrement'*/
};

interface TranspileOptions extends ParseOptions {

}

function transpileTree(code: string, options?: TranspileOptions) {
    const tree = esprimaParse(code, options, void 0);
    // console.log(JSON.stringify(tree, null, 2));
    visit(tree, { timeout: 1000 });
    return tree;
}

/**
 * This is the function that we export.
 */
function transpile(code: string, options?: TranspileOptions) {
    const tree = transpileTree(code, options);
    const codeOut = generate(tree, null);
    // console.log(codeOut);
    return codeOut;
}

function addInfiniteLoopProtection(statements: StatementListItem[], millis: number): StatementListItem[] {
    for (let i = statements.length; i--;) {
        const el = statements[i];
        if (el && el.type === Syntax.ForStatement || el.type === Syntax.WhileStatement || el.type === Syntax.DoWhileStatement) {
            const loop = <ForStatement | WhileStatement | DoWhileStatement>el;
            const randomVariableName = '_' + generateRandomId(5);
            const insertionBlocks = getLoopProtectorBlocks(randomVariableName, millis);
            // Insert time variable assignment
            statements.splice(i, 0, insertionBlocks.before);
            // If the loop's body is a single statement, then convert it into a block statement
            // so that we can insert our conditional break inside it.
            if (!Array.isArray(loop.body)) {
                loop.body = {
                    body: [loop.body],
                    type: Syntax.BlockStatement
                };
            }
            const block = <BlockStatement>loop.body;
            // Insert IfStatement
            block.body.unshift(insertionBlocks.inside);
        }
    }
    return statements;
}

interface VisitOptions {
    timeout: number;
}

/**
 * This code performs the re-writing of the AST for operator overloading.
 */
function visit(node: { type: string } | null, options: VisitOptions) {
    if (node && node.type) {
        switch (node.type) {
            case Syntax.BlockStatement: {
                const block = <BlockStatement>node;
                addInfiniteLoopProtection(block.body, options.timeout).forEach(function (part, index) { visit(part, options); });
                break;
            }
            case Syntax.FunctionDeclaration: {
                const funcDecl = <FunctionDeclaration>node;
                funcDecl.params.forEach(function (param, index) { visit(param, options); });
                visit(funcDecl.body, options);
                break;
            }
            case Syntax.Program: {
                const script = <Script>node;
                addInfiniteLoopProtection(script.body, options.timeout).forEach(function (node, index) {
                    visit(node, options);
                });
                break;
            }
            case Syntax.VariableDeclaration: {
                const varDeclaration = <VariableDeclaration>node;
                varDeclaration.declarations.forEach(function (declaration, index) { visit(declaration, options); });
                break;
            }
            case Syntax.VariableDeclarator: {
                const varDeclarator = <VariableDeclarator>node;
                if (varDeclarator.init) {
                    visit(varDeclarator.init, options);
                }
                break;
            }
            case Syntax.ConditionalExpression: {
                const condExpr = <ConditionalExpression>node;
                visit(condExpr.test, options);
                visit(condExpr.consequent, options);
                visit(condExpr.alternate, options);
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
            case Syntax.ExpressionStatement: {
                const exprStmt = <ExpressionStatement>node;
                visit(exprStmt.expression, options);
                break;
            }
            case Syntax.ForStatement: {
                const forStmt = <ForStatement>node;
                visit(forStmt.init, options);
                visit(forStmt.test, options);
                visit(forStmt.update, options);
                visit(forStmt.body, options);
                break;
            }
            case Syntax.ForInStatement: {
                const forIn = <ForInStatement>node;
                visit(forIn.left, options);
                visit(forIn.right, options);
                visit(forIn.body, options);
                break;
            }
            case Syntax.IfStatement: {
                const ifStmt = <IfStatement>node;
                visit(ifStmt.test, options);
                visit(ifStmt.consequent, options);
                visit(ifStmt.alternate, options);
                break;
            }
            case Syntax.ArrayExpression: {
                const arrayExpr = <ArrayExpression>node;
                arrayExpr.elements.forEach(function (elem, index) { visit(elem, options); });
                break;
            }
            case Syntax.AssignmentExpression: {
                const assignExpr = <AssignmentExpression>node;
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
            case Syntax.CallExpression: {
                const callExpr = <CallExpression>node;
                visit(callExpr.callee, options);
                callExpr.arguments.forEach(function (argument, index) { visit(argument, options); });
                break;
            }
            case Syntax.CatchClause: {
                const catchClause = <CatchClause>node;
                visit(catchClause.param, options);
                visit(catchClause.body, options);
                break;
            }
            case Syntax.FunctionExpression: {
                const funcExpr = <FunctionExpression>node;
                visit(funcExpr.body, options);
                break;
            }
            case Syntax.MemberExpression: {
                const staticMemberExpr = <StaticMemberExpression>node;
                visit(staticMemberExpr.object, options);
                break;
            }
            // TODO: Problem?
            case Syntax.MemberExpression: {
                const computedMemberExpr = <ComputedMemberExpression>node;
                visit(computedMemberExpr.object, options);
                break;
            }
            case Syntax.NewExpression: {
                const newExpr = <NewExpression>node;
                visit(newExpr.callee, options);
                newExpr.arguments.forEach(function (argument, index) { visit(argument, options); });
                break;
            }
            case Syntax.ObjectExpression: {
                const objExpr = <ObjectExpression>node;
                objExpr.properties.forEach(function (prop, index) { visit(prop, options); });
                break;
            }
            case Syntax.ReturnStatement: {
                const returnStmt = <ReturnStatement>node;
                visit(returnStmt.argument, options);
                break;
            }
            case Syntax.SequenceExpression: {
                const seqExpr = <SequenceExpression>node;
                seqExpr.expressions.forEach(function (expr, index) { visit(expr, options); });
                break;
            }
            case Syntax.SwitchCase: {
                const switchCase = <SwitchCase>node;
                visit(switchCase.test, options);
                switchCase.consequent.forEach(function (expr, index) { visit(expr, options); });
                break;
            }
            case Syntax.SwitchStatement: {
                const switchStmt = <SwitchStatement>node;
                visit(switchStmt.discriminant, options);
                switchStmt.cases.forEach(function (kase, index) { visit(kase, options); });
                break;
            }
            case Syntax.ThrowStatement: {
                const throwStmt = <ThrowStatement>node;
                visit(throwStmt.argument, options);
                break;
            }
            case Syntax.TryStatement: {
                const tryStmt = <TryStatement>node;
                visit(tryStmt.block, options);
                visit(tryStmt.handler, options);
                visit(tryStmt.finalizer, options);
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
                    visit(unaryExpr.argument, options);
                    callExpr.arguments = [unaryExpr.argument];
                }
                else {
                    visit(unaryExpr.argument, options);
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
                    visit(updateExpr.argument, options);
                    callExpr.arguments = [updateExpr.argument];
                }
                else {
                    visit(updateExpr.argument, options);
                }
                break;
            }
            case Syntax.Property: {
                const prop = <Property>node;
                visit(prop.key, options);
                visit(prop.value, options);
                break;
            }
            case Syntax.WhileStatement: {
                const whileStmt = <WhileStatement>node;
                visit(whileStmt.test, options);
                visit(whileStmt.body, options);
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
