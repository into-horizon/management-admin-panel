import{m as i,n as d,r as p,bk as m,j as r,aK as g,bl as c}from"./index-48Ud3P6g.js";import{O as x}from"./OrdersModel-CkPWa7Jd.js";import{P as f}from"./Paginator-C-gW1K4z.js";import"./Pdf-DyouSArg.js";import"./Table-BMwozXSY.js";import"./lodash-BeNFXnYs.js";import"./index.esm-CyPqoXYn.js";import"./cil-check-CLln4ywF.js";import"./cil-cloud-download-cGFCWpXr.js";import"./cil-description-zu5GvIGG.js";import"./CopyableText-CpXrf0Nf.js";const y=()=>{const{pendingParams:e,pendingOrders:{data:n,count:a},isLoading:o}=i(s=>s.orders),t=d();return p.useEffect(()=>{t(m())},[e]),r.jsxs(r.Fragment,{children:[r.jsx("h2",{children:"pending orders"}),o?r.jsx(g,{}):r.jsx(x,{data:n,type:"pending"}),r.jsx(f,{params:e,count:+a,cookieName:"pendingOrder",onPageChange:s=>t(c({offset:(s-1)*e.limit}))})]})};export{y as default};
