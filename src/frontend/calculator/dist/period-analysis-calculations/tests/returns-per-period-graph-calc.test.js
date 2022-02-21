"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var returns_per_period_graph_calc_1 = __importDefault(require("../returns-per-period-graph-calc"));
/**
 * @Note These tests are far from done
 */
describe('Verify returnsPerPeriodGraphCalc is working', function () {
    describe('When accountData.trades is empty', function () {
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: []
        };
        var result = (0, returns_per_period_graph_calc_1.default)(accountData);
        var expectedResult = {
            daily: [
                { day: 'Monday', result: 0 },
                { day: 'Tuesday', result: 0 },
                { day: 'Wednesday', result: 0 },
                { day: 'Thursday', result: 0 },
                { day: 'Friday', result: 0 }
            ],
            monthly: [
                { month: 'January', result: 0 },
                { month: 'February', result: 0 },
                { month: 'March', result: 0 },
                { month: 'April', result: 0 },
                { month: 'May', result: 0 },
                { month: 'June', result: 0 },
                { month: 'July', result: 0 },
                { month: 'August', result: 0 },
                { month: 'September', result: 0 },
                { month: 'October', result: 0 },
                { month: 'November', result: 0 },
                { month: 'December', result: 0 },
            ],
            yearly: []
        };
        test('It outputs the default result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
    describe('When there is 1 trade', function () {
        // Friday 7th January, 2022
        var tradeTime = '2022-01-07T16:03:00Z';
        var accountData = {
            name: 'dummy account',
            deposits: [],
            withdrawals: [],
            trades: [
                {
                    pair: 'GBPUSD',
                    profitLoss: 200,
                    openTime: tradeTime,
                    closeTime: tradeTime,
                    takeProfit: 0,
                    stopLoss: 0,
                    action: 'buy',
                    commission: 20,
                    swap: 12
                }
            ]
        };
        var result = (0, returns_per_period_graph_calc_1.default)(accountData);
        var expectedResult = {
            daily: [
                { day: 'Monday', result: 0 },
                { day: 'Tuesday', result: 0 },
                { day: 'Wednesday', result: 0 },
                { day: 'Thursday', result: 0 },
                { day: 'Friday', result: 200 }
            ],
            monthly: [
                { month: 'January', result: 200 },
                { month: 'February', result: 0 },
                { month: 'March', result: 0 },
                { month: 'April', result: 0 },
                { month: 'May', result: 0 },
                { month: 'June', result: 0 },
                { month: 'July', result: 0 },
                { month: 'August', result: 0 },
                { month: 'September', result: 0 },
                { month: 'October', result: 0 },
                { month: 'November', result: 0 },
                { month: 'December', result: 0 },
            ],
            yearly: [
                { year: 2022, result: 200 }
            ]
        };
        test('it outputs the correct result', function () {
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=returns-per-period-graph-calc.test.js.map