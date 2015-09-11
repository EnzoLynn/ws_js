// 字段名称左边gridstore
Ext.create('Ext.data.ArrayStore', {
			fields : [{
						name : 'cellName',
						type : 'string'
					}, {
						name : 'cellIndex',
						type : 'string'
					}],
			storeId : 'cellLeftStoreId'
		});
// 字段名称grid左边
Ext.define('WS.address.CellLeftGrid', {
			alternateClassName : ['CellLeftGrid'],
			alias : 'widget.CellLeftGrid',
			extend : 'Ext.grid.Panel',
			store : 'cellLeftStoreId',
			height : 355,
			width : 250,
			columnLines : true,
			multiSelect : false,
			viewConfig : {
				loadingText : '正在加载数据...'
			},
			columns : [{
						header : '字段名',
						dataIndex : 'cellName',
						flex : 1
					}]
		});
// 字段名称右边gridstore
var rightData = [['', '姓', 'lastName'], ['', '性别', 'gender'],
		['', '名', 'firstName'], ['', '显示名', 'dispName'],
		['', '客户编号', 'spareFaxNumber'], ['', '职位', 'title'],
		['', '省/州', 'state'], ['', '市/区', 'city'], ['', '传真号码', 'faxNumber'],
		['', '传真分机', 'faxNumberExt'], ['', '注释', 'comment'],
		['', '组织', 'organization'], ['', '部门', 'department'],
		['', '国家', 'country'], ['', '邮政编码', 'zipCode'], ['', '地址', 'address'],
		['', '国家代码', 'countryCode'], ['', '电话号码', 'phoneNumber'],
		['', '电话号码分机', 'phoneNumberExt'], ['', '手机号码', 'mobileNumber'],
		['', '即时通讯号码', 'IMNumber'], ['', 'Email', 'email'], ['', '个人网址', 'web']];
Ext.create('Ext.data.ArrayStore', {
			fields : [{
						name : 'cellName',
						type : 'string'
					}, {
						name : 'allCellName',
						type : 'string'
					}, {
						name : 'hideName',
						type : 'string'
					}, {
						name : 'hideIndex',
						type : 'string'
					}],
			storeId : 'cellRightStoreId',
			data : rightData
		});
// 字段名称grid右边
Ext.define('WS.address.CellRightGrid', {
			alternateClassName : ['CellRightGrid'],
			alias : 'widget.CellRightGrid',
			extend : 'Ext.grid.Panel',
			store : 'cellRightStoreId',
			height : 355,
			width : 380,
			columnLines : true,
			multiSelect : false,
			viewConfig : {
				loadingText : '正在加载数据...'
			},
			columns : [{
						header : '字段名',
						dataIndex : 'cellName',
						flex : 0.5
					}, {
						header : '对应字段名',
						dataIndex : 'allCellName',
						flex : 0.5
					}]
		});

Ext.define('WS.address.ImportAddrWin', {	
	extend : 'Ext.window.Window',
	title : '导入通讯录',
	height : 500,
	width : 720,
	iconCls : 'importAddrICON',
	//bodyCls : 'panelFormBg',
	border : false,
	resizable : false, // 窗口大小不能调整
	modal : true, // 设置window为模态
	listeners : {
		destroy : function(me, op) {
			Ext.data.StoreManager.lookup('cellLeftStoreId').loadData([]);
			Ext.data.StoreManager.lookup('cellRightStoreId').load();
		},
		show: function() {
			this.down('form').getForm().reset();
		}
	},
	items : [{
		xtype : 'form',
		//bodyCls : 'panelFormBg',
		border : false,
		padding : 10,
		items : [{
			layout : 'hbox',
			//bodyCls : 'panelFormBg',
			border : false,
			items : [{
				xtype : 'filefield',
				name : 'importAddr',
				fieldLabel : '请选择导入的文件',
				width : 400,
				labelWidth : 150,
				blankText : '请选择导入的文件',
				msgTarget : 'side',
				itemId : 'fileupId',
				buttonText : '...',
				listeners : {
					change : function(me, val, op) {
						var supType = new Array('xls', 'xlsx', 'csv');
						var fType = me.getValue().substring(
								me.getValue().lastIndexOf('.') + 1,
								me.getValue().length).toLowerCase();
						var returnFlag = true;
						Ext.Array.each(supType, function(item, index, items) {
									if (item == fType) {
										returnFlag = false;
										return;
									}
								});
						if (returnFlag) {
							Ext.Msg.alert('添加文件', '不支持的文件格式！');
							return;
						}
						var f = me.up('form');
						var form = f.getForm();
						urlStr = WsConf.Url
								+ "?req=call&callname=importAddrup&sessiontoken="
								+ getSessionToken() + '&fType=' + fType;
						form.submit({
									url : urlStr,
									waitMsg : '正在上传...',
									waitTitle : '等待文件上传,请稍候...',
									success : function(fp, o) {
										var leftStore = f.down('#leftGridId')
												.getStore();
										var cellData = Ext.JSON
												.decode(o.result.data);
										leftStore.loadData(cellData);
									},
									failure : function(fp, o) {
										if (!errorProcess(o.result.code)) {
											Ext.Msg.alert('失败', o.result.msg);
										}
									}
								});
					}
				}
			}, {
				width : 250,
				margin : '1 0 5 20',
				xtype : 'label',
				text : '(支持的文件格式:xls, xlsx, csv)'
			}]
		}, {
			padding : '1 0 10 0',
			xtype : 'displayfield',
			labelWidth : 200,
			width : 500,
			fieldLabel : '请确定需要字段及其对应关系'
		}, {
			layout : 'hbox',
			//bodyCls : 'panelFormBg',
			border : false,
			items : [{
						xtype : 'CellLeftGrid',
						itemId : 'leftGridId'
					}, {
						xtype : 'panel',
						width : 60,
						height : 350,
						layout : {
							type : 'vbox',
							align : 'center'
						},
						border : false,
						//bodyCls : 'panelFormBg',

						defaults : {
							xtype : 'button',
							width : 50
						},
						items : [{
									margin: '10 0 0 0',
									text : '>',
									tooltip : '建立对应关系',
									handler : function() {
										var me = this;
										var w = me.up('window');
										var left = w.down('#leftGridId');
										var right = w.down('#rightGridId');
										var lsm = left.getSelectionModel();
										var rsm = right.getSelectionModel();
										if (lsm.hasSelection()
												&& rsm.hasSelection()) {
											if (rsm.getSelection()[0].data.cellName != '') {
												left.getStore().add({
													'cellName' : rsm
															.getSelection()[0].data.cellName,
													'cellIndex' : rsm
															.getSelection()[0].data.hideIndex
												});
											}
											rsm.getSelection()[0]
													.set(
															'cellName',
															lsm.getSelection()[0].data.cellName);
											rsm.getSelection()[0]
													.set(
															'hideIndex',
															lsm.getSelection()[0].data.cellIndex);
											// right.getStore().load();
											left.getStore().remove(lsm
													.getSelection());
										}
									}
								}, {
									margin: '20 0 0 0',
									text : '<',
									tooltip : '删除对应关系',
									handler : function() {
										var me = this;
										var w = me.up('window');
										var left = w.down('#leftGridId');
										var right = w.down('#rightGridId');
										var rsm = right.getSelectionModel();
										if (rsm.hasSelection()) {
											left.getStore().add({
												'cellName' : rsm.getSelection()[0].data.cellName,
												'cellIndex' : rsm
														.getSelection()[0].data.hideIndex
											});
											rsm.getSelection()[0].set(
													'cellName', '');
										}
									}
								}]

					}, {
						xtype : 'CellRightGrid',
						itemId : 'rightGridId'
					}]
		}]
	}],
	buttons : [{
				text : '确定',
				itemId : 'submit',
				formBind : true,
				handler : function() {
					var me = this;
					var w = me.up('window');
					var storeArr = w.down('#rightGridId').getStore();
					var relation = '';
					var records = storeArr.data.items;
					var dispName = '';
					for (var p in records) {
						var cell = records[p].data.cellName;
						var index = records[p].data.hideIndex;
						var rex = records[p].data.hideName;
						if (cell.length > 0) {
							if (relation.length <= 0) {
								relation = rex + ',' + index;
							} else {
								relation += ';' + rex + ',' + index;
							}
						}
						if (rex == 'dispName') {
							dispName = cell;
						}
					}

					if (relation.length <= 0) {
						Ext.Msg.alert('错误', '请选择至少一个对应关系');
						return;
					}
					if (dispName.length <= 0) {
						Ext.Msg.alert('错误', '显示名必须选择对应关系');
						return;
					}
					var param = {
						sessiontoken : getSessionToken(),
						relation : relation,
						hidSelTree: w.selTreeNode
					}
					WsCall.call('importAddr', param, function(response, opts) {
								Ext.Msg.alert('成功', '导入通讯录成功');
								w.grid.loadGrid();
							}, function(res) {
								if (!errorProcess(res.code)) {
									Ext.Msg.alert('失败', res.msg);
								}
							}, true, '数据正在导入请稍候');
					w.close();

				}
			}, {
				text : '取消',
				handler : function() {
					var me = this;
					me.up('window').close();
				}
			}]
});