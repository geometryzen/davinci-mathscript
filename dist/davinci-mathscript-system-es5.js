System.register("core.js", [], function (exports_1, context_1) {
    "use strict";

    var VERSION;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("VERSION", VERSION = '1.3.4');
        }
    };
});
System.register('estraverse.js', [], function (exports_1, context_1) {
    'use strict';

    var isArray, VisitorOption, VisitorKeys, objectCreate, objectKeys, BREAK, SKIP, REMOVE, Syntax;
    var __moduleName = context_1 && context_1.id;
    function ignoreJSHintError(what) {}
    function deepCopy(obj) {
        var ret = {},
            key,
            val;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                } else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }
    function shallowCopy(obj) {
        var ret = {},
            key;
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
            } else {
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
            } else {
                len = diff;
            }
        }
        return i;
    }
    function extend(to, from) {
        var keys = objectKeys(from),
            key,
            i,
            len;
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
    function Controller() {}
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
        var comments = [],
            comment,
            len,
            i,
            cursor;
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
                    } else {
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
                    } else {
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
            objectCreate = Object.create || function () {
                function F() {}
                return function (o) {
                    F.prototype = o;
                    return new F();
                };
            }();
            objectKeys = Object.keys || function (o) {
                var keys = [],
                    key;
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
                } else {
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
                    } else {
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
                            } else {
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
                                    } else if (isNode(candidate[current2])) {
                                        element = new ElementNode(candidate[current2], [key, current2], null, null);
                                    } else {
                                        continue;
                                    }
                                    worklist.push(element);
                                }
                            } else if (isNode(candidate)) {
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
                        } else {
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
                                } else if (isNode(candidate[current2])) {
                                    element = new ElementNode(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                                } else {
                                    continue;
                                }
                                worklist.push(element);
                            }
                        } else if (isNode(candidate)) {
                            worklist.push(new ElementNode(candidate, key, null, new Reference(node, key)));
                        }
                    }
                }
                return outer.root;
            };
        }
    };
});
System.register("code.js", [], function (exports_1, context_1) {
    'use strict';

    var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;
    var __moduleName = context_1 && context_1.id;
    function isDecimalDigit(ch) {
        return 0x30 <= ch && ch <= 0x39;
    }
    exports_1("isDecimalDigit", isDecimalDigit);
    function isHexDigit(ch) {
        return 0x30 <= ch && ch <= 0x39 || 0x61 <= ch && ch <= 0x66 || 0x41 <= ch && ch <= 0x46;
    }
    exports_1("isHexDigit", isHexDigit);
    function isOctalDigit(ch) {
        return ch >= 0x30 && ch <= 0x37;
    }
    exports_1("isOctalDigit", isOctalDigit);
    function isWhiteSpace(ch) {
        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 || ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
    }
    exports_1("isWhiteSpace", isWhiteSpace);
    function isLineTerminator(ch) {
        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
    }
    exports_1("isLineTerminator", isLineTerminator);
    function fromCodePoint(cp) {
        if (cp <= 0xFFFF) {
            return String.fromCharCode(cp);
        }
        var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
        var cu2 = String.fromCharCode((cp - 0x10000) % 0x400 + 0xDC00);
        return cu1 + cu2;
    }
    function isIdentifierStartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }
    exports_1("isIdentifierStartES5", isIdentifierStartES5);
    function isIdentifierPartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }
    exports_1("isIdentifierPartES5", isIdentifierPartES5);
    function isIdentifierStartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }
    exports_1("isIdentifierStartES6", isIdentifierStartES6);
    function isIdentifierPartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }
    exports_1("isIdentifierPartES6", isIdentifierPartES6);
    function isIdentifierPart(ch) {
        return isIdentifierPartES6(ch);
    }
    exports_1("isIdentifierPart", isIdentifierPart);
    return {
        setters: [],
        execute: function () {
            ES5Regex = {
                NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
                NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
            };
            ES6Regex = {
                NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,
                NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
            };
            NON_ASCII_WHITESPACES = [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF];
            IDENTIFIER_START = new Array(0x80);
            for (ch = 0; ch < 0x80; ++ch) {
                IDENTIFIER_START[ch] = ch >= 0x61 && ch <= 0x7A || ch >= 0x41 && ch <= 0x5A || ch === 0x24 || ch === 0x5F;
            }
            IDENTIFIER_PART = new Array(0x80);
            for (ch = 0; ch < 0x80; ++ch) {
                IDENTIFIER_PART[ch] = ch >= 0x61 && ch <= 0x7A || ch >= 0x41 && ch <= 0x5A || ch >= 0x30 && ch <= 0x39 || ch === 0x24 || ch === 0x5F;
            }
        }
    };
});
System.register("BinaryPrecedence.js", ["./Precedence"], function (exports_1, context_1) {
    "use strict";

    var Precedence_1, BinaryPrecedence;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (Precedence_1_1) {
            Precedence_1 = Precedence_1_1;
        }],
        execute: function () {
            exports_1("BinaryPrecedence", BinaryPrecedence = {
                '||': Precedence_1.Precedence.LogicalOR,
                '&&': Precedence_1.Precedence.LogicalAND,
                '|': Precedence_1.Precedence.BitwiseOR,
                '^': Precedence_1.Precedence.BitwiseXOR,
                '&': Precedence_1.Precedence.BitwiseAND,
                '==': Precedence_1.Precedence.Equality,
                '!=': Precedence_1.Precedence.Equality,
                '===': Precedence_1.Precedence.Equality,
                '!==': Precedence_1.Precedence.Equality,
                'is': Precedence_1.Precedence.Equality,
                'isnt': Precedence_1.Precedence.Equality,
                '<': Precedence_1.Precedence.Relational,
                '>': Precedence_1.Precedence.Relational,
                '<=': Precedence_1.Precedence.Relational,
                '>=': Precedence_1.Precedence.Relational,
                'in': Precedence_1.Precedence.Relational,
                'instanceof': Precedence_1.Precedence.Relational,
                '<<': Precedence_1.Precedence.BitwiseSHIFT,
                '>>': Precedence_1.Precedence.BitwiseSHIFT,
                '>>>': Precedence_1.Precedence.BitwiseSHIFT,
                '+': Precedence_1.Precedence.Additive,
                '-': Precedence_1.Precedence.Additive,
                '*': Precedence_1.Precedence.Multiplicative,
                '%': Precedence_1.Precedence.Multiplicative,
                '/': Precedence_1.Precedence.Multiplicative
            });
        }
    };
});
System.register("escodegen.js", ["./estraverse", "./code", "./Precedence", "./BinaryPrecedence"], function (exports_1, context_1) {
    "use strict";

    var estraverse_1, code_1, code_2, code_3, code_4, Precedence_1, BinaryPrecedence_1, SourceNode, isArray, base, indent, json, renumber, hexadecimal, quotes, escapeless, newline, space, parentheses, semicolons, safeConcatenation, directive, extra, parse, sourceMap, sourceCode, preserveBlankLines, FORMAT_MINIFY, FORMAT_DEFAULTS, F_ALLOW_IN, F_ALLOW_CALL, F_ALLOW_UNPARATH_NEW, F_FUNC_BODY, F_DIRECTIVE_CTX, F_SEMICOLON_OPT, E_FTT, E_TTF, E_TTT, E_TFF, E_FFT, E_TFT, S_TFFF, S_TFFT, S_FFFF, S_TFTF, S_TTFF, CodeGenerator, escodegen;
    var __moduleName = context_1 && context_1.id;
    function isExpression(node) {
        return CodeGenerator.Expression.hasOwnProperty(node.type);
    }
    function isStatement(node) {
        return CodeGenerator.Statement.hasOwnProperty(node.type);
    }
    function getDefaultOptions() {
        return {
            parse: null,
            comment: false,
            format: {
                indent: {
                    style: '    ',
                    base: 0,
                    adjustMultilineComment: false
                },
                newline: '\n',
                space: ' ',
                json: false,
                renumber: false,
                hexadecimal: false,
                quotes: 'single',
                escapeless: false,
                compact: false,
                parentheses: true,
                semicolons: true,
                safeConcatenation: false,
                preserveBlankLines: false
            },
            moz: {
                comprehensionExpressionStartsWithAssignment: false,
                starlessGenerator: false
            },
            sourceMap: null,
            sourceMapRoot: null,
            sourceMapWithCode: false,
            directive: false,
            raw: true,
            verbatim: null,
            sourceCode: null
        };
    }
    function stringRepeat(str, num) {
        var result = '';
        for (num |= 0; num > 0; num >>>= 1, str += str) {
            if (num & 1) {
                result += str;
            }
        }
        return result;
    }
    function hasLineTerminator(str) {
        return (/[\r\n]/g.test(str)
        );
    }
    function endsWithLineTerminator(str) {
        var len = str.length;
        return len > 0 && code_1.isLineTerminator(str.charCodeAt(len - 1));
    }
    function merge(target, override) {
        var key;
        for (key in override) {
            if (override.hasOwnProperty(key)) {
                target[key] = override[key];
            }
        }
        return target;
    }
    function updateDeeply(target, override) {
        var key, val;
        function isHashObject(target) {
            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
        }
        for (key in override) {
            if (override.hasOwnProperty(key)) {
                val = override[key];
                if (isHashObject(val)) {
                    if (isHashObject(target[key])) {
                        updateDeeply(target[key], val);
                    } else {
                        target[key] = updateDeeply({}, val);
                    }
                } else {
                    target[key] = val;
                }
            }
        }
        return target;
    }
    function generateNumber(value) {
        var result, point, temp, exponent, pos;
        if (value !== value) {
            throw new Error('Numeric literal whose value is NaN');
        }
        if (value < 0 || value === 0 && 1 / value < 0) {
            throw new Error('Numeric literal whose value is negative');
        }
        if (value === 1 / 0) {
            return json ? 'null' : renumber ? '1e400' : '1e+400';
        }
        result = '' + value;
        if (!renumber || result.length < 3) {
            return result;
        }
        point = result.indexOf('.');
        if (!json && result.charCodeAt(0) === 0x30 && point === 1) {
            point = 0;
            result = result.slice(1);
        }
        temp = result;
        result = result.replace('e+', 'e');
        exponent = 0;
        if ((pos = temp.indexOf('e')) > 0) {
            exponent = +temp.slice(pos + 1);
            temp = temp.slice(0, pos);
        }
        if (point >= 0) {
            exponent -= temp.length - point - 1;
            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
        }
        pos = 0;
        while (temp.charCodeAt(temp.length + pos - 1) === 0x30) {
            --pos;
        }
        if (pos !== 0) {
            exponent -= pos;
            temp = temp.slice(0, pos);
        }
        if (exponent !== 0) {
            temp += 'e' + exponent;
        }
        if ((temp.length < result.length || hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length) && +temp === value) {
            result = temp;
        }
        return result;
    }
    function escapeRegExpCharacter(ch, previousIsBackslash) {
        if ((ch & ~1) === 0x2028) {
            return (previousIsBackslash ? 'u' : '\\u') + (ch === 0x2028 ? '2028' : '2029');
        } else if (ch === 10 || ch === 13) {
            return (previousIsBackslash ? '' : '\\') + (ch === 10 ? 'n' : 'r');
        }
        return String.fromCharCode(ch);
    }
    function generateRegExp(reg) {
        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;
        result = reg.toString();
        if (reg.source) {
            match = result.match(/\/([^/]*)$/);
            if (!match) {
                return result;
            }
            flags = match[1];
            result = '';
            characterInBrack = false;
            previousIsBackslash = false;
            for (i = 0, iz = reg.source.length; i < iz; ++i) {
                ch = reg.source.charCodeAt(i);
                if (!previousIsBackslash) {
                    if (characterInBrack) {
                        if (ch === 93) {
                            characterInBrack = false;
                        }
                    } else {
                        if (ch === 47) {
                            result += '\\';
                        } else if (ch === 91) {
                            characterInBrack = true;
                        }
                    }
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    previousIsBackslash = ch === 92;
                } else {
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    previousIsBackslash = false;
                }
            }
            return '/' + result + '/' + flags;
        }
        return result;
    }
    function escapeAllowedCharacter(code, next) {
        var hex;
        if (code === 0x08) {
            return '\\b';
        }
        if (code === 0x0C) {
            return '\\f';
        }
        if (code === 0x09) {
            return '\\t';
        }
        hex = code.toString(16).toUpperCase();
        if (json || code > 0xFF) {
            return '\\u' + '0000'.slice(hex.length) + hex;
        } else if (code === 0x0000 && !code_2.isDecimalDigit(next)) {
            return '\\0';
        } else if (code === 0x000B) {
            return '\\x0B';
        } else {
            return '\\x' + '00'.slice(hex.length) + hex;
        }
    }
    function escapeDisallowedCharacter(code) {
        if (code === 0x5C) {
            return '\\\\';
        }
        if (code === 0x0A) {
            return '\\n';
        }
        if (code === 0x0D) {
            return '\\r';
        }
        if (code === 0x2028) {
            return '\\u2028';
        }
        if (code === 0x2029) {
            return '\\u2029';
        }
        throw new Error('Incorrectly classified character');
    }
    function escapeDirective(str) {
        var i, iz, code, quote;
        quote = quotes === 'double' ? '"' : '\'';
        for (i = 0, iz = str.length; i < iz; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27) {
                quote = '"';
                break;
            } else if (code === 0x22) {
                quote = '\'';
                break;
            } else if (code === 0x5C) {
                ++i;
            }
        }
        return quote + str + quote;
    }
    function escapeString(str) {
        var result = '',
            i,
            len,
            code,
            singleQuotes = 0,
            doubleQuotes = 0,
            single,
            quote;
        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27) {
                ++singleQuotes;
            } else if (code === 0x22) {
                ++doubleQuotes;
            } else if (code === 0x2F && json) {
                result += '\\';
            } else if (code_1.isLineTerminator(code) || code === 0x5C) {
                result += escapeDisallowedCharacter(code);
                continue;
            } else if (json && code < 0x20 || !(json || escapeless || code >= 0x20 && code <= 0x7E)) {
                result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
                continue;
            }
            result += String.fromCharCode(code);
        }
        single = !(quotes === 'double' || quotes === 'auto' && doubleQuotes < singleQuotes);
        quote = single ? '\'' : '"';
        if (!(single ? singleQuotes : doubleQuotes)) {
            return quote + result + quote;
        }
        str = result;
        result = quote;
        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27 && single || code === 0x22 && !single) {
                result += '\\';
            }
            result += String.fromCharCode(code);
        }
        return result + quote;
    }
    function flattenToString(arr) {
        var i,
            iz,
            elem,
            result = '';
        for (i = 0, iz = arr.length; i < iz; ++i) {
            elem = arr[i];
            result += isArray(elem) ? flattenToString(elem) : elem;
        }
        return result;
    }
    function toSourceNodeWhenNeeded(generated, node) {
        if (!sourceMap) {
            if (isArray(generated)) {
                return flattenToString(generated);
            } else {
                return generated;
            }
        }
        if (node == null) {
            if (generated instanceof SourceNode) {
                return generated;
            } else {
                node = {};
            }
        }
        if (node.loc == null) {
            return new SourceNode(null, null, sourceMap, generated, node.name || null);
        }
        return new SourceNode(node.loc.start.line, node.loc.start.column, sourceMap === true ? node.loc.source || null : sourceMap, generated, node.name || null);
    }
    function noEmptySpace() {
        return space ? space : ' ';
    }
    function join(left, right) {
        var leftSource, rightSource, leftCharCode, rightCharCode;
        leftSource = toSourceNodeWhenNeeded(left).toString();
        if (leftSource.length === 0) {
            return [right];
        }
        rightSource = toSourceNodeWhenNeeded(right).toString();
        if (rightSource.length === 0) {
            return [left];
        }
        leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
        rightCharCode = rightSource.charCodeAt(0);
        if ((leftCharCode === 0x2B || leftCharCode === 0x2D) && leftCharCode === rightCharCode || code_3.isIdentifierPart(leftCharCode) && code_3.isIdentifierPart(rightCharCode) || leftCharCode === 0x2F && rightCharCode === 0x69) {
            return [left, noEmptySpace(), right];
        } else if (code_4.isWhiteSpace(leftCharCode) || code_1.isLineTerminator(leftCharCode) || code_4.isWhiteSpace(rightCharCode) || code_1.isLineTerminator(rightCharCode)) {
            return [left, right];
        }
        return [left, space, right];
    }
    function addIndent(stmt) {
        return [base, stmt];
    }
    function withIndent(fn) {
        var previousBase;
        previousBase = base;
        base += indent;
        fn(base);
        base = previousBase;
    }
    function calculateSpaces(str) {
        var i;
        for (i = str.length - 1; i >= 0; --i) {
            if (code_1.isLineTerminator(str.charCodeAt(i))) {
                break;
            }
        }
        return str.length - 1 - i;
    }
    function adjustMultilineComment(value, specialBase) {
        var array, i, len, line, j, spaces, previousBase, sn;
        array = value.split(/\r\n|[\r\n]/);
        spaces = Number.MAX_VALUE;
        for (i = 1, len = array.length; i < len; ++i) {
            line = array[i];
            j = 0;
            while (j < line.length && code_4.isWhiteSpace(line.charCodeAt(j))) {
                ++j;
            }
            if (spaces > j) {
                spaces = j;
            }
        }
        if (typeof specialBase !== 'undefined') {
            previousBase = base;
            if (array[1][spaces] === '*') {
                specialBase += ' ';
            }
            base = specialBase;
        } else {
            if (spaces & 1) {
                --spaces;
            }
            previousBase = base;
        }
        for (i = 1, len = array.length; i < len; ++i) {
            sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
            array[i] = sourceMap ? sn.join('') : sn;
        }
        base = previousBase;
        return array.join('\n');
    }
    function generateComment(comment, specialBase) {
        if (comment.type === 'Line') {
            if (endsWithLineTerminator(comment.value)) {
                return '//' + comment.value;
            } else {
                var result = '//' + comment.value;
                if (!preserveBlankLines) {
                    result += '\n';
                }
                return result;
            }
        }
        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
        }
        return '/*' + comment.value + '*/';
    }
    function addComments(stmt, result) {
        var i, len, comment, save, tailingToStatement, specialBase, fragment, extRange, range, prevRange, prefix, infix, suffix, count;
        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
            save = result;
            if (preserveBlankLines) {
                comment = stmt.leadingComments[0];
                result = [];
                extRange = comment.extendedRange;
                range = comment.range;
                prefix = sourceCode.substring(extRange[0], range[0]);
                count = (prefix.match(/\n/g) || []).length;
                if (count > 0) {
                    result.push(stringRepeat('\n', count));
                    result.push(addIndent(generateComment(comment)));
                } else {
                    result.push(prefix);
                    result.push(generateComment(comment));
                }
                prevRange = range;
                for (i = 1, len = stmt.leadingComments.length; i < len; i++) {
                    comment = stmt.leadingComments[i];
                    range = comment.range;
                    infix = sourceCode.substring(prevRange[1], range[0]);
                    count = (infix.match(/\n/g) || []).length;
                    result.push(stringRepeat('\n', count));
                    result.push(addIndent(generateComment(comment)));
                    prevRange = range;
                }
                suffix = sourceCode.substring(range[1], extRange[1]);
                count = (suffix.match(/\n/g) || []).length;
                result.push(stringRepeat('\n', count));
            } else {
                comment = stmt.leadingComments[0];
                result = [];
                if (safeConcatenation && stmt.type === estraverse_1.Syntax.Program && stmt.body.length === 0) {
                    result.push('\n');
                }
                result.push(generateComment(comment));
                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                    result.push('\n');
                }
                for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
                    comment = stmt.leadingComments[i];
                    fragment = [generateComment(comment)];
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                        fragment.push('\n');
                    }
                    result.push(addIndent(fragment));
                }
            }
            result.push(addIndent(save));
        }
        if (stmt.trailingComments) {
            if (preserveBlankLines) {
                comment = stmt.trailingComments[0];
                extRange = comment.extendedRange;
                range = comment.range;
                prefix = sourceCode.substring(extRange[0], range[0]);
                count = (prefix.match(/\n/g) || []).length;
                if (count > 0) {
                    result.push(stringRepeat('\n', count));
                    result.push(addIndent(generateComment(comment)));
                } else {
                    result.push(prefix);
                    result.push(generateComment(comment));
                }
            } else {
                tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
                specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
                for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
                    comment = stmt.trailingComments[i];
                    if (tailingToStatement) {
                        if (i === 0) {
                            result = [result, indent];
                        } else {
                            result = [result, specialBase];
                        }
                        result.push(generateComment(comment, specialBase));
                    } else {
                        result = [result, addIndent(generateComment(comment))];
                    }
                    if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                        result = [result, '\n'];
                    }
                }
            }
        }
        return result;
    }
    function generateBlankLines(start, end, result) {
        var j,
            newlineCount = 0;
        for (j = start; j < end; j++) {
            if (sourceCode[j] === '\n') {
                newlineCount++;
            }
        }
        for (j = 1; j < newlineCount; j++) {
            result.push(newline);
        }
    }
    function parenthesize(text, current, should) {
        if (current < should) {
            return ['(', text, ')'];
        }
        return text;
    }
    function generateVerbatimString(string) {
        var i, iz, result;
        result = string.split(/\r\n|\n/);
        for (i = 1, iz = result.length; i < iz; i++) {
            result[i] = newline + base + result[i];
        }
        return result;
    }
    function generateVerbatim(expr, precedence) {
        var verbatim, result, prec;
        verbatim = expr[extra.verbatim];
        if (typeof verbatim === 'string') {
            result = parenthesize(generateVerbatimString(verbatim), Precedence_1.Precedence.Sequence, precedence);
        } else {
            result = generateVerbatimString(verbatim.content);
            prec = verbatim.precedence != null ? verbatim.precedence : Precedence_1.Precedence.Sequence;
            result = parenthesize(result, prec, precedence);
        }
        return toSourceNodeWhenNeeded(result, expr);
    }
    function generateIdentifier(node) {
        return toSourceNodeWhenNeeded(node.name, node);
    }
    function generateAsyncPrefix(node, spaceRequired) {
        return node.async ? 'async' + (spaceRequired ? noEmptySpace() : space) : '';
    }
    function generateStarSuffix(node) {
        var isGenerator = node.generator && !extra.moz.starlessGenerator;
        return isGenerator ? '*' + space : '';
    }
    function generateMethodPrefix(prop) {
        var func = prop.value;
        if (func.async) {
            return generateAsyncPrefix(func, !prop.computed);
        } else {
            return generateStarSuffix(func) ? '*' : '';
        }
    }
    function generateInternal(node) {
        var codegen = new CodeGenerator();
        if (isStatement(node)) {
            return codegen.generateStatement(node, S_TFFF);
        }
        if (isExpression(node)) {
            return codegen.generateExpression(node, Precedence_1.Precedence.Sequence, E_TTT);
        }
        throw new Error('Unknown node type: ' + node.type);
    }
    function generate(node, options) {
        var defaultOptions = getDefaultOptions();
        if (options) {
            options = updateDeeply(defaultOptions, options);
            indent = options.format.indent.style;
            base = stringRepeat(indent, options.format.indent.base);
        } else {
            options = defaultOptions;
            indent = options.format.indent.style;
            base = stringRepeat(indent, options.format.indent.base);
        }
        json = options.format.json;
        renumber = options.format.renumber;
        hexadecimal = json ? false : options.format.hexadecimal;
        quotes = json ? 'double' : options.format.quotes;
        escapeless = options.format.escapeless;
        newline = options.format.newline;
        space = options.format.space;
        if (options.format.compact) {
            newline = space = indent = base = '';
        }
        parentheses = options.format.parentheses;
        semicolons = options.format.semicolons;
        safeConcatenation = options.format.safeConcatenation;
        directive = options.directive;
        parse = json ? null : options.parse;
        sourceMap = options.sourceMap;
        sourceCode = options.sourceCode;
        preserveBlankLines = options.format.preserveBlankLines && sourceCode !== null;
        extra = options;
        var result = generateInternal(node);
        var pair;
        if (!sourceMap) {
            pair = { code: result.toString(), map: null };
            return options.sourceMapWithCode ? pair : pair.code;
        }
        pair = result.toStringWithSourceMap({
            file: options.file,
            sourceRoot: options.sourceMapRoot
        });
        if (options.sourceContent) {
            pair.map.setSourceContent(options.sourceMap, options.sourceContent);
        }
        if (options.sourceMapWithCode) {
            return pair;
        }
        return pair.map.toString();
    }
    exports_1("generate", generate);
    return {
        setters: [function (estraverse_1_1) {
            estraverse_1 = estraverse_1_1;
        }, function (code_1_1) {
            code_1 = code_1_1;
            code_2 = code_1_1;
            code_3 = code_1_1;
            code_4 = code_1_1;
        }, function (Precedence_1_1) {
            Precedence_1 = Precedence_1_1;
        }, function (BinaryPrecedence_1_1) {
            BinaryPrecedence_1 = BinaryPrecedence_1_1;
        }],
        execute: function () {
            F_ALLOW_IN = 1, F_ALLOW_CALL = 1 << 1, F_ALLOW_UNPARATH_NEW = 1 << 2, F_FUNC_BODY = 1 << 3, F_DIRECTIVE_CTX = 1 << 4, F_SEMICOLON_OPT = 1 << 5;
            E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TTF = F_ALLOW_IN | F_ALLOW_CALL, E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TFF = F_ALLOW_IN, E_FFT = F_ALLOW_UNPARATH_NEW, E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW;
            S_TFFF = F_ALLOW_IN, S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT, S_FFFF = 0x00, S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX, S_TTFF = F_ALLOW_IN | F_FUNC_BODY;
            isArray = Array.isArray;
            if (!isArray) {
                isArray = function isArray(array) {
                    return Object.prototype.toString.call(array) === '[object Array]';
                };
            }
            CodeGenerator = function () {
                function CodeGenerator() {}
                CodeGenerator.prototype.generateFunctionParams = function (node) {
                    var i, iz, result, hasDefault;
                    hasDefault = false;
                    if (node.type === estraverse_1.Syntax.ArrowFunctionExpression && !node.rest && (!node.defaults || node.defaults.length === 0) && node.params.length === 1 && node.params[0].type === estraverse_1.Syntax.Identifier) {
                        result = [generateAsyncPrefix(node, true), generateIdentifier(node.params[0])];
                    } else {
                        result = node.type === estraverse_1.Syntax.ArrowFunctionExpression ? [generateAsyncPrefix(node, false)] : [];
                        result.push('(');
                        if (node.defaults) {
                            hasDefault = true;
                        }
                        for (i = 0, iz = node.params.length; i < iz; ++i) {
                            if (hasDefault && node.defaults[i]) {
                                result.push(this.generateAssignment(node.params[i], node.defaults[i], '=', Precedence_1.Precedence.Assignment, E_TTT));
                            } else {
                                result.push(this.generatePattern(node.params[i], Precedence_1.Precedence.Assignment, E_TTT));
                            }
                            if (i + 1 < iz) {
                                result.push(',' + space);
                            }
                        }
                        if (node.rest) {
                            if (node.params.length) {
                                result.push(',' + space);
                            }
                            result.push('...');
                            result.push(generateIdentifier(node.rest));
                        }
                        result.push(')');
                    }
                    return result;
                };
                CodeGenerator.prototype.generatePattern = function (node, precedence, flags) {
                    if (node.type === estraverse_1.Syntax.Identifier) {
                        return generateIdentifier(node);
                    }
                    return this.generateExpression(node, precedence, flags);
                };
                CodeGenerator.prototype.generateStatement = function (stmt, flags) {
                    var result, fragment;
                    result = this[stmt.type](stmt, flags);
                    if (extra.comment) {
                        result = addComments(stmt, result);
                    }
                    fragment = toSourceNodeWhenNeeded(result).toString();
                    if (stmt.type === estraverse_1.Syntax.Program && !safeConcatenation && newline === '' && fragment.charAt(fragment.length - 1) === '\n') {
                        result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
                    }
                    return toSourceNodeWhenNeeded(result, stmt);
                };
                CodeGenerator.prototype.generateExpression = function (expr, precedence, flags) {
                    var result, type;
                    type = expr.type || estraverse_1.Syntax.Property;
                    if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
                        return generateVerbatim(expr, precedence);
                    }
                    result = this[type](expr, precedence, flags);
                    if (extra.comment) {
                        result = addComments(expr, result);
                    }
                    return toSourceNodeWhenNeeded(result, expr);
                };
                CodeGenerator.prototype.maybeBlock = function (stmt, flags) {
                    var result,
                        noLeadingComment,
                        that = this;
                    noLeadingComment = !extra.comment || !stmt.leadingComments;
                    if (stmt.type === estraverse_1.Syntax.BlockStatement && noLeadingComment) {
                        return [space, this.generateStatement(stmt, flags)];
                    }
                    if (stmt.type === estraverse_1.Syntax.EmptyStatement && noLeadingComment) {
                        return ';';
                    }
                    withIndent(function () {
                        result = [newline, addIndent(that.generateStatement(stmt, flags))];
                    });
                    return result;
                };
                CodeGenerator.prototype.maybeBlockSuffix = function (stmt, result) {
                    var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
                    if (stmt.type === estraverse_1.Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
                        return [result, space];
                    }
                    if (ends) {
                        return [result, base];
                    }
                    return [result, newline, base];
                };
                CodeGenerator.prototype.generateFunctionBody = function (node) {
                    var result, expr;
                    result = this.generateFunctionParams(node);
                    if (node.type === estraverse_1.Syntax.ArrowFunctionExpression) {
                        result.push(space);
                        result.push('=>');
                    }
                    if (node.expression) {
                        result.push(space);
                        expr = this.generateExpression(node.body, Precedence_1.Precedence.Assignment, E_TTT);
                        if (expr.toString().charAt(0) === '{') {
                            expr = ['(', expr, ')'];
                        }
                        result.push(expr);
                    } else {
                        result.push(this.maybeBlock(node.body, S_TTFF));
                    }
                    return result;
                };
                CodeGenerator.prototype.generateIterationForStatement = function (operator, stmt, flags) {
                    var result = ['for' + space + '('],
                        that = this;
                    withIndent(function () {
                        if (stmt.left.type === estraverse_1.Syntax.VariableDeclaration) {
                            withIndent(function () {
                                result.push(stmt.left.kind + noEmptySpace());
                                result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
                            });
                        } else {
                            result.push(that.generateExpression(stmt.left, Precedence_1.Precedence.Call, E_TTT));
                        }
                        result = join(result, operator);
                        result = [join(result, that.generateExpression(stmt.right, Precedence_1.Precedence.Sequence, E_TTT)), ')'];
                    });
                    result.push(this.maybeBlock(stmt.body, flags));
                    return result;
                };
                CodeGenerator.prototype.generatePropertyKey = function (expr, computed) {
                    var result = [];
                    if (computed) {
                        result.push('[');
                    }
                    result.push(this.generateExpression(expr, Precedence_1.Precedence.Sequence, E_TTT));
                    if (computed) {
                        result.push(']');
                    }
                    return result;
                };
                CodeGenerator.prototype.generateAssignment = function (left, right, operator, precedence, flags) {
                    if (Precedence_1.Precedence.Assignment < precedence) {
                        flags |= F_ALLOW_IN;
                    }
                    return parenthesize([this.generateExpression(left, Precedence_1.Precedence.Call, flags), space + operator + space, this.generateExpression(right, Precedence_1.Precedence.Assignment, flags)], Precedence_1.Precedence.Assignment, precedence);
                };
                CodeGenerator.prototype.semicolon = function (flags) {
                    if (!semicolons && flags & F_SEMICOLON_OPT) {
                        return '';
                    }
                    return ';';
                };
                return CodeGenerator;
            }();
            CodeGenerator.Statement = {
                BlockStatement: function (stmt, flags) {
                    var range,
                        content,
                        result = ['{', newline],
                        that = this;
                    withIndent(function () {
                        if (stmt.body.length === 0 && preserveBlankLines) {
                            range = stmt.range;
                            if (range[1] - range[0] > 2) {
                                content = sourceCode.substring(range[0] + 1, range[1] - 1);
                                if (content[0] === '\n') {
                                    result = ['{'];
                                }
                                result.push(content);
                            }
                        }
                        var i, iz, fragment, bodyFlags;
                        bodyFlags = S_TFFF;
                        if (flags & F_FUNC_BODY) {
                            bodyFlags |= F_DIRECTIVE_CTX;
                        }
                        for (i = 0, iz = stmt.body.length; i < iz; ++i) {
                            if (preserveBlankLines) {
                                if (i === 0) {
                                    if (stmt.body[0].leadingComments) {
                                        range = stmt.body[0].leadingComments[0].extendedRange;
                                        content = sourceCode.substring(range[0], range[1]);
                                        if (content[0] === '\n') {
                                            result = ['{'];
                                        }
                                    }
                                    if (!stmt.body[0].leadingComments) {
                                        generateBlankLines(stmt.range[0], stmt.body[0].range[0], result);
                                    }
                                }
                                if (i > 0) {
                                    if (!stmt.body[i - 1].trailingComments && !stmt.body[i].leadingComments) {
                                        generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                                    }
                                }
                            }
                            if (i === iz - 1) {
                                bodyFlags |= F_SEMICOLON_OPT;
                            }
                            if (stmt.body[i].leadingComments && preserveBlankLines) {
                                fragment = that.generateStatement(stmt.body[i], bodyFlags);
                            } else {
                                fragment = addIndent(that.generateStatement(stmt.body[i], bodyFlags));
                            }
                            result.push(fragment);
                            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                                if (preserveBlankLines && i < iz - 1) {
                                    if (!stmt.body[i + 1].leadingComments) {
                                        result.push(newline);
                                    }
                                } else {
                                    result.push(newline);
                                }
                            }
                            if (preserveBlankLines) {
                                if (i === iz - 1) {
                                    if (!stmt.body[i].trailingComments) {
                                        generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                                    }
                                }
                            }
                        }
                    });
                    result.push(addIndent('}'));
                    return result;
                },
                BreakStatement: function (stmt, flags) {
                    if (stmt.label) {
                        return 'break ' + stmt.label.name + this.semicolon(flags);
                    }
                    return 'break' + this.semicolon(flags);
                },
                ContinueStatement: function (stmt, flags) {
                    if (stmt.label) {
                        return 'continue ' + stmt.label.name + this.semicolon(flags);
                    }
                    return 'continue' + this.semicolon(flags);
                },
                ClassBody: function (stmt, _flags) {
                    var result = ['{', newline],
                        that = this;
                    withIndent(function (indent) {
                        var i, iz;
                        for (i = 0, iz = stmt.body.length; i < iz; ++i) {
                            result.push(indent);
                            result.push(that.generateExpression(stmt.body[i], Precedence_1.Precedence.Sequence, E_TTT));
                            if (i + 1 < iz) {
                                result.push(newline);
                            }
                        }
                    });
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                        result.push(newline);
                    }
                    result.push(base);
                    result.push('}');
                    return result;
                },
                ClassDeclaration: function (stmt, _flags) {
                    var result, fragment;
                    result = ['class ' + stmt.id.name];
                    if (stmt.superClass) {
                        fragment = join('extends', this.generateExpression(stmt.superClass, Precedence_1.Precedence.Assignment, E_TTT));
                        result = join(result, fragment);
                    }
                    result.push(space);
                    result.push(this.generateStatement(stmt.body, S_TFFT));
                    return result;
                },
                DirectiveStatement: function (stmt, flags) {
                    if (extra.raw && stmt.raw) {
                        return stmt.raw + this.semicolon(flags);
                    }
                    return escapeDirective(stmt.directive) + this.semicolon(flags);
                },
                DoWhileStatement: function (stmt, flags) {
                    var result = join('do', this.maybeBlock(stmt.body, S_TFFF));
                    result = this.maybeBlockSuffix(stmt.body, result);
                    return join(result, ['while' + space + '(', this.generateExpression(stmt.test, Precedence_1.Precedence.Sequence, E_TTT), ')' + this.semicolon(flags)]);
                },
                CatchClause: function (stmt, _flags) {
                    var result,
                        that = this;
                    withIndent(function () {
                        var guard;
                        result = ['catch' + space + '(', that.generateExpression(stmt.param, Precedence_1.Precedence.Sequence, E_TTT), ')'];
                        if (stmt.guard) {
                            guard = that.generateExpression(stmt.guard, Precedence_1.Precedence.Sequence, E_TTT);
                            result.splice(2, 0, ' if ', guard);
                        }
                    });
                    result.push(this.maybeBlock(stmt.body, S_TFFF));
                    return result;
                },
                DebuggerStatement: function (_stmt, flags) {
                    return 'debugger' + this.semicolon(flags);
                },
                EmptyStatement: function (_stmt, _flags) {
                    return ';';
                },
                ExportDeclaration: function (stmt, flags) {
                    var result = ['export'],
                        bodyFlags,
                        that = this;
                    bodyFlags = flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF;
                    if (stmt['default']) {
                        result = join(result, 'default');
                        if (isStatement(stmt.declaration)) {
                            result = join(result, this.generateStatement(stmt.declaration, bodyFlags));
                        } else {
                            result = join(result, this.generateExpression(stmt.declaration, Precedence_1.Precedence.Assignment, E_TTT) + this.semicolon(flags));
                        }
                        return result;
                    }
                    if (stmt.declaration) {
                        return join(result, this.generateStatement(stmt.declaration, bodyFlags));
                    }
                    if (stmt.specifiers) {
                        if (stmt.specifiers.length === 0) {
                            result = join(result, '{' + space + '}');
                        } else {
                            result = join(result, '{');
                            withIndent(function (indent) {
                                var i, iz;
                                result.push(newline);
                                for (i = 0, iz = stmt.specifiers.length; i < iz; ++i) {
                                    result.push(indent);
                                    result.push(that.generateExpression(stmt.specifiers[i], Precedence_1.Precedence.Sequence, E_TTT));
                                    if (i + 1 < iz) {
                                        result.push(',' + newline);
                                    }
                                }
                            });
                            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                                result.push(newline);
                            }
                            result.push(base + '}');
                        }
                        if (stmt.source) {
                            result = join(result, ['from' + space, this.generateExpression(stmt.source, Precedence_1.Precedence.Sequence, E_TTT), this.semicolon(flags)]);
                        } else {
                            result.push(this.semicolon(flags));
                        }
                    }
                    return result;
                },
                ExpressionStatement: function (stmt, flags) {
                    var result, fragment;
                    function isClassPrefixed(fragment) {
                        var code;
                        if (fragment.slice(0, 5) !== 'class') {
                            return false;
                        }
                        code = fragment.charCodeAt(5);
                        return code === 0x7B || code_4.isWhiteSpace(code) || code_1.isLineTerminator(code);
                    }
                    function isFunctionPrefixed(fragment) {
                        var code;
                        if (fragment.slice(0, 8) !== 'function') {
                            return false;
                        }
                        code = fragment.charCodeAt(8);
                        return code === 0x28 || code_4.isWhiteSpace(code) || code === 0x2A || code_1.isLineTerminator(code);
                    }
                    function isAsyncPrefixed(fragment) {
                        var code, i, iz;
                        if (fragment.slice(0, 5) !== 'async') {
                            return false;
                        }
                        if (!code_4.isWhiteSpace(fragment.charCodeAt(5))) {
                            return false;
                        }
                        for (i = 6, iz = fragment.length; i < iz; ++i) {
                            if (!code_4.isWhiteSpace(fragment.charCodeAt(i))) {
                                break;
                            }
                        }
                        if (i === iz) {
                            return false;
                        }
                        if (fragment.slice(i, i + 8) !== 'function') {
                            return false;
                        }
                        code = fragment.charCodeAt(i + 8);
                        return code === 0x28 || code_4.isWhiteSpace(code) || code === 0x2A || code_1.isLineTerminator(code);
                    }
                    result = [this.generateExpression(stmt.expression, Precedence_1.Precedence.Sequence, E_TTT)];
                    fragment = toSourceNodeWhenNeeded(result).toString();
                    if (fragment.charCodeAt(0) === 0x7B || isClassPrefixed(fragment) || isFunctionPrefixed(fragment) || isAsyncPrefixed(fragment) || directive && flags & F_DIRECTIVE_CTX && stmt.expression.type === estraverse_1.Syntax.Literal && typeof stmt.expression.value === 'string') {
                        result = ['(', result, ')' + this.semicolon(flags)];
                    } else {
                        result.push(this.semicolon(flags));
                    }
                    return result;
                },
                ImportDeclaration: function (stmt, flags) {
                    var result,
                        cursor,
                        that = this;
                    if (stmt.specifiers.length === 0) {
                        return ['import', space, this.generateExpression(stmt.source, Precedence_1.Precedence.Sequence, E_TTT), this.semicolon(flags)];
                    }
                    result = ['import'];
                    cursor = 0;
                    if (stmt.specifiers[cursor].type === estraverse_1.Syntax.ImportDefaultSpecifier) {
                        result = join(result, [this.generateExpression(stmt.specifiers[cursor], Precedence_1.Precedence.Sequence, E_TTT)]);
                        ++cursor;
                    }
                    if (stmt.specifiers[cursor]) {
                        if (cursor !== 0) {
                            result.push(',');
                        }
                        if (stmt.specifiers[cursor].type === estraverse_1.Syntax.ImportNamespaceSpecifier) {
                            result = join(result, [space, this.generateExpression(stmt.specifiers[cursor], Precedence_1.Precedence.Sequence, E_TTT)]);
                        } else {
                            result.push(space + '{');
                            if (stmt.specifiers.length - cursor === 1) {
                                result.push(space);
                                result.push(this.generateExpression(stmt.specifiers[cursor], Precedence_1.Precedence.Sequence, E_TTT));
                                result.push(space + '}' + space);
                            } else {
                                withIndent(function (indent) {
                                    var i, iz;
                                    result.push(newline);
                                    for (i = cursor, iz = stmt.specifiers.length; i < iz; ++i) {
                                        result.push(indent);
                                        result.push(that.generateExpression(stmt.specifiers[i], Precedence_1.Precedence.Sequence, E_TTT));
                                        if (i + 1 < iz) {
                                            result.push(',' + newline);
                                        }
                                    }
                                });
                                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                                    result.push(newline);
                                }
                                result.push(base + '}' + space);
                            }
                        }
                    }
                    result = join(result, ['from' + space, this.generateExpression(stmt.source, Precedence_1.Precedence.Sequence, E_TTT), this.semicolon(flags)]);
                    return result;
                },
                VariableDeclarator: function (stmt, flags) {
                    var itemFlags = flags & F_ALLOW_IN ? E_TTT : E_FTT;
                    if (stmt.init) {
                        return [this.generateExpression(stmt.id, Precedence_1.Precedence.Assignment, itemFlags), space, '=', space, this.generateExpression(stmt.init, Precedence_1.Precedence.Assignment, itemFlags)];
                    }
                    return this.generatePattern(stmt.id, Precedence_1.Precedence.Assignment, itemFlags);
                },
                VariableDeclaration: function (stmt, flags) {
                    var result,
                        i,
                        iz,
                        node,
                        bodyFlags,
                        that = this;
                    result = [stmt.kind];
                    bodyFlags = flags & F_ALLOW_IN ? S_TFFF : S_FFFF;
                    function block() {
                        node = stmt.declarations[0];
                        if (extra.comment && node.leadingComments) {
                            result.push('\n');
                            result.push(addIndent(that.generateStatement(node, bodyFlags)));
                        } else {
                            result.push(noEmptySpace());
                            result.push(that.generateStatement(node, bodyFlags));
                        }
                        for (i = 1, iz = stmt.declarations.length; i < iz; ++i) {
                            node = stmt.declarations[i];
                            if (extra.comment && node.leadingComments) {
                                result.push(',' + newline);
                                result.push(addIndent(that.generateStatement(node, bodyFlags)));
                            } else {
                                result.push(',' + space);
                                result.push(that.generateStatement(node, bodyFlags));
                            }
                        }
                    }
                    if (stmt.declarations.length > 1) {
                        withIndent(block);
                    } else {
                        block();
                    }
                    result.push(this.semicolon(flags));
                    return result;
                },
                ThrowStatement: function (stmt, flags) {
                    return [join('throw', this.generateExpression(stmt.argument, Precedence_1.Precedence.Sequence, E_TTT)), this.semicolon(flags)];
                },
                TryStatement: function (stmt, _flags) {
                    var result, i, iz, guardedHandlers;
                    result = ['try', this.maybeBlock(stmt.block, S_TFFF)];
                    result = this.maybeBlockSuffix(stmt.block, result);
                    if (stmt.handlers) {
                        for (i = 0, iz = stmt.handlers.length; i < iz; ++i) {
                            result = join(result, this.generateStatement(stmt.handlers[i], S_TFFF));
                            if (stmt.finalizer || i + 1 !== iz) {
                                result = this.maybeBlockSuffix(stmt.handlers[i].body, result);
                            }
                        }
                    } else {
                        guardedHandlers = stmt.guardedHandlers || [];
                        for (i = 0, iz = guardedHandlers.length; i < iz; ++i) {
                            result = join(result, this.generateStatement(guardedHandlers[i], S_TFFF));
                            if (stmt.finalizer || i + 1 !== iz) {
                                result = this.maybeBlockSuffix(guardedHandlers[i].body, result);
                            }
                        }
                        if (stmt.handler) {
                            if (isArray(stmt.handler)) {
                                for (i = 0, iz = stmt.handler.length; i < iz; ++i) {
                                    result = join(result, this.generateStatement(stmt.handler[i], S_TFFF));
                                    if (stmt.finalizer || i + 1 !== iz) {
                                        result = this.maybeBlockSuffix(stmt.handler[i].body, result);
                                    }
                                }
                            } else {
                                result = join(result, this.generateStatement(stmt.handler, S_TFFF));
                                if (stmt.finalizer) {
                                    result = this.maybeBlockSuffix(stmt.handler.body, result);
                                }
                            }
                        }
                    }
                    if (stmt.finalizer) {
                        result = join(result, ['finally', this.maybeBlock(stmt.finalizer, S_TFFF)]);
                    }
                    return result;
                },
                SwitchStatement: function (stmt, _flags) {
                    var result,
                        fragment,
                        i,
                        iz,
                        bodyFlags,
                        that = this;
                    withIndent(function () {
                        result = ['switch' + space + '(', that.generateExpression(stmt.discriminant, Precedence_1.Precedence.Sequence, E_TTT), ')' + space + '{' + newline];
                    });
                    if (stmt.cases) {
                        bodyFlags = S_TFFF;
                        for (i = 0, iz = stmt.cases.length; i < iz; ++i) {
                            if (i === iz - 1) {
                                bodyFlags |= F_SEMICOLON_OPT;
                            }
                            fragment = addIndent(this.generateStatement(stmt.cases[i], bodyFlags));
                            result.push(fragment);
                            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                                result.push(newline);
                            }
                        }
                    }
                    result.push(addIndent('}'));
                    return result;
                },
                SwitchCase: function (stmt, flags) {
                    var result,
                        fragment,
                        i,
                        iz,
                        bodyFlags,
                        that = this;
                    withIndent(function () {
                        if (stmt.test) {
                            result = [join('case', that.generateExpression(stmt.test, Precedence_1.Precedence.Sequence, E_TTT)), ':'];
                        } else {
                            result = ['default:'];
                        }
                        i = 0;
                        iz = stmt.consequent.length;
                        if (iz && stmt.consequent[0].type === estraverse_1.Syntax.BlockStatement) {
                            fragment = that.maybeBlock(stmt.consequent[0], S_TFFF);
                            result.push(fragment);
                            i = 1;
                        }
                        if (i !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                            result.push(newline);
                        }
                        bodyFlags = S_TFFF;
                        for (; i < iz; ++i) {
                            if (i === iz - 1 && flags & F_SEMICOLON_OPT) {
                                bodyFlags |= F_SEMICOLON_OPT;
                            }
                            fragment = addIndent(that.generateStatement(stmt.consequent[i], bodyFlags));
                            result.push(fragment);
                            if (i + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                                result.push(newline);
                            }
                        }
                    });
                    return result;
                },
                IfStatement: function (stmt, flags) {
                    var result,
                        bodyFlags,
                        semicolonOptional,
                        that = this;
                    withIndent(function () {
                        result = ['if' + space + '(', that.generateExpression(stmt.test, Precedence_1.Precedence.Sequence, E_TTT), ')'];
                    });
                    semicolonOptional = flags & F_SEMICOLON_OPT;
                    bodyFlags = S_TFFF;
                    if (semicolonOptional) {
                        bodyFlags |= F_SEMICOLON_OPT;
                    }
                    if (stmt.alternate) {
                        result.push(this.maybeBlock(stmt.consequent, S_TFFF));
                        result = this.maybeBlockSuffix(stmt.consequent, result);
                        if (stmt.alternate.type === estraverse_1.Syntax.IfStatement) {
                            result = join(result, ['else ', this.generateStatement(stmt.alternate, bodyFlags)]);
                        } else {
                            result = join(result, join('else', this.maybeBlock(stmt.alternate, bodyFlags)));
                        }
                    } else {
                        result.push(this.maybeBlock(stmt.consequent, bodyFlags));
                    }
                    return result;
                },
                ForStatement: function (stmt, flags) {
                    var result,
                        that = this;
                    withIndent(function () {
                        result = ['for' + space + '('];
                        if (stmt.init) {
                            if (stmt.init.type === estraverse_1.Syntax.VariableDeclaration) {
                                result.push(that.generateStatement(stmt.init, S_FFFF));
                            } else {
                                result.push(that.generateExpression(stmt.init, Precedence_1.Precedence.Sequence, E_FTT));
                                result.push(';');
                            }
                        } else {
                            result.push(';');
                        }
                        if (stmt.test) {
                            result.push(space);
                            result.push(that.generateExpression(stmt.test, Precedence_1.Precedence.Sequence, E_TTT));
                            result.push(';');
                        } else {
                            result.push(';');
                        }
                        if (stmt.update) {
                            result.push(space);
                            result.push(that.generateExpression(stmt.update, Precedence_1.Precedence.Sequence, E_TTT));
                            result.push(')');
                        } else {
                            result.push(')');
                        }
                    });
                    result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
                    return result;
                },
                ForInStatement: function (stmt, flags) {
                    return this.generateIterationForStatement('in', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
                },
                ForOfStatement: function (stmt, flags) {
                    return this.generateIterationForStatement('of', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
                },
                LabeledStatement: function (stmt, flags) {
                    return [stmt.label.name + ':', this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)];
                },
                Program: function (stmt, _flags) {
                    var result, fragment, i, iz, bodyFlags;
                    iz = stmt.body.length;
                    result = [safeConcatenation && iz > 0 ? '\n' : ''];
                    bodyFlags = S_TFTF;
                    for (i = 0; i < iz; ++i) {
                        if (!safeConcatenation && i === iz - 1) {
                            bodyFlags |= F_SEMICOLON_OPT;
                        }
                        if (preserveBlankLines) {
                            if (i === 0) {
                                if (!stmt.body[0].leadingComments) {
                                    generateBlankLines(stmt.range[0], stmt.body[i].range[0], result);
                                }
                            }
                            if (i > 0) {
                                if (!stmt.body[i - 1].trailingComments && !stmt.body[i].leadingComments) {
                                    generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                                }
                            }
                        }
                        fragment = addIndent(this.generateStatement(stmt.body[i], bodyFlags));
                        result.push(fragment);
                        if (i + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                            if (preserveBlankLines) {
                                if (!stmt.body[i + 1].leadingComments) {
                                    result.push(newline);
                                }
                            } else {
                                result.push(newline);
                            }
                        }
                        if (preserveBlankLines) {
                            if (i === iz - 1) {
                                if (!stmt.body[i].trailingComments) {
                                    generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                                }
                            }
                        }
                    }
                    return result;
                },
                FunctionDeclaration: function (stmt, _flags) {
                    return [generateAsyncPrefix(stmt, true), 'function', generateStarSuffix(stmt) || noEmptySpace(), generateIdentifier(stmt.id), this.generateFunctionBody(stmt)];
                },
                ReturnStatement: function (stmt, flags) {
                    if (stmt.argument) {
                        return [join('return', this.generateExpression(stmt.argument, Precedence_1.Precedence.Sequence, E_TTT)), this.semicolon(flags)];
                    }
                    return ['return' + this.semicolon(flags)];
                },
                WhileStatement: function (stmt, flags) {
                    var result,
                        that = this;
                    withIndent(function () {
                        result = ['while' + space + '(', that.generateExpression(stmt.test, Precedence_1.Precedence.Sequence, E_TTT), ')'];
                    });
                    result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
                    return result;
                },
                WithStatement: function (stmt, flags) {
                    var result,
                        that = this;
                    withIndent(function () {
                        result = ['with' + space + '(', that.generateExpression(stmt.object, Precedence_1.Precedence.Sequence, E_TTT), ')'];
                    });
                    result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
                    return result;
                }
            };
            merge(CodeGenerator.prototype, CodeGenerator.Statement);
            CodeGenerator.Expression = {
                SequenceExpression: function (expr, precedence, flags) {
                    var result, i, iz;
                    if (Precedence_1.Precedence.Sequence < precedence) {
                        flags |= F_ALLOW_IN;
                    }
                    result = [];
                    for (i = 0, iz = expr.expressions.length; i < iz; ++i) {
                        result.push(this.generateExpression(expr.expressions[i], Precedence_1.Precedence.Assignment, flags));
                        if (i + 1 < iz) {
                            result.push(',' + space);
                        }
                    }
                    return parenthesize(result, Precedence_1.Precedence.Sequence, precedence);
                },
                AssignmentExpression: function (expr, precedence, flags) {
                    return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
                },
                ArrowFunctionExpression: function (expr, precedence, _flags) {
                    return parenthesize(this.generateFunctionBody(expr), Precedence_1.Precedence.ArrowFunction, precedence);
                },
                ConditionalExpression: function (expr, precedence, flags) {
                    if (Precedence_1.Precedence.Conditional < precedence) {
                        flags |= F_ALLOW_IN;
                    }
                    return parenthesize([this.generateExpression(expr.test, Precedence_1.Precedence.LogicalOR, flags), space + '?' + space, this.generateExpression(expr.consequent, Precedence_1.Precedence.Assignment, flags), space + ':' + space, this.generateExpression(expr.alternate, Precedence_1.Precedence.Assignment, flags)], Precedence_1.Precedence.Conditional, precedence);
                },
                LogicalExpression: function (expr, precedence, flags) {
                    return this.BinaryExpression(expr, precedence, flags);
                },
                BinaryExpression: function (expr, precedence, flags) {
                    var result, currentPrecedence, fragment, leftSource;
                    currentPrecedence = BinaryPrecedence_1.BinaryPrecedence[expr.operator];
                    if (currentPrecedence < precedence) {
                        flags |= F_ALLOW_IN;
                    }
                    fragment = this.generateExpression(expr.left, currentPrecedence, flags);
                    leftSource = fragment.toString();
                    if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F && code_3.isIdentifierPart(expr.operator.charCodeAt(0))) {
                        result = [fragment, noEmptySpace(), expr.operator];
                    } else {
                        result = join(fragment, expr.operator);
                    }
                    fragment = this.generateExpression(expr.right, currentPrecedence + 1, flags);
                    if (expr.operator === '/' && fragment.toString().charAt(0) === '/' || expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
                        result.push(noEmptySpace());
                        result.push(fragment);
                    } else {
                        result = join(result, fragment);
                    }
                    if (expr.operator === 'in' && !(flags & F_ALLOW_IN)) {
                        return ['(', result, ')'];
                    }
                    return parenthesize(result, currentPrecedence, precedence);
                },
                CallExpression: function (expr, precedence, flags) {
                    var result, i, iz;
                    result = [this.generateExpression(expr.callee, Precedence_1.Precedence.Call, E_TTF)];
                    result.push('(');
                    for (i = 0, iz = expr['arguments'].length; i < iz; ++i) {
                        result.push(this.generateExpression(expr['arguments'][i], Precedence_1.Precedence.Assignment, E_TTT));
                        if (i + 1 < iz) {
                            result.push(',' + space);
                        }
                    }
                    result.push(')');
                    if (!(flags & F_ALLOW_CALL)) {
                        return ['(', result, ')'];
                    }
                    return parenthesize(result, Precedence_1.Precedence.Call, precedence);
                },
                NewExpression: function (expr, precedence, flags) {
                    var result, length, i, iz, itemFlags;
                    length = expr['arguments'].length;
                    itemFlags = flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0 ? E_TFT : E_TFF;
                    result = join('new', this.generateExpression(expr.callee, Precedence_1.Precedence.New, itemFlags));
                    if (!(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
                        result.push('(');
                        for (i = 0, iz = length; i < iz; ++i) {
                            result.push(this.generateExpression(expr['arguments'][i], Precedence_1.Precedence.Assignment, E_TTT));
                            if (i + 1 < iz) {
                                result.push(',' + space);
                            }
                        }
                        result.push(')');
                    }
                    return parenthesize(result, Precedence_1.Precedence.New, precedence);
                },
                MemberExpression: function (expr, precedence, flags) {
                    var result, fragment;
                    result = [this.generateExpression(expr.object, Precedence_1.Precedence.Call, flags & F_ALLOW_CALL ? E_TTF : E_TFF)];
                    if (expr.computed) {
                        result.push('[');
                        result.push(this.generateExpression(expr.property, Precedence_1.Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT));
                        result.push(']');
                    } else {
                        if (expr.object.type === estraverse_1.Syntax.Literal && typeof expr.object.value === 'number') {
                            fragment = toSourceNodeWhenNeeded(result).toString();
                            if (fragment.indexOf('.') < 0 && !/[eExX]/.test(fragment) && code_2.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) && !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)) {
                                result.push('.');
                            }
                        }
                        result.push('.');
                        result.push(generateIdentifier(expr.property));
                    }
                    return parenthesize(result, Precedence_1.Precedence.Member, precedence);
                },
                UnaryExpression: function (expr, precedence, _flags) {
                    var result, fragment, rightCharCode, leftSource, leftCharCode;
                    fragment = this.generateExpression(expr.argument, Precedence_1.Precedence.Unary, E_TTT);
                    if (space === '') {
                        result = join(expr.operator, fragment);
                    } else {
                        result = [expr.operator];
                        if (expr.operator.length > 2) {
                            result = join(result, fragment);
                        } else {
                            leftSource = toSourceNodeWhenNeeded(result).toString();
                            leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
                            rightCharCode = fragment.toString().charCodeAt(0);
                            if ((leftCharCode === 0x2B || leftCharCode === 0x2D) && leftCharCode === rightCharCode || code_3.isIdentifierPart(leftCharCode) && code_3.isIdentifierPart(rightCharCode)) {
                                result.push(noEmptySpace());
                                result.push(fragment);
                            } else {
                                result.push(fragment);
                            }
                        }
                    }
                    return parenthesize(result, Precedence_1.Precedence.Unary, precedence);
                },
                YieldExpression: function (expr, precedence, _flags) {
                    var result;
                    if (expr.delegate) {
                        result = 'yield*';
                    } else {
                        result = 'yield';
                    }
                    if (expr.argument) {
                        result = join(result, this.generateExpression(expr.argument, Precedence_1.Precedence.Yield, E_TTT));
                    }
                    return parenthesize(result, Precedence_1.Precedence.Yield, precedence);
                },
                AwaitExpression: function (expr, precedence, _flags) {
                    var result = join(expr.delegate ? 'await*' : 'await', this.generateExpression(expr.argument, Precedence_1.Precedence.Await, E_TTT));
                    return parenthesize(result, Precedence_1.Precedence.Await, precedence);
                },
                UpdateExpression: function (expr, precedence, _flags) {
                    if (expr.prefix) {
                        return parenthesize([expr.operator, this.generateExpression(expr.argument, Precedence_1.Precedence.Unary, E_TTT)], Precedence_1.Precedence.Unary, precedence);
                    }
                    return parenthesize([this.generateExpression(expr.argument, Precedence_1.Precedence.Postfix, E_TTT), expr.operator], Precedence_1.Precedence.Postfix, precedence);
                },
                FunctionExpression: function (expr, _precedence, _flags) {
                    var result = [generateAsyncPrefix(expr, true), 'function'];
                    if (expr.id) {
                        result.push(generateStarSuffix(expr) || noEmptySpace());
                        result.push(generateIdentifier(expr.id));
                    } else {
                        result.push(generateStarSuffix(expr) || space);
                    }
                    result.push(this.generateFunctionBody(expr));
                    return result;
                },
                ExportBatchSpecifier: function (_expr, _precedence, _flags) {
                    return '*';
                },
                ArrayPattern: function (expr, precedence, flags) {
                    return this.ArrayExpression(expr, precedence, flags);
                },
                ArrayExpression: function (expr, _precedence, _flags) {
                    var result,
                        multiline,
                        that = this;
                    if (!expr.elements.length) {
                        return '[]';
                    }
                    multiline = expr.elements.length > 1;
                    result = ['[', multiline ? newline : ''];
                    withIndent(function (indent) {
                        var i, iz;
                        for (i = 0, iz = expr.elements.length; i < iz; ++i) {
                            if (!expr.elements[i]) {
                                if (multiline) {
                                    result.push(indent);
                                }
                                if (i + 1 === iz) {
                                    result.push(',');
                                }
                            } else {
                                result.push(multiline ? indent : '');
                                result.push(that.generateExpression(expr.elements[i], Precedence_1.Precedence.Assignment, E_TTT));
                            }
                            if (i + 1 < iz) {
                                result.push(',' + (multiline ? newline : space));
                            }
                        }
                    });
                    if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                        result.push(newline);
                    }
                    result.push(multiline ? base : '');
                    result.push(']');
                    return result;
                },
                ClassExpression: function (expr, _precedence, _flags) {
                    var result, fragment;
                    result = ['class'];
                    if (expr.id) {
                        result = join(result, this.generateExpression(expr.id, Precedence_1.Precedence.Sequence, E_TTT));
                    }
                    if (expr.superClass) {
                        fragment = join('extends', this.generateExpression(expr.superClass, Precedence_1.Precedence.Assignment, E_TTT));
                        result = join(result, fragment);
                    }
                    result.push(space);
                    result.push(this.generateStatement(expr.body, S_TFFT));
                    return result;
                },
                MethodDefinition: function (expr, _precedence, _flags) {
                    var result, fragment;
                    if (expr['static']) {
                        result = ['static' + space];
                    } else {
                        result = [];
                    }
                    if (expr.kind === 'get' || expr.kind === 'set') {
                        fragment = [join(expr.kind, this.generatePropertyKey(expr.key, expr.computed)), this.generateFunctionBody(expr.value)];
                    } else {
                        fragment = [generateMethodPrefix(expr), this.generatePropertyKey(expr.key, expr.computed), this.generateFunctionBody(expr.value)];
                    }
                    return join(result, fragment);
                },
                Property: function (expr, _precedence, _flags) {
                    if (expr.kind === 'get' || expr.kind === 'set') {
                        return [expr.kind, noEmptySpace(), this.generatePropertyKey(expr.key, expr.computed), this.generateFunctionBody(expr.value)];
                    }
                    if (expr.shorthand) {
                        return this.generatePropertyKey(expr.key, expr.computed);
                    }
                    if (expr.method) {
                        return [generateMethodPrefix(expr), this.generatePropertyKey(expr.key, expr.computed), this.generateFunctionBody(expr.value)];
                    }
                    return [this.generatePropertyKey(expr.key, expr.computed), ':' + space, this.generateExpression(expr.value, Precedence_1.Precedence.Assignment, E_TTT)];
                },
                ObjectExpression: function (expr, _precedence, _flags) {
                    var multiline,
                        result,
                        fragment,
                        that = this;
                    if (!expr.properties.length) {
                        return '{}';
                    }
                    multiline = expr.properties.length > 1;
                    withIndent(function () {
                        fragment = that.generateExpression(expr.properties[0], Precedence_1.Precedence.Sequence, E_TTT);
                    });
                    if (!multiline) {
                        if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                            return ['{', space, fragment, space, '}'];
                        }
                    }
                    withIndent(function (indent) {
                        var i, iz;
                        result = ['{', newline, indent, fragment];
                        if (multiline) {
                            result.push(',' + newline);
                            for (i = 1, iz = expr.properties.length; i < iz; ++i) {
                                result.push(indent);
                                result.push(that.generateExpression(expr.properties[i], Precedence_1.Precedence.Sequence, E_TTT));
                                if (i + 1 < iz) {
                                    result.push(',' + newline);
                                }
                            }
                        }
                    });
                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                        result.push(newline);
                    }
                    result.push(base);
                    result.push('}');
                    return result;
                },
                ObjectPattern: function (expr, _precedence, _flags) {
                    var result,
                        i,
                        iz,
                        multiline,
                        property,
                        that = this;
                    if (!expr.properties.length) {
                        return '{}';
                    }
                    multiline = false;
                    if (expr.properties.length === 1) {
                        property = expr.properties[0];
                        if (property.value.type !== estraverse_1.Syntax.Identifier) {
                            multiline = true;
                        }
                    } else {
                        for (i = 0, iz = expr.properties.length; i < iz; ++i) {
                            property = expr.properties[i];
                            if (!property.shorthand) {
                                multiline = true;
                                break;
                            }
                        }
                    }
                    result = ['{', multiline ? newline : ''];
                    withIndent(function (indent) {
                        var i, iz;
                        for (i = 0, iz = expr.properties.length; i < iz; ++i) {
                            result.push(multiline ? indent : '');
                            result.push(that.generateExpression(expr.properties[i], Precedence_1.Precedence.Sequence, E_TTT));
                            if (i + 1 < iz) {
                                result.push(',' + (multiline ? newline : space));
                            }
                        }
                    });
                    if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                        result.push(newline);
                    }
                    result.push(multiline ? base : '');
                    result.push('}');
                    return result;
                },
                ThisExpression: function (_expr, _precedence, _flags) {
                    return 'this';
                },
                Identifier: function (expr, _precedence, _flags) {
                    return generateIdentifier(expr);
                },
                ImportDefaultSpecifier: function (expr, _precedence, _flags) {
                    return generateIdentifier(expr.id);
                },
                ImportNamespaceSpecifier: function (expr, _precedence, _flags) {
                    var result = ['*'];
                    if (expr.id) {
                        result.push(space + 'as' + noEmptySpace() + generateIdentifier(expr.id));
                    }
                    return result;
                },
                ImportSpecifier: function (expr, precedence, flags) {
                    return this.ExportSpecifier(expr, precedence, flags);
                },
                ExportSpecifier: function (expr, _precedence, _flags) {
                    var result = [expr.id.name];
                    if (expr.name) {
                        result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(expr.name));
                    }
                    return result;
                },
                Literal: function (expr, _precedence, _flags) {
                    var raw;
                    if (expr.hasOwnProperty('raw') && parse && extra.raw) {
                        try {
                            raw = parse(expr.raw).body[0].expression;
                            if (raw.type === estraverse_1.Syntax.Literal) {
                                if (raw.value === expr.value) {
                                    return expr.raw;
                                }
                            }
                        } catch (e) {}
                    }
                    if (expr.value === null) {
                        return 'null';
                    }
                    if (typeof expr.value === 'string') {
                        return escapeString(expr.value);
                    }
                    if (typeof expr.value === 'number') {
                        return generateNumber(expr.value);
                    }
                    if (typeof expr.value === 'boolean') {
                        return expr.value ? 'true' : 'false';
                    }
                    return generateRegExp(expr.value);
                },
                GeneratorExpression: function (expr, precedence, flags) {
                    return this.ComprehensionExpression(expr, precedence, flags);
                },
                ComprehensionExpression: function (expr, _precedence, _flags) {
                    var result,
                        i,
                        iz,
                        fragment,
                        that = this;
                    result = expr.type === estraverse_1.Syntax.GeneratorExpression ? ['('] : ['['];
                    if (extra.moz.comprehensionExpressionStartsWithAssignment) {
                        fragment = this.generateExpression(expr.body, Precedence_1.Precedence.Assignment, E_TTT);
                        result.push(fragment);
                    }
                    if (expr.blocks) {
                        withIndent(function () {
                            for (i = 0, iz = expr.blocks.length; i < iz; ++i) {
                                fragment = that.generateExpression(expr.blocks[i], Precedence_1.Precedence.Sequence, E_TTT);
                                if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
                                    result = join(result, fragment);
                                } else {
                                    result.push(fragment);
                                }
                            }
                        });
                    }
                    if (expr.filter) {
                        result = join(result, 'if' + space);
                        fragment = this.generateExpression(expr.filter, Precedence_1.Precedence.Sequence, E_TTT);
                        result = join(result, ['(', fragment, ')']);
                    }
                    if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
                        fragment = this.generateExpression(expr.body, Precedence_1.Precedence.Assignment, E_TTT);
                        result = join(result, fragment);
                    }
                    result.push(expr.type === estraverse_1.Syntax.GeneratorExpression ? ')' : ']');
                    return result;
                },
                ComprehensionBlock: function (expr, _precedence, _flags) {
                    var fragment;
                    if (expr.left.type === estraverse_1.Syntax.VariableDeclaration) {
                        fragment = [expr.left.kind, noEmptySpace(), this.generateStatement(expr.left.declarations[0], S_FFFF)];
                    } else {
                        fragment = this.generateExpression(expr.left, Precedence_1.Precedence.Call, E_TTT);
                    }
                    fragment = join(fragment, expr.of ? 'of' : 'in');
                    fragment = join(fragment, this.generateExpression(expr.right, Precedence_1.Precedence.Sequence, E_TTT));
                    return ['for' + space + '(', fragment, ')'];
                },
                SpreadElement: function (expr, _precedence, _flags) {
                    return ['...', this.generateExpression(expr.argument, Precedence_1.Precedence.Assignment, E_TTT)];
                },
                TaggedTemplateExpression: function (expr, precedence, flags) {
                    var itemFlags = E_TTF;
                    if (!(flags & F_ALLOW_CALL)) {
                        itemFlags = E_TFF;
                    }
                    var result = [this.generateExpression(expr.tag, Precedence_1.Precedence.Call, itemFlags), this.generateExpression(expr.quasi, Precedence_1.Precedence.Primary, E_FFT)];
                    return parenthesize(result, Precedence_1.Precedence.TaggedTemplate, precedence);
                },
                TemplateElement: function (expr, _precedence, _flags) {
                    return expr.value.raw;
                },
                TemplateLiteral: function (expr, _precedence, _flags) {
                    var result, i, iz;
                    result = ['`'];
                    for (i = 0, iz = expr.quasis.length; i < iz; ++i) {
                        result.push(this.generateExpression(expr.quasis[i], Precedence_1.Precedence.Primary, E_TTT));
                        if (i + 1 < iz) {
                            result.push('${' + space);
                            result.push(this.generateExpression(expr.expressions[i], Precedence_1.Precedence.Sequence, E_TTT));
                            result.push(space + '}');
                        }
                    }
                    result.push('`');
                    return result;
                },
                ModuleSpecifier: function (expr, precedence, flags) {
                    return this.Literal(expr, precedence, flags);
                }
            };
            merge(CodeGenerator.prototype, CodeGenerator.Expression);
            FORMAT_MINIFY = {
                indent: {
                    style: '',
                    base: 0
                },
                renumber: true,
                hexadecimal: true,
                quotes: 'auto',
                escapeless: true,
                compact: true,
                parentheses: false,
                semicolons: false
            };
            FORMAT_DEFAULTS = getDefaultOptions().format;
            exports_1("escodegen", escodegen = {
                generate: generate,
                Precedence: updateDeeply({}, Precedence_1.Precedence),
                FORMAT_MINIFY: FORMAT_MINIFY,
                FORMAT_DEFAULT: FORMAT_DEFAULTS
            });
        }
    };
});
System.register("generateRandomId.js", [], function (exports_1, context_1) {
    "use strict";

    var alphaNum;
    var __moduleName = context_1 && context_1.id;
    function generateRandomId(length) {
        if (length === void 0) {
            length = 10;
        }
        var id = '';
        for (var i = length; i--;) {
            id += alphaNum[~~(Math.random() * alphaNum.length)];
        }
        return id;
    }
    exports_1("generateRandomId", generateRandomId);
    return {
        setters: [],
        execute: function () {
            alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        }
    };
});
System.register("comment-handler.js", ["./syntax"], function (exports_1, context_1) {
    "use strict";

    var syntax_1, CommentHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (syntax_1_1) {
            syntax_1 = syntax_1_1;
        }],
        execute: function () {
            CommentHandler = function () {
                function CommentHandler() {
                    this.attach = false;
                    this.comments = [];
                    this.stack = [];
                    this.leading = [];
                    this.trailing = [];
                }
                CommentHandler.prototype.insertInnerComments = function (node, metadata) {
                    if (node.type === syntax_1.Syntax.BlockStatement && node.body.length === 0) {
                        var innerComments = [];
                        for (var i = this.leading.length - 1; i >= 0; --i) {
                            var entry = this.leading[i];
                            if (metadata.end.offset >= entry.start) {
                                innerComments.unshift(entry.comment);
                                this.leading.splice(i, 1);
                                this.trailing.splice(i, 1);
                            }
                        }
                        if (innerComments.length) {
                            node.innerComments = innerComments;
                        }
                    }
                };
                CommentHandler.prototype.findTrailingComments = function (metadata) {
                    var trailingComments = [];
                    if (this.trailing.length > 0) {
                        for (var i = this.trailing.length - 1; i >= 0; --i) {
                            var entry_1 = this.trailing[i];
                            if (entry_1.start >= metadata.end.offset) {
                                trailingComments.unshift(entry_1.comment);
                            }
                        }
                        this.trailing.length = 0;
                        return trailingComments;
                    }
                    var entry = this.stack[this.stack.length - 1];
                    if (entry && entry.node.trailingComments) {
                        var firstComment = entry.node.trailingComments[0];
                        if (firstComment && firstComment.range[0] >= metadata.end.offset) {
                            trailingComments = entry.node.trailingComments;
                            delete entry.node.trailingComments;
                        }
                    }
                    return trailingComments;
                };
                CommentHandler.prototype.findLeadingComments = function (metadata) {
                    var leadingComments = [];
                    var target;
                    while (this.stack.length > 0) {
                        var entry = this.stack[this.stack.length - 1];
                        if (entry && entry.start >= metadata.start.offset) {
                            target = entry.node;
                            this.stack.pop();
                        } else {
                            break;
                        }
                    }
                    if (target) {
                        var count = target.leadingComments ? target.leadingComments.length : 0;
                        for (var i = count - 1; i >= 0; --i) {
                            var comment = target.leadingComments[i];
                            if (comment.range[1] <= metadata.start.offset) {
                                leadingComments.unshift(comment);
                                target.leadingComments.splice(i, 1);
                            }
                        }
                        if (target.leadingComments && target.leadingComments.length === 0) {
                            delete target.leadingComments;
                        }
                        return leadingComments;
                    }
                    for (var i = this.leading.length - 1; i >= 0; --i) {
                        var entry = this.leading[i];
                        if (entry.start <= metadata.start.offset) {
                            leadingComments.unshift(entry.comment);
                            this.leading.splice(i, 1);
                        }
                    }
                    return leadingComments;
                };
                CommentHandler.prototype.visitNode = function (node, metadata) {
                    if (node.type === syntax_1.Syntax.Program && node.body.length > 0) {
                        return;
                    }
                    this.insertInnerComments(node, metadata);
                    var trailingComments = this.findTrailingComments(metadata);
                    var leadingComments = this.findLeadingComments(metadata);
                    if (leadingComments.length > 0) {
                        node.leadingComments = leadingComments;
                    }
                    if (trailingComments.length > 0) {
                        node.trailingComments = trailingComments;
                    }
                    this.stack.push({
                        node: node,
                        start: metadata.start.offset
                    });
                };
                CommentHandler.prototype.visitComment = function (node, metadata) {
                    var type = node.type[0] === 'L' ? 'Line' : 'Block';
                    var comment = {
                        type: type,
                        value: node.value
                    };
                    if (node.range) {
                        comment.range = node.range;
                    }
                    if (node.loc) {
                        comment.loc = node.loc;
                    }
                    this.comments.push(comment);
                    if (this.attach) {
                        var entry = {
                            comment: {
                                type: type,
                                value: node.value,
                                range: [metadata.start.offset, metadata.end.offset]
                            },
                            start: metadata.start.offset
                        };
                        if (node.loc) {
                            entry.comment.loc = node.loc;
                        }
                        node.type = type;
                        this.leading.push(entry);
                        this.trailing.push(entry);
                    }
                };
                CommentHandler.prototype.visit = function (node, metadata) {
                    if (node.type === 'LineComment') {
                        this.visitComment(node, metadata);
                    } else if (node.type === 'BlockComment') {
                        this.visitComment(node, metadata);
                    } else if (this.attach) {
                        this.visitNode(node, metadata);
                    }
                };
                return CommentHandler;
            }();
            exports_1("CommentHandler", CommentHandler);
        }
    };
});
System.register("jsx-nodes.js", ["./jsx-syntax"], function (exports_1, context_1) {
    "use strict";

    var jsx_syntax_1, JSXClosingElement, JSXElement, JSXEmptyExpression, JSXExpressionContainer, JSXIdentifier, JSXMemberExpression, JSXAttribute, JSXNamespacedName, JSXOpeningElement, JSXSpreadAttribute, JSXText;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (jsx_syntax_1_1) {
            jsx_syntax_1 = jsx_syntax_1_1;
        }],
        execute: function () {
            JSXClosingElement = function () {
                function JSXClosingElement(name) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXClosingElement;
                    this.name = name;
                }
                return JSXClosingElement;
            }();
            exports_1("JSXClosingElement", JSXClosingElement);
            JSXElement = function () {
                function JSXElement(openingElement, children, closingElement) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXElement;
                    this.openingElement = openingElement;
                    this.children = children;
                    this.closingElement = closingElement;
                }
                return JSXElement;
            }();
            exports_1("JSXElement", JSXElement);
            JSXEmptyExpression = function () {
                function JSXEmptyExpression() {
                    this.type = jsx_syntax_1.JSXSyntax.JSXEmptyExpression;
                }
                return JSXEmptyExpression;
            }();
            exports_1("JSXEmptyExpression", JSXEmptyExpression);
            JSXExpressionContainer = function () {
                function JSXExpressionContainer(expression) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXExpressionContainer;
                    this.expression = expression;
                }
                return JSXExpressionContainer;
            }();
            exports_1("JSXExpressionContainer", JSXExpressionContainer);
            JSXIdentifier = function () {
                function JSXIdentifier(name) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXIdentifier;
                    this.name = name;
                }
                return JSXIdentifier;
            }();
            exports_1("JSXIdentifier", JSXIdentifier);
            JSXMemberExpression = function () {
                function JSXMemberExpression(object, property) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXMemberExpression;
                    this.object = object;
                    this.property = property;
                }
                return JSXMemberExpression;
            }();
            exports_1("JSXMemberExpression", JSXMemberExpression);
            JSXAttribute = function () {
                function JSXAttribute(name, value) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXAttribute;
                    this.name = name;
                    this.value = value;
                }
                return JSXAttribute;
            }();
            exports_1("JSXAttribute", JSXAttribute);
            JSXNamespacedName = function () {
                function JSXNamespacedName(namespace, name) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXNamespacedName;
                    this.namespace = namespace;
                    this.name = name;
                }
                return JSXNamespacedName;
            }();
            exports_1("JSXNamespacedName", JSXNamespacedName);
            JSXOpeningElement = function () {
                function JSXOpeningElement(name, selfClosing, attributes) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXOpeningElement;
                    this.name = name;
                    this.selfClosing = selfClosing;
                    this.attributes = attributes;
                }
                return JSXOpeningElement;
            }();
            exports_1("JSXOpeningElement", JSXOpeningElement);
            JSXSpreadAttribute = function () {
                function JSXSpreadAttribute(argument) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXSpreadAttribute;
                    this.argument = argument;
                }
                return JSXSpreadAttribute;
            }();
            exports_1("JSXSpreadAttribute", JSXSpreadAttribute);
            JSXText = function () {
                function JSXText(value, raw) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXText;
                    this.value = value;
                    this.raw = raw;
                }
                return JSXText;
            }();
            exports_1("JSXText", JSXText);
        }
    };
});
System.register("jsx-syntax.js", [], function (exports_1, context_1) {
    "use strict";

    var JSXSyntax;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("JSXSyntax", JSXSyntax = {
                JSXAttribute: 'JSXAttribute',
                JSXClosingElement: 'JSXClosingElement',
                JSXElement: 'JSXElement',
                JSXEmptyExpression: 'JSXEmptyExpression',
                JSXExpressionContainer: 'JSXExpressionContainer',
                JSXIdentifier: 'JSXIdentifier',
                JSXMemberExpression: 'JSXMemberExpression',
                JSXNamespacedName: 'JSXNamespacedName',
                JSXOpeningElement: 'JSXOpeningElement',
                JSXSpreadAttribute: 'JSXSpreadAttribute',
                JSXText: 'JSXText'
            });
        }
    };
});
System.register("xhtml-entities.js", [], function (exports_1, context_1) {
    "use strict";

    var XHTMLEntities;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("XHTMLEntities", XHTMLEntities = {
                quot: '\u0022',
                amp: '\u0026',
                apos: '\u0027',
                gt: '\u003E',
                nbsp: '\u00A0',
                iexcl: '\u00A1',
                cent: '\u00A2',
                pound: '\u00A3',
                curren: '\u00A4',
                yen: '\u00A5',
                brvbar: '\u00A6',
                sect: '\u00A7',
                uml: '\u00A8',
                copy: '\u00A9',
                ordf: '\u00AA',
                laquo: '\u00AB',
                not: '\u00AC',
                shy: '\u00AD',
                reg: '\u00AE',
                macr: '\u00AF',
                deg: '\u00B0',
                plusmn: '\u00B1',
                sup2: '\u00B2',
                sup3: '\u00B3',
                acute: '\u00B4',
                micro: '\u00B5',
                para: '\u00B6',
                middot: '\u00B7',
                cedil: '\u00B8',
                sup1: '\u00B9',
                ordm: '\u00BA',
                raquo: '\u00BB',
                frac14: '\u00BC',
                frac12: '\u00BD',
                frac34: '\u00BE',
                iquest: '\u00BF',
                Agrave: '\u00C0',
                Aacute: '\u00C1',
                Acirc: '\u00C2',
                Atilde: '\u00C3',
                Auml: '\u00C4',
                Aring: '\u00C5',
                AElig: '\u00C6',
                Ccedil: '\u00C7',
                Egrave: '\u00C8',
                Eacute: '\u00C9',
                Ecirc: '\u00CA',
                Euml: '\u00CB',
                Igrave: '\u00CC',
                Iacute: '\u00CD',
                Icirc: '\u00CE',
                Iuml: '\u00CF',
                ETH: '\u00D0',
                Ntilde: '\u00D1',
                Ograve: '\u00D2',
                Oacute: '\u00D3',
                Ocirc: '\u00D4',
                Otilde: '\u00D5',
                Ouml: '\u00D6',
                times: '\u00D7',
                Oslash: '\u00D8',
                Ugrave: '\u00D9',
                Uacute: '\u00DA',
                Ucirc: '\u00DB',
                Uuml: '\u00DC',
                Yacute: '\u00DD',
                THORN: '\u00DE',
                szlig: '\u00DF',
                agrave: '\u00E0',
                aacute: '\u00E1',
                acirc: '\u00E2',
                atilde: '\u00E3',
                auml: '\u00E4',
                aring: '\u00E5',
                aelig: '\u00E6',
                ccedil: '\u00E7',
                egrave: '\u00E8',
                eacute: '\u00E9',
                ecirc: '\u00EA',
                euml: '\u00EB',
                igrave: '\u00EC',
                iacute: '\u00ED',
                icirc: '\u00EE',
                iuml: '\u00EF',
                eth: '\u00F0',
                ntilde: '\u00F1',
                ograve: '\u00F2',
                oacute: '\u00F3',
                ocirc: '\u00F4',
                otilde: '\u00F5',
                ouml: '\u00F6',
                divide: '\u00F7',
                oslash: '\u00F8',
                ugrave: '\u00F9',
                uacute: '\u00FA',
                ucirc: '\u00FB',
                uuml: '\u00FC',
                yacute: '\u00FD',
                thorn: '\u00FE',
                yuml: '\u00FF',
                OElig: '\u0152',
                oelig: '\u0153',
                Scaron: '\u0160',
                scaron: '\u0161',
                Yuml: '\u0178',
                fnof: '\u0192',
                circ: '\u02C6',
                tilde: '\u02DC',
                Alpha: '\u0391',
                Beta: '\u0392',
                Gamma: '\u0393',
                Delta: '\u0394',
                Epsilon: '\u0395',
                Zeta: '\u0396',
                Eta: '\u0397',
                Theta: '\u0398',
                Iota: '\u0399',
                Kappa: '\u039A',
                Lambda: '\u039B',
                Mu: '\u039C',
                Nu: '\u039D',
                Xi: '\u039E',
                Omicron: '\u039F',
                Pi: '\u03A0',
                Rho: '\u03A1',
                Sigma: '\u03A3',
                Tau: '\u03A4',
                Upsilon: '\u03A5',
                Phi: '\u03A6',
                Chi: '\u03A7',
                Psi: '\u03A8',
                Omega: '\u03A9',
                alpha: '\u03B1',
                beta: '\u03B2',
                gamma: '\u03B3',
                delta: '\u03B4',
                epsilon: '\u03B5',
                zeta: '\u03B6',
                eta: '\u03B7',
                theta: '\u03B8',
                iota: '\u03B9',
                kappa: '\u03BA',
                lambda: '\u03BB',
                mu: '\u03BC',
                nu: '\u03BD',
                xi: '\u03BE',
                omicron: '\u03BF',
                pi: '\u03C0',
                rho: '\u03C1',
                sigmaf: '\u03C2',
                sigma: '\u03C3',
                tau: '\u03C4',
                upsilon: '\u03C5',
                phi: '\u03C6',
                chi: '\u03C7',
                psi: '\u03C8',
                omega: '\u03C9',
                thetasym: '\u03D1',
                upsih: '\u03D2',
                piv: '\u03D6',
                ensp: '\u2002',
                emsp: '\u2003',
                thinsp: '\u2009',
                zwnj: '\u200C',
                zwj: '\u200D',
                lrm: '\u200E',
                rlm: '\u200F',
                ndash: '\u2013',
                mdash: '\u2014',
                lsquo: '\u2018',
                rsquo: '\u2019',
                sbquo: '\u201A',
                ldquo: '\u201C',
                rdquo: '\u201D',
                bdquo: '\u201E',
                dagger: '\u2020',
                Dagger: '\u2021',
                bull: '\u2022',
                hellip: '\u2026',
                permil: '\u2030',
                prime: '\u2032',
                Prime: '\u2033',
                lsaquo: '\u2039',
                rsaquo: '\u203A',
                oline: '\u203E',
                frasl: '\u2044',
                euro: '\u20AC',
                image: '\u2111',
                weierp: '\u2118',
                real: '\u211C',
                trade: '\u2122',
                alefsym: '\u2135',
                larr: '\u2190',
                uarr: '\u2191',
                rarr: '\u2192',
                darr: '\u2193',
                harr: '\u2194',
                crarr: '\u21B5',
                lArr: '\u21D0',
                uArr: '\u21D1',
                rArr: '\u21D2',
                dArr: '\u21D3',
                hArr: '\u21D4',
                forall: '\u2200',
                part: '\u2202',
                exist: '\u2203',
                empty: '\u2205',
                nabla: '\u2207',
                isin: '\u2208',
                notin: '\u2209',
                ni: '\u220B',
                prod: '\u220F',
                sum: '\u2211',
                minus: '\u2212',
                lowast: '\u2217',
                radic: '\u221A',
                prop: '\u221D',
                infin: '\u221E',
                ang: '\u2220',
                and: '\u2227',
                or: '\u2228',
                cap: '\u2229',
                cup: '\u222A',
                int: '\u222B',
                there4: '\u2234',
                sim: '\u223C',
                cong: '\u2245',
                asymp: '\u2248',
                ne: '\u2260',
                equiv: '\u2261',
                le: '\u2264',
                ge: '\u2265',
                sub: '\u2282',
                sup: '\u2283',
                nsub: '\u2284',
                sube: '\u2286',
                supe: '\u2287',
                oplus: '\u2295',
                otimes: '\u2297',
                perp: '\u22A5',
                sdot: '\u22C5',
                lceil: '\u2308',
                rceil: '\u2309',
                lfloor: '\u230A',
                rfloor: '\u230B',
                loz: '\u25CA',
                spades: '\u2660',
                clubs: '\u2663',
                hearts: '\u2665',
                diams: '\u2666',
                lang: '\u27E8',
                rang: '\u27E9'
            });
        }
    };
});
System.register("jsx-parser.js", ["./character", "./jsx-nodes", "./jsx-syntax", "./nodes", "./parser", "./token", "./xhtml-entities"], function (exports_1, context_1) {
    "use strict";

    var __extends = this && this.__extends || function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
                d.__proto__ = b;
            } || function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    }();
    var character_1, JSXNode, jsx_syntax_1, Node, parser_1, token_1, xhtml_entities_1, JSXParser;
    var __moduleName = context_1 && context_1.id;
    function getQualifiedElementName(elementName) {
        var qualifiedName;
        switch (elementName.type) {
            case jsx_syntax_1.JSXSyntax.JSXIdentifier:
                var id = elementName;
                qualifiedName = id.name;
                break;
            case jsx_syntax_1.JSXSyntax.JSXNamespacedName:
                var ns = elementName;
                qualifiedName = getQualifiedElementName(ns.namespace) + ':' + getQualifiedElementName(ns.name);
                break;
            case jsx_syntax_1.JSXSyntax.JSXMemberExpression:
                var expr = elementName;
                qualifiedName = getQualifiedElementName(expr.object) + '.' + getQualifiedElementName(expr.property);
                break;
            default:
                break;
        }
        return qualifiedName;
    }
    return {
        setters: [function (character_1_1) {
            character_1 = character_1_1;
        }, function (JSXNode_1) {
            JSXNode = JSXNode_1;
        }, function (jsx_syntax_1_1) {
            jsx_syntax_1 = jsx_syntax_1_1;
        }, function (Node_1) {
            Node = Node_1;
        }, function (parser_1_1) {
            parser_1 = parser_1_1;
        }, function (token_1_1) {
            token_1 = token_1_1;
        }, function (xhtml_entities_1_1) {
            xhtml_entities_1 = xhtml_entities_1_1;
        }],
        execute: function () {
            token_1.TokenName[100] = 'JSXIdentifier';
            token_1.TokenName[101] = 'JSXText';
            JSXParser = function (_super) {
                __extends(JSXParser, _super);
                function JSXParser(code, options, delegate) {
                    return _super.call(this, code, options, delegate) || this;
                }
                JSXParser.prototype.parsePrimaryExpression = function () {
                    return this.match('<') ? this.parseJSXRoot() : _super.prototype.parsePrimaryExpression.call(this);
                };
                JSXParser.prototype.startJSX = function () {
                    this.scanner.index = this.startMarker.index;
                    this.scanner.lineNumber = this.startMarker.line;
                    this.scanner.lineStart = this.startMarker.index - this.startMarker.column;
                };
                JSXParser.prototype.finishJSX = function () {
                    this.nextToken();
                };
                JSXParser.prototype.reenterJSX = function () {
                    this.startJSX();
                    this.expectJSX('}');
                    if (this.config.tokens) {
                        this.tokens.pop();
                    }
                };
                JSXParser.prototype.createJSXNode = function () {
                    this.collectComments();
                    return {
                        index: this.scanner.index,
                        line: this.scanner.lineNumber,
                        column: this.scanner.index - this.scanner.lineStart
                    };
                };
                JSXParser.prototype.createJSXChildNode = function () {
                    return {
                        index: this.scanner.index,
                        line: this.scanner.lineNumber,
                        column: this.scanner.index - this.scanner.lineStart
                    };
                };
                JSXParser.prototype.scanXHTMLEntity = function (quote) {
                    var result = '&';
                    var valid = true;
                    var terminated = false;
                    var numeric = false;
                    var hex = false;
                    while (!this.scanner.eof() && valid && !terminated) {
                        var ch = this.scanner.source[this.scanner.index];
                        if (ch === quote) {
                            break;
                        }
                        terminated = ch === ';';
                        result += ch;
                        ++this.scanner.index;
                        if (!terminated) {
                            switch (result.length) {
                                case 2:
                                    numeric = ch === '#';
                                    break;
                                case 3:
                                    if (numeric) {
                                        hex = ch === 'x';
                                        valid = hex || character_1.Character.isDecimalDigit(ch.charCodeAt(0));
                                        numeric = numeric && !hex;
                                    }
                                    break;
                                default:
                                    valid = valid && !(numeric && !character_1.Character.isDecimalDigit(ch.charCodeAt(0)));
                                    valid = valid && !(hex && !character_1.Character.isHexDigit(ch.charCodeAt(0)));
                                    break;
                            }
                        }
                    }
                    if (valid && terminated && result.length > 2) {
                        var str = result.substr(1, result.length - 2);
                        if (numeric && str.length > 1) {
                            result = String.fromCharCode(parseInt(str.substr(1), 10));
                        } else if (hex && str.length > 2) {
                            result = String.fromCharCode(parseInt('0' + str.substr(1), 16));
                        } else if (!numeric && !hex && xhtml_entities_1.XHTMLEntities[str]) {
                            result = xhtml_entities_1.XHTMLEntities[str];
                        }
                    }
                    return result;
                };
                JSXParser.prototype.lexJSX = function () {
                    var cp = this.scanner.source.charCodeAt(this.scanner.index);
                    if (cp === 60 || cp === 62 || cp === 47 || cp === 58 || cp === 61 || cp === 123 || cp === 125) {
                        var value = this.scanner.source[this.scanner.index++];
                        return {
                            type: 7,
                            value: value,
                            lineNumber: this.scanner.lineNumber,
                            lineStart: this.scanner.lineStart,
                            start: this.scanner.index - 1,
                            end: this.scanner.index
                        };
                    }
                    if (cp === 34 || cp === 39) {
                        var start = this.scanner.index;
                        var quote = this.scanner.source[this.scanner.index++];
                        var str = '';
                        while (!this.scanner.eof()) {
                            var ch = this.scanner.source[this.scanner.index++];
                            if (ch === quote) {
                                break;
                            } else if (ch === '&') {
                                str += this.scanXHTMLEntity(quote);
                            } else {
                                str += ch;
                            }
                        }
                        return {
                            type: 8,
                            value: str,
                            lineNumber: this.scanner.lineNumber,
                            lineStart: this.scanner.lineStart,
                            start: start,
                            end: this.scanner.index
                        };
                    }
                    if (cp === 46) {
                        var n1 = this.scanner.source.charCodeAt(this.scanner.index + 1);
                        var n2 = this.scanner.source.charCodeAt(this.scanner.index + 2);
                        var value = n1 === 46 && n2 === 46 ? '...' : '.';
                        var start = this.scanner.index;
                        this.scanner.index += value.length;
                        return {
                            type: 7,
                            value: value,
                            lineNumber: this.scanner.lineNumber,
                            lineStart: this.scanner.lineStart,
                            start: start,
                            end: this.scanner.index
                        };
                    }
                    if (cp === 96) {
                        return {
                            type: 10,
                            value: '',
                            lineNumber: this.scanner.lineNumber,
                            lineStart: this.scanner.lineStart,
                            start: this.scanner.index,
                            end: this.scanner.index
                        };
                    }
                    if (character_1.Character.isIdentifierStart(cp) && cp !== 92) {
                        var start = this.scanner.index;
                        ++this.scanner.index;
                        while (!this.scanner.eof()) {
                            var ch = this.scanner.source.charCodeAt(this.scanner.index);
                            if (character_1.Character.isIdentifierPart(ch) && ch !== 92) {
                                ++this.scanner.index;
                            } else if (ch === 45) {
                                ++this.scanner.index;
                            } else {
                                break;
                            }
                        }
                        var id = this.scanner.source.slice(start, this.scanner.index);
                        return {
                            type: 100,
                            value: id,
                            lineNumber: this.scanner.lineNumber,
                            lineStart: this.scanner.lineStart,
                            start: start,
                            end: this.scanner.index
                        };
                    }
                    return this.scanner.throwUnexpectedToken();
                };
                JSXParser.prototype.nextJSXToken = function () {
                    this.collectComments();
                    this.startMarker.index = this.scanner.index;
                    this.startMarker.line = this.scanner.lineNumber;
                    this.startMarker.column = this.scanner.index - this.scanner.lineStart;
                    var token = this.lexJSX();
                    this.lastMarker.index = this.scanner.index;
                    this.lastMarker.line = this.scanner.lineNumber;
                    this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
                    if (this.config.tokens) {
                        this.tokens.push(this.convertToken(token));
                    }
                    return token;
                };
                JSXParser.prototype.nextJSXText = function () {
                    this.startMarker.index = this.scanner.index;
                    this.startMarker.line = this.scanner.lineNumber;
                    this.startMarker.column = this.scanner.index - this.scanner.lineStart;
                    var start = this.scanner.index;
                    var text = '';
                    while (!this.scanner.eof()) {
                        var ch = this.scanner.source[this.scanner.index];
                        if (ch === '{' || ch === '<') {
                            break;
                        }
                        ++this.scanner.index;
                        text += ch;
                        if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
                            ++this.scanner.lineNumber;
                            if (ch === '\r' && this.scanner.source[this.scanner.index] === '\n') {
                                ++this.scanner.index;
                            }
                            this.scanner.lineStart = this.scanner.index;
                        }
                    }
                    this.lastMarker.index = this.scanner.index;
                    this.lastMarker.line = this.scanner.lineNumber;
                    this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
                    var token = {
                        type: 101,
                        value: text,
                        lineNumber: this.scanner.lineNumber,
                        lineStart: this.scanner.lineStart,
                        start: start,
                        end: this.scanner.index
                    };
                    if (text.length > 0 && this.config.tokens) {
                        this.tokens.push(this.convertToken(token));
                    }
                    return token;
                };
                JSXParser.prototype.peekJSXToken = function () {
                    var state = this.scanner.saveState();
                    this.scanner.scanComments();
                    var next = this.lexJSX();
                    this.scanner.restoreState(state);
                    return next;
                };
                JSXParser.prototype.expectJSX = function (value) {
                    var token = this.nextJSXToken();
                    if (token.type !== 7 || token.value !== value) {
                        this.throwUnexpectedToken(token);
                    }
                };
                JSXParser.prototype.matchJSX = function (value) {
                    var next = this.peekJSXToken();
                    return next.type === 7 && next.value === value;
                };
                JSXParser.prototype.parseJSXIdentifier = function () {
                    var node = this.createJSXNode();
                    var token = this.nextJSXToken();
                    if (token.type !== 100) {
                        this.throwUnexpectedToken(token);
                    }
                    return this.finalize(node, new JSXNode.JSXIdentifier(token.value));
                };
                JSXParser.prototype.parseJSXElementName = function () {
                    var node = this.createJSXNode();
                    var elementName = this.parseJSXIdentifier();
                    if (this.matchJSX(':')) {
                        var namespace = elementName;
                        this.expectJSX(':');
                        var name_1 = this.parseJSXIdentifier();
                        elementName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_1));
                    } else if (this.matchJSX('.')) {
                        while (this.matchJSX('.')) {
                            var object = elementName;
                            this.expectJSX('.');
                            var property = this.parseJSXIdentifier();
                            elementName = this.finalize(node, new JSXNode.JSXMemberExpression(object, property));
                        }
                    }
                    return elementName;
                };
                JSXParser.prototype.parseJSXAttributeName = function () {
                    var node = this.createJSXNode();
                    var attributeName;
                    var identifier = this.parseJSXIdentifier();
                    if (this.matchJSX(':')) {
                        var namespace = identifier;
                        this.expectJSX(':');
                        var name_2 = this.parseJSXIdentifier();
                        attributeName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_2));
                    } else {
                        attributeName = identifier;
                    }
                    return attributeName;
                };
                JSXParser.prototype.parseJSXStringLiteralAttribute = function () {
                    var node = this.createJSXNode();
                    var token = this.nextJSXToken();
                    if (token.type !== 8) {
                        this.throwUnexpectedToken(token);
                    }
                    var raw = this.getTokenRaw(token);
                    return this.finalize(node, new Node.Literal(token.value, raw));
                };
                JSXParser.prototype.parseJSXExpressionAttribute = function () {
                    var node = this.createJSXNode();
                    this.expectJSX('{');
                    this.finishJSX();
                    if (this.match('}')) {
                        this.tolerateError('JSX attributes must only be assigned a non-empty expression');
                    }
                    var expression = this.parseAssignmentExpression();
                    this.reenterJSX();
                    return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
                };
                JSXParser.prototype.parseJSXAttributeValue = function () {
                    return this.matchJSX('{') ? this.parseJSXExpressionAttribute() : this.matchJSX('<') ? this.parseJSXElement() : this.parseJSXStringLiteralAttribute();
                };
                JSXParser.prototype.parseJSXNameValueAttribute = function () {
                    var node = this.createJSXNode();
                    var name = this.parseJSXAttributeName();
                    var value = null;
                    if (this.matchJSX('=')) {
                        this.expectJSX('=');
                        value = this.parseJSXAttributeValue();
                    }
                    return this.finalize(node, new JSXNode.JSXAttribute(name, value));
                };
                JSXParser.prototype.parseJSXSpreadAttribute = function () {
                    var node = this.createJSXNode();
                    this.expectJSX('{');
                    this.expectJSX('...');
                    this.finishJSX();
                    var argument = this.parseAssignmentExpression();
                    this.reenterJSX();
                    return this.finalize(node, new JSXNode.JSXSpreadAttribute(argument));
                };
                JSXParser.prototype.parseJSXAttributes = function () {
                    var attributes = [];
                    while (!this.matchJSX('/') && !this.matchJSX('>')) {
                        var attribute = this.matchJSX('{') ? this.parseJSXSpreadAttribute() : this.parseJSXNameValueAttribute();
                        attributes.push(attribute);
                    }
                    return attributes;
                };
                JSXParser.prototype.parseJSXOpeningElement = function () {
                    var node = this.createJSXNode();
                    this.expectJSX('<');
                    var name = this.parseJSXElementName();
                    var attributes = this.parseJSXAttributes();
                    var selfClosing = this.matchJSX('/');
                    if (selfClosing) {
                        this.expectJSX('/');
                    }
                    this.expectJSX('>');
                    return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
                };
                JSXParser.prototype.parseJSXBoundaryElement = function () {
                    var node = this.createJSXNode();
                    this.expectJSX('<');
                    if (this.matchJSX('/')) {
                        this.expectJSX('/');
                        var name_3 = this.parseJSXElementName();
                        this.expectJSX('>');
                        return this.finalize(node, new JSXNode.JSXClosingElement(name_3));
                    }
                    var name = this.parseJSXElementName();
                    var attributes = this.parseJSXAttributes();
                    var selfClosing = this.matchJSX('/');
                    if (selfClosing) {
                        this.expectJSX('/');
                    }
                    this.expectJSX('>');
                    return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
                };
                JSXParser.prototype.parseJSXEmptyExpression = function () {
                    var node = this.createJSXChildNode();
                    this.collectComments();
                    this.lastMarker.index = this.scanner.index;
                    this.lastMarker.line = this.scanner.lineNumber;
                    this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
                    return this.finalize(node, new JSXNode.JSXEmptyExpression());
                };
                JSXParser.prototype.parseJSXExpressionContainer = function () {
                    var node = this.createJSXNode();
                    this.expectJSX('{');
                    var expression;
                    if (this.matchJSX('}')) {
                        expression = this.parseJSXEmptyExpression();
                        this.expectJSX('}');
                    } else {
                        this.finishJSX();
                        expression = this.parseAssignmentExpression();
                        this.reenterJSX();
                    }
                    return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
                };
                JSXParser.prototype.parseJSXChildren = function () {
                    var children = [];
                    while (!this.scanner.eof()) {
                        var node = this.createJSXChildNode();
                        var token = this.nextJSXText();
                        if (token.start < token.end) {
                            var raw = this.getTokenRaw(token);
                            var child = this.finalize(node, new JSXNode.JSXText(token.value, raw));
                            children.push(child);
                        }
                        if (this.scanner.source[this.scanner.index] === '{') {
                            var container = this.parseJSXExpressionContainer();
                            children.push(container);
                        } else {
                            break;
                        }
                    }
                    return children;
                };
                JSXParser.prototype.parseComplexJSXElement = function (el) {
                    var stack = [];
                    while (!this.scanner.eof()) {
                        el.children = el.children.concat(this.parseJSXChildren());
                        var node = this.createJSXChildNode();
                        var element = this.parseJSXBoundaryElement();
                        if (element.type === jsx_syntax_1.JSXSyntax.JSXOpeningElement) {
                            var opening = element;
                            if (opening.selfClosing) {
                                var child = this.finalize(node, new JSXNode.JSXElement(opening, [], null));
                                el.children.push(child);
                            } else {
                                stack.push(el);
                                el = { node: node, opening: opening, closing: null, children: [] };
                            }
                        }
                        if (element.type === jsx_syntax_1.JSXSyntax.JSXClosingElement) {
                            el.closing = element;
                            var open_1 = getQualifiedElementName(el.opening.name);
                            var close_1 = getQualifiedElementName(el.closing.name);
                            if (open_1 !== close_1) {
                                this.tolerateError('Expected corresponding JSX closing tag for %0', open_1);
                            }
                            if (stack.length > 0) {
                                var child = this.finalize(el.node, new JSXNode.JSXElement(el.opening, el.children, el.closing));
                                el = stack[stack.length - 1];
                                el.children.push(child);
                                stack.pop();
                            } else {
                                break;
                            }
                        }
                    }
                    return el;
                };
                JSXParser.prototype.parseJSXElement = function () {
                    var node = this.createJSXNode();
                    var opening = this.parseJSXOpeningElement();
                    var children = [];
                    var closing = null;
                    if (!opening.selfClosing) {
                        var el = this.parseComplexJSXElement({ node: node, opening: opening, closing: closing, children: children });
                        children = el.children;
                        closing = el.closing;
                    }
                    return this.finalize(node, new JSXNode.JSXElement(opening, children, closing));
                };
                JSXParser.prototype.parseJSXRoot = function () {
                    if (this.config.tokens) {
                        this.tokens.pop();
                    }
                    this.startJSX();
                    var element = this.parseJSXElement();
                    this.finishJSX();
                    return element;
                };
                return JSXParser;
            }(parser_1.Parser);
            exports_1("JSXParser", JSXParser);
        }
    };
});
System.register("nodes.js", ["./syntax"], function (exports_1, context_1) {
    "use strict";

    var syntax_1, ArrayExpression, ArrayPattern, ArrowFunctionExpression, AssignmentExpression, AssignmentPattern, AsyncArrowFunctionExpression, AsyncFunctionDeclaration, AsyncFunctionExpression, AwaitExpression, BinaryExpression, BlockStatement, BreakStatement, CallExpression, CatchClause, ClassBody, ClassDeclaration, ClassExpression, ComputedMemberExpression, ConditionalExpression, ContinueStatement, DebuggerStatement, Directive, DoWhileStatement, EmptyStatement, ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement, FunctionDeclaration, FunctionExpression, Identifier, IfStatement, Import, ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, LabeledStatement, Literal, MetaProperty, MethodDefinition, Module, NewExpression, ObjectExpression, ObjectPattern, Property, RegexLiteral, RestElement, RestProperty, ReturnStatement, Script, SequenceExpression, SpreadElement, SpreadProperty, StaticMemberExpression, Super, SwitchCase, SwitchStatement, TaggedTemplateExpression, TemplateElement, TemplateLiteral, ThisExpression, ThrowStatement, TryStatement, UnaryExpression, UpdateExpression, VariableDeclaration, VariableDeclarator, WhileStatement, WithStatement, YieldExpression;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (syntax_1_1) {
            syntax_1 = syntax_1_1;
        }],
        execute: function () {
            ArrayExpression = function () {
                function ArrayExpression(elements) {
                    this.type = syntax_1.Syntax.ArrayExpression;
                    this.elements = elements;
                }
                return ArrayExpression;
            }();
            exports_1("ArrayExpression", ArrayExpression);
            ArrayPattern = function () {
                function ArrayPattern(elements) {
                    this.type = syntax_1.Syntax.ArrayPattern;
                    this.elements = elements;
                }
                return ArrayPattern;
            }();
            exports_1("ArrayPattern", ArrayPattern);
            ArrowFunctionExpression = function () {
                function ArrowFunctionExpression(params, body, expression) {
                    this.type = syntax_1.Syntax.ArrowFunctionExpression;
                    this.id = null;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = expression;
                    this.async = false;
                }
                return ArrowFunctionExpression;
            }();
            exports_1("ArrowFunctionExpression", ArrowFunctionExpression);
            AssignmentExpression = function () {
                function AssignmentExpression(operator, left, right) {
                    this.type = syntax_1.Syntax.AssignmentExpression;
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }
                return AssignmentExpression;
            }();
            exports_1("AssignmentExpression", AssignmentExpression);
            AssignmentPattern = function () {
                function AssignmentPattern(left, right) {
                    this.type = syntax_1.Syntax.AssignmentPattern;
                    this.left = left;
                    this.right = right;
                }
                return AssignmentPattern;
            }();
            exports_1("AssignmentPattern", AssignmentPattern);
            AsyncArrowFunctionExpression = function () {
                function AsyncArrowFunctionExpression(params, body, expression) {
                    this.type = syntax_1.Syntax.ArrowFunctionExpression;
                    this.id = null;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = expression;
                    this.async = true;
                }
                return AsyncArrowFunctionExpression;
            }();
            exports_1("AsyncArrowFunctionExpression", AsyncArrowFunctionExpression);
            AsyncFunctionDeclaration = function () {
                function AsyncFunctionDeclaration(id, params, body) {
                    this.type = syntax_1.Syntax.FunctionDeclaration;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = false;
                    this.async = true;
                }
                return AsyncFunctionDeclaration;
            }();
            exports_1("AsyncFunctionDeclaration", AsyncFunctionDeclaration);
            AsyncFunctionExpression = function () {
                function AsyncFunctionExpression(id, params, body) {
                    this.type = syntax_1.Syntax.FunctionExpression;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = false;
                    this.async = true;
                }
                return AsyncFunctionExpression;
            }();
            exports_1("AsyncFunctionExpression", AsyncFunctionExpression);
            AwaitExpression = function () {
                function AwaitExpression(argument) {
                    this.type = syntax_1.Syntax.AwaitExpression;
                    this.argument = argument;
                }
                return AwaitExpression;
            }();
            exports_1("AwaitExpression", AwaitExpression);
            BinaryExpression = function () {
                function BinaryExpression(operator, left, right) {
                    var logical = operator === '||' || operator === '&&';
                    this.type = logical ? syntax_1.Syntax.LogicalExpression : syntax_1.Syntax.BinaryExpression;
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }
                return BinaryExpression;
            }();
            exports_1("BinaryExpression", BinaryExpression);
            BlockStatement = function () {
                function BlockStatement(body) {
                    this.type = syntax_1.Syntax.BlockStatement;
                    this.body = body;
                }
                return BlockStatement;
            }();
            exports_1("BlockStatement", BlockStatement);
            BreakStatement = function () {
                function BreakStatement(label) {
                    this.type = syntax_1.Syntax.BreakStatement;
                    this.label = label;
                }
                return BreakStatement;
            }();
            exports_1("BreakStatement", BreakStatement);
            CallExpression = function () {
                function CallExpression(callee, args) {
                    this.type = syntax_1.Syntax.CallExpression;
                    this.callee = callee;
                    this.arguments = args;
                }
                return CallExpression;
            }();
            exports_1("CallExpression", CallExpression);
            CatchClause = function () {
                function CatchClause(param, body) {
                    this.type = syntax_1.Syntax.CatchClause;
                    this.param = param;
                    this.body = body;
                }
                return CatchClause;
            }();
            exports_1("CatchClause", CatchClause);
            ClassBody = function () {
                function ClassBody(body) {
                    this.type = syntax_1.Syntax.ClassBody;
                    this.body = body;
                }
                return ClassBody;
            }();
            exports_1("ClassBody", ClassBody);
            ClassDeclaration = function () {
                function ClassDeclaration(id, superClass, body) {
                    this.type = syntax_1.Syntax.ClassDeclaration;
                    this.id = id;
                    this.superClass = superClass;
                    this.body = body;
                }
                return ClassDeclaration;
            }();
            exports_1("ClassDeclaration", ClassDeclaration);
            ClassExpression = function () {
                function ClassExpression(id, superClass, body) {
                    this.type = syntax_1.Syntax.ClassExpression;
                    this.id = id;
                    this.superClass = superClass;
                    this.body = body;
                }
                return ClassExpression;
            }();
            exports_1("ClassExpression", ClassExpression);
            ComputedMemberExpression = function () {
                function ComputedMemberExpression(object, property) {
                    this.type = syntax_1.Syntax.MemberExpression;
                    this.computed = true;
                    this.object = object;
                    this.property = property;
                }
                return ComputedMemberExpression;
            }();
            exports_1("ComputedMemberExpression", ComputedMemberExpression);
            ConditionalExpression = function () {
                function ConditionalExpression(test, consequent, alternate) {
                    this.type = syntax_1.Syntax.ConditionalExpression;
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }
                return ConditionalExpression;
            }();
            exports_1("ConditionalExpression", ConditionalExpression);
            ContinueStatement = function () {
                function ContinueStatement(label) {
                    this.type = syntax_1.Syntax.ContinueStatement;
                    this.label = label;
                }
                return ContinueStatement;
            }();
            exports_1("ContinueStatement", ContinueStatement);
            DebuggerStatement = function () {
                function DebuggerStatement() {
                    this.type = syntax_1.Syntax.DebuggerStatement;
                }
                return DebuggerStatement;
            }();
            exports_1("DebuggerStatement", DebuggerStatement);
            Directive = function () {
                function Directive(expression, directive) {
                    this.type = syntax_1.Syntax.ExpressionStatement;
                    this.expression = expression;
                    this.directive = directive;
                }
                return Directive;
            }();
            exports_1("Directive", Directive);
            DoWhileStatement = function () {
                function DoWhileStatement(body, test) {
                    this.type = syntax_1.Syntax.DoWhileStatement;
                    this.body = body;
                    this.test = test;
                }
                return DoWhileStatement;
            }();
            exports_1("DoWhileStatement", DoWhileStatement);
            EmptyStatement = function () {
                function EmptyStatement() {
                    this.type = syntax_1.Syntax.EmptyStatement;
                }
                return EmptyStatement;
            }();
            exports_1("EmptyStatement", EmptyStatement);
            ExportAllDeclaration = function () {
                function ExportAllDeclaration(source) {
                    this.type = syntax_1.Syntax.ExportAllDeclaration;
                    this.source = source;
                }
                return ExportAllDeclaration;
            }();
            exports_1("ExportAllDeclaration", ExportAllDeclaration);
            ExportDefaultDeclaration = function () {
                function ExportDefaultDeclaration(declaration) {
                    this.type = syntax_1.Syntax.ExportDefaultDeclaration;
                    this.declaration = declaration;
                }
                return ExportDefaultDeclaration;
            }();
            exports_1("ExportDefaultDeclaration", ExportDefaultDeclaration);
            ExportNamedDeclaration = function () {
                function ExportNamedDeclaration(declaration, specifiers, source) {
                    this.type = syntax_1.Syntax.ExportNamedDeclaration;
                    this.declaration = declaration;
                    this.specifiers = specifiers;
                    this.source = source;
                }
                return ExportNamedDeclaration;
            }();
            exports_1("ExportNamedDeclaration", ExportNamedDeclaration);
            ExportSpecifier = function () {
                function ExportSpecifier(local, exported) {
                    this.type = syntax_1.Syntax.ExportSpecifier;
                    this.exported = exported;
                    this.local = local;
                }
                return ExportSpecifier;
            }();
            exports_1("ExportSpecifier", ExportSpecifier);
            ExpressionStatement = function () {
                function ExpressionStatement(expression) {
                    this.type = syntax_1.Syntax.ExpressionStatement;
                    this.expression = expression;
                }
                return ExpressionStatement;
            }();
            exports_1("ExpressionStatement", ExpressionStatement);
            ForInStatement = function () {
                function ForInStatement(left, right, body) {
                    this.type = syntax_1.Syntax.ForInStatement;
                    this.left = left;
                    this.right = right;
                    this.body = body;
                    this.each = false;
                }
                return ForInStatement;
            }();
            exports_1("ForInStatement", ForInStatement);
            ForOfStatement = function () {
                function ForOfStatement(left, right, body) {
                    this.type = syntax_1.Syntax.ForOfStatement;
                    this.left = left;
                    this.right = right;
                    this.body = body;
                }
                return ForOfStatement;
            }();
            exports_1("ForOfStatement", ForOfStatement);
            ForStatement = function () {
                function ForStatement(init, test, update, body) {
                    this.type = syntax_1.Syntax.ForStatement;
                    this.init = init;
                    this.test = test;
                    this.update = update;
                    this.body = body;
                }
                return ForStatement;
            }();
            exports_1("ForStatement", ForStatement);
            FunctionDeclaration = function () {
                function FunctionDeclaration(id, params, body, generator) {
                    this.type = syntax_1.Syntax.FunctionDeclaration;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = generator;
                    this.expression = false;
                    this.async = false;
                }
                return FunctionDeclaration;
            }();
            exports_1("FunctionDeclaration", FunctionDeclaration);
            FunctionExpression = function () {
                function FunctionExpression(id, params, body, generator) {
                    this.type = syntax_1.Syntax.FunctionExpression;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = generator;
                    this.expression = false;
                    this.async = false;
                }
                return FunctionExpression;
            }();
            exports_1("FunctionExpression", FunctionExpression);
            Identifier = function () {
                function Identifier(name) {
                    this.type = syntax_1.Syntax.Identifier;
                    this.name = name;
                }
                return Identifier;
            }();
            exports_1("Identifier", Identifier);
            IfStatement = function () {
                function IfStatement(test, consequent, alternate) {
                    this.type = syntax_1.Syntax.IfStatement;
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }
                return IfStatement;
            }();
            exports_1("IfStatement", IfStatement);
            Import = function () {
                function Import() {
                    this.type = syntax_1.Syntax.Import;
                }
                return Import;
            }();
            exports_1("Import", Import);
            ImportDeclaration = function () {
                function ImportDeclaration(specifiers, source) {
                    this.type = syntax_1.Syntax.ImportDeclaration;
                    this.specifiers = specifiers;
                    this.source = source;
                }
                return ImportDeclaration;
            }();
            exports_1("ImportDeclaration", ImportDeclaration);
            ImportDefaultSpecifier = function () {
                function ImportDefaultSpecifier(local) {
                    this.type = syntax_1.Syntax.ImportDefaultSpecifier;
                    this.local = local;
                }
                return ImportDefaultSpecifier;
            }();
            exports_1("ImportDefaultSpecifier", ImportDefaultSpecifier);
            ImportNamespaceSpecifier = function () {
                function ImportNamespaceSpecifier(local) {
                    this.type = syntax_1.Syntax.ImportNamespaceSpecifier;
                    this.local = local;
                }
                return ImportNamespaceSpecifier;
            }();
            exports_1("ImportNamespaceSpecifier", ImportNamespaceSpecifier);
            ImportSpecifier = function () {
                function ImportSpecifier(local, imported) {
                    this.type = syntax_1.Syntax.ImportSpecifier;
                    this.local = local;
                    this.imported = imported;
                }
                return ImportSpecifier;
            }();
            exports_1("ImportSpecifier", ImportSpecifier);
            LabeledStatement = function () {
                function LabeledStatement(label, body) {
                    this.type = syntax_1.Syntax.LabeledStatement;
                    this.label = label;
                    this.body = body;
                }
                return LabeledStatement;
            }();
            exports_1("LabeledStatement", LabeledStatement);
            Literal = function () {
                function Literal(value, raw) {
                    this.type = syntax_1.Syntax.Literal;
                    this.value = value;
                    this.raw = raw;
                }
                return Literal;
            }();
            exports_1("Literal", Literal);
            MetaProperty = function () {
                function MetaProperty(meta, property) {
                    this.type = syntax_1.Syntax.MetaProperty;
                    this.meta = meta;
                    this.property = property;
                }
                return MetaProperty;
            }();
            exports_1("MetaProperty", MetaProperty);
            MethodDefinition = function () {
                function MethodDefinition(key, computed, value, kind, isStatic) {
                    this.type = syntax_1.Syntax.MethodDefinition;
                    this.key = key;
                    this.computed = computed;
                    this.value = value;
                    this.kind = kind;
                    this.static = isStatic;
                }
                return MethodDefinition;
            }();
            exports_1("MethodDefinition", MethodDefinition);
            Module = function () {
                function Module(body) {
                    this.type = syntax_1.Syntax.Program;
                    this.body = body;
                    this.sourceType = 'module';
                }
                return Module;
            }();
            exports_1("Module", Module);
            NewExpression = function () {
                function NewExpression(callee, args) {
                    this.type = syntax_1.Syntax.NewExpression;
                    this.callee = callee;
                    this.arguments = args;
                }
                return NewExpression;
            }();
            exports_1("NewExpression", NewExpression);
            ObjectExpression = function () {
                function ObjectExpression(properties) {
                    this.type = syntax_1.Syntax.ObjectExpression;
                    this.properties = properties;
                }
                return ObjectExpression;
            }();
            exports_1("ObjectExpression", ObjectExpression);
            ObjectPattern = function () {
                function ObjectPattern(properties) {
                    this.type = syntax_1.Syntax.ObjectPattern;
                    this.properties = properties;
                }
                return ObjectPattern;
            }();
            exports_1("ObjectPattern", ObjectPattern);
            Property = function () {
                function Property(kind, key, computed, value, method, shorthand) {
                    this.type = syntax_1.Syntax.Property;
                    this.key = key;
                    this.computed = computed;
                    this.value = value;
                    this.kind = kind;
                    this.method = method;
                    this.shorthand = shorthand;
                }
                return Property;
            }();
            exports_1("Property", Property);
            RegexLiteral = function () {
                function RegexLiteral(value, raw, pattern, flags) {
                    this.type = syntax_1.Syntax.Literal;
                    this.value = value;
                    this.raw = raw;
                    this.regex = { pattern: pattern, flags: flags };
                }
                return RegexLiteral;
            }();
            exports_1("RegexLiteral", RegexLiteral);
            RestElement = function () {
                function RestElement(argument) {
                    this.type = syntax_1.Syntax.RestElement;
                    this.argument = argument;
                }
                return RestElement;
            }();
            exports_1("RestElement", RestElement);
            RestProperty = function () {
                function RestProperty(argument) {
                    this.type = syntax_1.Syntax.RestProperty;
                    this.argument = argument;
                }
                return RestProperty;
            }();
            exports_1("RestProperty", RestProperty);
            ReturnStatement = function () {
                function ReturnStatement(argument) {
                    this.type = syntax_1.Syntax.ReturnStatement;
                    this.argument = argument;
                }
                return ReturnStatement;
            }();
            exports_1("ReturnStatement", ReturnStatement);
            Script = function () {
                function Script(body) {
                    this.type = syntax_1.Syntax.Program;
                    this.body = body;
                    this.sourceType = 'script';
                }
                return Script;
            }();
            exports_1("Script", Script);
            SequenceExpression = function () {
                function SequenceExpression(expressions) {
                    this.type = syntax_1.Syntax.SequenceExpression;
                    this.expressions = expressions;
                }
                return SequenceExpression;
            }();
            exports_1("SequenceExpression", SequenceExpression);
            SpreadElement = function () {
                function SpreadElement(argument) {
                    this.type = syntax_1.Syntax.SpreadElement;
                    this.argument = argument;
                }
                return SpreadElement;
            }();
            exports_1("SpreadElement", SpreadElement);
            SpreadProperty = function () {
                function SpreadProperty(argument) {
                    this.type = syntax_1.Syntax.SpreadProperty;
                    this.argument = argument;
                }
                return SpreadProperty;
            }();
            exports_1("SpreadProperty", SpreadProperty);
            StaticMemberExpression = function () {
                function StaticMemberExpression(object, property) {
                    this.type = syntax_1.Syntax.MemberExpression;
                    this.computed = false;
                    this.object = object;
                    this.property = property;
                }
                return StaticMemberExpression;
            }();
            exports_1("StaticMemberExpression", StaticMemberExpression);
            Super = function () {
                function Super() {
                    this.type = syntax_1.Syntax.Super;
                }
                return Super;
            }();
            exports_1("Super", Super);
            SwitchCase = function () {
                function SwitchCase(test, consequent) {
                    this.type = syntax_1.Syntax.SwitchCase;
                    this.test = test;
                    this.consequent = consequent;
                }
                return SwitchCase;
            }();
            exports_1("SwitchCase", SwitchCase);
            SwitchStatement = function () {
                function SwitchStatement(discriminant, cases) {
                    this.type = syntax_1.Syntax.SwitchStatement;
                    this.discriminant = discriminant;
                    this.cases = cases;
                }
                return SwitchStatement;
            }();
            exports_1("SwitchStatement", SwitchStatement);
            TaggedTemplateExpression = function () {
                function TaggedTemplateExpression(tag, quasi) {
                    this.type = syntax_1.Syntax.TaggedTemplateExpression;
                    this.tag = tag;
                    this.quasi = quasi;
                }
                return TaggedTemplateExpression;
            }();
            exports_1("TaggedTemplateExpression", TaggedTemplateExpression);
            TemplateElement = function () {
                function TemplateElement(value, tail) {
                    this.type = syntax_1.Syntax.TemplateElement;
                    this.value = value;
                    this.tail = tail;
                }
                return TemplateElement;
            }();
            exports_1("TemplateElement", TemplateElement);
            TemplateLiteral = function () {
                function TemplateLiteral(quasis, expressions) {
                    this.type = syntax_1.Syntax.TemplateLiteral;
                    this.quasis = quasis;
                    this.expressions = expressions;
                }
                return TemplateLiteral;
            }();
            exports_1("TemplateLiteral", TemplateLiteral);
            ThisExpression = function () {
                function ThisExpression() {
                    this.type = syntax_1.Syntax.ThisExpression;
                }
                return ThisExpression;
            }();
            exports_1("ThisExpression", ThisExpression);
            ThrowStatement = function () {
                function ThrowStatement(argument) {
                    this.type = syntax_1.Syntax.ThrowStatement;
                    this.argument = argument;
                }
                return ThrowStatement;
            }();
            exports_1("ThrowStatement", ThrowStatement);
            TryStatement = function () {
                function TryStatement(block, handler, finalizer) {
                    this.type = syntax_1.Syntax.TryStatement;
                    this.block = block;
                    this.handler = handler;
                    this.finalizer = finalizer;
                }
                return TryStatement;
            }();
            exports_1("TryStatement", TryStatement);
            UnaryExpression = function () {
                function UnaryExpression(operator, argument) {
                    this.type = syntax_1.Syntax.UnaryExpression;
                    this.operator = operator;
                    this.argument = argument;
                    this.prefix = true;
                }
                return UnaryExpression;
            }();
            exports_1("UnaryExpression", UnaryExpression);
            UpdateExpression = function () {
                function UpdateExpression(operator, argument, prefix) {
                    this.type = syntax_1.Syntax.UpdateExpression;
                    this.operator = operator;
                    this.argument = argument;
                    this.prefix = prefix;
                }
                return UpdateExpression;
            }();
            exports_1("UpdateExpression", UpdateExpression);
            VariableDeclaration = function () {
                function VariableDeclaration(declarations, kind) {
                    this.type = syntax_1.Syntax.VariableDeclaration;
                    this.declarations = declarations;
                    this.kind = kind;
                }
                return VariableDeclaration;
            }();
            exports_1("VariableDeclaration", VariableDeclaration);
            VariableDeclarator = function () {
                function VariableDeclarator(id, init) {
                    this.type = syntax_1.Syntax.VariableDeclarator;
                    this.id = id;
                    this.init = init;
                }
                return VariableDeclarator;
            }();
            exports_1("VariableDeclarator", VariableDeclarator);
            WhileStatement = function () {
                function WhileStatement(test, body) {
                    this.type = syntax_1.Syntax.WhileStatement;
                    this.test = test;
                    this.body = body;
                }
                return WhileStatement;
            }();
            exports_1("WhileStatement", WhileStatement);
            WithStatement = function () {
                function WithStatement(object, body) {
                    this.type = syntax_1.Syntax.WithStatement;
                    this.object = object;
                    this.body = body;
                }
                return WithStatement;
            }();
            exports_1("WithStatement", WithStatement);
            YieldExpression = function () {
                function YieldExpression(argument, delegate) {
                    this.type = syntax_1.Syntax.YieldExpression;
                    this.argument = argument;
                    this.delegate = delegate;
                }
                return YieldExpression;
            }();
            exports_1("YieldExpression", YieldExpression);
        }
    };
});
System.register("Precedence.js", [], function (exports_1, context_1) {
    "use strict";

    var Precedence;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("Precedence", Precedence = {
                Sequence: 0,
                Yield: 1,
                Await: 1,
                Assignment: 1,
                Conditional: 2,
                ArrowFunction: 2,
                LogicalOR: 3,
                LogicalAND: 4,
                BitwiseAND: 5,
                Equality: 6,
                Relational: 7,
                Additive: 8,
                Multiplicative: 9,
                BitwiseXOR: 10,
                BitwiseOR: 11,
                BitwiseSHIFT: 12,
                Unary: 13,
                Postfix: 14,
                Call: 15,
                New: 16,
                TaggedTemplate: 17,
                Member: 18,
                Primary: 19
            });
        }
    };
});
System.register("parser.js", ["./assert", "./error-handler", "./messages", "./nodes", "./scanner", "./syntax", "./token", "./Precedence"], function (exports_1, context_1) {
    "use strict";

    var assert_1, error_handler_1, messages_1, Node, scanner_1, syntax_1, token_1, Precedence_1, ArrowParameterPlaceHolder, Parser;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (assert_1_1) {
            assert_1 = assert_1_1;
        }, function (error_handler_1_1) {
            error_handler_1 = error_handler_1_1;
        }, function (messages_1_1) {
            messages_1 = messages_1_1;
        }, function (Node_1) {
            Node = Node_1;
        }, function (scanner_1_1) {
            scanner_1 = scanner_1_1;
        }, function (syntax_1_1) {
            syntax_1 = syntax_1_1;
        }, function (token_1_1) {
            token_1 = token_1_1;
        }, function (Precedence_1_1) {
            Precedence_1 = Precedence_1_1;
        }],
        execute: function () {
            ArrowParameterPlaceHolder = 'ArrowParameterPlaceHolder';
            Parser = function () {
                function Parser(code, options, delegate) {
                    if (options === void 0) {
                        options = {};
                    }
                    this.config = {
                        range: typeof options.range === 'boolean' && options.range,
                        loc: typeof options.loc === 'boolean' && options.loc,
                        source: null,
                        tokens: typeof options.tokens === 'boolean' && options.tokens,
                        comment: typeof options.comment === 'boolean' && options.comment,
                        tolerant: typeof options.tolerant === 'boolean' && options.tolerant
                    };
                    if (this.config.loc && options.source && options.source !== null) {
                        this.config.source = String(options.source);
                    }
                    this.delegate = delegate;
                    this.errorHandler = new error_handler_1.ErrorHandler();
                    this.errorHandler.tolerant = this.config.tolerant;
                    this.scanner = new scanner_1.Scanner(code, this.errorHandler);
                    this.scanner.trackComment = this.config.comment;
                    this.operatorPrecedence = {
                        ')': Precedence_1.Precedence.Sequence,
                        ';': Precedence_1.Precedence.Sequence,
                        ',': Precedence_1.Precedence.Sequence,
                        '=': Precedence_1.Precedence.Sequence,
                        ']': Precedence_1.Precedence.Sequence,
                        '||': Precedence_1.Precedence.LogicalOR,
                        '&&': Precedence_1.Precedence.LogicalAND,
                        '|': Precedence_1.Precedence.BitwiseOR,
                        '^': Precedence_1.Precedence.BitwiseXOR,
                        '&': Precedence_1.Precedence.BitwiseAND,
                        '==': Precedence_1.Precedence.Equality,
                        '!=': Precedence_1.Precedence.Equality,
                        '===': Precedence_1.Precedence.Equality,
                        '!==': Precedence_1.Precedence.Equality,
                        '<': Precedence_1.Precedence.Relational,
                        '>': Precedence_1.Precedence.Relational,
                        '<=': Precedence_1.Precedence.Relational,
                        '>=': Precedence_1.Precedence.Relational,
                        '<<': Precedence_1.Precedence.BitwiseSHIFT,
                        '>>': Precedence_1.Precedence.BitwiseSHIFT,
                        '>>>': Precedence_1.Precedence.BitwiseSHIFT,
                        '+': Precedence_1.Precedence.Additive,
                        '-': Precedence_1.Precedence.Additive,
                        '*': Precedence_1.Precedence.Multiplicative,
                        '/': Precedence_1.Precedence.Multiplicative,
                        '%': Precedence_1.Precedence.BitwiseSHIFT
                    };
                    this.lookahead = {
                        type: 2,
                        value: '',
                        lineNumber: this.scanner.lineNumber,
                        lineStart: 0,
                        start: 0,
                        end: 0
                    };
                    this.hasLineTerminator = false;
                    this.context = {
                        isModule: false,
                        await: false,
                        allowIn: true,
                        allowStrictDirective: true,
                        allowYield: true,
                        firstCoverInitializedNameError: null,
                        isAssignmentTarget: false,
                        isBindingElement: false,
                        inFunctionBody: false,
                        inIteration: false,
                        inSwitch: false,
                        labelSet: {},
                        strict: false
                    };
                    this.tokens = [];
                    this.startMarker = {
                        index: 0,
                        line: this.scanner.lineNumber,
                        column: 0
                    };
                    this.lastMarker = {
                        index: 0,
                        line: this.scanner.lineNumber,
                        column: 0
                    };
                    this.nextToken();
                    this.lastMarker = {
                        index: this.scanner.index,
                        line: this.scanner.lineNumber,
                        column: this.scanner.index - this.scanner.lineStart
                    };
                }
                Parser.prototype.throwError = function (messageFormat) {
                    var _values = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        _values[_i - 1] = arguments[_i];
                    }
                    var args = Array.prototype.slice.call(arguments, 1);
                    var msg = messageFormat.replace(/%(\d)/g, function (_whole, idx) {
                        assert_1.assert(idx < args.length, 'Message reference must be in range');
                        return args[idx];
                    });
                    var index = this.lastMarker.index;
                    var line = this.lastMarker.line;
                    var column = this.lastMarker.column + 1;
                    throw this.errorHandler.createError(index, line, column, msg);
                };
                Parser.prototype.tolerateError = function (messageFormat) {
                    var _values = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        _values[_i - 1] = arguments[_i];
                    }
                    var args = Array.prototype.slice.call(arguments, 1);
                    var msg = messageFormat.replace(/%(\d)/g, function (_whole, idx) {
                        assert_1.assert(idx < args.length, 'Message reference must be in range');
                        return args[idx];
                    });
                    var index = this.lastMarker.index;
                    var line = this.scanner.lineNumber;
                    var column = this.lastMarker.column + 1;
                    this.errorHandler.tolerateError(index, line, column, msg);
                };
                Parser.prototype.unexpectedTokenError = function (token, message) {
                    var msg = message || messages_1.Messages.UnexpectedToken;
                    var value;
                    if (token) {
                        if (!message) {
                            msg = token.type === 2 ? messages_1.Messages.UnexpectedEOS : token.type === 3 ? messages_1.Messages.UnexpectedIdentifier : token.type === 6 ? messages_1.Messages.UnexpectedNumber : token.type === 8 ? messages_1.Messages.UnexpectedString : token.type === 10 ? messages_1.Messages.UnexpectedTemplate : messages_1.Messages.UnexpectedToken;
                            if (token.type === 4) {
                                if (this.scanner.isFutureReservedWord(token.value)) {
                                    msg = messages_1.Messages.UnexpectedReserved;
                                } else if (this.context.strict && this.scanner.isStrictModeReservedWord(token.value)) {
                                    msg = messages_1.Messages.StrictReservedWord;
                                }
                            }
                        }
                        value = token.value;
                    } else {
                        value = 'ILLEGAL';
                    }
                    msg = msg.replace('%0', value);
                    if (token && typeof token.lineNumber === 'number') {
                        var index = token.start;
                        var line = token.lineNumber;
                        var lastMarkerLineStart = this.lastMarker.index - this.lastMarker.column;
                        var column = token.start - lastMarkerLineStart + 1;
                        return this.errorHandler.createError(index, line, column, msg);
                    } else {
                        var index = this.lastMarker.index;
                        var line = this.lastMarker.line;
                        var column = this.lastMarker.column + 1;
                        return this.errorHandler.createError(index, line, column, msg);
                    }
                };
                Parser.prototype.throwUnexpectedToken = function (token, message) {
                    throw this.unexpectedTokenError(token, message);
                };
                Parser.prototype.tolerateUnexpectedToken = function (token, message) {
                    this.errorHandler.tolerate(this.unexpectedTokenError(token, message));
                };
                Parser.prototype.collectComments = function () {
                    if (!this.config.comment) {
                        this.scanner.scanComments();
                    } else {
                        var comments = this.scanner.scanComments();
                        if (comments.length > 0 && this.delegate) {
                            for (var i = 0; i < comments.length; ++i) {
                                var e = comments[i];
                                var node = void 0;
                                node = {
                                    type: e.multiLine ? 'BlockComment' : 'LineComment',
                                    value: this.scanner.source.slice(e.slice[0], e.slice[1])
                                };
                                if (this.config.range) {
                                    node.range = e.range;
                                }
                                if (this.config.loc) {
                                    node.loc = e.loc;
                                }
                                var metadata = {
                                    start: {
                                        line: e.loc.start.line,
                                        column: e.loc.start.column,
                                        offset: e.range[0]
                                    },
                                    end: {
                                        line: e.loc.end.line,
                                        column: e.loc.end.column,
                                        offset: e.range[1]
                                    }
                                };
                                this.delegate(node, metadata);
                            }
                        }
                    }
                };
                Parser.prototype.getTokenRaw = function (token) {
                    return this.scanner.source.slice(token.start, token.end);
                };
                Parser.prototype.convertToken = function (token) {
                    var t = {
                        type: token_1.TokenName[token.type],
                        value: this.getTokenRaw(token)
                    };
                    if (this.config.range) {
                        t.range = [token.start, token.end];
                    }
                    if (this.config.loc) {
                        t.loc = {
                            start: {
                                line: this.startMarker.line,
                                column: this.startMarker.column
                            },
                            end: {
                                line: this.scanner.lineNumber,
                                column: this.scanner.index - this.scanner.lineStart
                            }
                        };
                    }
                    if (token.type === 9) {
                        var pattern = token.pattern;
                        var flags = token.flags;
                        t.regex = { pattern: pattern, flags: flags };
                    }
                    return t;
                };
                Parser.prototype.nextToken = function () {
                    var token = this.lookahead;
                    this.lastMarker.index = this.scanner.index;
                    this.lastMarker.line = this.scanner.lineNumber;
                    this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
                    this.collectComments();
                    if (this.scanner.index !== this.startMarker.index) {
                        this.startMarker.index = this.scanner.index;
                        this.startMarker.line = this.scanner.lineNumber;
                        this.startMarker.column = this.scanner.index - this.scanner.lineStart;
                    }
                    var next = this.scanner.lex();
                    this.hasLineTerminator = token.lineNumber !== next.lineNumber;
                    if (next && this.context.strict && next.type === 3) {
                        if (this.scanner.isStrictModeReservedWord(next.value)) {
                            next.type = 4;
                        }
                    }
                    this.lookahead = next;
                    if (this.config.tokens && next.type !== 2) {
                        this.tokens.push(this.convertToken(next));
                    }
                    return token;
                };
                Parser.prototype.nextRegexToken = function () {
                    this.collectComments();
                    var token = this.scanner.scanRegExp();
                    if (this.config.tokens) {
                        this.tokens.pop();
                        this.tokens.push(this.convertToken(token));
                    }
                    this.lookahead = token;
                    this.nextToken();
                    return token;
                };
                Parser.prototype.createNode = function () {
                    return {
                        index: this.startMarker.index,
                        line: this.startMarker.line,
                        column: this.startMarker.column
                    };
                };
                Parser.prototype.startNode = function (token) {
                    return {
                        index: token.start,
                        line: token.lineNumber,
                        column: token.start - token.lineStart
                    };
                };
                Parser.prototype.finalize = function (marker, node) {
                    if (this.config.range) {
                        node.range = [marker.index, this.lastMarker.index];
                    }
                    if (this.config.loc) {
                        node.loc = {
                            start: {
                                line: marker.line,
                                column: marker.column
                            },
                            end: {
                                line: this.lastMarker.line,
                                column: this.lastMarker.column
                            }
                        };
                        if (this.config.source) {
                            node.loc.source = this.config.source;
                        }
                    }
                    if (this.delegate) {
                        var metadata = {
                            start: {
                                line: marker.line,
                                column: marker.column,
                                offset: marker.index
                            },
                            end: {
                                line: this.lastMarker.line,
                                column: this.lastMarker.column,
                                offset: this.lastMarker.index
                            }
                        };
                        this.delegate(node, metadata);
                    }
                    return node;
                };
                Parser.prototype.expect = function (value) {
                    var token = this.nextToken();
                    if (token.type !== 7 || token.value !== value) {
                        this.throwUnexpectedToken(token);
                    }
                };
                Parser.prototype.expectCommaSeparator = function () {
                    if (this.config.tolerant) {
                        var token = this.lookahead;
                        if (token.type === 7 && token.value === ',') {
                            this.nextToken();
                        } else if (token.type === 7 && token.value === ';') {
                            this.nextToken();
                            this.tolerateUnexpectedToken(token);
                        } else {
                            this.tolerateUnexpectedToken(token, messages_1.Messages.UnexpectedToken);
                        }
                    } else {
                        this.expect(',');
                    }
                };
                Parser.prototype.expectKeyword = function (keyword) {
                    var token = this.nextToken();
                    if (token.type !== 4 || token.value !== keyword) {
                        this.throwUnexpectedToken(token);
                    }
                };
                Parser.prototype.match = function (value) {
                    return this.lookahead.type === 7 && this.lookahead.value === value;
                };
                Parser.prototype.matchKeyword = function (keyword) {
                    return this.lookahead.type === 4 && this.lookahead.value === keyword;
                };
                Parser.prototype.matchContextualKeyword = function (keyword) {
                    return this.lookahead.type === 3 && this.lookahead.value === keyword;
                };
                Parser.prototype.matchAssign = function () {
                    if (this.lookahead.type !== 7) {
                        return false;
                    }
                    var op = this.lookahead.value;
                    return op === '=' || op === '*=' || op === '**=' || op === '/=' || op === '%=' || op === '+=' || op === '-=' || op === '<<=' || op === '>>=' || op === '>>>=' || op === '&=' || op === '^=' || op === '|=';
                };
                Parser.prototype.isolateCoverGrammar = function (parseFunction) {
                    var previousIsBindingElement = this.context.isBindingElement;
                    var previousIsAssignmentTarget = this.context.isAssignmentTarget;
                    var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
                    this.context.isBindingElement = true;
                    this.context.isAssignmentTarget = true;
                    this.context.firstCoverInitializedNameError = null;
                    var result = parseFunction.call(this);
                    if (this.context.firstCoverInitializedNameError !== null) {
                        this.throwUnexpectedToken(this.context.firstCoverInitializedNameError);
                    }
                    this.context.isBindingElement = previousIsBindingElement;
                    this.context.isAssignmentTarget = previousIsAssignmentTarget;
                    this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError;
                    return result;
                };
                Parser.prototype.inheritCoverGrammar = function (parseFunction) {
                    var previousIsBindingElement = this.context.isBindingElement;
                    var previousIsAssignmentTarget = this.context.isAssignmentTarget;
                    var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
                    this.context.isBindingElement = true;
                    this.context.isAssignmentTarget = true;
                    this.context.firstCoverInitializedNameError = null;
                    var result = parseFunction.call(this);
                    this.context.isBindingElement = this.context.isBindingElement && previousIsBindingElement;
                    this.context.isAssignmentTarget = this.context.isAssignmentTarget && previousIsAssignmentTarget;
                    this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError || this.context.firstCoverInitializedNameError;
                    return result;
                };
                Parser.prototype.consumeSemicolon = function () {
                    if (this.match(';')) {
                        this.nextToken();
                    } else if (!this.hasLineTerminator) {
                        if (this.lookahead.type !== 2 && !this.match('}')) {
                            this.throwUnexpectedToken(this.lookahead);
                        }
                        this.lastMarker.index = this.startMarker.index;
                        this.lastMarker.line = this.startMarker.line;
                        this.lastMarker.column = this.startMarker.column;
                    }
                };
                Parser.prototype.parsePrimaryExpression = function () {
                    var node = this.createNode();
                    var expr;
                    var token, raw;
                    switch (this.lookahead.type) {
                        case 3:
                            if ((this.context.isModule || this.context.await) && this.lookahead.value === 'await') {
                                this.tolerateUnexpectedToken(this.lookahead);
                            }
                            expr = this.matchAsyncFunction() ? this.parseFunctionExpression() : this.finalize(node, new Node.Identifier(this.nextToken().value));
                            break;
                        case 6:
                        case 8:
                            if (this.context.strict && this.lookahead.octal) {
                                this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.StrictOctalLiteral);
                            }
                            this.context.isAssignmentTarget = false;
                            this.context.isBindingElement = false;
                            token = this.nextToken();
                            raw = this.getTokenRaw(token);
                            expr = this.finalize(node, new Node.Literal(token.value, raw));
                            break;
                        case 1:
                            this.context.isAssignmentTarget = false;
                            this.context.isBindingElement = false;
                            token = this.nextToken();
                            raw = this.getTokenRaw(token);
                            expr = this.finalize(node, new Node.Literal(token.value === 'true', raw));
                            break;
                        case 5:
                            this.context.isAssignmentTarget = false;
                            this.context.isBindingElement = false;
                            token = this.nextToken();
                            raw = this.getTokenRaw(token);
                            expr = this.finalize(node, new Node.Literal(null, raw));
                            break;
                        case 10:
                            expr = this.parseTemplateLiteral();
                            break;
                        case 7:
                            switch (this.lookahead.value) {
                                case '(':
                                    this.context.isBindingElement = false;
                                    expr = this.inheritCoverGrammar(this.parseGroupExpression);
                                    break;
                                case '[':
                                    expr = this.inheritCoverGrammar(this.parseArrayInitializer);
                                    break;
                                case '{':
                                    expr = this.inheritCoverGrammar(this.parseObjectInitializer);
                                    break;
                                case '/':
                                case '/=':
                                    this.context.isAssignmentTarget = false;
                                    this.context.isBindingElement = false;
                                    this.scanner.index = this.startMarker.index;
                                    token = this.nextRegexToken();
                                    raw = this.getTokenRaw(token);
                                    expr = this.finalize(node, new Node.RegexLiteral(token.regex, raw, token.pattern, token.flags));
                                    break;
                                default:
                                    expr = this.throwUnexpectedToken(this.nextToken());
                            }
                            break;
                        case 4:
                            if (!this.context.strict && this.context.allowYield && this.matchKeyword('yield')) {
                                expr = this.parseIdentifierName();
                            } else if (!this.context.strict && this.matchKeyword('let')) {
                                expr = this.finalize(node, new Node.Identifier(this.nextToken().value));
                            } else {
                                this.context.isAssignmentTarget = false;
                                this.context.isBindingElement = false;
                                if (this.matchKeyword('function')) {
                                    expr = this.parseFunctionExpression();
                                } else if (this.matchKeyword('this')) {
                                    this.nextToken();
                                    expr = this.finalize(node, new Node.ThisExpression());
                                } else if (this.matchKeyword('class')) {
                                    expr = this.parseClassExpression();
                                } else if (this.matchImportCall()) {
                                    expr = this.parseImportCall();
                                } else {
                                    expr = this.throwUnexpectedToken(this.nextToken());
                                }
                            }
                            break;
                        default:
                            expr = this.throwUnexpectedToken(this.nextToken());
                    }
                    return expr;
                };
                Parser.prototype.parseSpreadElement = function () {
                    var node = this.createNode();
                    this.expect('...');
                    var arg = this.inheritCoverGrammar(this.parseAssignmentExpression);
                    return this.finalize(node, new Node.SpreadElement(arg));
                };
                Parser.prototype.parseArrayInitializer = function () {
                    var node = this.createNode();
                    var elements = [];
                    this.expect('[');
                    while (!this.match(']')) {
                        if (this.match(',')) {
                            this.nextToken();
                            elements.push(null);
                        } else if (this.match('...')) {
                            var element = this.parseSpreadElement();
                            if (!this.match(']')) {
                                this.context.isAssignmentTarget = false;
                                this.context.isBindingElement = false;
                                this.expect(',');
                            }
                            elements.push(element);
                        } else {
                            elements.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
                            if (!this.match(']')) {
                                this.expect(',');
                            }
                        }
                    }
                    this.expect(']');
                    return this.finalize(node, new Node.ArrayExpression(elements));
                };
                Parser.prototype.parsePropertyMethod = function (params) {
                    this.context.isAssignmentTarget = false;
                    this.context.isBindingElement = false;
                    var previousStrict = this.context.strict;
                    var previousAllowStrictDirective = this.context.allowStrictDirective;
                    this.context.allowStrictDirective = params.simple;
                    var body = this.isolateCoverGrammar(this.parseFunctionSourceElements);
                    if (this.context.strict && params.firstRestricted) {
                        this.tolerateUnexpectedToken(params.firstRestricted, params.message);
                    }
                    if (this.context.strict && params.stricted) {
                        this.tolerateUnexpectedToken(params.stricted, params.message);
                    }
                    this.context.strict = previousStrict;
                    this.context.allowStrictDirective = previousAllowStrictDirective;
                    return body;
                };
                Parser.prototype.parsePropertyMethodFunction = function () {
                    var isGenerator = false;
                    var node = this.createNode();
                    var previousAllowYield = this.context.allowYield;
                    this.context.allowYield = false;
                    var params = this.parseFormalParameters();
                    var method = this.parsePropertyMethod(params);
                    this.context.allowYield = previousAllowYield;
                    return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
                };
                Parser.prototype.parsePropertyMethodAsyncFunction = function () {
                    var node = this.createNode();
                    var previousAllowYield = this.context.allowYield;
                    var previousAwait = this.context.await;
                    this.context.allowYield = false;
                    this.context.await = true;
                    var params = this.parseFormalParameters();
                    var method = this.parsePropertyMethod(params);
                    this.context.allowYield = previousAllowYield;
                    this.context.await = previousAwait;
                    return this.finalize(node, new Node.AsyncFunctionExpression(null, params.params, method));
                };
                Parser.prototype.parseObjectPropertyKey = function () {
                    var node = this.createNode();
                    var token = this.nextToken();
                    var key;
                    switch (token.type) {
                        case 8:
                        case 6:
                            if (this.context.strict && token.octal) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictOctalLiteral);
                            }
                            var raw = this.getTokenRaw(token);
                            key = this.finalize(node, new Node.Literal(token.value, raw));
                            break;
                        case 3:
                        case 1:
                        case 5:
                        case 4:
                            key = this.finalize(node, new Node.Identifier(token.value));
                            break;
                        case 7:
                            if (token.value === '[') {
                                key = this.isolateCoverGrammar(this.parseAssignmentExpression);
                                this.expect(']');
                            } else {
                                key = this.throwUnexpectedToken(token);
                            }
                            break;
                        default:
                            key = this.throwUnexpectedToken(token);
                    }
                    return key;
                };
                Parser.prototype.isPropertyKey = function (key, value) {
                    return key.type === syntax_1.Syntax.Identifier && key.name === value || key.type === syntax_1.Syntax.Literal && key.value === value;
                };
                Parser.prototype.parseObjectProperty = function (hasProto) {
                    var node = this.createNode();
                    var token = this.lookahead;
                    var kind;
                    var key = null;
                    var value = null;
                    var computed = false;
                    var method = false;
                    var shorthand = false;
                    var isAsync = false;
                    if (token.type === 3) {
                        var id = token.value;
                        this.nextToken();
                        computed = this.match('[');
                        isAsync = !this.hasLineTerminator && id === 'async' && !this.match(':') && !this.match('(') && !this.match('*');
                        key = isAsync ? this.parseObjectPropertyKey() : this.finalize(node, new Node.Identifier(id));
                    } else if (this.match('*')) {
                        this.nextToken();
                    } else {
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                    }
                    var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
                    if (token.type === 3 && !isAsync && token.value === 'get' && lookaheadPropertyKey) {
                        kind = 'get';
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        this.context.allowYield = false;
                        value = this.parseGetterMethod();
                    } else if (token.type === 3 && !isAsync && token.value === 'set' && lookaheadPropertyKey) {
                        kind = 'set';
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        value = this.parseSetterMethod();
                    } else if (token.type === 7 && token.value === '*' && lookaheadPropertyKey) {
                        kind = 'init';
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        value = this.parseGeneratorMethod();
                        method = true;
                    } else {
                        if (!key) {
                            this.throwUnexpectedToken(this.lookahead);
                        }
                        kind = 'init';
                        if (this.match(':') && !isAsync) {
                            if (!computed && this.isPropertyKey(key, '__proto__')) {
                                if (hasProto.value) {
                                    this.tolerateError(messages_1.Messages.DuplicateProtoProperty);
                                }
                                hasProto.value = true;
                            }
                            this.nextToken();
                            value = this.inheritCoverGrammar(this.parseAssignmentExpression);
                        } else if (this.match('(')) {
                            value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
                            method = true;
                        } else if (token.type === 3) {
                            var id = this.finalize(node, new Node.Identifier(token.value));
                            if (this.match('=')) {
                                this.context.firstCoverInitializedNameError = this.lookahead;
                                this.nextToken();
                                shorthand = true;
                                var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
                                value = this.finalize(node, new Node.AssignmentPattern(id, init));
                            } else {
                                shorthand = true;
                                value = id;
                            }
                        } else {
                            this.throwUnexpectedToken(this.nextToken());
                        }
                    }
                    return this.finalize(node, new Node.Property(kind, key, computed, value, method, shorthand));
                };
                Parser.prototype.parseSpreadProperty = function () {
                    var node = this.createNode();
                    this.expect('...');
                    var arg = this.inheritCoverGrammar(this.parseAssignmentExpression);
                    return this.finalize(node, new Node.SpreadProperty(arg));
                };
                Parser.prototype.parseObjectInitializer = function () {
                    var node = this.createNode();
                    this.expect('{');
                    var properties = [];
                    var hasProto = { value: false };
                    while (!this.match('}')) {
                        properties.push(this.match('...') ? this.parseSpreadProperty() : this.parseObjectProperty(hasProto));
                        if (!this.match('}')) {
                            this.expectCommaSeparator();
                        }
                    }
                    this.expect('}');
                    return this.finalize(node, new Node.ObjectExpression(properties));
                };
                Parser.prototype.parseTemplateHead = function () {
                    assert_1.assert(this.lookahead.head, 'Template literal must start with a template head');
                    var node = this.createNode();
                    var token = this.nextToken();
                    var raw = token.value;
                    var cooked = token.cooked;
                    return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
                };
                Parser.prototype.parseTemplateElement = function () {
                    if (this.lookahead.type !== 10) {
                        this.throwUnexpectedToken();
                    }
                    var node = this.createNode();
                    var token = this.nextToken();
                    var raw = token.value;
                    var cooked = token.cooked;
                    return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
                };
                Parser.prototype.parseTemplateLiteral = function () {
                    var node = this.createNode();
                    var expressions = [];
                    var quasis = [];
                    var quasi = this.parseTemplateHead();
                    quasis.push(quasi);
                    while (!quasi.tail) {
                        expressions.push(this.parseExpression());
                        quasi = this.parseTemplateElement();
                        quasis.push(quasi);
                    }
                    return this.finalize(node, new Node.TemplateLiteral(quasis, expressions));
                };
                Parser.prototype.reinterpretExpressionAsPattern = function (expr) {
                    switch (expr.type) {
                        case syntax_1.Syntax.Identifier:
                        case syntax_1.Syntax.MemberExpression:
                        case syntax_1.Syntax.RestElement:
                        case syntax_1.Syntax.AssignmentPattern:
                            break;
                        case syntax_1.Syntax.SpreadElement:
                            expr.type = syntax_1.Syntax.RestElement;
                            this.reinterpretExpressionAsPattern(expr.argument);
                            break;
                        case syntax_1.Syntax.SpreadProperty:
                            expr.type = syntax_1.Syntax.RestProperty;
                            this.reinterpretExpressionAsPattern(expr.argument);
                            break;
                        case syntax_1.Syntax.ArrayExpression:
                            expr.type = syntax_1.Syntax.ArrayPattern;
                            for (var i = 0; i < expr.elements.length; i++) {
                                if (expr.elements[i] !== null) {
                                    this.reinterpretExpressionAsPattern(expr.elements[i]);
                                }
                            }
                            break;
                        case syntax_1.Syntax.ObjectExpression:
                            expr.type = syntax_1.Syntax.ObjectPattern;
                            for (var i = 0; i < expr.properties.length; i++) {
                                var property = expr.properties[i];
                                this.reinterpretExpressionAsPattern(property.type === syntax_1.Syntax.SpreadProperty ? property : property.value);
                            }
                            break;
                        case syntax_1.Syntax.AssignmentExpression:
                            expr.type = syntax_1.Syntax.AssignmentPattern;
                            delete expr.operator;
                            this.reinterpretExpressionAsPattern(expr.left);
                            break;
                        default:
                            break;
                    }
                };
                Parser.prototype.parseGroupExpression = function () {
                    var expr;
                    this.expect('(');
                    if (this.match(')')) {
                        this.nextToken();
                        if (!this.match('=>')) {
                            this.expect('=>');
                        }
                        expr = {
                            type: ArrowParameterPlaceHolder,
                            params: [],
                            async: false
                        };
                    } else {
                        var startToken = this.lookahead;
                        var params = [];
                        if (this.match('...')) {
                            expr = this.parseRestElement(params);
                            this.expect(')');
                            if (!this.match('=>')) {
                                this.expect('=>');
                            }
                            expr = {
                                type: ArrowParameterPlaceHolder,
                                params: [expr],
                                async: false
                            };
                        } else {
                            var arrow = false;
                            this.context.isBindingElement = true;
                            expr = this.inheritCoverGrammar(this.parseAssignmentExpression);
                            if (this.match(',')) {
                                var expressions = [];
                                this.context.isAssignmentTarget = false;
                                expressions.push(expr);
                                while (this.lookahead.type !== 2) {
                                    if (!this.match(',')) {
                                        break;
                                    }
                                    this.nextToken();
                                    if (this.match(')')) {
                                        this.nextToken();
                                        for (var i = 0; i < expressions.length; i++) {
                                            this.reinterpretExpressionAsPattern(expressions[i]);
                                        }
                                        arrow = true;
                                        expr = {
                                            type: ArrowParameterPlaceHolder,
                                            params: expressions,
                                            async: false
                                        };
                                    } else if (this.match('...')) {
                                        if (!this.context.isBindingElement) {
                                            this.throwUnexpectedToken(this.lookahead);
                                        }
                                        expressions.push(this.parseRestElement(params));
                                        this.expect(')');
                                        if (!this.match('=>')) {
                                            this.expect('=>');
                                        }
                                        this.context.isBindingElement = false;
                                        for (var i = 0; i < expressions.length; i++) {
                                            this.reinterpretExpressionAsPattern(expressions[i]);
                                        }
                                        arrow = true;
                                        expr = {
                                            type: ArrowParameterPlaceHolder,
                                            params: expressions,
                                            async: false
                                        };
                                    } else {
                                        expressions.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
                                    }
                                    if (arrow) {
                                        break;
                                    }
                                }
                                if (!arrow) {
                                    expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
                                }
                            }
                            if (!arrow) {
                                this.expect(')');
                                if (this.match('=>')) {
                                    if (expr.type === syntax_1.Syntax.Identifier && expr.name === 'yield') {
                                        arrow = true;
                                        expr = {
                                            type: ArrowParameterPlaceHolder,
                                            params: [expr],
                                            async: false
                                        };
                                    }
                                    if (!arrow) {
                                        if (!this.context.isBindingElement) {
                                            this.throwUnexpectedToken(this.lookahead);
                                        }
                                        if (expr.type === syntax_1.Syntax.SequenceExpression) {
                                            for (var i = 0; i < expr.expressions.length; i++) {
                                                this.reinterpretExpressionAsPattern(expr.expressions[i]);
                                            }
                                        } else {
                                            this.reinterpretExpressionAsPattern(expr);
                                        }
                                        var parameters = expr.type === syntax_1.Syntax.SequenceExpression ? expr.expressions : [expr];
                                        expr = {
                                            type: ArrowParameterPlaceHolder,
                                            params: parameters,
                                            async: false
                                        };
                                    }
                                }
                                this.context.isBindingElement = false;
                            }
                        }
                    }
                    return expr;
                };
                Parser.prototype.parseArguments = function () {
                    this.expect('(');
                    var args = [];
                    if (!this.match(')')) {
                        while (true) {
                            var expr = this.match('...') ? this.parseSpreadElement() : this.isolateCoverGrammar(this.parseAssignmentExpression);
                            args.push(expr);
                            if (this.match(')')) {
                                break;
                            }
                            this.expectCommaSeparator();
                            if (this.match(')')) {
                                break;
                            }
                        }
                    }
                    this.expect(')');
                    return args;
                };
                Parser.prototype.isIdentifierName = function (token) {
                    return token.type === 3 || token.type === 4 || token.type === 1 || token.type === 5;
                };
                Parser.prototype.parseIdentifierName = function () {
                    var node = this.createNode();
                    var token = this.nextToken();
                    if (!this.isIdentifierName(token)) {
                        this.throwUnexpectedToken(token);
                    }
                    return this.finalize(node, new Node.Identifier(token.value));
                };
                Parser.prototype.parseNewExpression = function () {
                    var node = this.createNode();
                    var id = this.parseIdentifierName();
                    assert_1.assert(id.name === 'new', 'New expression must start with `new`');
                    var expr;
                    if (this.match('.')) {
                        this.nextToken();
                        if (this.lookahead.type === 3 && this.context.inFunctionBody && this.lookahead.value === 'target') {
                            var property = this.parseIdentifierName();
                            expr = new Node.MetaProperty(id, property);
                        } else {
                            this.throwUnexpectedToken(this.lookahead);
                        }
                    } else if (this.matchKeyword('import')) {
                        this.throwUnexpectedToken(this.lookahead);
                    } else {
                        var callee = this.isolateCoverGrammar(this.parseLeftHandSideExpression);
                        var args = this.match('(') ? this.parseArguments() : [];
                        expr = new Node.NewExpression(callee, args);
                        this.context.isAssignmentTarget = false;
                        this.context.isBindingElement = false;
                    }
                    return this.finalize(node, expr);
                };
                Parser.prototype.parseAsyncArgument = function () {
                    var arg = this.parseAssignmentExpression();
                    this.context.firstCoverInitializedNameError = null;
                    return arg;
                };
                Parser.prototype.parseAsyncArguments = function () {
                    this.expect('(');
                    var args = [];
                    if (!this.match(')')) {
                        while (true) {
                            var expr = this.match('...') ? this.parseSpreadElement() : this.isolateCoverGrammar(this.parseAsyncArgument);
                            args.push(expr);
                            if (this.match(')')) {
                                break;
                            }
                            this.expectCommaSeparator();
                            if (this.match(')')) {
                                break;
                            }
                        }
                    }
                    this.expect(')');
                    return args;
                };
                Parser.prototype.matchImportCall = function () {
                    var match = this.matchKeyword('import');
                    if (match) {
                        var state = this.scanner.saveState();
                        this.scanner.scanComments();
                        var next = this.scanner.lex();
                        this.scanner.restoreState(state);
                        match = next.type === 7 && next.value === '(';
                    }
                    return match;
                };
                Parser.prototype.parseImportCall = function () {
                    var node = this.createNode();
                    this.expectKeyword('import');
                    return this.finalize(node, new Node.Import());
                };
                Parser.prototype.parseLeftHandSideExpressionAllowCall = function () {
                    var startToken = this.lookahead;
                    var maybeAsync = this.matchContextualKeyword('async');
                    var previousAllowIn = this.context.allowIn;
                    this.context.allowIn = true;
                    var expr;
                    if (this.matchKeyword('super') && this.context.inFunctionBody) {
                        expr = this.createNode();
                        this.nextToken();
                        expr = this.finalize(expr, new Node.Super());
                        if (!this.match('(') && !this.match('.') && !this.match('[')) {
                            this.throwUnexpectedToken(this.lookahead);
                        }
                    } else {
                        expr = this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
                    }
                    while (true) {
                        if (this.match('.')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('.');
                            var property = this.parseIdentifierName();
                            expr = this.finalize(this.startNode(startToken), new Node.StaticMemberExpression(expr, property));
                        } else if (this.match('(')) {
                            var asyncArrow = maybeAsync && startToken.lineNumber === this.lookahead.lineNumber;
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = false;
                            var args = asyncArrow ? this.parseAsyncArguments() : this.parseArguments();
                            if (expr.type === syntax_1.Syntax.Import && args.length !== 1) {
                                this.tolerateError(messages_1.Messages.BadImportCallArity);
                            }
                            expr = this.finalize(this.startNode(startToken), new Node.CallExpression(expr, args));
                            if (asyncArrow && this.match('=>')) {
                                for (var i = 0; i < args.length; ++i) {
                                    this.reinterpretExpressionAsPattern(args[i]);
                                }
                                expr = {
                                    type: ArrowParameterPlaceHolder,
                                    params: args,
                                    async: true
                                };
                            }
                        } else if (this.match('[')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('[');
                            var property = this.isolateCoverGrammar(this.parseExpression);
                            this.expect(']');
                            expr = this.finalize(this.startNode(startToken), new Node.ComputedMemberExpression(expr, property));
                        } else if (this.lookahead.type === 10 && this.lookahead.head) {
                            var quasi = this.parseTemplateLiteral();
                            expr = this.finalize(this.startNode(startToken), new Node.TaggedTemplateExpression(expr, quasi));
                        } else {
                            break;
                        }
                    }
                    this.context.allowIn = previousAllowIn;
                    return expr;
                };
                Parser.prototype.parseSuper = function () {
                    var node = this.createNode();
                    this.expectKeyword('super');
                    if (!this.match('[') && !this.match('.')) {
                        this.throwUnexpectedToken(this.lookahead);
                    }
                    return this.finalize(node, new Node.Super());
                };
                Parser.prototype.parseLeftHandSideExpression = function () {
                    assert_1.assert(this.context.allowIn, 'callee of new expression always allow in keyword.');
                    var node = this.startNode(this.lookahead);
                    var expr = this.matchKeyword('super') && this.context.inFunctionBody ? this.parseSuper() : this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
                    while (true) {
                        if (this.match('[')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('[');
                            var property = this.isolateCoverGrammar(this.parseExpression);
                            this.expect(']');
                            expr = this.finalize(node, new Node.ComputedMemberExpression(expr, property));
                        } else if (this.match('.')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('.');
                            var property = this.parseIdentifierName();
                            expr = this.finalize(node, new Node.StaticMemberExpression(expr, property));
                        } else if (this.lookahead.type === 10 && this.lookahead.head) {
                            var quasi = this.parseTemplateLiteral();
                            expr = this.finalize(node, new Node.TaggedTemplateExpression(expr, quasi));
                        } else {
                            break;
                        }
                    }
                    return expr;
                };
                Parser.prototype.parseUpdateExpression = function () {
                    var expr;
                    var startToken = this.lookahead;
                    if (this.match('++') || this.match('--')) {
                        var node = this.startNode(startToken);
                        var token = this.nextToken();
                        expr = this.inheritCoverGrammar(this.parseUnaryExpression);
                        if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
                            this.tolerateError(messages_1.Messages.StrictLHSPrefix);
                        }
                        if (!this.context.isAssignmentTarget) {
                            this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
                        }
                        var prefix = true;
                        expr = this.finalize(node, new Node.UpdateExpression(token.value, expr, prefix));
                        this.context.isAssignmentTarget = false;
                        this.context.isBindingElement = false;
                    } else {
                        expr = this.inheritCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
                        if (!this.hasLineTerminator && this.lookahead.type === 7) {
                            if (this.match('++') || this.match('--')) {
                                if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
                                    this.tolerateError(messages_1.Messages.StrictLHSPostfix);
                                }
                                if (!this.context.isAssignmentTarget) {
                                    this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
                                }
                                this.context.isAssignmentTarget = false;
                                this.context.isBindingElement = false;
                                var operator = this.nextToken().value;
                                var prefix = false;
                                expr = this.finalize(this.startNode(startToken), new Node.UpdateExpression(operator, expr, prefix));
                            }
                        }
                    }
                    return expr;
                };
                Parser.prototype.parseAwaitExpression = function () {
                    var node = this.createNode();
                    this.nextToken();
                    var argument = this.parseUnaryExpression();
                    return this.finalize(node, new Node.AwaitExpression(argument));
                };
                Parser.prototype.parseUnaryExpression = function () {
                    var expr;
                    if (this.match('+') || this.match('-') || this.match('~') || this.match('!') || this.matchKeyword('delete') || this.matchKeyword('void') || this.matchKeyword('typeof')) {
                        var node = this.startNode(this.lookahead);
                        var token = this.nextToken();
                        expr = this.inheritCoverGrammar(this.parseUnaryExpression);
                        expr = this.finalize(node, new Node.UnaryExpression(token.value, expr));
                        if (this.context.strict && expr.operator === 'delete' && expr.argument.type === syntax_1.Syntax.Identifier) {
                            this.tolerateError(messages_1.Messages.StrictDelete);
                        }
                        this.context.isAssignmentTarget = false;
                        this.context.isBindingElement = false;
                    } else if (this.context.await && this.matchContextualKeyword('await')) {
                        expr = this.parseAwaitExpression();
                    } else {
                        expr = this.parseUpdateExpression();
                    }
                    return expr;
                };
                Parser.prototype.parseExponentiationExpression = function () {
                    var startToken = this.lookahead;
                    var expr = this.inheritCoverGrammar(this.parseUnaryExpression);
                    if (expr.type !== syntax_1.Syntax.UnaryExpression && this.match('**')) {
                        this.nextToken();
                        this.context.isAssignmentTarget = false;
                        this.context.isBindingElement = false;
                        var left = expr;
                        var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
                        expr = this.finalize(this.startNode(startToken), new Node.BinaryExpression('**', left, right));
                    }
                    return expr;
                };
                Parser.prototype.binaryPrecedence = function (token) {
                    var op = token.value;
                    var precedence;
                    if (token.type === 7) {
                        precedence = this.operatorPrecedence[op] || 0;
                    } else if (token.type === 4) {
                        precedence = op === 'instanceof' || this.context.allowIn && op === 'in' ? 7 : 0;
                    } else {
                        precedence = 0;
                    }
                    return precedence;
                };
                Parser.prototype.parseBinaryExpression = function () {
                    var startToken = this.lookahead;
                    var expr = this.inheritCoverGrammar(this.parseExponentiationExpression);
                    var token = this.lookahead;
                    var prec = this.binaryPrecedence(token);
                    if (prec > 0) {
                        this.nextToken();
                        this.context.isAssignmentTarget = false;
                        this.context.isBindingElement = false;
                        var markers = [startToken, this.lookahead];
                        var left = expr;
                        var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
                        var stack = [left, token.value, right];
                        var precedences = [prec];
                        while (true) {
                            prec = this.binaryPrecedence(this.lookahead);
                            if (prec <= 0) {
                                break;
                            }
                            while (stack.length > 2 && prec <= precedences[precedences.length - 1]) {
                                right = stack.pop();
                                var operator = stack.pop();
                                precedences.pop();
                                left = stack.pop();
                                markers.pop();
                                var node = this.startNode(markers[markers.length - 1]);
                                stack.push(this.finalize(node, new Node.BinaryExpression(operator, left, right)));
                            }
                            stack.push(this.nextToken().value);
                            precedences.push(prec);
                            markers.push(this.lookahead);
                            stack.push(this.isolateCoverGrammar(this.parseExponentiationExpression));
                        }
                        var i = stack.length - 1;
                        expr = stack[i];
                        markers.pop();
                        while (i > 1) {
                            var node = this.startNode(markers.pop());
                            var operator = stack[i - 1];
                            expr = this.finalize(node, new Node.BinaryExpression(operator, stack[i - 2], expr));
                            i -= 2;
                        }
                    }
                    return expr;
                };
                Parser.prototype.parseConditionalExpression = function () {
                    var startToken = this.lookahead;
                    var expr = this.inheritCoverGrammar(this.parseBinaryExpression);
                    if (this.match('?')) {
                        this.nextToken();
                        var previousAllowIn = this.context.allowIn;
                        this.context.allowIn = true;
                        var consequent = this.isolateCoverGrammar(this.parseAssignmentExpression);
                        this.context.allowIn = previousAllowIn;
                        this.expect(':');
                        var alternate = this.isolateCoverGrammar(this.parseAssignmentExpression);
                        expr = this.finalize(this.startNode(startToken), new Node.ConditionalExpression(expr, consequent, alternate));
                        this.context.isAssignmentTarget = false;
                        this.context.isBindingElement = false;
                    }
                    return expr;
                };
                Parser.prototype.checkPatternParam = function (options, param) {
                    switch (param.type) {
                        case syntax_1.Syntax.Identifier:
                            this.validateParam(options, param, param.name);
                            break;
                        case syntax_1.Syntax.RestElement:
                        case syntax_1.Syntax.RestProperty:
                            this.checkPatternParam(options, param.argument);
                            break;
                        case syntax_1.Syntax.AssignmentPattern:
                            this.checkPatternParam(options, param.left);
                            break;
                        case syntax_1.Syntax.ArrayPattern:
                            for (var i = 0; i < param.elements.length; i++) {
                                if (param.elements[i] !== null) {
                                    this.checkPatternParam(options, param.elements[i]);
                                }
                            }
                            break;
                        case syntax_1.Syntax.ObjectPattern:
                            for (var i = 0; i < param.properties.length; i++) {
                                var property = param.properties[i];
                                this.checkPatternParam(options, property.type === syntax_1.Syntax.RestProperty ? property : property.value);
                            }
                            break;
                        default:
                            break;
                    }
                    options.simple = options.simple && param instanceof Node.Identifier;
                };
                Parser.prototype.reinterpretAsCoverFormalsList = function (expr) {
                    var params = [expr];
                    var options;
                    var asyncArrow = false;
                    switch (expr.type) {
                        case syntax_1.Syntax.Identifier:
                            break;
                        case ArrowParameterPlaceHolder:
                            params = expr.params;
                            asyncArrow = expr.async;
                            break;
                        default:
                            return null;
                    }
                    options = {
                        simple: true,
                        paramSet: {}
                    };
                    for (var i = 0; i < params.length; ++i) {
                        var param = params[i];
                        if (param.type === syntax_1.Syntax.AssignmentPattern) {
                            if (param.right.type === syntax_1.Syntax.YieldExpression) {
                                if (param.right.argument) {
                                    this.throwUnexpectedToken(this.lookahead);
                                }
                                param.right.type = syntax_1.Syntax.Identifier;
                                param.right.name = 'yield';
                                delete param.right.argument;
                                delete param.right.delegate;
                            }
                        } else if (asyncArrow && param.type === syntax_1.Syntax.Identifier && param.name === 'await') {
                            this.throwUnexpectedToken(this.lookahead);
                        }
                        this.checkPatternParam(options, param);
                        params[i] = param;
                    }
                    if (this.context.strict || !this.context.allowYield) {
                        for (var i = 0; i < params.length; ++i) {
                            var param = params[i];
                            if (param.type === syntax_1.Syntax.YieldExpression) {
                                this.throwUnexpectedToken(this.lookahead);
                            }
                        }
                    }
                    if (options.message === messages_1.Messages.StrictParamDupe) {
                        var token = this.context.strict ? options.stricted : options.firstRestricted;
                        this.throwUnexpectedToken(token, options.message);
                    }
                    return {
                        simple: options.simple,
                        params: params,
                        stricted: options.stricted,
                        firstRestricted: options.firstRestricted,
                        message: options.message
                    };
                };
                Parser.prototype.parseAssignmentExpression = function () {
                    var expr;
                    if (!this.context.allowYield && this.matchKeyword('yield')) {
                        expr = this.parseYieldExpression();
                    } else {
                        var startToken = this.lookahead;
                        var token = startToken;
                        expr = this.parseConditionalExpression();
                        if (token.type === 3 && token.lineNumber === this.lookahead.lineNumber && token.value === 'async') {
                            if (this.lookahead.type === 3 || this.matchKeyword('yield')) {
                                var arg = this.parsePrimaryExpression();
                                this.reinterpretExpressionAsPattern(arg);
                                expr = {
                                    type: ArrowParameterPlaceHolder,
                                    params: [arg],
                                    async: true
                                };
                            }
                        }
                        if (expr.type === ArrowParameterPlaceHolder || this.match('=>')) {
                            this.context.isAssignmentTarget = false;
                            this.context.isBindingElement = false;
                            var isAsync = expr.async;
                            var list = this.reinterpretAsCoverFormalsList(expr);
                            if (list) {
                                if (this.hasLineTerminator) {
                                    this.tolerateUnexpectedToken(this.lookahead);
                                }
                                this.context.firstCoverInitializedNameError = null;
                                var previousStrict = this.context.strict;
                                var previousAllowStrictDirective = this.context.allowStrictDirective;
                                this.context.allowStrictDirective = list.simple;
                                var previousAllowYield = this.context.allowYield;
                                var previousAwait = this.context.await;
                                this.context.allowYield = true;
                                this.context.await = isAsync;
                                var node = this.startNode(startToken);
                                this.expect('=>');
                                var body = this.match('{') ? this.parseFunctionSourceElements() : this.isolateCoverGrammar(this.parseAssignmentExpression);
                                var expression = body.type !== syntax_1.Syntax.BlockStatement;
                                if (this.context.strict && list.firstRestricted) {
                                    this.throwUnexpectedToken(list.firstRestricted, list.message);
                                }
                                if (this.context.strict && list.stricted) {
                                    this.tolerateUnexpectedToken(list.stricted, list.message);
                                }
                                expr = isAsync ? this.finalize(node, new Node.AsyncArrowFunctionExpression(list.params, body, expression)) : this.finalize(node, new Node.ArrowFunctionExpression(list.params, body, expression));
                                this.context.strict = previousStrict;
                                this.context.allowStrictDirective = previousAllowStrictDirective;
                                this.context.allowYield = previousAllowYield;
                                this.context.await = previousAwait;
                            }
                        } else {
                            if (this.matchAssign()) {
                                if (!this.context.isAssignmentTarget) {
                                    this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
                                }
                                if (this.context.strict && expr.type === syntax_1.Syntax.Identifier) {
                                    var id = expr;
                                    if (this.scanner.isRestrictedWord(id.name)) {
                                        this.tolerateUnexpectedToken(token, messages_1.Messages.StrictLHSAssignment);
                                    }
                                    if (this.scanner.isStrictModeReservedWord(id.name)) {
                                        this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
                                    }
                                }
                                if (!this.match('=')) {
                                    this.context.isAssignmentTarget = false;
                                    this.context.isBindingElement = false;
                                } else {
                                    this.reinterpretExpressionAsPattern(expr);
                                }
                                token = this.nextToken();
                                var operator = token.value;
                                var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
                                expr = this.finalize(this.startNode(startToken), new Node.AssignmentExpression(operator, expr, right));
                                this.context.firstCoverInitializedNameError = null;
                            }
                        }
                    }
                    return expr;
                };
                Parser.prototype.parseExpression = function () {
                    var startToken = this.lookahead;
                    var expr = this.isolateCoverGrammar(this.parseAssignmentExpression);
                    if (this.match(',')) {
                        var expressions = [];
                        expressions.push(expr);
                        while (this.lookahead.type !== 2) {
                            if (!this.match(',')) {
                                break;
                            }
                            this.nextToken();
                            expressions.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
                        }
                        expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
                    }
                    return expr;
                };
                Parser.prototype.parseStatementListItem = function () {
                    var statement;
                    this.context.isAssignmentTarget = true;
                    this.context.isBindingElement = true;
                    if (this.lookahead.type === 4) {
                        switch (this.lookahead.value) {
                            case 'export':
                                if (!this.context.isModule) {
                                    this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalExportDeclaration);
                                }
                                statement = this.parseExportDeclaration();
                                break;
                            case 'import':
                                if (this.matchImportCall()) {
                                    statement = this.parseExpressionStatement();
                                } else {
                                    if (!this.context.isModule) {
                                        this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalImportDeclaration);
                                    }
                                    statement = this.parseImportDeclaration();
                                }
                                break;
                            case 'const':
                                statement = this.parseLexicalDeclaration({ inFor: false });
                                break;
                            case 'function':
                                statement = this.parseFunctionDeclaration();
                                break;
                            case 'class':
                                statement = this.parseClassDeclaration();
                                break;
                            case 'let':
                                statement = this.isLexicalDeclaration() ? this.parseLexicalDeclaration({ inFor: false }) : this.parseStatement();
                                break;
                            default:
                                statement = this.parseStatement();
                                break;
                        }
                    } else {
                        statement = this.parseStatement();
                    }
                    return statement;
                };
                Parser.prototype.parseBlock = function () {
                    var node = this.createNode();
                    this.expect('{');
                    var block = [];
                    while (true) {
                        if (this.match('}')) {
                            break;
                        }
                        block.push(this.parseStatementListItem());
                    }
                    this.expect('}');
                    return this.finalize(node, new Node.BlockStatement(block));
                };
                Parser.prototype.parseLexicalBinding = function (kind, options) {
                    var node = this.createNode();
                    var params = [];
                    var id = this.parsePattern(params, kind);
                    if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
                        if (this.scanner.isRestrictedWord(id.name)) {
                            this.tolerateError(messages_1.Messages.StrictVarName);
                        }
                    }
                    var init = null;
                    if (kind === 'const') {
                        if (!this.matchKeyword('in') && !this.matchContextualKeyword('of')) {
                            if (this.match('=')) {
                                this.nextToken();
                                init = this.isolateCoverGrammar(this.parseAssignmentExpression);
                            } else {
                                this.throwError(messages_1.Messages.DeclarationMissingInitializer, 'const');
                            }
                        }
                    } else if (!options.inFor && id.type !== syntax_1.Syntax.Identifier || this.match('=')) {
                        this.expect('=');
                        init = this.isolateCoverGrammar(this.parseAssignmentExpression);
                    }
                    return this.finalize(node, new Node.VariableDeclarator(id, init));
                };
                Parser.prototype.parseBindingList = function (kind, options) {
                    var list = [this.parseLexicalBinding(kind, options)];
                    while (this.match(',')) {
                        this.nextToken();
                        list.push(this.parseLexicalBinding(kind, options));
                    }
                    return list;
                };
                Parser.prototype.isLexicalDeclaration = function () {
                    var state = this.scanner.saveState();
                    this.scanner.scanComments();
                    var next = this.scanner.lex();
                    this.scanner.restoreState(state);
                    return next.type === 3 || next.type === 7 && next.value === '[' || next.type === 7 && next.value === '{' || next.type === 4 && next.value === 'let' || next.type === 4 && next.value === 'yield';
                };
                Parser.prototype.parseLexicalDeclaration = function (options) {
                    var node = this.createNode();
                    var kind = this.nextToken().value;
                    assert_1.assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');
                    var declarations = this.parseBindingList(kind, options);
                    this.consumeSemicolon();
                    return this.finalize(node, new Node.VariableDeclaration(declarations, kind));
                };
                Parser.prototype.parseBindingRestElement = function (params, kind) {
                    var node = this.createNode();
                    this.expect('...');
                    var arg = this.parsePattern(params, kind);
                    return this.finalize(node, new Node.RestElement(arg));
                };
                Parser.prototype.parseArrayPattern = function (params, kind) {
                    var node = this.createNode();
                    this.expect('[');
                    var elements = [];
                    while (!this.match(']')) {
                        if (this.match(',')) {
                            this.nextToken();
                            elements.push(null);
                        } else {
                            if (this.match('...')) {
                                elements.push(this.parseBindingRestElement(params, kind));
                                break;
                            } else {
                                elements.push(this.parsePatternWithDefault(params, kind));
                            }
                            if (!this.match(']')) {
                                this.expect(',');
                            }
                        }
                    }
                    this.expect(']');
                    return this.finalize(node, new Node.ArrayPattern(elements));
                };
                Parser.prototype.parsePropertyPattern = function (params, kind) {
                    var node = this.createNode();
                    var computed = false;
                    var shorthand = false;
                    var method = false;
                    var key;
                    var value;
                    if (this.lookahead.type === 3) {
                        var keyToken = this.lookahead;
                        key = this.parseVariableIdentifier();
                        var init = this.finalize(node, new Node.Identifier(keyToken.value));
                        if (this.match('=')) {
                            params.push(keyToken);
                            shorthand = true;
                            this.nextToken();
                            var expr = this.parseAssignmentExpression();
                            value = this.finalize(this.startNode(keyToken), new Node.AssignmentPattern(init, expr));
                        } else if (!this.match(':')) {
                            params.push(keyToken);
                            shorthand = true;
                            value = init;
                        } else {
                            this.expect(':');
                            value = this.parsePatternWithDefault(params, kind);
                        }
                    } else {
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        this.expect(':');
                        value = this.parsePatternWithDefault(params, kind);
                    }
                    return this.finalize(node, new Node.Property('init', key, computed, value, method, shorthand));
                };
                Parser.prototype.parseRestProperty = function (params, _kind) {
                    var node = this.createNode();
                    this.expect('...');
                    var arg = this.parsePattern(params);
                    if (this.match('=')) {
                        this.throwError(messages_1.Messages.DefaultRestProperty);
                    }
                    if (!this.match('}')) {
                        this.throwError(messages_1.Messages.PropertyAfterRestProperty);
                    }
                    return this.finalize(node, new Node.RestProperty(arg));
                };
                Parser.prototype.parseObjectPattern = function (params, kind) {
                    var node = this.createNode();
                    var properties = [];
                    this.expect('{');
                    while (!this.match('}')) {
                        properties.push(this.match('...') ? this.parseRestProperty(params, kind) : this.parsePropertyPattern(params, kind));
                        if (!this.match('}')) {
                            this.expect(',');
                        }
                    }
                    this.expect('}');
                    return this.finalize(node, new Node.ObjectPattern(properties));
                };
                Parser.prototype.parsePattern = function (params, kind) {
                    var pattern;
                    if (this.match('[')) {
                        pattern = this.parseArrayPattern(params, kind);
                    } else if (this.match('{')) {
                        pattern = this.parseObjectPattern(params, kind);
                    } else {
                        if (this.matchKeyword('let') && (kind === 'const' || kind === 'let')) {
                            this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.LetInLexicalBinding);
                        }
                        params.push(this.lookahead);
                        pattern = this.parseVariableIdentifier(kind);
                    }
                    return pattern;
                };
                Parser.prototype.parsePatternWithDefault = function (params, kind) {
                    var startToken = this.lookahead;
                    var pattern = this.parsePattern(params, kind);
                    if (this.match('=')) {
                        this.nextToken();
                        var previousAllowYield = this.context.allowYield;
                        this.context.allowYield = true;
                        var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
                        this.context.allowYield = previousAllowYield;
                        pattern = this.finalize(this.startNode(startToken), new Node.AssignmentPattern(pattern, right));
                    }
                    return pattern;
                };
                Parser.prototype.parseVariableIdentifier = function (kind) {
                    var node = this.createNode();
                    var token = this.nextToken();
                    if (token.type === 4 && token.value === 'yield') {
                        if (this.context.strict) {
                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
                        } else if (!this.context.allowYield) {
                            this.throwUnexpectedToken(token);
                        }
                    } else if (token.type !== 3) {
                        if (this.context.strict && token.type === 4 && this.scanner.isStrictModeReservedWord(token.value)) {
                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
                        } else {
                            if (this.context.strict || token.value !== 'let' || kind !== 'var') {
                                this.throwUnexpectedToken(token);
                            }
                        }
                    } else if ((this.context.isModule || this.context.await) && token.type === 3 && token.value === 'await') {
                        this.tolerateUnexpectedToken(token);
                    }
                    return this.finalize(node, new Node.Identifier(token.value));
                };
                Parser.prototype.parseVariableDeclaration = function (options) {
                    var node = this.createNode();
                    var params = [];
                    var id = this.parsePattern(params, 'var');
                    if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
                        if (this.scanner.isRestrictedWord(id.name)) {
                            this.tolerateError(messages_1.Messages.StrictVarName);
                        }
                    }
                    var init = null;
                    if (this.match('=')) {
                        this.nextToken();
                        init = this.isolateCoverGrammar(this.parseAssignmentExpression);
                    } else if (id.type !== syntax_1.Syntax.Identifier && !options.inFor) {
                        this.expect('=');
                    }
                    return this.finalize(node, new Node.VariableDeclarator(id, init));
                };
                Parser.prototype.parseVariableDeclarationList = function (options) {
                    var opt = { inFor: options.inFor };
                    var list = [];
                    list.push(this.parseVariableDeclaration(opt));
                    while (this.match(',')) {
                        this.nextToken();
                        list.push(this.parseVariableDeclaration(opt));
                    }
                    return list;
                };
                Parser.prototype.parseVariableStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('var');
                    var declarations = this.parseVariableDeclarationList({ inFor: false });
                    this.consumeSemicolon();
                    return this.finalize(node, new Node.VariableDeclaration(declarations, 'var'));
                };
                Parser.prototype.parseEmptyStatement = function () {
                    var node = this.createNode();
                    this.expect(';');
                    return this.finalize(node, new Node.EmptyStatement());
                };
                Parser.prototype.parseExpressionStatement = function () {
                    var node = this.createNode();
                    var expr = this.parseExpression();
                    this.consumeSemicolon();
                    return this.finalize(node, new Node.ExpressionStatement(expr));
                };
                Parser.prototype.parseIfClause = function () {
                    if (this.context.strict && this.matchKeyword('function')) {
                        this.tolerateError(messages_1.Messages.StrictFunction);
                    }
                    return this.parseStatement();
                };
                Parser.prototype.parseIfStatement = function () {
                    var node = this.createNode();
                    var consequent;
                    var alternate = null;
                    this.expectKeyword('if');
                    this.expect('(');
                    var test = this.parseExpression();
                    if (!this.match(')') && this.config.tolerant) {
                        this.tolerateUnexpectedToken(this.nextToken());
                        consequent = this.finalize(this.createNode(), new Node.EmptyStatement());
                    } else {
                        this.expect(')');
                        consequent = this.parseIfClause();
                        if (this.matchKeyword('else')) {
                            this.nextToken();
                            alternate = this.parseIfClause();
                        }
                    }
                    return this.finalize(node, new Node.IfStatement(test, consequent, alternate));
                };
                Parser.prototype.parseDoWhileStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('do');
                    var previousInIteration = this.context.inIteration;
                    this.context.inIteration = true;
                    var body = this.parseStatement();
                    this.context.inIteration = previousInIteration;
                    this.expectKeyword('while');
                    this.expect('(');
                    var test = this.parseExpression();
                    if (!this.match(')') && this.config.tolerant) {
                        this.tolerateUnexpectedToken(this.nextToken());
                    } else {
                        this.expect(')');
                        if (this.match(';')) {
                            this.nextToken();
                        }
                    }
                    return this.finalize(node, new Node.DoWhileStatement(body, test));
                };
                Parser.prototype.parseWhileStatement = function () {
                    var node = this.createNode();
                    var body;
                    this.expectKeyword('while');
                    this.expect('(');
                    var test = this.parseExpression();
                    if (!this.match(')') && this.config.tolerant) {
                        this.tolerateUnexpectedToken(this.nextToken());
                        body = this.finalize(this.createNode(), new Node.EmptyStatement());
                    } else {
                        this.expect(')');
                        var previousInIteration = this.context.inIteration;
                        this.context.inIteration = true;
                        body = this.parseStatement();
                        this.context.inIteration = previousInIteration;
                    }
                    return this.finalize(node, new Node.WhileStatement(test, body));
                };
                Parser.prototype.parseForStatement = function () {
                    var init = null;
                    var test = null;
                    var update = null;
                    var forIn = true;
                    var left, right;
                    var node = this.createNode();
                    this.expectKeyword('for');
                    this.expect('(');
                    if (this.match(';')) {
                        this.nextToken();
                    } else {
                        if (this.matchKeyword('var')) {
                            init = this.createNode();
                            this.nextToken();
                            var previousAllowIn = this.context.allowIn;
                            this.context.allowIn = false;
                            var declarations = this.parseVariableDeclarationList({ inFor: true });
                            this.context.allowIn = previousAllowIn;
                            if (declarations.length === 1 && this.matchKeyword('in')) {
                                var decl = declarations[0];
                                if (decl.init && (decl.id.type === syntax_1.Syntax.ArrayPattern || decl.id.type === syntax_1.Syntax.ObjectPattern || this.context.strict)) {
                                    this.tolerateError(messages_1.Messages.ForInOfLoopInitializer, 'for-in');
                                }
                                init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
                                this.nextToken();
                                left = init;
                                right = this.parseExpression();
                                init = null;
                            } else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
                                init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
                                this.nextToken();
                                left = init;
                                right = this.parseAssignmentExpression();
                                init = null;
                                forIn = false;
                            } else {
                                init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
                                this.expect(';');
                            }
                        } else if (this.matchKeyword('const') || this.matchKeyword('let')) {
                            init = this.createNode();
                            var kind = this.nextToken().value;
                            if (!this.context.strict && this.lookahead.value === 'in') {
                                init = this.finalize(init, new Node.Identifier(kind));
                                this.nextToken();
                                left = init;
                                right = this.parseExpression();
                                init = null;
                            } else {
                                var previousAllowIn = this.context.allowIn;
                                this.context.allowIn = false;
                                var declarations = this.parseBindingList(kind, { inFor: true });
                                this.context.allowIn = previousAllowIn;
                                if (declarations.length === 1 && declarations[0].init === null && this.matchKeyword('in')) {
                                    init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
                                    this.nextToken();
                                    left = init;
                                    right = this.parseExpression();
                                    init = null;
                                } else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
                                    init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
                                    this.nextToken();
                                    left = init;
                                    right = this.parseAssignmentExpression();
                                    init = null;
                                    forIn = false;
                                } else {
                                    this.consumeSemicolon();
                                    init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
                                }
                            }
                        } else {
                            var initStartToken = this.lookahead;
                            var previousAllowIn = this.context.allowIn;
                            this.context.allowIn = false;
                            init = this.inheritCoverGrammar(this.parseAssignmentExpression);
                            this.context.allowIn = previousAllowIn;
                            if (this.matchKeyword('in')) {
                                if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
                                    this.tolerateError(messages_1.Messages.InvalidLHSInForIn);
                                }
                                this.nextToken();
                                this.reinterpretExpressionAsPattern(init);
                                left = init;
                                right = this.parseExpression();
                                init = null;
                            } else if (this.matchContextualKeyword('of')) {
                                if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
                                    this.tolerateError(messages_1.Messages.InvalidLHSInForLoop);
                                }
                                this.nextToken();
                                this.reinterpretExpressionAsPattern(init);
                                left = init;
                                right = this.parseAssignmentExpression();
                                init = null;
                                forIn = false;
                            } else {
                                if (this.match(',')) {
                                    var initSeq = [init];
                                    while (this.match(',')) {
                                        this.nextToken();
                                        initSeq.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
                                    }
                                    init = this.finalize(this.startNode(initStartToken), new Node.SequenceExpression(initSeq));
                                }
                                this.expect(';');
                            }
                        }
                    }
                    if (typeof left === 'undefined') {
                        if (!this.match(';')) {
                            test = this.parseExpression();
                        }
                        this.expect(';');
                        if (!this.match(')')) {
                            update = this.parseExpression();
                        }
                    }
                    var body;
                    if (!this.match(')') && this.config.tolerant) {
                        this.tolerateUnexpectedToken(this.nextToken());
                        body = this.finalize(this.createNode(), new Node.EmptyStatement());
                    } else {
                        this.expect(')');
                        var previousInIteration = this.context.inIteration;
                        this.context.inIteration = true;
                        body = this.isolateCoverGrammar(this.parseStatement);
                        this.context.inIteration = previousInIteration;
                    }
                    return typeof left === 'undefined' ? this.finalize(node, new Node.ForStatement(init, test, update, body)) : forIn ? this.finalize(node, new Node.ForInStatement(left, right, body)) : this.finalize(node, new Node.ForOfStatement(left, right, body));
                };
                Parser.prototype.parseContinueStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('continue');
                    var label = null;
                    if (this.lookahead.type === 3 && !this.hasLineTerminator) {
                        var id = this.parseVariableIdentifier();
                        label = id;
                        var key = '$' + id.name;
                        if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
                            this.throwError(messages_1.Messages.UnknownLabel, id.name);
                        }
                    }
                    this.consumeSemicolon();
                    if (label === null && !this.context.inIteration) {
                        this.throwError(messages_1.Messages.IllegalContinue);
                    }
                    return this.finalize(node, new Node.ContinueStatement(label));
                };
                Parser.prototype.parseBreakStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('break');
                    var label = null;
                    if (this.lookahead.type === 3 && !this.hasLineTerminator) {
                        var id = this.parseVariableIdentifier();
                        var key = '$' + id.name;
                        if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
                            this.throwError(messages_1.Messages.UnknownLabel, id.name);
                        }
                        label = id;
                    }
                    this.consumeSemicolon();
                    if (label === null && !this.context.inIteration && !this.context.inSwitch) {
                        this.throwError(messages_1.Messages.IllegalBreak);
                    }
                    return this.finalize(node, new Node.BreakStatement(label));
                };
                Parser.prototype.parseReturnStatement = function () {
                    if (!this.context.inFunctionBody) {
                        this.tolerateError(messages_1.Messages.IllegalReturn);
                    }
                    var node = this.createNode();
                    this.expectKeyword('return');
                    var hasArgument = !this.match(';') && !this.match('}') && !this.hasLineTerminator && this.lookahead.type !== 2;
                    var argument = hasArgument ? this.parseExpression() : null;
                    this.consumeSemicolon();
                    return this.finalize(node, new Node.ReturnStatement(argument));
                };
                Parser.prototype.parseWithStatement = function () {
                    if (this.context.strict) {
                        this.tolerateError(messages_1.Messages.StrictModeWith);
                    }
                    var node = this.createNode();
                    var body;
                    this.expectKeyword('with');
                    this.expect('(');
                    var object = this.parseExpression();
                    if (!this.match(')') && this.config.tolerant) {
                        this.tolerateUnexpectedToken(this.nextToken());
                        body = this.finalize(this.createNode(), new Node.EmptyStatement());
                    } else {
                        this.expect(')');
                        body = this.parseStatement();
                    }
                    return this.finalize(node, new Node.WithStatement(object, body));
                };
                Parser.prototype.parseSwitchCase = function () {
                    var node = this.createNode();
                    var test;
                    if (this.matchKeyword('default')) {
                        this.nextToken();
                        test = null;
                    } else {
                        this.expectKeyword('case');
                        test = this.parseExpression();
                    }
                    this.expect(':');
                    var consequent = [];
                    while (true) {
                        if (this.match('}') || this.matchKeyword('default') || this.matchKeyword('case')) {
                            break;
                        }
                        consequent.push(this.parseStatementListItem());
                    }
                    return this.finalize(node, new Node.SwitchCase(test, consequent));
                };
                Parser.prototype.parseSwitchStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('switch');
                    this.expect('(');
                    var discriminant = this.parseExpression();
                    this.expect(')');
                    var previousInSwitch = this.context.inSwitch;
                    this.context.inSwitch = true;
                    var cases = [];
                    var defaultFound = false;
                    this.expect('{');
                    while (true) {
                        if (this.match('}')) {
                            break;
                        }
                        var clause = this.parseSwitchCase();
                        if (clause.test === null) {
                            if (defaultFound) {
                                this.throwError(messages_1.Messages.MultipleDefaultsInSwitch);
                            }
                            defaultFound = true;
                        }
                        cases.push(clause);
                    }
                    this.expect('}');
                    this.context.inSwitch = previousInSwitch;
                    return this.finalize(node, new Node.SwitchStatement(discriminant, cases));
                };
                Parser.prototype.parseLabelledStatement = function () {
                    var node = this.createNode();
                    var expr = this.parseExpression();
                    var statement;
                    if (expr.type === syntax_1.Syntax.Identifier && this.match(':')) {
                        this.nextToken();
                        var id = expr;
                        var key = '$' + id.name;
                        if (Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
                            this.throwError(messages_1.Messages.Redeclaration, 'Label', id.name);
                        }
                        this.context.labelSet[key] = true;
                        var body = void 0;
                        if (this.matchKeyword('class')) {
                            this.tolerateUnexpectedToken(this.lookahead);
                            body = this.parseClassDeclaration();
                        } else if (this.matchKeyword('function')) {
                            var token = this.lookahead;
                            var declaration = this.parseFunctionDeclaration();
                            if (this.context.strict) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunction);
                            } else if (declaration.generator) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.GeneratorInLegacyContext);
                            }
                            body = declaration;
                        } else {
                            body = this.parseStatement();
                        }
                        delete this.context.labelSet[key];
                        statement = new Node.LabeledStatement(id, body);
                    } else {
                        this.consumeSemicolon();
                        statement = new Node.ExpressionStatement(expr);
                    }
                    return this.finalize(node, statement);
                };
                Parser.prototype.parseThrowStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('throw');
                    if (this.hasLineTerminator) {
                        this.throwError(messages_1.Messages.NewlineAfterThrow);
                    }
                    var argument = this.parseExpression();
                    this.consumeSemicolon();
                    return this.finalize(node, new Node.ThrowStatement(argument));
                };
                Parser.prototype.parseCatchClause = function () {
                    var node = this.createNode();
                    this.expectKeyword('catch');
                    this.expect('(');
                    if (this.match(')')) {
                        this.throwUnexpectedToken(this.lookahead);
                    }
                    var params = [];
                    var param = this.parsePattern(params);
                    var paramMap = {};
                    for (var i = 0; i < params.length; i++) {
                        var key = '$' + params[i].value;
                        if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
                            this.tolerateError(messages_1.Messages.DuplicateBinding, params[i].value);
                        }
                        paramMap[key] = true;
                    }
                    if (this.context.strict && param.type === syntax_1.Syntax.Identifier) {
                        if (this.scanner.isRestrictedWord(param.name)) {
                            this.tolerateError(messages_1.Messages.StrictCatchVariable);
                        }
                    }
                    this.expect(')');
                    var body = this.parseBlock();
                    return this.finalize(node, new Node.CatchClause(param, body));
                };
                Parser.prototype.parseFinallyClause = function () {
                    this.expectKeyword('finally');
                    return this.parseBlock();
                };
                Parser.prototype.parseTryStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('try');
                    var block = this.parseBlock();
                    var handler = this.matchKeyword('catch') ? this.parseCatchClause() : null;
                    var finalizer = this.matchKeyword('finally') ? this.parseFinallyClause() : null;
                    if (!handler && !finalizer) {
                        this.throwError(messages_1.Messages.NoCatchOrFinally);
                    }
                    return this.finalize(node, new Node.TryStatement(block, handler, finalizer));
                };
                Parser.prototype.parseDebuggerStatement = function () {
                    var node = this.createNode();
                    this.expectKeyword('debugger');
                    this.consumeSemicolon();
                    return this.finalize(node, new Node.DebuggerStatement());
                };
                Parser.prototype.parseStatement = function () {
                    var statement;
                    switch (this.lookahead.type) {
                        case 1:
                        case 5:
                        case 6:
                        case 8:
                        case 10:
                        case 9:
                            statement = this.parseExpressionStatement();
                            break;
                        case 7:
                            var value = this.lookahead.value;
                            if (value === '{') {
                                statement = this.parseBlock();
                            } else if (value === '(') {
                                statement = this.parseExpressionStatement();
                            } else if (value === ';') {
                                statement = this.parseEmptyStatement();
                            } else {
                                statement = this.parseExpressionStatement();
                            }
                            break;
                        case 3:
                            statement = this.matchAsyncFunction() ? this.parseFunctionDeclaration() : this.parseLabelledStatement();
                            break;
                        case 4:
                            switch (this.lookahead.value) {
                                case 'break':
                                    statement = this.parseBreakStatement();
                                    break;
                                case 'continue':
                                    statement = this.parseContinueStatement();
                                    break;
                                case 'debugger':
                                    statement = this.parseDebuggerStatement();
                                    break;
                                case 'do':
                                    statement = this.parseDoWhileStatement();
                                    break;
                                case 'for':
                                    statement = this.parseForStatement();
                                    break;
                                case 'function':
                                    statement = this.parseFunctionDeclaration();
                                    break;
                                case 'if':
                                    statement = this.parseIfStatement();
                                    break;
                                case 'return':
                                    statement = this.parseReturnStatement();
                                    break;
                                case 'switch':
                                    statement = this.parseSwitchStatement();
                                    break;
                                case 'throw':
                                    statement = this.parseThrowStatement();
                                    break;
                                case 'try':
                                    statement = this.parseTryStatement();
                                    break;
                                case 'var':
                                    statement = this.parseVariableStatement();
                                    break;
                                case 'while':
                                    statement = this.parseWhileStatement();
                                    break;
                                case 'with':
                                    statement = this.parseWithStatement();
                                    break;
                                default:
                                    statement = this.parseExpressionStatement();
                                    break;
                            }
                            break;
                        default:
                            statement = this.throwUnexpectedToken(this.lookahead);
                    }
                    return statement;
                };
                Parser.prototype.parseFunctionSourceElements = function () {
                    var node = this.createNode();
                    this.expect('{');
                    var body = this.parseDirectivePrologues();
                    var previousLabelSet = this.context.labelSet;
                    var previousInIteration = this.context.inIteration;
                    var previousInSwitch = this.context.inSwitch;
                    var previousInFunctionBody = this.context.inFunctionBody;
                    this.context.labelSet = {};
                    this.context.inIteration = false;
                    this.context.inSwitch = false;
                    this.context.inFunctionBody = true;
                    while (this.lookahead.type !== 2) {
                        if (this.match('}')) {
                            break;
                        }
                        body.push(this.parseStatementListItem());
                    }
                    this.expect('}');
                    this.context.labelSet = previousLabelSet;
                    this.context.inIteration = previousInIteration;
                    this.context.inSwitch = previousInSwitch;
                    this.context.inFunctionBody = previousInFunctionBody;
                    return this.finalize(node, new Node.BlockStatement(body));
                };
                Parser.prototype.validateParam = function (options, param, name) {
                    var key = '$' + name;
                    if (this.context.strict) {
                        if (this.scanner.isRestrictedWord(name)) {
                            options.stricted = param;
                            options.message = messages_1.Messages.StrictParamName;
                        }
                        if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                            options.stricted = param;
                            options.message = messages_1.Messages.StrictParamDupe;
                        }
                    } else if (!options.firstRestricted) {
                        if (this.scanner.isRestrictedWord(name)) {
                            options.firstRestricted = param;
                            options.message = messages_1.Messages.StrictParamName;
                        } else if (this.scanner.isStrictModeReservedWord(name)) {
                            options.firstRestricted = param;
                            options.message = messages_1.Messages.StrictReservedWord;
                        } else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                            options.stricted = param;
                            options.message = messages_1.Messages.StrictParamDupe;
                        }
                    }
                    if (typeof Object.defineProperty === 'function') {
                        Object.defineProperty(options.paramSet, key, { value: true, enumerable: true, writable: true, configurable: true });
                    } else {
                        options.paramSet[key] = true;
                    }
                };
                Parser.prototype.parseRestElement = function (params) {
                    var node = this.createNode();
                    this.expect('...');
                    var arg = this.parsePattern(params);
                    if (this.match('=')) {
                        this.throwError(messages_1.Messages.DefaultRestParameter);
                    }
                    if (!this.match(')')) {
                        this.throwError(messages_1.Messages.ParameterAfterRestParameter);
                    }
                    return this.finalize(node, new Node.RestElement(arg));
                };
                Parser.prototype.parseFormalParameter = function (options) {
                    var params = [];
                    var param = this.match('...') ? this.parseRestElement(params) : this.parsePatternWithDefault(params);
                    for (var i = 0; i < params.length; i++) {
                        this.validateParam(options, params[i], params[i].value);
                    }
                    options.simple = options.simple && param instanceof Node.Identifier;
                    options.params.push(param);
                };
                Parser.prototype.parseFormalParameters = function (firstRestricted) {
                    var options;
                    options = {
                        simple: true,
                        params: [],
                        firstRestricted: firstRestricted
                    };
                    this.expect('(');
                    if (!this.match(')')) {
                        options.paramSet = {};
                        while (this.lookahead.type !== 2) {
                            this.parseFormalParameter(options);
                            if (this.match(')')) {
                                break;
                            }
                            this.expect(',');
                            if (this.match(')')) {
                                break;
                            }
                        }
                    }
                    this.expect(')');
                    return {
                        simple: options.simple,
                        params: options.params,
                        stricted: options.stricted,
                        firstRestricted: options.firstRestricted,
                        message: options.message
                    };
                };
                Parser.prototype.matchAsyncFunction = function () {
                    var match = this.matchContextualKeyword('async');
                    if (match) {
                        var state = this.scanner.saveState();
                        this.scanner.scanComments();
                        var next = this.scanner.lex();
                        this.scanner.restoreState(state);
                        match = state.lineNumber === next.lineNumber && next.type === 4 && next.value === 'function';
                    }
                    return match;
                };
                Parser.prototype.parseFunctionDeclaration = function (identifierIsOptional) {
                    var node = this.createNode();
                    var isAsync = this.matchContextualKeyword('async');
                    if (isAsync) {
                        this.nextToken();
                    }
                    this.expectKeyword('function');
                    var isGenerator = isAsync ? false : this.match('*');
                    if (isGenerator) {
                        this.nextToken();
                    }
                    var message;
                    var id = null;
                    var firstRestricted = null;
                    if (!identifierIsOptional || !this.match('(')) {
                        var token = this.lookahead;
                        id = this.parseVariableIdentifier();
                        if (this.context.strict) {
                            if (this.scanner.isRestrictedWord(token.value)) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
                            }
                        } else {
                            if (this.scanner.isRestrictedWord(token.value)) {
                                firstRestricted = token;
                                message = messages_1.Messages.StrictFunctionName;
                            } else if (this.scanner.isStrictModeReservedWord(token.value)) {
                                firstRestricted = token;
                                message = messages_1.Messages.StrictReservedWord;
                            }
                        }
                    }
                    var previousAllowAwait = this.context.await;
                    var previousAllowYield = this.context.allowYield;
                    this.context.await = isAsync;
                    this.context.allowYield = !isGenerator;
                    var formalParameters = this.parseFormalParameters(firstRestricted);
                    var params = formalParameters.params;
                    var stricted = formalParameters.stricted;
                    firstRestricted = formalParameters.firstRestricted;
                    if (formalParameters.message) {
                        message = formalParameters.message;
                    }
                    var previousStrict = this.context.strict;
                    var previousAllowStrictDirective = this.context.allowStrictDirective;
                    this.context.allowStrictDirective = formalParameters.simple;
                    var body = this.parseFunctionSourceElements();
                    if (this.context.strict && firstRestricted) {
                        this.throwUnexpectedToken(firstRestricted, message);
                    }
                    if (this.context.strict && stricted) {
                        this.tolerateUnexpectedToken(stricted, message);
                    }
                    this.context.strict = previousStrict;
                    this.context.allowStrictDirective = previousAllowStrictDirective;
                    this.context.await = previousAllowAwait;
                    this.context.allowYield = previousAllowYield;
                    return isAsync ? this.finalize(node, new Node.AsyncFunctionDeclaration(id, params, body)) : this.finalize(node, new Node.FunctionDeclaration(id, params, body, isGenerator));
                };
                Parser.prototype.parseFunctionExpression = function () {
                    var node = this.createNode();
                    var isAsync = this.matchContextualKeyword('async');
                    if (isAsync) {
                        this.nextToken();
                    }
                    this.expectKeyword('function');
                    var isGenerator = isAsync ? false : this.match('*');
                    if (isGenerator) {
                        this.nextToken();
                    }
                    var message;
                    var id = null;
                    var firstRestricted;
                    var previousAllowAwait = this.context.await;
                    var previousAllowYield = this.context.allowYield;
                    this.context.await = isAsync;
                    this.context.allowYield = !isGenerator;
                    if (!this.match('(')) {
                        var token = this.lookahead;
                        id = !this.context.strict && !isGenerator && this.matchKeyword('yield') ? this.parseIdentifierName() : this.parseVariableIdentifier();
                        if (this.context.strict) {
                            if (this.scanner.isRestrictedWord(token.value)) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
                            }
                        } else {
                            if (this.scanner.isRestrictedWord(token.value)) {
                                firstRestricted = token;
                                message = messages_1.Messages.StrictFunctionName;
                            } else if (this.scanner.isStrictModeReservedWord(token.value)) {
                                firstRestricted = token;
                                message = messages_1.Messages.StrictReservedWord;
                            }
                        }
                    }
                    var formalParameters = this.parseFormalParameters(firstRestricted);
                    var params = formalParameters.params;
                    var stricted = formalParameters.stricted;
                    firstRestricted = formalParameters.firstRestricted;
                    if (formalParameters.message) {
                        message = formalParameters.message;
                    }
                    var previousStrict = this.context.strict;
                    var previousAllowStrictDirective = this.context.allowStrictDirective;
                    this.context.allowStrictDirective = formalParameters.simple;
                    var body = this.parseFunctionSourceElements();
                    if (this.context.strict && firstRestricted) {
                        this.throwUnexpectedToken(firstRestricted, message);
                    }
                    if (this.context.strict && stricted) {
                        this.tolerateUnexpectedToken(stricted, message);
                    }
                    this.context.strict = previousStrict;
                    this.context.allowStrictDirective = previousAllowStrictDirective;
                    this.context.await = previousAllowAwait;
                    this.context.allowYield = previousAllowYield;
                    return isAsync ? this.finalize(node, new Node.AsyncFunctionExpression(id, params, body)) : this.finalize(node, new Node.FunctionExpression(id, params, body, isGenerator));
                };
                Parser.prototype.parseDirective = function () {
                    var token = this.lookahead;
                    var node = this.createNode();
                    var expr = this.parseExpression();
                    var directive = expr.type === syntax_1.Syntax.Literal ? this.getTokenRaw(token).slice(1, -1) : null;
                    this.consumeSemicolon();
                    return this.finalize(node, directive ? new Node.Directive(expr, directive) : new Node.ExpressionStatement(expr));
                };
                Parser.prototype.parseDirectivePrologues = function () {
                    var firstRestricted = null;
                    var body = [];
                    while (true) {
                        var token = this.lookahead;
                        if (token.type !== 8) {
                            break;
                        }
                        var statement = this.parseDirective();
                        body.push(statement);
                        var directive = statement.directive;
                        if (typeof directive !== 'string') {
                            break;
                        }
                        if (directive === 'use strict') {
                            this.context.strict = true;
                            if (firstRestricted) {
                                this.tolerateUnexpectedToken(firstRestricted, messages_1.Messages.StrictOctalLiteral);
                            }
                            if (!this.context.allowStrictDirective) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.IllegalLanguageModeDirective);
                            }
                        } else {
                            if (!firstRestricted && token.octal) {
                                firstRestricted = token;
                            }
                        }
                    }
                    return body;
                };
                Parser.prototype.qualifiedPropertyName = function (token) {
                    switch (token.type) {
                        case 3:
                        case 8:
                        case 1:
                        case 5:
                        case 6:
                        case 4:
                            return true;
                        case 7:
                            return token.value === '[';
                        default:
                            break;
                    }
                    return false;
                };
                Parser.prototype.parseGetterMethod = function () {
                    var node = this.createNode();
                    var isGenerator = false;
                    var previousAllowYield = this.context.allowYield;
                    this.context.allowYield = false;
                    var formalParameters = this.parseFormalParameters();
                    if (formalParameters.params.length > 0) {
                        this.tolerateError(messages_1.Messages.BadGetterArity);
                    }
                    var method = this.parsePropertyMethod(formalParameters);
                    this.context.allowYield = previousAllowYield;
                    return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
                };
                Parser.prototype.parseSetterMethod = function () {
                    var node = this.createNode();
                    var isGenerator = false;
                    var previousAllowYield = this.context.allowYield;
                    this.context.allowYield = false;
                    var formalParameters = this.parseFormalParameters();
                    if (formalParameters.params.length !== 1) {
                        this.tolerateError(messages_1.Messages.BadSetterArity);
                    } else if (formalParameters.params[0] instanceof Node.RestElement) {
                        this.tolerateError(messages_1.Messages.BadSetterRestParameter);
                    }
                    var method = this.parsePropertyMethod(formalParameters);
                    this.context.allowYield = previousAllowYield;
                    return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
                };
                Parser.prototype.parseGeneratorMethod = function () {
                    var node = this.createNode();
                    var isGenerator = true;
                    var previousAllowYield = this.context.allowYield;
                    this.context.allowYield = true;
                    var params = this.parseFormalParameters();
                    this.context.allowYield = false;
                    var method = this.parsePropertyMethod(params);
                    this.context.allowYield = previousAllowYield;
                    return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
                };
                Parser.prototype.isStartOfExpression = function () {
                    var start = true;
                    var value = this.lookahead.value;
                    switch (this.lookahead.type) {
                        case 7:
                            start = value === '[' || value === '(' || value === '{' || value === '+' || value === '-' || value === '!' || value === '~' || value === '++' || value === '--' || value === '/' || value === '/=';
                            break;
                        case 4:
                            start = value === 'class' || value === 'delete' || value === 'function' || value === 'let' || value === 'new' || value === 'super' || value === 'this' || value === 'typeof' || value === 'void' || value === 'yield';
                            break;
                        default:
                            break;
                    }
                    return start;
                };
                Parser.prototype.parseYieldExpression = function () {
                    var node = this.createNode();
                    this.expectKeyword('yield');
                    var argument = null;
                    var delegate = false;
                    if (!this.hasLineTerminator) {
                        var previousAllowYield = this.context.allowYield;
                        this.context.allowYield = false;
                        delegate = this.match('*');
                        if (delegate) {
                            this.nextToken();
                            argument = this.parseAssignmentExpression();
                        } else if (this.isStartOfExpression()) {
                            argument = this.parseAssignmentExpression();
                        }
                        this.context.allowYield = previousAllowYield;
                    }
                    return this.finalize(node, new Node.YieldExpression(argument, delegate));
                };
                Parser.prototype.parseClassElement = function (hasConstructor) {
                    var token = this.lookahead;
                    var node = this.createNode();
                    var kind = '';
                    var key = null;
                    var value = null;
                    var computed = false;
                    var method = false;
                    var isStatic = false;
                    var isAsync = false;
                    if (this.match('*')) {
                        this.nextToken();
                    } else {
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        var id = key;
                        if (id.name === 'static' && (this.qualifiedPropertyName(this.lookahead) || this.match('*'))) {
                            token = this.lookahead;
                            isStatic = true;
                            computed = this.match('[');
                            if (this.match('*')) {
                                this.nextToken();
                            } else {
                                key = this.parseObjectPropertyKey();
                            }
                        }
                        if (token.type === 3 && !this.hasLineTerminator && token.value === 'async') {
                            var punctuator = this.lookahead.value;
                            if (punctuator !== ':' && punctuator !== '(' && punctuator !== '*') {
                                isAsync = true;
                                token = this.lookahead;
                                key = this.parseObjectPropertyKey();
                                if (token.type === 3) {
                                    if (token.value === 'get' || token.value === 'set') {
                                        this.tolerateUnexpectedToken(token);
                                    } else if (token.value === 'constructor') {
                                        this.tolerateUnexpectedToken(token, messages_1.Messages.ConstructorIsAsync);
                                    }
                                }
                            }
                        }
                    }
                    var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
                    if (token.type === 3) {
                        if (token.value === 'get' && lookaheadPropertyKey) {
                            kind = 'get';
                            computed = this.match('[');
                            key = this.parseObjectPropertyKey();
                            this.context.allowYield = false;
                            value = this.parseGetterMethod();
                        } else if (token.value === 'set' && lookaheadPropertyKey) {
                            kind = 'set';
                            computed = this.match('[');
                            key = this.parseObjectPropertyKey();
                            value = this.parseSetterMethod();
                        }
                    } else if (token.type === 7 && token.value === '*' && lookaheadPropertyKey) {
                        kind = 'init';
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        value = this.parseGeneratorMethod();
                        method = true;
                    }
                    if (!kind && key && this.match('(')) {
                        kind = 'init';
                        value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
                        method = true;
                    }
                    if (!kind) {
                        this.throwUnexpectedToken(this.lookahead);
                    }
                    if (kind === 'init') {
                        kind = 'method';
                    }
                    if (!computed) {
                        if (isStatic && this.isPropertyKey(key, 'prototype')) {
                            this.throwUnexpectedToken(token, messages_1.Messages.StaticPrototype);
                        }
                        if (!isStatic && this.isPropertyKey(key, 'constructor')) {
                            if (kind !== 'method' || !method || value && value.generator) {
                                this.throwUnexpectedToken(token, messages_1.Messages.ConstructorSpecialMethod);
                            }
                            if (hasConstructor.value) {
                                this.throwUnexpectedToken(token, messages_1.Messages.DuplicateConstructor);
                            } else {
                                hasConstructor.value = true;
                            }
                            kind = 'constructor';
                        }
                    }
                    return this.finalize(node, new Node.MethodDefinition(key, computed, value, kind, isStatic));
                };
                Parser.prototype.parseClassElementList = function () {
                    var body = [];
                    var hasConstructor = { value: false };
                    this.expect('{');
                    while (!this.match('}')) {
                        if (this.match(';')) {
                            this.nextToken();
                        } else {
                            body.push(this.parseClassElement(hasConstructor));
                        }
                    }
                    this.expect('}');
                    return body;
                };
                Parser.prototype.parseClassBody = function () {
                    var node = this.createNode();
                    var elementList = this.parseClassElementList();
                    return this.finalize(node, new Node.ClassBody(elementList));
                };
                Parser.prototype.parseClassDeclaration = function (identifierIsOptional) {
                    var node = this.createNode();
                    var previousStrict = this.context.strict;
                    this.context.strict = true;
                    this.expectKeyword('class');
                    var id = identifierIsOptional && this.lookahead.type !== 3 ? null : this.parseVariableIdentifier();
                    var superClass = null;
                    if (this.matchKeyword('extends')) {
                        this.nextToken();
                        superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
                    }
                    var classBody = this.parseClassBody();
                    this.context.strict = previousStrict;
                    return this.finalize(node, new Node.ClassDeclaration(id, superClass, classBody));
                };
                Parser.prototype.parseClassExpression = function () {
                    var node = this.createNode();
                    var previousStrict = this.context.strict;
                    this.context.strict = true;
                    this.expectKeyword('class');
                    var id = this.lookahead.type === 3 ? this.parseVariableIdentifier() : null;
                    var superClass = null;
                    if (this.matchKeyword('extends')) {
                        this.nextToken();
                        superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
                    }
                    var classBody = this.parseClassBody();
                    this.context.strict = previousStrict;
                    return this.finalize(node, new Node.ClassExpression(id, superClass, classBody));
                };
                Parser.prototype.parseModule = function () {
                    this.context.strict = true;
                    this.context.isModule = true;
                    var node = this.createNode();
                    var body = this.parseDirectivePrologues();
                    while (this.lookahead.type !== 2) {
                        body.push(this.parseStatementListItem());
                    }
                    return this.finalize(node, new Node.Module(body));
                };
                Parser.prototype.parseScript = function () {
                    var node = this.createNode();
                    var body = this.parseDirectivePrologues();
                    while (this.lookahead.type !== 2) {
                        body.push(this.parseStatementListItem());
                    }
                    return this.finalize(node, new Node.Script(body));
                };
                Parser.prototype.parseModuleSpecifier = function () {
                    var node = this.createNode();
                    if (this.lookahead.type !== 8) {
                        this.throwError(messages_1.Messages.InvalidModuleSpecifier);
                    }
                    var token = this.nextToken();
                    var raw = this.getTokenRaw(token);
                    return this.finalize(node, new Node.Literal(token.value, raw));
                };
                Parser.prototype.parseImportSpecifier = function () {
                    var node = this.createNode();
                    var imported;
                    var local;
                    if (this.lookahead.type === 3) {
                        imported = this.parseVariableIdentifier();
                        local = imported;
                        if (this.matchContextualKeyword('as')) {
                            this.nextToken();
                            local = this.parseVariableIdentifier();
                        }
                    } else {
                        imported = this.parseIdentifierName();
                        local = imported;
                        if (this.matchContextualKeyword('as')) {
                            this.nextToken();
                            local = this.parseVariableIdentifier();
                        } else {
                            this.throwUnexpectedToken(this.nextToken());
                        }
                    }
                    return this.finalize(node, new Node.ImportSpecifier(local, imported));
                };
                Parser.prototype.parseNamedImports = function () {
                    this.expect('{');
                    var specifiers = [];
                    while (!this.match('}')) {
                        specifiers.push(this.parseImportSpecifier());
                        if (!this.match('}')) {
                            this.expect(',');
                        }
                    }
                    this.expect('}');
                    return specifiers;
                };
                Parser.prototype.parseImportDefaultSpecifier = function () {
                    var node = this.createNode();
                    var local = this.parseIdentifierName();
                    return this.finalize(node, new Node.ImportDefaultSpecifier(local));
                };
                Parser.prototype.parseImportNamespaceSpecifier = function () {
                    var node = this.createNode();
                    this.expect('*');
                    if (!this.matchContextualKeyword('as')) {
                        this.throwError(messages_1.Messages.NoAsAfterImportNamespace);
                    }
                    this.nextToken();
                    var local = this.parseIdentifierName();
                    return this.finalize(node, new Node.ImportNamespaceSpecifier(local));
                };
                Parser.prototype.parseImportDeclaration = function () {
                    if (this.context.inFunctionBody) {
                        this.throwError(messages_1.Messages.IllegalImportDeclaration);
                    }
                    var node = this.createNode();
                    this.expectKeyword('import');
                    var src;
                    var specifiers = [];
                    if (this.lookahead.type === 8) {
                        src = this.parseModuleSpecifier();
                    } else {
                        if (this.match('{')) {
                            specifiers = specifiers.concat(this.parseNamedImports());
                        } else if (this.match('*')) {
                            specifiers.push(this.parseImportNamespaceSpecifier());
                        } else if (this.isIdentifierName(this.lookahead) && !this.matchKeyword('default')) {
                            specifiers.push(this.parseImportDefaultSpecifier());
                            if (this.match(',')) {
                                this.nextToken();
                                if (this.match('*')) {
                                    specifiers.push(this.parseImportNamespaceSpecifier());
                                } else if (this.match('{')) {
                                    specifiers = specifiers.concat(this.parseNamedImports());
                                } else {
                                    this.throwUnexpectedToken(this.lookahead);
                                }
                            }
                        } else {
                            this.throwUnexpectedToken(this.nextToken());
                        }
                        if (!this.matchContextualKeyword('from')) {
                            var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
                            this.throwError(message, this.lookahead.value);
                        }
                        this.nextToken();
                        src = this.parseModuleSpecifier();
                    }
                    this.consumeSemicolon();
                    return this.finalize(node, new Node.ImportDeclaration(specifiers, src));
                };
                Parser.prototype.parseExportSpecifier = function () {
                    var node = this.createNode();
                    var local = this.parseIdentifierName();
                    var exported = local;
                    if (this.matchContextualKeyword('as')) {
                        this.nextToken();
                        exported = this.parseIdentifierName();
                    }
                    return this.finalize(node, new Node.ExportSpecifier(local, exported));
                };
                Parser.prototype.parseExportDeclaration = function () {
                    if (this.context.inFunctionBody) {
                        this.throwError(messages_1.Messages.IllegalExportDeclaration);
                    }
                    var node = this.createNode();
                    this.expectKeyword('export');
                    var exportDeclaration;
                    if (this.matchKeyword('default')) {
                        this.nextToken();
                        if (this.matchKeyword('function')) {
                            var declaration = this.parseFunctionDeclaration(true);
                            exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
                        } else if (this.matchKeyword('class')) {
                            var declaration = this.parseClassDeclaration(true);
                            exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
                        } else if (this.matchContextualKeyword('async')) {
                            var declaration = this.matchAsyncFunction() ? this.parseFunctionDeclaration(true) : this.parseAssignmentExpression();
                            exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
                        } else {
                            if (this.matchContextualKeyword('from')) {
                                this.throwError(messages_1.Messages.UnexpectedToken, this.lookahead.value);
                            }
                            var declaration = this.match('{') ? this.parseObjectInitializer() : this.match('[') ? this.parseArrayInitializer() : this.parseAssignmentExpression();
                            this.consumeSemicolon();
                            exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
                        }
                    } else if (this.match('*')) {
                        this.nextToken();
                        if (!this.matchContextualKeyword('from')) {
                            var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
                            this.throwError(message, this.lookahead.value);
                        }
                        this.nextToken();
                        var src = this.parseModuleSpecifier();
                        this.consumeSemicolon();
                        exportDeclaration = this.finalize(node, new Node.ExportAllDeclaration(src));
                    } else if (this.lookahead.type === 4) {
                        var declaration = void 0;
                        switch (this.lookahead.value) {
                            case 'let':
                            case 'const':
                                declaration = this.parseLexicalDeclaration({ inFor: false });
                                break;
                            case 'var':
                            case 'class':
                            case 'function':
                                declaration = this.parseStatementListItem();
                                break;
                            default:
                                this.throwUnexpectedToken(this.lookahead);
                        }
                        exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
                    } else if (this.matchAsyncFunction()) {
                        var declaration = this.parseFunctionDeclaration();
                        exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
                    } else {
                        var specifiers = [];
                        var source = null;
                        var isExportFromIdentifier = false;
                        this.expect('{');
                        while (!this.match('}')) {
                            isExportFromIdentifier = isExportFromIdentifier || this.matchKeyword('default');
                            specifiers.push(this.parseExportSpecifier());
                            if (!this.match('}')) {
                                this.expect(',');
                            }
                        }
                        this.expect('}');
                        if (this.matchContextualKeyword('from')) {
                            this.nextToken();
                            source = this.parseModuleSpecifier();
                            this.consumeSemicolon();
                        } else if (isExportFromIdentifier) {
                            var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
                            this.throwError(message, this.lookahead.value);
                        } else {
                            this.consumeSemicolon();
                        }
                        exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(null, specifiers, source));
                    }
                    return exportDeclaration;
                };
                return Parser;
            }();
            exports_1("Parser", Parser);
        }
    };
});
System.register('error-handler.js', [], function (exports_1, context_1) {
    "use strict";

    var ErrorHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ErrorHandler = function () {
                function ErrorHandler() {
                    this.errors = [];
                    this.tolerant = false;
                }
                ErrorHandler.prototype.recordError = function (error) {
                    this.errors.push(error);
                };
                ErrorHandler.prototype.tolerate = function (error) {
                    if (this.tolerant) {
                        this.recordError(error);
                    } else {
                        throw error;
                    }
                };
                ErrorHandler.prototype.constructError = function (msg, column) {
                    var error = new Error(msg);
                    try {
                        throw error;
                    } catch (base) {
                        if (Object.create && Object.defineProperty) {
                            error = Object.create(base);
                            Object.defineProperty(error, 'column', { value: column });
                        }
                    }
                    return error;
                };
                ErrorHandler.prototype.createError = function (index, line, col, description) {
                    var msg = 'Line ' + line + ': ' + description;
                    var error = this.constructError(msg, col);
                    error.index = index;
                    error.lineNumber = line;
                    error.description = description;
                    return error;
                };
                ErrorHandler.prototype.throwError = function (index, line, col, description) {
                    throw this.createError(index, line, col, description);
                };
                ErrorHandler.prototype.tolerateError = function (index, line, col, description) {
                    var error = this.createError(index, line, col, description);
                    if (this.tolerant) {
                        this.recordError(error);
                    } else {
                        throw error;
                    }
                };
                return ErrorHandler;
            }();
            exports_1("ErrorHandler", ErrorHandler);
        }
    };
});
System.register("assert.js", [], function (exports_1, context_1) {
    "use strict";

    var __moduleName = context_1 && context_1.id;
    function assert(condition, message) {
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }
    exports_1("assert", assert);
    return {
        setters: [],
        execute: function () {}
    };
});
System.register("character.js", [], function (exports_1, context_1) {
    "use strict";

    var Regex, Character;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Regex = {
                NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
                NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
            };
            exports_1("Character", Character = {
                fromCodePoint: function (cp) {
                    return cp < 0x10000 ? String.fromCharCode(cp) : String.fromCharCode(0xD800 + (cp - 0x10000 >> 10)) + String.fromCharCode(0xDC00 + (cp - 0x10000 & 1023));
                },
                isWhiteSpace: function (cp) {
                    return cp === 0x20 || cp === 0x09 || cp === 0x0B || cp === 0x0C || cp === 0xA0 || cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(cp) >= 0;
                },
                isLineTerminator: function (cp) {
                    return cp === 0x0A || cp === 0x0D || cp === 0x2028 || cp === 0x2029;
                },
                isIdentifierStart: function (cp) {
                    return cp === 0x24 || cp === 0x5F || cp >= 0x41 && cp <= 0x5A || cp >= 0x61 && cp <= 0x7A || cp === 0x5C || cp >= 0x80 && Regex.NonAsciiIdentifierStart.test(Character.fromCodePoint(cp));
                },
                isIdentifierPart: function (cp) {
                    return cp === 0x24 || cp === 0x5F || cp >= 0x41 && cp <= 0x5A || cp >= 0x61 && cp <= 0x7A || cp >= 0x30 && cp <= 0x39 || cp === 0x5C || cp >= 0x80 && Regex.NonAsciiIdentifierPart.test(Character.fromCodePoint(cp));
                },
                isDecimalDigit: function (cp) {
                    return cp >= 0x30 && cp <= 0x39;
                },
                isHexDigit: function (cp) {
                    return cp >= 0x30 && cp <= 0x39 || cp >= 0x41 && cp <= 0x46 || cp >= 0x61 && cp <= 0x66;
                },
                isOctalDigit: function (cp) {
                    return cp >= 0x30 && cp <= 0x37;
                }
            });
        }
    };
});
System.register("messages.js", [], function (exports_1, context_1) {
    "use strict";

    var Messages;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("Messages", Messages = {
                BadImportCallArity: 'Unexpected token',
                BadGetterArity: 'Getter must not have any formal parameters',
                BadSetterArity: 'Setter must have exactly one formal parameter',
                BadSetterRestParameter: 'Setter function argument must not be a rest parameter',
                ConstructorIsAsync: 'Class constructor may not be an async method',
                ConstructorSpecialMethod: 'Class constructor may not be an accessor',
                DeclarationMissingInitializer: 'Missing initializer in %0 declaration',
                DefaultRestParameter: 'Unexpected token =',
                DefaultRestProperty: 'Unexpected token =',
                DuplicateBinding: 'Duplicate binding %0',
                DuplicateConstructor: 'A class may only have one constructor',
                DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
                ForInOfLoopInitializer: '%0 loop variable declaration may not have an initializer',
                GeneratorInLegacyContext: 'Generator declarations are not allowed in legacy contexts',
                IllegalBreak: 'Illegal break statement',
                IllegalContinue: 'Illegal continue statement',
                IllegalExportDeclaration: 'Unexpected token',
                IllegalImportDeclaration: 'Unexpected token',
                IllegalLanguageModeDirective: 'Illegal \'use strict\' directive in function with non-simple parameter list',
                IllegalReturn: 'Illegal return statement',
                InvalidEscapedReservedWord: 'Keyword must not contain escaped characters',
                InvalidHexEscapeSequence: 'Invalid hexadecimal escape sequence',
                InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
                InvalidLHSInForIn: 'Invalid left-hand side in for-in',
                InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
                InvalidModuleSpecifier: 'Unexpected token',
                InvalidRegExp: 'Invalid regular expression',
                LetInLexicalBinding: 'let is disallowed as a lexically bound name',
                MissingFromClause: 'Unexpected token',
                MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
                NewlineAfterThrow: 'Illegal newline after throw',
                NoAsAfterImportNamespace: 'Unexpected token',
                NoCatchOrFinally: 'Missing catch or finally after try',
                ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
                PropertyAfterRestProperty: 'Unexpected token',
                Redeclaration: '%0 \'%1\' has already been declared',
                StaticPrototype: 'Classes may not have static property named prototype',
                StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
                StrictDelete: 'Delete of an unqualified identifier in strict mode.',
                StrictFunction: 'In strict mode code, functions can only be declared at top level or inside a block',
                StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
                StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
                StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
                StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
                StrictModeWith: 'Strict mode code may not include a with statement',
                StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
                StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
                StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
                StrictReservedWord: 'Use of future reserved word in strict mode',
                StrictVarName: 'Variable name may not be eval or arguments in strict mode',
                TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
                UnexpectedEOS: 'Unexpected end of input',
                UnexpectedIdentifier: 'Unexpected identifier',
                UnexpectedNumber: 'Unexpected number',
                UnexpectedReserved: 'Unexpected reserved word',
                UnexpectedString: 'Unexpected string',
                UnexpectedTemplate: 'Unexpected quasi %0',
                UnexpectedToken: 'Unexpected token %0',
                UnexpectedTokenIllegal: 'Unexpected token ILLEGAL',
                UnknownLabel: 'Undefined label \'%0\'',
                UnterminatedRegExp: 'Invalid regular expression: missing /'
            });
        }
    };
});
System.register("scanner.js", ["./assert", "./character", "./messages"], function (exports_1, context_1) {
    "use strict";

    var assert_1, character_1, messages_1, Scanner;
    var __moduleName = context_1 && context_1.id;
    function hexValue(ch) {
        return '0123456789abcdef'.indexOf(ch.toLowerCase());
    }
    function octalValue(ch) {
        return '01234567'.indexOf(ch);
    }
    return {
        setters: [function (assert_1_1) {
            assert_1 = assert_1_1;
        }, function (character_1_1) {
            character_1 = character_1_1;
        }, function (messages_1_1) {
            messages_1 = messages_1_1;
        }],
        execute: function () {
            Scanner = function () {
                function Scanner(code, handler) {
                    this.source = code;
                    this.errorHandler = handler;
                    this.trackComment = false;
                    this.length = code.length;
                    this.index = 0;
                    this.lineNumber = code.length > 0 ? 1 : 0;
                    this.lineStart = 0;
                    this.curlyStack = [];
                }
                Scanner.prototype.saveState = function () {
                    return {
                        index: this.index,
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart
                    };
                };
                Scanner.prototype.restoreState = function (state) {
                    this.index = state.index;
                    this.lineNumber = state.lineNumber;
                    this.lineStart = state.lineStart;
                };
                Scanner.prototype.eof = function () {
                    return this.index >= this.length;
                };
                Scanner.prototype.throwUnexpectedToken = function (message) {
                    if (message === void 0) {
                        message = messages_1.Messages.UnexpectedTokenIllegal;
                    }
                    return this.errorHandler.throwError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
                };
                Scanner.prototype.tolerateUnexpectedToken = function (message) {
                    if (message === void 0) {
                        message = messages_1.Messages.UnexpectedTokenIllegal;
                    }
                    this.errorHandler.tolerateError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
                };
                Scanner.prototype.skipSingleLineComment = function (offset) {
                    var comments = [];
                    var start, loc;
                    if (this.trackComment) {
                        comments = [];
                        start = this.index - offset;
                        loc = {
                            start: {
                                line: this.lineNumber,
                                column: this.index - this.lineStart - offset
                            },
                            end: {}
                        };
                    }
                    while (!this.eof()) {
                        var ch = this.source.charCodeAt(this.index);
                        ++this.index;
                        if (character_1.Character.isLineTerminator(ch)) {
                            if (this.trackComment) {
                                loc.end = {
                                    line: this.lineNumber,
                                    column: this.index - this.lineStart - 1
                                };
                                var entry = {
                                    multiLine: false,
                                    slice: [start + offset, this.index - 1],
                                    range: [start, this.index - 1],
                                    loc: loc
                                };
                                comments.push(entry);
                            }
                            if (ch === 13 && this.source.charCodeAt(this.index) === 10) {
                                ++this.index;
                            }
                            ++this.lineNumber;
                            this.lineStart = this.index;
                            return comments;
                        }
                    }
                    if (this.trackComment) {
                        loc.end = {
                            line: this.lineNumber,
                            column: this.index - this.lineStart
                        };
                        var entry = {
                            multiLine: false,
                            slice: [start + offset, this.index],
                            range: [start, this.index],
                            loc: loc
                        };
                        comments.push(entry);
                    }
                    return comments;
                };
                Scanner.prototype.skipMultiLineComment = function () {
                    var comments = [];
                    var start, loc;
                    if (this.trackComment) {
                        comments = [];
                        start = this.index - 2;
                        loc = {
                            start: {
                                line: this.lineNumber,
                                column: this.index - this.lineStart - 2
                            },
                            end: {}
                        };
                    }
                    while (!this.eof()) {
                        var ch = this.source.charCodeAt(this.index);
                        if (character_1.Character.isLineTerminator(ch)) {
                            if (ch === 0x0D && this.source.charCodeAt(this.index + 1) === 0x0A) {
                                ++this.index;
                            }
                            ++this.lineNumber;
                            ++this.index;
                            this.lineStart = this.index;
                        } else if (ch === 0x2A) {
                            if (this.source.charCodeAt(this.index + 1) === 0x2F) {
                                this.index += 2;
                                if (this.trackComment) {
                                    loc.end = {
                                        line: this.lineNumber,
                                        column: this.index - this.lineStart
                                    };
                                    var entry = {
                                        multiLine: true,
                                        slice: [start + 2, this.index - 2],
                                        range: [start, this.index],
                                        loc: loc
                                    };
                                    comments.push(entry);
                                }
                                return comments;
                            }
                            ++this.index;
                        } else {
                            ++this.index;
                        }
                    }
                    if (this.trackComment) {
                        loc.end = {
                            line: this.lineNumber,
                            column: this.index - this.lineStart
                        };
                        var entry = {
                            multiLine: true,
                            slice: [start + 2, this.index],
                            range: [start, this.index],
                            loc: loc
                        };
                        comments.push(entry);
                    }
                    this.tolerateUnexpectedToken();
                    return comments;
                };
                Scanner.prototype.scanComments = function () {
                    var comments;
                    if (this.trackComment) {
                        comments = [];
                    }
                    var start = this.index === 0;
                    while (!this.eof()) {
                        var ch = this.source.charCodeAt(this.index);
                        if (character_1.Character.isWhiteSpace(ch)) {
                            ++this.index;
                        } else if (character_1.Character.isLineTerminator(ch)) {
                            ++this.index;
                            if (ch === 0x0D && this.source.charCodeAt(this.index) === 0x0A) {
                                ++this.index;
                            }
                            ++this.lineNumber;
                            this.lineStart = this.index;
                            start = true;
                        } else if (ch === 0x2F) {
                            ch = this.source.charCodeAt(this.index + 1);
                            if (ch === 0x2F) {
                                this.index += 2;
                                var comment = this.skipSingleLineComment(2);
                                if (this.trackComment) {
                                    comments = comments.concat(comment);
                                }
                                start = true;
                            } else if (ch === 0x2A) {
                                this.index += 2;
                                var comment = this.skipMultiLineComment();
                                if (this.trackComment) {
                                    comments = comments.concat(comment);
                                }
                            } else {
                                break;
                            }
                        } else if (start && ch === 0x2D) {
                            if (this.source.charCodeAt(this.index + 1) === 0x2D && this.source.charCodeAt(this.index + 2) === 0x3E) {
                                this.index += 3;
                                var comment = this.skipSingleLineComment(3);
                                if (this.trackComment) {
                                    comments = comments.concat(comment);
                                }
                            } else {
                                break;
                            }
                        } else if (ch === 0x3C) {
                            if (this.source.slice(this.index + 1, this.index + 4) === '!--') {
                                this.index += 4;
                                var comment = this.skipSingleLineComment(4);
                                if (this.trackComment) {
                                    comments = comments.concat(comment);
                                }
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    return comments;
                };
                Scanner.prototype.isFutureReservedWord = function (id) {
                    switch (id) {
                        case 'enum':
                        case 'export':
                        case 'import':
                        case 'super':
                            return true;
                        default:
                            return false;
                    }
                };
                Scanner.prototype.isStrictModeReservedWord = function (id) {
                    switch (id) {
                        case 'implements':
                        case 'interface':
                        case 'package':
                        case 'private':
                        case 'protected':
                        case 'public':
                        case 'static':
                        case 'yield':
                        case 'let':
                            return true;
                        default:
                            return false;
                    }
                };
                Scanner.prototype.isRestrictedWord = function (id) {
                    return id === 'eval' || id === 'arguments';
                };
                Scanner.prototype.isKeyword = function (id) {
                    switch (id.length) {
                        case 2:
                            return id === 'if' || id === 'in' || id === 'do';
                        case 3:
                            return id === 'var' || id === 'for' || id === 'new' || id === 'try' || id === 'let';
                        case 4:
                            return id === 'this' || id === 'else' || id === 'case' || id === 'void' || id === 'with' || id === 'enum';
                        case 5:
                            return id === 'while' || id === 'break' || id === 'catch' || id === 'throw' || id === 'const' || id === 'yield' || id === 'class' || id === 'super';
                        case 6:
                            return id === 'return' || id === 'typeof' || id === 'delete' || id === 'switch' || id === 'export' || id === 'import';
                        case 7:
                            return id === 'default' || id === 'finally' || id === 'extends';
                        case 8:
                            return id === 'function' || id === 'continue' || id === 'debugger';
                        case 10:
                            return id === 'instanceof';
                        default:
                            return false;
                    }
                };
                Scanner.prototype.codePointAt = function (i) {
                    var cp = this.source.charCodeAt(i);
                    if (cp >= 0xD800 && cp <= 0xDBFF) {
                        var second = this.source.charCodeAt(i + 1);
                        if (second >= 0xDC00 && second <= 0xDFFF) {
                            var first = cp;
                            cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
                        }
                    }
                    return cp;
                };
                Scanner.prototype.scanHexEscape = function (prefix) {
                    var len = prefix === 'u' ? 4 : 2;
                    var code = 0;
                    for (var i = 0; i < len; ++i) {
                        if (!this.eof() && character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
                            code = code * 16 + hexValue(this.source[this.index++]);
                        } else {
                            return null;
                        }
                    }
                    return String.fromCharCode(code);
                };
                Scanner.prototype.scanUnicodeCodePointEscape = function () {
                    var ch = this.source[this.index];
                    var code = 0;
                    if (ch === '}') {
                        this.throwUnexpectedToken();
                    }
                    while (!this.eof()) {
                        ch = this.source[this.index++];
                        if (!character_1.Character.isHexDigit(ch.charCodeAt(0))) {
                            break;
                        }
                        code = code * 16 + hexValue(ch);
                    }
                    if (code > 0x10FFFF || ch !== '}') {
                        this.throwUnexpectedToken();
                    }
                    return character_1.Character.fromCodePoint(code);
                };
                Scanner.prototype.getIdentifier = function () {
                    var start = this.index++;
                    while (!this.eof()) {
                        var ch = this.source.charCodeAt(this.index);
                        if (ch === 0x5C) {
                            this.index = start;
                            return this.getComplexIdentifier();
                        } else if (ch >= 0xD800 && ch < 0xDFFF) {
                            this.index = start;
                            return this.getComplexIdentifier();
                        }
                        if (character_1.Character.isIdentifierPart(ch)) {
                            ++this.index;
                        } else {
                            break;
                        }
                    }
                    return this.source.slice(start, this.index);
                };
                Scanner.prototype.getComplexIdentifier = function () {
                    var cp = this.codePointAt(this.index);
                    var id = character_1.Character.fromCodePoint(cp);
                    this.index += id.length;
                    var ch;
                    if (cp === 0x5C) {
                        if (this.source.charCodeAt(this.index) !== 0x75) {
                            this.throwUnexpectedToken();
                        }
                        ++this.index;
                        if (this.source[this.index] === '{') {
                            ++this.index;
                            ch = this.scanUnicodeCodePointEscape();
                        } else {
                            ch = this.scanHexEscape('u');
                            if (ch === null || ch === '\\' || !character_1.Character.isIdentifierStart(ch.charCodeAt(0))) {
                                this.throwUnexpectedToken();
                            }
                        }
                        id = ch;
                    }
                    while (!this.eof()) {
                        cp = this.codePointAt(this.index);
                        if (!character_1.Character.isIdentifierPart(cp)) {
                            break;
                        }
                        ch = character_1.Character.fromCodePoint(cp);
                        id += ch;
                        this.index += ch.length;
                        if (cp === 0x5C) {
                            id = id.substr(0, id.length - 1);
                            if (this.source.charCodeAt(this.index) !== 0x75) {
                                this.throwUnexpectedToken();
                            }
                            ++this.index;
                            if (this.source[this.index] === '{') {
                                ++this.index;
                                ch = this.scanUnicodeCodePointEscape();
                            } else {
                                ch = this.scanHexEscape('u');
                                if (ch === null || ch === '\\' || !character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
                                    this.throwUnexpectedToken();
                                }
                            }
                            id += ch;
                        }
                    }
                    return id;
                };
                Scanner.prototype.octalToDecimal = function (ch) {
                    var octal = ch !== '0';
                    var code = octalValue(ch);
                    if (!this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
                        octal = true;
                        code = code * 8 + octalValue(this.source[this.index++]);
                        if ('0123'.indexOf(ch) >= 0 && !this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
                            code = code * 8 + octalValue(this.source[this.index++]);
                        }
                    }
                    return {
                        code: code,
                        octal: octal
                    };
                };
                Scanner.prototype.scanIdentifier = function () {
                    var type;
                    var start = this.index;
                    var id = this.source.charCodeAt(start) === 0x5C ? this.getComplexIdentifier() : this.getIdentifier();
                    if (id.length === 1) {
                        type = 3;
                    } else if (this.isKeyword(id)) {
                        type = 4;
                    } else if (id === 'null') {
                        type = 5;
                    } else if (id === 'true' || id === 'false') {
                        type = 1;
                    } else {
                        type = 3;
                    }
                    if (type !== 3 && start + id.length !== this.index) {
                        var restore = this.index;
                        this.index = start;
                        this.tolerateUnexpectedToken(messages_1.Messages.InvalidEscapedReservedWord);
                        this.index = restore;
                    }
                    return {
                        type: type,
                        value: id,
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.scanPunctuator = function () {
                    var start = this.index;
                    var str = this.source[this.index];
                    switch (str) {
                        case '(':
                        case '{':
                            if (str === '{') {
                                this.curlyStack.push('{');
                            }
                            ++this.index;
                            break;
                        case '.':
                            ++this.index;
                            if (this.source[this.index] === '.' && this.source[this.index + 1] === '.') {
                                this.index += 2;
                                str = '...';
                            }
                            break;
                        case '}':
                            ++this.index;
                            this.curlyStack.pop();
                            break;
                        case ')':
                        case ';':
                        case ',':
                        case '[':
                        case ']':
                        case ':':
                        case '?':
                        case '~':
                            ++this.index;
                            break;
                        default:
                            str = this.source.substr(this.index, 4);
                            if (str === '>>>=') {
                                this.index += 4;
                            } else {
                                str = str.substr(0, 3);
                                if (str === '===' || str === '!==' || str === '>>>' || str === '<<=' || str === '>>=' || str === '**=') {
                                    this.index += 3;
                                } else {
                                    str = str.substr(0, 2);
                                    if (str === '&&' || str === '||' || str === '==' || str === '!=' || str === '+=' || str === '-=' || str === '*=' || str === '/=' || str === '++' || str === '--' || str === '<<' || str === '>>' || str === '&=' || str === '|=' || str === '^=' || str === '%=' || str === '<=' || str === '>=' || str === '=>' || str === '**') {
                                        this.index += 2;
                                    } else {
                                        str = this.source[this.index];
                                        if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
                                            ++this.index;
                                        }
                                    }
                                }
                            }
                    }
                    if (this.index === start) {
                        this.throwUnexpectedToken();
                    }
                    return {
                        type: 7,
                        value: str,
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.scanHexLiteral = function (start) {
                    var num = '';
                    while (!this.eof()) {
                        if (!character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
                            break;
                        }
                        num += this.source[this.index++];
                    }
                    if (num.length === 0) {
                        this.throwUnexpectedToken();
                    }
                    if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
                        this.throwUnexpectedToken();
                    }
                    return {
                        type: 6,
                        value: parseInt('0x' + num, 16),
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.scanBinaryLiteral = function (start) {
                    var num = '';
                    var ch;
                    while (!this.eof()) {
                        ch = this.source[this.index];
                        if (ch !== '0' && ch !== '1') {
                            break;
                        }
                        num += this.source[this.index++];
                    }
                    if (num.length === 0) {
                        this.throwUnexpectedToken();
                    }
                    if (!this.eof()) {
                        ch = this.source.charCodeAt(this.index);
                        if (character_1.Character.isIdentifierStart(ch) || character_1.Character.isDecimalDigit(ch)) {
                            this.throwUnexpectedToken();
                        }
                    }
                    return {
                        type: 6,
                        value: parseInt(num, 2),
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.scanOctalLiteral = function (prefix, start) {
                    var num = '';
                    var octal = false;
                    if (character_1.Character.isOctalDigit(prefix.charCodeAt(0))) {
                        octal = true;
                        num = '0' + this.source[this.index++];
                    } else {
                        ++this.index;
                    }
                    while (!this.eof()) {
                        if (!character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
                            break;
                        }
                        num += this.source[this.index++];
                    }
                    if (!octal && num.length === 0) {
                        this.throwUnexpectedToken();
                    }
                    if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index)) || character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
                        this.throwUnexpectedToken();
                    }
                    return {
                        type: 6,
                        value: parseInt(num, 8),
                        octal: octal,
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.isImplicitOctalLiteral = function () {
                    for (var i = this.index + 1; i < this.length; ++i) {
                        var ch = this.source[i];
                        if (ch === '8' || ch === '9') {
                            return false;
                        }
                        if (!character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
                            return true;
                        }
                    }
                    return true;
                };
                Scanner.prototype.scanNumericLiteral = function () {
                    var start = this.index;
                    var ch = this.source[start];
                    assert_1.assert(character_1.Character.isDecimalDigit(ch.charCodeAt(0)) || ch === '.', 'Numeric literal must start with a decimal digit or a decimal point');
                    var num = '';
                    if (ch !== '.') {
                        num = this.source[this.index++];
                        ch = this.source[this.index];
                        if (num === '0') {
                            if (ch === 'x' || ch === 'X') {
                                ++this.index;
                                return this.scanHexLiteral(start);
                            }
                            if (ch === 'b' || ch === 'B') {
                                ++this.index;
                                return this.scanBinaryLiteral(start);
                            }
                            if (ch === 'o' || ch === 'O') {
                                return this.scanOctalLiteral(ch, start);
                            }
                            if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
                                if (this.isImplicitOctalLiteral()) {
                                    return this.scanOctalLiteral(ch, start);
                                }
                            }
                        }
                        while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
                            num += this.source[this.index++];
                        }
                        ch = this.source[this.index];
                    }
                    if (ch === '.') {
                        num += this.source[this.index++];
                        while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
                            num += this.source[this.index++];
                        }
                        ch = this.source[this.index];
                    }
                    if (ch === 'e' || ch === 'E') {
                        num += this.source[this.index++];
                        ch = this.source[this.index];
                        if (ch === '+' || ch === '-') {
                            num += this.source[this.index++];
                        }
                        if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
                            while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
                                num += this.source[this.index++];
                            }
                        } else {
                            this.throwUnexpectedToken();
                        }
                    }
                    if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
                        this.throwUnexpectedToken();
                    }
                    return {
                        type: 6,
                        value: parseFloat(num),
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.scanStringLiteral = function () {
                    var start = this.index;
                    var quote = this.source[start];
                    assert_1.assert(quote === '\'' || quote === '"', 'String literal must starts with a quote');
                    ++this.index;
                    var octal = false;
                    var str = '';
                    while (!this.eof()) {
                        var ch = this.source[this.index++];
                        if (ch === quote) {
                            quote = '';
                            break;
                        } else if (ch === '\\') {
                            ch = this.source[this.index++];
                            if (!ch || !character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
                                switch (ch) {
                                    case 'u':
                                        if (this.source[this.index] === '{') {
                                            ++this.index;
                                            str += this.scanUnicodeCodePointEscape();
                                        } else {
                                            var unescaped_1 = this.scanHexEscape(ch);
                                            if (unescaped_1 === null) {
                                                this.throwUnexpectedToken();
                                            }
                                            str += unescaped_1;
                                        }
                                        break;
                                    case 'x':
                                        var unescaped = this.scanHexEscape(ch);
                                        if (unescaped === null) {
                                            this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
                                        }
                                        str += unescaped;
                                        break;
                                    case 'n':
                                        str += '\n';
                                        break;
                                    case 'r':
                                        str += '\r';
                                        break;
                                    case 't':
                                        str += '\t';
                                        break;
                                    case 'b':
                                        str += '\b';
                                        break;
                                    case 'f':
                                        str += '\f';
                                        break;
                                    case 'v':
                                        str += '\x0B';
                                        break;
                                    case '8':
                                    case '9':
                                        str += ch;
                                        this.tolerateUnexpectedToken();
                                        break;
                                    default:
                                        if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
                                            var octToDec = this.octalToDecimal(ch);
                                            octal = octToDec.octal || octal;
                                            str += String.fromCharCode(octToDec.code);
                                        } else {
                                            str += ch;
                                        }
                                        break;
                                }
                            } else {
                                ++this.lineNumber;
                                if (ch === '\r' && this.source[this.index] === '\n') {
                                    ++this.index;
                                }
                                this.lineStart = this.index;
                            }
                        } else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
                            break;
                        } else {
                            str += ch;
                        }
                    }
                    if (quote !== '') {
                        this.index = start;
                        this.throwUnexpectedToken();
                    }
                    return {
                        type: 8,
                        value: str,
                        octal: octal,
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.scanTemplate = function () {
                    var cooked = '';
                    var terminated = false;
                    var start = this.index;
                    var head = this.source[start] === '`';
                    var tail = false;
                    var rawOffset = 2;
                    ++this.index;
                    while (!this.eof()) {
                        var ch = this.source[this.index++];
                        if (ch === '`') {
                            rawOffset = 1;
                            tail = true;
                            terminated = true;
                            break;
                        } else if (ch === '$') {
                            if (this.source[this.index] === '{') {
                                this.curlyStack.push('${');
                                ++this.index;
                                terminated = true;
                                break;
                            }
                            cooked += ch;
                        } else if (ch === '\\') {
                            ch = this.source[this.index++];
                            if (!character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
                                switch (ch) {
                                    case 'n':
                                        cooked += '\n';
                                        break;
                                    case 'r':
                                        cooked += '\r';
                                        break;
                                    case 't':
                                        cooked += '\t';
                                        break;
                                    case 'u':
                                        if (this.source[this.index] === '{') {
                                            ++this.index;
                                            cooked += this.scanUnicodeCodePointEscape();
                                        } else {
                                            var restore = this.index;
                                            var unescaped_2 = this.scanHexEscape(ch);
                                            if (unescaped_2 !== null) {
                                                cooked += unescaped_2;
                                            } else {
                                                this.index = restore;
                                                cooked += ch;
                                            }
                                        }
                                        break;
                                    case 'x':
                                        var unescaped = this.scanHexEscape(ch);
                                        if (unescaped === null) {
                                            this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
                                        }
                                        cooked += unescaped;
                                        break;
                                    case 'b':
                                        cooked += '\b';
                                        break;
                                    case 'f':
                                        cooked += '\f';
                                        break;
                                    case 'v':
                                        cooked += '\v';
                                        break;
                                    default:
                                        if (ch === '0') {
                                            if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
                                                this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
                                            }
                                            cooked += '\0';
                                        } else if (character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
                                            this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
                                        } else {
                                            cooked += ch;
                                        }
                                        break;
                                }
                            } else {
                                ++this.lineNumber;
                                if (ch === '\r' && this.source[this.index] === '\n') {
                                    ++this.index;
                                }
                                this.lineStart = this.index;
                            }
                        } else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
                            ++this.lineNumber;
                            if (ch === '\r' && this.source[this.index] === '\n') {
                                ++this.index;
                            }
                            this.lineStart = this.index;
                            cooked += '\n';
                        } else {
                            cooked += ch;
                        }
                    }
                    if (!terminated) {
                        this.throwUnexpectedToken();
                    }
                    if (!head) {
                        this.curlyStack.pop();
                    }
                    return {
                        type: 10,
                        value: this.source.slice(start + 1, this.index - rawOffset),
                        cooked: cooked,
                        head: head,
                        tail: tail,
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.testRegExp = function (pattern, flags) {
                    var astralSubstitute = '\uFFFF';
                    var tmp = pattern;
                    var self = this;
                    if (flags.indexOf('u') >= 0) {
                        tmp = tmp.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function (_$0, $1, $2) {
                            var codePoint = parseInt($1 || $2, 16);
                            if (codePoint > 0x10FFFF) {
                                self.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
                            }
                            if (codePoint <= 0xFFFF) {
                                return String.fromCharCode(codePoint);
                            }
                            return astralSubstitute;
                        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, astralSubstitute);
                    }
                    try {
                        RegExp(tmp);
                    } catch (e) {
                        this.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
                    }
                    try {
                        return new RegExp(pattern, flags);
                    } catch (exception) {
                        return null;
                    }
                };
                Scanner.prototype.scanRegExpBody = function () {
                    var ch = this.source[this.index];
                    assert_1.assert(ch === '/', 'Regular expression literal must start with a slash');
                    var str = this.source[this.index++];
                    var classMarker = false;
                    var terminated = false;
                    while (!this.eof()) {
                        ch = this.source[this.index++];
                        str += ch;
                        if (ch === '\\') {
                            ch = this.source[this.index++];
                            if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
                                this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
                            }
                            str += ch;
                        } else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
                            this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
                        } else if (classMarker) {
                            if (ch === ']') {
                                classMarker = false;
                            }
                        } else {
                            if (ch === '/') {
                                terminated = true;
                                break;
                            } else if (ch === '[') {
                                classMarker = true;
                            }
                        }
                    }
                    if (!terminated) {
                        this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
                    }
                    return str.substr(1, str.length - 2);
                };
                Scanner.prototype.scanRegExpFlags = function () {
                    var str = '';
                    var flags = '';
                    while (!this.eof()) {
                        var ch = this.source[this.index];
                        if (!character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
                            break;
                        }
                        ++this.index;
                        if (ch === '\\' && !this.eof()) {
                            ch = this.source[this.index];
                            if (ch === 'u') {
                                ++this.index;
                                var restore = this.index;
                                var char = this.scanHexEscape('u');
                                if (char !== null) {
                                    flags += char;
                                    for (str += '\\u'; restore < this.index; ++restore) {
                                        str += this.source[restore];
                                    }
                                } else {
                                    this.index = restore;
                                    flags += 'u';
                                    str += '\\u';
                                }
                                this.tolerateUnexpectedToken();
                            } else {
                                str += '\\';
                                this.tolerateUnexpectedToken();
                            }
                        } else {
                            flags += ch;
                            str += ch;
                        }
                    }
                    return flags;
                };
                Scanner.prototype.scanRegExp = function () {
                    var start = this.index;
                    var pattern = this.scanRegExpBody();
                    var flags = this.scanRegExpFlags();
                    var value = this.testRegExp(pattern, flags);
                    return {
                        type: 9,
                        value: '',
                        pattern: pattern,
                        flags: flags,
                        regex: value,
                        lineNumber: this.lineNumber,
                        lineStart: this.lineStart,
                        start: start,
                        end: this.index
                    };
                };
                Scanner.prototype.lex = function () {
                    if (this.eof()) {
                        return {
                            type: 2,
                            value: '',
                            lineNumber: this.lineNumber,
                            lineStart: this.lineStart,
                            start: this.index,
                            end: this.index
                        };
                    }
                    var cp = this.source.charCodeAt(this.index);
                    if (character_1.Character.isIdentifierStart(cp)) {
                        return this.scanIdentifier();
                    }
                    if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
                        return this.scanPunctuator();
                    }
                    if (cp === 0x27 || cp === 0x22) {
                        return this.scanStringLiteral();
                    }
                    if (cp === 0x2E) {
                        if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index + 1))) {
                            return this.scanNumericLiteral();
                        }
                        return this.scanPunctuator();
                    }
                    if (character_1.Character.isDecimalDigit(cp)) {
                        return this.scanNumericLiteral();
                    }
                    if (cp === 0x60 || cp === 0x7D && this.curlyStack[this.curlyStack.length - 1] === '${') {
                        return this.scanTemplate();
                    }
                    if (cp >= 0xD800 && cp < 0xDFFF) {
                        if (character_1.Character.isIdentifierStart(this.codePointAt(this.index))) {
                            return this.scanIdentifier();
                        }
                    }
                    return this.scanPunctuator();
                };
                return Scanner;
            }();
            exports_1("Scanner", Scanner);
        }
    };
});
System.register("token.js", [], function (exports_1, context_1) {
    "use strict";

    var TokenName;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ;
            exports_1("TokenName", TokenName = {});
            TokenName[1] = 'Boolean';
            TokenName[2] = '<end>';
            TokenName[3] = 'Identifier';
            TokenName[4] = 'Keyword';
            TokenName[5] = 'Null';
            TokenName[6] = 'Numeric';
            TokenName[7] = 'Punctuator';
            TokenName[8] = 'String';
            TokenName[9] = 'RegularExpression';
            TokenName[10] = 'Template';
        }
    };
});
System.register("tokenizer.js", ["./error-handler", "./scanner", "./token"], function (exports_1, context_1) {
    "use strict";

    var error_handler_1, scanner_1, token_1, Reader, Tokenizer;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [function (error_handler_1_1) {
            error_handler_1 = error_handler_1_1;
        }, function (scanner_1_1) {
            scanner_1 = scanner_1_1;
        }, function (token_1_1) {
            token_1 = token_1_1;
        }],
        execute: function () {
            Reader = function () {
                function Reader() {
                    this.values = [];
                    this.curly = this.paren = -1;
                }
                Reader.prototype.beforeFunctionExpression = function (t) {
                    return ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new', 'return', 'case', 'delete', 'throw', 'void', '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', ',', '+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&', '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=', '<=', '<', '>', '!=', '!=='].indexOf(t) >= 0;
                };
                Reader.prototype.isRegexStart = function () {
                    var previous = this.values[this.values.length - 1];
                    var regex = previous !== null;
                    switch (previous) {
                        case 'this':
                        case ']':
                            regex = false;
                            break;
                        case ')':
                            var keyword = this.values[this.paren - 1];
                            regex = keyword === 'if' || keyword === 'while' || keyword === 'for' || keyword === 'with';
                            break;
                        case '}':
                            regex = false;
                            if (this.values[this.curly - 3] === 'function') {
                                var check = this.values[this.curly - 4];
                                regex = check ? !this.beforeFunctionExpression(check) : false;
                            } else if (this.values[this.curly - 4] === 'function') {
                                var check = this.values[this.curly - 5];
                                regex = check ? !this.beforeFunctionExpression(check) : true;
                            }
                            break;
                        default:
                            break;
                    }
                    return regex;
                };
                Reader.prototype.push = function (token) {
                    if (token.type === 7 || token.type === 4) {
                        if (token.value === '{') {
                            this.curly = this.values.length;
                        } else if (token.value === '(') {
                            this.paren = this.values.length;
                        }
                        this.values.push(token.value);
                    } else {
                        this.values.push(null);
                    }
                };
                return Reader;
            }();
            Tokenizer = function () {
                function Tokenizer(code, config) {
                    this.errorHandler = new error_handler_1.ErrorHandler();
                    this.errorHandler.tolerant = config ? typeof config.tolerant === 'boolean' && config.tolerant : false;
                    this.scanner = new scanner_1.Scanner(code, this.errorHandler);
                    this.scanner.trackComment = config ? typeof config.comment === 'boolean' && config.comment : false;
                    this.trackRange = config ? typeof config.range === 'boolean' && config.range : false;
                    this.trackLoc = config ? typeof config.loc === 'boolean' && config.loc : false;
                    this.buffer = [];
                    this.reader = new Reader();
                }
                Tokenizer.prototype.errors = function () {
                    return this.errorHandler.errors;
                };
                Tokenizer.prototype.getNextToken = function () {
                    if (this.buffer.length === 0) {
                        var comments = this.scanner.scanComments();
                        if (this.scanner.trackComment) {
                            for (var i = 0; i < comments.length; ++i) {
                                var e = comments[i];
                                var value = this.scanner.source.slice(e.slice[0], e.slice[1]);
                                var comment = {
                                    type: e.multiLine ? 'BlockComment' : 'LineComment',
                                    value: value
                                };
                                if (this.trackRange) {
                                    comment.range = e.range;
                                }
                                if (this.trackLoc) {
                                    comment.loc = e.loc;
                                }
                                this.buffer.push(comment);
                            }
                        }
                        if (!this.scanner.eof()) {
                            var loc = void 0;
                            if (this.trackLoc) {
                                loc = {
                                    start: {
                                        line: this.scanner.lineNumber,
                                        column: this.scanner.index - this.scanner.lineStart
                                    },
                                    end: {}
                                };
                            }
                            var startRegex = this.scanner.source[this.scanner.index] === '/' && this.reader.isRegexStart();
                            var token = startRegex ? this.scanner.scanRegExp() : this.scanner.lex();
                            this.reader.push(token);
                            var entry = {
                                type: token_1.TokenName[token.type],
                                value: this.scanner.source.slice(token.start, token.end)
                            };
                            if (this.trackRange) {
                                entry.range = [token.start, token.end];
                            }
                            if (this.trackLoc) {
                                loc.end = {
                                    line: this.scanner.lineNumber,
                                    column: this.scanner.index - this.scanner.lineStart
                                };
                                entry.loc = loc;
                            }
                            if (token.type === 9) {
                                var pattern = token.pattern;
                                var flags = token.flags;
                                entry.regex = { pattern: pattern, flags: flags };
                            }
                            this.buffer.push(entry);
                        }
                    }
                    return this.buffer.shift();
                };
                return Tokenizer;
            }();
            exports_1("Tokenizer", Tokenizer);
        }
    };
});
System.register("esprima.js", ["./comment-handler", "./jsx-parser", "./parser", "./tokenizer", "./syntax"], function (exports_1, context_1) {
    "use strict";

    var comment_handler_1, jsx_parser_1, parser_1, tokenizer_1, version;
    var __moduleName = context_1 && context_1.id;
    function parse(code, options, delegate) {
        var commentHandler = null;
        var proxyDelegate = function (node, metadata) {
            if (delegate) {
                delegate(node, metadata);
            }
            if (commentHandler) {
                commentHandler.visit(node, metadata);
            }
        };
        var parserDelegate = typeof delegate === 'function' ? proxyDelegate : null;
        var collectComment = false;
        if (options) {
            collectComment = typeof options.comment === 'boolean' && options.comment;
            var attachComment = typeof options.attachComment === 'boolean' && options.attachComment;
            if (collectComment || attachComment) {
                commentHandler = new comment_handler_1.CommentHandler();
                commentHandler.attach = attachComment;
                options.comment = true;
                parserDelegate = proxyDelegate;
            }
        }
        var isModule = false;
        if (options && typeof options.sourceType === 'string') {
            isModule = options.sourceType === 'module';
        }
        var parser;
        if (options && typeof options.jsx === 'boolean' && options.jsx) {
            parser = new jsx_parser_1.JSXParser(code, options, parserDelegate);
        } else {
            parser = new parser_1.Parser(code, options, parserDelegate);
        }
        var program = isModule ? parser.parseModule() : parser.parseScript();
        if (collectComment && commentHandler) {
            program.comments = commentHandler.comments;
        }
        if (parser.config.tokens) {
            program.tokens = parser.tokens;
        }
        if (parser.config.tolerant) {
            program.errors = parser.errorHandler.errors;
        }
        return program;
    }
    exports_1("parse", parse);
    function parseModule(code, options, delegate) {
        if (options === void 0) {
            options = {};
        }
        options.sourceType = 'module';
        return parse(code, options, delegate);
    }
    exports_1("parseModule", parseModule);
    function parseScript(code, options, delegate) {
        if (options === void 0) {
            options = {};
        }
        options.sourceType = 'script';
        return parse(code, options, delegate);
    }
    exports_1("parseScript", parseScript);
    function tokenize(code, options, delegate) {
        var tokenizer = new tokenizer_1.Tokenizer(code, options);
        var tokens = [];
        try {
            while (true) {
                var token = tokenizer.getNextToken();
                if (!token) {
                    break;
                }
                if (delegate) {
                    token = delegate(token);
                }
                tokens.push(token);
            }
        } catch (e) {
            tokenizer.errorHandler.tolerate(e);
        }
        if (tokenizer.errorHandler.tolerant) {
            tokens['errors'] = tokenizer.errors();
        }
        return tokens;
    }
    exports_1("tokenize", tokenize);
    return {
        setters: [function (comment_handler_1_1) {
            comment_handler_1 = comment_handler_1_1;
        }, function (jsx_parser_1_1) {
            jsx_parser_1 = jsx_parser_1_1;
        }, function (parser_1_1) {
            parser_1 = parser_1_1;
        }, function (tokenizer_1_1) {
            tokenizer_1 = tokenizer_1_1;
        }, function (syntax_1_1) {
            exports_1({
                "Syntax": syntax_1_1["Syntax"]
            });
        }],
        execute: function () {
            exports_1("version", version = '1.1.2');
        }
    };
});
System.register("getLoopProtectorBlocks.js", ["./esprima"], function (exports_1, context_1) {
    "use strict";

    var esprima_1;
    var __moduleName = context_1 && context_1.id;
    function getLoopProtectorBlocks(varName, timeout) {
        var ast1 = esprima_1.parse("var " + varName + " = Date.now()");
        var ast2 = esprima_1.parse("if (Date.now() - " + varName + " > " + timeout + ") {throw new Error(\"Infinite loop suspected after " + timeout + " milliseconds.\")}");
        return {
            before: ast1.body[0],
            inside: ast2.body[0]
        };
    }
    exports_1("getLoopProtectorBlocks", getLoopProtectorBlocks);
    return {
        setters: [function (esprima_1_1) {
            esprima_1 = esprima_1_1;
        }],
        execute: function () {}
    };
});
System.register("syntax.js", [], function (exports_1, context_1) {
    "use strict";

    var Syntax;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
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
                ConditionalExpression: 'ConditionalExpression',
                ContinueStatement: 'ContinueStatement',
                DoWhileStatement: 'DoWhileStatement',
                DebuggerStatement: 'DebuggerStatement',
                EmptyStatement: 'EmptyStatement',
                ExportAllDeclaration: 'ExportAllDeclaration',
                ExportDefaultDeclaration: 'ExportDefaultDeclaration',
                ExportNamedDeclaration: 'ExportNamedDeclaration',
                ExportSpecifier: 'ExportSpecifier',
                ExpressionStatement: 'ExpressionStatement',
                ForStatement: 'ForStatement',
                ForOfStatement: 'ForOfStatement',
                ForInStatement: 'ForInStatement',
                FunctionDeclaration: 'FunctionDeclaration',
                FunctionExpression: 'FunctionExpression',
                Identifier: 'Identifier',
                IfStatement: 'IfStatement',
                Import: 'Import',
                ImportDeclaration: 'ImportDeclaration',
                ImportDefaultSpecifier: 'ImportDefaultSpecifier',
                ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
                ImportSpecifier: 'ImportSpecifier',
                Literal: 'Literal',
                LabeledStatement: 'LabeledStatement',
                LogicalExpression: 'LogicalExpression',
                MemberExpression: 'MemberExpression',
                MetaProperty: 'MetaProperty',
                MethodDefinition: 'MethodDefinition',
                NewExpression: 'NewExpression',
                ObjectExpression: 'ObjectExpression',
                ObjectPattern: 'ObjectPattern',
                Program: 'Program',
                Property: 'Property',
                RestElement: 'RestElement',
                RestProperty: 'RestProperty',
                ReturnStatement: 'ReturnStatement',
                SequenceExpression: 'SequenceExpression',
                SpreadElement: 'SpreadElement',
                SpreadProperty: 'SpreadProperty',
                Super: 'Super',
                SwitchCase: 'SwitchCase',
                SwitchStatement: 'SwitchStatement',
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
        }
    };
});
System.register("davinci-mathscript.js", ["./core", "./esprima", "./escodegen", "./generateRandomId", "./getLoopProtectorBlocks", "./syntax"], function (exports_1, context_1) {
    "use strict";

    var core_1, esprima_1, esprima_2, escodegen_1, generateRandomId_1, getLoopProtectorBlocks_1, syntax_1, MATHSCRIPT_NAMESPACE, binOp, unaryOp, Ms;
    var __moduleName = context_1 && context_1.id;
    function transpileTree(code, options) {
        if (options === void 0) {
            options = {};
        }
        var tree = esprima_1.parse(code, options, void 0);
        if (typeof options.timeout === undefined) {
            options.timeout = 1000;
        }
        visit(tree, options);
        return tree;
    }
    function transpile(code, options) {
        var tree = transpileTree(code, options);
        var codeOut = escodegen_1.generate(tree);
        return codeOut;
    }
    exports_1("transpile", transpile);
    function addInfiniteLoopProtection(statements, millis) {
        for (var i = statements.length; i--;) {
            var el = statements[i];
            if (el && el.type === syntax_1.Syntax.ForStatement || el.type === syntax_1.Syntax.WhileStatement || el.type === syntax_1.Syntax.DoWhileStatement) {
                var loop = el;
                var randomVariableName = '_' + generateRandomId_1.generateRandomId(5);
                var insertionBlocks = getLoopProtectorBlocks_1.getLoopProtectorBlocks(randomVariableName, millis);
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
                case syntax_1.Syntax.BlockStatement:
                    {
                        var block = node;
                        if (options.noLoopCheck) {
                            block.body.forEach(function (part) {
                                visit(part, options);
                            });
                        } else {
                            var timeout = options.timeout;
                            addInfiniteLoopProtection(block.body, timeout).forEach(function (part) {
                                visit(part, options);
                            });
                        }
                        break;
                    }
                case syntax_1.Syntax.FunctionDeclaration:
                    {
                        var funcDecl = node;
                        funcDecl.params.forEach(function (param) {
                            visit(param, options);
                        });
                        visit(funcDecl.body, options);
                        break;
                    }
                case syntax_1.Syntax.Program:
                    {
                        var script = node;
                        if (options.noLoopCheck) {
                            script.body.forEach(function (node) {
                                visit(node, options);
                            });
                        } else {
                            var timeout = options.timeout;
                            addInfiniteLoopProtection(script.body, timeout).forEach(function (node) {
                                visit(node, options);
                            });
                        }
                        break;
                    }
                case syntax_1.Syntax.VariableDeclaration:
                    {
                        var varDeclaration = node;
                        varDeclaration.declarations.forEach(function (declaration) {
                            visit(declaration, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.VariableDeclarator:
                    {
                        var varDeclarator = node;
                        if (varDeclarator.init) {
                            visit(varDeclarator.init, options);
                        }
                        break;
                    }
                case syntax_1.Syntax.ConditionalExpression:
                    {
                        var condExpr = node;
                        visit(condExpr.test, options);
                        visit(condExpr.consequent, options);
                        visit(condExpr.alternate, options);
                        break;
                    }
                case syntax_1.Syntax.BinaryExpression:
                case syntax_1.Syntax.LogicalExpression:
                    {
                        var binExpr = node;
                        var callExpr = node;
                        if (options.operatorOverloading && binExpr.operator && binOp[binExpr.operator]) {
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
                        } else {
                            visit(binExpr.left, options);
                            visit(binExpr.right, options);
                        }
                        break;
                    }
                case syntax_1.Syntax.ExpressionStatement:
                    {
                        var exprStmt = node;
                        visit(exprStmt.expression, options);
                        break;
                    }
                case syntax_1.Syntax.ForStatement:
                    {
                        var forStmt = node;
                        visit(forStmt.init, options);
                        visit(forStmt.test, options);
                        visit(forStmt.update, options);
                        visit(forStmt.body, options);
                        break;
                    }
                case syntax_1.Syntax.ForInStatement:
                    {
                        var forIn = node;
                        visit(forIn.left, options);
                        visit(forIn.right, options);
                        visit(forIn.body, options);
                        break;
                    }
                case syntax_1.Syntax.IfStatement:
                    {
                        var ifStmt = node;
                        visit(ifStmt.test, options);
                        visit(ifStmt.consequent, options);
                        visit(ifStmt.alternate, options);
                        break;
                    }
                case syntax_1.Syntax.ArrayExpression:
                    {
                        var arrayExpr = node;
                        arrayExpr.elements.forEach(function (elem) {
                            visit(elem, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.AssignmentExpression:
                    {
                        var assignExpr = node;
                        if (options.operatorOverloading && assignExpr.operator && binOp[assignExpr.operator]) {
                            visit(assignExpr.left, options);
                            visit(assignExpr.right, options);
                        } else {
                            visit(assignExpr.left, options);
                            visit(assignExpr.right, options);
                        }
                        break;
                    }
                case syntax_1.Syntax.CallExpression:
                    {
                        var callExpr = node;
                        visit(callExpr.callee, options);
                        callExpr.arguments.forEach(function (argument) {
                            visit(argument, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.CatchClause:
                    {
                        var catchClause = node;
                        visit(catchClause.param, options);
                        visit(catchClause.body, options);
                        break;
                    }
                case syntax_1.Syntax.DoWhileStatement:
                    {
                        var doWhileStmt = node;
                        visit(doWhileStmt.test, options);
                        visit(doWhileStmt.body, options);
                        break;
                    }
                case syntax_1.Syntax.FunctionExpression:
                    {
                        var funcExpr = node;
                        visit(funcExpr.body, options);
                        break;
                    }
                case syntax_1.Syntax.MemberExpression:
                    {
                        var staticMemberExpr = node;
                        visit(staticMemberExpr.object, options);
                        break;
                    }
                case syntax_1.Syntax.MemberExpression:
                    {
                        var computedMemberExpr = node;
                        visit(computedMemberExpr.object, options);
                        break;
                    }
                case syntax_1.Syntax.NewExpression:
                    {
                        var newExpr = node;
                        visit(newExpr.callee, options);
                        newExpr.arguments.forEach(function (argument) {
                            visit(argument, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.ObjectExpression:
                    {
                        var objExpr = node;
                        objExpr.properties.forEach(function (prop) {
                            visit(prop, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.ReturnStatement:
                    {
                        var returnStmt = node;
                        visit(returnStmt.argument, options);
                        break;
                    }
                case syntax_1.Syntax.SequenceExpression:
                    {
                        var seqExpr = node;
                        seqExpr.expressions.forEach(function (expr) {
                            visit(expr, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.SwitchCase:
                    {
                        var switchCase = node;
                        visit(switchCase.test, options);
                        switchCase.consequent.forEach(function (expr) {
                            visit(expr, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.SwitchStatement:
                    {
                        var switchStmt = node;
                        visit(switchStmt.discriminant, options);
                        switchStmt.cases.forEach(function (kase) {
                            visit(kase, options);
                        });
                        break;
                    }
                case syntax_1.Syntax.ThrowStatement:
                    {
                        var throwStmt = node;
                        visit(throwStmt.argument, options);
                        break;
                    }
                case syntax_1.Syntax.TryStatement:
                    {
                        var tryStmt = node;
                        visit(tryStmt.block, options);
                        visit(tryStmt.handler, options);
                        visit(tryStmt.finalizer, options);
                        break;
                    }
                case syntax_1.Syntax.UnaryExpression:
                    {
                        var unaryExpr = node;
                        var callExpr = node;
                        if (options.operatorOverloading && unaryExpr.operator && unaryOp[unaryExpr.operator]) {
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
                        } else {
                            visit(unaryExpr.argument, options);
                        }
                        break;
                    }
                case syntax_1.Syntax.UpdateExpression:
                    {
                        var updateExpr = node;
                        var callExpr = node;
                        if (options.operatorOverloading && updateExpr.operator && unaryOp[updateExpr.operator]) {
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
                        } else {
                            visit(updateExpr.argument, options);
                        }
                        break;
                    }
                case syntax_1.Syntax.Property:
                    {
                        var prop = node;
                        visit(prop.key, options);
                        visit(prop.value, options);
                        break;
                    }
                case syntax_1.Syntax.WhileStatement:
                    {
                        var whileStmt = node;
                        visit(whileStmt.test, options);
                        visit(whileStmt.body, options);
                        break;
                    }
                case syntax_1.Syntax.BreakStatement:
                case syntax_1.Syntax.ContinueStatement:
                case syntax_1.Syntax.EmptyStatement:
                case syntax_1.Syntax.Literal:
                case syntax_1.Syntax.Identifier:
                case syntax_1.Syntax.ThisExpression:
                case syntax_1.Syntax.DebuggerStatement:
                    {
                        break;
                    }
                default:
                    {
                        console.warn("Unhandled " + node.type);
                        console.warn("" + JSON.stringify(node, null, 2));
                    }
            }
        } else {
            return;
        }
    }
    function specialMethod(x, name) {
        return x !== null && typeof x === 'object' && typeof x[name] === 'function';
    }
    function binEval(lhs, rhs, lprop, rprop, fallback) {
        var result;
        if (specialMethod(lhs, lprop)) {
            result = lhs[lprop](rhs);
            if (typeof result !== 'undefined') {
                return result;
            } else {
                if (specialMethod(rhs, rprop)) {
                    result = rhs[rprop](lhs);
                    if (typeof result !== 'undefined') {
                        return result;
                    }
                }
            }
        } else if (specialMethod(rhs, rprop)) {
            result = rhs[rprop](lhs);
            if (typeof result !== 'undefined') {
                return result;
            }
        }
        return fallback(lhs, rhs);
    }
    function compose(g, f) {
        return function (x) {
            return g(f(x));
        };
    }
    function add(p, q) {
        return binEval(p, q, '__add__', '__radd__', function (a, b) {
            if (typeof a === 'function' && typeof b === 'function') {
                return compose(a, b);
            } else {
                return a + b;
            }
        });
    }
    exports_1("add", add);
    function sub(p, q) {
        return binEval(p, q, '__sub__', '__rsub__', function (a, b) {
            return a - b;
        });
    }
    exports_1("sub", sub);
    function mul(p, q) {
        return binEval(p, q, '__mul__', '__rmul__', function (a, b) {
            return a * b;
        });
    }
    exports_1("mul", mul);
    function div(p, q) {
        return binEval(p, q, '__div__', '__rdiv__', function (a, b) {
            return a / b;
        });
    }
    exports_1("div", div);
    function mod(p, q) {
        return binEval(p, q, '__mod__', '__rmod__', function (a, b) {
            return a % b;
        });
    }
    function bitwiseIOR(p, q) {
        return binEval(p, q, '__vbar__', '__rvbar__', function (a, b) {
            return a | b;
        });
    }
    function bitwiseXOR(p, q) {
        return binEval(p, q, '__wedge__', '__rwedge__', function (a, b) {
            return a ^ b;
        });
    }
    function lshift(p, q) {
        return binEval(p, q, '__lshift__', '__rlshift__', function (a, b) {
            return a << b;
        });
    }
    function rshift(p, q) {
        return binEval(p, q, '__rshift__', '__rrshift__', function (a, b) {
            return a >> b;
        });
    }
    function eq(p, q) {
        return binEval(p, q, '__eq__', '__req__', function (a, b) {
            return a === b;
        });
    }
    exports_1("eq", eq);
    function ne(p, q) {
        return binEval(p, q, '__ne__', '__rne__', function (a, b) {
            return a !== b;
        });
    }
    exports_1("ne", ne);
    function ge(p, q) {
        return binEval(p, q, '__ge__', '__rge__', function (a, b) {
            return a >= b;
        });
    }
    exports_1("ge", ge);
    function gt(p, q) {
        return binEval(p, q, '__gt__', '__rgt__', function (a, b) {
            return a > b;
        });
    }
    exports_1("gt", gt);
    function le(p, q) {
        return binEval(p, q, '__le__', '__rle__', function (a, b) {
            return a <= b;
        });
    }
    exports_1("le", le);
    function lt(p, q) {
        return binEval(p, q, '__lt__', '__rlt__', function (a, b) {
            return a < b;
        });
    }
    exports_1("lt", lt);
    function exp(x) {
        if (specialMethod(x, '__exp__')) {
            return x['__exp__']();
        } else {
            var s = x;
            var result = Math.exp(s);
            return result;
        }
    }
    function neg(x) {
        if (specialMethod(x, '__neg__')) {
            return x['__neg__']();
        } else {
            return -x;
        }
    }
    exports_1("neg", neg);
    function pos(x) {
        if (specialMethod(x, '__pos__')) {
            return x['__pos__']();
        } else {
            return +x;
        }
    }
    exports_1("pos", pos);
    function bang(x) {
        if (specialMethod(x, '__bang__')) {
            return x['__bang__']();
        } else {
            return !x;
        }
    }
    exports_1("bang", bang);
    function tilde(x) {
        if (specialMethod(x, '__tilde__')) {
            return x['__tilde__']();
        } else {
            return ~x;
        }
    }
    exports_1("tilde", tilde);
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
    return {
        setters: [function (core_1_1) {
            core_1 = core_1_1;
        }, function (esprima_1_1) {
            esprima_1 = esprima_1_1;
            esprima_2 = esprima_1_1;
        }, function (escodegen_1_1) {
            escodegen_1 = escodegen_1_1;
        }, function (generateRandomId_1_1) {
            generateRandomId_1 = generateRandomId_1_1;
        }, function (getLoopProtectorBlocks_1_1) {
            getLoopProtectorBlocks_1 = getLoopProtectorBlocks_1_1;
        }, function (syntax_1_1) {
            syntax_1 = syntax_1_1;
            exports_1({
                "Syntax": syntax_1_1["Syntax"]
            });
        }],
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
//# sourceMappingURL=davinci-mathscript-system-es5.js.map