
Ext.define('WS.template.templateGridModel', {
	extend: 'Ext.data.Model',
	idProperty: 'tplId',
	alternateClassName: ['templateGridModel'],
	fields: [{
		name: 'tplId',
		type: 'string'
	},{
		name: 'tplName',
		type: 'string'
	},{
		name: 'tplTitle',
		type: 'string'
	}
	]
});

Ext.create('Ext.data.ArrayStore', {
	//model: 'defaultgridModel',
	storeId: 'templateGridStore',
	model: 'WS.template.templateGridModel',
	autoLoad: false,
	data: template.tplGridArr
});

// Ext.create('Ext.data.ArrayStore', {
// //model: 'defaultgridModel',
// storeId: 'templateGridStoreS',
// fields: [{
// name: 'tplId',
// type: 'string'
// },{
// name: 'tplName',
// type: 'string'
// },{
// name: 'tplTitle',
// type: 'string'
// }
// ],
// autoLoad: false,
// data: template.tplArr
// });

Ext.define('WS.template.templateGrid', {
	alternateClassName: ['templateGrid'],
	alias: 'widget.templateGrid',
	extend: 'Ext.grid.Panel',
	store: 'templateGridStore',
	title:'请选择一个模版',
	viewConfig: {
		loadMask:false
	},
	columns: [{
		text: '模版编号',
		dataIndex: 'tplId',
		hidden: true
	},{
		text: '模版名称',
		dataIndex: 'tplName',
		flex:1
	},{
		text: '表单显示标题',
		dataIndex: 'tplTitle',
		flex:1
	}
	],
	listeners: {
		itemmouseenter: function(me, record, item) {
			item.style.cursor = 'pointer';
		},
		itemmouseleave: function(me, record, item) {
			item.style.cursor = 'auto';
		}
	}

});

function templateWinloadclose(record,okfun,winType) {

	var cgrid = currGrid.itemId.toLowerCase();
	if(record.data.tplId == 'none') {

		if(cgrid == 'infaxgrid') {
			if(tb.getStore().getProxy().extraParams.template != '') {
				infaxInfo.loadDefault();
				createInfaxModel();
				createInfaxStroe();
				if(tb) {
					var tmpArr = new Array();
					//alert('none');
					//可比state对排序,控制可见

					// infaxInfo.infaxColMap.each( function(item,index,alls) {
					// tmpArr.push(item);
					// });
					tmpArr = sortGridColumns(myStates.infaxgridState.columns,infaxInfo.infaxColMap);
					tb.reconfigure(Ext.data.StoreManager.lookup('infaxstoreId'),tmpArr);
					//切换模版
					tb.getStore().getProxy().extraParams.template = '';
					template.setTplStates('',false,false,false,false,getCurrTree().itemId);
					//tb.down('#infaxtemplate').setText('表单数据模版:无');
				}
				tb.getStore().getProxy().extraParams.folderid =FolderTree1.getSelectionModel().getSelection()[0].data.id;
				tb.loadGrid();
			}
		}
		if(cgrid == 'outfaxgrid') {
			if(outfax.getStore().getProxy().extraParams.template != '') {
				outfaxInfo.loadDefault();
				createoutfaxModel();
				createOutFaxStore();
				if(outfax) {
					var tmpArr = new Array();
					// outfaxInfo.outfaxColMap.each( function(item,index,alls) {
					// tmpArr.push(item);
					// });
					tmpArr = sortGridColumns(myStates.outfaxgridState.columns,outfaxInfo.outfaxColMap);
					outfax.reconfigure(Ext.data.StoreManager.lookup('outfaxstoreId'),tmpArr);
					//切换模版
					outfax.getStore().getProxy().extraParams.template = '';
					template.setTplStates('',false,false,false,false,getCurrTree().itemId);
					//outfax.down('#infaxtemplate').setText('表单数据模版:无');
				}
				outfax.getStore().getProxy().extraParams.folderid =FolderTree1.getSelectionModel().getSelection()[0].data.id;
				outfax.loadGrid();
			}
		}
		if(cgrid == 'succoutfaxgrid') {
			if(succoutfax.getStore().getProxy().extraParams.template != '') {
				sucfaxInfo.loadDefault();
				createsucfaxModel();
				createSuccoutFaxStroe();
				if(succoutfax) {
					var tmpArr = new Array();
					// sucfaxInfo.sucfaxColMap.each( function(item,index,alls) {
					// tmpArr.push(item);
					// });
					tmpArr = sortGridColumns(myStates.succoutfaxgridState.columns,sucfaxInfo.sucfaxColMap);
					succoutfax.reconfigure(Ext.data.StoreManager.lookup('succoutfaxstoreId'),tmpArr);
					//切换模版
					succoutfax.getStore().getProxy().extraParams.template = '';
					template.setTplStates('',false,false,false,false,getCurrTree().itemId);
					//succoutfax.down('#infaxtemplate').setText('表单数据模版:无');
				}
				succoutfax.getStore().getProxy().extraParams.folderid =FolderTree1.getSelectionModel().getSelection()[0].data.id;
				succoutfax.loadGrid();
			}
		}

		if(cgrid == 'docgrid') {
			if(docGrid.getStore().getProxy().extraParams.template != '') {
				docManagerInfo.loadDefault();
				createDocgridModel();
				createDocgridStroe();
				if(docGrid) {
					var tmpArr = new Array();
					// docManagerInfo.docManagerColMap.each( function(item,index,alls) {
					// tmpArr.push(item);
					// });
					tmpArr = sortGridColumns(myStates.docgridState.columns,docManagerInfo.docManagerColMap);
					docGrid.reconfigure(Ext.data.StoreManager.lookup('docgridstoreId'),tmpArr);
					//切换模版
					docGrid.getStore().getProxy().extraParams.template = '';
					template.setTplStates('',false,false,false,false,getCurrTree().itemId);
					//succoutfax.down('#infaxtemplate').setText('表单数据模版:无');
				}
				docGrid.getStore().getProxy().extraParams.folderid =docTree.getSelectionModel().getSelection()[0].data.id;
				docGrid.loadGrid();
			}
		}

		if(cgrid == 'taskgrid') {
			if(taskGrid.getStore().getProxy().extraParams.template != '') {
				taskInfo.loadDefault();
				createTaskgridModel();
				createTaskgridStroe();
				if(taskGrid) {
					var tmpArr = new Array();

					tmpArr = sortGridColumns(myStates.taskgridState.columns,taskInfo.taskColMap);
					taskGrid.reconfigure(Ext.data.StoreManager.lookup('taskgridstoreId'),tmpArr);
					//切换模版
					taskGrid.getStore().getProxy().extraParams.template = '';
					template.setTplStates('',false,false,false,false,getCurrTree().itemId);
					//succoutfax.down('#infaxtemplate').setText('表单数据模版:无');
				}
				taskGrid.getStore().getProxy().extraParams.folderid =wfTree.getSelectionModel().getSelection()[0].data.id;
				taskGrid.loadGrid();
			}
		}

	} else {
		var needLoad = false;

		if(cgrid == 'infaxgrid') {
			if(tb.getStore().getProxy().extraParams.template != record.data.tplId) {
				infaxInfo.loadDefault();
				needLoad = true;
			}
		}
		if(cgrid == 'outfaxgrid') {
			if(outfax.getStore().getProxy().extraParams.template != record.data.tplId) {
				outfaxInfo.loadDefault();
				needLoad = true;
			}
		}
		if(cgrid == 'succoutfaxgrid') {
			if(succoutfax.getStore().getProxy().extraParams.template != record.data.tplId) {
				sucfaxInfo.loadDefault();
				needLoad = true;
			}
		}
		if(cgrid == 'docgrid') {
			if(docGrid.getStore().getProxy().extraParams.template != record.data.tplId) {
				docManagerInfo.loadDefault();
				needLoad = true;
			}
		}
		if(cgrid == 'taskgrid') {
			if(taskGrid.getStore().getProxy().extraParams.template != record.data.tplId) {
				taskInfo.loadDefault();
				needLoad = true;
			}
		}
		if(needLoad) {

			var tmpText = record.data.tplTitle + "("+record.data.tplName+")";
			template.changeTemplate(record.data.tplId,tmpText,cgrid, function(selfgrid) {
				selfgrid.getStore().getProxy().extraParams.folderid =getCurrTree().getSelectionModel().getSelection()[0].data.id;
				selfgrid.loadGrid();
				if(winType) {
					if(okfun) {
						okfun(record);
					}
				} else {
					if(okfun) {
						okfun();
					}
				}
			});
			return;
		}

		if(winType) {
			if(okfun) {
				okfun(record);
			}
		} else {
			if(okfun) {
				okfun();
			}
		}

	}
}

//ruleCAMap :  规则设置表单数据 map
function loadTemplateWin(okfun,winType, ruleCAMap) {
	return Ext.create('Ext.window.Window', {
		title: '表单数据',
		height: 300,
		width: 400,
		modal:true,
		layout: 'fit',
		items: {
			xtype: 'templateGrid',
			listeners: {
				itemclick: function(view,record,htmlel,index,e,opts) {
					var me = this;
					me.setTitle('模版:'+record.data.tplTitle+'('+record.data.tplName+')');
				},
				itemdblclick: function(view,record,htmlel,index,e,opts) {
					var me = this;
					if(ruleCAMap) {
						ruleTempDataFn(record, ruleCAMap);

					} else if(winType && winType.pngGroup == 'wfhandlerwin') {
						if(okfun) {
							okfun(record);
						}
					} else if(winType && winType.pngGroup == 'sendfax') {
						if(okfun) {
							okfun(record);
						}
					} else if(winType && winType.pngGroup != 'sendfax') {
						templateWinloadclose(record,okfun,winType);
					} else {
						templateWinloadclose(record,okfun,winType);
					}
					//none
					me.up('window').close();
				}
			}
		},
		buttons:[{
			text:'不使用数据模版',
			handler: function() {
				var me = this;
				
				
				var record = Ext.ModelManager.create({
					tplId: 'none',
					tplName: '无',
					tplTitle: '无'
				}, 'WS.template.templateGridModel');
				if(ruleCAMap) {
					ruleTempDataFn(record, ruleCAMap);

				} else if(winType && winType.pngGroup == 'wfhandlerwin') {
					if(okfun) {
						okfun(record);
					}
				} else if(winType && winType.pngGroup == 'sendfax') {
					if(okfun) {
						okfun(record);
					}
				} else if(winType && winType.pngGroup != 'sendfax') {
					templateWinloadclose(record,okfun,winType);
				} else {
					templateWinloadclose(record,okfun,winType);
				}
				//none
				me.up('window').close();
			}
		},{
			text:'确定',
			handler: function() {
				var me = this;
				var sels1 = me.up('window').down('templateGrid').getSelectionModel();
				if(sels1.hasSelection()) {
					sels1 = sels1.getSelection();
					// if(ruleCAMap) {
					// ruleTempDataFn(record, ruleCAMap);
					// } else {
					// templateWinloadclose(sels1[0],okfun,winType);
					// }
					if(ruleCAMap) {
						ruleTempDataFn(record, ruleCAMap);

					} else if(winType && winType.pngGroup == 'wfhandlerwin') {
						if(okfun) {
							okfun(sels1[0]);
						}
					} else if(winType && winType.pngGroup == 'sendfax') {
						if(okfun) {
							okfun(sels1[0]);
						}
					} else if(winType && winType.pngGroup != 'sendfax') {
						templateWinloadclose(sels1[0],okfun,winType);
					} else {
						templateWinloadclose(sels1[0],okfun,winType);
					}
					me.up('window').close();
				}
			}
		},{
			text:'取消',
			handler: function() {
				var me = this;
				me.up('window').close();
			}
		}],
		listeners: {
			afterrender: function(win) {
				var grid = win.down('templateGrid');
				var store = grid.getStore();
				store.loadData(template.tplGridArr);
				var rec = store.findRecord('tplId',template.tplidState);
				if(rec) {
					grid.getSelectionModel().select(rec);
					grid.setTitle('模版:'+rec.data.tplTitle+'('+rec.data.tplName+')');
				} else {
					//grid.getSelectionModel().select(0);
				}

			},
			hide: function() {
				if(winType) {
					showFlash(winType);
				}
			},
			destroy: function() {
				if(winType) {
					showFlash(winType);
				}
			}
		}
	}).show();

}