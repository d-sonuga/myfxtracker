import {useEffect, useState} from 'react'
import {HttpConst} from '@conf/const'
import Http, {HttpErrorType, HttpResponseType} from '@services/http'


const useNoteData = (): Promise<any> => {
    const {BASE_URL, GET_ALL_NOTES_URL} = HttpConst;
    const [noteData, setNoteData] = useState<Promise<any>>(new Promise((resolve, reject) => {}));
    useEffect(() => {
        Http.get({
            url: `${BASE_URL}/${GET_ALL_NOTES_URL}/`,
            successFunc: (resp: HttpResponseType) => {
                setNoteData(Promise.resolve(resp.data));
            },
            errorFunc: (err: HttpErrorType) => {
                setNoteData(Promise.resolve(err));
            }
        })
    }, [])
    return noteData;
}

export default useNoteData