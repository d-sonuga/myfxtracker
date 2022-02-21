/**
 * A react hook to tell whether or not a screen is small,
 * and whose value is constantly updated
 */

import {useState} from 'react'
import {screenIsSmall} from '.'
import useScreenResized from './use-screen-resized';

const useScreenIsSmall = () => {
    const [isScreenSmall, setIsScreenSmall] = useState(screenIsSmall());
    useScreenResized(() => {
        setIsScreenSmall(screenIsSmall());
    })

    return isScreenSmall;
}

export default useScreenIsSmall