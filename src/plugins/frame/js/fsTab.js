/**
 * @Description: 菜单管理
 * @Copyright: 2017 wueasy.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.8.2
 * @License：MIT
 */
layui.define(['element'], function(exports){
  var element = layui.element,
  FsTab = function (){
  	this.config = {
  		topMenuFilter:"fsTopMenu",//头部菜单
			leftMenuFilter:"fsLeftMenu",//左边菜单
			tabFilter:"fsTab"//导航栏
		}
	};

	FsTab.prototype.render = function(options){
		var thisTab = this;
    $.extend(true, thisTab.config, options);

    thisTab.bindTabFilter();

    //绑定左边菜单点击。
    element.on('nav('+thisTab.config.leftMenuFilter+')', function(elem){
    	thisTab.add(elem);
	  	$('body').removeClass('site-mobile');
    });
	};

	/**
	 * 新增tab
	 */
	FsTab.prototype.add = function(elem) {
		var thisTab = this;
		var layId = $(elem).attr("lay-id");
  	if($.isEmpty(layId)){
  		layId = $.uuid();
  	}
  	//判断导航栏是否存在
  	if($('#fsTabMenu>li[lay-id="'+layId+'"]').length==0){
  		$(elem).attr("lay-id",layId);
  		var dom =$(elem).find("a");
  		var title = $(elem).find("a").html();
  		var dataUrl = dom.attr("dataUrl");
  		if(!$.isEmpty(dataUrl)){
  			element.tabAdd(thisTab.config.tabFilter, {
  			  title: title
  			  ,content: '<iframe src="'+dom.attr("dataUrl")+'"></iframe>' //支持传入html
  			  ,id: layId
  			});
  		}
  	}
  	thisTab.tabChange(layId);
	}

	/**
	 * 切换tab
	 */
	FsTab.prototype.tabChange = function(layId) {
		element.tabChange(this.config.tabFilter, layId);
	}

	/**
	 * 删除
	 */
	FsTab.prototype.del = function(layId) {
		element.tabDelete(this.config.tabFilter, layId);
	};


	/**
   * 删除监听
   */
	FsTab.prototype.bindDeleteFilter = function(){
		element.on('tabDelete('+this.config.tabFilter+')', function(data){
	  	var layId = $(this).parentsUntil().attr("lay-id");
	  	$('#fsLeftMenu .layui-nav-child>dd[lay-id="'+ layId +'"],#fsLeftMenu>li[lay-id="'+ layId +'"]').removeAttr("lay-id");
		});
	}

	/**
	 * 监听tab切换，处理菜单选中
	 */
	FsTab.prototype.bindTabFilter = function(){
		var thisTab = this;
		element.on('tab('+this.config.tabFilter+')', function(data){
			var layId = $(this).attr("lay-id");

			thisTab.menuSelectCss(layId);

		});
	}

	/**
	 * 菜单选中样式
	 */
	FsTab.prototype.menuSelectCss = function(layId){
		if(!$.isEmpty(layId)){
			$('#fsLeftMenu .layui-this').removeClass("layui-this");//清除样式

			var dom =$('#fsLeftMenu .layui-nav-child>dd[lay-id="'+ layId +'"],#fsLeftMenu>li[lay-id="'+ layId +'"]');
			dom.addClass("layui-this");//追加样式

			//处理头部菜单
			if(dom.length==1){
				var dataPid = null;
				var tagName = dom.get(0).tagName;
				if(tagName == "LI"){
					dataPid = dom.attr("dataPid");
				}else if(tagName == "DD"){
					dataPid = dom.parentsUntil('li').parent().attr("dataPid");
				}
				if(!$.isEmpty(dataPid)){
					$('#fsTopMenu li[dataPid="'+ dataPid +'"]').click();
				}
			}
		}
	}


	var fsTab = new FsTab();
  //绑定按钮
	exports("fsTab",fsTab);

});
