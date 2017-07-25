System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function generateRandomId(length) {
        if (length === void 0) { length = 10; }
        var id = '';
        for (var i = length; i--;) {
            id += alphaNum[~~(Math.random() * alphaNum.length)];
        }
        return id;
    }
    exports_1("generateRandomId", generateRandomId);
    var alphaNum;
    return {
        setters: [],
        execute: function () {
            alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        }
    };
});
