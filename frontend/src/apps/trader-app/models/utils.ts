const cloneObject = (obj: Object) => {
    return JSON.parse(JSON.stringify(obj));
}

export {
    cloneObject
}