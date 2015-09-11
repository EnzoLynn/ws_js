//创建一个工具栏设置文菜单
var sucfax_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});

//创建一个上下文菜单
var suc_RightMenu = Ext.create('Ext.menu.Menu', {
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
			gridPlugin.succoutfaxPlugin.each( function(item,index,alls) {
				if(item.initialConfig.addType.indexOf('m') != -1) {
					if(fistAdd)
						me.add('-');
					fistAdd = false;
					me.add(item);
				}
			});
		}
	},
	items: [ActionBase.getAction('refreshsuccoutfaxID'),{
		text:'查找',
		iconCls: 'infaxSelfFilter',
		tooltip: '自定义查找',
		menu:[ ActionBase.getAction('succoutfaxSelfFilterID'),ActionBase.getAction('sucfaxtSearchMenu')]
	},
	'-', ActionBase.getAction('delsoutfaxID'), ActionBase.getAction('reStoreSoufID'),
	'-', ActionBase.getAction('modifycommentID'), ActionBase.getAction('modflgsuccfaxID'),
	'-',  ActionBase.getAction('resendID'),ActionBase.getAction('modifycoderesendID') ,'-',
	ActionBase.getAction('sendfaxbygrid'),ActionBase.getAction('sucfaxsubwf'),ActionBase.getAction('sucfaxColtDoc'),
	'-', ActionBase.getAction('downloadsuccoutfaxID'), ActionBase.getAction('expReportSucId')
	,ActionBase.getAction('sucRuleExecID')
	]
});
Ext.define('WS.succoutfax.Succoutfaxgrid', {
	alternateClassName: ['succoutfaxgrid'],
	alias: 'widget.succoutfaxgrid',
	extend: 'Ext.grid.Panel',
	//	title: '已发件箱',
	store: 'succoutfaxstoreId',
	columnLines: true,
	multiSelect: true,
	viewConfig: {
		loader: {
			target: 'succoutfaxgrid'
		},
		loadingText:'正在加载数据...',
		plugins: {
			ddGroup: 'FileDDGp',
			ptype: 'gridviewdragdrop',
			dragText: '选中了 {0} 条记录',
			enableDrop: false
		}
	},
	//myselRendered:false,
	features: [{
		ftype: 'grouping',
		groupHeaderTpl: '{columnName}: {name} ({rows.length})'+'项',
		disabled: true,
		groupByText:'按当前列分组',
		showGroupsText:'显示分组'
	}],
	listeners: {
		itemclick: function(grid,record,hitem,index,e,opts) {
			if(!e.ctrlKey && !e.shiftKey) {
				var sm = grid.getSelectionModel();
				sm.deselectAll(true);
				sm.select(record,true,false);
			}
		},
		itemdblclick: function(grid,record,hitem,index,e,opts) {
			if(seefillfaxwin == ''){
				seefillfaxwin = seeFillFaxNew(record);
			}else{
				seefillfaxwin = seeFillFaxNew(record,seefillfaxwin);
			}
			seefillfaxwin.show();
		},
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			suc_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		},
		beforestatesave: function(statefull,state,eOpts) {
			Ext.Array.each(state.columns, function(it) {
				if(!it.width) {
					Ext.Array.each(myStates.succoutfaxgridState.columns, function(odt) {
						if(it.id == odt.id && odt.width) {
							it.width = odt.width;
						}
					});
				}
				if(!it.hidden && it.hidden != false) {
					Ext.Array.each(myStates.succoutfaxgridState.columns, function(odt) {
						if(it.id == odt.id && odt.hidden) {
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
				gridPlugin.succoutfaxPlugin.each( function(item,index,alls) {
					if(item.initialConfig.addType.indexOf('t') != -1) {
						if(fistAdd)
							me.add('-');
						fistAdd = false;
						me.add(item);
					}
				});
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,sucfax_tbtnSetMenu);
			}
		},
		items: [ActionBase.getAction('sendfaxbygrid'),ActionBase.getAction('sucfaxsubwf'),ActionBase.getAction('sucfaxColtDoc'),'-',ActionBase.getAction('refreshsuccoutfaxID')
		,{
			text:'查找',
			itemId:'infaxserBtn',
			iconCls: 'infaxSelfFilter',
			tooltip: '自定义查找',
			menu:[ ActionBase.getAction('succoutfaxSelfFilterID'),ActionBase.getAction('sucfaxtSearchMenu')]
		},
		'-', ActionBase.getAction('delsoutfaxID'), ActionBase.getAction('reStoreSoufID'),
		'-', ActionBase.getAction('modifycommentID'), ActionBase.getAction('modflgsuccfaxID'),
		'-',  ActionBase.getAction('resendID'),ActionBase.getAction('modifycoderesendID'),
		'-', ActionBase.getAction('downloadsuccoutfaxID'), ActionBase.getAction('expReportSucId')
		,ActionBase.getAction('sucRuleExecID')
		]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store : 'succoutfaxstoreId',
		listeners: {
			afterrender: function() {
				var me = this;
				//表单数据
				if(template) {
					if(!serverInfoDis && serverInfoModel.data.formData == 0) {						
						me.insert(21,'-');
						me.insert(22,ActionBase.getAction('changeTemplate'));
					} 
				}
			}
		},
		items: [{
			xtype:'tbtext',
			text:'过滤:'
		},{
			itemId: 'suctimeID',
			iconCls:'actionTime',
			text: '全部时间',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allFilterActionSuccoutfaxID'), ActionBase.getAction('todayFilterActionSuccoutfaxID'),
				ActionBase.getAction('twodayFilterActionSuccoutfaxID'), ActionBase.getAction('weekFilterActionSuccoutfaxID'),
				ActionBase.getAction('monthFilterActionSuccoutfaxID'), ActionBase.getAction('selfFilterActionSuccoutfaxID')]
			}
		}, '-',{
			itemId: 'sucstatusID',
			text: '全部状态',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[
				ActionBase.getAction('allStatusSuccoutfaxID'), ActionBase.getAction('stsFinishedFailedID'),
				ActionBase.getAction('stsFinishedOKID')
				]
			}
		}, '-',{
			itemId: 'sucfaxFlagID',
			text: '全部标签',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allFaxFlagActionSuccID'), ActionBase.getAction('noFaxFlagActionSucc'),
				ActionBase.getAction('oneFaxFlagActionSucc'), ActionBase.getAction('twoFaxFlagActionSucc'),
				ActionBase.getAction('threeFaxFlagActionSucc'), ActionBase.getAction('fourFaxFlagActionSucc'),
				ActionBase.getAction('fiveFaxFlagActionSucc'), ActionBase.getAction('sixFaxFlagActionSucc'),
				ActionBase.getAction('sevenFaxFlagActionSucc'), ActionBase.getAction('eightFaxFlagActionSucc'),
				ActionBase.getAction('nineFaxFlagActionSucc'), ActionBase.getAction('tenFaxFlagActionSucc'),
				ActionBase.getAction('elFaxFlagActionSucc')]
			}
		}, '-',{
			text: '全部类型',
			itemId: 'sucfaxTypeID',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allSuccfaxTypeID'),ActionBase.getAction('innerSuccfaxTypeID'),
				ActionBase.getAction('outSuccfaxTypeID')
				]
			}
		}, '-',{
			text: '选择',
			iconCls:'actionSelect',
			itemId: 'selID',
			menu: [ActionBase.getAction('allselsufID'),ActionBase.getAction('otherselsufID')
			]
		}
		// , '-',{
		// text: '按发送日期分组',
		// enableToggle: true,
		// toggleHandler: function(btn, pressed) {
		// var me = this;
		// //                	var container = viewPortEast.down('#centerCenterView');
		// //            		var butt = container.down('pagingtoolbar');
		// var grid = currGrid;
		// var store = Ext.StoreMgr.lookup('succoutfaxstoreId');
		// store.group('sentDate');
		// if(pressed) {
		// grid.features[0].enable();
		// } else {
		// grid.features[0].disable();
		// }
		//
		// }
		// }
		]

	}],
	initComponent : function() {
		var me = this;
		me.callParent(arguments);

		ActionBase.setTargetView('succoutfax', me);
		ActionBase.updateActions('succoutfax', me.getSelectionModel().getSelection());
	},
	loadGrid: function(doSearch,suppressStates) {
		var me = this;
		me.show();
		var store = me.getStore();
		if(!doSearch) {
			modActionStates(me, false);
			//store.filterMap.removeAtKey('filter');
			store.getProxy().extraParams.tplsearch = '';
		}
		store.pageSize = userConfig.gridPageSize;
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		if(!suppressStates) {
			//加载State
			if(myStates.succoutfaxgridFilter) {
				for (key in myStates.succoutfaxgridFilter) {
					if( !myStates.succoutfaxgridFilter[key] || key == 'stateSaved')
						continue;
					ActionBase.getAction(myStates.succoutfaxgridFilter[key]).execute(null,null,true);

				}
			}
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

		store.getProxy().extraParams.filter = filter;
		store.getProxy().extraParams.refresh = 1;
		if(ruleSettingFlag && store.getProxy().extraParams.folderid != 'gryhsz') {
			//进行规则处理传真
			executeRuleProcess(me, function() {
				store.loadPage(1);
				store.getProxy().extraParams.refresh = null;
				store.filterMap.removeAtKey('filter');
				ActionBase.updateActions('succoutfax', me.getSelectionModel().getSelection());
			});
		}else {
				store.loadPage(1);
				store.getProxy().extraParams.refresh = null;
				store.filterMap.removeAtKey('filter');
				ActionBase.updateActions('succoutfax', me.getSelectionModel().getSelection());
		}
	}
});