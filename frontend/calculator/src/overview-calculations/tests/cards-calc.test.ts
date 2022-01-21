import overviewCardsCalc from '../overview-cards-calc'
import {OverviewCardsCalc} from '../types'
import {Deposit, Withdrawal, AccountData, Trade} from '@root/types'


describe('Verify that overviewCardsCalc is working', () => {
    describe('When accountData.trades is empty', () => {
        const dummyDeposits: Deposit[] = [];
        const dummyWithdrawals: Withdrawal[] = [];
        const trades: Trade[] = [];
        const dummyAccountData: AccountData = {
            name: 'dummy account',
            deposits: dummyDeposits,
            withdrawals: dummyWithdrawals,
            trades
        }
        const result = overviewCardsCalc(dummyAccountData);
        const expectedResult: OverviewCardsCalc = {
            totalBalance: 0,
            noOfTrades: 0,
            winRate: 0,
            absGain: 0
        }
        test('it outputs all calc fields as 0', () => {
            expect(result).toEqual(expectedResult);
        })
    })
    describe('When accountData.trades is not empty', () => {
        describe('When only 1 trade has been taken', () => {
            const depositAmount = 300;
            const withdrawalAmount = 140;
            const tradeProfitLoss = 430
            const dummyDateStr = '2022-12-03'
            const dummyDeposits: Deposit[] = [
                {account: 1, amount: depositAmount, date: dummyDateStr}
            ];
            const dummyWithdrawals: Withdrawal[] = [
                {account: 1, amount: withdrawalAmount, date: dummyDateStr}
            ];
            const trades: Trade[] = [
                {
                    pair: 'GBPJPY',
                    action: 'buy',
                    entry_date: '2022-12-03',
                    exit_date: '2022-12-03',
                    risk_reward_ratio: 3.4,
                    profit_loss: tradeProfitLoss,
                    pips: 3,
                    notes: '',
                    entry_image_link: '',
                    exit_image_link: '',
                    date_added: '2022-12-03',
                    lots: 3,
                    commissions: 34,
                    swap: 43
                }
            ];
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const result = overviewCardsCalc(dummyAccountData);
            const expectedResult: OverviewCardsCalc = {
                totalBalance: tradeProfitLoss + depositAmount - withdrawalAmount,
                noOfTrades: 1,
                winRate: 100,
                absGain: (tradeProfitLoss / depositAmount) * 100
            }
            test('correct field values are outputted', () => {
                expect(result).toEqual(expectedResult);
            })
        })
        describe('When many trades have been taken', () => {
            // Changed when populating the tradeProfitLosses array
            const generateRandomAmounts = (noNegative: boolean = false) => {
                const randomAmount = (magnitude: number, sign: number) => {
                    // bigger numbers for bigger magnitudes
                    // -1 for negative sign, 1 for positive sign
                    return magnitude * Math.random() * sign;
                }
                const amountSetNo = 100000
                const amounts: number[] = [];
                let sign = 1;
                let magnitude = 1;
                for(let i=0; i<amountSetNo; i++){
                    if(i === 1000){
                        magnitude = 1000
                    } else if(i === 100000){
                        magnitude = 1000000
                    } else if(i === 1000000){
                        magnitude = 1000000000
                    }
                    if(i % 2 === 1){
                        sign = noNegative ? 1 : -1
                    } else {
                        sign = 1
                    }
                    amounts.push(randomAmount(magnitude, sign));
                }
                return amounts
            }
            const sum = (array: number[]) => {
                let sum = 0;
                for(const i of array){
                    sum += i;
                }
                return sum
            }
            const depositAmounts = generateRandomAmounts();
            const withdrawalAmounts = generateRandomAmounts(false);
            const tradeProfitLosses = generateRandomAmounts();
            const noOfWinningTrades = tradeProfitLosses.filter((amount) => amount >= 0).length
            // the date is unimportant in this test
            const dummyDateStr = '2022-12-03'
            // build the data set of deposits, withdrawals and trades
            const dummyDeposits: Deposit[] = depositAmounts.map((depositAmount) => (
                {account: 1, amount: depositAmount, date: dummyDateStr}
            ));
            const dummyWithdrawals: Withdrawal[] = withdrawalAmounts.map((withdrawalAmount) => (
                {account: 1, amount: withdrawalAmount, date: dummyDateStr}
            ));
            const trades: Trade[] = tradeProfitLosses.map((tradeProfitLoss) => (
                {
                    pair: 'GBPJPY',
                    action: 'buy',
                    entry_date: '2022-12-03',
                    exit_date: '2022-12-03',
                    risk_reward_ratio: 3.4,
                    profit_loss: tradeProfitLoss,
                    pips: 3,
                    notes: '',
                    entry_image_link: '',
                    exit_image_link: '',
                    date_added: '2022-12-03',
                    lots: 3,
                    commissions: 34,
                    swap: 43
                }
            ))
            const dummyAccountData: AccountData = {
                name: 'dummy account',
                deposits: dummyDeposits,
                withdrawals: dummyWithdrawals,
                trades
            }
            const result = overviewCardsCalc(dummyAccountData);
            const expectedResult: OverviewCardsCalc = {
                totalBalance: sum(tradeProfitLosses) + sum(depositAmounts) - sum(withdrawalAmounts),
                noOfTrades: tradeProfitLosses.length,
                winRate: (noOfWinningTrades / tradeProfitLosses.length) * 100,
                absGain: (sum(tradeProfitLosses) / sum(depositAmounts)) * 100
            }
            test('correct field values are outputted', () => {
                expect(result).toEqual(expectedResult);
            })
        });
    })
})
