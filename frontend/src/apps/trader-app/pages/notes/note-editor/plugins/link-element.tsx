import {getColor} from '@conf/utils'


const LinkElement = ({attributes, children, element}: any) => {
    return(
        <a 
            {...attributes}
            style={{
                color: getColor('light-blue'),
                textDecoration: 'underline',
                onMouseOver: 'pointer'
            }}
            href={element.url} target='_blank'>{children}
        </a>
    );
}

export default LinkElement