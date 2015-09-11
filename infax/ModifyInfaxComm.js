Ext.define('WS.infax.DownloadFaxFile', {
	extend: 'Ext.window.Window',
	title: '下载传真',
	iconCls: 'infaxdownloadICON',
	height: 200,
	width: 300,
	border: false,
	bodyCls: 'panelFormBg',
	layout: 'vbox',
	modal: true,   //设置window为模态
	items:[{
		xtype: 'form',
		bodyPadding: 10,
		url: WsConf.Url,
		border: false,
		bodyCls: 'panelFormBg',
		resizable: false,
		itemId: 'downLoadId',
		defaultType : 'radio',
		items : [{
			margin: '10 0 0 0',
			xtype : 'label',
			text : '请选择导出文件的类型:'
		},{
			margin: '5 0 0 70',
			boxLabel : 'TIFF',
			name : 'down',
			inputValue : 'tif',
			itemId: 'tifId',
			checked : true
		},{
			margin: '5 0 0 70',
			boxLabel : 'PDF',
			name : 'down',
			itemId: 'pdfId',
			inputValue : 'pdf'
		},{
			margin: '15 0 0 0',
			xtype : 'textfield',
			fieldLabel: '文件名',
			labelWidth: 65,
			labelAlign: 'right',
			width: 260,
			itemId: 'fileNameID',
			name : 'fileName'
		}]
	}],
	buttons: [{
		text: '确定',
		itemId: 'submit',
		formBind: true,
		handler: function() {
			var me = this;
			var w = me.up('window');
			var type;
			if(w.down('#tifId').getValue()) {
				type = 'tif';
			}
			if(w.down('#pdfId').getValue()) {
				type = 'pdf';
			}
			var param = {
				faxfileid: w.faxfileid,
				downType: type,
				fileName: w.down('#fileNameID').getValue(),
				sessiontoken: getSessionToken()
			}
			WsCall.downloadFile('download', param);
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

Ext.define('WS.infax.ModifyInfaxComm', {
	extend: 'Ext.window.Window',
	title: '修改注释',
	iconCls: 'modifycomment',
	height: 200,
	width: 300,
	closeAction:'hide',
	border: false,
	bodyCls: 'panelFormBg',
	layout: 'vbox',
	modal: true,   //设置window为模态
	items:[{
		xtype: 'form',
		bodyPadding: 10,
		url: WsConf.Url,
		border: false,
		bodyCls: 'panelFormBg',
		resizable: false,
		itemId: 'modifycommID',
		items: [{
			xtype: 'textareafield',
			name: 'modifycomm',
			height: 120,
			width: 270,
			itemId: 'modID',
			validator: function(val) {
				return myTextValidator(val,100);
			}
			//maxLength: 100,
			//maxLengthText: '最大长度为100',
			// blur: function(me, op) {
// 
			// }
		}]
	}],
	buttons: [{
		text: '确定',
		itemId: 'submit',
		formBind: true,
		handler: function() {

			var me = this;
			var w = me.up('window');

			// if(getInputBytes(w.down('#modID').getValue()) > 100) {
			// Ext.Msg.alert('错误', '输入字节数超过100');
			// return;
			// }

			var form = w.down('#modifycommID').getForm();
			if (form.isValid()) {
				var sm = w.grid.getSelectionModel();
				var records = sm.getSelection();

				for(var i=0; i<records.length; i++) {
					records[i].set('comment', w.down('#modID').getValue());    //标记为已读
				}
				var typeGrid = w.grid.getXType();
				if (typeGrid == 'Infaxgrid' && detailFormForInfaxgrid != "") {
					detailFormForInfaxgrid.updateAll(records[0]);
				} else if (typeGrid == 'outfaxgrid' && detailFormForOutfaxgrid != "") {
					detailFormForOutfaxgrid.updateAll(records[0]);
				} else if (typeGrid == 'succoutfaxgrid' && detailFormForSuccoutfaxgrid != "") {
					detailFormForSuccoutfaxgrid.updateAll(records[0]);
				} else if(typeGrid == 'docgrid' && detailFormForDocgrid != '') {
					detailFormForDocgrid.updateAll(records[0]);
				}
				w.grid.getStore().sync();
				for(var i=0; i<records.length; i++) {
					records[i].commit(true);			//将之前选中的数据设置脏数据为false
				}
				w.hide();
			}
		}
	},{
		text: '取消',
		handler: function() {
			var me = this;
			me.up('window').hide();

		}
	}]
});