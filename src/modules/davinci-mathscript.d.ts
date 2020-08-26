// Type definitions for davinci-mathscript 1.3.5
// Project: https://github.com/geometryzen/davinci-mathscript
// Definitions by: David Geo Holmes david.geo.holmes@gmail.com
//
// This file was created manually in order to support the davinci-mathscript library.
//

//
// Provide support for global variable Ms.
//
declare module Ms {
    /**
     * 
     */
    export const VERSION: string

    export interface ParseOptions {
        comment?: boolean
        attachComment?: boolean
        sourceType?: 'module' | 'script'
        jsx?: boolean
        range?: boolean
        loc?: boolean
        tokens?: boolean
        tolerant?: boolean
        source?: string
    }

    export interface Position {
        line: number
        column: number
    }

    export interface SourceLocation {
        start: Position
        end: Position
        source?: string
    }

    export interface IRegExpFlags {
        value: string
        literal: string
    }

    export interface IToken {
        type?: number | 'BlockComment' | 'LineComment'
        value?: number | string
        lineNumber?: number
        lineStart?: number
        literal?: IRegExpFlags
        octal?: boolean
        regex?: { pattern: string; flags: string }
        start?: number
        startLineNumber?: number
        startLineStart?: number
        end?: number
        loc?: SourceLocation
        range?: [number, number]
    }

    export interface MetaData {
        start: {
            line: number;
            column: number;
            offset: number;
        }
        end: {
            line: number;
            column: number;
            offset: number;
        }
    }

    export interface ParseDelegate {
        (node: IToken, metadata?: MetaData): IToken
    }
    export interface GenerateOptions {
        parse?: any
        comment?: boolean
        file?: string
        format: {
            indent: {
                style: string;
                base: number;
                adjustMultilineComment: boolean
            };
            newline: '\n';
            space: ' ';
            json: boolean;
            renumber: boolean;
            hexadecimal: boolean;
            quotes: 'single' | 'double';
            escapeless: boolean;
            compact: boolean;
            parentheses: boolean;
            semicolons: boolean;
            safeConcatenation: boolean;
            preserveBlankLines: boolean;
        }
        moz?: {
            comprehensionExpressionStartsWithAssignment: false;
            starlessGenerator: false;
        }
        sourceContent?: string
        sourceMap: null
        sourceMapRoot: null
        sourceMapWithCode: false
        directive: false
        raw: true
        verbatim: null
        sourceCode: null
    }

    export interface TranspileOptions extends ParseOptions {
        timeout?: number
        noLoopCheck?: boolean
        operatorOverloading?: boolean
    }

    export function transpile(code: string, transpileOptions?: TranspileOptions, delegate?: ParseDelegate, generateOptions?: GenerateOptions): string
}

//
// Provide support for AMD.
// TODO: This is no longer the correct way to define UMD definitions.
//
declare module 'davinci-mathscript' {
    export default Ms
}
