(window.webpackJsonp=window.webpackJsonp||[]).push([["filter-box-view"],{"./src/Template/Layout/js/app/components/filter-box.js":
/*!*************************************************************!*\
  !*** ./src/Template/Layout/js/app/components/filter-box.js ***!
  \*************************************************************/
/*! exports provided: default */
/*! all exports used */function(t,e,i){"use strict";i.r(e);var a=i(/*! app/mixins/paginated-content */"./src/Template/Layout/js/app/mixins/paginated-content.js"),n=i(/*! deepmerge */"./node_modules/deepmerge/dist/es.js");e.default={components:{InputDynamicAttributes:()=>i.e(/*! import() | input-dynamic-attributes */"input-dynamic-attributes").then(i.bind(null,/*! app/components/input-dynamic-attributes */"./src/Template/Layout/js/app/components/input-dynamic-attributes.js"))},props:{objectsLabel:{type:String,default:"Objects"},placeholder:{type:String,default:"Search"},showFilterButtons:{type:Boolean,default:!0},initFilter:{type:Object,default:()=>({q:"",filter:{type:""}})},relationTypes:{type:Object},selectedTypes:{type:Array,deafut:()=>[]},filterList:{type:Array,default:()=>[]},pagination:{type:Object,default:()=>a.b},configPaginateSizes:{type:String,default:"[10]"}},data(){return{queryFilter:{},timer:null,pageSize:this.pagination.page_size,dynamicFilters:{},statusFilter:{}}},created(){let t=this.formatFilters();this.queryFilter=n.a.all([a.a,this.queryFilter,t,this.initFilter]),this.dynamicFilters=this.filterList.filter(t=>"status"!=t.name||(this.statusFilter=t,!1))},computed:{paginateSizes(){return JSON.parse(this.configPaginateSizes)},rightTypes(){return this.relationTypes&&this.relationTypes.right||[]},isFullPaginationLayout(){return this.pagination.page_count>1&&this.pagination.page_count<=7}},watch:{initFilter(t){this.queryFilter=Object(n.a)(this.queryFilter,t)},pageSize(t){this.$emit("filter-update-page-size",this.pageSize)},selectedTypes(t){this.queryFilter.filter.type=t}},methods:{onQueryStringChange(){let t=this.queryFilter.q||"";clearTimeout(this.timer),(t.length>=3||0==t.length)&&(this.timer=setTimeout(()=>{this.$emit("filter-objects",this.queryFilter)},300))},onOtherFiltersChange(){this.$emit("filter-objects",this.queryFilter)},formatFilters(){let t={};return this.filterList.forEach(e=>t[e.name]=e.date?{}:""),{filter:t}},applyFilter(){this.$emit("filter-objects-submit",this.queryFilter)},resetFilter(){this.$emit("filter-reset")},onChangePage(t){this.$emit("filter-update-current-page",t)}}}},"./src/Template/Layout/js/app/mixins/paginated-content.js":
/*!****************************************************************!*\
  !*** ./src/Template/Layout/js/app/mixins/paginated-content.js ***!
  \****************************************************************/
/*! exports provided: DEFAULT_PAGINATION, DEFAULT_FILTER, PaginatedContentMixin */
/*! exports used: DEFAULT_FILTER, DEFAULT_PAGINATION, PaginatedContentMixin */function(t,e,i){"use strict";i.d(e,"b",function(){return a}),i.d(e,"a",function(){return n}),i.d(e,"c",function(){return s});const a={count:0,page:1,page_size:20,page_count:1},n={q:"",filter:{type:[]}},s={data:()=>({requestsQueue:[],requestController:new AbortController,objects:[],endpoint:null,pagination:a,query:{},formatObjetsFilter:["params","priority","position","url"]}),methods:{getPaginatedObjects(t=!0,e={}){let i=window.location.href;if(this.endpoint){e&&(this.query=e);let a=`${i}/${this.endpoint}`;const n={credentials:"same-origin",headers:{accept:"application/json"}};a=this.getUrlWithPaginationAndQuery(a),this.requestsQueue.length>0&&(this.requestController.abort(),this.requestController=new AbortController),n.signal=this.requestController.signal;let s=fetch(a,n).then(t=>t.json()).then(e=>{this.requestsQueue.pop();let i=(Array.isArray(e.data)?e.data:[e.data])||[];return e.data||(i=[]),this.requestsQueue.length<1&&(t&&(this.objects=i),this.pagination=e.meta&&e.meta.pagination||this.pagination,i)}).catch(t=>{if(this.requestsQueue.pop(),20===t.code)throw t;console.error(t)});return this.requestsQueue.push(s),s}return Promise.reject()},formatObjects(t){if(void 0===t)return[];const e=[];return t.forEach(t=>{let i={};i.id=t.id,i.type=t.type;const a=t.meta.relation;if(a){let t={};this.formatObjetsFilter.forEach(e=>{a[e]&&(t[e]=a[e])}),Object.keys(t).length&&(i.meta={relation:t})}e.push(i)}),e},setPagination(t){let e="",i="?";return Object.keys(this.pagination).forEach((t,i)=>{e+=`${i?"&":""}${t}=${this.pagination[t]}`}),-1===t.indexOf(i)||(i="&"),`${t}${i}${e}`},getUrlWithPaginationAndQuery(t){let e="",i="?";return Object.keys(this.pagination).forEach((t,i)=>{e+=`${i?"&":""}${t}=${this.pagination[t]}`}),e.length>1&&(e+="&"),Object.keys(this.query).forEach((t,i)=>{const a=this.query[t];let n=`${t}=${a}`;if("filter"===t){let t="";Object.keys(a).forEach(e=>{""!==a[e]&&(t+=`filter[${e}]=${a[e]}`)}),n=t}e+=`${i?"&":""}${n}`}),-1===t.indexOf(i)||(i="&"),`${t}${i}${e}`},findObjectById(t){let e=this.objects.filter(e=>e.id===t);return e.length&&e[0]},async loadMore(t=a.page_size){if(this.pagination.page_items<this.pagination.count){let e=await this.nextPage(!1);this.pagination.page_items=this.pagination.page_items+t<=this.pagination.count?this.pagination.page_items+t:this.pagination.count;const i=this.objects.length;this.objects.splice(i,0,...e)}},toPage(t,e={}){return this.pagination.page=t||1,this.getPaginatedObjects(!0,e)},firstPage(t=!0){return 1!==this.pagination.page?(this.pagination.page=1,this.getPaginatedObjects(t)):Promise.resolve([])},lastPage(t=!0){return this.pagination.page!==this.pagination.page_count?(this.pagination.page=this.pagination.page_count,this.getPaginatedObjects(t)):Promise.resolve([])},nextPage(t=!0){return this.pagination.page<this.pagination.page_count?(this.pagination.page=this.pagination.page+1,this.getPaginatedObjects(t)):Promise.resolve([])},prevPage(){return this.pagination.page>1?(this.pagination.page=this.pagination.page-1,this.getPaginatedObjects()):Promise.resolve()},setPageSize(t){this.pagination.page_size=t,this.pagination.page=1}}}}}]);
//# sourceMappingURL=filter-box-view.bundle.js.map