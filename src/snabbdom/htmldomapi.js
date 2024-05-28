function createElement(
    tagName,
    options
){
    return document.createElement(tagName,options);
}

function isElement(node){
    return node.nodeType === 1;
}

function isDocumentFragment(node) {
    return node.nodeType === 11;
}

function tagName(elm){
    return elm.tagName;
}

function removeChild(node, child) {
    node.removeChild(child);
}

function createTextNode(text){
    return document.createTextNode(text);
}

function createComment(text) {
    return document.createComment(text);
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
    getTextContent,
    createComment,
    isDocumentFragment,
    removeChild
};