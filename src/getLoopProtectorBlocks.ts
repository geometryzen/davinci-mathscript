import { parse } from './esprima';
import { IfStatement } from './nodes';
import { Script } from './nodes';
import { VariableDeclaration } from './nodes';

/**
 * Generate 2 ASTs for the code to be inserted in loops for infinite run protection.
 */
export function getLoopProtectorBlocks(varName: string, timeout: number): { before: VariableDeclaration; inside: IfStatement } {
    const ast1: Script = parse(`var ${varName} = Date.now()`);
    const ast2: Script = parse(`if (Date.now() - ${varName} > ${timeout}) {throw new Error("Infinite loop suspected after ${timeout} milliseconds.")}`);

    return {
        before: <VariableDeclaration>ast1.body[0],
        inside: <IfStatement>ast2.body[0]
    };
}
