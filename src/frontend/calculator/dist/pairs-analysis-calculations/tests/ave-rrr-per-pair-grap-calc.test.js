"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var overview_calculations_1 = require("../../overview-calculations");
var ave_rrr_per_pair_graph_calc_1 = __importDefault(require("../ave-rrr-per-pair-graph-calc"));
describe('Verify that aveRrrPerPairGraphCalc is working', function () {
    describe('When there are no trades', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, ave_rrr_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [];
        test('it outputs an empty array', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is 1 trade', function () {
        var pair = 'GBPUSD';
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: pair,
                    action: 'buy',
                    commission: 20,
                    takeProfit: 20,
                    stopLoss: 32,
                    swap: 20,
                    profitLoss: 200,
                    openTime: '2022-09-04T13:02:00Z',
                    closeTime: '2022-09-04T13:02:00Z',
                    openPrice: 0,
                    closePrice: 0
                }
            ]
        };
        var result = (0, ave_rrr_per_pair_graph_calc_1.default)(accountData);
        var expectedResult = [
            { pair: pair, rrr: (0, overview_calculations_1.aveRRR)(accountData) }
        ];
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=ave-rrr-per-pair-grap-calc.test.js.map