define(["libraryBrowser","jQuery","alphaPicker"],function(e,t,a){return function(r,n){function i(){var t=y;if(!t){t=y={query:{SortBy:"IsFolder,SortName",SortOrder:"Ascending",Fields:"DateCreated,PrimaryImageAspectRatio,MediaSourceCount,SyncInfo",ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Banner,Thumb",StartIndex:0,Limit:e.getDefaultPageSize()}},t.query.Filters="",t.query.NameStartsWithOrGreater="";var a=l();t.view=e.getSavedView(a)||e.getDefaultItemsView("Poster","Poster"),t.query.ParentId=n.parentId||null,e.loadSavedQueryValues(a,t.query)}return t}function o(){return i().query}function l(){return r.savedQueryKey||(r.savedQueryKey=e.getSavedQueryKey("itemsv1")),r.savedQueryKey}function u(){Dashboard.showLoadingMsg();var a=o(),d=Dashboard.getCurrentUserId(),y=a.ParentId?ApiClient.getItem(d,a.ParentId):ApiClient.getRootFolder(d),g=ApiClient.getItems(d,a);Promise.all([y,g]).then(function(o){var d=o[0];c=d;var y=o[1];window.scrollTo(0,0);var g=i(r).view,h="",p=e.getQueryPagingHtml({startIndex:a.StartIndex,limit:a.Limit,totalRecordCount:y.TotalRecordCount,showLimit:!1,addLayoutButton:!0,currentLayout:g,sortButton:!0,layouts:"Poster,PosterCard,Thumb",filterButton:!0});r.querySelector(".listTopPaging").innerHTML=p,m();var v=n.context,f={items:y.Items,shape:"auto",centerText:!0,lazy:!0,coverImage:"PhotoAlbum"==d.Type};"Backdrop"==g?(f.shape="backdrop",f.showTitle=!0,f.preferBackdrop=!0,h=e.getPosterViewHtml(f)):"Poster"==g?(f.showTitle="photos"==v?"auto":!0,f.overlayText="photos"==v,h=e.getPosterViewHtml(f)):"PosterCard"==g?(f.showTitle=!0,f.showYear=!0,f.cardLayout=!0,f.centerText=!1,h=e.getPosterViewHtml(f)):"Thumb"==g&&(f.preferThumb=!0,f.shape="backdrop",h=e.getPosterViewHtml(f));var P=r.querySelector("#items");P.innerHTML=h+p,ImageLoader.lazyChildren(P),t(".btnFilter",r).on("click",function(){s()}),t(".btnNextPage",r).on("click",function(){a.StartIndex+=a.Limit,u(r)}),t(".btnPreviousPage",r).on("click",function(){a.StartIndex-=a.Limit,u(r)}),t(".btnChangeLayout",r).on("layoutchange",function(t,a){i(r).view=a,e.saveViewSetting(l(),a),u(r)}),t(".btnSort",r).on("click",function(){e.showSortMenu({items:[{name:Globalize.translate("OptionNameSort"),id:"SortName"},{name:Globalize.translate("OptionCommunityRating"),id:"CommunityRating,SortName"},{name:Globalize.translate("OptionCriticRating"),id:"CriticRating,SortName"},{name:Globalize.translate("OptionDateAdded"),id:"DateCreated,SortName"},{name:Globalize.translate("OptionDatePlayed"),id:"DatePlayed,SortName"},{name:Globalize.translate("OptionParentalRating"),id:"OfficialRating,SortName"},{name:Globalize.translate("OptionPlayCount"),id:"PlayCount,SortName"},{name:Globalize.translate("OptionReleaseDate"),id:"PremiereDate,SortName"},{name:Globalize.translate("OptionRuntime"),id:"Runtime,SortName"}],callback:function(){u(r)},query:a})}),e.saveQueryValues(n.parentId,a);var b=d.Name;null!=d.IndexNumber&&(b=d.IndexNumber+" - "+b),null!=d.ParentIndexNumber&&(b=d.ParentIndexNumber+"."+b),LibraryMenu.setTitle(b),r.dispatchEvent(new CustomEvent("displayingitem",{detail:{item:d},bubbles:!0})),Dashboard.hideLoadingMsg()})}function s(){require(["components/filterdialog/filterdialog"],function(e){var t=new e({query:o()});Events.on(t,"filterchange",function(){u()}),t.show()})}function d(){var t=o(),a=e.getListItemInfo(this);return"Photo"==a.mediaType?(require(["scripts/photos"],function(){Photos.startSlideshow(r,t,a.id)}),!1):void 0}function m(){var e=o();self.alphaPicker.value(e.NameStartsWithOrGreater)}var c,y,g=r.querySelector(".alphaPicker");g.addEventListener("alphavaluechanged",function(e){var t=e.detail.value,a=o();a.NameStartsWithOrGreater=t,a.StartIndex=0,u(r)}),self.alphaPicker=new a({element:g,valueChangeEvent:"click"}),t(r).on("click",".mediaItem",d),r.addEventListener("viewbeforeshow",function(){u(r),m(),LibraryMenu.setBackButtonVisible(n.context)}),r.addEventListener("viewdestroy",function(){self.alphaPicker&&self.alphaPicker.destroy()})}});