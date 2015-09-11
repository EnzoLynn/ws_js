//打印机来源Action 类型
Ext.define('WS.docmanager.docprinterSrc', {
	extend: 'WS.action.Base',
	category: 'docprinterSrc'
});

Ext.create('WS.docmanager.docprinterSrc', {
	text: printerSrcArr[0],
	checked:true,
	group: 'docPSrc',
	itemId: 'docserverPSrc',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(docaddwin && docaddwin!='') {
			docaddwin.down('#menuID').setText(printerSrcArr[0]);
			userConfig.printerSrc='0';
			me.setChecked(true);
			if(isSurportFlash){
				docaddwin.down('#replacePal').setVisible(true);
				docaddwin.down('#filePath').setVisible(false);
			}else{
				docaddwin.down('#replacePal').setVisible(false);
				docaddwin.down('#filePath').setVisible(true);
			}
			//docaddwin.down('#filePath').setVisible(true);
			docaddwin.down('#fileLocalPath').setVisible(false);
			
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerSrc.pttype = 'serverPSrc';
				var tmpS = myStates.printerSrc;
				wsUserStates.setServerState('printerSrc',tmpS);
			}

		}
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.docmanager.docprinterSrc', {
	text: printerSrcArr[1],
	group: 'docPSrc',
	itemId: 'doclocalPSrc',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(docaddwin && docaddwin!='') {
			docaddwin.down('#menuID').setText(printerSrcArr[1]);
			userConfig.printerSrc='1';
			me.setChecked(true);
			docaddwin.down('#fileLocalPath').setVisible(true);
			//docaddwin.down('#filePath').setVisible(false);
			
			docaddwin.down('#filePath').setVisible(false);
			docaddwin.down('#replacePal').setVisible(false);
			hideFlash(docaddwin);
			
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerSrc.pttype = 'localPSrc';
				var tmpS = myStates.printerSrc;
				wsUserStates.setServerState('printerSrc',tmpS);
			}
		}

	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docprinterSrc', {
	text: printerType[0],
	checked:true,
	group: 'docPType',
	itemId: 'doc_docPtype',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(docaddwin && docaddwin!='') {
			docaddwin.down('#ptypeID').setText('转换方式:'+printerType[0]);
			userConfig.prType='0';
			me.setChecked(true);
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerType.pttype = 'docPtype';
				var tmpS = myStates.printerType;
				wsUserStates.setServerState('printerType',tmpS);
			}

		}
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.docmanager.docprinterSrc', {
	text: printerType[1],
	group: 'docPType',
	itemId: 'doc_photoPtype',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(docaddwin && docaddwin!='') {
			docaddwin.down('#ptypeID').setText('转换方式:'+printerType[1]);
			userConfig.prType='1';
			me.setChecked(true);
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerType.pttype = 'photoPtype';
				var tmpS = myStates.printerType;
				wsUserStates.setServerState('printerType',tmpS);
			}

		}
	},
	updateStatus: function(selection) {

	}
});

//doc创建文档底部状态条
Ext.define('ws.docmanager.docstatusbar', {
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: 'docstatusbar',
	alias: 'widget.docstatusbar',
	itemId: 'docstatusbar',
	items: [{
		xtype: 'bottomProgressBar',
		width:200
	},{
		xtype: 'button',
		margin:'0 5 0 15',
		width:80,
		itemId: 'btnContinue',
		hidden: true,
		text: '继续'
	},{
		xtype: 'button',
		margin:'0 5 0 5',
		itemId: 'btnCancel',
		width:80,
		hidden: true,
		text: '取消'
	}, '-',{
		xtype:'tbtext',				
		itemId:'lblMessage',
		hideLabel:true,
		height:20,
		//width:270,
		text:''
	},{
		itemId: 'menuID',
		text: '服务端文档转换',
		menu: {
			defaults: {
				xtype: 'menucheckitem'
			},
			items:[ActionBase.getAction('docserverPSrc'),ActionBase.getAction('doclocalPSrc')]
		}
	},{
		itemId: 'ptypeID',
		text: '转换方式:传真速度优先',
		menu: {
			defaults: {
				xtype: 'menucheckitem'
			},
			items:[ActionBase.getAction('doc_docPtype'),ActionBase.getAction('doc_photoPtype')]
		}
	},{
		xtype:'tbtext',
		itemId:'submitMessage',
		hideLabel:true,
		hidden:true,
		height:20,
		//width:220,
		text:''
	}]
});