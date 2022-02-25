"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var long_short_comp_graph_calc_1 = __importDefault(require("../long-short-comp-graph-calc"));
/**
 * @TODO add proper tests (these things in this file are not tests)
 */
describe('Verify that longShortComparisonGraphCalc is working', function () {
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
        var result = (0, long_short_comp_graph_calc_1.default)(accountData);
        var expectedResult = [
            { label: 'long', result: 0 },
            { label: 'short', result: 0 }
        ];
        test('long and short results are the default results', function () {
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
                takeProfit: 0,
                openPrice: 0,
                closePrice: 0
            }
        ];
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: trades
        };
        var result = (0, long_short_comp_graph_calc_1.default)(accountData);
        var expectedResult = [
            { label: 'long', result: tradeProfitLoss },
            { label: 'short', result: 0 }
        ];
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
                takeProfit: 0,
                stopLoss: 0,
                openPrice: 0,
                closePrice: 0
            }
        ];
        var accountData = {
            name: 'dummy account',
            deposits: deposits,
            withdrawals: withdrawals,
            trades: trades
        };
        var result = (0, long_short_comp_graph_calc_1.default)(accountData);
        var expectedResult = [
            { label: 'long', result: 0 },
            { label: 'short', result: tradeProfitLoss }
        ];
        test('it outputs results with the correct data', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=long-short-comp-graph-calc.test.js.map