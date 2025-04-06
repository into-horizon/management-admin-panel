import{a8 as z,g as re,c2 as ae,c as ne,r as b,m as ie,ax as se,j as d,k as oe,P as L,Q as I,ab as le,aq as ue,c3 as fe,ar as de,c4 as ce,c5 as D}from"./index-48Ud3P6g.js";import{r as G}from"./index-Chjiymov.js";import{C as pe}from"./index.esm-CyPqoXYn.js";import{P as ge}from"./Paginator-C-gW1K4z.js";import{c as ve}from"./connect-C6z2JEc3.js";import"./lodash-BeNFXnYs.js";const he=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M276.055,143.463,196.592,64,87.571,173.021l-.041-.041L19.381,241.128l-4.3,4.328-7.085,7,68.217,68.216,11.342,11.26L196.592,440.967,276.055,361.5,167.034,252.484ZM196.592,395.712,98.885,298.005,87.53,286.732,53.348,252.551l.041-.041-.067-.068L87.53,218.235l.041.041L196.592,109.255,230.8,143.463,121.779,252.484,230.8,361.5Z' class='ci-primary'/><path fill='var(--ci-primary-color, currentColor)' d='M497.263,143.463,417.8,64,308.713,173.088l-.042-.041L240.59,241.128,229.4,252.406l-.119.119,68.148,68.148,11.288,11.2L417.8,440.967,497.263,361.5,388.242,252.484ZM452.008,361.5,417.8,395.712l-97.707-97.707-11.28-11.2-34.325-34.324,34.316-34.316.042.041L417.8,109.255l34.207,34.208L342.987,252.484Z' class='ci-primary'/>"];var P={},O={},q={},M={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/var T;function ye(){return T||(T=1,function(m){(function(){var R={}.hasOwnProperty;function l(){for(var i="",n=0;n<arguments.length;n++){var v=arguments[n];v&&(i=f(i,g(v)))}return i}function g(i){if(typeof i=="string"||typeof i=="number")return i;if(typeof i!="object")return"";if(Array.isArray(i))return l.apply(null,i);if(i.toString!==Object.prototype.toString&&!i.toString.toString().includes("[native code]"))return i.toString();var n="";for(var v in i)R.call(i,v)&&i[v]&&(n=f(n,v));return n}function f(i,n){return n?i?i+" "+n:i+n:i}m.exports?(l.default=l,m.exports=l):window.classNames=l})()}(M)),M.exports}var B;function me(){if(B)return q;B=1,Object.defineProperty(q,"__esModule",{value:!0});var m=function(){function a(r,s){for(var e=0;e<s.length;e++){var t=s[e];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(r,t.key,t)}}return function(r,s,e){return s&&a(r.prototype,s),e&&a(r,e),r}}(),R=z(),l=v(R),g=ye(),f=v(g),i=G(),n=v(i);function v(a){return a&&a.__esModule?a:{default:a}}function x(a,r){if(!(a instanceof r))throw new TypeError("Cannot call a class as a function")}function h(a,r){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r&&(typeof r=="object"||typeof r=="function")?r:a}function w(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof r);a.prototype=Object.create(r&&r.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(a,r):a.__proto__=r)}var C=function(a){w(r,a);function r(){return x(this,r),h(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return m(r,[{key:"render",value:function(){var e=this.props,t=e.changeRating,o=e.hoverOverStar,u=e.unHoverOverStar,c=e.svgIconViewBox,p=e.svgIconPath;return l.default.createElement("div",{className:"star-container",style:this.starContainerStyle,onMouseEnter:o,onMouseLeave:u,onClick:t},l.default.createElement("svg",{viewBox:c,className:this.starClasses,style:this.starSvgStyle},l.default.createElement("path",{className:"star",style:this.pathStyle,d:p})))}},{key:"starContainerStyle",get:function(){var e=this.props,t=e.changeRating,o=e.starSpacing,u=e.isFirstStar,c=e.isLastStar,p=e.ignoreInlineStyles,y={position:"relative",display:"inline-block",verticalAlign:"middle",paddingLeft:u?void 0:o,paddingRight:c?void 0:o,cursor:t?"pointer":void 0};return p?{}:y}},{key:"starSvgStyle",get:function(){var e=this.props,t=e.ignoreInlineStyles,o=e.isCurrentHoveredStar,u=e.starDimension,c={width:u,height:u,transition:"transform .2s ease-in-out",transform:o?"scale(1.1)":void 0};return t?{}:c}},{key:"pathStyle",get:function(){var e=this.props,t=e.isStarred,o=e.isPartiallyFullStar,u=e.isHovered,c=e.hoverMode,p=e.starEmptyColor,y=e.starRatedColor,E=e.starHoverColor,H=e.gradientPathName,j=e.fillId,N=e.ignoreInlineStyles,_=void 0;c?u?_=E:_=p:o?_="url('"+H+"#"+j+"')":t?_=y:_=p;var k={fill:_,transition:"fill .2s ease-in-out"};return N?{}:k}},{key:"starClasses",get:function(){var e=this.props,t=e.isSelected,o=e.isPartiallyFullStar,u=e.isHovered,c=e.isCurrentHoveredStar,p=e.ignoreInlineStyles,y=(0,f.default)({"widget-svg":!0,"widget-selected":t,"multi-widget-selected":o,hovered:u,"current-hovered":c});return p?{}:y}}]),r}(l.default.Component);return C.propTypes={fillId:n.default.string.isRequired,changeRating:n.default.func,hoverOverStar:n.default.func,unHoverOverStar:n.default.func,isStarred:n.default.bool.isRequired,isPartiallyFullStar:n.default.bool.isRequired,isHovered:n.default.bool.isRequired,hoverMode:n.default.bool.isRequired,isCurrentHoveredStar:n.default.bool.isRequired,isFirstStar:n.default.bool.isRequired,isLastStar:n.default.bool.isRequired,starDimension:n.default.string.isRequired,starSpacing:n.default.string.isRequired,starHoverColor:n.default.string.isRequired,starRatedColor:n.default.string.isRequired,starEmptyColor:n.default.string.isRequired,gradientPathName:n.default.string.isRequired,ignoreInlineStyles:n.default.bool.isRequired,svgIconPath:n.default.string.isRequired,svgIconViewBox:n.default.string.isRequired},q.default=C,q}var V;function Se(){if(V)return O;V=1,Object.defineProperty(O,"__esModule",{value:!0});var m=function(){function a(r,s){for(var e=0;e<s.length;e++){var t=s[e];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(r,t.key,t)}}return function(r,s,e){return s&&a(r.prototype,s),e&&a(r,e),r}}(),R=z(),l=v(R),g=G(),f=v(g),i=me(),n=v(i);function v(a){return a&&a.__esModule?a:{default:a}}function x(a,r){if(!(a instanceof r))throw new TypeError("Cannot call a class as a function")}function h(a,r){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r&&(typeof r=="object"||typeof r=="function")?r:a}function w(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof r);a.prototype=Object.create(r&&r.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(a,r):a.__proto__=r)}var C=function(a){w(r,a);function r(){var s,e,t,o;x(this,r);for(var u=arguments.length,c=Array(u),p=0;p<u;p++)c[p]=arguments[p];return o=(e=(t=h(this,(s=r.__proto__||Object.getPrototypeOf(r)).call.apply(s,[this].concat(c))),t),t.state={highestStarHovered:-1/0},t.fillId="starGrad"+Math.random().toFixed(15).slice(2),t.hoverOverStar=function(y){return function(){t.setState({highestStarHovered:y})}},t.unHoverOverStar=function(){t.setState({highestStarHovered:-1/0})},e),h(t,o)}return m(r,[{key:"stopColorStyle",value:function(e){var t={stopColor:e,stopOpacity:"1"};return this.props.ignoreInlineStyles?{}:t}},{key:"render",value:function(){var e=this.props,t=e.starRatedColor,o=e.starEmptyColor;return l.default.createElement("div",{className:"star-ratings",title:this.titleText,style:this.starRatingsStyle},l.default.createElement("svg",{className:"star-grad",style:this.starGradientStyle},l.default.createElement("defs",null,l.default.createElement("linearGradient",{id:this.fillId,x1:"0%",y1:"0%",x2:"100%",y2:"0%"},l.default.createElement("stop",{offset:"0%",className:"stop-color-first",style:this.stopColorStyle(t)}),l.default.createElement("stop",{offset:this.offsetValue,className:"stop-color-first",style:this.stopColorStyle(t)}),l.default.createElement("stop",{offset:this.offsetValue,className:"stop-color-final",style:this.stopColorStyle(o)}),l.default.createElement("stop",{offset:"100%",className:"stop-color-final",style:this.stopColorStyle(o)})))),this.renderStars)}},{key:"starRatingsStyle",get:function(){var e={position:"relative",boxSizing:"border-box",display:"inline-block"};return this.props.ignoreInlineStyles?{}:e}},{key:"starGradientStyle",get:function(){var e={position:"absolute",zIndex:"0",width:"0",height:"0",visibility:"hidden"};return this.props.ignoreInlineStyles?{}:e}},{key:"titleText",get:function(){var e=this.props,t=e.typeOfWidget,o=e.rating,u=this.state.highestStarHovered,c=u>0?u:o,p=parseFloat(c.toFixed(2)).toString();Number.isInteger(c)&&(p=String(c));var y=t+"s";return p==="1"&&(y=t),p+" "+y}},{key:"offsetValue",get:function(){var e=this.props.rating,t=Number.isInteger(e),o="0%";if(!t){var u=e.toFixed(2).split(".")[1].slice(0,2);o=u+"%"}return o}},{key:"renderStars",get:function(){var e=this,t=this.props,o=t.changeRating,u=t.rating,c=t.numberOfStars,p=t.starDimension,y=t.starSpacing,E=t.starRatedColor,H=t.starEmptyColor,j=t.starHoverColor,N=t.gradientPathName,_=t.ignoreInlineStyles,k=t.svgIconPath,W=t.svgIconViewBox,Z=t.name,F=this.state.highestStarHovered,$=Array.apply(null,Array(c));return $.map(function(Ie,Q){var S=Q+1,J=S<=u,K=F>0,U=S<=F,X=S===F,Y=S>u&&S-1<u,ee=S===1,te=S===c;return l.default.createElement(n.default,{key:S,fillId:e.fillId,changeRating:o?function(){return o(S,Z)}:null,hoverOverStar:o?e.hoverOverStar(S):null,unHoverOverStar:o?e.unHoverOverStar:null,isStarred:J,isPartiallyFullStar:Y,isHovered:U,hoverMode:K,isCurrentHoveredStar:X,isFirstStar:ee,isLastStar:te,starDimension:p,starSpacing:y,starHoverColor:j,starRatedColor:E,starEmptyColor:H,gradientPathName:N,ignoreInlineStyles:_,svgIconPath:k,svgIconViewBox:W})})}}]),r}(l.default.Component);return C.propTypes={rating:f.default.number.isRequired,numberOfStars:f.default.number.isRequired,changeRating:f.default.func,starHoverColor:f.default.string.isRequired,starRatedColor:f.default.string.isRequired,starEmptyColor:f.default.string.isRequired,starDimension:f.default.string.isRequired,starSpacing:f.default.string.isRequired,gradientPathName:f.default.string.isRequired,ignoreInlineStyles:f.default.bool.isRequired,svgIconPath:f.default.string.isRequired,svgIconViewBox:f.default.string.isRequired,name:f.default.string},C.defaultProps={rating:0,typeOfWidget:"Star",numberOfStars:5,changeRating:null,starHoverColor:"rgb(230, 67, 47)",starRatedColor:"rgb(109, 122, 130)",starEmptyColor:"rgb(203, 211, 227)",starDimension:"50px",starSpacing:"7px",gradientPathName:"",ignoreInlineStyles:!1,svgIconPath:"m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z",svgIconViewBox:"0 0 51 48"},O.default=C,O}var A;function Re(){if(A)return P;A=1,Object.defineProperty(P,"__esModule",{value:!0});var m=Se(),R=l(m);function l(g){return g&&g.__esModule?g:{default:g}}return Number.isInteger=Number.isInteger||function(g){return typeof g=="number"&&isFinite(g)&&Math.floor(g)===g},P.default=R.default,P}var _e=Re();const xe=re(_e),Ce=({getProductReviews:m})=>{const R=ne(),[l,g]=b.useState(!0),[f,i]=b.useState({limit:10,offset:0}),{reviews:{data:n,count:v}}=ie(h=>h.products),{id:x}=se();return b.useEffect(()=>{m({id:x,...f}).then(()=>g(!1))},[x]),l?d.jsx(oe,{color:"primary"}):d.jsxs(d.Fragment,{children:[d.jsx(L,{className:"justify-content-end",children:d.jsx(I,{xs:"auto",children:d.jsxs(le,{onClick:()=>R(-1),color:"secondary",size:"lg",children:[d.jsx(pe,{icon:he,size:"lg"}),"Back"]})})}),d.jsx(L,{className:"justify-content-center",children:b.Children.toArray(n.map(h=>d.jsx(I,{xs:12,children:d.jsx(ue,{className:"mb-3",style:{maxWidth:"540px"},children:d.jsxs(L,{className:"g-0",children:[d.jsx(I,{xs:4,children:d.jsx(fe,{src:h.profile_picture})}),d.jsx(I,{xs:8,children:d.jsxs(de,{children:[d.jsx(ce,{children:`${h.first_name} ${h.last_name}`}),d.jsx(D,{children:h.review}),d.jsx(xe,{rating:h.rate,starDimension:"20px",starSpacing:"5px",starRatedColor:"yellow"}),d.jsx(D,{children:d.jsx("small",{className:"text-medium-emphasis",children:new Date(h.created_at).toLocaleDateString()})})]})})]})})})))}),d.jsx(ge,{cookieName:"reviews",count:v,changeData:m,params:f,updateParams:i,updateLoading:g})]})},be={getProductReviews:ae},je=ve(null,be)(Ce);export{Ce as ProductReviews,je as default};
