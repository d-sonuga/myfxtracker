"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pairs_analysis_table_calc_1 = __importDefault(require("../pairs-analysis-table-calc"));
/** @Note these tests are far from complete */
describe('Verify that pairsAnalysisTableCalc is working', function () {
    describe('When there are no trades in accountData.trades', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, pairs_analysis_table_calc_1.default)(accountData);
        var expectedResult = [];
        test('it outputs an empty array', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there are 3 trades', function () {
        var pair1 = 'EURUSD';
        var pair2 = 'EURNOK';
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: pair1,
                    action: 'buy',
                    takeProfit: 20,
                    stopLoss: 15,
                    profitLoss: 200,
                    openTime: '2022-12-02T13:04:00Z',
                    closeTime: '2022-12-02T13:04:00Z',
                    commission: 20,
                    swap: 12
                },
                {
                    pair: pair1,
                    action: 'sell',
                    takeProfit: 10,
                    stopLoss: 5,
                    profitLoss: -500,
                    openTime: '2022-12-02T13:04:00Z',
                    closeTime: '2022-12-02T13:04:00Z',
                    commission: 10,
                    swap: 2
                },
                {
                    pair: pair2,
                    action: 'sell',
                    takeProfit: 10,
                    stopLoss: 5,
                    profitLoss: -500,
                    openTime: '2022-12-02T13:04:00Z',
                    closeTime: '2022-12-02T13:04:00Z',
                    commission: 10,
                    swap: 2
                }
            ]
        };
        var result = (0, pairs_analysis_table_calc_1.default)(accountData);
        var expectedResult = [
            {
                pair: pair1,
                noOfTradesOnPair: 2,
                noOfProfitableTradesOnPair: 1,
                noOfSlOnPair: 20,
                noOfLongsOnPair: 1,
                noOfShortsOnPair: 1,
                noOfLosingTradesOnPair: 1,
                noOfTpOnPair: 30,
                longsOnPairPercent: 50,
                shortsOnPairPercent: 50,
                losingTradesOnPairPercent: 50,
                tpOnPairPercent: 15,
                slOnPairPercent: 10,
                profitableTradesOnPairPercent: 50
            },
            {
                pair: pair2,
                noOfTradesOnPair: 1,
                noOfProfitableTradesOnPair: 0,
                noOfSlOnPair: 5,
                noOfLongsOnPair: 0,
                noOfShortsOnPair: 1,
                noOfLosingTradesOnPair: 1,
                noOfTpOnPair: 10,
                longsOnPairPercent: 0,
                shortsOnPairPercent: 100,
                losingTradesOnPairPercent: 100,
                tpOnPairPercent: 10,
                slOnPairPercent: 5,
                profitableTradesOnPairPercent: 0
            },
        ];
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=pairs-analysis-table-calc.test.js.map