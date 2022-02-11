import {aveRRR} from '@root/overview-calculations'
import {AccountData} from '@root/types'
import {AveRrrPerPairGraphCalc} from './types'
import {groupTradesByPair} from './utils'


const aveRrrPerPairGraphCalc = (accountData: AccountData): AveRrrPerPairGraphCalc => {
    const pairToTradesMap = groupTradesByPair(accountData);
    return Object.keys(pairToTradesMap).map((pair) => ({
        pair,
        rrr: aveRRR(pairToTradesMap[pair])
    }))
}

export default aveRrrPerPairGraphCalc