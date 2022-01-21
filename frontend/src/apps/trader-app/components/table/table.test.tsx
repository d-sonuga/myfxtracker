import {formatHeaders} from '.'

describe('Test formatHeaders', () => {
    const testFormatHeaders = (input: any, expectedResult: any) => {
        const result = formatHeaders(input);
        expect(result).toEqual(expectedResult);
    }
    test('works with array of strings as input', () => {
        const onlyStringsInput = ['header1', 'header2', 'header3'];
        const onlyStringsExpectedResult = [[{name: 'header1'}, {name: 'header2'}, {name: 'header3'}]];
        testFormatHeaders(onlyStringsInput, onlyStringsExpectedResult);
    })
    test('works with array of objects as input', () => {
        const onlyObjectsInput = [{name: 'header1'}, {name: 'header2', colSpan: 3}, {name: 'header3'}];
        const onlyObjectsExpectedResult = [[{name: 'header1'}, {name: 'header2', colSpan: 3}, {name: 'header3'}]];
        testFormatHeaders(onlyObjectsInput, onlyObjectsExpectedResult);
    })
    test('works with an array of string arrays as input', () => {
        const stringArraysInput = [
            ['header1', 'header2', 'header3'],
            ['header4', 'header5']
        ];
        const stringArraysExpectedResult = [
            [{name: 'header1'}, {name: 'header2'}, {name: 'header3'}],
            [{name: 'header4'}, {name: 'header5'}]
        ]
        testFormatHeaders(stringArraysInput, stringArraysExpectedResult);
    })

});