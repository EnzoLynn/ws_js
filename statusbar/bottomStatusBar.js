//打印机来源Action 类型
Ext.define('WS.statusbar.printerSrc', {
	extend: 'WS.action.Base',
	category: 'printerSrc'
});

Ext.create('WS.statusbar.printerSrc', {
	text: printerSrcArr[0],
	checked:true,
	group: 'sendFaxPSrc',
	itemId: 'serverPSrc',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(sendfaxwin && sendfaxwin!='') {
			sendfaxwin.down('#menuID').setText(printerSrcArr[0]);
			userConfig.printerSrc='0';
			me.setChecked(true);
			 
			if(isSurportFlash){
				sendfaxwin.down('#replacePal').setVisible(true);
				sendfaxwin.down('#filePath').setVisible(false);
			}else{
				sendfaxwin.down('#filePath').setVisible(true);
				sendfaxwin.down('#replacePal').setVisible(false);
			}
			
			sendfaxwin.down('#fileLocalPath').setVisible(false);
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerSrc.pttype = me.itemId;
				var tmpS = myStates.printerSrc;
				wsUserStates.setServerState('printerSrc',tmpS);
			}

		}
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.statusbar.printerSrc', {
	text: printerSrcArr[1],
	group: 'sendFaxPSrc',
	itemId: 'localPSrc',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(sendfaxwin && sendfaxwin!='') {
			sendfaxwin.down('#menuID').setText(printerSrcArr[1]);
			userConfig.printerSrc='1';
			me.setChecked(true);
			sendfaxwin.down('#fileLocalPath').setVisible(true);
			//sendfaxwin.down('#filePath').setVisible(false);
			
			sendfaxwin.down('#filePath').setVisible(false);	
			sendfaxwin.down('#replacePal').setVisible(false);			
			
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerSrc.pttype = me.itemId;
				var tmpS = myStates.printerSrc;
				wsUserStates.setServerState('printerSrc',tmpS);
			}
		}

	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.printerSrc', {
	text: printerType[0],
	checked:true,
	group: 'sendFaxPType',
	itemId: 'docPtype',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(sendfaxwin && sendfaxwin!='') {
			sendfaxwin.down('#ptypeID').setText('转换方式:'+printerType[0]);
			userConfig.prType='0';
			me.setChecked(true);
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerType.pttype = me.itemId;
				var tmpS = myStates.printerType;
				wsUserStates.setServerState('printerType',tmpS);
			}

		}
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.printerSrc', {
	text: printerType[1],
	group: 'sendFaxPType',
	itemId: 'photoPtype',
	handler: function(btn,eve,suppressLoad) {
		var me = this;
		if(sendfaxwin && sendfaxwin!='') {
			sendfaxwin.down('#ptypeID').setText('转换方式:'+printerType[1]);
			userConfig.prType='1';
			me.setChecked(true);
			if(myStates) {
				//保存变量并上传
				var me = this;
				myStates.printerType.pttype = me.itemId;
				var tmpS = myStates.printerType;
				wsUserStates.setServerState('printerType',tmpS);
			}

		}
	},
	updateStatus: function(selection) {

	}
});

//系统底部进度条
Ext.define('ws.statusbar.bottomProgressBar', {
	alias: 'widget.bottomProgressBar',
	extend: 'Ext.ProgressBar',
	alternateClassName: ['bottomProgressBar'],
	itemId: 'bottomProgressBar',
	width: 300,
	listeners: {
		afterrender: function (probar, opts) {

			probar.hide();

		}
	}
});

//系统底部状态条
Ext.define('ws.statusbar.bottomStatusBar', {
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: 'bottomStatusBar',
	alias: 'widget.bottomStatusBar',
	itemId: 'bottomStatusBar',
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
	},'-',{
		itemId: 'menuID',
		text: '服务端文档转换',
		menu: {
			defaults: {
				xtype: 'menucheckitem'
			},
			items:[ActionBase.getAction('serverPSrc'),ActionBase.getAction('localPSrc')]
		}
	},'-',{
		itemId: 'ptypeID',
		text: '转换方式:传真速度优先',
		menu: {
			defaults: {
				xtype: 'menucheckitem'
			},
			items:[ActionBase.getAction('docPtype'),ActionBase.getAction('photoPtype')]
		}
	},{
		xtype:'tbtext',
		itemId:'submitMessage',
		hideLabel:true,
		hidden:true,
		height:20,
		//width:220,
		text:''
	},'->',{
		xtype : 'tbtext',
		itemId : 'headerWelcome',
		margin:'0 0 0 15',
		cls : 'fontColor',		
		style : {			
			'padding' : '0 0 0 10'
		},		
		text : '当前用户:' + userInfo + '&nbsp;'
	},'-',{
		xtype: 'button',
		text: '个人权限信息',
		itemId: 'personRole',
		iconCls: 'personRole',
		handler: function () {
			if (bsbwPersonRolewin == '') {
				bsbwPersonRolewin = loadBsbwPersonRolewin();
			} else {
				bsbwPersonRolewin.show();
			}
			bsbwPersonRolewin.down('form').getForm().loadRecord(roleInfoModel);
		}
	},'-',{
		xtype:'button',
		text:'历史消息',
		iconCls:'historyMes',
		itemId: 'historyMes',
		handler: function() {
			if(msghistorywin == '') {
				msghistorywin = loadmsghistorywin();
			}
		}
	},'-',{
		xtype: 'button',
		text: '服务器信息',
		//disabled:serverInfoDis,
		itemId: 'serverInfo',
		iconCls: 'serverInfo',
		handler: function () {
			if (bsbwServerInfowin == '') {
				bsbwServerInfowin = loadBsbwServerInfowin();
			} else {
				bsbwServerInfowin.show();
			}
			bsbwServerInfowin.down('form').getForm().loadRecord(serverInfoModel);
		}
	}]
});

