export function isNullOrEmpty (value : string | undefined) : boolean {
    return value === undefined || (typeof value === 'string' && value.trim().length === 0);
};

//https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
export function tryParseInt(value: string) : { parsed:boolean, value: number } {
    if(isNullOrEmpty(value))
        return { parsed: false, value: 0 };
    else {
        let v = parseInt(value);
        if(isNaN(v))
            return {parsed : false, value: 0 };
        else 
            return {parsed: true, value: v }
    }
    //return isNaN(parseFloat(value)) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

export function isNumber(value: string) : boolean {
    return !isNaN(parseFloat(value));
}