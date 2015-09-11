Ext.create('Ext.data.Store', {
	storeId: 'priorityID',
	fields: ['priorityId', 'priorityName'],
	data : [{
		'priorityId': 0,
		'priorityName': priorityArr[0]
	},{
		'priorityId': 1,
		'priorityName': priorityArr[1]
	},{
		'priorityId': 2,
		'priorityName': priorityArr[2]
	},{
		'priorityId': 3,
		'priorityName': priorityArr[3]
	},{
		'priorityId': 4,
		'priorityName': priorityArr[4]
	}]
});

Ext.define('WS.succoutfax.ModifyCodeResend', {
	extend: 'Ext.window.Window',
	title: '改号重发',
	iconCls: 'modeResendICON',
	//bodyCls: 'panelFormBg',
	border: false,
	layout: 'vbox',
	height: 270,
	width: 420,
	resizable: false,
	items: [{
		xtype: 'form',
		width: 410,
		bodyPadding: 5,
		url: WsConf.Url,
		defaultType: 'textfield',
		itemId: 'formID',
		border: false,
		//bodyCls: 'panelFormBg',
		items: [{
			xtype:'fieldset',
			collapsible: true,
			layout:{
				type:'table',
				columns:2
			},
			defaults: {
				xtype: 'textfield',
				labelAlign: 'right',
				colspan:2,
				width:300,
				labelPad: 15,
				maxLength: 100,
				maxLengthText: '最大长度为100'
			},
			items: [{
				itemId: 'faxNumID',
				name: 'faxNumber',
				width:250,
				colspan:1,
				fieldLabel: '传真号码',
				regex: regexFaxNumber1,
				regexText: '请输入正确的格式！'+'<br/> ' +'支持的格式:'+'<br/> +86(20)11111111 <br/> +20 11111111 <br/> 028-11111111 <br/> (028)11111111<br/> 02811111111',
				listeners: {
					blur: function (field, opts) {
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
				xtype: 'button',
				width: 100,
				colspan:1,
				margin: '0 0 5 10',
				text: '通讯录',
				iconCls: 'addressTitle',
				handler: function () {
					if (addresspersonwin == '') {
						createSAddressStroe();						
						addresspersonwin = loadaddresspersonwin(this.up('window'));						
					}
				}
			},{
				itemId: 'faxNumExtID',
				name: 'faxnumberExt',
				fieldLabel: '分机号'
			},{
				name: 'recipient',
				itemId: 'recID',
				fieldLabel: '收件人'
			},{
				labelPad: 15,
				xtype: 'combobox',
				itemId: 'prioID',
				name: 'priority',
				fieldLabel: '优先级',
				store: 'priorityID',
				queryMode : 'local',
				displayField : 'priorityName',
				valueField : 'priorityId',
				editable: false
			},{
				name: 'subject',
				itemId: 'subjectID',
				fieldLabel: '传真主题',
				width: 340
			}]
		},{
			xtype:'fieldset',
			collapsible: true,
			layout: 'hbox',
			items: [{
				xtype:'checkbox',
				boxLabel: '全部重发'+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
				itemId: 'allResendID',
				inputValue: '1',
				padding: '0 0 0 20',
				checked: true,
				listeners: {
					change: function(field) {
						if(field.getValue()) {
							var f = field.up('fieldset');
							var n = f.down('#frompageID');
							n.setDisabled(true);
						} else {
							var f = field.up('fieldset');
							var n = f.down('#frompageID');
							n.setDisabled(false);
						}
					}
				}
			},{
				//		    		padding: '0 0 0 20',
				xtype:'numberfield',
				itemId: 'frompageID',
				name: 'frompage',
				fieldLabel: '从第',
				labelAlign: 'right',
				labelPad: 5,
				value: 1,
				minValue: 1,
				disabled: true,
				width: 200
			},{
				padding: '0 0 0 10',
				disabled: true,
				xtype: 'label',
				text: '页开始重发'
			}]
		}]

	}],
	buttons:[{

		text: '重置',
		handler: function() {
			var me = this;
			var t = me.up('toolbar');
			var w = t.up('window');
			var f = w.getComponent('formID');
			f.getForm().reset();
			var sm = w.grid.getSelectionModel();
			var records = sm.getSelection();
			f.getForm().loadRecord(records[0]);
			w.down('#prioID').setValue(2);
			w.down('#faxNumID').focus(true);
		}
	},{
		text: '确定',
		itemId: 'submit',
		formBind: true,
		handler: function() {
			var me = this;
			var w = me.up('window');
			var form = w.down('form').getForm();
			if (!form.isValid()) {
				return;
			}
			var checkb = w.down('#allResendID');
			var param = {
				sessiontoken: getSessionToken(),
				faxnum: w.down('#faxNumID').getValue(),
				faxnumext: w.down('#faxNumExtID').getValue(),
				rece: w.down('#recID').getValue(),
				prior: w.down('#prioID').getValue(),
				subject: w.down('#subjectID').getValue(),
				faxid: w.grid.getSelectionModel().getSelection()[0].data.outFaxID
			}
			if(checkb.getValue()) {
				param.page = '';

			} else {
				param.page = w.down('#frompageID').getValue();
			}
			WsCall.call('modifResend',param, function() {
				w.grid.loadGrid();
			}, function(res) {
				errorProcess(res.code)
				w.grid.loadGrid();
			});
			w.close();
		}
	},{
		text: '取消',
		handler: function() {
			var me = this;
			me.up('toolbar').up('window').close();

		}
	}]
});