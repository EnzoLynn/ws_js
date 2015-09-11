//等比例缩放预览图
function DrawImage(img) {
	var imgWidth = img.getWidth();
	var imgHeidht = img.getHeight();
	var setWidth=0;
	var setHeight = 0;
	if(imgWidth >0 && imgHeidht>0) {
		if(imgWidth/imgHeidht >= 1) {
			if(imgWidth >= 260) {
				setWidth = 260;
				setHeight = (imgHeidht * 260)/imgWidth;
			}
		} else {
			if(imgHeidht >= 260) {
				setHeight = 260;
				setWidth = (imgWidth * 260)/imgHeidht;
			}
		}

		img.setWidth(setWidth);
		img.setHeight(setHeight);
	}

}

//coverimagegrid model
Ext.define('WS.coverimagegrid.coverimagegridModel', {
	extend: 'Ext.data.Model',
	idProperty: 'stampID',
	alternateClassName: ['coverimagegridModel'],
	fields: [{
		name:'stampID',
		type:'string'
	},//图章id
	{
		name: 'stampName',
		type: 'string'
	}, //图章名
	{
		name:'sysRoles',
		type:'string'
	},//角色列表
	{
		name:'createUser',
		type:'string'
	},//创建人
	{
		name:'enabled',
		type:'string'
	},//活动状态
	{
		name:'createTime',
		type:'string'
	},//创建时间
	{
		name:'enumEStampAuthType',
		type:'int'
	},//验证类型
	{
		name:'stampWidth',
		type:'int'
	},//图章宽度
	{
		name:'stampHeight',
		type:'int'
	}//图章高度
	]
});

//coverimagegrid store
Ext.create('Ext.data.Store', {
	model: 'WS.coverimagegrid.coverimagegridModel',
	storeId: 'coverimagegridStoreId',
	autoLoad: false,
	proxy: {
		type: 'ajax',

		//		url: 'WS/coverimagegrid/griddata.json',
		api: {
			create  : WsConf.Url + '?action=create',
			read    : WsConf.Url + '?action=read',
			update  : WsConf.Url + '?action=update',
			destroy : WsConf.Url + '?action=destroy'
		},
		filterParam: 'filter',
		sortParam:'sort',
		directionParam:'dir',
		limitParam:'limit',
		startParam:'start',
		simpleSortMode: true,		//单一字段排序

		extraParams: {
			req:'dataset',
			dataname: 'coverimage',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			sessiontoken: ''
			//			refresh: null
		},
		reader : {
			type : 'json',
			root: 'dataset',
			seccessProperty: 'success',
			messageProperty: 'msg',
			totalProperty: 'total'
		},
		writer : {
			type : 'json',
			writeAllFields : false,
			allowSingle : false
			//			root: 'dataset'
		},
		actionMethods: 'POST'
	}

});

//coverimagegrid
Ext.define('WS.coverimagegrid.coverimagegrid', {
	alternateClassName: ['coverimagegrid'],
	alias: 'widget.coverimagegrid',
	extend: 'Ext.grid.Panel',
	//	title: '图章列表',
	store: 'coverimagegridStoreId',
	columnLines: true,
	multiSelect: false,
	columns : [{
		header: '图章id',
		dataIndex: 'stampID',
		hidden:true
	},{
		header: '图章名',
		dataIndex: 'stampName'
	},{
		header: '创建人',
		dataIndex: 'createUser'
	},{
		header: '活动状态',
		dataIndex: 'enabled',
		renderer: function(value) {
			if(value == "true") {
				return '启用';
			} else {
				return '禁用';
			}
		}
	},{
		header: '创建时间',
		dataIndex: 'createTime',
		width:150
	}
	],
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);
		me.getStore().getProxy().on('exception', function(proxy, response, operation) {
			var json = Ext.JSON.decode(response.responseText);
			var code = json.code;
			if(operation.action == "update" || operation.action == "destroy") {

				me.loadGrid(filter);
			}
			errorProcess(code);
			//根据operation 处理
		});
	},
	loadGrid: function() {
		var me = this;
		//		me.show();
		var store = me.getStore();
		var sessiontoken = store.getProxy().extraParams.sessiontoken = Ext.util.Cookies.get('sessiontoken');
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		store.load();

	}
});

//coverimgaegridwin
//图章管理用window
function loadcoverimgaegridwin() {
	return Ext.create('Ext.window.Window', {
		title: '查看图章',
		//iconCls:'config',
		height: 450,
		width: 820,
		modal: true,
		resizable: false,
		collapsible: false,
		frame: false,
		border: false,
		layout: {
			type:'table',
			columns:2
		},
		defaults: {
			//////bodyCls: 'panelFormBg',
			//frame: false,
			border: false,
			margin:'5 5 5 5'
		},
		items: [{
			xtype:'fieldset',
			title:'图章列表',
			width:490,
			height:410,
			layout:'anchor',
			rowspan:3,
			items:[{
				xtype:'coverimagegrid',
				height:370,
				listeners: {
					selectionchange: function(view,sels,opts) {
						this.up('window').down('#imgView').setSrc('resources/images/s.gif');
						if(sels.length > 0) {
							this.up('window').down('#viewStamp').setDisabled(false);
						} else {
							this.up('window').down('#viewStamp').setDisabled(true);
						}
					}
				}
			}]
		},{
			xtype:'button',
			text:'关闭',
			margin:'5 5 5 40',
			width:250,
			handler: function() {
				coverimgaegridwin.close();
			}
		},{
			xtype:'button',
			text:'查看',
			margin:'5 5 5 40',
			itemId:'viewStamp',
			disabled:true,
			width:250,
			handler: function() {
				var grid = this.up('window').down('coverimagegrid');
				var img = this.up('window').down('#imgView');

				if(grid.getSelectionModel().hasSelection()) {
					var imgrunner;
					//grid.getSelectionModel().getSelection()[0]
					var record = grid.getSelectionModel().getSelection()[0];
					if(record.data.enumEStampAuthType == EnumEStampAuthType.satpNone) {
						//调用call取得图章信息
						//"+WsConf.Url+"?req=rc&rcname=loadstamp&stampid="+stampTemp.stampId+"
						img.setSrc(WsConf.Url+"?req=rc&rcname=loadstamp&stampid="+record.data.stampID+"");
						var imgClock = function() {
							if(img.dom && img.getWidth() && img.getWidth() > 1) {
								DrawImage(img);
								imgrunner.stopAll();
								imgrunner = new Ext.util.TaskRunner();
							}
						};
						var imgtask = {
							run: imgClock,
							interval: 1000 //1 second
						};
						imgrunner = new Ext.util.TaskRunner();
						imgrunner.start(imgtask);

					} else {
						var msgStr = '图章名称:' + record.data.stampName;
						var fileText = '';
						if(record.data.enumEStampAuthType == EnumEStampAuthType.satpPassword) {
							fileText = '图章密码';
						}
						if(record.data.enumEStampAuthType == EnumEStampAuthType.satpAccountAuth) {
							fileText = '用户密码';
						}

						promWin = Ext.create('Ext.window.Window', {
							title: '请输入密码',
							height: 120,
							width: 300,
							layout: 'auto',
							items:[{
								margin:'2 0 2 7',
								xtype:'label',
								text:msgStr
							},{
								width:280,
								xtype:'textfield',
								itemId:'txtPass',
								labelWidth:60,
								labelAlign:'right',
								fieldLabel:fileText,
								inputType:'password'
							}],
							buttons:[{
								text:'确定',
								handler: function() {

									//调用验证图章密码接口
									//调用
									var param = {};
									param.stampId = record.data.stampID;
									param.type = 0;
									param.pass = promWin.down('#txtPass').getValue();
									param.sessiontoken = sessionToken;
									promWin.close();
									//调用
									WsCall.call('checkstamppass', param, function (response, opts) {
										//调用call取得图章信息
										img.setSrc(WsConf.Url+"?req=rc&rcname=loadstamp&stampid="+record.data.stampID+"");
										var imgClock = function() {
											if(img.dom && img.getWidth() && img.getWidth() > 1) {
												DrawImage(img);
												imgrunner.stopAll();
												imgrunner = new Ext.util.TaskRunner();
											}
										};
										var imgtask = {
											run: imgClock,
											interval: 1000 //1 second
										};
										imgrunner = new Ext.util.TaskRunner();
										imgrunner.start(imgtask);

									}, function (response, opts) {
										if(!errorProcess(response.code)) {
											Ext.Msg.alert('密码错误',response.msg);
										}
										
									}, true);
								}
							},{
								text:'取消',
								handler: function() {
									promWin.close();
								}
							}]
						}).show();

					}

					//img.setSrc('resources/images/loginbk.PNG');
				}
			}
		},{
			xtype:'fieldset',
			title:'图章预览',
			width:300,
			height:300,
			layout:'anchor',
			items:[{
				xtype:'image',
				itemId:'imgView',
				src:'resources/images/s.gif'
			}]
		}],
		listeners: {
			destroy: function () {
				coverimgaegridwin = '';
			}
		}
	}).show();

}