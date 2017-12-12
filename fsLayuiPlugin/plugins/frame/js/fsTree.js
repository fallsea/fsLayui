/**
 * @Description: tree工具
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.0.4
 * @date: 2017年11月5日 上午11:30:37
 */
layui.define(['layer',"fsCommon",'fsConfig'], function(exports){
	var layer = layui.layer,
	fsCommon = layui.fsCommon,
	fsConfig = layui.fsConfig,
	statusName = _.result(fsConfig,"global.result.statusName","errorNo"),
	msgName = _.result(fsConfig,"global.result.msgName","errorInfo"),
	dataName = _.result(fsConfig,"global.result.dataName","results.data"),
	FsTree = function (){
		this.config = {
			funcNo : undefined,//功能号  
			url : undefined,//请求url地址
			id:"",
			autoParam : ["id=parentId"],  //参数
			dataName : "results.data",  //结果集对象
			clickCallback : undefined  //点击回掉函数
		}
	};
	
	
	/**
	 * 渲染tree
	 */
	FsTree.prototype.render = function(options){
		var _this = this;
    $.extend(true, _this.config, options);
    
    if(_.isEmpty(_this.config.id)){
    	fsCommon.warnMsg("id不能为空!");
			return;
    }
    this.queryTree();
    return _this;
	};
	
	//显示树
	FsTree.prototype.showTree = function(data) {
		var _this = this;
		var funcNo = _this.config.funcNo;

    var url = _this.config.url;//请求url
    
    if(_.isEmpty(funcNo) && _.isEmpty(url)){
    	fsCommon.warnMsg("功能号或请求地址为空!");
			return;
		}
		if(_.isEmpty(url)){
      url = "/fsbus/" + funcNo;
    }
		var servletUrl = _.result(fsConfig,"global.servletUrl");
		if(!_.isEmpty(servletUrl)){
			url = servletUrl + url;
		}
		var setting = {
			view: {
				showLine: false
			},
			async: {
				enable: true,
				url:url,
				autoParam:_this.config.autoParam,
				dataFilter: function ajaxDataFilter(treeId, parentNode, responseData) {
			    if(responseData[statusName] == "0")
					{
			    	return _.result(responseData,_this.config.dataName);
					}
					else
					{
						//提示错误消息
						layer.alert(data[msgName], {icon:0})
					}
			    return responseData;
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				onClick: _this.config.clickCallback
			}
		};
		$.fn.zTree.init($("#"+_this.config.id), setting,data);
	};
	
	//查询菜单树列表
	FsTree.prototype.queryTree = function() {
		var _this = this;
		var funcNo = _this.config.funcNo;
		var url = _this.config.url;//请求url
       
		if(_.isEmpty(funcNo) && _.isEmpty(url)){
			fsCommon.warnMsg("功能号或请求地址为空!");
			return;
		}
		if(_.isEmpty(url)){
			url = "/fsbus/" + funcNo;
		}
		
		fsCommon.invoke(url,{},function(data)
		{
			if(data[statusName] == "0")
			{
				var array = _.result(data,_this.config.dataName);
				if(!_.isArray(array)){
					array = new Array();
				}
				array.push({ id:1, pId:0, name:"根目录", open:true});
				
				_this.showTree(array);
			}
			else
			{
				//提示错误消息
				layer.alert(data[msgName], {icon:0})
			}
		});
	}
  	
	/**
	 * 刷新节点
	 */
	FsTree.prototype.refresh = function() {
		var _this = this;
		var zTree = $.fn.zTree.getZTreeObj(_this.config.id),
		type = "refresh",
		silent = false,
		nodes = zTree.getSelectedNodes();
		if (nodes.length == 0) {
//			fsCommon.warnMsg("请选择节点刷新");
//			zTree.reAsyncChildNodes(null, type, silent);
			return;
		}
		for (var i=0, l=nodes.length; i<l; i++) {
			if(nodes[i]["isParent"]){
				zTree.reAsyncChildNodes(nodes[i], type, silent);
			}else{
				//刷新父节点
				zTree.reAsyncChildNodes(nodes[i].getParentNode(), type, silent);
			}
		}
	}
	
	
	/**
	 * 获取选中的节点
	 */
	FsTree.prototype.getSelectedNodes = function() {
		var _this = this;
		var zTree = $.fn.zTree.getZTreeObj(_this.config.id);
		return zTree.getSelectedNodes();
	}
	
	var fsTree = new FsTree();
	exports("fsTree",fsTree);
});