function createOutFaxStore() {
	Ext.StoreMgr.removeAtKey ('outfaxstoreId');

	var tmPty = 'outFaxID',tmDre = 'DESC';

	if(myStates.outfaxgridState.sort && myStates.outfaxgridState.sort.property) {
		tmPty = myStates.outfaxgridState.sort.property;
	}
	if(myStates.outfaxgridState.sort && myStates.outfaxgridState.sort.direction) {
		tmDre = myStates.outfaxgridState.sort.direction;
	}

	Ext.create('Ext.data.Store', {
		model: 'WS.outfax.Outfaxmodel',
		storeId: 'outfaxstoreId',
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
				dataname: 'outfax',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
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
			},
			actionMethods: 'POST',
			listeners: {
				exception: function(proxy, response, operation) {
					var json = Ext.JSON.decode(response.responseText);
					var code = json.code;
					if(operation.action == "update" || operation.action == "destroy") {
						outfax.loadGrid(filter);
					}
					errorProcess(code);
				}
			}
		},
		listeners: {
			load: function(store, records, suc,operation,opts) {
				loadDefaultPng();
				var total = outfax.down("#pagingtoolbarID").getPageData().total;
				if (total == '0') {
					outfax.down("#next").setDisabled(true);
					outfax.down("#last").setDisabled(true);
				}
			}
		}

	});
	
	//刷新paging
	if(outfax){
		outfax.down('#pagingtoolbarID').bindStore(Ext.StoreMgr.lookup ('outfaxstoreId'));
	}

}