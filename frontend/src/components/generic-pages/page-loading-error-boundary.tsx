import { ColumnBox } from '@components/containers';
import {H3, H5} from '@components/text'
import {Component} from 'react'


class PageLoadingErrorBoundary extends Component {
    constructor(props: any){
        super(props);
        this.state = {
            hasError: false
        };
    }
    static getDerivedStateFromError(error: any){
        return {
            hasError: true
        }
    }
    componentDidCatch(error: any, errorInfo: any){
        console.log(error, errorInfo);
    }
    render(){
        const state = this.state as any;
        if(state.hasError){
            return(
                <ColumnBox
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <H5>Sorry. Something went wrong</H5>
                </ColumnBox>
            )
        }
        return this.props.children;
    }
}

export default PageLoadingErrorBoundary