declare var estraverse: {
    Syntax: any;
    traverse: (root: any, visitor: any) => any;
    replace: (root: any, visitor: any) => any;
    attachComments: (tree: any, providedComments: any, tokens: any) => any;
    VisitorKeys: any;
    VisitorOption: any;
    Controller: () => void;
};
export = estraverse;
