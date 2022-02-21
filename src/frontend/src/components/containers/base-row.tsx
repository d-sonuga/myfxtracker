import {Children, ReactNode} from 'react'
import {Grid} from '@mui/material'
import {ContainerPropTypes} from './types'


const BaseRow = ({children, style, className}: ContainerPropTypes) => {
    const noOfColumns = 12;
    let noOfChildren: number = Children.count(children);
    let columnWidthPerChild = noOfColumns / noOfChildren;
    let rowElements: ReactNode[] = [];
    Children.forEach(children, (child: ReactNode, i: number) => {
        rowElements.push(
            <Grid item xs={noOfColumns} md={columnWidthPerChild}>
                {child}
            </Grid>
        )
    });
    return(
        <Grid
            container
            spacing={1}
            className={className}
            sx={style}>
            {rowElements}
        </Grid>
    );
}

export default BaseRow
