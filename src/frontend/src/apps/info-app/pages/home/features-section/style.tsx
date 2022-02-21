import {getDimen, getColor} from '@conf/utils'


// can't use @conf/utils's getColor or getDimen because its not working here
const colorOrange = '#fa7a43';
const paddingXs = '10px';
const paddingMd = '20px';

const featuresSectionStyle = {
    futureOfTradingHeaderStyle: {
        textTransform: 'uppercase', 
        color: colorOrange,
        letterSpacing: '0.7px', 
        lineHeight: '1.5', 
        fontWeight: 600, 
        fontSize: '1rem',
        marginBottom: paddingXs
    },
    secondHeaderStyle: {
        textAlign: 'center',
        marginBottom: paddingMd
    }
}

export default featuresSectionStyle