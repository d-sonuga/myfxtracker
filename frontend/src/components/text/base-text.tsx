import Typography from '@mui/material/Typography'
import {ThemeProvider} from '@mui/material/styles'
import {getColor} from '@conf/utils'
import textTheme from './text-theme'
import {BaseTextPropTypes} from './types'


const BaseText = ({variant, children, style}: BaseTextPropTypes) => {
    return(
        <ThemeProvider theme={textTheme}>
            <Typography 
                variant={variant} sx={{
                    color: style && style.color ? style.color : getColor('dark'),
                    ...style
                }}>{children}</Typography>
        </ThemeProvider>
    );
}



export default BaseText