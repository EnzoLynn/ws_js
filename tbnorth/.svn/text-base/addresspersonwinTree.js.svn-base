//通讯录树Model
Ext.define('addresspersonwinTree_Model', {
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
	}
	]
});

//
////通讯录树Store
//Ext.create('Ext.data.TreeStore', {
//    model: 'addresspersonwinTree_Model',
//    storeId: 'addresspersonwinTree_store',
//    defaultRootId: 'addrRoot1',
//    autoLoad:false,
//    proxy: {
//		type: 'ajax',
//		url: WsConf.Url,
//	    extraParams:{
//	    	req: 'treenodes',
//            treename: 'addrtree',
//	        restype: 'json'
//
//	    },
//	    reader : {
//			type : 'json',
//			root: 'treeset',
//		    seccessProperty: 'success',
//		    messageProperty: 'msg'
//		},
//		actionMethods: 'POST'
//	},
//    root: {
//        expanded: true,
//        text: "通讯录",
//        iconCls: 'fax'
//    }
//});

//通讯录窗口addressTree类
Ext.define('ws.address.addresspersonwinTree', {
	alias: 'widget.addresspersonwinTree',
	itemId: 'addresspersonwinTree',
	iconCls: 'addressTitle',
	extend: 'Ext.tree.Panel',
	alternateClassName: ['addresspersonwinTree'],
	//store: 'addresspersonwinTree_store',
	animate:false,
	width: 400,
	height: 400,
	rootVisible: false,
	frame: false,
	frameHeader: false,
	border: true 
});