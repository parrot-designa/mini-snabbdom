function isElement(node){
    return node.nodeType === 1;
}

function tagName(elm){
    return elm.tagName;
}

function createElement(
    tagName,
    options
){
    return document.createElement(tagName, options);
}

function createTextNode(text){
    return document.createTextNode(text);
}

function appendChild(node, child){
    node.appendChild(child);
}

export const htmlDomApi = {
    isElement,
    tagName,
    createElement,
    createTextNode,
    appendChild
};