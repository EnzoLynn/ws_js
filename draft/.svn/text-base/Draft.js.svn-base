//model
Ext.define('WS.draft.Draftmodel', {
	extend: 'Ext.data.Model',
	idProperty: 'draftID',
	alternateClassName: 'Draftmodel',
	fields: [{
		name: 'draftID',
		type: 'string'
	},{
		name: 'faxNumber',
		type: 'string'
	},{
		name: 'recipient',
		type: 'string'
	},{
		name: 'recipientOrg',
		type: 'string'
	},{
		name: 'recipientEmail',
		type: 'string'
	},{
		name: 'recipientMobile',
		type: 'string'
	},{
		name: 'subject',
		type: 'string'
	},{
		name: 'comment',
		type: 'string'
	},{
		name: 'scheduleDateTime',
		type: 'string'
	},		//本地时间
	{
		name: 'priority',
		type: 'string'
	},			// 0---低  64-----较低
	// 128---普通  192----较高   255---最高

	{
		name: 'block',
		type: 'string'
	},	//是否阻塞 0--- 否  1----是
	{
		name: 'desireRetryTime',
		type: 'string'
	},		// 要求重试次数
	{
		name: 'retryInterval',
		type: 'string'
	},		//重试间隔  单位秒
	{
		name: 'emailReport',
		type: 'string'
	},			//是否Email通知收件人  0----否  1-----是
	{
		name: 'msgReport',
		type: 'string'
	},			//是否短信 通知收件人  0----否  1-----是
	{
		name: 'useHighResolution',
		type: 'string'
	},	//是否使用200*200 分辨率发送传真    0----否  1-----是
	{
		name: 'addFaxHeader',
		type: 'string'
	},			//是否添加传真页眉    0----否  1-----是
	{
		name: 'useBroadcastPort',
		type: 'string'
	},		//是否使用群发端口    0----否  1-----是
	{
		name: 'retryFromFirstPage',
		type: 'string'
	},	//失败重试是否从第一页开始    0----否  1-----是
	{
		name: 'faxFileID',
		type: 'string'
	},				//传真文件id

	{
		name: 'faxNumberExt',
		type: 'string'
	},{
		name: 'users',
		type: 'string'
	},{
		name: 'dirs',
		type: 'string'
	},{
		name: 'userName',
		type: 'string'
	},{
		name: 'dirPath',
		type: 'string'
	},{
		name: 'attach',
		type: 'string'
	}	//附件

	]
});

function createSDraftStroe() {
	Ext.StoreMgr.removeAtKey ('draftstoreId');
	//store
	Ext.create('Ext.data.Store', {
		model: 'WS.draft.Draftmodel',
		storeId: 'draftstoreId',
		pageSize: userConfig.gridPageSize,
		autoLoad: false,
		remoteSort: true,     //排序通过查询数据库
		sorters: [{
			property: 'draftID',
			direction: 'DESC'
		}],
		autoSync: false,
		proxy: {
			type: 'ajax',
			//		url: 'WS/infax/Infax.json',
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
				dataname: 'draft',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
				folderid: 0,
				refresh: null
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
}

//创建一个工具栏设置文菜单
var draft_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});

//创建一个上下文菜单
var draft_RightMenu = Ext.create('Ext.menu.Menu', {
	listeners: {
		afterrender: function() {
			var me = this;
			var fistAdd = true;
			gridPlugin.draftPlugin.each( function(item,index,alls) {
				if(item.initialConfig.addType.indexOf('m') != -1) {
					if(fistAdd)
						me.add('-');
					fistAdd = false;
					me.add(item);
				}
			});
		}
	},
	items: [ActionBase.getAction('refreshdraftID'),'-', ActionBase.getAction('delDraftID'),'-',
	ActionBase.getAction('sendfaxdraftID'), ActionBase.getAction('sendfaxdraftAll')]
});

//-------------------grid
Ext.define('WS.draft.Draftgrid', {
	alternateClassName: ['draftgrid'],
	alias: 'widget.Draftgrid',
	extend: 'Ext.grid.Panel',
	//	title: '草稿箱',
	store: 'draftstoreId',
	itemId: 'draftGridID',
	columnLines: true,
	multiSelect: true,
	// features: [{
	// ftype: 'grouping',
	// groupHeaderTpl: '文件: {name} ({rows.length})',
	// disabled: true
	// }],
	listeners: {
		itemclick: function(grid,record,hitem,index,e,opts) {
			if(!e.ctrlKey && !e.shiftKey) {
				var sm = grid.getSelectionModel();
				sm.deselectAll(true);
				sm.select(record,true,false);
			}
		},
		itemdblclick:function(grid,record,hitem,index,e,opts){
			if(seefillfaxwin == ''){
				seefillfaxwin = seeFillFaxNew(record);
			}else{
				seefillfaxwin = seeFillFaxNew(record,seefillfaxwin);
			}
			seefillfaxwin.show();
			//seeFillFax();			
		},
		selectionchange: function(me, selections, op) {
			ActionBase.updateActions('Draft', selections);
		},		
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			draft_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		}
	},

	columns : [{
		header: '编号',
		dataIndex: 'draftID',
		width: 80,
		renderer: function(value, metaData, record) {
			if(record.data.attach.length > 0) {
				return "<div><img src='resources/images/pub/attach.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';				
			}
			return "<div><img src='resources/images/tree/inFax.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';

		}
	},{
		header: '传真号码',
		dataIndex: 'faxNumber',
		width: 150
	},{
		header: '收件人',
		dataIndex: 'recipient',
		width: 150,
		hidden: true
	},{
		header: '收件人组织',
		dataIndex: 'recipientOrg',
		width: 150
	},{
		header: '收件人邮箱地址',
		dataIndex: 'recipientEmail',
		width: 150
	},{
		header: '收件人手机号码',
		dataIndex: 'recipientMobile',
		width: 150
	},{
		header: '主题',
		dataIndex: 'subject',
		width: 150
	},{
		header: '注释',
		dataIndex: 'comment',
		width: 150
	},{
		header: '安排发送时间',
		dataIndex: 'scheduleDateTime',
		width: 150,
		renderer: function(value) {
			return UTCtoLocal(value);
		}
	},{
		header: '优先度',
		dataIndex: 'priority',
		width: 60
	},

	// {header: '是否阻塞', dataIndex: 'block', hidden: true, renderer: function(value) {
	// return value == '0' ? '否' : '是';
	// }},
	// {header: '要求重试次数', dataIndex: 'desireRetryTime', hidden: true},
	// {header: '重试间隔', dataIndex: 'retryInterval', hidden: true, renderer: function(value) {
	// return faxDuration(value);
	// }},
	// {header: '是否Email通知收件人', dataIndex: 'emailReport', hidden: true, renderer: function(value) {
	// return value == '0' ? '否' : '是';
	// }},
	// {header: '是否短信 通知收件人', dataIndex: 'msgReport', hidden: true, renderer: function(value) {
	// return value == '0' ? '否' : '是';
	// }},
	// {header: '是否使用200*200 分辨率发送传真', dataIndex: 'useHighResolution', hidden: true, renderer: function(value) {
	// return value == '0' ? '否' : '是';
	// }},
	// {header: '是否添加传真页眉', dataIndex: 'addFaxHeader', hidden: true, renderer: function(value) {
	// return value == '0' ? '否' : '是';
	// }},
	// {header: '是否使用群发端口', dataIndex: 'useBroadcastPort', hidden: true, renderer: function(value) {
	// return value == '0' ? '否' : '是';
	// }},
	// {header: '失败重试是否从第一页开始', dataIndex: 'retryFromFirstPage', hidden: true, renderer: function(value) {
	// return value == '0' ? '否' : '是';
	// }},
	{
		header: '传真分机',
		dataIndex: 'faxNumberExt',
		width: 150,
		hidden: true
	},{
		text: '传真文件id',
		dataIndex: 'faxFileID',		
		hidden: true
	}
	//{header: '内部收件人', dataIndex: 'users', width: 150, hidden: true},
	//{header: '共享目录', dataIndex: 'dirs', width: 650, hidden: false}
	],
	dockedItems : [{
		xtype : 'toolbar',
		itemId: 'toolbarID',
		dock:'top',
		layout: {
			overflowHandler: 'Menu'
		},
		listeners: {
			afterrender: function() {
				var me = this;
				var fistAdd = true;
				gridPlugin.draftPlugin.each( function(item,index,alls) {
					if(item.initialConfig.addType.indexOf('t') != -1) {
						if(fistAdd)
							me.add('-');
						fistAdd = false;
						me.add(item);
					}
				});
				
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,draft_tbtnSetMenu);
			}
		},
		items: [ActionBase.getAction('refreshdraftID'), '-', ActionBase.getAction('delDraftID'),
		'-',ActionBase.getAction('sendfaxdraftID'),ActionBase.getAction('sendfaxdraftAll')]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store : 'draftstoreId',
		items:[{

			text: '选择',
			iconCls:'actionSelect',
			itemId: 'seldraftID',
			menu: [ActionBase.getAction('allselectDraftID'),ActionBase.getAction('otherselectDraftID')]

			// text: '按相同文件分组',
			// enableToggle: true,
			// toggleHandler: function(btn, pressed) {
			// var me = this;
			// var butt = me.up('pagingtoolbar');
			// var grid = butt.up('panel');
			// Ext.StoreMgr.lookup('draftstoreId').group('faxfileID');
			// //            		Ext.StoreMgr.lookup('infaxstoreId').group('m');
			// if(pressed) {
			// grid.features[0].enable();
			// } else {
			// grid.features[0].disable();
			// }
			// }
		}]

	}],

	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);	// 调用父类方法

		me.on('itemcontextmenu', function(view, record, item, index, e, options) {
			e.stopEvent();
		});
		me.on('beforeitemmousedown', function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		});
		me.getStore().getProxy().on('exception', function(proxy, response, operation) {
			var json = Ext.JSON.decode(response.responseText);
			var code = json.code;
			errorProcess(code);
			if(operation.action != 'read') {
				me.loadGrid();
			}
		});
		me.getStore().on('load', function(store, records, suc,operation,opts) {
			var total = me.down("#pagingtoolbarID").getPageData().total;
			if (total == '0') {
				//alert(records.length);
				me.down("#next").setDisabled(true);
				me.down("#last").setDisabled(true);
			}
			if(suc) {
				//				if (me.getStore().getCount() > 0 && !me.getSelectionModel().hasSelection() && records.length > 0) {
				//					me.getSelectionModel().select(0, true);
				//				}
			} else {
				return;
			}
		});
		ActionBase.setTargetView('Draft', me);
		ActionBase.updateActions('Draft', me.getSelectionModel().getSelection());
	},
	loadGrid: function() {
		var me = this;
		var store = me.getStore();
		store.pageSize = userConfig.gridPageSize;
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		var filter = '';

		store.getProxy().extraParams.filter = filter;
		store.getProxy().extraParams.refresh = 1;
		//		store.currentPage = 1;
		store.loadPage(1);
		store.getProxy().extraParams.refresh = null;
		var folderId = store.getProxy().extraParams.folderid;
		ActionBase.updateActions('Draft', me.getSelectionModel().getSelection());
	}
});