Ext.create('Ext.data.Store', {
	storeId: 'WorkflowStatusID',
	fields: ['statcode', 'statvalue'],
	data : [{'statcode': '0', 'statvalue': '未启动'},
		{'statcode': '1', 'statvalue': '运行'},
		{'statcode': '2', 'statvalue': '处理中'},
		{'statcode': '3', 'statvalue': '完成'}
	]
});

Ext.define('WS.workflow.wfGridSelfFilter', {
	extend: 'Ext.window.Window',
	title: '自定义查询条件',
	iconCls: 'infaxSelfFilter',
	height: 250,
	width: 390,
	border: false,
	bodyCls: 'panelFormBg',
	layout: 'hbox',
	resizable: false,
	modal: true,   //设置window为模态
	listeners: {
		afterrender: function(com,opts) {
		}
	},
	items:[{
		xtype: 'form',
		width: 380,
		bodyPadding: 5,
		border: false,
		bodyCls: 'panelFormBg',
		url: WsConf.Url,
		itemId: 'formID',
		items: [{
			width: 320,
			labelAlign: 'right',
			labelPad: 15,
			fieldLabel: '规则类别',
			multiSelect: true,
			xtype: 'combobox',
			store: 'wfSerachStoreID',
			queryMode : 'local',
			displayField : 'workflowRuleName',
			valueField : 'workflowRuleID',
			itemId: 'ruleNameID',
			editable: false,
			listeners: {
				afterrender: function(com) {
					var folderId = com.up('window').grid.getStore().getProxy().extraParams.folderid;
					var store = com.getStore();
					store.getProxy().extraParams.sessiontoken =  getSessionToken();
					if(folderId.indexOf('wfin')!= -1){
						store.getProxy().extraParams.listall =  false;
					}					
					store.load();
					store.getProxy().extraParams.listall =  true;
				}
			}
		},{
			width: 320,
			labelAlign: 'right',
			labelPad: 15,
			fieldLabel: '状态',
			multiSelect: true,
			xtype: 'combobox',
			name: 'modflag',
			itemId: 'statusID',
			store: 'WorkflowStatusID',
			queryMode : 'local',
			displayField : 'statvalue',
			valueField : 'statcode',
			editable: false
		},{
			labelAlign: 'right',
			labelPad: 15,
			width: 320,
			xtype:'textfield',
			fieldLabel: '任务主题',
			itemId: 'taskCommID'
		},{
			layout: 'hbox',
			border: false,
			items: [{
				width: 300,
				labelAlign: 'right',
				labelPad: 15,
				name: 'userName',
				fieldLabel: '任务提交人',
				//editable:false,
				xtype: 'textfield',
				itemId: 'WFS_userNameID',
				listeners: {
					afterrender: function(com) {
						com.inputEl.dom.readOnly = true;
					}
				}
			},{
				xtype: 'button',
				text: '选择',
				margin: '0 0 0 5',
				itemId: 'sucRecButtID',
				handler: function() {
					if(faxforwardwin == '') {
						faxforwardwin = Ext.create('WS.infax.InForward', {
							isInForWard:false,
							isDocSearch:'WFS_userNameID',
							docSearchWin: this.up('window')
						});
					} else {
						faxforwardwin.isInForWard = false;
						faxforwardwin.isDocSearch = 'WFS_userNameID';
						faxforwardwin.docSearchWin = this.up('window')
					}
					//secondGridStore.loadData([]);
					Ext.StoreMgr.lookup('userdicStore').loadData([]);
					faxforwardwin.setWidth(900);
					faxforwardwin.down('#tabpalFiles').setDisabled(true);
					faxforwardwin.down('#rdDic').setDisabled(true);
					faxforwardwin.down('#rdUser').setValue(true);
					faxforwardwin.show('', function() {
						faxforwardwin.center();
						faxforwardwin.setTitle('任务提交人');
						faxforwardwin.down('#isDelID').setVisible(false);
						faxforwardwin.down('#userID').loadGrid(true);
						faxforwardwin.down('tabpanel').setActiveTab('forwarUser');
						faxforwardwin.down('#ugTargetId').setTitle('任务提交人');
						faxforwardwin.down('#forwarUserDic').setTitle('用户');
						var serF = faxforwardwin.down('#serFielID');
						serF.store = faxforwardwin.down('#userID').getStore();
						serF.reset();
						serF.onTrigger1Click();
					});
				}
			}]
		
		},{
			xtype: 'hiddenfield',
			itemId: 'WFS_userNameID_hide'
		},{
			xtype: 'checkbox',
			boxLabel: '开始时间范围',
			itemId:'timeCbx',
			listeners: {
				change: function(cb, nValue, oValue, opts) {
					var me = this;
					var f = me.up('form');
					f.down('#timeID').setDisabled(!cb.getValue());
				}
			}
		},{
			xtype:'fieldset',
			collapsible: true,
			disabled:true,
			defaultType: 'datefield',
			layout: 'hbox',
			itemId: 'timeID',
			items: [{
				name: 'startDate',
				allowBlank: false,
				itemId: 'startDateID',
				format:'Y-m-d',
				width:120

			},{
				xtype: 'label',
				html: '&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;'
			},{
				name: 'endDate',
				allowBlank: false,
				itemId: 'endDateID',
				format:'Y-m-d',
				width:120
			}]
		}]
	}],
	buttons: [{
		text: '确定',
		formBind: true, //only enabled once the form is valid
		handler: function() {
			var me = this;
			var w = me.up('window');
			var filter = '';
			var store = w.grid.getStore();

			var ruleNameID = w.down('#ruleNameID').getValue();
			if(ruleNameID && ruleNameID.length > 0) {
				filter = tplPrefix + 'workflowruleid in(' + ruleNameID + ')';
			}
			
			var statusID = w.down('#statusID').getValue();
			if(statusID && statusID.length > 0) {
				filter = tplPrefix + 'WorkflowStatus in(' + statusID + ')';
			}
			var taskCommID = w.down('#taskCommID').getValue();
			if(taskCommID && taskCommID.length > 0) {
				filter += (filter.length > 0 ? ' and ': '') + 
		        		"upper("+tplPrefix +"TaskComment) like '%" + taskCommID.toUpperCase() + "%'";
			}
			
			var userNameID_hide = w.down('#WFS_userNameID_hide').getValue();
			if(userNameID_hide.length > 0) {
				filter += (filter.length > 0 ? ' and ': '') + tplPrefix + 'userid in(' + userNameID_hide + ')';
			}
			if(w.down('#timeCbx').getValue()) {
				var startDate = w.down('#startDateID').getValue();
				if(startDate != null) {
					filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"starttime>='" + LocalDateToLongUTCstr(startDate) + "' ";
				}
				var endDate = w.down('#endDateID').getValue();
				if(endDate != null) {
					var locDate = new Date();
					locDate.setTime(endDate.getTime() + (24*3600*1000 -1000));
					filter += 'and '+tplPrefix +"starttime<='" + LocalDateToLongUTCstr(locDate) + "'";
				}
			}
			if(filter.length == 0) {
				return;
			}
			store.filterMap.replace('filter', filter);

			w.grid.loadGrid(true);
			var str = linkViewTitle(wfTree.getSelectionModel().getSelection());
			gridTitle.setTitle('查找结果 {' + str + '}');
			modActionStates(w.grid, true);
			w.close();
		}
	},{
		text: '取消',
		handler: function() {
			this.up('window').close();
		}
	}]
});