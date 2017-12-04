/**
 * @Description: 入口
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.1.1
 * @date: 2017年11月12日 上午12:09:00
 */
layui.config({
  base : "/plugins/frame/js/",
	version : '1.1.1'
});

(function($){
	
	/**
     * 获取token信息
     */
    var getToken = function ()
    {
    	var _csrf_code=$('meta[name="_csrf_code"]').attr("content");
      var _csrf_name=$('meta[name="_csrf_name"]').attr("content");
      var token = {};
      token[_csrf_name] = _csrf_code;
      return token;
    };
    
	$.ajaxSetup({
		  headers : getToken(),
      type: 'POST',
      async: true,
      dataType : "json",
      timeout : 30000 
	 });
	
	/**
	 * 获取form表单数据
	 */
	$.fn.getFormData = function (isValid) {
	  var fieldElem = $(this).find('input,select,textarea'); //获取所有表单域
	  var data ={};
	  layui.each(fieldElem, function(index, item){
      if(!item.name) return;
      if(/^checkbox|radio$/.test(item.type) && !item.checked) return;
      var value = item.value;
      if(item.type == "checkbox"){//如果多选
      	if(field[item.name]){
      		value = field[item.name] + "," + value;
      	}
      }
      if(isValid)
      {
    	 //如果为true,只需要处理有数据的值
    	 if(!_.isEmpty(value))
         {
    		 data[item.name] = value;
         }
      }
      else
      {
    	  data[item.name] = value;
      }
    });
    return data;
  };
  
  /**
   * 设置form表单值
   */
  $.fn.setFormData = function (data) {
  	if(!_.isEmpty(data))
  	{
  		$(this)[0].reset();
  		$(this).autofill(data);
  	}
  };
    
  /**
   * 获取datagrid 列集合
   */
  $.fn.getDatagridCols = function () {
  	var colsArr = new Array();
  	var datagrid_cols = $(this).next(".fsDatagridCols");
  	if(!_.isEmpty(datagrid_cols))
  	{
  		$.each(datagrid_cols.children(),function(i, n){
  			
			var _this = $(this);
  			
			var toolbar = _this.attr("toolbar");
			var col = {};
			
			if(!_.isEmpty(_this.attr("align"))){
				col["align"] = _this.attr("align");
			}
			if(!_.isEmpty(_this.attr("fixed"))){
				col["fixed"] = _this.attr("fixed");
			}
			if(_.isEmpty(toolbar)){//普通列
				var type = _this.attr("type");
				var field = _this.attr("field");
  			var title = _this.attr("title");
  			var width = _this.attr("width");
  			var sort = _this.attr("sort");
  			var templet = _this.attr("templet");
  			var checkbox = _this.attr("checkbox");
    			
  			if(!_.isEmpty(type)){
  				col["type"] = type;
  			}
  			
  			if(!_.isEmpty(field)){
  				col["field"] = field;
  			}
  			if(!_.isEmpty(title)){
  				col["title"] = title;
  			}
  			if(!_.isEmpty(width)){
  				col["width"] = width;
  			}
  			if(!_.isEmpty(sort)){
  				col["sort"] = sort;
  			}
  			if(!_.isEmpty(templet)){
  				col["templet"] = templet;
  			}
  			if(!_.isEmpty(checkbox)){
  				col["checkbox"] = checkbox;
  			}
  			
  			if(!_.isEmpty(_this.attr("style"))){
  				col["style"] = _this.attr("style");
  			}
    			
  			if(!_.isEmpty(_this.attr("colspan"))){
  				col["colspan"] = _this.attr("colspan");
  			}
  			if(!_.isEmpty(_this.attr("rowspan"))){
  				col["rowspan"] = _this.attr("rowspan");
  			}
  			
  			if(!_.isEmpty(_this.attr("LAY_CHECKED"))){
  				col["LAY_CHECKED"] = _this.attr("LAY_CHECKED");
  			}
  			if(!_.isEmpty(_this.attr("edit"))){
  				col["edit"] = _this.attr("edit");
  			}
  			if(!_.isEmpty(_this.attr("event"))){
  				col["event"] = _this.attr("event");
  			}
      			
			}else {//工具条
				col["toolbar"] = toolbar;
				var width = _this.attr("width");
				if(!_.isEmpty(width)){
  				col["width"] = width;
  			}
				var title = _this.attr("title");
				if(!_.isEmpty(title)){
  				col["title"] = title;
  			}
			}
			colsArr.push(col);
  		});
  	}
  	return colsArr;
  };

}(jQuery));