declare var Ms: {
    'VERSION': string;
    parse: (code: any, options: any) => any;
    transpile: (code: any, options: any) => any;
    add: (p: any, q: any) => any;
    sub: (p: any, q: any) => any;
    mul: (p: any, q: any) => any;
};
export = Ms;
