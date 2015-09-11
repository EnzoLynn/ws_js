Ext.define('WS.statusbar.msgHistroyActionDateFilter', {
	extend: 'Ext.window.Window',
	iconCls: 'infaxSelfFilter',
	title: '自定义查询日期段',
    height: 120,
    width: 400,
    layout: 'fit',
    //bodyCls: 'panelFormBg',
    border: false,
	resizable: false,
    modal: true,   //设置window为模态
	//extend: 'Ext.form.Panel',
	items: {
		xtype: 'form',
		bodyPadding: 20,
	    url: WsConf.Url,
	    layout: 'hbox',
	    //bodyCls: 'panelFormBg',
   		border: false,
	    defaultType: 'datefield',
	    items: [{
	        name: 'startDate',
	        allowBlank: false,
	        itemId: 'startDateID',
	        format:'Y-m-d',
	        value: ''
	        
	    }, {
	    	xtype: 'label',
	    	html: '&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;'
	    	
	    }, {
	        name: 'endDate',
	        allowBlank: false,
	        itemId: 'endDateID',
	        format:'Y-m-d',
	        value: ''
	        
	    }],
	
	    buttons: [{
	        text: '确定',
	        formBind: true, //only enabled once the form is valid
	        handler: function() {
	        	var me = this;
	            var form = me.up('form');
	            var w = form.up('window');
	            var panel = w.grid;
	            if (form.getForm().isValid()) {

		            var filter = '';
		            var startDate = form.getComponent('startDateID').getValue();
		            var endDate = form.getComponent('endDateID').getValue();
	        		if(startDate != null) {
	        			
	        			filter += "param1>='" + LocalDateToLongUTCstr(startDate) + "' ";
	        		}
	        		
	        		if(endDate != null) {
	        			filter += "and param1<='" + LocalDateToLongUTCstr(endDate) + "'";
	        		}
//	        		filter = LocalDateToLongUTCstr(startDate) + ',' + LocalDateToLongUTCstr(endDate);
		            panel.getStore().filterMap.replace('param1', filter);
					panel.loadGrid();
			        form.up('window').close();
	            }
	        }
	    }, {
	        text: '取消',
	        handler: function() {
	        	var me = this;
	            var form = me.up('form');
	            form.up('window').close();
	        }
	    }]
	}
});



Ext.define('WS.statusbar.msgHistroyAction', {
	extend: 'WS.action.Base',
	category: 'msgHistroyAction',
	//获取窗口
	getMsgHistoryWin: function () {
		return this.getTargetView().up('window');
	}
});


Ext.create('WS.statusbar.msgHistroyAction', {
	text: '全部时间',
	checked:true,
	group: 'msgHisAcTime',
	itemId: 'allFilterMsgAcID',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#timeFilter').setText('全部时间');
		grid.getStore().filterMap.removeAtKey('param1');
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.msgHistroyAction', {
	text: '今天',
	group: 'msgHisAcTime',
	itemId: 'todayFilterMsgAcID',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#timeFilter').setText('今天');
		var value = "param1>='" + LocalToUTCTime(0) + "' and param1<='" + LocalToUTCTime(0, true) + "'";
//		var value = LocalToUTC(0) + " 00:00:00," + LocalToUTC(0) + " 23:59:59";
		grid.getStore().filterMap.replace('param1', value);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.msgHistroyAction', {
	text: '两天',
	group: 'msgHisAcTime',
	itemId: 'twodayFilterMsgAcID',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#timeFilter').setText('两天');
		var value = "param1>='" + LocalToUTCTime(1) + "' and param1<='" + LocalToUTCTime(0, true) + "'";
//		var value = LocalToUTC(1) + " 00:00:00," + LocalToUTC(0) + " 23:59:59";
		grid.getStore().filterMap.replace('param1', value);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.statusbar.msgHistroyAction', {
	text: '一周',
	group: 'msgHisAcTime',
	itemId: 'weekFilterMsgAcID',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#timeFilter').setText('一周');
		var value = "param1>='" + LocalToUTCTime(6) + "' and param1<='" + LocalToUTCTime(0, true) + "'";
//		var value = LocalToUTC(6) + " 00:00:00," + LocalToUTC(0) + " 23:59:59";
		grid.getStore().filterMap.replace('param1', value);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});
Ext.create('WS.statusbar.msgHistroyAction', {
	text: '一月',
	group: 'msgHisAcTime',
	itemId: 'monthFilterMsgAcID',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#timeFilter').setText('一月');
		var value = "param1>='" + LocalToUTCTime(30) + "' and param1<='" + LocalToUTCTime(0, true) + "'";
//		var value = LocalToUTC(30) + " 00:00:00," + LocalToUTC(0) + " 23:59:59";
		grid.getStore().filterMap.replace('param1', value);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.msgHistroyAction', {
	text: '自定义时间段',
	group: 'msgHisAcTime',
	itemId: 'selfFilterMsgAcID',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#timeFilter').setText('自定义时间段');
		var win = Ext.create('WS.statusbar.msgHistroyActionDateFilter', {
			grid: grid
		});
		win.show('', function() {
			win.down('#startDateID').setValue(LocalToUTC(30));
			win.down('#endDateID').setValue(Ext.Date.format(new Date(), 'Y-m-d'));
		});
	},
	updateStatus: function(selection) {
	}
});



//======================================================================//
//============================类型过滤====================================//
//======================================================================//
Ext.create('WS.statusbar.msgHistroyAction', {
	text: '全部类型',
	checked:true,
	group: 'msgHisNotiType',
	itemId: 'allNTypeAc',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#nTypeFilter').setText('全部类型');
		grid.getStore().filterMap.removeAtKey('notifyType');
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.msgHistroyAction', {
	text: '传真接收消息',
	group: 'msgHisNotiType',
	itemId: 'receiveFaxAc',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#nTypeFilter').setText('传真接收消息');
		var filter = 'notifyType=0';
//		var filter = '0';
		grid.getStore().filterMap.replace('notifyType', filter);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.msgHistroyAction', {
	text: '传真发送消息',
	group: 'msgHisNotiType',
	itemId: 'sentFaxAc',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#nTypeFilter').setText('传真发送消息');
		var filter = '(notifyType=3 or notifyType=4)';
//		var filter = '3,4';
		grid.getStore().filterMap.replace('notifyType', filter);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});


Ext.create('WS.statusbar.msgHistroyAction', {
	text: '工作流消息',
	group: 'msgHisNotiType',
	itemId: 'wfMsgAc',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#nTypeFilter').setText('工作流消息');
		var filter = '(notifyType=7 or notifyType=8 or notifyType=9)';
//		var filter = '10';
		grid.getStore().filterMap.replace('notifyType', filter);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.msgHistroyAction', {
	text: '管理员消息',
	group: 'msgHisNotiType',
	itemId: 'adminMsgAc',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#nTypeFilter').setText('管理员消息');
		var filter = 'notifyType=10';
//		var filter = '10';
		grid.getStore().filterMap.replace('notifyType', filter);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.statusbar.msgHistroyAction', {
	text: '职责委任',
	group: 'msgHisNotiType',
	itemId: 'trwrHisAc',
	handler: function() {
		var me = this;
		var grid = me.getTargetView();
		me.getMsgHistoryWin().down('#nTypeFilter').setText('职责委任');
		var filter = 'notifyType=11';
//		var filter = '10';
		grid.getStore().filterMap.replace('notifyType', filter);
		grid.loadGrid();
	},
	updateStatus: function(selection) {

	}
});



