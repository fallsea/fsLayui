/**
 * @Description: datagrid工具
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.4.2
 * @date: 2017年11月5日 上午11:26:44
 */
layui.define(["fsCommon","table",'laypage','fsConfig'], function(exports){
  var fsCommon = layui.fsCommon,
  table = layui.table,
  laypage = layui.laypage,
  fsConfig = layui.fsConfig,
  statusName = $.result(fsConfig,"global.result.statusName","errorNo"),
  msgName = $.result(fsConfig,"global.result.msgName","errorInfo"),
  dataName = $.result(fsConfig,"global.result.dataName","results.data"),
  defaultLimit = $.result(fsConfig,"global.page.limit",20),//默认分页数量
  defaultLimits = $.result(fsConfig,"global.page.limits",[10,20,30,50,100]),//默认每页数据选择项
  loadDataType = $.result(fsConfig,"global.loadDataType","0");
  FsDatagrid = function (){
  };
  
  FsDatagrid.prototype.render = function(options,params){
  	this.config = {
      id:"",//form表单id
      elem:null,//form对象
      clickCallBack:null //点击回调函数
    }
  	
    var thisDatagrid = this;
    $.extend(true, thisDatagrid.config, options);
    
    if($.isEmpty(thisDatagrid.config.id)){
    	fsCommon.warnMsg("表格id不能为空!");
      return;
    }
    
    if(!$.isEmpty(thisDatagrid.config.id)){
      thisDatagrid.config.elem = $("#"+thisDatagrid.config.id);
    }
    
    thisDatagrid.loadDatagrid(params);
    return thisDatagrid;
  };
      
      
    
  /**
   * 加载datagrid
   */
  FsDatagrid.prototype.loadDatagrid = function(params){
	  var thisDatagrid = this;
	  
	  var _table = $(thisDatagrid.config.elem);
	  var tableId = _table.attr("id");
	  if($.isEmpty(tableId)){
      return ;
	  }
	  
	  //获取table属性
	  var defaultForm = _table.attr("defaultForm");//查询条件formid
	  
	  if($.isEmpty(defaultForm)){
      defaultForm = "query_form";
	  }
	  
	  //获取查询表单的参数
	  var formData = $("#"+defaultForm).getFormData(true);
	  if(!$.isEmpty(params)){
	  	$.extend(true, formData, params);
	  }
	  
	  var funcNo = _table.attr("funcNo");//功能号
	  
	  var isPage = _table.attr("isPage");//是否分页
	  
	  var height = _table.attr("height");//高度
	  if($.isEmpty(height)){
      height = "full-130";
	  }
	  
	  var pageSize = _table.attr("pageSize");//每页数量
	  if($.isEmpty(pageSize)){
      pageSize = defaultLimit;
	  }
	  
	  var url = _table.attr("url");//请求url
	  if($.isEmpty(url)){
      url = "/fsbus/" + funcNo;
	  }
	  var servletUrl = $.result(fsConfig,"global.servletUrl");
	  if(!$.isEmpty(servletUrl)){
      url = servletUrl + url;
	  }
	  
	  var isLoad =  _table.attr("isLoad");//是否自动加载数据，1 :默认加载，0 ：不加载
	  if(isLoad != "0"){
	  	isLoad = "1";
	  }
	  var datagridCols = _table.getDatagridCols();
	  
	  var cols = datagridCols["colsArr"];
	  
	  thisDatagrid.formatDataQuery(datagridCols["formatArr"]);
	  
	  //执行渲染
	  thisDatagrid.datagrid = table.render({
	    id:tableId,
	    elem: "#"+tableId, //指定原始表格元素选择器（推荐id选择器）
	    url:url,
	    where : formData, //增加条件
	    page: isPage == "1",
	    method : "post",
	    skin : 'row',
	    height: height, //容器高度
	    limits: defaultLimits,//每页数据选择项
	    limit: defaultLimit ,//默认采用50
	    cols:  [cols],
	    clickCallBack: thisDatagrid.config.clickCallBack,
	    data: [],
	    isLoad : isLoad,
	    request: {
        pageName: $.result(fsConfig,"global.page.request.pageName","pageNum"), //页码的参数名称，默认：pageNum
        limitName: $.result(fsConfig,"global.page.request.limitName","pageSize") //每页数据量的参数名，默认：pageSize
	    },
	    response: {
	      statusName: $.result(fsConfig,"global.result.statusName","errorNo") //数据状态的字段名称，默认：errorNo
	      ,statusCode: 0 //成功的状态码，默认：0
	      ,msgName: $.result(fsConfig,"global.result.msgName","errorInfo") //状态信息的字段名称，默认：errorInfo
	      ,countName: $.result(fsConfig,"global.page.response.countName","results.data.total") //数据总数的字段名称，默认：results.data.total
	      ,dataName: isPage == "1" ? $.result(fsConfig,"global.page.response.dataNamePage","results.data.list") : $.result(fsConfig,"global.page.response.dataName","results.data") //数据列表的字段名称，默认：data
	    }
	  });
      
  };
  
  /**
   * 格式化数据查询
   */
  FsDatagrid.prototype.formatDataQuery = function(formatArr){
  	if(!$.isEmpty(formatArr)){
  		$.each(formatArr,function(index,dict){
  			
  			var elem = layui.fsDict[dict];
  			
  			if($.isEmpty(elem)){
  				return false;
  			}
  			
  			var formatType = elem["formatType"];//格式化类型
  			
  			if(formatType == "server"){
  				var url = elem["loadUrl"];//请求url
  				
  				if(!$.isEmpty(url)){
  					
  					var inputs =elem["inputs"];
  					var param = {};//参数
  					if(!$.isEmpty(inputs))
  					{
  						var inputArr = inputs.split(',');
  						$.each(inputArr,function(i,v) {
  							var paramArr = v.split(':',2);
  							if(!$.isEmpty(paramArr[0]))
  							{
  								param[paramArr[0]] = paramArr[1];
  							}
  						});
  						
  					}
  					
  					fsCommon.invoke(url,param,function(result){
  						if(result[statusName] == "0")
  						{
  							var list = $.result(result,dataName);
  							elem["data"]=list;
  						}
  						else
  						{
  							//提示错误消息
  							fsCommon.errorMsg(result[msgName]);
  						}
  					},true);
  				}
  			}
  			
  		});
  	}
  };
      
  /**
   * 刷新
   */
  FsDatagrid.prototype.refresh = function(){
    if(!$.isEmpty(this.datagrid)){
        this.datagrid.refresh();
    }
  };
      
  /**
   * 选中的数据
   */
  FsDatagrid.prototype.getCheckData = function(){
    var tableId = this.config.id;
    return table.checkStatus(tableId).data;
  };

  /**
   * 查询
   */
  FsDatagrid.prototype.query = function(param){
    if(!$.isEmpty(this.datagrid)){
      this.datagrid.query(param);
    }
  };
      
  /**
   * 查询
   */
  FsDatagrid.prototype.reload = function(param){
    if(!$.isEmpty(this.datagrid)){
  		var options = {where:param};
      this.datagrid.reload(options);
    }
  };
      
      
  /**
   * 绑定工具条
   */
  FsDatagrid.prototype.bindDatagridTool = function(getDatagrid){
    var thisDatagrid = this;
    var _table = $(thisDatagrid.config.elem);
    var tableId = _table.attr("id");
    //监听工具条
    table.on("tool("+tableId+")", function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
      var data = obj.data; //获得当前行数据
      var layEvent = obj.event; //获得 lay-event 对应的值
      var tr = obj.tr; //获得当前行 tr 的DOM对象
      
      var _this = $(this);
      if(layEvent === 'submit'){ //提交
        if("1" == _this.attr("isConfirm"))
        {
          var confirmMsg = _this.attr("confirmMsg");
          if($.isEmpty(confirmMsg))
          {
            confirmMsg="是否确定操作选中的数据?";
          }
          
          fsCommon.confirm("提示", confirmMsg, function(index)
          {
            layer.close(index);
            var funcNO = _this.attr("funcNo");
            
            var url = _this.attr("url");//请求url
            
            if($.isEmpty(funcNO) && $.isEmpty(url)){
            	fsCommon.warnMsg("功能号或请求地址为空！");
              return;
            }
            
            if($.isEmpty(url)){
              url = "/fsbus/" + funcNo;
            }
            
            //获取参数
            var inputs = _this.attr("inputs");
            var param = {};//参数
            if(!$.isEmpty(inputs)){
              param = fsCommon.getParamByInputs(inputs,data);
            }
            
            //请求数据
            fsCommon.invoke(url,param,function(data)
            {
              if(data[statusName] == "0")
              {
              	fsCommon.setRefreshTable("1");
                getDatagrid(tableId).refresh();
                fsCommon.successMsg('操作成功!');
              }
              else
              {
                //提示错误消息
              	fsCommon.errorMsg(data[msgName]);
              }
            });
          });
        }
      }else if(layEvent === 'top'){ //打开新窗口
        var _url = _this.attr("topUrl");
        if($.isEmpty(_url))
        {
        	fsCommon.warnMsg("url地址为空！");
          return false;
        }
        
        var inputs = _this.attr("inputs");
        
        if(!$.isEmpty(inputs))
        {
          _url = fsCommon.getUrlByInputs(_url,inputs,data);
          
          //处理数据缓存
          if(loadDataType == "1"){
          	var uuid = $.uuid();
          	_url += "&_fsUuid="+uuid;
          	//缓存选中的数据
          	$.setSessionStorage(uuid,JSON.stringify(data));
          }
        }
        
        //弹出的方式
        var _mode = _this.attr("topMode");
        if(!$.isEmpty(_mode)){
        	if(_url.indexOf('?') == -1)
  				{
  					_url +="?";
  				}else{
  					_url +="&";
  				}
        	_url += "_mode="+_mode;
        }
        var _title = _this.attr("topTitle");
        var _width = _this.attr("topWidth");
        if($.isEmpty(_width))
        {
          _width = "700px";
        }
        var _height = _this.attr("topHeight");
        if($.isEmpty(_height))
        {
          _height = "400px";
        }
        
        //打开窗口
        top.layer.open({
          type: 2,
          title:_title,
          area: [_width, _height],
          fixed: false, //不固定
          scrollbar: false,
          maxmin: true,
          content: _url,
          end: function(){
            if(fsCommon.isRefreshTable())
            {
              getDatagrid(tableId).refresh();
            }
          }
        });
      }
    });
  };
      
  var fsDatagrid = new FsDatagrid();
  exports("fsDatagrid",fsDatagrid);

});