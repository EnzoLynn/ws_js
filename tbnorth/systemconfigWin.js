//计算位值函数
function calcNotifiConst(value,fieldBit) {
	return (value&fieldBit) !=0;
}

//=====================================================================================//
//=============================插入变量win gird    store    ================================//
//=====================================================================================//
Ext.create('Ext.data.Store', {
	//model: 'defaultgridModel',
	storeId: 'insertVarGirdStoreId',
	fields: [{
		name:'varName',
		type:'string'
	},{
		name: 'varValue',
		type: 'string'
	}
	],
	autoLoad: true,
	pageSize: 20,
	data: [{
		varName: '发送者的名字',
		varValue: "[SenderName]"
	},{
		varName: '发送者的传真号号码',
		varValue: "[SenderFaxNumber]"
	},{
		varName: '发送者的电话号码',
		varValue: "[SenderPhoneNumber]"
	},{
		varName: '发送者的组织名称',
		varValue: "[SenderOrganization]"
	},{
		varName: '接收者的名字',
		varValue: "[RecipientName]"
	},{
		varName: '接收者的传真号号码',
		varValue: "[RecipientFaxNumber]"
	},{
		varName: '接收者的电话号码',
		varValue: "[RecipientPhoneNumber]"
	},{
		varName: '接收者的组织名称',
		varValue: "[RecipientOrganization]"
	},{
		varName: '主题',
		varValue: "[Subject]"
	},{
		varName: '发送日期',
		varValue: "[SendDate]"
	},{
		varName: '发送时间',
		varValue: "[SendTime]"
	},{
		varName: '当前页号',
		varValue: "[PageIndex]"
	},{
		varName: '总页数',
		varValue: "[Pages]"
	}
	]

});

//=====================================================================================//
//=============================插入变量win Grid             ================================//
//=====================================================================================//

Ext.define('ws.tbnorth.insertVarGird', {
	alternateClassName: ['insertVarGird'],
	alias: 'widget.insertVarGird',
	extend: 'Ext.grid.Panel',
	store: 'insertVarGirdStoreId',
	height:400,
	columns: [{
		text: '变量名称',
		dataIndex: 'varName',
		flex:0.5
	},{
		text: '变量数值',
		dataIndex: 'varValue' ,
		flex: 0.5
	}
	],
	listeners: {
		afterrender: function(grid,opts) {
			grid.getStore().on("load", function () {
				if (grid.getStore().totalCount > 0 && !grid.getSelectionModel().hasSelection()) {
					grid.getSelectionModel().select(0, true);
				}
			});
		}
	}

});

//安全连接
Ext.create('Ext.data.Store', {
	storeId: 'secTypeID',
	fields: ['typeId', 'typeName'],
	data : [{
		'typeId': '1' ,
		'typeName': '无'
	},{
		'typeId': '2',
		'typeName': 'TLS/SSL'
	},{
		'typeId': '3',
		'typeName': 'STARTTLS'
	}
	]
});

//缩略图尺寸
Ext.create('Ext.data.Store', {
	storeId: 'minipngSizeStore',
	fields: ['sizeId', 'sizeName'],
	data : [{
		'sizeId': '0' ,
		'sizeName': '小'
	},{
		'sizeId': '1',
		'sizeName': '大'
	}
	]
});

//系统设置面板
function loadsystemconfigwin_sys() {
	return Ext.create('Ext.window.Window', {
		title: '系统设置',
		iconCls: 'config',
		closeAction:'hide',
		isFistSysCon:true,
		closable:false,
		modal:true,
		shadow:!Ext.isIE,
		tools: [{
			type: 'close',
			handler: function() {
				systemconfigwin_sys.hide();
			}
		}],
		bodyPadding: 5,
		height: 450,
		width: 620,
		border: false,
		resizable: false,
		bodyBorder:true,
		layout: {
			type:'fit'
		},
		defaults: {
			border:false
		},
		items: [{
			xtype:'form',
			border:false,
			layout:'card',
			bodyBorder:false,
			defaults: {
				border: false,
				layout:'fit'
			},
			listeners: {
				fieldvaliditychange: function() {
					this.updateErrorState();
				},
				fielderrorchange: function() {
					this.updateErrorState();
				}
			},
			updateErrorState: function() {
				var me = this;
				var errors = [];
				var errorCmp = me.up('window').down('#formErrorState');
				var fields = me.getForm().getFields();
				fields.each( function(field) {
					Ext.Array.forEach(field.getErrors(), function(error) {
						errors.push({
							name: field.getFieldLabel(),
							error: error
						});
					});
				});
				errorCmp.setErrors(errors);
			},
			items:[{
				xtype:'tabpanel',
				itemId:'tabSys',
				plain: true,
				bodyBoder:false,
				border:false,
				defaults: {
					border: false,
					//bodyCls: 'panelFormBg',
					layout:'fit'
				},
				items:[{
					title:'系统设置',
					itemId:'systemCf',
					items:[{
						border: false,
						layout: {
							type: 'anchor'
						},
						defaults: {
							xtype: 'fieldset',
							layout: {
								type: 'table',
								columns: 2
							},
							width: 597,
							labelAlign: 'right'
						},
						items: [{
							title: '基本',
							defaults: {
								xtype: 'textfield',
								width: 300,
								labelWidth: 240,
								labelAlign: 'right'
							},
							items: [{
								xtype:'checkbox',
								boxLabel:'目录列出不可查看记录内容的文件夹',
								disabled:true,
								labelAlign: 'left',
								name:'listAll',
								itemId:'listAll',
								width:520,
								colspan:2,
								checked:userConfig.listAll
							},{
								xtype:'checkbox',
								//disabled:true,
								boxLabel:'回复传真时添加原文档',
								name:'addSource',
								itemId:'addSource',
								width:520,
								colspan:2,
								checked:userConfig.addSource
							},{
								xtype:'checkbox',
								//disabled:true,
								boxLabel:'表单数据输入界面显示文档图',
								name:'viewDocPic',
								itemId:'viewDocPic',
								width:520,
								colspan:2,
								checked:userConfig.viewDocPic
							},{
								xtype: 'numberfield',
								itemId: 'gridPageSize',
								name: 'gridPageSize',
								fieldLabel: '记录列表每页显示项目数(10--100)',
								maxText: '最大为100',
								minText: '最小为10',
								value: userConfig.gridPageSize,
								minValue: 10,
								maxValue: 100,
								allowBlank: false,
								blankText: '不能为空',
								colspan:2
							},{
								xtype: 'numberfield',
								itemId: 'autoReadSec',
								name: 'autoReadSec',
								fieldLabel: '设置已读标记延时(秒)',
								maxText: '最大为100',
								minText: '最小为1',
								value: userConfig.autoReadSec,
								minValue: 1,
								maxValue: 100,
								allowBlank: false,
								blankText: '不能为空',
								colspan:2
							},{
								xtype: 'numberfield',
								itemId: 'outfaxreSec',
								name: 'outfaxreSec',
								fieldLabel: '发件箱自动刷新间隔(秒)',
								maxText: '最大为3600',
								minText: '最小为5',
								value: userConfig.outfaxreSec,
								minValue: 5,
								maxValue: 3600,
								allowBlank: false,
								blankText: '不能为空',
								colspan:2
							},{
								xtype:'combo',
								fieldLabel:'缩略图尺寸',
								name: 'minipngSize',
								itemId: 'minipngSize',
								store: 'minipngSizeStore',
								queryMode : 'local',
								displayField : 'sizeName',
								valueField : 'sizeId',
								value:userConfig.miniPngSize,
								editable: false
							}]
						},{
							title:'工作流任务',
							items:[{
								xtype:'checkbox',
								disabled:true,
								boxLabel:'提交任务前先确认',
								name:'validateFront',
								itemId:'validateFront',
								checked:userConfig.validateFront

							}]

						},{
							title: '默认地区代码',
							style: {
								'margin-bottom':'2px'
							},
							defaults: {
								xtype: 'textfield',
								width: 200,
								labelWidth: 120,
								labelAlign: 'right'
							},
							items: [{
								fieldLabel: '国家代码',
								itemId: 'countryCode',
								name: 'countryCode',
								allowBlank: false,
								value: userConfig.countryCode,
								labelWidth: 150,
								blankText: '不能为空',
								regex: regexNumber,
								regexText: '请输入正确的数字格式！'
							},{
								fieldLabel: '城市区号',
								itemId: 'areaCode',
								name: 'areaCode',
								value: userConfig.areaCode,
								regex: regexNumber,
								regexText: '请输入正确的数字格式！'
							}]
						},{
							xtype:'button',
							width:200,
							text:'下载WaveFax打印机',
							handler: function() {
								var param = {
									downType: 'dlwfprt',
									path: 'wsdownload/wsprinter.exe',
									sessiontoken: getSessionToken()
								}
								WsCall.downloadFile('download', param);
							}
						}]
					}]//card0 items
				},{
					title:'邮件服务',
					itemId:'EmailService'	,
					layout: {
						type:'anchor'
					},
					defaults: {
						xtype: 'fieldset',
						layout: {
							type: 'table',
							columns: 2
						},
						width: 577,
						labelAlign: 'right'
					},
					items:[{
						title: '用户信息',
						defaults: {
							xtype: 'textfield',
							width: 320,
							labelWidth: 120,
							labelAlign: 'right'
						},
						items: [{
							fieldLabel:'您的姓名',
							name:'myUserName',
							itemId:'myUserName',
							value:userConfig.myUserName,
							colspan:2
						},{
							fieldLabel:'电子邮件地址',
							name:'myEmail',
							itemId:'myEmail',
							value:userConfig.myEmail,
							colspan:2
						}]//用户信息  fieldset  Items
					},{
						title: '服务器信息',
						defaults: {
							xtype: 'textfield',
							width: 320,
							labelWidth: 120,
							labelAlign: 'right'
						},

						items: [{
							fieldLabel:'发送邮件服务器',
							name:'sendService',
							itemId:'sendService',
							value:userConfig.sendService,
							colspan:2
						},{
							fieldLabel:'安全连接',
							xtype: 'combobox',
							name: 'secType',
							itemId: 'secTypeID',
							store: 'secTypeID',
							queryMode : 'local',
							displayField : 'typeName',
							valueField : 'typeId',
							value:userConfig.secType,
							listeners: {
								change: function (cb) {
									var type = cb.getValue();
									var port = cb.up('window').down('#connPortID');
									if(type == '2') {
										port.setValue(465);
									} else {
										port.setValue(25);
									}
								}
							},
							editable: false
						},{
							margin: '-4 0 0 25',
							xtype: 'button',
							text: '测试账户',
							width: 90,
							handler: function() {
								var w = this.up('window');
								var sendService = w.down('#sendService').getValue();
								if(sendService.replace(/\s/g,'').length == 0) {
									Ext.Msg.alert('错误', '发送邮件服务器不能为空');
									return;
								}
								var mailUserName = '';
								var mailPassWord = '';
								if(w.down('#ifsetUAPID').getValue()) {
									mailUserName = w.down('#mailUserName').getValue();
									mailPassWord = w.down('#mailPassWord').getValue();
								}
								var param = {
									sessiontoken: getSessionToken(),
									sendService: sendService,
									userName: mailUserName,
									passWord: mailPassWord,
									type: w.down('#secTypeID').getValue(),
									port: w.down('#connPortID').getValue()
								};
								WsCall.call('testConnEmail', param, function(response, opts) {
									Ext.Msg.alert('成功', '测试邮件账户连接成功');
								}, function(response, opts) {
									if(!errorProcess(response.code)) {
										Ext.Msg.alert('失败', response.msg);
									}
									if(response.code == 535) {
										w.down('#mailPassWord').focus(true);
									}
								});
							}
						},{
							fieldLabel:'端口号',
							name:'connPort',
							itemId: 'connPortID',
							value:userConfig.connPort,
							colspan:2
						}]//服务器信息  fieldset  Items
					},{

						xtype:'checkbox',
						itemId:'ifsetUAPID',
						disabled:false,
						boxLabel:'SMTP服务要求身份验证',
						name:'ifsetUAP',
						margin:'0 0 5 10',
						colspan:3,
						checked: true,
						listeners: {
							change: function (cb) {
								cb.up('window').down('#emailLogID').setDisabled(!cb.getValue());
							}
						}

					},{
						//						title: '登录信息',
						itemId: 'emailLogID',
						padding:'4 10 4 10',
						defaults: {
							xtype: 'textfield',
							width: 320,
							labelWidth: 120,
							labelAlign: 'right'
						},
						items: [{
							fieldLabel:'用户名',
							name:'mailUserName',
							itemId:'mailUserName',
							value:userConfig.mailUserName,
							colspan:2
						},{
							fieldLabel:'密码',
							inputType:'password',
							itemId:'mailPassWord',
							name:'mailPassWord',
							value:userConfig.mailPassWord,
							colspan:2
						}]//登录信息  fieldset  Items
					}]
				}]
			}]//最外层 form  card
		}],//window items
		dockedItems:[{
			xtype: 'panel',
			//bodyCls: 'panelFormBg',
			border: false,
			dock:'bottom',
			height:28,
			layout: {
				type: 'table',
				columns: 3
			},
			defaults: {
				xtype: 'button',
				margin:'4 0 0 10',
				width:80
			},
			items: [{
				margin: '4 10 0 5',
				width:200,
				xtype: 'component',
				itemId: 'formErrorState',
				baseCls: 'form-error-state',
				flex: 1,
				validText: '可以提交',
				invalidText: '有无效的数据',
				tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li>{name}: {error}</li></tpl></ul>'),

				getTip: function() {
					var tip = this.tip;
					if (!tip) {
						tip = this.tip = Ext.widget('tooltip', {
							target: this.el,
							maxWidth:500,
							width:500,
							autoHide: false,
							anchor: 'top',
							mouseOffset: [-11, -2],
							closable: false,
							constrainPosition: false
						});
						tip.show();
					}
					return tip;
				},
				setErrors: function(errors) {
					var me = this,
					baseCls = me.baseCls,
					tip = me.getTip();

					errors = Ext.Array.from(errors);

					// Update CSS class and tooltip content
					if (errors.length) {
						me.addCls(baseCls + '-invalid');
						me.removeCls(baseCls + '-valid');
						me.update(me.invalidText);
						tip.setDisabled(false);
						tip.update(me.tipTpl.apply(errors));
						tip.show();
					} else {
						me.addCls(baseCls + '-valid');
						me.removeCls(baseCls + '-invalid');
						me.update(me.validText);
						tip.setDisabled(true);
						tip.hide();
					}
				}
			},{
				text: '确定',
				margin: '4 10 0 213',
				xtype: 'button',
				width:80,
				handler: function () {
					var me = this;
					var w = me.up('window');

					var form = w.down('form').getForm();

					if (form.isValid()) {
						form.submit({
							url: WsConf.Url + "?req=call&callname=systemconfig&configparam=sys&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "",
							success: function (form, action) {
								userConfig.miniPngSize =w.down('#minipngSize').getValue();
								getUserData();
								w.hide();
								if(doc_inputDataWin != '') {
									doc_inputDataWin.destroy();
									doc_inputDataWin = '';
								}
								if(wf_inputDataWin != '') {
									wf_inputDataWin.destroy();
									wf_inputDataWin = '';									
								}
								if(sendfax_inputDataWin != '') {
									sendfax_inputDataWin.destroy();
									sendfax_inputDataWin = '';
								}
								if(inputDataWin != '') {
									inputDataWin.destroy();
									inputDataWin = '';
								}
							},
							failure: function (form, action) {
								if(!errorProcess(action.result.code)) {
									Ext.Msg.alert('失败', action.result.msg, function() {
									});
								}
							}
						});
					} else {
						w.down('form').updateErrorState();
					}
				}
			},{
				text: '取消',
				handler: function () {
					if (systemconfigwin_sys) {
						systemconfigwin_sys.hide();
					}
				}
			}]

		}],
		listeners: {
			destroy: function () {
				systemconfigwin_sys = '';
			},
			show: function() {

				var myWindow = this;

				if(myWindow.isFistSysCon) {
					myWindow.isFistSysCon = false;
					return;
				}

				var errorCmp = myWindow.down('#formErrorState');
				errorCmp.setErrors([]);

				myWindow.down('#minipngSize').setValue(userConfig.miniPngSize);

				var systemCf = myWindow.down('#systemCf');
				systemCf.down('#listAll').setValue(userConfig.listAll);
				systemCf.down('#addSource').setValue(userConfig.addSource);
				systemCf.down('#viewDocPic').setValue(userConfig.viewDocPic);
				systemCf.down('#gridPageSize').setValue(userConfig.gridPageSize);
				systemCf.down('#autoReadSec').setValue(userConfig.autoReadSec);
				systemCf.down('#outfaxreSec').setValue(userConfig.outfaxreSec);
				systemCf.down('#validateFront').setValue(userConfig.validateFront);
				systemCf.down('#countryCode').setValue(userConfig.countryCode);
				systemCf.down('#areaCode').setValue(userConfig.areaCode);

				//myWindow.down('#msgboxkeeptime').setValue(userConfig.msgboxkeeptime);
				//myWindow.down('#msgtaskinterval').setValue(userConfig.msgtaskinterval);
				myWindow.down('#myUserName').setValue(userConfig.myUserName);
				myWindow.down('#myEmail').setValue(userConfig.myEmail);
				myWindow.down('#sendService').setValue(userConfig.sendService);
				myWindow.down('#mailUserName').setValue(userConfig.mailUserName);
				myWindow.down('#mailPassWord').setValue(userConfig.mailPassWord);
				myWindow.down('#secTypeID').setValue(userConfig.secType);
				myWindow.down('#connPortID').setValue(userConfig.connPort);
			}
		}
	});

}

//个人设置面板
function loadsystemconfigwin_person() {
	return Ext.create('Ext.window.Window', {
		title: '个人设置',
		iconCls: 'config',
		closeAction:'hide',
		modal:true,
		isFistSysCon:true,
		closable:false,
		shadow:!Ext.isIE,
		tools: [{
			type: 'close',
			handler: function() {
				systemconfigwin_person.hide();
			}
		}],
		bodyPadding: 5,
		height: 450,
		width: 620,
		border: false,
		resizable: false,
		bodyBorder:true,
		layout: {
			type:'fit'
		},
		defaults: {
			border:false
		},
		items: [{
			xtype:'form',
			//bodyCls: 'panelFormBg',
			border:false,
			layout:'card',
			bodyBorder:false,
			listeners: {
				fieldvaliditychange: function() {
					this.updateErrorState();
				},
				fielderrorchange: function() {
					this.updateErrorState();
				}
			},
			updateErrorState: function() {
				var me = this;
				var errors = [];
				var errorCmp = me.up('window').down('#formErrorState');
				var fields = me.getForm().getFields();
				fields.each( function(field) {
					Ext.Array.forEach(field.getErrors(), function(error) {
						errors.push({
							name: field.getFieldLabel(),
							error: error
						});
					});
				});
				errorCmp.setErrors(errors);
			},
			items:[{
				xtype:'tabpanel',
				itemId:'perSInfos',
				plain: true,
				bodyBoder:false,
				border:false,
				defaults: {
					border: false,
					//bodyCls: 'panelFormBg',
					layout:'fit'
				},
				items:[{
					title:'个人信息',
					itemId:'personInfo',
					items:[{
						//bodyCls: 'panelFormBg',
						border: false,
						layout: {
							type: 'anchor'
						},
						defaults: {
							xtype: 'fieldset',
							layout: {
								type: 'table',
								columns: 3
							},
							labelAlign: 'right'
						},
						items:[{
							title:'基本信息',
							defaults: {
								xtype: 'textfield',
								labelAlign: 'right',
								width: 150,
								labelWidth: 80
							},
							items:[{
								fieldLabel:'姓',
								name:'lastName',
								itemId:'lastName'
							},{
								fieldLabel:'名',
								name:'fistName',
								itemId:'fistName'
							},{
								fieldLabel:'性别',
								editable:false,
								name:'gender',
								width:150,
								xtype:'combo',
								store: 'genderID',
								queryMode : 'local',
								displayField : 'genderName',
								valueField : 'gender',
								value:'0',
								itemId:'gender'
							},{
								fieldLabel:'职位',
								name:'job',
								width:300,
								colspan:3,
								itemId:'job'
							}]//基本信息 fieldSet

						},{
							xtype:'checkbox',
							itemId:'ifEditorPass',
							disabled:false,
							boxLabel:'修改用户帐户密码',
							name:'modifiPass',
							margin:'0 0 5 10',
							colspan:3,
							listeners: {
								change: function (cb, nValue, oValue, opts) {
									if (cb.getValue()) {
										Ext.Array.each(cb.up('form').down('#passwordEditor').query('textfield'), function (item, index, allItems) {
											item.setDisabled(false);
										});
									} else {
										Ext.Array.each(cb.up('form').down('#passwordEditor').query('textfield'), function (item, index, allItems) {
											item.setDisabled(true);
										});
									}
								}
							}
						},{
							//title:'修改用户帐户密码',
							itemId:'passwordEditor',
							padding:'4 10 4 10',
							defaults: {
								xtype: 'textfield',
								disabled:true,
								width: 390,
								labelWidth: 200,
								colspan:3,
								labelAlign: 'right',
								margin:'5 0 0 0'
							},
							items:[{
								fieldLabel:'旧密码',
								itemId:'oldPassword',
								name:'oldPassword',
								inputType: 'password'
							},{
								fieldLabel:'新密码',
								name:'newPassword',
								inputType: 'password',
								itemId:'newPassword',
								validateOnBlur:false,
								validateOnChange:false
							},{
								fieldLabel:'确认新密码',
								name:'repeatPassword',
								inputType: 'password',
								itemId:'repeatPassword',
								validateOnBlur:true,
								validateOnChange:false,
								validator: function(value) {
									var password1 = this.previousSibling('[name=newPassword]');
									return (value === password1.getValue()) ? true : '两次输入的新密码不一致，请重新输入'
								}
							}]//修改用户帐户密码  items
						}]//个人信息 items

					}]//个人信息 tab
				},{
					title:'联系信息',
					itemId:'contactInfo',
					layout:'auto',
					defaults: {
						xtype:'fieldset',
						layout: {
							type:'table',
							columns:2
						}
					},
					items:[{
						xtype:'textfield',
						fieldLabel:'国家代码',
						name:'myCountryCode',
						itemId:'myCountryCode',
						margin:'5 0 0 10',
						width:200,
						labelAlign: 'right',
						labelWidth: 150
					},{
						title:'传真',
						defaults: {
							xtype: 'textfield',
							width: 280,
							labelWidth: 80,
							labelAlign: 'right'
						},
						items:[{
							fieldLabel:'传真号码',
							name:'faxNumber',
							itemId:'faxNumber'
						},{
							fieldLabel:'分机号',
							name:'faxNumberExt',
							itemId:'faxNumberExt',
							width:160,
							labelWidth:65
						}]//传真 items
					},{
						title:'电话',
						defaults: {
							xtype: 'textfield',
							width: 300,
							labelWidth: 170,
							labelAlign: 'right'
						},
						items:[{
							fieldLabel:'电话号码',
							itemId:'phoneNumber',
							name:'phoneNumber'
						},{
							fieldLabel:'分机号',
							itemId:'phoneNumberExt',
							name:'phoneNumberExt',
							width:160,
							labelWidth:65
						},{
							fieldLabel:'语音邮件通报号码',
							itemId:'voicePhoneNumber',
							name:'voicePhoneNumber'
						},{
							fieldLabel:'分机号',
							itemId:'voicephoneNumberExt',
							name:'voicephoneNumberExt',
							width:160,
							labelWidth:65
						},{
							fieldLabel:'手机号',
							itemId:'mobileNumber',
							name:'mobileNumber'
						}]//电话 fieldset items

					},{
						title:'其他',
						layout: {
							type:'anchor'
						},
						defaults: {
							xtype:'textfield',
							width:370,
							labelWidth:140,
							labelAlign: 'right'
						},
						items:[{
							fieldLabel:'即时通讯号',
							name:'iMNumber',
							itemId:'iMNumber',
							width:270
						},{
							fieldLabel:'电子邮件',
							itemId:'email',
							name:'email'
						},{
							fieldLabel:'个人Web地址',
							itemId:'web',
							name:'web'
						}]//其他  fieldset items
					}]//联系信息 tab items
				},{
					title:'通报设置',
					layout:'auto',
					items:[{
						xtype:'tabpanel',
						margin:'5 5 5 5',
						tabPosition:'bottom',
						width:592,
						plain: false,
						bodyBoder:true,
						border:true,
						defaults: {
							height:300,
							//bodyCls: 'panelFormBg',
							border: false,
							layout:'fit'
						},
						items:[{
							title:'计算机通报',
							itemId:'tab_pCNotification',
							layout: {
								type:'table',
								columns:2
							},
							defaults: {
								xtype:'checkbox',
								margin:'5 5 5 10',
								submitValue:false
							},
							items:[{
								boxLabel:'接收时通报',
								name:'receiveReport',
								myValue:NotificationConst.NotifyMeOnReceive
							},{
								boxLabel:'发送成功时通报',
								name:'succucessReport',
								myValue:NotificationConst.NotifyMeOnSentOK
							},{
								boxLabel:'发送失败时通报',
								name:'failReport',
								myValue:NotificationConst.NotifyMeOnSentErr,
								colspan:2
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:575,
								colspan:2
							},{
								boxLabel:'任务成功时通报',
								name:'wfSuccucessReport',
								myValue:NotificationConst.NotifyMeOnWorkflowOK
							},{
								boxLabel:'任务失败时通报',
								name:'wfFailReport',
								myValue:NotificationConst.NotifyMeOnWorkflowFailed
							},{
								boxLabel:'有新待办事项时通报',
								name:'examineReport',
								myValue:NotificationConst.NotifyMeOnWaitWorkflow,
								colspan:2
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:575,
								colspan:2
							},{
								boxLabel:'被委任职责时通报',
								name:'reponsibilityReport',
								myValue:NotificationConst.NotifyTaskSubstitution
							},{
								xtype:'hidden',
								submitValue:true,
								itemId:'pCNotification',
								name:'pCNotification',
								value:0
							},{
								xtype:'fieldset',
								colspan:2,
								layout: {
									type:'table',
									columns:2
								},
								title:'通报信息',
								defaults: {
									xtype:'numberfield',
									width:280,
									labelWidth:210,
									labelAlign:'right'
								},
								items:[{
									fieldLabel: '通报窗口保持时间(秒)',
									itemId: 'msgboxkeeptime',
									name: 'msgboxkeeptime',
									value: userConfig.msgboxkeeptime,
									allowBlank: false,
									blankText: '不能为空',
									nanText:'请输入正确的数字格式！',
									minValue: 0,
									minText: '最小为0'
								},{
									xtype:'label',
									text: '(0秒表示不自动消失)'
								},{
									fieldLabel: '通报间隔时间(秒)',
									itemId: 'msgtaskinterval',
									name: 'msgtaskinterval',
									value: userConfig.msgtaskinterval,
									nanText:'请输入正确的数字格式！',
									allowBlank: false,
									blankText: '不能为空',
									maxText: '最大为3600',
									minText: '最小为10',
									minValue: 10,
									maxValue: 3600
								}]
							}]//计算机通报 tab items
						},{
							title:'短信通报',
							itemId:'tab_sMSNotification',
							layout: {
								type:'anchor'
							},
							defaults: {
								xtype:'checkbox',
								margin:'5 5 5 10',
								submitValue:false
							},
							items:[{
								boxLabel:'接收时通报',
								name:'msg_receiveReport',
								myValue:NotificationConst.NotifyMeOnReceive
							},{
								boxLabel:'发送成功时通报',
								name:'msg_succucessReport',
								myValue:NotificationConst.NotifyMeOnSentOK
							},{
								boxLabel:'发送失败时通报',
								name:'msg_failReport',
								myValue:NotificationConst.NotifyMeOnSentErr
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:555
							},{
								boxLabel:'任务成功时通报',
								name:'msg_wfSuccucessReport',
								myValue:NotificationConst.NotifyMeOnWorkflowOK
							},{
								boxLabel:'任务失败时通报',
								name:'msg_wfFailReport',
								myValue:NotificationConst.NotifyMeOnWorkflowFailed
							},{
								boxLabel:'有新待办事项时通报',
								name:'msg_examineReport',
								myValue:NotificationConst.NotifyMeOnWaitWorkflow
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:555
							},{
								boxLabel:'被委任职责时通报',
								name:'msg_reponsibilityReport',
								myValue:NotificationConst.NotifyTaskSubstitution
							},{
								xtype:'hidden',
								submitValue:true,
								itemId:'sMSNotification',
								name:'sMSNotification',
								value:0
							}]//短信通报 tab items
						},{
							title:'打印通报',
							itemId:'tab_printNotification',
							layout: {
								type:'anchor'
							},
							defaults: {
								xtype:'checkbox',
								margin:'5 5 5 10',
								submitValue:false
							},
							items:[{
								boxLabel:'接收时通报',
								name:'print_receiveReport',
								myValue:NotificationConst.NotifyMeOnReceive
							},{
								boxLabel:'发送成功时通报',
								name:'print_succucessReport',
								myValue:NotificationConst.NotifyMeOnSentOK
							},{
								boxLabel:'发送失败时通报',
								name:'print_failReport',
								myValue:NotificationConst.NotifyMeOnSentErr
							},{
								fieldLabel:'打印机',
								labelAlign:'top',
								xtype:'combo',
								name:'printer',
								width:455,
								store:['','','','',''],
								submitValue:true,
								queryMode : 'local'
							},{
								xtype:'hidden',
								itemId:'printNotification',
								name:'printNotification',
								submitValue:true,
								value:0
							}]//打印通报 tab items
						},{
							title:'语音邮件通报',
							itemId:'tab_voiceNotification',
							layout: {
								type:'anchor'
							},
							defaults: {
								xtype:'checkbox',
								margin:'5 5 5 10',
								submitValue:false
							},
							items:[{
								boxLabel:'接收时通报',
								name:'voice_receiveReport',
								myValue:NotificationConst.NotifyMeOnReceive
							},{
								boxLabel:'发送成功时通报',
								name:'voice_succucessReport',
								myValue:NotificationConst.NotifyMeOnSentOK
							},{
								boxLabel:'发送失败时通报',
								name:'voice_failReport',
								myValue:NotificationConst.NotifyMeOnSentErr
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:555
							},{
								boxLabel:'任务成功时通报',
								name:'voice_wfSuccucessReport',
								myValue:NotificationConst.NotifyMeOnWorkflowOK
							},{
								boxLabel:'任务失败时通报',
								name:'voice_wfFailReport',
								myValue:NotificationConst.NotifyMeOnWorkflowFailed
							},{
								boxLabel:'有新待办事项时通报',
								name:'voice_examineReport',
								myValue:NotificationConst.NotifyMeOnWaitWorkflow
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:555
							},{
								boxLabel:'被委任职责时通报',
								name:'voice_reponsibilityReport',
								myValue:NotificationConst.NotifyTaskSubstitution
							},{
								xtype:'hidden',
								itemId:'voiceNotification',
								name:'voiceNotification',
								submitValue:true,
								value:0
							}]//语音邮件通报 tab items
						},{
							title:'邮件通报',
							itemId:'tab_eMailNotification',
							layout: {
								type:'anchor'
							},
							defaults: {
								xtype:'checkbox',
								margin:'3 5 3 10',
								submitValue:false
							},
							items:[{
								boxLabel:'接收时通报',
								name:'email_receiveReport',
								myValue:NotificationConst.NotifyMeOnReceive
							},{
								boxLabel:'包含附件',
								name:'email_includeAnnexRR',
								myValue:NotificationConst.NotifyEmailAttachmentOnReceive
							},{
								boxLabel:'发送成功时通报',
								name:'email_succucessReport',
								myValue:NotificationConst.NotifyMeOnSentOK
							},{
								boxLabel:'包含附件',
								name:'email_includeAnnexSR',
								myValue:NotificationConst.NotifyEmailAttachmentOnSendOK
							},{
								boxLabel:'发送失败时通报',
								name:'email_failReport',
								myValue:NotificationConst.NotifyMeOnSentErr
							},{
								boxLabel:'包含附件',
								name:'email_includeAnnexFR',
								myValue:NotificationConst.NotifyEmailAttachmentOnSendErr
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:555
							},{
								boxLabel:'任务成功时通报',
								name:'email_wfSuccucessReport',
								myValue:NotificationConst.NotifyMeOnWorkflowOK
							},{
								boxLabel:'任务失败时通报',
								name:'email_wfFailReport',
								myValue:NotificationConst.NotifyMeOnWorkflowFailed
							},{
								boxLabel:'有新待办事项时通报',
								name:'email_examineReport',
								myValue:NotificationConst.NotifyMeOnWaitWorkflow
							},{
								xtype:'tbtext',
								text:'<hr/>',
								width:555
							},{
								boxLabel:'被委任职责时通报',
								name:'email_reponsibilityReport',
								myValue:NotificationConst.NotifyTaskSubstitution
							},{
								xtype:'hidden',
								itemId:'eMailNotification',
								name:'eMailNotification',
								submitValue:true,
								value:0
							}]//邮件通报 tab items
						}]
					}]//通报设置 items
				},{
					title:'传真页眉',
					itemId:'FaxPageHeader'	,
					layout: {
						type:'anchor'
					},
					defaults: {
						xtype:'textfield',
						margin:'5 5 5 10',
						flex:1,
						width:495,
						labelWidth:60,
						labelAlign: 'right'
					},
					items:[{
						fieldLabel:'左',
						itemId:'left_PageHeader',
						name:'left_PageHeader',
						listeners: {
							focus: function(text,opts) {
								faxPHFocusVar = text;
							}
						}
					},{
						fieldLabel:'中',
						itemId:'middle_PageHeader',
						name:'middle_PageHeader',
						listeners: {
							focus: function(text,opts) {
								faxPHFocusVar = text;
							}
						}
					},{
						fieldLabel:'右',
						itemId:'right_PageHeader',
						name:'right_PageHeader',
						listeners: {
							focus: function(text,opts) {
								faxPHFocusVar = text;
							}
						}
					},{
						xtype:'button',
						text:'插入变量',
						margin:'5 5 5 290',
						width:100,
						flex:0.5,
						handler: function() {

							Ext.create('Ext.window.Window', {
								title: '插入变量',
								modal:true,
								iconCls: 'serverInfo',
								bodyPadding: 5,
								height: 470,
								width: 350,
								border: false,
								//bodyCls: 'panelFormBg',
								resizable: false,
								layout:'anchor',
								items:[{
									xtype:'insertVarGird',
									itemId:'insertVarGird1',
									flex:1,
									width:330,
									listeners: {
										itemdblclick: function(view,record,item,index,e,opts) {
											faxPHFocusVar.setValue(faxPHFocusVar.getValue()+record.data.varValue);
											this.up('window').close();
										}
									}
								},{
									width:80,
									flex:0.5,
									xtype:'button',
									text:'确定',
									margin:'5 5 5 165',
									handler: function() {
										var grid = this.previousSibling('#insertVarGird1');
										faxPHFocusVar.setValue(grid.getSelectionModel().getSelection()[0].data.varValue+faxPHFocusVar.getValue());
										this.up('window').close();
									}
								},{
									width:80,
									flex:0.5,
									xtype:'button',
									margin:'5 0 5 0',
									text:'取消',
									handler: function() {
										this.up('window').close();
									}
								}]
							}).show();
						}
					},{
						xtype:'button',
						text:'默认值',
						width:100,
						flex:0.5,
						handler: function() {
							this.up('#FaxPageHeader').down("#left_PageHeader").setValue(FaxPageHeaderDefaults.left);
							this.up('#FaxPageHeader').down("#middle_PageHeader").setValue(FaxPageHeaderDefaults.middle);
							this.up('#FaxPageHeader').down("#right_PageHeader").setValue(FaxPageHeaderDefaults.right);
						}
					}]//传真页眉 items
				}],//tabpanel items
				listeners: {
					tabchange: function(tabPanel,nCard,oCard,opts) {
						if(nCard != oCard && nCard.itemId == 'FaxPageHeader') {
							nCard.down('#left_PageHeader').focus(false,300);
						}
					}
				}
			}]//最外层 form  card
		}],//window items
		dockedItems:[{
			xtype: 'panel',
			//bodyCls: 'panelFormBg',
			border: false,
			dock:'bottom',
			height:28,
			layout: {
				type: 'table',
				columns: 3
			},
			defaults: {
				xtype: 'button',
				margin:'4 0 0 10',
				width:80
			},
			items: [{
				margin: '4 10 0 5',
				width:200,
				xtype: 'component',
				itemId: 'formErrorState',
				baseCls: 'form-error-state',
				flex: 1,
				validText: '可以提交',
				invalidText: '有无效的数据',
				tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li>{name}: {error}</li></tpl></ul>'),

				getTip: function() {
					var tip = this.tip;
					if (!tip) {
						tip = this.tip = Ext.widget('tooltip', {
							target: this.el,
							maxWidth:500,
							width:500,
							autoHide: false,
							anchor: 'top',
							mouseOffset: [-11, -2],
							closable: false,
							constrainPosition: false
						});
						tip.show();
					}
					return tip;
				},
				setErrors: function(errors) {
					var me = this,
					baseCls = me.baseCls,
					tip = me.getTip();

					errors = Ext.Array.from(errors);

					// Update CSS class and tooltip content
					if (errors.length) {
						me.addCls(baseCls + '-invalid');
						me.removeCls(baseCls + '-valid');
						me.update(me.invalidText);
						tip.setDisabled(false);
						tip.update(me.tipTpl.apply(errors));
						tip.show();
					} else {
						me.addCls(baseCls + '-valid');
						me.removeCls(baseCls + '-invalid');
						me.update(me.validText);
						tip.setDisabled(true);
						tip.hide();
					}
				}
			},{
				text: '确定',
				margin: '4 10 0 213',
				xtype: 'button',
				width:80,
				handler: function () {
					var me = this;
					var w = me.up('window');
					//计算机通报值计算
					var hidden_pCNotification =w.down('#pCNotification');
					var ck_tab_pCNotification = w.down('#tab_pCNotification').query('checkboxfield');
					Ext.Array.each(ck_tab_pCNotification, function (item, index, allItems) {
						if(index == 0) {
							hidden_pCNotification.setValue(0);
						}
						hidden_pCNotification.setValue(hidden_pCNotification.getValue() | (item.getValue()?item.myValue:0));
					});
					//短信通报值计算
					var hidden_sMSNotification =w.down('#sMSNotification');
					var ck_tab_sMSNotification = w.down('#tab_sMSNotification').query('checkboxfield');
					Ext.Array.each(ck_tab_sMSNotification, function (item, index, allItems) {
						if(index == 0) {
							hidden_sMSNotification.setValue(0);
						}
						hidden_sMSNotification.setValue(hidden_sMSNotification.getValue() | (item.getValue()?item.myValue:0));
					});
					//打印通报值计算
					var hidden_printNotification =w.down('#printNotification');
					var ck_tab_printNotification = w.down('#tab_printNotification').query('checkboxfield');
					Ext.Array.each(ck_tab_printNotification, function (item, index, allItems) {
						if(index == 0) {
							hidden_printNotification.setValue(0);
						}
						hidden_printNotification.setValue(hidden_printNotification.getValue() | (item.getValue()?item.myValue:0));
					});
					//语音邮件通报值计算
					var hidden_voiceNotification =w.down('#voiceNotification');
					var ck_tab_voiceNotification = w.down('#tab_voiceNotification').query('checkboxfield');
					Ext.Array.each(ck_tab_voiceNotification, function (item, index, allItems) {
						if(index == 0) {
							hidden_voiceNotification.setValue(0);
						}
						hidden_voiceNotification.setValue(hidden_voiceNotification.getValue() | (item.getValue()?item.myValue:0));
					});
					//邮件通报值计算
					var hidden_eMailNotification =w.down('#eMailNotification');
					var ck_tab_eMailNotification = w.down('#tab_eMailNotification').query('checkboxfield');
					Ext.Array.each(ck_tab_eMailNotification, function (item, index, allItems) {
						if(index == 0) {
							hidden_eMailNotification.setValue(0);
						}
						hidden_eMailNotification.setValue(hidden_eMailNotification.getValue() | (item.getValue()?item.myValue:0));
					});
					var form = w.down('form').getForm();

					if (form.isValid()) {
						form.submit({
							url: WsConf.Url + "?req=call&callname=systemconfig&configparam=person&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "",
							success: function (form, action) {
								getUserData( function() {
									//加载计算机通报task
									msgBoxTask();
								});
								w.hide();
							},
							failure: function (form, action) {
								if(!errorProcess(action.result.code)) {
									Ext.Msg.alert('失败', action.result.msg, function() {
									});
								}
							}
						});
					} else {
						w.down('form').updateErrorState();
					}
				}
			},{
				text: '取消',
				handler: function () {
					if (systemconfigwin_person) {
						systemconfigwin_person.hide();
					}
				}
			}]

		}],
		listeners: {
			destroy: function () {
				systemconfigwin_person = '';
			},
			show: function() {

				var myWindow = this;
				if(myWindow.isFistSysCon) {
					myWindow.isFistSysCon = false;
					return;
				}

				var errorCmp = myWindow.down('#formErrorState');
				errorCmp.setErrors([]);
				var cbxPass = myWindow.down('#ifEditorPass');
				cbxPass.setValue(false);
				myWindow.down('#oldPassword').reset();
				myWindow.down('#newPassword').reset();
				myWindow.down('#repeatPassword').reset();

				myWindow.down('#msgboxkeeptime').setValue(userConfig.msgboxkeeptime);
				myWindow.down('#msgtaskinterval').setValue(userConfig.msgtaskinterval);

				var ns = userInfoData.faxNotifySetting;
				//判断authType 是否为0
				if(userInfoData.authType != 0) {
					myWindow.down("#ifEditorPass").setDisabled(true);
				}

				//计算机通报值计算
				var hidden_pCNotification =myWindow.down('#pCNotification');
				hidden_pCNotification = ns.PCNotification;
				var ck_tab_pCNotification = myWindow.down('#tab_pCNotification').query('checkboxfield');
				if(hidden_pCNotification != 0) {
					Ext.Array.each(ck_tab_pCNotification, function (item, index, allItems) {
						item.setValue(calcNotifiConst(hidden_pCNotification,item.myValue));
					});
				}

				//短信通报值计算
				var hidden_sMSNotification =myWindow.down('#sMSNotification');
				hidden_sMSNotification = ns.SMSNotification;
				var ck_tab_sMSNotification = myWindow.down('#tab_sMSNotification').query('checkboxfield');
				if(hidden_sMSNotification != 0) {
					Ext.Array.each(ck_tab_sMSNotification, function (item, index, allItems) {
						item.setValue(calcNotifiConst(hidden_sMSNotification,item.myValue));
					});
				}
				//打印通报值计算
				var hidden_printNotification =myWindow.down('#printNotification');
				hidden_printNotification = ns.printNotification;
				var ck_tab_printNotification = myWindow.down('#tab_printNotification').query('checkboxfield');
				if(hidden_printNotification != 0) {
					Ext.Array.each(ck_tab_printNotification, function (item, index, allItems) {
						item.setValue(calcNotifiConst(hidden_printNotification,item.myValue));
					});
				}
				//语音邮件通报值计算
				var hidden_voiceNotification =myWindow.down('#voiceNotification');
				hidden_voiceNotification = ns.voiceNotification;
				var ck_tab_voiceNotification = myWindow.down('#tab_voiceNotification').query('checkboxfield');
				if(hidden_voiceNotification != 0) {
					Ext.Array.each(ck_tab_voiceNotification, function (item, index, allItems) {
						item.setValue(calcNotifiConst(hidden_voiceNotification,item.myValue));
					});
				}
				//邮件通报值计算
				var hidden_eMailNotification =myWindow.down('#eMailNotification');
				hidden_eMailNotification = ns.EMailNotification;
				var ck_tab_eMailNotification = myWindow.down('#tab_eMailNotification').query('checkboxfield');
				if(hidden_eMailNotification != 0) {
					Ext.Array.each(ck_tab_eMailNotification, function (item, index, allItems) {
						item.setValue(calcNotifiConst(hidden_eMailNotification,item.myValue));
					});
				}

				//设置个人信息
				var personInfo = myWindow.down('#personInfo');
				var fdLastName = personInfo.down('#lastName');
				fdLastName.setValue(userInfoData.personInfo.lastName);
				var fdFistName = personInfo.down('#fistName');
				fdFistName.setValue(userInfoData.personInfo.firstName);
				var fdGender = personInfo.down('#gender');
				fdGender.select(''+userInfoData.personInfo.gender+'');
				var fdJob = personInfo.down('#job');
				fdJob.setValue(userInfoData.personInfo.title);

				//设置联系信息
				var contactInfo = myWindow.down('#contactInfo');
				var fdMyCountryCode = contactInfo.down('#myCountryCode');
				fdMyCountryCode.setValue(userInfoData.contactInfo.countryCode);
				var fdFaxNumber = contactInfo.down('#faxNumber');
				fdFaxNumber.setValue(userInfoData.contactInfo.faxNumber);
				var fdFaxNumberExt = contactInfo.down('#faxNumberExt');
				fdFaxNumberExt.setValue(userInfoData.contactInfo.faxNumberExt);
				var fdPhoneNumber = contactInfo.down('#phoneNumber');
				fdPhoneNumber.setValue(userInfoData.contactInfo.phoneNumber);
				var fdPhoneNumberExt = contactInfo.down('#phoneNumberExt');
				fdPhoneNumberExt.setValue(userInfoData.contactInfo.phoneNumberExt);
				var fdVoicePhoneNumber = contactInfo.down('#voicePhoneNumber');
				fdVoicePhoneNumber.setValue(userInfoData.contactInfo.sparePhoneNumber);
				var fdVoicephoneNumberExt = contactInfo.down('#voicephoneNumberExt');
				fdVoicephoneNumberExt.setValue(userInfoData.contactInfo.sparePhoneNumberExt);
				var fdMobileNumber = contactInfo.down('#mobileNumber');
				fdMobileNumber.setValue(userInfoData.contactInfo.mobileNumber);
				var fdIMNumber = contactInfo.down('#iMNumber');
				fdIMNumber.setValue(userInfoData.contactInfo.IMNumber);
				var fdEmail = contactInfo.down('#email');
				fdEmail.setValue(userInfoData.contactInfo.email);
				var fdWeb = contactInfo.down('#web');
				fdWeb.setValue(userInfoData.contactInfo.web);

				//传真页眉
				var faxPageHeader = myWindow.down('#FaxPageHeader');
				var fdLeft_PageHeader = faxPageHeader.down('#left_PageHeader');
				fdLeft_PageHeader.setValue(userInfoData.faxHeader.faxHeaderLeft);
				var fdMiddle_PageHeader = faxPageHeader.down('#middle_PageHeader');
				fdMiddle_PageHeader.setValue(userInfoData.faxHeader.faxHeaderMiddle);
				var fdRight_PageHeader = faxPageHeader.down('#right_PageHeader');
				fdRight_PageHeader.setValue(userInfoData.faxHeader.faxHeaderRight);

				//myWindow.down('configListGrid').getSelectionModel().select(0, true);
				//myWindow.down('form').getLayout().setActiveItem(0);
				//设置短信通报按钮状态
				myWindow.down('#tab_sMSNotification').setDisabled(roleInfoModel.get('messageReport')==0?false:true);
				//设置打印通报按钮状态
				myWindow.down('#tab_printNotification').setDisabled(roleInfoModel.get('printReport')==0?false:true);
				//设置语音邮件通报按钮状态
				myWindow.down('#tab_voiceNotification').setDisabled(roleInfoModel.get('voiceReport')==0?false:true);
				//设置邮件通报按钮状态
				myWindow.down('#tab_eMailNotification').setDisabled(roleInfoModel.get('mailReport')==0?false:true);

			}
		}
	});
}

//----职责委任	task_substitution
Ext.define('WS.tbnorth.TaskSubModel', {
	extend: 'Ext.data.Model',
	alternateClassName: ['TaskSubModel'],
	fields: [{
		name: 'applyUserid',	//委托人
		type: 'string'
	},{
		name: 'applyUserName',	//委托人
		type: 'string'
	},{
		name: 'name',	//名字
		type: 'string'
	},{
		name: 'receiveFax',	//接收传真
		type: 'string'
	},{
		name: 'wfApproval',	//工作流审批
		type: 'string'
	},{
		name: 'admine',	//管理员
		type: 'string'
	},{
		name: 'endTime',	//结束时间
		type: 'string'
	}]
});
Ext.create('Ext.data.ArrayStore', {
	storeId: 'toOtherStoreID',
	model: 'WS.tbnorth.TaskSubModel'
});

Ext.create('Ext.data.ArrayStore', {
	storeId: 'otherToSelfStoreID',
	model: 'WS.tbnorth.TaskSubModel'
});

Ext.define('WS.tbnorth.TaskSubGrid', {
	alternateClassName: ['TaskSubGrid'],
	alias: 'widget.TaskSubGrid',
	extend: 'Ext.grid.Panel',
	//store: 'TaskSubStoreID',
	height: 350,
	columnLines: true,
	multiSelect: true,
	viewConfig: {
		loadingText:'正在加载数据...'
	},
	columns : [{
		text: '委任人登录账号',
		dataIndex: 'applyUserName',
		width: 120
	},{
		text: '名字',
		dataIndex: 'name',
		width: 120
	},{
		text: '截止日期',
		dataIndex: 'endTime',
		renderer: function(value) {
			return UTCtoLocal(value);
		},
		width: 150
	},{
		text: '接收传真',
		dataIndex : 'receiveFax',
		renderer: function(value) {
			if(value == 'true') {
				return "<img src='resources/images/grid/okFax.png'>"
			}else {
				return "<img src='resources/images/grid/cancelFax.png'>"
			}
		},
		width: 80
	},{
		text: '工作流审批',
		dataIndex : 'wfApproval',
		renderer: function(value) {
			if(value == 'true') {
				return "<img src='resources/images/grid/okFax.png'>"
			}else {
				return "<img src='resources/images/grid/cancelFax.png'>"
			}
		},
		width: 80
	},{
		text: '管理员',
		dataIndex : 'admine',
		renderer: function(value) {
			if(value == 'true') {
				return "<img src='resources/images/grid/okFax.png'>"
			}else {
				return "<img src='resources/images/grid/cancelFax.png'>"
			}
		},
		width: 80
	}],
	listeners: {
		itemdblclick: function(grid, record) {
			var win = loadSetSubWin();
			win.applyUserid = record.data.applyUserid;
			win.show('', function() {
				//是否具有管理员权限
				win.down('#receiveFaxID').setValue(record.data.receiveFax == 'true');
				win.down('#wfApprovalID').setValue(record.data.wfApproval == 'true');
				win.down('#wfApprovalID').setDisabled(!(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0));
				win.down('#admineID').setValue(record.data.admine == 'true');
				win.down('#admineID').setDisabled(!(roleInfoModel && roleInfoModel.data.guOrSysAdmin == 0));
				var cmp = win.down('#endTimeID');
				var tmpDf = UTCtoLocal(record.data.endTime).split(' ');
				var timeDf = tmpDf[1].split(':');
				cmp.dateField.setValue(tmpDf[0]);
				cmp.timeHField.setValue(timeDf[0]);
				cmp.timeMField.setValue(timeDf[1]);
				cmp.timeIField.setValue(timeDf[2]);
			});
		}
	},
	dockedItems : [{
		xtype : 'toolbar',
		itemId: 'toolbarID',
		dock:'top',
		listeners: {
			afterrender: function(com) {
				if(com.up('grid').showToolbar) {
					com.add({
						text: '委任职责',
						iconCls:'imgBtnAdd',
						handler: function () {
							if(faxforwardwin == '') {
								faxforwardwin = Ext.create('WS.infax.InForward', {
									isInForWard:false,
									isDocSearch:'subuserid'
								});
							} else {
								faxforwardwin.isInForWard = false;
								faxforwardwin.isDocSearch = 'subuserid';
							}
							faxforwardwin.down('#tabpalFiles').setDisabled(true);
							faxforwardwin.down('#rdDic').setDisabled(true);
							faxforwardwin.down('#rdUser').setValue(true);
							faxforwardwin.down('#forwarUserDic').setTitle('用户');
							faxforwardwin.setWidth(496);
							faxforwardwin.show('', function() {
								faxforwardwin.center();
								faxforwardwin.setTitle('用户');
								faxforwardwin.down('#isDelID').setVisible(false);
								faxforwardwin.down('#userID').loadGrid(true);
								faxforwardwin.down('tabpanel').setActiveTab('forwarUserDic');	
								var serF = faxforwardwin.down('#serFielID');
								serF.store = faxforwardwin.down('#userID').getStore();
								serF.reset();
								serF.onTrigger1Click();
							});
						}
					}, '-',{
						text: '修改',
						iconCls:'faxRuleICON',
						handler: function () {
							var panel = this.up('grid');
							var sm = panel.getSelectionModel();
							if(sm.hasSelection() && sm.getSelection().length == 1) {
								var win = loadSetSubWin();
								var record = sm.getSelection()[0];
								win.applyUserid = record.data.applyUserid;
								win.show('', function() {
									//是否具有管理员权限
									win.down('#receiveFaxID').setValue(record.data.receiveFax == 'true');
									win.down('#wfApprovalID').setValue(record.data.wfApproval == 'true');
									win.down('#wfApprovalID').setDisabled(!(onWorkFlow && serverInfoModel.data.workFlow == 0 && roleInfoModel.data.workFlow == 0));
									win.down('#admineID').setValue(record.data.admine == 'true');
									win.down('#admineID').setDisabled(!(roleInfoModel && roleInfoModel.data.guOrSysAdmin == 0));
									var cmp = win.down('#endTimeID');
									var tmpDf = UTCtoLocal(record.data.endTime).split(' ');
									var timeDf = tmpDf[1].split(':');
									cmp.dateField.setValue(tmpDf[0]);
									cmp.timeHField.setValue(timeDf[0]);
									cmp.timeMField.setValue(timeDf[1]);
									cmp.timeIField.setValue(timeDf[2]);
								});
							}
						}
					}, '-',{
						text: '删除',
						iconCls:'imgBtnDel',
						handler: function () {
							var panel = this.up('grid');
							var sm = panel.getSelectionModel();
							if(sm.hasSelection() && sm.getSelection().length > 0) {
								Ext.Msg.confirm('提示', '您确认是否要彻底删除所选择的记录？', function(btn) {
									if (btn == 'yes') {
										var param = {};
										param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
										param.configparam = 'sub';
										param.taskValue = 0;
										param.userid = sm.getSelection()[0].data.applyUserid;
										param.endtime = '';
										WsCall.call('systemconfig', param, function(response, opts) {
											getMaskSub(systemconfigwin_sub);
										}, function(response, opts) {
											if(!errorProcess(response.code)) {
												Ext.Msg.alert('失败', response.msg);
											}
										}, false);
									}
								});
							}
						}
					});
				}
			}
		}
	}]
});

function getMaskSub(myWindow) {
	var param = {};
	param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
	WsCall.call('getsub', param, function(response, opts) {
		var data = Ext.JSON.decode(response.data);
		myWindow.down('#toOtherGridID').getStore().loadData(Ext.JSON.decode(data.toOther));
		myWindow.down('#otherToSelfGridID').getStore().loadData(Ext.JSON.decode(data.otherToSelf));
	}, function(response, opts) {
		if(!errorProcess(response.code)) {
			Ext.Msg.alert('失败', response.msg);
		}
	}, false);
}

function loadSetSubWin() {
	return Ext.create('Ext.window.Window',{
		extend: 'Ext.window.Window',
		title: '职责',
	    height: 200,
	    width: 360,
	    layout: 'fit',
	    border: false,
	    closeAction: 'close',
		resizable: false,
	    modal: true,   //设置window为模态
		items: {
			xtype: 'form',
			bodyPadding: 10,
	   		border: false,
		    defaultType: 'checkbox',
		    items: [{
		    	fieldLabel: '截止日期',
	    		xtype:'datetimefield',
				margin:'0 0 0 5',
				width:340,
				itemId:'endTimeID',
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
		    },{
		        xtype : 'fieldset',
				height : 100,
				padding : '5 5 5 25',
				title : '选择职责',
				width : 330,
				defaultType : 'checkbox',
		        items : [{
					boxLabel : '接收传真',
					itemId: 'receiveFaxID'
				}, {
					boxLabel : '工作流审批',
					itemId: 'wfApprovalID'
				}, {
					boxLabel : '管理员',
					itemId: 'admineID'
				}]
		    }]
		},
		buttons: [{
	        text: '确定',
	        formBind: true, 
	        handler: function() {
	        	var me = this;
	        	var w = me.up('window');
	        	var strTime = w.down('#endTimeID').getValue();
				if(strTime < Ext.util.Format.date(new Date(), 'Y-m-d H:i:s')) {
					Ext.Msg.alert('错误','截止时间不能小于当前时间');	
					return;
				}
	           	var taskValue = 0;
	           	if(w.down('#receiveFaxID').getValue()) {
	           		taskValue = taskValue | 0x01;
	           	}
	           	if(w.down('#wfApprovalID').getValue()) {
	           		taskValue = taskValue | 0x40;
	           	}
	           	if(w.down('#admineID').getValue()) {
	           		taskValue = taskValue | 0x20;
	           	}
	           	if(taskValue == 0) {
					Ext.Msg.alert('错误','请选择至少一个职责');	
					return;
	           	}
	           	var param = {};
				param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
				param.configparam = 'sub';
				param.taskValue = taskValue;
				param.userid = w.applyUserid;
				
				param.endtime = LocalDateToLongUTCstr(Ext.Date.parse(strTime, "Y-m-d H:i:s"));
				WsCall.call('systemconfig', param, function(response, opts) {
					getMaskSub(systemconfigwin_sub);
				}, function(response, opts) {
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
				}, false);
	            w.close();
	        }
	    }, {
	        text: '取消',
	        handler: function() {
	        	var me = this;
	            me.up('window').close();
	        }
	    }]
	});
}

function loadsystemconfigwin_sub() {
	return Ext.create('Ext.window.Window', {
		title: '用户职责',
		iconCls: 'config',
		closeAction:'hide',
		isFistSysCon:true,
		closable:false,
		modal:true,
		shadow:!Ext.isIE,
		tools: [{
			type: 'close',
			handler: function() {
				systemconfigwin_sub.hide();
			}
		}],
		bodyPadding: 5,
		height: 450,
		width: 625,
		border: false,
		resizable: false,
		bodyBorder:true,
		layout: {
			type:'fit'
		},
		defaults: {
			border:false
		},
		items: [{
			xtype:'form',
			border:false,
			layout:'card',
			bodyBorder:false,
			defaults: {
				border: false,
				layout:'fit'
			},
			items:[{
				xtype:'tabpanel',
				itemId:'tabSys',
				plain: true,
				bodyBoder:false,
				border:false,
				defaults: {
					border: false,
					//bodyCls: 'panelFormBg',
					layout:'fit'
				},
				items:[{
					title:'委任给他人的职责',
					itemId:'subToOther',
					items:[{
						xtype: 'TaskSubGrid',
						store: 'toOtherStoreID',
						showToolbar: true,
						itemId: 'toOtherGridID'
					},{
						xtype:'hidden',
						itemId:'toOtherID',
						name:'toOther',
						submitValue:true
					}]
				},{
					title:'他人委任的职责',
					itemId:'EmailService',
					items:[{
						xtype: 'TaskSubGrid',
						store: 'otherToSelfStoreID',
						itemId: 'otherToSelfGridID'
					},{
						xtype:'hidden',
						itemId:'otherToSelfID',
						name:'otherToSelf',
						submitValue:true
					}]
				}]
			}]//最外层 form  card
		}],//window items
		buttons: [{
				text: '关闭',
				margin: '4 10 0 0',
				width:80,
				handler: function () {
					if (systemconfigwin_sub) {
						systemconfigwin_sub.hide();
					}
				}
		}],
		listeners: {
			destroy: function () {
				systemconfigwin_sub = '';
			},
			show: function() {
				var myWindow = this;
				if(!myWindow.isFistSysCon) {
					return;
				}
				myWindow.isFistSysCon = false;
				getMaskSub(myWindow);
			}
		}
	});
}


//规则
function loadsystemconfigwin_rule() {

	return Ext.create('Ext.window.Window', {
		title: '规则',
		iconCls: 'config',
		closeAction:'hide',
		isFistSysCon:true,
		closable:false,
		modal:true,
		shadow:!Ext.isIE,
		tools: [{
			type: 'close',
			handler: function() {
				systemconfigwin_rule.hide();
			}
		}],
		bodyPadding: 5,
		height: 450,
		width: 620,
		border: false,
		resizable: false,
		bodyBorder:true,
		layout: {
			type:'fit'
		},
		defaults: {
			border:false
		},
		items: [{
			xtype:'form',
			border:false,
			layout:'card',
			bodyBorder:false,
			defaults: {
				border: false,
				layout:'fit'
			},
			items:[{
				xtype: 'Rulegrid',
				itemId: 'inRuleGridId',
				plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
				]
			},{
				xtype:'hidden',
				itemId:'inRuleValId',
				name:'inRuleVal',
				submitValue:true
			}]//最外层 form  card
		}],//window items
		
		buttons: [{
			text: '确定',
			margin: '4 10 0 213',
			xtype: 'button',
			width:80,
			handler: function () {
				var me = this;
				var w = me.up('window');
				var inRuleVal = w.down('#inRuleValId');
				var inRuleG = w.down('#inRuleGridId').getStore().data.items;
				if(inRuleG.length == 0) {
					return;
				}
				var val = new Array();
				for(var p in inRuleG) {
					val.push(inRuleG[p].data);
				}
				inRuleVal.setValue(Ext.JSON.encode(val));
				var form = w.down('form').getForm();

				if (form.isValid()) {
					form.submit({
						url: WsConf.Url + "?req=call&callname=systemconfig&configparam=rule&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "",
						success: function (form, action) {
							getUserData();
							w.hide();
						},
						failure: function (form, action) {
							if(!errorProcess(action.result.code)) {
								Ext.Msg.alert('失败', action.result.msg, function() {
								});
							}
						}
					});
				} else {
					w.down('form').updateErrorState();
				}
			}
		},{
			text: '取消',
			handler: function () {
				if (systemconfigwin_rule) {
					systemconfigwin_rule.hide();
				}
			}
		}],

		listeners: {
			destroy: function () {
				systemconfigwin_rule = '';
			},
			show: function() {
				var myWindow = this;
				if(!myWindow.isFistSysCon) {
					return;
				}
				myWindow.isFistSysCon = false;
				myWindow.down('#inRuleGridId').getStore().loadData(userConfig.inruleConfig);
			}
		}
	});
}

