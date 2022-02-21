const TdElement = ({attributes, children, element}: any) => {
    return(
        <td
            {...attributes}
            style={{
                border: '1px solid rgba(0,0,0,.55)'
            }}>{children}</td>
    );
}

export default TdElement