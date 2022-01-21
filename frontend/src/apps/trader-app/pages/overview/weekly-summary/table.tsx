import {ReactNode} from 'react'
import {Paper, TableContainer, Table as MuiTable, TableHead, 
    TableCell, TableBody, TableRow} from '@mui/material'
import {BP} from '@components/text'
import {getColor} from '@conf/utils'


const Table = ({headers, rows}: {headers: string[], rows: Array<Array<ReactNode>>}) => {
    return(
        <TableContainer 
            component={Paper} 
            sx={{
                boxShadow: 'none',
                border: `1px solid ${getColor('xlight-blue')}`,
                borderRadius: '1%'
            }}>
            <MuiTable sx={{height: '100%'}}>
                <TableHead>
                    <TableRow>
                        {headers.map((header, i) => (
                            <TableCell
                                key={i}
                                align='center'>
                                <BP style={{color: getColor('light-blue')}}>{header}</BP>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            {row.map((cell, i) => {
                                let backgroundColor: string | undefined = undefined;
                                if(i % 2 !== 0){
                                    backgroundColor = getColor('light-gray')
                                }
                                return(
                                    <TableCell 
                                        key={i}
                                        align='center' 
                                        sx={{backgroundColor}}>
                                        {cell}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
}


export default Table