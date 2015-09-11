var filter = '';

var ofReTask = {
	run: function() {
		taskOfReRunner.stopAll();
		//保存当前的Scroll位置
		var tab = currGrid.getView();        		
       	var top = tab.el.getScroll().top;
        //alert(top);
		if(Ext.StoreMgr.lookup('outfaxstoreId')!=null && currGrid.itemId.toLowerCase()== 'outfaxgrid' && !isOfRshing) {
			isOfRshing = true;
			//var scrollTop = currGrid.verticalScroller.el.dom.scrollTop;
			//alert(scrollTop);
			//保存当前选择记录
			var records = null;
			var sels = currGrid.getSelectionModel();
			if(sels.hasSelection()) {
				records = sels.getSelection();
			}
			
			//alert(1);
			//调用接口取值 先取状态，如果状态有变动则load  QueryFaxStatusByIDs
			var store = currGrid.getStore();
			var srcRecs = store.getRange();//判断该数组跟返回值的比对结果
			var srcIdArr = new Array();
			//var isChange = true;
			var needLoad = false;
			if(srcRecs.length>0) {
				Ext.Array.each(srcRecs, function(rec,index,alls) {
					srcIdArr.push(rec.data.outFaxID);
				});
				//调用接口比对
				var param = {};
				param.sessiontoken = sessionToken;
				param.ids = srcIdArr.join();
				// 调用
				WsCall.call('querystatusbyids', param, function(response, opts) {
					//response.data
					//isChange=true; status
					var data = Ext.JSON.decode(response.data);
					Ext.Array.each(srcRecs, function(rec,index,alls) {
						var dt = data[index];
						rec.data.status = dt.status;
						rec.data.sentPages = dt.sentPage;
						if(dt.status == 8|| dt.status ==9) {
							needLoad = true;
						}
					});
					//如果有变动需要load
					if(needLoad) {
						store.getProxy().extraParams.refresh = 1;
						//store.loadPage(store.currentPage);
						store.load({
							callback: function(rcds, operation, success) {
								//判断现有数据是否越界
								var pages;
								var total = store.getTotalCount();
								if(total > 0) {
									pages = parseInt(total / userConfig.gridPageSize);
									if(total % userConfig.gridPageSize != 0) {
										pages++;
									}
								} else {
									pages = 1;
								}

								function setOrSels() {
									//判断之前是否有选择
									if(records != null) {
										var nArr = new Array();
										Ext.Array.each(records, function(rec,index,alls) {
											var nrec = store.getById(rec.data.outFaxID);
											if(nrec != null) {
												nArr.push(nrec);
											}
										});
										sels.select(nArr);
									}
									var treeSeles = FolderTree1.getSelectionModel().getSelection();
									currGrid.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
									isOfRshing = false;

									//currGrid.setScrollTop(100);
									ofRefreshTask();
								}

								if(store.currentPage > pages) {
									//alert('da'+pages);
									store.loadPage(pages, {
										callback: function(rcds, operation, success) {
											setOrSels();
										}
									});
								} else {
									//alert(store.currentPage );
									setOrSels();
								}

							}
						});
					}//不load
					else {
						//alert(srcRecs[0].data.status);
						store.loadData(srcRecs);
						isOfRshing = false;
						ofRefreshTask();

					}
					if(top && top!=0){
						tab.el.scrollTo('top',top,false);
					}
					
				}, function(response, opts) {
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
					isOfRshing = false;
					ofRefreshTask();
				}, false);
			} else {
				isOfRshing = false;
				ofRefreshTask();
			}

		}

	},
	interval: userConfig.outfaxreSec*1000 //5 second
}

//加载发件箱自动刷新
function ofRefreshTask() {
	delayOf.cancel();
	delayOf.delay(userConfig.outfaxreSec*1000,function() {
		taskOfReRunner.stopAll();
		isOfRshing = false;
		taskOfReRunner = new Ext.util.TaskRunner();
		taskOfReRunner.start(ofReTask);
	});
	 
}

Ext.define('WS.outfax.OutfaxAction', {
	extend: 'WS.action.Base',
	category: 'outfax'
});

// Ext.create('WS.outfax.OutfaxAction', {
	// itemId:'outfaxtMenu',
	// iconCls:'tplBtnIconCls',
	// text:'表单数据',
	// tooltip: '表单数据',
	// menu: [],
	// updateStatus: function(selection) {		
		// if(template) {
			// this.setDisabled((serverInfoModel.data.formData != 0)?true:false);
			// return;
		// }
		// this.setDisabled(true);	
	// }
// });

Ext.create('WS.outfax.OutfaxAction', {
	itemId:'outfaxtSearchMenu',
	text:'表单数据查找',
	handler: searchTMenuHandler,
	updateStatus: function(selection) {
		if(template) {
			this.setDisabled(serverInfoModel.data.formData != 0?true:false);
			return;
		}
		this.setDisabled(true);
	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '修改',
	iconCls:'config',
	itemId: 'modInfoOutfID',
	tooltip: '修改传真信息',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var records = sm.getSelection();
		var win = Ext.create('WS.outfax.ModeFaxInfo', {
			outFaxID: records[0].get('outFaxID'),
			grid:panel
		});

		win.down('form').getForm().loadRecord(records[0]);
		win.show('', function() {
			win.down('#faxNum').focus(true);
		});
	},
	updateStatus: function(selection) {
		var sm = this.getTargetView().getSelectionModel();
		var block = true;
		if(sm.hasSelection()) {
			var records = sm.getSelection();
			var status = records[0].get('status');
			if(status == 0 || status == 1 || status == 2 ||status == 4) {
				block = false;
			}

		}
		this.setDisabled(selection.length != 1 || block);
	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '全选/取消',
	itemId: 'allseloutfID',
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

Ext.create('WS.outfax.OutfaxAction', {
	text: '反选',
	itemId: 'otherseloutfID',
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

Ext.create('WS.outfax.OutfaxAction', {
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
	itemId: 'modflgoutfaxID',

	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0);
	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '传真信息查找',
	//tooltip: '自定义查找',
	iconCls: 'infaxSelfFilter',
	itemId: 'outfaxSelfFilterID',
	handler: function() {
		var m = this.getTargetView();

		var win = Ext.create('WS.succoutfax.SuccoutfaxSelfFilter', {
			grid: m
		});
		win.down('#timeCbx').hide();
		win.down('#timeID').hide();
		win.setHeight(350);
		win.show('', function() {
			win.down('#recipID').focus(true);
		});
	},
	updateStatus: function(selection) {

	}
});


Ext.create('WS.outfax.OutfaxAction', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshICON',
	itemId: 'refreshoutfaxID',
	handler: function() {
		var panel = this.getTargetView();
		panel.getStore().filterMap.removeAtKey('filter');
		panel.loadGrid();
		var treeSeles = panel.up('#viewPortEastID').down('#FolderTree').getSelectionModel().getSelection();
		if(template){
			template.setTplGridTitle(panel,false,false,'foldertree');
		}else{
			panel.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
		}	
		
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '全部状态',
	checked:true,
	group: 'outFaxAcStatus',
	itemId: 'allstatusID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView();
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText('全部状态');
		currentPanel.getStore().filterMap.removeAtKey('status');
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);	
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[0],
	group: 'outFaxAcStatus',
	itemId: 'stsQueueConvertingID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[0]);
		filter = tplPrefix +'Status=0';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;	
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);	
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[1],
	group: 'outFaxAcStatus',
	itemId: 'stsWaitingApprovalID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[1]);
		filter = tplPrefix +'Status=1';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;	
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);	
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[2],
	group: 'outFaxAcStatus',
	itemId: 'stsConvertingID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[2]);
		filter = tplPrefix +'Status=2';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;	
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);	
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[3],
	group: 'outFaxAcStatus',
	itemId: 'stsQueueSendID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[3]);
		filter = tplPrefix +'Status=3';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;	
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);	
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[4],
	group: 'outFaxAcStatus',
	itemId: 'stsQueueblockingID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[4]);
		filter = tplPrefix +'Status=4';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;	
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);	
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[5],
	group: 'outFaxAcStatus',
	itemId: 'stsInDeviceID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[5]);
		filter = tplPrefix +'Status=5';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;	
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);	
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[6],
	group: 'outFaxAcStatus',
	itemId: 'stsDialingID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[6]);
		filter = tplPrefix +'Status=6';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);		
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: statusArr[7],
	group: 'outFaxAcStatus',
	itemId: 'stsSendingID',
	handler: function(btn,eve,suppressLoad) {
		var currentPanel = this.getTargetView()
		var container = viewPortEast.down('#centerCenterView');
		container.down('#statusID').setText(statusArr[7]);
		filter = tplPrefix +'Status=7';
		currentPanel.getStore().filterMap.replace('status', filter);
		if(suppressLoad){
			this.setChecked(suppressLoad);
			return;
		}
		//保存变量并上传
		var me = this;
		myStates.outfaxgridFilter.status = me.itemId;
		var tmpS = myStates.outfaxgridFilter;
		wsUserStates.setServerState('outfaxgridFilter',tmpS);		
		currentPanel.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '下载',
	tooltip: '下载传真',
	iconCls: 'infaxdownloadICON',
	itemId: 'downloadoutfaxID',
	handler: function() {
		var grid = this.getTargetView();
		var sm = grid.getSelectionModel();
		if (sm.hasSelection() && sm.getSelection().length > 0) {
			var smdata = sm.getSelection()[0].data;
			var win = Ext.create('WS.infax.DownloadFaxFile', {
				faxfileid: smdata.faxFileID});
			win.down('#fileNameID').setValue('faxfile' + smdata.outFaxID);
			win.show();
		}
	},
	updateStatus: function(selection) {
		this.setDisabled(!(selection.length == 1));
	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '暂停',
	tooltip: '暂停发送',
	iconCls: 'blockfaxICON',
	itemId: 'blockfaxID',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();     //通用呼叫
		if (sm.hasSelection() && sm.getSelection().length > 0) {

			var records = sm.getSelection();
			var param= {
				sessiontoken : getSessionToken(),
				faxids : Ext.JSON.encode(buildFaxIDs(records, 'outFaxID'))
			};
			WsCall.call('blockfax',param, function() {
				panel.loadGrid();
			}, function(res) {

				if(res.code != WaveFaxConst.ResPartialOK) {
					Ext.Msg.alert('错误！' + res.msg);
				}
				panel.loadGrid();
			});
		}

	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0 || selection[0].data.status == 4);
	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '继续',
	tooltip: '继续发送',
	iconCls: 'resendfax',
	itemId: 'confaxID',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();     //通用呼叫
		if (sm.hasSelection() && sm.getSelection().length > 0) {

			var records = sm.getSelection();
			var param= {
				sessiontoken : getSessionToken(),
				faxids : Ext.JSON.encode(buildFaxIDs(records, 'outFaxID'))
			};
			WsCall.call('confax',param, function() {

				panel.loadGrid();
			}, function(res) {
				if(res.code != WaveFaxConst.ResPartialOK) {
					Ext.Msg.alert('错误！' + res.msg);
				}

				panel.loadGrid();
			});
		}
	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0 || selection[0].data.status != 4);
	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '取消',
	tooltip: '取消发送',
	iconCls: 'cancelFaxICON',
	itemId: 'cancelfaxID',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();     //通用呼叫

		if (sm.hasSelection() && sm.getSelection().length > 0) {
			Ext.Msg.confirm('提示', '您确定要取消传真吗？', function(btn) {
				if (btn == 'yes') {
					var records = sm.getSelection();
					var param= {
						sessiontoken : getSessionToken(),
						faxids : Ext.JSON.encode(buildFaxIDs(records, 'outFaxID'))
					};
					WsCall.call('cancelfax',param, function() {
						panel.loadGrid();
					}, function(res) {
						if(!errorProcess(res.code)) {
							Ext.Msg.alert('错误', res.msg);
						}
						panel.loadGrid();
					});
				}
			});
		}

	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0);
	}
});

Ext.create('WS.outfax.OutfaxAction', {
	text: '注释',
	tooltip: '修改注释',
	iconCls: 'modifycomment',
	itemId: 'modoutfaxcommID',
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

Ext.create('WS.outfax.OutfaxAction', {
	text: '优先度',
	tooltip: '修改优先度',
	iconCls: 'priorityICON',
	itemId: 'modPriID',
	handler: function() {
		var panel = this.getTargetView();
		var win = Ext.create('WS.outfax.ModPri', {
			grid: panel
		});
		win.down('#modID').setValue(2);
		win.show('', function() {
			win.down('#modID').focus(true);
		});
	},
	updateStatus: function(selection) {
		this.setDisabled(selection.length == 0);
	}
});