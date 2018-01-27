/**
 * @Description: 按钮拓展配置
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.6.4
 * @License：MIT
 */
layui.define([], function (exports) {

	var FsButtionCommon = function (){
		
	};
	
	
	FsButtionCommon.prototype.test = function(elem,data,datagrid){
		alert("测试自定义按钮"+JSON.stringify(data));
	}
	
	
	var fsButtionCommon = new FsButtionCommon();
	exports('fsButtionCommon', fsButtionCommon);
});