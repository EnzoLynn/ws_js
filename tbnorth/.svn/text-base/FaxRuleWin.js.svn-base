ruleSettingFlag = false;
var ruleNameArr = new Array('呼叫者标识', 'CSID', '传真页数', '传真标签', '收件人号码', '主题', '发送状态', '错误码', '收件人', '收件人组织','表单数据');
var ruleActionArr = new Array('路由到目录', '删除', '修改标签', '转发传真', '修改注释', '停止处理其它规则', '打印传真文件', '表单数据');
var ruleUserWin = '';	//呼叫者标识窗口
var ruleAddrEdit;		//外部联系人rowedit
var outLinkStoreCop = new Array();	//记录没有添加之前外部联系人store中的faxNumber
var addrRuleTreeWin ='';	//通讯录树
var addrRuleTreeLoading = 0;
var ruleShowWin = '';	//添加修改规则窗口
var ruleCAMap = new Ext.util.HashMap();	//存放规则内容或规则动作参数的变量 'con'--内容  'act'--动作
//0 删除到回收站,1 彻底删除
//0 发送成功， 1 发送失败

//规则model
Ext.define('WS.tbnorth.RuleModel', {
	extend: 'Ext.data.Model',
	idProperty: 'ruleName',
	alternateClassName: ['RuleModel'],
	fields: [{
		name: 'ruleName',
		type: 'string'
	},{
		name: 'rcType',
		type: 'string'
	},{
		name: 'ruleContext',
		type: 'string'
	},{
		name: 'used',
		type: 'boolean'
	},{
		name: 'ruleAction',
		type: 'string'
	}]
});
//规则gridstore
Ext.create('Ext.data.ArrayStore', {
	model: 'WS.tbnorth.RuleModel',
	storeId: 'ruleStoreId'
});

//导入导出window
Ext.define('WS.tbnorth.ImportRuleWin', {
	extend: 'Ext.window.Window',
	height: 135,
	width: 200,
	title: '导入' + '/' + '导出',
	bodyCls: 'panelFormBg',
	border: false,
	resizable: false,		//窗口大小不能调整
	modal: true,   //设置window为模态
	listeners : {
		show: function() {
			this.down('form').getForm().reset();
		}
	},
	items:[{
		xtype: 'form',
		border: false,
		bodyCls: 'panelFormBg',
		height: 125,
		width: 190,
		layout: 'vbox',
		defaults: {
			margin: '8 10 2 10',
			width: 150,
			xtype: 'button'
		},
		items : [{
			text: '导出规则',
			iconCls : 'exportICON',
			handler: function () {
				var win = this.up('window');
				var inRuleG = win.grid.getStore().data.items;
				if(inRuleG.length > 0) {
					var val = new Array();
					for(var p in inRuleG) {
						val.push(inRuleG[p].data);
					}
					var ruleConfig = Ext.JSON.encode(val);
					var param = {
						downType: 'ruleConfig',
						ruleConfig: ruleConfig,
						sessiontoken: getSessionToken()
					}
					WsCall.downloadFile('download', param);
					win.close();
				}
			}
		},{
			xtype: 'filefield',
			buttonOnly: true,
			buttonConfig: {
				width: 150,
				iconCls: 'importAddrICON'
			},
			name: 'ruleF',
			buttonText : '导入规则',
			listeners : {
				change : function(me, val, op) {
					var win = this.up('window');
					var fType = val.substring(val.lastIndexOf('.') + 1,val.length);
					if (fType != 'xml') {
						Ext.Msg.alert('错误', '请选择xml文件');
						return;
					}
					var f = me.up('form');
					var form = f.getForm();
					urlStr = WsConf.Url+ "?req=call&callname=impRuleCon&sessiontoken="
					+ getSessionToken();
					form.submit({
						url: urlStr,
						waitMsg : '正在上传...',
						waitTitle : '等待文件上传,请稍候...',
						success: function(fp, o) {
							if(o.result.data.length > 0) {
								var records = Ext.JSON.decode(o.result.data);
								win.grid.getStore().add(records);
							}
							win.close();
						},
						failure: function(fp, o) {
							if (!errorProcess(o.result.code)) {
								Ext.Msg.alert('失败', o.result.msg);
							}
						}
					});

				}
			}
		},{
			margin: '8 0 0 100',
			width: 60,
			text: '取消',
			handler: function() {
				this.up('window').close();
			}
		}]
	}]
});

//规则grid
Ext.define('WS.tbnorth.Rulegrid', {
	alternateClassName: ['Rulegrid'],
	alias: 'widget.Rulegrid',
	extend: 'Ext.grid.Panel',
	store: 'ruleStoreId',
	height: 350,
	columnLines: true,
	multiSelect: true,
	viewConfig: {
		loadingText:'正在加载数据...'
	},
	columns : [{
		text: '规则类别',
		dataIndex: 'ruleName'
	},{
		text: '类型',
		dataIndex: 'rcType',
		width: 80
	},{
		text: '规则内容',
		dataIndex: 'ruleContext',
		renderer: function(value) {
			var arr = value.split(';');
			var val = '';
			for(var p in arr) {
				var rule = arr[p].split('_');
				if(val.length > 0) {
					val += '<br/>' + ruleNameArr[rule[0]];
				} else {
					val += ruleNameArr[rule[0]];
				}
			}
			return val;
		},
		flex: 0.5
	},{
		text: '启用',
		dataIndex : 'used',
		width: 50,
		xtype: 'checkcolumn'
	},{
		text: '规则动作',
		dataIndex: 'ruleAction',
		flex: 0.5,
		renderer: function(value) {
			var arr = value.split(';');
			var val = '';
			for(var p in arr) {
				var rule = arr[p].split('_');
				if(val.length > 0) {
					val += '<br/>' + ruleActionArr[rule[0]];
				} else {
					val += ruleActionArr[rule[0]];
				}
			}
			return val;
		}
	}],
	tbar: [{
		text: '新建',
		iconCls:'imgBtnAdd',
		menu: [{
			text: '新建收件箱规则',
			handler: function () {
				var gridP = systemconfigwin_rule.down('#inRuleGridId');
				gridP.gridType = 'INFAX';
				loadRuleShowWin(gridP, 'create')
			}
		},{
			text: '新建已发件箱规则',
			handler: function () {
				var gridP = systemconfigwin_rule.down('#inRuleGridId');
				gridP.gridType = 'OUTFAX';
				loadRuleShowWin(gridP, 'create')
			}
		}]
	}, '-',{
		text: '修改',
		iconCls:'faxRuleICON',
		handler: function () {
			var panel = this.up('Rulegrid');
			var sm = panel.getSelectionModel();
			if(sm.hasSelection() && sm.getSelection().length == 1) {
				panel.gridType = sm.getSelection()[0].get('rcType');
				loadRuleShowWin(panel, 'update', sm);
			}
		}
	}, '-',{
		text: '删除',
		iconCls:'imgBtnDel',
		handler: function () {
			var panel = this.up('Rulegrid');
			var sm = panel.getSelectionModel();
			if(sm.hasSelection() && sm.getSelection().length > 0) {
				Ext.Msg.confirm('提示', '您确认要删除规则', function(btn) {
					if (btn == 'yes') {
						panel.getStore().remove(sm.getSelection());
					}
				});
			}
		}
	}, '-',{
		text: '导入' + '/' + '导出',
		handler: function() {
			var position = this.getEl().getXY();
			var win = Ext.create('WS.tbnorth.ImportRuleWin', {
				grid: this.up('Rulegrid'),
				floating: true,
				preventHeader: true
			});
			win.show(null, function () {
				win.setPagePosition(position[0], position[1]+20);
			});
		}
	}]
});

//循环根节点的所有子节点 除选中的本身外均设为未选中
function findchildnode(node, self) {
	var childnodes = node.childNodes;
	if(childnodes) {
		for (var i = 0; i < childnodes.length; i++) {
			var rootnode = childnodes[i];
			if(self != rootnode) {
				rootnode.set('checked', false);
			}
			if (rootnode.childNodes.length > 0) {
				findchildnode(rootnode, self);
			}
		}
	}
}

//收件箱目录树panel
Ext.define('WS.tbnorth.personalTree', {
	alias: 'widget.personalTree',
	extend: 'Ext.tree.Panel',
	animate:false,
	store: 'personStoreID',
	rootVisible: true,
	border: true,
	width: 400,
	height: 290,
	listeners: {
		checkchange: function(node, checked, op) {
			if(checked) {
				var roonodes = this.getRootNode();
				findchildnode(roonodes, node);
			}
		}
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}
});

//已发件箱目录树panel
Ext.define('WS.tbnorth.SucTree', {
	alias: 'widget.sucTree',
	extend: 'Ext.tree.Panel',
	animate:false,
	store: 'sucStoreID',
	rootVisible: true,
	border: true,
	width: 400,
	height: 290,
	listeners: {
		checkchange: function(node, checked, op) {
			if(checked) {
				var roonodes = this.getRootNode();
				findchildnode(roonodes, node);
			}
		}
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}
});

//目录树window
Ext.define('WS.tbnorth.folderTreeWin', {
	extend: 'Ext.window.Window',
	title: '选择路由目录',
	height: 350,
	width: 410,
	iconCls: 'faxRuleICON',
	bodyCls: 'panelFormBg',
	border: false,
	resizable: false,		//窗口大小不能调整
	modal: true,   //设置window为模态
	buttons: [{
		text: '确定',
		handler: function() {
			var win = this.up('window');
			var records = win.down('treepanel').getChecked();
			if(records.length > 0) {
				if(records.length == 1) {
					var val = linkViewTitle(records, true);
					win.ruleWin.down('#inFolderLabId').setValue(val.length > 20 ? val.substring(0,20)+"...":val);
					ruleCAMap.add('act0', records[0].get('id'));
					win.close();
				} else {
					Ext.Msg.alert('错误', '只能选择一个路由目录');
				}
			}
		}
	},{
		text: '取消',
		handler: function() {
			var me = this;
			me.up('window').close();
		}
	}]
});

//加载目录树window
function loadPerFolderWin(win) {
	var selId = '';
	if(ruleCAMap.containsKey('act0')) {
		selId = ruleCAMap.get('act0').split(',')[1];
	}

	if(win.grid.gridType == 'INFAX') {
		//收件箱目录树store
		Ext.StoreMgr.removeAtKey ('personStoreID');
		Ext.create('Ext.data.TreeStore', {
			model: 'directoryTree_Model',
			defaultRootId: WaveFaxConst.RootFolderID,
			storeId: 'personStoreID',
			//autoLoad:false,
			proxy: {
				type: 'ajax',
				url: WsConf.Url,
				extraParams: {
					req: 'treenodes',
					treename: 'foldertree',
					restype: 'json',
					sessiontoken:Ext.util.Cookies.get("sessiontoken"),
					needcheck:true,
					needExpaned: true,
					selId: selId
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
				expanded: true,
				text: "收件箱",
				iconCls: 'inBox'
			},
			listeners: {
				load: function(store,records,models,suc,opts) {
					if(!models || models.length<=0)
						return;
					Ext.Array.each(models, function(item,index,alls) {
						var interStr = treeInternational(item.data.id);
						if(interStr != '') {
							item.set('text', interStr);
						}
					});
				}
			}
		});
		Ext.create('WS.tbnorth.folderTreeWin', {
			ruleWin: win,
			items:[{
				xtype: 'personalTree',
				itemId: 'inFolderID'
			}]
		}).show();
	} else {
		//已发件箱目录树store
		Ext.StoreMgr.removeAtKey ('sucStoreID');
		Ext.create('Ext.data.TreeStore', {
			model: 'directoryTree_Model',
			defaultRootId: 'gryfjx',
			storeId: 'sucStoreID',
			//autoLoad:false,
			proxy: {
				type: 'ajax',
				url: WsConf.Url,
				extraParams: {
					req: 'treenodes',
					treename: 'foldertree',
					restype: 'json',
					sessiontoken:Ext.util.Cookies.get("sessiontoken"),
					needcheck:true,
					needExpaned: true,
					selId: selId
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
				expanded: true,
				text: "已发件箱",
				iconCls: 'sent'
			},
			listeners: {
				load: function(store,records,models,suc,opts) {
					if(!models || models.length<=0)
						return;
					Ext.Array.each(models, function(item,index,alls) {
						var interStr = treeInternational(item.data.id);
						if(interStr != '') {
							item.set('text', interStr);
						}
					});
				}
			}
		});
		Ext.create('WS.tbnorth.folderTreeWin', {
			ruleWin: win,
			items:[{
				xtype: 'sucTree',
				itemId: 'inFolderID'
			}]
		}).show();
	}
}

//修改规则时将加载record
function loadRecordUpdate(type, sm) {
	var record = sm.getSelection()[0];
	var ruleCon = record.get('ruleContext');
	var ruleAct = record.get('ruleAction');
	ruleShowWin.down('#ruleNameId').setValue(record.get('ruleName'));
	var conArr = ruleCon.split(';');
	for(var p in conArr) {
		var conArray = conArr[p].split('_');
		ruleCAMap.add('con' + conArray[0], conArray[1]);
		ruleShowWin.down('#ruleConID' + conArray[0]).setValue(true);
		if(conArray[0] == 2) {
			var pageA = conArray[1].split(',');
			var flag = pageA.length < 2 ? true : false;

			ruleShowWin.down('#pageStartID').setValue(flag ? 0 : pageA[0]);
			ruleShowWin.down('#pageEnd').setValue(flag ? 1 : pageA[1]);
			if(flag) {
				ruleCAMap.add('con2', '0,1');
			}
		} else if(conArray[0] == 3) {
			ruleShowWin.down('#ruleFaxFlagID').setValue(conArray[1]);
		} else if(conArray[0] == 10 && conArr[p].length > 0) {//设置模板数据
			ruleCAMap.add('con' + conArray[0], conArr[p].substring(conArr[p].indexOf('_') + 1, conArr[p].length));
		}
		if(type == 'INFAX') {
			if(conArray[0] == 0) {
				ruleShowWin.down('#callIDid').setValue(conArray[1]);
			} else if(conArray[0] == 1) {
				ruleShowWin.down('#csidConID').setValue(conArray[1]);
			}
		} else {
			if(conArray[0] == 4) {
				ruleShowWin.down('#faxNumberID').setValue(conArray[1]);
			} else if(conArray[0] == 8) {
				ruleShowWin.down('#recipientID').setValue(conArray[1]);
			} else if(conArray[0] == 9) {
				ruleShowWin.down('#orgnizationID').setValue(conArray[1]);
			} else if(conArray[0] == 5) {
				ruleShowWin.down('#subjConID').setValue(conArray[1]);
			} else if(conArray[0] == 6) {
				conArray[1]==0 ? ruleShowWin.down('#stateSucID').setValue(true) : ruleShowWin.down('#stateFailID').setValue(true);
			} else if(conArray[0] == 7) {
				ruleShowWin.down('#ruleErrID').setValue(conArray[1]);
			}
		}
	}

	var actArr = ruleAct.split(';');
	for(var p in actArr) {
		var actArray = actArr[p].split('_');
		ruleCAMap.add('act' + actArray[0], actArray[1]);
		ruleShowWin.down('#ruleAct' + actArray[0]).setValue(true);
		if(actArray[0] == 1) {
			actArray[1]==0 ? ruleShowWin.down('#delFaxId').setValue(true) : ruleShowWin.down('#delAllFaxId').setValue(true);
		} else if(actArray[0] == 2) {
			ruleShowWin.down('#ruleModFaxFlagID').setValue(actArray[1]);
		} else if(actArray[0] == 4) {
			ruleShowWin.down('#modCommID').setValue(actArray[1]);
		} else if(actArray[0] == 7 && actArr[p].length > 0) {//设置模板数据
			ruleCAMap.add('act' + actArray[0], actArr[p].substring(actArr[p].indexOf('_') + 1, actArr[p].length));
		}
	}
}

//加载新建 修改规则窗口
function loadRuleShowWin(gridP, action, sm) {
	if(ruleShowWin == '') {
		ruleShowWin = Ext.create('WS.tbnorth.FaxRuleWin');
	}
	var form = ruleShowWin.down('#formID').getForm();
	form.reset();

	ruleShowWin.show('', function() {
		if(onTemplateJs && (!serverInfoDis && serverInfoModel&&serverInfoModel.data.formData == 1)) {
			ruleShowWin.down('#ruleConID10').hidden = true;
			ruleShowWin.down('#tempParamConID').hidden = true;
			ruleShowWin.down('#tempParamActID').hidden = true;
			ruleShowWin.down('#ruleAct7').hidden = true;
		}
		if(gridP.gridType == 'INFAX') {
			ruleShowWin.down('#ruleConID4').el.setVisible(false);
			ruleShowWin.down('#faxNumberID').el.setVisible(false);
			ruleShowWin.down('#labelID2').el.setVisible(false);

			ruleShowWin.down('#ruleConID8').el.setVisible(false);
			ruleShowWin.down('#recipientID').el.setVisible(false);
			ruleShowWin.down('#labelID3').el.setVisible(false);

			ruleShowWin.down('#ruleConID9').el.setVisible(false);
			ruleShowWin.down('#orgnizationID').el.setVisible(false);
			ruleShowWin.down('#labelID4').el.setVisible(false);

			ruleShowWin.down('#ruleConID5').el.setVisible(false);
			ruleShowWin.down('#subjConID').el.setVisible(false);
			ruleShowWin.down('#subjLabID').el.setVisible(false);

			ruleShowWin.down('#ruleConID6').el.setVisible(false);
			ruleShowWin.down('#stateSucID').el.setVisible(false);
			ruleShowWin.down('#stateFailID').el.setVisible(false);

			ruleShowWin.down('#ruleConID7').el.setVisible(false);
			ruleShowWin.down('#ruleErrID').el.setVisible(false);

			ruleShowWin.down('#ruleConID0').el.setVisible(true);
			ruleShowWin.down('#callIDid').el.setVisible(true);
			ruleShowWin.down('#labelID1').el.setVisible(true);

			ruleShowWin.down('#ruleConID1').el.setVisible(true);
			ruleShowWin.down('#csidConID').el.setVisible(true);
			ruleShowWin.down('#csidLabID').el.setVisible(true);

			ruleShowWin.down('#ruleAct3').el.setVisible(true);
			ruleShowWin.down('#forWardButtId').el.setVisible(true);
			ruleShowWin.down('#forwardFaxID').el.setVisible(true);
			if(action == 'update') {
				ruleShowWin.setTitle('收件箱:修改规则');
				loadRecordUpdate('INFAX', sm);
			} else {
				ruleShowWin.setTitle('收件箱:新建规则');
			}
		} else {
			ruleShowWin.down('#ruleConID4').el.setVisible(true);
			ruleShowWin.down('#faxNumberID').el.setVisible(true);
			ruleShowWin.down('#labelID2').el.setVisible(true);

			ruleShowWin.down('#ruleConID8').el.setVisible(true);
			ruleShowWin.down('#recipientID').el.setVisible(true);
			ruleShowWin.down('#labelID3').el.setVisible(true);

			ruleShowWin.down('#ruleConID9').el.setVisible(true);
			ruleShowWin.down('#orgnizationID').el.setVisible(true);
			ruleShowWin.down('#labelID4').el.setVisible(true);

			ruleShowWin.down('#ruleConID5').el.setVisible(true);
			ruleShowWin.down('#subjConID').el.setVisible(true);
			ruleShowWin.down('#subjLabID').el.setVisible(true);

			ruleShowWin.down('#ruleConID6').el.setVisible(true);
			ruleShowWin.down('#stateSucID').el.setVisible(true);
			ruleShowWin.down('#stateFailID').el.setVisible(true);

			ruleShowWin.down('#ruleConID7').el.setVisible(true);
			ruleShowWin.down('#ruleErrID').el.setVisible(true);

			ruleShowWin.down('#ruleConID0').el.setVisible(false);
			ruleShowWin.down('#callIDid').el.setVisible(false);
			ruleShowWin.down('#labelID1').el.setVisible(false);

			ruleShowWin.down('#ruleConID1').el.setVisible(false);
			ruleShowWin.down('#csidConID').el.setVisible(false);
			ruleShowWin.down('#csidLabID').el.setVisible(false);

			ruleShowWin.down('#ruleAct3').el.setVisible(false);
			ruleShowWin.down('#forWardButtId').el.setVisible(false);
			ruleShowWin.down('#forwardFaxID').el.setVisible(false);
			if(action == 'update') {
				ruleShowWin.setTitle('已发件箱:修改规则');
				loadRecordUpdate('OUTFAX', sm);
				form.loadRecord(sm.getSelection()[0]);
			} else {
				ruleShowWin.setTitle('已发件箱:新建规则');
			}
		}
		ruleShowWin.grid = gridP;
		ruleShowWin.action = action;
		ruleShowWin.down('#ruleNameId').focus(true);
	});
}

//发送状态store
Ext.create('Ext.data.Store', {
	storeId: 'errcodeId',
	fields: ['errId', 'errName'],
	data : [{
		'errId': '0',
		'errName': outFaxErrCodeArr[0]
	},{
		'errId': '1',
		'errName': outFaxErrCodeArr[1]
	},{
		'errId': '2',
		'errName': outFaxErrCodeArr[2]
	},{
		'errId': '3',
		'errName': outFaxErrCodeArr[3]
	},{
		'errId': '4',
		'errName': outFaxErrCodeArr[4]
	},{
		'errId': '5',
		'errName': outFaxErrCodeArr[5]
	},{
		'errId': '6',
		'errName': outFaxErrCodeArr[6]
	},{
		'errId': '7',
		'errName': outFaxErrCodeArr[7]
	},{
		'errId': '8',
		'errName': outFaxErrCodeArr[8]
	},{
		'errId': '9',
		'errName': outFaxErrCodeArr[9]
	},{
		'errId': '10',
		'errName': outFaxErrCodeArr[10]
	},{
		'errId': '11',
		'errName': outFaxErrCodeArr[11]
	},{
		'errId': '12',
		'errName': outFaxErrCodeArr[12]
	},{
		'errId': '13',
		'errName': outFaxErrCodeArr[13]
	}
	]
});

function loadTempSearchWin(tplId, objTempData) {
	ruleCAMap.add(ruleCAMap.paramType, tplId);
	function showSearchWin() {
		template.myWinItems = new Array();
		template.myWinGItems.clear();
		var data = Ext.clone(template.saveTplInfo.get(tplId));
		Ext.Array.each(data, function(item,index,alls) {
			template.createContorl(item);
		});
		searchDataWin = loadSearchDataWin(null, ruleCAMap);
		searchDataWin.down('#condiID').hide();
		searchDataWin.down('#stringID').hide();
		searchDataWin.show('', function() {
			if(objTempData) {
				var objData = Ext.JSON.decode(objTempData);
				for(var p in objData) {
					var cmp = searchDataWin.down('#' + p);
					var xtype = cmp.getXType();
					if(xtype == 'datetimefield') {
						var tmpDf;
						var timeDf;
						if(objData[p].indexOf('T') != -1) {
							tmpDf = objData[p].split('T');
							timeDf = tmpDf[1].split(':');
							cmp.dateField.setValue(tmpDf[0]);
						} else {
							timeDf = objData[p].split(':');
						}
						cmp.timeHField.setValue(timeDf[0]);
						cmp.timeMField.setValue(timeDf[1]);
						cmp.timeIField.setValue(timeDf[2]);
					} else if(xtype == 'fieldcontainer') {
						var radios = cmp.query('radiofield');
						for(var k in radios) {
							if(radios[k].boxLabel.toLowerCase() == objData[p].toString()) {
								radios[k].setValue(true);
							}
						}
					} else {
						cmp.setValue(objData[p]);
					}
					searchDataWin.down('#ch_' + p).setValue(true);
				}
			}
		});
	}

	//如果未保存过该模版信息
	if(!template.saveTplInfo.containsKey(tplId)) {
		//调用Call 取得默认值
		var param = {};
		param.template = tplId;
		param.sessiontoken = sessionToken;
		// 调用
		WsCall.call('getcolumn', param, function(response, opts) {
			var d = Ext.JSON.decode(response.data);
			if(!template.saveTplInfo.containsKey(tplId)) {
				template.saveTplInfo.add(tplId,d);
			}
			showSearchWin();
		}, function(response, opts) {
		}, false);
	} else {
		showSearchWin();
	}
}

//设置模板数据动作
function ruleTempDataFn(record, ruleCAMap) {
	var tplId = record.data.tplId;
	if(tplId == 'none') {
		return;
	}
	loadTempSearchWin(tplId);
}

//规则window
Ext.define('WS.tbnorth.FaxRuleWin', {
	extend: 'Ext.window.Window',
	title: '新建规则',
	height: 480,
	width: 860,
	closeAction:'hide',
	iconCls: 'faxRuleICON',
	bodyCls: 'panelFormBg',
	border: false,
	resizable: false,		//窗口大小不能调整
	modal: true,   //设置window为模态
	listeners: {
		hide: function() {
			ruleCAMap.clear();
		}
	},
	items:[{
		xtype: 'form',
		bodyPadding: 5,
		bodyCls: 'panelFormBg',
		border: false,
		itemId: 'formID',
		layout : {
			type : 'table',
			columns : 2
		},
		items: [{
			labelAlign : 'right',
			labelPad : 15,
			width: 374,
			xtype: 'textfield',
			name: 'ruleName',
			itemId: 'ruleNameId',
			fieldLabel: '规则类别',
			allowBlank: false,
			blankText : '规则类别不能为空'
		},{
			margin: '0 0 0 20',
			xtype: 'checkbox',
			itemId: 'inUsedID',
			boxLabel: '启用',
			checked: true
		},{
			margin: '5 0 5 0',
			xtype:'fieldset',
			height: 380,
			width: 415,
			autoScroll: true,
			title: '请选择规则类型',
			defaultType: 'checkbox',
			itemId: 'selConditionId',
			layout : {
				type : 'table',
				columns : 3
			},
			items: [{
				width: 80,
				boxLabel: ruleNameArr[0],
				itemId: 'ruleConID0',
				name: '0',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con0')) {
							ruleCAMap.add('con0', '');
						}
					}
				}
			},{
				xtype: 'textarea',
				hideLabel: true,
				itemId: 'callIDid',
				height: 50,
				listeners: {
					blur: function (field, opts) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con0', val);
						}
					}
				}
			},{
				margin: '5 0 5 7',
				xtype: 'label',
				itemId: 'labelID1',
				text: '(多个条件以,隔开)'
			},{
				width: 100,
				boxLabel: ruleNameArr[4],
				itemId: 'ruleConID4',
				name: '4',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con4')) {
							ruleCAMap.add('con4', '');
						}
					}
				}
			},{
				xtype: 'textarea',
				hideLabel: true,
				itemId: 'faxNumberID',
				height: 50,
				listeners: {
					blur: function (field, opts) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con4', val);
						}
					}
				}
			},{
				margin: '5 0 5 7',
				xtype: 'label',
				itemId: 'labelID2',
				text: '(多个条件以,隔开)'
			},{
				boxLabel: ruleNameArr[8],
				itemId: 'ruleConID8',
				name: '8',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con8')) {
							ruleCAMap.add('con8', '');
						}
					}
				}
			},{
				xtype: 'textarea',
				hideLabel: true,
				itemId: 'recipientID',
				height: 50,
				listeners: {
					blur: function (field, opts) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con8', val);
						}
					}
				}
			},{
				margin: '5 0 5 7',
				xtype: 'label',
				itemId: 'labelID3',
				text: '(多个条件以,隔开)'
			},{
				boxLabel: ruleNameArr[9],
				itemId: 'ruleConID9',
				name: '9',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con9')) {
							ruleCAMap.add('con9', '');
						}
					}
				}
			},{
				xtype: 'textarea',
				hideLabel: true,
				itemId: 'orgnizationID',
				height: 50,
				listeners: {
					blur: function (field, opts) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con9', val);
						}
					}
				}
			},{
				margin: '5 0 5 7',
				xtype: 'label',
				itemId: 'labelID4',
				text: '(多个条件以,隔开)'
			},{
				boxLabel: ruleNameArr[1],
				itemId: 'ruleConID1',
				name: '1',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con1')) {
							ruleCAMap.add('con1', '');
						}
					}
				}
			},{
				xtype: 'textarea',
				hideLabel: true,
				itemId: 'csidConID',
				height: 50,
				listeners: {
					blur: function (field, opts) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con1', val);
						}
					}
				}
			},{
				margin: '5 0 5 7',
				xtype: 'label',
				itemId: 'csidLabID',
				text: '(多个条件以,隔开)'
			},{
				boxLabel: ruleNameArr[2],
				itemId: 'ruleConID2',
				name: '2',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con2')) {
							ruleCAMap.add('con2', '0,1');
						}
					}
				}
			},{
				itemId: 'pageStartID',
				xtype: 'numberfield',
				value: 0,
				maxValue: 99,
				minValue: 0
			},{
				margin: '5 0 5 7',
				xtype: 'numberfield',
				value: 1,
				maxValue: 99,
				minValue: 0,
				width: 120,
				fieldLabel: '至',
				labelWidth: 20,
				itemId: 'pageEnd',
				listeners: {
					change: function (field, end) {
						var win = field.up('window');
						var startCon = win.down('#pageStartID');
						var start = startCon.getValue();
						if(start >= end) {
							startCon.setValue(0);
							field.focus(true);
							return;
						}
						ruleCAMap.add('con2', start + ',' + end);
					}
				}
			},{
				boxLabel: ruleNameArr[3],
				itemId: 'ruleConID3',
				name: '3',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con3')) {
							ruleCAMap.add('con3', '0');
						}
					}
				}
			},{
				colspan: 2,
				xtype: 'combobox',
				name: 'modflag',
				itemId: 'ruleFaxFlagID',
				store: 'faxFlagID',
				queryMode : 'local',
				displayField : 'faxFlagName',
				valueField : 'faxFlagId',
				value: '0',
				editable: false,
				listeners: {
					change: function(field) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con3', val);
						}
					}
				}
			},{
				boxLabel: ruleNameArr[5],
				itemId: 'ruleConID5',
				name: '5',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con5')) {
							ruleCAMap.add('con5', '');
						}
					}
				}
			},{
				xtype: 'textarea',
				hideLabel: true,
				itemId: 'subjConID',
				height: 50,
				listeners: {
					blur: function (field, opts) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con5', val);
						}
					}
				}
			},{
				margin: '5 0 5 7',
				xtype: 'label',
				itemId: 'subjLabID',
				text: '(多个条件以,隔开)'
			},{
				boxLabel: ruleNameArr[6],
				itemId: 'ruleConID6',
				name: '6',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con6')) {
							ruleCAMap.add('con6', '');
						}
					}
				}
			},{
				boxLabel: '发送成功',
				itemId: 'stateSucID',
				xtype: 'radiofield',
				name: 'state',
				listeners: {
					change: function(field) {
						var win = field.up('window');
						if(field.getValue()) {
							ruleCAMap.add('con6', 9);
						}
					}
				}
			},{
				margin: '4 0 4 7',
				itemId: 'stateFailID',
				boxLabel: '发送失败',
				xtype: 'radiofield',
				name: 'state',
				listeners: {
					change: function(field) {
						var win = field.up('window');
						if(field.getValue()) {
							ruleCAMap.add('con6', 8);
						}
					}
				}
			},{
				boxLabel: ruleNameArr[7],
				itemId: 'ruleConID7',
				name: '7',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con7')) {
							ruleCAMap.add('con7', '0');
						}
					}
				}
			},{
				colspan: 2,
				xtype: 'combobox',
				name: 'errcode',
				itemId: 'ruleErrID',
				store: 'errcodeId',
				queryMode : 'local',
				width: 200,
				displayField : 'errName',
				valueField : 'errId',
				value: '0',
				editable: false,
				listeners: {
					change: function(field) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('con7', val);
						}
					}
				}
			},{
				hidden:!onTemplateJs,
				boxLabel: ruleActionArr[7],		//设置表单数据模板
				itemId: 'ruleConID10',
				name: '10',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('con10')) {
							ruleCAMap.add('con10', '');
						}
					}
				}
			},{
				xtype: 'button',
				hidden: !onTemplateJs,
				text: '参数',
				itemId: 'tempParamConID',
				colspan: 2,
				handler: function() {//第三个参数是 规则设置
					ruleCAMap.paramType = 'con10';
					if(ruleCAMap.containsKey('con10') && ruleCAMap.get('con10').length > 0) {
						var actTemp = ruleCAMap.get('con10');
						var tplId = actTemp;
						var chatIn = actTemp.indexOf(',');
						if(chatIn != -1) {
							var actArr = actTemp.split(',', 2);
							tplId = actTemp.substring(0, chatIn);
							loadTempSearchWin(tplId, actTemp.substring(chatIn + 1, actTemp.length));
						} else {
							loadTempSearchWin(tplId);
						}
					} else {
						loadTemplateWin(null, false, ruleCAMap);
					}
				}
			}]
		},{
			margin: '4 0 4 10',
			xtype:'fieldset',
			height: 380,
			width: 415,
			padding: '10 5 15 10',
			autoScroll: true,
			title: '请选择规则动作',
			defaultType: 'checkbox',
			itemId: 'selActionId',
			layout : {
				type : 'table',
				columns : 3
			},
			items: [{
				margin: '0 0 0 0',
				boxLabel: ruleActionArr[0],
				itemId: 'ruleAct0',
				name: '0',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('act0')) {
							ruleCAMap.add('act0', '');
						}
					}
				}
			},{
				xtype: 'button',
				text: '目录',
				margin: '4 0 4 20',
				handler: function() {
					var me = this;
					var win = me.up('window');
					loadPerFolderWin(win);
				}
			},{
				width: 190,
				margin: '4 0 4 3',
				xtype: 'displayfield',
				hideLabel: true,
				itemId: 'inFolderLabId'
			},{
				boxLabel: ruleActionArr[1],
				itemId: 'ruleAct1',
				name: '1',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('act1')) {
							ruleCAMap.add('act1', '');
						}
					}
				}
			},{
				margin: '4 0 4 20',
				boxLabel: '删除',
				xtype: 'radiofield',
				itemId: 'delFaxId',
				name: 'del',
				listeners: {
					change: function(field) {
						var win = field.up('window');
						if(field.getValue()) {
							ruleCAMap.add('act1', 0);
						}
					}
				}
			},{
				margin: '4 0 4 7',
				boxLabel: '彻底删除',
				xtype: 'radiofield',
				itemId: 'delAllFaxId',
				name: 'del',
				listeners: {
					change: function(field) {
						var win = field.up('window');
						if(field.getValue()) {
							newMesB.show({
								title:'提示',
								msg: '使用该动作的所有传真都将消失，而且永远无法再恢复。'+'<br>'+'确定要执行永久删除操作吗？',
								buttons: Ext.MessageBox.YESNO,
								closable:false,
								fn: function(btn) {
									if(btn=='yes') {
										field.setValue(true);
										ruleCAMap.add('act1', 1);
									} else {
										field.setValue(false);
									}
								},
								icon: Ext.MessageBox.QUESTION
							});
						}
					}
				}
			},{
				boxLabel: ruleActionArr[2],
				itemId: 'ruleAct2',
				name: '2',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('act2')) {
							ruleCAMap.add('act2', '0');
						}
					}
				}
			},{
				colspan: 2,
				margin: '4 0 4 20',
				xtype: 'combobox',
				name: 'modflag',
				itemId: 'ruleModFaxFlagID',
				store: 'faxFlagID',
				queryMode : 'local',
				displayField : 'faxFlagName',
				valueField : 'faxFlagId',
				value: '0',
				editable: false,
				listeners: {
					change: function(field) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('act2', val);
						}
					}
				}
			},{
				boxLabel: ruleActionArr[3],
				itemId: 'ruleAct3',
				name: '3',	//转发传真
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('act3')) {
							ruleCAMap.add('act3', '');
						}
					}
				}
			},{
				xtype: 'button',
				text: '参数',
				itemId: 'forWardButtId',
				margin: '4 0 4 20',
				handler: function() {
					loadRuleUserWin(this);
				}
			},{
				margin: '4 0 4 3',
				width: 190,
				xtype: 'displayfield',
				hideLabel: true,
				itemId: 'forwardFaxID'
			},{
				boxLabel: ruleActionArr[4],
				itemId: 'ruleAct4',
				name: '4',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('act4')) {
							ruleCAMap.add('act4', '');
						}
					}
				}
			},{
				colspan: 2,
				margin: '4 0 4 20',
				xtype: 'textarea',
				hideLabel: true,
				itemId: 'modCommID',
				width: 200,
				height: 60,
				listeners: {
					blur: function (field, opts) {
						var win = field.up('window');
						var val = field.getValue();
						if(val.length > 0) {
							ruleCAMap.add('act4', val);
						}
					}
				}
			},{
				colspan: 3,	//停止处理其他规则
				boxLabel: ruleActionArr[5],
				itemId: 'ruleAct5',
				name: '5'
			},{
				disabled: true,
				colspan: 3,	//打印传真文件
				boxLabel: ruleActionArr[6],
				itemId: 'ruleAct6',
				name: '6'
			},{
				hidden:!onTemplateJs,
				boxLabel: ruleActionArr[7],		//设置表单数据模板
				itemId: 'ruleAct7',
				name: '7',
				listeners: {
					change: function (field, val) {
						if(val && !ruleCAMap.containsKey('act7')) {
							ruleCAMap.add('act7', '');
						}
					}
				}
			},{
				xtype: 'button',
				hidden:!onTemplateJs,
				text: '参数',
				margin: '4 0 4 20',
				itemId: 'tempParamActID',
				colspan: 2,
				handler: function() {//第三个参数是 规则设置
					ruleCAMap.paramType = 'act7';
					if(ruleCAMap.containsKey('act7') && ruleCAMap.get('act7').length > 0) {
						var actTemp = ruleCAMap.get('act7');
						var tplId = actTemp;
						var chatIn = actTemp.indexOf(',');
						if(chatIn != -1) {
							var actArr = actTemp.split(',', 2);
							tplId = actTemp.substring(0, chatIn);
							loadTempSearchWin(tplId, actTemp.substring(chatIn + 1, actTemp.length));
						} else {
							loadTempSearchWin(tplId);
						}
					} else {
						loadTemplateWin(null, false, ruleCAMap);
					}

				}
			}]
		}]
	}],
	buttons: [{
		text: '确定',
		itemId: 'submit',
		formBind: true,
		handler: function() {
			var me = this;
			var w = me.up('window');
			var form = w.down('#formID').getForm();
			if(!form.isValid()) {
				return;
			}

			var ruleN = w.down('#ruleNameId').getValue();

			var conditions = w.down('#selConditionId').items.items;
			var ruleCon = '';	//规则内容 : 规则类型_规则参数；
			for(var p in conditions) {
				if(conditions[p].getXType() == 'checkboxfield' && conditions[p].getValue()) {
					var gname = conditions[p].getName();
					if(gname == 2) {
						var startCP = w.down('#pageStartID');
						var end = w.down('#pageEnd').getValue();
						if(startCP.getValue() >= end) {
							startCP.focus(true);
							return;
						}
					}
					if(ruleCAMap.containsKey('con' + gname)) {
						if(ruleCon.length > 0) {
							ruleCon += ';' + gname + '_' + ruleCAMap.get('con' + gname);
						} else {
							ruleCon = gname + '_' + ruleCAMap.get('con' + gname);
						}
					}
				}
			}

			if(ruleCon.length <= 0) {
				Ext.Msg.alert('错误','请选择至少一个条件');
				return;
			}
			var actions = w.down('#selActionId').items.items;
			var ruleAction = '';	//规则动作 : 动作类型_动作参数；
			for(var p in actions) {
				if(actions[p].getXType() == 'checkboxfield' && actions[p].getValue()) {
					var aname = actions[p].getName();
					if(aname == 5) {
						ruleAction += ruleAction.length > 0 ? ';5_1' : '5_1';
					}
					if(ruleCAMap.containsKey('act' + aname)) {
						if(ruleAction.length > 0) {
							ruleAction += ';' + aname + '_' + ruleCAMap.get('act' + aname);
						} else {
							ruleAction = aname + '_' + ruleCAMap.get('act' + aname);
						}
					}

				}
			}
			if(ruleAction.length <= 0) {
				Ext.Msg.alert('错误','请选择至少一个动作');
				return;
			}
			//	        	alert('ruleCon:' + ruleCon + '----ruleAction:' + ruleAction);
			var used = w.down('#inUsedID').getValue();
			var store = w.grid.getStore();
			if(w.action == 'create') {
				store.add({
					'ruleName': ruleN,
					'rcType': w.grid.gridType,
					'ruleContext': ruleCon,
					'used': used,
					'ruleAction': ruleAction
				});
			} else {
				var sm = w.grid.getSelectionModel();
				var records = sm.getSelection();
				records[0].set('ruleName', w.down('#ruleNameId').getValue());
				records[0].set('ruleContext', ruleCon);
				records[0].set('used', used);
				records[0].set('ruleAction', ruleAction);
			}
			w.hide();
		}
	},{
		text: '取消',
		handler: function() {
			var me = this;
			me.up('window').hide();
		}
	}]
});

//定义内部用户store
var store1;
function createuserRuleStore() {
	Ext.StoreMgr.removeAtKey ('addressId');
	store1 = Ext.create('Ext.data.Store', {
		model: 'WS.user.Usermodel',
		pageSize:1000,
		storeId: 'userRuleStoreID',
		autoLoad: false,
		remoteSort: false,     //排序通过查询数据库
		sorters: [{
			property: 'accountName',
			direction: 'ASC',
			sorterFn: function(o1, o2) {
				return o1.data.accountName.localeCompare(o2.data.accountName);
			}
		}],
		autoSync: false,
		proxy: {
			type: 'ajax',
			api: {
				create  : WsConf.Url + '?action=create',
				read    : WsConf.Url + '?action=read',
				update  : WsConf.Url + '?action=update',
				destroy : WsConf.Url + '?action=destroy'
			},
			filterParam: 'filter',
			sortParam:'sort',
			directionParam:'dir',
			simpleSortMode: true,		//单一字段排序
			extraParams: {
				req:'dataset',
				dataname: 'user',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
				refresh: null
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
			},
			actionMethods: 'POST'
		}
	});
	store1.sortOld = store1.sort;
	store1.sort = selfSort;
	var store2 = Ext.create('Ext.data.Store', {
		model: 'WS.user.Usermodel'
	});
	store2.sortOld = store2.sort;
	store2.sort = selfSort;
}

//定义内部用户grid
Ext.define('WS.user.UserRulegrid', {
	alternateClassName: ['UserRulegrid'],
	alias: 'widget.UserRulegrid',
	extend: 'WS.user.UGBase',
	title: 'Wavefax' +'内部用户',
	store: 'userRuleStoreID',
	dockedItems: [{
		xtype: 'pagingtoolbar',
		itemId: 'pagingtoolbarID',
		store: 'userRuleStoreID',
		dock: 'bottom',
		displayInfo: true,
		displayMsg: '第 {0} 到 {1} 条，共 {2} 条',
		emptyMsg: "没有记录",
		beforePageText: '页数',
		afterPageText: '共 {0}'
	},{
		dock: 'bottom',
		xtype : 'toolbar',
		items:[{
			fieldLabel : '快速查找',
			labelAlign : 'right',
			labelPad : 15,
			width : 400,
			colspan : 3,
			labelWidth : 80,
			xtype : 'searchfield',
			itemId : 'serFielID',
			onTrigger2Click : function() {
				var me = this, store = me.store;
				proxy = store.getProxy(), value = me.getValue();
				if (value.length < 1) {
					me.onTrigger1Click();
					return;
				}
				store.filterBy( function(record) {
					var accountName = record.get('accountName').indexOf(value) > -1 ? true : false;
					var userName = record.get('userName').indexOf(value) > -1? true: false;
					var dtmf = record.get('dtmf').indexOf(value) > -1? true: false;
					return accountName || userName || dtmf;
				});
				me.hasSearch = true;
				me.triggerEl.item(0).setDisplayed('block');
				me.doComponentLayout();
			}
		}]
	}],
	listeners: {
		itemclick: function(grid,record,hitem,index,e,opts) {
			if(!e.ctrlKey && !e.shiftKey) {
				var sm = grid.getSelectionModel();
				sm.deselectAll(true);
				sm.select(record,true,false);
			}
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		}
	},
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);
		if(me.down('#serFielID')) {
			me.down('#serFielID').store = me.getStore();		//让searchfield的store不依赖于变量
		}

		me.getStore().getProxy().on('exception', function(proxy, response, operation) {
			var json = Ext.JSON.decode(response.responseText);
			var code = json.code;
			if(operation.action == "update" || operation.action == "destroy") {
				me.loadGrid(filter);		//
			}
			errorProcess(code);
			//根据operation 处理
		});
	},
	loadGrid: function(filter) {
		var me = this;
		var store = me.getStore();
		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		store.getProxy().extraParams.filter = filter;
		store.getProxy().extraParams.refresh = 1;
		store.load( function(records, operation, success) {
//			var map = new Ext.util.HashMap();
//			if(success) {
//				secondGridStore.each( function(record,index,all) {
//					map.add(record.data.userID,record.data.userID);
//				});
//				Ext.Array.each(records, function(rec,index,all) {
//					if(map.contains(rec.data.userID)) {
//						store.remove(rec);
//					}
//				});
//			}
		});
		store.getProxy().extraParams.refresh = null;
	}
});

//创建addrstore
function createRuleAddrStore() {
	Ext.StoreMgr.removeAtKey ('ruleAddrStoreID');
	Ext.create('Ext.data.Store', {
		model: 'WS.tbnorth.superaddModel',
		pageSize: 1000,
		storeId: 'ruleAddrStoreID',
		autoLoad: false,
		remoteSort: true,     //排序通过查询数据库
		sorters: [{
			property: 'phoneBookID',
			direction: 'DESC'
		}],
		autoSync: false,
		proxy: {
			type: 'ajax',
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
				dataname: 'address',             //dataset名称，根据实际情况设置,数据库名
				restype: 'json',
				sessiontoken: '',
				folderid: 0,
				refresh: null
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
			},
			actionMethods: 'POST'
		}
	});
}

//定义规则通讯录grid
Ext.define('WS.tbnorth.ruleAddrGrid', {
	alternateClassName: ['ruleAddrGrid'],
	alias: 'widget.ruleAddrGrid',
	extend: 'Ext.grid.Panel',
	columnLines: true,
	multiSelect: true,
	store: 'ruleAddrStoreID',
	columns : [{
		text: '显示名',
		dataIndex: 'dispName',
		flex: 1,
		renderer: function(value) {
			return "<div><img src='resources/images/grid/pbrecord.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';
		}
	},{
		text: '传真号码',
		dataIndex: 'faxNumber',
		flex: 1
	},{
		text: '组织',
		dataIndex: 'organization',
		hidden: true,
		flex: 1
	}],
	initComponent : function() {
		var me = this;
		me.callParent(arguments);

		me.getStore().getProxy().on('exception', function(proxy, response, operation) {
			var json = Ext.JSON.decode(response.responseText);
			var code = json.code;
			if(operation.action == "update" || operation.action == "destroy") {
				me.loadGrid();		//
			}
			errorProcess(code);
			//根据operation 处理
		});
	},
	loadGrid: function() {
		var me = this;
		var store = me.getStore();

		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		store.getProxy().extraParams.control = true; //将没有传真号码的记录不返回
		store.getProxy().extraParams.refresh = 1;
		//		store.load( function(records, operation, success) {
		//			var map = new Ext.util.HashMap();
		//			if(success) {
		//				Ext.StoreMgr.lookup('superaddTarStore').each( function(record,index,all) {
		//					map.add(record.data.phoneBookID,record.data.phoneBookID);
		//				});
		//				Ext.Array.each(records, function(rec,index,all) {
		//					if(map.contains(rec.data.phoneBookID)) {
		//						store.remove(rec);
		//					}
		//				});
		//			}
		//		});
		store.currentPage = 1;
		store.loadPage(1);
		store.getProxy().extraParams.refresh = null;
		//		store.getProxy().extraParams.control = null;
	}
});

//外部联系人store
Ext.create('Ext.data.Store', {
	model: 'WS.tbnorth.superaddModel',
	storeId: 'outLinkMenStoreID'
});

//外部联系人
Ext.define('WS.tbnorth.outLinkMenGrid', {
	extend: 'Ext.grid.Panel',
	alternateClassName: ['outLinkMenGrid'],
	alias: 'widget.outLinkMenGrid',
	store: 'outLinkMenStoreID',
	columnLines: true,
	multiSelect: true,
	columns : [{
		text: '显示名 ',
		dataIndex: 'dispName',
		flex: 1,
		renderer: function(value) {
			return "<div><img src='resources/images/grid/pbrecord.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';
		}
	},{
		text: '传真号码 ',
		dataIndex: 'faxNumber',
		flex: 1.5,
		editor: {
			allowBlank: false,
			blankText: '传真号码不能为空',
			maxLength: 50,
			maxLengthText: '传真号码长度最大为50字节',
			regex: regexFaxNumber1,
			regexText: '请输入正确的格式！'+'<br/> '+'支持的格式:'+'<br/> +86(20)11111111 <br/> +20 11111111 <br/> 028-11111111 <br/> (028)11111111<br/> 02811111111'
		}
	},{
		text: '组织',
		dataIndex: 'organization',
		flex: 1,
		hidden: true
	}]
});
//共享目录树
Ext.define('WS.tbnorth.shareTree', {
	alias: 'widget.shareTree',
	//iconCls: 'addressTitle',
	extend: 'Ext.tree.Panel',
	animate:false,
	store: 'shareTreeStoreId',
	rootVisible: true,
	border: true,
	width: 400,
	height: 400,
	multiSelect: true,
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}
});

function createShareTreeStore() {
	Ext.StoreMgr.removeAtKey('shareTreeStoreId');
	Ext.create('Ext.data.TreeStore', {
		model: 'directoryTree_Model',
		defaultRootId: WaveFaxConst.PublicRootFolderID,
		storeId: 'shareTreeStoreId',
		//autoLoad:false,
		proxy: {
			type: 'ajax',
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
				seccessProperty: 'success',
				messageProperty: 'msg'
			},
			actionMethods: 'POST'
		},
		root: {
			expanded: false,
			text: "共享文件夹",
			iconCls: 'fax'
		}
	});
}

//共享文件名gridstore
function createShareFolderGS() {
	Ext.StoreMgr.removeAtKey('shareFolderGridStoreID');
	Ext.create('Ext.data.Store', {
		model: 'directoryGrid_Model',
		storeId: 'shareFolderGridStoreID'
	});
}

//共享文件夹右边gird
Ext.define('WS.tbnorth.shareFolderRigth', {
	alternateClassName: ['shareFolderRigth'],
	alias: 'widget.shareFolderRigth',
	extend: 'Ext.grid.Panel',
	title: '发送到',
	frameHeader: false,
	store: 'shareFolderGridStoreID',
	columnLines: true,
	multiSelect: true,
	columns : [{
		text: '共享文件夹名',
		dataIndex: 'dirtext',
		flex: 1,
		renderer: function(value, metaData, record) {
			return updateRecord("<div><img src='resources/images/tree/folder.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>', metaData, record);
		}
	}]
});

//参数内容
function getArgsData(args) {
	var param = {};
	param.args = args;
	param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

	WsCall.call('getParamsByArgs', param, function(response, opts) {
		var data = Ext.JSON.decode(response.data);
		var faxUser = data.userOrDic;
		for(var p in faxUser) {
			var r1 = Ext.ModelManager.create({
				udID: faxUser[p].udID,
				udName: faxUser[p].udType == 'user' ? faxUser[p].udName : owerInternational(faxUser[p].udName),
				udType: faxUser[p].udType,
				dtmf:faxUser[p].dtmf
			}, 'WS.user.userdicModel');
			ruleUserWin.down('#ugTargetId').getStore().add(r1);
		}

		var linkMan = data.linkMan;
		for(var p in linkMan) {
			var r2 = Ext.ModelManager.create({
				dispName: linkMan[p].dispName,
				faxNumber: linkMan[p].faxNumber,
				organization: linkMan[p].organization,
				phoneBookID: linkMan[p].phoneBookID
			}, 'WS.tbnorth.superaddModel');
			ruleUserWin.down('#sdTargetId').getStore().add(r2);
		}

	}, function(response, opts) {
		ruleUserWin.down('#ugTargetId').getStore().loadData([]);
		ruleUserWin.down('#sdTargetId').getStore().loadData([]);
	}, false);
}

//加载窗口 
function loadRuleUserWin(cmp) {
	createuserRuleStore();
	createRuleAddrStore();
	createShareTreeStore();
	//createShareFolderGS();

	if(ruleUserWin == '') {
		ruleUserWin = Ext.create('WS.tbnorth.FaxUserRule');
	}

	ruleUserWin.ruleWin = cmp.up('window');
	ruleUserWin.show('', function() {
//		ruleUserWin.down('#sdSrc').headerCt.items.items[2].hidden = true;
//		ruleUserWin.down('#sdTargetId').headerCt.items.items[2].hidden = true;
		ruleUserWin.down('tabpanel').setActiveTab('forwarUserDic');
		//将之前选择的项目全部移除
		ruleUserWin.down('#userID').loadGrid('');
		ruleUserWin.down('#serFielID').store = ruleUserWin.down('#userID').getStore();
		ruleUserWin.down('#sdSrc').loadGrid();
		ruleUserWin.down('#ugTargetId').getStore().loadData([]);
		ruleUserWin.down('#sdTargetId').getStore().loadData([]);
		
		if(ruleCAMap.containsKey('act3')) {
			var args = ruleCAMap.get('act3');
			getArgsData(args);
		}
	});
}

//呼叫者标识
Ext.define('WS.tbnorth.FaxUserRule', {
	extend: 'Ext.window.Window',
	alternateClassName: ['FaxUserRule'],
	iconCls: 'faxRuleICON',
	closeAction:'hide',
	title: '选择发件人',
	width:850,
	bodyBoder:false,
	resizable: false,		//窗口大小不能调整
	modal: true,   //设置window为模态
	listeners: {
		hide: function() {
			if (addrRuleTreeWin != '') {
				addrRuleTreeWin.destroy();
			}
			addrRuleTreeWin = '';
			addrRuleTreeLoading = 0;
			Ext.StoreMgr.removeAtKey ('addresspersonwinTree_store');

			if (orgniTreeWin != '') {
				orgniTreeWin.destroy();
			}
			orgniTreeWin = '';
			orgniTreeLoading = 0;
			Ext.StoreMgr.removeAtKey ('orgnizTreeStoreID');
		},
		afterrender: function (win, opts) {
			
			win.getEl().on('click', function () {
				if (orgniTreeWin != '') {
					orgniTreeWin.destroy();
				}
				if(addrRuleTreeWin != ''){
					addrRuleTreeWin.destroy();
				}
				addrRuleTreeWin='';
				addrRuleTreeLoading = 0;
				orgniTreeWin = '';
				orgniTreeLoading = 0;

			});
			var header = win.header;

			header.getEl().on('mousedown', function () {

				if (orgniTreeWin != '') {
					orgniTreeWin.destroy();
				}
				if(addrRuleTreeWin != ''){
					addrRuleTreeWin.destroy();
				}
				addrRuleTreeWin='';
				addrRuleTreeLoading = 0;
				orgniTreeWin = '';
				orgniTreeLoading = 0;

			});
		}
	},
	items : [{
		xtype : 'tabpanel',
		plain : true,
		width : 822,
		height : 430,
		bodyBoder : false,
		margin : '5 5 5 5',
		border : false,
		defaults : {
			bodyCls : 'panelFormBg',
			border : false
		},
		items : [{
			title:'到目标',
			itemId:'forwarUserDic',
			layout: {
				type: 'table',
				columns: 3
			},
			items:[{
				xtype: 'radiogroup',
				fieldLabel: '类型',
				labelWidth:50,
				labelAlign:'right',
				labelStyle:'padding:6px 0 0;',
				itemId:'rdUdType',
				height:25,
				colspan: 3,
				width:360,
				listeners: {
					change: function(rgcom,nVal,oVal,opts) {
						if(nVal.udTypett == 'user') {
							ruleUserWin.down('#udCardPal').getLayout().setActiveItem(0);
						} else if(nVal.udTypett == 'dic') {
							ruleUserWin.down('#udCardPal').getLayout().setActiveItem(1);
							var rootNode = ruleUserWin.down('#dirSrcTree').getRootNode();
							rootNode.expand(); 
						}
					}
				},
				items: [{
					boxLabel: '用户',
					itemId:'rdUserID',
					name: 'udTypett',
					inputValue: 'user',
					checked: true
				},{
					boxLabel: '共享文件夹',
					itemId:'rdDicID',
					name: 'udTypett',
					inputValue: 'dic'
				}]
			},{
				xtype:'panel',
				itemId:'udCardPal',
				layout:'card',
				border:false,
				items:[{
					xtype:'panel',
					border:false,
					items:[{
						labelAlign: 'right',
						colspan : 3,
						width: 400,
						fieldLabel: '组织目录',
						itemId: 'orgFolderID',
						xtype: 'triggerfield',
						value: '全部',
						onTriggerClick: function () {
							var me = this;
							var treeWinObj = {
								treeLoading: orgniTreeLoading,
								curTreeWin: orgniTreeWin,
								winWidth: 280
							};
							triggleFun(me, 'orgnizTreeStoreID', function(store,records,models) {
								if(!models || models.length<=0)
									return;
								Ext.Array.each(models, function(item,index,alls) {
									if(item.data.id == 0) {
										item.data.text = '全部';
									} else if(item.data.id == WaveFaxConst.PublicRootFolderID) {
										item.data.text = '组织根目录';
									}
								});
							}, function(store) {
								var extParam = store.getProxy().extraParams;
								extParam.isOrgniz = true;
								extParam.need = true;
								extParam.sessiontoken = Ext.util.Cookies.get("sessiontoken");
							}, treeWinObj, 'userID', function() {
								orgniTreeWin = treeWinObj.curTreeWin;
								orgniTreeLoading = treeWinObj.treeLoading;
							});
						}
					},{
						width : 420,
						height : 340,
						itemId : 'userID',
						xtype : 'UserRulegrid',
						border : true,
						preventHeader : true,
						listeners : {
							itemdblclick : function(view, record, item, index, e, opts) {
								var me = this;
								var w = me.up('window');
								inserTarFromUser(w);
							}
						}
					}]//card -panel items
				},{
					width: 420,
					height: 360,
					itemId: 'dirSrcTree',
					xtype:'shareTree',
					listeners: {
						itemdblclick: function(tView,record,item,index,e,opts) {
							var me = this;
							var w = me.up('window');
							inserTarFromDic(w);
						}
					}
				}]//card items
			},{
				xtype : 'panel',
				width : 60,
				height : 350,
				layout : {
					type : 'vbox',
					align : 'center'
				},
				border : false,
				bodyCls : 'panelFormBg',
				defaults : {
					xtype : 'button',
					width : 50
				},
				items : [{
					xtype : 'displayfield',
					html : '<br/><br/><br/><br/>'
				},{
					text : '>',
					tooltip : '移入',
					handler : function() {
						var me = this;
						var w = me.up('window');
						var udType = w.down('#rdUdType').getValue();
						if(udType.udType == 'user') {
							inserTarFromUser(w);
						} else if(udType.udType == 'dic') {
							inserTarFromDic(w);
						}
						
					}
				},{
					xtype : 'displayfield',
					html : '<br/><br/>'
				},{
					xtype : 'displayfield',
					html : '<br/>'
				},{
					text : '<',
					tooltip : '移出',
					handler : function() {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#ugTargetId');
						var sm = grid.getSelectionModel();
						if (sm.hasSelection()) {
							grid.getStore().remove(sm.getSelection());
						}
					}
				},{
					xtype : 'displayfield',
					html : '<br/>'
				},{
					text : '<<',
					tooltip : '全部移出',
					handler : function() {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#ugTargetId');
						grid.getSelectionModel().selectAll();
						grid.getStore().removeAll();
					}
				}]
			},{
				width: 335,
				height: 365,
				itemId: 'ugTargetId',
				xtype: 'userdicTarget',
				border: true,
				listeners: {
					itemdblclick: function(view,record,item,index,e,opts) {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#ugTargetId');
						grid.getStore().remove(record);

					}
				}
			}]//转发到用户或目录 items
		}, {
			title: '外部联系人',
			itemId: 'outUserID',
			layout : {
				type : 'table',
				columns : 4
			},
			items: [{
				fieldLabel: '通讯录目录',
				width: 390,
				margin: '7 0 3 0',
				labelAlign: 'right',
				colspan:2,
				itemId: 'personCombo',
				xtype: 'triggerfield',
				value: '个人',
				onTriggerClick: function () {
					var me = this;
					var treeWinObj = {
						treeLoading: addrRuleTreeLoading,
						curTreeWin: addrRuleTreeWin,
						winWidth: 280
					};
					triggleFun(me, 'superadditionwinTree_store', function(store,records,models) {
						if(!models || models.length<=0)
							return;
						Ext.Array.each(models, function(item,index,alls) {
							var interStr = addrTreeInter(item.data.id);
							if(interStr != '') {
								item.data.text = interStr;
							}
						});
					}, function() {
					}, treeWinObj, 'sdSrc', function() {
						addrRuleTreeWin = treeWinObj.curTreeWin;
						addrRuleTreeLoading = treeWinObj.treeLoading;
					});
				}
			},{
				xtype: 'button',
				text: '追加联系人',
				width: 120,
				handler: function() {
					ruleAddrEdit.cancelEdit();
					var r = Ext.ModelManager.create({
						//dispName: '',
						faxNumber: ''
					}, 'WS.tbnorth.superaddModel');
					var store = this.up('window').down('#sdTargetId').getStore();
					var records = store.data.items;
					for(var p in records) {
						outLinkStoreCop.push(records[p].data.faxNumber);
					}
					store.insert(0, r);
					ruleAddrEdit.startEdit(0, 0);;
				}
			},{
				xtype: 'button',
				text: '删除联系人',
				width: 120,
				handler: function() {
					var grid = this.up('window').down('#sdTargetId');
					var sm = grid.getSelectionModel();
					ruleAddrEdit.cancelEdit();
					grid.getStore().remove(sm.getSelection());
				}
			},{
				xtype:'ruleAddrGrid',
				width: 390,
				height: 365,
				itemId:'sdSrc',
				dockedItems:[{
					xtype: 'pagingtoolbar',
					itemId: 'pagingtoolbarID',
					store: 'ruleAddrStoreID',
					dock: 'bottom',
					displayInfo: true,
					displayMsg: '第 {0} 到 {1} 条,共 {2} 条',
					emptyMsg: '没有记录',
					beforePageText: '页数',
					afterPageText: '共 {0}'
				}],
				listeners: {
					itemdblclick: function(view,record,item,index,e,opts) {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#sdSrc');
						var tarGrid =  w.down('#sdTargetId');

						var rec = record;
						rec.data.faxNumber =covertToRightNumber(true,rec.data.faxNumber);

						var map = new Ext.util.HashMap();
						Ext.StoreMgr.lookup('outLinkMenStoreID').each( function(rcc,index,all) {
							map.add(rcc.data.faxNumber,rcc.data.faxNumber);
						});
						if(map.contains(record.data.faxNumber)) {
							return;
						}
						tarGrid.getStore().add(rec);

					}
				}
			},{
				xtype:'panel',
				width:60,
				height: 365,
				layout: {
					type:'vbox',
					align:'center'
				},
				border:false,
				bodyCls: 'panelFormBg',

				defaults: {
					xtype:'button',
					width:50
				},
				items:[{
					xtype:'displayfield',
					html:'<br/><br/><br/><br/>'
				},{
					text:'>',
					tooltip:'移入',
					handler: function() {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#sdSrc');
						if(grid.getSelectionModel().hasSelection()) {
							var tarGrid =  w.down('#sdTargetId');
							var sels = grid.getSelectionModel().getSelection();
							var dels = new Array();
							var isError = false;
							Ext.Array.each(sels, function(record,index,all) {
								if(record.data.faxNumber == '' || record.data.faxNumber.length < 0) {
									dels.push(record);
									isError = true;
									return;
								}
								record.data.faxNumber =covertToRightNumber(true,record.data.faxNumber);
							});
							var map = new Ext.util.HashMap();
							Ext.StoreMgr.lookup('outLinkMenStoreID').each( function(record,index,all) {
								map.add(record.data.faxNumber,record.data.faxNumber);
							});
							Ext.Array.each(sels, function(rec,index,all) {
								if(!map.contains(rec.data.faxNumber)) {
									map.add(rec.data.faxNumber,rec.data.faxNumber);
								} else {
									dels.push(rec);
									isError = true;
								}
							});
							Ext.Array.each(dels, function(delRec,index,all) {
								sels = Ext.Array.remove(sels,delRec);
							});
							tarGrid.getStore().add(sels);

							if(isError) {
								Ext.Msg.alert('警告','您选择的收件人中含有空传真号码或重复数据！未能添加！');
							}

						}
					}
				},{
					xtype:'displayfield',
					html:'<br/><br/>'
				},{
					xtype:'displayfield',
					html:'<br/>'
				},{
					text:'<',
					tooltip:'移出',
					handler: function() {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#sdTargetId');
						if(grid.getSelectionModel().hasSelection()) {
							grid.getStore().remove(grid.getSelectionModel().getSelection());
						}
					}
				},{
					xtype:'displayfield',
					html:'<br/>'
				},{
					text:'<<',
					tooltip:'全部移出',
					handler: function() {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#sdTargetId');
						grid.getSelectionModel().selectAll();
						grid.getStore().removeAll();

					}
				}]//fieldset items
			},{
				width: 370,
				height: 365,
				colspan:2,
				itemId: 'sdTargetId',
				xtype: 'outLinkMenGrid',
				title: '外部联系人',
				border: true,
				plugins: [
					ruleAddrEdit = Ext.create('Ext.grid.plugin.RowEditing', {
						clicksToMoveEditor: 1,
						autoCancel: true,
						listeners: {
							edit: function(editor,obj,opts) {
								var stroe = Ext.StoreMgr.lookup('outLinkMenStoreID');
								var faxN = covertToRightNumber(true,editor.context.record.data.faxNumber);
								editor.context.record.data.faxNumber = faxN;
								for(var p in outLinkStoreCop) {
									if(outLinkStoreCop[p] == faxN) {
										stroe.remove(editor.context.record);
										return;
									}
								}
								stroe.sort('dispName');
							},
							beforeedit: function(editor,obj,opts) {
								ruleAddrEdit.getEditor().saveBtnText = '提交';
								ruleAddrEdit.getEditor().cancelBtnText = '取消';
								ruleAddrEdit.getEditor().errorsText = '错误';
							}
						}
					})
				],
				listeners: {
					itemdblclick: function(view,record,item,index,e,opts) {
						var me = this;
						var w = me.up('window');
						var grid = w.down('#sdTargetId');
						grid.getStore().remove(record);
					}
				}
			}]
		}]
	}],
	buttons: [{
		text: '确定',
		itemId: 'submit',
		formBind: true,
		handler: function() {
			var me = this;
			var w = me.up('window');

			if(w.down('#ugTargetId').getStore().getCount() > 0) {
				w.down('#ugTargetId').getSelectionModel().selectAll();
			}
			var ugRec = w.down('#ugTargetId').getSelectionModel().getSelection();
			var ugUserArr = new Array();
			var ugDirArr = new Array();
			for(var p in ugRec) {
				if(ugRec[p].data.udType == 'user') {
					var userid = ugRec[p].data.udID.substring(5,ugRec[p].data.udID.length);
					ugUserArr.push(userid);
				} else if(ugRec[p].data.udType == 'dic') {
					var did = ugRec[p].data.udID.substring(4,ugRec[p].data.udID.length);
					ugDirArr.push(did);
				}
			}
			
			var userIds = ugUserArr.join('$');
			var str = (buildFaxIDs(ugRec, 'udName')).join();
			var dirIds = ugDirArr.join('$');

			var sdStore = w.down('#sdTargetId').getStore();
			if(sdStore.getCount() > 0) {
				w.down('#sdTargetId').getSelectionModel().selectAll();
			}
			var records = w.down('#sdTargetId').getSelectionModel().getSelection();
			var numberArr = new Array();
			var numberIds = new Array();
			for (var i = 0; i < records.length; i++) {
				var faxNu = records[i].get('faxNumber');
				if(faxNu.length > 0) {
					var phId = records[i].get('phoneBookID');
					if(phId.length > 0) {
						numberIds.push(phId);
						numberArr.push(records[i].get('dispName'));
					}else {
						numberIds.push(faxNu);
						numberArr.push(faxNu);
					}
					
					
				}
			}
			var linkNumbers = numberArr.join();
			var linkNA = numberIds.join('$');

			

			var val = str.length > 0 ? str +(linkNumbers.length > 0 ? ',' + linkNumbers : linkNumbers) : linkNumbers;
			var mapVal = userIds + ',' + linkNA;
			w.ruleWin.down('#forwardFaxID').setValue('联系人:'+'  '+(val.length>20?val.substring(0,20)+"...":val));
			mapVal += ',' + dirIds;
			ruleCAMap.add('act3', mapVal);
			
			w.hide();
		}
	},{
		text: '取消',
		handler: function() {
			var me = this;
			me.up('window').hide();

		}
	}]
});