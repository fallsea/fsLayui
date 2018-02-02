/**
 * @Description: 按钮拓展配置
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.7.1
 * @License：MIT
 */
layui.define(['fsConfig'], function (exports) {

	var fsConfig = layui.fsConfig,
	statusName = $.result(fsConfig,"global.result.statusName","errorNo"),
	msgName = $.result(fsConfig,"global.result.msgName","errorInfo"),
	dataName = $.result(fsConfig,"global.result.dataName","results.data"),
	FsButtonCommon = function (){
		
	};
	
	
	FsButtonCommon.prototype.test = function(elem,data,datagrid){
		alert("测试自定义按钮"+JSON.stringify(data));
	}
	
	
	var fsButtonCommon = new FsButtonCommon();
	exports('fsButtonCommon', fsButtonCommon);
});