export function dedupe(arr) {
    return arr.filter((elem, pos, targetArray) => {
        return targetArray.indexOf(elem) === pos;
    });
}
