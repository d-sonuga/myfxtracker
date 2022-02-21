/**
 * Functions for calculating the info on the weekly summary table
 * The weekly summary calculates the total number of trades,
 * lots and profit gotten for each day of the current week,
 * from Friday to Monday
 */
import { OverviewWeeklySummaryCalc } from './types';
import { AccountData } from '../types';
declare const weeklySummaryCalc: (accountData: AccountData, today?: Date) => OverviewWeeklySummaryCalc;
/** Receives a date and returns the dates of all days in the week, from monday to friday */
declare const getWeekDates: (today: Date) => Date[];
export default weeklySummaryCalc;
export { getWeekDates };
//# sourceMappingURL=weekly-summary-calc.d.ts.map