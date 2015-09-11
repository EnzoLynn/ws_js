Ext.create('Ext.data.ArrayStore', {
	//model: 'defaultgridModel',
	storeId: 'wfDfgridStoreId',
	fields: [{
		name: 'gridId',
		type: 'string'
	},{
		name: 'gridName',
		type: 'string'
	}],
	autoLoad: false,
	pageSize: 10,
	data: [
	//['wfstart', '启动事项'],
	[ "wfinit", '提交事项'],
	[ "wfwait", '待办事项']
	//[ "wfentrust", '委托我的待处理事项']
	]

});

//=====================================================================================//
//=============================defaultgrid             ================================//
//=====================================================================================//
function wfDfUpdateRecord(value, metaData, record) {
	if (record.get('gridId') == 'wfstart') {
		return "<span><img src='resources/images/workFlow/starTask.png' style='margin-bottom: -5px;'>&nbsp;" + '启动事项' + '</span>';
	}
	if (record.get('gridId') == 'wfinit') {
		return "<span><img src='resources/images/workFlow/submitTask.png' style='margin-bottom: -5px;'>&nbsp;" + '我发起的事项' + '</span>';
	}
	if (record.get('gridId') == 'wfwait') {
		return "<span><img src='resources/images/workFlow/dealTask.png' style='margin-bottom: -5px;'>&nbsp;" + '等待我处理的事项' + '</span>';
	}
	if (record.get('gridId') == 'wfentrust') {
		return "<span><img src='resources/images/workFlow/deputeTask.png' style='margin-bottom: -5px;'>&nbsp;" + '委托我的待处理事项' + '</span>';
	}
	return value;
}

Ext.define('ws.workflow.wfDfgrid', {
	alternateClassName: ['wfDfgrid'],
	alias: 'widget.wfDfgrid',
	extend: 'Ext.grid.Panel',
	store: 'wfDfgridStoreId',
	viewConfig: {		
		loadMask:false
	},
	columns: [{
		text: '编号',
		dataIndex: 'gridId',
		hidden: true
	},{
		text: '名称',
		dataIndex: 'gridName',
		renderer: function (value, metaData, record) {
			return wfDfUpdateRecord(value, metaData, record);
		},
		flex: 1
	}]

});