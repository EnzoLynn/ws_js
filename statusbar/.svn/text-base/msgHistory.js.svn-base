//renderer
function switchCNType(value) {
	if(value == 0) {
		return '传真接收消息';
	}
	if(value == 1) {
		return '语音接收消息';
	}
	if(value == 2) {
		return '短信接收消息';
	}
	if(value == 3) {
		return '传真发送消息';//ok
	}
	if(value == 4) {
		return '传真发送消息';//error
	}
	if(value == 5) {
		return '短信发送消息';//ok
	}
	if(value == 6) {
		return '短信发送消息';//error
	}
	if(value == 7) {
		return '工作流消息';//7:ReceiveApprovalFax;
	}
	if(value == 8) {
		return '工作流消息';//8:ApprovalPassed;
	}
	if(value == 9) {
		return '工作流消息';//9:ApprovalNotPassed;
	}
	if(value == 10) {
		return '管理员消息';
	}
	if(value == 11) {
		 return '职责委任';
	}
}

function mapToFilterStr(isMongodb ,map) {
	var filter = '';
	if(map.getCount() > 0) {
		map.each( function(key, value, length) {
			if(isMongodb) {
				if(filter.length == 0) {
					filter = '{' + key + ":'" + value + "'";
				} else {
					filter = filter + ',' + key + ":'" + value + "'";
				}
			}else {
				if(filter.length == 0) {
					filter = value;
				} else {
					filter = filter + ' and ' + value;
				}
			}
		});
		if(isMongodb) {
			filter += '}';
		}
		
	}
	return filter;
}

////历史消息bottom toolbar msghistroypaging
Ext.define('WS.statusbar.msghistroypaging', {
	alias: 'widget.msghistroypaging',
	extend: 'Ext.toolbar.Paging',
	displayInfo : true,
	displayMsg : '第 {0} 到 {1} 条，共 {2} 条',
	emptyMsg : "没有记录",
	beforePageText: '页数',
	afterPageText: '共 {0}',
	refreshText: '刷新当前页',
	firstText: '首页',
	lastText: '末页',
	nextText: '下页',
	prevText: '前页',

	items:[{
		text: '显示详细',
		pressed: true,
		enableToggle: true,
		toggleHandler: function(btn, pressed) {
			var preview = Ext.getCmp('gv').getPlugin('preview');
			preview.toggleExpanded(pressed);
		}
	}],
	listeners: {
		render: function(me) {
			me.down('#refresh').hide();
		}
	}

});

//历史消息Grid store
Ext.create('Ext.data.Store', {
	storeId:'simpsonsStore',
	filterMap: Ext.create('Ext.util.HashMap'),
	autoLoad: false,
	pageSize: 10,
	remoteSort: true,     //排序通过查询数据库
	sorters: [{
		property: 'msgid',
		direction: 'DESC'
	}],
	fields:[{
		name:'notifyType',
		type: 'int'
	}, 'param1', 'param2','param3'],	
	proxy: {
		type: 'ajax',
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
			dataname: 'msghistory',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			sessiontoken: '',
			refresh: null
		},
		reader: {
			type: 'json',
			root: 'dataset',
			seccessProperty: 'success',
			messageProperty: 'msg',
			totalProperty: 'total'
		},
		actionMethods: 'POST'
	}
});

//历史消息top toolbar
Ext.define('ws.statusbar.msghistroyTBar', {
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: 'msghistroyTBar',
	alias: 'widget.msghistroyTBar',
	itemId: 'msghistroyTBar',
	items: [{
		fieldLabel: '快速查找',
		labelAlign: 'right',
		labelPad: 1,
		width: 300,
		colspan:3,
		labelWidth: 100,
		xtype: 'searchfield',
		store:Ext.StoreMgr.lookup('simpsonsStore'),
		itemId: 'serFielID',
		onTrigger1Click : function() {
			var me = this,
			store = me.store,
			proxy = store.getProxy(),
			val;

			if (me.hasSearch) {
				me.setValue('');
				proxy.extraParams[me.paramName] = '';
				proxy.extraParams.start = 0;
				proxy.extraParams.refresh = 1;
//				store.filterMap.removeAtKey('paramT');
//				store.filterMap.each( function(key, value, length) {
//					if(filter.length == 0) {
//						filter = value;
//					} else {
//						filter = filter + ' and ' + value;
//					}
//				});
				
				store.filterMap.removeAtKey('paramT');
				
				proxy.extraParams.filter = mapToFilterStr(false, store.filterMap);
				store.load();
				proxy.extraParams.refresh = null;
				me.hasSearch = false;
				me.triggerEl.item(0).up('td').setWidth(0);
				me.triggerEl.item(0).setDisplayed('none');
				me.doComponentLayout();
			}
		},
		onTrigger2Click: function() {

			var me = this,
			store = me.store;
			proxy = store.getProxy(),
			value = me.getValue();
			if (value.length < 1) {
				me.onTrigger1Click();
				return;
			}
			//var strNType= switchCNType(value);
			//var intType = switchValueToInt(value);
			
			var filter = mapToFilterStr(false, store.filterMap);
			var cusStr = "(param2 like '%"+value+"%' or  param3 like '%" + value + "%')";
			proxy.extraParams[me.paramName] = (filter==''?'':(filter+' and ')) + cusStr;
			store.filterMap.replace('paramT', cusStr);
			
//			store.filterMap.replace('paramT', value);	//paramT--param2 和param3
//			proxy.extraParams[me.paramName] = mapToFilterStr(true, store.filterMap);
			
			proxy.extraParams.start = 0;
			proxy.extraParams.refresh = 1;
			store.load();
			proxy.extraParams.refresh = null;
			me.hasSearch = true;
			me.triggerEl.item(0).up('td').setWidth(17);
			me.triggerEl.item(0).setDisplayed('block');
			me.doComponentLayout();

			// store.filterBy( function(record) {
			// var strNType= switchCNType(record.get('notifyType'));
			// var notifyType = strNType.indexOf(value)>-1?true:false;
			// var param1 = record.get('param1').indexOf(value)>-1?true:false;
			// var param2 = record.get('param2').indexOf(value)>-1?true:false;
			// var param3 = record.get('param3').indexOf(value)>-1?true:false;
			// return notifyType || param1 || param2||param3;
			// });
			// me.hasSearch = true;
			// me.triggerEl.item(0).setDisplayed('block');
			// me.doComponentLayout();
		}
	},'-',{
		xtype:'tbtext',
		text:'过滤:'
	},{
		text: '全部类型',
		itemId:'nTypeFilter',
		menu: {
			defaults: {
				xtype: 'menucheckitem'
			},
			items:[ActionBase.getAction('allNTypeAc'),ActionBase.getAction('receiveFaxAc'),
			ActionBase.getAction('sentFaxAc'),ActionBase.getAction('adminMsgAc'),ActionBase.getAction('wfMsgAc'),ActionBase.getAction('trwrHisAc')]
		}
	},'-',{
		text: '全部时间',
		itemId:'timeFilter',
		menu: {
			defaults: {
				xtype: 'menucheckitem'
			},
			items: [ActionBase.getAction('allFilterMsgAcID'), ActionBase.getAction('todayFilterMsgAcID'),
			ActionBase.getAction('twodayFilterMsgAcID'), ActionBase.getAction('weekFilterMsgAcID'),
			ActionBase.getAction('monthFilterMsgAcID'), ActionBase.getAction('selfFilterMsgAcID')]
		}
	},'->',{
		text:'清空',
		handler: function() {
			newMesB.show({
				title:'清除确认',
				msg: '确定要清空所有消息吗？',
				buttons: Ext.MessageBox.YESNO,
				closable:false,
				fn: function(btn) {
					if (btn =="yes") {
						//调用接口取值
						var param= {
							sessiontoken :sessionToken
						}
						//调用
						WsCall.call('cleanmsghistory', param, function (response, opts) {
							Ext.StoreMgr.lookup('simpsonsStore').load();
						}, function (response, opts) {
							if(!errorProcess(response.code)) {
								Ext.Msg.alert('失败', response.msg);
							}
						}, true);
					}
				},
				icon: Ext.MessageBox.QUESTION
			});
		}
	}]
});

//历史消息Grid
Ext.define('ws.statusbar.msgHistoryGird', {
	alternateClassName: ['msgHistoryGird'],
	alias: 'widget.msgHistoryGird',
	extend: 'Ext.grid.Panel',
	store: Ext.StoreMgr.lookup('simpsonsStore'),
	viewConfig: {
		id:'gv',
		//trackOver:false,
		//stripeRows:false,
		plugins: {
			ptype: 'preview',
			bodyField:'notifyType',
			bodyFields:['param2','param3'],
			expanded:true,
			pluginId:'preview'
		}
	},
	columns: [{
		header: '通报时间',
		dataIndex: 'param1',
		flex:1,
		renderer: function(value) {
			return "<b>"+value+"</b>";
		}
	},{
		header: '通报类型',
		dataIndex: 'notifyType',
		flex:1,
		renderer: function(value) {
			return switchCNType(value);
		}
	}
	],
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);

		me.getStore().filterMap.removeAtKey('param1');
		me.getStore().filterMap.removeAtKey('notifyType');
		me.loadGrid();
		ActionBase.setTargetView('msgHistroyAction', me);
		me.getStore().getProxy().on('exception', function(proxy, response, operation) {
			var json = Ext.JSON.decode(response.responseText);
			var code = json.code;
			errorProcess(code);
			if(operation.action != 'read') {
				me.loadGrid();
			}
		});
	},
	loadGrid: function() {
		var me = this;
		var store = me.getStore();
		//		store.loadPage(1);
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
//		store.filterMap.each( function(key, value, length) {
//			if(filter.length == 0) {
//				filter = value;
//			} else {
//				filter = filter + ' and ' + value;
//			}
//		});

		store.getProxy().extraParams.filter = mapToFilterStr(false, store.filterMap);
		store.getProxy().extraParams.refresh = 1;
		//		store.currentPage = 1;
		store.loadPage(1);
		store.getProxy().extraParams.refresh = null;
	}
});

//历史消息窗口
function loadmsghistorywin() {
	return Ext.create('Ext.window.Window', {
		title: '历史消息',
		iconCls: 'historyMes',
		bodyPadding: 5,
		height: 400,
		width: 740,
		border: false,
		//bodyCls: 'panelFormBg',
		resizable: false,
		bodyBorder:false,
		layout: 'fit',
		defaults: {
			border:false
		},
		items: [{
			xtype:'msgHistoryGird'
		}],//window items
		dockedItems:[{
			dock:'top',
			xtype:'msghistroyTBar'
		},{
			dock:'bottom',
			xtype:'msghistroypaging',
			store :  Ext.StoreMgr.lookup('simpsonsStore'),
			listeners: {
				change: function() {
					var me = this;
					if (Ext.StoreMgr.lookup('simpsonsStore').getCount() ==0 ) {
						me.down("#next").setDisabled(true);
						me.down("#last").setDisabled(true);
					}
				}
			}
		}],
		listeners: {
			destroy: function () {
				msghistorywin = '';
			},
			show: function(win) {

			}
		}
	}).show();
}