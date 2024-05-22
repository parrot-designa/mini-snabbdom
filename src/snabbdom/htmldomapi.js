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

function parentNode(node){
    return node.parentNode;
}

function insertBefore(
    parentNode,
    newNode,
    referenceNode
){
    parentNode.insertBefore(newNode, referenceNode);
}

function nextSibling(elm){
    return elm.nextSibling;
}

function setTextContent(node, text) {
    node.textContent = text;
}
  
function getTextContent(node)  {
    return node.textContent;
}

export const htmlDomApi = {
    isElement,
    tagName,
    createElement,
    createTextNode,
    appendChild,
    parentNode,
    insertBefore,
    nextSibling,
    setTextContent,
    getTextContent
};