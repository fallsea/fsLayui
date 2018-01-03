/**
 * @Description: 字典配置
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.6.3
 * @License：MIT
 */
layui.fsDict = {
		//城市
		city : {
			formatType : "local",
			labelField : "name",
			valueField : "code",
			//静态数据
			data:[{"code":0,"name":"北京","style":"color:#F00;"},
				{"code":1,"name":"上海"},
				{"code":2,"name":"广州"},
				{"code":3,"name":"深圳"},
				{"code":4,"name":"杭州"}
			]
		},
		//类型
		type : {
			formatType : "local",
			labelField : "name",
			valueField : "code",
			spaceMode : " ",//展示多个数据分隔符，默认,
			data:[{"code":"write","name":"写作","css":"layui-badge layui-bg-orange"},
				{"code":"read","name":"阅读","css":"layui-badge layui-bg-green"},
				{"code":"dai","name":"发呆","css":"layui-badge layui-bg-cyan"}]
		}
		,
		//省份
		area1 : {
			formatType : "server",
			loadUrl : "/fsbus/1005",
			inputs : "parentid:0",
			labelField : "name",
			valueField : "id"
		},
		//城市
		area2 : {
			formatType : "server",
			loadUrl : "/fsbus/1005",
			inputs : "parentid:",
			labelField : "name",
			valueField : "id"
		},
		//区
		area3 : {
			formatType : "server",
			loadUrl : "/fsbus/1005",
			inputs : "parentid:,area1:#area2222222",
			labelField : "name",
			valueField : "id"
		}
};