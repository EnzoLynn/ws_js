
//doc创建文档底部状态条
Ext.define('ws.workflow.wfstatusbar', {
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: 'wfstatusbar',
	alias: 'widget.wfstatusbar',
	itemId: 'wfstatusbar',
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
		xtype:'tbtext',
		itemId:'submitMessage',
		hideLabel:true,
		hidden:true,
		height:20,
		//width:220,
		text:''
	}]
});