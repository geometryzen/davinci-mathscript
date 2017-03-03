
export interface INode {
    alternate: INode;
    argument: INode;
    arguments: INode[];
    block: INode;
    body: INode | INode[];
    callee;
    cases: INode[];
    comments;
    consequent: INode | INode[];
    declarations: INode[];
    discriminant: INode;
    elements: INode[];
    errors;
    expression: INode;
    expressions: INode[];
    finalizer: INode;
    init: INode;
    key: INode;
    left: INode;
    object: INode;
    operator: string;
    param: INode;
    params: INode[];
    properties: INode[];
    right: INode;
    test: INode;
    tokens;
    type: string;
    update: INode;
    value: INode;
    finishExpressionStatement(expr: INode): this;
    finishProgram(body: INode[]): this;
    finishIfStatement(test: INode, consequent: INode, alternate: INode): INode;
    finishWithStatement(object: INode, body: INode): this;
}

export default INode;
