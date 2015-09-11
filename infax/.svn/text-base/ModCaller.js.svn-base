Ext.define('WS.infax.ModCaller', {
	extend: 'Ext.window.Window',
	title: '修改属性',
	iconCls: 'propertyICON',
	height: 150,
	width: 430,
	border: false,
	//bodyCls: 'panelFormBg',
	layout: 'vbox',
	modal: true,   //设置window为模态
	items:[{
		xtype: 'form',
		height: 100,
		width: 420,
		bodyPadding: 5,
		url: WsConf.Url,
		border: false,
		//bodyCls: 'panelFormBg',
		resizable: false,
		itemId: 'modCallID',
		defaults: {
			xtype: 'textfield',
			margin: '10 0 5 0',
			width: 390,
			labelAlign: 'right',
			labelWidth: 120,
			maxLength: 100,
			maxLengthText: '最大长度为100'
		},
		items: [{
			name: 'callerName',
			itemId: 'callNameID',
			fieldLabel: '发件人'
		},{
			name: 'callerOrganization',
			itemId: 'callOrgID',
			fieldLabel: '发件人组织'
		}]
	
	}],
	buttons: [{
		text: '确定',
		itemId: 'submit',
		formBind: true,
		handler: function() {
			var me = this;
			var w = me.up('window');
			var sm = w.grid.getSelectionModel();
			var records = sm.getSelection();
			var param1 = 'callerName';
			var param2 = 'callerOrganization';
			var typeGrid = w.grid.getXType();
			if(typeGrid == 'docgrid') {
				var param1 = 'customID';
				var param2 = 'keyWord';
			}
			for(var i=0; i<records.length; i++) {
				records[i].set(param1, w.down('#callNameID').getValue());
				records[i].set(param2, w.down('#callOrgID').getValue());
			}
			if (typeGrid == 'Infaxgrid' && detailFormForInfaxgrid != "") {
				detailFormForInfaxgrid.updateAll(records[0]);
			}
			// 如果是文档管理修改------
			if(typeGrid == 'docgrid' && detailFormForDocgrid != '') {
				detailFormForDocgrid.updateAll(records[0]);
			}
			
			w.grid.getStore().sync();
			w.close();

		}
	},{
		text: '取消',
		handler: function() {
			var me = this;
			me.up('window').close();

		}
	}]
});