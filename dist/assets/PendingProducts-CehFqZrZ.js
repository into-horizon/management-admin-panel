import{n as M,r as t,m as k,c0 as F,am as R,j as e,c1 as S,aN as Z,R as x,bY as m,ab as r,aa as c,aC as u,aD as g,aE as C,P as p,Q as l,F as D,ac as T,a_ as $,aG as E,b1 as f}from"./index-48Ud3P6g.js";import{C as a}from"./index.esm-CyPqoXYn.js";import{T as N,c as A}from"./Table-BMwozXSY.js";import{c as I}from"./cil-check-CLln4ywF.js";import{c as L}from"./cil-description-zu5GvIGG.js";import"./Paginator-C-gW1K4z.js";import"./lodash-BeNFXnYs.js";const B=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M40,472H472V40H40ZM440,348.142,328.628,236.769l46.6-46.6L440,254.935ZM72,72H440V209.68l-64.769-64.77L306,214.142l-100-100-134,134Zm0,221.4,134-134,234,234V440H72Z' class='ci-primary'/>"],w=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M472,16H168a24,24,0,0,0-24,24V344a24,24,0,0,0,24,24H472a24,24,0,0,0,24-24V40A24,24,0,0,0,472,16Zm-8,320H176V48H464Z' class='ci-primary'/><path fill='var(--ci-primary-color, currentColor)' d='M112,400V80H80V408a24,24,0,0,0,24,24H432V400Z' class='ci-primary'/><path fill='var(--ci-primary-color, currentColor)' d='M48,464V144H16V472a24,24,0,0,0,24,24H368V464Z' class='ci-primary'/>"],W=()=>{const o=M(),[y,q]=t.useState({limit:10,offset:0}),{pending:{data:b,count:_},isLoading:H,pendingParams:i}=k(s=>s.products);t.useEffect(()=>{o(F())},[i]),R.on("pending",()=>{});const P=[{header:"arabic title",field:"artitle"},{header:"english title",field:"entitle"},{header:"store name",field:"store_name"},{header:"Details",body:s=>{const[d,n]=t.useState(!1);return e.jsxs(x.Fragment,{children:[e.jsx(m,{content:e.jsxs(e.Fragment,{children:[s.parent_category_id&&e.jsxs("p",{children:[e.jsx("strong",{children:"parent category"})," ",e.jsx("span",{children:`${s.p_entitle} - ${s.p_artitle}`})]}),s.child_category_id&&e.jsxs("p",{children:[e.jsx("strong",{children:"child category"})," ",e.jsx("span",{children:`${s.c_entitle} - ${s.c_artitle}`})]}),s.grandchild_category_id&&e.jsxs("p",{children:[e.jsx("strong",{children:"grandchild category"})," ",e.jsx("span",{children:`${s.g_entitle} - ${s.g_artitle}`})]})]}),placement:"top",children:e.jsx(r,{color:"link",children:e.jsx(c,{content:"categories",children:e.jsx(a,{icon:w})})})}),e.jsx(c,{content:"images",children:e.jsx(r,{onClick:()=>n(!0),color:"link",children:e.jsx(a,{icon:B})})}),e.jsxs(u,{visible:d,onClose:()=>n(!1),alignment:"center",children:[e.jsx(g,{children:e.jsx(C,{children:"Product Images"})}),e.jsx(p,{className:"justify-content-center align-items-center",children:t.Children.toArray(s.pictures.map(({product_picture:h})=>e.jsx(l,{xs:4,children:e.jsx(D,{rounded:!0,thumbnail:!0,src:h,width:600,height:600})})))})]}),e.jsx(m,{content:e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:[e.jsx("strong",{children:"English description"}),": ",s.endescription]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Arabic description"}),": ",s.ardescription]})]}),children:e.jsx(r,{color:"link",children:e.jsx(c,{content:"description",children:e.jsx(a,{icon:L})})})})]})}},{header:"status",field:"status",body:s=>{const[d,n]=t.useState(!1),h=j=>{j.preventDefault();const v=j.currentTarget;o(f({...s,status:"rejected",rejection_reason:v.rejection_reason.value}))};return e.jsxs(x.Fragment,{children:[e.jsxs(u,{visible:d,alignment:"center",onClose:()=>n(!1),children:[e.jsx(g,{children:e.jsx(C,{children:"Product Rejection"})}),e.jsxs(T,{onSubmit:h,children:[e.jsx(p,{className:"justify-content-center align-items-center",children:e.jsx(l,{xs:10,children:e.jsx($,{label:"Rejection Reason",id:"rejection_reason",required:!0})})}),e.jsxs(E,{children:[e.jsx(r,{color:"danger",type:"submit",children:"Reject"}),e.jsx(r,{color:"secondary",onClick:()=>n(!1),children:"Close"})]})]})]}),s.status==="pending"?e.jsxs(p,{children:[e.jsx(l,{xs:"auto",children:e.jsx(c,{content:"Approve",children:e.jsx(r,{color:"success",onClick:()=>o(f({id:s.id,status:"approved"})),children:e.jsx(a,{icon:I})})})}),e.jsx(l,{xs:"auto",children:e.jsx(c,{content:"Reject",children:e.jsx(r,{color:"danger",onClick:()=>n(!0),children:e.jsx(a,{icon:A})})})})]}):e.jsx("span",{children:s.status})]})}}];function V(s){o(S(Z(i,s)))}return e.jsx(e.Fragment,{children:e.jsx(N,{data:b,count:_,params:y,loading:H,columns:P,pageSize:i.limit,pageNumber:i.offset/i.limit+1,onPageChange:V,cookieName:"pending"})})};export{W as default};
