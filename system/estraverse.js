System.register([], function (exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    function ignoreJSHintError(what) {
    }
    function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                }
                else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }
    function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    function upperBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                len = diff;
            }
            else {
                i = current + 1;
                len -= diff + 1;
            }
        }
        return i;
    }
    function lowerBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                i = current + 1;
                len -= diff + 1;
            }
            else {
                len = diff;
            }
        }
        return i;
    }
    function extend(to, from) {
        var keys = objectKeys(from), key, i, len;
        for (i = 0, len = keys.length; i < len; i += 1) {
            key = keys[i];
            to[key] = from[key];
        }
        return to;
    }
    function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
    }
    function ElementNode(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
    }
    function Controller() {
    }
    function isNode(node) {
        if (node == null) {
            return false;
        }
        return typeof node === 'object' && typeof node.type === 'string';
    }
    function isProperty(nodeType, key) {
        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
    }
    function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
    }
    function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
    }
    function extendCommentRange(comment, tokens) {
        var target;
        target = upperBound(tokens, function search(token) {
            return token.range[0] > comment.range[0];
        });
        comment.extendedRange = [comment.range[0], comment.range[1]];
        if (target !== tokens.length) {
            comment.extendedRange[1] = tokens[target].range[0];
        }
        target -= 1;
        if (target >= 0) {
            comment.extendedRange[0] = tokens[target].range[1];
        }
        return comment;
    }
    function attachComments(tree, providedComments, tokens) {
        var comments = [], comment, len, i, cursor;
        if (!tree.range) {
            throw new Error('attachComments needs range information');
        }
        if (!tokens.length) {
            if (providedComments.length) {
                for (i = 0, len = providedComments.length; i < len; i += 1) {
                    comment = deepCopy(providedComments[i]);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                }
                tree.leadingComments = comments;
            }
            return tree;
        }
        for (i = 0, len = providedComments.length; i < len; i += 1) {
            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }
        cursor = 0;
        traverse(tree, {
            enter: function (node) {
                var comment;
                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                        break;
                    }
                    if (comment.extendedRange[1] === node.range[0]) {
                        if (!node.leadingComments) {
                            node.leadingComments = [];
                        }
                        node.leadingComments.push(comment);
                        comments.splice(cursor, 1);
                    }
                    else {
                        cursor += 1;
                    }
                }
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }
                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });
        cursor = 0;
        traverse(tree, {
            leave: function (node) {
                var comment;
                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        break;
                    }
                    if (node.range[1] === comment.extendedRange[0]) {
                        if (!node.trailingComments) {
                            node.trailingComments = [];
                        }
                        node.trailingComments.push(comment);
                        comments.splice(cursor, 1);
                    }
                    else {
                        cursor += 1;
                    }
                }
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }
                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });
        return tree;
    }
    var isArray, VisitorOption, VisitorKeys, objectCreate, objectKeys, BREAK, SKIP, REMOVE, Syntax;
    return {
        setters: [],
        execute: function () {
            isArray = Array.isArray;
            if (!isArray) {
                isArray = function isArray(array) {
                    return Object.prototype.toString.call(array) === '[object Array]';
                };
            }
            ignoreJSHintError(shallowCopy);
            ignoreJSHintError(lowerBound);
            objectCreate = Object.create || (function () {
                function F() {
                }
                return function (o) {
                    F.prototype = o;
                    return new F();
                };
            })();
            objectKeys = Object.keys || function (o) {
                var keys = [], key;
                for (key in o) {
                    if (o.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                return keys;
            };
            exports_1("Syntax", Syntax = {
                AssignmentExpression: 'AssignmentExpression',
                AssignmentPattern: 'AssignmentPattern',
                ArrayExpression: 'ArrayExpression',
                ArrayPattern: 'ArrayPattern',
                ArrowFunctionExpression: 'ArrowFunctionExpression',
                AwaitExpression: 'AwaitExpression',
                BlockStatement: 'BlockStatement',
                BinaryExpression: 'BinaryExpression',
                BreakStatement: 'BreakStatement',
                CallExpression: 'CallExpression',
                CatchClause: 'CatchClause',
                ClassBody: 'ClassBody',
                ClassDeclaration: 'ClassDeclaration',
                ClassExpression: 'ClassExpression',
                ComprehensionBlock: 'ComprehensionBlock',
                ComprehensionExpression: 'ComprehensionExpression',
                ConditionalExpression: 'ConditionalExpression',
                ContinueStatement: 'ContinueStatement',
                DebuggerStatement: 'DebuggerStatement',
                DirectiveStatement: 'DirectiveStatement',
                DoWhileStatement: 'DoWhileStatement',
                EmptyStatement: 'EmptyStatement',
                ExportAllDeclaration: 'ExportAllDeclaration',
                ExportDefaultDeclaration: 'ExportDefaultDeclaration',
                ExportNamedDeclaration: 'ExportNamedDeclaration',
                ExportSpecifier: 'ExportSpecifier',
                ExpressionStatement: 'ExpressionStatement',
                ForStatement: 'ForStatement',
                ForInStatement: 'ForInStatement',
                ForOfStatement: 'ForOfStatement',
                FunctionDeclaration: 'FunctionDeclaration',
                FunctionExpression: 'FunctionExpression',
                GeneratorExpression: 'GeneratorExpression',
                Identifier: 'Identifier',
                IfStatement: 'IfStatement',
                ImportDeclaration: 'ImportDeclaration',
                ImportDefaultSpecifier: 'ImportDefaultSpecifier',
                ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
                ImportSpecifier: 'ImportSpecifier',
                Literal: 'Literal',
                LabeledStatement: 'LabeledStatement',
                LogicalExpression: 'LogicalExpression',
                MemberExpression: 'MemberExpression',
                MethodDefinition: 'MethodDefinition',
                ModuleSpecifier: 'ModuleSpecifier',
                NewExpression: 'NewExpression',
                ObjectExpression: 'ObjectExpression',
                ObjectPattern: 'ObjectPattern',
                Program: 'Program',
                Property: 'Property',
                RestElement: 'RestElement',
                ReturnStatement: 'ReturnStatement',
                SequenceExpression: 'SequenceExpression',
                SpreadElement: 'SpreadElement',
                SuperExpression: 'SuperExpression',
                SwitchStatement: 'SwitchStatement',
                SwitchCase: 'SwitchCase',
                TaggedTemplateExpression: 'TaggedTemplateExpression',
                TemplateElement: 'TemplateElement',
                TemplateLiteral: 'TemplateLiteral',
                ThisExpression: 'ThisExpression',
                ThrowStatement: 'ThrowStatement',
                TryStatement: 'TryStatement',
                UnaryExpression: 'UnaryExpression',
                UpdateExpression: 'UpdateExpression',
                VariableDeclaration: 'VariableDeclaration',
                VariableDeclarator: 'VariableDeclarator',
                WhileStatement: 'WhileStatement',
                WithStatement: 'WithStatement',
                YieldExpression: 'YieldExpression'
            });
            VisitorKeys = {
                AssignmentExpression: ['left', 'right'],
                AssignmentPattern: ['left', 'right'],
                ArrayExpression: ['elements'],
                ArrayPattern: ['elements'],
                ArrowFunctionExpression: ['params', 'body'],
                AwaitExpression: ['argument'],
                BlockStatement: ['body'],
                BinaryExpression: ['left', 'right'],
                BreakStatement: ['label'],
                CallExpression: ['callee', 'arguments'],
                CatchClause: ['param', 'body'],
                ClassBody: ['body'],
                ClassDeclaration: ['id', 'superClass', 'body'],
                ClassExpression: ['id', 'superClass', 'body'],
                ComprehensionBlock: ['left', 'right'],
                ComprehensionExpression: ['blocks', 'filter', 'body'],
                ConditionalExpression: ['test', 'consequent', 'alternate'],
                ContinueStatement: ['label'],
                DebuggerStatement: [],
                DirectiveStatement: [],
                DoWhileStatement: ['body', 'test'],
                EmptyStatement: [],
                ExportAllDeclaration: ['source'],
                ExportDefaultDeclaration: ['declaration'],
                ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
                ExportSpecifier: ['exported', 'local'],
                ExpressionStatement: ['expression'],
                ForStatement: ['init', 'test', 'update', 'body'],
                ForInStatement: ['left', 'right', 'body'],
                ForOfStatement: ['left', 'right', 'body'],
                FunctionDeclaration: ['id', 'params', 'body'],
                FunctionExpression: ['id', 'params', 'body'],
                GeneratorExpression: ['blocks', 'filter', 'body'],
                Identifier: [],
                IfStatement: ['test', 'consequent', 'alternate'],
                ImportDeclaration: ['specifiers', 'source'],
                ImportDefaultSpecifier: ['local'],
                ImportNamespaceSpecifier: ['local'],
                ImportSpecifier: ['imported', 'local'],
                Literal: [],
                LabeledStatement: ['label', 'body'],
                LogicalExpression: ['left', 'right'],
                MemberExpression: ['object', 'property'],
                MethodDefinition: ['key', 'value'],
                ModuleSpecifier: [],
                NewExpression: ['callee', 'arguments'],
                ObjectExpression: ['properties'],
                ObjectPattern: ['properties'],
                Program: ['body'],
                Property: ['key', 'value'],
                RestElement: ['argument'],
                ReturnStatement: ['argument'],
                SequenceExpression: ['expressions'],
                SpreadElement: ['argument'],
                SuperExpression: ['super'],
                SwitchStatement: ['discriminant', 'cases'],
                SwitchCase: ['test', 'consequent'],
                TaggedTemplateExpression: ['tag', 'quasi'],
                TemplateElement: [],
                TemplateLiteral: ['quasis', 'expressions'],
                ThisExpression: [],
                ThrowStatement: ['argument'],
                TryStatement: ['block', 'handler', 'finalizer'],
                UnaryExpression: ['argument'],
                UpdateExpression: ['argument'],
                VariableDeclaration: ['declarations'],
                VariableDeclarator: ['id', 'init'],
                WhileStatement: ['test', 'body'],
                WithStatement: ['object', 'body'],
                YieldExpression: ['argument']
            };
            BREAK = {};
            SKIP = {};
            REMOVE = {};
            VisitorOption = {
                Break: BREAK,
                Skip: SKIP,
                Remove: REMOVE
            };
            Reference.prototype.replace = function replace(node) {
                this.parent[this.key] = node;
            };
            Reference.prototype.remove = function remove() {
                if (isArray(this.parent)) {
                    this.parent.splice(this.key, 1);
                    return true;
                }
                else {
                    this.replace(null);
                    return false;
                }
            };
            Controller.prototype.path = function path() {
                var i, iz, j, jz, result, element;
                function addToPath(result, path) {
                    if (isArray(path)) {
                        for (j = 0, jz = path.length; j < jz; ++j) {
                            result.push(path[j]);
                        }
                    }
                    else {
                        result.push(path);
                    }
                }
                if (!this.__current.path) {
                    return null;
                }
                result = [];
                for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
                    element = this.__leavelist[i];
                    addToPath(result, element.path);
                }
                addToPath(result, this.__current.path);
                return result;
            };
            Controller.prototype.type = function () {
                var node = this.current();
                return node.type || this.__current.wrap;
            };
            Controller.prototype.parents = function parents() {
                var i, iz, result;
                result = [];
                for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
                    result.push(this.__leavelist[i].node);
                }
                return result;
            };
            Controller.prototype.current = function current() {
                return this.__current.node;
            };
            Controller.prototype.__execute = function __execute(callback, element) {
                var previous, result;
                result = undefined;
                previous = this.__current;
                this.__current = element;
                this.__state = null;
                if (callback) {
                    result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
                }
                this.__current = previous;
                return result;
            };
            Controller.prototype.notify = function notify(flag) {
                this.__state = flag;
            };
            Controller.prototype.skip = function () {
                this.notify(SKIP);
            };
            Controller.prototype['break'] = function () {
                this.notify(BREAK);
            };
            Controller.prototype.remove = function () {
                this.notify(REMOVE);
            };
            Controller.prototype.__initialize = function (root, visitor) {
                this.visitor = visitor;
                this.root = root;
                this.__worklist = [];
                this.__leavelist = [];
                this.__current = null;
                this.__state = null;
                this.__fallback = visitor.fallback === 'iteration';
                this.__keys = VisitorKeys;
                if (visitor.keys) {
                    this.__keys = extend(objectCreate(this.__keys), visitor.keys);
                }
            };
            Controller.prototype.traverse = function traverse(root, visitor) {
                var worklist, leavelist, element, node, nodeType, ret, key, current, current2, candidates, candidate, sentinel;
                this.__initialize(root, visitor);
                sentinel = {};
                worklist = this.__worklist;
                leavelist = this.__leavelist;
                worklist.push(new ElementNode(root, null, null, null));
                leavelist.push(new ElementNode(null, null, null, null));
                while (worklist.length) {
                    element = worklist.pop();
                    if (element === sentinel) {
                        element = leavelist.pop();
                        ret = this.__execute(visitor.leave, element);
                        if (this.__state === BREAK || ret === BREAK) {
                            return;
                        }
                        continue;
                    }
                    if (element.node) {
                        ret = this.__execute(visitor.enter, element);
                        if (this.__state === BREAK || ret === BREAK) {
                            return;
                        }
                        worklist.push(sentinel);
                        leavelist.push(element);
                        if (this.__state === SKIP || ret === SKIP) {
                            continue;
                        }
                        node = element.node;
                        nodeType = element.wrap || node.type;
                        candidates = this.__keys[nodeType];
                        if (!candidates) {
                            if (this.__fallback) {
                                candidates = objectKeys(node);
                            }
                            else {
                                throw new Error('Unknown node type ' + nodeType + '.');
                            }
                        }
                        current = candidates.length;
                        while ((current -= 1) >= 0) {
                            key = candidates[current];
                            candidate = node[key];
                            if (!candidate) {
                                continue;
                            }
                            if (isArray(candidate)) {
                                current2 = candidate.length;
                                while ((current2 -= 1) >= 0) {
                                    if (!candidate[current2]) {
                                        continue;
                                    }
                                    if (isProperty(nodeType, candidates[current])) {
                                        element = new ElementNode(candidate[current2], [key, current2], 'Property', null);
                                    }
                                    else if (isNode(candidate[current2])) {
                                        element = new ElementNode(candidate[current2], [key, current2], null, null);
                                    }
                                    else {
                                        continue;
                                    }
                                    worklist.push(element);
                                }
                            }
                            else if (isNode(candidate)) {
                                worklist.push(new ElementNode(candidate, key, null, null));
                            }
                        }
                    }
                }
            };
            Controller.prototype.replace = function replace(root, visitor) {
                var worklist;
                function removeElem(element) {
                    var i, key, nextElem, parent;
                    if (element.ref.remove()) {
                        key = element.ref.key;
                        parent = element.ref.parent;
                        i = worklist.length;
                        while (i--) {
                            nextElem = worklist[i];
                            if (nextElem.ref && nextElem.ref.parent === parent) {
                                if (nextElem.ref.key < key) {
                                    break;
                                }
                                --nextElem.ref.key;
                            }
                        }
                    }
                }
                var leavelist, node, nodeType, target, element, current, current2, candidates, candidate, sentinel, outer, key;
                this.__initialize(root, visitor);
                sentinel = {};
                worklist = this.__worklist;
                leavelist = this.__leavelist;
                outer = {
                    root: root
                };
                element = new ElementNode(root, null, null, new Reference(outer, 'root'));
                worklist.push(element);
                leavelist.push(element);
                while (worklist.length) {
                    element = worklist.pop();
                    if (element === sentinel) {
                        element = leavelist.pop();
                        target = this.__execute(visitor.leave, element);
                        if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                            element.ref.replace(target);
                        }
                        if (this.__state === REMOVE || target === REMOVE) {
                            removeElem(element);
                        }
                        if (this.__state === BREAK || target === BREAK) {
                            return outer.root;
                        }
                        continue;
                    }
                    target = this.__execute(visitor.enter, element);
                    if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                        element.ref.replace(target);
                        element.node = target;
                    }
                    if (this.__state === REMOVE || target === REMOVE) {
                        removeElem(element);
                        element.node = null;
                    }
                    if (this.__state === BREAK || target === BREAK) {
                        return outer.root;
                    }
                    node = element.node;
                    if (!node) {
                        continue;
                    }
                    worklist.push(sentinel);
                    leavelist.push(element);
                    if (this.__state === SKIP || target === SKIP) {
                        continue;
                    }
                    nodeType = element.wrap || node.type;
                    candidates = this.__keys[nodeType];
                    if (!candidates) {
                        if (this.__fallback) {
                            candidates = objectKeys(node);
                        }
                        else {
                            throw new Error('Unknown node type ' + nodeType + '.');
                        }
                    }
                    current = candidates.length;
                    while ((current -= 1) >= 0) {
                        key = candidates[current];
                        candidate = node[key];
                        if (!candidate) {
                            continue;
                        }
                        if (isArray(candidate)) {
                            current2 = candidate.length;
                            while ((current2 -= 1) >= 0) {
                                if (!candidate[current2]) {
                                    continue;
                                }
                                if (isProperty(nodeType, candidates[current])) {
                                    element = new ElementNode(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                                }
                                else if (isNode(candidate[current2])) {
                                    element = new ElementNode(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                                }
                                else {
                                    continue;
                                }
                                worklist.push(element);
                            }
                        }
                        else if (isNode(candidate)) {
                            worklist.push(new ElementNode(candidate, key, null, new Reference(node, key)));
                        }
                    }
                }
                return outer.root;
            };
        }
    };
});
