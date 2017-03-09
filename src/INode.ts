
export interface INode {
    alternate?: INode;
    argument?: INode;
    arguments?: INode[];
    block?: INode;
    body?: INode | INode[];
    callee?;
    cases?: INode[];
    comments?;
    consequent?: INode | INode[];
    declarations?: INode[];
    discriminant?: INode;
    elements?: INode[] | null;
    errors?;
    expression?: INode;
    expressions?: INode[];
    finalizer?: INode;
    init?: INode;
    key?: INode;
    left?: INode;
    object?: INode;
    operator?: string;
    param?: INode;
    params?: INode[];
    properties?: INode[];
    right?: INode;
    test?: INode;
    tokens?;
    type: string;
    update?: INode;
    value?: INode;
}

export default INode;
