Ext.define('WS.infax.ModInFlag', {
	extend: 'Ext.window.Window',
	iconCls: 'infaxaddflag',
	title: '修改标签',
	height: 120,
	width: 380,
	layout: 'vbox',
	border: false,
	//bodyCls: 'panelFormBg',
	resizable: false,
	modal: true,   //设置window为模态
	items:[{
		xtype: 'form',
		bodyPadding: 20,
		url: WsConf.Url,
		border: false,
		//bodyCls: 'panelFormBg',
		itemId: 'modifyflagID',
		items: [{
			xtype: 'combobox',
			name: 'modflag',
			width: 320,
			itemId: 'modID',
			store: 'faxFlagID',
			queryMode : 'local',
			displayField : 'faxFlagName',
			valueField : 'faxFlagId',
			editable: false
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
			
			var typeGrid = w.grid.getXType();
			var param = typeGrid == 'docgrid' ? 'docFlag' : 'faxFlag';
			for(var i=0; i<records.length; i++) {
				records[i].set(param, w.down('#modID').getValue());    //标记为已读
			}
			
			if (typeGrid == 'Infaxgrid' && detailFormForInfaxgrid != "") {
				detailFormForInfaxgrid.updateAll(records[0]);
			}
			if (typeGrid == 'outfaxgrid' && detailFormForOutfaxgrid != "") {
				detailFormForOutfaxgrid.updateAll(records[0]);
			}
			if (typeGrid == 'succoutfaxgrid' && detailFormForSuccoutfaxgrid != "") {
				detailFormForSuccoutfaxgrid.updateAll(records[0]);
			}
			if(typeGrid == 'docgrid' && detailFormForDocgrid != '') {
				detailFormForDocgrid.updateAll(records[0]);
			}

			w.grid.getStore().sync();
			for(var i=0; i<records.length; i++) {
				records[i].commit(true);			//将之前选中的数据设置脏数据为false
			}
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