//创建一个工具栏设置文菜单
var taskgrid_tbtnSetMenu = Ext.create('Ext.menu.Menu', {
	defaults: {
		xtype: 'menucheckitem'
	},
	items:[]
});
//创建一个上下文菜单
var taskgrid_RightMenu = Ext.create('Ext.menu.Menu', {
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

		}
	},
	items: [ActionBase.getAction('checkTaskTaskGrid'),ActionBase.getAction('passTaskListTaskGrid'),ActionBase.getAction('taskgridStartID'),ActionBase.getAction('taskgridCancelID'),'-',ActionBase.getAction('refreshtaskgrid')
	,{
		text:'查找',
		itemId:'infaxserBtn',
		iconCls: 'infaxSelfFilter',
		tooltip: '自定义查找',
		menu:[ActionBase.getAction('taskgridSelfFilterID'),ActionBase.getAction('taskgridtSearchMenu')]
	}
	]
});
Ext.define('WS.workFlow.taskgrid', {
	alternateClassName: ['taskgrid'],
	alias: 'widget.taskgrid',
	extend: 'Ext.grid.Panel',
	//	title: '文档管理',
	store: 'taskgridstoreId',
	//itemId: 'taskgridID',
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
		itemclick: function(grid,record,hitem,index,e,opts) {
			if(!e.ctrlKey && !e.shiftKey) {
				var sm = grid.getSelectionModel();
				sm.deselectAll(true);
				sm.select(record,true,false);
			}
		},
		itemdblclick: function(grid,record,hitem,index,e,opts) {
			showWf = true;
			if(seefillfaxwin == ''){
				seefillfaxwin = seeFillFaxNew(record);
			}else{
				seefillfaxwin = seeFillFaxNew(record,seefillfaxwin);
			}
			seefillfaxwin.show();
		},
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			taskgrid_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		},
		beforestatesave: function(statefull,state,eOpts) {
			Ext.Array.each(state.columns, function(it) {
				if(!it.width) {
					Ext.Array.each(myStates.taskgridState.columns, function(odt) {
						if(it.id == odt.id && odt.width) {
							it.width = odt.width;
						}
					});
				}
				if(!it.hidden && it.hidden != false) {
					Ext.Array.each(myStates.taskgridState.columns, function(odt) {
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
				me.add('-');
				//加载工具栏配置按钮
				loadtoolbtnSet(me,taskgrid_tbtnSetMenu);

			}
		},
		layout: {
			overflowHandler: 'Menu'
		},
		items: [ActionBase.getAction('checkTaskTaskGrid'),ActionBase.getAction('passTaskListTaskGrid'),ActionBase.getAction('taskgridStartID'),
		ActionBase.getAction('taskgridCancelID'),'-',ActionBase.getAction('refreshtaskgrid')
		,{
			text:'查找',
			itemId:'infaxserBtn',
			iconCls: 'infaxSelfFilter',
			tooltip: '自定义查找',
			menu:[ActionBase.getAction('taskgridSelfFilterID'),ActionBase.getAction('taskgridtSearchMenu')]
		},'->',{
			fieldLabel: '任务主题搜索',
			text:'任务主题搜索',
			width: 400,
			labelAlign:'right',
			labelWidth: 150,
			xtype: 'searchfield',
			itemId: 'serRuleSubjID',
			onTrigger2Click: function() {
				var me = this,
				store = me.store,
				proxy = store.getProxy(),
				value = me.getValue();

				if (value.length < 1) {
					me.onTrigger1Click();
					return;
				}
				proxy.extraParams[me.paramName] = "upper("+tplPrefix +"taskComment) like '%" + value.toUpperCase() + "%'";
				proxy.extraParams.start = 0;
				proxy.extraParams.refresh = 1;
				store.load();
				proxy.extraParams.refresh = null;
				me.hasSearch = true;
				me.triggerEl.item(0).up('td').setWidth(17);
				me.triggerEl.item(0).setDisplayed('block');
				me.doComponentLayout();
			}
		}
		]
	},{
		xtype : 'mypagebar',
		itemId: 'pagingtoolbarID',
		store: 'taskgridstoreId',
		dock:'bottom',
		listeners: {
			afterrender: function() {
				var me = this;
				//表单数据
				if(template) {
					if(!serverInfoDis && serverInfoModel.data.formData == 0) {
						me.insert(20,'-');
						me.insert(21,ActionBase.getAction('changeTemplate'));
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
				items:[ActionBase.getAction('allFiltertaskgrid'), ActionBase.getAction('todayFiltertaskgrid'),
				ActionBase.getAction('twodayFiltertaskgrid'), ActionBase.getAction('weekFiltertaskgrid'),
				ActionBase.getAction('monthFiltertaskgrid'), ActionBase.getAction('selfFiltertaskgrid')]
			}
		},'-',{
			itemId: 'wfstatusID',
			text: '全部状态',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[
				ActionBase.getAction('allStatusWorkflow'), ActionBase.getAction('idleStatusWorkflow'),
				ActionBase.getAction('activeStatusWorkflow'),ActionBase.getAction('runningStatusWorkflow'),
				ActionBase.getAction('WfTaskFinishedOK'),ActionBase.getAction('WfTaskFinishedFailed')
				]
			}
		},{
			xtype:'tbseparator',
			hidden:true,
			itemId:'spWfRules'
		},{
			itemId: 'wfRules',
			hidden:true,
			text: '等待您审批',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[ActionBase.getAction('allRuleWorkflow1'), ActionBase.getAction('waiteRuleWorkflow1')]
			}
		},{
			itemId:'wfRuleType',
			text:'全部规则',
			menu: {
				defaults: {
					xtype: 'menucheckitem'
				},
				items:[{
					text: '全部规则',
					checked:true,
					group: 'taskgridRuleType',
					itemId: 'allruleTypeFiltertaskgrid',
					handler: function(btn,eve,suppressLoad) {
						taskGrid.getStore().filterMap.removeAtKey('WorkflowRuleType');
						taskGrid.down('#wfRuleType').setText('全部规则');
						taskGrid.loadGrid();
					}
				}]
			},
			listeners: {
				afterrender: function(com) {
					var store = Ext.StoreMgr.lookup('wfSerachStoreID');
					store.getProxy().extraParams.sessiontoken = getSessionToken();
					store.load({
						callback : function(records, operation, success) {
							Ext.Array.each(records, function(rec) {
								com.menu.add({
									text: rec.data.workflowRuleName,
									group: 'taskgridRuleType',
									itemId: 'ruleTypeFiltertaskgrid'+rec.data.workflowRuleID,
									handler: function(btn,eve,suppressLoad) {
										var value = tplPrefix +'workflowruleid='+rec.data.workflowRuleID;
										com.setText(rec.data.workflowRuleName);
										taskGrid.getStore().filterMap.replace('WorkflowRuleType', value);
										taskGrid.loadGrid();
									}
								});
							});
						}
					});

				}
			}
		},'-',{
			text: '选择',
			iconCls:'actionSelect',
			itemId: 'selID',
			menu: [ActionBase.getAction('allselecttaskgrid'),ActionBase.getAction('otherselecttaskgrid')]
		}
		]

	}],
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);	// 调用父类方法

		ActionBase.setTargetView('taskmanager', me);
		ActionBase.updateActions('taskmanager', me.getSelectionModel().getSelection());
	},
	loadGrid: function(doSearch,suppressStates) {
		setReadFlagTask.cancel();
		var me = this;
		var store = me.getStore();
		if(me.down('#serRuleSubjID')) {
			me.down('#serRuleSubjID').store = me.getStore();		//让searchfield的store不依赖于变量
		}
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
			if(myStates.taskgridFilter) {
				for (key in myStates.taskgridFilter) {
					if( !myStates.taskgridFilter[key] || key == 'stateSaved')
						continue;
					if(ActionBase.getAction(myStates.taskgridFilter[key])) {
						if(!ActionBase.getAction(myStates.taskgridFilter[key]).isHidden()) {
							ActionBase.getAction(myStates.taskgridFilter[key]).execute(null,null,true);
						} else {
							//if(ActionBase.getAction(myStates.taskgridFilter[key]).group == 'workflowAcStatus'){
							ActionBase.getAction('allStatusWorkflow').execute(null,null,false);
							//}
						}
					}
				}
			}
		}

		var filter = '';
		if(doSearch) {
			modActionStates(me, false);
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

		ActionBase.updateActions('taskmanager', me.getSelectionModel().getSelection());
	}
});