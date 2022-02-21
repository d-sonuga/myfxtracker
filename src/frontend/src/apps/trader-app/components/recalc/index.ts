import {useEffect, useContext} from 'react'
import {GlobalDataContext} from '@apps/trader-app'


/**
 * Hook to be used in trader app pages that need to make recalculations and
 * update calculations state when globalData changes
 * @param calcFunc: calculator function that recalculates values from the global data
 * @param updateComponentCalc: react setState function that is used to update the
 *  calculations state of whatever component called it
 * @param afterCalcFunc: function to execute immediately after calculating the new data,
 *  passing the new calculations as parameters to the function
 */

const useRecalc = (calcFunc: Function, updateComponentCalcState: Function, afterCalcFunc?: Function) => {
    const globalData = useContext(GlobalDataContext);
    useEffect(() => {
        if(globalData.hasLoaded()){
            const accountData = globalData.getCurrentTradeAccountData();
            const newCalc = calcFunc(accountData);
            updateComponentCalcState(newCalc);
            if(afterCalcFunc){
                afterCalcFunc(newCalc);
            }
        }
    }, [globalData])
}

export default useRecalc