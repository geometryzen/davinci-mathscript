define(["require", "exports", "./comment-handler", "./jsx-parser", "./parser", "./tokenizer", "./syntax"], function (require, exports, comment_handler_1, jsx_parser_1, parser_1, tokenizer_1, syntax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        var parserDelegate = (typeof delegate === 'function') ? proxyDelegate : null;
        var collectComment = false;
        if (options) {
            collectComment = (typeof options.comment === 'boolean' && options.comment);
            var attachComment = (typeof options.attachComment === 'boolean' && options.attachComment);
            if (collectComment || attachComment) {
                commentHandler = new comment_handler_1.CommentHandler();
                commentHandler.attach = attachComment;
                options.comment = true;
                parserDelegate = proxyDelegate;
            }
        }
        var isModule = false;
        if (options && typeof options.sourceType === 'string') {
            isModule = (options.sourceType === 'module');
        }
        var parser;
        if (options && typeof options.jsx === 'boolean' && options.jsx) {
            parser = new jsx_parser_1.JSXParser(code, options, parserDelegate);
        }
        else {
            parser = new parser_1.Parser(code, options, parserDelegate);
        }
        var program = isModule ? parser.parseModule() : parser.parseScript();
        var ast = program;
        if (collectComment && commentHandler) {
            ast.comments = commentHandler.comments;
        }
        if (parser.config.tokens) {
            ast.tokens = parser.tokens;
        }
        if (parser.config.tolerant) {
            ast.errors = parser.errorHandler.errors;
        }
        return ast;
    }
    exports.parse = parse;
    function parseModule(code, options, delegate) {
        var parsingOptions = options || {};
        parsingOptions.sourceType = 'module';
        return parse(code, parsingOptions, delegate);
    }
    exports.parseModule = parseModule;
    function parseScript(code, options, delegate) {
        var parsingOptions = options || {};
        parsingOptions.sourceType = 'script';
        return parse(code, parsingOptions, delegate);
    }
    exports.parseScript = parseScript;
    function tokenize(code, options, delegate) {
        var tokenizer = new tokenizer_1.Tokenizer(code, options);
        var tokens;
        tokens = [];
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
        }
        catch (e) {
            tokenizer.errorHandler.tolerate(e);
        }
        if (tokenizer.errorHandler.tolerant) {
            tokens.errors = tokenizer.errors();
        }
        return tokens;
    }
    exports.tokenize = tokenize;
    exports.Syntax = syntax_1.Syntax;
    exports.version = '1.1.2';
});
