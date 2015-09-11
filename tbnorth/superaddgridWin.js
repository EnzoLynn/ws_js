//传真号码转换
function covertToRightNumber(isValid,number) {
	if (isValid) {
		//var faxNumber = number;
		var regex1 = /^\+.*$/;
		var regex2 = /^\(.*$/;
		var regex3 = /^.*-.*$/;

		var regex4 = /^\((\d*)\)(.*)$/; //(028)转换
		var regex5 = /^(\d*)(-)(.*)$/; //028- 转换

		var regex6 = /^(0+)([1-9])([0-9])([0-9]{0,1})(.*)$/; //0000000281111111 转换
		var regex7 = /^[3-9]$/; //3-9
		//无+
		if (!regex1.test(number)) {
			if(number.indexOf('sip:')!=-1) {
				return number;
			}
			//判断当前国家代码
			//非86
			if(userConfig.countryCode != '86') {
				//number = "+" + userConfig.countryCode + " "+number;
				number = number.replace('-','');
				var zeroIndex1 = number.search("0");
				if (zeroIndex1 != 0) {
					number = "+" + userConfig.countryCode + " "+number;
				} else {
					number = number.replace(regex6, function ($0, $1, $2, $3, $4, $5) {
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
				if (regex2.test(number)) {
					number = number.replace(regex4, function ($0, $1, $2) {
						var zeroIndex = $1.search("0");
						if (zeroIndex == 0) {
							$1 = $1.substring(1, $1.length);
						}
						return ("+" + userConfig.countryCode + "(" + $1 + ")" + $2);
					});
				} else {
					//有-
					if (regex3.test(number)) {
						number = number.replace(regex5, function ($0, $1, $2, $3) {
							var zeroIndex = $1.search("0");
							if (zeroIndex == 0) {
								$1 = $1.substring(1, $1.length);
							}
							return ("+" + userConfig.countryCode + "(" + $1 + ")" + $3);
						});
					} else {//0+[1-9]\d{2,}
						var zeroIndex1 = number.search("0");
						if (zeroIndex1 != 0) {
							//number = "+" + userConfig.countryCode + "(" + userConfig.areaCode + ")" + number;
							if(userConfig.areaCode != '') {
								number = "+" + userConfig.countryCode + "(" + userConfig.areaCode + ")" + number;
							} else {
								number = "+" + userConfig.countryCode + " " + number;
							}
						} else {
							number = number.replace(regex6, function ($0, $1, $2, $3, $4, $5) {
								// if ($2 == 1 || $2 == 2)
								// return ("+"+userConfig.countryCode +"(" + $2 + $3 + ")" + $4 + $5);
								// if (regex7.test($2))
								// return ("+" + userConfig.countryCode + "(" + $2 + $3 + $4 + ")" + $5);
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

	} else {
		//var faxNumber1 = number;
		var regexNumber = /^\d+$/;
		if (regexNumber.test(number)) {
			// var zeroIndex1 = number.search("0");
			// if (zeroIndex1 != 0) {
			// number = "+" + userConfig.countryCode + "(" + userConfig.areaCode + ")" + number;
			// }
			var zeroIndex1 = number.search("0");
			if (zeroIndex1 != 0) {
				//非86
				if(userConfig.countryCode != '86') {
					number = "+" + userConfig.countryCode + " " + number;
				} else {//86
					if(userConfig.areaCode!='') {
						number = "+" + userConfig.countryCode + "(" + userConfig.areaCode + ")" + number;
					} else {
						number = "+" + userConfig.countryCode + " " + number;
					}
				}				 
			}
		}
	}

	return number;
}

Ext.define('WS.tbnorth.superaddModel', {
	extend: 'Ext.data.Model',
	idProperty: 'phoneBookID',
	alternateClassName: ['superaddModel'],
	fields: [{
		name: 'dispName',
		type: 'string'
	},{
		name: 'phoneBookID',
		type: 'string'
	},{
		name: 'gender',
		type: 'string'
	},{
		name: 'organization',
		type: 'string'
	},{
		name: 'state',
		type: 'string'
	},{
		name: 'city',
		type: 'string'
	},{
		name: 'address',
		type: 'string'
	},{
		name: 'countryCode',
		type: 'string'
	},{
		name: 'faxNumber',
		type: 'string'
	},{
		name: 'faxNumberExt',
		type: 'string'
	},{
		name: 'phoneNumber',
		type: 'string'
	},{
		name: 'mobileNumber',
		type: 'string'
	},{
		name: 'email',
		type: 'string'
	},{
		name: 'firstName',
		type: 'string'
	},{
		name: 'lastName',
		type: 'string'
	},{
		name: 'title',
		type: 'string'
	},{
		name: 'department',
		type: 'string'
	},{
		name: 'country',
		type: 'string'
	},{
		name: 'zipCode',
		type: 'string'
	},{
		name: 'web',
		type: 'string'
	},{
		name: 'iMNumber',
		type: 'string'
	},{
		name: 'comment',
		type: 'string'
	},{
		name: 'phoneNumberExt',
		type: 'string'
	},{
		name: 'spareFaxNumber',
		type: 'string'
	}

	]
});

//追加联系人用数据类
var linkmanClass = {
	faxNumber:'',
	subNumber:'',
	faxReceiver:'',
	email:'',
	mobile:'',
	organization:''
};
//追加联系人用Array
var LinkMenArr = new Array();

Ext.create('Ext.data.Store', {
	model: 'WS.tbnorth.superaddModel',
	storeId: 'linkmenGridStore'
});

var lkGridRowEditing;

//base
Ext.define('WS.tbnorth.linkmenGrid', {
	extend: 'Ext.grid.Panel',
	alternateClassName: ['linkmenGrid'],
	alias: 'widget.linkmenGrid',
	store: 'linkmenGridStore',
	columnLines: true,
	multiSelect: true,

	tbar: [{
		text: '追加收件人',
		iconCls: 'employee-add',
		handler : function() {
			lkGridRowEditing.cancelEdit();

			// Create a record instance through the ModelManager
			var r = Ext.ModelManager.create({
				dispName: '',
				faxNumber: '',
				faxNumberExt: '',
				mobileNumber: '',
				email: '',
				organization:'',
				spareFaxNumber:''
			}, 'WS.tbnorth.superaddModel');

			Ext.StoreMgr.lookup('linkmenGridStore').insert(0, r);

			lkGridRowEditing.startEdit(0, 0);

		}
	},{
		itemId: 'removeLinkMen',
		text: '删除',
		iconCls: 'employee-remove',
		handler: function() {
			var me = this;
			var sm = me.up('linkmenGrid').getSelectionModel();
			lkGridRowEditing.cancelEdit();
			Ext.StoreMgr.lookup('linkmenGridStore').remove(sm.getSelection());
			if (Ext.StoreMgr.lookup('linkmenGridStore').getCount() > 0) {
				sm.select(0);
			}
		},
		disabled: true
	},{
		text:'通讯录',
		iconCls: 'addressTitle',
		handler: function() {
			if(superadditionwin == '') {
				superadditionwin = loadsuperadditionwin();
			}
		}
	}],
	listeners: {
		'selectionchange': function(view, records) {
			var me = this;
			me.down('#removeLinkMen').setDisabled(!records.length);
		}
	},
	columns : [{
		header: '显示名 ',
		dataIndex: 'dispName',
		flex: 1,
		renderer: function(value) {
			return "<div><img src='resources/images/grid/pbrecord.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';
		},
		editor: {

		}
	},{
		header: '传真号码 ',
		dataIndex: 'faxNumber',
		flex: 1.5,
		editor: {
			allowBlank: false,
			blankText: '传真号码不能为空',			
			maxLength: 50,
			maxLengthText: '传真号码长度最大为50字节',
			regex: regexFaxNumber1,
			regexText: '请输入正确的格式！'+'<br/> '+'支持的格式:'+'<br/> +86(20)11111111 <br/> +20 11111111 <br/> 028-11111111 <br/> (028)11111111<br/> 02811111111'
		}
	},{
		header: '传真分机 ',
		dataIndex: 'faxNumberExt',
		flex: 1,
		editor: {

		}
	},{
		header: '手机号码 ',
		dataIndex: 'mobileNumber',
		flex: 1,
		editor: {

		}
	},{
		header: 'Email ',
		dataIndex: 'email',
		flex: 1.5,
		editor: {
			//regex:regexEmail,
			//regexText:'请输入正确的邮箱格式！'
		}
	},{
		header: '组织',
		dataIndex: 'organization',
		flex: 1,
		editor: {

		}
	},{
		header: '客户编号 ',
		dataIndex: 'spareFaxNumber',
		flex: 1,
		editor: {

		}
	}

	]
});

//追加联系人linkmen
function loadlinkmenwin() {
	return Ext.create('Ext.window.Window', {
		title: '追加收件人',
		iconCls: 'sendfaxPushAddr',
		height: 400,
		width: 800,
		layout: {
			type: 'fit'
		},
		collapsible: false,
		resizable: false,
		frame: false,
		border: false,
		modal: true,
		items: [{
			xtype:'linkmenGrid',
			itemId:'linkmenGrid',
			plugins: [
			lkGridRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
				clicksToMoveEditor: 1,
				autoCancel: true,
				listeners: {
					edit: function(editor,obj,opts) {
						editor.context.record.data.faxNumber = covertToRightNumber(true,editor.context.record.data.faxNumber);
						Ext.StoreMgr.lookup('linkmenGridStore').sort('dispName');
					},
					beforeedit: function(editor,obj,opts) {
						lkGridRowEditing.getEditor().saveBtnText = '提交';
						lkGridRowEditing.getEditor().cancelBtnText = '取消';
						lkGridRowEditing.getEditor().errorsText = '错误';
					}
				}
			})]
		}],
		buttons: [{
			text: '确定',
			itemId: 'submit',
			formBind: true,
			handler: function() {
				var me = this;
				var w = me.up('window');
				w.down('#linkmenGrid').getSelectionModel().selectAll();

				var sm = w.down('#linkmenGrid').getSelectionModel();
				var smRecs = sm.getSelection();

				var isError = false;
				//追加联系人用Array
				LinkMenArr = new Array();

				Ext.Array.each(smRecs, function(rec,index,allrecs) {
					if(isError) {
						return;
					}
					if(rec.data.faxNumber == '' || rec.data.faxNumber.length < 0 || rec.data.faxNumber.indexOf('?') != -1) {
						isError = true;
						lkGridRowEditing.startEdit(rec, 0);
						return;
					}
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
				if(isError) {
					Ext.Msg.alert('警告','您选择的收件人中含有空(无效)传真号码或重复数据！请修改后提交！');
				} else {
					sendfaxwin.down('#btnSuperadd').setText('追加收件人     已追加收件人:'+LinkMenArr.length+'位' );
					w.close();
				}

			}
		},{
			text: '取消',
			handler: function() {
				var me = this;
				lkGridRowEditing.cancelEdit();
				me.up('window').close();

			}
		}],
		listeners: {
			beforedestroy: function() {
				var me = this;
				me.down('#linkmenGrid').destroy();
			},
			destroy: function () {
				linkmenwin = '';
				showFlash(sendfaxwin);
			}
		}
	}).show();

}