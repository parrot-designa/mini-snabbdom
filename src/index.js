import {
  init,
  h
} from "../src/snabbdom";

//../src/

const patch = init([]);

const container = document.getElementById("container");

const myVnode = h('div','苹果');

const myVnode2 = h('div');

const myVnode3 = h('div',"aaa")


patch(container, myVnode);

document.getElementById('btn').addEventListener('click',()=>{
  //疑问 为啥每次点会新增E 
  patch(myVnode, myVnode2);
})