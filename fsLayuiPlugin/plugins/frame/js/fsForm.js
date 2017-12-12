/**
 * @Description: form表单工具
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.4.0
 * @date: 2017年11月5日 上午11:30:20
 */
layui.define(['layer',"fsCommon","form",'laydate',"fsConfig",'layedit'], function(exports){
  var layer = layui.layer,
  fsCommon = layui.fsCommon,
  laydate = layui.laydate,
  fsConfig = layui.fsConfig,
  layedit = layui.layedit,
  form = layui.form,
  statusName = _.result(fsConfig,"global.result.statusName","errorNo"),
  msgName = _.result(fsConfig,"global.result.msgName","errorInfo"),
  dataName = _.result(fsConfig,"global.result.dataName","results.data"),
  selectVals = {},//下拉框默认值
  FsForm = function (){
		this.config = {
			id:"",//form表单id
			elem:null//form对象
		}
	};
	
	var layEdits = {};
	
	FsForm.prototype.render = function(options){
		var thisForm = this;
    $.extend(true, thisForm.config, options);
    
    if(_.isEmpty(thisForm.config.id) && _.isEmpty(thisForm.config.elem)){
    	fsCommon.warnMsg("form选择器不能为空!");
    	return;
    }
	    
    if(!_.isEmpty(thisForm.config.id)){
      thisForm.config.elem = $("#"+thisForm.config.id);
    }
    
    thisForm.loadFormData();
    
    thisForm.renderDate();
    
    thisForm.renderLayedit();
    
    thisForm.bindButtionSubmit();
    
    return thisForm;
	};
	
	//渲染日期控件绑定
	FsForm.prototype.renderDate = function(){
    var thisForm = this;
		$(thisForm.config.elem).find("input.fsDate").each(function(){
		  var options = {};
		  var _this = $(this);
		  var dateRange = _this.attr("dateRange");//区间选择，1 是
		  var dateType = _this.attr("dateType");//控件选择类型
		  var dateFormat = _this.attr("dateFormat");//自定义格式
		  var dateMin = _this.attr("dateMin");//最大值
		  var dateMax = _this.attr("dateMax");//最小值
		  
		  options["elem"] = this; //指定元素;
		  if(dateRange=="1"){
			  options["range"] = true;
		  }
		  if(!_.isEmpty(dateType)){
			  options["type"] = dateType;
		  }
		  if(!_.isEmpty(dateFormat)){
			  options["format"] = dateFormat;
		  }
		  var value = _this.val();//默认值
		  if(!_.isEmpty(value)){
			  options["value"] = value;
		  }
		  if(!_.isEmpty(dateMin)){
			  options["min"] = dateMin;
		  }
		  if(!_.isEmpty(dateMax)){
			  options["max"] = dateMax;
		  }
		  
		  laydate.render(options);
	  });
	};
	
	/**
	 * 渲染lay编辑器
	 */
	FsForm.prototype.renderLayedit = function(){
		 var thisForm = this;
		//lay编辑器设置
    layedit.set({
      uploadImage: {
        url: _.result(fsConfig,"global.uploadUrl") //接口url
        ,type: 'post' //默认post
      }
    });
    $(thisForm.config.elem).find("textarea.fsLayedit").each(function(){
    	var _this = $(this);
    	var id = _this.attr("id");
    	var name = _this.attr("name");
    	var _height = _this.attr("height");
    	if(!_.isEmpty(id) && !_.isEmpty(name)){
    		layEdits[name]=layedit.build(id,{
    			height: _height
    		}); //建立编辑器
    	}
    });
	};
	
	/**
	 * 渲染全部下拉框
	 */
	FsForm.prototype.renderSelectAll = function(){
		var thisForm = this;
		 
	  $(thisForm.config.elem).find("select.fsSelect").each(function(){
	   	var _this = $(this);
	   	thisForm.renderSelect(_this);
	  });
	};
	
	/**
	 * 渲染下拉框
	 */
	FsForm.prototype.renderSelect = function(_this,b,value){
		var thisForm = this;
   	thisForm.loadSelectData(_this,b,value);
   	//绑定选择器
   	var childrenSelectId = _this.attr("childrenSelectId");
   	var lay_filter = _this.attr("lay-filter");
   	if(!_.isEmpty(childrenSelectId) && !_.isEmpty(lay_filter)){
   		form.on('select('+lay_filter+')', function(data){
   			//如果选择项为空，清空所有的子选择项
   			thisForm.cleanSelectData(_this);
   			if(!_.isEmpty(data.value)){
   				thisForm.renderSelect($("#"+childrenSelectId),true,data.value);
   			}
   			
   		});
   		
   	}
   	
   	form.render("select"); //更新全部
	};
	
	/**
	 * 清空下拉框
	 */
	FsForm.prototype.cleanSelectData =function(_this){
		var childrenSelectId = _this.attr("childrenSelectId");
		if(_.isEmpty(childrenSelectId)){
			return;
		}
		var _childerThis = $("#"+childrenSelectId);
		if(_childerThis.length==0){
			return;
		}
		var addNull = _childerThis.attr("addNull");//是否显示空值，1 显示
		_childerThis.empty();//清空
    if(addNull == "1"){
    	_childerThis.append("<option></option>");
    }
    form.render("select"); //更新全部
    
    this.cleanSelectData(_childerThis);//递推处理子选择器
	};
	
	/**
	 * 加载下拉框数据
	 */
	FsForm.prototype.loadSelectData =function(_this,b,value){
		var thisForm = this;
		
		var addNull = _this.attr("addNull");//是否显示空值，1 显示
    var isLoad = _this.attr("isLoad");//是否自动加载，1 是
    _this.empty();//清空
    if(addNull == "1"){
    	_this.append("<option></option>");
    }
    var dict = _this.attr("dict");
    if(_.isEmpty(dict)){
    	return false;
    }
    
    var dictObj = layui.fsDict[dict];
    
    if(_.isEmpty(dictObj)){
    	return false;
    }
    
    var labelField = dictObj["labelField"];
		var valueField = dictObj["valueField"];
    
    var formatType = dictObj["formatType"];//格式化类型
    if(_.isEmpty(formatType) || formatType == "server"){
    	var funcNo = dictObj["loadFuncNo"];
    	var url = dictObj["loadUrl"];//请求url
    	var inputs = dictObj["inputs"];
    	var param = {};//参数
    	if(!_.isEmpty(inputs))
    	{
    		var inputArr = _.split(inputs, ',');
    		_(inputArr).forEach(function(v) {
    			var paramArr = _.split(v, ':',2);
    			if(!_.isEmpty(paramArr[0]))
    			{
    				//获取参数值，如果值为空，获取选中行数据
    				var _vaule = paramArr[1];
    				if(_.isEmpty(_vaule))
    				{
    					_vaule = value;
    				}
    				param[paramArr[0]] = _vaule;
    			}
    		});
    		
    	}
    	if(_.isEmpty(url)){
    		url = "/fsbus/" + funcNo;
    	}
    	
    	if(!_.isEmpty(url) && (isLoad !="0" || b)){
    		fsCommon.invoke(url,param,function(data){
    			if(data[statusName] == "0")
    			{
    				var list = _.result(data,dataName);
    				thisForm.selectDataRender(_this,labelField,valueField,list);
    			}
    			else
    			{
    				//提示错误消息
    				fsCommon.errorMsg(data[msgName]);
    			}
    		});
    	}
    }else if(formatType == "local"){
    	
  		var list = dictObj["data"];
  		thisForm.selectDataRender(_this,labelField,valueField,list);
    }
    
	};
	
	/**
	 * select数据渲染
	 */
	FsForm.prototype.selectDataRender = function(_this,labelField,valueField,list){
		var thisForm = this;
		
		$(list).each(function(i,v){
			var option="<option value=\""+v[valueField]+"\">"+v[labelField]+"</option>";
			_this.append(option);
		});
		
		//默认值
		var defaultValue = selectVals[_this.attr("name")];
		if(!_.isEmpty(defaultValue)){
			_this.val(defaultValue);
			//如果有子联动，继续渲染
			var childrenSelectId = _this.attr("childrenSelectId");
			if(!_.isEmpty(childrenSelectId)){
				thisForm.renderSelect($("#"+childrenSelectId),true,defaultValue);
			}
			
		}
		form.render("select"); //更新全部
	};
	
	/**
	 * 自动填充form表单数据
	 */
	FsForm.prototype.loadFormData = function(){
    var thisForm = this;
		//参数处理，如果有参数，自动填充form表单
		var urlParam = fsCommon.getUrlParam();
		if(!_.isEmpty(urlParam)){
			$(thisForm.config.elem).setFormData(urlParam);
		}
		
		var formDom = $(thisForm.config.elem);
		//如果isLoad =1 并且功能号不为空，查询
		if(formDom.attr("isLoad") == "1" && (!_.isEmpty(formDom.attr("loadFuncNo")) || !_.isEmpty(formDom.attr("loadUrl"))))
		{
	    var funcNo = formDom.attr("loadFuncNo");
	    var url = formDom.attr("loadUrl");//请求url
      if(_.isEmpty(url)){
        url = "/fsbus/" + funcNo;
      }
      fsCommon.invoke(url,urlParam,function(data){
				if(data[statusName] == "0")
		  	{
					var formData = _.result(data,dataName);
					if(_.isEmpty(formData)){
						fsCommon.errorMsg("记录不存在!");
						return;
					}
					formDom.setFormData(formData);
					form.render(); //更新全部
					
					//联动下拉框处理，
					//1.先把联动下拉框数据缓存
					//2.异步加载完后，赋值
					$(thisForm.config.elem).find("select.fsSelect").each(function(){
						var _name = $(this).attr("name");
						selectVals[_name] = formData[_name];
					});
					
					$(thisForm.config.elem).find("select.fsSelect").each(function(){
						var selectDom = $(this);
						if(selectDom.attr("isLoad") != "0"){//一级下拉
							thisForm.renderSelect(selectDom);
						}
					});
					
					
		  	}
		  	else
		  	{
		  		//提示错误消息
		  		fsCommon.errorMsg(data[msgName]);
		  	}
		  });
			  
	  }else{
	  	thisForm.renderSelectAll();
	  }
		  
	};
  
 
  
	/**
	 * 绑定提交按钮
	 */
	FsForm.prototype.bindButtionSubmit = function(){
    var thisForm = this;
    $(thisForm.config.elem).find("button").each(function(){
      var lay_filter = $(this).attr("lay-filter");
      /**监听新增提交*/
      form.on("submit("+lay_filter+")", function (data) {
          
        if(_.eq("1",$(this).attr("isVerifyPwd")))//是否验证密码
        {
          //弹出密码提示
          layer.prompt({title: '输入验证密码，并确认', formType: 1}, function(pass, index){
            layer.close(index);
            data.field["loginPassword"] = pass;
            
            thisForm.submitForm(data.field,$(this));
          });
        }
        else
        {
          thisForm.submitForm(data.field,$(this));
        }
        return false;
      });
    });
	}
	
	/**
	 * form表单格式验证
	 */
	if(!_.isEmpty(fsConfig["verify"])){
    form.verify(fsConfig["verify"]);
	}
    
  /**
   * 提交请求
   */
	FsForm.prototype.submitForm = function(param,_this){
    var url = _this.attr("url");//请求url
  	var funcNo = _this.attr("funcNo");
  	if(_.isEmpty(funcNo) && _.isEmpty(url)){
  		fsCommon.warnMsg('功能号或请求地址为空!');
  		return;
  	}
  	if(_.isEmpty(url)){
      url = "/fsbus/" + funcNo;
    }
  	
  	//处理layedit编辑器内容
  	$.each(layEdits, function(key, val) {
  		param[key] = layedit.getContent(val);
  	});
  	
  	
  	fsCommon.invoke(url,param,function(data)
		{
    	if(data[statusName] == "0")
    	{
    		fsCommon.successMsg('操作成功!');
    		fsCommon.setRefreshTable("1");
    		
    		//是否自动关闭，默认是
    		if(!_.eq(_this.attr("isClose"), "0")){
    			parent.layer.close(parent.layer.getFrameIndex(window.name));
    		}
    	}
    	else
    	{
    		//提示错误消息
    		fsCommon.errorMsg(data[msgName]);
    	}
		});
  };
  
  var fsForm = new FsForm();
    //绑定按钮
	exports("fsForm",fsForm);
});