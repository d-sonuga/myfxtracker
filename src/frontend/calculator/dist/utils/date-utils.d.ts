/**
 * A year to be used in date sentinels to represent dates whose values
 * are to far in the future for real date to be ahead of the same way
 * infinity is used in number sentinels to represent
 * "a number no other number is larger than"
 * */
declare const FAR_IN_THE_FUTURE_YEAR = 200000;
/**
 * Does the date in @param dateStr fall in the same day as @param otherDate
 */
declare const sameDay: (dateStr: string, otherDate: Date) => boolean;
/**
 * Does the date in @param dateStr fall in the same week as @param otherDate
 */
declare const sameWeek: (dateStr: string | Date, otherDate: Date) => boolean;
/**
 * Does the date in @param dateStr fall in the same month as @param otherDate
 */
declare const sameMonth: (dateStr: string, otherDate: Date) => boolean;
/**
 * Does the date in @param dateStr fall in the same year as @param otherDate
 */
declare const sameYear: (dateStr: string, otherDate: Date) => boolean;
export { sameDay, sameWeek, sameMonth, sameYear, FAR_IN_THE_FUTURE_YEAR };
//# sourceMappingURL=date-utils.d.ts.map