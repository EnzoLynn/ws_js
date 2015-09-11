Ext.define('WS.infax.InfaxDateFilter', {
	extend: 'Ext.window.Window',
	iconCls: 'infaxSelfFilter',
	title: '自定义查询日期段',
    height: 120,
    width: 400,
    layout: 'fit',
    //bodyCls: 'panelFormBg',
    border: false,
    closeAction: 'hide',
	resizable: false,
    modal: true,   //设置window为模态
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
	    	padding: '0 15 0 15',
	    	text: '~'
	    }, {
	        name: 'endDate',
	        allowBlank: false,
	        itemId: 'endDateID',
	        format:'Y-m-d',
	        value: ''
	        
	    }],
	
	    buttons: [{
	        text: '确定',
	        formBind: true, 
	        handler: function() {
	        	var me = this;
	            var form = me.up('form');
	            var w = form.up('window');
	            var panel = w.grid;
	            var fieldType = '';
	            var typeGrid = w.grid.getXType();
	            if (typeGrid == 'Infaxgrid') {
					fieldType = 'ReceiveDateTime';
				}else if (typeGrid == 'succoutfaxgrid') {
					fieldType = 'sentDateTime';
				}else if(typeGrid == 'docgrid') {
					fieldType = 'createdatetime';
				}else if(typeGrid == 'taskgrid') {
					fieldType = 'StartTime';
				}
	            if (form.getForm().isValid()) {
		            var filter = '';
		            var startDate = w.down('#startDateID').getValue();
	        		if(startDate != null) {
	        			
	        			filter += tplPrefix +fieldType + ">='" + LocalDateToLongUTCstr(startDate) + "' ";
	        		}
	        		var endDate = w.down('#endDateID').getValue();
	        		if(endDate != null) {
	        			var locDate = new Date();
		        		locDate.setTime(endDate.getTime() + (24*3600*1000 -1000));
	        			filter += "and "+tplPrefix +fieldType + "<='" + LocalDateToLongUTCstr(locDate) + "'";
	        		}
//	        		w.filter = filter;
		            panel.getStore().filterMap.replace('time', filter);
					panel.loadGrid(false,true);
			        w.hide();
	            }
	        }
	    }, {
	        text: '取消',
	        handler: function() {
	        	var me = this;
	            var form = me.up('form');
	            form.up('window').hide();
	        }
	    }]
	}
});