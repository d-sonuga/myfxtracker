import {RowBox} from '@components/containers'
import {getDimen} from '@conf/utils'
import starImg from '@visuals/images/star.png'


const StarImages = () => {
    return(
        <RowBox 
            style={{
                justifyContent: 'center', paddingBottom: getDimen('padding-sm')
                }}>
            {
                [1, 2, 3, 4, 5]
                    .map((_) => 
                        <img
                            src={starImg}
                            alt='' 
                            style={{marginRight: getDimen('padding-xs')}}/>
                    )
            }
        </RowBox>
    );
}

export default StarImages