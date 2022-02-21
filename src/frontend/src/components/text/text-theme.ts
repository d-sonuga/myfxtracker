import {createTheme} from '@mui/material/styles'
import {getColor} from '@conf/utils'

const textTheme = createTheme({
    typography: { 
        fontFamily: [
            'system-ui',
            '-apple-system',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            '"Noto Sans"',
            '"Liberation Sans"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"'
        ].join(','),
        h1: {
            fontWeight: 700,
            fontSize: '5rem',
            color: getColor('dark')
        },
        h2: {
            fontWeight: 600,
            color: getColor('dark')
        },
        h3: {
            fontWeight: 600,
            color: getColor('dark')
        },
        h4: {
            fontWeight: 600,
            color: getColor('dark')
        },
        h5: {
            fontWeight: 600,
            color: getColor('dark')
        }
    }
})

export default textTheme