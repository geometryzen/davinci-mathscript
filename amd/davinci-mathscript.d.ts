declare var Ms: {
    'VERSION': string;
    parse: (code: any, options: any) => any;
    transpile: (code: any, options: any) => any;
    add: (p: any, q: any) => any;
    sub: (p: any, q: any) => any;
    mul: (p: any, q: any) => any;
    div: (p: any, q: any) => any;
    wedge: (p: any, q: any) => any;
    lshift: (p: any, q: any) => any;
    rshift: (p: any, q: any) => any;
    neg: (x: any) => any;
    pos: (x: any) => any;
};
export = Ms;
