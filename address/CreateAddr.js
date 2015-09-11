

Ext.create('Ext.data.Store', {
			storeId : 'genderID',
			fields : ['gender', 'genderName'],
			data : [{
						'gender' : '0',
						'genderName' : genderArr[0]
					}, {
						'gender' : '1',
						'genderName' : genderArr[1]
					}]
		});

Ext.define('WS.address.CreateAddr', {	
	extend : 'Ext.window.Window',
	title : "<div><img src='resources/images/grid/book_edit.png' style='margin-bottom: -5px;'>&nbsp; "
			+ '修改联系人' + "</div>",
	//bodyCls : 'panelFormBg',
	border : false,
	height : 400,
	width : 450,
	layout : 'vbox',
	modal : true,
	resizable : false,
	items : [{
				xtype : 'form',
				height : 350,
				width : 440,
				//bodyCls : 'panelFormBg',
				border : false,
				bodyPadding : 5,
				url : WsConf.Url,
				itemId : 'formID',
				items : [{
							xtype : 'tabpanel',
							//bodyCls : 'panelFormBg',
							border : false,
							height : 340,
							width : 430,
							itemId : 'personInfoID',
							defaults : {
								border : false
								//bodyCls : 'panelFormBg'
							},
							items : [{
//								xtype : 'form',
								border : false,
								//bodyCls : 'panelFormBg',
								title : '个人信息',
								items : [{
											border : false,
											//bodyCls : 'panelFormBg',
											// layout: 'hbox',
											layout : {
												type : 'table',
												columns : 2
											},
											defaults : {
												labelAlign : 'right',
												labelPad : 5,
												margin : '10 0 0 0',
												width : 200,
												
												maxLength : 100,
												maxLengthText : '最大长度为100',
												xtype : 'textfield'
											},
											items : [{
														name : 'lastName',
														fieldLabel : '姓',
														itemId : 'LastNameID'

													}, {
														xtype : 'combobox',
														name : 'gender',
														fieldLabel : '性别',
														store : 'genderID',
														queryMode : 'local',
														displayField : 'genderName',
														valueField : 'gender',
														value : '0',
														editable : false
													}, {
														name : 'firstName',
														fieldLabel : '名',
														itemId : 'FirstNameID'
													}, {
														name : 'dispName',
														fieldLabel : '显示名',
														itemId : 'DispNameID',
														allowBlank : false,
														blankText : '显示名不能为空'
													}, {
														name : 'spareFaxNumber',
														fieldLabel : '客户编号',
														itemId : 'sparefaxnumberID'
													}, {
														name : 'title',
														fieldLabel : '职位',
														itemId : 'TitleID',
														maxLength : 25,
														maxLengthText : '最大长度为25'
													}, {
														name : 'state',
														fieldLabel : '省/州',
														itemId : 'StateID'
													}, {
														name : 'city',
														fieldLabel : '城市',
														itemId : 'CityID'
													}, {

														name : 'faxNumber',
														fieldLabel : '传真号码',
														itemId : 'FaxNumberID'
													}, {
														name : 'faxNumberExt',
														fieldLabel : '传真分机',
														itemId : 'FaxNumberExtID',
														maxLength : 25,
														maxLengthText : '最大长度为25',
														regex : regexNumber,
														regexText : '请输入数字'
													}, {
														labelAlign : 'right',
														labelPad : 5,
														margin : '10 0 0 0',
														xtype : 'textfield',
														name : 'comment',
														fieldLabel : '注释',
														itemId : 'commentID',
														width : 400,
														maxLength : 100,
														maxLengthText : '最大长度为100',
														colspan : 2
													}, {
														xtype: 'hiddenfield',
												        name: 'hidSelTree',
												        itemId: 'hidSelTreeId'
													}]
										}]

									// defaults: {
									// labelAlign: 'right',
									// labelPad: 15,
									// width: 300
									// },
									// defaultType: 'textfield',

							}, {
//								xtype : 'form',
								title : '组织信息',
								defaults : {
									labelAlign : 'right',
									labelPad : 15,
									width : 380,
									labelWidth: 150,
									maxLength : 100,
									maxLengthText : '最大长度为100'
								},
								defaultType : 'textfield',
								items : [{
											margin : '20 0 0 0',
											name : 'organization',
											fieldLabel : '所属组织',
											itemId : 'OrganizationID'
										}, {
											margin : '10 0 0 0',
											name : 'department',
											fieldLabel : '所属部门',
											itemId : 'DepartmentID'
										}, {
											margin : '10 0 0 0',
											name : 'country',
											fieldLabel : '国家',
											itemId : 'CountryID'
										}, {
											margin : '10 0 0 0',
											name : 'zipCode',
											fieldLabel : '邮政编码',
											itemId : 'ZipCodeID',
											maxLength : 25,
											maxLengthText : '最大长度为25'
										}, {
											margin : '10 0 0 0',
											name : 'address',
											fieldLabel : '地址',
											itemId : 'AddressID'
										}]
							}, {
//								xtype : 'form',
								title : '联系信息',
								defaultType : 'textfield',
								items : [{
											margin : '10 10 10 0',
											labelAlign : 'right',
											labelWidth: 150,
											labelPad : 15,
											width : 360,
											name : 'countryCode',
											fieldLabel : '国家代码',
											itemId : 'CountryCodeID',
											maxLength : 8,
											maxLengthText : '最大长度为8'
										}, {
											xtype : 'fieldset',
//											collapsible : true,
											defaultType : 'textfield',
											margin : '0 10 10 10',
											title : '电话',
											defaults : {
												labelAlign : 'right',
												labelPad : 15,
												width : 340,
												labelWidth: 125,
												maxLength : 100,
												maxLengthText : '最大长度为100'
											},
											items : [{
														name : 'phoneNumber',
														fieldLabel : '电话号码',
														itemId : 'PhoneNumberID'
													}, {
														name : 'phoneNumberExt',
														fieldLabel : '电话号码分机',
														itemId : 'PhoneNumberExtID',
														maxLength : 25,
														maxLengthText : '最大长度为25'
													}, {
														name : 'mobileNumber',
														fieldLabel : '手机号',
														itemId : 'MobileNumberID',
														maxLength : 25,
														maxLengthText : '最大长度为25'
													}]
										}, {

											xtype : 'fieldset',
//											collapsible : true,
											defaultType : 'textfield',
											margin : '10 10 10 10',
											title : '其它',
											defaults : {
												labelAlign : 'right',
												labelPad : 15,
												labelWidth: 125,
												width : 340,
												maxLength : 100,
												maxLengthText : '最大长度为100'
											},
											items : [{
														name : 'IMNumber',
														fieldLabel : '即时通讯号码',
														itemId : 'IMNumberID'
													}, {
														name : 'email',
														fieldLabel : '电子邮件',
														itemId : 'EmailID'
													}, {
														name : 'web',
														fieldLabel : '个人web地址',
														itemId : 'WebID'
													}]

										}]
							}
							// , {
							// xtype: 'form',
							// title: '印鉴',
							// items: [{
							// margin: '10 10 10 20',
							// xtype: 'filefield',
							// name: 'photo',
							// labelWidth: 50,
							// msgTarget: 'side',
							// allowBlank: false,
							// anchor: '100%',
							// buttonText: '请选择印鉴...',
							// listeners: {
							// change: function(me, value, op) {
							// var p = me.up('form').down('#browseID');
							// Ext.core.DomHelper.insertHtml('beforeBegin', p,
							// value);
							// p.down('html').down('img').src = me.getValue();
							//			        		
							// }
							// }
							//
							// }, {
							// xtype:'panel',
							// layout: 'fit',
							// itemId: 'browseID',
							// height: 280,
							// // html: '<img
							// src="resources/images/fax/block.png">'
							// html: ''
							//    				
							// // collapsible: true,
							// // margin: '10 10 10 10',
							// // title: '预览',
							// // items: [{
							// //
							// // }]
							// }]
							// }
							]

						}]
			}],
	buttons : [{
				text : '重置',
				handler : function() {
					var me = this;
					var t = me.up('toolbar');
					var w = t.up('window');
					var f = w.getComponent('formID');
					f.getForm().reset();
					if (w.action == 'update') {
						var sm = w.grid.getSelectionModel();
						if (sm.hasSelection()) {
							f.getForm().loadRecord(sm.getSelection()[0]);
						}
					}
				}
			}, {
				text : '确定',
				itemId : 'submit',
				handler : function() {
					var me = this;
					var w = me.up('window');
					var form = w.down('#formID').getForm();
					var pbid = 0;
					if (w.action == 'update') {
						pbid = w.grid.getSelectionModel().getSelection()[0].data.phoneBookID;

					}
					if (form.isValid()) {
						form.submit({
									params : {
										req : 'dataset',
										dataname : 'address', // dataset名称，根据实际情况设置,数据库名
										restype : 'json',
										action : w.action,
										sessiontoken : getSessionToken(),
										phoneBookID : pbid

									},
									success : function(form, action) {
										w.grid.loadGrid();
										w.close();

									},
									failure : function(form, action) {
										if(!errorProcess(action.result.code)) {
											Ext.Msg.alert('失败', action.result.msg);
										}
										w.close();
									}

								});
					}
				}
			}, {
				text : '取消',
				handler : function() {
					var me = this;
					me.up('toolbar').up('window').close();

				}
			}]

});