import { htmlDomApi } from "./htmldomapi";
import * as is from "./is";
import { vnode } from "./vnode";

function isElement(
    api,
    vnode
){
    return api.isElement(vnode);
}

function sameVNode(vnode1, vnode2){
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

    function updateChildren(parentElm,oldCh,newCh){
        // 旧子节点的头部节点索引值
        let oldStartIdx = 0;
        // 旧子节点的尾部节点索引值
        let oldEndIdx = oldCh.length - 1;
        // 新子节点的头部节点索引值
        let newStartIdx = 0;
        // 新子节点的尾部节点索引值
        let newEndIdx = newCh.length - 1;

        // 旧子节点的头部节点
        let oldStartVNode = oldCh[0];
        // 旧子节点的尾部节点
        let oldEndVNode = oldCh[oldEndIdx];
        // 新子节点的头部节点
        let newStartVNode = newCh[0];
        // 新子节点的尾部节点
        let newEndVNode = newCh[newEndIdx]; 

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            // 增加两个判断分支，如果头尾部节点为undefined，则说明该节点已经被处理过了，直接跳到下一个位置
            if(!oldStartVNode){
                oldStartVNode = oldCh[++oldStartIdx];
            }else if(!oldEndVNode){
                oldEndVNode = oldCh[--oldEndIdx];
            }else if(sameVNode(oldStartVNode, newStartVNode)){
                patchVnode(oldStartVNode, newStartVNode);
                oldStartVNode = oldCh[++oldStartIdx];
                newStartVNode = newCh[++newStartIdx];
            }else if(sameVNode(oldEndVNode, newEndVNode)){
                patchVnode(oldEndVNode, newEndVNode);
                oldEndVNode = oldCh[--oldEndIdx];
                newEndVNode = newCh[--newEndIdx];
            }else if(sameVNode(oldStartVNode, newEndVNode)){
                patchVnode(oldStartVNode, newEndVNode);
                api.insertBefore(
                    parentElm,
                    oldStartVNode.elm,
                    api.nextSibling(oldEndVNode.elm)
                );
                oldStartVNode = oldCh[++oldStartIdx];
                newEndVNode = newCh[--newEndIdx];
            }else if(sameVNode(oldEndVNode, newStartVNode)){
                patchVnode(oldEndVNode, newStartVNode);
                api.insertBefore(parentElm, oldEndVNode.elm, api.nextSibling(oldStartVNode.elm));
                oldEndVNode = oldCh[--oldEndIdx];
                newStartVNode = newCh[++newStartIdx];
            }else {
                // 遍历旧的一组子节点，试图寻找与 newStartVNode 拥有相同 key 值的节

                // idxInOld 就是新的一组子节点的头部节点在旧的一组子节点中的索引
                const idxInOld = oldCh.findIndex(
                    node => node.key === newStartVNode.key
                )

                // idxInOld 大于 0，说明找到了可复用的节点，并且需要将其对应的真实DOM移动到头部
                if(idxInOld > 0){
                    // idxInOld 位置对应的 vnode 就是需要移动的节点
                    const vnodeToMove = oldCh[idxInOld]
                    // 不要忘记除移动操作外还应该打补丁
                    patchVnode(vnodeToMove, newStartVNode)
                    // 将 vnodeToMove.el 移动到头部节点 oldStartVNode.el 之前，因此使用后者作为锚点
                    api.insertBefore(parentElm,vnodeToMove.elm,oldStartVNode.elm);
                    // 由于位置 idxInOld 处的节点所对应的真实 DOM 已经移动到了别处，因此将其设置为 undefined
                    oldCh[idxInOld] = undefined
                    // 最后更新 newStartIdx 到下一个位置
                    newStartVNode = newCh[++newStartIdx]
                }else{
                    // 将 newStartVNode 作为新节点挂载到头部，使用当前头部节点oldStartVNode.el 作为锚点
                    api.insertBefore(
                        parentElm,
                        createElm(newStartVNode),
                        oldStartVNode.elm
                    )
                }
                newStartVNode = newCh[++newStartIdx]
            }
        }

        if(newStartIdx <= newEndIdx){ 
            addVnodes(
                parentElm,
                oldStartVNode.elm,
                newCh,
                newStartIdx,
                newEndIdx
            )
        }

        if(oldStartIdx <= oldEndIdx){
            removeVnodes(
                parentElm,
                oldCh,
                oldStartIdx,
                oldEndIdx
            )
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
        oldVNode,
        vnode
    ){
        const elm = vnode.elm = oldVNode.elm;
        // 如果在内存中是同一个对象 则什么都不做
        if(oldVNode === vnode) return;  
        
        const oldCh = oldVNode.children;
        const ch = vnode.children;
 
        // 新节点有子节点的情况 / 没有子节点但不是文本节点
        if(vnode.text === undefined){
            // 新旧节点都有子节点，需要逐层比较
            if (oldCh !== undefined && ch !== undefined) { 
                console.log("新旧节点都有子节点，需要逐层比较",oldCh,ch)
                updateChildren(elm, oldCh, ch)
            // 新节点有子节点 旧节点没有子节点
            }else if(ch !== undefined){
                console.log("新节点有子节点 旧节点没有子节点",oldCh,ch)
                // 如果旧节点存在文本 清除
                if (oldVNode.text !== undefined) api.setTextContent(elm, "");
                addVnodes(elm, null, ch, 0, ch.length - 1);
            // 新节点没有子节点 旧节点有子节点
            }else if(oldCh !== undefined){ 
                console.log("新节点没有子节点 旧节点有子节点",oldCh,ch)
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            // 新节点没有子节点且没有文字节点 旧节点有文字节点 需清除
            }else if(oldVNode.text !== undefined){
                console.log("新节点没有子节点且没有文字节点 旧节点有文字节点 需清除",oldCh,ch)
                api.setTextContent(elm, "");
            }
        // 新节点存在text表示是文本节点
        }else if(oldVNode.text !== vnode.text){
            // 旧节点存在子节点 需要先移除子节点
            if(oldCh !== undefined){
                removeVnodes(elm,oldCh,0,oldCh.length-1);
            }
            // 如果旧节点不存在子节点 直接更新即可
            api.setTextContent(elm, vnode.text);
        }
    }

    return function patch(
        oldVNode,
        vnode
    ){
        let elm,parent;
        // 第一步，判断传入的第一个参数，是DOM节点还是虚拟节点
        if(isElement(api, oldVNode)){
            // 传入的第一个参数是DOM节点 ，此时要包装为虚拟节点
            oldVNode = emptyNodeAt(oldVNode);
        }

        if(sameVNode(oldVNode, vnode)){
            console.log("是同一个节点")
            patchVnode(oldVNode, vnode);
        }else{
            console.log("不是同一个节点，暴力插入新的，删除旧的",vnode);
            elm = oldVNode.elm;
            parent = api.parentNode(elm);

            createElm(vnode);

            if(parent !== null){
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
            }
        }
    }
}