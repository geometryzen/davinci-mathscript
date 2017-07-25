const alphaNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRandomId(length = 10) {
    let id = '';
    for (let i = length; i--;) {
        id += alphaNum[~~(Math.random() * alphaNum.length)];
    }
    return id;
}
