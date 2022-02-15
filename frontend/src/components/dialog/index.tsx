import {Dialog as MuiDialog} from '@mui/material'
import {ColumnBox} from '@components/containers'
import {getDimen} from '@conf/utils'
import {H6} from '@components/text'
import Buttons from './buttons'
import {DialogPropTypes} from './types'
import { useEffect } from 'react'


const Dialog = ({children, onOkClick, onCancelClick, title, onClose, open}: DialogPropTypes) => {
    return(
        <MuiDialog onClose={() => onClose()} open={open}>
            <div onKeyPress={(e: any) => {
                if(e.key === 'Enter'){
                    onOkClick();
                }
            }}>
                <ColumnBox
                    style={{
                        margin: getDimen('padding-md')
                    }}>
                    <H6 style={{textAlign: 'center'}}>{title}</H6>
                    {children}
                    <Buttons
                        onOkClick={() => onOkClick()}
                        onCancelClick={() => onCancelClick()} />
                </ColumnBox>
            </div>
        </MuiDialog>
    )
}

export default Dialog