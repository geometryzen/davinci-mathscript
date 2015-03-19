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

var funcNames = {
  '+':  'add',
  '*':  'mul',
  '<<': 'lco'
};

function transform(code, options) {
  var tree = esprima.parse(code, options);
  visit(tree);
  return escodegen.generate(tree, null);
}

function visit(node) {
  switch(node.type) {
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
      visit(node.init);
    }
    break;
    case 'BinaryExpression':
    case 'LogicalExpression':
    {
      if (node.operator && funcNames[node.operator]) {
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
                  'name': funcNames[node.operator]
              }
          };
          visit(node.left);
          visit(node.right);
          node['arguments'] = [node.left, node.right];
      } else {
          visit(node.left);
          visit(node.right);
      }
    }
    break;
    case 'ExpressionStatement': {
      visit(node.expression);
    }
    break;
    case 'CallExpression': {
      node['arguments'].forEach(function(argument, index) { visit(argument); });
    }
    break;
    case 'Literal':
    case 'Identifier':
      break;
    default: {
      console.log(JSON.stringify(node));
    }
  }
}

function add(lhs, rhs) {
  var result;
  if (typeof lhs === 'number' && typeof rhs === 'number') {
    return lhs + rhs;
  }
  else if (lhs['__add__']) {
    result = lhs.__add__(rhs);
    if (typeof result !== 'undefined') {
      return result;
    }
    else {
      if (rhs['__radd__']) {
        result = rhs.__radd__(lhs);
        if (typeof result !== 'undefined') {
          return result;
        }
        else {
          throw new Error("+ is not supported for the operands given.");
        }
      }
      else {
        throw new Error("+ is not supported for the operands given.");
      }
    }
  }
  else if (rhs['__radd__']) {
    result = rhs.__radd__(lhs);
    if (typeof result !== 'undefined') {
      return result;
    }
    else {
      throw new Error("+ is not supported for the operands given.");
    }
  }
  else {
    throw new Error("+ is not supported for the operands given.");
  }
}

var Ms = {
    'VERSION': core.VERSION,
    transform: transform,
    add: add
};
export = Ms;