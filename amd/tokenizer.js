define(["require", "exports", "./error-handler", "./scanner", "./token"], function (require, exports, error_handler_1, scanner_1, token_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokenizer = void 0;
    var UNTRACKED_LOCATION = { start: { line: -1, column: -1 }, end: { line: -1, column: -1 } };
    var Reader = (function () {
        function Reader() {
            this.values = [];
            this.curly = this.paren = -1;
        }
        Reader.prototype.beforeFunctionExpression = function (t) {
            return ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
                'return', 'case', 'delete', 'throw', 'void',
                '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=',
                '&=', '|=', '^=', ',',
                '+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
                '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
                '<=', '<', '>', '!=', '!=='].indexOf(t) >= 0;
        };
        Reader.prototype.isRegexStart = function () {
            var previous = this.values[this.values.length - 1];
            var regex = (previous !== null);
            switch (previous) {
                case 'this':
                case ']':
                    regex = false;
                    break;
                case ')':
                    var keyword = this.values[this.paren - 1];
                    regex = (keyword === 'if' || keyword === 'while' || keyword === 'for' || keyword === 'with');
                    break;
                case '}':
                    regex = false;
                    if (this.values[this.curly - 3] === 'function') {
                        var check = this.values[this.curly - 4];
                        if (typeof check === 'string') {
                            regex = check ? !this.beforeFunctionExpression(check) : false;
                        }
                        else {
                            regex = false;
                        }
                    }
                    else if (this.values[this.curly - 4] === 'function') {
                        var check = this.values[this.curly - 5];
                        if (typeof check === 'string') {
                            regex = check ? !this.beforeFunctionExpression(check) : true;
                        }
                        else {
                            regex = true;
                        }
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
                }
                else if (token.value === '(') {
                    this.paren = this.values.length;
                }
                this.values.push(token.value);
            }
            else {
                this.values.push(null);
            }
        };
        return Reader;
    }());
    var Tokenizer = (function () {
        function Tokenizer(code, config) {
            this.errorHandler = new error_handler_1.ErrorHandler();
            this.errorHandler.tolerant = config ? (typeof config.tolerant === 'boolean' && config.tolerant) : false;
            this.scanner = new scanner_1.Scanner(code, this.errorHandler);
            this.scanner.trackComment = config ? (typeof config.comment === 'boolean' && config.comment) : false;
            this.trackRange = config ? (typeof config.range === 'boolean' && config.range) : false;
            this.trackLoc = config ? (typeof config.loc === 'boolean' && config.loc) : false;
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
                    var trackLoc = this.trackLoc;
                    var loc = trackLoc ? { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } } : UNTRACKED_LOCATION;
                    if (trackLoc) {
                        loc.start.line = this.scanner.lineNumber;
                        loc.start.column = this.scanner.index - this.scanner.lineStart;
                    }
                    var startRegex = (this.scanner.source[this.scanner.index] === '/') && this.reader.isRegexStart();
                    var token = startRegex ? this.scanner.scanRegExp() : this.scanner.lex();
                    this.reader.push(token);
                    var entry = {
                        type: token_1.TokenName[token.type],
                        value: this.scanner.source.slice(token.start, token.end)
                    };
                    if (this.trackRange) {
                        entry.range = [token.start, token.end];
                    }
                    if (trackLoc) {
                        loc.end.line = this.scanner.lineNumber;
                        loc.end.column = this.scanner.index - this.scanner.lineStart;
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
    }());
    exports.Tokenizer = Tokenizer;
});
