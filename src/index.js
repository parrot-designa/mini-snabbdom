import {
  init,
  h
} from "snabbdom";
 
const patch = init([]);

const container = document.getElementById("container");

const myVnode = h('div',[
  h('div',{key:1},'1'),
  h('div',{key:2},'2'),
  h('div',{key:3},'3'),
  // h('div',{key:4},'4'),
]);

const myVnode2 = h('div');

const myVnode3 = h('div',[  
  h('div',{key:1},'1'),  
  h('div',{key:3},'3'),
]);


patch(container, myVnode);

document.getElementById('btn').addEventListener('click',()=>{
  //疑问 为啥每次点会新增E 
  patch(myVnode, myVnode3);
})