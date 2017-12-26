/**
 * @Description: 主页面
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.6.1
 * @License：MIT
 */
layui.use(['layer','fsTab'], function(){
	var fsTab = layui.fsTab;
	
	//初始化显示菜单
	showMenu($("#fsTopMenu li.layui-this").attr("dataPid"));

	
	window.addEventListener("hashchange", hashChanged, false);
	
	hashChanged();
	
	function hashChanged(){
		//获取路由信息
		var hash = window.location.hash;
		if(!$.isEmpty(hash) && hash.length>1){
			var menuId = hash.substring(1);
			//获取layId
			var dom = $('#fsLeftMenu a[menuId="'+ menuId +'"]').parent();
			if(dom.length>0){
				var layId = dom.attr("lay-id");
				if($.isEmpty(layId)){
					layId = $.uuid();
					dom.attr("lay-id",layId);
					fsTab.add(dom.find("a").html(),dom.find("a").attr("dataUrl"),layId);
				}
				fsTab.tabChange(layId);
				
				fsTab.menuSelectCss(layId);
			}
		}
	}
	
	
	$("#fsTopMenu li").bind("click",function(){
		var dataPid = $(this).attr("dataPid");
		showMenu(dataPid);
	});
	
	
	//显示菜单
	function showMenu(dataPid){
		if(!$.isEmpty(dataPid)){
			$('#fsLeftMenu>li').hide();
			$('#fsLeftMenu>li[dataPid="'+ dataPid +'"]').show();
		}
	}
	
	//渲染tab
	fsTab.render();
	
	//新增tab
	function addTab(title,dataUrl,layId){
		fsTab.add(title,dataUrl,layId);
	}
	
	//手机设备的简单适配
	var treeMobile = $('.site-tree-mobile'),
		shadeMobile = $('.site-mobile-shade')

	treeMobile.on('click', function(){
		$('body').addClass('site-mobile');
	});

	shadeMobile.on('click', function(){
		$('body').removeClass('site-mobile');
	});
	
	
	//菜单绑定
	
	$(".fsSwitchMenu").on("click",function(){
		if($(this).find("i.icon-category").length>0){
			$(this).find("i").removeClass("icon-category").addClass("icon-viewgallery");
		}else{
			$(this).find("i").removeClass("icon-viewgallery").addClass("icon-category");
		}
	 	$(".layui-layout-admin").toggleClass("showMenu");
	});
	
});