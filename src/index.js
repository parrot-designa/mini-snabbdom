import {  
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
} from "snabbdom";

import { init,h } from "./snabbdom";

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
]);

const container = document.getElementById("container");

const vnode = h("div#container.two.classes", { on: { click: function(){} } }, [
  h("span", { style: { fontWeight: "bold" } }, "This is bold"),
  " and this is just normal text",
  h("a", { props: { href: "/foo" } }, "I'll take you places!")
]);
// 传入一个空的元素节点 - 将产生副作用（修改该节点）
// patch(container, vnode);

const newVnode = h(
  "div#container.two.classes",
  { on: { click: function(){} } },
  [
    h(
      "span",
      { style: { fontWeight: "normal", fontStyle: "italic" } },
      "This is now italic type"
    ),
    " and this is still just normal text",
    h("a", { props: { href: "/bar" } }, "I'll take you places!")
  ]
);
// 再次调用 `patch`
// patch(vnode, newVnode); // 将旧节点更新为新节点

const myVnode = h('ul',[
  h('li',{key:"A"},"A"),
  h('li',{key:"B"},"B"),
  h('li',{key:"C"},"C"),
  h('li',{key:"D"},"D"),
])

const myVnode2 = h('ul',[
  h('li',{key:"E"},"E"),
  h('li',{key:"A"},"A"),
  h('li',{key:"B"},"B"),
  h('li',{key:"C"},"C"),
  h('li',{key:"D"},"D"), 
]) 

const myVnode3 = h("div",['测试'])

console.log("myVnode3==>",myVnode3)

patch(container, myVnode3);

document.getElementById('btn').addEventListener('click',()=>{
  //疑问 为啥每次点会新增E 
  patch(myVnode, myVnode2);
})