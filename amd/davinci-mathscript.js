define(["require", "exports", 'davinci-mathscript/core', 'davinci-mathscript/esprima', 'davinci-mathscript/escodegen'], function (require, exports, core, esprima, escodegen) {
    /**
     * Provides the MathScript module
     *
     * @module mathscript
     */
    // This should match the global namespace (in build.js).
    var MATHSCRIPT_NAMESPACE = "Ms";
    var binOp = {
        '+': 'add',
        '-': 'sub',
        '*': 'mul',
        '/': 'div',
        '^': 'wedge',
        '<<': 'lshift',
        '>>': 'rshift',
        '===': 'eq',
        '!=': 'ne',
        '<': 'lt',
        '<=': 'le',
        '>': 'gt',
        '>=': 'ge'
    };
    var unaryOp = { '+': 'pos', '-': 'neg', '!': 'bang', '~': 'tilde' };
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
        switch (node.type) {
            case 'BlockStatement':
                {
                    node.body.forEach(function (node, index) {
                        visit(node);
                    });
                }
                break;
            case 'FunctionDeclaration':
                {
                    node.params.forEach(function (param, index) {
                        visit(param);
                    });
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
                    node.declarations.forEach(function (declaration, index) {
                        visit(declaration);
                    });
                }
                break;
            case 'VariableDeclarator':
                {
                    if (node.init) {
                        visit(node.init);
                    }
                }
                break;
            case 'BinaryExpression':
                {
                    if (node.operator && binOp[node.operator]) {
                        node.type = 'CallExpression';
                        node.callee = {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': { 'type': 'Identifier', 'name': MATHSCRIPT_NAMESPACE },
                            'property': { 'type': 'Identifier', 'name': binOp[node.operator] }
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
            case 'AssignmentExpression':
                {
                    if (node.operator && binOp[node.operator]) {
                        var rightOld = node.right;
                        node.right = {
                            'type': 'BinaryExpression',
                            'operator': node.operator.replace(/=/, '').trim(),
                            'left': node.left,
                            'right': rightOld
                        };
                        node.operator = '=';
                        visit(node.left);
                        visit(node.right);
                    }
                    else {
                        visit(node.right);
                    }
                }
                break;
            case 'CallExpression':
                {
                    visit(node.callee);
                    node['arguments'].forEach(function (argument, index) {
                        visit(argument);
                    });
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
                    node['arguments'].forEach(function (argument, index) {
                        visit(argument);
                    });
                }
                break;
            case 'ReturnStatement':
                {
                    visit(node.argument);
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
            case 'Literal':
            case 'Identifier':
            case 'ThisExpression':
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
                }
            }
        }
        else if (rhs['__radd__']) {
            result = rhs.__radd__(lhs);
            if (typeof result !== 'undefined') {
                return result;
            }
        }
        // Fallback to JavaScript '+'' in order to support string concatenation, etc.
        return lhs + rhs;
    }
    var Ms = {
        'VERSION': core.VERSION,
        parse: parse,
        transpile: transpile,
        add: add
    };
    return Ms;
});
