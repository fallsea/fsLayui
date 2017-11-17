/**
 * @Description: form表单工具
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.0.4
 * @date: 2017年11月5日 上午11:30:20
 */
layui.define(['layer',"common","form",'laydate',"fsConfig"], function(exports){
  var layer = layui.layer,
  common = layui.common,
  laydate = layui.laydate,
  fsConfig = layui.fsConfig,
  form = layui.form,
  statusName = _.result(fsConfig,"global.result.statusName","errorNo"),
  msgName = _.result(fsConfig,"global.result.msgName","errorInfo"),
  dataName = _.result(fsConfig,"global.result.dataName","results.data"),
  FsForm = function (){
		this.config = {
			id:"",//form表单id
			elem:null//form对象
		}
	};
	
	FsForm.prototype.render = function(options){
		var thisForm = this;
	    $.extend(true, thisForm.config, options);
	    
	    if(_.isEmpty(thisForm.config.id) && _.isEmpty(thisForm.config.elem)){
			common.warnMsg("form选择器不能为空!");
			return;
		}
	    
	    if(!_.isEmpty(thisForm.config.id)){
	        thisForm.config.elem = $("#"+thisForm.config.id);
	    }
	    
	    thisForm.renderDate();
	    
	    thisForm.loadFormData();
	    
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
	 * 自动填充form表单数据
	 */
	FsForm.prototype.loadFormData = function(){
	    var thisForm = this;
		//参数处理，如果有参数，自动填充form表单
		var urlParam = common.getUrlParam();
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
		    
			common.invoke(url,urlParam,function(data){
				if(data[statusName] == "0")
			  	{
					var formData = _.result(data,dataName);
					if(_.isEmpty(formData)){
						common.errorMsg("记录不存在!");
						return;
					}
					formDom.setFormData(formData);
					form.render(); //更新全部
			  	}
			  	else
			  	{
			  		//提示错误消息
			  		common.errorMsg(data[msgName]);
			  	}
			  });
			  
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
//	FsForm.prototype.formVerify = function(){
	if(!_.isEmpty(fsConfig["verify"])){
	    form.verify(fsConfig["verify"]);
	}
    
	    
//	}
  	
    
    /**
     * 提交请求
     */
	FsForm.prototype.submitForm = function(param,_this)
    {

        var url = _this.attr("url");//请求url
    	var funcNo = _this.attr("funcNo");
    	if(_.isEmpty(funcNo) && _.isEmpty(url)){
    		common.warnMsg('功能号或请求地址为空!');
    		return;
    	}
    	if(_.isEmpty(url)){
            url = "/fsbus/" + funcNo;
        }
    	common.invoke(url,param,function(data)
		{
	    	if(data[statusName] == "0")
	    	{
	    		common.successMsg('操作成功!');
	    		common.setRefreshTable("1");
	    		
	    		//是否自动关闭，默认是
	    		if(!_.eq(_this.attr("isClose"), "0")){
	    			parent.layer.close(parent.layer.getFrameIndex(window.name));
	    		}
	    	}
	    	else
	    	{
	    		//提示错误消息
	    		common.errorMsg(data[msgName]);
	    	}
		});
    };
    var fsForm = new FsForm();
    
    //绑定按钮
	exports("fsForm",fsForm);
});