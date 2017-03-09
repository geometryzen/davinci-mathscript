import { parse } from './esprima';
import { BlockStatement } from './nodes';
import { IfStatement } from './nodes';
import { StatementListItem } from './nodes';
import { Script } from './nodes';
import { VariableDeclaration } from './nodes';
import { WhileStatement } from './nodes';

/**
 * Generate 2 ASTs for the code to be inserted in loops for infinite run protection.
 */
export default function getLoopProtectorBlocks(varName: string, millis: number): { before: VariableDeclaration; inside: IfStatement } {
    const ast1: Script = parse(`var ${varName} = Date.now()`);
    const ast2: Script = parse(`if (Date.now() - ${varName} > ${millis}) {break}`);

    return {
        before: <VariableDeclaration>ast1.body[0],
        inside: <IfStatement>ast2.body[0]
    };
}
