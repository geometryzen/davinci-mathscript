System.register(["./assert", "./error-handler", "./messages", "./nodes", "./scanner", "./syntax", "./token", "./Precedence"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var assert_1, error_handler_1, messages_1, Node, scanner_1, syntax_1, token_1, Precedence_1, ArrowParameterPlaceHolder, Parser;
    return {
        setters: [
            function (assert_1_1) {
                assert_1 = assert_1_1;
            },
            function (error_handler_1_1) {
                error_handler_1 = error_handler_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (Node_1) {
                Node = Node_1;
            },
            function (scanner_1_1) {
                scanner_1 = scanner_1_1;
            },
            function (syntax_1_1) {
                syntax_1 = syntax_1_1;
            },
            function (token_1_1) {
                token_1 = token_1_1;
            },
            function (Precedence_1_1) {
                Precedence_1 = Precedence_1_1;
            }
        ],
        execute: function () {
            ArrowParameterPlaceHolder = 'ArrowParameterPlaceHolder';
            Parser = (function () {
                function Parser(code, options, delegate) {
                    if (options === void 0) { options = {}; }
                    this.config = {
                        range: (typeof options.range === 'boolean') && options.range,
                        loc: (typeof options.loc === 'boolean') && options.loc,
                        source: null,
                        tokens: (typeof options.tokens === 'boolean') && options.tokens,
                        comment: (typeof options.comment === 'boolean') && options.comment,
                        tolerant: (typeof options.tolerant === 'boolean') && options.tolerant
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
                            msg = (token.type === 2) ? messages_1.Messages.UnexpectedEOS :
                                (token.type === 3) ? messages_1.Messages.UnexpectedIdentifier :
                                    (token.type === 6) ? messages_1.Messages.UnexpectedNumber :
                                        (token.type === 8) ? messages_1.Messages.UnexpectedString :
                                            (token.type === 10) ? messages_1.Messages.UnexpectedTemplate :
                                                messages_1.Messages.UnexpectedToken;
                            if (token.type === 4) {
                                if (this.scanner.isFutureReservedWord(token.value)) {
                                    msg = messages_1.Messages.UnexpectedReserved;
                                }
                                else if (this.context.strict && this.scanner.isStrictModeReservedWord(token.value)) {
                                    msg = messages_1.Messages.StrictReservedWord;
                                }
                            }
                        }
                        value = token.value;
                    }
                    else {
                        value = 'ILLEGAL';
                    }
                    msg = msg.replace('%0', value);
                    if (token && typeof token.lineNumber === 'number') {
                        var index = token.start;
                        var line = token.lineNumber;
                        var lastMarkerLineStart = this.lastMarker.index - this.lastMarker.column;
                        var column = token.start - lastMarkerLineStart + 1;
                        return this.errorHandler.createError(index, line, column, msg);
                    }
                    else {
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
                    }
                    else {
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
                    this.hasLineTerminator = (token.lineNumber !== next.lineNumber);
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
                                column: marker.column,
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
                        }
                        else if (token.type === 7 && token.value === ';') {
                            this.nextToken();
                            this.tolerateUnexpectedToken(token);
                        }
                        else {
                            this.tolerateUnexpectedToken(token, messages_1.Messages.UnexpectedToken);
                        }
                    }
                    else {
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
                    return op === '=' ||
                        op === '*=' ||
                        op === '**=' ||
                        op === '/=' ||
                        op === '%=' ||
                        op === '+=' ||
                        op === '-=' ||
                        op === '<<=' ||
                        op === '>>=' ||
                        op === '>>>=' ||
                        op === '&=' ||
                        op === '^=' ||
                        op === '|=';
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
                    }
                    else if (!this.hasLineTerminator) {
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
                            }
                            else if (!this.context.strict && this.matchKeyword('let')) {
                                expr = this.finalize(node, new Node.Identifier(this.nextToken().value));
                            }
                            else {
                                this.context.isAssignmentTarget = false;
                                this.context.isBindingElement = false;
                                if (this.matchKeyword('function')) {
                                    expr = this.parseFunctionExpression();
                                }
                                else if (this.matchKeyword('this')) {
                                    this.nextToken();
                                    expr = this.finalize(node, new Node.ThisExpression());
                                }
                                else if (this.matchKeyword('class')) {
                                    expr = this.parseClassExpression();
                                }
                                else if (this.matchImportCall()) {
                                    expr = this.parseImportCall();
                                }
                                else {
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
                        }
                        else if (this.match('...')) {
                            var element = this.parseSpreadElement();
                            if (!this.match(']')) {
                                this.context.isAssignmentTarget = false;
                                this.context.isBindingElement = false;
                                this.expect(',');
                            }
                            elements.push(element);
                        }
                        else {
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
                            }
                            else {
                                key = this.throwUnexpectedToken(token);
                            }
                            break;
                        default:
                            key = this.throwUnexpectedToken(token);
                    }
                    return key;
                };
                Parser.prototype.isPropertyKey = function (key, value) {
                    return (key.type === syntax_1.Syntax.Identifier && key.name === value) ||
                        (key.type === syntax_1.Syntax.Literal && key.value === value);
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
                        isAsync = !this.hasLineTerminator && (id === 'async') &&
                            !this.match(':') && !this.match('(') && !this.match('*');
                        key = isAsync ? this.parseObjectPropertyKey() : this.finalize(node, new Node.Identifier(id));
                    }
                    else if (this.match('*')) {
                        this.nextToken();
                    }
                    else {
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
                    }
                    else if (token.type === 3 && !isAsync && token.value === 'set' && lookaheadPropertyKey) {
                        kind = 'set';
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        value = this.parseSetterMethod();
                    }
                    else if (token.type === 7 && token.value === '*' && lookaheadPropertyKey) {
                        kind = 'init';
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        value = this.parseGeneratorMethod();
                        method = true;
                    }
                    else {
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
                        }
                        else if (this.match('(')) {
                            value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
                            method = true;
                        }
                        else if (token.type === 3) {
                            var id = this.finalize(node, new Node.Identifier(token.value));
                            if (this.match('=')) {
                                this.context.firstCoverInitializedNameError = this.lookahead;
                                this.nextToken();
                                shorthand = true;
                                var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
                                value = this.finalize(node, new Node.AssignmentPattern(id, init));
                            }
                            else {
                                shorthand = true;
                                value = id;
                            }
                        }
                        else {
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
                    }
                    else {
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
                        }
                        else {
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
                                    }
                                    else if (this.match('...')) {
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
                                    }
                                    else {
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
                                        }
                                        else {
                                            this.reinterpretExpressionAsPattern(expr);
                                        }
                                        var parameters = (expr.type === syntax_1.Syntax.SequenceExpression ? expr.expressions : [expr]);
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
                            var expr = this.match('...') ? this.parseSpreadElement() :
                                this.isolateCoverGrammar(this.parseAssignmentExpression);
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
                    return token.type === 3 ||
                        token.type === 4 ||
                        token.type === 1 ||
                        token.type === 5;
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
                        }
                        else {
                            this.throwUnexpectedToken(this.lookahead);
                        }
                    }
                    else if (this.matchKeyword('import')) {
                        this.throwUnexpectedToken(this.lookahead);
                    }
                    else {
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
                            var expr = this.match('...') ? this.parseSpreadElement() :
                                this.isolateCoverGrammar(this.parseAsyncArgument);
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
                        match = (next.type === 7) && (next.value === '(');
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
                    }
                    else {
                        expr = this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
                    }
                    while (true) {
                        if (this.match('.')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('.');
                            var property = this.parseIdentifierName();
                            expr = this.finalize(this.startNode(startToken), new Node.StaticMemberExpression(expr, property));
                        }
                        else if (this.match('(')) {
                            var asyncArrow = maybeAsync && (startToken.lineNumber === this.lookahead.lineNumber);
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
                        }
                        else if (this.match('[')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('[');
                            var property = this.isolateCoverGrammar(this.parseExpression);
                            this.expect(']');
                            expr = this.finalize(this.startNode(startToken), new Node.ComputedMemberExpression(expr, property));
                        }
                        else if (this.lookahead.type === 10 && this.lookahead.head) {
                            var quasi = this.parseTemplateLiteral();
                            expr = this.finalize(this.startNode(startToken), new Node.TaggedTemplateExpression(expr, quasi));
                        }
                        else {
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
                    var expr = (this.matchKeyword('super') && this.context.inFunctionBody) ? this.parseSuper() :
                        this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
                    while (true) {
                        if (this.match('[')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('[');
                            var property = this.isolateCoverGrammar(this.parseExpression);
                            this.expect(']');
                            expr = this.finalize(node, new Node.ComputedMemberExpression(expr, property));
                        }
                        else if (this.match('.')) {
                            this.context.isBindingElement = false;
                            this.context.isAssignmentTarget = true;
                            this.expect('.');
                            var property = this.parseIdentifierName();
                            expr = this.finalize(node, new Node.StaticMemberExpression(expr, property));
                        }
                        else if (this.lookahead.type === 10 && this.lookahead.head) {
                            var quasi = this.parseTemplateLiteral();
                            expr = this.finalize(node, new Node.TaggedTemplateExpression(expr, quasi));
                        }
                        else {
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
                    }
                    else {
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
                    if (this.match('+') || this.match('-') || this.match('~') || this.match('!') ||
                        this.matchKeyword('delete') || this.matchKeyword('void') || this.matchKeyword('typeof')) {
                        var node = this.startNode(this.lookahead);
                        var token = this.nextToken();
                        expr = this.inheritCoverGrammar(this.parseUnaryExpression);
                        expr = this.finalize(node, new Node.UnaryExpression(token.value, expr));
                        if (this.context.strict && expr.operator === 'delete' && expr.argument.type === syntax_1.Syntax.Identifier) {
                            this.tolerateError(messages_1.Messages.StrictDelete);
                        }
                        this.context.isAssignmentTarget = false;
                        this.context.isBindingElement = false;
                    }
                    else if (this.context.await && this.matchContextualKeyword('await')) {
                        expr = this.parseAwaitExpression();
                    }
                    else {
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
                    }
                    else if (token.type === 4) {
                        precedence = (op === 'instanceof' || (this.context.allowIn && op === 'in')) ? 7 : 0;
                    }
                    else {
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
                            while ((stack.length > 2) && (prec <= precedences[precedences.length - 1])) {
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
                                this.checkPatternParam(options, (property.type === syntax_1.Syntax.RestProperty) ? property : property.value);
                            }
                            break;
                        default:
                            break;
                    }
                    options.simple = options.simple && (param instanceof Node.Identifier);
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
                        }
                        else if (asyncArrow && param.type === syntax_1.Syntax.Identifier && param.name === 'await') {
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
                    }
                    else {
                        var startToken = this.lookahead;
                        var token = startToken;
                        expr = this.parseConditionalExpression();
                        if (token.type === 3 && (token.lineNumber === this.lookahead.lineNumber) && token.value === 'async') {
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
                                var body = this.match('{') ? this.parseFunctionSourceElements() :
                                    this.isolateCoverGrammar(this.parseAssignmentExpression);
                                var expression = body.type !== syntax_1.Syntax.BlockStatement;
                                if (this.context.strict && list.firstRestricted) {
                                    this.throwUnexpectedToken(list.firstRestricted, list.message);
                                }
                                if (this.context.strict && list.stricted) {
                                    this.tolerateUnexpectedToken(list.stricted, list.message);
                                }
                                expr = isAsync ? this.finalize(node, new Node.AsyncArrowFunctionExpression(list.params, body, expression)) :
                                    this.finalize(node, new Node.ArrowFunctionExpression(list.params, body, expression));
                                this.context.strict = previousStrict;
                                this.context.allowStrictDirective = previousAllowStrictDirective;
                                this.context.allowYield = previousAllowYield;
                                this.context.await = previousAwait;
                            }
                        }
                        else {
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
                                }
                                else {
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
                                }
                                else {
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
                    }
                    else {
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
                            }
                            else {
                                this.throwError(messages_1.Messages.DeclarationMissingInitializer, 'const');
                            }
                        }
                    }
                    else if ((!options.inFor && id.type !== syntax_1.Syntax.Identifier) || this.match('=')) {
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
                    return (next.type === 3) ||
                        (next.type === 7 && next.value === '[') ||
                        (next.type === 7 && next.value === '{') ||
                        (next.type === 4 && next.value === 'let') ||
                        (next.type === 4 && next.value === 'yield');
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
                        }
                        else {
                            if (this.match('...')) {
                                elements.push(this.parseBindingRestElement(params, kind));
                                break;
                            }
                            else {
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
                        }
                        else if (!this.match(':')) {
                            params.push(keyToken);
                            shorthand = true;
                            value = init;
                        }
                        else {
                            this.expect(':');
                            value = this.parsePatternWithDefault(params, kind);
                        }
                    }
                    else {
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
                    }
                    else if (this.match('{')) {
                        pattern = this.parseObjectPattern(params, kind);
                    }
                    else {
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
                        }
                        else if (!this.context.allowYield) {
                            this.throwUnexpectedToken(token);
                        }
                    }
                    else if (token.type !== 3) {
                        if (this.context.strict && token.type === 4 && this.scanner.isStrictModeReservedWord(token.value)) {
                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
                        }
                        else {
                            if (this.context.strict || token.value !== 'let' || kind !== 'var') {
                                this.throwUnexpectedToken(token);
                            }
                        }
                    }
                    else if ((this.context.isModule || this.context.await) && token.type === 3 && token.value === 'await') {
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
                    }
                    else if (id.type !== syntax_1.Syntax.Identifier && !options.inFor) {
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
                    }
                    else {
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
                    }
                    else {
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
                    }
                    else {
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
                    }
                    else {
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
                            }
                            else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
                                init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
                                this.nextToken();
                                left = init;
                                right = this.parseAssignmentExpression();
                                init = null;
                                forIn = false;
                            }
                            else {
                                init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
                                this.expect(';');
                            }
                        }
                        else if (this.matchKeyword('const') || this.matchKeyword('let')) {
                            init = this.createNode();
                            var kind = this.nextToken().value;
                            if (!this.context.strict && this.lookahead.value === 'in') {
                                init = this.finalize(init, new Node.Identifier(kind));
                                this.nextToken();
                                left = init;
                                right = this.parseExpression();
                                init = null;
                            }
                            else {
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
                                }
                                else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
                                    init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
                                    this.nextToken();
                                    left = init;
                                    right = this.parseAssignmentExpression();
                                    init = null;
                                    forIn = false;
                                }
                                else {
                                    this.consumeSemicolon();
                                    init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
                                }
                            }
                        }
                        else {
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
                            }
                            else if (this.matchContextualKeyword('of')) {
                                if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
                                    this.tolerateError(messages_1.Messages.InvalidLHSInForLoop);
                                }
                                this.nextToken();
                                this.reinterpretExpressionAsPattern(init);
                                left = init;
                                right = this.parseAssignmentExpression();
                                init = null;
                                forIn = false;
                            }
                            else {
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
                    }
                    else {
                        this.expect(')');
                        var previousInIteration = this.context.inIteration;
                        this.context.inIteration = true;
                        body = this.isolateCoverGrammar(this.parseStatement);
                        this.context.inIteration = previousInIteration;
                    }
                    return (typeof left === 'undefined') ?
                        this.finalize(node, new Node.ForStatement(init, test, update, body)) :
                        forIn ? this.finalize(node, new Node.ForInStatement(left, right, body)) :
                            this.finalize(node, new Node.ForOfStatement(left, right, body));
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
                    var hasArgument = !this.match(';') && !this.match('}') &&
                        !this.hasLineTerminator && this.lookahead.type !== 2;
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
                    }
                    else {
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
                    }
                    else {
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
                    if ((expr.type === syntax_1.Syntax.Identifier) && this.match(':')) {
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
                        }
                        else if (this.matchKeyword('function')) {
                            var token = this.lookahead;
                            var declaration = this.parseFunctionDeclaration();
                            if (this.context.strict) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunction);
                            }
                            else if (declaration.generator) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.GeneratorInLegacyContext);
                            }
                            body = declaration;
                        }
                        else {
                            body = this.parseStatement();
                        }
                        delete this.context.labelSet[key];
                        statement = new Node.LabeledStatement(id, body);
                    }
                    else {
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
                            }
                            else if (value === '(') {
                                statement = this.parseExpressionStatement();
                            }
                            else if (value === ';') {
                                statement = this.parseEmptyStatement();
                            }
                            else {
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
                    }
                    else if (!options.firstRestricted) {
                        if (this.scanner.isRestrictedWord(name)) {
                            options.firstRestricted = param;
                            options.message = messages_1.Messages.StrictParamName;
                        }
                        else if (this.scanner.isStrictModeReservedWord(name)) {
                            options.firstRestricted = param;
                            options.message = messages_1.Messages.StrictReservedWord;
                        }
                        else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                            options.stricted = param;
                            options.message = messages_1.Messages.StrictParamDupe;
                        }
                    }
                    if (typeof Object.defineProperty === 'function') {
                        Object.defineProperty(options.paramSet, key, { value: true, enumerable: true, writable: true, configurable: true });
                    }
                    else {
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
                    options.simple = options.simple && (param instanceof Node.Identifier);
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
                        match = (state.lineNumber === next.lineNumber) && (next.type === 4) && (next.value === 'function');
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
                        }
                        else {
                            if (this.scanner.isRestrictedWord(token.value)) {
                                firstRestricted = token;
                                message = messages_1.Messages.StrictFunctionName;
                            }
                            else if (this.scanner.isStrictModeReservedWord(token.value)) {
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
                    return isAsync ? this.finalize(node, new Node.AsyncFunctionDeclaration(id, params, body)) :
                        this.finalize(node, new Node.FunctionDeclaration(id, params, body, isGenerator));
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
                        id = (!this.context.strict && !isGenerator && this.matchKeyword('yield')) ? this.parseIdentifierName() : this.parseVariableIdentifier();
                        if (this.context.strict) {
                            if (this.scanner.isRestrictedWord(token.value)) {
                                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
                            }
                        }
                        else {
                            if (this.scanner.isRestrictedWord(token.value)) {
                                firstRestricted = token;
                                message = messages_1.Messages.StrictFunctionName;
                            }
                            else if (this.scanner.isStrictModeReservedWord(token.value)) {
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
                    return isAsync ? this.finalize(node, new Node.AsyncFunctionExpression(id, params, body)) :
                        this.finalize(node, new Node.FunctionExpression(id, params, body, isGenerator));
                };
                Parser.prototype.parseDirective = function () {
                    var token = this.lookahead;
                    var node = this.createNode();
                    var expr = this.parseExpression();
                    var directive = (expr.type === syntax_1.Syntax.Literal) ? this.getTokenRaw(token).slice(1, -1) : null;
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
                        }
                        else {
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
                    }
                    else if (formalParameters.params[0] instanceof Node.RestElement) {
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
                            start = (value === '[') || (value === '(') || (value === '{') ||
                                (value === '+') || (value === '-') ||
                                (value === '!') || (value === '~') ||
                                (value === '++') || (value === '--') ||
                                (value === '/') || (value === '/=');
                            break;
                        case 4:
                            start = (value === 'class') || (value === 'delete') ||
                                (value === 'function') || (value === 'let') || (value === 'new') ||
                                (value === 'super') || (value === 'this') || (value === 'typeof') ||
                                (value === 'void') || (value === 'yield');
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
                        }
                        else if (this.isStartOfExpression()) {
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
                    }
                    else {
                        computed = this.match('[');
                        key = this.parseObjectPropertyKey();
                        var id = key;
                        if (id.name === 'static' && (this.qualifiedPropertyName(this.lookahead) || this.match('*'))) {
                            token = this.lookahead;
                            isStatic = true;
                            computed = this.match('[');
                            if (this.match('*')) {
                                this.nextToken();
                            }
                            else {
                                key = this.parseObjectPropertyKey();
                            }
                        }
                        if ((token.type === 3) && !this.hasLineTerminator && (token.value === 'async')) {
                            var punctuator = this.lookahead.value;
                            if (punctuator !== ':' && punctuator !== '(' && punctuator !== '*') {
                                isAsync = true;
                                token = this.lookahead;
                                key = this.parseObjectPropertyKey();
                                if (token.type === 3) {
                                    if (token.value === 'get' || token.value === 'set') {
                                        this.tolerateUnexpectedToken(token);
                                    }
                                    else if (token.value === 'constructor') {
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
                        }
                        else if (token.value === 'set' && lookaheadPropertyKey) {
                            kind = 'set';
                            computed = this.match('[');
                            key = this.parseObjectPropertyKey();
                            value = this.parseSetterMethod();
                        }
                    }
                    else if (token.type === 7 && token.value === '*' && lookaheadPropertyKey) {
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
                            if (kind !== 'method' || !method || (value && value.generator)) {
                                this.throwUnexpectedToken(token, messages_1.Messages.ConstructorSpecialMethod);
                            }
                            if (hasConstructor.value) {
                                this.throwUnexpectedToken(token, messages_1.Messages.DuplicateConstructor);
                            }
                            else {
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
                        }
                        else {
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
                    var id = (identifierIsOptional && (this.lookahead.type !== 3)) ? null : this.parseVariableIdentifier();
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
                    var id = (this.lookahead.type === 3) ? this.parseVariableIdentifier() : null;
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
                    }
                    else {
                        imported = this.parseIdentifierName();
                        local = imported;
                        if (this.matchContextualKeyword('as')) {
                            this.nextToken();
                            local = this.parseVariableIdentifier();
                        }
                        else {
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
                    }
                    else {
                        if (this.match('{')) {
                            specifiers = specifiers.concat(this.parseNamedImports());
                        }
                        else if (this.match('*')) {
                            specifiers.push(this.parseImportNamespaceSpecifier());
                        }
                        else if (this.isIdentifierName(this.lookahead) && !this.matchKeyword('default')) {
                            specifiers.push(this.parseImportDefaultSpecifier());
                            if (this.match(',')) {
                                this.nextToken();
                                if (this.match('*')) {
                                    specifiers.push(this.parseImportNamespaceSpecifier());
                                }
                                else if (this.match('{')) {
                                    specifiers = specifiers.concat(this.parseNamedImports());
                                }
                                else {
                                    this.throwUnexpectedToken(this.lookahead);
                                }
                            }
                        }
                        else {
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
                        }
                        else if (this.matchKeyword('class')) {
                            var declaration = this.parseClassDeclaration(true);
                            exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
                        }
                        else if (this.matchContextualKeyword('async')) {
                            var declaration = this.matchAsyncFunction() ? this.parseFunctionDeclaration(true) : this.parseAssignmentExpression();
                            exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
                        }
                        else {
                            if (this.matchContextualKeyword('from')) {
                                this.throwError(messages_1.Messages.UnexpectedToken, this.lookahead.value);
                            }
                            var declaration = this.match('{') ? this.parseObjectInitializer() :
                                this.match('[') ? this.parseArrayInitializer() : this.parseAssignmentExpression();
                            this.consumeSemicolon();
                            exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
                        }
                    }
                    else if (this.match('*')) {
                        this.nextToken();
                        if (!this.matchContextualKeyword('from')) {
                            var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
                            this.throwError(message, this.lookahead.value);
                        }
                        this.nextToken();
                        var src = this.parseModuleSpecifier();
                        this.consumeSemicolon();
                        exportDeclaration = this.finalize(node, new Node.ExportAllDeclaration(src));
                    }
                    else if (this.lookahead.type === 4) {
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
                    }
                    else if (this.matchAsyncFunction()) {
                        var declaration = this.parseFunctionDeclaration();
                        exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
                    }
                    else {
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
                        }
                        else if (isExportFromIdentifier) {
                            var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
                            this.throwError(message, this.lookahead.value);
                        }
                        else {
                            this.consumeSemicolon();
                        }
                        exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(null, specifiers, source));
                    }
                    return exportDeclaration;
                };
                return Parser;
            }());
            exports_1("Parser", Parser);
        }
    };
});
