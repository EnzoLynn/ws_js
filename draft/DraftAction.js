Ext.define('WS.draft.Draft', {
	extend: 'WS.action.Base',
	category: 'Draft'
});

Ext.create('WS.draft.Draft', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshICON',
	itemId: 'refreshdraftID',
	handler: function() {
		var panel = this.getTargetView();
		panel.loadGrid();
	},
	updateStatus: function(selection) {
	}
});


Ext.create('WS.draft.Draft', {
	text: '全选/取消',
	itemId: 'allselectDraftID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		for (var i=0; i<currentPanel.getStore().getCount(); i++) {
			if(!sm.isSelected(i)) {
				sm.selectAll(true);
				return;
			} else {
				sm.deselect(i, true);
			}
		}

	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.draft.Draft', {
	text: '反选',
	itemId: 'otherselectDraftID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		for (var i=0; i<currentPanel.getStore().getCount(); i++) {
			if(sm.isSelected(i)) {
				sm.deselect(i, true);
			} else {
				sm.select(i, true);
			}
		}

	},
	updateStatus: function(selection) {

	}
});
//Ext.create('WS.draft.Draft', {
//	text: '修改传真信息',
//	iconCls: 'config',
//	itemId: 'modfaxInfoID',
//	handler: function() {
//		var panel = this.getTargetView();
//		var win = Ext.create('WS.draft.ModeFaxInfo');
//		win.show();
//	},
//	updateStatus: function(selection) {
////		this.setDisabled(!(selection.length == 1));
//	}
//});
//Ext.create('WS.draft.Draft', {
//	text: '收件人信息',
//	iconCls: 'modifycomment',
//	itemId: 'receInfoID',
//	handler: function() {
//		var panel = this.getTargetView();
//		var win = Ext.create('WS.draft.ReceiveInfo');
//		win.show();
//	},
//	updateStatus: function(selection) {
////		this.setDisabled(!(selection.length == 1));
//	}
//});

Ext.create('WS.draft.Draft', {
	text: '编辑发送',
	tooltip: '编辑发送',
	iconCls: 'sendFaxAddrICON',
	itemId: 'sendfaxdraftID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		if (sm.hasSelection()) {
			if(sm.getSelection()[0].data.faxNumber != ''){
				sendFaxForward(sm,4);
				return;
			}
			if(sm.getSelection()[0].data.users != '' || sm.getSelection()[0].data.dirs != ''){
				newMesB.show({
						title:'Fax Sender',
						msg: '该草稿为内部转发模式，是否直接发送？',
						buttons: Ext.MessageBox.YESNO,
						closable:false,						
						fn: function(btn) {
							if (btn =="yes") {
								 moniSendForWard(sm);
							} 
						},
						icon: Ext.MessageBox.QUESTION
					});
				return;
			}
			sendFaxForward(sm,4);
		}
	},
	updateStatus: function(selection) {
		this.setDisabled(!(selection.length == 1));
	}
});

Ext.create('WS.draft.Draft', {
	text: '直接发送',
	tooltip: '直接发送',
	iconCls: 'sendFaxAddrICON',
	itemId: 'sendfaxdraftAll',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		if (sm.hasSelection()) {
			draftMaps =  new Ext.util.MixedCollection();
			var emptyCount = 0;
			Ext.Array.each(sm.getSelection(),function(record,index,allrec){
				 if(!draftMaps.containsKey(record.data.faxFileID)){
				 	var recData = record.data;
				 	if(recData.faxNumber != '' || recData.users != '' || recData.dirs != ''){
				 		draftMaps.add(record.data.faxFileID,new Ext.util.MixedCollection());
				 	}else{
				 		emptyCount++;
				 	}		 	
				 }
			});
			
			Ext.Array.each(sm.getSelection(),function(record,index,allrec){
				if(draftMaps.getByKey(record.data.faxFileID)){
					draftMaps.getByKey(record.data.faxFileID).add(record);
				}				
			});
			if(draftMaps.getCount()> 0){
				moniSendAll(emptyCount);
			}else{
				Ext.Msg.alert('提示', '本次发送有'+emptyCount+'条无收件人信息的草稿未能发送，请单独选中补齐信息后发送传真！');
			}
			
		}
	},
	updateStatus: function(selection) {
		this.setDisabled(!(selection.length > 0));
	}
});

 

Ext.create('WS.draft.Draft', {
	text: '删除',
	tooltip: '删除选中草稿',
	iconCls: 'delinfax',
	itemId: 'delDraftID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		newMesB.show({
			title:'删除',
			msg: '您确认要删除所选择的记录吗？',
			buttons: Ext.MessageBox.YESNO,
			closable:false,			
			fn: function(btn) {
				if (btn == 'yes') {
					var records = sm.getSelection();
					currentPanel.getStore().remove(records);
					currentPanel.getStore().sync();
					sm.deselectAll(true);
					for(var i=0; i<records.length; i++) {
						records[i].commit(true);			//将之前选中的数据设置脏数据为false
					}
//					currentPanel.loadGrid();
				}
			},
			icon: Ext.MessageBox.QUESTION
		});
	},
	updateStatus: function(selection){
    	this.setDisabled(selection.length == 0);
    }
});