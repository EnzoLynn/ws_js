Ext.create('Ext.data.Store', {
	storeId: 'faxFlagID',
	fields: ['faxFlagId', 'faxFlagName'],
	data : [{
		'faxFlagId': '0',
		'faxFlagName': faxFlagArr[0]
	},{
		'faxFlagId': '1',
		'faxFlagName': faxFlagArr[1]
	},{
		'faxFlagId': '2',
		'faxFlagName': faxFlagArr[2]
	},{
		'faxFlagId': '3',
		'faxFlagName': faxFlagArr[3]
	},{
		'faxFlagId': '4',
		'faxFlagName': faxFlagArr[4]
	},{
		'faxFlagId': '5',
		'faxFlagName': faxFlagArr[5]
	},{
		'faxFlagId': '6',
		'faxFlagName': faxFlagArr[6]
	},{
		'faxFlagId': '7',
		'faxFlagName': faxFlagArr[7]
	},{
		'faxFlagId': '8',
		'faxFlagName': faxFlagArr[8]
	},{
		'faxFlagId': '9',
		'faxFlagName': faxFlagArr[9]
	},{
		'faxFlagId': '10',
		'faxFlagName': faxFlagArr[10]
	},{
		'faxFlagId': '11',
		'faxFlagName': faxFlagArr[11]
	}
	]
});

Ext.define('WS.infax.InfaxSelfFilter', {
	extend: 'Ext.window.Window',
	title: '自定义查询条件',
	height: 445,
	width: 380,
	layout: 'hbox',
	iconCls: 'infaxSelfFilter',
	bodyCls: 'panelFormBg',
	border: false,
	resizable: false,		//窗口大小不能调整
	modal: true,   //设置window为模态
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
//		height: 450,
		width: 366,
		bodyPadding: 10,
		url: WsConf.Url,
		itemId: 'formID',
		border: false,
		bodyCls: 'panelFormBg',
		items: [{
			xtype:'fieldset',
			padding: '5 0 5 15',
//			collapsible: true,
			defaultType: 'checkbox',
			layout: 'hbox',
			itemId: 'fieldID',
			items:[{
				boxLabel: '在所有个人子目录下查找',
				itemId: 'allsrcID',
				inputValue: '1',
				width: 205,
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
					change: function(com,nVal,oVal,opts) {
						myStates.searchState.islike = nVal;
					}
				}
			}]
		},{
			xtype:'fieldset',
			padding: '7 0 5 5',
			defaultType: 'textfield',
			layout: 'hbox',
			items: [{
				margin: '0 0 0 30',
				xtype: 'checkbox',
				boxLabel: '流水号',
				listeners: {
					change: function(field) {
						var me = this;
						var f = me.up('form');
						var val = field.getValue();
						f.down('#infoID').setDisabled(val);
						f.down('#timeCbx').setDisabled(val);
						if(val) {
							f.down('#timeCbx').setValue(false);
						}
						f.down('#islikeID').setDisabled(val);
						f.down('#idinputID').setDisabled(!val);
					}
				}
			},{
				padding: '0 0 0 20',
				xtype: 'textfield',
				name: 'inFaxID',
				itemId: 'idinputID',
				disabled: true,
				regex: regexNumber,
				regexText: '请输入数字',
				maxLength: 50,
				maxLengthText: '50'
			}]
		},{

			xtype:'fieldset',
			padding: '7 0 5 0',
//			collapsible: true,
			defaultType: 'textfield',
			itemId: 'infoID',
			defaults: {
				labelAlign: 'right',
				labelPad: 15,
				labelWidth: 120,
				maxLength: 100,
				maxLengthText: '最大长度为100'
			},
			items: [{
				name: 'callerID',
				fieldLabel: '呼叫者标识',
				itemId: 'callerID',
				maxLength: 50,
				maxLengthText: '最大长度为50'
			},{
				name: 'callerCSID',
				fieldLabel: 'CSID',
				itemId: 'callerCSID',
				maxLength: 50,
				maxLengthText: '最大长度为50'
			},{
				name: 'subject',
				fieldLabel: '主题',
				itemId: 'subjectID'
			},{
				name: 'comment',
				fieldLabel: '注释',
				itemId: 'commentID',
				maxLength: 255,
				maxLengthText: '最大长度为255'
			},{
				name: 'callerOrganization',
				fieldLabel: '发送者组织',
				itemId: 'callerOrganizationID'
			},{
				name: 'callerName',
				fieldLabel: '发送者名称',
				itemId: 'callerNameID'
			},{
				xtype: 'combobox',
				fieldLabel: '标签',
				store: 'faxFlagID',
				queryMode : 'local',
				displayField : 'faxFlagName',
				valueField : 'faxFlagId',
				name : 'faxFlag',
				itemId: 'faxFlagNameID',
				editable: false
			}]
		},{
			xtype: 'checkbox',
			boxLabel: '时间范围',
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
//			collapsible: true,
			padding: '7 0 5 5',
			disabled:true,
			defaultType: 'datefield',
			layout: 'hbox',
			itemId: 'timeID',
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
		}]
	}],

	buttons: [{
		text: '重置',
		handler: function() {
			var me = this;
			var w = me.up('window');
			w.down('#formID').getForm().reset();

			w.down('#callerID').focus(true);
			w.down('#startDateID').setValue(LocalToUTC(30));
			w.down('#endDateID').setValue(Ext.Date.format(new Date(), 'Y-m-d'));
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
			if(w.down('#idinputID').getValue()) {
				var inFaxID = w.down('#idinputID').getValue();
				filter = tplPrefix +'id=' + inFaxID;
			} else {
				var isLike = w.down('#islikeID').getValue();
				var callerID = w.down('#callerID').getValue();
				if(callerID && callerID.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"callerID) like '%" + callerID.toUpperCase() + "%'"
		        		: tplPrefix + "callerID='" + callerID + "'");
				}
				var callerCSID = w.down('#callerCSID').getValue();
				if(callerCSID && callerCSID.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"callerCSID) like '%" + callerCSID.toUpperCase() + "%'"
		        		: tplPrefix + "callerCSID='" + callerCSID + "'");
				}
				//callerCSID
				var subject = w.down('#subjectID').getValue();
				if(subject && subject.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"subject) like '%" + subject.toUpperCase() + "%'"
		        		: tplPrefix + "subject='" + subject + "'");
				}
				var comment = w.down('#commentID').getValue();
				if(comment && comment.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"comment) like '%" + comment.toUpperCase() + "%'"
		        		: tplPrefix + "comment='" + comment + "'");
				}
				var callerOrganization = w.down('#callerOrganizationID').getValue();
				if(callerOrganization && callerOrganization.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"callerOrganization) like '%" + callerOrganization.toUpperCase() + "%'"
		        		: tplPrefix + "callerOrganization='" + callerOrganization + "'");
				}
				var callerName = w.down('#callerNameID').getValue();
				if(callerName && callerName.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"callerName) like '%" + callerName.toUpperCase() + "%'"
		        		: tplPrefix + "callerName='" + callerName + "'");
				}
				var faxFlag = w.down('#faxFlagNameID').getValue();
				if(faxFlag != null) {
					filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"faxFlag=" + faxFlag;
				}

				if(w.down('#timeCbx').getValue()) {
					var startDate = w.down('#startDateID').getValue();
					if(startDate != null) {
						filter += (filter.length > 0 ? ' and ': '') +tplPrefix +"ReceiveDateTime>='" + LocalDateToLongUTCstr(startDate) + "' ";
					}
					var endDate = w.down('#endDateID').getValue();
					if(endDate != null) {
						var locDate = new Date();
						locDate.setTime(endDate.getTime() + (24*3600*1000 -1000));
						filter += 'and '+tplPrefix +"ReceiveDateTime<='" + LocalDateToLongUTCstr(locDate) + "'";
					}
				}

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
				var str = linkViewTitle(FolderTree1.getSelectionModel().getSelection());
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