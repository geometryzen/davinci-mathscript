define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    function generateRandomId(length) {
        if (length === void 0) { length = 10; }
        var id = '';
        for (var i = length; i--;) {
            id += alphaNum[~~(Math.random() * alphaNum.length)];
        }
        return id;
    }
    exports.generateRandomId = generateRandomId;
});
