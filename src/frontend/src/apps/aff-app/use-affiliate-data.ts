import { useState, useContext } from 'react'
import { HttpConst } from '@conf/const'
//import Http, { HttpErrorType, HttpResponseType } from '@services/http'
import {Http, HttpResponseType, HttpErrorType} from '@apps/trader-app/services'
import lodash from 'lodash'
import { useEffect } from 'react'
import { ToastContext } from '@components/toast'

const useAffiliateData = (): UseAffiliateDataType => {
    const [data, setData] = useState(new AffiliateData(initEmptyRawData));
    const Toast = useContext(ToastContext);

    useEffect(() => {
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
    getBankAccountNumber(): number | undefined | null {
        return this.rawData.bank_account_number
    }
    setBankAccountNumber(newBankAccountNumber: number): AffiliateData {
        const rawDataClone = lodash.clone(this.rawData);
        rawDataClone.bank_account_number = newBankAccountNumber;
        return new AffiliateData(rawDataClone)
    }
}

const initEmptyRawData: RawData = {
    username: '',
    no_of_sign_ups: 0,
    no_of_subscribers: 0,
    bank_account_number: undefined
}

type RawData = {
    username: string,
    no_of_sign_ups: number,
    no_of_subscribers: number,
    bank_account_number?: number | null
}

export default useAffiliateData
export {AffiliateData}