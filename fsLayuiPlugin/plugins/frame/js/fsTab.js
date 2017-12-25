/**
 * @Description: 菜单管理
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.6.0
 * @License：MIT
 */
layui.define(['element'], function(exports){
  var element = layui.element,
  FsTab = function (){
  	this.config = {
			menuFilter:"fsMenu",//form表单id
			tabFilter:"fsTab"//form对象
		}
	};
	
	FsTab.prototype.render = function(options){
		var thisTab = this;
    $.extend(true, thisTab.config, options);
    
    //绑定菜单点击。
    element.on('nav('+thisTab.config.menuFilter+')', function(elem){
	  	var layId = $(elem).attr("lay-id");
	  	if($.isEmpty(layId)){
	  		layId = $.uuid();
	  		$(elem).attr("lay-id",layId);
	  		var dom =$(elem).find("a");
	  		var title = $(elem).find("a").html();
	  		var dataUrl = dom.attr("dataUrl");
	  		if(!$.isEmpty(dataUrl)){
	  			thisTab.add(title,dom.attr("dataUrl"),layId);
	  		}
	  	}
	  	thisTab.tabChange(layId);
	  	$('body').removeClass('site-mobile');
    });
    thisTab.bindDeleteFilter();
	};
	
	/**
	 * 切换tab
	 */
	FsTab.prototype.tabChange = function(layId) {
		element.tabChange(this.config.tabFilter, layId);
	}
	
  
	/**
   * 新增
   */
	FsTab.prototype.add = function(title,dataUrl,layId) {
		element.tabAdd(this.config.tabFilter, {
		  title: title
		  ,content: '<iframe src="'+dataUrl+'"></iframe>' //支持传入html
		  ,id: layId
		});
	};
  
  
	/**
   * 删除监听
   */
	FsTab.prototype.bindDeleteFilter = function(){
		var thisTab = this;
		element.on('tabDelete('+thisTab.config.tabFilter+')', function(data){
	  	var layId = $(this).parentsUntil().attr("lay-id");
	  	$('.fsMenu .layui-nav-child>dd[lay-id="'+ layId +'"]').removeAttr("lay-id");
	  	$('.fsMenu>li[lay-id="'+ layId +'"]').removeAttr("lay-id");
		});
	}
	
  
	var fsTab = new FsTab();
  //绑定按钮
	exports("fsTab",fsTab);
  
});