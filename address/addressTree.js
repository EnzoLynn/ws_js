//通讯录树Model
Ext.define('addressTree_Model', {
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
		name: 'extra',
		type: 'boolean',
		mapping: 'extra'
	},{
		name : 'linksrc',
		type : 'string'
	}
	]
});

//通讯录树Store
Ext.create('Ext.data.TreeStore', {
	model: 'addressTree_Model',
	storeId: 'addrTreeStoreId',
	defaultRootId: 'addrRoot',
	//autoLoad: false,
	//    proxy: {
	//        type: 'ajax',
	//        url: WsConf.Url,
	//        extraParams: {
	//            //action: 'read',
	//            req: 'treenodes',
	//            treename: 'foldertree'
	//        }
	//    },

	proxy: {
		type: 'ajax',
		url: WsConf.Url,
		extraParams: {
			req: 'treenodes',
			treename: 'addrtree',
			restype: 'json'

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
		expanded: false,
		text: '通讯录',
		iconCls: 'fax'

	}
});

Ext.define('WS.address.AddressMenuAction', {
	extend: 'WS.action.Base',
	category: 'addressMenu'
});

//添加
Ext.create('WS.address.AddressMenuAction', {
	itemId: 'addressTreeAdd',
	text:'添加',
	tooltip: '添加',
	iconCls: 'foloderAdd',
	disabled: true,
	handler: function (button, event) {
		var rec = addressTree1.getSelectionModel().getSelection()[0];
		var pareNode = rec.parentNode;

		promWin = Ext.create('Ext.window.Window', {
			title: '添加',
			height: 120,
			width: 300,
			modal:true,
			iconCls: 'foloderAdd',
			layout: 'auto',
			items:[{
				width:280,
				xtype:'textfield',
				itemId:'txtFname',
				labelWidth:80,
				margin:'15 0 0 5',
				labelAlign:'right',
				fieldLabel:'文件夹名称',
				allowBlank:false,
				blankText:'不能为空',
				regex: regexFolderName,
				regexText:'文件夹名称不能含有\/?: *"<>|'
			}],
			buttons:[{
				text:'确定',
				handler: function() {
					var txtFname = promWin.down('#txtFname');
					if (txtFname.isValid()) {
						var name = txtFname.getValue();
						//调用接口取值
						var param= {
							folderName:name,
							sessiontoken :sessionToken,
							folderId:rec.data.id
						}
						WsCall.call('addressTreeAdd', param, function (response, opts) {
							var fid = response.data;
							//if (rec.data.expanded == true && rec.data.id !=  WaveFaxConst.RootFolderID) {
							// var temp = rec.appendChild({
							// text: name,
							// id: fid,
							// leaf: false
							// }); //append
							//} else {
							addressTree1.getStore().getProxy().extraParams.curnode = rec.data.id;
							addressTree1.getStore().getProxy().extraParams.isexpanded = rec.isExpanded();

							addressTree1.getStore().load({
								node: pareNode,
								callback: function(records, operation, success) {
									if(pareNode.data.id == 'addrRoot') {
										pareNode.collapse();
										pareNode.expand();
									}

									Ext.Array.each(records, function(recor,index,alls) {
										if(recor.data.id == rec.data.id) {
											addressTree1.getSelectionModel().select(recor);
										}
									});
								}
							});

							//alert(1);
							//rec.expand(false);
							promWin.close();
							//} //if
						}, function (response, opts) {
							if(!errorProcess(response.code)) {
								if(response.code == WaveFaxConst.ResDupFolderName) {
									Ext.Msg.alert('失败', '添加失败！文件夹的名称重复');
								} else {
									Ext.Msg.alert('失败', response.msg);
								}

							}
						}, true);
					} //if text empty
				}
			},{
				text:'取消',
				handler: function() {
					promWin.close();
				}
			}]
		}).show();

	},
	updateStatus: function (hasRec,isLeaf, priAdmin) {
		this.setDisabled(priAdmin?false:true);
	}
});
//改名
Ext.create('WS.address.AddressMenuAction', {
	itemId: 'addressTreeRename',
	text:'重命名',
	tooltip: '重命名',
	iconCls: 'foloderRename',
	disabled: true,
	handler: function (button, event) {
		var rec = addressTree1.getSelectionModel().getSelection()[0];
		var pareNode = rec.parentNode;
		var oName = rec.data.text.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
		//alert(rec.isExpanded());

		promWin = Ext.create('Ext.window.Window', {
			title: '重命名',
			iconCls: 'foloderRename',
			height: 120,
			width: 300,
			modal:true,
			layout: 'auto',
			items:[{
				width:280,
				xtype:'textfield',
				itemId:'txtFname',
				labelWidth:80,
				margin:'15 0 0 5',
				labelAlign:'right',
				fieldLabel:'文件夹名称',
				allowBlank:false,
				blankText:'不能为空',
				value:oName,
				regex: regexFolderName,
				regexText:'文件夹名称不能含有\/?: *"<>|'
			}],
			buttons:[{
				text:'确定',
				handler: function() {
					var txtFname = promWin.down('#txtFname');
					if (txtFname.isValid()) {
						var name = txtFname.getValue();
						//判断是否无变动
						if(oName != name) {
							//调用接口取值
							var param= {
								folderName:name,
								sessiontoken :sessionToken,
								folderId:rec.data.id
							}
							WsCall.call('folderTreeRename', param, function (response, opts) {
								addressTree1.getStore().load({
									node: pareNode,
									callback: function(records, operation, success) {
										if(pareNode.data.id == 'addrRoot') {
											pareNode.collapse();
											pareNode.expand();
										}
										Ext.Array.each(records, function(recor,index,alls) {
											if(recor.data.id == rec.data.id) {
												addressTree1.getSelectionModel().select(recor);
											}
										});
									}
								});
								promWin.close();
							}, function (response, opts) {
								if(!errorProcess(response.code)) {
									if(response.code == WaveFaxConst.ResDupFolderName) {
										Ext.Msg.alert('失败', '重命名失败！文件夹的名称重复');
									} else {
										Ext.Msg.alert('失败', response.msg);
									}

								}
							}, true);
						} else {
							promWin.close();
						}
					} //if text empty
				}
			},{
				text:'取消',
				handler: function() {
					promWin.close();
				}
			}]
		}).show();

	},
	updateStatus: function (hasRec,isLeaf,priAdmin) {
		this.setDisabled(priAdmin?false:true);
	}
});
//删除
Ext.create('WS.address.AddressMenuAction', {
	itemId: 'addressTreeDel',
	text:'删除',
	tooltip: '删除',
	iconCls: 'foloderDel',
	disabled: true,
	handler: function (button, event) {

		newMesB.show({
			title:'删除',
			msg: '确定要删除该文件夹吗？',
			buttons: Ext.MessageBox.YESNO,
			closable:true,
			fn: function(btn) {
				if (btn =="yes") {
					var rec = addressTree1.getSelectionModel().getSelection()[0];
					var pareNode = rec.parentNode;
					//调用接口取值
					var param= {
						sessiontoken :sessionToken,
						folderId:rec.data.id
					}
					WsCall.call('folderTreeDel', param, function (response, opts) {
						Ext.Msg.alert('成功', '删除成功');
						addressTree1.getStore().load({
							node: pareNode,
							callback: function(records, operation, success) {
								if(pareNode.data.id == 'addrRoot') {
									pareNode.collapse();
									pareNode.expand();
								}
								if(records.length == 0){									
									pareNode.data.leaf = true;
									pareNode.data.iconCls = 'leafFolder';
								}
							}
						});
						addressTree1.getSelectionModel().select(pareNode, true);
						//pareNode.parentNode.expand(false);
					}, function (response, opts) {
						if(!errorProcess(response.code)) {
							Ext.Msg.alert('删除失败', response.msg);
						}
					}, true);
				}
			},
			icon: Ext.MessageBox.QUESTION
		});

	},
	updateStatus: function (hasRec,isLeaf,priAdmin) {
		this.setDisabled((!hasRec && isLeaf && priAdmin)?false:true);
	}
});
//刷新
Ext.create('WS.address.AddressMenuAction', {
	itemId: 'addressTreeRefr',
	text:'刷新',
	tooltip: '刷新',
	iconCls: 'foloderRefresh',
	disabled: false,
	handler: function (button, event) {
		var rec = addressTree1.getSelectionModel().getSelection()[0];
		addressTree1.getStore().load({
			node: rec,
			callback: function(records, operation, success) {
				rec.collapse();
				rec.expand();
			}
		})
	},
	updateStatus: function (hasRec,isLeaf) {
		this.setDisabled(false);
	}
});

//创建一个上下文菜单
var addressTree_RightMenu = Ext.create('Ext.menu.Menu', {
	items: [ActionBase.getAction('addressTreeAdd'),
	ActionBase.getAction('addressTreeDel'),
	ActionBase.getAction('addressTreeRename'),
	ActionBase.getAction('addressTreeRefr')]
});

//通讯录树ToolBar tbFolderTree
// Ext.define('ws.address.tbAddressTree', {
// alias: 'widget.tbAddressTree',
// extend: 'Ext.toolbar.Toolbar',
// alternateClassName: ['tbAddressTree'],
// itemId: 'tbAddressTree',
// frame: false,
// border: '0 0 0 0',
// items: [{
// xtype: 'button',
// //text: "添加",
// itemId: 'addressTreeAdd',
// tooltip: '添加',
// disabled: true,
// iconCls: 'foloderAdd',
// handler: function () {
// Ext.Msg.alert('', '添加');
// }
// }, {
// xtype: 'button',
// //text: "删除",
// itemId: 'addressTreeDel',
// disabled: true,
// tooltip: '删除',
// iconCls: 'foloderDel',
// handler: function () {
// Ext.Msg.alert('', '删除');
// }
// }, {
// xtype: 'button',
// //text: "重命名",
// itemId: 'addressTreeRename',
// tooltip: '重命名',
// disabled: true,
// iconCls: 'foloderRename',
// handler: function () {
// Ext.Msg.alert('', '重命名');
// }
// }, {
// xtype: 'button',
// //text: "刷新",
// itemId: 'addressTreeRefresh',
// tooltip: '刷新',
// iconCls: 'foloderRefresh',
// handler: function () {
// var mainForm = Ext.getCmp('viewPortEast');
// var adreeTree = mainForm.getComponent('westView').getComponent('addressTree');
// adreeTree.getStore().load({ node: adreeTree.getSelectionModel().getSelection()[0] });
// }
//
// }]
// });
function allowDrop(record) {
	var treeSel = addressTree1.getSelectionModel().getSelection()[0];
	// 如果是本节点
	if (treeSel.data.id == record.data.id) {
		return false;
	}
	var isPub = false;
	var isPerson = false;
	if(treeSel.data.id.indexOf('grad') != -1 || treeSel.data.id == WaveFaxConst.RootFolderID) {
		isPerson = true;
	} else {
		isPub = true;
	}
	if(!isPub && !isPerson) {
		return false;
	}
	//共享
	if(isPub) {
		if(record.data.id.indexOf('grad') == -1) {
			return true;
		}
	}
	//个人
	if(isPerson) {
		if(record.data.id.indexOf('grad') != -1 || record.data.id == WaveFaxConst.RootFolderID) {
			return true;
		}
	}
}

//通讯录addressTree类
Ext.define('ws.address.addressTree', {
	alias: 'widget.addressTree',
	itemId: 'addressTree',
	title: '通讯录',
	iconCls: 'addressTitle',
	extend: 'Ext.tree.Panel',
	alternateClassName: ['addressTree'],
	store: 'addrTreeStoreId',
	//width: 400,
	//height: 600,
	rootVisible: false,
	frame: false,
	frameHeader: false,
	border: false,
	//fbar:[{xtype: 'tbAddressTree'}],
	listeners: {
		// deselect:function(rolModel,record,index,eOpts){
			// addtmpItem = record;
		// },
		load: function(store,records,models,suc,opts) {

			if(!models || models.length<=0)
				return;

			Ext.Array.each(models, function(item,index,alls) {
				var interStr = addrTreeInter(item.data.id);
				if(interStr != '') {
					item.data.text = interStr;
				}
				// if(addtmpItem) {
// 					
				// } else {
					// if(index == 0) {
						// addtmpItem = item;
					// }
				// }

			});
			// if(!addressTree1.getSelectionModel().hasSelection() && !addressTree1.collapsed  && addtmpItem) {
				// (new Ext.util.DelayedTask()).delay(50, function() {
					// addressTree1.getSelectionModel().select(addtmpItem, true);					
				// });
			// }
		},		
		expand:function(tree, opts) {
			var mainForm = Ext.getCmp('viewPortEast');
			hideLinkPal();
			var btnPngTab= mainForm.down('#btnPng');
			btnPngTab.setText('传真图');
			var btnWorkFlow = mainForm.down('#btnWorkFlow');
			btnWorkFlow.hide();
			setReadFlagTask.cancel();
			accordionTask.cancel();
			var mainForm = Ext.getCmp('viewPortEast');
			var btnCancel = mainForm.down('#btnCancel');
			var btnContinue = mainForm.down('#btnContinue');
			if(runner) {
				ifLoading = 0;
				runner.stopAll();
				runner = new Ext.util.TaskRunner();
				btnCancel.hide();
			}			
			accordionTask.delay(50, function() {
				//addtmpItem = '';
				tree.fireEvent("selectionchange", tree.getView(), tree.getSelectionModel().getSelection());
				if(!addressTree1.getSelectionModel().hasSelection()) {
					addressTree1.getSelectionModel().select(0, true);
				}

			});
			//保存状态
			//保存变量并上传
			var me = this;
			myStates.currtree.name = me.itemId;
			var tmpS = myStates.currtree;
			wsUserStates.setServerState('currtree',tmpS);
		},
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			addressTree1.getSelectionModel().select(rec);
			addressTree_RightMenu.showAt(e.getXY());

		}
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		me.on('render', function() {

			var overItemHandle = function(view, record) {
				me.activeRecord = record;
			};
			me.dropZone = Ext.create('Ext.dd.DropTarget', me.body.dom, {
				ddGroup : 'FileDDGp1',
				notifyEnter : function(ddSource, e, data) {
					me.activeRecord = null;
					me.on('itemmouseenter', overItemHandle);
					me.body.stopAnimation();
					me.body.highlight();
					this.callParent(arguments);
				},
				notifyOut : function(ddSource, e, data) {
					me.activeRecord = null;
					me.un('itemmouseenter', overItemHandle);
					this.callParent(arguments);
				},
				notifyOver : function(ddSource, e, data) {
					if (me.activeRecord != null) {
						if (allowDrop(me.activeRecord)) {
							return Ext.dd.DropTarget.prototype.dropAllowed;
						} else {
							return Ext.dd.DropTarget.prototype.dropNotAllowed;
						}
					} else {
						return Ext.dd.DropTarget.prototype.dropNotAllowed;
					}
				},
				notifyDrop : function(ddSource, e, data) {
					if (me.activeRecord != null) {
						if (allowDrop(me.activeRecord)) {
							var treeRcd = me.activeRecord;
							me.un('itemmouseenter', overItemHandle);
							var sel = ddSource.dragData.records;
							if (sel.length == 0 || !treeRcd)
								return false;
							var faxids = new Array();
							Ext.Array.each(data.records, function(rec, index,
							allrec) {
								faxids.push(rec.data.phoneBookID);
							});
							// 调用接口取值
							var param = {
								ids : faxids.join(),
								sessiontoken : sessionToken,
								folderId : me.activeRecord.data.id
							}
							var tarRec = me.activeRecord;
							if (getCurrGrid().privData.folderPrivMove == 0) {
								Ext.Msg.alert('失败', '不具有移动文档的权限');
								me.activeRecord = null;
								return true;
							}
							// 调用
							WsCall.call('movePhoneBook', param, function(
							response, opts) {

								var tbStore = getCurrGrid().getStore();
								tbStore.remove(data.records);
							}, function(response, opts) {
								if (!errorProcess(response.code)) {
									Ext.Msg.alert('失败', response.msg);
								}
							}, true);
						}
						me.activeRecord = null;
						return true;
					}
					return false;
				}
			});
		});
	}
});