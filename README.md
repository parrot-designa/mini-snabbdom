Vue2源码揭秘 - 虚拟DOM和diff算法

# 一、介绍


## 1、diff算法

    Diff算法是一种在编程中，尤其是在前端开发领域用于比较两个数据结构（常见的是DOM树或虚拟DOM树）差异的高效算法。其目的是高效地识别出从一个状态到另一个状态所需的最小变更集。因为在浏览器中操作DOM性能消耗比较昂贵，比如节点的添加、删除、移动等，所以diff算法可以尽可能的减少DOM的操作量，进而减少浏览器的性能负担。 

    如下：如果需要将下图中左边的DOM更新到右边的DOM,如果不采用虚拟DOM的方法，即无法复用DOM节点，可能需要进行6次DOM操作，第一次将旧树的A节点移除，第二次将旧树的B节点移除，第三次将旧树的C节点移除，第四次将新树A节点挂载，第五次将新树的C节点挂载，第六次将新树的B节点挂载。但是如果采用diff算法复用DOM节点的策略进行的话，实际上只需要移动一次C节点即可。

![alt text](image.png)

    具体到虚拟DOM的场景，Diff算法的工作原理大致如下：


### 1.1 同层比较

    算法会在两个虚拟DOM树的同一层级上进行对比，而不会跨层级对比。这意味着它首先检查每个父节点下的子节点是否相同，然后递归进入子树进行比较。

![alt text](image-1.png)

如上只会同层级进行比较，如爷爷跟爷爷比较，爸爸和爸爸比较，不会存在爷爷跟爸爸、爸爸和儿子进行比较。

### 1.2 节点匹配

    算法会尝试根据节点的类型、属性（如Vue中的id等）和关键属性（如Vue中的key）来匹配新旧节点，以便确定哪些节点可以复用，哪些需要被添加、更新或者移除。

![alt text](image-2.png)

    在Vue中，左边节点为旧节点，右边节点为新节点，如果同为span文本节点，可以对节点进行复用，只需要更新文本中的文字即可。

    留个疑问点，那么假设span上面存在key，他还能复用节点吗？

### 1.3 循环从两边向中间比较

    这是一种优化策略，算法不是线性遍历每一个节点，而是从两端开始，向中间逐步靠拢，这样可以在某些情况下更早地发现差异并终止不必要的比较。

![alt text](image-3.png)

### 1.4 直接更新DOM节点

    比较过程中，算法会记录差异（或成为“patch”）,这些patch描述了如何将旧的DOM树转换为新的DOM树。包括需要添加、更新或删除哪些元素及其属性。


## 2、虚拟DOM?

    虚拟 DOM (Virtual DOM，简称 VDOM) 是一种编程概念，意为将目标所需的 UI 通过数据结构“虚拟”地表示出来，保存在内存中，然后将真实的DOM与之保持同步。具体来说，虚拟 DOM 是由一系列的 JavaScript 对象组成的树状结构，每个对象代表着一个DOM元素，包括元素的标签名、属性、子节点等信息。虚拟 DOM 中的每个节点都是一个 JavaScript 对象，它们可以轻松地被创建、更新和销毁，而不涉及到实际的DOM操作。

    如下这种DOM结构

```html
<div>
    <div id="apple">苹果</div>
    <div class="banana">香蕉</div>
    <div>火龙果</div>
</div>
```

    这种结构在vue中会被解析成类似下面这种结构（省略部分属性）

```js
{
  tag:'div',
  data:undefined,
  children:[
    {
      tag:'div',
      data:{
        attrs:{
          id:"apple"
        }
      },
      children:[
        {
          tag:undefined,
          text:"苹果"
        }
      ]
    },
    {
      tag:'div',
      data:{
        staticClass:'bannana'
      },
      children:[
        {
          tag:undefined,
          text:"香蕉"
        }
      ]
    },
    {
      tag:'div',
      data:undefined,
      children:[
        {
          tag:undefined,
          text:"火龙果"
        }
      ]
    }
  ]
}
```

## 3、虚拟DOM和diff的关联

    虚拟DOM是一种可以表示DOM的抽象层面的树形结构，它可以高效地更新到实际的DOM上。在Vue中，每个组件都有一个对应的渲染函数，这个函数返回一个描述该组件视图的虚拟节点树。当组件的状态发生变化时，新的渲染函数会被调用，产生一个新的虚拟节点树。Vue的diff算法就是用来比较新旧虚拟节点树的差异，找出最小的DOM操作来更新实际的DOM。   

    下面是一个简化的例子：

```js
// 假设有一个简单的组件
let component = {
  data: 'Hello, Vue!',
  template: `<div>{{ data }}</div>`
};
 
// 首次渲染，生成虚拟DOM
let oldVnode = Vue.render(component);
 
// 假设数据更新，产生新的虚拟DOM
let newVnode = Vue.render(component);
 
// Vue的diff算法比较新旧虚拟DOM
let patches = Vue.diff(oldVnode, newVnode);
 
// 根据diff结果应用到实际DOM
Vue.patch(document.body, patches);
```

    在这个例子中，Vue首次渲染组件时生成了一个虚拟DOM节点（oldVnode）。当组件的数据更新时，Vue再次渲染组件，生成了一个新的虚拟DOM节点（newVnode）。Vue的diff算法会比较这两个虚拟节点，找出需要执行的最小DOM操作（patches），最后这些DOM操作会被应用到实际的DOM上，以此来更新视图。


## 4、snabbdom简介

    Snabbdom是瑞典语单词，原意为”速度“。是一个轻量级的虚拟DOM和DOM diff算法库，它被设计用于以非常高效的方式更新真实DOM。Vue.js在2.x版本中采用了虚拟DOM的概念来提高其性能和效率，而Vue 2.x内部使用的虚拟DOM实现实际上是在Snabbdom的基础上进行了一些定制和改造的。

    Vue团队选择Snabbdom作为其虚拟DOM实现的原因主要是因为Snabbdom的高性能特性和小巧的体积。它提供了一个简洁的API来创建和管理虚拟节点（vnodes），并通过高效的diff算法来计算出虚拟DOM树的最小变更集，进而只对实际DOM进行必要的更新，减少了不必要的DOM操作，提高了页面的渲染效率。

    vue2源码中更新基本和snabbdom中一致，部分边角细节不一致，所以我们看一下snabbdom源码大致就可以了解Vue更新的细节。


github地址：[https://github.com/snabbdom/snabbdom](https://github.com/snabbdom/snabbdom)

```js
import {
  init,
  h
} from "snabbdom";

const patch = init([]);

const container = document.getElementById("container");

const myVnode = h('div',[
    h('p','苹果'),
    h('p','香蕉'),
    h('p','火龙果'),
]);

const myVnode2 = h('div',[
    h('p','苹果'),
    h('p','香蕉'),
    h('p','桃子'),
])


patch(container, myVnode);

document.getElementById('btn').addEventListener('click',()=>{
  //疑问 为啥每次点会新增E 
  patch(myVnode, myVnode2);
})
```

    界面上渲染效果如下所示：
![alt text](image-4.png)

    点击按钮后：
![alt text](image-5.png)

    由之前的diff算法可知，当点击更新以后，界面上会复用前两个元素苹果和香蕉(即没有销毁以及重新创建)，那么如何证明它复用了呢，其实很简单，只需要在浏览器中手动更改前2个元素，如果点击更新以后，更改的前2个元素没有变化，即可证明它并对dom节点进行了复用。

    如上代码所示，patch即为vue中的第一次渲染，点击按钮更新新的vnode相当于vue中的更新渲染，只不过vue中将行为进行了一些封装。所以掌握snabbdom即可掌握vue2的核心双端diff算法。


# 二、生成虚拟DOM的方法h

    我们这里不讨论DOM如何变成虚拟DOM 这属于模板编译原理范畴 但是虚拟节点变成DOM节点我们这篇会说到。

## 1、Vue的runtime-only模式

    在Vue中，通常我们会采取Runtime-Only模式运行Vue项目，在这个模式中，我们在构建阶段所有的模版（<template>标签中的HTML）已经被预编译成Javascript渲染函数（render函数），预编译过程通常由如vue-loader配合vue-template-compiler这样的工具在Webpack构建过程中完成，它们会把.vue文件中的模板转换为高效的JavaScript代码。

![alt text](image-6.png)

    这里为什么不是render而是staticRenderFns呢？staticRenderFns 是 Vue 中的一个概念，与 Vue 的渲染机制相关。在 Vue 的模板编译过程中，对于某些静态的、不依赖于数据变化的 DOM 结构，Vue 会将其提取出来，生成对应的渲染函数并放在 staticRenderFns 数组里。这样做是为了优化渲染性能，因为静态内容在初次渲染后不需要随着数据变化而更新，可以避免不必要的重新渲染。

## 2、vnode.js

        在snabbdom中，vnode.js模块主要用于创建vnode。下面的函数主要有三个功能：1.创建Vnode 2.描述虚拟DOM结构 3.diff算法的基础

```js
//src/vnode.js
export function vnode(
    sel,
    data,
    children,
    text,
    elm
){
    const key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}
```

    由上面的代码可以看出虚拟节点vnode的属性有哪些：

```js
{
    children: undefined,// 子节点
    data: {},// 属性、样式、key
    elm: undefined, // 对应的真正的dom节点(对象)，undefined表示节点还没有上dom树
    key:undefined, // vnode唯一标识
    sel:"div", // 选择器
    text: "hello" // 文本内容
}
```


## 3、h函数

    上节我们知道，在vue中是通过模版编译将html编译成为一个render函数，其实这个render函数运行的返回值就是虚拟DOM。我们可以看到vue中采用的是vm._c来实现生成虚拟DOM，而在snabbdom中是使用h函数来生成虚拟DOM的。


### 3.1 h函数使用

比如这样调用h函数：
```js
h('a', 
    {
        props:{
            href:'http://www.baidu.com'
        }
    }, 
    "百度一下"
);
```
将得到这样的虚拟节点：
```js
{
    "sel": "a",
    "data": {
        "props": {
            "href": "http://www.baidu.com"
        }
    },
    "text": "百度一下"
}
```
它表示真正的DOM节点
```html
<a href="http://www.baidu.com">百度一下</a>
```

### 3.2 h函数源码

```js
export function h(sel, b, c){
    // 存放属性
    let data = {};
    // 存放子节点
    let children ;
    let text;
    let i;

    if(c !== undefined){
        if(b !== null){
            data = b;
        }
        if(is.array(c)){
            children = c;
        } else if(is.primitive(c)){
            text = c.toString();
        } else if( c && c.sel){
            children = [c];
        }
    }else if(b !== undefined && b !== null){
        if(is.array(b)){
            children = b;
        }else if(is.primitive(b)){
            text = b.toString();
        }else if(b && b.sel){
            children = [b];
        }else {
            data = b;
        }
    }

    if(children !== undefined){
        for(i = 0;i < children.length; ++i){
            if(is.primitive(children[i])){
                children[i] = vnode( 
                        undefined,
                        undefined,
                        undefined,
                        children[i],
                        undefined
                ) 
            }
        }
    }
    return vnode(sel,data,children,text,undefined);
}
```

    h函数其实也没有什么好讲的，可以看到这个函数最后返回了一个vnode方法的返回值，可以知道h函数就是调用vnode对传入的属性进行整合，最后返回vnode，至于其中的一大堆逻辑，其实就是对第二个参数和第三个参数进行数据的兼容，比如：

```js
h('div',undefined,['hello']) 
===
h('div',['hello'])
```

    上面这2个vnode是完全相等的。这里hello是要放到子节点里面的，即vnode的children属性中，但是我们这里将hello放进了第二个参数，所以函数需要判断用户真实的意图，这里的逻辑是判断第二个参数如果是数组即将其变成children属性，

    这里需要注意的是这个函数最后会循环遍历children，如果children中存在原始类型如文本，他会将其转化为一个文本vnode。

# 三、首次挂载

    初始化渲染时，不用进行diff判断，直接将整个虚拟DOM挂载到容器上。

## 1、前置知识-DOM相关操作

### 1.1 isElement

    该函数判断传入的参数node是否是一个元素节点。在DOM（文档对象模型）中，节点类型由nodeType属性来表示，其中nodeType的值为1表示元素节点（Element Node）。 

```js
function isElement(node){
    return node.nodeType === 1;
}
```

### 1.2 createElement

    该函数封装了原生document.createElement方法，创建并返回元素。它接受两个参数：tagName和options。
    1. tagName: 字符串类型，指定了要创建的元素类型，比如div、span、img
    2. options: 可选对象，这是一个在某些现代浏览器和 JavaScript 环境中支持的参数，用于指定新创建元素的属性和其他配置。例如，你可以用它来设置元素的 is 属性（定义自定义元素）或者指定元素的 namespaceURI（命名空间）。这个参数是 HTML5 和后来的规范引入的，不是所有环境都支持。

```js
function createElement(
    tagName,
    options
){
    return document.createElement(tagName,options);
}
```

### 1.3 createTextNode

    该函数的作用是创建一个新的文本节点（text node）,其中包含指定的文本内容。

```js
function createTextNode(text){
    return document.createTextNode(text);
}
```

### 1.4 createComment

    该函数的作用是创建一个注释节点封装着指定的text内容。    

```js
function createComment(text) {
    return document.createComment(text);
}
```

### 1.5 isDocumentFragment

    该函数的作用是检查一个节点是否是文档片段。

```js
function isDocumentFragment(node) {
    return node.nodeType === 11;
}
````