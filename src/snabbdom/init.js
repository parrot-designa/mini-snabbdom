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

export function init(){

    const api = htmlDomApi;

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

    function addVnodes(
        parentElm,
        before,
        vnodes,
        startIdx,
        endIdx
    ){
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch != null) {
                //没有before将插入父节点的子节点列表的末尾，这相当于appendChild方法的效果
                api.insertBefore(parentElm, createElm(ch), before);
            }
        }
    }

    function removeVnodes(
        parentElm,
        vnodes,
        startIdx,
        endIdx
    ){  
        for(;startIdx <= endIdx;startIdx++) {
            const ch = vnodes[startIdx];
            //对于每个虚拟节点，首先检查它是否非空
            if (ch != null) { 
                api.removeChild(parentElm, ch.elm);  
            }
        }
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
        const elm = vnode.elm = oldVnode.elm;
        // 如果在内存中是同一个对象 则什么都不做
        if(oldVnode === vnode) return;  
        
        const oldCh = oldVnode.children;
        const ch = vnode.children;
 
        // 新节点有子节点的情况
        if(vnode.text === undefined){
            // 新旧节点都有子节点，需要逐层比较
            if (oldCh !== undefined && ch !== undefined) { 
                console.log("新旧节点都有子节点，需要逐层比较",oldCh,ch)
            // 新节点有子节点 旧节点没有子节点
            }else if(ch !== undefined){
                console.log("新节点有子节点 旧节点没有子节点",oldCh,ch)
                // 如果旧节点存在文本 清除
                if (oldVnode.text !== undefined) api.setTextContent(elm, "");
                addVnodes(elm, null, ch, 0, ch.length - 1);
            // 新节点没有子节点 旧节点有子节点
            }else if(oldCh !== undefined){ 
                console.log("新节点没有子节点 旧节点有子节点",oldCh,ch)
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            // 新节点没有子节点且没有文字节点 旧节点有文字节点 需清除
            }else if(oldVnode.text !== undefined){
                console.log("新节点没有子节点且没有文字节点 旧节点有文字节点 需清除",oldCh,ch)
                api.setTextContent(elm, "");
            }
        // 新节点存在text表示是文本节点
        }else if(oldVnode.text !== vnode.text){
            // 旧节点存在子节点 需要先移除子节点
            if(oldCh !== undefined){
                removeVnodes(elm,oldCh,0,oldCh.length-1);
            }
            // 如果旧节点不存在子节点 直接更新即可
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