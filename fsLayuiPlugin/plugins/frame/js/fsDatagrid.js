/**
 * @Description: datagrid工具
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.0.2
 * @date: 2017年11月5日 上午11:26:44
 */
layui.define(["common","table",'laypage','fsConfig'], function(exports){
  var common = layui.common,
  table = layui.table,
  laypage = layui.laypage,
  fsConfig = layui.fsConfig,
  statusName = _.result(fsConfig,"global.result.statusName","errorNo"),
  msgName = _.result(fsConfig,"global.result.msgName","errorInfo"),
  dataName = _.result(fsConfig,"global.result.dataName","results.data"),
  FsDatagrid = function (){
      this.config = {
              id:"",//form表单id
              elem:null//form对象
          }
      };
      
      FsDatagrid.prototype.render = function(options){
          var thisDatagrid = this;
          $.extend(true, thisDatagrid.config, options);
          
          if(_.isEmpty(thisDatagrid.config.id)){
              common.warnMsg("表格id不能为空!");
              return;
          }
          if(!_.isEmpty(thisDatagrid.config.id)){
              thisDatagrid.config.elem = $("#"+thisDatagrid.config.id);
          }
          
          thisDatagrid.loadDatagrid();
//          thisDatagrid.bindDatagridTool();
          return thisDatagrid;
      };
      
      
    
      /**
       * 加载datagrid
       */
      FsDatagrid.prototype.loadDatagrid = function(){
          var thisDatagrid = this;
          
          var _table = $(thisDatagrid.config.elem);
          var tableId = _table.attr("id");
          if(_.isEmpty(tableId)){
              return ;
          }
          
          //获取table属性
//        var _table = $("#"+tableId);
          
          var defaultForm = _table.attr("defaultForm");//查询条件formid
          
          if(_.isEmpty(defaultForm)){
              defaultForm = "query_form";
          }
          
          //获取查询表单的参数
          var formData = $("#"+defaultForm).getFormData(true);
          
          var funcNo = _table.attr("funcNo");//功能号
          
          var isPage = _table.attr("isPage");//是否分页
          
          var height = _table.attr("height");//高度
          if(_.isEmpty(height)){
              height = "full-130";
          }
          
          var pageSize = _table.attr("pageSize");//每页数量
          if(_.isEmpty(pageSize)){
              pageSize ="20";
          }
          
          var url = _table.attr("url");//请求url
          if(_.isEmpty(url)){
              url = "/fsbus/" + funcNo;
          }
          var servletUrl = _.result(fsConfig,"global.servletUrl");
          if(!_.isEmpty(servletUrl)){
              url = servletUrl + url;
          }
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
            limits: [10,20,30,50,100],//每页数据选择项
            limit: pageSize ,//默认采用50
            cols:  [_table.getDatagridCols()],
            request: {
                pageName: _.result(fsConfig,"global.page.request.pageName","pageNum"), //页码的参数名称，默认：pageNum
                limitName: _.result(fsConfig,"global.page.request.limitName","pageSize") //每页数据量的参数名，默认：pageSize
            },
            response: {
              statusName: _.result(fsConfig,"global.result.statusName","errorNo") //数据状态的字段名称，默认：errorNo
              ,statusCode: 0 //成功的状态码，默认：0
              ,msgName: _.result(fsConfig,"global.result.msgName","errorInfo") //状态信息的字段名称，默认：errorInfo
              ,countName: _.result(fsConfig,"global.page.response.countName","results.data.total") //数据总数的字段名称，默认：results.data.total
              ,dataName: isPage == "1" ? _.result(fsConfig,"global.page.response.dataNamePage","results.data.list") : _.result(fsConfig,"global.page.response.dataName","results.data") //数据列表的字段名称，默认：data
            }
          });
          
      };
      
      /**
       * 刷新
       */
      FsDatagrid.prototype.refresh = function(){
          
          if(!_.isEmpty(this.datagrid)){
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
          if(!_.isEmpty(this.datagrid)){
              this.datagrid.query(param);
          }
      };
      
      /**
       * 查询
       */
      FsDatagrid.prototype.reload = function(param){
        if(!_.isEmpty(this.datagrid)){
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
                
              if(_.eq("1",_this.attr("isConfirm")))
              {
                  var confirmMsg = _this.attr("confirmMsg");
                  if(_.isEmpty(confirmMsg))
                  {
                      confirmMsg="是否确定操作选中的数据?";
                  }
                  
                  common.confirm("提示", confirmMsg, function(index)
                  {
                      layer.close(index);
                      var funcNO = _this.attr("funcNo");
                      
                      var url = _this.attr("url");//请求url
                      
                      if(_.isEmpty(funcNO) && _.isEmpty(url)){
                          common.warnMsg("功能号或请求地址为空！");
                          return;
                      }
                      
                      if(_.isEmpty(url)){
                          url = "/fsbus/" + funcNo;
                      }
                      
                      
                      //获取参数
                      var inputs = _this.attr("inputs");
                      var param = {};//参数
                      if(!_.isEmpty(inputs)){
                          param = common.getParamByInputs(inputs,data);
                      }
                      
                      //请求数据
                      common.invoke(url,param,function(data)
                          {
                              if(data[statusName] == "0")
                              {
                                  common.successMsg('操作成功!');
                                  common.setRefreshTable("1");
                                  
                                  getDatagrid(tableId).refresh();
                              }
                              else
                              {
                                  //提示错误消息
                                  common.errorMsg(data[msgName]);
                              }
                          });
                  });
                  
                  
              }
            }else if(layEvent === 'top'){ //打开新窗口
              var _url = _this.attr("topUrl");
              if(_.isEmpty(_url))
              {
                  common.warnMsg("url地址为空！");
                  return false;
              }
              
              var inputs = _this.attr("inputs");
              
              if(!_.isEmpty(inputs))
              {
                  _url = common.getUrlByInputs(_url,inputs,data);
              }
              
              
              var _title = _this.attr("topTitle");
              var _width = _this.attr("topWidth");
              if(_.isEmpty(_width))
              {
                  _width = "700px";
              }
              var _height = _this.attr("topHeight");
              if(_.isEmpty(_height))
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
                    if(common.isRefreshTable())
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