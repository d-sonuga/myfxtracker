/**
 * A container that holds all globally required components (toast),
 * passes them down to all apps through context and intializes the Http
 * toast function
 */

import {useEffect, ReactNode, useState, Fragment} from 'react'
import {ErrorToast, SuccessToast, ToastContext} from '@components/toast'
import Http from'@services/http'


const MainContainer = ({children}: {children: ReactNode}) => {
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('It\s taking a while to reach the server');

    useEffect(() => {
        Http.init(Toast);
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
        }
    }

    const handleErrorToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setShowErrorToast(false);
      };
    const handleSuccessToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSuccessToast(false);
    };

    return(
        <Fragment>
            <ErrorToast msg={toastMsg} open={showErrorToast} handleClose={handleErrorToastClose} />
            <SuccessToast msg={toastMsg} open={showSuccessToast} handleClose={handleSuccessToastClose} />
            <ToastContext.Provider value={Toast}>
                {children}
            </ToastContext.Provider>
        </Fragment>
    )
}

export default MainContainer