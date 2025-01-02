(function(L,_){typeof exports=="object"&&typeof module!="undefined"?_(require("jquery")):typeof define=="function"&&define.amd?define(["jquery"],_):(L=typeof globalThis!="undefined"?globalThis:L||self,_(L.$))})(this,function(L){"use strict";function _(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var d=_(L);function x(t){console.log("scrolled to target");var c=document.getElementById(t),i=100,s=c.getBoundingClientRect().top,a=s+window.pageYOffset-i;window.scrollTo({top:a,behavior:"smooth"})}function w(){const t=document.querySelector(".nav_cart-number"),c=document.querySelector(".nav_cart-number-wrapper"),i=localStorage.getItem("cartItems");let s;if(i){const a=JSON.parse(i);a.length!==0?(s=a.length,c.classList.remove("hide"),t.textContent=s,console.log("not empty")):(c.classList.add("hide"),console.log("cart empty"))}else c.classList.add("hide"),console.log("cart empty"),s=0}function k(){const t=document.querySelector("#samples-button-start"),c=document.querySelector(".cart_edit"),i=document.querySelector(".cart_empty"),s=document.querySelector(".cart_title"),a=document.querySelector("#samples-textarea"),r=e=>{document.querySelector("#textToast").value=e,document.getElementById("spells").click()};let l=!1;const y=(e,o)=>{e.style.display="flex",e.classList.remove("hide"),o.classList.add("hide")};t&&(t.addEventListener("click",()=>{y(c,t),l=!0,v(),x("step-2")}),c.addEventListener("click",()=>{y(t,c),l=!1,v()}));function A(e){const o=localStorage.getItem(e);if(!o)return null;try{return JSON.parse(o)}catch(n){return console.error("Error parsing JSON from localStorage:",n),null}}let u=A("cartItems")||[];const V=()=>{u.length===0?(console.log("disabled"),t.setAttribute("disabled","true"),t.classList.add("disabled"),i.classList.remove("hide")):(console.log("not empty"),t.removeAttribute("disabled"),t.classList.remove("disabled"),i.classList.add("hide"))},N=(e,o)=>{const n=o.querySelector(".cart_item_types");n.innerHTML="",e.type.forEach((m,g)=>{const f=document.createElement("div");f.className="cart_item_type",f.innerHTML=`${m}
        <button class="cart_item_type-delete ${l?"hide":""}">
          <div class="icon-embed-xtiny">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
              <path d="M1 1L15 15" stroke="currentColor" stroke-width="2"/>
              <path d="M1 15L15 0.999999" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </button>`,n.appendChild(f),f.querySelector(".cart_item_type-delete").addEventListener("click",()=>{e.type.splice(g,1),e.type.length===0?b(e):(localStorage.setItem("cartItems",JSON.stringify(u)),v())})})},v=()=>{const e=document.querySelector(".cart_item-list");if(e){if(e.innerHTML="",!Array.isArray(u)){console.error("Stored cart items are not an array.");return}V(),u.forEach(o=>{const n=document.createElement("div");n.classList.add("cart_item"),n.innerHTML=`
      <div class="cart_item_layout">
          <div class="cart_item_content">
              <div class="cart_item_title">${o.name}</div>
              <div class="cart_item_types">
                <!-- types are placed here-->
              </div>
              <div class="cart_item_description">${o.description}</div>
          </div>
          <button class="cart_item_delete ${l?"hide":""}">
            <div class="icon-embed-xsmall">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                <g clip-path="url(#clip0_10460_12824)">
                  <path d="M4.5 20C4.5 20.5304 4.71071 21.0391 5.08579 21.4142C5.46086 21.7893 5.96957 22 6.5 22H16.5C17.0304 22 17.5391 21.7893 17.9142 21.4142C18.2893 21.0391 18.5 20.5304 18.5 20V8H20.5V6H16.5V4C16.5 3.46957 16.2893 2.96086 15.9142 2.58579C15.5391 2.21071 15.0304 2 14.5 2H8.5C7.96957 2 7.46086 2.21071 7.08579 2.58579C6.71071 2.96086 6.5 3.46957 6.5 4V6H2.5V8H4.5V20ZM8.5 4H14.5V6H8.5V4ZM16.5 8V20H6.5V8H16.5Z" fill="#D31E3D"/>
                  <path d="M8.5 10H10.5V18H8.5V10ZM12.5 10H14.5V18H12.5V10Z" fill="#D31E3D"/>
                </g>
                <defs>
                  <clipPath id="clip0_10460_12824">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </button>
      </div>
    `,e.appendChild(n),N(o,n),n.querySelector(".cart_item_delete").addEventListener("click",()=>{b(o)}),w()})}},b=e=>{u=u.filter(o=>o!==e),localStorage.setItem("cartItems",JSON.stringify(u)),v(),w()};v();const S=(e,o)=>{e.addEventListener("click",n=>{const m=o.querySelector(".variant_title").textContent.trim(),g=o.querySelector(".variant_description").textContent.trim(),f=n.currentTarget.dataset.type,h=u.findIndex(p=>p.name===m);if(h!==-1){const p=u[h];p.type.includes(f)?r(`You've already added "${p.name}".`):(p.type.push(f),localStorage.setItem("cartItems",JSON.stringify(u)),v())}else{const p={name:m,description:g,type:[f]};u.push(p),localStorage.setItem("cartItems",JSON.stringify(u)),v(),w(),r(`"${p.name}" has been added to your cart.`)}})};document.querySelectorAll(".variant").forEach(e=>{const o=e.querySelector(".button.is-add-sheet"),n=e.querySelector(".button.is-add-roll"),m=e.querySelector(".button.is-add-printed"),g=e.querySelector(".button.is-add-sleeve"),f=e.querySelector(".button.is-add-indoor"),h=e.querySelector(".button.is-add-outdoor");o&&S(o,e),n&&S(n,e),m&&S(m,e),g&&S(g,e),f&&S(f,e),h&&S(h,e)});function C(){const e=JSON.parse(localStorage.getItem("cartItems"));let o=`The person has requested these samples:
`;return e.forEach(n=>{const m=n.type.join(" + ")+" sample";o+=`    - ${n.name}: ${m}
`}),o}document.querySelector('[data-form="submit-btn"]')&&document.querySelector('[data-form="submit-btn"]').addEventListener("click",()=>{c.classList.add("hide")});const q=document.querySelector(".multistep_block");q&&q.querySelectorAll("input").forEach(o=>{o.addEventListener("blur",()=>{a.value=C(),console.log(C())})}),function(){const e=({onlyWorkOnThisFormName:n,onSuccess:m,onFail:g})=>{d.default(document).ajaxComplete(function(f,h,p){if(p.url.includes("https://webflow.com/api/v1/form/")){const I=h.status===200,E=n==null,O=!E&&p.data.includes(o(n));(E||O)&&(I?m():g())}})};function o(n){return n.replaceAll(" ","+")}return{init:e}}().init({onlyWorkOnThisFormName:"form-samples",onSuccess:()=>{console.log("Form is Success"),s.textContent="Your order",localStorage.removeItem("cartItems"),document.querySelector(".multistep_component").classList.add("reversed")},onFail:()=>{console.log("form is Failed")}})}function T(){function t(i,s,a){const r=new Date;r.setTime(r.getTime()+a*24*60*60*1e3);const l="expires="+r.toUTCString();document.cookie=i+"="+s+";"+l+";path=/"}function c(i){const s=i+"=",a=document.cookie.split(";");for(let r=0;r<a.length;r++){let l=a[r];for(;l.charAt(0)==" ";)l=l.substring(1,l.length);if(l.indexOf(s)==0)return l.substring(s.length,l.length)}return null}document.querySelector(".banner_close-button").addEventListener("click",function(){t("correct-language","true",7)}),window.onload=function(){if(c("correct-language")!=="true"){const s=document.querySelector(".banner_component");s&&s.classList.remove("hide")}}}function H(){let t;d.default(".home-accordion_accordion").on("click",function(){return d.default(".active").removeClass("active"),d.default(this).addClass("active"),clearInterval(t),c(),!1});function c(){t=setInterval(function(){let i=d.default(".home-accordion_component .active");i.next().length>0?i.next().addClass("active"):d.default(".home-accordion_accordion").eq(0).addClass("active"),i.removeClass("active")},17e3)}c()}function B(){const t=document.querySelector(".banner_component");window.scrollY>1&&(t.classList.contains("is-scrolled")||t.classList.add("is-scrolled")),window.addEventListener("scroll",function(){window.scrollY>1?(console.log("Page scrolled more than 1px."),t.classList.contains("is-scrolled")||t.classList.add("is-scrolled")):t.classList.contains("is-scrolled")&&t.classList.remove("is-scrolled")});function c(){window.innerWidth<991?(d.default(".nav_dropdown-toggle").addClass("w--open"),d.default(".nav_dropdown-list").addClass("w--open")):(d.default(".nav_dropdown-toggle").removeClass("w--open"),d.default(".nav_dropdown-list").removeClass("w--open"))}d.default(document).ready(c),d.default(window).resize(c)}function M(){const t=document.querySelector(".page-wrapper");w(),B(),k(),T();const c=()=>{document.querySelectorAll("[data-list-parent]").forEach(s=>{let a=s.querySelector("[data-list]"),r;a&&(r=a.firstElementChild||a),r.classList.contains("w-dyn-empty")||r.childElementCount===0?s.classList.add("hide"):s.classList.contains("hide")&&s.classList.remove("hide")})};if(c(),setTimeout(()=>{c()},1e3),setTimeout(()=>{c()},2e3),t.classList.contains("home"))H();else if(!t.classList.contains("contact")){if(t.classList.contains("product-detail")){const i=document.querySelector(".product-detail_expand-all"),s=[...document.querySelectorAll(".variant_top")];s.forEach(r=>{r.addEventListener("click",l=>{const y=l.currentTarget;y.dataset.state==="open"?y.dataset.state="closed":(y.dataset.state==="closed"||!y.dataset.state)&&(y.dataset.state="open")})});let a=0;i.addEventListener("click",()=>{a++,console.log(a),s.forEach(function(r){a%2==0?r.dataset.state==="open"&&r.click():(r.dataset.state==="closed"||!r.dataset.state)&&r.click()})})}}}M()});