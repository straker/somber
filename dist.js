(()=>{Proxy.constructor.toString=()=>"[object Object]";var O=!1,w="",u=[],B={get(e,t){if(typeof t!="string")return Reflect.get(...arguments);if(O){let r=e.__p+"."+t;w!==e.__p?(w=r,u.push(r)):(w=r,u[u.length-1]=r)}return Reflect.get(...arguments)},set(e,t,r){let i;R(r)?i=Reflect.set(e,t,$(e.__p+"."+t,r,e.__r)):i=Reflect.set(...arguments);let s=e.__p+"."+t;for(;s;){e.__r.dispatchEvent(new CustomEvent(s,{detail:{value:r,oldValue:e[t]}}));let n=s.lastIndexOf(".");s=s.slice(0,n!==-1?n:0)}return i}};function b(e,t,r){return t.__r?t:$(e,t,r)}function $(e,t,r){let i=new Proxy(t,B);return Object.defineProperties(t,{__r:{value:r,enumerable:!1},__p:{value:e,enumerable:!1}}),Object.entries(t).forEach(([s,n])=>{R(n)&&!n.__r&&(i[s]=n)}),i}function R(e){return e&&typeof e=="object"}function x(){O=!0,u.length=0,w=""}function y(){O=!1}var V={};function o(e,t){t===""&&(t="''"),t=`return(${t})`;let r=V[t]||(V[t]=q(t));try{return r(e)}catch(i){console.warn(`Error when evaluating expression "${t}":`),console.error(i)}}function q(e){try{return new Function("$data",`with($data){${e}}`)}catch(t){return console.error(`${t.message} in expression: ${e}`),()=>{}}}var P=[!1,void 0,null,""];function g(e,t,r,i,s,n){x();let a=o(t,s);y(),u.map(c=>{e.addEventListener(c,()=>{F(r,i,o(t,s),n)})}),F(r,i,a,n)}function F(e,t,r,i){r=i?!r:r;let s=t.startsWith("aria-");if(t=="class")return Object.entries(r).map(([n,a])=>{if(!a)return e.classList.remove(n);e.classList.add(n)});if(t=="style")return Object.entries(r).map(([n,a])=>{if(P.includes(a))return e.style[n]="";e.style[n]=a});if(!s)return P.includes(r)?e.removeAttribute(t):(r===!0&&(r=""),e.setAttribute(t,r));if(r===!1)return e.setAttribute(t,"false");if(P.includes(r))return e.removeAttribute(t);e.setAttribute(t,r)}function k(e,t,r,i,s){g(e,t,r,"hidden",s,!0)}var T=/\{\{.+?\}\}/g;function E(e,t,r,i){let s=i.split(T),n=i.match(T).map(a=>a.slice(2,-2).trim());n.map(a=>{x();let c=o(t,a);y(),u.map(f=>{e.addEventListener(f,()=>{j(t,r,s,n)})})}),j(t,r,s,n)}function j(e,t,r,i){let s=r[0];for(let n=0;n<i.length;n++)s+=o(e,i[n])+r[n+1];t.nodeValue=s}var z=/\(\s*(?<value>\w+),\s*(?<key>\w+),?\s*(?<index>\w+)?\s*\)/;function W(e,t,r,i,s){let[n,a]=s.split(" in ").map(p=>p.trim());if(!a)throw new Error(`invalid :for expression: ${s}`);let c=r.firstElementChild,f=o(t,a),h,m;n.startsWith("(")&&({value:n,key:h,index:m}=n.match(z).groups);let l=r.getAttribute(":key");r.removeAttribute(":key");let d=I(e,t,r,c,a,f,n,h,m,l);H(r),r.append(...d),e.addEventListener(a,()=>{let p=I(e,t,r,c,a,f,n,h,m,l);if(!l)return H(r),r.append(...p);p.map((C,S)=>{let A=r.children[S];if(!A)return r.appendChild(C);A.__k!==C.__k&&A.replaceWith(C)})})}function H(e){for(;e.firstChild;)e.removeChild(e.lastChild)}function I(e,t,r,i,s,n,a,c,f,h){return Array.isArray(n)?n.map((m,l)=>{let d=b(s+"."+l,{...t,get[a](){return n[l]},[c]:l},e);return M(e,d,r,i,h)}):Object.entries(n).map(([m,l],d)=>{let p={...t,[a]:l,[c]:m,[f]:d};return M(e,p,r,i,h)})}function M(e,t,r,i,s){let n=i.cloneNode(!0);return n.__k=o(t,s),_(e,t,n),n}function _(e,t,r){let i=document.createNodeIterator(r,NodeFilter.SHOW_ALL),s;for(;s=i.nextNode();)switch(s.nodeType){case 1:let n=s.hasAttribute(":for");for(let{name:a,value:c}of[...s.attributes])if(a.startsWith(":"))switch(s.removeAttribute(a),a=a.substr(1),a){case"if":k(e,t,s,a,c);break;case"for":W(e,t,s,a,c);break;case"key":if(n)continue;default:g(e,t,s,a,c)}break;case 3:if(!s.nodeValue.includes("{{"))continue;E(e,t,s,s.nodeValue)}}var D=document.createElement("template"),L=class extends HTMLElement{constructor(){super(),this.state={},this.props={}}connectedCallback(){this.state=b("state",this.state,this),this.appendChild(this.render())}attributeChangedCallback(t,r,i){}html(t){return D.innerHTML=t,_(this,this,D.content.firstElementChild),D.content.firstElementChild}};})();