Ext.define('WS.docmanager.docmanager', {
	extend: 'WS.action.Base',
	category: 'docmanager'
});


// Ext.create('WS.docmanager.docmanager', {
	// itemId:'docgridtMenu',
	// iconCls:'tplBtnIconCls',
	// tooltip: '表单数据',
	// text:'表单数据',
	// menu: [],
	// updateStatus: function(selection) {
		// if(template) {
			// this.setDisabled((serverInfoModel.data.formData != 0 )?true:false);
			// //如果是回收站
			// var ispub = this.getTargetView().getStore().getProxy().extraParams.folderid;
			// var tSet = docgrid_tbtnSetMenu.down('#t'+this.itemId);
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

Ext.create('WS.docmanager.docmanager', {
	text: '提交任务',
	tooltip: '提交工作流审批任务',
	itemId: 'docsubwf',
	iconCls: 'workFlowTitle',
	handler: function() {
		var sm = this.getTargetView().getSelectionModel();    
		var sels = sm.getSelection(); 
		if (sm.hasSelection() && sels.length > 0) {
			var faxids = new Array();
			//var fileids = new Array();
			Ext.Array.each(sels,function(record){
				faxids.push(record.data.docID);
				//fileids.push(record.data.faxFileID);
			});
			//alert(fileids.join());
			submitwfwin = loadsubmitwfwin();
			submitwfwin.faxids = faxids;
			//submitwfwin.fileids = fileids;
			submitwfwin.subtype = 'DOCUMENT';
			//submitwfwin.fileId = fileId;
			submitwfwin.issendfaxwin = false;
			submitwfwin.show();
		}
	},
	updateStatus: function(selection) {		
		//工作流任务
		if(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0){
			this.setDisabled(selection.length == 0);
			return;	
		}
		this.setDisabled(true);		
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '打开',
	tooltip: '打开/编辑文档',
	itemId: 'docopenac',
	iconCls: 'editDoc',
	handler: function() {
		var sm = this.getTargetView().getSelectionModel();    
		var sels = sm.getSelection(); 
		if(docopenwin ==''){
			docopenwin = loaddocopenwin(sels[0]);
		}else{
			docopenwin = loaddocopenwin(sels[0],docopenwin);
		}
		docopenwin.show();
	},
	updateStatus: function(selection) {		
		this.setDisabled(selection.length != 1);			
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '转发到邮件',
	iconCls:'actionRewardMail',
	itemId: 'resendemailDocID',
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
			text += records[i].data.docID + '.tif;';
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
		this.setDisabled(selection.length != 1 || (data && data.folderPrivforword == 0));
	}
});

Ext.create('WS.docmanager.docmanager', {
	itemId:'docgridtCreateDocTiff',
	iconCls: 'docAdd',
	text:'新建',
	tooltip: '新建文档',
	handler: function(){
		if (docaddwin == '') {
			docaddwin = loaddocaddwin().show();
			docaddwin.fireEvent('show',docaddwin);
		} // if
		else {
			if(docaddwin.collapsed) {
				docaddwin.expand();
			}
			docaddwin.fireEvent('show',docaddwin);
			var top = document.body.clientHeight - docaddwin.getHeight();
			top = top < 0 ?10:top/2;
			var left = document.body.clientWidth - docaddwin.getWidth();
			left = left < 0 ?10:left/2;
			docaddwin.el.dom.style.left=left+"px";
			docaddwin.el.dom.style.top=top+"px";
			//docaddwin.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
			Ext.WindowManager.bringToFront(docaddwin);
		}
	},
	updateStatus: function(selection) {		
		var data = this.getTargetView().privData;
		this.setDisabled(data && data.folderPrivAdd == 0);
	}
});

Ext.create('WS.docmanager.docmanager', {
	itemId:'docgridtSearchMenu',
	text:'表单数据查找',
	handler: searchTMenuHandler,
	updateStatus: function(selection) {
		if(template) {
			this.setDisabled(serverInfoModel.data.formData != 0?true:false);
			//如果是回收站
			var seles = docTree.getSelectionModel().getSelection();
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



Ext.create('WS.docmanager.docmanager', {
	text: '导出',
	itemId: 'docgridExpReport',
	iconCls: 'exportICON',
	tooltip: '导出报表',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var ids = new Array();
		if(sm.hasSelection()) {
			var records = sm.getSelection();
			ids = buildFaxIDs(records, 'docID');
		}
		var win = Ext.create('WS.infax.ExportReport', {
			grid: panel,
			gridType: 'DOCUMENT',
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
		if(istrash == WaveFaxConst.RecycleFolderID || istrash == WaveFaxConst.PublicRecycleFolderID) {
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

Ext.create('WS.docmanager.docmanager', {
	text: '属性',
	iconCls: 'propertyICON',
	itemId: 'docgridModCaller',
	tooltip: '修改属性',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var records = sm.getSelection();
		var win = Ext.create('WS.infax.ModCaller', {
			grid: panel
		});
		win.down('form').getForm().loadRecord(records[0]);
		var v1 = win.down('#callNameID');
		v1.fieldLabel= '自定义编号';
		v1.maxLength= 250;
		v1.maxLengthText= '最大长度为250';
		v1.setValue(records[0].get('customID'));
		var v2 = win.down('#callOrgID');
		v2.fieldLabel= '关键字';
		v2.maxLength= 1024;
		v2.maxLengthText= '最大长度为1024';
		v2.setValue(records[0].get('keyWord'));
		win.show();
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivModify == 0));
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '注释',
	iconCls: 'modifycomment',
	itemId: 'modifydocgridcommentID',
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
		this.setDisabled(selection.length == 0 || (data && data.folderPrivModify == 0));
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '全部类型',
	checked:true,
	group: 'docgridAcFaxtype',
	itemId: 'alldocgridTypeID',
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
		myStates.docgridFilter.faxtype = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '传真收件箱',
	group: 'docgridAcFaxtype',
	itemId: 'infaxdocgridTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxTypeID').setText('传真收件箱');
		var value = tplPrefix +"resourcetype='INFAX'";
		panel.getStore().filterMap.replace('faxtype', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxtype = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '传真已发件箱',
	group: 'docgridAcFaxtype',
	itemId: 'sucfaxdocgridTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxTypeID').setText('传真已发件箱');
		var value = tplPrefix +"resourcetype='OUTFAX'";
		panel.getStore().filterMap.replace('faxtype', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxtype = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '归档',
	group: 'docgridAcFaxtype',
	itemId: 'coltdocgridTypeID',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxTypeID').setText('归档');
		var value = tplPrefix +"resourcetype='DOCUMENT'";
		panel.getStore().filterMap.replace('faxtype', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxtype = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});


Ext.create('WS.docmanager.docmanager', {
	text: '全部时间',
	checked:true,
	group: 'docgridAcTime',
	itemId: 'allFilterdocgrid',
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
		myStates.docgridFilter.time = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '今天',
	group: 'docgridAcTime',
	itemId: 'todayFilterdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('今天');
		var value = tplPrefix +"createdatetime>='" + LocalToUTCTime(0) + "' and "+tplPrefix +"createdatetime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.time = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '两天',
	group: 'docgridAcTime',
	itemId: 'twodayFilterdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('两天');
		var value = tplPrefix +"createdatetime>='" + LocalToUTCTime(1) + "' and "+tplPrefix +"createdatetime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.time = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: '一周',
	group: 'docgridAcTime',
	itemId: 'weekFilterdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('一周');
		var value = tplPrefix +"createdatetime>='" + LocalToUTCTime(6) + "' and "+tplPrefix +"createdatetime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.time = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: '一月',
	group: 'docgridAcTime',
	itemId: 'monthFilterdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#menuID').setText('一月');
		var value = tplPrefix +"createdatetime>='" + LocalToUTCTime(30) + "' and "+tplPrefix +"createdatetime<='" + LocalToUTCTime(0, true) + "'";
		panel.getStore().filterMap.replace('time', value);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.time = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '自定义时间段',
	group: 'docgridAcTime',
	itemId: 'selfFilterdocgrid',
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

Ext.create('WS.docmanager.docmanager', {
	text: '全部标签',
	checked:true,
	group: 'docgridAcFlag',
	itemId: 'allFaxFlagdocgrid',
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
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[0],
	group: 'docgridAcFlag',
	itemId: 'noFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[0]);
		var filter = tplPrefix +'docflag=0';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[1],
	group: 'docgridAcFlag',
	itemId: 'oneFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[1]);
		var filter = tplPrefix +'docflag=1';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[2],
	group: 'docgridAcFlag',
	itemId: 'twoFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[2]);
		var filter = tplPrefix +'docflag=2';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[3],
	group: 'docgridAcFlag',
	itemId: 'threeFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[3]);
		var filter = tplPrefix +'docflag=3';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[4],
	group: 'docgridAcFlag',
	itemId: 'fourFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[4]);
		var filter = tplPrefix +'docflag=4';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[5],
	group: 'docgridAcFlag',
	itemId: 'fiveFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[5]);
		var filter = tplPrefix +'docflag=5';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[6],
	group: 'docgridAcFlag',
	itemId: 'sixFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[6]);
		var filter = tplPrefix +'docflag=6';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[7],
	group: 'docgridAcFlag',
	itemId: 'sevenFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[7]);
		var filter = tplPrefix +'docflag=7';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[8],
	group: 'docgridAcFlag',
	itemId: 'eightFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[8]);
		var filter = tplPrefix +'docflag=8';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[9],
	group: 'docgridAcFlag',
	itemId: 'nineFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[9]);
		var filter = tplPrefix +'docflag=9';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[10],
	group: 'docgridAcFlag',
	itemId: 'tenFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[10]);
		var filter = tplPrefix +'docflag=10';
		panel.getStore().filterMap.replace('faxflag', filter);
		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docmanager', {
	text: faxFlagArr[11],
	group: 'docgridAcFlag',
	itemId: 'elFaxFlagdocgrid',
	handler: function(btn,eve,suppressLoad) {
		var panel = this.getTargetView();
		panel.down('#faxFlagID').setText(faxFlagArr[11]);
		var filter = tplPrefix +'docflag=11';
		panel.getStore().filterMap.replace('faxflag', filter);

		if(suppressLoad) {
			this.setChecked(suppressLoad);
			return;
		}

		//保存变量并上传
		var me = this;
		myStates.docgridFilter.faxflag = me.itemId;
		var tmpS = myStates.docgridFilter;
		wsUserStates.setServerState('docgridFilter',tmpS);
		panel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '文档信息查找',
	iconCls: 'docgridSelfFilter',
	itemId: 'docgridSelfFilterID',
	//tooltip: '自定义查找',
	handler: function() {
		var win = Ext.create('WS.docmanager.docmanagerSelfFilter', {
			grid: this.getTargetView()
		});
		win.show('', function() {
			var folderid = win.grid.getStore().getProxy().extraParams.folderid.toString();
			var allCont = win.down('#allsrcID');
			allCont.setDisabled(folderid == WaveFaxConst.RecycleFolderID ||
			folderid == WaveFaxConst.PublicRecycleFolderID);
			//共享目录
			if(folderid.indexOf('gr') == -1 && folderid != WaveFaxConst.RecycleFolderID) {
				allCont.boxLabelEl.update('在所有共享子目录下查找');
			}
			var sTime = LocalToUTC(30);
			var eTime = Ext.Date.format(new Date(), 'Y-m-d');
			win.down('#startDateID').setValue(sTime);
			win.down('#endDateID').setValue(eTime);
			win.down('#startDateModID').setValue(sTime);
			win.down('#endDateModID').setValue(eTime);
		});
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '修改标签',
	iconCls: 'infaxaddflag',
	itemId: 'modflgdocgrid',
	handler: function() {
		var panel = this.getTargetView()
		var win = Ext.create('WS.infax.ModInFlag', {
			grid: panel
		});
		win.down('#modID').setValue(panel.getSelectionModel().getSelection()[0].data.docFlag);
		win.show('', function() {
			win.down('#modID').focus(true);
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivModify == 0));
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '全选/取消',
	itemId: 'allselectdocgrid',
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

Ext.create('WS.docmanager.docmanager', {
	text: '反选',
	itemId: 'otherselectdocgrid',
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

Ext.create('WS.docmanager.docmanager', {
	text: '标记为已读',
	itemId: 'readdocgrid',
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
			getIsReadCount(Ext.StoreMgr.lookup('docTrstoreId'), currentPanel.getStore().getProxy().extraParams.folderid);
		} else {
			Ext.Msg.alert('错误', '请选择您要标记的行！');
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivView == 0));
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '标记为未读',
	itemId: 'noreaddocgrid',
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
			getIsReadCount(Ext.StoreMgr.lookup('docTrstoreId'), currentPanel.getStore().getProxy().extraParams.folderid);
		} else {
			Ext.Msg.alert('错误', '请选择您要标记的行！');
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(selection.length == 0 || (data && data.folderPrivView == 0));
	}
});


function delRefFn(extraP, store, records, ids, folderId, win) {
	newMesB.show({
		title:'提示',
		msg: '是否删除所有参考此归档的其他归档？',
		buttons: Ext.MessageBox.YESNO,
		closable:false,
		fn: function(btn) {
			if(btn=='yes') {
				extraP.delRefs = true;
			}
			setReadFlagTask.cancel();
			store.remove(records);
			extraP.toTrash = '1';	//彻底删除
			extraP.idList = ids.join();
			store.sync();
			extraP.idList = '';
			extraP.delRefs = '';
			if(win) {
				win.close();
			}
			(new Ext.util.DelayedTask( function() {
				store.load();
				getIsReadCount(Ext.StoreMgr.lookup('docTrstoreId'), folderId);
			})).delay(500);
		},
		icon: Ext.MessageBox.QUESTION
	});
}
//删除选中行action
Ext.create('WS.docmanager.docmanager', {
	text: '删除',
	iconCls: 'delinfax',
	itemId: 'delinfaxdocgrid',
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
			ids.push(records[p].data.docID);
		}
		var folderId = extraP.folderid;
		if(folderId == WaveFaxConst.RecycleFolderID || folderId == WaveFaxConst.PublicRecycleFolderID) {
			newMesB.show({
				title:'提示',
				msg: '您确认是否要彻底删除所选择的记录？',
				buttons: Ext.MessageBox.YESNO,
				closable:false,
				fn: function(btn) {
					if(btn=='yes') {
						delRefFn(extraP, store, records, ids, folderId);
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
				}, {
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
							getIsReadCount(Ext.StoreMgr.lookup('docTrstoreId'), folderId);
						})).delay(500);
					}
				},{
					text: '彻底删除',
					handler: function() {
						var win = this.up('window');
						delRefFn(extraP, store, records, ids, folderId, win);
						
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
		this.setDisabled(selection.length == 0 || (data && data.folderPrivDelete == 0));
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '下载',
	iconCls: 'infaxdownloadICON',
	tooltip: '下载文档',
	itemId: 'downloadfaxdocgrid',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		if (sm.hasSelection() && sm.getSelection().length > 0) {
			var smdata = sm.getSelection()[0].data;
			var win = Ext.create('WS.infax.DownloadFaxFile', {
				faxfileid: smdata.faxFileID
			});
			win.down('#fileNameID').setValue('faxfile' + smdata.docID);
			win.show(null,function(){
				win.setTitle('下载文档');
			});
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(!(selection.length == 1) || (data && data.folderPrivView == 0));
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshICON',
	itemId: 'refreshdocgrid',
	handler: function() {
		var panel = this.getTargetView();
		var store = panel.getStore();
		store.filterMap.removeAtKey('filter');
		store.getProxy().extraParams.folderFlag = '';	//将忽略folderid移除
		panel.loadGrid();
		var treeSeles = docTree.getSelectionModel().getSelection();

		if(template) {
			template.setTplGridTitle(panel,false,false,'doctree');
		} else {
			panel.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
		}
		getIsReadCount(docTree.getStore(), store.getProxy().extraParams.folderid);
	},
	updateStatus: function(selection) {
	}
});

Ext.create('WS.docmanager.docmanager', {
	text: '转发到传真',
	itemId: 'resenddocgrid',
	handler: function() {
		var sm = this.getTargetView().getSelectionModel();    
		if (sm.hasSelection() && sm.getSelection().length > 0) {
			sendFaxForward(sm,1);
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(selection.length != 1 || (data && data.folderPrivforword == 0));
	}
});


Ext.create('WS.docmanager.docmanager', {
	text: '恢复',
	tooltip: '恢复',
	itemId: 'reStoredocgrid',
	iconCls: 'restoreICON',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		var param = {
			gridType: grid.getXType(),
			sessiontoken: getSessionToken(),
			faxIDs: Ext.JSON.encode(buildFaxIDs(sm.getSelection(), 'docID'))
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
		var tSet = docgrid_tbtnSetMenu.down('#t'+this.itemId);
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