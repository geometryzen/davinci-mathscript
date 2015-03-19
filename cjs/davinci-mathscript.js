var core = require('davinci-mathscript/core');
var esprima = require('davinci-mathscript/esprima');
var escodegen = require('davinci-mathscript/escodegen');
/**
 * Provides the MathScript module
 *
 * @module mathscript
 */
// This should match the global namespace (in build.js).
var MATHSCRIPT_NAMESPACE = "Ms";
var funcNames = {
    '+': 'add',
    '*': 'mul',
    '<<': 'lco'
};
function transform(code, options) {
    var tree = esprima.parse(code, options);
    visit(tree);
    return escodegen.generate(tree, null);
}
function visit(node) {
    switch (node.type) {
        case 'Program':
            {
                node.body.forEach(function (node, index) {
                    visit(node);
                });
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
        case 'Literal':
        case 'Identifier':
            break;
        default: {
            console.log(JSON.stringify(node));
        }
    }
}
function add(lhs, rhs) {
    return lhs + rhs;
}
var Ms = {
    'VERSION': core.VERSION,
    transform: transform,
    add: add
};
module.exports = Ms;
