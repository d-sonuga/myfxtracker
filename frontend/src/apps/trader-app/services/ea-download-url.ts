import {useState, useEffect} from 'react'
import Http, {HttpErrorType, HttpResponseType} from '@services/http'
import {HttpConst} from '@conf/const';


const useEaDownloadUrl = () => {
    const [mt4EaDownloadUrl, setMt4EaDownloadUrl] = useState('');
    const [mt5EaDownloadUrl, setMt5EaDownloadUrl] = useState('');
    const {BASE_URL, DOWNLOAD_EA_URL} = HttpConst
    useEffect(() => {
        Http.get({
            url: `${BASE_URL}/${DOWNLOAD_EA_URL}/?variant=mt4/`,
            successFunc: (resp: any) => {
                const file = new Blob([resp.data], {type: 'application/ex4'});
                const fileDownloadUrl = URL.createObjectURL(file);
                setMt4EaDownloadUrl(fileDownloadUrl)
            },
            errorFunc: (err: HttpErrorType) => {
                console.log('ea error', err);
            },
            extras: {
                responseType: 'blob'
            }
        })
        Http.get({
            url: `${BASE_URL}/${DOWNLOAD_EA_URL}/?variant=mt5/`,
            successFunc: (resp: HttpResponseType) => {
                const file = new Blob([resp.data], {type: 'application/ex5'});
                const fileDownloadUrl = URL.createObjectURL(file);
                setMt5EaDownloadUrl(fileDownloadUrl);
            },
            errorFunc: (err: HttpErrorType) => {
                console.log('ea error', err);
            },
            extras: {
                responseType: 'blob'
            }
        })
    }, [])
    return {
        'mt4': mt4EaDownloadUrl,
        'mt5': mt5EaDownloadUrl
    };
}

export default useEaDownloadUrl