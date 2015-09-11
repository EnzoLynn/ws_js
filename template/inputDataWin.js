//inputdatawin底部状态条
Ext.define('ws.template.inputdatastatusbar', {
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: 'inputdatastatusbar',
	alias: 'widget.inputdatastatusbar',
	itemId: 'inputdatastatusbar',
	items: [{
		xtype: 'bottomProgressBar',
		width:200
	},{
		xtype: 'button',
		margin:'0 5 0 15',
		width:80,
		itemId: 'btnContinue',
		hidden: true,
		text: '继续'
	},{
		xtype: 'button',
		margin:'0 5 0 5',
		itemId: 'btnCancel',
		width:80,
		hidden: true,
		text: '取消'
	}, '-',{
		xtype:'tbtext',
		itemId:'lblMessage',
		hideLabel:true,
		height:20,
		//width:270,
		text:''
	},{
		xtype:'tbtext',
		itemId:'submitMessage',
		hideLabel:true,
		hidden:true,
		height:20,
		//width:220,
		text:''
	}]
});

function loadInputDataWin(sels,winType,record,resetWin) {
	var tmpItems = new Array();
	if(template.myWinGItems.getCount() > 0) {

		template.myWinGItems.each( function(items,index,alls) {
			var fsetTmp = {
				xtype:'fieldset',
				title:'',
				padding:'2 2 2 0',
				collapsible: true,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					width:380,
					labelAlign:'right',
					labelWidth:140
				},
				items :[]
			};
			Ext.Array.each(items, function(itm,ix,as) {
				fsetTmp.title = itm.gtitle;
				fsetTmp.items.push(itm);
			});
			tmpItems.push(fsetTmp);
		});
	}

	if(template.myWinItems.length > 0) {
		Ext.Array.each(template.myWinItems, function(itm,ix,as) {
			itm.margin = '2 0 2 2';
			tmpItems.push(itm);
		});
	}
	var tplID = '';
	if(winType && winType.pngGroup == 'sendfax') {
		tplID = winType.tplid;
	} else {
		tplID = currGrid.getStore().getProxy().extraParams.template;
	}
	//alert(winType.tplid + "--"+tplID);
	var inputTitle = '',senWintitle = '';
	if(tplID!= '') {
		Ext.Array.each(template.tplArr, function(item) {
			if(item[0] == tplID) {
				inputTitle = item[2];
				senWintitle = item[2]+'('+item[1]+')';
				return false;
			}
		});
	}

	if(resetWin) {
		//resetWin.runner = false;
		//resetWin.pngClass.isLoaded = 0;
		//重置
		resetWin.winType =winType;
		resetWin.record=record;
		resetWin.sels=sels;

		var fomrdata = resetWin.down('#inputdataform');
		fomrdata.removeAll();
		fomrdata.add(tmpItems);
		resetWin.down('#contanerData').setHeight(496);
		resetWin.center();
		var statusbar = resetWin.down('inputdatastatusbar');
		var pngcontainer = resetWin.down('#pngContainer');

		if(userConfig.viewDocPic && (resetWin.sels.length == 1 || resetWin.record)) {
			resetWin.header.down('#maximizeBtn').setDisabled(false);
			
			if(!statusbar) {
				
				resetWin.addDocked({
					xtype: 'inputdatastatusbar',
					height: 26,
					dock: 'bottom'
				});

			}else if(statusbar && statusbar.isHidden()){
				
				statusbar.show();
			}
			if(!pngcontainer) {
				
				resetWin.insert(0, {
					tdAttrs: {
						style:'vertical-align:top'
					},
					xtype:'container',
					dock: 'left',
					itemId:'pngContainer',
					width:854,
					border:false,
					items:[{
						xtype: 'container',
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
						xtype: 'baseviewpanel',
						height:470,
						listeners: {
							//隐藏功能按钮
							afterrender: function(com) {
								com.down('#filepngdeleteFilepng').hide();
								com.down('#filepngenditorpng').hide();
								com.down('#delAllFile').hide();
								com.down('#fileLocalPath').hide();
								com.down('#filePath').hide();
								com.down('#replacePal').hide();
							}
						}
					}]
				});
			}else if(pngcontainer && pngcontainer.isHidden()){
				
				pngcontainer.show();
			}
			
			
			resetWin.maximize();

			var nWidth = Ext.getBody().getWidth()- 1265;
			var nHeight = Ext.getBody().getHeight() - 560;
			//alert(nHeight);
			if(nWidth > 0) {
				resetWin.down('#pngContainer').setWidth(854+nWidth);
			}
			if(nHeight > 0) {
				resetWin.down('baseviewpanel').setHeight(470+nHeight);
				resetWin.down('#contanerData').setHeight(470+nHeight);
			}
		} else {
			var reWH = false;
			resetWin.header.down('#maximizeBtn').setDisabled(true);
			//alert(toolBtn);
			if(statusbar) {
				reWH = true;
				//resetWin.remove(statusbar);
				statusbar.setHeight(0);
				statusbar.hide();
			}
			if(pngcontainer) {
				reWH = true;
				//resetWin.remove(pngcontainer);
				 pngcontainer.setWidth(0);
				 pngcontainer.hide();
			}
			if(reWH){
				resetWin.restore();	
				resetWin.setHeight(560);	
				resetWin.setWidth(405);	
				
			}
			var formHeight = resetWin.down('#inputdataform').getHeight();
			if(formHeight < 480) {
				resetWin.setHeight(formHeight+80);
			} else {
				resetWin.setHeight(560);
			}	
			
			
		}

		return resetWin;
	}

	return Ext.create('Ext.window.Window', {
		title: inputTitle,
		modal:true,
		height: 560,
		width: 405,
		shadow:!Ext.isIE,
		winType:winType,
		record:record,
		sels:sels,
		pngClass:'',
		pngGroup:'inputdatawin',
		defaultFitPng:true,
		runner:false,
		resizable:false,
		//closeAction:winType?'hide':'destroy',
		closeAction:'hide',
		closable:false,
		tools: [{
			type:'maximize',
			itemId:'maximizeBtn',
			disabled:!userConfig.viewDocPic || (sels.length != 1 || record),
			handler: function() {
				var me = this;
				var win = me.up('window');
				var flag = !win.maximized ;		
				
				//me.restorePos(560);	
				win.restoreSize =  {
					width:1265, 
					height:560
				};	
				
				
				win.toggleMaximize();
				win.center();
				if(flag) {
					var nWidth = win.getWidth()- 1265;
					var nHeight = win.getHeight() - 560;
					if(nWidth > 0) {
						win.down('#pngContainer').setWidth(854+nWidth);
					}
					if(nHeight > 0) {
						win.down('baseviewpanel').setHeight(470+nHeight);
						win.down('#contanerData').setHeight(470+nHeight);
					}

				} else {
					win.down('#pngContainer').setWidth(854);
					win.down('baseviewpanel').setHeight(470);
					win.down('#contanerData').setHeight(470);
				}

			}
		},{
			type: 'close',
			handler: function() {
				var me = this;
				if(me.up('window').record) {
					var tmp = wfhandlerwin.mytasklist.get(me.up('window').record.data.workflowTaskID);
					if(tmp&&tmp.tplstr=='') {
						tmp.tplid = 'none';
						if(wf_inputDataWin != '') {
							//wf_inputDataWin.destroy();
							//wf_inputDataWin = '';
							wf_inputDataWin.hide();
							wf_inputDataWin.myreset = true;
						}
					} else {
						if(tmp && tmp.tplstr !='') {
							var winF = me.up('window').down('#inputdataform');
							var form = winF.getForm();
							form.setValues(Ext.JSON.decode(tmp.tplstr));
						}
						me.up('window').close();
					}
				} else {
					if(winType&&winType.tplstr=='') {
						winType.tplid = 'none';
						if(doc_inputDataWin != '') {
							doc_inputDataWin.destroy();
							doc_inputDataWin = '';
						}
						if(wf_inputDataWin != '') {
							//wf_inputDataWin.destroy();
							//wf_inputDataWin = '';
							wf_inputDataWin.hide();
							wf_inputDataWin.myreset = true;
						}
						if(sendfax_inputDataWin != '') {
							sendfax_inputDataWin.destroy();
							sendfax_inputDataWin = '';
						}

					} else {
						if(winType && winType.tplstr !='') {
							var winF = me.up('window').down('#inputdataform');
							var form = winF.getForm();
							form.setValues(Ext.JSON.decode(winType.tplstr));
						}
						me.up('window').close();
					}
				}
				//this.up('window').close();
			}
		}],
		bodyStyle: {
			overflow :'hidden'
		},
		layout: {
			type: 'table',
			columns:2
		},
		defaults: {
			margin:'2 2 0 2',
			width:410,
			labelAlign:'right',
			labelWidth:140
		},
		listeners: {
			hide: function(win) {
				if(win.winType) {
					showFlash(win.winType);
				}
			},
			activate: function(com,eOpts) {
				var winType = com;
				if(winType && userConfig.viewDocPic && (com.sels.length == 1 || com.record)) {
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
					if(hidForm) {
						ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
					}

				}
			},
			show: function(win) {

				if(win.winType) {
					hideFlash(win.winType);
				}
				if(win.hasloaded) {
					return;
				}
				win.hasloaded = true;

				var flag = win.maximized;
				if(flag) {
					return;
				}

				//判断是否加载图像显示
				if(userConfig.viewDocPic && (win.sels.length == 1 || win.record)) {
					win.setWidth(1265);
					win.addDocked({
						xtype: 'inputdatastatusbar',
						height: 26,
						dock: 'bottom'
					});
					win.insert(0, {
						tdAttrs: {
							style:'vertical-align:top'
						},
						xtype:'container',
						dock: 'left',
						itemId:'pngContainer',
						width:854,
						border:false,
						items:[{
							xtype: 'container',
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
							xtype: 'baseviewpanel',
							height:470,
							listeners: {
								//隐藏功能按钮
								afterrender: function(com) {
									com.down('#filepngdeleteFilepng').hide();
									com.down('#filepngenditorpng').hide();
									com.down('#delAllFile').hide();
									com.down('#fileLocalPath').hide();
									com.down('#filePath').hide();
									com.down('#replacePal').hide();
								}
							}
						}]
					});

					if(win.record) {
						initfaxfileinputdatawin(win.record.data.faxFileID,win);
					} else {
						initfaxfileinputdatawin(win.sels[0].data.faxFileID,win);
					}

					win.center();
					if(userConfig.viewDocPic && (win.sels.length == 1 || win.record)) {
						win.maximize();
						var nWidth = win.getWidth()- 1265;
						var nHeight = win.getHeight() - 560;
						if(nWidth > 0) {
							win.down('#pngContainer').setWidth(854+nWidth);
						}
						if(nHeight > 0) {
							win.down('baseviewpanel').setHeight(470+nHeight);
							win.down('#contanerData').setHeight(470+nHeight);
						}
					}

				} else {
					var formHeight = win.down('#inputdataform').getHeight();
					if(formHeight < 480) {
						win.setHeight(formHeight+80);
					} else {
						win.setHeight(560);
					}
				}
			}
		},
		items:[{
			xtype:'container',
			itemId:'contanerData',
			width:390,
			height:(userConfig.viewDocPic && (sels.length == 1 || record))?470:496,
			style: {
				overflow :'auto'
			},
			tdAttrs: {
				style:'vertical-align:top'
			},
			items:[{
				xtype:'form',
				tdAttrs: {
					style:'vertical-align:top'
				},
				itemId:'inputdataform',
				frame: false,
				border: false,
				defaults: {
					margin:'2 0 2 0',
					width:370,
					labelAlign:'right',
					labelWidth:140
				},
				listeners: {
					afterrender: function(com) {
						com.add(tmpItems);
					}
				}
			}]
		}],
		//items: tmpItems,
		buttons:[{
			text:'确定',
			handler: function() {
				var me = this;
				var winF = me.up('window').down('#inputdataform');
				var form = winF.getForm();
				if(!winType) {
					var cgrid = currGrid.itemId.toLowerCase();
					var treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
					var treename = getCurrTree().itemId;
					var selids = new Array();
					var mywin = me.up('window');
					var tplid = currGrid.getStore().getProxy().extraParams.template;
					var osStr ='';
					if(cgrid == 'infaxgrid') {
						Ext.Array.each(mywin.sels, function(rec,index,alls) {
							selids.push(rec.data.inFaxID);
						});
						osStr = 'inFaxID';
					}
					if(cgrid == 'outfaxgrid') {
						Ext.Array.each(mywin.sels, function(rec,index,alls) {
							selids.push(rec.data.outFaxID);
						});
						osStr = 'outFaxID';
					}
					if(cgrid == 'succoutfaxgrid') {
						Ext.Array.each(mywin.sels, function(rec,index,alls) {
							selids.push(rec.data.outFaxID);
						});
						osStr = 'outFaxID';
					}
					if(cgrid == 'docgrid') {
						Ext.Array.each(mywin.sels, function(rec,index,alls) {
							selids.push(rec.data.docID);
						});
						osStr = 'docID';
					}
					//alert(treeid+":"+selid+":"+tplid);
					//return;

					if (form.isValid()) {

						var urlStr = "?req=call&callname=inputtpldata&treeid="+treeid+"&treename="+treename+"&selids="+Ext.JSON.encode(selids)+"&tplid="+tplid+"&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "";
						//treeid,selId,tplId
						form.submit({
							url: WsConf.Url + urlStr,
							success: function (form, action) {
								me.up('window').close();

								//保存当前选择记录
								var records = null;
								var sels = currGrid.getSelectionModel();
								if(sels.hasSelection()) {
									records = sels.getSelection();
								}
								var store = currGrid.getStore();

								function setOrSels() {
									//判断之前是否有选择
									if(records != null) {
										var nArr = new Array();
										Ext.Array.each(records, function(rec,index,alls) {
											var nrec = store.getById(rec.data[osStr]);
											if(nrec != null) {
												nArr.push(nrec);
											}
										});
										sels.select(nArr);
									}
								}

								store.loadPage(store.currentPage, {
									callback: function(rcds, operation, success) {
										setOrSels();
									}
								});
								//currGrid.loadGrid(true);
							},
							failure: function (form, action) {
								if(!errorProcess(action.result.code)) {
									Ext.Msg.alert('失败', action.result.msg);
								}
							}
						});
					}
				}//winType
				else {
					if(form.isValid()) {
						if(me.up('window').record) {
							var tmp = wfhandlerwin.mytasklist.get(me.up('window').record.data.workflowTaskID);
							tmp.tplstr = Ext.JSON.encode(form.getValues());
						} else {
							wfhandlerwin.winType.tplstr = Ext.JSON.encode(form.getValues());
							//alert(winType.pngGroup);
							if(wfhandlerwin.winType.pngGroup == 'sendfax') {
								wfhandlerwin.winType.down('#btnTemplate').setText('录入表单数据'+':'+senWintitle);
							}
						}

						me.up('window').close();
					}

					//alert(Ext.JSON.encode(form.getValues()));
				}

			}
		},{
			text:'取消',
			handler: function() {
				var me = this;
				if(me.up('window').record) {
					var tmp = wfhandlerwin.mytasklist.get(me.up('window').record.data.workflowTaskID);
					if(tmp&&tmp.tplstr=='') {
						tmp.tplid = 'none';
						if(wf_inputDataWin != '') {
							//wf_inputDataWin.destroy();
							//wf_inputDataWin = '';
							wf_inputDataWin.hide();
							wf_inputDataWin.myreset = true;
						}
					} else {
						if(tmp && tmp.tplstr !='') {
							var winF = me.up('window').down('#inputdataform');
							var form = winF.getForm();
							form.setValues(Ext.JSON.decode(tmp.tplstr));
						}
						me.up('window').close();
					}
				} else {
					if(winType&&winType.tplstr=='') {
						winType.tplid = 'none';
						if(doc_inputDataWin != '') {
							doc_inputDataWin.destroy();
							doc_inputDataWin = '';
						}
						if(wf_inputDataWin != '') {
							//wf_inputDataWin.destroy();
							//wf_inputDataWin = '';
							wf_inputDataWin.hide();
							wf_inputDataWin.myreset = true;
						}
						if(sendfax_inputDataWin != '') {
							sendfax_inputDataWin.destroy();
							sendfax_inputDataWin = '';
						}

					} else {
						if(winType && winType.tplstr !='') {
							var winF = me.up('window').down('#inputdataform');
							var form = winF.getForm();
							form.setValues(Ext.JSON.decode(winType.tplstr));
						}
						me.up('window').close();
					}
				}

			}
		}]
	});
}

function initfaxfileinputdatawin(fileId,winType) {

	var data = fileId;

	var maskTarget = winType.down('#formFileId');

	var hidForm = winType.down('#hidFileId');
	var hidLoaded = winType.down('#hidLoaded');
	hidForm.setValue(data);

	var progressBar = winType.down('bottomProgressBar');
	var btnCancel = winType.down('#btnCancel');
	var btnContinue = winType.down('#btnContinue');
	btnCancel.hide();
	btnContinue.hide();

	if(winType.pngClass != '') {
		//清空
		var palPngContainer = winType.down('#filepngviewMini');
		palPngContainer.removeAll();
		//清空缩略图数组
		winType.pngClass.getPngAllMini().clear();
		//清空大图数组
		winType.pngClass.getPngSelBig().clear();
		//清空选择数组
		winType.pngClass.getPngSels().clear();
		//单页视图Img对象
		winType.pngClass.setPngContainerBig("");
		//单页图全局currPage
		winType.pngClass.setCurrCountBig(0);
		//当前传真总页数
		winType.pngClass.setCurrFaxFileTotal(1);
		winType.pngClass.setTotalCount(0);
		//
		winType.pngClass.setMiniCurPage(1);
		winType.pngClass.setMiniTotalPage(0);
		winType.down('#tbMiniPageTotal').setText('共'+'   ' + 0);
		//
		var tbPageTotal = winType.down('#tbPageTotal');
		tbPageTotal.setText('共'+'   ' + 0);
		winType.pngClass.setInsertStartPage(0);
		winType.pngClass.setTotalCount(0);
		winType.pngClass.setCurrFaxFileTotal(1);
		//toolbar 按钮状态
		ActionBase.updateActions('filepngview', 0,winType.pngClass.getPngSels().getCount(),winType.pngClass.getTotalCount(),-1);
		//清除filePath 文本和 fileId

		hidForm.setValue("");
		//设置前后插入等按钮状态
		ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
		if(hidForm.getValue() == '') {
			winType.down('#txtMiniCurrPage').setDisabled(true);
		} else {
			winType.down('#txtMiniCurrPage').setDisabled(false);
		}
		//重新设置totalPage
		//tbFaxFileTabPng
		//调用切换视图
		if(winType.pngClass.getViewType() == 1) {
			ActionBase.getAction('filepngviewviewTypeChange').execute();
		}

		winType.down('#filepngviewMini').setHeight(0);
		winType.down('#filepngviewMini').doLayout();
		winType.down('#panelfilepngview').doLayout();
	}

	//btnCancel.setDisabled(false);
	winType.pngClass = new filepngviewclass();
	//wfhandlerwin.down('#filePath').setValue('tmp'+ranId);
	winType.pngClass.setFaxFileId(data);

	//初始化图片浏览panel
	hidLoaded.setValue('1');
	winType.pngClass.initMyfilepngMini(maskTarget, hidLoaded,0,data, function() {

		setPngMiniWH(winType.pngClass,winType,'');

		winType.down('#filepngviewMini').doLayout();
		winType.down('#panelfilepngview').doLayout();
		//callMask.hide();
		winType.getEl().unmask();
		//隐藏进度条
		(new Ext.util.DelayedTask()).delay(1000, function() {
			progressBar.hide();
		});
	});
	//设置前后插入等按钮状态
	ActionBase.updateActions('acsendfaxwin', hidForm.getValue());

	if(hidForm.getValue() == '') {
		winType.down('#txtMiniCurrPage').setDisabled(true);
	} else {
		winType.down('#txtMiniCurrPage').setDisabled(false);
	}

}