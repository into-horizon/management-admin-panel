import{R as _,c6 as se,r as m,c7 as Pe,c8 as he,c9 as me,ca as ye}from"./index-48Ud3P6g.js";function R(){return R=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)({}).hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},R.apply(null,arguments)}function L(e,r){if(e==null)return{};var t={};for(var n in e)if({}.hasOwnProperty.call(e,n)){if(r.includes(n))continue;t[n]=e[n]}return t}var ge=["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef","forwardRef","context"],Se=["reactReduxForwardedRef"],we=[],Me=[null,null];function Oe(e,r){var t=e[1];return[r.payload,t+1]}function ie(e,r,t){ye(function(){return e.apply(void 0,r)},t)}function Ce(e,r,t,n,a,o,s){e.current=n,r.current=a,t.current=!1,o.current&&(o.current=null,s())}function Ee(e,r,t,n,a,o,s,i,d,c){if(e){var u=!1,f=null,l=function(){if(!u){var O=r.getState(),g,P;try{g=n(O,a.current)}catch(S){P=S,f=S}P||(f=null),g===o.current?s.current||d():(o.current=g,i.current=g,s.current=!0,c({type:"STORE_UPDATED",payload:{error:P}}))}};t.onStateChange=l,t.trySubscribe(),l();var v=function(){if(u=!0,t.tryUnsubscribe(),t.onStateChange=null,f)throw f};return v}}var Fe=function(){return[null,0]};function Re(e,r){r===void 0&&(r={});var t=r,n=t.getDisplayName,a=n===void 0?function(y){return"ConnectAdvanced("+y+")"}:n,o=t.methodName,s=o===void 0?"connectAdvanced":o,i=t.renderCountProp,d=i===void 0?void 0:i,c=t.shouldHandleStateChanges,u=c===void 0?!0:c,f=t.storeKey,l=f===void 0?"store":f;t.withRef;var v=t.forwardRef,q=v===void 0?!1:v,O=t.context,g=O===void 0?Pe:O,P=L(t,ge),S=g;return function(p){var w=p.displayName||p.name||"Component",M=a(w),V=R({},P,{getDisplayName:a,methodName:s,renderCountProp:d,shouldHandleStateChanges:u,storeKey:l,displayName:M,wrappedComponentName:w,WrappedComponent:p}),T=P.pure;function Y(h){return e(h.dispatch,V)}var A=T?m.useMemo:function(h){return h()};function b(h){var N=m.useMemo(function(){var U=h.reactReduxForwardedRef,Q=L(h,Se);return[h.context,U,Q]},[h]),C=N[0],H=N[1],D=N[2],W=m.useMemo(function(){return C&&C.Consumer&&he.isContextConsumer(_.createElement(C.Consumer,null))?C:S},[C,S]),E=m.useContext(W),I=!!h.store&&!!h.store.getState&&!!h.store.dispatch;E&&E.store;var F=I?h.store:E.store,j=m.useMemo(function(){return Y(F)},[F]),re=m.useMemo(function(){if(!u)return Me;var U=me(F,I?null:E.subscription),Q=U.notifyNestedSubs.bind(U);return[U,Q]},[F,I,E]),k=re[0],te=re[1],ne=m.useMemo(function(){return I?E:R({},E,{subscription:k})},[I,E,k]),oe=m.useReducer(Oe,we,Fe),de=oe[0],B=de[0],le=oe[1];if(B&&B.error)throw B.error;var ae=m.useRef(),z=m.useRef(D),K=m.useRef(),ue=m.useRef(!1),G=A(function(){return K.current&&D===z.current?K.current:j(F.getState(),D)},[F,B,D]);ie(Ce,[z,ae,ue,D,G,K,te]),ie(Ee,[u,F,k,j,z,ae,ue,K,te,le],[F,k,j]);var J=m.useMemo(function(){return _.createElement(p,R({},G,{ref:H}))},[H,p,G]),ve=m.useMemo(function(){return u?_.createElement(W.Provider,{value:ne},J):J},[W,J,ne]);return ve}var x=T?_.memo(b):b;if(x.WrappedComponent=p,x.displayName=b.displayName=M,q){var $=_.forwardRef(function(N,C){return _.createElement(x,R({},N,{reactReduxForwardedRef:C}))});return $.displayName=M,$.WrappedComponent=p,se($,p)}return se(x,p)}}function ce(e,r){return e===r?e!==0||r!==0||1/e===1/r:e!==e&&r!==r}function X(e,r){if(ce(e,r))return!0;if(typeof e!="object"||e===null||typeof r!="object"||r===null)return!1;var t=Object.keys(e),n=Object.keys(r);if(t.length!==n.length)return!1;for(var a=0;a<t.length;a++)if(!Object.prototype.hasOwnProperty.call(r,t[a])||!ce(e[t[a]],r[t[a]]))return!1;return!0}function qe(e,r){var t={},n=function(s){var i=e[s];typeof i=="function"&&(t[s]=function(){return r(i.apply(void 0,arguments))})};for(var a in e)n(a);return t}function ee(e){return function(t,n){var a=e(t,n);function o(){return a}return o.dependsOnOwnProps=!1,o}}function pe(e){return e.dependsOnOwnProps!==null&&e.dependsOnOwnProps!==void 0?!!e.dependsOnOwnProps:e.length!==1}function fe(e,r){return function(n,a){a.displayName;var o=function(i,d){return o.dependsOnOwnProps?o.mapToProps(i,d):o.mapToProps(i)};return o.dependsOnOwnProps=!0,o.mapToProps=function(i,d){o.mapToProps=e,o.dependsOnOwnProps=pe(e);var c=o(i,d);return typeof c=="function"&&(o.mapToProps=c,o.dependsOnOwnProps=pe(c),c=o(i,d)),c},o}}function Ne(e){return typeof e=="function"?fe(e):void 0}function xe(e){return e?void 0:ee(function(r){return{dispatch:r}})}function _e(e){return e&&typeof e=="object"?ee(function(r){return qe(e,r)}):void 0}const Te=[Ne,xe,_e];function be(e){return typeof e=="function"?fe(e):void 0}function $e(e){return e?void 0:ee(function(){return{}})}const De=[be,$e];function Ie(e,r,t){return R({},t,e,r)}function Ue(e){return function(t,n){n.displayName;var a=n.pure,o=n.areMergedPropsEqual,s=!1,i;return function(c,u,f){var l=e(c,u,f);return s?(!a||!o(l,i))&&(i=l):(s=!0,i=l),i}}}function Ae(e){return typeof e=="function"?Ue(e):void 0}function He(e){return e?void 0:function(){return Ie}}const ke=[Ae,He];var Be=["initMapStateToProps","initMapDispatchToProps","initMergeProps"];function Ke(e,r,t,n){return function(o,s){return t(e(o,s),r(n,s),s)}}function Le(e,r,t,n,a){var o=a.areStatesEqual,s=a.areOwnPropsEqual,i=a.areStatePropsEqual,d=!1,c,u,f,l,v;function q(y,p){return c=y,u=p,f=e(c,u),l=r(n,u),v=t(f,l,u),d=!0,v}function O(){return f=e(c,u),r.dependsOnOwnProps&&(l=r(n,u)),v=t(f,l,u),v}function g(){return e.dependsOnOwnProps&&(f=e(c,u)),r.dependsOnOwnProps&&(l=r(n,u)),v=t(f,l,u),v}function P(){var y=e(c,u),p=!i(y,f);return f=y,p&&(v=t(f,l,u)),v}function S(y,p){var w=!s(p,u),M=!o(y,c,p,u);return c=y,u=p,w&&M?O():w?g():M?P():v}return function(p,w){return d?S(p,w):q(p,w)}}function Ve(e,r){var t=r.initMapStateToProps,n=r.initMapDispatchToProps,a=r.initMergeProps,o=L(r,Be),s=t(e,o),i=n(e,o),d=a(e,o),c=o.pure?Le:Ke;return c(s,i,d,e,o)}var Ye=["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"];function Z(e,r,t){for(var n=r.length-1;n>=0;n--){var a=r[n](e);if(a)return a}return function(o,s){throw new Error("Invalid value of type "+typeof e+" for "+t+" argument when connecting component "+s.wrappedComponentName+".")}}function We(e,r){return e===r}function je(e){var r={},t=r.connectHOC,n=t===void 0?Re:t,a=r.mapStateToPropsFactories,o=a===void 0?De:a,s=r.mapDispatchToPropsFactories,i=s===void 0?Te:s,d=r.mergePropsFactories,c=d===void 0?ke:d,u=r.selectorFactory,f=u===void 0?Ve:u;return function(v,q,O,g){g===void 0&&(g={});var P=g,S=P.pure,y=S===void 0?!0:S,p=P.areStatesEqual,w=p===void 0?We:p,M=P.areOwnPropsEqual,V=M===void 0?X:M,T=P.areStatePropsEqual,Y=T===void 0?X:T,A=P.areMergedPropsEqual,b=A===void 0?X:A,x=L(P,Ye),$=Z(v,o,"mapStateToProps"),h=Z(q,i,"mapDispatchToProps"),N=Z(O,c,"mergeProps");return n(f,R({methodName:"connect",getDisplayName:function(H){return"Connect("+H+")"},shouldHandleStateChanges:!!v,initMapStateToProps:$,initMapDispatchToProps:h,initMergeProps:N,pure:y,areStatesEqual:w,areOwnPropsEqual:V,areStatePropsEqual:Y,areMergedPropsEqual:b},x))}}const Ge=je();export{Ge as c};
