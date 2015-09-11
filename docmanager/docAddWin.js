//发送传真用win
function loaddocaddwin() {
	function docClose() {
		var fileid = docaddwin.down('#hidFileId').getValue();

		if(fileid != '') {
			var param1 = {};
			param1.fileId = fileid;
			param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
			//调用
			WsCall.call('deleteTempFiles', param1, function (response, opts) {

			}, function (response, opts) {
				//Ext.Msg.alert('失败', response.msg);
			}, true);
		}
		docaddwin.close();
	}

	return Ext.create('Ext.window.Window', {
		title: '新建文档',
		modal:true,
		iconCls:'docAdd',
		height: 529,
		//closeAction:'hide',
		shadow:!Ext.isIE,
		pngClass:'',
		pngGroup:'docwin',
		runner:false,
		tplstr:'',
		tplid:'none',		
		width: 910,
		layout: 'anchor',
		collapsible: false,
		resizable: false,
		frame: false,
		border: false,
		closable:false,
		tools: [{
			type: 'close',
			handler: function() {
				docClose();
			}
		}],
		defaults: {
			frame: false,
			border: false
		},
		dockedItems: [{
			xtype: 'docstatusbar',
			height: 26,
			dock: 'bottom'
		}],
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
			xtype: 'baseviewpanel',
			border:true
		},{
			xtype: 'form',
			itemId:'docBaseForm',
			layout: {
				type:'table',
				columns:2
			},
			////bodyCls: 'panelFormBg',
			frame: false,
			border: false,
			items: [{
				xtype:'fieldset',
				title:'文档基本属性',
				margin: '0 0 0 10',
				rowspan:4,
				height:136,
				width:700,
				defaults: {
					xtype: 'textfield',
					labelAlign: 'right',
					margin: '3 0 5 10',
					labelPad: 1,
					labelWidth: 80,
					width: 650,
					frame: false,
					border: false
				},
				items:[{
					fieldLabel: '自定义编号',
					itemId:'customid',
					validator: function(val) {
						return myTextValidator(val,50);
					}
				},{
					fieldLabel: '关键字',
					itemId:'keyword',
					validator: function(val) {
						return myTextValidator(val,250);
					}
				},{
					xtype:'textarea',
					fieldLabel: '注释',
					rows:2,
					height:40,
					//cols:30,
					itemId:'comment',
					validator: function(val) {
						return myTextValidator(val,250);
					}
				}]
			},{
				xtype: 'button',
				margin: '8 0 0 40',
				width:100,
				text: '输入数据',
				handler: function() {
					hideFlash(docaddwin);
					var tplId1 = '';
					tplId1 = currGrid.getStore().getProxy().extraParams.template;

					if(tplId1!= '') {
						docaddwin.tplid = tplId1;
					}

					function showDocDataWin(tplId) {

						var faxid ='';
						//调用Call 取得模版信息
						// var param = {};
						// param.template = tplId;
						//
						// //param.treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
						// param.sessiontoken = sessionToken;
						// // 调用
						// WsCall.call('gettemplate', param, function(response, opts) {

						template.myWinItems = new Array();
						template.myWinGItems.clear();
						var data = Ext.clone(template.saveTplInfo.get(tplId));
						Ext.Array.each(data, function(item,index,alls) {
							template.createContorl(item);
						});
						if(doc_inputDataWin == '') {
							doc_inputDataWin = loadInputDataWin(false,docaddwin);
						}
						doc_inputDataWin.show();
						// }, function(response, opts) {
						// if(!errorProcess(response.code)) {
						// Ext.Msg.alert('失败', response.msg);
						// }
						//}, true,'加载中...',Ext.getBody(),50);
					}

					if(docaddwin.tplid != 'none') {
						showDocDataWin(docaddwin.tplid);
					} else {
						loadTemplateWin( function(record) {
							var tplId = record.data.tplId;
							if(tplId == 'none') {
								return;
							}
							docaddwin.tplid=tplId;
							showDocDataWin(tplId);
							//ActionBase.getAction('recTemplate').execute(null,null,sels);
						},docaddwin);
					}
				}
			},{
				xtype:'button',
				text:'添加附件',
				width:100,
				margin: '2 0 10 40',
				handler: function() {
					//禁用faxFileUpload
					hideFlash(docaddwin);

					if(docattwin == '') {

						if(isSurportFlash) {
							slaveFilesQueueCol.clear();
							slaveFilesUpedCol.clear();
						} else {
							slaveFilesQueueCol.clear();
						}
						docattwin = loaddocattwin();

						docattwin.show(null, function() {
							//调用call
							var param1 = {};
							param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

							WsCall.call('delappslave', param1, function (response, opts) {
							}, function (response, opts) {
							}, false);
							if(isSurportFlash) {
								//docattwin.down('');
							} else {
								docattwin.down('#fsFiles').removeAll();
								docattwin.down('#fsFiles').add({
									xtype:'form',
									//bodyCls: 'panelFormBg',
									border:false,
									items:[{
										xtype:'filefield',
										name:'slavefiles',
										width:540,
										buttonText: '...',
										listeners: {
											change: function(com,value,eOpts) {
												var name = '';
												var index = value.indexOf('\\');

												if(index != -1) {
													index = value.lastIndexOf('\\');
													name = value.substring(index+1,value.length);
												} else {
													name = value;
												}
												if(slaveFilesQueueCol.containsKey(name)) {
													com.setRawValue('');
													Ext.Msg.alert('消息','已选择过'+name+',不能重复选择同名的文件上传');
												} else {
													slaveFilesQueueCol.add(name,name)
												}
											}
										}
									}]
								});
							}

						});
					} else {
						docattwin.show();
					}

				}
			},{
				xtype: 'button',
				text: '确定',
				width:100,
				margin: '4 0 0 40',
				handler: function() {
					//alert(docaddwin.tplstr);
					var form = docaddwin.down('#docBaseForm').getForm();
					if(!form.isValid()) {
						return;
					}
					//alert(docaddwin.down('#hidFileId').getValue());
					var fileid = docaddwin.down('#hidFileId').getValue();
					if(fileid != '') {

						function submitFax1() {
							//调用Call 上传文档信息
							var param = {};
							param.fileid = fileid;
							param.tplid = docaddwin.tplid;
							param.tplstr = docaddwin.tplstr;
							param.treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
							param.customid = docaddwin.down('#customid').getValue();
							param.keyword = docaddwin.down('#keyword').getValue();
							param.comment = docaddwin.down('#comment').getValue();
							param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

							WsCall.call('createdoc', param, function(response, opts) {
								var param1 = {};
								param1.fileId = fileid;
								param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
								//调用
								WsCall.call('deleteTempFiles', param1, function (response, opts) {

								}, function (response, opts) {
									//Ext.Msg.alert('失败', response.msg);
								}, true);
								docaddwin.close();
								docGrid.loadGrid();
							}, function(response, opts) {
								if(!errorProcess(response.code)) {
									Ext.Msg.alert('失败', response.msg);
								}
							}, true,'加载中...',Ext.getBody(),50);
						}

						if(docattwin && docattwin !='') {
							slaveUplPro(docattwin,submitFax1);
						} else {
							submitFax1();
						}

					} else {
						Ext.Msg.alert('提示','请添加至少1个文件');
					}

				}
			},{
				xtype: 'button',
				width:100,
				margin: '0 0 0 40',
				text: '取消',
				handler: function() {
					docClose();
				}
			}]
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
			destroy: function () {
				//关闭录入数据窗口
				if(doc_inputDataWin != '') {
					doc_inputDataWin.destroy();
					doc_inputDataWin = '';
				}
				docaddwin = '';
				if(docattwin != '') {
					docattwin.destroy();
					docattwin = '';
				}
			},
			show: function (win, opts) {

				//调用call
				var param1 = {};
				param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

				WsCall.call('delappslave', param1, function (response, opts) {
				}, function (response, opts) {
				}, false);
				if(docaddwin.vvType && docaddwin.vvType !=0) {
					ActionBase.updateActions('filepngview', docaddwin.vvType.viewType,docaddwin.vvType.selsCount,docaddwin.vvType.totoalPage,docaddwin.vvType.currPage);
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

				//打印机来源
				//加载State
				if(onLocalPrinter) {
					if(myStates&&myStates.printerSrc) {
						for (key in myStates.printerSrc) {
							if( !myStates.printerSrc[key] || key == 'stateSaved')
								continue;
							if(myStates.printerSrc[key] == 'serverPSrc') {
								ActionBase.getAction('docserverPSrc').execute(null,null,true);
							}
							if(myStates.printerSrc[key] == 'localPSrc') {
								ActionBase.getAction('doclocalPSrc').execute(null,null,true);
							}
						}
					}
				} else {
					win.down('#doclocalPSrc').setDisabled(true);
					ActionBase.getAction('docserverPSrc').execute(null,null,true);
				}
				//打印机类型
				if(myStates&&myStates.printerType) {
					for (key in myStates.printerType) {
						if( !myStates.printerType[key] || key == 'stateSaved')
							continue;
						if(myStates.printerType[key] == 'docPtype') {
							ActionBase.getAction('doc_docPtype').execute(null,null,true);
						}
						if(myStates.printerType[key] == 'photoPtype') {
							ActionBase.getAction('doc_photoPtype').execute(null,null,true);
						}
					}
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
				win.down('#lblMessage').hide();
				win.down('#lblMessage').setText('');
				win.down('#submitMessage').hide();
				win.down('#submitMessage').setText('');

				if(win.faxFileUpload) {
					win.faxFileUpload.destroy();
				}
				var pal = win.down('#replacePal');
				pal.removeAll();

				pal.add({
					xtype:'container',
					frame:false,
					itemId:'spanButtonPlaceholder',
					listeners: {
						render: function(com) {
							initFaxUpload(win);
						}
					}
				});

				win.down('#panelfilepngview').doLayout();

			}
		}
	});

}

Ext.define('WS.docmanager.docattwin', {
	extend: 'Ext.window.Window',
	alias: 'widget.docattwin'
})
function loaddocattwin() {
	return Ext.create('WS.docmanager.docattwin', {
		title:'添加附件',
		iconCls:'',
		modal:true,
		resizable:false,
		isuploading:false,
		closeAction:'hide',
		closable:false,
		tools: [{
			type: 'close',
			handler: function() {
				if(!docattwin.isuploading) {
					docattwin.close();
				} else {
					Ext.Msg.alert('消息','正在上传附件无法进行其他操作');
				}
			}
		}],
		listeners: {
			destroy: function() {
				if(isSurportFlash) {
					slaveFilesQueueCol.clear();
					slaveFilesUpedCol.clear();
				} else {
					slaveFilesQueueCol.clear();
				}
			},
			hide: function() {
				showFlash(docaddwin);
			}
		},
		items:[{
			xtype:'upFilesPal',
			padding:'2 2 2 5',
			preventHeader:true
		}],
		buttons:[{
			text:'确定',
			itemId:'btnOk1',
			handler: function() {
				var me = this;

				me.up('window').close();
			}
		},{
			text:'取消',
			itemId:'btnCancel1',
			handler: function() {
				var me = this;
				me.up('window').close();
			}
		}]
	});
}