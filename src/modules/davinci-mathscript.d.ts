//
// davinci-mathscript.d.ts
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
  export const VERSION: string;

  export interface TranspileOptions {
    comment?: boolean;
    attachComment?: boolean;
    sourceType?: 'module' | 'script';
    jsx?: boolean;
  }

  export function transpile(code: string, options?: TranspileOptions): string;
}

//
// Provide support for AMD.
// TODO: This is no longer the correct way to define UMD definitions.
//
declare module 'davinci-mathscript' {
  export default Ms;
}
