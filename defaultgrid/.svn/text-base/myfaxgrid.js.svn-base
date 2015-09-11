function myUpdateRecord(value, metaData, record) {
	if (record.get('gridId') == '0') {
		return "<span><img src='resources/images/tree/inbox.png' style='margin-bottom: -5px;'>&nbsp;" + '收件箱' + '</span>';
	}
	if (record.get('gridId') == 'grfjx') {
		return "<span><img src='resources/images/tree/outbox.png' style='margin-bottom: -5px;'>&nbsp;" + '发件箱' + '</span>';
	}
	if (record.get('gridId') == 'gryfjx') {
		return "<span><img src='resources/images/tree/sent.png' style='margin-bottom: -5px;'>&nbsp;" + '已发件箱' + '</span>';
	}
	if (record.get('gridId') == 'grcgx') {
		return "<span><img src='resources/images/tree/saveDraft.png' style='margin-bottom: -5px;'>&nbsp;" + '草稿箱' + '</span>';
	}
	return value;
}

//=====================================================================================//
//=============================defaultgrid    store    ================================//
//=====================================================================================//
Ext.create('Ext.data.ArrayStore', {
	//model: 'defaultgridModel',
	storeId: 'myfaxgridStoreId',
	fields: [{
		name: 'gridId',
		type: 'string'
	},{
		name: 'gridName',
		type: 'string'
	},{
		name: 'recordCount',
		type: 'string'
	}
	],
	autoLoad: false,
	pageSize: 10,
	data: [
	[ WaveFaxConst.RootFolderID, '收件箱' ,""],
	[ "grfjx", '发件箱',""],
	[ "gryfjx", '已发件箱' ,""],
	[ "grcgx", '草稿箱' ,""]
	]

});

//=====================================================================================//
//=============================defaultgrid             ================================//
//=====================================================================================//

Ext.define('ws.defaultgrid.myfaxgrid', {
	alternateClassName: ['myfaxgrid'],
	alias: 'widget.myfaxgrid',
	extend: 'Ext.grid.Panel',
	store: 'myfaxgridStoreId',
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
			return myUpdateRecord(value, metaData, record);
		},
		flex: 1
	},{
		text: '记录数',
		dataIndex: 'recordCount',
		renderer: function (value, metaData, record) {
			if(record.get('gridId') == '0'){
				var tmpArr = value.split('/');
				return '总数:'+tmpArr[0]+'&nbsp;&nbsp;&nbsp;&nbsp;'+'未读数:'+tmpArr[1];
			}
			if(record.get('gridId') == 'gryfjx'){
				var tmpArr = value.split('/');
				return '总数:'+tmpArr[0]+'&nbsp;&nbsp;&nbsp;&nbsp;'+'发送成功:'+tmpArr[1]+'&nbsp;&nbsp;&nbsp;&nbsp;'+'发送失败:'+tmpArr[2];
			}			
			return '总数:'+value;	
		},
		flex: 4
	}
	]

});


Ext.create('Ext.data.ArrayStore', {
	//model: 'defaultgridModel',
	storeId: 'grscGridStoreID',
	fields: [{
		name: 'gridId',
		type: 'string'
	},{
		name: 'gridName',
		type: 'string'
	},{
		name: 'recordCount',
		type: 'string'
	}
	],
	autoLoad: false,
	pageSize: 10,
	data: []
});

//=====================================================================================//
//=============================收藏夹grid            ================================//
//=====================================================================================//

Ext.define('ws.defaultgrid.grscgrid', {
	alternateClassName: ['grscgrid'],
	alias: 'widget.grscgrid',
	extend: 'Ext.grid.Panel',
	store: 'grscGridStoreID',
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
			return "<span><img src='resources/images/tree/folder.png' style='margin-bottom: -5px;'>&nbsp;" + owerInternational(value) + '</span>';;
		},
		flex: 5
	},{
		text: '记录数',
		dataIndex: 'recordCount',
		renderer: function (value, metaData, record) {
			var tmpArr = value.split('/');
			return '总数:'+tmpArr[0]+'&nbsp;&nbsp;&nbsp;&nbsp;'+'未读数:'+tmpArr[1];
		},
		flex: 4
	}]
});

//=====================================================================================//
//=============================他人委任grid            ================================//
//=====================================================================================//
Ext.create('Ext.data.ArrayStore', {
	storeId: 'trwrGridStoreID',
	fields: [{
		name: 'gridId',
		type: 'string'
	},{
		name: 'gridName',
		type: 'string'
	}
	],
	autoLoad: false,
	pageSize: 10,
	data: []
});
Ext.define('ws.defaultgrid.OtherSubGrid', {
	alternateClassName: ['OtherSubGrid'],
	alias: 'widget.OtherSubGrid',
	extend: 'Ext.grid.Panel',
	store: 'trwrGridStoreID',
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
			if(record.data.gridId == 'trwr') {
				return "<span><img src='resources/images/tree/inbox.png' style='margin-bottom: -5px;'>&nbsp;" + '收件箱' + '</span>';
			}else {
				return "<span><img src='resources/images/pub/userStatus.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</span>';
			}
		},
		flex: 5
	}]
});