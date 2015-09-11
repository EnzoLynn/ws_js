Ext.define('WS.address.Addressmodel', {
	extend: 'Ext.data.Model',
	idProperty: 'phoneBookID',
	alternateClassName: ['Addressmodel'],
	fields: [{
		name: 'dispName',
		type: 'string'
	},{
		name: 'phoneBookID',
		type: 'string'
	},{
		name: 'gender',
		type: 'string'
	},{
		name: 'organization',
		type: 'string'
	},{
		name: 'state',
		type: 'string'
	},{
		name: 'city',
		type: 'string'
	},{
		name: 'address',
		type: 'string'
	},{
		name: 'countryCode',
		type: 'string'
	},{
		name: 'faxNumber',
		type: 'string'
	},{
		name: 'faxNumberExt',
		type: 'string'
	},{
		name: 'phoneNumber',
		type: 'string'
	},{
		name: 'mobileNumber',
		type: 'string'
	},{
		name: 'email',
		type: 'string'
	},{
		name: 'firstName',
		type: 'string'
	},{
		name: 'lastName',
		type: 'string'
	},{
		name: 'title',
		type: 'string'
	},{
		name: 'department',
		type: 'string'
	},{
		name: 'country',
		type: 'string'
	},{
		name: 'zipCode',
		type: 'string'
	},{
		name: 'web',
		type: 'string'
	},{
		name: 'IMNumber',
		type: 'string'
	},{
		name: 'comment',
		type: 'string'
	},{
		name: 'phoneNumberExt',
		type: 'string'
	},{
		name: 'spareFaxNumber',
		type: 'string'
	}

	]
});
var searchStore;
function createSAddressStroe() {
	Ext.StoreMgr.removeAtKey ('addressId');
	var tmPty = 'phoneBookID',tmDre = 'DESC';

	if(myStates && myStates.addressgridState.sort && myStates.addressgridState.sort.property) {
		tmPty = myStates.addressgridState.sort.property;
	}
	if(myStates &&myStates.addressgridState.sort && myStates.addressgridState.sort.direction) {
		tmDre = myStates.addressgridState.sort.direction;
	}
	searchStore = Ext.create('Ext.data.Store', {
		model: 'WS.address.Addressmodel',
		storeId: 'addressId',
		pageSize: userConfig.gridPageSize,
		autoLoad: false,
		remoteSort: true,     //排序通过查询数据库
		sorters: [{
			property: tmPty,
			direction: tmDre
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
			limitParam:'limit',
			startParam:'start',
			simpleSortMode: true,		//单一字段排序
			extraParams: {
				req:'dataset',
				dataname: 'address',             //dataset名称，根据实际情况设置,数据库名
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
			actionMethods: 'POST',
			listeners: {
				exception: function(proxy, response, operation) {
					var json = Ext.JSON.decode(response.responseText);
					var code = json.code;
					errorProcess(code);
					if(operation.action != 'read') {
						addressGird.loadGrid();
					}
				}
			}
		},
		listeners: {
			load: function(store, records, suc,operation,opts) {
				if(loadDefaultPng) {
					loadDefaultPng();
				}

				if(addressGird && addressGird.down("#pagingtoolbarID")) {
					var total = addressGird.down("#pagingtoolbarID").getPageData().total;
					if (total == '0') {
						//alert(records.length);
						addressGird.down("#next").setDisabled(true);
						addressGird.down("#last").setDisabled(true);
					}
				}

				if(suc) {
					if(addressGird && addressTree1) {
						addressTree1.updateMenu(addressGird);
					}
				} else {
					store.loadData([]);
				}
			}
		}
	});
}

//创建一个工具栏设置文菜单
var addr_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});

//创建一个上下文菜单
var addr_RightMenu = Ext.create('Ext.menu.Menu', {
	listeners: {
		afterrender: function() {
			var me = this;
			var fistAdd = true;
			gridPlugin.addressPlugin.each( function(item,index,alls) {
				if(item.initialConfig.addType.indexOf('m') != -1) {
					if(fistAdd)
						me.add('-');
					fistAdd = false;
					me.add(item);
				}
			});
		}
	},
	items: [ActionBase.getAction('refreshaddrID'), ActionBase.getAction('findaddrID'),
	ActionBase.getAction('delAddressID'), ActionBase.getAction('createaddrID'),
	ActionBase.getAction('modifyAddressID'),
	ActionBase.getAction('sendfaxaddrID'),
	ActionBase.getAction('importAddrId'),
	ActionBase.getAction('expReportAddrId')]
});

Ext.define('WS.address.Addressgrid', {
	alternateClassName: ['Addressgrid'],
	alias: 'widget.addressgrid',
	extend: 'Ext.grid.Panel',
	//title: '通讯录',

	store: 'addressId',
	columnLines: true,
	multiSelect: true,
	viewConfig: {
		loadingText:'正在加载数据...',
		plugins: {
			ddGroup: 'FileDDGp1',
			ptype: 'gridviewdragdrop',
			dragText: '选中了 {0} 条记录',
			enableDrop: false
		}
	},
	listeners: {
		selectionchange: function(me, selections, op) {
			ActionBase.updateActions('address', selections);
		},
		itemclick: function(grid,record,hitem,index,e,opts) {
			if(!e.ctrlKey && !e.shiftKey) {
				var sm = grid.getSelectionModel();
				sm.deselectAll(true);
				sm.select(record,true,false);
			}
		},
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			addr_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		}
	},

	columns : [{
		header: '显示名',
		dataIndex: 'dispName',
		width:120,
		renderer: function(value, metaData, record) {
			return "<div><img src='resources/images/grid/pbrecord.png' style='margin-bottom: -5px;'>&nbsp;" + updateAddressRec(value, metaData, record) + '</div>';
		}
	},{
		header: '性别',
		dataIndex: 'gender',
		width:50,
		renderer: function(value, metaData, record) {
			if(value == '0') {
				return updateAddressRec('男', metaData, record);
			} else {
				return updateAddressRec('女', metaData, record);
			}
		}
	},{
		header: '组织',
		dataIndex: 'organization',
		width: 100,
		renderer:updateAddressRec
	},{
		header: '省/州',
		dataIndex: 'state',
		width: 70,
		renderer:updateAddressRec
	},{
		header: '市/区',
		dataIndex: 'city',
		width: 70,
		renderer:updateAddressRec
	},{
		header: '地址',
		dataIndex: 'address',
		width: 200,
		renderer:updateAddressRec
	},{
		header: '国家代码',
		dataIndex: 'countryCode',
		width: 120,
		renderer:updateAddressRec
	},{
		header: '传真号码',
		dataIndex: 'faxNumber',
		width: 120,
		renderer:updateAddressRec
	},{
		header: '传真分机',
		dataIndex: 'faxNumberExt',
		width: 120,
		renderer:updateAddressRec
	},{
		header: '电话号码',
		dataIndex: 'phoneNumber',
		width: 120,
		renderer:updateAddressRec
	},{
		header: '手机号码',
		dataIndex: 'mobileNumber',
		width: 120,
		renderer:updateAddressRec
	},{
		header: 'Email',
		dataIndex: 'email',
		width: 150,
		renderer:updateAddressRec
	},{
		header: '名',
		dataIndex: 'firstName',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '姓',
		dataIndex: 'lastName',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '职位',
		dataIndex: 'title',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '部门',
		dataIndex: 'department',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '国家',
		dataIndex: 'country',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '邮政编码',
		dataIndex: 'zipCode',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '个人网址',
		dataIndex: 'web',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '即时通讯号码',
		dataIndex: 'IMNumber',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '注释',
		dataIndex: 'comment',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '电话号码分机',
		dataIndex: 'phoneNumberExt',
		width: 80,
		hidden: true,
		renderer:updateAddressRec
	},{
		header: '客户编号',
		dataIndex: 'spareFaxNumber',
		width: 100,
		renderer:updateAddressRec
	}

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
				gridPlugin.addressPlugin.each( function(item,index,alls) {
					if(item.initialConfig.addType.indexOf('t') != -1) {
						if(fistAdd)
							me.add('-');
						fistAdd = false;
						me.add(item);
					}
				});
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,addr_tbtnSetMenu);
			}
		},
		items: [ActionBase.getAction('refreshaddrID'), '-',ActionBase.getAction('findaddrID'),
		'-', ActionBase.getAction('delAddressID'), '-', ActionBase.getAction('createaddrID'),
		'-', ActionBase.getAction('modifyAddressID'),
		'-', ActionBase.getAction('sendfaxaddrID'),
		'-', ActionBase.getAction('importAddrId'),
		'-', ActionBase.getAction('expReportAddrId'),
		'->',{
			fieldLabel: '按显示名查找',
			text:'按显示名查找',//用于控制工具栏使用
			width: 300,
			labelAlign:'right',
			labelWidth: 80,
			xtype: 'searchfield',
			//store: searchStore,
			itemId: 'serFielID',
			listeners: {
				render: function() {
					var me = this;
					me.store =currGrid.getStore();
				}
			}
		}
		]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store : 'addressId',
		items:[ActionBase.getAction('allselectAddrID'),ActionBase.getAction('otherselectAddrID')]		
	}],
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);

		if(me.itemId == 'addressgrid') {
			ActionBase.setTargetView('address', me);
			ActionBase.updateActions('address', me.getSelectionModel().getSelection());
		}

	},
	loadGrid: function(doSearch,suppressStates,filter) {

		var me = this;
		var store = me.getStore();
		var filStr = '';
		if(!doSearch) {
			store.getProxy().extraParams.folderFlag = '';
		}
		store.pageSize = userConfig.gridPageSize;
		var sessiontoken = store.getProxy().extraParams.sessiontoken = sessionToken;
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		if(filter) {
			filStr = filter;
		}
		store.getProxy().extraParams.filter = filStr;
		store.getProxy().extraParams.refresh = 1;
		//		store.currentPage = 1;

		store.loadPage(1);

		store.getProxy().extraParams.refresh = null;
		store.getProxy().extraParams.filter = '';
		if(me.itemId == 'addressgrid') {
			ActionBase.updateActions('address', []);
		}
	}
});