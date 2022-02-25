import {getDimen} from '@conf/utils'
import mt4Img from '@visuals/images/mt4.png'
import mt5Img from '@visuals/images/mt5.png'
import VerticalDivider from '../vertical-divider'

const MtLogos = () => {
    return(
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <img width='auto' height={30} src={mt4Img} alt='Metatrader 4' />
            <VerticalDivider
                marginLeft={getDimen('padding-xs')}
                marginRight={getDimen('padding-xs')} />
            <img width='auto' height={30} src={mt5Img} alt='Metatrader 5' />
        </div>
    );
}

export default MtLogos