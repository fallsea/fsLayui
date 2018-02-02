/**
 * @Description: 基础配置
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.7.1
 * @License：MIT
 */
layui.define([], function (exports) {

	var fsConfig = {};
	
	/**
	 * 错误码处理定义
	 */
	fsConfig["filters"] = {
		//配置统一未登录错误码处理
		"-999" : function(result) {
			//未登录，跳转登陆页
			top.window.location.href = fsConfig["global"]["loginUrl"];
		}
	};
	
	/**
	 * 项目中需要调用到的常量、变量这里配置
	 */
	fsConfig["global"] = {
		"servletUrl":"https://fs.fallsea.com", //异步请求地址,本地工程可以不填
		"loginUrl" : "/login", //登录url
		"uploadUrl" : "https://fs.fallsea.com/upload", //上传附件url
		"uploadHtmlUrl" : "/plugins/frame/views/upload.html", //上传附件html地址，默认/plugins/frame/views/upload.html
		"loadDataType":"1",//加载数据类型，1：使用缓存数据，0：实时查询，默认0  （编辑或查看是否取缓存数据）
		"datagridSubmitType":"1",//数据表格提交类型，1：原数据提交，2：增删改标签提交（fsType）， 默认1
		"result" : { //响应结果配置
	    "statusName": "errorNo", //数据状态的字段名称，默认：errorNo
	    "msgName": "errorInfo", //状态信息的字段名称，默认：errorInfo
	    "dataName" : "results.data", //非表格数据的字段名称，默认：results.data
		},
		"page" : { //分页配置
			"sortType":"0",//默认排序方式，0：本地排序，1：异步排序，不配置默认为0
			"request": {//请求配置
				"pageName": "pageNum", //页码的参数名称，默认：pageNum
				"limitName": "pageSize" //每页数据量的参数名，默认：pageSize
			},
			"response": {//响应配置
				"countName": "results.data.total", //数据总数的字段名称，默认：results.data.total
				"dataName" : "results.data", //数据列表的字段名称，默认：results.data
				"dataNamePage": "results.data.list" //分页数据列表的字段名称，默认：results.data.list
			}//,
//			"limit":10,//每页分页数量。默认20
//			"limits":[10,20,30,50,100]//每页数据选择项，默认[10,20,30,50,100]
		}
	};
	
	/**
	 * 拓展form表单验证规则
	 */
	fsConfig["verify"] = {
		/**
		 * 对比两个值相等
		 */
		"equals": function(value, item){ //value：表单的值、item：表单的DOM对象
	    var equalsId = $(item).attr("equalsId");
	    if($.isEmpty(equalsId)){
        return '未配置对比id';
	    }
	    var value2 = $("#"+equalsId).val();
	    
	    if(value!==value2)
	    {
        var equalsMsg = $(item).attr("equalsMsg");
        if($.isEmpty(equalsMsg))
        {
        	equalsMsg = "值不相等";
        }
        return equalsMsg;
	    }
		},
		/**
		 * 用户名验证
		 */
		"username": [
			/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){2,19}$/,
			'用户名格式不正确!'
		],
		/**
		 * 最小、最大长度判断
		 */
		"length": function(value, item){ //value：表单的值、item：表单的DOM对象
	    var minLength = $(item).attr("minLength");//最小长度
	    var maxLength = $(item).attr("maxLength");//最大长度
	    if(!$.isEmpty(minLength) && '0' !== minLength && parseInt(minLength)>value.length){
	    	return "输入内容小于最小值:"+minLength;
	    }
	    if(!$.isEmpty(maxLength) && '0' !== maxLength && value.length>parseInt(maxLength)){
	    	return "输入内容大于最小值:"+maxLength;
	    }
		}
	};
	exports('fsConfig', fsConfig);
});