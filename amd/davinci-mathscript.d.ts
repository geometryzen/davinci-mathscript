declare var Ms: {
    'VERSION': string;
    parse: (code: any, options: any) => any;
    transpile: (code: any, options: any) => any;
    add: (lhs: any, rhs: any) => any;
};
export = Ms;
