Ext.create('Ext.data.Store', {
	storeId: 'resourceTypeID',
	fields: ['resourceTypeId', 'resourceTypeName'],
	data : [{
		'resourceTypeId': 'INFAX',
		'resourceTypeName': '传真收件箱'
	},{
		'resourceTypeId': 'OUTFAX',
		'resourceTypeName': '传真(已)发件箱'
	},{
		'resourceTypeId': 'DOCUMENT',
		'resourceTypeName': '文档管理'
	},{
		'resourceTypeId': 'all',
		'resourceTypeName': '全部'
	}]
});
Ext.define('WS.docmanager.docmanagerSelfFilter', {
	extend: 'Ext.window.Window',
	title: '自定义查询条件',
	height: 530,
	width: 380,
	layout: 'hbox',
	iconCls: 'infaxSelfFilter',
	bodyCls: 'panelFormBg',
	border: false,
	resizable: false,		//窗口大小不能调整
	modal: true,   //设置window为模态
	docSearchUser: function(win, field, title) {
		if(faxforwardwin == '') {
			faxforwardwin = Ext.create('WS.infax.InForward', {
				isInForWard:false,
				isDocSearch:'createUser',
				docSearchWin: win
			});
		} else {
			faxforwardwin.isInForWard = false;
			faxforwardwin.isDocSearch = field.itemId;
			faxforwardwin.docSearchWin = win;
		}
		faxforwardwin.down('#tabpalFiles').setDisabled(true);
		faxforwardwin.down('#rdDic').setDisabled(true);
		faxforwardwin.down('#rdUser').setValue(true);
		faxforwardwin.down('#forwarUserDic').setTitle('用户');
		faxforwardwin.setWidth(496);
		faxforwardwin.show('', function() {
			faxforwardwin.center();
			faxforwardwin.setTitle(title);
			faxforwardwin.down('#isDelID').setVisible(false);
			faxforwardwin.down('#userID').loadGrid(true);
			faxforwardwin.down('tabpanel').setActiveTab('forwarUserDic');	
			var serF = faxforwardwin.down('#serFielID');
			serF.store = faxforwardwin.down('#userID').getStore();
			serF.reset();
			serF.onTrigger1Click();
		});
	},
	listeners: {
		afterrender: function(com,opts) {
			//读取状态保存
			//加载State
			if(myStates.searchState) {
				for (key in myStates.searchState) {
					if(key == 'stateSaved')
						continue;					
					if(key == 'allsrc') {
						var flag = myStates.searchState['allsrc'];
						com.down('#allsrcID').setValue(flag);
					}
					if(key == 'islike') {
						var flag = myStates.searchState['islike'];
						com.down('#islikeID').setValue(flag);
					}
				}
			}
		}
	},
	items:[{
		xtype: 'form',
//		height: 480,
		width: 366,
		bodyPadding: 10,
		url: WsConf.Url,
		itemId: 'formID',
		border: false,
		bodyCls: 'panelFormBg',
		items: [{
			xtype:'fieldset',
			padding: '5 0 5 5',
			defaultType: 'checkbox',
			layout: 'hbox',
			itemId: 'fieldID',
			items:[{
				boxLabel: '在所有个人子目录下查找',
				itemId: 'allsrcID',
				width: 205,
				inputValue: '1',
				listeners: {
					change: function(com,nVal,oVal,opts) {
						myStates.searchState.allsrc = nVal;
					}
				}
			},{
				padding: '0 0 0 20',
				boxLabel: '模糊查找',
				checked: true,
				itemId: 'islikeID',
				inputValue: '2',
				listeners: {
					change: function(field,nVal,oVal,opts) {
						var me = this;
						var f = me.up('form');
						var val = field.getValue();
						f.down('#docID').setDisabled(val);
						f.down('#refDocID').setDisabled(val);
						myStates.searchState.islike = nVal;
					}
				}
			}]
		},{
			xtype:'fieldset',
			padding: '5 0 5 0',
			defaultType: 'textfield',
			itemId: 'infoID',
			defaults: {
				labelAlign: 'right',
				labelPad: 15,
				labelWidth: 120
			},
			items: [{
				padding: '5 0 0 0',
				fieldLabel: '归档文件ID',
				xtype: 'textfield',
				name: 'docID',
				itemId: 'docID',
				disabled: true,
				regex: regexNumber,
				regexText: '请输入数字',
				maxLength: 50,
				maxLengthText: '50'
			},{
				fieldLabel: '参考归档文件ID',
				xtype: 'textfield',
				name: 'refDocID',
				itemId: 'refDocID',
				disabled: true,
				regex: regexNumber,
				regexText: '请输入数字',
				maxLength: 50,
				maxLengthText: '50'
			},{
				name: 'customID',
				fieldLabel: '自定义编号',
				itemId: 'customID',
				maxLength: 250,
				maxLengthText: '最大长度为250'
			},{
				name: 'keyWord',
				fieldLabel: '关键字',
				itemId: 'keyWord',
				maxLength: 1024,
				maxLengthText: '最大长度为1024'
			},{
				name: 'comment',
				fieldLabel: '注释',
				itemId: 'commentID',
				maxLength: 1024,
				maxLengthText: '最大长度为1024'
			},{
				name: 'createUserID',
				fieldLabel: '归档用户',
				itemId: 'createUserID',
				listeners: {
					focus: function(field) {
						var win = field.up('window');
						win.docSearchUser(win, field, '归档用户');
					}
				}
			},{
				xtype: 'hiddenfield',
				name: 'hidden_1',
				itemId: 'createUserID_hide'
			},{
				name: 'lastMdfUserID',
				fieldLabel: '最后修改用户',
				itemId: 'lastMdfUserID',
				listeners: {
					focus: function(field) {
						var win = field.up('window');
						win.docSearchUser(win, field, '最后修改用户');
					}
				}
			},{
				xtype: 'hiddenfield',
				name: 'hidden_2',
				itemId: 'lastMdfUserID_hide'
			},{
				name: 'resourceType',
				fieldLabel: '资源来源类型',
				itemId: 'resourceType',
				xtype: 'combobox',
				store: 'resourceTypeID',
				queryMode : 'local',
				displayField : 'resourceTypeName',
				valueField : 'resourceTypeId',
				value: 'all',
				editable: false
			},{
				xtype: 'combobox',
				fieldLabel: '标签',
				store: 'faxFlagID',
				queryMode: 'local',
				displayField : 'faxFlagName',
				valueField: 'faxFlagId',
				name: 'faxFlag',
				itemId: 'faxFlagNameID',
				editable: false
			}]
		},{
			xtype: 'checkbox',
			boxLabel: '文档创建时间范围',
			itemId:'timeCbx',
			listeners: {
				change: function(cb, nValue, oValue, opts) {
					var me = this;
					var f = me.up('form');
					f.down('#timeID').setDisabled(!cb.getValue());
				}
			}
		},{
			xtype:'fieldset',
			padding: '5 0 5 5',
			disabled:true,
			defaultType: 'datefield',
			layout: 'hbox',
			itemId: 'timeID',
			defaults: {
				padding: '5 0 0 0'
			},
			items: [{
				name: 'startDate',
				allowBlank: false,
				itemId: 'startDateID',
				format:'Y-m-d',
				width:120
			},{
				xtype: 'label',
				html: '&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;'
			},{
				name: 'endDate',
				allowBlank: false,
				itemId: 'endDateID',
				format:'Y-m-d',
				width:120
			}]
		},{
			xtype: 'checkbox',
			boxLabel: '最后修改时间范围',
			itemId:'timeCbxLast',
			listeners: {
				change: function(cb, nValue, oValue, opts) {
					var me = this;
					var f = me.up('form');
					f.down('#timeLastModID').setDisabled(!cb.getValue());
				}
			}
		},{
			xtype:'fieldset',
			padding: '5 0 5 5',
			disabled:true,
			defaultType: 'datefield',
			layout: 'hbox',
			itemId: 'timeLastModID',
			defaults: {
				padding: '5 0 0 0'
			},
			items: [{
				name: 'startDateMod',
				allowBlank: false,
				itemId: 'startDateModID',
				format:'Y-m-d',
				width:120
			},{
				xtype: 'label',
				html: '&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;'
			},{
				name: 'endDateMod',
				allowBlank: false,
				itemId: 'endDateModID',
				format:'Y-m-d',
				width:120
			}]
		}]
	}],

	buttons: [{
		text: '重置',
		handler: function() {
			var me = this;
			var w = me.up('window');
			w.down('#formID').getForm().reset();
			var sTime = LocalToUTC(30);
			var eTime = Ext.Date.format(new Date(), 'Y-m-d');
			w.down('#startDateID').setValue(sTime);
			w.down('#endDateID').setValue(eTime);
			w.down('#startDateModID').setValue(sTime);
			w.down('#endDateModID').setValue(eTime);
		}
	},{
		text: '确定',
		formBind: true, //only enabled once the form is valid
		handler: function() {
			var me = this;
			var w = me.up('window');
			var filter = '';
			var store = w.grid.getStore();
			if(w.down('#allsrcID').getValue()) {
				//若在所有资源目录下查找
				store.getProxy().extraParams.folderFlag = 'all';
			} else {
				store.getProxy().extraParams.folderFlag = '';
			}
			var customID = w.down('#customID').getValue();
			var keyWord = w.down('#keyWord').getValue();
			var comment = w.down('#commentID').getValue();
			var createUserID = w.down('#createUserID_hide').getValue();
			var lastMdfUserID = w.down('#lastMdfUserID_hide').getValue();
			var resourceType = w.down('#resourceType').getValue();
			var faxFlag = w.down('#faxFlagNameID').getValue();
			if(w.down('#islikeID').getValue()) {	//模糊查找
				if(customID.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +"upper("+tplPrefix +"customid) like '%" + customID.toUpperCase() + "%'";
				}
				if(keyWord.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +"upper("+tplPrefix +"keyword) like '%" + keyWord.toUpperCase() + "%'";
				}
				if(comment.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +"upper("+tplPrefix +"comment) like '%" + comment.toUpperCase() + "%'";
				}
			} else {
				var docID = w.down('#docID').getValue();
				var refDocID = w.down('#refDocID').getValue();
				if(docID.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +tplPrefix +'id=' + docID;
				}
				if(refDocID.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +tplPrefix +'refdocid=' + refDocID;
				}
				if(customID.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"customid='" + customID + "'";
				}
				if(keyWord.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"keyword='" + keyWord + "'";
				}
				if(comment.length > 0) {
					filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"comment='" + comment + "'";
				}
			}

			if(w.down('#timeCbx').getValue()) {
				var startDate = w.down('#startDateID').getValue();
				var endDate = w.down('#endDateID').getValue();
				filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"createdatetime>='" + LocalDateToLongUTCstr(startDate) + "' ";
				var locDate = new Date();
				locDate.setTime(endDate.getTime() + (24*3600*1000 -1000));
				filter += "and "+tplPrefix +"createdatetime<='" + LocalDateToLongUTCstr(locDate) + "'";
			}
			if(createUserID.length > 0) {
				filter += (filter.length > 0 ? ' and ': '') +tplPrefix +'createuserid=' + createUserID;
			}
			if(lastMdfUserID.length > 0) {
				filter += (filter.length > 0 ? ' and ': '') +tplPrefix +'lastmdfuserid=' + lastMdfUserID;
			}
			if(resourceType.length > 0 && resourceType != 'all') {
				filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"resourcetype='" + resourceType + "'";
			}
			if(faxFlag && faxFlag.length > 0) {
				filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"docflag=" + faxFlag;
			}

			if(w.down('#timeCbxLast').getValue()) {
				var startDateMod = w.down('#startDateModID').getValue();
				var endDateMod = w.down('#endDateModID').getValue();
				filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"lastmdfdatetime>='" + LocalDateToLongUTCstr(startDateMod) + "' ";
				var locDate = new Date();
				locDate.setTime(endDateMod.getTime() + (24*3600*1000 -1000));
				filter += "and "+tplPrefix +"lastmdfdatetime<='" + LocalDateToLongUTCstr(locDate) + "'";
			}
			if(filter.length == 0) {
				return;
			}
			store.filterMap.replace('filter', filter);
			//保存状态
			//保存变量并上传
			var tmpS = myStates.searchState;
			wsUserStates.setServerState('searchState',tmpS);
			store.getProxy().extraParams.tplsearch = '';
			w.grid.loadGrid(true);
			if(w.down('#allsrcID').getValue()) {
				gridTitle.setTitle('查找结果 { 所有资源目录 }');
			} else {
				var str = linkViewTitle(docTree.getSelectionModel().getSelection());
				gridTitle.setTitle('查找结果 {' + str + '}');
			}
			modActionStates(w.grid, true);
			w.close();
		}
	},{
		text: '取消',
		handler: function() {
			this.up('window').close();
		}
	}]
});