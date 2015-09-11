// function readFileFirefox(fileBrowser) {
// try {
// netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
// } catch (e) {
// Ext.Msg.alert('提示','由于浏览器安全问题 请按照以下设置'+':<br/>[1] '+'地址栏输入 "about:config";'+'<br/>[2] '+'右键 新建 -> 布尔值 ;'+' <br/>[3] '+'输入'+' "signed.applets.codebase_principal_support" ('+'忽略引号'+').');
// return '';
// }
//
// var fileName=fileBrowser.value;
// var file = Components.classes["@mozilla.org/file/local;1"]
// .createInstance(Components.interfaces.nsILocalFile);
// try {
// file.initWithPath( fileName.replace(/\//g, "\\\\") );
// } catch(e) {
// if (e.result!=Components.results.NS_ERROR_FILE_UNRECOGNIZED_PATH) throw e;
// return;
// }
//
// if ( file.exists() == false ) {
// alert("File '" + fileName + "' not found.");
// return;
// }
// return file.path;
// }

//=====================================================================//
//设置click禁用标识
var stopClick = false;

function imgVgetTargetView() {
	var topArr = new Ext.util.MixedCollection();
	if(sendfaxwin) {
		topArr.add(sendfaxwin.el.getPositioning()["z-index"], sendfaxwin);
	}
	if(docaddwin) {
		topArr.add(docaddwin.el.getPositioning()["z-index"], docaddwin);
	}
	if(faxtodoceditor) {
		topArr.add(faxtodoceditor.el.getPositioning()["z-index"], faxtodoceditor);
	}
	if(wfhandlerwin) {
		topArr.add(wfhandlerwin.el.getPositioning()["z-index"], wfhandlerwin);
	}
	if(docopenwin) {
		topArr.add(docopenwin.el.getPositioning()["z-index"], docopenwin);
	}
	if(faxtodocsinglewin) {
		topArr.add(faxtodocsinglewin.el.getPositioning()["z-index"], faxtodocsinglewin);
	}
	if(inputDataWin && inputDataWin !='' && inputDataWin.el && inputDataWin.isVisible()) {
		topArr.add(inputDataWin.el.getPositioning()["z-index"], inputDataWin);
	}

	if(doc_inputDataWin && doc_inputDataWin !='' && doc_inputDataWin.el && doc_inputDataWin.isVisible()) {
		topArr.add(doc_inputDataWin.el.getPositioning()["z-index"], doc_inputDataWin);
	}

	if(wf_inputDataWin && wf_inputDataWin !='' && wf_inputDataWin.el && wf_inputDataWin.isVisible()) {
		//alert(wf_inputDataWin.isVisible);
		topArr.add(wf_inputDataWin.el.getPositioning()["z-index"], wf_inputDataWin);
	}

	if(seefillfaxwin && seefillfaxwin !='' && seefillfaxwin.el && seefillfaxwin.isVisible()) {
		//alert(wf_inputDataWin.isVisible);
		topArr.add(seefillfaxwin.el.getPositioning()["z-index"], seefillfaxwin);
	}

	topArr.sortByKey();
	return topArr.last();
}

//重置缩略图
function resetMiniForFP(pages,winType) {
	var palMini = winType.down('#filepngviewMini');
	var imageList = palMini.query('image');
	Ext.Array.each(imageList, function (item, index, allItems) {
		if(Ext.Array.contains(pages,item.ownerCt.down('label').text)) {
			var srcStr = item.src;
			if (srcStr.search("&randomTime") >= 0) {
				srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
			}
			item.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
		}
	});
}

//sendfaxwin actionbase
Ext.define('WS.tbnorth.acsendfaxwin', {
	extend: 'WS.action.Base',
	category: 'acsendfaxwin'
});
//acsendfaxwin保存草稿
Ext.create('WS.tbnorth.acsendfaxwin', {
	xtype: 'button',
	text: "保存草稿",
	disabled:true,
	scale:'medium',
	height:32,
	itemId: 'saveDraft',
	iconCls: 'saveDraft',
	handler: function () {

		//var me = sendfaxwin;
		var form1 = sendfaxwin.down('#formFaxSubFile').getForm();
		var form2 = sendfaxwin.down('#formFaxInfo').getForm();
		var form3 = sendfaxwin.down('#formFileId').getForm();
		var inforward = sendfaxwin.down('#hidFaxIDS').getValue();
		var dirIds = sendfaxwin.down('#hidDirIDS').getValue();
		var faxNumber = sendfaxwin.down('#faxNumber').getValue();

		function saveDraft1() {
			var param = {};
			if(faxNumber != '') {
				var linkmanClass = {
					faxNumber:faxNumber,
					subNumber:sendfaxwin.down('#subNumber').getValue(),
					faxReceiver:sendfaxwin.down('#faxReceiver').getValue(),
					email:sendfaxwin.down('#e-mail').getValue(),
					mobile:sendfaxwin.down('#mobile').getValue(),
					organization:sendfaxwin.down('#organization').getValue()
				};
				LinkMenArr.push(linkmanClass);
			}

			param.linkmen = Ext.JSON.encode(LinkMenArr);
			param.faxSubject = sendfaxwin.down('#faxSubject').getValue();
			param.fileId = sendfaxwin.down('#hidFileId').getValue();
			param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

			param.userIDs = sendfaxwin.down('#hidFaxIDS').getValue();
			param.dirIDs = sendfaxwin.down('#hidDirIDS').getValue();
			//调用
			WsCall.call('saveDraft', param, function (response, opts) {
				Ext.Msg.alert('成功', '保存草稿成功！');
				LinkMenArr = new Array();
				if (sendfaxwin != '') {
					var param1 = {};
					param1.fileId = sendfaxwin.down('#hidFileId').getValue();
					param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
					sendfaxwin.isSend = true;
					sendfaxwin.hide();
					//sendfaxwin.fireEvent('beforehide',sendfaxwin);

					//调用
					WsCall.call('deleteTempFiles', param1, function (response, opts) {

					}, function (response, opts) {
						//Ext.Msg.alert('失败', response.msg);
					}, true);
				}

			}, function (response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
			}, true,"请稍候...",sendfaxwin);
		}

		//判断 提交 附件信息
		slaveUplPro(faxforwardwin,saveDraft1);

		// //判断 提交 附件信息
		// var files = faxforwardwin.down('#fsFiles').query('form');
		// var fCount = 0;
		// var formArr = new Array();
		// Ext.Array.each(files, function(file,index,alls) {
		// if(file.down('filefield').getValue() != '') {
		// formArr.push(file);
		// }
		// });
		// if(formArr.length > 0) {
		// var prStamp = newMesB.show({
		// title: '上传附件',
		// iconCls:'coverStamp',
		// msg: '请稍候...',
		// progressText: '正在上传...',
		// width:300,
		// progress:true,
		// closable:false
		// });
		// // this hideous block creates the bogus progress
		// var f = function(v) {
		// var cV = v+1;
		// if(cV == formArr.length) {
		// var i = cV/formArr.length;
		// prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
		// (new Ext.util.DelayedTask()).delay(2000, function() {
		// prStamp.hide();
		// });
		// } else {
		// var i = cV/formArr.length;
		// prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
		// }
		// };
		// var urlStr = WsConf.Url + "?req=call&callname=slaveupload&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "";
		// function ireFormFileupload(form) {
		// var newUrl;
		// if(fCount == 0) {
		// newUrl = urlStr +'&delete=1';
		// } else {
		// newUrl = urlStr;
		// }
		// if(fCount < formArr.length) {
		// form.submit({
		// url: newUrl,
		// success: function(fp, o) {
		// fCount++;
		// ireFormFileupload(formArr[fCount]);
		// },
		// failure: function(form, action) {								//f(formArr.length-1);
		// f(formArr.length-1);
		//
		// if(!errorProcess(action.result.code)) {
		// Ext.Msg.alert('失败', '上传文件失败');
		// }
		//
		// //fCount++;
		// //ireFormFileupload(formArr[fCount]);
		//
		// }
		// });
		// f(fCount);
		// }
		// if(fCount == formArr.length) {
		// f(formArr.length-1);
		// (new Ext.util.DelayedTask()).delay(2000, function() {
		// saveDraft1();
		// });
		// }
		//
		// }
		//
		// ireFormFileupload(formArr[fCount]);
		//
		// } else {
		// saveDraft1();
		// }

	}
	,
	updateStatus: function (hidFileId) {
		this.setDisabled(hidFileId ==""?true:false);
	}
});
//acsendfaxwin 清除所有
Ext.create('WS.tbnorth.acsendfaxwin', {
	itemId: 'delAllFile',
	tooltip: '清除所有已上传文件',
	iconCls:'clearAllFile',
	//text: '清除所有',
	disabled:true,
	handler: function() {
		var me = this;

		var winType,viewType;
		winType = me.getTargetView();
		viewType = me.getTargetView().pngClass;

		newMesB.show({
			title:'清除所有',
			msg: '确定要清除所有已有上传文件吗？',
			buttons: Ext.MessageBox.YESNO,
			closable:false,
			fn: function(btn) {
				if (btn =="yes") {

					var hidForm = winType.down('#hidFileId');
					if(hidForm.getValue() != "") {
						//清空
						var palPngContainer = winType.down('#filepngviewMini');
						palPngContainer.removeAll();
						//清空缩略图数组
						viewType.getPngAllMini().clear();
						//清空大图数组
						viewType.getPngSelBig().clear();
						//清空选择数组
						viewType.getPngSels().clear();
						//单页视图Img对象
						viewType.setPngContainerBig("");
						//单页图全局currPage
						viewType.setCurrCountBig(0);
						//当前传真总页数
						viewType.setCurrFaxFileTotal(1);
						viewType.setTotalCount(0);

						//
						viewType.setMiniCurPage(1);
						viewType.setMiniTotalPage(0);
						winType.down('#tbMiniPageTotal').setText('共'+'   ' + 0);
						//

						var tbPageTotal = winType.down('#tbPageTotal');
						tbPageTotal.setText('共'+'   ' + 0);
						viewType.setInsertStartPage(0);
						viewType.setTotalCount(0);
						viewType.setCurrFaxFileTotal(1);
						//toolbar 按钮状态
						ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),viewType.getTotalCount(),-1);
						var param1 = {};
						param1.fileId = hidForm.getValue();
						param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
						//调用
						WsCall.call('deleteTempFiles', param1, function (response, opts) {

						}, function (response, opts) {
							//Ext.Msg.alert('失败', response.msg);
						}, true);
						//清除filePath 文本和 fileId

						hidForm.setValue("");
						//设置前后插入等按钮状态
						ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
						if(hidForm.getValue() == '') {
							winType.down('#txtMiniCurrPage').setDisabled(true);
						} else {
							winType.down('#txtMiniCurrPage').setDisabled(false);
						}
						//重新设置totalPage
						//tbFaxFileTabPng
						//调用切换视图
						if(viewType.getViewType() == 1) {
							ActionBase.getAction('filepngviewviewTypeChange').execute(null,null,true);
						}

						winType.down('#filepngviewMini').setHeight(0);
						winType.down('#filepngviewMini').doLayout();
						winType.down('#panelfilepngview').doLayout();

					}
				}
			},
			icon: Ext.MessageBox.QUESTION
		});

	},
	updateStatus: function (hidFileId) {
		this.setDisabled(hidFileId ==""?true:false);
	}
});

//传真纸
Ext.create('WS.tbnorth.acsendfaxwin', {
	itemId: 'faxpaper',
	tooltip: '传真纸',
	text: '传真纸:无',
	hidden:true,
	menu: [],	
	updateStatus: function (hidFileId) {
		this.setDisabled(hidFileId ==""?true:false);
	}
});

//setTargetView
ActionBase.setTargetView('acsendfaxwin',imgVgetTargetView);

//重新设置图片src
//排序用
function resetPngsSrc(imgList) {
	Ext.Array.each(imgList, function (item, index, allItems) {
		var srcStr = item.src;
		if (srcStr.search("&randomTime") >= 0) {
			srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
		}
		item.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
	});
}

var randomDDflag = '1';
function createRddFlag() {
	var d = new Date();
	var ranId = "";
	ranId += d.getYear();
	ranId += d.getMonth();
	ranId += d.getDate();
	ranId += d.getHours();
	ranId += d.getMinutes();
	ranId += d.getSeconds();
	ranId += d.getMilliseconds();
	randomDDflag = ranId;
}

//var myDray = false;
//设置可拖拽状态
function initializePatientDragZone(v,winType) {
	var viewType = winType.pngClass;
	v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {
		ddGroup:winType.pngGroup+viewType.miniCurPage+randomDDflag,
		//ddGroup:'sendfaxWinG',
		isTarget:false,
		getDragData: function(e) {
			//myDray = true;
			var sourceEl = e.getTarget(), d;

			//alert(Ext.fly(sourceEl).getXY()[0]);
			if (sourceEl) {
				//拖拽用图
				var selCount;
				var viewType= winType.pngClass;
				selCount = viewType.getPngSels().getCount();

				var oNewNode = document.createElement("div");
				oNewNode.innerHTML="<span><img src='resources/images/pub/docDrag.png'/>x"+selCount+"</span>";
				//d = sourceEl.cloneNode(true);
				//d=oNewNode;
				oNewNode.id = Ext.id();
				return v.dragData = {
					sourceEl: sourceEl,
					repairXY: Ext.fly(sourceEl).getXY(),
					ddel: oNewNode,
					patientData: ''
				};
			}
		},
		getRepairXY: function() {
			//alert(this.dragData.repairXY);
			return this.dragData.repairXY;
		},
		endDrag: function() {
			stopClick = true;
			(new Ext.util.DelayedTask( function() {
					stopClick = false;
				})).delay(50);
		},
		//animRepair:false,
		onInvalidDrop: function(target, e, id) {

			var me = this;
			//myDray = false;
			//patientImg = me.id;
			this.beforeInvalidDrop(target, e, id);
			if (this.cachedTarget) {
				if(this.cachedTarget.isNotifyTarget) {
					this.cachedTarget.notifyOut(this, e, this.dragData);
				}
				this.cacheTarget = null;
			}
			this.proxy.repair(this.getRepairXY(e, this.dragData), this.afterRepair, this);

			if (this.afterInvalidDrop) {
				this.afterInvalidDrop(e, id);
			}

		}
	});
}

//取消可拖拽状态
function uninitPatientDragZone(v) {
	if (v.dragZone) {
		v.dragZone.destroy();
	};
}

//取消可拖放状态
function uninitHospitalDropZone(v) {
	if (v.dropZone) {
		v.dropZone.destroy();
	};
}

//设置可拖放状态
function initializeHospitalDropZone(v,winType) {
	var viewType = winType.pngClass;
	v.dropZone = Ext.create('Ext.dd.DropZone', v.el, {
		ddGroup:winType.pngGroup+viewType.miniCurPage+randomDDflag,
		getTargetFromEvent: function(e) {
			//alert(e.getTarget('.hospital-target'));
			return e.getTarget('.hospital-target');

		},
		onNodeOver : function(target, dd, e, data) {
			return Ext.dd.DropZone.prototype.dropAllowed;
		},
		onNodeDrop : function(target, dd, e, data) {
			//myDray = false;
			//patientImg = "";
			//alert('onNodeDrop');
			//操作PngContiner 做处理
			var img;
			var viewType;
			viewType = winType.pngClass;

			viewType.getPngAllMini().each( function (item, index, allItems) {
				if(item.getEl()&&(item.getEl().id == target.id)) {
					img = item;
					return;
				}
			});
			if((e.getPoint()[0] - img.getEl().getXY()[0]) <= (target.offsetWidth/2)) {
				//插入到前方
				//当前位置
				var insertCount = parseInt(img.ownerCt.down('label').text);
				var imageList = winType.down('#filepngviewMini').query('image');

				//获取移动到该位置前的图
				var insertImgs = new Array();
				viewType.getPngSels().each( function (item, index, allItems) {
					insertImgs.push(item.ownerCt.down('label').text);
				});
				//获取当前位置前的图 不包括已选择的图
				var moveFrontImg = new Array();
				Ext.Array.each(imageList, function (item, index, allItems) {
					if(item.ownerCt.down('label').text < insertCount) {
						if(!Ext.Array.contains(insertImgs,item.ownerCt.down('label').text)) {
							moveFrontImg.push(item.ownerCt.down('label').text);
						}
					}
				});
				//获取当前位置后的图，包括当前位置  不包括已选择的图
				var moveBehindImgs = new Array();
				Ext.Array.each(imageList, function (item, index, allItems) {
					if(item.ownerCt.down('label').text >= insertCount) {
						if(!Ext.Array.contains(insertImgs,item.ownerCt.down('label').text)) {
							moveBehindImgs.push(item.ownerCt.down('label').text);
						}
					}
				});
				var pageList = moveFrontImg.concat(insertImgs,moveBehindImgs);
				//alert(pageList.join());
				//调用接口
				//调用
				var param = {};
				param.fileId = winType.down('#hidFileId').getValue();
				param.pageList = pageList.join();
				param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
				param.currPage = viewType.miniCurPage;

				WsCall.call('sortByCurrPng', param, function (response, opts) {
					//清空选择数组
					viewType.getPngSels().each( function(item,index,allitems) {
						item.getEl().setStyle('border', '1px solid black');
						//设置为禁止拖拽
						uninitPatientDragZone(item);
						//设置为可拖放状态
						initializeHospitalDropZone(item,winType);
					});
					//清空选择数组
					viewType.getPngSels().clear();
					//清空大图选择
					viewType.getPngSelBig().clear();
					//toolbar 按钮状态
					ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),viewType.getTotalCount(),0);
					//重新设置Src
					resetPngsSrc(imageList);
				}, function (response, opts) {
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
				}, true);
			} else {
				//插入到后方
				var insertCount = parseInt(img.ownerCt.down('label').text);
				var imageList = winType.down('#filepngviewMini').query('image');

				//获取移动到该位置前的图
				var insertImgs = new Array();
				viewType.getPngSels().each( function (item, index, allItems) {
					insertImgs.push(item.ownerCt.down('label').text);
				});
				//获取当前位置前的图 不包括已选择的图
				var moveFrontImg = new Array();
				Ext.Array.each(imageList, function (item, index, allItems) {
					if(item.ownerCt.down('label').text <= insertCount) {
						if(!Ext.Array.contains(insertImgs,item.ownerCt.down('label').text)) {
							moveFrontImg.push(item.ownerCt.down('label').text);
						}
					}
				});
				//获取当前位置后的图，包括当前位置  不包括已选择的图
				var moveBehindImgs = new Array();
				Ext.Array.each(imageList, function (item, index, allItems) {
					if(item.ownerCt.down('label').text > insertCount) {
						if(!Ext.Array.contains(insertImgs,item.ownerCt.down('label').text)) {
							moveBehindImgs.push(item.ownerCt.down('label').text);
						}
					}
				});
				var pageList = moveFrontImg.concat(insertImgs,moveBehindImgs);
				//alert(pageList.join());
				//调用接口
				//调用
				var param = {};
				param.fileId = winType.down('#hidFileId').getValue();
				param.pageList = pageList.join();
				param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
				param.currPage = viewType.miniCurPage;

				WsCall.call('sortByCurrPng', param, function (response, opts) {
					//清空选择数组
					viewType.getPngSels().each( function(item,index,allitems) {
						item.getEl().setStyle('border', '1px solid black');
						//设置为禁止拖拽
						uninitPatientDragZone(item);
						//设置为可拖放状态
						initializeHospitalDropZone(item,winType);
					});
					//清空选择数组
					viewType.getPngSels().clear();
					//清空大图选择
					viewType.getPngSelBig().clear();

					//toolbar 按钮状态
					ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),viewType.getTotalCount(),0);
					//重新设置Src
					resetPngsSrc(imageList);
				}, function (response, opts) {
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
				}, true);
			}

			//target.appendChild(data.patientData);

			return true;
		}
	});
}

//====================================================================//

//图片显示类 myfilepngview
Ext.define('filepngviewclass', {
	config: {
		myTargetView:'',//判断来源
		isLoaded: 0, //是否已经加载 //Mini
		isLoadedBig: 0, //Big
		ifLoading: 1, //是否继续加载 //Mini
		faxFileId: 0, //文件ID
		selectAll: 0, //是否全选
		pngSels: new Ext.util.MixedCollection(), //所有选中的Png 数组 //缩略图数组
		pngSelBig: new Ext.util.MixedCollection(), //大图数组
		pngAllMini: new Ext.util.MixedCollection(), //所有缩略图Png数组
		pngContainerBig: '', //单页视图Img对象
		viewType: 0, //默认选择视图模式
		currCountBig: 0, //单页图全局currPage
		currFaxFileTotal: 1, //当前传真总页数
		coverDragStateA: 0,
		coverDragStateB: 0,
		editpngdisable: true,
		insertStartPage:0,//增加后的起始页码
		totalCount:0,//总页数
		insertEndPage:0,//向前增加的页面结束的页码
		imgCount:0,//图片总个数
		shiftImg:0,////shift选择记录位置
		miniCurPage:1,//mini图当前页码
		miniTotalPage:0,//mini图总页数
		miniSclLeft:0,//mini图Scroll left
		miniSclTop:0//mini图Scroll Top
	},
	constructor: function (cfg) {
		this.initConfig(cfg);
		this.pngSels = new Ext.util.MixedCollection(); //所有选中的Png 数组 //缩略图数组
		this.pngSelBig= new Ext.util.MixedCollection(); //大图数组
		this.pngAllMini= new Ext.util.MixedCollection(); //所有缩略图Png数组
	},
	initMyfilepngMini: function (form, hidLoaded,filetype,fileId,funOk , showLoadMask, loadMsg, maskEl,maskDelay,cuPage,isCpage,fileopts) {

		var topme = this;
		var winType,viewType;
		winType = imgVgetTargetView();
		viewType = winType.pngClass;

		//alert(this.myTargetView);
		//return;
		// callMask = new Ext.LoadMask(form, {
		// msg: "请稍候..."
		// });
		// callMask.show();
		var reFlag = false;
		//alert(viewType.isLoaded);
		//判断是否是追加
		if(fileId == '' || filetype == '1') {
			//清空缩略图数组
			this.pngAllMini.clear();
		}

		//清空大图数组
		this.pngSelBig.clear();
		//重置以前选择数组的状态
		//追加到后方
		if(filetype == '0' && fileId != '') {
			if(viewType.miniCurPage == viewType.miniTotalPage) {
				reFlag = true;
			}
			// this.pngSels.each( function (item, index, allItems) {
			// item.getEl().setStyle('border', '1px solid black');
			// //设置为禁止拖拽
			// uninitPatientDragZone(item);
			// //设置为可拖放状态
			// initializeHospitalDropZone(item);
			// });
		}
		//清空选择数组
		this.pngSels.clear();
		//单页视图Img对象
		this.pngContainerBig = "";
		//单页图全局currPage
		this.currCountBig = 0;
		if(isCpage) {
			//清空缩略图数组
			this.pngAllMini.clear();
		} else {
			//当前传真总页数
			this.currFaxFileTotal = 1;
			this.totalCount = 0;
		}

		//mini图总页数
		this.miniTotalPage = 0;

		var fopts = {};
		if(fileopts) {
			fopts = fileopts;
		}

		//切换视图
		if(winType && winType.defaultFitPng && !fopts.fistLoadMini) {
			//alert(this.isLoaded);
			//重置为缩略图页面
			//调用切换视图
			if(!isCpage) {
				this.viewType =0;
			} else {
				this.isLoaded = 0;
			}

			//this.isLoaded = 0;

		} else {

			this.isLoaded = 0;
			if(!fopts.fistLoadMini) {
				//重置为缩略图页面
				//调用切换视图
				this.viewType =1;
				ActionBase.getAction('filepngviewviewTypeChange').execute();
			}
		}

		//tbFaxFileTabPng
		var tbPageTotal = winType.down('#tbPageTotal');
		var tbMiniTotal = winType.down('#txtMiniCurrPage');

		//palFaxFileTabPngMini
		var palPngContainer = winType.down('#filepngviewMini');
		//第一次追加到后方 & 第1次加载 || 追加到前方
		if(fileId == '' || filetype != '0') {
			palPngContainer.removeAll();
		}

		//palPngContainer.removeAll();
		function CreatePNG(data,reCount) {
			//设置总页数
			viewType.setCurrFaxFileTotal(data);

			//设置下次从后增加后的起始页码
			//第一次追加到后方 & 第1次加载
			if(filetype == '0' && fileId == '') {
				viewType.setInsertStartPage(parseInt(data));
			}
			//第一次追加到前方
			if(filetype == '1') {
				viewType.setInsertStartPage(parseInt(data));
			}
			//追加到后方
			if(filetype == '0' && fileId != '') {
				viewType.setInsertStartPage(parseInt(viewType.getInsertStartPage()));
			}
			//追加到前方
			if(filetype == '1' && fileId != '') {
				viewType.setInsertStartPage(parseInt(viewType.getInsertStartPage()));
			}

			tbPageTotal.setText('共'+'   ' + data);

			var elseCount = 20;
			var pngPageSize = 20;
			//如果是大缩略图，每页10个
			if(userConfig.miniPngSize == '1') {
				elseCount =10;
				pngPageSize = 10;
			}

			//分页
			if(viewType.getCurrFaxFileTotal()%pngPageSize == 0) {
				viewType.miniTotalPage = parseInt(viewType.currFaxFileTotal/pngPageSize);
			} else {
				viewType.miniTotalPage = parseInt(viewType.currFaxFileTotal/pngPageSize)+1;
			}
			winType.down('#tbMiniPageTotal').setText('共'+'   '+ viewType.miniTotalPage);

			if(viewType.miniCurPage == viewType.miniTotalPage) {
				if(viewType.currFaxFileTotal%pngPageSize != 0) {
					elseCount = viewType.currFaxFileTotal%pngPageSize;
				}
				//alert(elseCount);
			}
			//如果是横向大缩略图，不分页
			if(winType &&winType.pngGroup == 'faxtodocsingle') {
				elseCount = data;
				//隐藏控件
				winType.down('#txtMiniCurrPage').setDisabled(true);
				winType.down('#tbMiniPageTotal').setText('共'+'   '+ data);
			}

			viewType.setImgCount(elseCount);

			var currCount = 0;
			//追加到后方
			if(filetype == '0' && fileId != '' && !reCount) {
				currCount = viewType.getInsertStartPage();
			}
			//alert(viewType.getInsertStartPage());
			viewType.setTotalCount(data);
			var totalCount = data;
			//追加到后方
			if(filetype == '0' && fileId != '') {

				totalCount = parseInt(data);
				viewType.setInsertStartPage(totalCount);
			}

			//判断视图类型
			if(winType &&winType.defaultFitPng && !fopts.fistLoadMini && !isCpage) {

				ActionBase.getAction('filepngviewviewTypeChange').execute();

				hidLoaded.setValue('0');
				if(funOk) {
					funOk();
				}
			} else {

				//重新设置nextTwenty按钮的文本
				var nextTtbtn = winType.down('#nextTwenty');
				if(nextTtbtn) {
					var count = (totalCount-pngPageSize*parseInt(viewType.miniCurPage));
					count =count > pngPageSize ?pngPageSize:count;
					nextTtbtn.setText('下'+count+'张');
				}
				//alert((totalCount-20*parseInt(viewType.miniCurPage))+'nextTwenty');

				//调用缩略图加载
				if (viewType.getIsLoaded() == 0) {
					//获取进度条

					var progressBar = winType.down('#bottomProgressBar');
					var btnCancel = winType.down('#btnCancel');
					var btnContinue = winType.down('#btnContinue');

					var task1;

					winType.runner = new Ext.util.TaskRunner();

					var updateClock = function () {
						viewType.setIsLoaded(1);
						currCount++;
						//调用进度条
						if(progressBar) {
							progressBar.show();
							progressBar.updateProgress(currCount / totalCount, '加载图片中,请等待...', false);
						}

						//alert(currCount+'=='+elseCount);
						//--
						if (currCount > elseCount) {
							winType.runner.stopAll();
							if(progressBar) {
								progressBar.updateProgress(1, '加载完毕 !', false);
							}

							winType.runner = new Ext.util.TaskRunner();
							if(currCount == (elseCount+1) && viewType.miniCurPage !=viewType.miniTotalPage) {

								var tmpNextPage = Ext.create('Ext.container.Container', {
									height: 142,
									width: userConfig.miniPngSize == '1'?205:100,
									layout: {
										type: 'auto'
									},
									items: [{
										width: userConfig.miniPngSize == '1'?188:94,
										margin:'85 2 0 2',
										xtype:'button',
										scale: 'large',
										iconCls:viewType.miniCurPage ==(viewType.miniTotalPage-1)?'sendfaxBtnLast':'sendfaxBtnNext',
										iconAlign: 'right',
										itemId:'nextTwenty',
										disabled:viewType.miniCurPage ==viewType.miniTotalPage?true:false,
										text:viewType.miniCurPage ==(viewType.miniTotalPage-1)?'下'+(totalCount-pngPageSize*parseInt(viewType.miniCurPage))+'张':'下'+pngPageSize+'张',
										// listeners:{
										// render:function(){
										// var me = this;
										// me.getEl().on('mouseenter',function(){
										// sendfaxwin.down('#btnSuperadd').setText((new Date()).getTime());
										// });
										// }
										// },
										handler: function() {
											createRddFlag();
											viewType.miniCurPage++;
											winType.down('#txtMiniCurrPage').setValue(viewType.miniCurPage);
											if (winType.runner) {
												//getIsLoaded
												viewType.ifLoading = 1;
												winType.runner.stopAll();
												//pngSels.clear();
												//initAllFaxFileTabPngConfig(null,miniCurPage);
												//gridSelsChange();

												var hidForm1 = winType.down('#hidFileId');
												var hidLoaded1 = winType.down('#hidLoaded');
												var hidUpFileType1 = winType.down('#UpFileType');
												//向后，向前插入
												var upfiletype1 = hidUpFileType1.getValue();
												var fileId1 = hidForm1.getValue();
												var palPngContainer = winType.down('#filepngviewMini');
												palPngContainer.removeAll();

												viewType.initMyfilepngMini(null, hidLoaded1,upfiletype1,fileId1, function() {

													setPngMiniWH(viewType,winType,'');

												},true,'正在生成缩略图...',winType.getEl(),10,viewType.miniCurPage,true, {
													fistLoadMini:true
												});
											}
										}
									}]
								});
								palPngContainer.add(tmpNextPage);

							}
							//btnCancel.setDisabled(true);
							if(funOk) {
								funOk();
							}

							//callMask.hide();
							hidLoaded.setValue('0');
							//Ext.Msg.alert(currCount + "加载完毕!");
							//在Grid选择变化后重置
							//isLoaded = 0;faxFileId=select
						} else {
							if(currCount == 1 && viewType.miniCurPage !=1) {
								var tmpUpPage = Ext.create('Ext.container.Container', {
									height: 142,
									width: userConfig.miniPngSize == '1'?205:100,
									layout: {
										type: 'auto'
									},
									items: [{
										width: userConfig.miniPngSize == '1'?188:94,
										margin:'0 2 0 2',
										xtype:'button',
										disabled:viewType.miniCurPage ==1?true:false,
										scale: 'large',
										iconCls:viewType.miniCurPage ==2?'sendfaxBtnFirst':'sendfaxBtnPre',
										iconAlign: 'left',
										text:'上'+pngPageSize+'张',
										// listeners:{
										// render:function(){
										// var me = this;
										// me.getEl().on('mouseenter',function(){
										// sendfaxwin.down('#btnSuperadd').setText((new Date()).getTime());
										// });
										// }
										// },
										handler: function() {
											createRddFlag();
											viewType.miniCurPage--;
											winType.down('#txtMiniCurrPage').setValue(viewType.miniCurPage);
											if (winType.runner) {
												viewType.ifLoading = 1;
												winType.runner.stopAll();
												var hidForm2 = winType.down('#hidFileId');
												var hidLoaded2 = winType.down('#hidLoaded');
												var hidUpFileType2 = winType.down('#UpFileType');
												//向后，向前插入
												var upfiletype2 = hidUpFileType2.getValue();
												var fileId2 = hidForm2.getValue();
												var palPngContainer = winType.down('#filepngviewMini');
												palPngContainer.removeAll();

												viewType.initMyfilepngMini(null, hidLoaded2,upfiletype2,fileId2, function() {

													setPngMiniWH(viewType,winType,'');

												},true,'正在生成缩略图...',winType.getEl(),10,viewType.miniCurPage,true, {
													fistLoadMini:true
												});
											}
										}
									}]
								});
								palPngContainer.add(tmpUpPage);
							}
							var pngCH=142,pngCW=100,pngH=127,pngW =94;
							//如果是横向大缩略图
							//if(winType &&winType.pngGroup == 'faxtodocsingle') {
							if(userConfig.miniPngSize == '1') {
								pngCH=280;
								pngCW = 205;
								pngH=254;
								pngW =188;
							}

							var pngNStyle = {
								border: '1px solid black',
								'background-color':'#FFFFFF',
								'background-image':'none',
								'background-repeat': 'no-repeat'
							};
							if(winType.pngGroup == 'sendfax' && winType.faxpaperid != '0') {
								pngNStyle = {
									border: '1px solid black',
									'background-image':'url('+WsConf.Url+'?req=rc&rcname=loadfaxpaper&type=mini&fileid=' + viewType.getFaxFileId() + '&fpid='+winType.faxpaperid+')',
									'background-repeat': 'no-repeat'
								};
							}

							var pngContainer = Ext.create('Ext.container.Container', {
								height: pngCH,
								width:pngCW,
								layout: {
									type: 'vbox',
									align: 'center'
								},
								items: [{
									xtype: 'image',
									cls:'hospital-target',
									width: pngW,
									height: pngH,
									style: pngNStyle,//&randomTime=" + (new Date()).getTime())
									src: WsConf.Url + '?req=rc&rcname=loadminipng&fileid=' + viewType.getFaxFileId() + '&currpage=' + (currCount+(viewType.miniCurPage-1)*pngPageSize) + '&randomTime='+ (new Date()).getTime(),
									listeners: {
										afterrender: function (img, opts) {
											//设置为可拖放状态
											initializeHospitalDropZone(img,winType);
											var imgDom = img.getEl();
											//装载缩略图数组
											viewType.getPngAllMini().add(img.id, img);

											imgDom.on('click', function (eve) {

												if(stopClick)
													return;
												//判断是否按下ctrl
												if(eve.ctrlKey) {
													viewType.setShiftImg(img);
													var borderStyle = imgDom.getStyle('border',true);
													//选中
													if (borderStyle == '1px solid black' || borderStyle == 'black 1px solid') {
														imgDom.setStyle('border', '3px solid blue');
														if (!viewType.getPngSels().contains(img)) {
															//设置为禁止拖放
															uninitHospitalDropZone(img);
															//设置其为可拖拽
															initializePatientDragZone(img,winType);
															viewType.getPngSels().add(img.id, img);
														}

													} else {//取消
														//patientImg= "";
														imgDom.setStyle('border', '1px solid black');
														if (viewType.getPngSels().contains(img)) {
															//设置为禁止拖拽
															uninitPatientDragZone(img);
															//设置为可拖放状态
															initializeHospitalDropZone(img,winType);
															viewType.getPngSels().remove(img);
														}
													}
													//加载默认的大图选择
													//清空大图选择
													viewType.getPngSelBig().clear();
													if (viewType.getPngSels().getCount() > 0) {
														viewType.getPngSelBig().add(viewType.getPngSels().first().id, viewType.getPngSels().first());
													} else {
														var imList = winType.down('#filepngviewMini').query('image');
														var defaultImg = imList[0];
														viewType.getPngSelBig().add(defaultImg.id, defaultImg);
													}
													//变更toolbar 翻转、删除 按钮状态
													ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),totalCount,0);
													return;
												}//判断是否按下ctrl end

												//判断是否按下shift
												if(eve.shiftKey) {
													var fistImg;
													var imageList = winType.down('#filepngviewMini').query('image');
													//追加到后方
													Ext.Array.each(imageList, function (item, index, allItems) {
														if(index == 0) {
															if(viewType.getShiftImg() !=0) {
																fistImg = viewType.getShiftImg();
															} else {
																fistImg = item;
															}
														}
														//设置为禁止拖拽
														uninitPatientDragZone(item);
														//设置为可拖放状态
														initializeHospitalDropZone(item,winType);
													});
													//清空选择数组
													viewType.getPngSels().clear();
													Ext.Array.each(imageList, function (item, index, allItems) {
														var imgItem = item.getEl();
														imgItem.setStyle('border', '1px solid black'); //取消选中

														if(item.id >= fistImg.id && item.id <= img.id) {
															imgItem.setStyle('border', '3px solid blue'); //选中
															//设置为禁止拖放
															uninitHospitalDropZone(item);
															//设置其为可拖拽
															initializePatientDragZone(item,winType);
															viewType.getPngSels().add(item.id, item);
														}
														if(item.id <= fistImg.id && item.id >= img.id) {
															imgItem.setStyle('border', '3px solid blue'); //选中
															//设置为禁止拖放
															uninitHospitalDropZone(item);
															//设置其为可拖拽
															initializePatientDragZone(item,winType);
															viewType.getPngSels().add(item.id, item);
														}
													});
													//加载默认的大图选择
													//清空大图选择
													viewType.getPngSelBig().clear();
													if (viewType.getPngSels().getCount() > 0) {
														viewType.getPngSelBig().add(viewType.getPngSels().first().id, viewType.getPngSels().first());
													} else {
														viewType.getPngSelBig().add(img.id, img);
													}
													//变更toolbar 翻转、删除 按钮状态
													ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),totalCount,0);
													return;
												}//判断是否按下shift end

												viewType.setShiftImg(img);
												var imageList = winType.down('#filepngviewMini').query('image');
												//追加到后方
												Ext.Array.each(imageList, function (item, index, allItems) {
													//设置为禁止拖拽
													uninitPatientDragZone(item);
													//设置为可拖放状态
													initializeHospitalDropZone(item,winType);
												});
												//清空选择数组
												viewType.getPngSels().clear();
												Ext.Array.each(imageList, function (item, index, allItems) {
													var imgItem = item.getEl();
													imgItem.setStyle('border', '1px solid black'); //取消选中
													if(item.id == img.id) {
														imgItem.setStyle('border', '3px solid blue'); //选中
														//设置为禁止拖放
														uninitHospitalDropZone(item);
														//设置其为可拖拽
														initializePatientDragZone(item,winType);
														viewType.getPngSels().add(item.id, item);
													}
												});
												//加载默认的大图选择
												//清空大图选择
												viewType.getPngSelBig().clear();
												if (viewType.getPngSels().getCount() > 0) {
													viewType.getPngSelBig().add(viewType.getPngSels().first().id, viewType.getPngSels().first());
												} else {
													viewType.getPngSelBig().add(img.id, img);
												}
												//变更toolbar 翻转、删除 按钮状态
												ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),totalCount,0);
											});
											//双击
											imgDom.on('dblclick', function () {

												var imageList = winType.down('#filepngviewMini').query('image');
												//追加到后方
												Ext.Array.each(imageList, function (item, index, allItems) {
													//设置为禁止拖拽
													uninitPatientDragZone(item);
													//设置为可拖放状态
													initializeHospitalDropZone(item,winType);
												});
												//清空选择数组
												viewType.getPngSels().clear();
												Ext.Array.each(imageList, function (item, index, allItems) {
													var imgItem = item.getEl();
													imgItem.setStyle('border', '1px solid black'); //取消选中
												});
												//var borderStyle = imgDom.getStyle('border');
												var borderStyle = imgDom.dom.style['border'];
												if (borderStyle == '1px solid black' || borderStyle == 'black 1px solid') {
													imgDom.setStyle('border', '3px solid blue');
													if (!viewType.getPngSels().contains(img)) {
														//设置为禁止拖放
														uninitHospitalDropZone(img);
														//设置其为可拖拽
														initializePatientDragZone(img,winType);
														viewType.getPngSels().add(img.id, img);
													}

												}
												//加载默认的大图选择
												//清空大图选择
												viewType.getPngSelBig().clear();
												if (viewType.getPngSels().getCount() > 0) {
													viewType.getPngSelBig().add(viewType.getPngSels().first().id, viewType.getPngSels().first());
												} else {
													var imList = winType.down('#filepngviewMini').query('image');
													var defaultImg = imList[0];
													viewType.getPngSelBig().add(defaultImg.id, defaultImg);
												}
												//调用切换视图
												ActionBase.getAction('filepngviewviewTypeChange').execute();

											});
											winType.runner.stopAll();
											if (viewType.getIfLoading() == 1) {
												winType.runner.start(task1);

											}
										}
									}
								},{
									xtype: 'label',
									text: currCount+(viewType.miniCurPage-1)*pngPageSize
								}]
							});
							//加载png图片
							palPngContainer.add(pngContainer);

						}
					} //updateClock
					task1 = {
						run: updateClock,
						interval: 1 //0.01 second
					}
					winType.runner.start(task1);
					ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),totalCount,currCount);
				}
			}

		}

		if(isCpage) {
			//alert(1);
			CreatePNG(viewType.getCurrFaxFileTotal(),true);
		} else {
			var param = {};
			param.faxfileid = viewType.getFaxFileId();
			//param.action = "PngInit";
			//param.req = 'call';
			param.upfiletype = filetype;
			param.sessiontoken = sessionToken;
			if(winType.pngGroup != 'inputdatawin' && winType.pngGroup != 'seefillfaxwin') {
				param.createOrg = '1';
			}

			//如果是横向大缩略图
			//if(winType &&winType.pngGroup == 'faxtodocsingle') {
			if(userConfig.miniPngSize == '1') {
				param.pngh=254;
				param.pngw =188;
			}

			//调用传真文件图片生成
			WsCall.call('filepng', param, function (response, opts) {
				if(response.data <= 0) {
					winType.fireEvent('hide',winType);
					return
				};
				CreatePNG(response.data,reFlag);
			}, function (response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
			}, (typeof showLoadMask == 'undefined')?false:true,loadMsg, maskEl,maskDelay);
		}

	}
});

//====================================================================================================================//
//=======================================viewFaxFileTab Action========================================================//
//====================================================================================================================//

//filepngview
Ext.define('WS.tbnorth.filepngview', {
	extend: 'WS.action.Base',
	category: 'filepngview',
	//获取传真图MiniPanel - filepngviewMini
	getFilepngviewMini: function () {
		return this.getTargetView().down('#filepngviewMini');
	},
	getFilepngviewBig: function () {
		return this.getTargetView().down('#filepngviewBig');
	},
	getFilepngviewToolBar: function () {
		return this.getTargetView().down('#tbfilepngview');
	},
	getFilepngviewviewTypeChangeBtn: function () {
		//var type = this.getTargetView().myTargetView;
		return this.getTargetView().down('#filepngviewviewTypeChange');
	},
	getPngClass: function() {
		return this.getTargetView().pngClass;
	}
});

//向左翻转
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewrotateLeft',
	tooltip: '向左翻转',
	//text: '向左翻转',
	hidden:true,
	iconCls: 'faxPngRotateLeft',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var viewType = me.getPngClass();

		var winType = me.getTargetView();
		if(winType.pngGroup == 'wfhandlerwin') {
			var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
			tmp.hadEdit= true;
			//winType.hadStamp= true;
		}

		//mini
		if (viewType.getViewType() == 0) {

		} //if viewType 0
		else {

			var palPng = me.getFilepngviewBig();
			//alert(pngSelBig.first().src);
			//更新当前选择的大图，重设大图src,loadfitpng
			//var paraStr = viewType.getPngSelBig().first().src.substr(viewType.getPngSelBig().first().src.indexOf('?') + 1, viewType.getPngSelBig().first().src.length);

			var paraStr = viewType.getPngContainerBig().src.substr(viewType.getPngContainerBig().src.indexOf('?') + 1, viewType.getPngContainerBig().src.length);
			var str = paraStr.split('&');
			var fid = str[2].split('=')[1];
			var cpage = str[3].split('=')[1];

			//调用
			var param = {};
			param.fileid = fid;
			//param.req = 'call';
			param.currpage = cpage;
			param.sessiontoken = sessionToken;
			//调用

			WsCall.call('turnleftfitpng', param, function (response, opts) {
				//var resData = Ext.JSON.decode(response.data);
				var srcStr = viewType.getPngContainerBig().src;

				if (srcStr.search("&randomTime") >= 0) {
					srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
				}
				palPng.setHeight(viewType.getPngContainerBig().getWidth() +2);
				palPng.setWidth(viewType.getPngContainerBig().getHeight() +2);

				viewType.getPngContainerBig().setSrc(srcStr + "&randomTime=" + (new Date()).getTime());

				//获取当前的pngSelBig.first() 元素，设置其src         req=rc&rcname=loadminipng
				if(viewType.getPngSelBig().first()) {
					viewType.getPngSelBig().first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
				}

			}, function (response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
			}, true);
		}

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		var winType = me.getTargetView();
		if(winType&&winType.faxpaperid&&winType.faxpaperid != '0') {
			this.setDisabled(true);
		} else {
			me.setDisabled(viewType == 0?true:false);
		}

	}
});

//向右翻转
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewrotateRight',
	tooltip: '向右翻转',
	//text: '向右翻转',
	hidden:true,
	iconCls: 'faxPngRotateRight',
	disabled: true,
	handler: function (button, event) {

		var me = this;
		var viewType = me.getPngClass();

		var winType = me.getTargetView();
		if(winType.pngGroup == 'wfhandlerwin') {
			var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
			tmp.hadEdit= true;
			//winType.hadStamp= true;
		}

		//mini
		if (viewType.getViewType() == 0) {

		} //if viewType 0
		else {

			var palPng = me.getFilepngviewBig();
			//alert(pngSelBig.first().src);
			//更新当前选择的大图，重设大图src,loadfitpng
			//var paraStr = viewType.getPngSelBig().first().src.substr(viewType.getPngSelBig().first().src.indexOf('?') + 1, viewType.getPngSelBig().first().src.length);
			var paraStr = viewType.getPngContainerBig().src.substr(viewType.getPngContainerBig().src.indexOf('?') + 1, viewType.getPngContainerBig().src.length);

			var str = paraStr.split('&');
			var fid = str[2].split('=')[1];
			var cpage = str[3].split('=')[1];

			//调用
			var param = {};
			param.fileid = fid;
			//param.req = 'call';
			param.currpage = cpage;
			param.sessiontoken = sessionToken;

			//调用

			WsCall.call('turnrightfitpng', param, function (response, opts) {
				//var resData = Ext.JSON.decode(response.data);
				var srcStr = viewType.getPngContainerBig().src;

				if (srcStr.search("&randomTime") >= 0) {
					srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
				}

				palPng.setHeight(viewType.getPngContainerBig().getWidth() +2);
				palPng.setWidth(viewType.getPngContainerBig().getHeight() +2);

				viewType.getPngContainerBig().setSrc(srcStr + "&randomTime=" + (new Date()).getTime());

				//获取当前的pngSelBig.first() 元素，设置其src         req=rc&rcname=loadminipng
				if(viewType.getPngSelBig().first()) {
					viewType.getPngSelBig().first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
				}

			}, function (response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
			}, true);
		}
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {

		var me = this;
		var winType = me.getTargetView();
		if(winType&&winType.faxpaperid&&winType.faxpaperid != '0') {
			this.setDisabled(true);
		} else {
			me.setDisabled(viewType == 0?true:false);
		}
	}
});

//上下翻转
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewoverturn',
	tooltip: '上下翻转',
	//text: '上下翻转',
	iconCls: 'faxPngFlip',
	disabled: true,
	handler: function (button, event) {

		var me = this;
		var viewType = me.getPngClass();

		var winType = me.getTargetView();
		if(winType.pngGroup == 'wfhandlerwin') {
			var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
			tmp.hadEdit= true;
			//winType.hadStamp= true;
		}

		//mini
		if (viewType.getViewType() == 0) {
			if (viewType.getPngSels().getCount() > 0) {
				viewType.getPngSels().each( function (item, index, length) {

					var paraStr = item.src.substr(item.src.indexOf('?') + 1, item.src.length);
					var str = paraStr.split('&');
					var fid = str[2].split('=')[1];
					var cpage = str[3].split('=')[1];

					//调用
					var param = {};
					param.fileid = fid;
					//param.req = 'call';
					param.currpage = cpage;
					//param.callname = 'overturnminipng';
					param.sessiontoken = sessionToken;

					//调用
					WsCall.call('overturnminipng', param, function (response, opts) {
						//var resData = Ext.JSON.decode(response.data);
						//item.setSrc(resData.pngurl + "&d=" + resData.modifiedtime);
						var srcStr = item.src;

						if (srcStr.search("&randomTime") >= 0) {
							srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
						}
						item.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
					}, function (response, opts) {
						if(!errorProcess(response.code)) {
							Ext.Msg.alert('失败', response.msg);
						}
					}, true);
				});
			}
		} //if viewType 0
		else {
			//alert(pngSelBig.first().src);
			//更新当前选择的大图，重设大图src,loadfitpng
			//var paraStr = viewType.getPngSelBig().first().src.substr(viewType.getPngSelBig().first().src.indexOf('?') + 1, viewType.getPngSelBig().first().src.length);

			var paraStr = viewType.getPngContainerBig().src.substr(viewType.getPngContainerBig().src.indexOf('?') + 1, viewType.getPngContainerBig().src.length);
			var str = paraStr.split('&');
			var fid = str[2].split('=')[1];
			var cpage = str[3].split('=')[1];

			//调用
			var param = {};
			param.fileid = fid;
			//param.req = 'call';
			param.currpage = cpage;
			param.sessiontoken = sessionToken;

			//调用

			WsCall.call('overturnfitpng', param, function (response, opts) {
				//var resData = Ext.JSON.decode(response.data);

				var srcStr = viewType.getPngContainerBig().src;

				if (srcStr.search("&randomTime") >= 0) {
					srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
				}
				viewType.getPngContainerBig().setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
				//获取当前的pngSelBig.first() 元素，设置其src         req=rc&rcname=loadminipng
				if(viewType.getPngSelBig().first()) {
					viewType.getPngSelBig().first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
				}
			}, function (response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
			}, true);
		}
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(viewType == 0?(selsCount==0):false);
	}
});

//首页
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewfistPage',
	tooltip: '首页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		me.getFilepngviewToolBar().down('#txtCurrPage').setValue(1);
		var winType = me.getTargetView();
		var viewType = me.getPngClass();

		var palPng = me.getFilepngviewBig();

		var param = {};
		param.sessiontoken = sessionToken;
		param.fileid = viewType.getFaxFileId();
		param.currpage=1;
		if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
			param.fpid = winType.faxpaperid;
		}

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			viewType.getPngContainerBig().setSrc(WsConf.Url +info.url);

			palPng.setHeight(info.height +2);
			palPng.setWidth(info.width + 2);

			resetMiniForFP(info.pages,winType);
		}, function(response, opts) {

		}, true);
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(viewType ==0?true:currPage==1);
	}
});
//上一页
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewprePage',
	tooltip: '上一页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getTargetView();
		var viewType = me.getPngClass();
		var palPng = me.getFilepngviewBig();
		var oVal = me.getFilepngviewToolBar().down('#txtCurrPage').getValue();
		oVal--;
		if (oVal > 0) {
			me.getFilepngviewToolBar().down('#txtCurrPage').setValue(oVal);

			var param = {};
			param.sessiontoken = sessionToken;
			param.fileid = viewType.getFaxFileId();
			param.currpage= oVal;
			if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
				param.fpid = winType.faxpaperid;
			}

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				viewType.getPngContainerBig().setSrc(WsConf.Url +info.url);

				palPng.setHeight(info.height +2);
				palPng.setWidth(info.width + 2);

				resetMiniForFP(info.pages,winType);
			}, function(response, opts) {

			}, true);
		}

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(viewType ==0?true:currPage<=1);
	}
});
//下一页
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewnextPage',
	tooltip: '下一页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getTargetView();
		var viewType = me.getPngClass();
		var palPng = me.getFilepngviewBig();
		var oVal = me.getFilepngviewToolBar().down('#txtCurrPage').getValue();
		oVal++;
		if (oVal <= viewType.getCurrFaxFileTotal()) {
			me.getFilepngviewToolBar().down('#txtCurrPage').setValue(oVal);
			var param = {};
			param.sessiontoken = sessionToken;
			param.fileid = viewType.getFaxFileId();
			param.currpage= oVal;
			if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
				param.fpid = winType.faxpaperid;
			}

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				viewType.getPngContainerBig().setSrc(WsConf.Url +info.url);

				palPng.setHeight(info.height +2);
				palPng.setWidth(info.width + 2);

				resetMiniForFP(info.pages,winType);
			}, function(response, opts) {

			}, true);
		}

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(viewType ==0?true:currPage>=totoalPage);
	}
});
//尾页
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewlastPage',
	tooltip: '尾页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getTargetView();
		var viewType = me.getPngClass();
		var palPng = me.getFilepngviewBig();
		me.getFilepngviewToolBar().down('#txtCurrPage').setValue(viewType.getCurrFaxFileTotal());

		var param = {};
		param.sessiontoken = sessionToken;
		param.fileid = viewType.getFaxFileId();
		param.currpage= viewType.getCurrFaxFileTotal();
		if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
			param.fpid = winType.faxpaperid;
		}

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			viewType.getPngContainerBig().setSrc(WsConf.Url +info.url);

			palPng.setHeight(info.height +2);
			palPng.setWidth(info.width + 2);

			resetMiniForFP(info.pages,winType);
		}, function(response, opts) {

		}, true);
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(viewType ==0?true:currPage==totoalPage);
	}
});

//全选
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewselectAll',
	tooltip: '全部选择/全部取消',
	text: '全选/取消',
	disabled: true,
	handler: function (button, event) {
		var me = this;

		var winType = me.getTargetView();

		var viewType = me.getPngClass();

		var imageList = me.getFilepngviewMini().query('image');

		//清空选择数组
		viewType.getPngSels().clear();
		Ext.Array.each(imageList, function (item, index, allItems) {
			var imgItem = item.getEl();
			if (viewType.getSelectAll() == 0) {
				imgItem.setStyle('border', '3px solid blue');
			} else {
				imgItem.setStyle('border', '1px solid black'); //取消选中

			}
		});
		if (viewType.getSelectAll() == 0) {
			//push所有选中
			viewType.getPngSels().addAll(imageList);
			viewType.setSelectAll(1);
			//重置以前选择数组的状态
			//追加到后方
			viewType.getPngSels().each( function (item, index, allItems) {
				//设置其为可拖拽
				initializePatientDragZone(item,winType);
			});
		} else {
			//清空选择数组
			viewType.getPngSels().clear();
			viewType.setSelectAll(0);
			//重置以前选择数组的状态
			//追加到后方
			Ext.Array.each(imageList, function (item, index, allItems) {
				//设置为禁止拖拽
				uninitPatientDragZone(item);
				//设置为可拖放状态
				initializeHospitalDropZone(item,winType);
			});
		}

		//加载默认的大图选择
		//清空大图选择
		viewType.getPngSelBig().clear();
		if (viewType.getPngSels().getCount() > 0) {
			viewType.getPngSelBig().add(viewType.getPngSels().first().id, viewType.getPngSels().first());
		} else {
			var imList = me.getFilepngviewMini().query('image');
			var defaultImg = imList[0];
			viewType.getPngSelBig().add(defaultImg.id, defaultImg);
		}
		ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),viewType.getTotalCount(),0);
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;

		if(currPage == -1) {
			me.setDisabled(viewType ==0?true:true);
			return;
		}
		me.setDisabled(viewType ==0?false:true);
	}
});
//反选
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewselectToggle',
	tooltip: '反选',
	text: '反选',
	disabled: true,
	handler: function (button, event) {
		var me = this;

		var winType = me.getTargetView();
		var viewType = me.getPngClass();

		var imageList = me.getFilepngviewMini().query('image');
		//清空选择数组
		viewType.getPngSels().clear();
		Ext.Array.each(imageList, function (item, index, allItems) {
			var imgItem = item.getEl();
			if (imgItem.getStyle('border',true) == '1px solid black' || imgItem.getStyle('border',true) == 'black 1px solid') {
				imgItem.setStyle('border', '3px solid blue');
				viewType.getPngSels().add(item.id, item);
				//重置以前选择数组的状态
				//追加到后方
				//设置其为可拖拽
				initializePatientDragZone(item,winType);

			} else {
				imgItem.setStyle('border', '1px solid black');
				//重置以前选择数组的状态
				//追加到后方
				//设置为禁止拖拽
				uninitPatientDragZone(item);
				//设置为可拖放状态
				initializeHospitalDropZone(item,winType);

			}
		});
		//加载默认的大图选择
		//清空大图选择
		viewType.getPngSelBig().clear();
		if (viewType.getPngSels().getCount() > 0) {
			viewType.getPngSelBig().add(viewType.getPngSels().first().id, viewType.getPngSels().first());
		} else {
			var imList = me.getFilepngviewMini().query('image');
			var defaultImg = imList[0];
			viewType.getPngSelBig().add(defaultImg.id, defaultImg);
		}
		ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),viewType.getTotalCount(),0);
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		if(currPage == -1) {
			me.setDisabled(viewType ==0?true:true);
			return;
		}
		me.setDisabled(viewType ==0?false:true);
	}
});

//视图变更
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngviewviewTypeChange',
	tooltip: '单页图',
	text: '单页图',
	iconCls: 'faxPngPageView',
	//enableToggle: true,
	disabled: true,
	handler: function (button, eve,suppressLoad) {
		var me = this;
		var winType = me.getTargetView();
		var viewType = me.getPngClass();

		var palPngMini = me.getFilepngviewMini();
		var palPng = me.getFilepngviewBig();
		var basePal = winType.down('baseviewpanel');

		var pngPageSize = 20;
		//如果是大缩略图，每页10个
		if(userConfig.miniPngSize == '1') {
			pngPageSize = 10;
		}

		//切换
		if (viewType.getViewType() == 0) {//大图
			//记录缩略图panel scroll位置
			viewType.miniSclLeft = basePal.body.dom.scrollLeft;
			viewType.miniSclTop = basePal.body.dom.scrollTop;

			me.getFilepngviewviewTypeChangeBtn().setText('缩略图');
			me.getFilepngviewviewTypeChangeBtn().setTooltip('缩略图');
			me.getFilepngviewviewTypeChangeBtn().setIconCls('faxPngThumbView');
			viewType.setViewType(1);
			//触发TabChange
			//tbFaxFileTabPng
			var tbPageTotal1 = me.getFilepngviewToolBar().down('#tbPageTotal');
			//palFaxFileTabPngBig
			//var palPngContainerBig = me.getFilepngviewBig();
			//清空
			palPng.removeAll();
			var param = {};
			param.faxfileid = viewType.getFaxFileId();
			//param.req = 'call';
			param.sessiontoken = sessionToken;
			//param.filepngname = 'filepng';
			param.createOrg = '1';

			var currPage = 0;
			viewType.setCurrCountBig(currPage);
			//var totalCount = response.data;
			currPage++;
			viewType.setCurrCountBig(currPage);
			//currCountBig++;
			//如已有选择
			var itemSelect;

			if (viewType.getPngSels().getCount() > 0) {
				viewType.getPngSels().sortByKey();
				itemSelect = viewType.getPngSels().first();
				viewType.getPngSelBig().clear();
				viewType.getPngSelBig().add(itemSelect.id, itemSelect);
				var paraStr = itemSelect.src.substr(itemSelect.src.indexOf('?') + 1, itemSelect.src.length);
				var str = paraStr.split('&');
				var cpage = str[3].split('=')[1];
				viewType.setCurrCountBig(cpage);
				//txtCurrPage
				var txtCurrPage = me.getFilepngviewToolBar().down('#txtCurrPage');
				txtCurrPage.setValue(cpage);
			} else {
				if (!(viewType.getPngSelBig().getCount() > 0)) {
					var imList = me.getFilepngviewMini().query('image');
					if(imList && imList.length>0) {
						var defaultImg = imList[0];
						viewType.getPngSelBig().clear();
						viewType.getPngSelBig().add(defaultImg.id, defaultImg);
					}

				}

			}

			viewType.setIsLoadedBig(1);
			//在Grid选择变化后重置
			//isLoaded = 0;faxFileId=select
			//调用图加载
			var curBigC = me.getFilepngviewToolBar().down('#txtCurrPage').getValue();
			if(curBigC > viewType.getTotalCount()) {
				curBigC = viewType.getTotalCount();
			}
			viewType.setCurrCountBig(curBigC);

			var param = {};
			param.sessiontoken = sessionToken;
			param.fileid = viewType.getFaxFileId();
			param.currpage= viewType.getCurrCountBig();
			if(param.currpage == 0) {
				param.currpage =1;
			}

			if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
				param.fpid = winType.faxpaperid;
			}

			var pngNStyle = {
				border: '1px solid black',
				'background-color':'#FFFFFF',
				'background-image':'none',
				'background-repeat': 'no-repeat'
			};
			if(winType.pngGroup == 'sendfax' && winType.faxpaperid != '0') {
				pngNStyle = {
					border: '1px solid black',
					'background-image':'url('+WsConf.Url+'?req=rc&rcname=loadfaxpaper&type=big&fpid='+winType.faxpaperid+')',
					'background-repeat': 'no-repeat'
				};
			}

			var fitImage = Ext.create('Ext.Img', {
				style: pngNStyle,
				listeners: {
					afterrender: function (img, opts) {
						var imgDom = img.getEl();
						//大图双击
						imgDom.on('dblclick', function () {
							//faxfillwin = loadFaxView();
							// faxfillwin.show();
							//调用切换视图
							ActionBase.getAction('filepngviewviewTypeChange').execute();
						});
					}
				}
			});

			palPng.add(fitImage);

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				fitImage.setSrc(WsConf.Url + info.url);
				palPng.setHeight(info.height +2);
				palPng.setWidth(info.width + 2);

				viewType.setPngContainerBig(fitImage);

				resetMiniForFP(info.pages,winType);
			}, function(response, opts) {

			}, true);
			//}, function (response, opts) {
			//	Ext.Msg.alert('登录失败', response.msg);
			//}, true);
			//tabchange结束

			if (palPngMini) {
				palPngMini.hide();
			}
			if (palPng) {
				palPng.show();
			}
			//ToolBar按钮状态

			//me.getFilepngviewToolBar().getComponent('filepngviewrotateLeft').setDisabled(false);
			//me.getFilepngviewToolBar().getComponent('filepngviewrotateRight').setDisabled(false);
			//判断页码
			var count = me.getFilepngviewToolBar().down('#txtCurrPage').getValue();

			ActionBase.updateActions('filepngview', 1,viewType.getPngSels().getCount(),viewType.getTotalCount(),count);

			me.getFilepngviewToolBar().down('#txtCurrPage').setValue(curBigC);
			me.getFilepngviewToolBar().down('#txtCurrPage').setDisabled(false);
			//fit
			me.getFilepngviewToolBar().down('#filepngviewfistPage').setVisible(true);
			me.getFilepngviewToolBar().down('#filepngviewprePage').setVisible(true);
			me.getFilepngviewToolBar().down('#tbPageTotal').setVisible(true);
			me.getFilepngviewToolBar().down('#txtCurrPage').setVisible(true);
			me.getFilepngviewToolBar().down('#filepngviewnextPage').setVisible(true);
			me.getFilepngviewToolBar().down('#filepngviewlastPage').setVisible(true);
			//mini
			//tabPngView.down('#txtMiniCurrPage').setValue(1);
			me.getFilepngviewToolBar().down('#txtMiniCurrPage').setVisible(false);
			me.getFilepngviewToolBar().down('#tbMiniPageTotal').setVisible(false);

		} else {//缩略图

			me.getFilepngviewviewTypeChangeBtn().setText('单页图');
			me.getFilepngviewviewTypeChangeBtn().setTooltip('单页图');
			me.getFilepngviewviewTypeChangeBtn().setIconCls('faxPngPageView');
			viewType.setViewType(0);

			if (palPngMini) {
				palPngMini.show();
			}
			if (palPng) {
				palPng.hide();
			}

			//还原Scroll 位置
			basePal.body.dom.scrollLeft =viewType.miniSclLeft;
			basePal.body.dom.scrollTop =viewType.miniSclTop;

			//ToolBar按钮状态
			ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),viewType.getTotalCount(),0);
			//me.getFilepngviewToolBar().getComponent('filepngviewrotateLeft').setDisabled(true);
			//me.getFilepngviewToolBar().getComponent('filepngviewrotateRight').setDisabled(true);
			//me.getFilepngviewToolBar().getComponent('filepngviewfistPage').setDisabled(true);
			//me.getFilepngviewToolBar().getComponent('filepngviewprePage').setDisabled(true);

			me.getFilepngviewToolBar().down('#txtCurrPage').setDisabled(true);

			//fit
			me.getFilepngviewToolBar().down('#filepngviewfistPage').setVisible(false);
			me.getFilepngviewToolBar().down('#filepngviewprePage').setVisible(false);
			me.getFilepngviewToolBar().down('#tbPageTotal').setVisible(false);
			me.getFilepngviewToolBar().down('#txtCurrPage').setVisible(false);
			me.getFilepngviewToolBar().down('#filepngviewnextPage').setVisible(false);
			me.getFilepngviewToolBar().down('#filepngviewlastPage').setVisible(false);
			//mini
			//tabPngView.down('#txtMiniCurrPage').setValue(1);
			me.getFilepngviewToolBar().down('#txtMiniCurrPage').setVisible(true);
			me.getFilepngviewToolBar().down('#tbMiniPageTotal').setVisible(true);

			if(winType &&winType.defaultFitPng&&viewType.isLoaded == 0 && !suppressLoad) {

				var imList = me.getFilepngviewMini().query('image');
				if(imList && imList.length >=pngPageSize) {
					//重新设置nextTwenty按钮的文本
					var nextTtbtn = winType.down('#nextTwenty');
					if(nextTtbtn) {
						var count = (viewType.getTotalCount()-pngPageSize*parseInt(viewType.miniCurPage));
						count =count > pngPageSize ?pngPageSize:count;
						nextTtbtn.setText('下'+count+'张');
					}
					return;
				}
				var hidForm = winType.down('#hidFileId');
				var hidLoaded = winType.down('#hidLoaded');
				var hidUpFileType = winType.down('#UpFileType');
				//向后，向前插入
				var upfiletype = hidUpFileType.getValue();
				var fileId = hidForm.getValue();
				viewType.initMyfilepngMini(null, hidLoaded,upfiletype,fileId, function() {
					setPngMiniWH(viewType,winType,'');
				},true,'正在生成缩略图...',winType.getEl(),10,viewType.miniCurPage,true, {
					fistLoadMini:true
				});
			}
		}
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(totoalPage == 0);
	}
});

//删除  filepngdeleteFilepng
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngdeleteFilepng',
	iconCls:'delAllFile',
	tooltip: '删除选择的文件',
	//text: '删除',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var viewType = me.getPngClass();

		var winType = me.getTargetView();
		if(winType.pngGroup == 'wfhandlerwin') {
			winType.hadEdit= true;
			//winType.hadStamp= true;
		}

		if(winType.pngGroup == 'docopenwin') {
			var imageList = me.getFilepngviewMini().query('image');

			if(imageList.length <=1 || viewType.getPngSels().getCount() >=imageList.length) {
				//alert(imageList.length+"--"+viewType.getPngSels().getCount());
				Ext.Msg.alert('消息','当前文档只剩一页,无法删除');
				return;
			}
		}

		var pngPageSize = 20;
		if(userConfig.miniPngSize == '1') {
			pngPageSize = 10;
		}

		newMesB.show({
			title:'删除',
			msg: '确定要删除吗？',
			buttons: Ext.MessageBox.YESNO,
			closable:false,
			fn: function(btn) {
				if (btn =="yes") {

					var imageList = me.getFilepngviewMini().query('image');
					var palPngContainer = winType.down('#filepngviewMini');

					var pageList = new Array();
					//处理当前png数组
					Ext.Array.each(imageList, function (item, index, allItems) {
						if(viewType.getPngSels().contains(item)) {
							pageList.push(item.ownerCt.down('label').text);
						}
					});
					//后台
					var param = {};
					param.fileId = winType.down('#hidFileId').getValue();
					//alert(param.fileId);
					param.pageList = pageList.join();
					param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
					if(param.fileId != '') {

						//调用
						WsCall.call('deletefilepng', param, function (response, opts) {

							//更新总数
							viewType.setCurrFaxFileTotal(viewType.getCurrFaxFileTotal()-pageList.length);
							var tmpCount = (viewType.getCurrFaxFileTotal()-(viewType.miniCurPage-1)*pngPageSize);
							//alert(pageList.length+":"+tmpCount);

							if(tmpCount<=pngPageSize) {
								//处理当前png数组
								Ext.Array.each(imageList, function (item, index, allItems) {
									if(index+1 > tmpCount) {
										palPngContainer.remove(item.ownerCt);
									}
								});
								var nextTwenty = me.getFilepngviewMini().query('button');
								Ext.Array.each(nextTwenty, function (item, index, allItems) {
									if(item.itemId && item.itemId == 'nextTwenty') {
										palPngContainer.remove(item.ownerCt);
									}
								});
							}

							//如果是不分页的，删除多余的页
							if(winType.pngGroup == 'faxtodocsingle') {
								//处理当前png数组
								Ext.Array.each(imageList, function (item, index, allItems) {
									if(index+1 > tmpCount) {
										palPngContainer.remove(item.ownerCt);
									}
								});
							}

							//清空选择数组
							viewType.getPngSels().clear();
							//清空大图选择
							viewType.getPngSelBig().clear();

							//重新设置Src
							imageList = me.getFilepngviewMini().query('image');
							//toolbar 按钮状态
							ActionBase.updateActions('filepngview', 0,viewType.getPngSels().getCount(),imageList.length,0);
							if(imageList.length ==0 && viewType.getCurrFaxFileTotal() == 0) {
								var hidForm = winType.down('#hidFileId');
								hidForm.setValue("");
								ActionBase.updateActions('acsendfaxwin',hidForm.getValue());

								ActionBase.updateActions('filepngview', 0,0,0,-1);
							}
							Ext.Array.each(imageList, function (item, index, allItems) {
								var srcStr =  item.src;
								if (item.src.search("&randomTime") >= 0) {
									srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
								}
								item.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
								//重置状态
								item.getEl().setStyle('border', '1px solid black');
								//重置以前选择数组的状态
								//追加到后方
								//设置为禁止拖拽
								uninitPatientDragZone(item);
								//设置为可拖放状态
								initializeHospitalDropZone(item,winType);
								// if(item.src  != srcStr) {
								// item.setSrc(srcStr);
								// }
							});
							//重新设置totalPage
							//tbFaxFileTabPng
							var tbPageTotal = winType.down('#tbPageTotal');
							tbPageTotal.setText('共'+'   ' + viewType.getCurrFaxFileTotal());
							viewType.setInsertStartPage(viewType.getCurrFaxFileTotal());
							viewType.setTotalCount(viewType.getCurrFaxFileTotal());

							//分页
							if(viewType.getCurrFaxFileTotal()%pngPageSize == 0) {
								viewType.miniTotalPage = parseInt(viewType.currFaxFileTotal/pngPageSize);
							} else {
								viewType.miniTotalPage = parseInt(viewType.currFaxFileTotal/pngPageSize)+1;
							}
							winType.down('#tbMiniPageTotal').setText('共'+'   '+ viewType.miniTotalPage);
						}, function (response, opts) {
							Ext.Msg.alert('失败', response.msg);
						}, true);
					}
				}
			},
			icon: Ext.MessageBox.QUESTION
		});

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(viewType==0?selsCount<=0:true);
	}
});

//编辑本页
Ext.create('WS.tbnorth.filepngview', {
	itemId: 'filepngenditorpng',
	tooltip: '编辑文件',
	text: '编辑',
	iconCls:'stampEditor',
	//disabled: true,
	handler: function (button, event) {
		var me = this;
		var viewType = me.getPngClass();
		var winType = me.getTargetView();

		(new Ext.util.DelayedTask()).delay(100, function() {
			loadFaxEditor();

			hideFlash(winType);
			me.setDisabled(true);
			if(winImageEditor != '') {
				winImageEditor.close();
				winImageEditor = '';
			}
			//设置stampclass 初始值
			stampcls = new stampclass();
			stampcls.getStampList().clear();
			//图章序列
			//stampClsArr = new Ext.util.MixedCollection();

			//装载图片数据
			if (viewType.getPngSels().getCount() > 0) {
				viewType.getPngSels().sortByKey();
				var itemSelect;
				var paraStr;
				var str;
				var cpage=1;
				//判断当前的视图
				if(viewType.viewType == 0) {
					itemSelect = viewType.getPngSels().first();
					paraStr = itemSelect.src.substr(itemSelect.src.indexOf('?') + 1, itemSelect.src.length);
					str = paraStr.split('&');
					cpage = str[3].split('=')[1];
				}
				if(viewType.viewType == 1) {
					itemSelect = viewType.getPngContainerBig();
					paraStr = itemSelect.src.substr(itemSelect.src.indexOf('?') + 1, itemSelect.src.length);
					str = paraStr.split('&');
					cpage = str[3].split('=')[1];
				}

				var param = {};
				param.sessiontoken = sessionToken;
				param.fileid = viewType.getFaxFileId();
				param.currpage=cpage;
				if(winType.pngGroup != 'sendfax' && winType.pngGroup != 'docwin') {
					param.load = true;
				}

				WsCall.call('loadfitpng', param, function(response, opts) {
					var info = Ext.JSON.decode(response.data);

					var imSrc1 = WsConf.Url +info.url;

					//图片编辑器
					winImageEditor = createImgEditor(imSrc1,winType);
					winImageEditor.winType = winType;
					//txtCurrPage
					var txtCurrPage = winImageEditor.down('#txtCurrPage');
					txtCurrPage.setValue(cpage);

					winImageEditor.down('#tbPageTotal').setText(winType.down('#tbPageTotal').text);
					//设置按钮状态

					ActionBase.updateActions('imageEditor', viewType.getTotalCount(),cpage);
					me.setDisabled(false);
				}, function(response, opts) {

				}, true);
			} else {

				if (!(viewType.getPngSelBig().getCount() > 0)) {
					var imList = me.getFilepngviewMini().query('image');
					if(imList && imList.length>0) {
						var defaultImg = imList[0];
						viewType.getPngSelBig().clear();
						viewType.getPngSelBig().add(defaultImg.id, defaultImg);
					}

				}

				var param = {};
				param.sessiontoken = sessionToken;
				param.fileid = viewType.getFaxFileId();
				param.currpage=1;
				if(viewType.viewType == 1) {
					var itemSelect = viewType.getPngContainerBig();
					var paraStr = itemSelect.src.substr(itemSelect.src.indexOf('?') + 1, itemSelect.src.length);
					var str = paraStr.split('&');
					param.currpage = str[3].split('=')[1];
				}
				if(winType.pngGroup != 'sendfax' && winType.pngGroup != 'docwin') {
					param.load = true;
				}

				WsCall.call('loadfitpng', param, function(response, opts) {
					var info = Ext.JSON.decode(response.data);

					var imSrc = WsConf.Url +info.url;

					//图片编辑器
					winImageEditor = createImgEditor(imSrc,winType);
					winImageEditor.winType = winType;
					winImageEditor.down('#tbPageTotal').setText(winType.down('#tbPageTotal').text);
					//设置按钮状态
					ActionBase.updateActions('imageEditor', viewType.getTotalCount(),param.currpage);
					me.setDisabled(false);
				}, function(response, opts) {

				}, true);
			}
		});
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		var me = this;
		me.setDisabled(viewType==0?totoalPage <= 0:false);
	}
});

//setTargetView
ActionBase.setTargetView('filepngview',imgVgetTargetView);

//====================================================================================================================//
//=======================================viewFaxFileTab 控件========================================================//
//====================================================================================================================//

//传真缩略图Panel
//MiniPanel
Ext.define('ws.tbnorth.filepngviewMini', {
	alias: 'widget.filepngviewMini',
	extend: 'Ext.Panel',
	alternateClassName: ['filepngviewMini'],
	itemId: 'filepngviewMini',
	frame: false,
	border:false,
	// width: 880,
	// height:307,
	layout: {
		type: 'auto',
		width: 100
	},
	bodyStyle: {
		background: '#DFE8F6'
	},
	autoScroll:false,
	defaults: {
		xtype: 'image',
		width: 100,
		height: 100,
		margin: '5 2 5 2',
		style: {
			'float':'left'
		}
	},
	//title: 'Mini传真图',
	items: []
});
//大图Panel
Ext.define('ws.tbnorth.filepngviewBig', {
	alias: 'widget.filepngviewBig',
	extend: 'Ext.Panel',
	alternateClassName: ['filepngviewBig'],
	itemId: 'filepngviewBig',
	frame: false,
	border:false,
	bodyStyle: {
		background: '#DFE8F6'
	},
	autoScroll: false,
	//width: '100%',
	//height: 1200,
	margin: '2 1 2 1',
	layout: {
		type: 'auto'
	},
	defaults: {
		xtype: 'image',
		border:true
	},
	//title: 'Mini传真图',
	items: []
});

//====传真文件图工具栏====
Ext.define('ws.tbnorth.tbfilepngview', {
	alias: 'widget.tbfilepngview',
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: ['tbfilepngview'],
	itemId: 'tbfilepngview',
	// initComponent : function() {
	// var me = this;
	// var filter = '';
	// me.callParent(arguments);	// 调用父类方法
	//
	// },
	statics: {
		faxCover: function(param,maskTarget, hidForm, fileId, hidLoaded,upfiletype,op, val,swfokfun) {
			var winType = op.up('window');
			WsCall.call('faxcovert', param, function(response1, opts) {
				var fid = response1.data;
				hidForm.setValue(fid);
				//alert(hidForm.getValue());
				//Ext.Msg.alert('上传信息', '处理完成');
				var progressBar = winType.down('#bottomProgressBar');
				var btnCancel = winType.down('#btnCancel');
				var btnContinue = winType.down('#btnContinue');
				btnCancel.hide();
				btnContinue.hide();
				//btnCancel.setDisabled(false);
				var tmpCurPage = 1;

				if(fileId == '') {
					winType.pngClass = new filepngviewclass();
				} else {
					winType.pngClass.setIsLoaded(0);
					tmpCurPage = winType.pngClass.miniCurPage;
					if(winType.pngClass.miniCurPage == winType.pngClass.miniTotalPage) {
						winType.pngClass.ifLoading = 1;
						var palPngContainer = winType.down('#filepngviewMini');
						palPngContainer.removeAll();
					}
				}

				winType.pngClass.setFaxFileId(fid);
				//初始化图片浏览panel
				hidLoaded.setValue('1');
				winType.pngClass.initMyfilepngMini(maskTarget, hidLoaded,upfiletype,fileId, function() {

					if(swfokfun) {
						swfokfun();
					}
				},true,'正在生成传真图...',winType.getEl(),10,tmpCurPage);
				//设置前后插入等按钮状态
				ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
				if(hidForm.getValue() == '') {
					winType.down('#txtMiniCurrPage').setDisabled(true);
				} else {
					winType.down('#txtMiniCurrPage').setDisabled(false);
				}
			}, function(response, opts) {
				// if(swfokfun) {
				// swfokfun();
				// }
				if(!errorProcess(response.code,swfokfun)) {
					if(response.code != WaveFaxConst.ResFullPrint) {
						Ext.Msg.alert('转换失败', response.msg);
					} else {
						var win = Ext.create('Ext.window.Window', {
							iconCls: 'delinfax',
							title: '转换失败',
							height: 140,
							width: 280,
							layout: 'vbox',
							defaults: {
								margin: '5 10 8 10',
								width: 250,
								xtype: 'button'
							},
							resizable: false,
							modal: true,
							items: [{
								xtype: 'label',
								text: '没有空闲的传真文档转换队列'
							},{
								text: '再次尝试文档转换',
								handler: function() {
									// 调用
									tbfilepngview.faxCover(param,maskTarget, hidForm, fileId, hidLoaded,upfiletype,op,val);
									this.up('window').close();
								}
							},{
								text: '直接提交文档，排队转换',
								itemId: 'subFileId',
								disabled: winType.pngGroup == 'docwin',
								handler: function() {
									WsCall.call('submitFile', param, function(response, opts) {
										hidForm.setValue(param.fileId);
										var msg = winType.down('#submitMessage');
										msg.show();
										msg.setText('提交的文档是:' + "<img src='"+getFileIcon(val)+"' style='margin-bottom: -4px;'>" +  val);
									}, function(res) {
										Ext.Msg.alert('直接提交失败', res.msg);
									}, true, '正在提交文档...');
									this.up('window').close();
								}
							}]
						});
						win.show('', function() {
							if(hidForm.getValue() != '') {
								win.down('#subFileId').setDisabled(true);
							}
						});
					}
				}

			}, true,'正在转换...',winType.getEl(),10);
		}
	},
	items: [{
		xtype:'hidden',
		submitValue:false,
		itemId:'UpFileType',
		name:'UpFileType',
		value:'0'
	},{
		text:'添加文件',
		width: 100,
		iconCls: 'addFiles',
		hidden:true,
		itemId:'fileLocalPath',
		handler: function(btn,e) {
			var me = this;
			var winType = this.up('window');
			var hidForm = winType.down('#hidFileId');
			var fileId = hidForm.getValue();
			//调用跨域
			WsCall.callOtherDomain('',fileId,winType);
			e.stopEvent();
		}
	},{
		xtype: 'filefield',
		itemId:'filePath',
		name: 'filePath',
		buttonOnly: true,
		hidden:isSurportFlash,
		//hideLabel: true,
		buttonText: '添加文件',
		labelWidth: 1,
		width:100,
		allowBlank: true,
		blankText: "请选择需要上传的文件!",
		buttonConfig: {
			width: 100,
			iconCls: 'addFiles'
		},
		listeners: {
			'change': function (fb, v) {
				var me = this;
				if(v =='') {
					return;
				}
				var fType = me.getValue().substring(me.getValue().lastIndexOf('.')+1,me.getValue().length).toLowerCase();
				//alert(fType);

				var returnFlag = true;
				//本地打印机
				// if(userConfig.printerSrc=='1') {
				// returnFlag = false;
				// }
				Ext.Array.each(supportType, function(item,index,items) {
					//alert(item+":"+ fType+","+(item == fType));
					if(item == fType) {
						returnFlag = false;
						return;
					}
				});
				if(returnFlag) {
					Ext.Msg.alert('添加文件','不支持的文件格式！');
					return;
				}
				var winType = me.up('window');
				var maskTarget = me.up('form');
				var hidForm = winType.down('#hidFileId');

				var hidLoaded = winType.down('#hidLoaded');
				var hidUpFileType = winType.down('#UpFileType');
				//向后，向前插入
				var upfiletype = hidUpFileType.getValue();
				var fileId = hidForm.getValue();

				var form = me.up('form').getForm();

				//var tt = this.up('form').ownerCt;

				var d = new Date();
				var ranId = "";
				ranId += d.getYear();
				ranId += d.getMonth();
				ranId += d.getDate();
				ranId += d.getHours();
				ranId += d.getMinutes();
				ranId += d.getSeconds();
				var urlStr;
				// if(fileId == '') {
				// urlStr = WsConf.Url + "?req=call&callname=fileupload&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "&upfiletype="+upfiletype+"&randomid=tmp" + ranId;
				// } else {
				urlStr = WsConf.Url + "?req=call&callname=fileupload&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "&upfiletype="+upfiletype+"&fileId="+fileId+"&randomid=tmp" + ranId;
				//}
				//urlStr = "http://10.0.0.4:8080/faxserver/"+WsConf.Url + "?req=call&callname=fileupload&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "&upfiletype="+upfiletype+"&fileId="+fileId+"&randomid=tmp" + ranId;

				form.submit({
					url: urlStr,
					waitMsg: '正在上传...',
					waitTitle: '等待文件上传,请稍候...',
					success: function (fp, o) {
						winType.edit = true;
						//正在转换  等待转换  delay50
						var param1 = {};
						param1.sessiontoken = sessionToken;
						param1.fileId = Ext.JSON.decode(o.response.responseText).data;
						param1.printer = 0;
						param1.ptType = userConfig.prType;//0doc 1photo
						if(userConfig.printerSrc == '1') {
							param1.printer = 1;
						}

						var lblM = winType.down('#submitMessage');
						lblM.show();
						if(lblM.text != '') {
							WsCall.call('submitFile', param1, function(response, opts) {
								hidForm.setValue(param1.fileId);
								lblM.setText('提交的文档是:' +"<img src='"+getFileIcon(v)+"' style='margin-bottom: -4px;'>" +  v);
							}, function(res) {
								Ext.Msg.alert('直接提交失败', res.msg);
							}, true, '正在提交文档...');
							return;
						}

						// 调用
						tbfilepngview.faxCover(param1,maskTarget, hidForm, fileId, hidLoaded,upfiletype,me,v);

					},
					failure: function (fp, ac) {
						Ext.Msg.alert('上传信息', ac.result.msg);
						// if(callMask) {
						// callMask.hide();
						// }
					}
				});

			}
		}
	},{
		xtype:'container',
		width:63,
		height:23,
		//hidden:!isSurportFlash,
		frame:false,
		itemId:'replacePal',
		items:[{
			xtype:'container',
			frame:false,
			itemId:'spanButtonPlaceholder'
		}]

	},{
		xtype:'tbseparator',
		myname:'edit'
	}
	,ActionBase.getAction('filepngviewrotateLeft'),
	ActionBase.getAction('filepngviewrotateRight'),
	ActionBase.getAction('filepngviewoverturn'),{
		xtype:'tbtext',
		itemId:'emptyTxt',
		text:'        '
	},{
		xtype:'tbseparator'
	}, ActionBase.getAction('filepngviewfistPage'),
	ActionBase.getAction('filepngviewprePage'),{
		xtype: 'tbtext',
		text: '页数'
	},{
		itemId: 'txtMiniCurrPage',
		xtype: 'numberfield',
		width: 30,
		minValue: 1,
		hideTrigger: true,
		enableKeyEvents: true,
		selectOnFocus: false,
		submitValue: false,
		disabled: true,
		margins: '-1 2 3 2',
		value: 1,
		listeners: {
			keypress : function(field, e, opts) {
				if (e.getKey() == e.ENTER) {
					field.fireEvent('blur',field);
				}
			},
			blur: function (com, opts) {
				var me = this;
				var winType = me.up('window');
				if(winType.pngClass.miniCurPage == com.getValue()) {
					return;
				}
				var currpage = com.getValue();
				if ((currpage > winType.pngClass.miniTotalPage && currpage != '1') || currpage < 1) {
					currpage = 1;
					com.setValue(currpage);
				}
				winType.pngClass.miniCurPage =currpage;

				if (winType.runner) {
					winType.pngClass.ifLoading = 1;
					winType.runner.stopAll();
					var hidForm2 = winType.down('#hidFileId');
					var hidLoaded2 = winType.down('#hidLoaded');
					var hidUpFileType2 = winType.down('#UpFileType');
					//向后，向前插入
					var upfiletype2 = hidUpFileType2.getValue();
					var fileId2 = hidForm2.getValue();
					var palPngContainer = winType.down('#filepngviewMini');
					palPngContainer.removeAll();

					winType.pngClass.initMyfilepngMini(null, hidLoaded2,upfiletype2,fileId2, function() {
						setPngMiniWH(viewType,winType,'');
					},true,'正在生成缩略图...',winType.getEl(),10,winType.pngClass.miniCurPage,true);
				}

			},
			change: function (com, nVal, oVal, opts) {
				var me = this;
				var winType = me.up('window');
				if(!nVal || !oVal) {
					return;
				}
				if ((nVal > winType.pngClass.miniTotalPage && nVal != '1') || nVal < 1) {
					com.setValue(oVal);
				}
			} //change
		}

	},{
		itemId: 'tbMiniPageTotal',
		xtype: 'tbtext',
		text: '共'+'   0'
	},{
		itemId: 'txtCurrPage',
		xtype: 'numberfield',
		width: 30,
		minValue: 1,
		hideTrigger: true,
		enableKeyEvents: true,
		selectOnFocus: false,
		submitValue: false,
		disabled: true,
		margins: '-1 2 3 2',
		value: 1,
		listeners: {
			keypress : function(field, e, opts) {
				if (e.getKey() == e.ENTER) {
					field.fireEvent('blur',field);
				}
			},
			blur: function (com, opts) {
				var me = this;
				var winType = me.up('window');
				//alert(com.value);
				//设置大图的src pngContainerBig
				var currpage = com.getValue();
				if ((currpage > winType.pngClass.getCurrFaxFileTotal() && currpage != '1') || currpage < 1) {
					currpage = 1;
					com.setValue(currpage);
				}
				winType.pngClass.getPngContainerBig().setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + winType.pngClass.getFaxFileId() + "&currpage=" + currpage + "");

			},
			change: function (com, nVal, oVal, opts) {

				var me = this;
				var winType = me.up('window');
				if(!nVal || !oVal) {
					return;
				}
				if ((nVal > winType.pngClass.getCurrFaxFileTotal() && nVal != '1') || nVal < 1) {
					//alert('输入的页码超过了总页数！');
					if (oVal == winType.pngClass.getCurrFaxFileTotal()) {
						ActionBase.getAction('filepngviewnextPage').setDisabled(true);
						ActionBase.getAction('filepngviewlastPage').setDisabled(true);
					} else {
						ActionBase.getAction('filepngviewnextPage').setDisabled(false);
						ActionBase.getAction('filepngviewlastPage').setDisabled(false);
					}
					if (oVal == '1') {
						ActionBase.getAction('filepngviewfistPage').setDisabled(true);
						ActionBase.getAction('filepngviewprePage').setDisabled(true);
					} else {
						ActionBase.getAction('filepngviewfistPage').setDisabled(false);
						ActionBase.getAction('filepngviewprePage').setDisabled(false);
					}
					com.setValue(oVal);

				} else {
					if (nVal == winType.pngClass.getCurrFaxFileTotal()) {
						ActionBase.getAction('filepngviewnextPage').setDisabled(true);
						ActionBase.getAction('filepngviewlastPage').setDisabled(true);
					} else {
						ActionBase.getAction('filepngviewnextPage').setDisabled(false);
						ActionBase.getAction('filepngviewlastPage').setDisabled(false);
					}
					if (nVal == '1') {
						ActionBase.getAction('filepngviewfistPage').setDisabled(true);
						ActionBase.getAction('filepngviewprePage').setDisabled(true);
					} else {
						ActionBase.getAction('filepngviewfistPage').setDisabled(false);
						ActionBase.getAction('filepngviewprePage').setDisabled(false);
					}

				}

			} //change
		}

	},{
		itemId: 'tbPageTotal',
		xtype: 'label',
		text: '共'+'   0'
	}, "&nbsp&nbsp&nbsp", ActionBase.getAction('filepngviewnextPage'),
	ActionBase.getAction('filepngviewlastPage'),
	"-",{
		text: '选择',
		iconCls:'actionSelect',
		itemId: 'filesel',
		menu: [ActionBase.getAction('filepngviewselectAll'),ActionBase.getAction('filepngviewselectToggle')]
	} ,
	"-", ActionBase.getAction('filepngviewviewTypeChange'),'-'
	,ActionBase.getAction('filepngdeleteFilepng'),
	ActionBase.getAction('delAllFile'),{
		xtype:'tbseparator',
		itemId:'tbdelAllFile'
	},ActionBase.getAction('faxpaper')
	,{
		xtype:'tbseparator',
		itemId:'tbfaxpaper',
		hidden:true
	},ActionBase.getAction('filepngenditorpng')]
});