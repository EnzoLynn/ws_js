function treeStoreException(proxy, response, operation) {
	var json = Ext.JSON.decode(response.responseText);
	var code = json.code;
	if(operation.action == "update" || operation.action == "destroy") {
		var dirMyStore = Ext.StoreMgr.lookup('directoryTree_store');
		dirMyStore.loadTree();		//
	}
	errorProcess(code);
	//根据operation 处理
}

//传真目录Model
Ext.define('directoryTree_Model', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id',
		type: 'string',
		mapping: 'nodeid'
	},{
		name: 'text',
		type: 'string',
		mapping: 'nodetext'
	},{
		name: 'leaf',
		type: 'boolean',
		mapping: 'isleaf'
	},{
		name: 'iconCls',
		type: 'string',
		mapping: 'iconcls'
	},{
		name: 'expanded',
		type: 'boolean',
		mapping: 'expanded'
	}
	]
});

//传真目录Grid
Ext.define('directoryGrid_Model', {
	extend: 'Ext.data.Model',
	idProperty: 'id',
	fields: [{
		name: 'id',
		type: 'string'
	},{
		name: 'dirtext',
		type: 'string'
	}
	]
});

//传真目录Store
Ext.create('Ext.data.TreeStore', {
	model: 'directoryTree_Model',
	defaultRootId: WaveFaxConst.PublicRootFolderID,
	storeId: 'directoryTree_store',
	//autoLoad:false,
	proxy: {
		type: 'ajax',
		//url:'WS/user/dirJson.json',
		url: WsConf.Url,		
		extraParams: {
			req: 'treenodes',
			treename: 'addrtree',
			restype: 'json',
			sessiontoken:Ext.util.Cookies.get("sessiontoken"),
			need:true
		},
		reader : {
			type : 'json',
			root: 'treeset',
			successProperty: 'success',
			messageProperty: 'msg'
		},
		actionMethods: 'POST'
	},
	root: {
		expanded: true,
		text: '共享收件夹',
		iconCls: 'fax'//,
		//checked:false
	},
	loadTree: function() {
		var store =this;
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		store.getProxy().extraParams.req = "treenodes";
		store.getProxy().extraParams.treename = "addrtree";
		store.getProxy().extraParams.restype = "json";
		store.getProxy().extraParams.need = true;

		store.load();		
	}
});

// var directoryGridStore = Ext.create('Ext.data.Store', {
	// model: 'directoryGrid_Model'
// });

//传真目录directory树
Ext.define('WS.user.directoryTree', {
	alias: 'widget.directoryTree',
	//iconCls: 'addressTitle',
	extend: 'Ext.tree.Panel',
	animate:false,
	store: 'directoryTree_store',
	rootVisible: true,
	border: true,
	width: 400,
	height: 400,
	multiSelect: true
});

//传真目录directory Grid
// Ext.define('WS.user.directoryTarget', {
	// alternateClassName: ['directoryTarget'],
	// alias: 'widget.directoryTarget',
	// extend: 'Ext.grid.Panel',
	// title: '发送到',
	// frameHeader: false,
	// store: directoryGridStore,
	// columnLines: true,
	// multiSelect: true,
	// columns : [{
		// text: '共享文件夹名',
		// dataIndex: 'dirtext',
		// flex: 1,
		// renderer: function(value, metaData, record) {
			// return updateRecord("<div><img src='resources/images/tree/folder.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>', metaData, record);
		// }
	// }]
// });