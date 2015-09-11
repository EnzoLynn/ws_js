//发送传真用win
function loadfaxtodocsinglewin(fileid,privData) {
	function fsMyclose() {
		var resourType = 'INFAX';
		var treeid =getCurrTree().getSelectionModel().getSelection()[0].data.id;
		var sels = currGrid.getSelectionModel().getSelection();
		var faxid = '';
		if(treeid.indexOf('gryf')!=-1) {
			resourType='OUTFAX';
			faxid = sels[0].data.outFaxID;
		} else {
			faxid = sels[0].data.inFaxID;
		}
		function colseTheWin(del) {

			var param1 = {};
			param1.fileId = fileid;
			param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

			if(del) {
				param1.faxid = faxid;
				param1.treeid = treeid;
			}
			//调用
			WsCall.call('deleteTempFiles', param1, function (response, opts) {
				if(del) {
					currGrid.loadGrid();
				}
			}, function (response, opts) {
			}, true);
			faxtodocsinglewin.close();
		}

		if(faxtodocsinglewin.questionDelsrc && privData.folderPrivDelete!=0) {
			newMesB.show({
				title:'提示',
				msg: '是否删除原文件?'+'['+docResourceType[resourType]+','+'流水号:'+faxid+']',
				buttons: Ext.MessageBox.YESNO,
				closable:false,
				fn: function(btn) {
					if(btn=="yes") {
						colseTheWin(true);
					} else {
						colseTheWin();
					}
				},
				icon: Ext.MessageBox.QUESTION
			});
		} else {
			colseTheWin();
		}
	}

	return Ext.create('Ext.window.Window', {
		title: '归档',
		modal:true,
		iconCls:'faxtodoc',
		height: 549,
		//closeAction:'hide',
		shadow:!Ext.isIE,
		pngClass:'',
		pngGroup:'faxtodocsingle',
		runner:false,
		tplstr:'',
		tplid:'none',
		hideMode:'offsets',
		width: 910,
		layout: 'anchor',
		collapsible: false,
		resizable: false,
		frame: false,
		border: false,
		closable:false,
		questionDelsrc:false,
		tools: [{
			type: 'close',
			handler: function() {
				fsMyclose();
			}
		}],
		defaults: {
			frame: false,
			border: false
		},
		dockedItems: [{
			xtype: 'faxtodocsbar',
			height: 26,
			dock: 'bottom'
		}],
		items: [{
			xtype: 'form',
			hidden:true,
			frame: false,
			border: false,
			items: [{
				xtype: 'hiddenfield',
				itemId: 'hidLoaded',
				value: '0'
			},{
				xtype: 'hiddenfield',
				itemId: 'hidFileId',
				value: ''
			},{
				xtype:'hidden',
				value:'0',
				itemId:'hidfolderid'
			}]
		},{
			xtype: 'baseviewpanel',
			border:true
		},{
			xtype:'container',
			defaults: {
				//xtype:'textfield',
				//labelAlign: 'right',
				//labelWidth:100,
				margin:'4 4 4 4'
			},
			layout: {
				type:'table',
				columns:2
			},
			items:[{
				xtype:'container',
				width:600,
				defaults: {
					xtype:'textfield',
					labelAlign: 'right',
					labelWidth:100,
					width:600,
					margin:'4 4 4 4'
				},
				items:[{
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
												}else {
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
											'left': position[0] + 105,
											'top': position[1] + 22
										},
										hidden: true,
										width: 495,
										height: 200
									});
								}

								faxtodocwinTree1.show(null, function () {
									faxtodocwinTree1.setPagePosition(position[0] + 105, position[1] + 22);
								});
								faxtodocwinTree1.un("selectionchange");
								faxtodocwinTree1.on("selectionchange", function (view, seles, op) {
									
									if(seles[0] && seles[0].data.id == 'grsc'){
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
					fieldLabel: '关键字',
					itemId:'keyword',
					colspan:2
				},
				// ,{
				// xtype:'checkbox',
				// margin:'4 4 4 105',
				// width:240,
				// boxLabel: '归档后删除原文件',
				// disabled:privData.folderPrivDelete==0?true:false,
				// itemId:'delSrc'
				// }
				{
					colspan:2,
					fieldLabel: '自定义编号',
					itemId:'customid'
				},{
					xtype:'textarea',
					fieldLabel: '注释',
					itemId:'comment',
					rows:2,
					colspan:2
				}]
			},{
				xtype:'container',
				rowspan:4,
				margin:'50 2 2 60',
				layout:'vbox',
				defaults: {
					xtype:'button',
					width:200,
					margin:'0 0 10 2'
				},
				items:[{
					itemId: 'btnFaxtodoc',
					iconCls: 'faxtodoc',
					text: '归档所选页',
					handler: function() {

						var viewType = faxtodocsinglewin.pngClass;

						if(viewType.getPngSels().getCount() <= 0) {
							Ext.Msg.alert('消息','请选择需要归档的页');
							return;
						}
						//alert(viewType.getPngSels().getCount());
						var imageList = faxtodocsinglewin.down('#filepngviewMini').query('image');
						var pageList = new Array();
						//处理当前png数组
						Ext.Array.each(imageList, function (item, index, allItems) {
							if(viewType.getPngSels().contains(item)) {
								pageList.push(item.ownerCt.down('label').text);
								//item.ownerCt.setDisabled(true);
								//item.el.setStyle('border', '1px solid black'); //取消选中
							}
						});
						var sels = currGrid.getSelectionModel().getSelection();
						var cgrid = currGrid.itemId.toLowerCase();
						var param = {};
						if(cgrid == 'infaxgrid') {
							param.faxid = sels[0].data.inFaxID;
						}
						if(cgrid == 'succoutfaxgrid') {
							param.faxid = sels[0].data.outFaxID;
						}

						param.treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
						param.fileid = faxtodocsinglewin.down('#hidFileId').getValue();
						param.attach = sels[0].data.attach;
						param.pages = pageList.join();
						param.folderid = faxtodocsinglewin.down('#hidfolderid').getValue();
						param.comment = faxtodocsinglewin.down('#comment').getValue();
						param.refdocid = '';
						param.keyword = faxtodocsinglewin.down('#keyword').getValue();
						//param.autoid = faxtodocsinglewin.down('#autoid').getValue();
						param.customid = faxtodocsinglewin.down('#customid').getValue();
						param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

						WsCall.call('createdocsingle', param, function(response, opts) {

							//处理当前png数组
							Ext.Array.each(imageList, function (item, index, allItems) {
								if(viewType.getPngSels().contains(item)) {
									item.ownerCt.setDisabled(true);
									item.el.setStyle('border', '1px solid black'); //取消选中
								}
							});
							//重置选择数组
							viewType.getPngSels().clear();
							faxtodocsinglewin.questionDelsrc = true;
							faxtodocsinglewin.down('#btnAllFaxtodoc').setDisabled(true);

						}, function(response, opts) {
							if(!errorProcess(response.code)) {
								Ext.Msg.alert('失败', response.msg);
							}
						}, true,'加载中...',Ext.getBody(),50);
						//return;

					}
				},{
					itemId: 'btnAllFaxtodoc',
					iconCls: 'faxtodoc',
					text: '全部归档',
					handler: function() {
						var viewType = faxtodocsinglewin.pngClass;

						//alert(viewType.getPngSels().getCount());
						var imageList = faxtodocsinglewin.down('#filepngviewMini').query('image');
						var pageList = new Array();
						//处理当前png数组
						Ext.Array.each(imageList, function (item, index, allItems) {
							//if(viewType.getPngSels().contains(item)) {
							pageList.push(item.ownerCt.down('label').text);
							//item.ownerCt.setDisabled(true);
							//item.el.setStyle('border', '1px solid black'); //取消选中
							//}
						});
						var sels = currGrid.getSelectionModel().getSelection();
						var cgrid = currGrid.itemId.toLowerCase();
						var param = {};
						if(cgrid == 'infaxgrid') {
							param.faxid = sels[0].data.inFaxID;
						}
						if(cgrid == 'succoutfaxgrid') {
							param.faxid = sels[0].data.outFaxID;
						}

						param.treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
						param.fileid = faxtodocsinglewin.down('#hidFileId').getValue();
						param.attach = sels[0].data.attach;
						param.pages = pageList.join();
						param.crall = true;
						param.folderid = faxtodocsinglewin.down('#hidfolderid').getValue();
						param.comment = faxtodocsinglewin.down('#comment').getValue();
						param.refdocid = '';
						param.keyword = faxtodocsinglewin.down('#keyword').getValue();
						//param.autoid = faxtodocsinglewin.down('#autoid').getValue();
						param.customid = faxtodocsinglewin.down('#customid').getValue();
						param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

						WsCall.call('createdocsingle', param, function(response, opts) {
							//处理当前png数组
							Ext.Array.each(imageList, function (item, index, allItems) {
								item.ownerCt.setDisabled(true);
								item.el.setStyle('border', '1px solid black'); //取消选中
							});
							//重置选择数组
							viewType.getPngSels().clear();

							faxtodocsinglewin.questionDelsrc = true;
							fsMyclose();
						}, function(response, opts) {
							if(!errorProcess(response.code)) {
								Ext.Msg.alert('失败', response.msg);
							}
						}, true,'加载中...',Ext.getBody(),50);
					}
				},{
					text:'关闭',
					handler: function() {
						fsMyclose();
					}
				}]
			}]
		}],
		listeners: {
			afterrender: function(com,opts) {

				com.getEl().on('click', function () {
					if (faxtodocwinTree1 != '') {
						faxtodocwinTree1.destroy();
					}
					faxtodocwinTree1 = '';
					docTreeLoading = 0;

				});
				var header = com.header;

				header.getEl().on('mousedown', function () {

					if (faxtodocwinTree1 != '') {
						faxtodocwinTree1.destroy();
					}
					faxtodocwinTree1 = '';
					docTreeLoading = 0;

				});
				com.down('#filePath').hide();
				com.down('#fileLocalPath').hide();
				com.down('#replacePal').hide();
				//com.down('#filepngdeleteFilepng').hide();
				//com.down('#delAllFile').hide();
				var hidLoaded = com.down('#hidLoaded')
				//var fileId = hidForm.getValue();
				var hidForm = com.down('#hidFileId');
				var fid = hidForm.getValue();
				var maskTarget = com;
				var upfiletype = '0';
				//fileid;

				var tmpCurPage = 1;
				if(fid == '') {
					com.pngClass = new filepngviewclass();
				} else {
					com.pngClass.setIsLoaded(0);
					tmpCurPage = com.pngClass.miniCurPage;
					if(com.pngClass.miniCurPage == com.pngClass.miniTotalPage) {
						com.pngClass.ifLoading = 1;
						var palPngContainer = com.down('#filepngviewMini');
						palPngContainer.removeAll();
					}
				}

				com.pngClass.setFaxFileId(fileid);
				hidForm.setValue(fileid);
				//初始化图片浏览panel
				hidLoaded.setValue('1');
				com.pngClass.initMyfilepngMini(maskTarget, hidLoaded,upfiletype,fid, function() {
					setPngMiniWH(com.pngClass,com,'bar');
				},true,'正在生成缩略图...',com.getEl(),10,tmpCurPage);
				//设置前后插入等按钮状态
				ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
				if(hidForm.getValue() == '') {
					com.down('#txtMiniCurrPage').setDisabled(true);
				} else {
					com.down('#txtMiniCurrPage').setDisabled(false);
				}
			},
			activate: function(com,eOpts) {
				var winType = com;
				if(winType) {
					var viewType = winType.pngClass;
					if(viewType != '') {
						var tCount = viewType.getTotalCount();
						var tmpPage = winType.down('#txtCurrPage').getValue();
						var cPage = tmpPage;
						ActionBase.updateActions('filepngview', viewType.viewType,viewType.getPngSels().getCount(),tCount,cPage);
					} else {
						ActionBase.updateActions('filepngview', 0,0,0,-1);
					}
					var hidForm = winType.down('#hidFileId');
					ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
				}
			},
			destroy: function () {
				faxtodocsinglewin = '';
				if (faxtodocwinTree1 != '') {
					faxtodocwinTree1.destroy();
				}
				faxtodocwinTree1 = '';
				docTreeLoading = 0;
				Ext.StoreMgr.removeAtKey ('faxtodocwinTree_store');
			},
			show: function (win, opts) {

				if(faxtodocsinglewin.vvType && faxtodocsinglewin.vvType !=0) {
					ActionBase.updateActions('filepngview', faxtodocsinglewin.vvType.viewType,faxtodocsinglewin.vvType.selsCount,faxtodocsinglewin.vvType.totoalPage,faxtodocsinglewin.vvType.currPage);
				} else {
					ActionBase.updateActions('filepngview', 0,0,0,-1);
					//mini
					win.down('#txtMiniCurrPage').setValue(1);
					win.down('#txtMiniCurrPage').setVisible(true);
					win.down('#tbMiniPageTotal').setVisible(true);
					//fit
					win.down('#filepngviewfistPage').setVisible(false);
					win.down('#filepngviewprePage').setVisible(false);
					win.down('#tbPageTotal').setVisible(false);
					win.down('#txtCurrPage').setVisible(false);
					win.down('#filepngviewnextPage').setVisible(false);
					win.down('#filepngviewlastPage').setVisible(false);

				}

				//var progressBar = win.down('#bottomProgressBar');
				//progressBar.hide();
				//win.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
				ActionBase.updateActions('acdocaddwin', win.down('#hidFileId').getValue());
				if(win.down('#hidFileId').getValue() == '') {
					win.down('#txtMiniCurrPage').setDisabled(true);
				} else {
					win.down('#txtMiniCurrPage').setDisabled(false);
				}

				win.down('#panelfilepngview').doLayout();

			}
		}
	});

}