// export function findAncestorOfType(child, tagName) {
//     const targetTagName = tagName.toLowerCase();
//     let node = child.parentNode;
//     while (node != null) {
//         if (node.tagName.toLowerCase() === targetTagName) {
//             return node;
//         }
//         node = node.parentNode;
//     }
//     return null;
// }

export function isDescendant(parentElement, childElement) {
    let node = childElement.parentNode;
    while (node != null) {
        if (node == parentElement) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
