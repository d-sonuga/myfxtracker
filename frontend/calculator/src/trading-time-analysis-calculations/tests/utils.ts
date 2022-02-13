import _ from 'lodash'
import {randomInt} from '@root/utils'


const openHours = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
]

const randomTime = () => {
    const randomMinutes = () => {
        const min = randomInt(1, 59);
        return min < 10 ? `0${min.toString()}` : min.toString();
    };
    const randomHour = () => openHours[randomInt(0, 12)].split(':')[0];
    return randomHour() + ':' + randomMinutes() + ':00Z';
}

const randomDate = () => {
    const randomYear = randomInt(1970, 3000);
    const randomMonth = randomInt(1, 12);
    const randomDay = randomInt(1, 28);
    const randomMonthStr = randomMonth < 10 ? `0${randomMonth}` : randomMonth.toString();
    const randomDayStr = randomDay < 10 ? `0${randomDay}` : randomDay.toString();
    return `${randomYear}-${randomMonthStr}-${randomDayStr}`
}

/**
 * 
 * @param arrayToOrder array of objects which are considered to be out of order
 * @param orderedArray array of objects which are considered to be in order with respect to their anchor keys
 * @param anchorKey the key which is used for the ordering
 * @returns the arrayToOrder in order
 */
const putInSameOrder = <T>(arrayToOrder: T[], orderedArray: T[], anchorKey: keyof(T)) => {
    let result = _.cloneDeep(arrayToOrder);
    let newlyOrderedArray: T[] = [];
    orderedArray.forEach((orderedItem: T) => {
        for(const resultItem of result){
            if(resultItem[anchorKey] == orderedItem[anchorKey]){
                result = result.filter((item) => !(item[anchorKey] == orderedItem[anchorKey]));
                newlyOrderedArray.push(resultItem);
            }
        }
    });
    if(result.length !== 0){
        throw Error('They are not the same');
    }
    return newlyOrderedArray;
}

export {
    randomTime,
    randomDate,
    putInSameOrder
}