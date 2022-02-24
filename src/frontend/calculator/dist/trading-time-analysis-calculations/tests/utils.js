"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putInSameOrder = exports.randomDate = exports.randomTime = void 0;
var lodash_1 = __importDefault(require("lodash"));
var utils_1 = require("../../utils");
var openHours = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
];
var randomTime = function () {
    var randomMinutes = function () {
        var min = (0, utils_1.randomInt)(1, 59);
        return min < 10 ? "0".concat(min.toString()) : min.toString();
    };
    var randomHour = function () { return openHours[(0, utils_1.randomInt)(0, 12)].split(':')[0]; };
    return randomHour() + ':' + randomMinutes() + ':00Z';
};
exports.randomTime = randomTime;
var randomDate = function () {
    var randomYear = (0, utils_1.randomInt)(1970, 3000);
    var randomMonth = (0, utils_1.randomInt)(1, 12);
    var randomDay = (0, utils_1.randomInt)(1, 28);
    var randomMonthStr = randomMonth < 10 ? "0".concat(randomMonth) : randomMonth.toString();
    var randomDayStr = randomDay < 10 ? "0".concat(randomDay) : randomDay.toString();
    return "".concat(randomYear, "-").concat(randomMonthStr, "-").concat(randomDayStr);
};
exports.randomDate = randomDate;
/**
 *
 * @param arrayToOrder array of objects which are considered to be out of order
 * @param orderedArray array of objects which are considered to be in order with respect to their anchor keys
 * @param anchorKey the key which is used for the ordering
 * @returns the arrayToOrder in order
 */
var putInSameOrder = function (arrayToOrder, orderedArray, anchorKey) {
    var result = lodash_1.default.cloneDeep(arrayToOrder);
    var newlyOrderedArray = [];
    orderedArray.forEach(function (orderedItem) {
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var resultItem = result_1[_i];
            if (resultItem[anchorKey] == orderedItem[anchorKey]) {
                result = result.filter(function (item) { return !(item[anchorKey] == orderedItem[anchorKey]); });
                newlyOrderedArray.push(resultItem);
            }
        }
    });
    if (result.length !== 0) {
        throw Error('They are not the same');
    }
    return newlyOrderedArray;
};
exports.putInSameOrder = putInSameOrder;
//# sourceMappingURL=utils.js.map