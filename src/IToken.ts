import IRegExpFlags from './IRegExpFlags';

export interface IToken {
    type?: number;
    value?: number | string;
    lineNumber?: number;
    lineStart?: number;
    literal?: IRegExpFlags;
    octal?: boolean;
    regex?: { pattern: string; flags: string };
    start: number;
    startLineNumber?: number;
    startLineStart?: number;
    end: number;
}

export default IToken;
