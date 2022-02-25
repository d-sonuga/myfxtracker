import './style.css'


const VerticalDivider = ({height, marginLeft, marginRight}: {height?: number, marginLeft: string, marginRight: string}) => {
    return(
        <div style={{
            border: '1px solid #c5c5c5',
            height: height ? `${height}px` : '30px',
            textAlign: 'center',
            marginLeft: marginLeft,
            marginRight: marginRight
            
        }}></div>
    )
}

export default VerticalDivider