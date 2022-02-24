"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noOfTrades = exports.winRate = exports.totalNoOfWinningTrades = exports.totalNoOfShortsWon = exports.totalNoOfLongsWon = exports.shortsWonPercent = exports.longsWonPercent = exports.totalNoOfShorts = exports.totalNoOfLongs = void 0;
var totalNoOfLongs = function (data) {
    var noOfLongs = 0;
    if (Array.isArray(data)) {
        noOfLongs = noOfLongsFromTradeArray(data);
    }
    else {
        noOfLongs = noOfLongsFromAccountData(data);
    }
    return noOfLongs;
};
exports.totalNoOfLongs = totalNoOfLongs;
var noOfLongsFromTradeArray = function (trades) {
    var noOfLongs = 0;
    for (var _i = 0, trades_1 = trades; _i < trades_1.length; _i++) {
        var trade = trades_1[_i];
        if (trade.action === 'buy') {
            noOfLongs += 1;
        }
    }
    return noOfLongs;
};
var noOfLongsFromAccountData = function (accountData) {
    var noOfLongs = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.action === 'buy') {
            noOfLongs += 1;
        }
    }
    return noOfLongs;
};
var totalNoOfShorts = function (data) {
    var noOfShorts = 0;
    if (Array.isArray(data)) {
        noOfShorts = noOfShortsFromTradesArray(data);
    }
    else {
        noOfShorts = noOfShortsFromAccountData(data);
    }
    return noOfShorts;
};
exports.totalNoOfShorts = totalNoOfShorts;
var noOfShortsFromTradesArray = function (trades) {
    var noOfShorts = 0;
    for (var _i = 0, trades_2 = trades; _i < trades_2.length; _i++) {
        var trade = trades_2[_i];
        if (trade.action === 'sell') {
            noOfShorts += 1;
        }
    }
    return noOfShorts;
};
var noOfShortsFromAccountData = function (accountData) {
    var noOfShorts = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.action === 'sell') {
            noOfShorts += 1;
        }
    }
    return noOfShorts;
};
var totalNoOfLongsWon = function (accountData) {
    var noOfLongsWon = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.action === 'buy') {
            if (trade.profitLoss > 0) {
                noOfLongsWon += 1;
            }
        }
    }
    return noOfLongsWon;
};
exports.totalNoOfLongsWon = totalNoOfLongsWon;
var longsWonPercent = function (accountData) {
    var noOfLongsWon = totalNoOfLongsWon(accountData);
    var noOfLongs = totalNoOfLongs(accountData);
    if (noOfLongs === 0)
        return 0;
    return (noOfLongsWon / noOfLongs) * 100;
};
exports.longsWonPercent = longsWonPercent;
var totalNoOfShortsWon = function (accountData) {
    var noOfShortsWon = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.action === 'sell') {
            if (trade.profitLoss > 0) {
                noOfShortsWon += 1;
            }
        }
    }
    return noOfShortsWon;
};
exports.totalNoOfShortsWon = totalNoOfShortsWon;
var shortsWonPercent = function (accountData) {
    var noOfShortsWon = totalNoOfShortsWon(accountData);
    var noOfShorts = totalNoOfShorts(accountData);
    if (noOfShorts === 0)
        return 0;
    return (noOfShortsWon / noOfShorts) * 100;
};
exports.shortsWonPercent = shortsWonPercent;
/** Counts the number of profitable trades in account */
var totalNoOfWinningTrades = function (data) {
    var totalNoOfWinningTrades = 0;
    if (Array.isArray(data)) {
        totalNoOfWinningTrades = totalNoOfWinningTradesFromTradesArray(data);
    }
    else {
        totalNoOfWinningTrades = totalNoOfWinningTradesFromAccountData(data);
    }
    return totalNoOfWinningTrades;
};
exports.totalNoOfWinningTrades = totalNoOfWinningTrades;
var totalNoOfWinningTradesFromAccountData = function (accountData) {
    var totalNoOfWinningTrades = 0;
    for (var _i = 0, _a = accountData.trades; _i < _a.length; _i++) {
        var trade = _a[_i];
        if (trade.profitLoss > 0) {
            totalNoOfWinningTrades += 1;
        }
    }
    return totalNoOfWinningTrades;
};
var totalNoOfWinningTradesFromTradesArray = function (trades) {
    var totalNoOfWinningTrades = 0;
    for (var _i = 0, trades_3 = trades; _i < trades_3.length; _i++) {
        var trade = trades_3[_i];
        if (trade.profitLoss > 0) {
            totalNoOfWinningTrades += 1;
        }
    }
    return totalNoOfWinningTrades;
};
/**
 * Calculates winning trades divided by total number of trades
 * expressed as a percentage
 */
var winRate = function (data) {
    var noOfWinningTrades = totalNoOfWinningTrades(data);
    var noOfTradess = noOfTrades(data);
    if (noOfTradess === 0)
        return 0;
    return (noOfWinningTrades / noOfTradess) * 100;
};
exports.winRate = winRate;
/** Counts the number of trades in account */
var noOfTrades = function (data) {
    if (Array.isArray(data)) {
        return data.length;
    }
    return data.trades.length;
};
exports.noOfTrades = noOfTrades;
//# sourceMappingURL=common-calc.js.map