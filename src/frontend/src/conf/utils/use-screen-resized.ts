/**
 * A hook thats accepts a function to be run whenever the screen is resized
 */

import {useEffect} from 'react'

const useScreenResized = (func: Function) => {
    useEffect(() => {
        window.addEventListener('resize', () => {
            func()
        });
    })
}

export default useScreenResized