﻿//文件上传function
// function UpLoadFile(win,type) {
// var hidUpFileType = win.down('#UpFileType');
// hidUpFileType.setValue(type);
// var btnFile = win.down('#filePath');
// var children = btnFile.button.getEl().dom.children;
// Ext.Array.each(children, function (item, index, allItems) {
// if (item.type=="file") {
// item.click();
// return;
// };
// });
// }

Ext.define('WS.infax.faxpapermodel', {
	extend: 'Ext.data.Model',
	idProperty: 'fpId',
	alternateClassName: 'faxpapermodel',
	fields: [{
		name: 'fpId',
		type: 'string'
	},{
		name: 'fpName',
		type: 'string'
	},{
		name:'hasCover',
		type:'boolean'
	}
	]
});

Ext.create('Ext.data.Store', {
	model:'WS.infax.faxpapermodel',
	storeId: 'faxpaperStoreID',
	pageSize: 1000,
	autoLoad: false,
	remoteSort: true,     //排序通过查询数据库
	sorters: [{
		property: 'fpId',
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
			dataname: 'faxpaper',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			sessiontoken: ''
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

//iframe 用成功上传
function iframeFileUp(data,winType) {

	var fid = data;
	var hidForm = winType.down('#hidFileId');
	var maskTarget = winType.down('#filePath').up('form');
	var hidForm = winType.down('#hidFileId');
	var hidLoaded = winType.down('#hidLoaded');
	var hidUpFileType = winType.down('#UpFileType');
	//向后，向前插入
	var upfiletype = hidUpFileType.getValue();
	var fileId = hidForm.getValue();
	alert(fileId);
	hidForm.setValue(fid);
	//alert(hidForm.getValue());
	//Ext.Msg.alert('上传信息', '处理完成');
	var progressBar = winType.down('#bottomProgressBar');
	var btnCancel = winType.down('#btnCancel');
	var btnContinue = winType.down('#btnContinue');
	btnCancel.hide();
	btnContinue.hide();
	//btnCancel.setDisabled(false);
	var tmpCurPage = 1;
	if(fileId == '') {
		winType.pngClass = new filepngviewclass({
			myTargetView:winType
		});
	} else {
		winType.pngClass.setIsLoaded(0);
		tmpCurPage = winType.pngClass.miniCurPage;
		if(winType.pngClass.miniCurPage == winType.pngClass.miniTotalPage) {
			winType.pngClass.ifLoading = 1;
			var palPngContainer = winType.down('#filepngviewMini');
			palPngContainer.removeAll();
		}
	}

	winType.pngClass.setFaxFileId(fid);
	//初始化图片浏览panel
	hidLoaded.setValue('1');
	winType.pngClass.initMyfilepngMini(maskTarget, hidLoaded,upfiletype,fileId, function() {

		setPngMiniWH(sendfaxwin.pngClass,sendfaxwin,'');

		var fpa = winType.down('#filePath');
		fpa.reset();
		//me.up('window').down('#filepngviewMini').doLayout();
		//me.up('window').down('#panelfilepngview').doLayout();
	},true,'正在生成传真图...',winType.getEl(),10,tmpCurPage);
	//设置前后插入等按钮状态
	ActionBase.updateActions('acsendfaxwin', hidForm.getValue());

	if(hidForm.getValue() == '') {
		winType.down('#txtMiniCurrPage').setDisabled(true);
	} else {
		winType.down('#txtMiniCurrPage').setDisabled(false);
	}
}

Ext.create('Ext.data.Store', {
	storeId: 'languageStore',
	fields: ['lid', 'lName'],
	data: [{
		'lid': '0',
		'lName': languageArr[0]
	},{
		'lid': '1',
		'lName': languageArr[1]
	}
	]
});

Ext.create('Ext.data.Store', {
	storeId: 'prioritySwinID',
	fields: ['priorityId', 'priorityName'],
	data: [{
		'priorityId': '0',
		'priorityName': priorityArr[0]
	},{
		'priorityId': '1',
		'priorityName': priorityArr[1]
	},{
		'priorityId': '2',
		'priorityName': priorityArr[2]
	},{
		'priorityId': '3',
		'priorityName': priorityArr[3]
	},{
		'priorityId': '4',
		'priorityName': priorityArr[4]
	}
	]
});

//sendfaxwin 的位置记录
var sendfaxwinPosition = {
	oldX:'',
	oldY:'',
	oldWidh:''
}

var draftIDsArr = new Array();
//draftgrid action 内部 用直接发送传真
function moniSendForWard(sm) {
	var records = sm.getSelection();
	draftIDsArr = new Array();
	var param = {};
	LinkMenArr = new Array();

	param.linkmen = Ext.JSON.encode(LinkMenArr);
	param.faxSubject = records[0].data.subject;
	param.fileId = records[0].data.faxFileID;
	param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

	param.userIDs = records[0].data.users;
	param.dirIDs = records[0].data.dirs;
	draftIDsArr.push(records[0].data.draftID);
	param.draftIDs = Ext.JSON.encode(draftIDsArr);
	//param.req = 'call';

	//调用
	WsCall.call('submitFaxSend', param, function (response, opts) {
		Ext.Msg.alert('成功', '提交传真成功！');
		draftIDsArr = new Array();
		LinkMenArr = new Array();

		var param1 = {};
		param1.fileId =records[0].data.faxFileID;
		param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
		//调用
		// WsCall.call('deleteTempFiles', param1, function (response, opts) {
		//
		// }, function (response, opts) {
		// //Ext.Msg.alert('失败', response.msg);
		// }, true);
	}, function (response, opts) {
		if(!errorProcess(response.code)) {
			Ext.Msg.alert('失败', response.msg);
		}

	});
}

//draftgrid action  直接发送传真
function moniSendAll(emptyCount) {
	//var records = sm.getSelection();
	var param = {};

	draftMaps.each( function(map,index,maps) {
		draftIDsArr = new Array();
		param = {};
		LinkMenArr = new Array();//外部联系人
		var userIdArr = new Array();//内部转发用户
		var dirIdArr = new Array();//内部转发目录

		map.each( function(rec,index,allRec) {
			var recData = rec.data;
			draftIDsArr.push(recData.draftID);

			if(recData.faxNumber != '') {
				//alert('外部草稿');
				var linkmanClass = {
					faxNumber:recData.faxNumber,
					subNumber:recData.faxNumberExt,
					faxReceiver:recData.recipient,
					email:"",
					mobile:"",
					organization:""
				};
				LinkMenArr.push(linkmanClass);

			}
			if(recData.users != '') {
				//alert('内部草稿-转发用户');
				var tempUIDs = recData.users.split(',');
				Ext.Array.each(tempUIDs, function(id,index,ids) {
					userIdArr.push(id);
				});
			}
			if(recData.dirs != '') {
				//alert('内部草稿-转发目录');
				var tempDIDs = recData.users.split(',');
				Ext.Array.each(tempDIDs, function(id,index,ids) {
					dirIdArr.push(id);
				});
			}

		});
		//alert(Ext.JSON.encode(LinkMenArr));
		//alert(Ext.JSON.encode(userIdArr));
		//alert(Ext.JSON.encode(dirIdArr));
		//alert(Ext.JSON.encode(draftIDsArr));

		//加载param数据
		param.linkmen = Ext.JSON.encode(LinkMenArr);
		param.faxSubject = map.getAt(0).data.subject;
		param.fileId = map.getAt(0).data.faxFileID;
		param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

		param.userIDs =Ext.JSON.encode(userIdArr);
		param.dirIDs = Ext.JSON.encode(dirIdArr);
		param.draftIDs = Ext.JSON.encode(draftIDsArr);
		//param.req = 'call';

		//alert(Ext.JSON.encode(param));
		//调用
		WsCall.call('submitFaxSend', param, function (response, opts) {
			LinkMenArr = new Array();
			draftIDsArr = new Array();
			map.each( function(rec,index,allRec) {
				//刷新对应的Grid
				var tbStore = draftGrid.getStore();
				tbStore.remove(rec);
			});
			if(emptyCount > 0 && index == (draftMaps.getCount()-1)) {
				Ext.Msg.alert('提示', '本次发送有'+emptyCount+'条无收件人信息的草稿未能发送，请单独选中补齐信息后发送传真！');
			} else if(emptyCount == 0 && index == (draftMaps.getCount()-1)) {
				Ext.Msg.alert('成功', '提交传真成功！');
			}
		}, function (response, opts) {
			Ext.Msg.alert('失败', response.msg);
		});
	});
	//刷新
	//draftGrid.getStore().load();
}

function sendFaxForward(fileId) {

	var maskTarget = sendfaxwin.down('#formFileId');
	var hidForm = sendfaxwin.down('#hidFileId');
	var hidLoaded = sendfaxwin.down('#hidLoaded');
	hidForm.setValue(fileId);

	var progressBar = sendfaxwin.getComponent('bottomStatusBar').getComponent('bottomProgressBar');
	var btnCancel = sendfaxwin.getComponent('bottomStatusBar').getComponent('btnCancel');
	var btnContinue = sendfaxwin.getComponent('bottomStatusBar').getComponent('btnContinue');
	btnCancel.hide();
	btnContinue.hide();
	//btnCancel.setDisabled(false);
	sendfaxwin.pngClass = new filepngviewclass();
	sendfaxwin.down('#filePath').setValue(fileId);
	sendfaxwin.pngClass.setFaxFileId(fileId);
	//初始化图片浏览panel
	hidLoaded.setValue('1');
	sendfaxwin.pngClass.initMyfilepngMini(maskTarget, hidLoaded,0,fileId, function() {
		setPngMiniWH(sendfaxwin.pngClass,sendfaxwin,'');
	});
	//设置前后插入等按钮状态
	ActionBase.updateActions('acsendfaxwin', hidForm.getValue());

	//}, function() {

	//},true,'正在转换...',sendfaxwin.getEl(),10);
}

//发送选项用window
function loadsendfaxconfigwin() {
	return Ext.create('Ext.window.Window', {
		title: '发送选项',
		iconCls:'config',
		height: 330,
		width: 500,
		modal: true,
		resizable: false,
		layout: 'auto',
		collapsible: false,
		//		frame: false,
		border: false,
		closable:false,
		tools: [{
			type: 'close',
			handler: function() {
				if (sendfaxconfigwin) {
					sendfaxconfigwin.hide();
				}

			}
		}],
		defaults: {
			xtype: 'form',
			////bodyCls: 'panelFormBg',
			frame: false,
			border: false,
			margin: '5 5 0 5'
		},
		items: [{
			defaults: {
				xtype: 'fieldset',
				frame: false,
				//				border: false,
				margin: '10 0 0 0'
			},
			items: [{
				xtype: 'checkbox',
				name: 'detailSend',
				itemId:'detailSend',
				width: 300,
				boxLabel: '提交到服务器后暂不发送'
				//				checked:userConfig.scDetailSend
			},{
				title: '传真发送参数',
				layout: {
					type: 'table',
					columns: 2
				},
				padding:'0 10 10 10',
				defaults: {
					xtype: 'checkbox',
					labelAlign: 'right',
					labelWidth: 120,
					width: 220,
					//frame: false,
					border: false,
					margin: '3 0 0 20'
				},
				items: [{
					fieldLabel: '优先级',
					editable: false,
					xtype: 'combo',
					name: 'proLever',
					itemId:'proLever',
					value: userConfig.scProLever,
					store: 'prioritySwinID',
					queryMode: 'local',
					displayField: 'priorityName',
					valueField: 'priorityId'
				},{
					name: 'mesReciver',
					itemId:'mesReciver',
					boxLabel: '短信通知收件人',
					checked:userConfig.scMesReciver
				},{
					xtype: 'numberfield',
					name: 'failCount',
					itemId:'failCount',
					fieldLabel: '失败重试次数',
					maxText: '重试次数最大为10',
					minText: '重试次数最小为1',
					value: userConfig.scFailCount,
					minValue: 1,
					maxValue: 10,
					allowBlank: false
				},{
					name: 'mailReciver',
					itemId:'mailReciver',
					boxLabel: '邮件通知收件人',
					checked:userConfig.scMailReciver
				},{
					name: 'stepMin',
					itemId:'stepMin',
					fieldLabel: '重试间隔(秒)',
					xtype: 'numberfield',
					maxText: '重试次数最大为300',
					minText: '重试次数最小为0',
					value: userConfig.scStepMin,
					minValue: 0,
					maxValue: 300,
					allowBlank: false
				},{
					name: 'pageHeader',
					itemId:'pageHeader',
					checked: userConfig.scPageHeader,
					boxLabel: '添加页眉'
				},{
					name: 'tryFist',
					itemId:'tryFist',
					boxLabel: '失败重试从第一页开始',
					checked: userConfig.scTryFist,
					colspan: 2,
					margin: '0 0 0 260'
				},{
					name: 'resolution',
					itemId:'resolution',
					boxLabel: '使用200x200分辨率发送传真',
					checked: userConfig.scResolution,
					colspan: 2,
					margin: '0 0 0 260'
				},{
					xtype: 'button',
					text: '保存为默认',
					handler: function () {
						var myForm = this.up('form');
						var form = this.up('form').getForm();
						if (form.isValid()) {
							form.submit({
								url: WsConf.Url + "?req=call&callname=setdefaultconfig&sessiontoken="+ Ext.util.Cookies.get("sessiontoken") + "",
								success: function (form, action) {
									Ext.Msg.alert('成功', '保存成功');
									userConfig.scDetailSend = myForm.down('#detailSend').getValue();//发送选项—提交到服务器暂不发送
									userConfig.scProLever=myForm.down('#proLever').getValue();//发送选项—优先级
									userConfig.scFailCount=myForm.down('#failCount').getValue();//发送选项—失败重试次数
									userConfig.scStepMin=myForm.down('#stepMin').getValue();//发送选项—重试间隔 秒
									userConfig.scMesReciver=myForm.down('#mesReciver').getValue();//发送选项—短信通知收件人
									userConfig.scMailReciver=myForm.down('#mailReciver').getValue();//发送选项—邮件通知收件人
									userConfig.scPageHeader=myForm.down('#pageHeader').getValue();//发送选项—添加页眉
									userConfig.scTryFist=myForm.down('#tryFist').getValue();//发送选项—失败重试从第一页开始
									userConfig.scResolution=myForm.down('#resolution').getValue();//发送选项—使用200x200分辨率发送传真
									userConfig.scUsedGroupPort=myForm.down('#usedGroupPort').getValue();//发送选项—使用群发端口
								},
								failure: function (form, action) {
									Ext.Msg.alert('失败', action.result.msg);
								}
							});
						}
					}
				},{
					name: 'usedGroupPort',
					itemId:'usedGroupPort',
					boxLabel: '使用群发端口',
					checked:userConfig.scUsedGroupPort
				}]
			},{
				padding:'8 10 6 10',
				itemId:'fsSendTime',
				margin: '10 0 0 0',
				layout: {
					type: 'table',
					columns: 8
				},
				defaults: {
					xtype: 'numberfield',
					margin: '2 0 0 5'
				},
				items: [{
					xtype: 'checkbox',
					itemId:'ifSetSendTime',
					name: 'setSendTime',
					width: 100,
					boxLabel: '定制发送时间',
					listeners: {
						change: function (cb, nValue, oValue, opts) {
							if (cb.getValue()) {
								Ext.Array.each(cb.up('fieldset').query('numberfield'), function (item, index, allItems) {
									item.setDisabled(false);
								});
								cb.up('fieldset').down('datefield').setDisabled(false);
							} else {
								Ext.Array.each(cb.up('fieldset').query('numberfield'), function (item, index, allItems) {
									item.setDisabled(true);
								});
								cb.up('fieldset').down('datefield').setDisabled(true);
							}
						}
					}
				},{
					xtype: 'datefield',
					itemId:'sendDate',
					name: 'sendDate',
					format: 'Y-m-d',
					disabled: true,
					submitValue:false,
					value: new Date(),
					width: 100,
					minValue: new Date(),
					minText: '发送时间不能小于当前时间'
				},{
					name: 'sendTimeHouer',
					itemId:'sendTimeHouer',
					xtype: 'numberfield',
					maxText: '最大为23',
					minText: '最小为0',
					disabled: true,
					submitValue:false,
					value: (new Date()).getHours(),
					width: 48,
					minValue: 0,
					maxValue: 23,
					allowBlank: false
				},{
					xtype: 'displayfield',
					value: '时'
				},{
					name: 'sendTimeMin',
					itemId:'sendTimeMin',
					xtype: 'numberfield',
					maxText: '最大为60',
					minText: '最小为0',
					disabled: true,
					submitValue:false,
					value: (new Date()).getMinutes(),
					width: 48,
					minValue: 0,
					maxValue: 60,
					allowBlank: false
				},{
					xtype: 'displayfield',
					value: '分'
				},{
					name: 'sendTimeSec',
					itemId:'sendTimeSec',
					xtype: 'numberfield',
					maxText: '最大为60',
					minText: '最小为0',
					disabled: true,
					submitValue:false,
					value: (new Date()).getSeconds(),
					width: 48,
					minValue: 0,
					maxValue: 60,
					allowBlank: false
				},{
					xtype: 'displayfield',
					value: '秒'
				},{
					xtype:'hidden',
					itemId:'sendUTCTime',
					name:'sendUTCTime',
					value:''
				}]
			},{
				xtype: 'panel',
				frame: false,
				border: false,
				////bodyCls: 'panelFormBg',
				margin: '10 0 2 0',
				height:35,
				layout: {
					type: 'table',
					columns:2
				},
				defaults: {
					width: 80,
					frame: false,
					border: false,
					margin: '0 0 0 10'
				},
				items: [{
					margin: '0 0 0 310',
					xtype: 'button',
					text: '确定',
					handler: function () {
						var myForm = this.up('form');

						if(myForm.down('#ifSetSendTime').getValue()) {
							var hid_sendUTCTime = myForm.down('#sendUTCTime');
							var date = Ext.util.Format.date(myForm.down('#sendDate').getValue(), 'm/d/Y');
							var strTime = date +" "+myForm.down('#sendTimeHouer').getValue()+":"+myForm.down('#sendTimeMin').getValue()+":"+myForm.down('#sendTimeSec').getValue();
							hid_sendUTCTime.setValue(LocalDateToLongUTCstr(new Date(Date.parse(strTime))));
						}

						var form = this.up('form').getForm();
						if (form.isValid()) {

							form.submit({
								url: WsConf.Url + "?req=call&callname=setsendfaxconfig&sessiontoken="+ Ext.util.Cookies.get("sessiontoken") + "",
								success: function (form, action) {
									//Ext.Msg.alert('成功', '成功');
									if (sendfaxconfigwin) {
										sendfaxconfigwin.hide();
									}
								},
								failure: function (form, action) {
									Ext.Msg.alert('失败', action.result.msg);
								}
							});
						}

					}
				},{
					xtype: 'button',
					text: '取消',
					handler: function () {
						if (sendfaxconfigwin) {
							sendfaxconfigwin.hide();
						}
					}
				}]
			}]

		}],
		listeners: {
			destroy: function () {
				sendfaxconfigwin = '';
				showFlash(sendfaxwin);
			},
			hide: function() {
				showFlash(sendfaxwin);
			}
		}
	}).show();

}

//发送传真缩略图Panel
Ext.define('ws.viewFax.palSendFaxFileTabPngMini', {
	alias: 'widget.palSendFaxFileTabPngMini',
	extend: 'Ext.Panel',
	alternateClassName: ['palSendFaxFileTabPngMini'],
	itemId: 'palSendFaxFileTabPngMini',
	frame: true,
	layout: {
		type: 'auto'
	},
	autoScroll: true,
	defaults: {
		xtype: 'image',
		width: 100,
		height: 100,
		frame: false,
		border: false,
		margin: '2 5 5 5',
		style: {
			'float': 'left'
		}
	}
});

//发送传真的工具栏 tb
Ext.define('ws.viewFax.tbSendFax', {
	alias: 'widget.tbSendFax',
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: ['tbSendFax'],
	itemId: 'tbSendFax',
	defaults: {
		text : 'Medium',
		scale:'medium',
		height:32
	},
	items: [{
		xtype: 'button',
		text: '提交发送',
		itemId: 'submitSend',
		iconCls: 'submitSend',
		handler: function () {
			var me = this;
			var form1 = this.up('window').down('#formFaxSubFile').getForm();
			var form2 = this.up('window').down('#formFaxInfo').getForm();
			var fxNum = me.up('window').down('#faxNumber');
			var form3 = this.up('window').down('#formFileId').getForm();
			var inforward = this.up('window').down('#hidFaxIDS').getValue();
			var dirIds = this.up('window').down('#hidDirIDS').getValue();

			if (this.up('window').down('#hidLoaded').getValue() == "1") {
				Ext.Msg.alert('请等待', '传真文件正在转换，请稍后再发送！');
				return;
			}

			if (!form1.isValid()) {
				return;
			}
			//内部转发时可不输入传真号码
			//if (!form2.isValid()&& inforward =="[]" && dirIds == "[]" && LinkMenArr.length <=0) {
			//	return;
			//	}

			if (inforward =="[]" && dirIds == "[]" && LinkMenArr.length <=0) {
				if(!fxNum.isValid()) {
					return;
				}
			}

			if (!form3.isValid()) {
				Ext.Msg.alert('提示','请添加至少1个文件');
				return;
			}
			if(this.up('window').down("#hidFileId").getValue() == "") {
				Ext.Msg.alert('提示','请添加至少1个文件');
				return;
			}
			var faxNumber = this.up('window').down('#faxNumber').getValue();
			var tmpCountryCode,tmpAreaCode;

			if(faxNumber.indexOf('(') != -1) {
				tmpCountryCode = faxNumber.substring(1,faxNumber.indexOf('('));
				tmpAreaCode = faxNumber.substring(faxNumber.indexOf('(')+1,faxNumber.indexOf(')'));
				//判断本地
				if(tmpAreaCode == userConfig.areaCode && roleInfoModel.data.sendLocal != 0) {
					Ext.Msg.alert('提示','无发送本地传真权限');
					return;
				}
				//判断长途
				if(tmpAreaCode != userConfig.areaCode && roleInfoModel.data.sendLdis != 0) {
					Ext.Msg.alert('提示','无发送长途传真权限');
					return;
				}
				//判断国际
				if(tmpCountryCode != userConfig.countryCode && roleInfoModel.data.sendInter != 0) {
					Ext.Msg.alert('提示','无发送国际传真权限');
					return;
				}
				//alert(tmpCountryCode+"%"+tmpAreaCode);
			} else {
				tmpCountryCode = faxNumber.substring(1,faxNumber.indexOf(' '));
				//判断本地
				if(tmpCountryCode == userConfig.countryCode && roleInfoModel.data.sendLocal != 0) {
					Ext.Msg.alert('提示','无发送本地传真权限');
					return;
				}
				//判断国际
				if(tmpCountryCode != userConfig.countryCode && roleInfoModel.data.sendInter != 0) {
					Ext.Msg.alert('提示','无发送国际传真权限');
					return;
				}
				//alert(tmpCountryCode);
			}

			function submitFax1() {
				var param = {};

				// param.faxNumber = faxNumber;
				// param.subNumber = this.up('window').down('#subNumber').getValue();
				// param.faxReceiver = this.up('window').down('#faxReceiver').getValue();
				// param.email = this.up('window').down('#e-mail').getValue();
				// param.mobile = this.up('window').down('#mobile').getValue();
				// param.organization = this.up('window').down('#organization').getValue();
				if(faxNumber != '') {
					var linkmanClass = {
						faxNumber:faxNumber,
						subNumber:me.up('window').down('#subNumber').getValue(),
						faxReceiver:me.up('window').down('#faxReceiver').getValue(),
						email:me.up('window').down('#e-mail').getValue(),
						mobile:me.up('window').down('#mobile').getValue(),
						organization:me.up('window').down('#organization').getValue()
					};
					LinkMenArr.push(linkmanClass);
				}

				param.linkmen = Ext.JSON.encode(LinkMenArr);
				param.faxSubject = me.up('window').down('#faxSubject').getValue();
				param.fileId = me.up('window').down('#hidFileId').getValue();
				param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

				param.userIDs = me.up('window').down('#hidFaxIDS').getValue();
				param.dirIDs = me.up('window').down('#hidDirIDS').getValue();
				if(draftIDsArr && draftIDsArr.length > 0) {
					param.draftIDs =  Ext.JSON.encode(draftIDsArr);
				}

				//param.req = 'call';

				//调用
				WsCall.call('submitFaxSend', param, function (response, opts) {
					//Ext.Msg.alert('成功', '提交传真成功！');
					var msgDiv = Ext.get('Message');
					msgDiv.show();

					var sendDiv = Ext.get('sendfaxwin');
					sendDiv.hide();

					LinkMenArr = new Array();
					draftIDsArr = new Array();
					if (sendfaxwin != '') {
						var param1 = {};
						param1.fileId = me.up('window').down('#hidFileId').getValue();
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
					}

				}, function (response, opts) {
					LinkMenArr = new Array();
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
					//Ext.Msg.alert('失败', response.msg);
				}, true,'请稍候...',sendfaxwin.el,1);
			}

			//判断 提交 附件信息
			//判断 提交 附件信息
			slaveUplPro(faxforwardwin,faxpaperCover(sendfaxwin,submitFax1));
		}
	},'-',{
		xtype:'button',
		text:'提交审批任务',
		disabled:true,
		itemId: 'submitWorkFlow',
		iconCls: 'workFlowTitle',
		handler: function() {
			//先判断是否有fileid  faxnum
			var me = this;
			var wins = me.up('window');
			var form1 = wins.down('#formFaxSubFile').getForm();
			var fxNum = wins.down('#faxNumber');
			var form3 = wins.down('#formFileId').getForm();
			var inforward = wins.down('#hidFaxIDS').getValue();
			var dirIds = wins.down('#hidDirIDS').getValue();

			var store = Ext.data.StoreManager.lookup('wfSerachStoreID');
			store.getProxy().extraParams.sessiontoken = getSessionToken();
			store.getProxy().extraParams.listall = false;
			store.load( function(records, operation, success) {
				if(records.length > 0) {
					if (wins.down('#hidLoaded').getValue() == "1") {
						Ext.Msg.alert('请等待', '传真文件正在转换，请稍后再发送！');
						return;
					}

					if (!form1.isValid()) {
						return;
					}
					//内部转发时可不输入传真号码
					// if (!form2.isValid()&& inforward =="[]" && dirIds == "[]" && LinkMenArr.length <=0) {
					// return;
					// }
					if (inforward =="[]" && dirIds == "[]" && LinkMenArr.length <=0) {
						if(!fxNum.isValid()) {
							return;
						}
					}

					if (!form3.isValid()) {
						Ext.Msg.alert('提示','请添加至少1个文件');
						return;
					}
					var fileId = wins.down("#hidFileId").getValue();
					if(fileId == "") {
						Ext.Msg.alert('提示','请添加至少1个文件');
						return;
					}
					hideFlash(sendfaxwin);
					submitwfwin = loadsubmitwfwin(false,true,sendfaxwin.faxpaperid);
					submitwfwin.fileId = fileId;
					submitwfwin.issendfaxwin = true;
					submitwfwin.show();
				} else {
					Ext.Msg.alert('提示','没有可用的任务规则');
				}
			});
			store.getProxy().extraParams.listall = true;

			if (wins.down('#hidLoaded').getValue() == "1") {
				Ext.Msg.alert('请等待', '传真文件正在转换，请稍后再发送！');
				return;
			}

			// if (!form1.isValid()) {
			// return;
			// }
			//
			// if (inforward =="[]" && dirIds == "[]" && LinkMenArr.length <=0) {
			// if(!fxNum.isValid()) {
			// return;
			// }
			// }
			//
			// if (!form3.isValid()) {
			// Ext.Msg.alert('提示','请添加至少1个文件');
			// return;
			// }
			// var fileId = wins.down("#hidFileId").getValue();
			// if(fileId == "") {
			// Ext.Msg.alert('提示','请添加至少1个文件');
			// return;
			// }
			// hideFlash(sendfaxwin);
			// submitwfwin = loadsubmitwfwin(false,true);
			// submitwfwin.fileId = fileId;
			// submitwfwin.issendfaxwin = true;
			// submitwfwin.show();
		}
	},'-',ActionBase.getAction('saveDraft'),'-',{
		xtype: 'button',
		text: '发送选项',
		itemId: 'submitSendConfig',
		iconCls: 'submitSendConfig',
		handler: function () {
			if (sendfaxconfigwin == '') {
				sendfaxconfigwin = loadsendfaxconfigwin();
			} else {
				sendfaxconfigwin.show();
			} //if
			hideFlash(sendfaxwin);
		}
	},'-',{
		xtype:'button',
		itemId:'btnFaxInfoward',
		iconCls: 'inresendifICON',

		text:'内部传真',
		handler: function() {
			//禁用faxFileUpload
			hideFlash(sendfaxwin);
			//directoryTree_store.load();
			if(faxforwardwin == '') {
				faxforwardwin = Ext.create('WS.infax.InForward', {
					isInForWard:false
				});
			} else {
				faxforwardwin.isInForWard = false;
				faxforwardwin.isDocSearch = '';
			}
			// var ifwWin = Ext.create('WS.infax.InForward', {
			// isInForWard:false
			// });
			faxforwardwin.down('#tabpalFiles').setDisabled(false);
			faxforwardwin.show('', function() {
				faxforwardwin.down('#userID').loadGrid(true);
				Ext.StoreMgr.removeAtKey ('directoryTree_store');
				Ext.create('Ext.data.TreeStore', {
					model: 'directoryTree_Model',
					defaultRootId: WaveFaxConst.PublicRootFolderID,
					storeId: 'directoryTree_store',
					//autoLoad:false,
					proxy: {
						type: 'ajax',
						//url:'WS/user/dirJson.json',
						url: WsConf.Url,
						extraParams: {
							req: 'treenodes',
							treename: 'addrtree',
							restype: 'json',
							sessiontoken:Ext.util.Cookies.get("sessiontoken"),
							need:true
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
						text: '共享收件夹',
						iconCls: 'fax'//,
						//checked:false
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
						store.getProxy().extraParams.need = true;
						store.load();
					}
				});
				//faxforwardwin.down('#dirSrcTree').getStore().loadTree();
				//faxforwardwin.down('#dirSrcTree').expandPath('共享收件夹');
				faxforwardwin.down('#serFielID').store = faxforwardwin.down('#userID').getStore();

				faxforwardwin.down('#isDelID').setVisible(false);
				faxforwardwin.down('tabpanel').setActiveTab('forwarUserDic');

			});
		}
	}]
});

//发送传真用win
function loadsendfaxwin() {
	return Ext.create('Ext.window.Window', {
		title: "<span><img src='resources/images/fax/status/outstatus.5.png' style='margin-bottom: -5px;'/>"+'提交发送传真'+"</span>",
		height: 554,
		width: 910,
		closeAction:'hide',
		toFrontOnShow:false,
		preventHeader:true,
		shadow:false,
		closable:false,
		faxpaperid:'0',
		pngClass:'',
		pngGroup:'sendfax',
		defaultFitPng:true,
		tplid:'none',
		tplstr:'',
		runner:false,
		autoShow:true,
		renderTo:'sendfaxwin',
		// tools: [{
		// type: 'close',
		// handler: function() {
		// sendfaxwin.fireEvent('beforehide',sendfaxwin);
		// }
		// }],
		hideMode:'offsets',
		layout: 'anchor',
		collapsible: false,
		resizable: false,
		//frame: false,
		bodyStyle: {
			border: false
		},
		border: false,
		defaults: {
			frame: false,
			border: false
		},
		dockedItems: [{
			xtype: 'bottomStatusBar',
			height: 26,
			dock: 'bottom'
		}],
		items: [{
			xtype: 'panel',//tabpanel
			defaults: {
				frame: false,
				border: false
			},
			dockedItems: [{
				xtype: 'tbSendFax',
				height:36
			}],
			items: [{
				//title: '外部传真',
				defaults: {
					frame: false,
					border: false
				},
				items: [{
					xtype: 'form',
					itemId: 'formFaxInfo',
					layout: {
						type: 'table',
						columns: 4
					},
					defaults: {
						xtype: 'textfield',
						labelAlign: 'right',
						margin: '5 0 2 10',
						labelPad: 1,
						labelWidth: 80,
						width: 270,
						frame: false,
						border: false
					},
					items: [{
						fieldLabel: '<b>'+'传真号码'+'</b>',
						xtype: 'textfield',
						itemId: 'faxNumber',
						allowBlank: false,
						blankText: '传真号码不能为空',
						maxLength: 50,
						msgTarget:'side',
						maxLengthText: '传真号码长度最大为50字节',
						regex: regexFaxNumber1,
						regexText: '请输入正确的格式！'+'<br/> '+'支持的格式:'+'<br/> +86(20)11111111 <br/> +20 11111111 <br/> 028-11111111 <br/> (028)11111111<br/> 02811111111',
						enableKeyEvents:true,
						listeners: {
							// validitychange: function(field,isValid,opts) {
							//
							// var me = this;
							// if(isValid) {
							// me.up('window').down('#btnSuperadd').setDisabled(false);
							// } else {
							// me.up('window').down('#btnSuperadd').setDisabled(true);
							// }
							//
							// },
							focus: function(field,e,opts) {
								acDiv.update('');
								acSelItemsControl.createAcUl('',field);
								(new Ext.util.DelayedTask()).delay(200, function() {
									acSelItemsControl.autoComplete('faxNumber',field,e);
								});
							},
							keyup: function(field,e,opts) {
								acSelItemsControl.autoComplete('faxNumber',field,e);
							},
							blur: function (field, opts) {
								acDiv.hide();
								if (field.isValid()) {
									var faxNumber = field.getValue();
									var regex1 = /^\+.*$/;
									var regex2 = /^\(.*$/;
									var regex3 = /^.*-.*$/;

									var regex4 = /^\((\d*)\)(.*)$/; //(028)转换
									var regex5 = /^(\d*)(-)(.*)$/; //028- 转换

									var regex6 = /^(0+)([1-9])([0-9])([0-9]{0,1})(.*)$/; //0000000281111111 转换
									var regex7 = /^[3-9]$/; //3-9

									//无+
									if (!regex1.test(faxNumber)) {
										if(faxNumber.indexOf('sip:')!=-1) {
											return faxNumber;
										}

										//判断当前国家代码
										//非86
										if(userConfig.countryCode != '86') {
											//faxNumber = "+" + userConfig.countryCode + " "+faxNumber;
											faxNumber = faxNumber.replace('-','');
											var zeroIndex1 = faxNumber.search("0");
											if (zeroIndex1 != 0) {
												faxNumber = "+" + userConfig.countryCode + " "+faxNumber;
											} else {
												faxNumber = faxNumber.replace(regex6, function ($0, $1, $2, $3, $4, $5) {
													var isG = $0.substring(1, 2);
													if(isG == 0) {
														var isG1 = $0.substring(2, 3);
														if(isG1 == 1 || isG1 == 7)
															return ("+" + $2  + " "+ $3 + $4 + $5);
														if($0.length > 4) {
															var isG5 = $0.substring(2, 5);
															isG5 = getArNum(isG5);
															if(isG5 != '无效') {
																return ("+"+isG5+" "+ $5);
															} else {
																isG5 = $0.substring(2, 4);
																isG5 = getArNum(isG5);
																if(isG5 != '无效') {
																	var elseNum = $0.substring(4, $0.length);
																	return ("+"+isG5+" "+ elseNum);
																} else {
																	return ('???'+$0);
																}
															}
														}
														if($0.length == 4) {
															var isG4 = $0.substring(2, 4);
															isG4 = getArNum(isG4);

															if(isG4 != '无效') {
																return ("+"+isG4+" "+ $5);
															} else {
																return ('???'+$0);
															}
														}
														return ('???'+$0);
														//return ("+" + $2 + $3 + " "+ $4 + $5);
													}
													return ("+"+userConfig.countryCode +" " + $2 + $3 + $4 + $5);
												});
											}
										} else {//是86
											//有(
											if (regex2.test(faxNumber)) {
												faxNumber = faxNumber.replace(regex4, function ($0, $1, $2) {
													var zeroIndex = $1.search("0");
													if (zeroIndex == 0) {
														$1 = $1.substring(1, $1.length);
													}
													return ("+" + userConfig.countryCode + "(" + $1 + ")" + $2);
												});
											} else {
												//有-
												if (regex3.test(faxNumber)) {
													faxNumber = faxNumber.replace(regex5, function ($0, $1, $2, $3) {
														var zeroIndex = $1.search("0");
														if (zeroIndex == 0) {
															$1 = $1.substring(1, $1.length);
														}
														return ("+" + userConfig.countryCode + "(" + $1 + ")" + $3);
													});
												} else {//0+[1-9]\d{2,}
													var zeroIndex1 = faxNumber.search("0");
													if (zeroIndex1 != 0) {
														if(userConfig.areaCode != '') {
															faxNumber = "+" + userConfig.countryCode + "(" + userConfig.areaCode + ")" + faxNumber;
														} else {
															faxNumber = "+" + userConfig.countryCode + " " + faxNumber;
														}

													} else {

														faxNumber = faxNumber.replace(regex6, function ($0, $1, $2, $3, $4, $5) {
															var isG = $0.substring(1, 2);
															if(isG == 0) {
																var isG1 = $0.substring(2, 3);
																if(isG1 == 1 || isG1 == 7)
																	return ("+" + $2  + " "+ $3 + $4 + $5);
																if($0.length > 4) {
																	var isG5 = $0.substring(2, 5);
																	isG5 = getArNum(isG5);
																	if(isG5 != '无效') {
																		return ("+"+isG5+" "+ $5);
																	} else {
																		isG5 = $0.substring(2, 4);
																		isG5 = getArNum(isG5);
																		if(isG5 != '无效') {
																			var elseNum = $0.substring(4, $0.length);
																			return ("+"+isG5+" "+ elseNum);
																		} else {
																			return ('???'+$0);
																		}
																	}
																}
																if($0.length == 4) {
																	var isG4 = $0.substring(2, 4);
																	isG4 = getArNum(isG4);

																	if(isG4 != '无效') {
																		return ("+"+isG4+" "+ $5);
																	} else {
																		return ('???'+$0);
																	}
																}
																return ('???'+$0);
																//return ("+" + $2 + $3 + " "+ $4 + $5);
															}
															if ($2 == 1 || $2 == 2)
																return ("+"+userConfig.countryCode +"(" + $2 + $3 + ")" + $4 + $5);
															if (regex7.test($2))
																return ("+"+userConfig.countryCode +"(" + $2 + $3 + $4 +  ")"  + $5);
														});
													}

												}
											}
										}

									}//无+

									field.setValue(faxNumber);
								} else {
									var faxNumber1 = field.getValue();
									var regexNumber = /^\d+$/;
									if (regexNumber.test(faxNumber1)) {
										var zeroIndex1 = faxNumber1.search("0");
										if (zeroIndex1 != 0) {
											//非86
											if(userConfig.countryCode != '86') {
												faxNumber1 = "+" + userConfig.countryCode + " " + faxNumber1;
											} else {//86
												if(userConfig.areaCode!='') {
													faxNumber1 = "+" + userConfig.countryCode + "(" + userConfig.areaCode + ")" + faxNumber1;
												} else {
													faxNumber1 = "+" + userConfig.countryCode + " " + faxNumber1;
												}
											}

											field.setValue(faxNumber1);
										}
									}
								}

							}
						}
					},{
						fieldLabel: '分机号',
						xtype: 'textfield',
						itemId: 'subNumber',
						labelWidth:60,
						width: 148,
						maxLength: 20,
						maxLengthText: '分机号长度最大为20字节',
						enableKeyEvents:true,
						listeners: {
							focus: function(field,e,opts) {
								acDiv.update('');
								acSelItemsControl.createAcUl('',field);
								(new Ext.util.DelayedTask()).delay(200, function() {
									acSelItemsControl.autoComplete('subNumber',field,e);
								});
							},
							keyup: function(field,e,opts) {
								acSelItemsControl.autoComplete('subNumber',field,e);
							},
							blur: function(field,opts) {
								acDiv.hide();
							}
						}
					},{
						fieldLabel: 'E-Mail',
						xtype: 'textfield',
						itemId: 'e-mail',
						maxLength: 50,
						maxLengthText: 'e-mail长度最大为50字节',
						enableKeyEvents:true,
						listeners: {
							focus: function(field,e,opts) {
								acDiv.update('');
								acSelItemsControl.createAcUl('',field);
								(new Ext.util.DelayedTask()).delay(200, function() {
									acSelItemsControl.autoComplete('e-mail',field,e);
								});
							},
							keyup: function(field,e,opts) {
								acSelItemsControl.autoComplete('e-mail',field,e);
							},
							blur: function(field,opts) {
								acDiv.hide();
							}
						}
					},{
						fieldLabel: '移动电话',
						xtype: 'textfield',
						itemId: 'mobile',
						labelWidth:55,
						width: 148,
						maxLength: 30,
						maxLengthText: '移动电话长度最大为30字节',
						enableKeyEvents:true,
						listeners: {
							focus: function(field,e,opts) {
								acDiv.update('');
								acSelItemsControl.createAcUl('',field);
								(new Ext.util.DelayedTask()).delay(200, function() {
									acSelItemsControl.autoComplete('mobile',field,e);
								});
							},
							keyup: function(field,e,opts) {
								acSelItemsControl.autoComplete('mobile',field,e);
							},
							blur: function(field,opts) {
								acDiv.hide();
							}
						}
					},{
						fieldLabel: '收件人',
						width: 428,
						xtype: 'textfield',
						itemId: 'faxReceiver',
						colspan:2,
						maxLength: 50,
						maxLengthText: '收件人长度最大为50字节',
						enableKeyEvents:true,
						listeners: {
							focus: function(field,e,opts) {
								acDiv.update('');
								acSelItemsControl.createAcUl('',field);
								(new Ext.util.DelayedTask()).delay(200, function() {
									acSelItemsControl.autoComplete('faxReceiver',field,e);
								});
							},
							keyup: function(field,e,opts) {
								acSelItemsControl.autoComplete('faxReceiver',field,e);
							},
							blur: function(field,opts) {
								acDiv.hide();
							}
						}
					},{
						fieldLabel: '组织',
						xtype: 'textfield',
						itemId: 'organization',
						colspan:2,
						width: 428,
						maxLength: 50,
						maxLengthText: '组织长度最大为50字节',
						enableKeyEvents:true,
						listeners: {
							focus: function(field,e,opts) {
								acDiv.update('');
								acSelItemsControl.createAcUl('',field);
								(new Ext.util.DelayedTask()).delay(200, function() {
									acSelItemsControl.autoComplete('organization',field,e);
								});
							},
							keyup: function(field,e,opts) {
								acSelItemsControl.autoComplete('organization',field,e);
							},
							blur: function(field,opts) {
								acDiv.hide();
							}
						}
					}]
				}]
			}]
		},{
			xtype:'panel',
			layout: {
				type: 'auto'
			},
			defaults: {
				xtype: 'textfield',
				labelAlign: 'right',
				margin: '5 0 2 10',
				labelPad: 1,
				labelWidth: 0,
				//frame: false,
				border: false
			},
			items:[{
				xtype: 'button',
				width: 100,
				margin: '5 0 2 90',
				text: '通讯录',
				iconCls: 'addressTitle',
				handler: function () {
					if (addresspersonwin == '') {
						createSAddressStroe();
						//var dd = Ext.StoreMgr.lookup('addressId');

						addresspersonwin = loadaddresspersonwin();
					}
					hideFlash(sendfaxwin);
				}
			},{
				xtype: 'button',
				text: '追加收件人',
				itemId:'btnSuperadd',
				//disabled:true,
				iconCls:'sendfaxPushAddr',
				handler: function () {
					if(linkmenwin == '') {
						linkmenwin = loadlinkmenwin();
					}
					hideFlash(sendfaxwin);
				}
			},{
				xtype: 'button',
				text: '录入表单数据',
				itemId:'btnTemplate',
				disabled:true,
				iconCls:'tplBtnIconCls',
				handler: function () {
					hideFlash(sendfaxwin);

					function showDocDataWin(tplId) {
						//如果未保存过该模版信息
						if(!template.saveTplInfo.containsKey(sendfaxwin.tplid)) {
							//调用Call 取得默认值
							var param = {};
							param.template = tplId;
							param.sessiontoken = sessionToken;
							// 调用
							WsCall.call('getcolumn', param, function(response, opts) {
								var data = Ext.JSON.decode(response.data);
								if(!template.saveTplInfo.containsKey(tplId)) {
									template.saveTplInfo.add(tplId,data);
								}
								var faxid ='';
								template.myWinItems = new Array();
								template.myWinGItems.clear();
								var data = Ext.clone(template.saveTplInfo.get(tplId));
								Ext.Array.each(data, function(item,index,alls) {
									template.createContorl(item);
								});
								if(sendfax_inputDataWin == '') {
									sendfax_inputDataWin = loadInputDataWin(false,sendfaxwin);
								}
								sendfax_inputDataWin.show();
							}, function(response, opts) {
							}, false);
						} else {
							var faxid ='';
							template.myWinItems = new Array();
							template.myWinGItems.clear();
							var data = Ext.clone(template.saveTplInfo.get(tplId));
							Ext.Array.each(data, function(item,index,alls) {
								template.createContorl(item);
							});
							if(sendfax_inputDataWin == '') {
								sendfax_inputDataWin = loadInputDataWin(false,sendfaxwin);
							}
							sendfax_inputDataWin.show();
						}

					}

					if(sendfaxwin.tplid != 'none') {
						showDocDataWin(sendfaxwin.tplid);
					} else {
						loadTemplateWin( function(record) {
							var tplId = record.data.tplId;
							if(tplId == 'none') {
								return;
							}
							sendfaxwin.tplid=tplId;
							showDocDataWin(tplId);
							//ActionBase.getAction('recTemplate').execute(null,null,sels);
						},sendfaxwin);
					}
				}
			}]
		},{
			xtype: 'form',
			itemId: 'formFaxSubFile',
			frame: false,
			border: false,
			layout: {
				type: 'table',
				columns: 2
			},
			defaults: {
				xtype: 'textfield',
				labelAlign: 'right',
				margin: '5 0 0 10',
				labelPad: 1,
				labelWidth: 80,
				width: 450,
				frame: false,
				border: false
			},
			items: [{
				fieldLabel: '传真主题',
				itemId: 'faxSubject',
				width: 865,
				colspan: 2,
				maxLength: 200,
				maxLengthText: '传真主题长度最大为200字节'
			},{
				xtype:'hiddenfield',
				itemId: 'hidFaxIDS',
				value: '[]'
			},{
				xtype:'hiddenfield',
				itemId: 'hidDirIDS',
				value: '[]'
			},{
				xtype: 'hiddenfield',
				itemId: 'hidFileId',
				value: ''
			},{
				xtype: 'hiddenfield',
				itemId: 'hidLoaded',
				value: '0'
			},{
				xtype: 'hiddenfield',
				itemId: 'hidLinkMen',
				value: '[]'
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
			beforecollapse: function (panel, dir, ani, opts) {
				var position = panel.getEl().getXY();
				sendfaxwinPosition.oldX = position[0];
				sendfaxwinPosition.oldY = position[1];

				sendfaxwinPosition.oldWidh = panel.getWidth();
			},
			collapse: function (panel, opts) {
				panel.setWidth(10);
				panel.setPosition(Ext.getBody().getWidth() - panel.getWidth(), Ext.getBody().getHeight() - panel.getHeight());
			},
			expand: function (panel, opts) {
				panel.setWidth(sendfaxwinPosition.oldWidh);
				panel.setPosition(sendfaxwinPosition.oldX, sendfaxwinPosition.oldY);
			},
			beforehide: function(com,opts) {
				acDiv.hide();
				var hidForm = com.down('#hidFileId');
				if(sendfaxwin.myhideType && sendfaxwin.myhideType == 1) {
					//return true;
					sendfaxwin.fireEvent('hide',sendfaxwin);
				}
				if(hidForm.getValue() != "" && !sendfaxwin.isSend) {
					var oVal = com.down('#txtCurrPage').getValue();

					if(sendfaxwin.pngClass) {
						sendfaxwin.vvType = {
							viewType:sendfaxwin.pngClass.getViewType(),
							selsCount:sendfaxwin.pngClass.getPngSels().getCount(),
							totoalPage:sendfaxwin.pngClass.getTotalCount(),
							currPage:oVal
						};
					}

					//sendfaxwin.show();
					newMesB.show({
						title:'确认关闭',
						msg: '你已经添加了传真文件'+',<br/>'+'确定要关闭发送器放弃本次添加的传真文件吗？',
						buttons: Ext.MessageBox.YESNO,
						closable:false,
						buttonText: {
							yes: '确定',
							no: '取消'
						},
						fn: function(btn) {
							if (btn =="no") {
								//return false;
							} else {
								sendfaxwin.myhideType = 1;
								var param1 = {};
								param1.fileId = hidForm.getValue();
								param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
								//sendfaxwin.hide();
								sendfaxwin.fireEvent('hide',sendfaxwin);
								//调用
								WsCall.call('deleteTempFiles', param1, function (response, opts) {

								}, function (response, opts) {

								}, true);
								//sendfaxwin = '';
								//return true;
							}
						},
						icon: Ext.MessageBox.QUESTION
					});
					//return false;
				} else {
					//return true;
					sendfaxwin.fireEvent('hide',sendfaxwin);
				}

			},
			hide: function() {

				//sendfaxwin.setPosition(-1000,-1000);
				sendfaxwin.myhideType = 0;

				sendfaxwin.isSend = false;

				//清空
				var hidForm = sendfaxwin.down('#hidFileId');
				var lblM = sendfaxwin.down('#submitMessage');
				if(hidForm.getValue() != "" && lblM.text == '') {
					//清空
					var palPngContainer = sendfaxwin.down('#filepngviewMini');
					palPngContainer.removeAll();
					//清空缩略图数组
					sendfaxwin.pngClass.getPngAllMini().clear();
					//清空大图数组
					sendfaxwin.pngClass.getPngSelBig().clear();
					//清空选择数组
					sendfaxwin.pngClass.getPngSels().clear();
					//单页视图Img对象
					sendfaxwin.pngClass.setPngContainerBig("");
					//单页图全局currPage
					sendfaxwin.pngClass.setCurrCountBig(0);
					//当前传真总页数
					sendfaxwin.pngClass.setCurrFaxFileTotal(1);
					sendfaxwin.pngClass.setTotalCount(0);

					//
					sendfaxwin.pngClass.setMiniCurPage(1);
					sendfaxwin.pngClass.setMiniTotalPage(0);
					sendfaxwin.down('#tbMiniPageTotal').setText('共'+'   ' + 0);
					//

					var tbPageTotal = sendfaxwin.down('#tbPageTotal');
					tbPageTotal.setText('共'+'   ' + 0);
					sendfaxwin.pngClass.setInsertStartPage(0);
					sendfaxwin.pngClass.setTotalCount(0);
					sendfaxwin.pngClass.setCurrFaxFileTotal(1);
					//toolbar 按钮状态
					ActionBase.updateActions('filepngview', 0,sendfaxwin.pngClass.getPngSels().getCount(),sendfaxwin.pngClass.getTotalCount(),-1);
					//清除filePath 文本和 fileId

					hidForm.setValue("");
					//设置前后插入等按钮状态
					ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
					//重新设置totalPage
					//tbFaxFileTabPng
					//调用切换视图
					if(sendfaxwin.pngClass.getViewType() == 1) {
						ActionBase.getAction('filepngviewviewTypeChange').execute(null,null,true);
					}

					sendfaxwin.down('#filepngviewMini').setHeight(0);
					sendfaxwin.down('#filepngviewMini').doLayout();
					sendfaxwin.down('#panelfilepngview').doLayout();
				}
				var form1 = sendfaxwin.down('#formFaxSubFile').getForm();
				var form2 = sendfaxwin.down('#formFaxInfo').getForm();
				var form3 = sendfaxwin.down('#formFileId').getForm();
				form1.reset();
				form2.reset();
				form3.reset();
				sendfaxwin.down('#btnFaxInfoward').setText('内部传真');
				sendfaxwin.down('#btnSuperadd').setText('追加收件人');
				sendfaxwin.vvType =0;
				if(sendfaxconfigwin != '') {
					sendfaxconfigwin.close();
				}
				if(sendfax_inputDataWin !='') {
					sendfax_inputDataWin.destroy();
					sendfax_inputDataWin = '';
				}

			},
			destroy: function () {
				sendfaxwin = '';
				if(sendfaxconfigwin != '') {
					sendfaxconfigwin.close();
				}
			},
			show: function (win, opts) {
				if(sendfaxwin.vvType && sendfaxwin.vvType !=0) {
					ActionBase.updateActions('filepngview', sendfaxwin.vvType.viewType,sendfaxwin.vvType.selsCount,sendfaxwin.vvType.totoalPage,sendfaxwin.vvType.currPage);
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
							ActionBase.getAction(myStates.printerSrc[key]).execute(null,null,true);
						}
					}
				} else {
					win.down('#localPSrc').setDisabled(true);
					ActionBase.getAction('serverPSrc').execute(null,null,true);
				}
				//打印机类型
				if(myStates&&myStates.printerType) {
					for (key in myStates.printerType) {
						if( !myStates.printerType[key] || key == 'stateSaved')
							continue;
						ActionBase.getAction(myStates.printerType[key]).execute(null,null,true);
					}
				}

				var progressBar = win.down('#bottomProgressBar');
				progressBar.hide();
				//win.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
				ActionBase.updateActions('acsendfaxwin', win.down('#hidFileId').getValue());
				win.down('#headerWelcome').hide();
				win.down('#serverInfo').hide();
				win.down('#historyMes').hide();
				win.down('#personRole').hide();
				win.down('#lblMessage').setText('<span><b>'+'当前国家代码'+':'+userConfig.countryCode+'  '+'区号'+':'+userConfig.areaCode+'</span>');
				win.down('#submitMessage').hide();
				win.down('#submitMessage').setText('');
				//清空内部转发数据
				//secondGridStore.loadData([]);
				//directoryGridStore.loadData([]);
				Ext.StoreMgr.lookup('userdicStore').loadData([]);
				//superaddition
				Ext.StoreMgr.lookup('superaddTarStore').loadData([]);
				//linmengrid
				Ext.StoreMgr.lookup('linkmenGridStore').loadData([]);
				//linmen []
				LinkMenArr = new Array();

				faxforwardwin.needClear = true;

				slaveFilesQueueCol.clear();
				slaveFilesUpedCol.clear();

				//调用call
				var param1 = {};
				param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

				WsCall.call('delappslave', param1, function (response, opts) {
				}, function (response, opts) {
				}, false);
				if(faxforwardwin) {
					var fpal = faxforwardwin.down('#fsupList');
					if(fpal) {
						fpal.removeAll();
					}
				}

				//是否启用工作流
				if(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0) {
					win.down('#submitWorkFlow').setDisabled(false);
				}
				//是否强制使用工作流
				if(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.forceWorkFlow == 0) {
					win.down('#submitSend').setDisabled(true);
				}
				//是否启用表单数据
				if(template && !serverInfoDis && serverInfoModel.data.formData == 0) {
					win.down('#btnTemplate').setDisabled(false);

				}
				//清空模版
				sendfaxwin.tplid = 'none';
				sendfaxwin.tplstr = '';
				win.down('#btnTemplate').setText('录入表单数据');

				win.down('#panelfilepngview').doLayout();

				win.faxpaperid = '0';
				var fpbtn = win.down('#faxpaper');
				fpbtn.setText('传真纸'+':'+'无');
				fpbtn.show();
				win.down('#tbfaxpaper').show();
				//加载传真纸
				var fpstore = Ext.StoreMgr.lookup('faxpaperStoreID');
				var sessiontoken = fpstore.getProxy().extraParams.sessiontoken = sessionToken;

				var fpmenu = fpbtn.menu;
				fpmenu.removeAll();
				fpstore.load( function(records, operation, success) {
					if(success) {
						fpmenu.removeAll();
						for (var i=0; i < records.length; i++) {
							fpmenu.add({
								fpid:records[i].data.fpId,
								xtype: 'menucheckitem',
								group:'faxpapergroup',
								checked:records[i].data.fpId=='0',
								text:records[i].data.fpName,
								listeners: {
									click: function(btn,e,opts) {
										var myTxt = btn.text.length > 8?btn.text.substring(0,6)+'..':btn.text;
										fpbtn.setText('传真纸'+':'+myTxt);

										faxpaperMenuClick(win,btn.fpid);
									}
								}

							});

						};
					}

				});
			}
		}
	});

}

//传真编辑窗口加载
loadFaxEditor = function () {

	if(colorPicker) {
		return;
	}

	//初始化字体调色板
	colorPicker = Ext.create('Ext.menu.ColorPicker', {
		value: '000000',
		handler: function(cm, color) {
			var html = fontEditor.down('htmleditor').getValue();
			var temp = stampcls.getStampList().getByKey(fontEditor.comId);
			temp.fontColor = '#'+color;
			fontEditor.down('htmleditor').setValue(creatHtmlByStt(temp,html));
			fontEditor.down('#colorBtn').setText('文字 '+'<label style=background-color:#'+color+';>&nbsp;&nbsp;&nbsp;</label> ');
			//Ext.Msg.alert('Color Selected', '<span style="color:#' + color + ';">You choose '+color+'.</span>');
		}
	});

	//初始化背景调色板
	bgcolorPicker = Ext.create('Ext.menu.ColorPicker', {
		value: 'FFFFFF',
		handler: function(cm, color) {
			var html = fontEditor.down('htmleditor').getValue();
			var curSel = winImageEditor.down('#'+fontEditor.comId+'');
			var temp = stampcls.getStampList().getByKey(fontEditor.comId);
			temp.bgColor = '#'+color;
			fontEditor.down('htmleditor').setValue(creatHtmlByStt(temp,html));
			fontEditor.down('#bgcolorBtn').setText('背景'+'<label style=background-color:#'+color+';>&nbsp;&nbsp;&nbsp;</label> ');
			//Ext.Msg.alert('Color Selected', '<span style="color:#' + color + ';">You choose '+color+'.</span>');
		}
	});

	//重写htmlEnditor
	Ext.override(Ext.form.HtmlEditor, {
		// private
		defaultValue: (Ext.isOpera || Ext.isIE6) ? '&#160;' : '&#8203;',
		cleanHtml: function(html) {
			var dv = this.defaultValue;
			html = String(html);

			if (Ext.isWebKit) { // strip safari nonsense
				html = html.replace(/\sclass="(?:Apple-style-span|khtml-block-placeholder)"/gi, '');
			}

			if (html.charCodeAt(0) == dv.replace(/\D/g, '')) {
				html = html.substring(1);
			}
			return html;
		}
	});

	//初始化字体编辑器
	fontEditor = Ext.create('Ext.window.Window', {
		title: '添加批注',
		modal:true,
		closeAction:'hide',
		height: 250,
		width: 530,
		resizable:false,
		layout: 'auto',
		defaults: {
			width:518
		},
		items:[{
			xtype:'panel',
			////bodyCls: 'panelFormBg',
			border:false,
			layout: {
				type:'table',
				columns:9
			},
			defaults: {
				xtype:'button',
				margin:'2 2 2 2'
			},
			items:[{
				text:'<b>B</b>',
				tooltip: '粗体',
				width:22,
				handler: function() {
					var me = this;
					var html =me.up('window').down('htmleditor').getValue();
					var temp = stampcls.getStampList().getByKey(fontEditor.comId);
					if(temp.isBold) {
						temp.isBold = false;
					} else {
						temp.isBold = true;
					}
					me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
				}
			},{
				text:'<i>I</i>',
				tooltip: '斜体',
				width:22,
				handler: function() {
					var me = this;
					var html =me.up('window').down('htmleditor').getValue();
					var temp = stampcls.getStampList().getByKey(fontEditor.comId);
					if(temp.isItalic) {
						temp.isItalic = false;
					} else {
						temp.isItalic = true;
					}
					me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
				}
			},{
				text:'<u>U</u>',
				tooltip: '下划线',
				width:22,
				handler: function() {
					var me = this;
					var html =me.up('window').down('htmleditor').getValue();
					var temp = stampcls.getStampList().getByKey(fontEditor.comId);
					if(temp.isUnderLine) {
						temp.isUnderLine = false;
					} else {
						temp.isUnderLine = true;
					}
					me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
				}
			}
			,{
				text:'<del>D</del>',
				tooltip: '删除线',
				width:22,
				handler: function() {
					var me = this;
					var html =me.up('window').down('htmleditor').getValue();
					var temp = stampcls.getStampList().getByKey(fontEditor.comId);
					if(temp.isStrikeOut) {
						temp.isStrikeOut = false;
					} else {
						temp.isStrikeOut = true;
					}
					me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
				}
			},{
				xtype:'combo',
				queryMode:'local',
				itemId:'cbFontName',
				value:'Tahoma',
				editable:false,
				store:fontFamilies,
				listeners: {
					change: function(combo,nVal,oVal,opts) {
						var me = this;
						var html =me.up('window').down('htmleditor').getValue();
						var temp = stampcls.getStampList().getByKey(fontEditor.comId);
						temp.fontName = nVal;
						me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
					}
				}
			},{
				xtype:'combo',
				queryMode:'local',
				itemId:'cbFontSize',
				width:50,
				value:'12',
				editable:false,
				store:fontSizes,
				listeners: {
					change: function(combo,nVal,oVal,opts) {
						var me = this;
						var html =me.up('window').down('htmleditor').getValue();
						var temp = stampcls.getStampList().getByKey(fontEditor.comId);
						temp.fontSize = nVal;
						me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
					}
				}
			},{
				itemId:'colorBtn',
				tooltip: '文字颜色',
				text:'文字'+' <label style=background-color:#000000;>&nbsp;&nbsp;&nbsp;</label> ',
				menu: colorPicker
			},{
				itemId:'bgcolorBtn',
				tooltip: '背景颜色',
				text:'背景'+' <label style=background-color:#FFFFFF;>&nbsp;&nbsp;&nbsp;</label> ',
				menu: bgcolorPicker
			},{
				itemId:'bgTransp',
				width:80,
				boxLabel:'背景透明',
				labelWidth:40,
				xtype:'checkboxfield',
				checked:false,
				listeners: {
					change: function(cb,nVal,oVal,opts) {
						var me = this;
						var html = me.up('window').down('htmleditor').getValue();
						var temp = stampcls.getStampList().getByKey(fontEditor.comId);
						if(nVal) {
							temp.bgColor = 'transparent';
							fontEditor.down('#bgcolorBtn').setText('背景' +" <label style=background-color:transparent;>&nbsp;&nbsp;&nbsp;</label> ");
							me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
							me.up('window').down('#bgcolorBtn').setDisabled(true);
						} else {

							temp.bgColor = '#'+bgcolorPicker.picker.getValue();
							fontEditor.down('#bgcolorBtn').setText('背景' +" <label style=background-color:"+temp.bgColor+";>&nbsp;&nbsp;&nbsp;</label> ");
							me.up('window').down('htmleditor').setValue(creatHtmlByStt(temp,html));
							me.up('window').down('#bgcolorBtn').setDisabled(false);
						}
					}
				}
			}]
		},{
			border:false,
			xtype: 'htmleditor',
			name: 'bio',
			enableLinks :false,
			enableLists :false,
			enableSourceEdit:false,
			enableAlignments:false,
			enableColors:false,
			enableFont:false,
			enableFormat:false,
			enableFontSize:false,
			defaultFont: 'tahoma',
			height:160
		}
		],
		buttons: [{
			text: '确定',
			handler: function() {
				var me = this;
				var curSel = winImageEditor.down('#'+fontEditor.comId+'');
				var html =	me.up('window').down('htmleditor').getValue();

				var temp = stampcls.getStampList().getByKey(fontEditor.comId);

				temp.content = htmlFormat(html);
				html = creatHtmlByStt(temp,html,curSel);

				curSel.update(html);

				var hedt=fontEditor.down('htmleditor');
				if(hedt) {
					hedt.hide();
				}

				preSTemp = Ext.clone(temp);
				me.up('window').close();
				curSel.doLayout();
			}
		},{
			text: '取消',
			handler: function() {
				var me = this;
				var html =	me.up('window').down('htmleditor').getValue();

				html = htmlFormat(html);
				//内容为空则删除
				if(html == "" || html.length<1) {
					var curSel = winImageEditor.down('#'+fontEditor.comId+'');
					stampcls.getStampList().removeAtKey(fontEditor.comId);
					curSel.destroy();
					stampcls.getSelList().clear();
				}

				var hedt=fontEditor.down('htmleditor');
				if(hedt) {
					hedt.hide();
				}
				me.up('window').close();

			}
		}],
		listeners: {
			show: function() {
				var me = this;
				var curSel = winImageEditor.down('#'+fontEditor.comId+'');
				var hedt=fontEditor.down('htmleditor');
				if(hedt) {
					hedt.show(null, function() {
						hedt.focus(false,200);
					});
				}

				if(curSel.body.dom.innerHTML == '') {
					fontEditor.down('htmleditor').setValue(creatHtmlByStt(stampTemp,' '));
				} else {
					fontEditor.down('htmleditor').setValue(curSel.body.dom.innerHTML);
				}
				//重置工具栏状态
				var temp = stampcls.getStampList().getByKey(curSel.id);
				fontEditor.down('#cbFontName').setValue(temp.fontName);
				fontEditor.down('#cbFontSize').setValue(temp.fontSize);
				fontEditor.down('#colorBtn').setText('文字'+" <label style=background-color:"+temp.fontColor+";>&nbsp;&nbsp;&nbsp;</label> ");

				if(temp.bgColor == 'transparent') {
					fontEditor.down('#bgTransp').setValue(true);
					fontEditor.down('#bgcolorBtn').setDisabled(true);
					fontEditor.down('#bgcolorBtn').setText('背景' +" <label style=background-color:transparent;>&nbsp;&nbsp;&nbsp;</label> ");
				} else {
					fontEditor.down('#bgTransp').setValue(false);
					fontEditor.down('#bgcolorBtn').setDisabled(false);
					fontEditor.down('#bgcolorBtn').setText('背景' +" <label style=background-color:"+temp.bgColor+";>&nbsp;&nbsp;&nbsp;</label> ");
					bgcolorPicker.picker.select(temp.bgColor);
				}
				colorPicker.picker.select(temp.fontColor);

				//htmlEditor.focus(false,true);
			},
			hide: function() {
				var hedt=fontEditor.down('htmleditor');
				if(hedt) {
					hedt.hide();
				}

			}
		}
	});
}
//个人权限信息form对应的model
Ext.define('personRolewinModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'sendInbox',
		type: 'string'
	},{
		name: 'sendLocal',
		type: 'string'
	},{
		name: 'sendLdis',
		type: 'string'
	},{
		name: 'sendInter',
		type: 'string'
	},{
		name: 'sendMessage',
		type: 'string'
	},{
		name: 'receiveVoice',
		type: 'string'
	},{
		name: 'receiveMessage',
		type: 'string'
	},{
		name: 'sendMessage',
		type: 'string'
	},{
		name: 'receiveFax',
		type: 'string'
	},{
		name: 'receiveVoice',
		type: 'string'
	},{
		name: 'receiveMessage',
		type: 'string'
	},{
		name: 'mailReport',
		type: 'string'
	},{
		name: 'voiceReport',
		type: 'string'
	},{
		name: 'messageReport',
		type: 'string'
	},{
		name: 'printReport',
		type: 'string'
	},{
		name: 'workFlow',
		type: 'string'
	},{
		name: 'forceWorkFlow',
		type: 'string'
	},{
		name: 'allowWorkFlow',
		type: 'string'
	},{
		name: 'customWorkFlow',
		type: 'string'
	},{
		name: 'underComit',
		type: 'string'
	} ,{
		name: 'mailType',
		type: 'string'
	},{
		name: 'signEle',
		type:'string'
	},{
		name: 'signEleManager',
		type:'string'
	}
	]
});

//服务器信息form对应的model
Ext.define('ServerInfowinModel', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'currUser',
		type: 'string'
	},{
		name: 'userOrg',
		type: 'string'
	},{
		name: 'faxLineCount',
		type: 'string'
	},{
		name: 'faxInlineCount',
		type: 'string'
	},{
		name: 'onlineUserCount',
		type: 'string'
	},{
		name: 'receiveVoice',
		type: 'string'
	},{
		name: 'receiveMessage',
		type: 'string'
	},{
		name: 'sendMessage',
		type: 'string'
	},{
		name: 'workFlow',
		type: 'string'
	},{
		name: 'faxSign',
		type: 'string'
	},{
		name: 'faxCode',
		type: 'string'
	},{
		name: 'formData',
		type: 'string'
	},{
		name: 'wordManager',
		type: 'string'
	},

	//        { name: 'countryCode', type: 'string' },
	//        { name: 'code', type: 'string' },
	//        { name: 'serverCountryCode', type: 'string' },
	//        { name: 'serverCode', type: 'string' },
	{
		name: 'serverGroupId',
		type: 'string'
	},{
		name: 'fileServerInfo',
		type: 'string'
	},{
		name: 'serverInfo',
		type: 'string'
	}
	]
});
//获取权限信息
function getRoleInfoData(okfun) {
	var param = {};
	param.sessiontoken = sessionToken;
	//调用
	WsCall.call('personRole', param, function (response, opts) {
		var serverInfo = Ext.JSON.decode(response.data);
		roleInfoModel = Ext.ModelManager.create(serverInfo, 'personRolewinModel');

		if (okfun)
			okfun();
	}, function (response, opts) {
		if(!errorProcess(response.code)) {
			Ext.Msg.alert('失败', response.msg);
		}

	}, false);
}

//获取服务器信息
function getServerInfoData(okfun) {
	var param = {};
	param.sessiontoken = sessionToken;
	//调用
	WsCall.call('serverInfo', param, function (response, opts) {
		var serverInfo = Ext.JSON.decode(response.data);
		serverInfoModel = Ext.ModelManager.create(serverInfo, 'ServerInfowinModel');
		if (okfun)
			okfun();
	}, function (response, opts) {
		//Ext.Msg.alert('加载失败', response.msg);
		serverInfoDis = true;
		Ext.getBody().unmask();
		// if(loginLoading && loginLoading.hide) {
		// loginLoading.hide();
		// }
		if (okfun)
			okfun();
	}, false);
}

// 登陆完成后续处理
function loginOK(sessionToken, okfun, errfun) {
	Ext.util.Cookies.set('sessiontoken', sessionToken);
	//getServerInfoData();
	getServerInfoData( function() {
		getRoleInfoData( function() {
			getUserData(okfun, errfun);
		});
	});
}

//session 对象
var sessionData = {
	faxNumber:'',
	subNumber:'',
	faxReceiver:'',
	email:'',
	mobile:'',
	organization:''
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";

Ext.onReady( function() {

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

	//重写window 让其默认不超界
	Ext.override(Ext.window.Window, {
		constrainHeader: true
	});

	lineEditor = loadLineEditor();
	//隐藏panel
	Ext.create('Ext.panel.Panel', {
		title: '消息',
		height: 200,
		width: 500,
		renderTo:'Message',
		layout: {
			type:'table',
			columns:2
		} ,
		//bodyCls:'x-panel-default',
		iconCls:'sendfax',
		defaults: {
			margin:'15 0 0 10',
			labelAlign:'right'
		},
		items:[{
			width:400,
			xtype:'displayfield',
			colspan:2,
			value:'<span style="font-size:18px;width:400px;"><img src="resources/images/pub/sucMsg.png"/>'+'提交传真成功!'+'</span>'
		}],
		buttons:[{
			width:240,
			text:'返回发送页面',
			handler: function() {
				var msgDiv = Ext.get('Message');
				msgDiv.hide();
				if(sendfaxwin.pngClass != '') {
					//清空
					var palPngContainer = sendfaxwin.down('#filepngviewMini');
					palPngContainer.removeAll();
					//清空缩略图数组
					sendfaxwin.pngClass.getPngAllMini().clear();
					//清空大图数组
					sendfaxwin.pngClass.getPngSelBig().clear();
					//清空选择数组
					sendfaxwin.pngClass.getPngSels().clear();
					//单页视图Img对象
					sendfaxwin.pngClass.setPngContainerBig("");
					//单页图全局currPage
					sendfaxwin.pngClass.setCurrCountBig(0);
					//当前传真总页数
					sendfaxwin.pngClass.setCurrFaxFileTotal(1);
					sendfaxwin.pngClass.setTotalCount(0);
					//
					sendfaxwin.pngClass.setMiniCurPage(1);
					sendfaxwin.pngClass.setMiniTotalPage(0);
					sendfaxwin.down('#tbMiniPageTotal').setText('共'+'   ' + 0);
					//
					var tbPageTotal = sendfaxwin.down('#tbPageTotal');
					tbPageTotal.setText('共'+'   ' + 0);
					sendfaxwin.pngClass.setInsertStartPage(0);
					sendfaxwin.pngClass.setTotalCount(0);
					sendfaxwin.pngClass.setCurrFaxFileTotal(1);
					//toolbar 按钮状态
					ActionBase.updateActions('filepngview', 0,sendfaxwin.pngClass.getPngSels().getCount(),sendfaxwin.pngClass.getTotalCount(),-1);
					//清除filePath 文本和 fileId
					var hidForm = sendfaxwin.down('#hidFileId');
					hidForm.setValue("");
					//设置前后插入等按钮状态
					ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
					if(hidForm.getValue() == '') {
						sendfaxwin.down('#txtMiniCurrPage').setDisabled(true);
					} else {
						sendfaxwin.down('#txtMiniCurrPage').setDisabled(false);
					}
					//重新设置totalPage
					//tbFaxFileTabPng
					//调用切换视图
					if(sendfaxwin.pngClass.getViewType() == 1) {
						ActionBase.getAction('filepngviewviewTypeChange').execute();
					}

					sendfaxwin.down('#filepngviewMini').setHeight(0);
					sendfaxwin.down('#filepngviewMini').doLayout();
					sendfaxwin.down('#panelfilepngview').doLayout();
				}
				sendfaxwin.fireEvent('show',sendfaxwin);
				var sendDiv = Ext.get('sendfaxwin');
				sendDiv.show();
				sendfaxwin.el.dom.style.top="0px";
			}
		},{
			width:240,
			text:'打开WaveFax',
			handler: function() {
				var host = window.location.host;
				window.location.href = "http://"+host+"/faxserver/";
			}
		}]
	});
	var msgDiv = Ext.get('Message');
	msgDiv.hide();
	//win
	// 初始化登录窗口
	win = Ext.create('widget.window', {
		// title: '登录窗口',
		closable : false,
		modal : true,
		width : 416,
		border : false,
		hidden:true,
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

				win.down('form').getForm().findField('Username').setValue(userInfo);
				//判断是否有cookie
				if(Ext.util.Cookies.get("ws_password") != null) {
					win.down('form').getForm().findField('Password').setValue('·············');
					win.down('form').getForm().findField('hpassword').setValue(password);
				}

				if (checksavepass) {
					win.down('form').getForm().findField('savePass').setValue(true);
				}

			}
		},
		items : [{
			xtype : 'form',
			layout : {
				type:'table',
				columns:2
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
				colspan:2
			},
			items : [{
				fieldLabel : '用户名',
				id : 'Username',
				stateful:false,
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
			},{
				fieldLabel : '登录密码',
				id : 'Password',
				stateful:false,
				colspan:1,
				value : '',
				width:230,
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
					change: function(fil,nVal,oVal,opts) {
						win.down('#hpassword').setValue(nVal);
					}
				}
				// blankText: "登录密码不能为空"
			},{
				xtype : 'checkboxfield',
				colspan:1,
				margin : '2 0 0 1',
				name : 'savePass',
				boxLabel : '保存密码'
			},{
				xtype:'hidden',
				id:'hpassword',
				stateful:false,
				value:''
			},{
				xtype:'combo',
				queryMode:'local',
				store:'languageStore',
				value:lang_type,
				editable:false,
				fieldLabel:'语言',
				disabled:onLanguageChange?false:true,
				displayField: 'lName',
				valueField: 'lid',
				//labelWidth:40,
				width:230,
				listeners: {
					change: function(comb,nVal,oVal,opts) {
						if(nVal == '0') {
							//zh-cn
							Ext.util.Cookies.set("ws_language", '0',new Date(new Date().getTime()+ (1000 * 60 * 60* 24 * 30)));
							window.location.reload();
							return;
						}
						if(nVal == '1') {
							//en
							Ext.util.Cookies.set("ws_language", '1',new Date(new Date().getTime()+ (1000 * 60 * 60* 24 * 30)));
							window.location.reload();
							return;
						}
					}
				}
			},{
				xtype : 'panel',
				layout : {
					type : 'table',
					columns : 2
				},
				style : {
					'background-color' : 'transparent',
					'border' : '0px'
				},
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
							//判断是否有cookie
							passtext = win.down('#hpassword').getValue();

							if (form.isValid()) {

								//loginLoading = new Ext.LoadMask(Ext.getBody(), {
								//	msg:'正在验证登录信息，请稍候...'
								//});

								Ext.getBody().mask('正在验证登录信息，请稍候...');
								//loginLoading.show();
								// param.server =
								// form.findField('ServerAddress').value;
								var param = {};
								param.username = form.findField('Username').value;
								param.password = passtext;
								// param.req = 'call';

								// 调用
								WsCall.call('userlogin', param, function(
								response, opts) {
									Ext.getBody().unmask();
									//loginLoading.hide();
									Ext.getBody().mask('登录成功，正在加载用户数据，请稍候...');
									// loginLoading = new Ext.LoadMask(Ext.getBody(), {
									// msg:'登录成功，正在加载用户数据，请稍候...'
									// });
									// loginLoading.show();
									(new Ext.util.DelayedTask()).delay(50, function() {

										// if(FolderTree1) {
										// FolderTree1.getStore().getProxy().extraParams.sessiontoken = Ext.util.Cookies
										// .get("sessiontoken"); // 设置sessiontoken
										// //FolderTree1.getStore().load();
										// }
										// if(addressTree1) {
										// addressTree1.getStore().getProxy().extraParams.sessiontoken = Ext.util.Cookies
										// .get("sessiontoken");
										// //addressTree1.getStore().load();
										// }
										var data = Ext.JSON.decode(response.data);
										//sessionToken = response.data;

										sessionToken = data.sessionToken;

										//Ext.util.Cookies.set("ws_userInfo", param.username,new Date(new Date().getTime()+ (1000 * 60 * 60* 24 * 30)));
										//userInfo = Ext.util.Cookies.get("ws_userInfo");
										if (sessionToken != '') {
											var locHref = location.href;
											var baseUrl;
											if(locHref.indexOf('?') != -1) {
												baseUrl = locHref.substr(0,locHref.lastIndexOf('?'));
											} else {
												baseUrl = locHref;
											}

											var lastUrl = "";
											locHref = locHref.substr(locHref.lastIndexOf('?'),locHref.length);
											var myArr = locHref.split('&');
											//sessionToken = data.sessionToken;
											var fileId;
											if(myArr.length == 2) {
												//sessionToken = myArr[1].split('=')[1];
												fileId = myArr[0].split('=')[1];
												lastUrl = "?fileId="+fileId+"&sessiontoken="+sessionToken+"";
											} else if(myArr.length == 1) {
												//sessionToken = myArr[0].split('=')[1];
												lastUrl = "?sessiontoken="+sessionToken+"";
											}
											if (savepass.getValue()) {

												Ext.util.Cookies.set('ws_password',data.password,new Date(new Date().getTime()+ (1000* 60* 60* 24 * 30)));
												Ext.util.Cookies.set('ws_checksavepass',1,new Date(new Date().getTime()+ (1000* 60* 60* 24 * 30)));
											} else {
												Ext.util.Cookies.clear('ws_password');
												Ext.util.Cookies.clear('ws_checksavepass');
											}
											window.location.href = baseUrl+lastUrl;
										} else {
											// if(loginLoading && loginLoading.hide) {
											// loginLoading.hide();
											// }
											Ext.getBody().unmask();
											if(!errorProcess(response.code)) {
												Ext.Msg.alert('登录失败', response.msg);
											}
										}

									});
								}, function(response, opts) {
									// if(loginLoading && loginLoading.hide) {
									// loginLoading.hide();
									// }
									Ext.getBody().unmask();
									if(!errorProcess(response.code)) {
										Ext.Msg.alert('登录失败', response.msg);
									}
								}, false);
							}
						}
					}
				},{
					xtype : 'button',
					text : '取消',
					itemId : 'Cancel',
					handler : function() {
						window.location.reload();

					}
				}]

			}]
		}]
	});
	//自动完成
	acSelItemsControl.createAcDiv();
	// tooltip
	Ext.tip.QuickTipManager.init();

	//设置弹出对话框的文字
	newMesB.buttonText.yes = '是';
	newMesB.buttonText.no = '否';
	newMesB.buttonText.ok = '确定';
	newMesB.buttonText.cancel = '取消';

	//重写alert
	Ext.override(Ext.window.MessageBox, {
		alert: function(cfg, msg, fn, scope) {
			if (Ext.isString(cfg)) {
				cfg = {
					title : cfg,
					msg : msg,
					buttons: this.OK,
					fn: fn,
					scope : scope,
					minWidth: this.minWidth <250?250:this.minWidth
				};
			}
			return this.show(cfg);
		}
	});

	// 调用
	// WsCall.call('userlogin', param, function(
	// response, opts) {
	(new Ext.util.DelayedTask()).delay(50, function() {
		//var data = Ext.JSON.decode(response.data);
		//sessionToken = response.data;

		var locHref = window.location.search;
		locHref = locHref.substr(1,locHref.length);
		var myArr = locHref.split('&');
		//sessionToken = data.sessionToken;
		var fileId;
		var faxnumber;
		var nextFlag = true;

		function nextFun() {
			if (sessionToken && sessionToken != '') {
				loginOK(sessionToken, function() {
					if(faxforwardwin == '') {
						faxforwardwin = Ext.create('WS.infax.InForward', {});
					}
					Ext.util.Cookies.set("ws_userInfo",userInfoData.accountName,new Date(new Date().getTime()+ (1000 * 60 * 60* 24 * 30)));
					userInfo = Ext.util.Cookies.get("ws_userInfo");
					sendfaxwin = loadsendfaxwin();

					sendfaxwin.fireEvent('show',sendfaxwin);
					sendfaxwin.el.dom.style.top="0px";
					//alert(sendfaxwin);

					if(fileId&&fileId !='') {
						sendFaxForward(fileId);
					}

					if(faxnumber&&faxnumber!='') {
						sendfaxwin.down('#faxNumber').setValue(faxnumber);
					}

					if(isSurportFlash) {
						if(sendfaxwin.faxFileUpload) {
							sendfaxwin.faxFileUpload.destroy();
						}
						var pal = sendfaxwin.down('#replacePal');
						pal.removeAll();

						pal.add({
							xtype:'container',
							frame:false,
							itemId:'spanButtonPlaceholder',
							listeners: {
								afterrender: function(com) {
									initFaxUpload(sendfaxwin);
								}
							}
						});
					} else {
						sendfaxwin.down('#replacePal').hide();
						sendfaxwin.down('#filePath').show();
					}

				}, function() {
					Ext.Msg.alert('失败', function() {
						win.show();
					});
				},false);//loginok
			} else {
				win.show();
			}
		}

		Ext.Array.each(myArr, function(item,index,alls) {
			var tmpStr = item.split('=');
			if(tmpStr[0] == 'sessiontoken') {
				sessionToken = tmpStr[1];
			}
			if(tmpStr[0] =='fileId') {
				fileId =tmpStr[1];
			}
			if(tmpStr[0] =='faxnumber') {
				faxnumber = tmpStr[1];
			}
			if(tmpStr[0] =='ticket') {
				nextFlag = false;
				//调用call 重新获取sessionToken
				var param = {};
				//param.sessiontoken = sessionToken;
				param.ticket = tmpStr[1];
				// 调用
				WsCall.call('getrightsessiontoken', param, function(response, opts) {
					sessionToken = response.data;
					nextFun();
				}, function(response, opts) {
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
				}, true);
			}
		});
		// if(myArr.length == 2) {
		// sessionToken = myArr[1].split('=')[1];
		// fileId = myArr[0].split('=')[1];
		// } else if(myArr.length == 1) {
		// sessionToken = myArr[0].split('=')[1];
		// }

		//Ext.util.Cookies.set("ws_userInfo", param.username,new Date(new Date().getTime()+ (1000 * 60 * 60* 24 * 30)));
		//userInfo = Ext.util.Cookies.get("ws_userInfo");
		if(nextFlag) {
			nextFun();
		}

	});
	// }, function(response, opts) {
	// if(!errorProcess(response.code)) {
	// Ext.Msg.alert('登录失败', response.msg);
	// }
	// }, false);
});