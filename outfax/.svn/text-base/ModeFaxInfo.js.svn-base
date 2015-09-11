Ext.define('WS.outfax.ModeFaxInfo', {
	extend: 'Ext.window.Window',
	alternateClassName: ['ModeFaxInfo'],
	alias: 'widget.ModeFaxInfo',
	iconCls:'config',
	title: '收件人信息',
	//bodyCls: 'panelFormBg',
	border: false,
	height: 350,
	width: 450,
	modal: true,
	resizable: false,
	items:[{
		xtype: 'form',
		//bodyCls: 'panelFormBg',
		border: false,
		bodyPadding: 5,
		url: WsConf.Url,
		layout: {
			type:'table',
			columns:2
		},
		itemId: 'formID',
		defaults: {
			xtype: 'textfield',
			labelAlign: 'right',
			labelWidth: 70,
			width: 410,
			margin: '10 0 0 0'
		},
		items:[{
			name: 'faxNumber',
			itemId: 'faxNum',
			fieldLabel: '传真号码',
			width:250,
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
			name: 'faxNumberExt',
			fieldLabel: '分机号',
			itemId: 'faxNumExt',
			labelWidth: 53,
			width:155
		},{
			name: 'recipientEmail',
			fieldLabel: '邮箱',
			itemId: 'email',
			colspan:2
		},{
			name: 'recipientMobileNumber',
			fieldLabel: '移动电话',
			itemId: 'mobile',
			colspan:2
		},{
			name: 'recipient',
			fieldLabel: '收件人',
			itemId: 'recipient',
			colspan:2
		},{
			name: 'recipientOrganization',
			fieldLabel: '组织',
			itemId: 'organiz',
			colspan:2
		},{
			name: 'subject',
			fieldLabel: '主题',
			itemId: 'subject',
			colspan:2
		},{
			name: 'comment',
			fieldLabel: '注释',
			xtype: 'textareafield',
			itemId: 'comment',
			colspan:2

		}]
	}],
	buttons:[{
		width: 100,		
		text: '通讯录',
		iconCls: 'addressTitle',
		handler: function () {
			if (addresspersonwin == '') {
				createSAddressStroe();
				addresspersonwin = loadaddresspersonwin(this.up('window'));
			}
		}
	},{
		text: '确定',
		itemId: 'submit',
		handler: function() {
			var me = this;
			var w = me.up('window');
			var form = w.down('#formID').getForm();
			if(w.grid) {
				if(form.isValid()) {
					var param = {
						sessiontoken: getSessionToken(),
						id: w.outFaxID,
						faxNum: w.down('#faxNum').getValue(),
						faxNumExt: w.down('#faxNumExt').getValue(),
						email: w.down('#email').getValue(),
						mobile: w.down('#mobile').getValue(),
						recipient: w.down('#recipient').getValue(),
						organiz: w.down('#organiz').getValue(),
						subject: w.down('#subject').getValue(),
						comment: w.down('#comment').getValue()
					};
					WsCall.call('modInfo', param, function (response, opts) {
						Ext.Msg.alert('成功', '修改信息成功');

						w.grid.loadGrid();

					}, function (response, opts) {
						if(!errorProcess(response.code)) {
							Ext.Msg.alert('失败', response.msg);
						}
					},true,'正在修改信息');
					w.close();
				}

			} else {
				if(form.isValid()) {
					if(w.orcrecord) {
						w.orcrecord.set('faxNumber', w.down('#faxNum').getValue());
						w.orcrecord.set('faxNumberExt', w.down('#faxNumExt').getValue());
						w.orcrecord.set('recipientEmail', w.down('#email').getValue());
						w.orcrecord.set('recipientMobileNumber', w.down('#mobile').getValue());
						w.orcrecord.set('recipient', w.down('#recipient').getValue());
						w.orcrecord.set('recipientOrganization', w.down('#organiz').getValue());
						//w.orcrecord.set('subject', w.down('#subject').getValue());
						w.orcrecord.set('comment', w.down('#comment').getValue());
						w.orcrecord.commit();
					}
					w.close();
				}

			}

		}
	},{
		text: '取消',
		handler: function() {
			var me = this;
			me.up('window').close();
		}
	}]
});