const createHeaderRowNode = (columns: number) =>{
    const headerRow: any = {type: 'tr', children: []}
    for(let colNo=columns; colNo >= 1; colNo--){
        headerRow.children.push({type: 'th', children: [{type: 'p', children: [{text: ''}]}]});
    }
    return headerRow
}

const createRow = (columns: number) => {
    const row: any = {type: 'tr', children: []}
    for(let colNo=columns; colNo >= 1; colNo--){
        row.children.push({type: 'td', children: [{type: 'p', children: [{text: ''}]}]});
    }
    return row
}

const createTableNode = (rows: number, columns: number) => {
    const tableNode = {
        type: 'table',
        isElement: true,
        children: [
            createHeaderRowNode(columns)
        ]
    }
    for(let rowNo=rows; rowNo >= 1; rowNo--){
        tableNode.children.push(createRow(columns));
    }
    return tableNode
}


export default createTableNode