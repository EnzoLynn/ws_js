//文件上传function
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
		setPngMiniWH(winType.pngClass,winType,'');

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

//测试用combobox stroe
// var testComboStates = Ext.create('Ext.data.Store', {
// fields: ['abbr', 'name'],
// data: [{
// "abbr": "test1",
// "name": "test1"
// },{
// "abbr": "test2",
// "name": "test2"
// },{
// "abbr": "test3",
// "name": "test3"
// }
// ]
// });

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

//addressGird action用发送传真

//infaxGrid action用转发传真	 收件箱回复传真   type 1转发 2通讯录 3回复 4草稿箱
function sendFaxForward(sm,type,otherRecArr) {
	//是否不添加原文档
	var supressAdd = false;
	var records = sm.getSelection();
	//发送传真
	// if (sendfaxwin == '') {
	// sendfaxwin = loadsendfaxwin();
	// } //if
	// else {
	// sendfaxwin.expand();
	// }
	//sendfaxwin.show();
	if(sendfaxwin.collapsed) {
		sendfaxwin.fireEvent('hide',sendfaxwin);
		sendfaxwin.expand();
	} else {
		sendfaxwin.fireEvent('hide',sendfaxwin);
		sendfaxwin.show();
		// sendfaxwin.fireEvent('show',sendfaxwin);
		// var top = document.body.clientHeight - sendfaxwin.getHeight();
		// top = top < 0 ?10:top/2;
		// var left = document.body.clientWidth - sendfaxwin.getWidth();
		// left = left < 0 ?10:left/2;
		// sendfaxwin.el.dom.style.left=left+"px";
		// sendfaxwin.el.dom.style.top=top+"px";
		// sendfaxwin.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
	}

	if(type ==2) {
		sendfaxwin.down('#faxNumber').setValue(otherRecArr[0].faxNumber);
		sendfaxwin.down('#subNumber').setValue(otherRecArr[0].faxNumberExt);
		sendfaxwin.down('#faxReceiver').setValue(otherRecArr[0].dispName);
		sendfaxwin.down('#e-mail').setValue(otherRecArr[0].email);
		sendfaxwin.down('#mobile').setValue(otherRecArr[0].mobileNumber);
		sendfaxwin.down('#organization').setValue(otherRecArr[0].organization);

		sendfaxwin.down('#faxNumber').fireEvent("blur", sendfaxwin.down('#faxNumber'));
		if(otherRecArr.length > 1) {
			var store = Ext.StoreMgr.lookup('linkmenGridStore');
			Ext.Array.each(otherRecArr, function(item,index) {
				if(index == 0) {
					return;
				}
				var faxNum = covertToRightNumber(true,item.faxNumber);
				if(store.findRecord('faxNumber',faxNum) == null) {
					var r = Ext.ModelManager.create({
						dispName: item.dispName,
						faxNumber: faxNum,
						faxNumberExt:item.faxNumberExt,
						mobileNumber: item.mobileNumber,
						email: item.email,
						organization:item.organization,
						spareFaxNumber:item.spareFaxNumber
					}, 'WS.tbnorth.superaddModel');
					store.insert(0, r);
				}
			});
			//追加联系人用Array
			LinkMenArr = new Array();
			var smRecs = store.getRange();
			Ext.Array.each(smRecs, function(rec,index,allrecs) {
				var linkmanClass = {
					faxNumber:rec.data.faxNumber,
					subNumber:rec.data.faxNumberExt,
					faxReceiver:rec.data.dispName,
					email:rec.data.email,
					mobile:rec.data.mobileNumber,
					organization:rec.data.organization
				};
				LinkMenArr.push(linkmanClass);
			});
			if(LinkMenArr.length > 0) {
				sendfaxwin.down('#btnSuperadd').setText('追加收件人     已追加收件人:'+LinkMenArr.length+'位' );
			}
		}
		return;
	}

	if(type ==3) {
		//判断是否需要添加原文档
		supressAdd = !userConfig.addSource;
		sendfaxwin.revertFax = true;
		sendfaxwin.Edit = false;
		if(records[0].data.duration > 0) {//外部传真
			var fNum = records[0].data.callerID;

			sendfaxwin.down('#faxNumber').setValue(fNum);
			sendfaxwin.down('#faxNumber').fireEvent("blur", sendfaxwin.down('#faxNumber'));
		} else {
			sendfaxwin.reveUser = '';
			var param = {};
			param.userid = records[0].data.waveFaxUserID;//sendfaxwin.reveUserid;
			param.sessiontoken = sessionToken;
			// 调用
			WsCall.call('getuserinfobyid', param, function(response, opts) {

				var data = Ext.JSON.decode(response.data);
				var userName = data.userName;
				var udName = userName.length>0?data.accountName+'('+userName+')':data.accountName
				var r = Ext.ModelManager.create({
					udID: 'user_'+data.userID,
					udName: udName,
					dtmf: data.dtmf,
					udType: 'user'
				}, 'WS.user.userdicModel');
				sendfaxwin.reveUser = r;
				sendfaxwin.down('#btnFaxInfoward').setText('内部传真     已选择用户:'+'1'+'位'+'  '+data.accountName+'&nbsp;&nbsp;&nbsp;&nbsp;'+'文件夹:'+'0'+'个'+' '+'');
				var ids = [''+data.userID+''];
				sendfaxwin.down('#hidFaxIDS').setValue(Ext.JSON.encode(ids));
				//faxforwardwin.down('#ugTargetId').getStore().add(r);
			}, function(response, opts) {
			}, false);
			//sendfaxwin.reveUserid = records[0].data.waveFaxUserID;
		}
	}

	if(type == 4) {
		draftIDsArr = new Array();
		draftIDsArr.push(records[0].data.draftID);
		faxforwardwin.isDraft = true;
		sendfaxwin.down('#faxNumber').setValue(records[0].data.faxNumber);
		sendfaxwin.down('#subNumber').setValue(records[0].data.faxNumberExt);
		sendfaxwin.down('#faxReceiver').setValue(records[0].data.recipient);
		sendfaxwin.down('#faxSubject').setValue(records[0].data.subject);
	}

	//设置sendfaxwin 为内部转发
	//sendfaxwin.isInforward = true;

	//禁用上传
	//sendfaxwin.down('#filePath').setDisabled(true);

	if(supressAdd) {
		return;
	}

	var d = new Date();
	var ranId = "";
	ranId += d.getYear();
	ranId += d.getMonth();
	ranId += d.getDate();
	ranId += d.getHours();
	ranId += d.getMinutes();
	ranId += d.getSeconds();

	var param = {
		fileId:records[0].data.faxFileID,
		randomId:'tmp'+ranId
	};
	param.sessiontoken = sessionToken;

	WsCall.call('maketempfax', param, function (response, opts) {

		//sendfaxwin.getEl().mask('正在生成传真图...');
		//callMask = new Ext.LoadMask(sendfaxwin.getEl(), {
		//msg: "正在生成缩略图..."
		//});
		//callMask.show();
		//加载已选择的文件数据
		var maskTarget = sendfaxwin.down('#formFileId');
		var hidForm = sendfaxwin.down('#hidFileId');
		var hidLoaded = sendfaxwin.down('#hidLoaded');
		hidForm.setValue('tmp'+ranId);

		var progressBar = sendfaxwin.getComponent('bottomStatusBar').getComponent('bottomProgressBar');
		var btnCancel = sendfaxwin.getComponent('bottomStatusBar').getComponent('btnCancel');
		var btnContinue = sendfaxwin.getComponent('bottomStatusBar').getComponent('btnContinue');
		btnCancel.hide();
		btnContinue.hide();
		//btnCancel.setDisabled(false);
		sendfaxwin.pngClass = new filepngviewclass();
		sendfaxwin.down('#filePath').setValue('tmp'+ranId);
		sendfaxwin.pngClass.setFaxFileId('tmp'+ranId);
		//初始化图片浏览panel
		hidLoaded.setValue('1');
		sendfaxwin.pngClass.initMyfilepngMini(maskTarget, hidLoaded,0,'tmp'+ranId, function() {
			setPngMiniWH(sendfaxwin.pngClass,sendfaxwin,'');
		});
		//设置前后插入等按钮状态
		ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
		if(hidForm.getValue() == '') {
			sendfaxwin.down('#txtMiniCurrPage').setDisabled(true);
		} else {
			sendfaxwin.down('#txtMiniCurrPage').setDisabled(false);
		}

	}, function() {

	},true,'正在转换...',sendfaxwin.getEl(),10);
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
		//frame: true,
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
			//bodyCls: 'panelFormBg',
			frame: false,
			border: false,
			margin: '5 5 0 5'
		},
		items: [{
			defaults: {
				xtype: 'fieldset',
				frame: false,
				//border: false,
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
									//userConfig.printerSrc=myForm.down('#printerSrc').getValue();//发送选项—打印机来源

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
				margin: '13 0 0 0',
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
			}]
		}],
		buttons:[{
			xtype: 'button',
			text: '确定',
			handler: function () {
				var me = this;
				var myForm = me.up('window').down('form');

				if(myForm.down('#ifSetSendTime').getValue()) {
					var hid_sendUTCTime = myForm.down('#sendUTCTime');
					var date = Ext.util.Format.date(myForm.down('#sendDate').getValue(), 'm/d/Y');
					var strTime = date +" "+myForm.down('#sendTimeHouer').getValue()+":"+myForm.down('#sendTimeMin').getValue()+":"+myForm.down('#sendTimeSec').getValue();
					hid_sendUTCTime.setValue(LocalDateToLongUTCstr(new Date(Date.parse(strTime))));
				}

				var form = myForm.getForm();
				if (form.isValid()) {

					form.submit({
						url: WsConf.Url + "?req=call&callname=setsendfaxconfig&sessiontoken="+ Ext.util.Cookies.get("sessiontoken") + "",
						success: function (form, action) {
							//Ext.Msg.alert('成功', '成功');
							if (sendfaxconfigwin) {
								sendfaxconfigwin.hide();
							}
							//userConfig.printerSrc=sendfaxwin.down('#printerSrc').getValue();//发送选项—打印机来源
							//									var tmpStr = getSendRoleStr();
							sendfaxwin.down('#lblMessage').setText('<span><b>'+'当前国家代码'+':</b>'+userConfig.countryCode+'  <b>'+'区号'+':</b>'+userConfig.areaCode+'</span>');
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

			function continueSubmitfax(param) {
				//调用
				WsCall.call('submitFaxSend', param, function (response, opts) {
					Ext.Msg.alert('成功', '提交传真成功！');
					LinkMenArr = new Array();
					draftIDsArr = new Array();
					if (sendfaxwin != '') {
						var param1 = {};
						param1.fileId = me.up('window').down('#hidFileId').getValue();
						param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
						sendfaxwin.isSend = true;
						sendfaxwin.hide();
						//sendfaxwin.fireEvent('beforehide',sendfaxwin);
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

				param.tplid = sendfaxwin.tplid;
				param.tplstr = sendfaxwin.tplstr;

				param.userIDs = me.up('window').down('#hidFaxIDS').getValue();
				param.dirIDs = me.up('window').down('#hidDirIDS').getValue();
				if(draftIDsArr && draftIDsArr.length > 0) {
					param.draftIDs =  Ext.JSON.encode(draftIDsArr);
				}
				param.faxpaperid = sendfaxwin.faxpaperid;

				if(sendfaxwin.revertFax && !sendfaxwin.edit) {
					newMesB.show({
						title:'提示',
						msg: '文件未作任何编辑，是否继续提交？',
						buttons: Ext.MessageBox.YESNO,
						closable:false,
						fn: function(btn) {
							if(btn=='yes') {
								continueSubmitfax(param);
							} else {
								return;
							}
						},
						icon: Ext.MessageBox.QUESTION
					});
				} else {
					continueSubmitfax(param);
				}
			}

			//判断 提交 附件信息 加盖传真纸
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
					submitwfwin = loadsubmitwfwin(false,false,sendfaxwin.faxpaperid);
					submitwfwin.fileId = fileId;
					submitwfwin.issendfaxwin = true;
					submitwfwin.show();
				} else {
					Ext.Msg.alert('提示','没有可用的任务规则');
				}
			});
			store.getProxy().extraParams.listall = true;
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
			faxforwardwin.down('#rdDic').setDisabled(false);
			faxforwardwin.down('#rdUser').setValue(true);
			//faxforwardwin.down('#dirTab').setDisabled(false);
			faxforwardwin.setWidth(900);
			faxforwardwin.setTitle('本地内部传真');
			faxforwardwin.show(null, function() {
				faxforwardwin.center();

				faxforwardwin.down('#ugTargetId').setTitle('到用户(共享文件夹)');
				faxforwardwin.down('#forwarUserDic').setTitle('到目标');

				//判断是否为回复
				if(sendfaxwin.revertFax) {
					sendfaxwin.revertFax = false;
					if(sendfaxwin.reveUser != '') {
						faxforwardwin.down('#ugTargetId').getStore().add(sendfaxwin.reveUser);
						sendfaxwin.reveUser = '';
					}
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
							successProperty: 'success',
							messageProperty: 'msg'
						},
						actionMethods: 'POST'
					},
					root: {
						expanded: true,
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
				var serF = faxforwardwin.down('#serFielID');
				serF.store = faxforwardwin.down('#userID').getStore();
				serF.reset();
				serF.onTrigger1Click();
				faxforwardwin.down('#isDelID').setVisible(false);
				faxforwardwin.down('tabpanel').setActiveTab('forwarUserDic');

			});
		}
	}
	// ,'->'
	// ,{
	// xtype:'tbtext',
	// padding:'5 5 2 0',
	// text:'<a href="wsdownload/wsprinter.exe">下载WaveFax打印机</a>'
	// //html:'<a href="wsdownload/wsprinter.exe">下载WaveFax打印机</a>'
	// }
	]
});

//发送传真用win
function loadsendfaxwin() {
	return Ext.create('Ext.window.Window', {
		title: "<span><img src='resources/images/fax/status/outstatus.5.png' style='margin-bottom: -5px;'/>"+'提交发送传真'+"</span>",
		height: 554,
		modal:true,
		closeAction:'hide',
		shadow:!Ext.isIE,
		closable:false,
		faxpaperid:'0',
		pngClass:'',
		pngGroup:'sendfax',
		defaultFitPng:true,
		tplid:'none',
		tplstr:'',
		runner:false,
		tools: [{
			type: 'close',
			handler: function() {
				sendfaxwin.hide();
				//sendfaxwin.fireEvent('beforehide',sendfaxwin);
			}
		}],
		hideMode:'offsets',
		width: 910,
		layout: 'anchor',
		collapsible: false,
		//modal:true,
		resizable: false,
		frame: false,
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
				type: 'hbox'
			},
			defaults: {
				xtype: 'textfield',
				labelAlign: 'right',
				margin: '5 0 2 10',
				labelPad: 1,
				labelWidth: 0,
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
						hideFlash(sendfaxwin);
					}
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
						hideFlash(sendfaxwin);
					}
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
						if(template.tplGridArr.length == 0) {
							Ext.Msg.alert('消息','当前无任何可用模版');
							return;
						}

						loadTemplateWin( function(record) {
							var tplId = record.data.tplId;
							template.tplidState =tplId;
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
					return true;
					//sendfaxwin.fireEvent('hide',sendfaxwin);
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
								return false;
							} else {
								sendfaxwin.myhideType = 1;
								var param1 = {};
								param1.fileId = hidForm.getValue();
								param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
								sendfaxwin.hide();
								//sendfaxwin.fireEvent('hide',sendfaxwin);
								//调用
								WsCall.call('deleteTempFiles', param1, function (response, opts) {

								}, function (response, opts) {

								}, true);
								//sendfaxwin = '';
								return true;
							}
						},
						icon: Ext.MessageBox.QUESTION
					});
					return false;
				} else {
					return true;
					//sendfaxwin.fireEvent('hide',sendfaxwin);
				}

			},
			hide: function() {
				//sendfaxwin.setPosition(-1000,-1000);
				sendfaxwin.myhideType = 0;

				sendfaxwin.isSend = false;
				faxforwardwin.isDraft = false;
				sendfaxwin.revertFax = false;
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
					if(hidForm.getValue() == '') {
						sendfaxwin.down('#txtMiniCurrPage').setDisabled(true);
					} else {
						sendfaxwin.down('#txtMiniCurrPage').setDisabled(false);
					}
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
				//unlockWindowAfSF();
				if(sendfaxwin.faxFileUpload) {
					sendfaxwin.faxFileUpload.destroy();
				}
				var pal = sendfaxwin.down('#replacePal');

				pal.removeAll();
				//alert(2);

				//加载flash
				pal.add({
					xtype:'container',
					frame:false,
					itemId:'spanButtonPlaceholder',
					listeners: {
						render: function(com) {
							initFaxUpload(sendfaxwin);
						}
					}
				});

			},
			destroy: function () {
				sendfaxwin = '';
				if(sendfaxconfigwin != '') {
					sendfaxconfigwin.close();
				}
			},
			show: function (win, opts) {

				var top = document.body.clientHeight - sendfaxwin.getHeight();
				top = top < 0 ?10:top/2;
				var left = document.body.clientWidth - sendfaxwin.getWidth();
				left = left < 0 ?10:left/2;
				win.el.dom.style.left=left+"px";
				win.el.dom.style.top=top+"px";

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
				if(win.down('#hidFileId').getValue() == '') {
					win.down('#txtMiniCurrPage').setDisabled(true);
				} else {
					win.down('#txtMiniCurrPage').setDisabled(false);
				}
				win.down('#headerWelcome').hide();
				win.down('#serverInfo').hide();
				win.down('#historyMes').hide();
				win.down('#personRole').hide();
				//				var tmpStr = getSendRoleStr();
				win.down('#lblMessage').setText('<span><b>'+'当前国家代码'+':</b>'+userConfig.countryCode+'  <b>'+'区号'+':</b>'+userConfig.areaCode+'</span>');
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
				//清空内部转发附件列表
				//faxforwardwin.down('#tabpalFiles').setDisabled(false);
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

				// if(faxFileUpload) {
					// faxFileUpload.destroy();
				// }
// 
				// var pal = win.down('#replacePal');
				// pal.removeAll();
				// //alert(2);
// 
				// //加载flash
				// pal.add({
					// xtype:'container',
					// frame:false,
					// itemId:'spanButtonPlaceholder',
					// listeners: {
						// render: function(com) {
							// initFaxUpload(win);
						// }
					// }
				// });

				//alert(5);
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

				sendfaxwin.down('#btnTemplate').setText('录入表单数据');

				win.down('#panelfilepngview').doLayout();

				// win.down('baseviewpanel').setBodyStyle({
				// 'background-image':'url(resources/images/faxbg.png)',
				// 'background-repeat': 'no-repeat'
				// });

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