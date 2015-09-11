
// 传真树Model
Ext.define('wfTree_Model', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'string',
		mapping : 'nodeid'
	},{
		name : 'text',
		type : 'string',
		mapping : 'nodetext'
	},{
		name : 'leaf',
		type : 'boolean',
		mapping : 'isleaf'
	},{
		name : 'iconCls',
		type : 'string',
		mapping : 'iconcls'
	},{
		name : 'expanded',
		type : 'boolean',
		mapping : 'expanded'
	}]
});

// 传真树Store

Ext.create('Ext.data.TreeStore', {
	model : 'wfTree_Model',
	storeId : 'wfTrstoreId',
	//autoLoad: false,
	// clearOnLoad:false,
	proxy : {
		type : 'ajax',
		url : WsConf.Url,
		extraParams : {
			req : 'treenodes',
			treename : 'wftree',
			restype : 'json'

		},
		reader : {
			type : 'json',
			root : 'treeset',
			successProperty : 'success',
			messageProperty : 'msg'
		},
		actionMethods : 'POST'
	},

	root : {
		expanded : false,
		text : '任务',
		iconCls : 'workFlow'
	}
});

// filepngview
Ext.define('ws.workflow.WfTreeAction', {
	extend : 'WS.action.Base',
	category : 'WfTreeAction'
});


// 刷新
Ext.create('ws.workflow.WfTreeAction', {
	itemId : 'wfTreeRef',
	text : '刷新',
	tooltip : '刷新',
	iconCls : 'foloderRefresh',
	disabled : false,
	handler : function(button, event) {
		var store = wfTree.getStore();
		var rec =  wfTree.getSelectionModel().getSelection()[0];
		store.getProxy().extraParams.refresh = 1;
		wfTree.getStore().load({
			node :rec,
			callback: function(records, operation, success) {
				rec.collapse();
				rec.expand();
			}
		});
		store.getProxy().extraParams.refresh = 0;
	},
	updateStatus : function(isPerson, isPChildren, hasRec, isLeaf) {
		this.setDisabled(false);
	}
});


// 创建一个上下文菜单
var wfTree_RightMenu = Ext.create('Ext.menu.Menu', {
	listeners: {
		afterrender: function() {
			var me = this;
			//表单数据
			if(template) {
				if(!serverInfoDis && serverInfoModel.data.formData == 0) {
					me.add(ActionBase.getAction('changeTemplate'));
				} 
			}
			
		}
	},
	items : [ActionBase.getAction('wfTreeRef')]
});
// wfTree
Ext.define('ws.workflow.wfTree', {
	alias : 'widget.wfTree',
	itemId : 'wfTree',
	title : '任务',
	iconCls : 'workFlowTitle',
	extend : 'Ext.tree.Panel',
	clearOnLoad: false,
	alternateClassName : ['wfTree'],
	store : 'wfTrstoreId',	
	rootVisible : false,
	frame : false,
	frameHeader : false,
	border : false,
	listeners : {			
		load: function(store,records,models,suc,opts) {

			if(!models || models.length<=0)
				return;			
			Ext.Array.each(models, function(item,index,alls) {				
				var interStr = wfTreeInter(item.data.id,item.data.text);
				if(interStr != '') {
					item.data.text = interStr;
				}
			
			});		
		},
		expand : function(tree, opts) {
			var mainForm = Ext.getCmp('viewPortEast');
			hideLinkPal();
			var btnPngTab= mainForm.down('#btnPng');
			btnPngTab.setText('文档显示');
			setReadFlagTask.cancel();
			accordionTask.cancel();			 
			accordionTask.delay(50, function() {
				//doctmpItem = '';
				tree.fireEvent("selectionchange", tree.getView(), tree.getSelectionModel().getSelection());
				if(!wfTree.getSelectionModel().hasSelection()) {
					wfTree.getSelectionModel().select(0, true);
				}
			});
			//保存状态
			//保存变量并上传
			var me = this;
			myStates.currtree.name = me.itemId;
		
			var tmpS = myStates.currtree;
			wsUserStates.setServerState('currtree',tmpS);			
		},
		itemcontextmenu : function(view, rec, item, index, e, opts) {
			e.stopEvent();
			wfTree.getSelectionModel().select(rec);			
			wfTree_RightMenu.showAt(e.getXY());
			
		}
	}
});