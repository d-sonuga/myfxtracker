import {GlobalData} from '../models'

type PermissionsObj = {
    canAddAccount: boolean,
    canRefreshAccount: boolean,
    canCreateNote: boolean,
    canModifyNotes: boolean
}

type PermissionFuncs = Record<string, (globalData: GlobalData) => boolean>

export type {
    PermissionsObj,
    PermissionFuncs
}