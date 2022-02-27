"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approximate = exports.randomInt = exports.cloneObj = exports.sumObjArray = exports.sum = exports.mergeArrays = exports.randomNumber = void 0;
var randomNumber = function (min, max) {
    return (Math.random() * (max - min)) + min;
};
exports.randomNumber = randomNumber;
var randomInt = function (min, max) {
    return Math.round(randomNumber(min, max));
};
exports.randomInt = randomInt;
var mergeArrays = function () {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    var newArray = [];
    for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) {
        var array = arrays_1[_a];
        newArray = __spreadArray(__spreadArray([], newArray, true), array, true);
    }
    return newArray;
};
exports.mergeArrays = mergeArrays;
var sum = function (arr) {
    var sum = 0;
    for (var i in arr) {
        sum += arr[i];
    }
    return sum;
};
exports.sum = sum;
var sumObjArray = function (objs, objKey) {
    return sum(objs.map(function (obj) { return obj[objKey]; }));
};
exports.sumObjArray = sumObjArray;
var cloneObj = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};
exports.cloneObj = cloneObj;
var approximate = function (n) {
    return parseFloat(n.toFixed(10));
};
exports.approximate = approximate;
__exportStar(require("./date-utils"), exports);
//# sourceMappingURL=index.js.map