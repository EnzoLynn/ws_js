function createTaskgridStroe() {
	Ext.StoreMgr.removeAtKey ('taskgridstoreId');
	var tmPty = 'workflowTaskID',tmDre = 'DESC';

	if(myStates.taskgridState.sort && myStates.taskgridState.sort.property) {
		tmPty = myStates.taskgridState.sort.property;
	}
	if(myStates.taskgridState.sort && myStates.taskgridState.sort.direction) {
		tmDre = myStates.taskgridState.sort.direction;
	}
	Ext.create('Ext.data.Store', {
		model: 'WS.workFlow.Taskgridmodel',
		storeId: 'taskgridstoreId',
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
				dataname: 'taskgrid',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
				folderid: 0,
				rules:'1',
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
						taskGrid.loadGrid();
					}
				}
			}
		},
		listeners: {
			load: function(store, records, suc,operation,opts) {
				loadDefaultPng();
				var total = taskGrid.down("#pagingtoolbarID").getPageData().total;
				if (total == '0') {
					taskGrid.down("#next").setDisabled(true);
					taskGrid.down("#last").setDisabled(true);
				}

				if(suc) {
					if(wfTree) {
						var record = wfTree.getSelectionModel().getSelection()[0];
						var text = record.data.text;
						var setT = text;

						setT = text.replace(/\([^\(\)]+\)/g, '').replace(/<[^>]*>/g, '');

						//设置node text 为记录总数
						if(total > 0 && !wfTree.collapsed) {
							if(record.data.id =='wfinon' || record.data.id =='wfwaon' || record.data.id.indexOf('trwron') != -1) {
								record.set('text','<b>'+setT+'('+total+')'+'</b>');
								record.commit();
							} else {
								record.set('text',setT+'('+total+')');
								record.commit();
							}

						} else if (total == 0 && !wfTree.collapsed) {
							record.set('text',  setT);
							record.commit();
						}
					}
				}
			}
		}

	});

	//刷新paging
	if(taskGrid) {
		taskGrid.down('#pagingtoolbarID').bindStore(Ext.StoreMgr.lookup ('taskgridstoreId'));
	}

}