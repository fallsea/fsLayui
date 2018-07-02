/**
 * @Description: 按钮拓展配置
 * @Copyright: 2017 wueasy.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.8.2
 * @License：MIT
 */
layui.define(['fsConfig'], function (exports) {

	var fsConfig = layui.fsConfig,
	statusName = $.result(fsConfig,"global.result.statusName","errorNo"),
	msgName = $.result(fsConfig,"global.result.msgName","errorInfo"),
	dataName = $.result(fsConfig,"global.result.dataName","results.data"),
	successNo = $.result(fsConfig,"global.result.successNo","0"),
	FsButtonCommon = function (){

	};


	FsButtonCommon.prototype.test = function(elem,data,datagrid){
		alert("测试自定义按钮"+JSON.stringify(data));
	}


	var fsButtonCommon = new FsButtonCommon();
	exports('fsButtonCommon', fsButtonCommon);
});
