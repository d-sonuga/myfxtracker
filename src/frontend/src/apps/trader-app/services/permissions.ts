import {GlobalData} from '../models'
import { PermissionsObj } from './types';

const canAddAccount = (globalData: GlobalData): boolean => {
    if(globalData.userIsSubscribed() || globalData.userIsOnFreeTrial()){
        return true;
    }
    return false;
}

const canRefreshAccount = (globalData: GlobalData): boolean => {
    return canAddAccount(globalData);
}

const canCreateNote = (globalData: GlobalData): boolean => {
    return canAddAccount(globalData);
}

const canModifyNotes = (globalData: GlobalData): boolean => {
    return canAddAccount(globalData);
}

const defaultPermissions: PermissionsObj = {
    canAddAccount: false,
    canRefreshAccount: false,
    canCreateNote: false,
    canModifyNotes: false
}

const permissionFuncs = [
    canAddAccount,
    canRefreshAccount,
    canCreateNote,
    canModifyNotes
]

export default permissionFuncs
export {
    defaultPermissions
}