(window.webpackJsonp=window.webpackJsonp||[]).push([["vendors/dedent"],{"./node_modules/dedent/dist/dedent.js":
/*!********************************************!*\
  !*** ./node_modules/dedent/dist/dedent.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */function(n,e,t){"use strict";n.exports=function(n){var e=void 0;e="string"==typeof n?[n]:n.raw;for(var t="",r=0;r<e.length;r++)t+=e[r].replace(/\\\n[ \t]*/g,"").replace(/\\`/g,"`"),r<(arguments.length<=1?0:arguments.length-1)&&(t+=arguments.length<=r+1?void 0:arguments[r+1]);var o=t.split("\n"),i=null;return o.forEach(function(n){var e=n.match(/^(\s+)\S+/);if(e){var t=e[1].length;i=i?Math.min(i,t):t}}),null!==i&&(t=o.map(function(n){return" "===n[0]?n.slice(i):n}).join("\n")),(t=t.trim()).replace(/\\n/g,"\n")}}}]);
//# sourceMappingURL=dedent.bundle.js.map