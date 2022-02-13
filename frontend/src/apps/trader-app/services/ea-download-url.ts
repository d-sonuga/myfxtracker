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
            successFunc: (resp: HttpResponseType) => {
                const file = new Blob([resp.data], {type: 'plain/txt'});
                const fileDownloadUrl = URL.createObjectURL(file);
                setMt4EaDownloadUrl(fileDownloadUrl)
            },
            errorFunc: (err: HttpErrorType) => {
                console.log('ea error', err);
            }
        })
        Http.get({
            url: `${BASE_URL}/${DOWNLOAD_EA_URL}/?variant=mt5/`,
            successFunc: (resp: HttpResponseType) => {
                const file = new Blob([resp.data], {type: 'plain/txt'});
                const fileDownloadUrl = URL.createObjectURL(file);
                setMt5EaDownloadUrl(fileDownloadUrl);
            },
            errorFunc: (err: HttpErrorType) => {
                console.log('ea error', err);
            }
        })
    }, [])
    return {
        'mt4': mt4EaDownloadUrl,
        'mt5': mt5EaDownloadUrl
    };
}

export default useEaDownloadUrl