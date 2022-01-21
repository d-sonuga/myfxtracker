/*
*   Utilities for getting configurations
*   All colors in the css variables are prefixed with --color
*   All dimensions in the css variables are prefixed with --dimen
*/
import useScreenIsSmall from './use-screen-is-small'

const colorPrefix = '--color';
const dimenPrefix = '--dimen';

const getColor = (name: string) => {
    return _getAttr(`${colorPrefix}-${name}`) ? _getAttr(`${colorPrefix}-${name}`) : '';
}

const getDimen = (name: string) => {
    return _getAttr(`${dimenPrefix}-${name}`) ? _getAttr(`${dimenPrefix}-${name}`) : '';
}

const getDimenInNo = (name: string) => {
    let dimen = _getAttr(`${dimenPrefix}-${name}`) ? _getAttr(`${dimenPrefix}-${name}`) : '';
    return _extractNo(dimen);
}

const getWindowWidth = () => {
    return window.innerWidth
}

const screenIsSmall = () => {
    return getWindowWidth() < getDimenInNo('big-screen')
}

const _getAttr = (name: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

const _extractNo = (dimen: string) => {
    let no = '';
    for(let char of dimen) {
        if(isNaN(parseInt(char))) {
            break;
        }
        no += char;
    }
    return parseInt(no);
}

export {getColor, getDimen, getWindowWidth, getDimenInNo, screenIsSmall, useScreenIsSmall}