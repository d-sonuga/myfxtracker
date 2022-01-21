import {ReactNode} from 'react'
import {getColor} from '@conf/utils'
import {Paper, TableContainer, Table as MuiTable, 
    TableCell, TableBody, TableRow} from '@mui/material'


const Table = ({rows}: {rows: Array<Array<ReactNode>>}) => {
    return(
        <TableContainer 
            component={Paper} 
            sx={{
                boxShadow: 'none',
                border: `1px solid ${getColor('xlight-blue')}`,
                borderRadius: '1%'
            }}>
            <MuiTable>
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