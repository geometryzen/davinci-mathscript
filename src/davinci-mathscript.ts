import core = require('davinci-mathscript/core');
import esprima = require('davinci-mathscript/esprima');
import escodegen = require('davinci-mathscript/escodegen');
import estraverse = require('davinci-mathscript/estraverse');
import esutils = require('davinci-mathscript/esutils');

/**
 * Provides the MathScript module
 *
 * @module mathscript
 */

// This should match the global namespace (in build.js).
var MATHSCRIPT_NAMESPACE = "Ms";

// We're not really interested in those operators do do with ordering because most
// interesting mathematical types don't have an ordering relation.
var binOp =
{
  '+':'add',
  '-':'sub',
  '*':'mul',
  '/':'div',
  '^':'wedge',
  '<<':'lshift',
  '>>':'rshift',
  '===':'eq',
  '!==':'ne'
};

// The increment and decrement operators are problematic from a timing perspective.
var unaryOp = {'+':'pos','-':'neg','!':'bang','~':'tilde'/*,'++':'increment','--':'decrement'*/};

function parse(code, options) {
  var tree = esprima.parse(code, options);
//console.log(JSON.stringify(tree), null, '\t');
  visit(tree);
  return tree;
}

function transpile(code, options) {
  var tree = parse(code, options);
  return escodegen.generate(tree, null);
}

function visit(node) {
  if (node && node.type) {
    switch(node.type) {
      case 'BlockStatement': {
        node.body.forEach(function(part, index) { visit(part); });
      }
      break;
      case 'FunctionDeclaration': {
        node.params.forEach(function(param, index) { visit(param); });
        visit(node.body);
      }
      break;
      case 'Program': {
        node.body.forEach(function(node, index) {
          visit(node);
        });
      }
      break;
      case 'VariableDeclaration': {
        node.declarations.forEach(function(declaration, index) { visit(declaration); });
      }
      break;
      case 'VariableDeclarator': {
        if (node.init) {
          visit(node.init);
        }
      }
      break;
      case 'BinaryExpression':
      {
        if (node.operator && binOp[node.operator])
        {
            node.type = 'CallExpression';
            node.callee = {
                'type': 'MemberExpression',
                'computed': false,
                'object': {'type':'Identifier', 'name': MATHSCRIPT_NAMESPACE},
                'property': {'type': 'Identifier', 'name': binOp[node.operator]
                }
            };
            visit(node.left);
            visit(node.right);
            node['arguments'] = [node.left, node.right];
        }
        else
        {
            visit(node.left);
            visit(node.right);
        }
      }
      break;
      case 'ExpressionStatement': {
        visit(node.expression);
      }
      break;
      case 'ForStatement': {
        visit(node.init);
        visit(node.test);
        visit(node.update);
        visit(node.body);
      }
      break;
      case 'IfStatement': {
        visit(node.test);
        visit(node.consequent);
        visit(node.alternate);
      }
      break;
      case 'AssignmentExpression':
      {
        if (node.operator && binOp[node.operator])
        {
            visit(node.left);
            visit(node.right);
        }
        else
        {
            visit(node.left);
            visit(node.right);
        }
      }
      break;
      case 'CallExpression': {
        visit(node.callee);
        node['arguments'].forEach(function(argument, index) { visit(argument); });
      }
      break;
      case 'FunctionExpression': {
        visit(node.body);
      }
      break;
      case 'MemberExpression': {
        visit(node.object);
      }
      break;
      case 'NewExpression': {
        visit(node.callee);
        node['arguments'].forEach(function(argument, index) { visit(argument); });
      }
      break;
      case 'ReturnStatement': {
        visit(node.argument);
      }
      break;
      case 'UnaryExpression': {
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
        } else {
            visit(node.argument);
        }
      }
      break;
      case 'UpdateExpression':
      {
        if (node.operator && unaryOp[node.operator])
        {
            node.type = 'CallExpression';
            node.callee =
            {
                'type': 'MemberExpression',
                'computed': false,
                'object':
                {
                    'type': 'Identifier',
                    'name': MATHSCRIPT_NAMESPACE
                },
                'property':
                {
                    'type': 'Identifier',
                    'name': unaryOp[node.operator]
                }
            };
            visit(node.argument);
            node['arguments'] = [node.argument];
        }
        else
        {
            visit(node.argument);
        }
      }
      break;
      case 'Literal':
      case 'Identifier':
      case 'ThisExpression':
        break;
      default: {
        console.log(JSON.stringify(node));
      }
    }
  }
  else {
    return;
  }
}

function binEval(lhs, rhs, lprop: string, rprop: string, fallback) {
  var result;
  if (lhs[lprop]) {
    result = lhs[lprop](rhs);
    if (typeof result !== 'undefined') {
      return result;
    }
    else {
      if (rhs[rprop]) {
        result = rhs[rprop](lhs);
        if (typeof result !== 'undefined') {
          return result;
        }
      }
    }
  }
  else if (rhs[rprop]) {
    result = rhs[rprop](lhs);
    if (typeof result !== 'undefined') {
      return result;
    }
  }
  return fallback(lhs, rhs);
}

function add(p,q) {return binEval(p,q,'__add__','__radd__',function(a,b){return a+b});}
function sub(p,q) {return binEval(p,q,'__sub__','__rsub__',function(a,b){return a-b});}
function mul(p,q) {return binEval(p,q,'__mul__','__rmul__',function(a,b){return a*b});}
function div(p,q) {return binEval(p,q,'__div__','__rdiv__',function(a,b){return a/b});}
function wedge(p,q) {return binEval(p,q,'__wedge__','__rwedge__',function(a,b){return a^b});}
function lshift(p,q) {return binEval(p,q,'__lshift__','__rlshift__',function(a,b){return a<<b});}
function rshift(p,q) {return binEval(p,q,'__rshift__','__rrshift__',function(a,b){return a>>b});}
function eq(p,q) {return binEval(p,q,'__eq__','__req__',function(a,b){return a===b});}
function ne(p,q) {return binEval(p,q,'__ne__','__rne__',function(a,b){return a!==b});}
function lt(p,q) {return binEval(p,q,'__lt__','__rlt__',function(a,b){return a<b});}
function le(p,q) {return binEval(p,q,'__le__','__rle__',function(a,b){return a<=b});}
function gt(p,q) {return binEval(p,q,'__gt__','__rgt__',function(a,b){return a>b});}
function ge(p,q) {return binEval(p,q,'__ge__','__rge__',function(a,b){return a>=b});}

function neg(x) {
  if (x['__neg__']) {
    return x['__neg__']();
  }
  else {
    return -x;
  }
}

function pos(x) {
  if (x['__pos__']) {
    return x['__pos__']();
  }
  else {
    return +x;
  }
}

function bang(x) {
  if (x['__bang__']) {
    return x['__bang__']();
  }
  else {
    return !x;
  }
}

function tilde(x) {
  if (x['__tilde__']) {
    return x['__tilde__']();
  }
  else {
    return ~x;
  }
}
var Ms = {
    'VERSION': core.VERSION,
    parse: parse,
    transpile: transpile,

    add: add,
    sub: sub,
    mul: mul,
    div: div,
    wedge: wedge,
    lshift: lshift,
    rshift: rshift,

    eq: eq,
    ne: ne,
    lt: lt,
    le: le,
    gt: gt,
    ge: ge,

    neg: neg,
    pos: pos,
    bang: bang,
    tilde: tilde
};
export = Ms;