Ext.define('WS.succoutfax.SuccoutfaxAction', {
	extend: 'WS.action.Base',
	category: 'succoutfax'
});

// Ext.create('WS.succoutfax.SuccoutfaxAction', {
	// itemId:'sucfaxtMenu',
	// iconCls:'tplBtnIconCls',
	// tooltip: '表单数据',
	// text:'表单数据',
	// menu: [],
	// updateStatus: function(selection) {
		// if(template) {
			// this.setDisabled((serverInfoModel.data.formData != 0)?true:false);
// 
			// //如果是回收站
			// var ispub = this.getTargetView().getStore().getProxy().extraParams.folderid;
			// var tSet = sucfax_tbtnSetMenu.down('#t'+this.itemId);
			// if(ispub =="gryhsz") {
				// this.setDisabled(true);
				// if(tSet) {
					// tSet.setDisabled(true);
				// }
			// } else {
				// if(tSet) {
					// tSet.setDisabled(false);
				// }
			// }
// 
			// return;
		// }
		// this.setDisabled(true);
	// }
// });

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	itemId:'sucfaxtSearchMenu',
	text:'表单数据查找',
	handler: searchTMenuHandler,
	updateStatus: function(selection) {
		if(template) {
			this.setDisabled(serverInfoModel.data.formData != 0?true:false);
			//如果是回收站
			var seles = FolderTree1.getSelectionModel().getSelection();
			// if(!seles[0]){
			// seles[0] = tempItem;
			// }
			if(seles[0].data.id == "gryhsz") {
				this.setDisabled(true);
			}
			return;
		}
		this.setDisabled(true);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '处理规则',
	itemId: 'sucRuleExecID',
	iconCls: 'replyICON',
	handler: function() {
		var grid = this.getTargetView();
		var sels = grid.getSelectionModel().getSelection();
		var ids = new Array();
		for(var p in sels) {
			ids.push(sels[p].data.outFaxID);
		}
		executeRuleProcess(grid, function() {
			grid.loadGrid();
		}, ids.join());
	},
	updateStatus: function(selection) {
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = infax_tbtnSetMenu.down('#t'+this.itemId);
		if(!ruleSettingFlag || folderid.indexOf('gryf') == -1) {
			this.hide();
			if(tSet) {
				tSet.setDisabled(true);
			}
		} else {
			this.show();
			if(tSet) {
				tSet.setDisabled(false);
			}
			this.setDisabled(selection.length == 0);
		}

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '提交任务',
	tooltip: '提交工作流审批任务',
	itemId: 'sucfaxsubwf',
	iconCls: 'workFlowTitle',
	handler: function() {
		var sm = this.getTargetView().getSelectionModel();
		var sels = sm.getSelection();
		if (sm.hasSelection() && sels.length > 0) {
			var faxids = new Array();
			//var fileids = new Array();
			Ext.Array.each(sels, function(record) {
				faxids.push(record.data.outFaxID);
				//fileids.push(record.data.faxFileID);
			});
			//alert(fileids.join());
			submitwfwin = loadsubmitwfwin();
			submitwfwin.faxids = faxids;
			//submitwfwin.fileids = fileids;
			submitwfwin.subtype = 'OUTFAX';
			//submitwfwin.fileId = fileId;
			submitwfwin.issendfaxwin = false;
			submitwfwin.show();
		}
	},
	updateStatus: function(selection) {
		//工作流
		if(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0) {
			this.setDisabled(selection.length == 0);
			return;
		}
		this.setDisabled(true);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '归档',
	tooltip: '归档',
	iconCls: 'faxtodoc',
	itemId: 'sucfaxColtDoc',
	handler: function(btn,eve,suppressLoad) {
		var issingle = true;
		var sm = this.getTargetView().getSelectionModel();
		if(sm.hasSelection() && sm.getSelection().length > 1) {
			issingle = false;
		}
		var privData = this.getTargetView().privData;		
		if(issingle) {
			var param = {};
			param.fileids = buildFaxIDs(sm.getSelection(),'faxFileID').join();
			param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
			WsCall.call('faxtodoc', param, function(response, opts) {
				var data = response.data;
				faxtodocsinglewin = loadfaxtodocsinglewin(data,privData);;
				faxtodocsinglewin.show(null, function() {
					faxtodocsinglewin.setPagePosition(faxtodocsinglewin.getPosition()[0],30);
					faxtodocsinglewin.down('#hidFileId').setValue(data);
					faxtodocsinglewin.down('#delAllFile').hide();
				});
			}, function(response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
			}, true,'加载中...',Ext.getBody(),50);
		} else {
			faxtodocwin = loadfaxtodocwin(issingle,privData);
			faxtodocwin.show();
		}
	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length < 1 || !onDocManager || serverInfoModel.data.wordManager != 0);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '全部类型',
	checked:true,
	group: 'succoutFaxAcFaxtype',
	itemId: 'allSuccfaxTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxTypeID').setText('全部类型');
		panel.getStore().filterMap.removeAtKey('faxtype');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxtype = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '内部传真',
	group: 'succoutFaxAcFaxtype',
	itemId: 'innerSuccfaxTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxTypeID').setText('内部传真');
		//		var value = 'Duration = 0';
		var value = '(WaveFaxUserID!=0 or WaveFaxPubFolderID!=0)';
		panel.getStore().filterMap.replace('faxtype', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxtype = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '外部传真',
	group: 'succoutFaxAcFaxtype',
	itemId: 'outSuccfaxTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxTypeID').setText('外部传真');
		var value = 'WaveFaxUserID=0 and WaveFaxPubFolderID=0';
		//		var value = 'Duration > 0';
		panel.getStore().filterMap.replace('faxtype', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxtype = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '导出',
	tooltip: '导出传真',
	itemId: 'expReportSucId',
	iconCls: 'exportICON',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var ids = new Array();
		if(sm.hasSelection()) {
			var records = sm.getSelection();
			ids = buildFaxIDs(records, 'outFaxID');
		}
		var win = Ext.create('WS.infax.ExportReport', {
			grid: panel,
			gridType: 'OUTFAX',
			selRecIds: ids
		});
		win.show('', function () {
			var items = win.grid.headerCt.items.items;
			var columns = win.down('#selColumnId');
			for(var i=0; i<items.length; i++) {
				columns.insert(i, {
					boxLabel: items[i].text,
					name: items[i].dataIndex
				});
			}
			var count = sm.hasSelection() ? sm.getSelection().length : 0;
			win.down('#allRecordsID').setText('共有' + ' '+ panel.getStore().getProxy().getReader().jsonData.total+ ' ' + '条记录');
			win.down('#selRecId').setDisabled(count == 0);
			win.down('#selRecordsID').setText('选中的记录有'+ ' ' + count+ ' ' + '条');
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(data && data.folderPrivExport == 0);
		//		this.setDisabled(true);
		var istrash = this.getTargetView().getStore().getProxy().extraParams.folderid;
		if(istrash == 'gryhsz') {
			this.hide();
		} else {
			this.show();
		}
		if(!serverInfoModel) {
			this.setDisabled(true);
		}
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshICON',
	itemId: 'refreshsuccoutfaxID',
	handler: function() {
		var panel = this.getTargetView();
		panel.getStore().filterMap.removeAtKey('filter');
		this.getTargetView().loadGrid();
		var treeSeles = panel.up('#viewPortEastID').down('#FolderTree').getSelectionModel().getSelection();
		if(template) {
			template.setTplGridTitle(panel,false,false,'foldertree');
		} else {
			panel.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
		}

	},
	updateStatus: function(selection) {

	}
});

var flag = 0;
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '全选/取消',
	itemId: 'allselsufID',
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

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '反选',
	itemId: 'otherselsufID',
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

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '传真信息查找',
	//tooltip: '自定义查找',
	iconCls: 'infaxSelfFilter',
	itemId: 'succoutfaxSelfFilterID',
	handler: function() {
		var m = this.getTargetView();
		var win = Ext.create('WS.succoutfax.SuccoutfaxSelfFilter', {
			grid: m
		});
		win.show('', function() {
			win.down('#recipID').focus(true);
			win.down('#startDateID').setValue(LocalToUTC(30));
			win.down('#endDateID').setValue(Ext.Date.format(new Date(), 'Y-m-d'));
		});
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '标签',
	tooltip: '修改标签',
	handler: function() {
		var panel = this.getTargetView()
		var win = Ext.create('WS.infax.ModInFlag', {
			grid: panel
		});
		win.down('#modID').setValue(panel.getSelectionModel().getSelection()[0].data.faxFlag);
		win.show('', function() {
			win.down('#modID').focus(true);
		});
	},
	iconCls: 'infaxaddflag',
	itemId: 'modflgsuccfaxID',

	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '注释',
	tooltip: '修改注释',
	iconCls: 'modifycomment',
	itemId: 'modifycommentID',
	handler: function() {
		var panel = this.getTargetView();
		var win = Ext.create('WS.infax.ModifyInfaxComm', {
			grid: panel
		});
		win.down('#modID').setValue(panel.getSelectionModel().getSelection()[0].data.comment);
		win.show('', function() {
			win.down('#modID').focus(true);
		});
	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '删除',
	tooltip: '删除选中的记录',
	iconCls: 'delinfax',
	itemId: 'delsoutfaxID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		var records = sm.getSelection();
		var store = currentPanel.getStore();
		var extraP = store.getProxy().extraParams;
		var ids = new Array();
		for(var p in records) {
			ids.push(records[p].data.outFaxID);
		}
		if(extraP.folderid == 'gryhsz') {
			newMesB.show({
				title:'提示',
				msg: '您确认是否要彻底删除所选择的记录？',
				buttons: Ext.MessageBox.YESNO,
				closable:false,
				fn: function(btn) {
					if(btn=='yes') {
						setReadFlagTask.cancel();
						store.remove(records);
						extraP.toTrash = '1';	//彻底删除
						extraP.idList = ids.join();
						store.sync();
						extraP.idList = '';
						for(var i=0; i<records.length; i++) {
							records[i].commit(true);			//将之前选中的数据设置脏数据为false
						}
						(new Ext.util.DelayedTask( function() {
								store.load();
							})).delay(500);
						//					currentPanel.loadGrid();

					}
				},
				icon: Ext.MessageBox.QUESTION
			});
		} else {
			Ext.create('Ext.window.Window', {
				iconCls: 'delinfax',
				title: '删除确认',
				height: 200,
				width: 250,
				layout: 'vbox',
				defaults: {
					margin: '3 10 2 10',
					width: 200,
					xtype: 'button'
				},
				resizable: false,
				modal: true,
				items: [{
					xtype: 'label',
					text: '您确认要删除所选记录吗？'
				},{
					text: '删除到回收站',
					handler: function() {
						store.remove(records);
						extraP.toTrash = '0';		// '0' 删除到回收站,'1'彻底删除
						extraP.idList = ids.join();
						store.sync();
						extraP.idList = '';
						//							for(var i=0; i<records.length; i++) {
						//								records[i].commit(true);			//将之前选中的数据设置脏数据为false
						//							}
						this.up('window').close();
						(new Ext.util.DelayedTask( function() {
								store.load();
							})).delay(500);
						//							currentPanel.loadGrid();
					}
				},{
					text: '彻底删除',
					handler: function() {
						store.remove(records);
						extraP.toTrash = '1';		// '0' 删除到回收站,'1'彻底删除
						extraP.idList = ids.join();
						store.sync();
						extraP.idList = '';
						//							for(var i=0; i<records.length; i++) {
						//								records[i].commit(true);			//将之前选中的数据设置脏数据为false
						//							}
						this.up('window').close();
						(new Ext.util.DelayedTask( function() {
								store.load();
							})).delay(500);
						//							currentPanel.loadGrid();
					}
				},{
					text: '取消',
					handler: function() {
						this.up('window').close();
					}
				}
				]
			}).show();
		}
	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '恢复',
	tooltip: '恢复到已发件箱',
	itemId: 'reStoreSoufID',
	iconCls: 'restoreICON',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		var param = {
			sessiontoken: getSessionToken(),
			faxIDs: Ext.JSON.encode(buildFaxIDs(sm.getSelection(), 'outFaxID'))
		};
		WsCall.call('reStoreSoufax', param, function (response, opts) {
			grid.loadGrid();
		}, function (response, opts) {
			if (!errorProcess(response.code)) {
				Ext.Msg.alert('失败', response.msg);
			}
		});
	},
	updateStatus: function(selection) {
		var istrash = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = sucfax_tbtnSetMenu.down('#t'+this.itemId);
		if(istrash != 'gryhsz') {
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
		this.setDisabled(selection.length == 0 || istrash != 'gryhsz');
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '重发',
	tooltip: '重新发送',
	iconCls: 'resendfax',
	itemId: 'resendID',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();     //通用呼叫
		if (sm.hasSelection() && sm.getSelection().length > 0) {

			var records = sm.getSelection();
			var param= {
				sessiontoken : getSessionToken(),
				faxids : Ext.JSON.encode(buildFaxIDs(records, 'outFaxID'))
			};
			WsCall.call('resend',param, function() {
				panel.loadGrid();
			}, function(res) {
				if (!errorProcess(res.code)) {
					Ext.Msg.alert('失败', res.msg);
				}
				panel.loadGrid();
			});
		}

	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '改号重发',
	tooltip: '改号重发',
	iconCls: 'modeResendICON',
	itemId: 'modifycoderesendID',
	handler: function() {
		var currentPanel = this.getTargetView()
		var sm = currentPanel.getSelectionModel();
		var records = sm.getSelection();
		var currentWin = Ext.create('WS.succoutfax.ModifyCodeResend', {
			grid: currentPanel
		});
		currentWin.down('form').getForm().loadRecord(records[0]);
		currentWin.down('#prioID').setValue(2);
		currentWin.show('', function() {
			currentWin.down('#faxNumID').focus(true);
		});
	},
	updateStatus: function(selection) {
		var faxNum = '';
		if(selection.length > 0) {
			faxNum = selection[0].data.faxNumber;
		}

		this.setDisabled(!(selection.length == 1) || faxNum.length == 0);
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '下载',
	tooltip: '下载传真',
	iconCls: 'infaxdownloadICON',
	itemId: 'downloadsuccoutfaxID',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		if (sm.hasSelection() && sm.getSelection().length > 0) {
			var smdata = sm.getSelection()[0].data;
			var win = Ext.create('WS.infax.DownloadFaxFile', {
				faxfileid: smdata.faxFileID
			});
			win.down('#fileNameID').setValue('faxfile' + smdata.outFaxID);
			win.show();
		}
	},
	updateStatus: function(selection) {
		this.setDisabled(!(selection.length == 1));
	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '全部时间',
	checked:true,
	group: 'succoutFaxAcTime',
	itemId: 'allFilterActionSuccoutfaxID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#suctimeID').setText('全部时间');
		panel.getStore().filterMap.removeAtKey('time');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.time = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '今天',
	group: 'succoutFaxAcTime',
	itemId: 'todayFilterActionSuccoutfaxID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#suctimeID').setText('今天');
		var value = tplPrefix +"sentDateTime>='" + LocalToUTCTime(0) + "' and "+tplPrefix +"sentDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.time = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '两天',
	group: 'succoutFaxAcTime',
	itemId: 'twodayFilterActionSuccoutfaxID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#suctimeID').setText('两天');
		var value = tplPrefix +"sentDateTime>='" + LocalToUTCTime(1) + "' and "+tplPrefix +"sentDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.time = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '一周',
	group: 'succoutFaxAcTime',
	itemId: 'weekFilterActionSuccoutfaxID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#suctimeID').setText('一周');
		var value = tplPrefix +"sentDateTime>='" + LocalToUTCTime(6) + "' and "+tplPrefix +"sentDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.time = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '一月',
	group: 'succoutFaxAcTime',
	itemId: 'monthFilterActionSuccoutfaxID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#suctimeID').setText('一月');
		var value = tplPrefix +"sentDateTime>='" + LocalToUTCTime(30) + "' and "+tplPrefix +"sentDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.time = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '自定义时间段',
	group: 'succoutFaxAcTime',
	itemId: 'selfFilterActionSuccoutfaxID',
	handler: function(btn,eve,suppressLoad) {
		if(suppressLoad) {
			return;
		}
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#suctimeID').setText('自定义时间段');
		var flag = false;
		if(sucDateWin == '') {
			flag = true;
			sucDateWin = Ext.create('WS.infax.InfaxDateFilter', {
				grid: panel
			});
		}
		sucDateWin.show('', function() {
			if(flag) {
				sucDateWin.down('#startDateID').setValue(LocalToUTC(30));
				sucDateWin.down('#endDateID').setValue(Ext.Date.format(new Date(), 'Y-m-d'));
			}
		});
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '全部状态',
	checked:true,
	group: 'succoutFaxAcStatus',
	itemId: 'allStatusSuccoutfaxID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucstatusID').setText('全部状态');
		panel.getStore().filterMap.removeAtKey('status');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.status = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '失败',
	group: 'succoutFaxAcStatus',
	itemId: 'stsFinishedFailedID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucstatusID').setText('失败');
		var value = tplPrefix +'status=8';
		panel.getStore().filterMap.replace('status', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.status = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '成功',
	group: 'succoutFaxAcStatus',
	itemId: 'stsFinishedOKID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucstatusID').setText('成功');
		var value = tplPrefix +'status=9';
		panel.getStore().filterMap.replace('status', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.status = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: '全部标签',
	checked:true,
	group: 'succoutFaxAcFaxFlag',
	itemId: 'allFaxFlagActionSuccID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText('全部标签');
		panel.getStore().filterMap.removeAtKey('faxflag');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[0],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'noFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[0]);
		var filter = tplPrefix +'faxFlag=0';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[1],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'oneFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[1]);
		var filter = tplPrefix +'faxFlag=1';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[2],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'twoFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[2]);
		var filter = tplPrefix +'faxFlag=2';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[3],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'threeFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[3]);
		var filter = tplPrefix +'faxFlag=3';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[4],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'fourFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[4]);
		var filter = tplPrefix +'faxFlag=4';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[5],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'fiveFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[5]);
		var filter = tplPrefix +'faxFlag=5';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[6],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'sixFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[6]);
		var filter = tplPrefix +'faxFlag=6';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[7],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'sevenFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[7]);
		var filter = tplPrefix +'faxFlag=7';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[8],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'eightFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[8]);
		var filter = tplPrefix +'faxFlag=8';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[9],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'nineFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[9]);
		var filter = tplPrefix +'faxFlag=9';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[10],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'tenFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[10]);
		var filter = tplPrefix +'faxFlag=10';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.succoutfax.SuccoutfaxAction', {
	text: faxFlagArr[11],
	group: 'succoutFaxAcFaxFlag',
	itemId: 'elFaxFlagActionSucc',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#sucfaxFlagID').setText(faxFlagArr[11]);
		var filter = tplPrefix +'faxFlag=11';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.succoutfaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.succoutfaxgridFilter;
		wsUserStates.setServerState('succoutfaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});