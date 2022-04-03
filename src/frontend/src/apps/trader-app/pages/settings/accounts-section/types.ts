import {AccountData} from 'calculator/dist'

type AccountsSectionPropTypes = {
    accounts: AccountDataWithId[],
    removeAccountFromData: Function,
    userIsOnFreeTrial: boolean
}

type AccountDataWithId = AccountData & {id: number}

export type {
    AccountsSectionPropTypes,
    AccountDataWithId
}