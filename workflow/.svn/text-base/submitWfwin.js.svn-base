var wfattwin = ''
var submitwfwin = '';
var subwfpngwin = '';
var subwfpngCom = '';

function wfDuration(timeStr) {

	var hour = parseInt(timeStr/3600);
	if(hour<10) {
		hour = '0'+hour;
	}
	var other = timeStr%3600;
	var minu = parseInt(other/60);
	if(minu<10) {
		minu = '0'+minu;
	}
	var m = hour+':'+minu;
	return m;
}

function getWorkflowActionText(acStr) {
	var str = '';
	var strArr = acStr.split('|');
	Ext.Array.each(strArr, function(item) {
		if(item == 'VIEW_FAX') {
			str += '浏览文档,';
			return;
		} else if(item == 'EDIT_RECIPIENT') {
			str += '填写收件人,';
			return;
		} else if(item == 'EDIT_DOC') {
			str += '编辑文件内容,';
			return;
		} else if(item == 'COMMENT_FAX') {
			str += '设置文档注释,';
			return;
		} else if(item == 'EDITFORM_DOC') {
			str += '录入表单数据,';
			return;
		} else if(item == 'DIGITALSIGN_TPINPUT') {
			str += '同屏录入,';
			return;
		} else if(item.indexOf('STAMP_DOC') != -1) {
			if(str.indexOf('WaveFax签章') == -1) {
				str += 'WaveFax签章,';
			}
			return;
		}
	});
	str = str.substring(0,str.length-1);
	return str;
	//"VIEW_FAX|EDIT_RECIPIENT|EDIT_DOC|STAMP_DOC:999|COMMENT_FAX|EDITFORM_DOC|DIGITALSIGN_TPINPUT"
}

function loadsubwfpngwin(dataList) {
	subwfpngCom = initDrawWf(dataList);
	return Ext.create('Ext.window.Window', {
		title:'工作流任务图',
		modal:true,
		width:500,
		height:400,
		closeAction:'hide',
		maximizable: true,
		autoScroll:true,
		bodyStyle: {
			overflow: '#auto'
		},
		defaults: {
			margin:'5 0 0 10'
		},
		items:[subwfpngCom],
		buttons:[{
			text:'关闭',
			handler: function() {
				var me = this;
				me.up('window').close();
			}
		}]
	});
}

Ext.create('Ext.data.Store', {
	storeId: 'taskFlagStore',
	fields: ['tid', 'tName'],
	data: [{
		'tid': '0',
		'tName': taskFlagArr[0]
	},{
		'tid': '1',
		'tName': taskFlagArr[1]
	},{
		'tid': '2',
		'tName': taskFlagArr[2]
	}
	]
});

Ext.define('WS.workflow.wfSerachmodel', {
	extend: 'Ext.data.Model',
	idProperty: 'workflowRuleID',
	alternateClassName: 'wfSerachmodel',
	fields: [{
		name: 'workflowRuleName',
		type: 'string'
	},{
		name: 'workflowRuleID',
		type: 'string'
	},{
		name:'process',
		type:'string'
	}
	]
});

Ext.create('Ext.data.Store', {
	model:'WS.workflow.wfSerachmodel',
	storeId: 'wfSerachStoreID',
	pageSize: 1000,
	autoLoad: false,
	remoteSort: true,     //排序通过查询数据库
	sorters: [{
		property: 'workflowRuleID',
		direction: 'ASC'
	}],
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			read    : WsConf.Url + '?action=read'
		},
		sortParam:'sort',
		directionParam:'dir',
		simpleSortMode: true,		//单一字段排序
		extraParams: {
			req:'dataset',
			dataname: 'wfrulegrid',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			simple:true,
			listall:true,			
			sessiontoken: getSessionToken()
		},
		reader : {
			type : 'json',
			root: 'dataset',
			seccessProperty: 'success',
			messageProperty: 'msg',
			totalProperty: 'total'
		},
		writer : {
			type : 'json',
			writeAllFields : false,
			allowSingle : false
		},
		actionMethods: 'POST'
	}
});

Ext.create('Ext.data.Store', {
	fields: [{
		name: 'itemID',
		type: 'string'
	},{
		name: 'itemName',
		type: 'string'
	},{
		name: 'userList',
		type: 'string'
	},{
		name: 'acType',
		type: 'string'
	},{
		name: 'timeout',
		type: 'string'
	},{
		name: 'sucNext',
		type: 'string'
	},{
		name: 'failNext',
		type: 'string'
	},{
		name: 'toutNext',
		type: 'string'
	}
	],
	storeId: 'subwfgridStore',
	pageSize: 1000,
	autoLoad: false,
	remoteSort: true,     //排序通过查询数据库
	sorters: [{
		property: 'itemID',
		direction: 'ASC'
	}],
	autoSync: false,
	proxy: {
		type: 'ajax',
		api: {
			read    : WsConf.Url + '?action=read'
		},
		sortParam:'sort',
		directionParam:'dir',
		simpleSortMode: true,		//单一字段排序
		extraParams: {
			req:'dataset',
			dataname: 'subwfgrid',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			ruleid:'',
			sessiontoken: getSessionToken()
		},
		reader : {
			type : 'json',
			root: 'dataset',
			seccessProperty: 'success',
			messageProperty: 'msg',
			totalProperty: 'total'
		},
		writer : {
			type : 'json',
			writeAllFields : false,
			allowSingle : false
		},
		actionMethods: 'POST'
	}
});

Ext.define('WS.workflow.subWfGrid', {
	alternateClassName: ['subWfGrid'],
	alias: 'widget.subWfGrid',
	extend: 'Ext.grid.Panel',
	store: 'subwfgridStore',
	title:'任务流程步骤',
	viewConfig: {
		loadingText:'正在加载数据...'
	},
	columns: [{
		text: '名称',
		flex:1,
		dataIndex: 'itemName'
	},{
		text: '执行者',
		flex:2,
		dataIndex: 'userList',
		renderer: function(value, metaData, record) {
			var userList = Ext.JSON.decode(value);
			var usersFText = '';
			Ext.Array.each(userList, function(name) {
				usersFText+=name+',';
			});
			usersFText = usersFText.replace('@tijiaoren@','任务发起人');
			usersFText = usersFText.substring(0,usersFText.length-1);
			return 	usersFText;
		}
	},{
		text: '操作类型',
		flex:2,
		dataIndex: 'acType',
		renderer: function(value, metaData, record) {
			return getWorkflowActionText(value);
		}
	},{
		text: '超时时限',
		flex:0.8,
		dataIndex: 'timeout',
		renderer: function(value, metaData, record) {
			return wfDuration(value);
		}
	}
	],
	listeners: {
		itemmouseenter: function(me, record, item) {
			item.style.cursor = 'pointer';
		},
		itemmouseleave: function(me, record, item) {
			item.style.cursor = 'auto';
		}
	}

});

function updatesubWfGridRecord(value,meta,record) {
	if(value == '0') {
		return '流程中的下一个步骤';
	} else if(value == '-1') {
		return '结束流程';
	} else if(value == '-2') {
		return '流程中的起始步骤';
	}
	return value;
}
//*@param record 启动工作流时传入的记录
// * @param issendpage 是否是单独的传真发送页面sendfax.html
// * @param faxpageid 使用的传真纸id
// */
function loadsubmitwfwin(record,issendpage,faxpaperid) {

	return Ext.create('Ext.window.Window', {
		modal:true,
		title:'使用工作流',
		width:600,
		height:450,
		fileId:'',
		fileids:'',
		faxids:'',
		subtype:'',
		closable:false,
		tools: [{
			type: 'close',
			handler: function() {
				var me = this;
				if(submitwfwin.issendfaxwin) {
					showFlash(sendfaxwin);
				}
				me.up('window').close();
			}
		}],
		resizable:false,
		layout: {
			type:'table',
			columns:2
		},
		defaults: {
			labelWidth:130,
			margin:'8 0 0 10',
			labelAlign:'right'
		},
		listeners: {
			show: function (win, opts) {
				//调用call
				var param1 = {};
				param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

				WsCall.call('delappslave', param1, function (response, opts) {
				}, function (response, opts) {
				}, false);
			},
			destroy: function(com) {
				submitwfwin = '';
				if(wfattwin != '') {
					wfattwin.destroy();
					wfattwin = '';
				}				
			},
			beforedestroy:function(){
				if(submitwfwin.issendfaxwin) {
					showFlash(sendfaxwin);
				}
			}
		},
		items:[{
			xtype:'container',
			layout:'hbox',
			width:400,
			items:[{
				xtype:'checkbox',
				itemId:'cbtimeStar',
				boxLabel:'定时启动',
				listeners: {
					change: function(cb,nVal) {
						var me = this;
						if(nVal) {
							me.up('window').down('datetimefield').setDisabled(false);
						} else {
							me.up('window').down('datetimefield').setDisabled(true);
						}
					}
				}
			},{
				xtype:'datetimefield',
				margin:'0 0 0 5',
				disabled:true,
				width:300,
				itemId:'timeStar',
				mySqlType:'datetime',
				timeHCfg: {
					value:new Date().getHours()
				},
				timeMCfg: {
					value:new Date().getMinutes()
				},
				timeICfg: {
					value:new Date().getSeconds()
				},
				value:new Date()
			}]
		},{
			xtype:'button',
			text:'添加附件',
			handler: function() {
				if(wfattwin == '') {
					if(isSurportFlash) {
						slaveFilesQueueCol.clear();
						slaveFilesUpedCol.clear();
					} else {
						slaveFilesQueueCol.clear();
					}
					wfattwin = loadwfattwin();

					wfattwin.show(null, function() {
						//调用call
						var param1 = {};
						param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

						WsCall.call('delappslave', param1, function (response, opts) {
						}, function (response, opts) {
						}, false);
						if(isSurportFlash) {
							//docattwin.down('');
						} else {
							wfattwin.down('#fsFiles').removeAll();
							wfattwin.down('#fsFiles').add({
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
					wfattwin.show();
				}
			}
		},{
			xtype:'textarea',
			width:570,
			colspan:2,
			rows:2,
			itemId:'comment',
			fieldLabel:'任务主题'
		},{				
			xtype:'combo',
			store:'taskFlagStore',	
			itemId:'cbWfTaskFlag',	
			fieldLabel:'任务标志',
			colspan:2,
			width:300,
			editable:false,
			displayField: 'tName',
			valueField: 'tid',
			queryMode : 'local',
			value:'0'
		},{
			xtype:'combo',
			fieldLabel:'选择任务规则类别',
			itemId:'cbWfRule',
			width:300,
			store: 'wfSerachStoreID',
			editable:false,
			displayField: 'workflowRuleName',
			valueField: 'workflowRuleID',
			queryMode : 'local',
			listeners: {
				afterrender: function(com) {
					com.getStore().getProxy().extraParams.sessiontoken = getSessionToken();
					com.getStore().getProxy().extraParams.simple = false;
					com.getStore().getProxy().extraParams.listall =  false;
					com.getStore().load( function(records, operation, success) {
						if(success && records.length > 0) {
							if(record) {
								com.setValue(record.data.workflowRuleID);
							} else {
								com.setValue(records[0].data.workflowRuleID);
							}
							com.up('window').down('#btnWfPng').setDisabled(false);
						}
					});
					com.getStore().getProxy().extraParams.simple = true;
					com.getStore().getProxy().extraParams.listall =  true;
				},
				change: function(com,nVal,oVal,opts) {
					var sotre = com.up('window').down('subWfGrid').getStore();
					sotre.getProxy().extraParams.ruleid = nVal;
					sotre.getProxy().extraParams.sessiontoken = getSessionToken();
					com.getStore().getProxy().extraParams.simple = false;
					com.getStore().getProxy().extraParams.listall =  false;
					sotre.load();
					com.getStore().getProxy().extraParams.simple = true;
					com.getStore().getProxy().extraParams.listall =  true;
					if(subwfpngwin != '') {
						subwfpngwin.destroy();
						subwfpngwin = '';
					}
				}
			}
		},{
			xtype:'button',
			itemId:'btnWfPng',
			disabled:true,
			text:'工作流任务图',
			handler: function() {
				var me = this;
				var win = me.up('window');
				var cb = win.down('#cbWfRule');
				var record = cb.getStore().getById(cb.getValue());
				if(subwfpngwin == '') {
					subwfpngwin = loadsubwfpngwin(record.data.process);
				}
				subwfpngwin.show();
			}
		},{
			xtype:'subWfGrid',
			width:570,
			height:230,
			autoScroll:true,
			colspan:2
		}],
		buttons:[{
			text:'确定',
			handler: function() {
				var me = this;
				if(submitwfwin.fileId != '' || submitwfwin.faxids != '') {
					//alert(submitwfwin.fileId);
					function submitWorkFlow(type) {
						var param = {};
						param.fileId = submitwfwin.fileId;
						if(submitwfwin.down('#cbtimeStar').getValue()) {
							param.timeStar = submitwfwin.down('#timeStar').getValue();
						} else {
							param.timeStar = '';
						}

						param.comment = submitwfwin.down('#comment').getValue();
						var ruleid = submitwfwin.down('#cbWfRule').getValue();
						if(ruleid == null) {
							Ext.Msg.alert('消息', '请选择一个任务规则！');
							return;
						}
						param.ruleid = ruleid;
						param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
						param.taskflag = submitwfwin.down('#cbWfTaskFlag').getValue();

						var callName ='';
						if(type== 0) {
							callName = 'submitFaxSend';
							var faxNumber = sendfaxwin.down('#faxNumber').getValue();
							if(faxNumber != '') {
								var linkmanClass = {
									faxNumber:faxNumber,
									subNumber:sendfaxwin.down('#subNumber').getValue(),
									faxReceiver:sendfaxwin.down('#faxReceiver').getValue(),
									email:sendfaxwin.down('#e-mail').getValue(),
									mobile:sendfaxwin.down('#mobile').getValue(),
									organization:sendfaxwin.down('#organization').getValue()
								};
								LinkMenArr.push(linkmanClass);
							}
							param.faxSubject = sendfaxwin.down('#faxSubject').getValue();
							param.linkmen = Ext.JSON.encode(LinkMenArr);
							param.userIDs = sendfaxwin.down('#hidFaxIDS').getValue();
							param.dirIDs = sendfaxwin.down('#hidDirIDS').getValue();
							param.tplid = sendfaxwin.tplid;
							param.tplstr = sendfaxwin.tplstr;							
						} else {
							callName = 'submitworkflow';
							param.faxids =  submitwfwin.faxids.join();
							//param.fileids =  submitwfwin.fileids;
							param.subtype = submitwfwin.subtype;
						}
						if(faxpaperid){
							param.faxpaperid = faxpaperid;
						}
						//调用
						WsCall.call(callName, param, function (response, opts) {
							Ext.Msg.alert('成功', '提交任务成功！');

							me.up('window').close();
							if(issendpage) {//发送页面
								var msgDiv = Ext.get('Message');
								msgDiv.show();

								var sendDiv = Ext.get('sendfaxwin');
								sendDiv.hide();

								LinkMenArr = new Array();
								draftIDsArr = new Array();
								if (sendfaxwin != '') {
									var param1 = {};
									param1.fileId = sendfaxwin.down('#hidFileId').getValue();
									param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
									sendfaxwin.isSend = true;
									//sendfaxwin.hide();
									sendfaxwin.fireEvent('beforehide',sendfaxwin);
									//sendfaxwin = '';
									//刷新草稿箱
									if(currGrid&&currGrid.itemId.toLowerCase() == 'draftgrid') {
										currGrid.loadGrid();
									}
									//调用
									WsCall.call('deleteTempFiles', param1, function (response, opts) {

									}, function (response, opts) {
										//Ext.Msg.alert('失败', response.msg);
									}, true);
									showFlash(sendfaxwin);
								}
							} else {
								if(type== 0) {
									LinkMenArr = new Array();
									draftIDsArr = new Array();
									if (sendfaxwin != '') {
										var param1 = {};
										param1.fileId = sendfaxwin.down('#hidFileId').getValue();
										param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
										sendfaxwin.isSend = true;
										sendfaxwin.hide();
										//刷新草稿箱
										if(currGrid&&currGrid.itemId.toLowerCase() == 'draftgrid') {
											currGrid.loadGrid();
										}
										//调用
										WsCall.call('deleteTempFiles', param1, function (response, opts) {

										}, function (response, opts) {
											//Ext.Msg.alert('失败', response.msg);
										}, true);
									}
								} else {

								}
							}
						}, function (response, opts) {
							LinkMenArr = new Array();
							if(!errorProcess(response.code)) {
								Ext.Msg.alert('失败', response.msg);
							}
							//Ext.Msg.alert('失败', response.msg);
						}, true,'请稍候...',submitwfwin,1);
					}

					if(submitwfwin.issendfaxwin) {
						//判断 提交 附件信息
						slaveUplPro(wfattwin,faxpaperCover(sendfaxwin,function(){
							submitWorkFlow(0);
						}));
					} else {
						//判断 提交 附件信息
						slaveUplPro(wfattwin,submitWorkFlow(1));
					}
				} else {
					Ext.Msg.alert('消息','请添加至少1个文件');
					me.up('window').close();
				}

			}
		},{
			text:'取消',
			handler: function() {
				var me = this;				
				me.up('window').close();

			}
		}]
	});
}

function loadwfattwin() {
	return Ext.create('Ext.window.Window', {
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
				if(!wfattwin.isuploading) {
					wfattwin.close();
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
				//showFlash(docaddwin);
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