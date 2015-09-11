//创建一个工具栏设置文菜单
var infax_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});
//创建一个上下文菜单
var infax_RightMenu = Ext.create('Ext.menu.Menu', {
	listeners: {
		afterrender: function() {
			var me = this;

			//表单数据
			if(template) {
				if(!serverInfoDis && serverInfoModel.data.formData == 0) {
					// me.down('#infaxtMenu').menu.add([
					// ActionBase.getAction('recTemplate'),
					// ActionBase.getAction('changeTemplate')
					// ]);
					me.add('-');
					me.add(ActionBase.getAction('recTemplate'));
					me.add(ActionBase.getAction('changeTemplate'));
				}
			}

			var fistAdd = true;
			gridPlugin.infaxPlugin.each( function(item,index,alls) {
				if(item.initialConfig.addType.indexOf('m') != -1) {
					if(fistAdd)
						me.add('-');
					fistAdd = false;
					me.add(item);
				}
			});
		}
	},
	items: [ActionBase.getAction('refreshinfaxID'),{
		text:'查找',
		iconCls: 'infaxSelfFilter',
		tooltip: '自定义查找',
		menu:[ActionBase.getAction('infaxSelfFilterID'),ActionBase.getAction('infaxtSearchMenu')]
	},'-', ActionBase.getAction('delinfaxID'), ActionBase.getAction('reStoreInfID'),
	'-',ActionBase.getAction('revertFaxID'),'-',ActionBase.getAction('sendfaxbygrid'),
	ActionBase.getAction('infaxsubwf'),
	ActionBase.getAction('inresendinfaxID'),{
		itemId: 'forwardID',
		text: '转发',
		tooltip: '转发到邮件或传真',
		iconCls: 'resendfax',
		menu: [ActionBase.getAction('resendinfaxID'),ActionBase.getAction('resendemailID') ]
	},ActionBase.getAction('infaxColtDoc'),
	'-', ActionBase.getAction('modCallerID'),ActionBase.getAction('modifyinfaxcommentID'),{
		itemId: 'singID',
		text: '标记',
		tooltip: '修改标签或阅读标志',
		iconCls: 'readICON',
		menu: [ActionBase.getAction('modflgID'), ActionBase.getAction('readID'), ActionBase.getAction('noreadID')]
	},
	'-', ActionBase.getAction('downloadfaxID'),ActionBase.getAction('expReportId'),ActionBase.getAction('inRuleExecID')
	]
});
Ext.define('WS.infax.Infaxgrid', {
	alternateClassName: ['Infaxgrid'],
	alias: 'widget.Infaxgrid',
	extend: 'Ext.grid.Panel',
	//	title: '收件箱',
	store: 'infaxstoreId',
	itemId: 'infaxGridID',
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
			target: 'Infaxgrid'
		},
		loadingText:'正在加载数据...',
		plugins: {
			ddGroup: 'FileDDGp',
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
			infax_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		},
		beforestatesave: function(statefull,state,eOpts) {
			Ext.Array.each(state.columns, function(it) {
				if(!it.width) {
					Ext.Array.each(myStates.infaxgridState.columns, function(odt) {
						if(it.id == odt.id && odt.width) {
							it.width = odt.width;
						}
					});
				}
				if(!it.hidden && it.hidden != false) {
					Ext.Array.each(myStates.infaxgridState.columns, function(odt) {
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
						//me.down('#infaxtMenu').menu.add([
						//ActionBase.getAction('recTemplate'),
						//ActionBase.getAction('changeTemplate')
						//]);
						me.add('-');
						me.add(ActionBase.getAction('recTemplate'));
					} else {
						//me.down('#infaxtMenu').setDisabled(true);
					}
				}

				//加载插件
				var fistAdd = true;
				gridPlugin.infaxPlugin.each( function(item,index,alls) {
					if(item.initialConfig.addType.indexOf('t') != -1) {
						if(fistAdd)
							me.add('-');
						fistAdd = false;
						me.add(item);
					}
				});
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,infax_tbtnSetMenu);

			}
		},
		layout: {
			overflowHandler: 'Menu'
		},
		items: [ActionBase.getAction('sendfaxbygrid'),ActionBase.getAction('infaxsubwf'),ActionBase.getAction('infaxColtDoc'),'-',ActionBase.getAction('refreshinfaxID')
		,{
			text:'查找',
			itemId:'infaxserBtn',
			iconCls: 'infaxSelfFilter',
			tooltip: '自定义查找',
			menu:[ActionBase.getAction('infaxSelfFilterID'),ActionBase.getAction('infaxtSearchMenu')]
		},
		'-', ActionBase.getAction('delinfaxID'), ActionBase.getAction('reStoreInfID'),'-', ActionBase.getAction('revertFaxID'),
		'-', ActionBase.getAction('inresendinfaxID'),{
			itemId: 'forwardID',
			text: '转发',
			tooltip: '转发到邮件或传真',
			iconCls: 'resendfax',
			menu: [ActionBase.getAction('resendinfaxID'),ActionBase.getAction('resendemailID') ]
		},
		'-', ActionBase.getAction('modCallerID'),ActionBase.getAction('modifyinfaxcommentID'),{
			itemId: 'singID',
			text: '标记',
			tooltip: '修改标签或阅读标志',
			iconCls: 'readICON',
			menu: [ActionBase.getAction('modflgID'), ActionBase.getAction('readID'), ActionBase.getAction('noreadID')]
		},
		'-', ActionBase.getAction('downloadfaxID'),ActionBase.getAction('expReportId'),ActionBase.getAction('inRuleExecID')

		]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store: 'infaxstoreId',
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
				items:[ActionBase.getAction('allFilterActionID'), ActionBase.getAction('todayFilterActionID'),
				ActionBase.getAction('twodayFilterActionID'), ActionBase.getAction('weekFilterActionID'),
				ActionBase.getAction('monthFilterActionID'), ActionBase.getAction('selfFilterActionID')]
			}
		}, '-',{
			itemId: 'faxFlagID',
			text: '全部标签',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allFaxFlagActionID'), ActionBase.getAction('noFaxFlagAction'),
				ActionBase.getAction('oneFaxFlagAction'), ActionBase.getAction('twoFaxFlagAction'),
				ActionBase.getAction('threeFaxFlagAction'), ActionBase.getAction('fourFaxFlagAction'),
				ActionBase.getAction('fiveFaxFlagAction'), ActionBase.getAction('sixFaxFlagAction'),
				ActionBase.getAction('sevenFaxFlagAction'), ActionBase.getAction('eightFaxFlagAction'),
				ActionBase.getAction('nineFaxFlagAction'), ActionBase.getAction('tenFaxFlagAction'),
				ActionBase.getAction('elFaxFlagAction')
				]
			}
		}, '-',{
			text: '全部类型',
			itemId: 'faxTypeID',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allInfaxTypeID'),ActionBase.getAction('innerInfaxTypeID'),
				ActionBase.getAction('outInfaxTypeID')
				]
			}
		}, '-',{
			text: '选择',
			iconCls:'actionSelect',
			itemId: 'selID',
			menu: [ActionBase.getAction('allselectID'),ActionBase.getAction('otherselectID')]
			//		}, '-',{
			//			text: '阅读状态',
			//			itemId: 'isReadID',
			//			menu: [ActionBase.getAction('allReadID'),ActionBase.getAction('notReadID'),ActionBase.getAction('readedID')]
		}
		// ,'-',{
		// text: '按接收日期分组',
		// enableToggle: true,
		// toggleHandler: function(btn, pressed) {
		// var me = this;
		// var container = viewPortEast.down('#centerCenterView');
		//
		// var butt = container.down('pagingtoolbar');
		// var grid = currGrid;
		// Ext.StoreMgr.lookup('infaxstoreId').group('receiveDate');
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

		ActionBase.setTargetView('Infax', me);
		ActionBase.updateActions('Infax', me.getSelectionModel().getSelection());
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
			if(myStates.infaxgridFilter) {
				for (key in myStates.infaxgridFilter) {
					if( !myStates.infaxgridFilter[key] || key == 'stateSaved')
						continue;
					ActionBase.getAction(myStates.infaxgridFilter[key]).execute(null,null,true);
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
		var folderId = store.getProxy().extraParams.folderid;
		if(ruleSettingFlag && (folderId == WaveFaxConst.RootFolderID || folderId.indexOf("grxx") != -1)) {
			//进行规则处理传真
			executeRuleProcess(me, function() {
				//		store.currentPage = 1;
				store.loadPage(1);
				store.getProxy().extraParams.refresh = null;
				store.filterMap.removeAtKey('filter');

				ActionBase.updateActions('Infax', me.getSelectionModel().getSelection());
			});
		} else {
			store.loadPage(1);
			store.getProxy().extraParams.refresh = null;
			store.filterMap.removeAtKey('filter');

			ActionBase.updateActions('Infax', me.getSelectionModel().getSelection());
		}
	}
});