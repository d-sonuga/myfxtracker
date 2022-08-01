import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import { CancellationToken } from 'typescript';

/**
 * Type of the Http client used throughout the app
 */
type HttpClientType = {
    /**
     * The Http get function
     * 
     * config params
     * -------------
     * @param url: url to make request to
     * @param successFunc: Function to call on success
     * @param errorFunc: Function to call on error
     * @param thenFunc: Function to call after request, whether there is a success or failure
     * @param noToken: Should the token be included in the header?
     * @param timeout: how long is too long
    */
    get: (config: HttpGetConfigType) => Promise<any>,
    delete: (config: HttpDeleteConfigType) => Promise<void>,
    /** The same config params as get, but with data 
     * @param data: the data to be posted
    */
    post: (config: HttpPostConfigType) => Promise<void>,
    put: (config: HttpPostConfigType) => Promise<void>,
    /**
     * Toast for error messages
     */
    toast: {
        [error: string]: Function
    },
    /**
     * Init to initialize the toast function on page load
     */
    init: Function,
    /**
     * To create a token used to cancel a request
     */
    createCancelRequestToken: Function
}

/**
 * Base type of the config object passed as the argument of the Http client
 */
interface HttpRequestConfigType {
    url: string, 
    successFunc: Function,
    errorFunc: Function,
    networkErrorFunc?: Function,
    timeoutErrorFunc?: Function,
    thenFunc?: Function,
    noToken?: boolean, 
    timeout?: number,
    extras?: Partial<AxiosRequestConfig>,
}

type HttpGetConfigType = HttpRequestConfigType;

type HttpPutConfigType = HttpPostConfigType;

type HttpDeleteConfigType = HttpRequestConfigType;

/**
 * Type of the config object for the Http client's post function
 */
interface HttpPostConfigType extends HttpRequestConfigType {
    /**
     * Data to be posted
     */
    data: object
}

/** 
 * The generic config type for all request functions to share a base
 * function to handle the resolving of a request 
 **/
type HandleResolveRequestConfig = {
    /** The request's success function */
    successFunc: Function,
    /** The request's timeout, if any */
    timeout?: number,
    /** The request's error function */
    errorFunc: Function,
    /** Any other config the request may have */
    [key: string]: any,
    /** Function to execute no matter what */
    thenFunc?: Function
}

type HttpResponseType = AxiosResponse;
type HttpErrorType = Exclude<AxiosError, 'response'> & {
    response: any
}

export type {
    HttpClientType,
    HttpGetConfigType,
    HttpPostConfigType,
    HttpPutConfigType,
    HttpDeleteConfigType,
    HandleResolveRequestConfig,
    HttpResponseType,
    HttpErrorType
}