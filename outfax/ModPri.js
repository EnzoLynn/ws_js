Ext.define('WS.outfax.ModPri', {
	extend: 'Ext.window.Window',
	title: '修改优先级',
	height: 120,
    width: 380,
    layout: 'vbox',
    iconCls: 'priorityICON',
    resizable: false,
    border: false,
	//bodyCls: 'panelFormBg',
    modal: true,   //设置window为模态
	items:[{
		xtype: 'form',
		bodyPadding: 20,
	    url: WsConf.Url,
	    border: false,
	    //bodyCls: 'panelFormBg',
	    itemId: 'modPriorityID',
	    items: [{
	    	xtype: 'combobox',
	    	name: 'modpri',
//	    	anchor : '96% 100%',
	    	width: 320,
	    	itemId: 'modID',
	    	store: 'priorityID',
    		queryMode : 'local',
			displayField : 'priorityName',
			valueField : 'priorityId',
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
	        	
				for(var i=0; i<records.length; i++) {
					var pri = w.down('#modID').getValue();
					var priority = 128;
					if(pri == 4) {
						priority = 0;
					}else if(pri == 3) {
						priority = 64;
					}else if(pri == 2) {
						priority = 128;
					}else if(pri == 1) {
						priority = 192;
					}else {
						priority = 255;
					}
					records[i].set('priority', priority);    //标记为已读
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