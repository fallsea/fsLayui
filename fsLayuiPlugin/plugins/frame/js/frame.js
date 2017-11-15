/**
 * @Description: 通用框架
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.0.2
 * @date: 2017年11月5日 下午12:45:13
 */
layui.use(['fsForm','fsDatagrid','fsTree','common'], function(){
	var fsForm = layui.fsForm,
	fsDatagrid = layui.fsDatagrid,
	fsTree = layui.fsTree,
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
	
	function getTree(treeId)
    {
	    if(_.isEmpty(trees)){
            common.warnMsg("未配置tree！");
            return;
        }
        if(_.isEmpty(treeId)){
            treeId = "treeDemo";
        }
        return trees[treeId];
    }
    function gettreeCheckData(treeId)
    {
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
     * 点击回调
     */
    function clickCallback(e,treeId, treeNode) {
        
        var datagridId = $("#"+treeId).attr("datagridId");
        
        if(_.isEmpty(datagridId)){
            return;
        }
        
        //获取表格对应的查询form
        var defaultForm = $("#"+datagridId).attr("defaultForm");
        if(_.isEmpty(defaultForm)){
            defaultForm = "query_form";
        }
        var inputs = $("#"+treeId).attr("inputs");
        if(!_.isEmpty(inputs))
        {
            //获取值存入form表单
            var param = common.getParamByInputs(inputs,treeNode);
            $("#"+defaultForm).setFormData(param);
        }
        if(!_.isEmpty(datagrids) && !_.isEmpty(datagrids[datagridId])){
            datagrids[datagridId].query($("#"+defaultForm).getFormData());
        }
        
    }
    
    /********* tree 处理   end *************/
	
	
	/********* datagrid 处理   start *************/
    var tabs = $("table.fsDatagrid");
    var datagrids= {};//datagrid集合
    if(tabs.length > 0){
        $(tabs).each(function(){
            var tableId=$(this).attr("id");
            var datagrid = fsDatagrid.render({id:tableId});
            datagrid.bindDatagridTool(getDatagrid);
            _.set(datagrids,tableId,_.cloneDeep(datagrid));
        });
        common.buttionEvent("datagrid",getDatagrid,getDatagridCheckData);
    }else{
        //按钮绑定
        common.buttionEvent("datagrid");
    }
    
    
    function getDatagrid(tableId)
    {
        if(_.isEmpty(tableId)){
            tableId = "fsDatagrid";
        }
        if(_.isEmpty(datagrids)){
            common.warnMsg("未配置datagrid！");
            return;
        }
        return datagrids[tableId];
    }
    function getDatagridCheckData(tableId)
    {
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