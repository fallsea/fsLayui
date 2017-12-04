/**
 * @Description: 通用框架
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.1.1
 * @date: 2017年11月5日 下午12:45:13
 */
layui.use(['fsForm','fsDatagrid','fsTree','common','element'], function(){
	var fsForm = layui.fsForm,
	fsDatagrid = layui.fsDatagrid,
	fsTree = layui.fsTree,
	element = layui.element;
	common = layui.common;
	
	
	
	/********* form 表单处理   start *************/
	var formDoms =$("form");
	  
	if(formDoms.length>0){//如果没有查到form，自动关闭
    $(formDoms).each(function (index, domEle) { 
      fsForm.render({elem:$(this)});
    });
	}
	/********* form 表单处理   end *************/
	
	
	/********* tree 处理   start *************/
	
	var trees = {};
	
	var treeDoms = $("ul.fsTree");
	if(treeDoms.length>0){
    $(treeDoms).each(function(i){
        var treeId=$(this).attr("id");
        var funcNo = $(this).attr("funcNo");
        var url = $(this).attr("url");
        trees[treeId] = fsTree.render({id:treeId,funcNo:funcNo,url:url,clickCallback:clickCallback});
      });
    //绑定按钮事件
    common.buttionEvent("tree",getTree,gettreeCheckData);
	}
	
	function getTree(treeId){
    if(_.isEmpty(trees)){
      common.warnMsg("未配置tree！");
      return;
    }
    if(_.isEmpty(treeId)){
      treeId = "treeDemo";
    }
    return trees[treeId];
  }
	
  function gettreeCheckData(treeId){
    if(_.isEmpty(trees)){
      common.warnMsg("未配置tree！");
      return;
    }
    if(_.isEmpty(treeId)){
      treeId = "treeDemo";
    }
    return trees[treeId].getSelectedNodes();
  }
   
    
  /**
   * 树点击回调
   */
  function clickCallback(e,treeId, treeNode) {
  	
  	var _this = $("#"+treeId);
    var tableId = _this.attr("tableId");
    
    if(_.isEmpty(tableId)){
    	tableId = _this.attr("datagridId");
    }
    
    if(_.isEmpty(tableId)){
    	return;
    }
      
    //获取表格对应的查询form
    var defaultForm = $("#"+tableId).attr("defaultForm");
    if(_.isEmpty(defaultForm)){
      defaultForm = "query_form";
    }
    var inputs = _this.attr("inputs");
    if(!_.isEmpty(inputs))
    {
      //获取值存入form表单
      var param = common.getParamByInputs(inputs,treeNode);
      $("#"+defaultForm).setFormData(param);
    }
    if(!_.isEmpty(datagrids) && !_.isEmpty(datagrids[tableId])){
      datagrids[tableId].query($("#"+defaultForm).getFormData());
    }
      
  }
  /********* tree 处理   end *************/
	
	
	/********* datagrid 处理   start *************/
  var tabs = $("table.fsDatagrid");
  var datagrids= {};//datagrid集合
  if(tabs.length > 0){
    $(tabs).each(function(){
      var tableId=$(this).attr("id");
      if(!_.isEmpty(datagrids[tableId])){
      	return;
      }
      var clickRenderTable = $(this).attr("clickRenderTable");//点击需要渲染的tableid
      var clickCallBack;//点击事件
  	  if(!_.isEmpty(clickRenderTable)){
  	  	
  	  	var defaultForm= $("#"+clickRenderTable).attr("defaultForm");//默认form表单id
  	  	
  	  	var clickRenderTableInputs = $(this).attr("clickRenderTableInputs");//点击需要传入的参数信息
  	  	
  	  	clickCallBack = function(data){
  	  		//获取参数
  	  		var formData = common.getParamByInputs(clickRenderTableInputs,data);
  	  		
  	  		//点击后，为查询form表单赋值
  	  		if(!_.isEmpty(defaultForm)){
  	  			$("#"+defaultForm).setFormData(formData);
  	  		}
	  			_.get(datagrids,clickRenderTable).reload(formData);
  	  	}
  	  }
          
      var datagrid = fsDatagrid.render({id:tableId,clickCallBack:clickCallBack});
      datagrid.bindDatagridTool(getDatagrid);
      //cloneDeep 克隆对象
      _.set(datagrids,tableId,_.cloneDeep(datagrid));
      
    });
    common.buttionEvent("datagrid",getDatagrid,getDatagridCheckData);
  }else{
    //按钮绑定
    common.buttionEvent("datagrid");
  }
  
  
  function getDatagrid(tableId){
    if(_.isEmpty(tableId)){
      tableId = "fsDatagrid";
    }
    if(_.isEmpty(datagrids)){
      common.warnMsg("未配置datagrid！");
      return;
    }
    return datagrids[tableId];
  }
  function getDatagridCheckData(tableId){
    if(_.isEmpty(tableId)){
      tableId = "fsDatagrid";
    }
    if(_.isEmpty(datagrids)){
      common.warnMsg("未配置datagrid！");
      return;
    }
    return datagrids[tableId].getCheckData();
  }
  /********* datagrid 处理   end *************/
	
});