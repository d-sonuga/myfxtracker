import {useState, useEffect} from 'react'
import Http, {HttpErrorType, HttpResponseType} from '@services/http'
import { HttpConst } from '@conf/const';


const useEaDownloadUrl = () => {
    const [eaDownloadUrl, setEaDownloadUrl] = useState('');
    const {BASE_URL, DOWNLOAD_EA_URL} = HttpConst
    useEffect(() => {
        Http.get({
            url: `${BASE_URL}/${DOWNLOAD_EA_URL}/`,
            successFunc: (resp: HttpResponseType) => {
                const file = new Blob([resp.data], {type: 'plain/txt'});
                const fileDownloadUrl = URL.createObjectURL(file);
                setEaDownloadUrl(fileDownloadUrl)
            },
            errorFunc: (err: HttpErrorType) => {
                console.log('ea error', err);
            }
        })
    }, [])
    return eaDownloadUrl
}

export default useEaDownloadUrl