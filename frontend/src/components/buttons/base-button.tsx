import {ThemeProvider} from '@mui/material'
import Button from '@mui/material/Button'
import {createTheme} from '@mui/material/styles'
import {BaseButtonPropTypes} from './types'


const theme = createTheme({
    palette: {
        neutral: {
            main: 'rgba(0,0,0,.55)',
            contrastText: '#fff'
        }
    }
})

const BaseButton = ({children, style, elevation, ...props}: BaseButtonPropTypes) => {
    return(
        <ThemeProvider theme={theme}>
            <Button
                disableElevation={elevation === undefined ? true : !elevation}
                sx={style}
                {...props}>
                    {children}
            </Button>
        </ThemeProvider>
    );
}


export default BaseButton
