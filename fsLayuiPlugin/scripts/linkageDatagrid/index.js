/**
 * @Description: 
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.0
 * @date: 2017年11月27日 下午3:11:16
 */
layui.use(['fsForm','fsDatagrid','common'], function(){
	var fsForm = layui.fsForm,
	fsDatagrid = layui.fsDatagrid,
	common = layui.common;
	
	
	var datagrid2 = null;
	
	fsDatagrid.render({id:"fsDatagrid",clickCallBack:function(data){
		
		var formData = {"funcId":data["id"]};
		if(datagrid2==null){
			datagrid2 = _.cloneDeep(fsDatagrid.render({id:"fsDatagrid2"},formData));
		}else{
			datagrid2.reload(formData);
		}
		
	}});
	
});