function searchTMenuHandler() {
	var tplid = currGrid.getStore().getProxy().extraParams.template;
	function serLast() {
		tplid = currGrid.getStore().getProxy().extraParams.template;
		//调用Call 取得模版信息
		// var param = {};
		// param.template = tplid;
		// param.sessiontoken = sessionToken;
		// // 调用
		// WsCall.call('gettemplate', param, function(response, opts) {
		template.myWinItems = new Array();
		template.myWinGItems.clear();
		var data = Ext.clone(template.saveTplInfo.get(tplid));
		Ext.Array.each(data, function(item,index,alls) {
			template.createContorl(item,true);
		});
		searchDataWin = loadSearchDataWin();
		var folderId = currGrid.getStore().getProxy().extraParams.folderid;
		searchDataWin.show('', function() {
			var findAll = searchDataWin.down('#findall');
			var setFlag = folderId.indexOf('gr') != -1 || folderId == 0;
			findAll.setValue(setFlag);
			findAll.setDisabled(setFlag);

		});
		// }, function(response, opts) {
		// if(!errorProcess(response.code)) {
		// Ext.Msg.alert('失败', response.msg);
		// }
		// }, true,'loading...',Ext.getBody(),50);
	}

	if(tplid !='') {
		serLast();
	} else {
		//Ext.Msg.alert('提示','该目录还没有选择模版');
		loadTemplateWin(serLast);
	}
}

Ext.define('WS.infax.Infax', {
	extend: 'WS.action.Base',
	category: 'Infax'
});

// Ext.create('WS.infax.Infax', {
	// itemId:'infaxtMenu',
	// iconCls:'tplBtnIconCls',
	// tooltip: '表单数据',
	// text:'表单数据',
	// menu: [],
	// updateStatus: function(selection) {
		// if(template) {
			// this.setDisabled((serverInfoModel.data.formData != 0 )?true:false);
			// //如果是回收站
			// var ispub = this.getTargetView().getStore().getProxy().extraParams.folderid;
			// var tSet = infax_tbtnSetMenu.down('#t'+this.itemId);
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

Ext.create('WS.infax.Infax', {
	itemId:'infaxtSearchMenu',
	text:'表单数据查找',
	handler: searchTMenuHandler,
	updateStatus: function(selection) {
		if(template) {
			this.setDisabled(serverInfoModel.data.formData != 0?true:false);
			//如果是回收站
			var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
			if(folderid == WaveFaxConst.RecycleFolderID || folderid == WaveFaxConst.PublicRecycleFolderID
				|| (typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1)) {
				this.setDisabled(true);
			}
			return;
		}
		this.setDisabled(true);
	}
});

Ext.create('WS.infax.Infax', {
	text: '提交任务',
	tooltip: '提交工作流审批任务',
	itemId: 'infaxsubwf',
	iconCls: 'workFlowTitle',
	handler: function() {
		var sm = this.getTargetView().getSelectionModel();
		var sels = sm.getSelection();
		if (sm.hasSelection() && sels.length > 0) {
			var faxids = new Array();
			//var fileids = new Array();
			Ext.Array.each(sels, function(record) {
				faxids.push(record.data.inFaxID);
				//fileids.push(record.data.faxFileID);
			});
			//alert(fileids.join());
			submitwfwin = loadsubmitwfwin();
			submitwfwin.faxids = faxids;
			//submitwfwin.fileids = fileids;
			submitwfwin.subtype = 'INFAX';
			//submitwfwin.fileId = fileId;
			submitwfwin.issendfaxwin = false;
			submitwfwin.show();
		}
	},
	updateStatus: function(selection) {
		//工作流
		if(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0) {
			var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
			this.setDisabled(selection.length == 0 || (typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
			return;
		}
		this.setDisabled(true);
	}
});

Ext.create('WS.infax.Infax', {
	text: '处理规则',
	itemId: 'inRuleExecID',
	iconCls: 'replyICON',
	handler: function() {
		var grid = this.getTargetView();
		var sels = grid.getSelectionModel().getSelection();
		var ids = new Array();
		for(var p in sels) {
			ids.push(sels[p].data.inFaxID);
		}
		executeRuleProcess(grid, function() {
			grid.loadGrid();
		}, ids.join());
	},
	updateStatus: function(selection) {
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = infax_tbtnSetMenu.down('#t'+this.itemId);
		if(!ruleSettingFlag || (folderid != WaveFaxConst.RootFolderID && folderid.indexOf('grxx') == -1
			&& folderid.indexOf('trwr') == -1)) {
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

Ext.create('WS.infax.Infax', {
	text: '回复',
	itemId: 'revertFaxID',
	iconCls: 'replyICON',
	handler: function() {
		var sm = this.getTargetView().getSelectionModel();     //通用呼叫
		if (sm.hasSelection() && sm.getSelection().length > 0) {
			sendFaxForward(sm, 3);
		}
	},
	updateStatus: function(selection) {
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		if(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1) {
			this.setDisabled(true);
			return;
		}
		if(selection && selection.length != 0) {
			var drType = selection[0].data.duration;
			if(drType > 0) {
				this.setDisabled(selection.length != 1);
			} else {
				var data = this.getTargetView().privData;
				this.setDisabled(selection.length != 1 || (data && data.folderPrivforword == 0));
			}
		} else {
			this.setDisabled(selection.length != 1);
		}
	}
});

Ext.create('WS.infax.Infax', {
	itemId:'infaxColtDoc',
	iconCls: 'faxtodoc',
	tooltip: '归档',
	text:'归档',
	handler: function() {
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
				faxtodocsinglewin.show(null,function(){
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
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length < 1 || !onDocManager || serverInfoModel.data.wordManager != 0 ||
			(data && data.folderPrivBackup == 0) || (typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '发传真',
	itemId: 'sendfaxbygrid',
	iconCls: 'sendfax',
	tooltip: '提交新传真',
	handler: function() {
		if (sendfaxwin == '') {
			sendfaxwin = loadsendfaxwin();
		} // if
		else {
			if(sendfaxwin.collapsed) {
				sendfaxwin.expand();
			}
			sendfaxwin.show();
			// sendfaxwin.fireEvent('show',sendfaxwin);
			// var top = document.body.clientHeight - sendfaxwin.getHeight();
			// top = top < 0 ?10:top/2;
			// var left = document.body.clientWidth - sendfaxwin.getWidth();
			// left = left < 0 ?10:left/2;
			// sendfaxwin.el.dom.style.left=left+"px";
			// sendfaxwin.el.dom.style.top=top+"px";
			// sendfaxwin.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
			// Ext.WindowManager.bringToFront(sendfaxwin);
		}
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: '导出',
	itemId: 'expReportId',
	iconCls: 'exportICON',
	tooltip: '导出收件箱报表',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var ids = new Array();
		if(sm.hasSelection()) {
			var records = sm.getSelection();
			ids = buildFaxIDs(records, 'inFaxID');
		}
		var win = Ext.create('WS.infax.ExportReport', {
			grid: panel,
			gridType: 'INFAX',
			selRecIds: ids
		});
		win.show('', function () {
			var items = win.grid.headerCt.items.items;
			var columns = win.down('#selColumnId');
			for(var i=0; i<items.length; i++) {
				if(items[i].dataIndex != 'version') {
					columns.insert(i, {
						boxLabel: items[i].text,
						name: items[i].dataIndex
					});
				}
			}

			var count = sm.hasSelection() ? sm.getSelection().length : 0;
			win.down('#allRecordsID').setText('共有' + ': '+ panel.getStore().getProxy().getReader().jsonData.total + ' '+ '条记录');
			win.down('#selRecId').setDisabled(count == 0);
			win.down('#selRecordsID').setText('选中的记录有' + ': '+count + ' '+ '条');
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(data && data.folderPrivExport == 0);
		//this.setDisabled(true);
		var istrash = this.getTargetView().getStore().getProxy().extraParams.folderid;
		if(istrash == WaveFaxConst.RecycleFolderID || istrash == WaveFaxConst.PublicRecycleFolderID
			|| (typeof(istrash) == 'string' && istrash.indexOf('trwr') != -1)) {
			this.hide();
		} else {
			//判断当前工具栏设置
			if(myStates.faxtoolBtn[this.itemId]) {
				this.show();
			}
		}

		if(!serverInfoModel) {
			this.setDisabled(true);
		}

	}
});

Ext.create('WS.infax.Infax', {
	text: '属性',
	iconCls: 'propertyICON',
	itemId: 'modCallerID',
	tooltip: '修改属性',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var records = sm.getSelection();
		var win = Ext.create('WS.infax.ModCaller', {
			grid: panel
		});
		win.down('form').getForm().loadRecord(records[0]);
		win.show('', function() {
			win.down('#callNameID').focus(true);
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivModify == 0) || 
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '注释',
	iconCls: 'modifycomment',
	itemId: 'modifyinfaxcommentID',
	tooltip: '修改注释',
	handler: function() {
		var panel = this.getTargetView();
		if(modifycommentwin == '') {
			modifycommentwin = Ext.create('WS.infax.ModifyInfaxComm', {
				grid: panel
			});
		}
		modifycommentwin.down('form').getForm().reset();
		modifycommentwin.down('#modID').setValue(panel.getSelectionModel().getSelection()[0].data.comment);
		modifycommentwin.show('', function() {
			modifycommentwin.down('#modID').focus(true);
			//win.down('form').getForm().reset();
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivModify == 0) ||
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '全部类型',
	checked:true,
	group: 'inFaxAcFaxtype',
	itemId: 'allInfaxTypeID',
	handler: function(btn,eve,suppressLoad) {

		var panel = this.getTargetView();
		panel.down('#faxTypeID').setText('全部类型');
		panel.getStore().filterMap.removeAtKey('faxtype');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxtype = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: '内部传真',
	group: 'inFaxAcFaxtype',
	itemId: 'innerInfaxTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxTypeID').setText('内部传真');
		var value = tplPrefix +'Duration = 0';
		panel.getStore().filterMap.replace('faxtype', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxtype = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.infax.Infax', {
	text: '外部传真',
	group: 'inFaxAcFaxtype',
	itemId: 'outInfaxTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxTypeID').setText('外部传真');
		var value = tplPrefix +'Duration > 0';
		panel.getStore().filterMap.replace('faxtype', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxtype = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.infax.Infax', {
	text: '全部时间',
	checked:true,
	group: 'inFaxAcTime',
	itemId: 'allFilterActionID',
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
		myStates.infaxgridFilter.time = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: '今天',
	group: 'inFaxAcTime',
	itemId: 'todayFilterActionID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('今天');
		var value = tplPrefix +"ReceiveDateTime>='" + LocalToUTCTime(0) + "' and "+tplPrefix +"ReceiveDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.time = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: '两天',
	group: 'inFaxAcTime',
	itemId: 'twodayFilterActionID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('两天');
		var value = tplPrefix +"ReceiveDateTime>='" + LocalToUTCTime(1) + "' and "+tplPrefix +"ReceiveDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.time = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: '一周',
	group: 'inFaxAcTime',
	itemId: 'weekFilterActionID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('一周');
		var value = tplPrefix +"ReceiveDateTime>='" + LocalToUTCTime(6) + "' and "+tplPrefix +"ReceiveDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.time = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: '一月',
	group: 'inFaxAcTime',
	itemId: 'monthFilterActionID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('一月');
		var value = tplPrefix +"ReceiveDateTime>='" + LocalToUTCTime(30) + "' and "+tplPrefix +"ReceiveDateTime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.time = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: '自定义时间段',
	group: 'inFaxAcTime',
	itemId: 'selfFilterActionID',
	handler: function(btn,eve,suppressLoad) {
		if(suppressLoad) {
			return;
		}
		var panel = this.getTargetView();
		panel.down('#menuID').setText('自定义时间段');
		var flag = false;
		if(infaxDateWin == '') {
			flag = true;
			infaxDateWin = Ext.create('WS.infax.InfaxDateFilter', {
				grid: panel
			});
		}
		infaxDateWin.show('', function() {
			if(flag) {
				infaxDateWin.down('#startDateID').setValue(LocalToUTC(30));
				infaxDateWin.down('#endDateID').setValue(Ext.Date.format(new Date(), 'Y-m-d'));
			}
		});
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: '全部标签',
	checked:true,
	group: 'inFaxAcFlag',
	itemId: 'allFaxFlagActionID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText('全部标签');
		panel.getStore().filterMap.removeAtKey('faxflag');
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: faxFlagArr[0],
	group: 'inFaxAcFlag',
	itemId: 'noFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[0]);
		var filter = tplPrefix +'faxFlag=0';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: faxFlagArr[1],
	group: 'inFaxAcFlag',
	itemId: 'oneFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[1]);
		var filter = tplPrefix +'faxFlag=1';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[2],
	group: 'inFaxAcFlag',
	itemId: 'twoFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[2]);
		var filter = tplPrefix +'faxFlag=2';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[3],
	group: 'inFaxAcFlag',
	itemId: 'threeFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[3]);
		var filter = tplPrefix +'faxFlag=3';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: faxFlagArr[4],
	group: 'inFaxAcFlag',
	itemId: 'fourFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[4]);
		var filter = tplPrefix +'faxFlag=4';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[5],
	group: 'inFaxAcFlag',
	itemId: 'fiveFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[5]);
		var filter = tplPrefix +'faxFlag=5';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[6],
	group: 'inFaxAcFlag',
	itemId: 'sixFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[6]);
		var filter = tplPrefix +'faxFlag=6';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: faxFlagArr[7],
	group: 'inFaxAcFlag',
	itemId: 'sevenFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[7]);
		var filter = tplPrefix +'faxFlag=7';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[8],
	group: 'inFaxAcFlag',
	itemId: 'eightFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[8]);
		var filter = tplPrefix +'faxFlag=8';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[9],
	group: 'inFaxAcFlag',
	itemId: 'nineFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[9]);
		var filter = tplPrefix +'faxFlag=9';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[10],
	group: 'inFaxAcFlag',
	itemId: 'tenFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[10]);
		var filter = tplPrefix +'faxFlag=10';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.infax.Infax', {
	text: faxFlagArr[11],
	group: 'inFaxAcFlag',
	itemId: 'elFaxFlagAction',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[11]);
		var filter = tplPrefix +'faxFlag=11';
		panel.getStore().filterMap.replace('faxflag', filter);

		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}

		//保存变量并上传
		var me = this;
		myStates.infaxgridFilter.faxflag = me.itemId;
		var tmpS = myStates.infaxgridFilter;
		wsUserStates.setServerState('infaxgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.infax.Infax', {
	text: '传真信息查找',
	iconCls: 'infaxSelfFilter',
	itemId: 'infaxSelfFilterID',
	//tooltip: '自定义查找',
	handler: function() {
		var win = Ext.create('WS.infax.InfaxSelfFilter', {
			grid: this.getTargetView()
		});
		win.show('', function() {
			var folderid = win.grid.getStore().getProxy().extraParams.folderid.toString();
			win.down('#allsrcID').setDisabled(folderid == WaveFaxConst.RecycleFolderID ||
			folderid == WaveFaxConst.PublicRecycleFolderID);
			//共享目录
			if(folderid.indexOf('gr') == -1 && folderid != WaveFaxConst.RootFolderID
			&& folderid != WaveFaxConst.RecycleFolderID) {
				win.down('#allsrcID').boxLabelEl.update('在所有共享子目录下查找');
			}
			win.down('#callerID').focus(true);
			win.down('#startDateID').setValue(LocalToUTC(30));
			win.down('#endDateID').setValue(Ext.Date.format(new Date(), 'Y-m-d'));
		});
	},
	updateStatus: function(selection) {
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1);
	}
});

Ext.create('WS.infax.Infax', {
	text: '修改标签',
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
	itemId: 'modflgID',

	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivModify == 0) || 
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '全选/取消',
	itemId: 'allselectID',
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

Ext.create('WS.infax.Infax', {
	text: '反选',
	itemId: 'otherselectID',
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

Ext.create('WS.infax.Infax', {
	text: '标记为已读',

	itemId: 'readID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		if(sm.hasSelection()) {
			var records = sm.getSelection();
			for(var i=0; i<records.length; i++) {
				records[i].set('version', '1');    //标记为已读
			}
			currentPanel.getStore().sync();
			for(var i=0; i<records.length; i++) {
				records[i].commit(true);			//将之前选中的数据设置脏数据为false
			}
			getIsReadCount(Ext.StoreMgr.lookup('folderTrstoreId'), currentPanel.getStore().getProxy().extraParams.folderid);
		} else {
			Ext.Msg.alert('错误', '请选择您要标记的行！');
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivView == 0) || 
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '标记为未读',
	itemId: 'noreadID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		if(sm.hasSelection()) {
			var records = sm.getSelection();
			for(var i=0; i<records.length; i++) {
				records[i].set('version', '0');    //标记为未读
			}
			currentPanel.getStore().sync();
			for(var i=0; i<records.length; i++) {
				records[i].commit(true);			//将之前选中的数据设置脏数据为false
			}
			getIsReadCount(Ext.StoreMgr.lookup('folderTrstoreId'), currentPanel.getStore().getProxy().extraParams.folderid);
		} else {
			Ext.Msg.alert('错误', '请选择您要标记的行！');
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivView == 0)
			|| (typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

//删除选中行action
Ext.create('WS.infax.Infax', {
	text: '删除',
	iconCls: 'delinfax',
	itemId: 'delinfaxID',
	tooltip: '删除选中记录',
	handler: function() {
		setReadFlagTask.cancel();
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		var records = sm.getSelection();
		sm.deselectAll(true);
		var store = currentPanel.getStore();
		var extraP = store.getProxy().extraParams;
		var ids = new Array();
		for(var p in records) {
			ids.push(records[p].data.inFaxID);
		}
		if(extraP.folderid == WaveFaxConst.RecycleFolderID || extraP.folderid == WaveFaxConst.PublicRecycleFolderID) {
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
						(new Ext.util.DelayedTask( function() {
								store.load();
								getIsReadCount(Ext.StoreMgr.lookup('folderTrstoreId'), extraP.folderid);
							})).delay(500);
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
						setReadFlagTask.cancel();
						store.remove(records);
						extraP.toTrash = '0';		// '0' 删除到回收站,'1'彻底删除
						extraP.idList = ids.join();
						store.sync();
						extraP.idList = '';
						this.up('window').close();
						(new Ext.util.DelayedTask( function() {
								store.load();
								getIsReadCount(Ext.StoreMgr.lookup('folderTrstoreId'), extraP.folderid);
							})).delay(500);
					}
				},{
					text: '彻底删除',
					handler: function() {
						store.remove(records);
						extraP.toTrash = '1';		// '0' 删除到回收站,'1'彻底删除
						extraP.idList = ids.join();
						store.sync();
						extraP.idList = '';
						this.up('window').close();
						(new Ext.util.DelayedTask( function() {
								store.load();
								getIsReadCount(Ext.StoreMgr.lookup('folderTrstoreId'), extraP.folderid);
							})).delay(500);
					}
				},{
					text: '取消',
					handler: function() {
						this.up('window').close();
					}
				}]
			}).show();
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivDelete == 0) || 
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '下载',
	iconCls: 'infaxdownloadICON',
	tooltip: '下载传真',
	itemId: 'downloadfaxID',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		if (sm.hasSelection() && sm.getSelection().length > 0) {
			var smdata = sm.getSelection()[0].data;
			var win = Ext.create('WS.infax.DownloadFaxFile', {
				faxfileid: smdata.faxFileID
			});
			win.down('#fileNameID').setValue('faxfile' + smdata.inFaxID);
			win.show();
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(!(selection.length == 1) || (data && data.folderPrivView == 0) || 
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});
Ext.create('WS.infax.Infax', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshICON',
	itemId: 'refreshinfaxID',
	handler: function() {
		var panel = this.getTargetView();
		var store = panel.getStore();
		store.filterMap.removeAtKey('filter');
		store.getProxy().extraParams.folderFlag = '';	//将忽略folderid移除
		panel.loadGrid();
		var tree = panel.up('#viewPortEastID').down('#FolderTree');
		var treeSeles = tree.getSelectionModel().getSelection();

		if(template) {
			template.setTplGridTitle(panel,false,false,'foldertree');
		} else {
			panel.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
		}
		getIsReadCount(tree.getStore(), store.getProxy().extraParams.folderid);
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.infax.Infax', {
	text: '转发到传真',
	itemId: 'resendinfaxID',
	handler: function() {
		var sm = this.getTargetView().getSelectionModel();     //通用呼叫
		if (sm.hasSelection() && sm.getSelection().length > 0) {
			sendFaxForward(sm,1);
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length != 1 || (data && data.folderPrivforword == 0) || 
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '转发到邮件',
	iconCls:'actionRewardMail',
	itemId: 'resendemailID',
	handler: function() {
		if(userConfig.myEmail == '' || userConfig.sendService == '') {
			newMesB.show({
				title:'错误',
				msg: '您还未设置邮件服务器信息，是否现在设置？',
				buttons: Ext.Msg.YESNO,
				fn: function(btn) {
					if (btn == 'yes') {
						if(systemconfigwin_sys == ''){
		        			systemconfigwin_sys = loadsystemconfigwin_sys();
		        		}
		        		systemconfigwin_sys.show();	
						systemconfigwin_sys.down('#tabSys').setActiveTab(1);// 聚焦到邮件服务
					}
				},
				icon: Ext.window.MessageBox.QUESTION
			});
			return;
		}
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var records = sm.getSelection();
		var text = "";
		for(var i=0; i<records.length; i++) {
			text += records[i].data.inFaxID + '.tif;';
		}
		if(inforEmailWin == '') {
			inforEmailWin = Ext.create('WS.infax.InforEmail', {
				grid: panel
			});
		}

		inforEmailWin.show('', function() {
			inforEmailWin.down('#multipartID').setValue(text);

		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		var folderid = this.getTargetView().getStore().getProxy().extraParams.folderid;
		this.setDisabled(selection.length != 1 || (data && data.folderPrivforword == 0) || 
			(typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '内部转发',
	tooltip: '内部转发',
	itemId: 'inresendinfaxID',
	iconCls: 'inresendifICON',
	handler: function() {
		var panel = this.getTargetView();
		if(faxforwardwin == '') {
			faxforwardwin = Ext.create('WS.infax.InForward', {
				grid: panel,
				isInForWard:true
			});
		} else {
			faxforwardwin.isInForWard = true;
			faxforwardwin.isDocSearch = '';
			faxforwardwin.grid = panel;
		}
		// var win =
		//清空内部转发数据
		//secondGridStore.loadData([]);
		//directoryGridStore.loadData([]);
		Ext.StoreMgr.lookup('userdicStore').loadData([]);
		//清空内部转发附件列表
		faxforwardwin.down('#tabpalFiles').setDisabled(true);
		faxforwardwin.down('#rdDic').setDisabled(false);
		faxforwardwin.down('#rdUser').setValue(true);

		//faxforwardwin.down('#isDelID').setVisible(true);

		var delPri = panel.privData.folderPrivDelete;
		faxforwardwin.setWidth(900);
		faxforwardwin.setTitle('本地内部传真');
		faxforwardwin.down('#ugTargetId').setTitle('到用户(共享文件夹)');
		faxforwardwin.down('#forwarUserDic').setTitle('到目标');
		faxforwardwin.show('', function() {
			faxforwardwin.center();
			faxforwardwin.down('#isDelID').setDisabled(false);
			if(delPri == 0) {
				faxforwardwin.down('#isDelID').setValue(false);
				faxforwardwin.down('#isDelID').setDisabled(true);
			} else {
				faxforwardwin.down('#isDelID').setVisible(true);
				faxforwardwin.down('#isDelID').setDisabled(false);
			}

			faxforwardwin.down('#userID').loadGrid(true);
			Ext.StoreMgr.removeAtKey ('directoryTree_store');
			Ext.create('Ext.data.TreeStore', {
				model: 'directoryTree_Model',
				defaultRootId: WaveFaxConst.PublicRootFolderID,
				storeId: 'directoryTree_store',
				//autoLoad:false,
				proxy: {
					type: 'ajax',
					url: WsConf.Url,
					extraParams: {
						req: 'treenodes',
						treename: 'addrtree',
						restype: 'json',
						sessiontoken:Ext.util.Cookies.get("sessiontoken"),
						needcheck:true
					},
					reader : {
						type : 'json',
						root: 'treeset',
						seccessProperty: 'success',
						messageProperty: 'msg'
					},
					actionMethods: 'POST'
				},
				root: {
					expanded: false,
					text: "共享收件夹",
					iconCls: 'fax',
					checked:false
				},
				loadTree: function() {
					var store =this;
					var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
					if(!sessiontoken || sessiontoken.length ==0) {
						return;
					}
					store.getProxy().extraParams.req = "treenodes";
					store.getProxy().extraParams.treename = "addrtree";
					store.getProxy().extraParams.restype = "json";
					store.getProxy().extraParams.needcheck = true;
					store.load();
				}
			});

			//faxforwardwin.down('#dirSrcTree').getStore().loadTree();
			var serF = faxforwardwin.down('#serFielID');
			serF.store = faxforwardwin.down('#userID').getStore();
			serF.reset();
			serF.onTrigger1Click();
			faxforwardwin.down('tabpanel').setActiveTab('forwarUserDic');
		});
	},
	updateStatus: function(selection) {
		var grid = this.getTargetView();
		var istrash = grid.getStore().getProxy().extraParams.folderid;
		var data = grid.privData;
		this.setDisabled(selection.length == 0 || istrash == WaveFaxConst.RecycleFolderID || istrash == WaveFaxConst.PublicRecycleFolderID
		|| (data && data.folderPrivforword == 0) || (typeof(istrash) == 'string' && istrash.indexOf('trwr') != -1));
	}
});

Ext.create('WS.infax.Infax', {
	text: '恢复',
	tooltip: '恢复到收件箱',
	itemId: 'reStoreInfID',
	iconCls: 'restoreICON',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		
		var param = {
			gridType: grid.getXType(),
			sessiontoken: getSessionToken(),
			faxIDs: Ext.JSON.encode(buildFaxIDs(sm.getSelection(), 'inFaxID'))
		};
		WsCall.call('reStoreInfax', param, function (response, opts) {
			grid.loadGrid();
		}, function (response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('失败', response.msg);
			}
			grid.loadGrid();
		});
	},
	updateStatus: function(selection) {
		var istrash = this.getTargetView().getStore().getProxy().extraParams.folderid;
		var tSet = infax_tbtnSetMenu.down('#t'+this.itemId);
		if(istrash != WaveFaxConst.RecycleFolderID && istrash != WaveFaxConst.PublicRecycleFolderID) {
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
		this.setDisabled(selection.length == 0);

	}
});