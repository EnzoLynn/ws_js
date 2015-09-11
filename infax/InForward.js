//读取Node
function recReadNode(records,arr) {
	Ext.Array.each(records, function(rec,index,alls) {
		arr.push(rec);
	});
}

//从用户选择到目标Grid
function inserTarFromUser(w) {
	var tarStore = Ext.StoreMgr.lookup('userdicStore');
	var grid = w.down('#userID');
	var sels = grid.getSelectionModel().getSelection();
	Ext.Array.each(sels, function(item,index,alls) {
		if(tarStore.findRecord('udID','user_'+item.data.userID) == null) {
			var userName = item.data.userName;
			var udName = userName.length>0?item.data.accountName+'('+userName+')':item.data.accountName
			var r = Ext.ModelManager.create({
				udID: 'user_'+item.data.userID,
				udName: udName,
				dtmf: item.data.dtmf,
				udType: 'user'
			}, 'WS.user.userdicModel');
			tarStore.insert(0, r);
		}
	});
}

//从目录选择到目标Grid
function inserTarFromDic(w) {
	var tarStore = Ext.StoreMgr.lookup('userdicStore');
	var dirSrcTree = w.down('#dirSrcTree');
	var nArr = new Array();

	recReadNode(dirSrcTree.getSelectionModel().getSelection(),nArr);
	var map = new Ext.util.HashMap();
	tarStore.each( function(record,index,all) {
		map.add(record.data.udID.toString(),record.data.udName);
	});
	Ext.Array.each(nArr, function(rec,index,all) {
		if(!map.containsKey('dic_'+rec.data.id.toString())) {
			var dirtext1 = linkFolderText(rec);
			var r = Ext.ModelManager.create({
				udID: 'dic_'+rec.data.id,
				udName: dirtext1,
				dtmf: '',
				udType: 'dic'
			}, 'WS.user.userdicModel');
			tarStore.insert(0, r);
		}
	});
}

//内部转发用数据类
Ext.define('inforwarClass', {
	config: {
		userids:[],//内部转发 用户id列表[]
		directroys:[]//目录路径 列表[]
	},
	constructor: function (cfg) {
		this.initConfig(cfg);
	}
});

Ext.define('WS.infax.InForward', {
	extend: 'Ext.window.Window',
	alias: 'widget.InForward',
	alternateClassName: ['InForward'],
	title: '本地内部传真',
	iconCls: 'inresendifICON',
	//height: 500,
	//width: 910,
	isuploading:false,
	closable:false,
	tools: [{
		type: 'close',
		handler: function() {
			if(!faxforwardwin.isuploading) {
				faxforwardwin.close();
			} else {
				Ext.Msg.alert('消息','正在上传附件无法进行其他操作');
			}
		}
	}],
	width:900,
	closeAction:'hide',
	bodyBoder:false,
	isDraft:false,
	layout: {
		type: 'table',
		columns:2
	},
	listeners: {
		hide: function(cmp) {
			showFlash(sendfaxwin);
			if (orgniTreeWin != '') {
				orgniTreeWin.destroy();
			}
			orgniTreeWin = '';
			orgniTreeLoading = 0;
			Ext.StoreMgr.removeAtKey ('orgnizTreeStoreID');
			cmp.down('#userID').getStore().getProxy().extraParams.folderid = 0;
			cmp.down('#orgFolderID').setValue('全部');
		},
		afterrender: function (win, opts) {
		
			win.getEl().on('click', function () {
				if (orgniTreeWin != '') {
					orgniTreeWin.destroy();
				}
				orgniTreeWin = '';
				orgniTreeLoading = 0;

			});
			var header = win.header;

			header.getEl().on('mousedown', function () {

				if (orgniTreeWin != '') {
					orgniTreeWin.destroy();
				}
				orgniTreeWin = '';
				orgniTreeLoading = 0;

			});
		}
	},
	statics: {		//类的静态函数
		inforward: function (me, records) {
			//var w = faxforwardwin;
			var gridRecords = faxforwardwin.grid.getSelectionModel().getSelection();

			var userIDsArr = new Array();
			var dirIdsArr = new Array();
			Ext.Array.each(records, function(rec) {
				if(rec.data.udType == 'user') {
					var userid = rec.data.udID.substring(5,rec.data.udID.length);
					userIDsArr.push(userid);
				} else if(rec.data.udType == 'dic') {
					var did = rec.data.udID.substring(4,rec.data.udID.length);
					dirIdsArr.push(did);
				}
			});
			var userIDS = Ext.JSON.encode(userIDsArr);
			var dirIds = Ext.JSON.encode(dirIdsArr);
			//var form = faxforwardwin.down('#fileForm').getForm();
			if(userIDS=="[]" && dirIds=="[]") {
				Ext.Msg.alert('消息',"请选择至少1位内部收件人或1个共享文件夹！");
				return;
			}

			var param = {
				sessiontoken: getSessionToken(),
				userIDs: userIDS,
				dirIDs:dirIds,
				folderId: faxforwardwin.grid.getStore().getProxy().extraParams.folderid,
				faxIDs: Ext.JSON.encode(buildFaxIDs(gridRecords, 'inFaxID')),
				isDel: faxforwardwin.down('#isDelID').getValue()
			};

			WsCall.call('inforward', param, function (response, opts) {
				Ext.Msg.alert('成功', '传真内部转发成功');
				faxforwardwin.grid.getStore().load();
			}, function (response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
				faxforwardwin.grid.loadGrid();
			},true,'正在发送...',Ext.getBody(),1);
			faxforwardwin.hide();
		}
	},
	resizable: false,		//窗口大小不能调整
	modal: true,   //设置window为模态
	items:[{
		xtype:'tabpanel',
		plain: true,
		width:872,
		height:430,
		bodyBoder:false,
		margin:'5 5 5 5',
		border:false,
		defaults: {
			//bodyCls: 'panelFormBg',
			border: false
		},
		listeners: {
			tabchange: function(tabPanel,newCard) {
				faxforwardwin.down('#dirSrcTree').determineScrollbars();

				if(faxforwardwin.needClear == true && newCard.itemId == 'tabpalFiles') {
					//alert(newCard.itemId);
					if(faxforwardwin.isDraft == true) {

						faxforwardwin.down('#btnDelSl').setVisible(false);
						faxforwardwin.down('#btnAddSl').setVisible(false);
						var cFc = faxforwardwin.down('#fsFiles');
						cFc.removeAll();
						cFc.add({
							xtype:'panel',
							//bodyCls: 'panelFormBg',
							border:false,
							layout: {
								type:'table',
								columns:1
							},
							items:[]
						});
						//tabs.removeAll();
						var param = {
							fileId:currGrid.getSelectionModel().getSelection()[0].data.faxFileID,
							attach:currGrid.getSelectionModel().getSelection()[0].data.attach,
							sessiontoken:sessionToken,
							faxtype:currGrid.itemId
						}
						WsCall.call('getslavefileinfo', param, function(response, opts) {
							var deInfo = Ext.JSON.decode(response.data);
							var panel = cFc.down('panel');
							Ext.Array.each(deInfo, function(item,index,alls) {
								panel.add({
									xtype:'label',
									html:"<span><img src='"+getFileIcon(item[1])+"' style='margin-bottom: -3px;'>&nbsp;" + item[1] + '</span>'
								});
							});
						}, function(response, opts) {
							if(!errorProcess(response.code)) {
								Ext.Msg.alert('附件信息', '加载附件信息失败');
							}
						}, true,'附件加载中...',faxforwardwin,1);
					} else {
						faxforwardwin.needClear = false;
						if(isSurportFlash) {
							var spal = faxforwardwin.down('#tabpalFiles');
							spal.fireEvent('afterrender',spal);
							// if(slaveUpload) {
							// slaveUpload.destroy();
							// }
							//initSwfUpload(faxforwardwin);
						} else {
							faxforwardwin.down('#btnDelSl').setVisible(true);
							faxforwardwin.down('#btnAddSl').setVisible(true);
							if(faxforwardwin != '') {

								faxforwardwin.down('#fsFiles').removeAll();
								faxforwardwin.down('#fsFiles').add({
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
											},
											afterrender: function(com) {
												com.reset();
											}
										}
									}]
								});

							}
						}//else

					}

				}//needclear
			}
		},
		items:[{
			title:'到目标',
			itemId:'forwarUserDic',
			layout: {
				type: 'table',
				columns: 3
			},
			items:[{
				xtype: 'radiogroup',
				//margin:'0 0 0 50',
				fieldLabel: '类型',
				labelWidth:50,
				labelAlign:'right',
				labelStyle:'padding:6px 0 0;',
				itemId:'rdUdType',
				height:25,
				colspan: 3,
				width:360,
				listeners: {
					change: function(rgcom,nVal,oVal,opts) {
						if(nVal.udType == 'user') {
							faxforwardwin.down('#udCardPal').getLayout().setActiveItem(0);
						} else if(nVal.udType == 'dic') {
							faxforwardwin.down('#udCardPal').getLayout().setActiveItem(1);
							var tree = faxforwardwin.down('#dirSrcTree');
							if(!tree.loaded){
								tree.getStore().loadTree();
								tree.loaded = true;
							}
							
						}
					}
				},
				items: [{
					boxLabel: '用户',
					itemId:'rdUser',
					name: 'udType',
					inputValue: 'user',
					checked: true
				},{
					boxLabel: '共享文件夹',
					itemId:'rdDic',
					name: 'udType',
					inputValue: 'dic'
				}]
			},{
				xtype:'panel',
				itemId:'udCardPal',
				layout:'card',
				border:false,
				items:[{
					xtype:'panel',
					border:false,
					items:[{
						colspan : 3,
						width: 480,
						labelAlign: 'right',
						fieldLabel: '组织目录',
						itemId: 'orgFolderID',
						xtype: 'triggerfield',
						value: '全部',
						onTriggerClick: function () {
							var me = this;
							var treeWinObj = {
								treeLoading: orgniTreeLoading,
								curTreeWin: orgniTreeWin,
								winWidth: 360
							};
							triggleFun(me, 'orgnizTreeStoreID', function(store,records,models) {
								if(!models || models.length<=0)
									return;
								Ext.Array.each(models, function(item,index,alls) {
									if(item.data.id == 0) {
										item.data.text = '全部';
									} else if(item.data.id == WaveFaxConst.PublicRootFolderID) {
										item.data.text = '组织根目录';
									}
								});
							}, function(store) {
								var extParam = store.getProxy().extraParams;
								extParam.isOrgniz = true;
								extParam.need = true;
								extParam.sessiontoken = Ext.util.Cookies.get("sessiontoken");
							}, treeWinObj, 'userID', function() {
								orgniTreeWin = treeWinObj.curTreeWin;
								orgniTreeLoading = treeWinObj.treeLoading;
							});
						}
					},{
						width: 480,
						height: 330,
						itemId: 'userID',
						xtype: 'usergrid',
						border: true,
						preventHeader: true,
						listeners: {
							selectionchange: function(sm, selected) {
								if(faxforwardwin.isDocSearch && faxforwardwin.isDocSearch.length > 0) {
									if(selected.length > 1) {
										for(var p in selected) {
											if(p == 0) {
												sm.select(selected[p], true);
											} else {
												sm.deselect(selected[0], true);
											}
										}
									}
								}
							},
							itemdblclick: function(view,record,item,index,e,opts) {
								var me = this;
								var w = me.up('window');
								if(faxforwardwin.isDocSearch && faxforwardwin.isDocSearch.length > 0 && faxforwardwin.isDocSearch.indexOf('WFS_') == -1) {
									if(faxforwardwin.isDocSearch == 'subuserid') {	//委任给他人职责选择用户
										var win = loadSetSubWin();
										win.applyUserid = record.data.userID;
										win.show('', function() {
											win.down('#wfApprovalID').setDisabled(!(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0));
											win.down('#admineID').setDisabled(!(roleInfoModel && roleInfoModel.data.guOrSysAdmin == 0));
											var cmp = win.down('#endTimeID');
											var tmpDf = nowToFuture(1).split(' ');
											var timeDf = tmpDf[1].split(':');
											cmp.dateField.setValue(tmpDf[0]);
											cmp.timeHField.setValue(timeDf[0]);
											cmp.timeMField.setValue(timeDf[1]);
											cmp.timeIField.setValue(timeDf[2]);
										});
									}else { //文档管理查找
										faxforwardwin.docSearchWin.down('#' + faxforwardwin.isDocSearch).setValue(record.data.accountName);
										faxforwardwin.docSearchWin.down('#' + faxforwardwin.isDocSearch + '_hide').setValue(record.data.userID);
									}
									faxforwardwin.hide();
								} else {
									inserTarFromUser(w);
								}
							}
						}
					}]//card -panel items
				},{
					width: 480,
					height: 350,
					itemId: 'dirSrcTree',
					//border:false,
					xtype:'directoryTree',
					listeners: {
						itemdblclick: function(tView,record,item,index,e,opts) {
							var me = this;
							var w = me.up('window');
							inserTarFromDic(w);
						}
					}
				}]//card items
			},{
				xtype:'panel',
				width:60,
				height: 360,
				layout: {
					type:'vbox',
					align:'center'
				},
				border:false,
				//bodyCls: 'panelFormBg',

				defaults: {
					xtype:'button',
					width:50
				},
				items:[{
					xtype:'tbtext',
					text:'<br/><br/><br/><br/>'
				},{
					text:'>',
					tooltip:'移入发送',
					handler: function() {
						var me = this;
						var w = me.up('window');

						var udType = w.down('#rdUdType').getValue();
						if(udType.udType == 'user') {
							inserTarFromUser(w);
						} else if(udType.udType == 'dic') {
							inserTarFromDic(w);
						}

					}
				},{
					xtype:'tbtext',
					text:'<br/><br/>'
				},{
					xtype:'tbtext',
					text:'<br/>'
				},{
					text:'<',
					tooltip:'移出发送',
					handler: function() {
						var me = this;
						var w = me.up('window');

						var grid = w.down('#ugTargetId');
						if(grid.getSelectionModel().hasSelection()) {
							grid.getStore().remove(grid.getSelectionModel().getSelection());
						}
					}
				},{
					xtype:'tbtext',
					text:'<br/>'
				},{
					text:'<<',
					tooltip:'全部移出发送',
					handler: function() {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#ugTargetId');
						grid.getSelectionModel().selectAll();
						grid.getStore().removeAll();

					}
				}]//fieldset items
			},{
				width: 330,
				height: 348,
				itemId: 'ugTargetId',
				xtype: 'userdicTarget',
				border: true,
				listeners: {
					itemdblclick: function(view,record,item,index,e,opts) {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#ugTargetId');
						grid.getStore().remove(record);

					}
				}
			}]//转发到用户或目录 items
		},{
			xtype:'upFilesPal'
		}
		]//tabpanel items
	}

	]//window items
	,
	buttons: [{
		xtype: 'checkbox',
		margin: '0 50 0 0',
		boxLabel: '发送成功后删除传真',
		itemId: 'isDelID'
	},{
		text: '确定',
		itemId: 'submit',
		formBind: true,
		handler: function() {
			var me = this;
			var w = me.up('window');
			if(w.isDocSearch && w.isDocSearch.length > 0) {
				var searchCmp = w.docSearchWin.down('#' + w.isDocSearch);
				var hideCmp = w.docSearchWin.down('#' + w.isDocSearch + '_hide');
				var searchVal = '';
				var hideVal = '';
				//工作流事项查找
				if(w.isDocSearch.indexOf('WFS_') != -1) {
					var sm = w.down('#ugTargetId').getSelectionModel();
					if(w.down('#ugTargetId').getStore().getCount() > 0) {
						sm.selectAll();
					}
					var records = sm.getSelection();
					for (var i=0; i < records.length; i++) {
						if(records[i].get('udType') == 'user') {
							searchVal += (searchVal.length > 0 ? ';' : '') + records[i].get('udName');
							hideVal += (hideVal.length > 0 ? ',' : '') + records[i].get('udID').substring(5,records[i].get('udID').length);
						}
					}
				} else {	
					//文档管理查找
					var userSm = w.down('#userID').getSelectionModel();
					if(userSm.hasSelection()) {
						var record = userSm.getSelection()[0];
						searchVal = record.data.accountName;
						hideVal = record.data.userID;
						if(faxforwardwin.isDocSearch == 'subuserid') {//委任给他人职责选择用户
							var win = loadSetSubWin();
							win.applyUserid = hideVal;
							win.show('', function() {
								win.down('#wfApprovalID').setDisabled(!(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0));
								//是否具有管理员权限
								win.down('#admineID').setDisabled(!(roleInfoModel && roleInfoModel.data.guOrSysAdmin == 0));
								var cmp = win.down('#endTimeID');
								var tmpDf = nowToFuture(1).split(' ');
								var timeDf = tmpDf[1].split(':');
								cmp.dateField.setValue(tmpDf[0]);
								cmp.timeHField.setValue(timeDf[0]);
								cmp.timeMField.setValue(timeDf[1]);
								cmp.timeIField.setValue(timeDf[2]);
							});
							w.hide();
							return;
						}
					}
				}
				if(hideVal.length == 0) {
					return;
				}
				searchCmp.setValue(searchVal);
				hideCmp.setValue(hideVal);
				w.hide();
			} else {
				if(w.down('#ugTargetId').getStore().getCount() > 0) {
					w.down('#ugTargetId').getSelectionModel().selectAll();
				}
				// if(w.down('#dirTarGrid').getStore().getCount() > 0) {
				// w.down('#dirTarGrid').getSelectionModel().selectAll();
				// }

				var sm = w.down('#ugTargetId').getSelectionModel();
				//var dirSm = w.down('#dirTarGrid').getSelectionModel();

				//判断是否是内部转发调用
				if(w.isInForWard) {
					InForward.inforward(me,sm.getSelection());
					//还需要调用转发目录
				} else {//是发送传真窗口调用

					var userIds = new inforwarClass();
					// var ids = Ext.JSON.encode(buildFaxIDs(sm.getSelection(), 'userID'));
					// var dirIds = Ext.JSON.encode(buildFaxIDs(dirSm.getSelection(), 'id'));

					var userIDsArr = new Array();
					var dirIdsArr = new Array();
					var strArr = new Array();
					var str1Arr = new Array();
					Ext.Array.each(sm.getSelection(), function(rec) {
						if(rec.data.udType == 'user') {
							var userid = rec.data.udID.substring(5,rec.data.udID.length);
							userIDsArr.push(userid);
							strArr.push(rec.data.udName);
						} else if(rec.data.udType == 'dic') {
							var did = rec.data.udID.substring(4,rec.data.udID.length);
							dirIdsArr.push(did);
							str1Arr.push(rec.data.udName);
						}
					});
					var userIDS = Ext.JSON.encode(userIDsArr);
					var dirIds = Ext.JSON.encode(dirIdsArr);

					userIds.setUserids(userIDS);
					userIds.setDirectroys(dirIds);

					sendfaxwin.down('#hidFaxIDS').setValue(userIDS);
					sendfaxwin.down('#hidDirIDS').setValue(dirIds);

					var str = strArr.join();
					var str1 = str1Arr.join();

					if(userIDsArr.length > 0 && dirIdsArr.length  > 0) {
						str = str.length>6?str.substring(0,6)+"...":str;
						str1 = str1.length>6?str1.substring(0,6)+"...":str1;
						sendfaxwin.down('#btnFaxInfoward').setText('内部转发     已选择用户:'+userIDsArr.length+'位'+'  '+str+'&nbsp;&nbsp;&nbsp;&nbsp;'+'文件夹:'+dirIdsArr.length+'个'+' '+str1);
					} else if(userIDsArr.length > 0 && dirIdsArr.length == 0) {
						str = str.length>20?str.substring(0,20)+"...":str;
						sendfaxwin.down('#btnFaxInfoward').setText('内部转发     已选择用户:'+userIDsArr.length+'位'+'  '+str);
					} else if(dirIdsArr.length > 0 && userIDsArr.length == 0) {
						str1 = str1.length>20?str1.substring(0,20)+"...":str1;
						sendfaxwin.down('#btnFaxInfoward').setText('内部转发     文件夹:'+dirIdsArr.length+'个'+' '+str1);
					} else if(dirIdsArr.length == 0 && userIDsArr.length == 0) {
						sendfaxwin.down('#btnFaxInfoward').setText('内部转发');
					}

					w.hide();
				}
			}
		}
	},{
		text: '取消',
		itemId:'btnCancel1',
		handler: function() {
			var me = this;
			me.up('window').hide();

		}
	}]
});