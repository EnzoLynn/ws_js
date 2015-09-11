//创建model
function createWfRulegridModel() {
	var tmpArr = new Array();
	ruleInfo.ruleModelMap.each(function(item,index,alls) {
		tmpArr.push(item);
	});
	Ext.define('WS.workflow.wfRuleGridmodel', {
		extend: 'Ext.data.Model',
		idProperty: 'workflowRuleID',
		alternateClassName: ['wfRuleGridmodel'],
		fields: tmpArr
	});	
}




function createWfRuleGridStore() {
	Ext.StoreMgr.removeAtKey ('wfRuleGridStore');
	var tmPty = 'workflowRuleID',tmDre = 'DESC';

	if(myStates.wfrulegridState.sort && myStates.wfrulegridState.sort.property) {
		tmPty = myStates.wfrulegridState.sort.property;
	}
	if(myStates.wfrulegridState.sort && myStates.wfrulegridState.sort.direction) {
		tmDre = myStates.wfrulegridState.sort.direction;
	}
	Ext.create('Ext.data.Store', {
		model: 'WS.workflow.wfRuleGridmodel',
		storeId: 'wfRuleGridStore',
		filterMap: Ext.create('Ext.util.HashMap'),
		pageSize: 1000,
		autoLoad: false,
		remoteSort: true,     //排序通过查询数据库
		sorters: [{
			property: tmPty,
			direction: tmDre
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
				dataname: 'wfrulegrid',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
				folderid: 0,
				refresh: null,
				template:''//当前模版
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
						taskGrid.loadGrid();
					}
				}
			}
		},
		listeners: {
			load: function(store, records, suc,operation,opts) {
				loadDefaultPng();
				var total = wfruleGrid.down("#pagingtoolbarID").getPageData().total;
				if (total == '0') {
					wfruleGrid.down("#next").setDisabled(true);
					wfruleGrid.down("#last").setDisabled(true);
				}
			}
		}

	});

	//刷新paging
	if(wfruleGrid) {
		wfruleGrid.down('#pagingtoolbarID').bindStore(Ext.StoreMgr.lookup ('wfRuleGridStore'));
	}

}



Ext.define('WS.workflow.WfRuleGridAction', {
	extend: 'WS.action.Base',
	category: 'WfRuleGridAc'
});

Ext.create('WS.workflow.WfRuleGridAction', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshICON',
	itemId: 'refreshrulegrid',
	handler: function() {
		var panel = this.getTargetView();
		var store = panel.getStore();
		store.filterMap.removeAtKey('filter');
		store.getProxy().extraParams.folderFlag = '';	//将忽略folderid移除
		panel.loadGrid();
		var treeSeles = wfTree.getSelectionModel().getSelection();
		
		panel.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
		
	},
	updateStatus: function(selection) {
	}
});
//启动工作流
Ext.create('WS.workflow.WfRuleGridAction', {
	text: '启动工作流',
	tooltip: '启动工作流',
	itemId: 'starwfrulegrid',
	iconCls: 'wftask',
	handler: function() {
		var panel = this.getTargetView();
		var sels = panel.getSelectionModel().getSelection();
		//先选择传真文件
		//submitwfwin = loadsubmitwfwin(sels[0]);
		//submitwfwin.show();
	},
	updateStatus: function(selection) {		
		this.setDisabled(selection.length == 0);
	}
});
//创建一个工具栏设置文菜单
var wfrulegrid_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});

//创建一个上下文菜单
var wfrulegrid_RightMenu = Ext.create('Ext.menu.Menu', {
	listeners: {
		afterrender: function() {
			var me = this;		
		}
	},
	items: [ActionBase.getAction('starwfrulegrid'),ActionBase.getAction('refreshrulegrid')]
});

Ext.define('WS.workflow.WfRuleGrid', {
	alternateClassName: ['WfRuleGrid'],
	alias: 'widget.wfrulegrid',
	extend: 'Ext.grid.Panel',
	store: 'wfRuleGridStore',
	columnLines: true,
	multiSelect: true,
	features: [{
		ftype: 'grouping',
		groupHeaderTpl: '{columnName}: {name} ({rows.length})'+'项',
		disabled: true,
		groupByText:'按当前列分组',
		showGroupsText:'显示分组'
	}],
	viewConfig: {
		loadingText:'正在加载数据...'
	},
	listeners: {
		selectionchange: function(me, selections, op) {
			ActionBase.updateActions('WfRuleGridAc', selections);
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
			wfrulegrid_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		},
		beforestatesave: function(statefull,state,eOpts) {			
			Ext.Array.each(state.columns, function(it) {
				if(!it.width){
					Ext.Array.each(myStates.wfrulegridState.columns,function(odt){
						if(it.id == odt.id && odt.width){
							it.width = odt.width;
						}
					});					
				}
				if(!it.hidden && it.hidden != false){
					Ext.Array.each(myStates.wfrulegridState.columns,function(odt){
						if(it.id == odt.id && odt.hidden){							
							it.hidden = odt.hidden;
						}
					});					
				}
				
			});			
		}
	},
	columns : [],
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
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,addr_tbtnSetMenu);
			}
		},
		items: [ActionBase.getAction('starwfrulegrid'),ActionBase.getAction('refreshrulegrid')]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store : 'wfRuleGridStore'
	}],
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);		
		
		ActionBase.setTargetView('WfRuleGridAc', me);
		ActionBase.updateActions('WfRuleGridAc', me.getSelectionModel().getSelection());
	},
	loadGrid: function(doSearch,suppressStates,filter) {
		setReadFlagTask.cancel();
		var me = this;
		var store = me.getStore();
		if(!doSearch) {
			modActionStates(me, false);
			store.getProxy().extraParams.folderFlag = '';
			store.getProxy().extraParams.tplsearch = '';
			//store.filterMap.removeAtKey('filter');
		}
		store.pageSize = userConfig.gridPageSize;
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}		

		var filter = '';
		if(doSearch) {
			filter = store.filterMap.get('filter');
		} else {
			store.filterMap.each( function(key, value, length) {
				if(filter.length == 0) {
					filter = value;
				} else {
					filter = filter + ' and ' + value;
				}
			});
		}
		//设置node text 为记录总数
		store.getProxy().extraParams.filter = filter;

		store.getProxy().extraParams.refresh = 1;
		//		store.currentPage = 1;
		store.loadPage(1);
		store.getProxy().extraParams.refresh = null;
		store.filterMap.removeAtKey('filter');

		ActionBase.updateActions('WfRuleGridAc', me.getSelectionModel().getSelection());
	}
});