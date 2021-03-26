"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equals = void 0;
const hasOwnProperty = (o, key) => Object.prototype.hasOwnProperty.call(o, key);
const shallowEquals = (a, b) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return (keysA.length === keysB.length &&
        keysA.every(key => hasOwnProperty(b, key) && Object.is(a[key], b[key])));
};
const isObject = (a) => a !== null && typeof a === "object";
const equals = (a, b) => isObject(a) && isObject(b) ? shallowEquals(a, b) : Object.is(a, b);
exports.equals = equals;
//# sourceMappingURL=equals.js.map