import {GlobalData} from '../models'
import {PermissionsObj, PermissionFuncs} from './types'

/**
 * Couldn't use anonymous functions here because the name properties are needed
 */

function canAddAccount(globalData: GlobalData): boolean {
    console.log('In permissions func: (isSubscribed: ',
        globalData.userIsSubscribed(),
        ', onFreeTrial: ',
        globalData.userIsOnFreeTrial(),
        ')'
    );
    if(globalData.userIsSubscribed() || globalData.userIsOnFreeTrial()){
        return true;
    }
    return false;
}

function canRefreshAccount(globalData: GlobalData): boolean {
    return canAddAccount(globalData);
}

function canCreateNote(globalData: GlobalData): boolean {
    return canAddAccount(globalData);
}

function canModifyNotes(globalData: GlobalData): boolean {
    return canAddAccount(globalData);
}

const defaultPermissions: PermissionsObj = {
    canAddAccount: false,
    canRefreshAccount: false,
    canCreateNote: false,
    canModifyNotes: false
}

const permissionFuncs: PermissionFuncs = {
    'canAddAccount': canAddAccount,
    'canRefreshAccount': canRefreshAccount,
    'canCreateNote': canCreateNote,
    'canModifyNotes': canModifyNotes
}

export default permissionFuncs
export {
    defaultPermissions
}