//传真用户、共享目录共用model
Ext.define('WS.user.userdicModel', {
	extend: 'Ext.data.Model',
	idProperty: 'udID',
	alternateClassName: ['userdicModel'],
	fields: [{
		name: 'udID',//编号
		type: 'string'
	},{
		name: 'udName',//帐户名或目录名称
		type: 'string'
	},{
		name: 'dtmf',//路由分机
		type: 'string'
	},{
		name:'udType',
		type:'string'//来源类型 user(dic)
	}
	]
});
//传真用户、共享目录共用Store
Ext.create('Ext.data.Store', {
	storeId: 'userdicStore',
	model: 'WS.user.userdicModel'
});

//传真用户、共享目录共用 Grid
Ext.define('WS.user.userdicTarget', {
	alternateClassName: ['userdicTarget'],
	alias: 'widget.userdicTarget',
	extend: 'Ext.grid.Panel',
	title: '帐户名(共享文件夹)',
	frameHeader: false,
	store: 'userdicStore',
	columnLines: true,
	multiSelect: true,
	columns : [{
		text: '帐户名(共享文件夹)',
		dataIndex: 'udName',
		flex: 1,
		renderer: function(value, metaData, record) {
			if(record.data.udType == 'user') {				
				return "<div><img src='resources/images/pub/userStatus.png' style='margin-bottom: -5px;'>&nbsp;" + value +'</div>';				
			} else {
				return "<div><img src='resources/images/tree/folder.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';
			}

		}
	},{
		header: '路由分机',
		dataIndex: 'dtmf',
		flex: 0.4
	}]
});

//传真用户表
Ext.define('WS.user.Usermodel', {
	extend: 'Ext.data.Model',
	idProperty: 'userID',
	alternateClassName: ['Usermodel'],
	fields: [{
		name: 'userID',
		type: 'string'
	},{
		name: 'userName',
		type: 'string'
	},{
		name: 'gender',
		type: 'string'
	},{
		name: 'accountName',
		type: 'string'
	},{
		name: 'dtmf',
		type: 'string'
	}

	]
});

var userStore = Ext.create('Ext.data.Store', {
	model: 'WS.user.Usermodel',
	pageSize:1000,
	storeId: 'userStoreID',
	autoLoad: false,
	remoteSort: false,     //排序通过查询数据库
	sorters: [{
		property: 'accountName',
		direction: 'ASC',
		sorterFn: function(o1, o2) {
			return o1.data.accountName.localeCompare(o2.data.accountName);
		}
	}],
	autoSync: false,
	proxy: {
		type: 'ajax',
		//		url: 'WS/address/Address.json',
		api: {
			create  : WsConf.Url + '?action=create',
			read    : WsConf.Url + '?action=read',
			update  : WsConf.Url + '?action=update',
			destroy : WsConf.Url + '?action=destroy'
		},
		filterParam: 'filter',
		sortParam:'sort',
		directionParam:'dir',
		simpleSortMode: true,		//单一字段排序
		extraParams: {
			req:'dataset',
			dataname: 'user',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			sessiontoken: '',
			isChinese: '',				//'1' 中文，  '0 ' 英文
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
function selfSort(sorters, direction, where,  doSort) {
	if (Ext.isArray(sorters) && sorters.length > 0) {
		sorters[0].sorterFn = function(o1, o2) {
			return o1.data[sorters[0].property]
			.localeCompare(o2.data[sorters[0].property]);
		}
	} else if (Ext.isObject(sorters)) {
		sorters.sorterFn = function(o1, o2) {
			return o1.data[sorters.property]
			.localeCompare(o2.data[sorters.property]);
		}
	}
	return this.sortOld(sorters,direction,where,doSort);
}

userStore.sortOld = userStore.sort;
userStore.sort = selfSort;
// var secondGridStore = Ext.create('Ext.data.Store', {
	// model: 'WS.user.Usermodel'
// });
// secondGridStore.sortOld = secondGridStore.sort;
// secondGridStore.sort = selfSort;

//base
Ext.define('WS.user.UGBase', {
	extend: 'Ext.grid.Panel',
	columnLines: true,
	multiSelect: true,
	columns : [{
		header: '帐户名',
		dataIndex: 'accountName',
		flex: 1,
		renderer: function(value, metaData, record) {
			var userName = record.data.userName;
			if(userName.length > 0) {
				if(userName == '' || userName.length == 0){
					return "<div><img src='resources/images/pub/userStatus.png' style='margin-bottom: -5px;'>&nbsp;" + value+ '</div>';
				}
				return "<div><img src='resources/images/pub/userStatus.png' style='margin-bottom: -5px;'>&nbsp;" + value +'('+userName+')'+ '</div>';
			} else {
				return "<div><img src='resources/images/pub/userStatus.png' style='margin-bottom: -5px;'>&nbsp;" + value+ '</div>';
			}
		}
	},{
		header: '路由分机',
		dataIndex: 'dtmf',
		flex: 0.4
	}
	]
});


Ext.define('WS.user.UsergridAction', {
	extend: 'WS.action.Base',
	category: 'UsergridAction'
});

Ext.create('WS.user.UsergridAction', {
	text: '全选/取消',
	itemId: 'allselectUserDirID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		for (var i=0; i<currentPanel.getStore().getCount(); i++) {
			if(!sm.isSelected(i)) {
				sm.selectAll(true);
				return;
			} else {
				sm.deselect(i, true);
			}
		}

	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.user.UsergridAction', {
	text: '反选',
	itemId: 'otherselectUserDirID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		for (var i=0; i<currentPanel.getStore().getCount(); i++) {
			if(sm.isSelected(i)) {
				sm.deselect(i, true);
			} else {
				sm.select(i, true);
			}
		}

	},
	updateStatus: function(selection) {

	}
});


Ext.define('WS.user.Usergrid', {
	alternateClassName: ['Usergrid'],
	alias: 'widget.usergrid',
	extend: 'WS.user.UGBase',
	title: 'Wavefax' +'内部用户',
	store: 'userStoreID',
	viewConfig: {
		loadingText:'正在加载数据...'		
	},
	dockedItems: [{
		xtype: 'pagingtoolbar',
		itemId: 'pagingtoolbarID',
		store: 'userStoreID',
		dock: 'bottom',
		displayInfo: true,
		displayMsg: '第 {0} 到 {1} 条，共 {2} 条',
		emptyMsg: "没有记录",
		beforePageText: '页数',
		afterPageText: '共 {0}',
		items:[{
			text: '选择',
			iconCls:'actionSelect',
			itemId: 'selID',
			menu: [ActionBase.getAction('allselectUserDirID'),ActionBase.getAction('otherselectUserDirID')]
		}]
	},{
		dock: 'bottom',
		xtype : 'toolbar',
		items:[{
			fieldLabel: '快速查找',
			labelAlign: 'right',
			labelPad: 15,
			width: 440,
			colspan:3,
			labelWidth: 80,
			xtype: 'searchfield',
			itemId: 'serFielID',
			onTrigger2Click : function() {
				var me = this,
				store = me.store,
				proxy = store.getProxy(),
				value = me.getValue();

				if (value.length < 1) {
					me.onTrigger1Click();
					return;
				}
				proxy.extraParams[me.paramName] = "upper("+tplPrefix +"accountName) like '%" + value.toUpperCase() + "%'";
				proxy.extraParams.start = 0;
				proxy.extraParams.refresh = 1;
				store.load();
				proxy.extraParams.refresh = null;
				me.hasSearch = true;
				me.triggerEl.item(0).up('td').setWidth(17);
				me.triggerEl.item(0).setDisplayed('block');
				me.doComponentLayout();
			}
		}]

	}],
	listeners: {
		itemclick: function(grid,record,hitem,index,e,opts) {
			if(!e.ctrlKey && !e.shiftKey) {
				var sm = grid.getSelectionModel();
				sm.deselectAll(true);
				sm.select(record,true,false);
			}
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		}
	},
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);
		ActionBase.setTargetView('UsergridAction', me);
		
		if(me.down('#serFielID')) {
			me.down('#serFielID').store = me.getStore();		//让searchfield的store不依赖于变量
		}

		me.getStore().getProxy().on('exception', function(proxy, response, operation) {
			var json = Ext.JSON.decode(response.responseText);
			var code = json.code;
			if(operation.action == "update" || operation.action == "destroy") {
				me.loadGrid(filter);		//
			}
			errorProcess(code);
			//根据operation 处理
		});
	},
	loadGrid: function(doSearch,suppressStates) {
		var me = this;
		var store = me.getStore();
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		var filter = '';

		store.getProxy().extraParams.filter = filter;
		store.getProxy().extraParams.refresh = 1;		
		store.load();
		store.getProxy().extraParams.refresh = null;
	}
});



// Ext.define('WS.user.UsergridTarget', {
	// alternateClassName: ['UsergridTarget'],
	// alias: 'widget.UsergridTarget',
	// extend: 'WS.user.UGBase',
	// title: '内部传真收件人',
	// store: secondGridStore
// });
