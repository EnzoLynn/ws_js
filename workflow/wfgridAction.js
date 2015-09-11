Ext.define('WS.workFlow.taskmanager', {
	extend: 'WS.action.Base',
	category: 'taskmanager'
});

// Ext.create('WS.workFlow.taskmanager', {
	// itemId:'taskgridtMenu',
	// iconCls:'tplBtnIconCls',
	// tooltip: '表单数据',
	// text:'表单数据',
	// menu: [],
	// updateStatus: function(selection) {
		// if(template) {
			// this.setDisabled((serverInfoModel.data.formData != 0 )?true:false);
			// //如果是回收站
			// var ispub = this.getTargetView().getStore().getProxy().extraParams.folderid;
			// var tSet = taskgrid_tbtnSetMenu.down('#t'+this.itemId);
			// if(ispub == WaveFaxConst.RecycleFolderID || ispub == WaveFaxConst.PublicRecycleFolderID) {
				// this.setDisabled(true);
				// if(tSet) {
					// tSet.setDisabled(true);
				// }
			// } else {
				// if(tSet) {
					// tSet.setDisabled(false);
				// }
			// }
			// return;
		// }
		// this.setDisabled(true);
	// }
// });

Ext.create('WS.workFlow.taskmanager', {
	itemId:'taskgridtSearchMenu',
	text:'表单数据查找',
	handler: searchTMenuHandler,
	updateStatus: function(selection) {
		if(template) {
			this.setDisabled(serverInfoModel.data.formData != 0?true:false);
			//如果是回收站
			var seles = wfTree.getSelectionModel().getSelection();
			// if(!seles[0]) {
			// seles[0] = tempItem;
			// }
			if(seles[0].data.id == WaveFaxConst.RecycleFolderID || seles[0].data.id == WaveFaxConst.PublicRecycleFolderID) {
				this.setDisabled(true);
			}
			return;
		}
		this.setDisabled(true);
	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '任务查找',
	iconCls: 'taskgridSelfFilter',
	itemId: 'taskgridSelfFilterID',
	handler: function() {
		//Ext.StoreMgr.lookup ('wfSerachStoreID').load();

		var win = Ext.create('WS.workflow.wfGridSelfFilter', {
			grid: this.getTargetView()
		});

		win.show('', function() {
			var folderid = win.grid.getStore().getProxy().extraParams.folderid.toString();
			var booVal = folderid.indexOf('wfin') != -1;
			win.down('#WFS_userNameID').setDisabled(booVal);
			win.down('#sucRecButtID').setDisabled(booVal);
			var sTime = LocalToUTC(30);
			var eTime = Ext.Date.format(new Date(), 'Y-m-d');
			win.down('#startDateID').setValue(sTime);
			win.down('#endDateID').setValue(eTime);

		});
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '立即启动',
	iconCls: 'starnowTask',
	itemId: 'taskgridStartID',
	tooltip: '立即启动',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		var param = {
			sessiontoken: getSessionToken(),
			taskIds: Ext.JSON.encode(buildFaxIDs(sm.getSelection(), 'workflowTaskID'))
		};
		WsCall.call('activatetask', param, function (response, opts) {
			grid.getStore().load();
		}, function (response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('失败', response.msg);
			}
		});
	},
	updateStatus: function(selection) {
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = taskgrid_tbtnSetMenu.down('#t'+this.itemId);
		if(folderid == 'wfinit' || folderid == 'wfinon' || folderid == 'wfinfis') {
			this.show();
			if(tSet) {
				tSet.setDisabled(false);
			}
		} else {
			this.hide();
			if(tSet) {
				tSet.setDisabled(true);
			}
		}
		var startF = true;
		if(selection.length == 0) {
			startF = false;
		} else {
			for(var p in selection) {
				if(selection[p].get('workflowStatus') != 0) {
					startF = false;
					break;
				}
			}
		}
		this.setDisabled(!startF);
	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '取消',
	iconCls: 'cancelFaxICON',
	itemId: 'taskgridCancelID',
	tooltip: '取消',
	handler: function() {
		var grid = this.getTargetView();
		newMesB.show({
			title:'提示',
			msg: '确定要取消所选择的任务?',
			buttons: Ext.MessageBox.YESNO,
			closable:false,
			fn: function(btn) {
				if(btn=='yes') {
					var store = grid.getStore();
					var records = grid.getSelectionModel().getSelection();
					var ids = new Array();
					for(var p in records) {
						ids.push(records[p].data.workflowTaskID);
					}
					store.remove(records);
					var extraP = store.getProxy().extraParams;
					extraP.idList = ids.join();
					store.sync();
					extraP.idList = '';
					(new Ext.util.DelayedTask( function() {
							store.load();
						})).delay(500);
				}
			},
			icon: Ext.MessageBox.QUESTION
		});

	},
	updateStatus: function(selection) {
		//var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = taskgrid_tbtnSetMenu.down('#t'+this.itemId);
		if(folderid == 'wfinit' || folderid == 'wfinon' || folderid == 'wfinfis') {
			this.show();
			if(tSet) {
				tSet.setDisabled(false);
			}
		} else {
			this.hide();
			if(tSet) {
				tSet.setDisabled(true);
			}
		}
		var startF = true;
		if(selection.length == 0) {
			startF = false;
		} else {
			for(var p in selection) {
				var status = selection[p].get('workflowStatus');
				if(status == 2 || status == 3) {
					startF = false;
					break;
				}
			}
		}
		this.setDisabled(folderid == 'wfinfis' || !startF);
	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '审批',
	iconCls: 'doAppr',
	itemId: 'checkTaskTaskGrid',
	tooltip: '审批',
	handler: function() {
		var grid = this.getTargetView();
		var record = grid.getSelectionModel().getSelection()[0];
		var rule,curritem;
		Ext.Array.each(Ext.JSON.decode(record.data.process), function(item) {
			if(item.activityStatus == '1' || item.activityStatus == '2') {
				rule = item.workflowAction;
				curritem = item;
				return false;
			}
		});
		var taskobj = new Array();
		taskobj.push({
			taskid:record.data.workflowTaskID,
			itemid:record.data.currentWorkflowItemID
		});

		//判断是否锁定
		var param = {};
		//param.docid = vals.docID;
		param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
		param.taskobj = Ext.JSON.encode(taskobj);
		param.userid = userInfoData.userID;

		//param.taskid = record.data.workflowTaskID;
		//param.itemid = record.data.currentWorkflowItemID;
		param.block = true;

		WsCall.call('locktask', param, function(response, opts) {
			if(wfhandlerwin == ''){
				wfhandlerwin = loadwfhandlerwin(rule,curritem,record);
			}else{
				wfhandlerwin = loadwfhandlerwin(rule,curritem,record,false,wfhandlerwin);
			}
			
			wfhandlerwin.show();
		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				//0x6F000041:'工作流任务被锁定'
				if(response.code == 0x6F000041) {
					if(currGrid && currGrid.loadGrid) {
						currGrid.loadGrid();
					}
					var msg = Ext.JSON.decode(response.msg);
					Ext.Msg.alert('消息', '此任务正在被'+msg.name+'处理.');
				} else if(response.code == 0x6F000044) {
					if(currGrid && currGrid.loadGrid) {
						currGrid.loadGrid();
					}					
					Ext.Msg.alert('消息', '工作流审批职责已委托给他人.');
				} else {
					Ext.Msg.alert('失败', response.msg);
				}

			}
		}, true,'加载中...',Ext.getBody(),50);
	},
	updateStatus: function(selection) {
		var isCheck = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = taskgrid_tbtnSetMenu.down('#t'+this.itemId);
		if(isCheck != 'wfwaon' && isCheck != 'wfwait' && isCheck.toString().indexOf('trwron') ==-1) {
			this.hide();
			if(tSet) {
				tSet.setDisabled(true);
			}
		} else {
			this.show();
			if(tSet) {
				tSet.setDisabled(false);
			}
		}
		var record = selection[0];
		//var data = this.getTargetView().privData;
		if(roleInfoModel.data.allowWorkFlow == 0) {
			if(record) {
				this.setDisabled(selection.length != 1 || (record.data.workflowStatus != '1' && record.data.workflowStatus != '2') || !wfhascheck(record.data.process,wfTree.getSelectionModel().getSelection()[0].data.id));
				return;
			}
		} else {
			this.setDisabled(true);
			return;
		}

		this.setDisabled(selection.length != 1);
	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '批量审批',
	iconCls: 'doApprs',
	itemId: 'passTaskListTaskGrid',
	tooltip: '批量审批',
	handler: function() {
		var grid = this.getTargetView();
		var sels = grid.getSelectionModel().getSelection();

		sels = Ext.Array.sort(sels, function(a,b) {
			if(a.data.workflowTaskID < b.data.workflowTaskID)
				return -1;
			if(a.data.workflowTaskID > b.data.workflowTaskID)
				return 1;
			return 0;
		});
		var record = sels[0];
		var records = sels;

		var rule,curritem,ruleid;
		ruleid = record.data.workflowRuleID;
		Ext.Array.each(Ext.JSON.decode(record.data.process), function(item) {
			if(item.activityStatus == '1' || item.activityStatus == '2') {
				rule = item.workflowAction;
				curritem = item;
				return false;
			}
		});
		var reFlag = false;
		var taskobj = new Array();
		Ext.Array.each(records, function(rec) {
			if(rec.data.workflowRuleID != ruleid) {
				Ext.Msg.alert('消息','您所选择的任务对应多个任务规则，无法批量审批.');
				reFlag = true;
				return false;
			}
			if(rec.data.workflowStatus == 3) {
				Ext.Msg.alert('消息','您所选择的任务中含有已完成的任务，无法批量审批.');
				reFlag = true;
				return false;
			}
			if(!wfhascheck(rec.data.process,wfTree.getSelectionModel().getSelection()[0].data.id)) {
				Ext.Msg.alert('消息','您没有权限审批其中某些任务.');
				reFlag = true;
				return false;
			}
			taskobj.push({
				taskid:rec.data.workflowTaskID,
				itemid:rec.data.currentWorkflowItemID
			});
		});
		if(!reFlag) {
			//判断是否锁定
			var param = {};
			//param.docid = vals.docID;
			param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
			param.taskobj = Ext.JSON.encode(taskobj);
			param.userid = userInfoData.userID;
			//param.taskid = record.data.workflowTaskID;
			//param.itemid = record.data.currentWorkflowItemID;
			param.block = true;

			WsCall.call('locktask', param, function(response, opts) {
				//var taskList = new Array();
				if(wfhandlerwin == ''){
					wfhandlerwin = loadwfhandlerwin(rule,curritem,record,records);
				}else{
					wfhandlerwin = loadwfhandlerwin(rule,curritem,record,records,wfhandlerwin);
				}
				
				wfhandlerwin.show();
			}, function(response, opts) {
				if(!errorProcess(response.code)) {
					//0x6F000041:'工作流任务被锁定'
					if(response.code == 0x6F000041) {
						if(currGrid && currGrid.loadGrid) {
							currGrid.loadGrid();
						}
						var msg = Ext.JSON.decode(response.msg);
						Ext.Msg.alert('消息', '任务'+'('+msg.id+')'+'正在被'+msg.name+'处理.');
					} else if(response.code == 0x6F000044) {
						if(currGrid && currGrid.loadGrid) {
							currGrid.loadGrid();
						}						
						Ext.Msg.alert('消息', '工作流审批职责已委托给他人.');
					} else {
						Ext.Msg.alert('失败', response.msg);
					}
				}
			}, true,'加载中...',Ext.getBody(),50);
		}

	},
	updateStatus: function(selection) {
		var isCheck = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = taskgrid_tbtnSetMenu.down('#t'+this.itemId);
		if(isCheck != 'wfwaon' && isCheck != 'wfwait' && isCheck.toString().indexOf('trwron') ==-1) {
			this.hide();
			if(tSet) {
				tSet.setDisabled(true);
			}
		} else {
			this.show();
			if(tSet) {
				tSet.setDisabled(false);
			}
		}
		var record = selection[0];
		//var data = this.getTargetView().privData;
		if(roleInfoModel.data.allowWorkFlow == 0) {
			if(record) {
				this.setDisabled(selection.length <= 1 || record.data.workflowStatus != '1');
				return;
			}
		} else {
			this.setDisabled(true);
			return;
		}

		this.setDisabled(selection.length <= 1);
	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '全部任务',
	group: 'workflowRuleStatus',
	itemId: 'allRuleWorkflow1',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfRules').setText('全部任务');
		panel.getStore().getProxy().extraParams.rules = '0';
		panel.loadGrid();
		//panel.getStore().getProxy().extraParams.rules = '1';

	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '等待您审批',
	checked:true,
	group: 'workflowRuleStatus',
	itemId: 'waiteRuleWorkflow1',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfRules').setText('等待您审批');

		panel.getStore().getProxy().extraParams.rules = '1';
		panel.loadGrid();
		//panel.getStore().getProxy().extraParams.rules = '1';

	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '全部状态',
	checked:true,
	group: 'workflowAcStatus',
	itemId: 'allStatusWorkflow',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfstatusID').setText('全部状态');
		panel.getStore().filterMap.removeAtKey('WorkflowStatus');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.wfstatus = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

// Ext.create('WS.workFlow.taskmanager', {
// text: '完成',
// group: 'workflowAcStatus',
// itemId: 'finishedStatusWorkflow',
// handler: function(btn,eve,suppressLoad) {
// var panel = this.getTargetView();
// var container = viewPortEast.down('#centerCenterView');
// container.down('#wfstatusID').setText('完成');
// var value = tplPrefix +'WorkflowStatus=3';
// panel.getStore().filterMap.replace('WorkflowStatus', value);
// if(suppressLoad){
// this.setChecked(suppressLoad);
// return;
// }
// //保存变量并上传
// var me = this;
// myStates.taskgridFilter.wfstatus = me.itemId;
// var tmpS = myStates.taskgridFilter;
// wsUserStates.setServerState('taskgridFilter',tmpS);
// panel.loadGrid();
// },
// updateStatus: function(selection) {
//
// }
// });

Ext.create('WS.workFlow.taskmanager', {
	text: '处理中',
	group: 'workflowAcStatus',
	itemId: 'runningStatusWorkflow',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfstatusID').setText('处理中');
		var value = tplPrefix +'WorkflowStatus=2';
		panel.getStore().filterMap.replace('WorkflowStatus', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.wfstatus = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '运行',
	group: 'workflowAcStatus',
	itemId: 'activeStatusWorkflow',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfstatusID').setText('运行');
		var value = tplPrefix +'WorkflowStatus=1';
		panel.getStore().filterMap.replace('WorkflowStatus', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.wfstatus = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '未启动',
	group: 'workflowAcStatus',
	itemId: 'idleStatusWorkflow',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfstatusID').setText('未启动');
		var value = tplPrefix +'WorkflowStatus=0';
		panel.getStore().filterMap.replace('WorkflowStatus', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.wfstatus = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

// Ext.create('WS.workFlow.taskmanager', {
// text: '全部状态',
// checked:true,
// group: 'wfTaskAcStatus',
// itemId: 'allStatusWfTaskID',
// handler: function(btn,eve,suppressLoad) {
// var panel = this.getTargetView();
// var container = viewPortEast.down('#centerCenterView');
// container.down('#sucstatusID').setText('全部状态');
// panel.getStore().filterMap.removeAtKey('status');
// if(suppressLoad){
// this.setChecked(suppressLoad);
// return;
// }
// //保存变量并上传
// var me = this;
// myStates.taskgridFilter.status = me.itemId;
// var tmpS = myStates.taskgridFilter;
// wsUserStates.setServerState('taskgridFilter',tmpS);
// panel.loadGrid();
// },
// updateStatus: function(selection) {
//
// }
// });

Ext.create('WS.workFlow.taskmanager', {
	text: '任务失败',
	group: 'workflowAcStatus',
	itemId: 'WfTaskFinishedFailed',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfstatusID').setText('任务失败');
		var value = tplPrefix +'WorkflowStatus=3 and ' + tplPrefix +'WorkflowErrCode!=0';
		panel.getStore().filterMap.replace('WorkflowStatus', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.wfstatus = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '任务通过',
	group: 'workflowAcStatus',
	itemId: 'WfTaskFinishedOK',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#wfstatusID').setText('任务通过');
		var value = tplPrefix +'WorkflowStatus=3 and ' +tplPrefix +'WorkflowErrCode=0';
		panel.getStore().filterMap.replace('WorkflowStatus', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.wfstatus = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '全部时间',
	checked:true,
	group: 'taskgridAcTime',
	itemId: 'allFiltertaskgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('全部时间');
		panel.getStore().filterMap.removeAtKey('time');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.time = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '今天',
	group: 'taskgridAcTime',
	itemId: 'todayFiltertaskgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('今天');
		var value = tplPrefix +"StartTime>='" + LocalToUTCTime(0) + "' and "+tplPrefix +"StartTime<='" + LocalToUTCTime(0,true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.time = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '两天',
	group: 'taskgridAcTime',
	itemId: 'twodayFiltertaskgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('两天');
		var value = tplPrefix +"StartTime>='" + LocalToUTCTime(1) + "' and "+tplPrefix +"StartTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.time = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.workFlow.taskmanager', {
	text: '一周',
	group: 'taskgridAcTime',
	itemId: 'weekFiltertaskgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('一周');
		var value = tplPrefix +"StartTime>='" + LocalToUTCTime(6) + "' and "+tplPrefix +"StartTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.time = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.workFlow.taskmanager', {
	text: '一月',
	group: 'taskgridAcTime',
	itemId: 'monthFiltertaskgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('一月');
		var value = tplPrefix +"StartTime>='" + LocalToUTCTime(30) + "' and "+tplPrefix +"StartTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.taskgridFilter.time = me.itemId;
		var tmpS = myStates.taskgridFilter;
		wsUserStates.setServerState('taskgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '自定义时间段',
	group: 'taskgridAcTime',
	itemId: 'selfFiltertaskgrid',
	handler: function(btn,eve,suppressLoad) {
		if(suppressLoad) {
			return;
		}
		var panel = this.getTargetView();
		panel.down('#menuID').setText('自定义时间段');
		var flag = false;
		if(docDateWin == '') {
			flag = true;
			docDateWin = Ext.create('WS.infax.InfaxDateFilter', {
				grid: panel
			});
		}
		docDateWin.show('', function() {
			if(flag) {
				docDateWin.down('#startDateID').setValue(LocalToUTC(30));
				docDateWin.down('#endDateID').setValue(Ext.Date.format(new Date(), 'Y-m-d'));
			}
		});
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.workFlow.taskmanager', {
	text: '全选/取消',
	itemId: 'allselecttaskgrid',
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

Ext.create('WS.workFlow.taskmanager', {
	text: '反选',
	itemId: 'otherselecttaskgrid',
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

Ext.create('WS.workFlow.taskmanager', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshICON',
	itemId: 'refreshtaskgrid',
	handler: function() {
		var panel = this.getTargetView();
		var store = panel.getStore();
		store.filterMap.removeAtKey('filter');
		store.getProxy().extraParams.folderFlag = '';	//将忽略folderid移除
		panel.loadGrid();
		var treeSeles = docTree.getSelectionModel().getSelection();

		if(template) {
			template.setTplGridTitle(panel,false,false,'wftree');
		} else {
			panel.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
		}

		//重新取任务类别
		var store1 = Ext.StoreMgr.lookup('wfSerachStoreID');
		store1.getProxy().extraParams.sessiontoken = getSessionToken();
		store1.load({
			callback : function(records, operation, success) {
				var com = panel.down('#wfRuleType');
				com.menu.removeAll();
				Ext.Array.each(records, function(rec) {
					com.menu.add({
						text: rec.data.workflowRuleName,
						group: 'taskgridRuleType',
						itemId: 'ruleTypeFiltertaskgrid'+rec.data.workflowRuleID,
						handler: function(btn,eve,suppressLoad) {
							var value = tplPrefix +'workflowruleid='+rec.data.workflowRuleID;
							taskGrid.getStore().filterMap.replace('WorkflowRuleType', value);
							taskGrid.loadGrid();
						}
					});
				});
			}
		});
		//getIsReadCount(docTree.getStore(), store.getProxy().extraParams.folderid);
	},
	updateStatus: function(selection) {
	}
});