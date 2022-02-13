import {HttpConst} from '@conf/const'
import Http, {HttpErrorType, HttpResponseType} from '@services/http'


const getNoteData = (): Promise<any> => {
    const {BASE_URL, GET_ALL_NOTES_URL} = HttpConst
    return Http.get({
        url: `${BASE_URL}/${GET_ALL_NOTES_URL}/`,
        successFunc: (resp: HttpResponseType) => {
            return Promise.resolve(resp);
        },
        errorFunc: (err: HttpErrorType) => {
            return Promise.resolve(err);
        }
    })
}

export default getNoteData