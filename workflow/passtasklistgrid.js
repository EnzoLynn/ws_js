function wfwinshow(win,record,rule,fid) {

	if(wfhandlerwin.vvType && wfhandlerwin.vvType !=0) {
		ActionBase.updateActions('filepngview', wfhandlerwin.vvType.viewType,wfhandlerwin.vvType.selsCount,wfhandlerwin.vvType.totoalPage,wfhandlerwin.vvType.currPage);
	} else {
		ActionBase.updateActions('filepngview', 0,0,0,-1);
		//mini
		win.down('#txtMiniCurrPage').setValue(1);
		win.down('#txtMiniCurrPage').setVisible(true);
		win.down('#tbMiniPageTotal').setVisible(true);
		//fit
		win.down('#filepngviewfistPage').setVisible(false);
		win.down('#filepngviewprePage').setVisible(false);
		win.down('#tbPageTotal').setVisible(false);
		win.down('#txtCurrPage').setVisible(false);
		win.down('#filepngviewnextPage').setVisible(false);
		win.down('#filepngviewlastPage').setVisible(false);

	}

	var progressBar = win.down('#bottomProgressBar');
	progressBar.hide();
	//win.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
	ActionBase.updateActions('acdocaddwin', win.down('#hidFileId').getValue());
	if(win.down('#hidFileId').getValue() == '') {
		win.down('#txtMiniCurrPage').setDisabled(true);
	} else {
		win.down('#txtMiniCurrPage').setDisabled(false);
	}

	//				var tmpStr = getSendRoleStr();
	//win.down('#lblMessage').hide();
	//填写需要的处理
	var rulstr =getWorkflowActionText(rule);
	if(record.data.resourceType != 'OUTFAX') {
		rulstr = rulstr.replace('填写收件人'+',','');
		rulstr = rulstr.replace('填写收件人','');
	}
	win.down('#lblMessage').setText('需要您的处理:'+rulstr);

	win.down('#submitMessage').hide();
	win.down('#submitMessage').setText('');

	win.down('#replacePal').hide();
	win.down('#fileLocalPath').hide();
	win.down('#filePath').hide();

	win.down('#panelfilepngview').doLayout();
	//if(!workflowActionDis(rule,'VIEW_FAX')) {//浏览文档
	if(fid) {
		if(fid != win.down('#hidFileId').getValue()) {
			initfaxfilewfwin(fid,record.data.workflowTaskID);
		}
	} else {
		if(fid != win.down('#hidFileId').getValue()) {
			initfaxfilewfwin(record.data.faxFileID,record.data.workflowTaskID);
		}
	}

	//}
	win.down('#delAllFile').hide();
	win.down('#filepngdeleteFilepng').hide();
	win.down('#tbdelAllFile').hide();

	if(workflowActionDis(rule,'EDIT_DOC')) {//编辑文档 -不能盖章
		win.down('#filepngenditorpng').hide();

		win.down('#filepngviewrotateLeft').hide();
		win.down('#filepngviewrotateRight').hide();
		win.down('#filepngviewoverturn').hide();
		var sList = win.down('tbfilepngview').query('tbseparator');
		Ext.Array.each(sList, function(item) {
			if(item.myname == 'edit')
				item.hide();
		});
		win.down('#emptyTxt').hide();
	} else {
		win.down('#filepngenditorpng').setText('编辑/签章');
		win.down('#filepngenditorpng').show();
		//win.down('#delAllFile').show();
		//win.down('#filepngdeleteFilepng').show();
		win.down('#filepngviewrotateLeft').hide();
		win.down('#filepngviewrotateRight').hide();
		win.down('#filepngviewoverturn').show();
		var sList = win.down('tbfilepngview').query('tbseparator');
		Ext.Array.each(sList, function(item) {
			if(item.myname == 'edit')
				item.show();
		});
		win.down('#emptyTxt').show();
	}

	if(!workflowActionDis(rule,'STAMP_DOC')) {//WaveFax签章 -只能盖章
		win.down('#filepngenditorpng').show();
	}

	//装载任务主题
	if(record.data.taskComment == '') {
		win.down('#customid').setValue('无');
	} else {
		win.down('#customid').setValue(record.data.taskComment);
	}

	//装载需要的处理
	var btnInput =win.down('#tbbtnInput');
	var tbsInput = win.down('#tbsInput');
	if(btnInput) {
		win.down('tbfilepngview').remove(btnInput);
	}
	if(tbsInput) {
		win.down('tbfilepngview').remove(tbsInput);
	}

	if((!workflowActionDis(rule,'EDIT_RECIPIENT') || !workflowActionDis(rule,'COMMENT_FAX'))
	&& record.data.resourceType == 'OUTFAX') {
		win.down('tbfilepngview').add({
			xtype:'tbseparator',
			itemId:'tbsInput',
			border:true
		});
		win.down('tbfilepngview').add({
			text:'填写收件人/注释',
			itemId:'tbbtnInput',
			handler: function() {
				var tmp = wfhandlerwin.mytasklist.get(record.data.workflowTaskID);
				if(tmp.recicoment  != '') {
					wfreceviewin = loadwfreceviewin(record,rule,tmp);
				} else {
					wfreceviewin = loadwfreceviewin(record,rule);
				}

				wfreceviewin.show();
			}
		});
	}

	var tbbtnComent =win.down('#tbbtnComent');
	var tbsComent = win.down('#tbsComent');
	if(tbbtnComent) {
		win.down('tbfilepngview').remove(tbbtnComent);
	}
	if(tbsComent) {
		win.down('tbfilepngview').remove(tbsComent);
	}
	if(!workflowActionDis(rule,'COMMENT_FAX') &&  record.data.resourceType != 'OUTFAX') {
		win.down('tbfilepngview').add({
			xtype:'tbseparator',
			itemId:'tbsComent',
			border:true
		});
		win.down('tbfilepngview').add({
			text:'注释',
			itemId:'tbbtnComent',
			handler: function() {
				wfcomentwin = loadwfcomentwin(record);
				wfcomentwin.show(null, function() {
					var tmpr = wfhandlerwin.mytasklist.get(record.data.workflowTaskID);
					if(tmpr) {
						wfcomentwin.down('#comTxta').setValue(tmpr.wfcoment);
					}
					//alert(tmpr.wfcoment);
				});
			}
		});
	}

	var tbbtnTpl =win.down('#tbbtnTpl');
	var tbsTpl = win.down('#tbsTpl');
	if(tbbtnTpl) {
		win.down('tbfilepngview').remove(tbbtnTpl);
	}
	if(tbsTpl) {
		win.down('tbfilepngview').remove(tbsTpl);
	}
	if(!workflowActionDis(rule,'EDITFORM_DOC')) {
		win.down('tbfilepngview').add({
			xtype:'tbseparator',
			itemId:'tbsTpl',
			border:true
		});
		win.down('tbfilepngview').add({
			text:'录入表单数据',
			itemId:'tbbtnTpl',
			handler: function() {
				//hideFlash(docaddwin);
				var tplId1 = '';
				var sels = currGrid.getSelectionModel().getSelection();
				//tplId1 = sel.data.templateid;

				var tmp = wfhandlerwin.mytasklist.get(record.data.workflowTaskID);
				if(sels.length > 1) {
					tplId1 = tmp.record.data.templateid;
				} else {
					tplId1 = sels[0].data.templateid;
				}

				//alert(tmp.record.data.templateid);
				//默认跟当前Grid tplid一致
				var tplId2 = currGrid.getStore().getProxy().extraParams.template;

				if(tplId1!= '' && tplId1!= 0) {
					tmp.tplid = tplId1;
				} else if(tplId2 != '') {
					tmp.tplid = tplId2;
				}

				function showDocDataWin(tplId) {

					var faxid ='';

					function showLastDo() {
						template.myWinItems = new Array();
						template.myWinGItems.clear();
						var data = Ext.clone(template.saveTplInfo.get(tplId));
						Ext.Array.each(data, function(item,index,alls) {
							template.createContorl(item);
						});
						if(wf_inputDataWin == '') {
							wf_inputDataWin = loadInputDataWin(false,wfhandlerwin,tmp.record);
							wf_inputDataWin.show(null, function() {

								if(tmp.tplstr != '') {
									var winF = wf_inputDataWin.down('#inputdataform');
									var form = winF.getForm();
									form.setValues(Ext.JSON.decode(tmp.tplstr));
								} else {
									var param = {
										id:sels.length > 1?tmp.record.data.resourceID:sels[0].data.resourceID,
										sessiontoken:sessionToken,
										restype:sels.length > 1?tmp.record.data.resourceType:sels[0].data.resourceType
									}
									//alert('call');
									WsCall.call('gettplinfo', param, function(response, opts) {
										var data = Ext.JSON.decode(response.data);
										Ext.Array.each(data, function(item) {
											var cmp = wf_inputDataWin.down('#'+item.dataName);
											var xtype = cmp.getXType();
											if(xtype == 'datetimefield') {
												var tmpDf;
												var timeDf;
												if(item.dataDefault.indexOf('T') != -1) {
													tmpDf = item.dataDefault.split('T');
													timeDf = tmpDf[1].split(':');
													cmp.dateField.setValue(tmpDf[0]);
												} else {
													timeDf = item.dataDefault.split(':');
												}
												cmp.timeHField.setValue(timeDf[0]);
												cmp.timeMField.setValue(timeDf[1]);
												cmp.timeIField.setValue(timeDf[2]);
											} else if(xtype == 'fieldcontainer') {
												var radios = cmp.query('radiofield');
												for(var k in radios) {
													if(radios[k].boxLabel.toLowerCase() == item.dataDefault.toString()) {
														radios[k].setValue(true);
													}
												}
											} else {
												cmp.setValue(item.dataDefault);
											}

										});
									}, function(response, opts) {
										if(!errorProcess(response.code)) {
											Ext.Msg.alert('消息', '加载模版信息失败:'+response.msg);
										}
									},false);
								}

							});
						} else {
							if(wf_inputDataWin.myreset && wf_inputDataWin.myreset == true) {
								wf_inputDataWin.myreset = false;
								wf_inputDataWin = loadInputDataWin(false,wfhandlerwin,tmp.record,wf_inputDataWin);
								wf_inputDataWin.show(null, function() {
									if(wf_inputDataWin.down('#hidFileId')){
										if(tmp.record.data.faxFileID != wf_inputDataWin.down('#hidFileId').getValue()) {
											initfaxfileinputdatawin(tmp.record.data.faxFileID,wf_inputDataWin);
										}
									}
									

									if(tmp.tplstr != '') {
										var winF = wf_inputDataWin.down('#inputdataform');
										var form = winF.getForm();
										form.setValues(Ext.JSON.decode(tmp.tplstr));
									} else {
										var param = {
											id:sels.length > 1?tmp.record.data.resourceID:sels[0].data.resourceID,
											sessiontoken:sessionToken,
											restype:sels.length > 1?tmp.record.data.resourceType:sels[0].data.resourceType
										}
										//alert('call');
										WsCall.call('gettplinfo', param, function(response, opts) {
											var data = Ext.JSON.decode(response.data);
											Ext.Array.each(data, function(item) {
												var cmp = wf_inputDataWin.down('#'+item.dataName);
												var xtype = cmp.getXType();
												if(xtype == 'datetimefield') {
													var tmpDf;
													var timeDf;
													if(item.dataDefault.indexOf('T') != -1) {
														tmpDf = item.dataDefault.split('T');
														timeDf = tmpDf[1].split(':');
														cmp.dateField.setValue(tmpDf[0]);
													} else {
														timeDf = item.dataDefault.split(':');
													}
													cmp.timeHField.setValue(timeDf[0]);
													cmp.timeMField.setValue(timeDf[1]);
													cmp.timeIField.setValue(timeDf[2]);
												} else if(xtype == 'fieldcontainer') {
													var radios = cmp.query('radiofield');
													for(var k in radios) {
														if(radios[k].boxLabel.toLowerCase() == item.dataDefault.toString()) {
															radios[k].setValue(true);
														}
													}
												} else {
													cmp.setValue(item.dataDefault);
												}

											});
										}, function(response, opts) {
											if(!errorProcess(response.code)) {
												Ext.Msg.alert('消息', '加载模版信息失败:'+response.msg);
											}
										},false);
									}

								});
							} else {
								wf_inputDataWin.show(null, function() {
									if(tmp.tplstr != '') {
										var winF = wf_inputDataWin.down('#inputdataform');
										var form = winF.getForm();
										form.setValues(Ext.JSON.decode(tmp.tplstr));
									}
								});
							}

						}
					}

					//如果未保存过该模版信息
					if(!template.saveTplInfo.containsKey(tplId)) {
						//调用Call 取得默认值
						var param = {};
						param.template = tplId;
						param.sessiontoken = sessionToken;
						// 调用
						WsCall.call('getcolumn', param, function(response, opts) {
							var d = Ext.JSON.decode(response.data);
							if(!template.saveTplInfo.containsKey(tplId)) {
								template.saveTplInfo.add(tplId,d);
							}
							showLastDo();
						}, function(response, opts) {
						}, false);
					} else {
						showLastDo();
					}

					// }, function(response, opts) {
					// if(!errorProcess(response.code)) {
					// Ext.Msg.alert('失败', response.msg);
					// }
					//}, true,'加载中...',Ext.getBody(),50);
				}

				if(tmp.tplid != 'none') {
					showDocDataWin(tmp.tplid);
				} else {
					if(template.tplGridArr.length == 0) {
						Ext.Msg.alert('消息','当前无任何可用模版');
						return;
					}
					loadTemplateWin( function(record) {
						var tplId = record.data.tplId;
						if(tplId == 'none') {
							return;
						}
						tmp.tplid=tplId;
						showDocDataWin(tplId);
						//ActionBase.getAction('recTemplate').execute(null,null,sels);
					},wfhandlerwin);
				}
			}
		});
	}

	//加载附件
	win.down('#attToolbar').removeAll();
	if(record.data.attach.length > 0) {
		var vals = record.data;
		var fileId = vals.faxFileID;

		var param = {
			fileId:fileId,
			attach:vals.attach,
			sessiontoken:sessionToken,
			faxtype:currGrid.itemId
		}
		WsCall.call('getslavefileinfo', param, function(response, opts) {
			var deInfo = Ext.JSON.decode(response.data);
			Ext.Array.each(deInfo, function(item) {
				win.down('#attToolbar').add({
					sid:item[0],
					sname:item[1],
					text:'<img style="margin-bottom:-2px;width:16px;height:16px;" src='+getFileIcon(item[1])+' />'+item[1]
				});

			});
		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('附件信息', '加载附件信息失败');
			}
		}, true,'附件加载中...',Ext.getBody(),1);
	} else {
		win.down('#attToolbar').add({
			xtype:'label',
			text:'无',
			listeners: {}
		});
	}

	var curritem;
	Ext.Array.each(Ext.JSON.decode(record.data.process), function(item) {
		if(item.activityStatus == '1' || item.activityStatus == '2') {
			curritem = item;
			return false;
		}
	});
	win.setTitle(curritem.acttivityName);
}

Ext.create('Ext.data.Store', {
	//model: 'defaultgridModel',
	storeId: 'passtasklistGridStore',
	fields: [{
		name:'workflowTaskID',
		type:'string'
	},{
		name:'faxfileid',
		type:'string'
	}
	],
	autoLoad: true,
	pageSize: 10,
	data: []
});

Ext.define('ws.workflow.passtasklistGrid', {
	alternateClassName: ['passtasklistGrid'],
	alias: 'widget.passtasklistGrid',
	extend: 'Ext.grid.Panel',
	store: 'passtasklistGridStore',
	autoScroll:true,
	//hideHeaders:true,
	viewConfig: {
		style: {
			'overflow': 'hidden'
		}
	},
	columns: [{
		text: '任务ID',
		dataIndex: 'workflowTaskID',
		flex: 1
	}
	],
	listeners: {
		itemclick: function(view,record,htmlel,index,e,opts) {
			tgridIdClickdelay.cancel();
			tgridIdClickdelay.delay(500, function() {

				if(wf_inputDataWin != '') {
					wf_inputDataWin.hide();
					wf_inputDataWin.myreset = true;
					//wf_inputDataWin.destroy();
					//wf_inputDataWin = '';
				}

				if(wfhandlerwin != '') {
					var tmp = wfhandlerwin.mytasklist.get(record.data.workflowTaskID);
					wfhandlerwin.curWfTid = record.data.workflowTaskID;
					var fid = tmp.fileid==''?record.data.faxfileid:tmp.fileid;
					var rule;
					Ext.Array.each(Ext.JSON.decode(tmp.record.data.process), function(item) {
						if(item.activityStatus == '1' || item.activityStatus == '2') {
							rule = item.workflowAction;
							return false;
						}
					});
					
					wfwinshow(wfhandlerwin,tmp.record,rule,fid);
					//initfaxfilewfwin(fid,record.data.workflowTaskID);
				}
			});
		},
		afterrender: function(grid,opts) {
			if (!grid.getSelectionModel().hasSelection()) {
				grid.getSelectionModel().select(0, true);
			}
		}
	}

});