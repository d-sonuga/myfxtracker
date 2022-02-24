"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var long_short_comp_table_calc_1 = __importDefault(require("../long-short-comp-table-calc"));
/**
 * @TODO add proper tests (these things in this file are not tests)
 */
describe('Verify that longShortComparisonTableCalc is working', function () {
    /**
     * date of trade, Deposits and withdrawals aren't needed for these tests
     * because they aren't used in any of the calculations
     */
    var deposits = [];
    var withdrawals = [];
    var tradeDateStr = '2022-10-20T18:34:00Z';
    describe('When there are no trades in accountData', function () {
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: []
        };
        var result = (0, long_short_comp_table_calc_1.default)(accountData);
        var defaultResult = {
            noOfTrades: 0,
            result: 0,
            winRate: 0,
            aveProfit: 0,
            rrr: 0
        };
        var expectedResult = {
            long: defaultResult,
            short: defaultResult
        };
        test('all long and short results are the default results', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is only 1 long (action = buy) trade in accountData', function () {
        var tradeProfitLoss = 300;
        var trades = [
            {
                pair: 'GBPJPY',
                action: 'buy',
                openTime: tradeDateStr,
                closeTime: tradeDateStr,
                riskRewardRatio: 3,
                profitLoss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 3,
                commission: 2.3,
                swap: 3,
                stopLoss: 0,
                takeProfit: 0
            }
        ];
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: trades
        };
        var result = (0, long_short_comp_table_calc_1.default)(accountData);
        var defaultResult = {
            noOfTrades: 0,
            result: 0,
            winRate: 0,
            aveProfit: 0,
            rrr: 0
        };
        var expectedResult = {
            long: {
                noOfTrades: 1,
                result: tradeProfitLoss,
                winRate: 100,
                aveProfit: tradeProfitLoss,
                rrr: 0
            },
            short: defaultResult
        };
        test('it outputs results with the correct data', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is only 1 short (action = sell) trade in accountData', function () {
        var tradeProfitLoss = 300;
        var trades = [
            {
                pair: 'GBPJPY',
                action: 'sell',
                openTime: tradeDateStr,
                closeTime: tradeDateStr,
                riskRewardRatio: 3,
                profitLoss: tradeProfitLoss,
                pips: 3,
                notes: '',
                entryImageLink: '',
                exitImageLink: '',
                lots: 3,
                commission: 2.3,
                swap: 3,
                stopLoss: 0,
                takeProfit: 0
            }
        ];
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: trades
        };
        var result = (0, long_short_comp_table_calc_1.default)(accountData);
        var defaultResult = {
            noOfTrades: 0,
            result: 0,
            winRate: 0,
            aveProfit: 0,
            rrr: 0
        };
        var expectedResult = {
            long: defaultResult,
            short: {
                noOfTrades: 1,
                result: tradeProfitLoss,
                winRate: 100,
                aveProfit: tradeProfitLoss,
                rrr: 0
            }
        };
        test('it outputs results with the correct data', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=long-short-comp-table-calc.test.js.map