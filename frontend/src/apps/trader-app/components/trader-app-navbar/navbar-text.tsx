import {P} from '@components/text'
import {getColor} from '@conf/utils'


const NavbarText = ({children, style}: {children: string, style?: {[key: string]: string}}) => {
    return(
        <P style={{
            color: getColor('dark-gray'),
            fontFamily: '"Open Sans", sans-serif',
            ...style
        }}>{children}</P>
    );
}

export default NavbarText