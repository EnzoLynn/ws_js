Ext.define('WS.address.AddressAction', {
	extend: 'WS.action.Base',
	category: 'address'
});

Ext.create('WS.address.AddressAction', {
	text: '全选/取消',
	itemId: 'allselectAddrID',
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

Ext.create('WS.address.AddressAction', {
	text: '反选',
	itemId: 'otherselectAddrID',
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

//导入
Ext.create('WS.address.AddressAction', {
	text: '导入',
	tooltip: '导入通讯录',
	itemId: 'importAddrId',
	iconCls: 'importAddrICON',
	handler: function() {
		var panel = this.getTargetView();
		var win = Ext.create('WS.address.ImportAddrWin', {
			grid: panel,
			selTreeNode: addressTree1.getSelectionModel().getSelection()[0].data.id
		});
		win.show('', function() {
			win.down('#fileupId').focus(true)
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(data && data.folderPrivAdd == 0);
	}
});

Ext.create('WS.address.AddressAction', {
	text: '导出',
	tooltip: '导出通讯录',
	itemId: 'expReportAddrId',
	iconCls: 'exportICON',
	handler: function() {
		var panel = this.getTargetView();
		var sm = panel.getSelectionModel();
		var ids = new Array();
		if(sm.hasSelection()) {
			var records = sm.getSelection();
			ids = buildFaxIDs(records, 'phoneBookID');
		}
		var win = Ext.create('WS.infax.ExportReport', {
			grid: panel,
			gridType: 'PHONEBOOK',
			selRecIds: ids
		});
		win.down('#expFaxFileId').hide();
		win.show('', function () {
			var items = win.grid.headerCt.items.items;
			var columns = win.down('#selColumnId');
			for(var i=0; i<items.length; i++) {
				//				columns.add({boxLabel: items[i].text, name: items[i].dataIndex}); //与insert相同
				columns.insert(i, {
					boxLabel: items[i].text,
					name: items[i].dataIndex
				});
			}

			var count = sm.hasSelection() ? sm.getSelection().length : 0;
			win.down('#allRecordsID').setText('共有'+ ' ' + panel.getStore().getProxy().getReader().jsonData.total+ ' ' + '条记录');
			win.down('#selRecId').setDisabled(count == 0);
			win.down('#selRecordsID').setText('选中的记录有'+ ' ' + count+ ' ' + '条');
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(data && data.folderPrivExport == 0);
	}
});

Ext.create('WS.address.AddressAction', {
	text: '发送传真',
	tooltip: '发送传真',
	iconCls: 'sendFaxAddrICON',
	itemId: 'sendfaxaddrID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();

		var sels = sm.getSelection();
		var otherRecArr = new Array();		
		Ext.Array.each(sels, function(item) {
			if(item.data.faxNumber && item.data.faxNumber.length>0) {
				otherRecArr.push(item.data);				
			}
		});
		if (sm.hasSelection()) {
			if( otherRecArr.length > 0){
				sendFaxForward(sm,2,otherRecArr);
			}else{
				Ext.Msg.alert('消息','传真号码不能为空');
			}
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(!(selection.length >= 1) || (data && data.folderPrivforword == 0));
	}
});

Ext.create('WS.address.AddressAction', {
	text: '刷新',
	tooltip: '刷新',
	iconCls: 'refreshAddressICON',
	itemId: 'refreshaddrID',
	handler: function() {
		var panel = this.getTargetView();
		panel.getStore().getProxy().extraParams.folderFlag = '';
		panel.loadGrid();
		var tree = panel.up('#viewPortEastID').down('#addressTree');
		var treeSeles = tree.getSelectionModel().getSelection();
		panel.up('#centerCenterView').setTitle(linkViewTitle(treeSeles));
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.address.AddressAction', {
	text: '新建',
	tooltip: '新建联系人',
	itemId: 'createaddrID',
	iconCls: 'createaddrICON',
	handler: function() {
		var currentWin = Ext.create('WS.address.CreateAddr', {
			grid: this.getTargetView(),
			action: 'create',
			title: "<div><img src='resources/images/grid/book_add.png' style='margin-bottom: -5px;'>&nbsp; "+'新建联系人'+"</div>"
		});
		currentWin.show('', function() {
			currentWin.down('#LastNameID').focus(true);
			currentWin.down('#hidSelTreeId').setValue(addressTree1.getSelectionModel().getSelection()[0].data.id);
		});
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(data && data.folderPrivAdd == 0);
	}
});

Ext.create('WS.address.AddressAction', {
	text: '查找',
	tooltip: '自定义查找',
	itemId: 'findaddrID',
	iconCls: 'findaddrICON',
	handler: function() {
		var win = Ext.create('WS.address.AddressSelfFilter', {
			grid: this.getTargetView()
		});
		win.show('', function() {
			win.down('#DispNameID').focus(true);
		});
	},
	updateStatus: function(selection) {

	}
});

Ext.create('WS.address.AddressAction', {
	text: '修改',
	tooltip: '修改联系人',
	itemId: 'modifyAddressID',
	iconCls: 'modifyAddressICON',
	handler: function() {

		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		if (sm.hasSelection()) {
			var records = sm.getSelection();
			var currentWin = Ext.create('WS.address.CreateAddr', {
				grid: currentPanel,
				action: 'update'
			});
			currentWin.down('form').getForm().loadRecord(records[0]);

			currentWin.show('', function() {
				currentWin.down('#LastNameID').focus(true);
			});
		}

	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled(!(selection.length == 1) || (data && data.folderPrivModify == 0));
	}
});

Ext.create('WS.address.AddressAction', {
	text: '删除',
	tooltip: '删除选中联系人',
	iconCls: 'delAddressICON',
	itemId: 'delAddressID',
	handler: function() {
		var currentPanel = this.getTargetView();
		var sm = currentPanel.getSelectionModel();
		if (sm.hasSelection()) {
			newMesB.show({
				title:'提示',
				msg: '您确认要删除所选择的行吗？',
				buttons: Ext.MessageBox.YESNO,
				closable:false,
				icon: Ext.MessageBox.QUESTION,
				fn: function(btn) {
					if (btn == 'yes') {
						var records = sm.getSelection();
						var store = currentPanel.getStore();
						var ids = new Array();
						for(var p in records) {
							ids.push(records[p].data.phoneBookID);
						}
						store.getProxy().extraParams.idList = ids.join();
						store.remove(records);
						store.sync();
						store.getProxy().extraParams.idList = '';
						for(var i=0; i<records.length; i++) {
							records[i].commit(true);			//将之前选中的数据设置脏数据为false
						}
						(new Ext.util.DelayedTask( function() {
								store.load();
							})).delay(500);
					}
				}
			});
		} else {
			Ext.Msg.alert('错误', '请选择您要删除的行！');
		}
	},
	updateStatus: function(selection) {
		var data = this.getTargetView().privData;
		this.setDisabled((data && data.folderPrivDelete==0) || selection.length == 0);
	}
});