import { htmlDomApi } from "./htmldomapi";
import * as is from "./is";
import { vnode } from "./vnode";

function isElement(
    api,
    vnode
){
    return api.isElement(vnode);
}

function sameVnode(vnode1, vnode2){
    const isSameKey = vnode1.key === vnode2.key;
    const isSameSel = vnode1.sel === vnode2.sel;

    return isSameKey && isSameSel;
}

export function init(
    modules,
    domApi,
    options
){

    const api = domApi !== undefined ? domApi : htmlDomApi;

    function emptyNodeAt(elm){
        const id = elm.id ? "#" + elm.id : "";
        return vnode(
            api.tagName(elm).toLowerCase() + id,
            {},
            [],
            undefined,
            elm
        );
    }

    function createElm(vnode){
        let  sel = vnode.sel;
        const data = vnode.data;
        const elm = api.createElement(sel, data);
        const children = vnode.children;

        // 非文本节点
        if(sel !== undefined){
            vnode.elm = elm;
            // 如果节点是文本节点 （没有子节点）=> h('div','文本')
            if(is.primitive(vnode.text) && (!is.array(children) || children.length === 0)){
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            if(is.array(children)){
                for(let i = 0;i < children.length; ++i ){
                    const ch = children[i];
                    if(ch != null){
                        api.appendChild(elm, createElm(ch));
                    }
                }
            } 
        }else{
            // 文本节点
            vnode.elm = api.createTextNode(vnode.text);
        }
        
        return vnode.elm;
    }

    function patchVnode(
        oldVnode,
        vnode
    ){
        // 如果在内存中是同一个对象 则什么都不做
        if(oldVnode === vnode) return;  
        const elm = vnode.elm = oldVnode.elm;
        if(vnode.text === undefined){

        }else if(oldVnode.text !== vnode.text){
            //新vnode存在text属性
            console.log("新vnode存在text属性")
            api.setTextContent(elm, vnode.text);
        }
    }

    return function patch(
        oldVnode,
        vnode
    ){
        let elm,parent;
        // 第一步，判断传入的第一个参数，是DOM节点还是虚拟节点
        if(isElement(api, oldVnode)){
            // 传入的第一个参数是DOM节点 ，此时要包装为虚拟节点
            oldVnode = emptyNodeAt(oldVnode);
        }

        if(sameVnode(oldVnode, vnode)){
            console.log("是同一个节点")
            patchVnode(oldVnode, vnode);
        }else{
            console.log("不是同一个节点，暴力插入新的，删除旧的",vnode);
            elm = oldVnode.elm;
            parent = api.parentNode(elm);

            createElm(vnode);

            if(parent !== null){
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
            }
        }
    }
}