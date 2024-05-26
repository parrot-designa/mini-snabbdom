import {   
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
} from "snabbdom";

import {  init,h } from "./snabbdom";

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

const myVnode = h('div',[
  h('p',"A"),
  h('p',"B"),
  h('p',"C")
])

const myVnode2 = h('div',[
  h('p',"A"),
  h('p',"B"),
  h('p',"C"),
  h('p',"D"),
])


const myVnode3 = h("div",'你好') 

patch(container, myVnode);

document.getElementById('btn').addEventListener('click',()=>{
  //疑问 为啥每次点会新增E 
  patch(myVnode, myVnode3);
})