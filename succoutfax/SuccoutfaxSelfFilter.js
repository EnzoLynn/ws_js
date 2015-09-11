Ext.define('WS.succoutfax.SuccoutfaxSelfFilter', {
	extend: 'Ext.window.Window',
	title: '自定义查询条件',
	iconCls: 'infaxSelfFilter',
	height: 420,
	width: 360,
	layout: 'hbox',
	bodyCls: 'panelFormBg',
	border: false,
	resizable: false,
	modal: true,   //设置window为模态
	listeners: {
		afterrender: function(com,opts) {
			//读取状态保存
			//加载State
			if(myStates.searchState) {
				for (key in myStates.searchState) {
					if(key == 'stateSaved')
						continue;						
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
		height: 420,
		width: 346,
		bodyPadding: 10,
		url: WsConf.Url,
		itemId: 'formID',
		bodyCls: 'panelFormBg',
		border: false,
		items: [{
			padding: '5 10 5 10',
			xtype:'fieldset',
//			collapsible: true,
			defaultType: 'checkbox',
			layout: 'hbox',
			items:[{
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
//			collapsible: true,
			padding: '7 0 5 10',
			defaultType: 'textfield',
			layout: 'hbox',
			items: [{
				xtype: 'checkbox',
				boxLabel: '流水号',
				listeners: {
					change: function(field, val) {
						var me = this;
						var f = me.up('form');
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
//			collapsible: true,
			padding: '7 0 5 0',
			defaultType: 'textfield',
			itemId: 'infoID',
			defaults: {
				labelAlign: 'right',
				labelPad: 15,
				labelWidth: 130,
				maxLength: 100,
				maxLengthText: '最大长度为100'
			},
			items: [{
				name: 'recipient',
				fieldLabel: '收件人',
				itemId: 'recipID'
			},{
				name: 'subject',
				fieldLabel: '主题',
				itemId: 'subjectID'
			},{
				name: 'comment',
				fieldLabel: '注释',
				itemId: 'commentID'
			},{
				name: 'recOrg',
				fieldLabel: '收件人组织',
				itemId: 'recOrgID'
			},{
				name: 'faxNum',
				fieldLabel: '传真号码',
				itemId: 'faxNumID'
			},{
				xtype: 'combobox',
				fieldLabel: '标签',
				store: 'faxFlagID',
				queryMode : 'local',
				displayField : 'faxFlagName',
				valueField : 'faxFlagId',
				name : 'faxFlag',
				itemId: 'flagNameID',
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
					if (cb.getValue()) {
						f.down('#timeID').setDisabled(false);
					} else {
						f.down('#timeID').setDisabled(true);
					}
				}
			}
		},{
			xtype:'fieldset',
			disabled:true,
//			collapsible: true,
			padding: '9 0 5 5',
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
			w.down('#recipID').focus(true);
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
			if(w.down('#idinputID').getValue()) {
				var inFaxID = w.down('#idinputID').getValue();
				filter = tplPrefix +'id=' + inFaxID;
			} else {
				var isLike = w.down('#islikeID').getValue();
				var recipient = w.down('#recipID').getValue();
				if(recipient && recipient.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"recipient) like '%" + recipient.toUpperCase() + "%'"
		        		: tplPrefix + "recipient='" + recipient + "'");
				}
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
				var recOrgID = w.down('#recOrgID').getValue();
				if(recOrgID && recOrgID.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		"upper("+tplPrefix +"recipientOrganization) like '%" + recOrgID + "%'"
						: tplPrefix + "recipientOrganization='" + recOrgID + "'");
				}
				var faxNumID = w.down('#faxNumID').getValue();
				if(faxNumID && faxNumID.length != 0) {
					filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        		tplPrefix +"faxNumber like '%" + faxNumID + "%'"
						: tplPrefix + "faxNumber='" + faxNumID + "'");
				}
				var faxFlag = w.down('#flagNameID').getValue();
				if(faxFlag != null) {
					filter += (filter.length > 0 ? ' and ': '') + tplPrefix +"faxFlag=" + faxFlag;
				}

				if(w.down('#timeCbx').getValue()) {
					var startDate = w.down('#startDateID').getValue();
					if(startDate != null) {
						filter += (filter.length > 0 ? ' and ': '') + tplPrefix +"sentDateTime>='" + LocalDateToLongUTCstr(startDate) + "'";
					}
					var endDate = w.down('#endDateID').getValue();
					if(endDate != null) {
						var locDate = new Date();
						locDate.setTime(endDate.getTime() + (24*3600*1000 -1000));
						filter += " and "+tplPrefix +"sentDateTime<='" + LocalDateToLongUTCstr(locDate) + "'";
					}
				}
			}
			if(filter.length == 0) {
				return;
			}
			var store = w.grid.getStore();
			store.filterMap.replace('filter', filter);
			//保存状态
			//保存变量并上传
			var tmpS = myStates.searchState;
			wsUserStates.setServerState('searchState',tmpS);
			store.getProxy().extraParams.tplsearch = '';
			w.grid.loadGrid(true);
			var str = linkViewTitle(FolderTree1.getSelectionModel().getSelection());
			gridTitle.setTitle('查找结果 {' + str + '}');
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