import axios from 'axios'
import {HttpMsg} from '@services/generic-msg'
import {ConfigConst} from '@conf/const'
import {HttpClientType, HttpPostConfigType, HttpDeleteConfigType, HttpPutConfigType,
    HandleResolveRequestConfig, HttpGetConfigType} from './types'

const getDefaultHeaders = (noToken: boolean | undefined) => {
    let headers = {
        'Content-Type': 'application/json',
    }
    if(noToken){
        return headers;
    }
    return {
        ...headers,
        'Authorization': `Token ${localStorage.getItem(ConfigConst.TOKEN_KEY)}`
    }
}

const defaultConfig = {
    timeout: 10000
}

/**
 * A function to implement the same success and error handling logic for all http request functions
 * @param axiosPromise: the promise returned from any of the http request functions
 * @param config: the config passed to any of the http request functions
 * @returns: the same promise, but with a shared implementation of generic error handling
 */
const handleResolveRequest = (axiosPromise: Promise<any>, config: HandleResolveRequestConfig) => {
    return axiosPromise
        .then((resp) => config.successFunc(resp))
        .catch((err) => {
            if(err.message === 'Network Error') {
                Http.toast.error(HttpMsg.noConnectionErr());
                if(config.networkErrorFunc){
                    return config.networkErrorFunc(err);
                }
            } else if(err.message === 
                `timeout of ${config.timeout ? config.timeout : defaultConfig.timeout}ms exceeded`) {
                    Http.toast.error(HttpMsg.connectionTimeOutErr())
                    if(config.timeoutErrorFunc){
                        return config.timeoutErrorFunc(err);
                    }
            } else {
                return config.errorFunc(err);
            }
        })
        .then((data) => {
            if(config.thenFunc){
                return config.thenFunc(data);
            }
            return Promise.resolve(data);
        })
}

const get = (config: HttpGetConfigType) => {
    return handleResolveRequest(axios.get(
        config.url, {
            headers: getDefaultHeaders(config.noToken),
            ...defaultConfig,
            timeout: config.timeout ? config.timeout : defaultConfig.timeout,
            ...Object.assign({}, config.extras ? config.extras : {})
        }
    ), config);
        
}

const post = (config: HttpPostConfigType) => {
    return handleResolveRequest(axios.post(
        config.url,
        config.data,
        {
            headers: getDefaultHeaders(config.noToken),

            ...defaultConfig,
            timeout: config.timeout ? config.timeout : defaultConfig.timeout,
            ...Object.assign({}, config.extras ? config.extras : {})
        }
    ), config);
}

const put = (config: HttpPutConfigType) => {
    return handleResolveRequest(axios.put(
        config.url,
        config.data,
        {
            headers: getDefaultHeaders(config.noToken),
            ...defaultConfig,
            timeout: config.timeout ? config.timeout : defaultConfig.timeout,
            ...Object.assign({}, config.extras ? config.extras : {})
        }
    ), config);
}

const httpDelete = (config: HttpDeleteConfigType) => {
    return handleResolveRequest(axios.delete(
        config.url,
        {
            headers: getDefaultHeaders(config.noToken),
            ...defaultConfig,
            timeout: config.timeout ? config.timeout : defaultConfig.timeout,
            ...Object.assign({}, config.extras ? config.extras : {})
        }
    ), config);
}

const Http: HttpClientType = {
    get,
    post,
    put,
    delete: httpDelete,
    toast: {
        error: (msg: any) => console.log('Toast is null')
    },
    init: function(toast: {[key: string]: Function}) {
        this.toast = toast;
    },
    createCancelRequestToken: () => axios.CancelToken.source()
}

export default Http
export * from './types'