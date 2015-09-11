function createInfaxStroe() {
	Ext.StoreMgr.removeAtKey ('infaxstoreId');
	var tmPty = 'inFaxID',tmDre = 'DESC';

	if(myStates.infaxgridState.sort && myStates.infaxgridState.sort.property) {
		tmPty = myStates.infaxgridState.sort.property;
	}
	if(myStates.infaxgridState.sort && myStates.infaxgridState.sort.direction) {
		tmDre = myStates.infaxgridState.sort.direction;
	}
	Ext.create('Ext.data.Store', {
		model: 'WS.infax.Infaxmodel',
		storeId: 'infaxstoreId',
		filterMap: Ext.create('Ext.util.HashMap'),
		pageSize: userConfig.gridPageSize,
		autoLoad: false,
		remoteSort: true,     //排序通过查询数据库
		sorters: [{
			property: tmPty,
			direction: tmDre
		}],
		autoSync: false,
		proxy: {
			type: 'ajax',
			//		url: 'WS/infax/Infax.json',
			api: {
				create  : WsConf.Url + '?action=create',
				read    : WsConf.Url + '?action=read',
				update  : WsConf.Url + '?action=update',
				destroy : WsConf.Url + '?action=destroy'
			},
			filterParam: 'filter',
			sortParam:'sort',
			directionParam:'dir',
			limitParam:'limit',
			startParam:'start',
			simpleSortMode: true,		//单一字段排序
			extraParams: {
				req:'dataset',
				dataname: 'infax',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
				folderid: 0,
				refresh: null,
				template:''//当前模版
			},
			reader : {
				type : 'json',
				root: 'dataset',
				seccessProperty: 'success',
				messageProperty: 'msg',
				totalProperty: 'total'
			},
			writer : {
				type : 'json',
				writeAllFields : false,
				allowSingle : false
				//			root: 'dataset'
			},
			actionMethods: 'POST',
			listeners: {
				exception: function(proxy, response, operation) {
					var json = Ext.JSON.decode(response.responseText);
					var code = json.code;
					errorProcess(code);
					if(operation.action != 'read') {
						tb.loadGrid();
					}
				}
			}
		},
		listeners: {
			load: function(store, records, suc,operation,opts) {
				loadDefaultPng();
				var total = tb.down("#pagingtoolbarID").getPageData().total;
				if (total == '0') {
					tb.down("#next").setDisabled(true);
					tb.down("#last").setDisabled(true);
				}
				if(suc) {
					if(FolderTree1) {
						FolderTree1.updateMenu(tb);
					}
				}
			}
		}

	});
	
	//刷新paging
	if(tb){
		tb.down('#pagingtoolbarID').bindStore(Ext.StoreMgr.lookup ('infaxstoreId'));
	}
	
}