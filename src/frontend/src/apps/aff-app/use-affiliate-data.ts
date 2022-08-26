import { useState, useContext } from 'react'
import { HttpConst } from '@conf/const'
//import Http, { HttpErrorType, HttpResponseType } from '@services/http'
import {Http, HttpResponseType, HttpErrorType} from '@apps/trader-app/services'
import lodash from 'lodash'
import { useEffect } from 'react'
import { ToastContext } from '@components/toast'
import { ToastFuncType } from '@components/toast/types'

const useAffiliateData = (): UseAffiliateDataType => {
    const [data, setData] = useState(new AffiliateData(initEmptyRawData));
    const Toast = useContext(ToastContext);

    useEffect(() => {
        AffiliateData.refreshData(setData, Toast);
    }, [])
    return [data, setData]
}

type UseAffiliateDataType = [AffiliateData, React.Dispatch<React.SetStateAction<AffiliateData>> ]


class AffiliateData {
    rawData: RawData;

    constructor(rawData: RawData | null) {
        if(rawData === null) {
            this.rawData = initEmptyRawData;
        } else {
            this.rawData = rawData;
        }
    }
    hasLoaded(): boolean {
        return this.rawData.username.length !== 0
    }
    getUsername(): string {
        return this.rawData.username
    }
    getNoOfSignUps(): number {
        return this.rawData.no_of_sign_ups
    }
    getNoOfSubscribers(): number {
        return this.rawData.no_of_subscribers
    }
    getBankAccountNumber(): number {
        const number = this.rawData.bank_account_number;
        if(number === undefined || number === null){
            return 0
        } else {
            return number;
        }
    }
    getBankName(): string {
        const name = this.rawData.bank_name;
        if(name === undefined || name === null) {
            return ''
        } else {
            return name
        }
    }
    getBankAccountName(): string {
        const name = this.rawData.bank_account_name;
        if(name === undefined || name === null) {
            return ''
        } else {
            return name
        }
    }
    setBankAccountNumber(newBankAccountNumber: number): AffiliateData {
        const rawDataClone = lodash.clone(this.rawData);
        rawDataClone.bank_account_number = newBankAccountNumber;
        return new AffiliateData(rawDataClone)
    }
    setBankName(newBankName: string): AffiliateData {
        const rawDataClone = lodash.clone(this.rawData);
        rawDataClone.bank_name = newBankName;
        return new AffiliateData(rawDataClone)
    }
    setBankAccountName(newBankAccountName: string): AffiliateData {
        const rawDataClone = lodash.clone(this.rawData);
        rawDataClone.bank_account_name = newBankAccountName;
        return new AffiliateData(rawDataClone)
    }
    static refreshData(setData: (data: AffiliateData) => void, Toast: ToastFuncType): void {
        const {BASE_URL, AFF_INIT_DATA_URL} = HttpConst;
        Http.get({
            url: `${BASE_URL}/${AFF_INIT_DATA_URL}/`,
            successFunc: (resp: HttpResponseType) => {
                setData(new AffiliateData(resp.data));
            },
            errorFunc: (err: HttpErrorType) => {
                Toast.error('Sorry. Something went wrong.');
            }
        })
    }
}

const initEmptyRawData: RawData = {
    username: '',
    no_of_sign_ups: 0,
    no_of_subscribers: 0,
    bank_account_number: undefined,
    bank_account_name: '',
    bank_name: ''
}

type RawData = {
    username: string,
    no_of_sign_ups: number,
    no_of_subscribers: number,
    bank_account_number?: number | null,
    bank_name?: string | null,
    bank_account_name?: string | null
}

export default useAffiliateData
export {AffiliateData}