import{lV as s}from"./index-CGeJfPJG.js";import{lW as c,lX as x,lY as g,lZ as y,ga as j,l_ as v}from"./index-CGeJfPJG.js";function u(n){let{options:e,value:r}=n;return typeof e[r]=="number"}function p(n){let e="";for(let r in n){let t=n[r];if(typeof t=="boolean")t&&(e+=`#define ${r}
`);else if(typeof t=="number")e+=`#define ${r} ${t.toFixed()}
`;else if(typeof t=="object")if(u(t)){let{value:o,options:f,namespace:a}=t,i=a?`${a}_`:"";for(let l in f)e+=`#define ${i}${l} ${f[l].toFixed()}
`;e+=`#define ${r} ${i}${o}
`}else{let o=t.options,f=0;for(let a in o)e+=`#define ${o[a]} ${(f++).toFixed()}
`;e+=`#define ${r} ${o[t.value]}
`}}return e}function d(n,e,r,t=""){return new s(n,t+e.vertexShader,t+e.fragmentShader,r)}export{c as BufferObject,s as DisposableProgram,x as FramebufferObject,g as ProgramCache,y as Renderbuffer,j as Texture,v as VertexArrayObject,d as createProgram,p as glslifyDefineMap};
