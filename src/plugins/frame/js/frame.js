/**
 * @Description: 通用框架
 * @Copyright: 2017 wueasy.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.8.2
 * @License：MIT
 */
layui.use(['fsForm','fsDatagrid','fsTree','fsCommon','element'], function(){
	var fsForm = layui.fsForm,
	fsDatagrid = layui.fsDatagrid,
	fsTree = layui.fsTree,
	element = layui.element;
	fsCommon = layui.fsCommon;

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
        var tree = fsTree.render({id:treeId,funcNo:funcNo,url:url,clickCallback:clickCallback,getTree:getTree});
        if(treeDoms.length==1){
        	trees[treeId] = tree;
        }else{
        	//深度拷贝对象
        	trees[treeId] = $.extend(true,{},tree);
        }
      });
    //绑定按钮事件
    fsCommon.buttonEvent("tree",getTree);
	}

	function getTree(treeId){
    if($.isEmpty(trees)){
    	fsCommon.warnMsg("未配置tree！");
      return;
    }
    if($.isEmpty(treeId)){
      treeId = "treeDemo";
    }
    return trees[treeId];
  }

  /**
   * 树点击回调
   */
  function clickCallback(e,treeId, treeNode) {

  	var _this = $("#"+treeId);
    var clickCallbackIds = _this.attr("clickCallbackId");//点击回调id

    if($.isEmpty(clickCallbackIds)){
    	return;
    }

    $.each(clickCallbackIds.split(','),function(i,clickCallbackId){

    	var dom = $("#"+clickCallbackId);

    	var defaultForm = dom.attr("defaultForm");
      if($.isEmpty(defaultForm)){
        defaultForm = "query_form";
      }
      var clickCallbackInputs = _this.attr("clickCallbackInputs");
      if(!$.isEmpty(clickCallbackInputs))
      {
        //获取值存入form表单
        var param = fsCommon.getParamByInputs(clickCallbackInputs,treeNode);
        $("#"+defaultForm).setFormData(param);
      }

    	if(dom.filter(".fsDatagrid").length == 1){//数据表格

        if(!$.isEmpty(datagrids) && !$.isEmpty(datagrids[clickCallbackId])){
          datagrids[clickCallbackId].query($("#"+defaultForm).getFormData());
        }

    	}else if(dom.filter(".fsTree").length == 1){//树操作

    		if(!$.isEmpty(trees) && !$.isEmpty(trees[clickCallbackId])){
    			trees[clickCallbackId].query($("#"+defaultForm).getFormData());
        }

    	}

    });

  }
  /********* tree 处理   end *************/


	/********* datagrid 处理   start *************/
  var tabs = $("table.fsDatagrid");
  var datagrids= {};//datagrid集合
  if(tabs.length > 0){
    $(tabs).each(function(){
      var tableId=$(this).attr("id");
      if(!$.isEmpty(datagrids[tableId])){
      	return;
      }
      var clickRenderTable = $(this).attr("clickRenderTable");//点击需要渲染的tableid
      var clickCallBack;//点击事件
  	  if(!$.isEmpty(clickRenderTable)){

  	  	var defaultForm= $("#"+clickRenderTable).attr("defaultForm");//默认form表单id

  	  	var clickRenderTableInputs = $(this).attr("clickRenderTableInputs");//点击需要传入的参数信息

  	  	clickCallBack = function(data){
  	  		//获取参数
  	  		var formData = fsCommon.getParamByInputs(clickRenderTableInputs,data);

  	  		//点击后，为查询form表单赋值
  	  		if(!$.isEmpty(defaultForm)){
  	  			$("#"+defaultForm).setFormData(formData);
  	  		}

	  			datagrids[clickRenderTable].reload(formData);
  	  	}
  	  }

  	  var datagrid = fsDatagrid.render({id:tableId,clickCallBack:clickCallBack,getDatagrid:getDatagrid});

      datagrid.bindDatagridTool(getDatagrid);

      if(tabs.length==1){
      	datagrids[tableId] = datagrid;
      }else{
      	//深度拷贝对象
      	datagrids[tableId] = $.extend(true,{},datagrid);
      }

    });
    fsCommon.buttonEvent("datagrid",getDatagrid);
  }else{
    //按钮绑定
  	fsCommon.buttonEvent("datagrid");
  }


  function getDatagrid(tableId){
    if($.isEmpty(tableId)){
      tableId = "fsDatagrid";
    }
    if($.isEmpty(datagrids)){
    	fsCommon.warnMsg("未配置datagrid！");
      return;
    }
    return datagrids[tableId];
  }
  /********* datagrid 处理   end *************/

});
