import {ColumnBox} from '@components/containers'
import {H6} from '@components/text'
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
                        alignItems: 'center',
                        height: '100%'
                    }}>
                    <H6>Sorry. Something went wrong</H6>
                </ColumnBox>
            )
        }
        return this.props.children;
    }
}

export default PageLoadingErrorBoundary