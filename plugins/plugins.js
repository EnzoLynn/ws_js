var InfaxPlugins1 =Ext.create('WS.infax.Infax', {
	text: '业务传真信息',
	itemId: 'fillfaxinfo',
	addType:'tm',//t: toolbar m:menu tm:both
	iconCls: 'plugin',
	tooltip: '补全业务传真信息',
	handler: function() {

		var sm = currGrid.getSelectionModel();
		var records = sm.getSelection();
		//Ext.Msg.alert(response.data);
		Ext.create('Ext.window.Window', {
			title: '补全业务传真信息',
			iconCls:'config',
			height: 180,
			width: 284,
			modal: true,
			resizable: false,
			layout: 'anchor',
			collapsible: false,
			border: false,
			//bodyCls: 'panelFormBg',
			padding:'4 0 0 0',
			items: [{
				margin:'4 4 4 4',
				xtype:'textareafield',
				value:records[0].data.comment,				
				height: 120,
				width: 270,
				itemId: 'modID',
				maxLength: 100,
				maxLengthText: '最大长度为100'
			}],
			buttons:[{
				text: '确定',
				itemId: 'submit',
				handler: function() {
					var me = this;
					var win = me.up('window');
					var param = {};
					param.sessiontoken = sessionToken;
					param.faxid = records[0].data.inFaxID;
					param.comment = win.down('#modID').getValue();
					//param.plugin = 'InfaxPlugins1';
					// 调用
					WsCall.call('fillfaxinfo', param, function(response, opts) {
						currGrid.loadGrid();
							win.close();
					}, function(response, opts) {
						if(!errorProcess(response.code)) {
							Ext.Msg.alert('失败', response.msg);
						}
					}, false);
				}
			},{
				text:'取消',
				itemId:'cancel',
				handler: function() {
					var me = this;
					me.up('window').close();
				}
			}]
		}).show();

	},
	updateStatus: function(selection) {
		var ispub = this.getTargetView().getStore().getProxy().extraParams.folderid.toString();
		var tSet = infax_tbtnSetMenu.down('#t'+this.itemId);
		if (ispub.indexOf('trwr') == -1 && ispub.indexOf('gr') == -1 && ispub != WaveFaxConst.RootFolderID && 
			ispub != WaveFaxConst.RecycleFolderID && ispub != WaveFaxConst.PublicRecycleFolderID) {
			//判断当前工具栏设置			 
			if(myStates.faxtoolBtn[this.itemId] || typeof myStates.faxtoolBtn[this.itemId] == "undefined"){
				this.show();
			}
			
			if(tSet){
				tSet.setDisabled(false);	
			}	
		} else {
			if(tSet){
				tSet.setDisabled(true);	
			}			
			this.hide();
		}		
		this.setDisabled(selection.length != 1);
	}
});

// var InfaxPlugins2 =Ext.create('WS.infax.Infax', {
	// text: '插件2',
	// itemId: 'InfaxPlugins2',
	// addType:'t',
	// iconCls: 'plugin',
	// tooltip: '插件2',
	// handler: function() {
		// var param = {};
		// param.sessiontoken = sessionToken;
		// param.plugin = 'InfaxPlugins2';
		// // 调用
		// WsCall.call('plugincall', param, function(response, opts) {
			// Ext.Msg.alert(response.data);
		// }, function(response, opts) {
			// if(!errorProcess(response.code)) {
				// Ext.Msg.alert('失败', response.msg);
			// }
		// }, false);
	// },
	// updateStatus: function(selection) {
// 
	// }
// });

// var outfaxPlugin1 =Ext.create('WS.outfax.OutfaxAction', {
	// text: '插件1',
	// itemId: 'outfaxPlugin1',
	// addType:'m',
	// iconCls: 'plugin',
	// tooltip: '插件1',
	// handler: function() {
		// var param = {};
		// param.sessiontoken = sessionToken;
		// param.plugin = 'InfaxPlugins2';
		// // 调用
		// WsCall.call('plugincall', param, function(response, opts) {
			// Ext.Msg.alert(response.data);
		// }, function(response, opts) {
			// if(!errorProcess(response.code)) {
				// Ext.Msg.alert('失败', response.msg);
			// }
		// }, false);
	// },
	// updateStatus: function(selection) {
// 
	// }
// });

gridPlugin.infaxPlugin.add('InfaxPlugins1',InfaxPlugins1);
//gridPlugin.infaxPlugin.add('InfaxPlugins2',InfaxPlugins2);
//gridPlugin.outfaxPlugin.add('outfaxPlugin1',outfaxPlugin1);
//gridPlugin.succoutfaxPlugin.add('InfaxPlugins2',InfaxPlugins2);
//gridPlugin.draftPlugin.add('InfaxPlugins2',InfaxPlugins2);
//gridPlugin.addressPlugin.add('InfaxPlugins2',InfaxPlugins2);