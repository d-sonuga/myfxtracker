"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var openHourTableCalc = function (accountData) {
    var openHourMap = {};
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        var hour = formatTime(trade.openTime);
        if (!(hour in openHourMap)) {
            openHourMap[hour] = { result: 0, noOfTrades: 0 };
        }
        openHourMap[hour].result += trade.profitLoss;
        openHourMap[hour].noOfTrades += 1;
    }
    return Object.keys(openHourMap).map(function (hour) { return ({
        hour: hour,
        result: openHourMap[hour].result, noOfTrades: openHourMap[hour].noOfTrades
    }); });
};
var formatTime = function (rawTimeStr) {
    // In the general sense
    // extract the 18 in '2022-04-12T18:09:00+00:00' and return '18:00-18:59'
    var hour = rawTimeStr.split('T')[1].split(':')[0];
    return "".concat(hour, ":00 - ").concat(hour, ":59");
};
exports.default = openHourTableCalc;
//# sourceMappingURL=open-hour-table-calc.js.map