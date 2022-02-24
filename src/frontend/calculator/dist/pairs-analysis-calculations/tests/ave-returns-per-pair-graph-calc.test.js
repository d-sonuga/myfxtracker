"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ave_returns_per_pair_graph_calc_1 = __importDefault(require("../ave-returns-per-pair-graph-calc"));
/**
 * @Note -> these tests are far from done
 */
describe('Verify aveReturnsPerPairGraphCalc is working', function () {
    describe('When accountData.trades is empty', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, ave_returns_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [];
        test('it outputs an empty array', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is 1 trade', function () {
        var pair = 'GBPUSD';
        var profitLoss = 200;
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: pair,
                    profitLoss: profitLoss,
                    takeProfit: 0,
                    stopLoss: 0,
                    commission: 20,
                    swap: 12,
                    action: 'buy',
                    openTime: '2022-03-23T14:03:00Z',
                    closeTime: '2022-03-23T14:03:00Z'
                }
            ]
        };
        var result = (0, ave_returns_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [
            { pair: pair, result: profitLoss }
        ];
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=ave-returns-per-pair-graph-calc.test.js.map