declare var ast: {
    isExpression: (node: any) => boolean;
    isStatement: (node: any) => boolean;
    isIterationStatement: (node: any) => boolean;
    isSourceElement: (node: any) => boolean;
    isProblematicIfStatement: (node: any) => boolean;
    trailingStatement: (node: any) => any;
};
export = ast;
