/**
 * Provides the MathScript module
 *
 * @module mathscript
 */
declare var mathscript: {
    'VERSION': string;
    esprima: {
        tokenize: (code: any, options: any) => any;
        parse: (code: any, options: any) => any;
        Synatax: {};
    };
    escodegen: {
        generate: (node: any, options: any) => any;
        Precedence: any;
        FORMAT_MINIFY: any;
        FORMAT_DEFAULT: any;
    };
    estraverse: {
        Syntax: any;
        traverse: (root: any, visitor: any) => any;
        replace: (root: any, visitor: any) => any;
        attachComments: (tree: any, providedComments: any, tokens: any) => any;
        VisitorKeys: any;
        VisitorOption: any;
        Controller: () => void;
    };
    esutils: {
        ast: {
            isExpression: (node: any) => boolean;
            isStatement: (node: any) => boolean;
            isIterationStatement: (node: any) => boolean;
            isSourceElement: (node: any) => boolean;
            isProblematicIfStatement: (node: any) => boolean;
            trailingStatement: (node: any) => any;
        };
        code: {
            isDecimalDigit: (ch: any) => boolean;
            isHexDigit: (ch: any) => boolean;
            isOctalDigit: (ch: any) => boolean;
            isWhiteSpace: (ch: any) => boolean;
            isLineTerminator: (ch: any) => boolean;
            isIdentifierStartES5: (ch: any) => any;
            isIdentifierPartES5: (ch: any) => any;
            isIdentifierStartES6: (ch: any) => any;
            isIdentifierPartES6: (ch: any) => any;
        };
        keyword: {
            isKeywordES5: (id: any, strict: any) => boolean;
            isKeywordES6: (id: any, strict: any) => boolean;
            isReservedWordES5: (id: any, strict: any) => boolean;
            isReservedWordES6: (id: any, strict: any) => boolean;
            isRestrictedWord: (id: any) => boolean;
            isIdentifierNameES5: (id: any) => boolean;
            isIdentifierNameES6: (id: any) => boolean;
            isIdentifierES5: (id: any, strict: any) => boolean;
            isIdentifierES6: (id: any, strict: any) => boolean;
        };
    };
};
export = mathscript;
