/**
 * A container that holds all globally required components (toast),
 * passes them down to all apps through context and intializes the Http
 * toast function
 */

import React, {useEffect, ReactNode, useState, Fragment} from 'react'
import ReactGA from 'react-ga4'
import TagManager from 'react-gtm-module'
import {ErrorToast, SuccessToast, InfoToast, ToastContext} from '@components/toast'
import Http from'@services/http'
import {ConfigConst} from '@conf/const'


const MainContainer = ({children}: {children: ReactNode}) => {
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showInfoToast, setShowInfoToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('It\s taking a while to reach the server');

    useEffect(() => {
        Http.init(Toast);
        ReactGA.initialize(
            ConfigConst.GA_MEASUREMENT_ID,
            {
                gtagOptions: {
                    'debug_mode': process.env.NODE_ENV !== 'production'
                }
            }
        );
        TagManager.initialize({
            gtmId: 'GTM-PZXXP93'
        });
    });

    /**
     * Functions used throughout the app to toast messages
     * @param msg: the message to toast
     * @param delay: how long should the toast stay open. If 0,
     *  remain open
     */
    const Toast = {
        /** Base function used by the other toasting functions to toast messages */
        toast: (msg: string, delay: number, setShowToast: Function) => {
            setToastMsg(msg);
            if(delay && delay !== 0){
                setTimeout(() => {
                    setShowToast(false);
                }, delay);
            }
            setShowToast(true);
        },
        /** For toasting errors */
        error: function(msg: string, delay: number = 0){
            this.toast(msg, delay, setShowErrorToast);
        },
        /** For toasting success messages */
        success: function(msg: string, delay: number = 0){
            this.toast(msg, delay, setShowSuccessToast);
        },
        info: function(msg: string, delay: number = 0){
            this.toast(msg, delay, setShowInfoToast);
        },
    }

    const handleToastClose = (setToastOpen: Function, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setToastOpen(false);
    }
    const handleErrorToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        handleToastClose(setShowErrorToast, reason)
      };
    const handleSuccessToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        handleToastClose(setShowSuccessToast, reason)
    };
    const handleInfoToastClose = (e?: React.SyntheticEvent | Event, reason?: string) => {
        handleToastClose(setShowInfoToast, reason);
    }

    return(
        <Fragment>
            <ErrorToast msg={toastMsg} open={showErrorToast} handleClose={handleErrorToastClose} />
            <SuccessToast msg={toastMsg} open={showSuccessToast} handleClose={handleSuccessToastClose} />
            <InfoToast msg={toastMsg} open={showInfoToast} handleClose={handleInfoToastClose} />
            <ToastContext.Provider value={Toast}>
                {children}
            </ToastContext.Provider>
        </Fragment>
    )
}

export default MainContainer