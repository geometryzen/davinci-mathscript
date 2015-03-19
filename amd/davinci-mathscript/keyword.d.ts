declare var keyword: {
    isKeywordES5: (id: any, strict: any) => boolean;
    isKeywordES6: (id: any, strict: any) => boolean;
    isReservedWordES5: (id: any, strict: any) => boolean;
    isReservedWordES6: (id: any, strict: any) => boolean;
    isRestrictedWord: (id: any) => boolean;
    isIdentifierNameES5: (id: any) => boolean;
    isIdentifierNameES6: (id: any) => boolean;
    isIdentifierES5: (id: any, strict: any) => boolean;
    isIdentifierES6: (id: any, strict: any) => boolean;
};
export = keyword;
