System.register(["./character", "./jsx-nodes", "./jsx-syntax", "./nodes", "./parser", "./token", "./xhtml-entities"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
                qualifiedName = getQualifiedElementName(ns.namespace) + ':' +
                    getQualifiedElementName(ns.name);
                break;
            case jsx_syntax_1.JSXSyntax.JSXMemberExpression:
                var expr = elementName;
                qualifiedName = getQualifiedElementName(expr.object) + '.' +
                    getQualifiedElementName(expr.property);
                break;
            default:
                break;
        }
        return qualifiedName;
    }
    var character_1, JSXNode, jsx_syntax_1, Node, parser_1, token_1, xhtml_entities_1, JSXParser;
    return {
        setters: [
            function (character_1_1) {
                character_1 = character_1_1;
            },
            function (JSXNode_1) {
                JSXNode = JSXNode_1;
            },
            function (jsx_syntax_1_1) {
                jsx_syntax_1 = jsx_syntax_1_1;
            },
            function (Node_1) {
                Node = Node_1;
            },
            function (parser_1_1) {
                parser_1 = parser_1_1;
            },
            function (token_1_1) {
                token_1 = token_1_1;
            },
            function (xhtml_entities_1_1) {
                xhtml_entities_1 = xhtml_entities_1_1;
            }
        ],
        execute: function () {
            token_1.TokenName[100] = 'JSXIdentifier';
            token_1.TokenName[101] = 'JSXText';
            JSXParser = (function (_super) {
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
                        terminated = (ch === ';');
                        result += ch;
                        ++this.scanner.index;
                        if (!terminated) {
                            switch (result.length) {
                                case 2:
                                    numeric = (ch === '#');
                                    break;
                                case 3:
                                    if (numeric) {
                                        hex = (ch === 'x');
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
                        }
                        else if (hex && str.length > 2) {
                            result = String.fromCharCode(parseInt('0' + str.substr(1), 16));
                        }
                        else if (!numeric && !hex && xhtml_entities_1.XHTMLEntities[str]) {
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
                            }
                            else if (ch === '&') {
                                str += this.scanXHTMLEntity(quote);
                            }
                            else {
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
                        var value = (n1 === 46 && n2 === 46) ? '...' : '.';
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
                    if (character_1.Character.isIdentifierStart(cp) && (cp !== 92)) {
                        var start = this.scanner.index;
                        ++this.scanner.index;
                        while (!this.scanner.eof()) {
                            var ch = this.scanner.source.charCodeAt(this.scanner.index);
                            if (character_1.Character.isIdentifierPart(ch) && (ch !== 92)) {
                                ++this.scanner.index;
                            }
                            else if (ch === 45) {
                                ++this.scanner.index;
                            }
                            else {
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
                    if ((text.length > 0) && this.config.tokens) {
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
                    }
                    else if (this.matchJSX('.')) {
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
                    }
                    else {
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
                    return this.matchJSX('{') ? this.parseJSXExpressionAttribute() :
                        this.matchJSX('<') ? this.parseJSXElement() : this.parseJSXStringLiteralAttribute();
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
                        var attribute = this.matchJSX('{') ? this.parseJSXSpreadAttribute() :
                            this.parseJSXNameValueAttribute();
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
                    }
                    else {
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
                        }
                        else {
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
                            }
                            else {
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
                            }
                            else {
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
            }(parser_1.Parser));
            exports_1("JSXParser", JSXParser);
        }
    };
});
