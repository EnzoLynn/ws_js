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
		// if(loginLoading && loginLoading.hide) {
			// loginLoading.hide();
		// }
		Ext.getBody().unmask();
		if (okfun)
			okfun();
	}, false);
}

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
		// if(loginLoading && loginLoading.hide) {
			// loginLoading.hide();
		// }
		Ext.getBody().unmask();
		errorProcess(response.code);
		//Ext.Msg.alert('加载失败', response.msg);
	}, false);
}

//服务器信息对应form
function loadBsbwServerInfowin() {
	return Ext.create('Ext.window.Window', {
		title: '服务器信息',
		iconCls: 'serverInfo',
		bodyPadding: 5,
		height: 400,
		width: 900,
		border: false,
		//bodyCls: 'panelFormBg',
		resizable: false,
		layout:'fit',
		items: [{
			xtype: 'form',
			//bodyCls: 'panelFormBg',
			border: false,
			layout: {
				type: 'table',
				columns: 2
			},
			defaults: {
				xtype: 'displayfield',
				width: 440,
				labelWidth:260,
				labelAlign: 'right',
				labelStyle: 'color:#424292;font-weight:bold;'
			},
			items: [{
				fieldLabel: '当前登录用户',
				itemId: 'currUser',
				name: 'currUser',
				value: ''
			},{
				fieldLabel: '所属组织',
				itemId: 'userOrg',
				name: 'userOrg',
				value: ''
			},{
				html: '<br/>',
				width:500,
				colspan: 2
			},{
				fieldLabel: '传真发送线路数',
				itemId: 'faxLineCount',
				name: 'faxLineCount',
				value: ''
			},{
				fieldLabel: '传真/语音邮件接收线路数',
				itemId: 'faxInlineCount',
				name: 'faxInlineCount',
				value: ''
			},{
				fieldLabel: '最大在线用户数',
				itemId: 'onlineUserCount',
				name: 'onlineUserCount',
				value: '',
				colspan:2
			},{
				html: '<br/>',
				width: 500,
				colspan: 2
			},{
				fieldLabel: '接收语音邮件功能',
				itemId: 'receiveVoice',
				name: 'receiveVoice',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				fieldLabel: '接收手机短信功能',
				itemId: 'receiveMessage',
				name: 'receiveMessage',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				fieldLabel: '发送手机短信功能',
				itemId: 'sendMessage',
				name: 'sendMessage',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				fieldLabel: '工作流功能',
				itemId: 'workFlow',
				name: 'workFlow',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				fieldLabel: '传真签章功能',
				itemId: 'faxSign',
				name: 'faxSign',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				fieldLabel: '条码功能',
				itemId: 'faxCode',
				name: 'faxCode',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				fieldLabel: '表单数据功能',
				itemId: 'formData',
				name: 'formData',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				fieldLabel: '文档管理功能',
				itemId: 'wordManager',
				name: 'wordManager',
				value: '',
				listeners: {
					change: function (disfield, nVal, oVal, opts) {
						if (nVal == "0" && nVal != oVal) {
							disfield.setValue('支持');
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue('不支持');
							return;
						}
					}
				}
			},{
				html: '<br/>',
				width: 500,
				colspan: 2
			},			
			{
				fieldLabel: '服务器集群ID',
				itemId: 'serverGroupId',
				name: 'serverGroupId',
				value: ''
			},{
				fieldLabel: '文件服务器信息',
				itemId: 'fileServerInfo',
				name: 'fileServerInfo',
				value: ''
			},{
				fieldLabel: '服务器信息',
				itemId: 'serverInfo',
				name: 'serverInfo',
				value: ''
			}]
		}],
		listeners: {
			destroy: function () {
				bsbwServerInfowin = '';
			}
		}

	}).show();
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

//个人权限信息对应form
function loadBsbwPersonRolewin() {
	return Ext.create('Ext.window.Window', {
		title: '个人权限信息',
		iconCls: 'personRole',
		bodyPadding: 5,
		height: 440,
		width: 700,
		border: false,
		//bodyCls: 'panelFormBg',
		resizable: false,
		layout: 'fit',
		items: [{
			xtype: 'form',
			//bodyCls: 'panelFormBg',
			border: false,
			layout: {
				type: 'table',
				columns: 2
			},
			defaults: {
				xtype: 'displayfield',
				width: 330,
				labelWidth: 5,
				listeners: {
					change: function (disfield, nVal, oVal, opts) {

						if (nVal == "0" && nVal != oVal) {
							disfield.setValue("<div><img src='resources/images/grid/okFax.png' style='margin-bottom: -5px;'/> " + disfield.getFieldLabel() + "</div>");
							return;
						}
						if (nVal == "1" && nVal != oVal) {
							disfield.setValue("<div><img src='resources/images/grid/cancelFax.png' style='margin-bottom: -5px;'/> " + disfield.getFieldLabel() + "</div>");
							return;
						}

					}
				}
				//labelAlign: 'right',
				//labelStyle: 'color:#424292;font-weight:bold;'
			},
			items: [{
				value: '<b>'+'您的帐号拥有的权限信息'+':</b>',
				colspan: 2,
				listeners: {
					render: function () {
					}
				}
			},{
				fieldLabel: '发送内部传真',
				hideLabel: true,
				itemId: 'sendInbox',
				name: 'sendInbox',
				value: ''
			},{
				fieldLabel: '发送本地传真',
				hideLabel: true,
				itemId: 'sendLocal',
				name: 'sendLocal',
				value: ''
			},{
				fieldLabel: '发送长途传真',
				hideLabel: true,
				itemId: 'sendLdis',
				name: 'sendLdis',
				value: ''
			},{
				fieldLabel: '发送国际传真',
				hideLabel: true,
				itemId: 'sendInter',
				name: 'sendInter',
				value: ''
			},{
				fieldLabel: '发送短信',
				hideLabel: true,
				itemId: 'sendMessage',
				name: 'sendMessage',
				value: '',
				colspan: 2
			},{
				html: '<hr/>',
				width: 700,
				colspan: 2
			},{
				fieldLabel: '接收传真',
				hideLabel: true,
				itemId: 'receiveFax',
				name: 'receiveFax',
				value: ''
			},{
				fieldLabel: '接收语音邮件',
				hideLabel: true,
				itemId: 'receiveVoice',
				name: 'receiveVoice',
				value: ''
			},{
				fieldLabel: '接收短信',
				hideLabel: true,
				itemId: 'receiveMessage',
				name: 'receiveMessage',
				value: '',
				colspan: 2
			},{
				html: '<hr/>',
				width: 700,
				colspan: 2
			},{
				fieldLabel: '邮件通报',
				hideLabel: true,
				itemId: 'mailReport',
				name: 'mailReport',
				value: ''
			},{
				fieldLabel: '语音邮件通报',
				hideLabel: true,
				itemId: 'voiceReport',
				name: 'voiceReport',
				value: ''
			},{
				fieldLabel: '短信通报',
				hideLabel: true,
				itemId: 'messageReport',
				name: 'messageReport',
				value: ''
			},{
				fieldLabel: '打印通报',
				hideLabel: true,
				itemId: 'printReport',
				name: 'printReport',
				value: ''
			},{
				html: '<hr/>',
				width: 700,
				colspan: 2
			},{
				fieldLabel: '能够使用工作流',
				hideLabel: true,
				itemId: 'workFlow',
				name: 'workFlow',
				value: ''
			},{
				fieldLabel: '提交传真时,强制使用工作流',
				hideLabel: true,
				itemId: 'forceWorkFlow',
				name: 'forceWorkFlow',
				value: ''
			},{
				fieldLabel: '允许进行工作流审批',
				hideLabel: true,
				itemId: 'allowWorkFlow',
				name: 'allowWorkFlow',
				value: ''
			},{
				fieldLabel: '自定义工作流规则',
				hideLabel: true,
				itemId: 'customWorkFlow',
				name: 'customWorkFlow',
				value: ''
			},{
				fieldLabel: '提交工作流任务只能被直属上级审批',
				hideLabel: true,
				itemId: 'underComit',
				name: 'underComit',
				value: '',
				colspan: 2
			},{
				html: '<hr/>',
				width: 700,
				colspan: 2
			},{
				fieldLabel: '邮件方式提交发送传真',
				hideLabel: true,
				itemId: 'mailType',
				name: 'mailType',
				value: ''
			},{
				fieldLabel: '使用电子图章',
				hideLabel: true,
				itemId: 'signEle',
				name: 'signEle',
				value: ''
			},{
				fieldLabel: '管理WaveFax电子图章',
				hideLabel: true,
				itemId: 'signEleManager',
				name: 'signEleManager',
				value: ''
			}]
		}],
		listeners: {
			destroy: function () {
				bsbwPersonRolewin = '';

			}
		}

	}).show();
}