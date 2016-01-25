//
// davinci-mathscript.d.ts
//
// This file was created manually in order to support the davinci-mathscript library.
//

//
// Provide support for global variable Ms.
//
declare module Ms {
    export var VERSION: string;
    export function transpile(code: string): string;
}

//
// Provide support for AMD.
//
declare module 'davinci-mathscript' {
  export default Ms;
}
