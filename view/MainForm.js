

function moniToggle(com) {
	var activeTab = viewFaxFileTab.getLayout().getActiveItem();
	var clsArr = ['x-pressed', 'x-btn-pressed', 'x-btn-default-small-pressed'];
	if (activeTab.itemId == "PngTab" && com.itemId == 'btnDetail') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnPng').addCls(clsArr);
		com.up('panel').down('#btnWorkFlow').addCls(clsArr);
		return 'detail';
	}
	if (activeTab.itemId == "detailTab" && com.itemId == 'btnPng') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnDetail').addCls(clsArr);
		com.up('panel').down('#btnWorkFlow').addCls(clsArr);
		return 'png';
	}

	if (activeTab.itemId == "PngTab" && com.itemId == 'btnPng') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnDetail').addCls(clsArr);
		com.up('panel').down('#btnWorkFlow').addCls(clsArr);
		return 'png1';
	}
	if (activeTab.itemId == "detailTab" && com.itemId == 'btnDetail') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnPng').addCls(clsArr);
		com.up('panel').down('#btnWorkFlow').addCls(clsArr);
		return 'detail1';
	}

	if (activeTab.itemId == "workflowTab" && com.itemId == 'btnDetail') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnPng').addCls(clsArr);
		com.up('panel').down('#btnWorkFlow').addCls(clsArr);
		return 'detail2';
	}
	if (activeTab.itemId == "workflowTab" && com.itemId == 'btnPng') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnDetail').addCls(clsArr);
		com.up('panel').down('#btnWorkFlow').addCls(clsArr);
		return 'png';
	}

	if (activeTab.itemId == "workflowTab" && com.itemId == 'btnWorkFlow') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnPng').addCls(clsArr);
		com.up('panel').down('#btnDetail').addCls(clsArr);
		return 'workflow1';
	}
	if (activeTab.itemId == "PngTab" && com.itemId == 'btnWorkFlow') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnPng').addCls(clsArr);
		com.up('panel').down('#btnDetail').addCls(clsArr);
		return 'workflow';
	}
	if (activeTab.itemId == "detailTab" && com.itemId == 'btnWorkFlow') {
		com.removeCls(clsArr);
		com.up('panel').down('#btnPng').addCls(clsArr);
		com.up('panel').down('#btnDetail').addCls(clsArr);
		return 'workflow2';
	}

	return false;
}

// 排序字段用
function sortGridColumns(orcArr, colMap) {
	resumeGridColumns(orcArr, colMap);
	var tmpArr = new Array();
	Ext.Array.each(orcArr, function(item, index, alls) {
				var rid = item.id.substring(item.id.indexOf('-') + 1,
						item.id.length);
				if (colMap.containsKey(rid)) {
					tmpArr.push(colMap.get(rid));
				}
			});
	// 模版字段默认
	colMap.each(function(item, index, alls) {
				if (!Ext.Array.contains(tmpArr, item)) {
					tmpArr.push(item);
				}
			});
	// alert('sort'+Ext.JSON.encode(orcArr));
	return tmpArr;
}

// 取字段状态用width hidden
function resumeGridColumns(orcArr, colMap) {
	// 不用排序，取下width,hidden
	var sMap = new Ext.util.MixedCollection();
	Ext.Array.each(orcArr, function(item, index, alls) {
				sMap.add(item.id, item);
			});
	sMap.each(function(item, index, alls) {
				var rid = item.id.substring(item.id.indexOf('-') + 1,
						item.id.length);

				var tmItem = colMap.get(rid);
				if (!tmItem)
					return;

				if (item.width) {
					tmItem.width = item.width;
				}

				if (item.hidden) {
					tmItem.hidden = item.hidden;
				}
			});
}

function seeFillFaxNew(record,resetwin){
	var fileid = record.data.faxFileID;
	
	function myopwclose(fid) {
		var param1 = {};
		param1.fileId = fid;
		param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
		//调用
		WsCall.call('deleteTempFiles', param1, function (response, opts) {
		}, function (response, opts) {
		}, true);
	}
	
	if(resetwin){
		resetwin.fileid = fileid;
		return resetwin;
	}

	return Ext.create('Ext.window.Window', {
		title: '全屏查看',
		modal:true,
		iconCls:'coverStamp',
		height: Ext.getBody().getHeight(),
		closeAction:'hide',
		shadow:!Ext.isIE,
		defaultFitPng:true,
		fileid:fileid,
		pngClass:'',
		pngGroup:'seefillfaxwin',
		runner:false,		
		width: Ext.getBody().getWidth(),
		collapsible: false,
		resizable: false,
		frame: false,
		border: false,
		closable:false,
		tools: [{
			type: 'close',
			handler: function() {
				var me = this;
				myopwclose(me.up('window').down('#hidFileId').getValue());
				me.up('window').close();
			}
		}],		
		layout:'fit',
		items: [{
			xtype: 'form',
			hidden:true,
			frame: false,
			border: false,
			items: [{
				xtype: 'hiddenfield',
				itemId: 'hidLoaded',
				value: '0'
			},{
				xtype: 'hiddenfield',
				itemId: 'hidFileId',
				value: ''
			}]
		},{
			xtype: 'baseviewpanel'
		}],
		listeners: {
			activate: function(com,eOpts) {
				var winType = com;
				if(winType) {
					var viewType = winType.pngClass;
					if(viewType != '') {
						var tCount = viewType.getTotalCount();
						var tmpPage = winType.down('#txtCurrPage').getValue();
						var cPage = tmpPage;
						ActionBase.updateActions('filepngview', viewType.viewType,viewType.getPngSels().getCount(),tCount,cPage);
					} else {
						ActionBase.updateActions('filepngview', 0,0,0,-1);
					}
					var hidForm = winType.down('#hidFileId');
					ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
				}
			},
			beforehide: function() {
				myopwclose();
			},			
			show: function (win, opts) {
				
				//win.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
				ActionBase.updateActions('acdocaddwin', win.down('#hidFileId').getValue());
				if(win.down('#hidFileId').getValue() == '') {
					win.down('#txtMiniCurrPage').setDisabled(true);
				} else {
					win.down('#txtMiniCurrPage').setDisabled(false);
				}

				win.down('#filepngdeleteFilepng').hide();
				win.down('#delAllFile').hide();
				win.down('#filepngenditorpng').hide();
				win.down('#tbdelAllFile').hide();
				
				win.down('#filepngviewrotateLeft').show();
				win.down('#filepngviewrotateRight').show();
				

				var pal = win.down('#replacePal');
				pal.removeAll();
				pal.hide();

				win.down('#filePath').hide();
				win.down('#fileLocalPath').hide();
				win.down('#replacePal').hide();
				
				var hidLoaded = win.down('#hidLoaded');				
				var hidForm = win.down('#hidFileId');
				var fid = hidForm.getValue();
				var maskTarget = win;
				var upfiletype = '0';
				

				var tmpCurPage = 1;
				if(fid == '' || fid != win.fileid) {
					win.pngClass = new filepngviewclass();
					//清空
					var palPngContainer = win.down('#filepngviewMini');
					palPngContainer.removeAll();
					
					win.pngClass.setFaxFileId(win.fileid);
				
					hidForm.setValue(win.fileid);
					//初始化图片浏览panel
					hidLoaded.setValue('1');
					win.pngClass.initMyfilepngMini(maskTarget, hidLoaded,upfiletype,win.fileid, function() {
						setPngMiniWH(win.pngClass,win,'bar');
					},true,'正在生成缩略图...',win.getEl(),10,tmpCurPage);
					//设置前后插入等按钮状态
					ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
					if(hidForm.getValue() == '') {
						win.down('#txtMiniCurrPage').setDisabled(true);
					} else {
						win.down('#txtMiniCurrPage').setDisabled(false);
					}
	
					win.down('#panelfilepngview').doLayout();
				} 
				// else {
					// win.pngClass.setIsLoaded(0);
					// tmpCurPage = win.pngClass.miniCurPage;
					// if(win.pngClass.miniCurPage == win.pngClass.miniTotalPage) {
						// win.pngClass.ifLoading = 1;
						// var palPngContainer = win.down('#filepngviewMini');
						// palPngContainer.removeAll();
					// }
				// }
				
				
				win.maximize();
			}
		}
	});
}

// 查看全屏大图
// function seeFillFax() {
// 
	// var activeTab = viewFaxFileTab.getLayout().getActiveItem();
	// if (activeTab.itemId != "PngTab") {
		// return;
	// }
// 
	// var cPal = viewPortEast.down('#centerCenterView');
	// var wPal = viewPortEast.down('#westView');
	// var sPal = viewPortEast.down('#southView');
	// var csPal = viewPortEast.down('#centerSouthView');
	// var btnView = centerSVBtn.down('#exitFill');
	// var btnPng = centerSVBtn.down('#btnPng');
	// var btnDetail = centerSVBtn.down('#btnDetail');
	// var btnWorkFlow = centerSVBtn.down('#btnWorkFlow');	
// 
	// if (cplHeight != 0) {
// 
		// csPal.setHeight(csPal.getHeight() - cplHeight - cpltmH);
		// csPal.isFullScreen = false;
		// cplHeight = 0;
		// wPal.show();
		// northTb.show();
		// sPal.show();
		// btnView.hide();
		// btnDetail.show();
		// btnPng.show();
		// if (showWf) {
			// showWf = false;
			// btnWorkFlow.show();
		// }
// 
	// } else {
		// if (runner) {
			// runner.stopAll();
		// }
// 
		// (new Ext.util.DelayedTask()).delay(500, function() {
					// if (csPal.collapsed) {
						// csPal.expand();
						// return;
					// }
// 
					// cplHeight = cPal.getHeight();
					// cpltmH = Ext.getBody().getHeight()
							// - (cplHeight + csPal.getHeight());
					// csPal.setHeight(cplHeight + csPal.getHeight() + cpltmH);
					// csPal.isFullScreen = true;
// 
					// wPal.hide();
					// northTb.hide();
					// sPal.hide();
					// btnView.show();
					// btnDetail.hide();
					// btnPng.hide();
					// btnWorkFlow.hide();
// 
					// if (viewType == 0) {
						// // viewType == 0;
						// // 调用切换视图
						// ActionBase.getAction('viewTypeChange').execute();
						// isLoaded = 0;
					// }
// 
				// });
// 
	// }
// }

function clearDetailForm(type) {

	// var mainForm = Ext.getCmp('viewPortEast');
	var detailPanel = viewPortEast.down('#detailTab');
	var count = detailPanel.items.getCount();
	// alert(count);
	if (count == 0) {
		return true;
	}
	// if(count ==1 && type) {
	// return false;
	// }
	detailPanel.removeAll();
	// detailPanel.doLayout();
	detailFormForDefaultPng = "";
	detailFormForInfaxgrid = "";
	detailFormForSuccoutfaxgrid = "";
	detailFormForOutfaxgrid = "";
	detailFormForAddressgrid = "";
	detailFormForDraftgrid = "";
	detailFormForDocgrid = "";
	detailFormForTaskgrid = "";
	detailFormForRulegrid = '';
	return true;
}

function afterLDPng() {
	var detailPanel = viewPortEast.down('#detailTab');
	if (detailPanel.isVisible() && detailPanel.items.getCount() == 0) {
		if (detailFormForDefaultPng == "") {
			detailFormForDefaultPng = loadDetailFormForDefaultPng();
			detailPanel.add(detailFormForDefaultPng);
		}
	}
}

function loadDefaultPng() {
	clearDetailForm(true);
	afterLDPng();
}

// status 2/0
function setPngViewForStatus(seles) {
	if (seles[0].data.status == 2 || seles[0].data.status == 0) {
		var tabPngView = viewFaxFileTab;
		var palPng = tabPngView.down('#palFaxFileTabPng');
		var palPngMini = tabPngView.down('#palFaxFileTabPngMini');
		if (palPngMini) {
			palPngMini.show();
		}
		if (palPng) {
			palPng.hide();
		}
		palPngMini.removeAll();
		if (seles[0].data.status == 2) {
			palPngMini.update('正在进行传真转换...');
		} else {
			palPngMini.update('等待传真转换...');
		}
		// ToolBar按钮状态
		tabPngView.down('#tbFaxFileTabPng').getComponent('rotateLeft')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('rotateRight')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('overturn')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('fistPage')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('prePage')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('txtCurrPage')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('nextPage')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('lastPage')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('selectAll')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('selectToggle')
				.setDisabled(true);
		tabPngView.down('#tbFaxFileTabPng').getComponent('viewTypeChange')
				.setDisabled(true);
	}
}

// =====================================================================================//
// =============================MainForm
// ToolBar================================//
// =====================================================================================//

// 登陆完成后续处理
function loginOK(sessionToken, okfun, errfun) {
	// alert(okfun);
	Ext.util.Cookies.set('sessiontoken', sessionToken);

	getServerInfoData(function() {
				getRoleInfoData(function() {
							getUserData(okfun, errfun);
						});
			});
}

Ext.create('Ext.data.Store', {
			storeId : 'languageStore',
			fields : ['lid', 'lName'],
			data : [{
						'lid' : '0',
						'lName' : languageArr[0]
					}, {
						'lid' : '1',
						'lName' : languageArr[1]
					}]
		});

// 图标ToolBar tbNorthViewHeaderTop
Ext.define('ws.viewFax.tbNorthViewHeaderTop', {
	alias : 'widget.tbNorthViewHeaderTop',
	extend : 'Ext.toolbar.Toolbar',
	alternateClassName : ['tbNorthViewHeaderTop'],
	itemId : 'tbNorthViewHeaderTop',
	// baseCls : 'x-panel-header-default',
	baseCls : '',
	layout : {
		overflowHandler : 'Menu'
	},
	cls : 'headerBg',
	items : [{
				xtype : 'image',
				src : 'resources/images/ws_logo.png',
				width : 200,
				height : 28
			}, {
				xtype : 'label',
				itemId : 'flexJoint'
			}, {
				xtype : 'header',
				baseCls : 'x-panel-header',
				iconCls : 'myFax',
				title : "<span style='color:#eee;'><b>" + '个人' + "</b></span>",
				setTitle : function(title) {
					var me = this;
					title = "<span style='color:#eee;'><b>" + title
							+ "</b></span>";
					if (me.rendered) {
						if (me.titleCmp.rendered) {
							if (me.titleCmp.surface) {
								me.title = title || '';
								var sprite = me.titleCmp.surface.items.items[0], surface = me.titleCmp.surface;

								surface.remove(sprite);
								me.textConfig.type = 'text';
								me.textConfig.text = title;
								sprite = surface.add(me.textConfig);
								sprite.setAttributes({
											rotate : {
												degrees : 90
											}
										}, true);
								me.titleCmp.autoSizeSurface();
							} else {
								me.title = title || '&#160;';
								me.titleCmp.textEl.update(me.title);
							}
						} else {
							me.titleCmp.on({
										render : function() {
											me.setTitle(title);
										},
										single : true
									});
						}
					} else {
						me.on({
									render : function() {
										me.layout.layout();
										me.setTitle(title);
									},
									single : true
								});
					}
				},
				itemId : 'gridTitle',
				style : {
					'padding' : '5 0 0 10',
					'border-width' : '0px',
					'background-color' : 'transparent',
					'background-image' : 'none',
					'box-shadow' : '0 0 0 0'					
				},
				height : 28,
				margin : '0 0 0 0'		
			}, '->', {
				xtype : 'button',
				tooltip : '提交新传真',
				text : '发传真',
				itemId : 'sendfax',
				componentCls : 'mainFormTbBtn',
				iconCls : 'sendfax',
				overCls : 'mainFormTbBtnOver',
				handler : function() {					
					if (sendfaxwin == '') {
						sendfaxwin = loadsendfaxwin();
					} // if
					else {
						if (sendfaxwin.collapsed) {
							sendfaxwin.expand();
						}
						sendfaxwin.show();						
					}

				}
			}, {
				xtype : 'tbtext',
				text : "<font color='white'> | </font>",
				margin : '0 5 0 5'
			}, {
				xtype : 'button',
				text : '设置',
				tooltip : '系统/个人设置',
				itemId : 'configer',
				cls : 'mainFormTbBtn',
				overCls : 'mainFormTbBtnOver',
				iconCls : 'config',
				menu : [{
							text : '系统设置',
							handler : function() {
								if (systemconfigwin_sys == '') {
									systemconfigwin_sys = loadsystemconfigwin_sys();
								}
								systemconfigwin_sys.show();
							}
						}, {
							text : '个人设置',
							handler : function() {
								if (systemconfigwin_person == '') {
									systemconfigwin_person = loadsystemconfigwin_person();
								}
								systemconfigwin_person.show();
							}
						}, {
							text : '职责委任',
							handler : function() {
								if (systemconfigwin_sub == '') {
									systemconfigwin_sub = loadsystemconfigwin_sub();
								}
								systemconfigwin_sub.show();
							}
						}],
				listeners : {
					afterrender : function(com) {
						if (ruleSettingFlag) {
							com.menu.add({
								text : '规则',
								itemId : 'ruleTypeFiltertaskgrid',
								handler : function() {
									if (systemconfigwin_rule == '') {
										systemconfigwin_rule = loadsystemconfigwin_rule();
									}
									systemconfigwin_rule.show();
								}
							});
						}
					}
				}
			}, {
				xtype : 'tbtext',
				text : "<font color='white'>|</font>",
				margin : '0 5 0 5'
			}, {
				xtype : 'button',
				text : '注销',
				tooltip : '注销当前用户',
				itemId : 'receive',
				cls : 'mainFormTbBtn',
				overCls : 'mainFormTbBtnOver',
				iconCls : 'logoff',
				handler : function() {
					newMesB.confirm('注销', '确定要注销WaveFax吗?', function(btn) {
						if (btn == 'yes') {
							WsCall.callchain('loginout');
							taskMessageBoxRunner.stopAll();
							var param = {};
							param.sessiontoken = sessionToken;
							// 更新已读未读数
							FolderTree1.getStore().getNodeById(0).set('text',
									'收件箱');
							// 取消状态保存
							if (setSerStates) {
								setSerStates.cancel();
							}
							// 调用
							WsCall.call('userlogout', param, function(response,
									opts) {
								// 重置传真图预览
								var mainForm = Ext.getCmp('viewPortEast');
								var btnCancel = mainForm.down('#btnCancel');
								if (runner) {
									ifLoading = 0;
									runner.stopAll();
									runner = new Ext.util.TaskRunner();
									btnCancel.hide();
								}

								// 重置消息弹出
								if (msgCt != '') {
									msgCt.close();
									msgCt = '';
								}
								Ext.util.Cookies.clear("sessiontoken");
								if (response.code == WaveFaxConst.CasLogoutCode) {
									window.location.href = response.data;
								} else {
									window.location.reload();
								}
							}, function(response, opts) {
								if (!errorProcess(response.code)) {
									Ext.Msg.alert('注销失败', response.msg);
								}
							}, true);
						}

					});
				}
			}]
});

// =====================================================================================//
// =============================MainForm 控件================================//
// =====================================================================================//

// =======================================onReady()==============================================//
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";

// 控制面板窗口加载
loadSysConfig = function() {
	// 初始化控制面板
	if (systemconfigwin_sys == '') {
		systemconfigwin_sys = loadsystemconfigwin_sys();
		systemconfigwin_sys.show();
		systemconfigwin_sys.hide();
	}
	if (systemconfigwin_person == '') {
		systemconfigwin_person = loadsystemconfigwin_person();
		systemconfigwin_person.show();
		systemconfigwin_person.hide();
	}
}
// 内部转发窗口加载
function loadForFax() {
	// 初始化内部转发窗口
	if (faxforwardwin == '') {
		faxforwardwin = Ext.create('WS.infax.InForward', {});
	}
}

// 传真发送窗口加载
function loadSFax() {
	// 初始化sendfaxwin
	if (sendfaxwin == '') {
		sendfaxwin = loadsendfaxwin();

		sendfaxwin.show();
		sendfaxwin.hide();
		// sendfaxwin = loadsendfaxwin().show().setPosition(-1000,-1000);
	} // if
}

function getCurrGrid() {
	return currGrid;
}

function getCurrTree() {
	if (!FolderTree1.collapsed)
		return FolderTree1;
	if (!addressTree1.collapsed)
		return addressTree1;
	if (!docTree.collapsed)
		return docTree;
	if (!wfTree.collapsed) {
		return wfTree;
	}
	return false;
}

// 创建InfaxGrid
function createInfaxGrid() {
	var tmpArr = new Array();
	// infaxInfo.infaxColMap.each( function(item,index,alls) {
	// tmpArr.push(item);
	// });
	tmpArr = sortGridColumns(myStates.infaxgridState.columns,
			infaxInfo.infaxColMap);
	// 可比state对排序,控制可见

	// tmpArr = tmpArr.reverse();
	// tmpArr = tmpArr.sort();

	tb = Ext.create('WS.infax.Infaxgrid', {
				frame : false,
				itemId : 'Infaxgrid',
				stateId : 'infaxgridState',
				stateful : true,
				columns : tmpArr,
				border : false
			});

	// infax 选择变化
	tb.on('selectionchange', function(view, seles, op) {

		shiftImg = 0;
		ActionBase.updateActions('Infax', seles);
		ActionBase.updateActions('templateAction', seles);
		if (seles.length <= 0) {
			return;
		}
		// alert(seles.length);
		// 启动Task
		var vffTab = viewFaxFileTab;
		var activeTab = vffTab.getLayout().getActiveItem();
		// runner
		if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId == "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);
			// gridSelsChange();

		} else if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId != "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);

		};

		setReadFlagTask.cancel();

		if (seles[0]) {
			// var mainForm = Ext.getCmp('viewPortEast');
			var folderTree = FolderTree1;

			if (activeTab.itemId == "PngTab" && seles[0].data.version == "0") {
				setReadFlagTask.delay(userConfig.autoReadSec * 1000,
						function() {
							var records = tb.getSelectionModel().getSelection();
							if (records[0]) {
								records[0].set('version', '1'); // 标记为已读
								tb.getStore().getProxy().extraParams.toTrash = undefined;
								tb.getStore().sync();
								records[0].commit(true); // 将之前选中的数据设置脏数据为false
								getIsReadCount(
										Ext.StoreMgr.lookup('folderTrstoreId'),
										tb.getStore().getProxy().extraParams.folderid);
							}

						});
			}

			// 有权限并为新图 而且是pngTab 时调用加载图片
			if (faxFileId != seles[0].data.faxFileID
					&& tb.privData.folderPrivView != 0
					&& activeTab.itemId == "PngTab") {
				// 切换选择的文件id
				initAllFaxFileTabPngConfig(seles[0].data.faxFileID, 1);
				gridSelsChange();
			}

			function setDetailForm(dp) {
				if (detailFormForInfaxgrid == "") {
					clearDetailForm();
					detailFormForInfaxgrid = loadDetailFormForInfaxgrid(seles[0]);
					dp.add(detailFormForInfaxgrid);
				} else {
					detailFormForInfaxgrid.updateAll(seles[0]);
				}

			}

			if (folderTree.getSelectionModel().hasSelection()
					&& activeTab.itemId == "detailTab") {
				var detailPanel = viewFaxFileTab.down('#detailTab');
				var fsel = folderTree.getSelectionModel().getSelection()[0];
				if (fsel.data.id == WaveFaxConst.RootFolderID
						|| fsel.data.id == WaveFaxConst.RecycleFolderID
						|| fsel.data.id == WaveFaxConst.PublicRootFolderID
						|| fsel.data.id == WaveFaxConst.PublicRecycleFolderID
						|| fsel.data.id.toString().indexOf('trwr') != -1) {
					return setDetailForm(detailPanel);

				} // if seled fjx

				if (fsel.getDepth() > 1) {
					var depth = fsel.getDepth();
					var parentRoot = fsel.parentNode;
					for (var i = 2; i < depth; i++) {
						parentRoot = parentRoot.parentNode;
					}
					if (fsel.data.id.indexOf('grxx') != -1) {
						return setDetailForm(detailPanel);
					}
					if (parentRoot.data.id == WaveFaxConst.PublicRootFolderID) {
						return setDetailForm(detailPanel);
					}

					return;
				} // if depth

			} // if tree hassele
		} // if seles[0]
	}, this, {
		buffer : 100
	});
	return tb;
}// create infax

// 创建发件箱
function createOutFaxGrid() {
	var tmpArr = new Array();
	// outfaxInfo.outfaxColMap.each( function(item,index,alls) {
	// tmpArr.push(item);
	// });
	tmpArr = sortGridColumns(myStates.outfaxgridState.columns,
			outfaxInfo.outfaxColMap);
	outfax = Ext.create('WS.outfax.Outfaxgrid', {
				frame : false,
				itemId : 'outfaxgrid',
				stateId : 'outfaxgridState',
				stateful : true,
				columns : tmpArr,
				border : false
			});
	// outfax 选择变化
	outfax.on('selectionchange', function(view, seles, op) {
		shiftImg = 0;
		ActionBase.updateActions('outfax', seles);
		ActionBase.updateActions('templateAction', seles);
		if (seles.length <= 0) {
			return;
		}
		// runner
		// if (runner && seles[0] && faxFileId != seles[0].data.faxFileID) {
		// ifLoading = 0;
		// runner.stopAll();
		// runner = new Ext.util.TaskRunner();
		// initAllFaxFileTabPngConfig(0,1);
		// gridSelsChange();
		// };

		var vffTab = viewFaxFileTab;
		var activeTab = vffTab.getLayout().getActiveItem();
		// runner
		if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId == "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);
			// gridSelsChange();

		} else if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId != "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);

		};

		setReadFlagTask.cancel();
		if (seles[0]) {
			// var mainForm = Ext.getCmp('viewPortEast');
			// var vffTab = viewFaxFileTab;
			// var activeTab = vffTab.getLayout().getActiveItem();
			if (faxFileId != seles[0].data.faxFileID
					&& activeTab.itemId == "PngTab"
					&& seles[0].data.status != 2 && seles[0].data.status != 0) {
				// 切换选择的文件id
				initAllFaxFileTabPngConfig(seles[0].data.faxFileID, 1);
				gridSelsChange();
			}
			// status 2 ,0
			setPngViewForStatus(seles);
			// var mainForm = Ext.getCmp('viewPortEast');
			var folderTree = FolderTree1;
			if (folderTree.getSelectionModel().hasSelection()
					&& activeTab.itemId == "detailTab") {
				var detailPanel = viewFaxFileTab.down('#detailTab');

				if (folderTree.getSelectionModel().getSelection()[0].data.id == "grfjx") {
					if (detailFormForOutfaxgrid == "") {
						clearDetailForm();
						detailFormForOutfaxgrid = loadDetailFormForOutfaxgrid(seles[0]);
						detailPanel.add(detailFormForOutfaxgrid);
					} else {
						detailFormForOutfaxgrid.updateAll(seles[0]);
					}

				} // if seled fjx
			} // if tree hassele
		} // if seles[0]
	}, this, {
		buffer : 100
	});
	return outfax;
}// create outfax

// 创建已发件箱
function createSuccoutFaxGrid() {
	var tmpArr = new Array();
	// sucfaxInfo.sucfaxColMap.each( function(item,index,alls) {
	// tmpArr.push(item);
	// });
	tmpArr = sortGridColumns(myStates.succoutfaxgridState.columns,
			sucfaxInfo.sucfaxColMap);
	succoutfax = Ext.create('WS.succoutfax.Succoutfaxgrid', {
				frame : false,
				itemId : 'succoutfaxgrid',
				stateId : 'succoutfaxgridState',
				stateful : true,
				columns : tmpArr,
				border : false
			});

	// Succoutfaxgrid 选择变化
	succoutfax.on('selectionchange', function(view, seles, op) {
		shiftImg = 0;
		ActionBase.updateActions('succoutfax', seles);
		ActionBase.updateActions('templateAction', seles);
		if (seles.length <= 0) {
			return;
		}
		// runner
		// if (runner && seles[0] && faxFileId != seles[0].data.faxFileID) {
		// ifLoading = 0;
		// runner.stopAll();
		// runner = new Ext.util.TaskRunner();
		// initAllFaxFileTabPngConfig(0,1);
		// gridSelsChange();
		// };
		var vffTab = viewFaxFileTab;
		var activeTab = vffTab.getLayout().getActiveItem();
		// runner
		if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId == "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);
			// gridSelsChange();

		} else if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId != "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);

		};

		setReadFlagTask.cancel();
		if (seles[0]) {
			// var mainForm = Ext.getCmp('viewPortEast');
			// var vffTab = viewFaxFileTab;
			// var activeTab = vffTab.getLayout().getActiveItem();

			if (faxFileId != seles[0].data.faxFileID
					&& activeTab.itemId == "PngTab") {
				// 切换选择的文件id
				initAllFaxFileTabPngConfig(seles[0].data.faxFileID, 1);
				gridSelsChange();
			}

			// var mainForm = Ext.getCmp('viewPortEast');
			var folderTree = FolderTree1;
			if (folderTree.getSelectionModel().hasSelection()
					&& activeTab.itemId == "detailTab") {
				var detailPanel = viewFaxFileTab.down('#detailTab');
				var fsel = folderTree.getSelectionModel().getSelection()[0];
				if (fsel.data.id == "gryfjx" || fsel.data.id == "gryhsz") {
					if (detailFormForSuccoutfaxgrid == "") {
						clearDetailForm();
						detailFormForSuccoutfaxgrid = loadDetailFormForSuccoutfaxgrid(seles[0]);
						detailPanel.add(detailFormForSuccoutfaxgrid);
					} else {
						detailFormForSuccoutfaxgrid.updateAll(seles[0]);
					}
				} // if seled fjx
			} // if tree hassele
		} // if seles[0]
	}, this, {
		buffer : 100
	});
	return succoutfax;
}// create createSuccoutFaxGrid

// 创建草稿箱
function createDraftGrid() {
	draftGrid = Ext.create('WS.draft.Draftgrid', {
				frame : false,
				itemId : 'draftgrid',
				stateId : 'draftgridState',
				stateful : true,
				border : false
			});
	// draftGrid 选择变化
	draftGrid.on('selectionchange', function(view, seles, op) {
		shiftImg = 0;
		ActionBase.updateActions('Draft', seles);
		if (seles.length <= 0) {
			return;
		}
		// runner
		// if (runner && seles[0] && faxFileId != seles[0].data.faxFileID) {
		// ifLoading = 0;
		// runner.stopAll();
		// runner = new Ext.util.TaskRunner();
		// initAllFaxFileTabPngConfig(0,1);
		// gridSelsChange();
		// };
		var vffTab = viewFaxFileTab;
		var activeTab = vffTab.getLayout().getActiveItem();
		// runner
		if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId == "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);
			// gridSelsChange();

		} else if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId != "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);

		};
		setReadFlagTask.cancel();
		if (seles[0]) {
			// var mainForm = Ext.getCmp('viewPortEast');
			// var vffTab = viewFaxFileTab;
			// var activeTab = vffTab.getLayout().getActiveItem();
			if (faxFileId != seles[0].data.faxFileID
					&& activeTab.itemId == "PngTab") {
				// 切换选择的文件id
				initAllFaxFileTabPngConfig(seles[0].data.faxFileID, 1);
				gridSelsChange();
			}

			// var mainForm = Ext.getCmp('viewPortEast');
			var folderTree = FolderTree1;
			if (folderTree.getSelectionModel().hasSelection()
					&& activeTab.itemId == "detailTab") {
				var detailPanel = viewFaxFileTab.down('#detailTab');

				if (folderTree.getSelectionModel().getSelection()[0].data.id == "grcgx") {
					if (detailFormForDraftgrid == "") {
						clearDetailForm();
						detailFormForDraftgrid = loadDetailFormForDraftgrid(seles[0]);
						detailPanel.add(detailFormForDraftgrid);
					} else {
						detailFormForDraftgrid.updateAll(seles[0]);
					}

				} // if seled fjx
			} // if tree hassele
		} // if seles[0]
	}, this, {
		buffer : 100
	});
	return draftGrid;
}// create draftGrid

// 创建地址本grid
function createAddressGrid() {
	addressGird = Ext.create('WS.address.Addressgrid', {
				frame : false,
				itemId : 'addressgrid',
				stateId : 'addressgridState',
				stateful : true,
				border : false
			});
	// addressGird 选择变化
	addressGird.on('selectionchange', function(view, seles, op) {
		shiftImg = 0;
		if (seles.length <= 0) {
			return;
		}
		// runner
		if (runner && seles[0] && faxFileId != seles[0].data.faxFileID) {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);
			// gridSelsChange();
		};

		setReadFlagTask.cancel();
		if (addresspersonwin != '') {
			return;
		}
		if (seles[0]) {

			// var mainForm = Ext.getCmp('viewPortEast');
			var detailPanel = viewFaxFileTab.down('#detailTab');

			if (addressTree1.getSelectionModel().hasSelection()) {
				if (detailFormForAddressgrid == "") {
					clearDetailForm();
					detailFormForAddressgrid = loadDetailFormForAddressgrid(seles[0]);
					detailPanel.add(detailFormForAddressgrid);
				} else {
					detailFormForAddressgrid.updateAll(seles[0]);
				}

			} // if tree hassele
		} // if seles[0]
	}, this, {
		buffer : 100
	});
	// adressGird双击
	addressGird.on('itemdblclick', function(view, record) {
				var currentWin = Ext.create('WS.address.CreateAddr', {
							grid : addressGird,
							action : 'update'
						});
				currentWin.down('form').getForm().loadRecord(record);
				currentWin.show('', function() {
							currentWin.down('#LastNameID').focus(true);
						});
			});
	return addressGird;
}// create addressGrid

// 创建默认的Grid
function createMyfaxGrid() {
	// 创建Grid
	myfaxgrid = Ext.create('ws.defaultgrid.myfaxgrid', {
				frame : false,
				itemId : 'myfaxgrid',
				border : false
			});
	if (sessionToken && sessionToken != '') {
		// 调用Call 更新记录数
		var param = {};
		param.sessiontoken = sessionToken;
		// 调用
		WsCall.call('myfaxgrid', param, function(response, opts) {
					myfaxgrid.getStore().loadData(Ext.JSON
							.decode(response.data));
				}, function(response, opts) {
				}, false);
	}

	// 个人 Gird dblclick
	myfaxgrid.on('itemdblclick', function(view, record) {
				var node = FolderTree1.getStore()
						.getNodeById(record.data.gridId);
				FolderTree1.getSelectionModel().select(node, true);
			});
	return myfaxgrid;
}// create myfaxgrid

// 创建收藏夹grid
function createGrscGrid(treename) {
	// 创建Grid
	grscGrid = Ext.create('ws.defaultgrid.grscgrid', {
				frame : false,
				itemId : 'grscgrid',
				border : false
			});
	if (sessionToken && sessionToken != '') {
		// 调用Call 更新记录数
		var param = {};
		param.sessiontoken = sessionToken;
		param.folderid = 'grsc';
		param.recType = treename == 'FolderTree' ? 'INFAX' : 'DOCUMENT';
		// 调用
		WsCall.call('myfaxgrid', param, function(response, opts) {
					grscGrid.getStore()
							.loadData(Ext.JSON.decode(response.data));
				}, function(response, opts) {
				}, false);
	}

	// 个人 Gird dblclick
	grscGrid.on('itemdblclick', function(view, record) {
				var curTree = getCurrTree();
				var node = curTree.getStore().getNodeById('grsc'
						+ record.data.gridId);
				curTree.getSelectionModel().select(node, true);
			});
	return grscGrid;
}

// 创建他人委任grid
function createTrwrGrid(sels, treename) {
	// 创建Grid
	trwrGrid = Ext.create('ws.defaultgrid.OtherSubGrid', {
				frame : false,
				itemId : 'trwrgrid',
				border : false
			});
	if (sels[0].data.id == 'tr') {
		trwrGrid.getStore().loadData([['trwr', '']]);
	} else {
		// 调用Call 更新记录数
		var param = {};
		param.sessiontoken = sessionToken;
		param.folderid = 'trwr';
		param.recType = treename == 'FolderTree' ? 'INFAX' : 'WORKFLOW';
		// 调用
		WsCall.call('myfaxgrid', param, function(response, opts) {
					trwrGrid.getStore()
							.loadData(Ext.JSON.decode(response.data));
				}, function(response, opts) {
				}, false);
	}

	// 个人 Gird dblclick
	trwrGrid.on('itemdblclick', function(view, record) {
				var curTree = getCurrTree();
				var node = curTree.getStore().getNodeById(record.data.gridId);
				if (!node) {
					curTree.getStore().getNodeById('trwr').expand(false,
							function() {
								node = curTree.getStore()
										.getNodeById(record.data.gridId);
								curTree.getSelectionModel().select(node, true);
							});
				} else {
					curTree.getSelectionModel().select(node, true);
				}

			});
	return trwrGrid;
}

// 创建默认的Grid
function createWfDfGrid() {
	// 创建Grid
	wfdfgrid = Ext.create('ws.workflow.wfDfgrid', {
				frame : false,
				itemId : 'wfdfgrid',
				border : false
			});

	// 个人 Gird dblclick
	wfdfgrid.on('itemdblclick', function(view, record) {
				var node = wfTree.getStore().getNodeById(record.data.gridId);
				wfTree.getSelectionModel().select(node, true);
			});
	return wfdfgrid;
}

// 创建docGrid
function createDocGrid() {

	var tmpArr = new Array();
	// docManagerInfo.docManagerColMap.each( function(item,index,alls) {
	// tmpArr.push(item);
	// });
	tmpArr = sortGridColumns(myStates.docgridState.columns,
			docManagerInfo.docManagerColMap);
	docGrid = Ext.create('WS.docmanager.docgrid', {
				frame : false,
				itemId : 'DocGrid',
				stateId : 'docgridState',
				stateful : true,
				columns : tmpArr,
				border : false
			});

	// infax 选择变化
	docGrid.on('selectionchange', function(view, seles, op) {

		shiftImg = 0;
		ActionBase.updateActions('docmanager', seles);
		ActionBase.updateActions('templateAction', seles);
		if (seles.length <= 0) {
			return;
		}
		// alert(seles.length);
		// runner
		// if (runner && seles[0] && faxFileId != seles[0].data.faxFileID) {
		// ifLoading = 0;
		// runner.stopAll();
		// runner = new Ext.util.TaskRunner();
		// initAllFaxFileTabPngConfig(0,1);
		// gridSelsChange();
		// };
		var vffTab = viewFaxFileTab;
		var activeTab = vffTab.getLayout().getActiveItem();
		// runner
		if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId == "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);
			// gridSelsChange();

		} else if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId != "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);

		};
		setReadFlagTask.cancel();

		if (seles[0]) {
			// var mainForm = Ext.getCmp('viewPortEast');

			// 启动Task
			// var vffTab = viewFaxFileTab;
			// var activeTab = vffTab.getLayout().getActiveItem();
			if (activeTab.itemId == "PngTab" && seles[0].data.version == "0") {
				setReadFlagTask.delay(userConfig.autoReadSec * 1000,
						function() {
							var records = docGrid.getSelectionModel()
									.getSelection();
							if (records[0]) {
								records[0].set('version', '1'); // 标记为已读
								docGrid.getStore().getProxy().extraParams.toTrash = undefined;
								docGrid.getStore().sync();
								records[0].commit(true); // 将之前选中的数据设置脏数据为false
								getIsReadCount(
										Ext.StoreMgr.lookup('docTrstoreId'),
										docGrid.getStore().getProxy().extraParams.folderid);
							}

						});
			}

			// 有权限并为新图 而且是pngTab 时调用加载图片
			if (faxFileId != seles[0].data.faxFileID
					&& docGrid.privData.folderPrivView != 0
					&& activeTab.itemId == "PngTab") {
				// 切换选择的文件id
				initAllFaxFileTabPngConfig(seles[0].data.faxFileID, 1);
				gridSelsChange();
			}

			function setDetailForm(dp) {
				if (detailFormForDocgrid == "") {
					clearDetailForm();
					detailFormForDocgrid = loadDetailFormForDocgrid(seles[0]);
					dp.add(detailFormForDocgrid);
				} else {
					detailFormForDocgrid.updateAll(seles[0]);
				}

			}

			if (docTree.getSelectionModel().hasSelection()
					&& activeTab.itemId == "detailTab") {
				var detailPanel = viewFaxFileTab.down('#detailTab');
				var fsel = docTree.getSelectionModel().getSelection()[0];
				if (fsel.data.id == 'gr'
						|| fsel.data.id == WaveFaxConst.RecycleFolderID
						|| fsel.data.id == WaveFaxConst.PublicRootFolderID
						|| fsel.data.id == WaveFaxConst.PublicRecycleFolderID) {
					return setDetailForm(detailPanel);

				} // if seled fjx

				if (fsel.getDepth() > 1) {
					var depth = fsel.getDepth();
					var parentRoot = fsel.parentNode;
					for (var i = 2; i < depth; i++) {
						parentRoot = parentRoot.parentNode;
					}
					if (fsel.data.id.indexOf('grdc') != -1) {
						return setDetailForm(detailPanel);
					}
					if (parentRoot.data.id == WaveFaxConst.PublicRootFolderID) {
						return setDetailForm(detailPanel);
					}

					return;
				} // if depth

			} // if tree hassele
		} // if seles[0]
	}, this, {
		buffer : 100
	});
	return docGrid;
}// create docgrid

// 创建taskgrid
function createTaskGrid() {

	var tmpArr = new Array();
	// docManagerInfo.docManagerColMap.each( function(item,index,alls) {
	// tmpArr.push(item);
	// });
	tmpArr = sortGridColumns(myStates.taskgridState.columns,
			taskInfo.taskColMap);
	taskGrid = Ext.create('WS.workFlow.taskgrid', {
				frame : false,
				itemId : 'TaskGrid',
				stateId : 'taskgridState',
				stateful : true,
				columns : tmpArr,
				border : false
			});

	// taskgrid 选择变化
	taskGrid.on('selectionchange', function(view, seles, op) {
		shiftImg = 0;
		ActionBase.updateActions('taskmanager', seles);
		ActionBase.updateActions('templateAction', seles);
		if (seles.length <= 0) {
			return;
		}
		var vffTab = viewFaxFileTab;
		var activeTab = vffTab.getLayout().getActiveItem();
		// runner
		if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId == "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);
			// gridSelsChange();

		} else if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
				&& activeTab.itemId != "PngTab") {
			ifLoading = 0;
			runner.stopAll();
			runner = new Ext.util.TaskRunner();
			initAllFaxFileTabPngConfig(0, 1);

		};
		setReadFlagTask.cancel();

		if (seles[0]) {

			// 有权限并为新图 而且是pngTab 时调用加载图片
			if (faxFileId != seles[0].data.faxFileID
					&& activeTab.itemId == "PngTab") {
				// 切换选择的文件id
				initAllFaxFileTabPngConfig(seles[0].data.faxFileID, 1);
				gridSelsChange();
			}

			function setDetailForm(dp) {
				if (detailFormForTaskgrid == "") {
					clearDetailForm();
					detailFormForTaskgrid = loadDetailFormForTaskgrid(seles[0]);
					dp.add(detailFormForTaskgrid);
				} else {
					detailFormForTaskgrid.updateAll(seles[0]);
				}

			}
			function setWorkFlow(dp) {
				dp.removeAll();
				drawComponent = initDrawWf(seles[0].data.process);
				dp.add(drawComponent);
			}

			if (wfTree.getSelectionModel().hasSelection()
					&& activeTab.itemId == "detailTab") {
				var detailPanel = viewFaxFileTab.down('#detailTab');
				var fsel = wfTree.getSelectionModel().getSelection()[0];

				if (fsel.data.id.indexOf('wfen') != -1
						|| fsel.data.id.indexOf('wfwa') != -1
						|| fsel.data.id.indexOf('wfin') != -1
						|| fsel.data.id.indexOf('trwr') != -1) {
					return setDetailForm(detailPanel);

				} // if seled fjx

			} // if tree hassele
			if (wfTree.getSelectionModel().hasSelection()
					&& activeTab.itemId == "workflowTab") {
				var workflowPanel = viewFaxFileTab.down('#workflowTab');
				var fsel = wfTree.getSelectionModel().getSelection()[0];

				if (fsel.data.id.indexOf('wfen') != -1
						|| fsel.data.id.indexOf('wfwa') != -1
						|| fsel.data.id.indexOf('wfin') != -1) {
					return setWorkFlow(workflowPanel);

				} // if seled fjx

			} //

		} // if seles[0]
	}, this, {
		buffer : 100
	});
	return taskGrid;
}// create taskgrid

// wfruleGrid
// function createWfruleGrid() {
// var tmpArr = new Array();
// tmpArr =
// sortGridColumns(myStates.wfrulegridState.columns,ruleInfo.ruleColMap);
// 	
// wfruleGrid = Ext.create('WS.workflow.WfRuleGrid', {
// frame : false,
// itemId : 'wfruleGrid',
// stateId:'wfrulegridState',
// stateful:true,
// columns:tmpArr,
// border : false
// });
// // addressGird 选择变化
// wfruleGrid.on('selectionchange', function(view, seles, op) {
// shiftImg = 0;
// ActionBase.updateActions('WfRuleGridAc', seles);
// if(seles.length <=0) {
// return;
// }
// var vffTab = viewFaxFileTab;
// var activeTab = vffTab.getLayout().getActiveItem();
// // runner
// if (runner && seles[0] && faxFileId != seles[0].data.faxFileID
// &&activeTab.itemId == "PngTab") {
// ifLoading = 0;
// runner.stopAll();
// runner = new Ext.util.TaskRunner();
// initAllFaxFileTabPngConfig(0,1);
// }else if(runner && seles[0] && faxFileId != seles[0].data.faxFileID
// &&activeTab.itemId != "PngTab"){
// ifLoading = 0;
// runner.stopAll();
// runner = new Ext.util.TaskRunner();
// initAllFaxFileTabPngConfig(0,1);
// 			
// };
// setReadFlagTask.cancel();
// 
// if (seles[0]) {
// 
// function setDetailForm(dp) {
// if (detailFormForRulegrid == "") {
// clearDetailForm();
// detailFormForRulegrid = loadDetailFormForRulegrid(seles[0]);
// dp.add(detailFormForRulegrid);
// } else {
// detailFormForRulegrid.updateAll(seles[0]);
// }
// 
// }
// function setWorkFlow(dp){
// dp.removeAll();
// drawComponent = initDrawWf(seles[0].data.process);
// dp.add(drawComponent);
// }
// 
// if (wfTree.getSelectionModel().hasSelection() && activeTab.itemId
// =="detailTab") {
// var detailPanel = viewFaxFileTab.down('#detailTab');
// var fsel = wfTree.getSelectionModel().getSelection()[0];
// return setDetailForm(detailPanel);
// } // if tree hassele
// if (wfTree.getSelectionModel().hasSelection() && activeTab.itemId
// =="workflowTab") {
// var workflowPanel = viewFaxFileTab.down('#workflowTab');
// var fsel = wfTree.getSelectionModel().getSelection()[0];
// return setWorkFlow(workflowPanel);
// } //
// 			
// } // if seles[0]
// });
// 	
// return wfruleGrid;
// }//create wfruleGrid

// 切换Gird
function changeGridFront(name, okfun, sels, treename) {

	function reLoadSucfax(okfun1) {

		if (template) {
			// 调用取得服务器模版状态
			var param = {};
			param.folderid = sels[0].data.id;
			param.sessiontoken = sessionToken;
			param.treename = treename;
			var tName = false;
			var tStr = '';

			// 调用
			WsCall.call('gettplstate', param, function(response, opts) {
				var data = response.data;
				tStr = data;
				if (data != '') {
					Ext.Array.each(template.tplArr, function(item) {
								if (item[0] == data) {
									tName = item[2] + "(" + item[1] + ")";
									return false;
								}
							});
				}
				if (succoutfax.getStore().getProxy().extraParams.template == tStr) {
					template.setTplStates(tStr, tName, true, false, false,
							treename);
					template.reGetTplStyle(data);
					if (okfun1) {
						okfun1(currGrid);
					}
				} else {
					succoutfax.getStore().getProxy().extraParams.template = data;
					template.changeTemplate(tStr, tName, 'succoutfaxgrid',
							okfun1, true);
				}
			}, function(response, opts) {
				if (okfun1) {
					okfun1(currGrid);
				}
			}, false);
			// var tStr = tb.getStore().getProxy().extraParams.template;

		} else {
			if (okfun1) {
				okfun1(currGrid);
			}
		}
	}

	function reLoadOutfax(okfun1) {

		if (template) {

			// 调用取得服务器模版状态
			var param = {};
			param.folderid = sels[0].data.id;
			param.sessiontoken = sessionToken;
			param.treename = treename;
			var tName = false;
			var tStr = '';

			// 调用
			WsCall.call('gettplstate', param, function(response, opts) {
						var data = response.data;
						tStr = data;
						if (data != '') {
							Ext.Array.each(template.tplArr, function(item) {
										if (item[0] == data) {
											tName = item[2] + "(" + item[1]
													+ ")";
											return false;
										}
									});
						}
						if (outfax.getStore().getProxy().extraParams.template == tStr) {
							template.setTplStates(tStr, tName, true, false,
									false, treename);
							template.reGetTplStyle(data);
							if (okfun1) {
								okfun1(currGrid);
							}
						} else {
							outfax.getStore().getProxy().extraParams.template = data;
							template.changeTemplate(tStr, tName, 'outfaxgrid',
									okfun1, true);
						}
					}, function(response, opts) {
						if (okfun1) {
							okfun1(currGrid);
						}
					}, false);
			// var tStr = outfax.getStore().getProxy().extraParams.template;

		} else {
			if (okfun1) {
				okfun1(currGrid);
			}
		}
	}

	function reLoadInfax(okfun1) {

		if (template) {
			// 调用取得服务器模版状态
			var param = {};
			param.folderid = sels[0].data.id;
			param.sessiontoken = sessionToken;
			param.treename = treename;
			var tName = false;
			var tStr = '';

			// 调用
			WsCall.call('gettplstate', param, function(response, opts) {
						var data = response.data;
						tStr = data;
						if (data != '') {
							Ext.Array.each(template.tplArr, function(item) {
										if (item[0] == data) {
											tName = item[2] + "(" + item[1]
													+ ")";
											return false;
										}
									});
						}
						if (tb.getStore().getProxy().extraParams.template == tStr) {
							template.setTplStates(tStr, tName, true, false,
									false, treename);
							template.reGetTplStyle(data);
							if (okfun1) {
								okfun1(currGrid);
							}
						} else {
							tb.getStore().getProxy().extraParams.template = data;
							template.changeTemplate(tStr, tName, 'infaxgrid',
									okfun1, true);
						}
					}, function(response, opts) {
						if (okfun1) {
							okfun1(currGrid);
						}
					}, false);
			// var tStr = tb.getStore().getProxy().extraParams.template;

		} else {
			if (okfun1) {
				okfun1(currGrid);
			}
		}
	}

	function reLoadDocGrid(okfun1) {

		if (template) {
			// 调用取得服务器模版状态
			var param = {};
			param.folderid = sels[0].data.id;
			param.sessiontoken = sessionToken;
			param.treename = treename;
			var tName = false;
			var tStr = '';

			// 调用
			WsCall.call('gettplstate', param, function(response, opts) {
				var data = response.data;
				tStr = data;
				if (data != '') {
					Ext.Array.each(template.tplArr, function(item) {
								if (item[0] == data) {
									tName = item[2] + "(" + item[1] + ")";
									return false;
								}
							});
				}
				if (docGrid.getStore().getProxy().extraParams.template == tStr) {
					template.setTplStates(tStr, tName, true, false, false,
							treename);
					template.reGetTplStyle(data);
					if (okfun1) {
						okfun1(currGrid);
					}
				} else {
					docGrid.getStore().getProxy().extraParams.template = data;
					template.changeTemplate(tStr, tName, 'docgrid', okfun1,
							true);
				}
			}, function(response, opts) {
				if (okfun1) {
					okfun1(currGrid);
				}
			}, false);
			// var tStr = tb.getStore().getProxy().extraParams.template;

		} else {
			if (okfun1) {
				okfun1(currGrid);
			}
		}
	}

	function reLoadTaskGrid(okfun1) {

		if (template) {
			// 调用取得服务器模版状态
			var param = {};
			param.folderid = sels[0].data.id;
			param.sessiontoken = sessionToken;
			param.treename = treename;
			var tName = false;
			var tStr = '';

			// 调用
			WsCall.call('gettplstate', param, function(response, opts) {
				var data = response.data;
				tStr = data;
				if (data != '') {
					Ext.Array.each(template.tplArr, function(item) {
								if (item[0] == data) {
									tName = item[2] + "(" + item[1] + ")";
									return false;
								}
							});
				}
				if (taskGrid.getStore().getProxy().extraParams.template == tStr) {
					template.setTplStates(tStr, tName, true, false, false,
							treename);
					template.reGetTplStyle(data);
					if (okfun1) {
						okfun1(currGrid);
					}
				} else {
					taskGrid.getStore().getProxy().extraParams.template = data;
					template.changeTemplate(tStr, tName, 'taskgrid', okfun1,
							true);
				}
			}, function(response, opts) {
				if (okfun1) {
					okfun1(currGrid);
				}
			}, false);
			// var tStr = tb.getStore().getProxy().extraParams.template;

		} else {
			if (okfun1) {
				okfun1(currGrid);
			}
		}
	}

	treeSelDelay.cancel();
	// createDocGrid

	if (name != 'grscgrid' && currGrid && currGrid.itemId.toLowerCase() == name) {
		if (name == 'succoutfaxgrid') {
			if (succoutfax) {
				currGrid = succoutfax;
				sucfaxInfo.loadDefault();
				reLoadSucfax(okfun);
				return;
			}
		}
		if (name == 'outfaxgrid') {
			if (outfax) {
				currGrid = outfax;
				outfaxInfo.loadDefault();
				reLoadOutfax(okfun);
				// 加载发件箱自动刷新
				ofRefreshTask();
				return;
			}
		}
		if (name == 'infaxgrid') {
			if (tb) {
				currGrid = tb;
				infaxInfo.loadDefault();
				reLoadInfax(okfun);
				return;
			}
		}
		if (name == 'docgrid') {
			if (docGrid) {
				currGrid = docGrid;
				docManagerInfo.loadDefault();
				reLoadDocGrid(okfun);
				return;
			}
		}
		if (name == 'taskgrid') {
			if (taskGrid) {
				currGrid = taskGrid;
				taskInfo.loadDefault();
				reLoadTaskGrid(okfun);
				return;
			}
		}
		if (okfun) {
			okfun(currGrid);
		}
		return;
	}

	var container = viewPortEast.down('#centerCenterView');

	treeSelDelay.delay(50, function() {

		// currGrid.getStore().filterMap =Ext.create('Ext.util.HashMap');
		// currGrid.getStore().loadData([]);
		currGrid.hide();
		// currGrid

		if (name == 'myfaxgrid') {
			if (myfaxgrid) {
				// 调用Call 更新记录数
				var param = {};
				param.sessiontoken = sessionToken;
				// 调用
				WsCall.call('myfaxgrid', param, function(response, opts) {
							myfaxgrid.getStore().loadData(Ext.JSON
									.decode(response.data));
						}, function(response, opts) {
						}, false);
				currGrid = myfaxgrid;
				currGrid.show();
				// currGrid.getStore().load();
			} else {
				currGrid = createMyfaxGrid();
			}
		}

		if (name == 'trwrGrid') {
			if (trwrGrid) {
				if (sels[0].data.id == 'tr') {
					trwrGrid.getStore().loadData([['trwr', '']]);
				} else {
					// 调用Call 更新记录数
					var param = {};
					param.sessiontoken = sessionToken;
					param.folderid = 'trwr';
					param.recType = treename == 'FolderTree'
							? 'INFAX'
							: 'WORKFLOW';
					// 调用
					WsCall.call('myfaxgrid', param, function(response, opts) {
								trwrGrid.getStore().loadData(Ext.JSON
										.decode(response.data));
							}, function(response, opts) {
							}, false);
				}
				currGrid = trwrGrid;
				currGrid.show();
				// currGrid.getStore().load();
			} else {
				currGrid = createTrwrGrid(sels, treename);
			}
		}

		if (name == 'grscgrid') {
			if (grscGrid) {
				// 调用Call 更新记录数
				var param = {};
				param.sessiontoken = sessionToken;
				param.folderid = 'grsc';
				param.recType = treename == 'FolderTree' ? 'INFAX' : 'DOCUMENT';
				// 调用
				WsCall.call('myfaxgrid', param, function(response, opts) {
							grscGrid.getStore().loadData(Ext.JSON
									.decode(response.data));
						}, function(response, opts) {
						}, false);
				currGrid = grscGrid;
				currGrid.show();
				// currGrid.getStore().load();
			} else {
				currGrid = createGrscGrid(treename);
			}
		}
		if (name == 'addressgrid') {
			if (addressGird) {
				currGrid = addressGird;
				currGrid.show();
				// currGrid.loadGrid();
			} else {
				createSAddressStroe();
				currGrid = createAddressGrid();
			}

		}
		if (name == 'draftgrid') {
			if (draftGrid) {
				currGrid = draftGrid;
				currGrid.show();
				// currGrid.loadGrid();
			} else {
				createSDraftStroe();
				currGrid = createDraftGrid();
			}

		}
		if (name == 'succoutfaxgrid') {

			if (succoutfax) {
				currGrid = succoutfax;
				currGrid.show();
				sucfaxInfo.loadDefault();
				reLoadSucfax(function() {
							if (okfun) {
								okfun(currGrid);
							}
						});
				return;
				// currGrid.show();
				// currGrid.loadGrid();
			} else {
				sucfaxInfo.loadDefault();
				createsucfaxModel();
				createSuccoutFaxStroe();
				currGrid = createSuccoutFaxGrid();
			}

		}

		if (name == 'outfaxgrid') {

			if (outfax) {
				currGrid = outfax;
				currGrid.show();
				outfaxInfo.loadDefault();
				reLoadOutfax(function() {
							if (okfun) {
								okfun(currGrid);
							}
						});
				// 加载发件箱自动刷新
				ofRefreshTask();
				return;
				// currGrid.show();
				// currGrid.loadGrid();
			} else {
				outfaxInfo.loadDefault();
				createoutfaxModel();
				createOutFaxStore();
				currGrid = createOutFaxGrid();
			}
			// 加载发件箱自动刷新
			ofRefreshTask();
		}

		if (name == 'infaxgrid') {
			// alert('frit');
			if (tb) {
				currGrid = tb;
				currGrid.show();
				infaxInfo.loadDefault();
				reLoadInfax(function() {
							if (okfun) {
								okfun(currGrid);
							}
						});
				return;
				// currGrid.loadGrid();
			} else {
				// alert('new');
				infaxInfo.loadDefault();
				createInfaxModel();
				createInfaxStroe();
				currGrid = createInfaxGrid();
			}

		}

		if (name == 'docgrid') {

			if (docGrid) {
				currGrid = docGrid;
				currGrid.show();
				docManagerInfo.loadDefault();
				reLoadDocGrid(function() {
							if (okfun) {
								okfun(currGrid);
							}
						});
				return;
				// currGrid.loadGrid();
			} else {
				docManagerInfo.loadDefault();
				createDocgridModel();
				createDocgridStroe();
				currGrid = createDocGrid();
			}

		}

		if (name == 'taskgrid') {

			if (taskGrid) {
				currGrid = taskGrid;
				currGrid.show();
				taskInfo.loadDefault();
				reLoadTaskGrid(function() {
							if (okfun) {
								okfun(currGrid);
							}
						});
				return;
				// currGrid.loadGrid();
			} else {
				taskInfo.loadDefault();
				createTaskgridModel();
				createTaskgridStroe();
				currGrid = createTaskGrid();
			}

		}

		if (name == 'wfdfgrid') {
			if (wfdfgrid) {
				currGrid = wfdfgrid;
				currGrid.show();
				// currGrid.getStore().load();
			} else {
				currGrid = createWfDfGrid();
			}
		}

		// if(name == 'wfrulegrid') {
		// if(wfruleGrid) {
		// currGrid = wfruleGrid;
		// currGrid.show();
		// //currGrid.loadGrid();
		// } else {
		// ruleInfo.loadDefault();
		// createWfRulegridModel();
		// createWfRuleGridStore();
		// currGrid = createWfruleGrid();
		// }
		// 
		// }

		container.add(currGrid);
		if (name == 'infaxgrid') {
			reLoadInfax(okfun);
			return;
		}
		if (name == 'outfaxgrid') {
			reLoadOutfax(okfun);
			return;
		}
		if (name == 'succoutfaxgrid') {
			reLoadSucfax(okfun);
			return;
		}
		if (name == 'docgrid') {
			reLoadDocGrid(okfun);
			return;
		}
		if (name == 'taskgrid') {
			reLoadTaskGrid(okfun);
			return;
		}

		if (okfun) {
			okfun(currGrid);
		}

	});
}

// 创建自动完成层
acSelItemsControl.createAcDiv();

Ext.onReady(function() {
	// alert(Ext.util.Cookies.get('JSESSIONID'));

	var loadingDiv = document.getElementById('loadingDiv');
	if (loadingDiv)
		document.body.removeChild(loadingDiv);

	// tooltip
	Ext.tip.QuickTipManager.init();

	// 处理全屏大小
	// window.onresize = function() {
		// if (viewPortEast && viewPortEast != '') {
			// var activeTab = viewFaxFileTab.getLayout().getActiveItem();
			// var csPal = viewPortEast.down('#centerSouthView');
// 
			// if (csPal.isFullScreen) {
				// var cpltmH1 = Ext.getBody().getHeight()
						// - (cplHeight + csPal.getHeight());
				// csPal.setHeight(cplHeight + csPal.getHeight() + cpltmH1);
			// }
		// }
	// }

	// Ext.getBody().on('contextmenu',function(e) {
	// e.stopEvent();
	// }
	// );

	// Ext.override(Ext.Element, {
	// isDescendantOf:function(con){
	// return true;
	// }
	// });

	lineEditor = loadLineEditor();
	// 重写window 让其默认不超界
	Ext.override(Ext.window.Window, {
				constrainHeader : true
			});

	// 重写 isValidParent
	Ext.override(Ext.layout.Layout, {

		isValidParent : function(item, target, position) {
			var itemDom = item.el ? item.el.dom : Ext.getDom(item), targetDom = (target && target.dom)
					|| target;

			if (itemDom.parentNode
					&& itemDom.parentNode.className
					&& itemDom.parentNode.className.indexOf(Ext.baseCSSPrefix
							+ 'resizable-wrap') !== -1) {
				itemDom = itemDom.parentNode;
			}
			if (itemDom && targetDom) {
				if (typeof position == 'number') {
					return itemDom === targetDom.childNodes[position];
				}
				return itemDom.parentNode === targetDom;
			}
			return false;
		}
	});

	// 重写树store
	// Ext.override(Ext.data.TreeStore, {
	// load: function(options) {
	// options = options || {};
	// options.params = options.params || {};
	// 
	// var me = this,
	// node = options.node || me.tree.getRootNode(),
	// root;
	// 
	// if (!node) {
	// node = me.setRootNode({
	// expanded: true
	// });
	// }
	// 
	// if (me.clearOnLoad) {
	// node.removeAll(false);
	// }
	// 
	// Ext.applyIf(options, {
	// node: node
	// });
	// options.params[me.nodeParam] = node ? node.getId() : 'root';
	// 
	// if (node) {
	// node.set('loading', true);
	// }
	// 
	// return me.callParent([options]);
	// }
	// });
	// 设置弹出对话框的文字
	newMesB.buttonText.yes = '是';
	newMesB.buttonText.no = '否';
	newMesB.buttonText.ok = '确定';
	newMesB.buttonText.cancel = '取消';

	// expMesB.buttonText.ok = '下载';
	// expMesB.buttonText.cancel ='取消';

	// 重写alert
	Ext.override(Ext.window.MessageBox, {
				alert : function(cfg, msg, fn, scope) {
					if (Ext.isString(cfg)) {
						cfg = {
							title : cfg,
							msg : msg,
							buttons : this.OK,
							fn : fn,
							scope : scope,
							minWidth : this.minWidth < 330
									? 330
									: this.minWidth
						};
					}
					return this.show(cfg);
				}
			});

	// 工具栏
	northTb = Ext.create('tbNorthViewHeaderTop', {
				itemId : 'northView',
				region : 'north',
				frame : false,
				border : false,
				height : 28
			});
	southTb = Ext.create('bottomStatusBar', {
				listeners : {
					render : function(tb) {
						tb.down('#menuID').hide();
						tb.down('#ptypeID').hide();
					}
				}
			});
	// 详细信息及图像浏览
	viewFaxFileTab = Ext.create('viewFaxFileTab', {
				frame : false,
				width : '100%'
			});
	// 加载默认的myfaxGrid
	currGrid = createMyfaxGrid();
	// changeGridFront('myfaxgrid');
	// currGrid = createInfaxGrid();

	// 传真图 详细信息切换按钮
	centerSVBtn = Ext.create('Ext.panel.Panel', {
		border : false,
		bodyBorder : false,
		height : 20,
		bodyCls : 'x-toolbar-default',
		layout : {
			type : 'auto'
		},
		dock : 'top',
		items : [{
			xtype : 'button',
			text : '传真图',
			// cls: 'panelFormBg',
			disabled : true,
			itemId : 'btnPng',
			// enabletoggle:true,
			// toggleGroup:'viewFaxFileTab1',
			listeners : {
				click : function(btn) {
					var pressed = moniToggle(btn);
					var me = this;
					if (pressed == 'png') {
						var mainForm = Ext.getCmp('viewPortEast');
						var btnCancel = mainForm.down('#btnCancel');
						var btnContinue = mainForm.down('#btnContinue');
						function rtControl(sele) {
							if (sele && runner && task && ifLoading == 0) {
								ifLoading = 1;
								runner.start(task);
								btnCancel.hide();
							}
						}

						me.up('#centerSouthView').down('#viewFaxFileTab')
								.getLayout().setActiveItem(0);

						// (new Ext.util.DelayedTask()).delay(100, function() {
						// 有权限并为新图 而且是pngTab 时调用加载图片
						// var gridPanel = mainForm.down('#centerCenterView');
						// var currentgird =
						// gridPanel.getLayout().getActiveItem();
						var currentgird = currGrid;
						if (currentgird == null) {
							return;
						}
						var activeTab = mainForm.down('#viewFaxFileTab')
								.getLayout().getActiveItem();

						if (currentgird.itemId == 'Infaxgrid') {
							var sel = currentgird.getSelectionModel()
									.getSelection()[0];
							rtControl(sel);
							if (sel && faxFileId != sel.data.faxFileID
									&& currentgird.privData.folderPrivView != 0
									&& activeTab.itemId == "PngTab") {
								// 切换选择的文件id
								initAllFaxFileTabPngConfig(sel.data.faxFileID,
										1);
								gridSelsChange();
							}
							if (activeTab.itemId == "PngTab" && sel
									&& sel.data.version == "0") {
								setReadFlagTask.delay(userConfig.autoReadSec
												* 1000, function() {
											var records = tb
													.getSelectionModel()
													.getSelection();
											if (records[0]) {
												records[0].set('version', '1'); // 标记为已读
												tb.getStore().getProxy().extraParams.toTrash = undefined;
												tb.getStore().sync();
												records[0].commit(true); // 将之前选中的数据设置脏数据为false
												getIsReadCount(
														Ext.StoreMgr
																.lookup('folderTrstoreId'),
														tb.getStore()
																.getProxy().extraParams.folderid);
											}

										});
							}

							return;
						}
						if (currentgird.itemId == 'outfaxgrid') {
							var sel2 = outfax.getSelectionModel()
									.getSelection()[0];
							rtControl(sel2);
							if (sel2 && faxFileId != sel2.data.faxFileID
									&& activeTab.itemId == "PngTab"
									&& sel2.data.status != 2
									&& sel2.data.status != 0) {
								// 切换选择的文件id
								initAllFaxFileTabPngConfig(sel2.data.faxFileID,
										1);
								gridSelsChange();
							}
							return;
						}
						if (currentgird.itemId == 'succoutfaxgrid') {
							var sel3 = succoutfax.getSelectionModel()
									.getSelection()[0];
							rtControl(sel3);
							if (sel3 && faxFileId != sel3.data.faxFileID
									&& activeTab.itemId == "PngTab") {
								// 切换选择的文件id
								initAllFaxFileTabPngConfig(sel3.data.faxFileID,
										1);
								gridSelsChange();
							}
							return;
						}

						if (currentgird.itemId == 'draftgrid') {
							var sel4 = draftGrid.getSelectionModel()
									.getSelection()[0];
							rtControl(sel4);
							if (sel4 && faxFileId != sel4.data.faxFileID
									&& activeTab.itemId == "PngTab") {
								// 切换选择的文件id
								initAllFaxFileTabPngConfig(sel4.data.faxFileID,
										1);
								gridSelsChange();
							}
							return;
						}

						if (currentgird.itemId == 'DocGrid') {
							var sel5 = docGrid.getSelectionModel()
									.getSelection()[0];
							rtControl(sel5);
							if (sel5 && faxFileId != sel5.data.faxFileID
									&& activeTab.itemId == "PngTab") {
								// 切换选择的文件id
								initAllFaxFileTabPngConfig(sel5.data.faxFileID,
										1);
								gridSelsChange();
							}
							if (activeTab.itemId == "PngTab" && sel5
									&& sel5.data.version == "0") {
								setReadFlagTask.delay(userConfig.autoReadSec
												* 1000, function() {
											var records1 = docGrid
													.getSelectionModel()
													.getSelection();
											if (records1[0]) {
												records1[0].set('version', '1'); // 标记为已读
												docGrid.getStore().getProxy().extraParams.toTrash = undefined;
												docGrid.getStore().sync();
												records1[0].commit(true); // 将之前选中的数据设置脏数据为false
												getIsReadCount(
														Ext.StoreMgr
																.lookup('docTrstoreId'),
														docGrid.getStore()
																.getProxy().extraParams.folderid);
											}

										});
							}
							return;
						}

						if (currentgird.itemId == 'TaskGrid') {
							var sel6 = taskGrid.getSelectionModel()
									.getSelection()[0];
							rtControl(sel6);
							if (sel6 && faxFileId != sel6.data.faxFileID
									&& activeTab.itemId == "PngTab") {
								// alert(sel6.data.faxFileID);
								// 切换选择的文件id
								initAllFaxFileTabPngConfig(sel6.data.faxFileID,
										1);
								// alert(isLoaded);
								gridSelsChange();

							}
							return;
						}
						// });
					}
				}
			}
		}, {
			xtype : 'button',
			itemId : 'btnDetail',
			margin : '0 0 0 5',
			// cls: 'panelFormBg',
			text : '详细信息',
			// enabletoggle:true,
			// toggleGroup:'viewFaxFileTab1',
			listeners : {
				click : function(btn) {
					var pressed = moniToggle(btn);
					var me = this;
					if (pressed == 'detail' || pressed == 'detail2') {
						var mainForm = Ext.getCmp('viewPortEast');
						var detailPanel = mainForm.down('#detailTab');
						var btnCancel = mainForm.down('#btnCancel');
						var btnContinue = mainForm.down('#btnContinue');
						// alert(ifLoading);
						if (runner && pressed == 'detail') {
							ifLoading = 0;
							runner.stopAll();
							runner = new Ext.util.TaskRunner();
							btnCancel.hide();
						}

						setReadFlagTask.cancel();
						me.up('#centerSouthView').down('#viewFaxFileTab')
								.getLayout().setActiveItem(1);
						// (new Ext.util.DelayedTask()).delay(100, function() {
						// afterLDPng();
						// 有权限并为新图 而且是pngTab 时调用加载图片
						var gridPanel = mainForm.down('#centerCenterView');
						// var currentgird =
						// gridPanel.getLayout().getActiveItem();
						var currentgird = currGrid;
						if (currentgird == null) {
							return;
						}
						if (!currentgird.getSelectionModel().getSelection()[0]) {
							afterLDPng();
							return;
						}

						if (currentgird.itemId == 'Infaxgrid') {
							var sel = currentgird.getSelectionModel()
									.getSelection()[0];
							if (detailFormForInfaxgrid == "") {
								clearDetailForm();
								detailFormForInfaxgrid = loadDetailFormForInfaxgrid(sel);
								detailPanel.add(detailFormForInfaxgrid);
							} else {
								detailFormForInfaxgrid.updateAll(sel);
							}
							return;
						}
						if (currentgird.itemId == 'outfaxgrid') {
							var sel2 = outfax.getSelectionModel()
									.getSelection()[0];
							if (detailFormForOutfaxgrid == "") {
								clearDetailForm();
								detailFormForOutfaxgrid = loadDetailFormForOutfaxgrid(sel2);
								detailPanel.add(detailFormForOutfaxgrid);
							} else {
								detailFormForOutfaxgrid.updateAll(sel2);
							}
							return;
						}
						if (currentgird.itemId == 'succoutfaxgrid') {
							var sel3 = succoutfax.getSelectionModel()
									.getSelection()[0];
							if (detailFormForSuccoutfaxgrid == "") {
								clearDetailForm();
								detailFormForSuccoutfaxgrid = loadDetailFormForSuccoutfaxgrid(sel3);
								detailPanel.add(detailFormForSuccoutfaxgrid);
							} else {
								detailFormForSuccoutfaxgrid.updateAll(sel3);
							}

							return;
						}

						if (currentgird.itemId == 'draftgrid') {
							var sel4 = draftGrid.getSelectionModel()
									.getSelection()[0];
							if (detailFormForDraftgrid == "") {
								clearDetailForm();
								detailFormForDraftgrid = loadDetailFormForDraftgrid(sel4);
								detailPanel.add(detailFormForDraftgrid);
							} else {
								detailFormForDraftgrid.updateAll(sel4);
							}
							return;
						}

						if (currentgird.itemId == 'DocGrid') {
							var sel5 = docGrid.getSelectionModel()
									.getSelection()[0];
							if (detailFormForDocgrid == "") {
								clearDetailForm();
								detailFormForDocgrid = loadDetailFormForDocgrid(sel5);
								detailPanel.add(detailFormForDocgrid);
							} else {
								detailFormForDocgrid.updateAll(sel5);
							}
							return;
						}

						if (currentgird.itemId == 'TaskGrid') {
							var sel6 = taskGrid.getSelectionModel()
									.getSelection()[0];
							if (detailFormForTaskgrid == "") {
								clearDetailForm();
								detailFormForTaskgrid = loadDetailFormForTaskgrid(sel6);
								detailPanel.add(detailFormForTaskgrid);
							} else {
								detailFormForTaskgrid.updateAll(sel6);
							}
							return;
						}
						// if(currentgird.itemId == 'wfruleGrid') {
						// var sel7 =
						// wfruleGrid.getSelectionModel().getSelection()[0];
						// if (detailFormForRulegrid == "") {
						// clearDetailForm();
						// detailFormForRulegrid =
						// loadDetailFormForRulegrid(sel7);
						// detailPanel.add(detailFormForRulegrid);
						// } else {
						// detailFormForRulegrid.updateAll(sel7);
						// }
						// return;
						// }
						// });
					}
				}
			}
		}, {
			xtype : 'button',
			itemId : 'btnWorkFlow',
			margin : '0 0 0 5',
			hidden : true,
			text : '工作流任务图',
			listeners : {
				click : function(btn) {
					var pressed = moniToggle(btn);
					var me = this;
					if (pressed == 'workflow' || pressed == 'workflow2') {
						var mainForm = Ext.getCmp('viewPortEast');
						var workFlowPanel = mainForm.down('#workflowTab');
						var viewPal = me.up('#centerSouthView')
								.down('#viewFaxFileTab');
						var btnCancel = mainForm.down('#btnCancel');
						var btnContinue = mainForm.down('#btnContinue');
						// alert(ifLoading);
						if (runner && pressed == 'workflow') {
							// alert(1);
							ifLoading = 0;
							runner.stopAll();
							runner = new Ext.util.TaskRunner();
							btnCancel.hide();
						}

						setReadFlagTask.cancel();

						viewPal.getLayout().setActiveItem(2);
						// (new Ext.util.DelayedTask()).delay(100, function() {
						// afterLDPng();
						// 有权限并为新图 而且是pngTab 时调用加载图片
						var gridPanel = mainForm.down('#centerCenterView');
						// var currentgird =
						// gridPanel.getLayout().getActiveItem();
						var currentgird = currGrid;
						if (currentgird == null) {
							return;
						}
						if (!currentgird.getSelectionModel().getSelection()[0]) {
							return;
						}
						if (currentgird.itemId == 'TaskGrid') {
							var sel6 = taskGrid.getSelectionModel()
									.getSelection()[0];
							if (drawComponent == "") {
								workFlowPanel.removeAll();
								drawComponent = initDrawWf(sel6.data.process);
								workFlowPanel.add(drawComponent);
							} else {

							}
							return;
						}// });

						// if(currentgird.itemId == 'wfruleGrid') {
						// var sel7 =
						// wfruleGrid.getSelectionModel().getSelection()[0];
						// if (drawComponent == "") {
						// workFlowPanel.removeAll();
						// drawComponent = initDrawWf(sel7.data.process);
						// workFlowPanel.add(drawComponent);
						// } else {
						// 								
						// }
						// return;
						// }//});
					}
				}
			}
		}, {
			xtype : 'button',
			itemId : 'exitFill',
			margin : '0 0 0 5',
			hidden : true,
			text : '退出全屏模式',
			handler : function() {
				seeFillFax();
			}
		}]

	});

	// 加载进度function
	function programeLoad(msgStr, nextFun) {
		// loginLoading.hide();
		Ext.getBody().unmask();
		Ext.getBody().mask(msgStr);
		// loginLoading = new Ext.LoadMask(Ext.getBody(), {
		// msg:msgStr
		// });
		// loginLoading.show();
		if (nextFun) {
			(new Ext.util.DelayedTask()).delay(50, function() {
						nextFun();
					});
		}

	}

	// 加载完毕
	function loadLast() {
		// if(loginLoading && loginLoading.hide) {
		(new Ext.util.DelayedTask()).delay(500, function() {
					// loginLoading.hide();
					Ext.getBody().unmask();
				});
		// }
		var mainForm = Ext.getCmp('viewPortEast');
		var welcomeheader = viewPortEast.down('#headerWelcome');
		// welcomeheader.setText('当前用户:'+ userInfo + '');
		welcomeheader.setText('当前用户:' + userInfoData.accountName + '');
		// 设置保存状态对应用户
		wsUserStates.userName = userInfoData.accountName;
		// var gridPanel = mainForm.down('#centerCenterView');
		// gridPanel.getLayout().setActiveItem('myfaxgrid');
		// changeGridFront('myfaxgrid');

		// 加载State
		if (myStates.currtree) {
			for (key in myStates.currtree) {
				if (!myStates.currtree[key] || key == 'stateSaved')
					continue;
				if (myStates.currtree[key] == 'docTree' && docTree
						&& docTree.expand) {
					(new Ext.util.DelayedTask()).delay(5, function() {
								docTree.expand();
							});
					break;
				}
				if (myStates.currtree[key] == 'addressTree' && addressTree1
						&& addressTree1.expand) {
					(new Ext.util.DelayedTask()).delay(5, function() {
								addressTree1.expand();
							});
					break;
				}
				if (myStates.currtree[key] == 'wfTree' && wfTree
						&& wfTree.expand) {
					(new Ext.util.DelayedTask()).delay(5, function() {
								wfTree.expand();
							});
					break;
				}

				if (myStates.currtree[key] == 'FolderTree' && FolderTree1
						&& FolderTree1.expand) {

					(new Ext.util.DelayedTask()).delay(5, function() {
						var mainForm = Ext.getCmp('viewPortEast');
						var btnDetailTab = mainForm.down('#btnDetail');
						// btnDetailTab.toggle(true);
						btnDetailTab.fireEvent('click', btnDetailTab);
						loadDefaultPng();
						// 判断树的选择
						(new Ext.util.DelayedTask()).delay(50, function() {
							if (!FolderTree1.getSelectionModel().hasSelection()) {
								FolderTree1.getSelectionModel().select(0, true);
							}
						});
							// FolderTree1.expand();
					});
					break;
				}
			}
		}

		// myfaxgrid.getStore().load();

		// 调用Call 更新记录数
		var param = {};
		param.sessiontoken = sessionToken;
		// 调用
		WsCall.call('myfaxgrid', param, function(response, opts) {
					myfaxgrid.getStore().loadData(Ext.JSON
							.decode(response.data));
				}, function(response, opts) {
				}, false);

		// 判断树的选择
		// if (FolderTree1 && FolderTree1.isVisible &&!FolderTree1.collapsed &&
		// FolderTree1.getSelectionModel().hasSelection()) {
		// FolderTree1.getSelectionModel().select(0, true);
		// }
	}

	// 传真编辑窗口加载
	loadFaxEditor = function() {

		if (colorPicker) {
			return;
		}

		// 初始化字体调色板
		colorPicker = Ext.create('Ext.menu.ColorPicker', {
					value : '000000',
					handler : function(cm, color) {
						var html = fontEditor.down('htmleditor').getValue();
						var temp = stampcls.getStampList()
								.getByKey(fontEditor.comId);
						temp.fontColor = '#' + color;
						fontEditor.down('htmleditor').setValue(creatHtmlByStt(
								temp, html));
						fontEditor.down('#colorBtn').setText('文字'
								+ " <label style=background-color:#" + color
								+ ";>&nbsp;&nbsp;&nbsp;</label> ");
						// Ext.Msg.alert('Color Selected', '<span
						// style="color:#' + color + ';">You choose
						// '+color+'.</span>');
					}
				});

		// 初始化背景调色板
		bgcolorPicker = Ext.create('Ext.menu.ColorPicker', {
					value : 'FFFFFF',
					handler : function(cm, color) {
						var html = fontEditor.down('htmleditor').getValue();
						var curSel = winImageEditor.down('#' + fontEditor.comId
								+ '');
						var temp = stampcls.getStampList()
								.getByKey(fontEditor.comId);
						temp.bgColor = '#' + color;
						fontEditor.down('htmleditor').setValue(creatHtmlByStt(
								temp, html));
						fontEditor.down('#bgcolorBtn').setText('背景'
								+ " <label style=background-color:#" + color
								+ ";>&nbsp;&nbsp;&nbsp;</label> ");
						// Ext.Msg.alert('Color Selected', '<span
						// style="color:#' + color + ';">You choose
						// '+color+'.</span>');
					}
				});

		// 重写htmlEnditor
		Ext.override(Ext.form.HtmlEditor, {
			// private
			defaultValue : (Ext.isOpera || Ext.isIE6) ? '&#160;' : '&#8203;',
			cleanHtml : function(html) {
				var dv = this.defaultValue;
				html = String(html);

				if (Ext.isWebKit) { // strip safari nonsense
					html = html
							.replace(
									/\sclass="(?:Apple-style-span|khtml-block-placeholder)"/gi,
									'');
				}

				if (html.charCodeAt(0) == dv.replace(/\D/g, '')) {
					html = html.substring(1);
				}
				return html;
			}
		});

		// 初始化字体编辑器
		fontEditor = Ext.create('Ext.window.Window', {
			title : '添加批注',
			modal : true,
			closeAction : 'hide',
			height : 250,
			width : 590,
			resizable : false,
			layout : 'auto',
			defaults : {
				width : 578
			},
			items : [{
				xtype : 'panel',
				// bodyCls: 'panelFormBg',
				border : false,
				layout : {
					type : 'table',
					columns : 9
				},
				defaults : {
					xtype : 'button',
					margin : '2 2 2 2'
				},
				items : [{
					text : '<b>B</b>',
					tooltip : '粗体',
					width : 22,
					handler : function() {
						var me = this;
						var html = me.up('window').down('htmleditor')
								.getValue();
						var temp = stampcls.getStampList()
								.getByKey(fontEditor.comId);
						if (temp.isBold) {
							temp.isBold = false;
						} else {
							temp.isBold = true;
						}
						me.up('window').down('htmleditor')
								.setValue(creatHtmlByStt(temp, html));
					}
				}, {
					text : '<i>I</i>',
					tooltip : '斜体',
					width : 22,
					handler : function() {
						var me = this;
						var html = me.up('window').down('htmleditor')
								.getValue();
						var temp = stampcls.getStampList()
								.getByKey(fontEditor.comId);
						if (temp.isItalic) {
							temp.isItalic = false;
						} else {
							temp.isItalic = true;
						}
						me.up('window').down('htmleditor')
								.setValue(creatHtmlByStt(temp, html));
					}
				}, {
					text : '<u>U</u>',
					tooltip : '下划线',
					width : 22,
					handler : function() {
						var me = this;
						var html = me.up('window').down('htmleditor')
								.getValue();
						var temp = stampcls.getStampList()
								.getByKey(fontEditor.comId);
						if (temp.isUnderLine) {
							temp.isUnderLine = false;
						} else {
							temp.isUnderLine = true;
						}
						me.up('window').down('htmleditor')
								.setValue(creatHtmlByStt(temp, html));
					}
				}, {
					text : '<del>D</del>',
					tooltip : '删除线',
					width : 22,
					handler : function() {
						var me = this;
						var html = me.up('window').down('htmleditor')
								.getValue();
						var temp = stampcls.getStampList()
								.getByKey(fontEditor.comId);
						if (temp.isStrikeOut) {
							temp.isStrikeOut = false;
						} else {
							temp.isStrikeOut = true;
						}
						me.up('window').down('htmleditor')
								.setValue(creatHtmlByStt(temp, html));
					}
				}, {
					xtype : 'combo',
					queryMode : 'local',
					itemId : 'cbFontName',
					value : 'Tahoma',
					editable : false,
					store : fontFamilies,
					listeners : {
						change : function(combo, nVal, oVal, opts) {
							var me = this;
							var html = me.up('window').down('htmleditor')
									.getValue();
							var temp = stampcls.getStampList()
									.getByKey(fontEditor.comId);
							temp.fontName = nVal;
							me.up('window').down('htmleditor')
									.setValue(creatHtmlByStt(temp, html));
						}
					}
				}, {
					xtype : 'combo',
					queryMode : 'local',
					itemId : 'cbFontSize',
					width : 50,
					value : '12',
					editable : false,
					store : fontSizes,
					listeners : {
						change : function(combo, nVal, oVal, opts) {
							var me = this;
							var html = me.up('window').down('htmleditor')
									.getValue();
							var temp = stampcls.getStampList()
									.getByKey(fontEditor.comId);
							temp.fontSize = nVal;
							me.up('window').down('htmleditor')
									.setValue(creatHtmlByStt(temp, html));
						}
					}
				}, {
					itemId : 'colorBtn',
					tooltip : '文字颜色',
					text : '文字 '
							+ ' <label style=background-color:#000000;>&nbsp;&nbsp;&nbsp;</label> ',
					menu : colorPicker
				}, {
					itemId : 'bgcolorBtn',
					tooltip : '背景颜色',
					text : '背景'
							+ ' <label style=background-color:#FFFFFF;>&nbsp;&nbsp;&nbsp;</label> ',
					menu : bgcolorPicker
				}, {
					itemId : 'bgTransp',
					width : 100,
					boxLabel : '背景透明',
					labelWidth : 40,
					xtype : 'checkboxfield',
					checked : false,
					listeners : {
						change : function(cb, nVal, oVal, opts) {
							var me = this;
							var html = me.up('window').down('htmleditor')
									.getValue();
							var temp = stampcls.getStampList()
									.getByKey(fontEditor.comId);
							if (nVal) {
								temp.bgColor = 'transparent';
								fontEditor
										.down('#bgcolorBtn')
										.setText('背景'
												+ " <label style=background-color:transparent;>&nbsp;&nbsp;&nbsp;</label> ");
								me.up('window').down('htmleditor')
										.setValue(creatHtmlByStt(temp, html));
								me.up('window').down('#bgcolorBtn')
										.setDisabled(true);
							} else {

								temp.bgColor = '#'
										+ bgcolorPicker.picker.getValue();
								fontEditor.down('#bgcolorBtn').setText('背景'
										+ " <label style=background-color:"
										+ temp.bgColor
										+ ";>&nbsp;&nbsp;&nbsp;</label> ");
								me.up('window').down('htmleditor')
										.setValue(creatHtmlByStt(temp, html));
								me.up('window').down('#bgcolorBtn')
										.setDisabled(false);
							}
						}
					}
				}]
			}, {
				border : false,
				xtype : 'htmleditor',
				name : 'bio',
				enableLinks : false,
				enableLists : false,
				enableSourceEdit : false,
				enableAlignments : false,
				enableColors : false,
				enableFont : false,
				enableFormat : false,
				enableFontSize : false,
				defaultFont : 'tahoma',
				height : 160
			}],
			buttons : [{
				text : '确定',
				handler : function() {
					var me = this;
					var curSel = winImageEditor.down('#' + fontEditor.comId
							+ '');
					var html = me.up('window').down('htmleditor').getValue();

					var temp = stampcls.getStampList()
							.getByKey(fontEditor.comId);

					temp.content = htmlFormat(html);
					html = creatHtmlByStt(temp, html, curSel);

					curSel.update(html);
					var hedt = fontEditor.down('htmleditor');
					if (hedt) {
						hedt.hide();
					}
					// htmlEditor.destroy();
					// htmlEditor='';
					preSTemp = Ext.clone(temp);
					me.up('window').close();
					curSel.doLayout();
				}
			}, {
				text : '取消',
				handler : function() {
					var me = this;
					var html = me.up('window').down('htmleditor').getValue();

					html = htmlFormat(html);
					// 内容为空则删除
					if (html == "" || html.length < 1) {
						var curSel = winImageEditor.down('#' + fontEditor.comId
								+ '');
						stampcls.getStampList().removeAtKey(fontEditor.comId);
						curSel.destroy();
						stampcls.getSelList().clear();
					}
					var hedt = fontEditor.down('htmleditor');
					if (hedt) {
						hedt.hide();
					}
					// htmlEditor.destroy();
					// htmlEditor='';
					me.up('window').close();

				}
			}],
			listeners : {
				show : function() {
					var me = this;
					var curSel = winImageEditor.down('#' + fontEditor.comId
							+ '');
					var hedt = fontEditor.down('htmleditor');
					if (hedt) {
						hedt.show(null, function() {
									hedt.focus(false, 200);
								});
					}

					if (curSel.body.dom.innerHTML == '') {
						fontEditor.down('htmleditor').setValue(creatHtmlByStt(
								stampTemp, ' '));
					} else {
						fontEditor.down('htmleditor')
								.setValue(curSel.body.dom.innerHTML);
					}

					// 重置工具栏状态
					var temp = stampcls.getStampList().getByKey(curSel.id);
					fontEditor.down('#cbFontName').setValue(temp.fontName);
					fontEditor.down('#cbFontSize').setValue(temp.fontSize);
					fontEditor.down('#colorBtn').setText('文字'
							+ " <label style=background-color:"
							+ temp.fontColor + ";>&nbsp;&nbsp;&nbsp;</label> ");

					if (temp.bgColor == 'transparent') {
						fontEditor.down('#bgTransp').setValue(true);
						fontEditor.down('#bgcolorBtn').setDisabled(true);
						fontEditor
								.down('#bgcolorBtn')
								.setText('背景'
										+ " <label style=background-color:transparent;>&nbsp;&nbsp;&nbsp;</label> ");
					} else {
						fontEditor.down('#bgTransp').setValue(false);
						fontEditor.down('#bgcolorBtn').setDisabled(false);
						fontEditor.down('#bgcolorBtn').setText('背景'
								+ " <label style=background-color:"
								+ temp.bgColor
								+ ";>&nbsp;&nbsp;&nbsp;</label> ");
						bgcolorPicker.picker.select(temp.bgColor);
					}
					colorPicker.picker.select(temp.fontColor);

				},
				hide : function() {
					var hedt = fontEditor.down('htmleditor');
					if (hedt) {
						hedt.hide();
					}
					// if(htmlEditor && htmlEditor.destroy) {
					// htmlEditor.destroy();
					// }

					// htmlEditor = '';
				}
			}
		});
	}
	// 主界面事件加载
	function loadMainEvent() {

		gridTitle = viewPortEast.down('#gridTitle');

		// 树选择变化
		FolderTree1.on('selectionchange', function(view, seles, op) {

			if (!seles[0])
				return;
			// if(tempItem && tempItem.data.id == seles[0].data.id)
			// return;

			if (runner) {
				ifLoading = 0;
				runner.stopAll();
				runner = new Ext.util.TaskRunner();
				initAllFaxFileTabPngConfig(0, 1);
				gridSelsChange();
			}
			ActionBase.updateActions('viewFaxFileTab', 0, 0, 0, -1);

			setReadFlagTask.cancel();

			var mainForm = Ext.getCmp('viewPortEast');
			hideLinkPal();
			southTb.down('#lblMessage').setText('');
			var gridPanel = mainForm.down('#centerCenterView');
			var tabPngView = viewFaxFileTab;
			var detailTab = viewFaxFileTab.down('#detailTab');
			var btnPngTab = mainForm.down('#btnPng');
			var btnDetailTab = mainForm.down('#btnDetail');

			var title = linkViewTitle(seles);

			gridTitle.setTitle(title);

			var tmpss = viewPortEast.down('#gridTitle');
			if (seles[0].data.iconCls) {
				gridTitle.setIconCls(seles[0].data.iconCls);
				// tmpss.setIconTitle(seles[0].data.iconCls,title);
			} else {
				gridTitle.setIconCls(Ext.baseCSSPrefix
						+ 'x-tree-icon x-tree-icon-leaf foloder');
				// tmpss.setIconTitle(Ext.baseCSSPrefix+ 'x-tree-icon
				// x-tree-icon-leaf foloder',title);
			}

			if (gridPanel) {
				//首先注销tip
				Ext.tip.QuickTipManager.unregister(gridTitle.el);	
				

				function SetGrid(name, priv, okfun) {
					
					changeGridFront(name, function(selfgrid) {
						selfgrid.privData = priv;

						if (priv.folderPrivList == 0) {
							var mesStr = "<div><img src='resources/images/toolbar/warning.png' style='margin-bottom: -4px;'>&nbsp;"
									+ '对不起您不具有查看此目录的权限' + "</div>";
							southTb.down('#lblMessage').setText(mesStr);
						} else {
							southTb.down('#lblMessage').setText('');
						}
						btnPngTab.setDisabled(false);
						// btnPngTab.toggle(true);
						btnPngTab.fireEvent('click', btnPngTab);

						if (selfgrid.getStore().getProxy().extraParams) {
							selfgrid.getStore().getProxy().extraParams.folderid = seles[0].data.id;
							//更换模版状态
							if(template) {
							if(!serverInfoDis && serverInfoModel.data.formData == 0) {
								ActionBase.getAction('changeTemplate').updateStatus('');
							}}
							
						}
						if (selfgrid.loadGrid) {
							selfgrid.loadGrid();
						}
						// date1 = new Date().getTime();
						// alert(date1 - date);

						if (okfun) {
							okfun();
						}

					}, seles, getCurrTree().itemId);

				}

				ActionBase.updateActions('FolderTreeAction', false, false,
						false, false, false);

				// tabPngView.setActiveTab('PngTab');
				// 发件箱
				if (seles[0].data.id == "grfjx") {
					return SetGrid('outfaxgrid', folderPrivAll);
				}
				// 已发件箱
				if (seles[0].data.id.indexOf("gryf") != -1
						|| seles[0].data.id == "gryhsz") {
					return SetGrid('succoutfaxgrid', folderPrivAll);
				}
				// 收件箱 共享回收站不需要判断目录
				if (seles[0].data.id == WaveFaxConst.RootFolderID
						|| seles[0].data.id == WaveFaxConst.RecycleFolderID
						|| seles[0].data.id == WaveFaxConst.PublicRecycleFolderID
						|| seles[0].data.id.indexOf('grxx') != -1) {
					SetGrid('infaxgrid', folderPrivAll, function() {
								getIsReadCount(Ext.StoreMgr
												.lookup('folderTrstoreId'),
										seles[0].data.id);
							});
					return;
				}

				// 他人委任 接收传真
				if (seles[0].data.id.indexOf('trwr') != -1
						&& seles[0].data.id != 'trwr') {
					SetGrid('infaxgrid', folderPrivAll);
					return;
				}

				// 共享收件箱 WaveFaxConst.PublicRootFolderID
				if ((seles[0].data.id.indexOf('tr') == -1
						&& seles[0].data.id.indexOf('gr') == -1
						&& seles[0].data.id != WaveFaxConst.RootFolderID
						&& seles[0].data.id != WaveFaxConst.RecycleFolderID && seles[0].data.id != WaveFaxConst.PublicRecycleFolderID)
						|| (seles[0].data.id.indexOf('grsc') != -1 && seles[0].data.id != 'grsc')) {

					var id = seles[0].data.id;
					if (id.indexOf('grsc') != -1) {
						id = id.substring(4, id.length);
					}
					
					if(seles[0].data.iconCls == 'createaddrICON'){
						showLinkPal(seles[0]);
					}else{						
						//linkPal.hide();
						getCommDirRole(id, function(priv) {
						seles[0].data.othertitle = priv.othertitle;
						//seles[0].commit();
						SetGrid('infaxgrid', priv, function() {
									if (priv.folderPrivList == 1) {
										getIsReadCount(
												Ext.StoreMgr
														.lookup('folderTrstoreId'),
												seles[0].data.id);
									}
									regeRoleTip(priv);
								});
						});
					}
					
					
					
					// infax_tbtnSetMenu.down('#tsendfaxbygrid').setChecked(false);
					return;
				}
				if (seles[0].data.id == "grcgx") {
					return SetGrid('draftgrid', folderPrivAll);
				}
				if (seles[0].data.id == "grsc") {
					btnDetailTab.fireEvent('click', btnDetailTab);
					btnPngTab.setDisabled(true);
					loadDefaultPng();
					return changeGridFront('grscgrid', null, null,
							getCurrTree().itemId);
				}

				if (seles[0].data.id.indexOf('tr') != -1) {
					btnDetailTab.fireEvent('click', btnDetailTab);
					btnPngTab.setDisabled(true);
					loadDefaultPng();
					return changeGridFront('trwrGrid', null, seles,
							getCurrTree().itemId);
				}

			} // if gridPanel
			// PngTab.setDisabled(true);
			// annexTab.setDisabled(true);
			// workflowTab.setDisabled(true);
			// btnDetailTab.toggle(true);
			btnDetailTab.fireEvent('click', btnDetailTab);
			btnPngTab.setDisabled(true);

			loadDefaultPng();
			changeGridFront('myfaxgrid');
				// gridPanel.getLayout().setActiveItem('myfaxgrid');
				// myfaxgrid.getStore().load();

		}); // tree selectchange
		// 树选择变化
		addressTree1.on('selectionchange', function(view, seles, op) {
			if (!seles[0])
				return;

			// if(addtmpItem && addtmpItem.data.id == seles[0].data.id)
			// return;

			if (runner) {
				ifLoading = 0;
				runner.stopAll();
				initAllFaxFileTabPngConfig(0, 1);
				gridSelsChange();
			};
			setReadFlagTask.cancel();
			var mainForm = Ext.getCmp('viewPortEast');
			hideLinkPal();
			var gridPanel = mainForm.down('#centerCenterView');
			var btnPngTab = mainForm.down('#btnPng');
			var btnDetailTab = mainForm.down('#btnDetail');
			var detailTab = viewFaxFileTab.down('#detailTab');

			btnDetailTab.fireEvent('click', btnDetailTab);
			// btnDetailTab.toggle(true);
			btnPngTab.setDisabled(true);

			ActionBase.updateActions('addressMenu', false, false, false);
			
			//首先注销tip
			Ext.tip.QuickTipManager.unregister(gridTitle.el);	
			
			function SetGrid(name, priv, okfun) {
				// gridPanel.getLayout().setActiveItem(name);
				changeGridFront(name, function(selfgrid) {
					selfgrid.privData = priv;

					if (priv.folderPrivList == 0) {
						var mesStr = "<div><img src='resources/images/toolbar/warning.png' style='margin-bottom: -4px;'>&nbsp;"
								+ '对不起您不具有查看此目录的权限' + "</div>";
						southTb.down('#lblMessage').setText(mesStr);
					} else {
						southTb.down('#lblMessage').setText('');
					}

					selfgrid.getStore().getProxy().extraParams.folderid = seles[0].data.id;
					selfgrid.loadGrid();
					if (okfun) {
						okfun();
					}
					return;
				}, getCurrTree().itemId);
			}

			if (seles[0].data.id != 'addrRoot' && seles[0].data.id != '0'
					&& seles[0].data.id.indexOf('grad') == -1) {
				if(seles[0].data.iconCls == 'createaddrICON'){
						showLinkPal(seles[0]);
					}else{	
						getCommDirRole(seles[0].data.id, function(priv) {
							seles[0].data.othertitle = priv.othertitle;
							SetGrid('addressgrid', priv);
							regeRoleTip(priv);
						});
					}
			
			} else if (seles[0].data.id == '0'
					|| seles[0].data.id.indexOf('grad') != -1) {
				SetGrid('addressgrid', folderPrivAll);
			} else {
				loadDefaultPng();
			}
			// if gridPanel
			var title = linkViewTitle(seles);
			gridTitle.setTitle(title);

			if (seles[0].data.iconCls) {
				gridTitle.setIconCls(seles[0].data.iconCls);
			} else {
				gridTitle.setIconCls(Ext.baseCSSPrefix
						+ 'x-tree-icon x-tree-icon-leaf foloder');
			}

		}); // addresstree selectchange
		if (onDocManager && serverInfoModel.data.wordManager == 0) {
			// 树选择变化
			docTree.on('selectionchange', function(view, seles, op) {

				if (!seles[0])
					return;
				// if(doctmpItem && doctmpItem.data.id == seles[0].data.id)
				// return;

				if (runner) {
					ifLoading = 0;
					runner.stopAll();
					runner = new Ext.util.TaskRunner();
					initAllFaxFileTabPngConfig(0, 1);
					gridSelsChange();
				}
				ActionBase.updateActions('viewFaxFileTab', 0, 0, 0, -1);

				setReadFlagTask.cancel();

				var mainForm = Ext.getCmp('viewPortEast');
				hideLinkPal();
				southTb.down('#lblMessage').setText('');
				var gridPanel = mainForm.down('#centerCenterView');
				var tabPngView = viewFaxFileTab;
				var detailTab = viewFaxFileTab.down('#detailTab');
				var btnPngTab = mainForm.down('#btnPng');
				var btnDetailTab = mainForm.down('#btnDetail');

				var title = linkViewTitle(seles);

				gridTitle.setTitle(title);

				if (seles[0].data.iconCls) {
					gridTitle.setIconCls(seles[0].data.iconCls);
				} else {
					gridTitle.setIconCls(Ext.baseCSSPrefix
							+ 'x-tree-icon x-tree-icon-leaf foloder');
				}

				if (gridPanel) {
					//首先注销tip
					Ext.tip.QuickTipManager.unregister(gridTitle.el);
					
					function SetGrid(name, priv, okfun) {
						changeGridFront(name, function(selfgrid) {
							selfgrid.privData = priv;

							if (priv.folderPrivList == 0) {
								var mesStr = "<div><img src='resources/images/toolbar/warning.png' style='margin-bottom: -4px;'>&nbsp;"
										+ '对不起您不具有查看此目录的权限' + "</div>";
								southTb.down('#lblMessage').setText(mesStr);
							} else {
								southTb.down('#lblMessage').setText('');
							}
							btnPngTab.setDisabled(false);
							// btnPngTab.toggle(true);
							btnPngTab.fireEvent('click', btnPngTab);

							if (selfgrid.getStore().getProxy().extraParams) {
								selfgrid.getStore().getProxy().extraParams.folderid = seles[0].data.id;
								//更换模版状态
								if(template) {
								if(!serverInfoDis && serverInfoModel.data.formData == 0) {
									ActionBase.getAction('changeTemplate').updateStatus('');
								}}
							}
							if (selfgrid.loadGrid) {
								selfgrid.loadGrid();
							}
							if (okfun) {
								okfun();
							}

						}, seles, getCurrTree().itemId);
					}

					ActionBase.updateActions('DocTreeAction', false, false,
							false, false, false);

					// tabPngView.setActiveTab('PngTab');

					if (seles[0].data.id == "grsc") {
						btnDetailTab.fireEvent('click', btnDetailTab);
						btnPngTab.setDisabled(true);
						loadDefaultPng();
						return changeGridFront('grscgrid', null, null,
								getCurrTree().itemId);
					}

					// 个人 共享回收站及个人子目录 不需要判断权限
					if (seles[0].data.id == WaveFaxConst.RecycleFolderID
							|| seles[0].data.id == WaveFaxConst.PublicRecycleFolderID
							|| seles[0].data.id.indexOf('gr') != -1) {

						SetGrid('docgrid', folderPrivAll, function() {
									getIsReadCount(Ext.StoreMgr
													.lookup('docTrstoreId'),
											seles[0].data.id);
								});
						return;
					}

					// 共享WaveFaxConst.PublicRootFolderID
					if (seles[0].data.id.indexOf('gr') == -1
							&& seles[0].data.id != WaveFaxConst.RecycleFolderID
							&& seles[0].data.id != WaveFaxConst.PublicRecycleFolderID
							|| (seles[0].data.id.indexOf('grsc') != -1 && seles[0].data.id != 'grsc')) {
						var id = seles[0].data.id;
						if (id.indexOf('grsc') != -1) {
							id = id.substring(4, id.length);
						}
						if(seles[0].data.iconCls == 'createaddrICON'){
							showLinkPal(seles[0]);
						}else{	
							getCommDirRole(id, function(priv) {
								seles[0].data.othertitle = priv.othertitle;
								SetGrid('docgrid', priv, function() {
											if (priv.folderPrivList == 1) {
												getIsReadCount(
														Ext.StoreMgr
																.lookup('docTrstoreId'),
														seles[0].data.id);
											}
											regeRoleTip(priv);
										});
							});
						}
						
						return;
					}

				} // if gridPanel
				// PngTab.setDisabled(true);
				// annexTab.setDisabled(true);
				// workflowTab.setDisabled(true);
				// btnDetailTab.toggle(true);
				btnDetailTab.fireEvent('click', btnDetailTab);
				btnPngTab.setDisabled(true);

				loadDefaultPng();

				changeGridFront('docgrid', false, seles, getCurrTree().itemId);
					// gridPanel.getLayout().setActiveItem('myfaxgrid');
					// myfaxgrid.getStore().load();

			}); // tree selectchange
		}// doctree selectionchange

		if (onWorkFlow && serverInfoModel.data.workFlow == 0) {
			// 树选择变化
			wfTree.on('selectionchange', function(view, seles, op) {

				if (!seles[0])
					return;
				// if(doctmpItem && doctmpItem.data.id == seles[0].data.id)
				// return;

				if (runner) {
					ifLoading = 0;
					runner.stopAll();
					runner = new Ext.util.TaskRunner();
					initAllFaxFileTabPngConfig(0, 1);
					gridSelsChange();
				}
				ActionBase.updateActions('viewFaxFileTab', 0, 0, 0, -1);

				setReadFlagTask.cancel();

				var mainForm = Ext.getCmp('viewPortEast');
				southTb.down('#lblMessage').setText('');
				var gridPanel = mainForm.down('#centerCenterView');
				var tabPngView = viewFaxFileTab;
				var detailTab = viewFaxFileTab.down('#detailTab');
				var btnPngTab = mainForm.down('#btnPng');
				var btnDetailTab = mainForm.down('#btnDetail');
				var btnWorkFlow = mainForm.down('#btnWorkFlow');

				var title = linkViewTitle(seles);

				gridTitle.setTitle(title);

				if (seles[0].data.iconCls) {
					gridTitle.setIconCls(seles[0].data.iconCls);
				} else {
					gridTitle.setIconCls(Ext.baseCSSPrefix
							+ 'x-tree-icon x-tree-icon-leaf foloder');
				}

				if (gridPanel) {
					//首先注销tip
					Ext.tip.QuickTipManager.unregister(gridTitle.el);
					function SetGrid(name, priv, okfun, noPng) {
						changeGridFront(name, function(selfgrid) {
							selfgrid.privData = priv;
							if (drawComponent != '') {
								drawComponent.destroy();
								drawComponent = '';
							}
							btnWorkFlow.show();

							if (priv.folderPrivList == 0) {
								var mesStr = "<div><img src='resources/images/toolbar/warning.png' style='margin-bottom: -4px;'>&nbsp;"
										+ '对不起您不具有查看此目录的权限' + "</div>";
								southTb.down('#lblMessage').setText(mesStr);
							} else {
								southTb.down('#lblMessage').setText('');
							}
							if (!noPng) {
								btnPngTab.setDisabled(false);
								btnPngTab.fireEvent('click', btnPngTab);
							} else {
								btnDetailTab.fireEvent('click', btnDetailTab);
								btnPngTab.setDisabled(true);
							}

							if (selfgrid.getStore().getProxy().extraParams) {
								selfgrid.getStore().getProxy().extraParams.folderid = seles[0].data.id;
								//更换模版状态
								if(template) {
								if(!serverInfoDis && serverInfoModel.data.formData == 0) {
									ActionBase.getAction('changeTemplate').updateStatus('');
								}}
							}
							// 根据树节点隐藏相应的状态
							var treeId = seles[0].data.id;
							if (treeId.indexOf('wfwa') != -1
									|| treeId.indexOf('wfin') != -1) {
								// var header = Ext.getCmp('55-endTime');
								// alert(header.isHidden());
								// header.show();
								if (treeId == 'wfinon' || treeId == 'wfwaon') {
									taskGrid.down('#wfRules').show();
									taskGrid.down('#spWfRules').show();

									// header.hide();
									// return '正在进行';
									ActionBase
											.getAction('runningStatusWorkflow')
											.setHidden(false);
									ActionBase
											.getAction('activeStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('idleStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('WfTaskFinishedOK')
											.setHidden(true);
									ActionBase
											.getAction('WfTaskFinishedFailed')
											.setHidden(true);
								}
								if (treeId == 'wfinfis' || treeId == 'wfwafis') {
									taskGrid.down('#wfRules').hide();
									taskGrid.down('#spWfRules').hide();
									// return '已完成';
									ActionBase
											.getAction('runningStatusWorkflow')
											.setHidden(true);
									ActionBase
											.getAction('activeStatusWorkflow')
											.setHidden(true);
									ActionBase.getAction('idleStatusWorkflow')
											.setHidden(true);
									ActionBase.getAction('WfTaskFinishedOK')
											.setHidden(false);
									ActionBase
											.getAction('WfTaskFinishedFailed')
											.setHidden(false);
								}
								if (treeId == 'wfinit' || treeId == 'wfwait') {
									taskGrid.down('#wfRules').hide();
									taskGrid.down('#spWfRules').hide();
									// return '发起的事项';return '等待处理的事项';
									ActionBase
											.getAction('runningStatusWorkflow')
											.setHidden(false);
									ActionBase
											.getAction('activeStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('idleStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('WfTaskFinishedOK')
											.setHidden(false);
									ActionBase
											.getAction('WfTaskFinishedFailed')
											.setHidden(false);
								}
							} else if (treeId.indexOf('tr') != -1) {// 委托
								if (treeId.indexOf('trwron') != -1) {
									taskGrid.down('#wfRules').show();
									taskGrid.down('#spWfRules').show();

									// return '正在进行';
									ActionBase
											.getAction('runningStatusWorkflow')
											.setHidden(false);
									ActionBase
											.getAction('activeStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('idleStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('WfTaskFinishedOK')
											.setHidden(true);
									ActionBase
											.getAction('WfTaskFinishedFailed')
											.setHidden(true);
								} else if (treeId.indexOf('trwrfis') != -1) {
									taskGrid.down('#wfRules').hide();
									taskGrid.down('#spWfRules').hide();
									// return '已完成';
									ActionBase
											.getAction('runningStatusWorkflow')
											.setHidden(true);
									ActionBase
											.getAction('activeStatusWorkflow')
											.setHidden(true);
									ActionBase.getAction('idleStatusWorkflow')
											.setHidden(true);
									ActionBase.getAction('WfTaskFinishedOK')
											.setHidden(false);
									ActionBase
											.getAction('WfTaskFinishedFailed')
											.setHidden(false);
								} else if (treeId.indexOf('trsub') != -1) {
									taskGrid.down('#wfRules').hide();
									taskGrid.down('#spWfRules').hide();
									// return '发起的事项';return '等待处理的事项';
									ActionBase
											.getAction('runningStatusWorkflow')
											.setHidden(false);
									ActionBase
											.getAction('activeStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('idleStatusWorkflow')
											.setHidden(false);
									ActionBase.getAction('WfTaskFinishedOK')
											.setHidden(false);
									ActionBase
											.getAction('WfTaskFinishedFailed')
											.setHidden(false);
								}
							}
							if (selfgrid.loadGrid) {
								selfgrid.loadGrid();
							}

							if (okfun) {
								okfun();
							}

						}, seles, getCurrTree().itemId);
					}

					ActionBase.updateActions('WfTreeAction', false, false,
							false, false, false);

					// tabPngView.setActiveTab('PngTab');

					// 发起 等待 委托 进行 成功 失败
					if (seles[0].data.id.indexOf('wfwa') != -1
							|| seles[0].data.id.indexOf('wfin') != -1
							|| seles[0].data.id.indexOf('tr') != -1) {
						SetGrid('taskgrid', folderPrivAll);
						return;
					}
					if (seles[0].data.id == 'wfsub') {
						SetGrid('trwrGrid', folderPrivAll);
						return;
					}

					// 启动事项
					// if (seles[0].data.id == 'wfstart') {
					// SetGrid('wfrulegrid', folderPrivAll,false,true);
					// return;
					// }

				} // if gridPanel

				btnDetailTab.fireEvent('click', btnDetailTab);
				btnPngTab.setDisabled(true);
				btnWorkFlow.hide();
				loadDefaultPng();
				changeGridFront('wfdfgrid');

			}); // tree selectchange
		}// wftree selectionchange
	}

	// 主界面加载
	function loadMain() {
		// 树变量
		FolderTree1 = Ext.create('FolderTree', {
			updateMenu : function(grid) {
				var sel = FolderTree1.getSelectionModel().getSelection();
				// if(!sel[0]) {
				// sel[0] = tempItem;
				// }
				var folderId = sel[0].data.id;
				ActionBase
						.updateActions(
								'FolderTreeAction',
								(folderId == WaveFaxConst.RootFolderID
										|| folderId == 'gryfjx' || folderId == WaveFaxConst.PublicRootFolderID),
								(folderId.indexOf('grxx') != -1
										|| (folderId.indexOf('gryf') != -1) || (folderId
										.indexOf('gr') == -1 && folderId != WaveFaxConst.PublicRecycleFolderID)),
								grid.getStore().getCount() != 0,
								sel[0].data.leaf,
								grid.privData.folderPrivAdmin == 1,
								grid.privData.folderPrivExport == 1);
			}
		});
		addressTree1 = Ext.create('addressTree', {
					updateMenu : function(grid) {
						var sel = addressTree1.getSelectionModel()
								.getSelection();
						// if(!sel[0]) {
						// sel[0] = addtmpItem;
						// }
						var folderId = sel[0].data.id;
						ActionBase.updateActions('addressMenu', grid.getStore()
										.getCount() != 0, sel[0].data.leaf,
								grid.privData.folderPrivAdmin == 1);
					}
				});
		if (onDocManager && serverInfoModel.data.wordManager == 0) {
			docTree = Ext.create('docTree', {
				updateMenu : function(grid) {
					var sel = docTree.getSelectionModel().getSelection();
					// if(!sel[0]) {
					// sel[0] = doctmpItem;
					// }
					var folderId = sel[0].data.id;
					ActionBase
							.updateActions(
									'DocTreeAction',
									(folderId == 'gr' || folderId == WaveFaxConst.PublicRootFolderID),
									(folderId.indexOf('grdc') != -1 || (folderId
											.indexOf('gr') == -1 && folderId != WaveFaxConst.PublicRecycleFolderID)),
									grid.getStore().getCount() != 0,
									sel[0].data.leaf,
									grid.privData.folderPrivAdmin == 1,
									grid.privData.folderPrivExport == 1);
				}
			});
		}
		if (onWorkFlow && serverInfoModel.data.workFlow == 0) {
			wfTree = Ext.create('wfTree', {});
		}

		FolderTree1.getStore().getProxy().extraParams.sessiontoken = Ext.util.Cookies
				.get("sessiontoken"); // 设置sessiontoken
		addressTree1.getStore().getProxy().extraParams.sessiontoken = Ext.util.Cookies
				.get("sessiontoken");
		if (onDocManager && serverInfoModel.data.wordManager == 0) {
			docTree.getStore().getProxy().extraParams.sessiontoken = Ext.util.Cookies
					.get("sessiontoken");
		}
		if (onWorkFlow && serverInfoModel.data.workFlow == 0) {
			wfTree.getStore().getProxy().extraParams.sessiontoken = Ext.util.Cookies
					.get("sessiontoken");
		}
		// 原位置
		// viewPortEast.show();

		if (!viewPortEast) {
			viewPortEast = Ext.create('Ext.container.Viewport', {
						id : 'viewPortEast',
						itemId : 'viewPortEastID',
						layout : 'border',
						border : false,
						listeners : {
							afterrender : function(com, opts) {
								ActionBase.setTargetView('MainFormViewPort',
										com);
							}
						},
						items : [northTb, {
							region : 'west',
							stateId : 'westPanelState',
							stateful : true,
							// collapsible : true,
							preventHeader : true,
							// xtype : 'panel',
							split : true,
							itemId : 'westView',
							// title: '传真',
							width : 200,
							// frame : false,
							layout : {
								type : 'accordion',
								animate : false,
								activeOnTop : false,
								collapseFirst : false,
								titleCollapse : true
							},
							items : [FolderTree1, addressTree1],
							listeners : {
								resize : function(com, adjWidth, adjHeight,
										eOpts) {
									var me = this;
									setFlexJoint(me, adjWidth);
								},
								afterrender : function(com, opts) {
									if (onDocManager
											&& serverInfoModel.data.wordManager == 0) {
										com.add(docTree);
									}
									if (onWorkFlow
											&& serverInfoModel.data.workFlow == 0) {
										com.add(wfTree);
									}

								}
							}
						}, {
							itemId : 'centerView',
							stateId : 'centerPanelState',
							stateful : true,
							region : 'center',
							layout : 'border',
							border : false,
							frame : false,							
							items : [{
									region : 'north',
									//title:'外部连接',
									itemId:'linkPal',
									split : false,
									collapsible : false,
									//hidden:true,									
									frame : false,
									bodyStyle:{
										border:false
									},
									height: 0,
									items:[],
									listeners : {
									beforestatesave : function() {
											return false;					
									}
								}
								},
								{
									region:'center',
									layout:'border',
									border : false,
									items:[	{
										region : 'center',
										layout : {
											type : 'anchor'
										},
										defaults : {
											anchor : '100% 100%'
										},
										// autoScroll:false,
										// split : true,
										collapsible : false,
										// frame : false,
										preventHeader : true,
										// title : '个人',
										// iconCls : 'myFax',
										itemId : 'centerCenterView',
										// stateId:'centerCenterPanelState',
										// stateful:true,
										items : [currGrid]
									}, {
										itemId : 'centerSouthView',
										region : 'south',
										stateId : 'centerSouthPanelState',
										stateful : true,
										// layout : 'card',
										layout : {
											type : 'fit'
										},
										split : true,
										frame : false,
										preventHeader : true,
										collapsible : true,
										border : true,
										title : '查看',
										collapseMode : 'header',								
										height : 300,								
										items : [viewFaxFileTab],
										dockedItems : [centerSVBtn]//,
										// listeners : {
											// beforestatesave : function() {										
												// // 如果是全屏模式终止状态保存
												// if (cplHeight != 0) {
													// return false;
												// }										
											// }
										// }
									}]
								}]

						}, {
							itemId : 'southView',
							stateId : 'southPanelState',
							stateful : true,
							region : 'south',
							bodyStyle : {
								padding : '2px',
								background : '#DFE8F6'
							},

							height : 26,
							border : false,
							items : [southTb]
						}]
					});
		} // if viewPortEast

		loadSysConfig();
		loadForFax();
		loadSFax();
		viewPortEast.down('#serverInfo').setDisabled(serverInfoDis);
		// alert(serverInfoDis);

	}// loadmain

	// 初始化登录窗口
	win = Ext.create('widget.window', {
		// title: '登录窗口',
		closable : false,
		modal : true,
		width : 416,
		border : false,
		resizable : false,
		shadow : false,
		plain : true,
		height : 280,
		preventHeader : true,
		layout : 'auto',
		baseCls : '',
		style : {
			'background-color' : 'transparent',
			'padding' : '0 0 0 0'
		},
		bodyStyle : {
			'background-image' : 'url(resources/images/loginbk.PNG)',
			'background-repeat' : 'no-repeat',
			'background-color' : 'transparent',
			'padding' : '0 0 0 0',
			'margin' : '-8 0 0 -8'
		},
		defaults : {
			border : false
		},
		listeners : {
			afterrender : function(win, opts) {

				win.down('form').getForm().findField('Username')
						.setValue(userInfo);
				// 判断是否有cookie
				if (Ext.util.Cookies.get("ws_password") != null) {
					win.down('form').getForm().findField('Password')
							.setValue('·············');
					win.down('form').getForm().findField('hpassword')
							.setValue(password);
				}

				if (checksavepass) {
					win.down('form').getForm().findField('savePass')
							.setValue(true);
				}

			}
		},
		items : [{
			xtype : 'form',
			layout : {
				type : 'table',
				columns : 2
			},
			width : 400,
			height : 220,
			style : {
				'background-color' : 'transparent',
				'border' : '0px'
			},
			bodyStyle : {
				'background-color' : 'transparent',
				'border' : '0px'
			},
			defaults : {
				xtype : 'textfield',
				labelAlign : 'right',
				width : 300,
				margin : '2 0 0 30',
				colspan : 2
			},
			items : [{
				fieldLabel : '用户名',
				id : 'Username',
				stateful : false,
				value : '',
				allowBlank : false,
				blankText : '用户名不能为空',
				margin : '80 0 0 30',
				enableKeyEvents : true,
				listeners : {
					keypress : function(field, e, opts) {
						if (e.getKey() == e.ENTER) {
							field.up('window').down('#Login')
									.fireEvent("click");
						}
					}
				}
			}, {
				fieldLabel : '登录密码',
				id : 'Password',
				stateful : false,
				colspan : 1,
				value : '',
				width : 230,
				inputType : 'password',
				allowBlank : true,
				enableKeyEvents : true,
				listeners : {
					keypress : function(field, e, opts) {
						if (e.getKey() == e.ENTER) {
							field.up('window').down('#Login')
									.fireEvent("click");
						}
					},
					change : function(fil, nVal, oVal, opts) {
						win.down('#hpassword').setValue(nVal);
					}
				}
					// blankText: "登录密码不能为空"
			}, {
				xtype : 'checkboxfield',
				colspan : 1,
				margin : '2 0 0 1',
				name : 'savePass',
				boxLabel : '保存密码'
			}, {
				xtype : 'hidden',
				stateful : false,
				id : 'hpassword',
				value : ''
			}, {
				xtype : 'combo',
				store : 'languageStore',
				stateful : false,
				value : lang_type,
				editable : false,
				fieldLabel : '语言',
				queryMode : 'local',
				disabled : onLanguageChange ? false : true,
				displayField : 'lName',
				valueField : 'lid',
				// labelWidth:40,
				width : 230,
				listeners : {
					change : function(comb, nVal, oVal, opts) {
						if (nVal == '0') {
							// zh-cn
							Ext.util.Cookies.set("ws_language", '0',
									new Date(new Date().getTime()
											+ (1000 * 60 * 60 * 24 * 30)));
							window.location.reload();
							return;
						}
						if (nVal == '1') {
							// en
							Ext.util.Cookies.set("ws_language", '1',
									new Date(new Date().getTime()
											+ (1000 * 60 * 60 * 24 * 30)));
							window.location.reload();
							return;
						}
					}
				}
			}, {
				xtype : 'panel',
				layout : {
					type : 'table',
					columns : 2
				},
				style : {
					'background-color' : 'transparent',
					'border' : '0px'
				},
				margin : '15 0 0 30',
				bodyStyle : {
					'background-color' : 'transparent',
					'border' : '0px'
				},
				defaults : {
					width : 80
				},
				items : [{
					xtype : 'button',
					text : '登录',
					itemId : 'Login',
					margin : '0 10 0 130',
					listeners : {
						click : function() {
							var form = this.up('form').getForm();
							var savepass = this.up('form').getForm()
									.findField('savePass');
							var passtext;
							// 判断是否有cookie
							passtext = win.down('#hpassword').getValue();

							if (form.isValid()) {

								// loginLoading = new
								// Ext.LoadMask(Ext.getBody(), {
								// msg:'正在验证登录信息，请稍候...'
								// });
								Ext.getBody().mask('正在验证登录信息，请稍候...');

								// loginLoading.show();

								// param.server =
								// form.findField('ServerAddress').value;
								var param = {};
								param.username = form.findField('Username').value;
								param.password = passtext;
								param.language = lang_type;
								userLogin(param, savepass)
							}
						}
					}
				}, {
					xtype : 'button',
					text : '取消',
					itemId : 'Cancel',
					handler : function() {
						Ext.util.Cookies.clear("sessiontoken");
						window.location.reload();

					}
				}]

			}]
		}]
	});

	// 用户登录调用 --savepass : 保存密码控件
	function userLogin(param, savepass) {
		// 调用
		WsCall.call('userlogin', param, function(response, opts) {
			Ext.getBody().unmask();
			Ext.getBody().mask('登录成功，正在加载用户数据，请稍候...');
			(new Ext.util.DelayedTask()).delay(50, function() {

						var data = Ext.JSON.decode(response.data);
						// sessionToken = response.data;
						sessionToken = data.sessionToken;

						Ext.util.Cookies.set("ws_userInfo", data.username,
								new Date(new Date().getTime()
										+ (1000 * 60 * 60 * 24 * 30)));
						userInfo = Ext.util.Cookies.get("ws_userInfo");
						if (sessionToken != '') {
							win.hide();
							if (savepass) {
								if (savepass.getValue()) {
									Ext.util.Cookies
											.set('ws_password', data.password,
													new Date(new Date()
															.getTime()
															+ (1000 * 60 * 60
																	* 24 * 30)));
									Ext.util.Cookies
											.set('ws_checksavepass', 1,
													new Date(new Date()
															.getTime()
															+ (1000 * 60 * 60
																	* 24 * 30)));
								} else {
									Ext.util.Cookies.clear('ws_password');
									Ext.util.Cookies.clear('ws_checksavepass');
								}
							}
							loginOK(sessionToken, sucAfterLOK, function() {

									}, false);// loginok
						} else {
							Ext.getBody().unmask();
							if (!savepass) {
								win.show();
							} else {
								if (!errorProcess(response.code)) {
									Ext.Msg.alert('登录失败', response.msg);
								}
							}
						}

					});
		}, function(response, opts) {
			Ext.getBody().unmask();
			if (!savepass) {
				win.show();
			} else {
				if (!errorProcess(response.code)) {
					Ext.Msg.alert('登录失败', response.msg);
				}
			}
		}, false);
	}

	// loginOk成功后调用
	function sucAfterLOK() {
		WsCall.callchain('login');
		// 加载State
		wsUserStates = Ext.create('WS.lib.MyStateProvider', {
					sessiontoken : sessionToken
				});
		// treePanlState.state = sConf;
		Ext.state.Manager.setProvider(wsUserStates);
		// 加载计算机通报task
		if (userConfig.msgtaskallow) {
			msgBoxTask();
		}
		// 加载发件箱自动刷新
		// ofRefreshTask();

		if (Ext.isIE && !Ext.isIE9) {
			// task 主界面
			programeLoad('正在初始化主界面，请稍候...', function() {
						loadMain();
						// task 主界面事件
						programeLoad('正在加载主界面事件，请稍候...', function() {
									loadMainEvent();
									programeLoad('加载完毕，设定系统数据，请稍候...', loadLast);
								});
					});
		} else {
			loadMain();
			loadMainEvent();
			loadLast()
		}

	}

	function paraNextFun() {
		// 判断是否已经登录
		if (sessionToken != null) {

			Ext.getBody().mask('登录成功，正在加载用户数据,请稍候...');
			// loginLoading = new Ext.LoadMask(Ext.getBody(), {
			// msg:'登录成功，正在加载用户数据,请稍候...'
			// });
			// loginLoading.show();

			loginOK(sessionToken, sucAfterLOK, function() {
						Ext.util.Cookies.clear("sessiontoken");
						win.show();
						// loginLoading.hide();
						Ext.getBody().unmask();
					});
		} else {
			userLogin({}, null);
		}
	}

	// 判断是否有地址栏sessiontoken参数
	var nextfunFlag = true;

	var queryString = window.location.search;

	queryString = queryString.substr(1, queryString.length);

	var myArr = queryString.split('&');
	if (myArr && myArr.length > 0) {
		Ext.Array.each(myArr, function(item, index, alls) {
					var tmpStr = item.split('=');
					if (tmpStr[0] == 'sessiontoken') {
						sessionToken = tmpStr[1];
					} else if (tmpStr[0] == 'ticket') {
						nextfunFlag = false;
						// 调用call 重新获取sessionToken
						var param = {};
						// param.sessiontoken = sessionToken;
						param.ticket = tmpStr[1];
						// 调用
						WsCall.call('getrightsessiontoken', param, function(
										response, opts) {
									sessionToken = response.data;
									paraNextFun();
								}, function(response, opts) {
									if (!errorProcess(response.code)) {
										Ext.Msg.alert('失败', response.msg);
									}
								}, true);
					}
				});
	}

	if (nextfunFlag) {
		paraNextFun();
	}

});