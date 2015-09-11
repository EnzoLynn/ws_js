function createSuccoutFaxStroe() {
	Ext.StoreMgr.removeAtKey ('succoutfaxstoreId');
	var tmPty = 'outFaxID',tmDre = 'DESC';

	if(myStates.succoutfaxgridState.sort && myStates.succoutfaxgridState.sort.property) {
		tmPty = myStates.succoutfaxgridState.sort.property;
	}
	if(myStates.succoutfaxgridState.sort && myStates.succoutfaxgridState.sort.direction) {
		tmDre = myStates.succoutfaxgridState.sort.direction;
	}
	Ext.create('Ext.data.Store', {
		model: 'WS.succoutfax.Succoutfaxmodel',
		storeId: 'succoutfaxstoreId',
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
			//		url: 'WS/succoutfax/Succoutfax.json',
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
				dataname: 'succoutfax',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
				folderid: '',
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
					if(operation.action == "update" || operation.action == "destroy") {
						succoutfax.loadGrid();		//
					}
					
				}
			}
		},
		listeners: {
			load: function(store, records, suc,operation,opts) {
				loadDefaultPng();
				var total = succoutfax.down("#pagingtoolbarID").getPageData().total;
				if (total == '0') {
					succoutfax.down("#next").setDisabled(true);
					succoutfax.down("#last").setDisabled(true);
				}
				if(suc) {
					if(FolderTree1) {
						FolderTree1.updateMenu(succoutfax);
					}
				}
			}
		}

	});
	//刷新paging
	if(succoutfax){
		succoutfax.down('#pagingtoolbarID').bindStore(Ext.StoreMgr.lookup ('succoutfaxstoreId'));
	}
}