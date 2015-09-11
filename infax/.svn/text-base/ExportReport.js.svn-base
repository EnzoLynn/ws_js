var prog = '';
var cancelF = false;
var fileCount = 0;  	//导出文件个数
var total = 0;	//导出总记录数
var index = 0;
Ext.define('WS.infax.ExportReport', {
	extend : 'Ext.window.Window',
	alternateClassName : ['Exp'],
	title : '导出报表',
	height : 360,
	width : 620,
	iconCls : 'exportICON',
	//bodyCls : 'panelFormBg',
	border : false,
	resizable : false, // 窗口大小不能调整
	modal : true, // 设置window为模态
	statics : {
		expFile : function(gridT, f, file) {
			if(cancelF) {
				return;
			}
			if (index >= total) {
				if (file) {
					Exp.notice(file, total, fileCount);
					return;
				}
			}
			var paramP = {
				sessiontoken : getSessionToken(),
				gridType : gridT,
				idIndex: index
			}
			WsCall.call('exportFile', paramP, function(response, opts) {
						index = parseInt(response.msg);
						f(index);
						if (index == total) {
							fileCount = response.code;
						}
						Exp.expFile(gridT, f, response.data);
					}, function(res) {
						if (!errorProcess(res.code)) {
							Ext.Msg.alert('导出失败', res.msg);
						}
						f(total - 1);
					}, false);
		},
		rcFile : function(file) {
			var paramo = {
				resFile : file,
				sessiontoken : getSessionToken()
			};
			WsCall.downloadFile('rcExportReport', paramo);
		},
		notice: function(file, total, fileCount) {
			expMesB.show({
				buttonText:{
					ok : '下载',
					cancel :'取消'
				},
				title : '是否下载文件',
				iconCls : 'coverStamp',
				msg : fileCount > 0 ?  '共导出记录'+': '+ total +' '+ '条'+'</br>'+'导出传真文件'+': ' + fileCount + ' '+'个' : '共导出记录' + ' '+total + ' '+'条',
				width : 300,
				closable : false,
				buttons: total > 0 ? Ext.MessageBox.OKCANCEL : Ext.MessageBox.CANCEL,
				icon: Ext.MessageBox.INFO,
				fn: function(btn) {
					if(btn == 'ok') {
						Exp.rcFile(file);
					}
					if(btn=='cancel') {
						cancelF = true;
						if(total > 0) {
							var paramC = {
								sessiontoken : getSessionToken(),
								expFile: file
							};
							WsCall.call('cancelexport', paramC, function(response, opts) {
								
							}, function(res) {
								if (!errorProcess(res.code)) {
									Ext.Msg.alert('失败', res.msg);
								}
							}, true, '操作正在进行');
						}
					}
				}
			});
		}
	},
	items : [{
		xtype : 'form',
		bodyPadding : 5,
		url : WsConf.Url,
		itemId : 'formID',
		layout : 'hbox',
		items : [{
					xtype : 'fieldset',
//					border : false,
					height : 280,
//					padding : '10 5 30 10',
					autoScroll : true,
					title : '请选择需要导出的列',
					width : 250,
					defaultType : 'checkbox',
					itemId : 'selColumnId'
				}, {
					border : false,
					margin : '0 0 0 15',
					items : [{
								xtype : 'fieldset',
								title : '选择导出文件的类型',
								width : 300,
								defaultType : 'radio',
								itemId : 'exportTypeId',
								items : [{
											boxLabel : 'Microsoft CSV (*.csv)',
											name : 'export',
											inputValue : 'csv'
										}, {
											boxLabel : 'Microsoft Excel (*.xls)',
											name : 'export',
											inputValue : 'xls',
											checked : true
										}]
							}, {
								margin : '25 0 0 0',
								xtype : 'fieldset',
								title : '选择导出记录',
								width : 300,
								defaultType : 'radio',
								itemId : 'expRecordsId',
								layout : {
									type : 'table',
									columns : 2
								},
								items : [{
											boxLabel : '所有记录',
											name : 'records',
											inputValue : 'all',
											checked : true
										}, {
											margin : '0 0 0 15',
											xtype : 'label',
											text : '',
											itemId : 'allRecordsID'
										}, {
											boxLabel : '被选中的记录',
											name : 'records',
											itemId : 'selRecId',
											inputValue : 'sel'
										}, {
											margin : '0 0 0 15',
											xtype : 'label',
											text : '',
											itemId : 'selRecordsID'
										}]
							}, {
								margin : '20 0 0 0',
								xtype : 'panel',
								border : false,
								defaults : {
									xtype : 'button',
									width : 120
								},
								layout : {
									type : 'table',
									columns : 2
								},
								items : [{
									colspan : 2,
									xtype : 'checkbox',
									boxLabel : '包含子目录',
									labelWidth: 150,
									width: 200,
									name : 'allFolder',
									itemId : 'allFolderId',
									hidden: true
								},{
									colspan : 2,
									xtype : 'checkbox',
									boxLabel : '导出传真文件',
									name : 'expFaxFile',
									itemId : 'expFaxFileId',
									listeners : {
										change : function() {
											if (this.getValue()) {
												this.up('window')
														.down('#selColumnId')
														.getComponent(0)
														.setValue(true);
											}
										}
									}
								}, {
									margin : '10 0 3 0',
									text : '全选/取消',
									handler : function() {
										var selCol = this.up('window')
												.down('#selColumnId').items.items;
										var flag = false;
										for (var p in selCol) {
											if (!selCol[p].getValue()) {
												for (var m in selCol) {
													selCol[m].setValue(true);
												}
												return;
											}
											flag = true;
										}
										if (flag) {
											for (var m in selCol) {
												selCol[m].setValue(false);
											}
										}
									}
								}, {
									margin : '10 0 3 10',
									text : '反选',
									handler : function() {
										var selCol = this.up('window')
												.down('#selColumnId').items.items;
										for (var p in selCol) {
											if (selCol[p].getValue()) {
												selCol[p].setValue(false);
											} else {
												selCol[p].setValue(true);
											}
										}
									}
								}]
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
			var columns = '';
			var colTexts = '';
			var selCol = w.down('#selColumnId').items.items; // 获取到
																// ‘selColumnId’fieldset
																// 的所有checkbox
			for (var p in selCol) {
				if (selCol[p].getValue()) {
					if (columns.length > 0) {
						columns += ',' + selCol[p].getName();
						colTexts += ',' + selCol[p].boxLabel;
					} else {
						columns = selCol[p].getName();
						colTexts = selCol[p].boxLabel;
					}
				}
			}
			if (columns.length <= 0) {
				Ext.Msg.alert('错误', '请选择需要导出的列');
				return;
			}

			var types = w.down('#exportTypeId').items.items;
			var reportT = '';

			for (var p in types) {
				if (types[p].getValue()) {
					reportT = types[p].getSubmitValue(); // 获取选中的 radio 的inputvalue
					break;
				}
			}
			if (reportT.length <= 0) {
				Ext.Msg.alert('错误', '请选择需要导出文件的类型');
				return;
			}
			if (w.down('#expFaxFileId').getValue()
					&& !w.down('#selColumnId').getComponent(0).getValue()) {
				Ext.Msg.alert('错误', '请选中流水号');
				return;
			}
			var records = w.down('#expRecordsId').items.items;
			var count = '';
			for (var p in records) {
				if (records[p].getXType() != 'label' && records[p].getValue()) {
					count = records[p].getSubmitValue(); // 获取选中的 radio的inputvalue
					break;
				}
			}
			var extraPa = w.grid.getStore().getProxy().extraParams;
			var fileF = w.down('#expFaxFileId').getValue();
			var isFilterFlag = w.down('#allFolderId').isHidden();
			var param = {
				type : reportT,
				gridType : w.gridType,
				selColumns : columns,
				selColumnsText : colTexts,
				sessiontoken : getSessionToken(),
				count : count,
				selRecIds : Ext.JSON.encode(w.selRecIds),
				filters: extraPa.filter,
				isFilter: isFilterFlag,
				allFolder: w.down('#allFolderId').getValue(),
				expFile: fileF,
				folderId : extraPa.folderid,
				template: extraPa.template
			};

			WsCall.call('exportReport', param, function(response, opts) {
						cancelF = false;
						total = parseInt(response.msg);
						if(total == 0) {
							Exp.notice('', 0, 0);
						}else {
							if (fileF) {
								prog = newMesB.show({
											title : '导出传真文件',
											iconCls : 'coverStamp',
											msg : '请稍候...',
											progressText : '正在准备数据',
											width : 300,
											progress : true,
											closable : false,
											buttons: Ext.MessageBox.CANCEL,
											fn: function(btn) {
												if(btn=='cancel') {
													cancelF = true;
													var paramC = {
														sessiontoken : getSessionToken()
													};
													WsCall.call('cancelexport', paramC, function(response, opts) {
														
													}, function(res) {
														if (!errorProcess(res.code)) {
															Ext.Msg.alert('失败', res.msg);
														}
													}, true, '操作正在进行');
												}
											}
										});
								var f = function(v) {
									var l = total;
									if (v == l) {
										prog.updateProgress(1, '已完成 '
														+ total + '/' + total
														);
										(new Ext.util.DelayedTask()).delay(100,
												function() {
													prog.hide();
												});
									} else {
										var i = v / l;
										prog.updateProgress(i, '已完成 '
														+ index + '/' + total
														);
									}
								};
								index = 0;
								Exp.expFile(w.gridType, f);
							}
							if (!fileF) {
								fileCount = 0;
								Exp.notice(response.data, total, fileCount);
							}
						}
						
					}, function(res) {
						if (!errorProcess(res.code)) {
							Ext.Msg.alert('导出失败', res.msg);
						}
					}, true, '数据正在导出请稍候');
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