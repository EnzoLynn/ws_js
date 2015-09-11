//创建一个工具栏设置文菜单
var outfax_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});

//创建一个上下文菜单
var out_RightMenu = Ext.create('Ext.menu.Menu', {
	listeners: {
		afterrender: function() {
			var me = this;
			//表单数据
			if(template) {
				if(!serverInfoDis && serverInfoModel.data.formData == 0) {				
					me.add('-');
					me.add(ActionBase.getAction('recTemplate'));
					me.add(ActionBase.getAction('changeTemplate'));
				}
			}
			var fistAdd = true;
			gridPlugin.outfaxPlugin.each( function(item,index,alls) {
				if(item.initialConfig.addType.indexOf('m') != -1) {
					if(fistAdd)
						me.add('-');
					fistAdd = false;
					me.add(item);
				}
			});
		}
	},
	items: [ActionBase.getAction('refreshoutfaxID'),{
		text:'查找',
		iconCls: 'infaxSelfFilter',
		tooltip: '自定义查找',
		menu:[ActionBase.getAction('outfaxSelfFilterID'),ActionBase.getAction('outfaxtSearchMenu')]
	},
	'-', ActionBase.getAction('modoutfaxcommID'),
	ActionBase.getAction('modInfoOutfID'),
	ActionBase.getAction('modPriID'),
	ActionBase.getAction('modflgoutfaxID'),
	'-', ActionBase.getAction('blockfaxID'),
	ActionBase.getAction('confaxID'),ActionBase.getAction('cancelfaxID'),
	'-', ActionBase.getAction('sendfaxbygrid'),'-',ActionBase.getAction('downloadoutfaxID')
	]
});
Ext.define('WS.outfax.Outfaxgrid', {
	alternateClassName: ['outfaxgrid'],
	alias: 'widget.outfaxgrid',
	extend: 'Ext.grid.Panel',
	//	title: '发件箱',
	store: 'outfaxstoreId',

	columnLines: true,
	multiSelect: true,
	viewConfig: {
		loadMask:false,
		loader: {
			target: 'outfaxgrid'
		},
		loadingText:'正在加载数据...'
	},
	//myselRendered:false,
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
		},
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			out_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		},
		beforestatesave: function(statefull,state,eOpts) {			
			Ext.Array.each(state.columns, function(it) {
				if(!it.width){
					Ext.Array.each(myStates.outfaxgridState.columns,function(odt){
						if(it.id == odt.id && odt.width){
							it.width = odt.width;
						}
					});					
				}
				if(!it.hidden && it.hidden != false){
					Ext.Array.each(myStates.outfaxgridState.columns,function(odt){
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
				
				//表单数据
				if(template) {
					if(!serverInfoDis && serverInfoModel.data.formData == 0) {					
						me.add('-');
						me.add(ActionBase.getAction('recTemplate'));
					} 
				}

				var fistAdd = true;
				gridPlugin.outfaxPlugin.each( function(item,index,alls) {
					if(item.initialConfig.addType.indexOf('t') != -1) {
						if(fistAdd)
							me.add('-');
						fistAdd = false;
						me.add(item);
					}
				});
				
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,outfax_tbtnSetMenu);
				
			}
		},
		items: [ActionBase.getAction('sendfaxbygrid'),'-',ActionBase.getAction('refreshoutfaxID')
		,{
			text:'查找',
			itemId:'outfaxserBtn',
			iconCls: 'infaxSelfFilter',
			tooltip: '自定义查找',
			menu:[ActionBase.getAction('outfaxSelfFilterID'),ActionBase.getAction('outfaxtSearchMenu')]
		},
		'-', ActionBase.getAction('modoutfaxcommID'),
		ActionBase.getAction('modInfoOutfID'),
		ActionBase.getAction('modPriID'),
		ActionBase.getAction('modflgoutfaxID'),
		'-', ActionBase.getAction('blockfaxID'),
		ActionBase.getAction('confaxID'),ActionBase.getAction('cancelfaxID'),
		'-', ActionBase.getAction('downloadoutfaxID')
		]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store : 'outfaxstoreId',
		listeners: {
			afterrender: function() {
				var me = this;
				//表单数据
				if(template) {
					if(!serverInfoDis && serverInfoModel.data.formData == 0) {						
						me.insert(15,'-');
						me.insert(16,ActionBase.getAction('changeTemplate'));
					} 
				}
			}
		},
		items: [{
			xtype:'tbtext',
			text:'过滤:'
		},{
			itemId: 'statusID',
			text: '全部状态',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allstatusID'),ActionBase.getAction('stsQueueConvertingID'),
				ActionBase.getAction('stsWaitingApprovalID'),ActionBase.getAction('stsConvertingID'),
				ActionBase.getAction('stsQueueSendID'),ActionBase.getAction('stsQueueblockingID'),
				ActionBase.getAction('stsInDeviceID'),ActionBase.getAction('stsDialingID'),
				ActionBase.getAction('stsSendingID')]
			}
		}, '-', {
			text: '选择',
			iconCls:'actionSelect',
			itemId: 'outfaxselID',
			menu: [ActionBase.getAction('allseloutfID'),ActionBase.getAction('otherseloutfID')]}
		]

	}],
	initComponent : function() {

		var me = this;
		var filter = '';
		me.callParent(arguments);

		
		ActionBase.setTargetView('outfax', me);
		ActionBase.updateActions('outfax', me.getSelectionModel().getSelection());
	},
	loadGrid: function(doSearch) {
		var me = this;
		//		me.show();
		var store = me.getStore();
		if(!doSearch) {
			modActionStates(me, false);
			store.getProxy().extraParams.tplsearch = '';
		}
		store.pageSize = userConfig.gridPageSize;
		//加载State
		if(myStates.outfaxgridFilter) {
			for (key in myStates.outfaxgridFilter) {
				if(!myStates.outfaxgridFilter[key] || key == 'stateSaved')
					continue;
				ActionBase.getAction(myStates.outfaxgridFilter[key]).execute(null,null,true);
			}
		}
		var filter = '';
		if(doSearch) {
			filter = store.filterMap.get('filter');
		}else {
			store.filterMap.each( function(key, value, length) {
				if(filter.length == 0) {
					filter = value;
				} else {
					filter = filter + ' and ' + value;
				}
			});
		}
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		store.getProxy().extraParams.filter = filter;
		store.getProxy().extraParams.refresh = 1;
		//		store.currentPage = 1;
		store.loadPage(1);
		store.getProxy().extraParams.refresh = null;
		store.filterMap.removeAtKey('filter');
		ActionBase.updateActions('outfax', me.getSelectionModel().getSelection());
	}
});