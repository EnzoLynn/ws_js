Ext.create('Ext.data.Store', {
	storeId: 'doctofaxType',
	fields: ['dftId', 'dftName'],
	data : [{
		'dftId': '0',
		'dftName':'不合并'
	},{
		'dftId': '1',
		'dftName':'合成为一个文件'
	}]
});

//通讯录树Model
Ext.define('faxtodocwinTree_Model', {
	extend: 'Ext.data.Model',
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

//通讯录窗口addressTree类
Ext.define('ws.docmanager.faxtodocwinTree', {
	alias: 'widget.faxtodocwinTree',
	//itemId: 'faxtodocwinTree',
	iconCls: 'docTreeTitle',
	extend: 'Ext.tree.Panel',
	alternateClassName: ['faxtodocwinTree'],
	//store: 'addresspersonwinTree_store',
	animate:false,
	width: 400,
	height: 400,
	rootVisible: false,
	frame: false,
	frameHeader: false,
	border: true
});

function loadfaxtodocwin(issingle,privData) {
	return Ext.create('Ext.window.Window', {
		title:'归档',
		iconCls:'faxtodoc',
		modal:true,
		width:550,
		resizable:false,
		height:350,
		defaults: {
			xtype:'textfield',
			labelAlign: 'right',
			labelWidth:150,
			width:500,
			margin:'4 4 4 4'
		},
		layout: {
			type:'table',
			columns:2
		},
		listeners: {
			beforedestroy: function(win,opts) {

				var fileid = win.down('#hidfileid').getValue();
				if(fileid != '') {
					var param1 = {};
					param1.fileId = fileid;
					param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
					//调用
					WsCall.call('deleteTempFiles', param1, function (response, opts) {
					}, function (response, opts) {
					}, true);
				}
				if(faxtodoceditor != '') {
					faxtodoceditor.destroy();
					faxtodoceditor = '';
				}

			},
			destroy: function () {
				faxtodocwin = '';
				if (faxtodocwinTree1 != '') {
					faxtodocwinTree1.destroy();
				}
				faxtodocwinTree1 = '';
				docTreeLoading = 0;
				Ext.StoreMgr.removeAtKey ('faxtodocwinTree_store');
			},
			afterrender: function (win, opts) {
				var sels = currGrid.getSelectionModel().getSelection();
				if(sels && sels.length > 1) {
					win.down('#editorFile').setDisabled(true);
				}

				win.getEl().on('click', function () {
					if (faxtodocwinTree1 != '') {
						faxtodocwinTree1.destroy();
					}
					faxtodocwinTree1 = '';
					docTreeLoading = 0;

				});
				var header = win.header;

				header.getEl().on('mousedown', function () {

					if (faxtodocwinTree1 != '') {
						faxtodocwinTree1.destroy();
					}
					faxtodocwinTree1 = '';
					docTreeLoading = 0;

				});
			}
		},
		items:[{
			fieldLabel: '自定义编号',
			itemId:'customid',
			width:300
		},{
			xtype:'checkbox',
			boxLabel: '自动编号',
			itemId:'autoid',
			width:150
		},{
			fieldLabel: '关键字',
			itemId:'keyword',
			colspan:2
		},{
			fieldLabel: '参考归档文件ID',
			colspan:2,
			itemId:'refdocid',
			regex:regexNumber,
			regexText:'参考归档文件ID必须为数字'
		},{
			fieldLabel: '归档目录',
			itemId: 'todocfolder',
			xtype: 'triggerfield',
			value: '个人',
			colspan:2,
			onTriggerClick: function () {
				var me = this;
				var win = me.up('window');

				if(docTreeLoading == 0) {
					var task = new Ext.util.DelayedTask( function () {
						docTreeLoading = 1;

						var position = win.down('#todocfolder').getEl().getXY();

						Ext.StoreMgr.removeAtKey ('faxtodocwinTree_store');
						//通讯录树Store
						Ext.create('Ext.data.TreeStore', {
							model: 'faxtodocwinTree_Model',
							storeId: 'faxtodocwinTree_store',
							//defaultRootId: 'addrRoot',
							//autoLoad:false,
							proxy: {
								type: 'ajax',
								url: WsConf.Url,
								extraParams: {
									req: 'treenodes',
									treename: 'doctree',
									restype: 'json'

								},
								reader : {
									type : 'json',
									root: 'treeset',
									seccessProperty: 'success',
									messageProperty: 'msg'
								},
								actionMethods: 'POST'
							},
							root: {
								expanded: false,
								text: "文档管理",
								iconCls: 'fax'
							},

							listeners: {
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

									});
								}
							}
						});
						var extraP = Ext.StoreMgr.lookup('faxtodocwinTree_store').getProxy().extraParams;
						extraP.sessiontoken = Ext.util.Cookies.get("sessiontoken");
						extraP.isArchive = true;	//是否为归档
						if (faxtodocwinTree1 == '') {

							faxtodocwinTree1 = Ext.create('faxtodocwinTree', {
								store: 'faxtodocwinTree_store',
								floating: true,
								preventHeader: true,
								style: {
									'left': position[0] + 155,
									'top': position[1] + 22
								},
								hidden: true,
								width: 345,
								height: 200
							});
						}

						faxtodocwinTree1.show(null, function () {
							faxtodocwinTree1.setPagePosition(position[0] + 155, position[1] + 22);
						});
						faxtodocwinTree1.un("selectionchange");
						faxtodocwinTree1.on("selectionchange", function (view, seles, op) {
							if(seles[0] && seles[0].data.id == 'grsc') {
								Ext.Msg.alert('消息','不能归档到该目录');
								return;
							}

							var depth1 = seles[0].getDepth();
							var parentRoot1 = seles[0].parentNode;
							var strReverse = new Array();
							for (var i = 1; i < depth1; i++) {
								strReverse.push(parentRoot1.data.text);
								parentRoot1 = parentRoot1.parentNode;
							}
							strReverse = strReverse.reverse();
							if (strReverse.length > 0) {
								me.setValue(strReverse.join("/") + "/" + seles[0].data.text);
							} else {
								me.setValue(seles[0].data.text);
							}

							faxtodocwinTree1.hide();
							win.down('#hidfolderid').setValue(seles[0].data.id);

							//重置状态
							faxtodocwinTree1.destroy();
							faxtodocwinTree1 = '';
							docTreeLoading = 0;
						});
					}).delay(300);
					docTreeLoading = 0;

				} else {
					if (faxtodocwinTree1 != '') {
						faxtodocwinTree1.destroy();
						faxtodocwinTree1 = '';
						docTreeLoading = 0;
					}
				}

			}
		},{
			xtype:'combo',
			fieldLabel: '多文件组合方式',
			itemId:'covertype',
			store:'doctofaxType',
			displayField : 'dftName',
			valueField : 'dftId',
			value:'0',
			queryMode:'local',
			disabled:issingle,
			width:300,
			listeners: {
				change: function(com,nVal,oVal,opts) {
					var me = this;
					var win = me.up('window');
					if(nVal != oVal) {
						if(nVal == '0') {
							win.down('#editorFile').setDisabled(true);
						} else {
							win.down('#editorFile').setDisabled(false);
						}
					}
				}
			}
		},{
			xtype:'button',
			iconCls:'stampEditor',
			text: '编辑归档文件',
			disabled:true,
			itemId:'editorFile'	,
			width:150,
			handler: function() {
				var me = this;
				var win = me.up('window');
				//faxtodoceditor = loadfaxtodoceditor('23048');
				//faxtodoceditor.show();
				//return;
				if(faxtodoceditor == '') {
					var param = {};
					param.fileids = buildFaxIDs(currGrid.getSelectionModel().getSelection(),'faxFileID').join();
					param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
					WsCall.call('faxtodoc', param, function(response, opts) {
						var data = response.data;
						faxtodoceditor = loadfaxtodoceditor(data);
						faxtodoceditor.show(null, function() {
							faxtodoceditor.down('#delAllFile').hide();
						});
						win.down('#hidfileid').setValue(data);
					}, function(response, opts) {
						if(!errorProcess(response.code)) {
							Ext.Msg.alert('失败', response.msg);
						}
					}, true,'加载中...',Ext.getBody(),50);
				} else {
					faxtodoceditor.show();
				}
			}
		},{
			xtype:'textarea',
			fieldLabel: '注释',
			itemId:'comment',
			colspan:2
		},{
			xtype:'checkbox',
			margin:'4 4 4 160',
			width:240,
			boxLabel: '归档后删除原文件',
			disabled:privData.folderPrivDelete==0?true:false,
			itemId:'delSrc',
			colspan:2
		},{
			xtype:'hidden',
			value:'0',
			itemId:'hidfolderid',
			colspan:2
		},{
			xtype:'hidden',
			value:'',
			itemId:'hidfileid',
			colspan:2
		}],
		buttons:[{
			text:'确定',
			handler: function() {
				var me = this;
				var win = me.up('window');
				var converCom =  win.down('#covertype').getValue();

				if(faxtodoceditor && converCom =='1') {
					var hasFile = faxtodoceditor.down('#hidFileId').getValue();
					if(hasFile == '') {
						Ext.Msg.alert('消息','文档页数不能为0');
						return;
					}
				}

				//调用Call 归档
				var param = {};
				var cgrid = currGrid.itemId.toLowerCase();
				var sels = currGrid.getSelectionModel().getSelection();
				param.treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
				param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
				param.covertype = converCom;//0 不合并  1合并

				var fileid = win.down('#hidfileid').getValue();
				if(converCom == '0') {

					var arr = new Array();
					if(cgrid == 'infaxgrid') {
						for(var p in sels) {
							arr.push({
								faxid: sels[p].data.inFaxID,
								fileid: sels[p].data.faxFileID,
								attach: sels[p].data.attach
							});
						}
					}
					if(cgrid == 'succoutfaxgrid') {
						for(var p in sels) {
							arr.push({
								faxid: sels[p].data.outFaxID,
								fileid: sels[p].data.faxFileID,
								attach: sels[p].data.attach
							});
						}
					}
					param.objArr = Ext.JSON.encode(arr);

				} else {
					if(cgrid == 'infaxgrid') {
						param.faxids = buildFaxIDs(sels,'inFaxID').join();
					}
					if(cgrid == 'succoutfaxgrid') {
						param.faxids = buildFaxIDs(sels,'outFaxID').join();
					}
					param.attachIds = buildFaxIDs(sels,'attach').join();
					if(fileid == '') {
						param.fileids =  buildFaxIDs(sels,'faxFileID').join();
					} else {
						param.fileid = fileid;
					}
				}

				param.folderid = win.down('#hidfolderid').getValue();
				param.delSrc = win.down('#delSrc').getValue();
				param.comment = win.down('#comment').getValue();
				param.refdocid = win.down('#refdocid').getValue();
				param.keyword = win.down('#keyword').getValue();
				param.autoid = win.down('#autoid').getValue();
				param.customid = win.down('#customid').getValue();

				WsCall.call('createdoc', param, function(response, opts) {
					faxtodocwin.close();
					if(param.delSrc) {
						currGrid.loadGrid();
					}
				}, function(response, opts) {
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
				}, true,'加载中...',Ext.getBody(),50);
			}
		},{
			text:'取消',
			handler: function() {
				var me = this;
				me.up('window').close();
			}
		}]
	});
}