// 判断是否为可拖放目标 DropTarget
function isDocDropTarget(record) {
	var isPublic = false;
	var isPerson = false;
	

	var treeSel = docTree.getSelectionModel().getSelection()[0];
	// 如果是本节点
	if (treeSel.data.id == record.data.id) {
		return false;
	}

	// 如果当前是回收站 只能使用恢复按钮
	if (treeSel.data.id == WaveFaxConst.PublicRecycleFolderID
	|| treeSel.data.id == WaveFaxConst.RecycleFolderID) {
		return false;
	}

	// 如果当前树的所选择的节点是共享收件箱
	if (treeSel.data.id == WaveFaxConst.PublicRootFolderID
	|| treeSel.data.id == WaveFaxConst.PublicRecycleFolderID) {
		isPublic = true;
	}

	// 如果当前树的所选择的节点是共享收件箱所有的共享目录
	if (treeSel.data.id.indexOf('grdc') == -1
	&& treeSel.data.id != 'gr'
	&& treeSel.data.id != WaveFaxConst.RecycleFolderID
	&& treeSel.data.id != WaveFaxConst.PublicRecycleFolderID) {
		isPublic = true;
	}

	if (treeSel.data.id.indexOf('grdc') != -1) {
		isPerson = true;
	}

	// 如果当前树的所选择的节点是个人目录
	if (treeSel.data.id == 'gr'
	|| treeSel.data.id == WaveFaxConst.RecycleFolderID) {
		isPerson = true;
	}
	

	if (!isPublic && !isPerson) {
		return false;
	}

	if (isPublic) {
		// 共享收件箱 WaveFaxConst.PublicRootFolderID
		if (record.data.id == WaveFaxConst.PublicRootFolderID
		|| record.data.id == WaveFaxConst.PublicRecycleFolderID) {
			return true;
		}
		// 共享收件箱所有的共享目录
		if (record.getDepth() > 1) {
			var depth = record.getDepth();
			var parentRoot = record.parentNode;
			for (var j = 2; j < depth; j++) {
				parentRoot = parentRoot.parentNode;
			}
			if (parentRoot.data.id == WaveFaxConst.PublicRootFolderID) {
				return true;
			}
		}
	}

	if (isPerson) {
		// 个人目录
		if (record.data.id == 'gr'
		|| record.data.id == WaveFaxConst.RecycleFolderID) {
			return true;
		}
		// 个人目录所有的子目录
		if (record.getDepth() > 1) {
			var depth2 = record.getDepth();
			var parentRoot2 = record.parentNode;
			for (var j = 2; j < depth2; j++) {
				parentRoot2 = parentRoot2.parentNode;
			}
			if (parentRoot2.data.id == 'gr') {
				return true;
			}
		}
	}
	

	return false;
}

// 传真树Model
Ext.define('docTree_Model', {
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
	},{
		name : 'linksrc',
		type : 'string'
	}]
});

// 传真树Store

Ext.create('Ext.data.TreeStore', {
	model : 'docTree_Model',
	storeId : 'docTrstoreId',
	//autoLoad: false,
	// clearOnLoad:false,
	proxy : {
		type : 'ajax',
		url : WsConf.Url,
		extraParams : {
			req : 'treenodes',
			treename : 'doctree',
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
		text : '文档管理',
		iconCls : 'fax'
	}
});

// filepngview
Ext.define('ws.docmanager.DocTreeAction', {
	extend : 'WS.action.Base',
	category : 'DocTreeAction'
});
// 添加
Ext.create('ws.docmanager.DocTreeAction', {
	itemId : 'docTreeAdd',
	text : '添加',
	tooltip : '添加',
	iconCls : 'foloderAdd',
	disabled : true,
	handler : function(button, event) {
		var rec = docTree.getSelectionModel().getSelection()[0];
		var pareNode = rec.parentNode;

		promWin = Ext.create('Ext.window.Window', {
			title : '添加',
			height : 120,
			width : 300,
			modal:true,
			iconCls : 'foloderAdd',
			layout : 'auto',
			items : [{
				width : 280,
				xtype : 'textfield',
				itemId : 'txtFname',
				labelWidth : 80,
				margin : '15 0 0 5',
				labelAlign : 'right',
				fieldLabel : '文件夹名称',
				allowBlank : false,
				blankText : '不能为空',
				regex : regexFolderName,
				regexText : '文件夹名称不能含有\/?: *"<>|'
			}],
			buttons : [{
				text : '确定',
				handler : function() {
					var txtFname = promWin.down('#txtFname');
					if (txtFname.isValid()) {
						var name = txtFname.getValue();
						// 调用接口取值
						var param = {
							folderName : name,
							sessiontoken : sessionToken,
							folderId : rec.data.id
						}
						WsCall.call('docTreeAdd', param, function(response,
						opts) {
							var fid = response.data;

							docTree.getStore().getProxy().extraParams.curnode = rec.data.id;
							docTree.getStore().getProxy().extraParams.isexpanded = rec
							.isExpanded();

							docTree.getStore().load({
								node : pareNode,
								callback : function(records, operation, success) {
									if(pareNode.data.id == 'root' || pareNode.data.id == 'gr' || pareNode.data.id == WaveFaxConst.PublicRootFolderID
									|| pareNode.data.id == '0') {
										pareNode.collapse();
										pareNode.expand();
									}

									Ext.Array.each(records, function(recor,
									index, alls) {
										if (recor.data.id == rec.data.id) {
											docTree
											.getSelectionModel()
											.select(recor);
										}
									});
								}
							});
							promWin.close();
						}, function(response, opts) {
							if (!errorProcess(response.code)) {
								if (response.code == WaveFaxConst.ResDupFolderName) {
									Ext.Msg.alert('失败', '添加失败！文件夹的名称重复');
								} else {
									Ext.Msg.alert('失败', response.msg);
								}

							}
						}, true);
					} // if text empty
				}
			},{
				text : '取消',
				handler : function() {
					promWin.close();
				}
			}]
		}).show();

	},
	updateStatus : function(isPerson, isPChildren, hasRec, isLeaf, priAdmin) {
		var docsm = docTree.getSelectionModel();
		if(docsm.hasSelection() && docsm.getSelection()[0].parentNode.data.id != 'grsc') {
			this.show();
			this.setDisabled(((isPerson || isPChildren) && priAdmin)? false : true);
		}else {
			this.hide();
		}
		
	}
});
// 改名
Ext.create('ws.docmanager.DocTreeAction', {
	itemId : 'docTreeRename',
	text : '重命名',
	tooltip : '重命名',
	iconCls : 'foloderRename',
	disabled : true,
	handler : function(button, event) {
		var rec = docTree.getSelectionModel().getSelection()[0];
		var pareNode = rec.parentNode;
		var oName = rec.data.text.replace(/\([^\(\)]+\)/g, '').replace(
		/<[^>]*>/g, '');
		// alert(rec.isExpanded());

		promWin = Ext.create('Ext.window.Window', {
			title : '重命名',
			iconCls : 'foloderRename',
			height : 120,
			width : 300,
			modal:true,
			layout : 'auto',
			items : [{
				width : 280,
				xtype : 'textfield',
				itemId : 'txtFname',
				labelWidth : 80,
				margin : '15 0 0 5',
				labelAlign : 'right',
				fieldLabel : '文件夹名称',
				allowBlank : false,
				blankText : '不能为空',
				value : oName,
				regex : regexFolderName,
				regexText : '文件夹名称不能含有\/?: *"<>|'
			}],
			buttons : [{
				text : '确定',
				handler : function() {
					var txtFname = promWin.down('#txtFname');
					if (txtFname.isValid()) {
						var name = txtFname.getValue();
						//判断是否无变动
						if(oName != name) {
							// 调用接口取值
							var param = {
								folderName : name,
								sessiontoken : sessionToken,
								folderId : rec.data.id
							}
							WsCall.call('folderTreeRename', param, function(
							response, opts) {

								docTree.getStore().load({
									node : pareNode,
									callback : function(records, operation, success) {
										if(pareNode.data.id == 'root' || pareNode.data.id == 'gr' || pareNode.data.id == WaveFaxConst.PublicRootFolderID
										|| pareNode.data.id == '0' ) {
											pareNode.collapse();
											pareNode.expand();
										}
										Ext.Array.each(records, function(recor,
										index, alls) {
											if (recor.data.id == rec.data.id) {
												docTree
												.getSelectionModel()
												.select(recor);
											}
										});
									}
								});

								promWin.close();
							}, function(response, opts) {
								if (!errorProcess(response.code)) {
									if (response.code == WaveFaxConst.ResDupFolderName) {
										Ext.Msg.alert('失败', '重命名失败！文件夹的名称重复');
									} else {
										Ext.Msg.alert('失败', response.msg);
									}

								}
							}, true);
						} else {
							promWin.close();
						}
					} // if text empty
				}
			},{
				text : '取消',
				handler : function() {
					promWin.close();
				}
			}]
		}).show();

	},
	updateStatus : function(isPerson, isPChildren, hasRec, isLeaf, priAdmin) {
		var docsm = docTree.getSelectionModel();
		if(docsm.hasSelection() && docsm.getSelection()[0].parentNode.data.id != 'grsc') {
			this.show();
			this.setDisabled((!isPerson && isPChildren && priAdmin) ? false : true);
		}else {
			this.hide();
		}
		
	}
});
// 删除
Ext.create('ws.docmanager.DocTreeAction', {
	itemId : 'docTreeDel',
	text : '删除',
	tooltip : '删除',
	iconCls : 'foloderDel',
	disabled : true,
	handler : function(button, event) {

		newMesB.show({
			title : '删除',
			msg : '确定要删除该文件夹吗？',
			buttons : Ext.MessageBox.YESNO,
			closable : true,
			fn : function(btn) {
				if (btn == "yes") {
					var rec = docTree.getSelectionModel().getSelection()[0];
					var pareNode = rec.parentNode;
					// 调用接口取值
					var param = {
						sessiontoken : sessionToken,
						folderId : rec.data.id
					}
					WsCall.call('folderTreeDel', param, function(response, opts) {
						Ext.Msg.alert('成功', '删除成功');

						docTree.getStore().load({
							node : pareNode,
							callback: function(records, operation, success) {
								if(pareNode.data.id == 'root' || pareNode.data.id == 'gr' || pareNode.data.id == WaveFaxConst.PublicRootFolderID
								|| pareNode.data.id == '0') {
									pareNode.collapse();
									pareNode.expand();
								}
								if(records.length == 0) {
									pareNode.data.leaf = true;
									pareNode.data.iconCls = 'leafFolder';
								}
							}
						});
						docTree.getSelectionModel().select(pareNode, true);
						// pareNode.parentNode.expand(false);
					}, function(response, opts) {
						if (!errorProcess(response.code)) {
							Ext.Msg.alert('删除失败', response.msg);
						}
					}, true);
				}
			},
			icon : Ext.MessageBox.QUESTION
		});

	},
	updateStatus : function(isPerson, isPChildren, hasRec, isLeaf, priAdmin) {
		var docsm = docTree.getSelectionModel();
		if(docsm.hasSelection() && docsm.getSelection()[0].parentNode.data.id != 'grsc') {
			this.show();
			this.setDisabled((!isPerson && isPChildren && !hasRec && isLeaf && priAdmin)? false: true);
		}else {
			this.hide();
		}
		
	}
});
// 刷新
Ext.create('ws.docmanager.DocTreeAction', {
	itemId : 'docTreeRef',
	text : '刷新',
	tooltip : '刷新',
	iconCls : 'foloderRefresh',
	disabled : false,
	handler : function(button, event) {
		var store = docTree.getStore();
		var rec =  docTree.getSelectionModel().getSelection()[0];
		store.getProxy().extraParams.refresh = 1;
		docTree.getStore().load({
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
// 导出
Ext.create('ws.docmanager.DocTreeAction', {
	itemId : 'docExpRef',
	text : '导出',
	tooltip : '导出',
	iconCls : 'exportICON',
	disabled : false,
	handler : function(button, event) {
		var pub = false;
		var folder = currGrid.getStore().getProxy().extraParams.folderid;
		if (folder.indexOf('gr') == -1
		&& folder != WaveFaxConst.RootFolderID) {
			pub = true;
		}
		var win = Ext.create('WS.infax.ExportReport', {
			grid : currGrid,
			gridType : 'DOCUMENT'
		});
		win.down('#allFolderId').show();
		win.down('#expRecordsId').hide();
		win.show('', function() {
			var items = win.grid.headerCt.items.items;
			var columns = win.down('#selColumnId');
			for (var i = 0; i < items.length; i++) {
				if (items[i].dataIndex != 'version') {
					columns.insert(i, {
						boxLabel : items[i].text,
						name : items[i].dataIndex
					});
				}
			}
			
		});
	},
	updateStatus : function(isPerson, isPChildren, hasRec, isLeaf,priAdmin, priExp) {
		this.setDisabled(!priExp);
	}
});


// 收藏夹
Ext.create('ws.docmanager.DocTreeAction', {
	itemId : 'docStowID',
	text : '收藏',
	tooltip : '添加到收藏夹',
	iconCls : 'favouritesICON',
	disabled : false,
	handler : function(button, event) {
		var curNode = docTree.getSelectionModel().getSelection()[0];
		stowFolderFun(true, curNode.data.id, docTree);
	},
	updateStatus : function(isPerson, isPChildren, hasRec, isLeaf,priAdmin, priExp) {
		if(!currGrid || !currGrid.privData) {
			this.setDisabled(true);
			return;
		}
		var params = currGrid.getStore().getProxy().extraParams;
		if(!params) {
			this.setDisabled(true);
			return;
		}
		var treesm = docTree.getSelectionModel();
		if(treesm.hasSelection && treesm.getSelection()[0].parentNode.data.id == 'grsc') {
			this.hide();
		}else {
			this.show();
			var folderid = currGrid.getStore().getProxy().extraParams.folderid.toString();
			var isPub = folderid != WaveFaxConst.PublicRecycleFolderID
						&& folderid != WaveFaxConst.RecycleFolderID && folderid.indexOf('gr') == -1;
			this.setDisabled(!isPub || currGrid.privData.folderPrivList == 0);
		}
	}
});


// 取消收藏
Ext.create('ws.docmanager.DocTreeAction', {
	itemId : 'docCancelID',
	text : '取消收藏',
	tooltip : '取消收藏',
	iconCls : 'foloderDel',
	disabled : false,
	handler : function(button, event) {
		var currNode = docTree.getSelectionModel().getSelection()[0];
		var nodes = docTree.getSelectionModel().getSelection()[0].parentNode.childNodes;
		var ids = new Array();
		for(var p in nodes) {
			if(nodes[p] != currNode) {
				ids.push(nodes[p].data.id.substring(4, nodes[p].data.id.length));
			}
		}
		stowFolderFun(false, ids.join(), docTree);
		
	},
	updateStatus : function(isPerson, isPChildren, hasRec, isLeaf,priAdmin, priExp) {
		var docsm = docTree.getSelectionModel();
		if(docsm.hasSelection() && docsm.getSelection()[0].parentNode.data.id == 'grsc') {
			this.show();
		}else {
			this.hide();
		}
	}
});

// 创建一个上下文菜单
var docTree_RightMenu = Ext.create('Ext.menu.Menu', {
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
	items : [ActionBase.getAction('docTreeAdd'),
	ActionBase.getAction('docTreeDel'),
	ActionBase.getAction('docTreeRename'),
	ActionBase.getAction('docTreeRef'),
	ActionBase.getAction('docExpRef')
	,ActionBase.getAction('docStowID'),ActionBase.getAction('docCancelID')]
});
// docTree类
Ext.define('ws.docgrid.docTree', {
	alias : 'widget.docTree',
	itemId : 'docTree',
	title : '文档管理',
	iconCls : 'docTreeTitle',
	extend : 'Ext.tree.Panel',
	clearOnLoad: false,
	alternateClassName : ['docTree'],
	store : 'docTrstoreId',
	//width : 400,
	//height : 600,
	rootVisible : false,
	frame : false,
	frameHeader : false,
	border : false,
	listeners : {
		// deselect: function(rolModel,record,index,eOpts) {
			// doctmpItem = record;
		// },		
		load: function(store,records,models,suc,opts) {

			if(!models || models.length<=0)
				return;			
			Ext.Array.each(models, function(item,index,alls) {				
				var interStr = docTreeInter(item.data.id);
				if(interStr != '') {
					item.data.text = interStr;
				} else {
					item.data.text = owerInternational(item.data.text);
				}
				// if(doctmpItem) {
// 
				// } else {
					// if(index == 0) {						
						// doctmpItem = item;
					// }
				// }

			});
			// if(!docTree.getSelectionModel().hasSelection()&& !docTree.collapsed && doctmpItem) {
				// (new Ext.util.DelayedTask()).delay(50, function() {									
					// docTree.getSelectionModel().select(doctmpItem, true);
				// });
			// }
		},
		expand : function(tree, opts) {
			var mainForm = Ext.getCmp('viewPortEast');
			hideLinkPal();
			var btnPngTab= mainForm.down('#btnPng');
			btnPngTab.setText('文档图');
			var btnWorkFlow = mainForm.down('#btnWorkFlow');
			btnWorkFlow.hide();
			setReadFlagTask.cancel();
			accordionTask.cancel();			 
			accordionTask.delay(50, function() {
				//doctmpItem = '';
				tree.fireEvent("selectionchange", tree.getView(), tree.getSelectionModel().getSelection());
				if(!docTree.getSelectionModel().hasSelection()) {
					docTree.getSelectionModel().select(0, true);
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
			docTree.getSelectionModel().select(rec);
			if (rec.data.id == 'gr') {
				docTree_RightMenu.showAt(e.getXY());				
			}
			if (rec.data.id.indexOf('grdc') != -1) {
				docTree_RightMenu.showAt(e.getXY());				
			}
			if (rec.data.id.indexOf('grsc') != -1 && rec.data.id != 'grsc') {
				docTree_RightMenu.showAt(e.getXY());
			}
			
			if (rec.data.id.indexOf('gr') == -1
			&& rec.data.id != WaveFaxConst.PublicRecycleFolderID
			&& rec.data.id != WaveFaxConst.RecycleFolderID) {
				docTree_RightMenu.showAt(e.getXY());
			}
		}
	},
	initComponent : function() {

		var me = this;

		me.callParent(arguments);
		
	
		me.on('render', function() {

			var overItemHandle = function(view, record) {
				me.activeRecord = record;
			};
			// This will make sure we only drop to the view container
			// var formPanelDropTargetEl = me.body.dom;
			me.dropZone = Ext.create('Ext.dd.DropTarget', me.body.dom, {
				ddGroup : 'FileDDGp2',
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
						if (isDocDropTarget(me.activeRecord)) {
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
						if (isDocDropTarget(me.activeRecord)) {
							var treeRcd = me.activeRecord;
							me.un('itemmouseenter', overItemHandle);
							var sel = ddSource.dragData.records;
							if (sel.length == 0 || !treeRcd)
								return false;
							// alert(data.records.length);
							// treeRcd.data.id, data.records move
							var faxids = new Array();
							Ext.Array.each(data.records, function(rec, index,
							allrec) {
								if (rec.data.docID) {
									faxids.push(rec.data.docID);
								}							
							});
							// 调用接口取值
							var param = {
								docIds : faxids.join(),
								sessiontoken : sessionToken,
								folderId : me.activeRecord.data.id
							}

							// 共享 或 个人 回收站
							if (me.activeRecord.data.id == WaveFaxConst.PublicRecycleFolderID
							|| me.activeRecord.data.id == WaveFaxConst.RecycleFolderID) {
								// param.type = "delete";infaxstoreId
								// var tbStore = tb.getStore();
								var tbStore = getCurrGrid().getStore();
								setReadFlagTask.cancel();
								tbStore.remove(data.records);
								
								var extraP = tbStore.getProxy().extraParams;
								extraP.idList = param.docIds;
								// tbStore.totalCount-=data.records.length;
								// tbStore.fireEvent("load",tbStore,tbStore.data.items,true,{});
								tbStore.getProxy().extraParams.toTrash = '0'; // '0'
								// 删除到回收站,'1'彻底删除
								tbStore.sync();

								(new Ext.util.DelayedTask( function() {
										tbStore.load();
									})).delay(500);
								// tb.getStore().load();
							} else {// 共享文件箱
								var tarRec = me.activeRecord;
								// 调用
								if (getCurrGrid().privData.folderPrivMove == 0) {
									Ext.Msg.alert('失败', '不具有移动文档的权限');
									me.activeRecord = null;
									return true;
								}
								WsCall.call('movefax', param, function(
								response, opts) {
									// 刷新对应的Grid
									// var tbStore = tb.getStore();
									var tbStore = getCurrGrid().getStore();
									setReadFlagTask.cancel();
									tbStore.remove(data.records);
									if(!(tarRec.data.id.indexOf('gryf') != -1)) {
										(new Ext.util.DelayedTask( function() {
												var treeSel = docTree
												.getSelectionModel()
												.getSelection()[0];
												getIsReadCount(
												Ext.StoreMgr
												.lookup('docTrstoreId'),
												treeSel.data.id);
												getIsReadCount(
												Ext.StoreMgr
												.lookup('docTrstoreId'),
												tarRec.data.id);
											})).delay(500);
									}

								}, function(response, opts) {
									if (!errorProcess(response.code)) {
										Ext.Msg.alert('失败', response.msg);
									}
								}, true);
							}
							me.activeRecord = null;

							return true;

						}
					}
					return false;
				}
			});
		});
	}
});