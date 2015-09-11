Ext.define('WS.template.templateAction', {
	extend: 'WS.action.Base',
	category: 'templateAction'
});

Ext.create('WS.template.templateAction', {
	text: '录入数据',
	disabled:true,
	iconCls:'tplBtnIconCls',
	itemId: 'recTemplate',
	handler: function(btn,eve,selOrc) {
		var sels = currGrid.getSelectionModel().getSelection();

		if(selOrc) {
			sels = selOrc;
		}

		var tplId = '';

		tplId = currGrid.getStore().getProxy().extraParams.template;

		if(tplId != '') {
			template.myWinItems = new Array();
			template.myWinGItems.clear();
			var data = Ext.clone(template.saveTplInfo.get(tplId));
			Ext.Array.each(data, function(item,index,alls) {
				var sel = sels[0].data[item.dataName];
				if(sel && sel != '') {
					item.dataDefault = sel;
				}
				template.createContorl(item);
			});
			if(inputDataWin == '') {
				inputDataWin = loadInputDataWin(sels);
				inputDataWin.show();
			} else {
				inputDataWin = loadInputDataWin(sels,false,false,inputDataWin);
				inputDataWin.show(null, function() {
					if(inputDataWin.down('#hidFileId')) {
						if(sels[0].data.faxFileID != inputDataWin.down('#hidFileId').getValue()) {
							initfaxfileinputdatawin(sels[0].data.faxFileID,inputDataWin);
						}
					}
				});
			}

		} else {
			if(template.tplGridArr.length == 0) {
				Ext.Msg.alert('消息','当前无任何可用模版');
				return;
			}
			loadTemplateWin( function() {
				ActionBase.getAction('recTemplate').execute(null,null,sels);
			});
		}

	},
	updateStatus: function(selection) {
		if(template) {
			this.setDisabled((serverInfoModel.data.formData != 0 )?true:false);
			//如果是回收站
			var ispub = currGrid.getStore().getProxy().extraParams.folderid;
			var tMenu = currGridMenu();
			var tSet;
			if(tMenu) {
				tSet = tMenu.down('#t'+this.itemId);
			}

			if(ispub == WaveFaxConst.RecycleFolderID ||
			ispub == WaveFaxConst.PublicRecycleFolderID || ispub =="gryhsz") {
				this.setDisabled(true);
				if(tSet) {
					tSet.setDisabled(true);
				}
			} else {
				if(tSet) {
					tSet.setDisabled(false);
				}
				var data = currGrid.privData;
				var folderid = currGrid.getStore().getProxy().extraParams.folderid;
				this.setDisabled(selection.length <=0 || (data && data.folderPrivModify == 0)
				|| (typeof(folderid) == 'string' && folderid.indexOf('trwr') != -1));
			}

			return;
		}
		this.setDisabled(true);
	}
});

Ext.create('WS.template.templateAction', {
	text: '更换数据模版',
	itemId: 'changeTemplate',
	handler: function() {
		//var sels = currGrid.getSelectionModel();
		//if(sels.hasSelection()) {
		//var sels = sels.getSelection();
		if(template.tplGridArr.length == 0) {
			Ext.Msg.alert('消息','当前无任何可用模版');
			return;
		}
		template.tplidState = currGrid.getStore().getProxy().extraParams.template;
		loadTemplateWin();
		//alert(sels[0].data.inFaxID);
		//}
	},
	updateStatus: function(selection) {
		if(template) {
			this.setDisabled((serverInfoModel.data.formData != 0 )?true:false);
			//如果是回收站
			var ispub = currGrid.getStore().getProxy().extraParams.folderid;
			var tMenu = currGridMenu();
			var tSet;
			if(tMenu) {
				tSet = tMenu.down('#t'+this.itemId);
			}

			if(ispub == WaveFaxConst.RecycleFolderID || ispub == WaveFaxConst.PublicRecycleFolderID
			|| ispub =="gryhsz") {
				this.setDisabled(true);
				if(tSet) {
					tSet.setDisabled(true);
				}
			} else {
				if(tSet) {
					tSet.setDisabled(false);
				}
				var data = currGrid.privData;
				this.setDisabled( (data && data.folderPrivList == 0));
			}
			return;
		}
		this.setDisabled(true);

	}
});