//创建一个工具栏设置文菜单
var docgrid_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});
//创建一个上下文菜单
var docgrid_RightMenu = Ext.create('Ext.menu.Menu', {
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
			gridPlugin.docgridPlugin.each( function(item,index,alls) {
				if(item.initialConfig.addType.indexOf('m') != -1) {
					if(fistAdd)
						me.add('-');
					fistAdd = false;
					me.add(item);
				}
			});
		}
	},
	items: [ActionBase.getAction('refreshdocgrid')
	,{
		text:'查找',
		itemId:'infaxserBtn',
		iconCls: 'infaxSelfFilter',
		tooltip: '自定义查找',
		menu:[ActionBase.getAction('docgridSelfFilterID'),ActionBase.getAction('docgridtSearchMenu')]
	},
	'-', ActionBase.getAction('delinfaxdocgrid'), ActionBase.getAction('reStoredocgrid'),
	'-',ActionBase.getAction('docgridtCreateDocTiff'),ActionBase.getAction('docsubwf'),
	ActionBase.getAction('docopenac'),{
		itemId: 'forwardID',
		text: '转发',
		tooltip: '转发到邮件或传真',
		iconCls: 'resendfax',
		menu: [ActionBase.getAction('resenddocgrid'),ActionBase.getAction('resendemailDocID') ]
	},'-', ActionBase.getAction('docgridModCaller'),ActionBase.getAction('modifydocgridcommentID'),{
		itemId: 'singID',
		text: '标记',
		tooltip: '修改标签或阅读标志',
		iconCls: 'readICON',
		menu: [ActionBase.getAction('modflgdocgrid'), ActionBase.getAction('readdocgrid'), ActionBase.getAction('noreaddocgrid')]
	},
	'-', ActionBase.getAction('downloadfaxdocgrid'),ActionBase.getAction('docgridExpReport')
	]
});
Ext.define('WS.docmanager.docgrid', {
	alternateClassName: ['docgrid'],
	alias: 'widget.docgrid',
	extend: 'Ext.grid.Panel',
	//	title: '文档管理',
	store: 'docgridstoreId',
	//itemId: 'docGridID',
	columnLines: true,
	multiSelect: true,
	//anchor: '100% 100%',
	//autoScroll:true,
	//myselRendered:false,
	features: [{
		ftype: 'grouping',
		groupHeaderTpl: '{columnName}: {name} ({rows.length})'+'项',
		disabled: true,
		groupByText:'按当前列分组',
		showGroupsText:'显示分组'
	}],

	viewConfig: {
		loader: {
			target: 'docgrid'
		},
		loadingText:'正在加载数据...',
		plugins: {
			ddGroup: 'FileDDGp2',
			ptype: 'gridviewdragdrop',
			dragText: '选中了 {0} 条记录',
			enableDrop: false
		}
	},
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
			//seeFillFax();
		},
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			docgrid_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		},
		beforestatesave: function(statefull,state,eOpts) {
			Ext.Array.each(state.columns, function(it) {
				if(!it.width) {
					Ext.Array.each(myStates.docgridState.columns, function(odt) {
						if(it.id == odt.id && odt.width) {
							it.width = odt.width;
						}
					});
				}
				if(!it.hidden && it.hidden != false) {
					Ext.Array.each(myStates.docgridState.columns, function(odt) {
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

				//加载插件
				var fistAdd = true;
				gridPlugin.docgridPlugin.each( function(item,index,alls) {
					if(item.initialConfig.addType.indexOf('t') != -1) {
						if(fistAdd)
							me.add('-');
						fistAdd = false;
						me.add(item);
					}
				});
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,docgrid_tbtnSetMenu);
				
			}
		},
		layout: {
			overflowHandler: 'Menu'
		},
		items: [ActionBase.getAction('docgridtCreateDocTiff'),ActionBase.getAction('docsubwf'),
		ActionBase.getAction('docopenac'),'-',ActionBase.getAction('refreshdocgrid')
		,{
			text:'查找',
			itemId:'infaxserBtn',
			iconCls: 'infaxSelfFilter',
			tooltip: '自定义查找',
			menu:[ActionBase.getAction('docgridSelfFilterID'),ActionBase.getAction('docgridtSearchMenu')]
		},
		'-', ActionBase.getAction('delinfaxdocgrid'), ActionBase.getAction('reStoredocgrid'),
		'-',{
			itemId: 'forwardID',
			text: '转发',
			tooltip: '转发到邮件或传真',
			iconCls: 'resendfax',
			menu: [ActionBase.getAction('resenddocgrid'),ActionBase.getAction('resendemailDocID') ]
		},
		'-', ActionBase.getAction('docgridModCaller'),ActionBase.getAction('modifydocgridcommentID'),{
			itemId: 'singID',
			text: '标记',
			tooltip: '修改标签或阅读标志',
			iconCls: 'readICON',
			menu: [ActionBase.getAction('modflgdocgrid'), ActionBase.getAction('readdocgrid'), ActionBase.getAction('noreaddocgrid')]
		},
		'-', ActionBase.getAction('downloadfaxdocgrid'),ActionBase.getAction('docgridExpReport')
		]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store: 'docgridstoreId',
		dock:'bottom',
		listeners: {
			afterrender: function() {
				var me = this;
				//表单数据
				if(template) {
					if(!serverInfoDis && serverInfoModel.data.formData == 0) {						
						me.insert(19,'-');
						me.insert(20,ActionBase.getAction('changeTemplate'));
					} 
				}
			}
		},
		items: [{
			xtype:'tbtext',
			text:'过滤:'
		},{
			itemId: 'menuID',
			iconCls:'actionTime',
			text: '全部时间',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allFilterdocgrid'), ActionBase.getAction('todayFilterdocgrid'),
				ActionBase.getAction('twodayFilterdocgrid'), ActionBase.getAction('weekFilterdocgrid'),
				ActionBase.getAction('monthFilterdocgrid'), ActionBase.getAction('selfFilterdocgrid')]
			}
		}, '-',{
			itemId: 'faxFlagID',
			text: '全部标签',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allFaxFlagdocgrid'), ActionBase.getAction('noFaxFlagdocgrid'),
				ActionBase.getAction('oneFaxFlagdocgrid'), ActionBase.getAction('twoFaxFlagdocgrid'),
				ActionBase.getAction('threeFaxFlagdocgrid'), ActionBase.getAction('fourFaxFlagdocgrid'),
				ActionBase.getAction('fiveFaxFlagdocgrid'), ActionBase.getAction('sixFaxFlagdocgrid'),
				ActionBase.getAction('sevenFaxFlagdocgrid'), ActionBase.getAction('eightFaxFlagdocgrid'),
				ActionBase.getAction('nineFaxFlagdocgrid'), ActionBase.getAction('tenFaxFlagdocgrid'),
				ActionBase.getAction('elFaxFlagdocgrid')
				]
			}
		}, '-',{
			text: '全部类型',
			itemId: 'faxTypeID',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('alldocgridTypeID'),ActionBase.getAction('infaxdocgridTypeID'),
				ActionBase.getAction('sucfaxdocgridTypeID'),ActionBase.getAction('coltdocgridTypeID')
				]
			}
		}, '-',{
			text: '选择',
			iconCls:'actionSelect',
			itemId: 'selID',
			menu: [ActionBase.getAction('allselectdocgrid'),ActionBase.getAction('otherselectdocgrid')]
		}
		// ,'-',{
		// text: '按创建日期分组',
		// enableToggle: true,
		// toggleHandler: function(btn, pressed) {
		// var me = this;
		// var container = viewPortEast.down('#centerCenterView');
		// var butt = container.down('pagingtoolbar');
		// var grid = currGrid;
		// Ext.StoreMgr.lookup('docgridstoreId').group('createDate');
		// //            		Ext.StoreMgr.lookup('infaxstoreId').group('m');
		// if(pressed) {
		// grid.features[0].enable();
		// } else {
		// grid.features[0].disable();
		// }
		// }
		// },'-'
		]

	}],
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);	// 调用父类方法

		ActionBase.setTargetView('docmanager', me);
		ActionBase.updateActions('docmanager', me.getSelectionModel().getSelection());
	},
	loadGrid: function(doSearch,suppressStates) {
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
		if(!suppressStates) {
			//加载State
			if(myStates.docgridFilter) {
				for (key in myStates.docgridFilter) {
					if( !myStates.docgridFilter[key] || key == 'stateSaved')
						continue;
					ActionBase.getAction(myStates.docgridFilter[key]).execute(null,null,true);
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
		//		store.currentPage = 1;
		store.loadPage(1);
		store.getProxy().extraParams.refresh = null;
		store.filterMap.removeAtKey('filter');

		ActionBase.updateActions('docmanager', me.getSelectionModel().getSelection());
	}
});