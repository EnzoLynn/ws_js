function createDocgridStroe() {
	Ext.StoreMgr.removeAtKey ('docgridstoreId');
	var tmPty = 'docID',tmDre = 'DESC';

	if(myStates.docgridState.sort && myStates.docgridState.sort.property) {
		tmPty = myStates.docgridState.sort.property;
	}
	if(myStates.docgridState.sort && myStates.docgridState.sort.direction) {
		tmDre = myStates.docgridState.sort.direction;
	}
	Ext.create('Ext.data.Store', {
		model: 'WS.docmanager.Docgridmodel',
		storeId: 'docgridstoreId',
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
				dataname: 'docgrid',             //dataset名称，根据实际情况设置,数据库名
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
						docGrid.loadGrid();
					}
				}
			}
		},
		listeners: {
			load: function(store, records, suc,operation,opts) {
				loadDefaultPng();
				var total = docGrid.down("#pagingtoolbarID").getPageData().total;
				if (total == '0') {
					docGrid.down("#next").setDisabled(true);
					docGrid.down("#last").setDisabled(true);
				}
				if(suc) {
					if(docTree) {
						docTree.updateMenu(docGrid);
					}
				}
			}
		}

	});
	
	//刷新paging
	if(docGrid){
		docGrid.down('#pagingtoolbarID').bindStore(Ext.StoreMgr.lookup ('docgridstoreId'));
	}
	
}