//====================================================================================================================//
//=======================================    本页全局变量       =======================================================//
//====================================================================================================================//
//是否已经加载
var isLoaded = 0; //Mini
var isLoadedBig = 0;//Big
//是否继续加载
var ifLoading = 1;//Mini
//文件ID
var faxFileId = 0;
//是否全选
var selectAll = 0;
//所有选中的Png 数组
var pngSels = new Ext.util.MixedCollection();//缩略图数组
var pngSelBig = new Ext.util.MixedCollection();//大图数组
//所有缩略图Png数组
var pngAllMini = new Ext.util.MixedCollection();
//单页视图Img对象
var pngContainerBig = "";
//默认选择视图模式
var viewType = 0;
//单页图全局currPage
var currCountBig = 0;
//当前传真总页数
var currFaxFileTotal = 1;
//当前的runner
var runner;
//Time控制
var task;
//shift选择记录位置
var shiftImg = 0;
//mini图当前页码
var miniCurPage = 1;
//mini图总页数
var miniTotalPage = 0;

//加载发送详细信息
function loadSendDetailInfo(detailForm,srcGird,width) {
	// 调用
	if(document.getElementById('disInfo')) {
		var aDom = document.getElementById('disInfo');
		aDom.onclick = '';
		aDom.disabled = true;
		aDom.style.color = 'gray';
	}
	//var mainForm = Ext.getCmp('viewPortEast');
	var detailPanel = viewFaxFileTab.down('#detailTab');
	var width = detailPanel.getWidth()>40? detailPanel.getWidth()-40 : detailPanel.getWidth();
	var html = "";
	html += "<table cellspacing='0' width="+width+"px class='myDTable'><tbody>";
	html += "<tr><td class='cpTd'>"+'开始时间'+"</td>";
	html += "<td class='cpTd'>"+'持续时间'+"</td>";
	html += "<td class='cpTd'>"+'是否接通'+"</td>";
	html += "<td class='cpTd'>"+'发送页数'+"</td>";
	html += "<td class='cpTd'>"+'传真协议'+"</td>";
	html += "<td class='cpTd'>"+'费用'+"</td>";
	html += "<td class='cpTd'>"+'设备端口'+"</td>";
	html += "<td class='cpTd'>"+'错误信息'+"</td></tr>";

	var sel = srcGird.getSelectionModel().getSelection()[0];
	var param = {
		faxId:srcGird.getSelectionModel().getSelection()[0].data.outFaxID,
		sessiontoken:sessionToken
	}
	WsCall.call('senddetailinfo', param, function(response, opts) {
		//alert(response.data);
		var deInfo = Ext.JSON.decode(response.data);
		Ext.Array.each(deInfo, function(info,index,allInfos) {
			//var ifo = Ext.JSON.decode(info);
			html += "<tr><td>"+UTCtoLocal(info.sendDateTime)+"</td>";
			html += "<td>"+faxDuration(info.duration)+"</td>";
			var connected = info.connected?'是':'否';
			html += "<td>"+connected+"</td>";
			html += "<td>"+info.sentPages+"</td>";
			html += "<td>"+info.protocol+"</td>";
			html += "<td>"+info.charge.toString()+"</td>";
			html += "<td>"+info.portName+"</td>";
			html += "<td>"+outFaxErrCodeArr[info.errCode]+"</td></tr>";
		});
		html +="</tbody></table><br/>";
		//if(detailForm.html) {
		//detailForm.update(detailForm.html+html);
		document.getElementById('disInfoDiv').innerHTML = html;
		//}
		// else {
		// if(srcGird.itemId == 'Infaxgrid')
		// detailForm.update(createInfaxHtml(sel)+html);
		// if(srcGird.itemId == 'outfaxgrid')
		// detailForm.update(createOutfaxHtml(sel)+html);
		// if(srcGird.itemId == 'succoutfaxgrid')
		// detailForm.update(createSuccoutfaxHtml(sel)+html);
		// if(srcGird.itemId == 'draftgrid')
		// detailForm.update(createDraftHtml(sel)+html);
		// }

		if(document.getElementById('disInfo')) {
			var aDom = document.getElementById('disInfo');
			aDom.onclick = '';
			aDom.disabled = true;
			aDom.style.color = 'gray';
		}
	}, function(response, opts) {
		if(!errorProcess(response.code)) {
			Ext.Msg.alert('发送详细信息', '加载发送详细信息失败');
		}
		if(document.getElementById('disInfo')) {
			var aDom = document.getElementById('disInfo');
			aDom.onclick = function() {
				loadSendDetailInfo(detailFormForOutfaxgrid,outfax);
			}
			aDom.disabled = false;
			aDom.style.color = 'blue';
		}
	}, false);
	//me.up('#panel').doLayout();
}

//取消事件
var cancelClick = function (btn, e, opts) {
	ifLoading = 0;
	runner.stopAll();
	var mainForm = Ext.getCmp('viewPortEast');
	var btnContinue = mainForm.down('#btnContinue');
	btnContinue.show();
};
//继续事件btnContinue
var continueClick = function (btn, e, opts) {
	ifLoading = 1;
	runner.start(task);
};
//初始化所有参数
function initAllFaxFileTabPngConfig(fileid,mnCurpage) {
	//是否已经加载
	isLoaded = 0; //Mini
	isLoadedBig = 0; //Big
	//是否继续加载
	ifLoading = 1; //Mini
	if(fileid != null) {
		//文件ID
		faxFileId = fileid;
	}

	//是否全选
	selectAll = 0;
	//所有选中的Png 数组
	pngSels.clear(); //缩略图数组
	pngSelBig.clear(); //大图数组
	//所有缩略图Png数组
	pngAllMini.clear();
	//单页视图Img对象
	pngContainerBig = "";
	//默认选择视图模式
	viewType = 0;
	//单页图全局currPage
	currCountBig = 0;
	//当前传真总页数
	currFaxFileTotal = 1;
	if(mnCurpage) {
		//mini图当前页码
		miniCurPage = mnCurpage;
	}

	//mini图总页数
	miniTotalPage = 0;

}

function gridSelsChange() {

	//var mainForm = Ext.getCmp('viewPortEast');

	var tabPngView = viewFaxFileTab;
	//按钮
	//var tabBtnDetail = mainForm.down('#btnDetail');
	//var tabBtnPng = mainForm.down('#btnPng');

	//var tabPngTab = tabPngView.getComponent('PngTab');

	//if (tabPngView.activeTab.title == "传真图" && isLoaded == 0 && viewType == 0) {
	if (isLoaded == 0 && viewType == 0) {
		var progressBar = southTb.down('#bottomProgressBar');;
		var btnCancel = southTb.down('#btnCancel');
		var btnContinue = southTb.down('#btnContinue');
		progressBar.hide();
		btnCancel.hide();
		btnContinue.hide();
		btnCancel.setDisabled(false);

		//palFaxFileTabPngMini palFaxFileTabPng
		var palPng = tabPngView.down('#palFaxFileTabPng');
		var palPngMini = tabPngView.down('#palFaxFileTabPngMini');
		if (palPngMini) {
			palPngMini.show();
		}
		if (palPng) {
			palPng.hide();
		}
		palPngMini.removeAll();
		palPngMini.update('');
		//ToolBar按钮状态
		tabPngView.down('#rotateLeft').setDisabled(true);
		tabPngView.down('#rotateRight').setDisabled(true);
		tabPngView.down('#overturn').setDisabled(true);
		//mini
		tabPngView.down('#txtMiniCurrPage').setValue(miniCurPage);
		tabPngView.down('#txtMiniCurrPage').setVisible(true);
		tabPngView.down('#tbMiniPageTotal').setVisible(true);

		//fit
		tabPngView.down('#fistPage').setDisabled(true);
		tabPngView.down('#fistPage').setVisible(false);
		tabPngView.down('#prePage').setDisabled(true);
		tabPngView.down('#prePage').setVisible(false);
		tabPngView.down('#tbPageTotal').setVisible(false);
		tabPngView.down('#txtCurrPage').setDisabled(true);
		tabPngView.down('#txtCurrPage').setVisible(false);
		tabPngView.down('#txtCurrPage').setValue(1);
		tabPngView.down('#nextPage').setDisabled(true);
		tabPngView.down('#nextPage').setVisible(false);
		tabPngView.down('#lastPage').setDisabled(true);
		tabPngView.down('#lastPage').setVisible(false);

		tabPngView.down('#selectAll').setDisabled(false);
		tabPngView.down('#selectToggle').setDisabled(false);
		tabPngView.down('#viewTypeChange').setDisabled(false);
		//tabPngView.getActiveTab().getComponent('tbFaxFileTabPng').getComponent('viewTypeChange').toggle(false);
		tabPngView.down('#viewTypeChange').setText('单页图');
		tabPngView.down('#viewTypeChange').setTooltip('单页图');
		tabPngView.down('#viewTypeChange').setIconCls('faxPngPageView');
		tabPngView.tabchange();

	}
}

///=======//图片编辑器toolbar用==========//
//图章加载状态
var coverDragStateA = 0;
var coverDragStateB = 0;

//图章图层
Ext.define('MySignet', {
	isDrag: false,
	offsetLeft: 0,
	offsetTop: 0,
	width: 0,
	height: 0,
	setPanelDimension: function (panel) {
		panel.setHeight(this.height);
		panel.setWidth(this.width);
		return this;
	},
	constructor: function (width, height, panel) {
		if (width) {
			this.width = width;
		}
		if (height) {
			this.height = height;
		}

		return this;
	}
});

//====================================================================================================================//
//=======================================viewFaxFileTab Action========================================================//
//====================================================================================================================//
//viewFaxFileTab
Ext.define('WS.action.viewFaxFileTab', {
	extend: 'WS.action.Base',
	category: 'viewFaxFileTab',
	//获取传真图MiniPanel - palFaxFileTabPngMini
	getPngTabPalMini: function () {
		return this.getTargetView().down('#palFaxFileTabPngMini');
	},
	getPngTabPal: function () {
		return this.getTargetView().down('#palFaxFileTabPng');
	},
	getPngTab: function () {
		return this.getTargetView().down('#PngTab');
	},
	getPngTabToolBar: function () {
		return this.getTargetView().down('#tbFaxFileTabPng');
	},
	//detailTab
	getDetailTab: function () {
		return this.getTargetView().down('#detailTab');
	},
	getViewChangeBtn: function () {
		return this.getTargetView().down('#viewTypeChange');
	}
});
//向左翻转
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'rotateLeft',
	tooltip: '向左翻转',
	text: '向左翻转',
	iconCls: 'faxPngRotateLeft',
	disabled: true,
	handler: function (button, event) {
		//mini
		if (viewType == 0) {

		} //if viewType 0
		else {
			var me = this;
			var palPngContainerBig = me.getPngTabPal();
			//alert(pngSelBig.first().src);
			//更新当前选择的大图，重设大图src,loadfitpng
			var paraStr = pngContainerBig.src.substr(pngSelBig.first().src.indexOf('?') + 1, pngSelBig.first().src.length);
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
				//pngContainerBig.setSrc(resData.pngurl + "&d=" + resData.modifiedtime);
				var srcStr = pngContainerBig.src;

				if (srcStr.search("&randomTime") >= 0) {
					srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
				}

				palPngContainerBig.setHeight(pngContainerBig.getWidth() +2);
				palPngContainerBig.setWidth(pngContainerBig.getHeight() +2);

				pngContainerBig.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
				//获取当前的pngSelBig.first() 元素，设置其src
				pngSelBig.first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
				//pngSelBig.first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&d=" + new Date());
			}, function (response, opts) {
				Ext.Msg.alert('翻转失败', response.msg);
			}, true);
		}
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(viewType == 0?true:false);
	}
});

//向右翻转
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'rotateRight',
	tooltip: '向右翻转',
	text: '向右翻转',
	iconCls: 'faxPngRotateRight',
	disabled: true,
	handler: function (button, event) {
		//mini
		if (viewType == 0) {

		} //if viewType 0
		else {
			var me = this;
			var palPngContainerBig = me.getPngTabPal();
			//alert(pngSelBig.first().src);
			//更新当前选择的大图，重设大图src,loadfitpng
			var paraStr = pngContainerBig.src.substr(pngSelBig.first().src.indexOf('?') + 1, pngSelBig.first().src.length);
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
				// pngContainerBig.setSrc(resData.pngurl + "&d=" + resData.modifiedtime);
				var srcStr = pngContainerBig.src;

				if (srcStr.search("&randomTime") >= 0) {
					srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
				}
				palPngContainerBig.setHeight(pngContainerBig.getWidth() +2);
				palPngContainerBig.setWidth(pngContainerBig.getHeight() +2);

				pngContainerBig.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
				//获取当前的pngSelBig.first() 元素，设置其src
				pngSelBig.first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
				//pngSelBig.first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&d=" + new Date());
			}, function (response, opts) {
				Ext.Msg.alert('翻转失败', response.msg);
			}, true);
		}
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(viewType == 0?true:false);
	}
});

//上下翻转
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'overturn',
	tooltip: '上下翻转',
	text: '上下翻转',
	iconCls: 'faxPngFlip',
	handler: function (button, event) {

		//mini
		if (viewType == 0) {
			if (pngSels.getCount() > 0) {
				pngSels.each( function (item, index, length) {

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
						//alert(item.src);
						//item.setSrc(resData.pngurl + "&d=" + resData.modifiedtime);
						var srcStr = item.src;

						if (srcStr.search("&randomTime") >= 0) {
							srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
						}
						item.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
					}, function (response, opts) {
						Ext.Msg.alert('翻转失败', response.msg);
					}, true);
				});
			}
		} //if viewType 0
		else {
			//alert(pngSelBig.first().src);
			//更新当前选择的大图，重设大图src,loadfitpng
			var paraStr = pngContainerBig.src.substr(pngSelBig.first().src.indexOf('?') + 1, pngSelBig.first().src.length);
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
				//pngContainerBig.setSrc(resData.pngurl + "&d=" + resData.modifiedtime);
				var srcStr = pngContainerBig.src;

				if (srcStr.search("&randomTime") >= 0) {
					srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
				}
				pngContainerBig.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
				//获取当前的pngSelBig.first() 元素，设置其src
				pngSelBig.first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
			}, function (response, opts) {
				Ext.Msg.alert('翻转失败', response.msg);
			}, true);
		}
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(viewType == 0?(selsCount==0):false);
	}
});

//首页
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'fistPage',
	tooltip: '首页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		me.getPngTabToolBar().getComponent('txtCurrPage').setValue(1);

		var palPngContainerBig = me.getPngTabPal();
		var param = {};
		param.sessiontoken = sessionToken;
		param.fileid = faxFileId;
		param.currpage=1;

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			pngContainerBig.setSrc(WsConf.Url +info.url);

			palPngContainerBig.setHeight(info.height +2);
			palPngContainerBig.setWidth(info.width + 2);

		}, function(response, opts) {

		}, true);
		//设置大图的src pngContainerBig
		//pngContainerBig.setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + faxFileId + "&currpage=1");
		//重设选中的大图数组pngSelBig
		// var tmpVal = 0;
		// if(miniCurPage > 1) {
		// tmpVal = (1 -(miniCurPage-1)*20-1);
		// }
		// var imgNow = pngAllMini.getAt(tmpVal);
		// pngSelBig.clear();
		// pngSelBig.add(imgNow.id, imgNow);
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(viewType ==0?true:currPage==1);
	}
});
//上一页
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'prePage',
	tooltip: '上一页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var oVal = me.getPngTabToolBar().getComponent('txtCurrPage').getValue();
		oVal--;
		if (oVal > 0) {
			me.getPngTabToolBar().getComponent('txtCurrPage').setValue(oVal);

			var palPngContainerBig = me.getPngTabPal();
			var param = {};
			param.sessiontoken = sessionToken;
			param.fileid = faxFileId;
			param.currpage=oVal;

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				pngContainerBig.setSrc(WsConf.Url +info.url);

				palPngContainerBig.setHeight(info.height +2);
				palPngContainerBig.setWidth(info.width + 2);

			}, function(response, opts) {

			}, true);
			//设置大图的src pngContainerBig
			//pngContainerBig.setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + faxFileId + "&currpage=" + oVal + "");
			//重设选中的大图数组pngSelBig
			// var tmpVal = oVal-1;
			// if(miniCurPage > 1) {
			// tmpVal = (oVal -(miniCurPage-1)*20-1);
			// }
			// var imgNow = pngAllMini.getAt(tmpVal);
			// pngSelBig.clear();
			// pngSelBig.add(imgNow.id, imgNow);
		}

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(viewType ==0?true:currPage<=1);
	}
});
//下一页
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'nextPage',
	tooltip: '下一页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var oVal = me.getPngTabToolBar().getComponent('txtCurrPage').getValue();
		oVal++;
		if (oVal <= currFaxFileTotal) {
			me.getPngTabToolBar().getComponent('txtCurrPage').setValue(oVal);

			var palPngContainerBig = me.getPngTabPal();
			var param = {};
			param.sessiontoken = sessionToken;
			param.fileid = faxFileId;
			param.currpage=oVal;

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				pngContainerBig.setSrc(WsConf.Url +info.url);

				palPngContainerBig.setHeight(info.height +2);
				palPngContainerBig.setWidth(info.width + 2);

			}, function(response, opts) {

			}, true);
			//设置大图的src pngContainerBig
			//pngContainerBig.setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + faxFileId + "&currpage=" + oVal + "");
			//重设选中的大图数组pngSelBig
			// var tmpVal = oVal-1;
			// if(miniCurPage > 1) {
			// tmpVal = (oVal -(miniCurPage-1)*20-1);
			// }
			// var imgNow = pngAllMini.getAt(tmpVal);
			// pngSelBig.clear();
			// pngSelBig.add(imgNow.id, imgNow);
		}

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(viewType ==0?true:currPage>=totoalPage);
	}
});
//尾页
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'lastPage',
	tooltip: '尾页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		me.getPngTabToolBar().getComponent('txtCurrPage').setValue(currFaxFileTotal);

		var palPngContainerBig = me.getPngTabPal();
		var param = {};
		param.sessiontoken = sessionToken;
		param.fileid = faxFileId;
		param.currpage=currFaxFileTotal;

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			pngContainerBig.setSrc(WsConf.Url +info.url);

			palPngContainerBig.setHeight(info.height +2);
			palPngContainerBig.setWidth(info.width + 2);

		}, function(response, opts) {

		}, true);
		//设置大图的src pngContainerBig
		//pngContainerBig.setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + faxFileId + "&currpage=" + currFaxFileTotal + "");
		//重设选中的大图数组pngSelBig
		// var tmpVal = currFaxFileTotal-1;
		// if(miniCurPage > 1) {
		// tmpVal = (currFaxFileTotal -(miniCurPage-1)*20-1);
		// }
		// var imgNow = pngAllMini.getAt(tmpVal);
		// pngSelBig.clear();
		// pngSelBig.add(imgNow.id, imgNow);
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(viewType ==0?true:currPage==totoalPage);
	}
});

//图章信息
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'signetinfo',
	text: '图章信息',
	handler: function (button, event) {
		alert('图章信息');
	},
	updateStatus: function (selection) {

	}
});

//全选
Ext.create('WS.action.viewFaxFileTab', {
	itemId:'selectAll',
	tooltip: '全部选择/全部取消',
	text: '全选/取消',
	handler: function (button, event) {
		var me = this;
		var imageList = me.getPngTabPalMini().query('image');

		//清空选择数组
		pngSels.clear();
		Ext.Array.each(imageList, function (item, index, allItems) {
			var imgItem = item.getEl();
			if (selectAll == 0) {
				imgItem.setStyle('border', '3px solid blue');
			} else {
				imgItem.setStyle('border', '1px solid black'); //取消选中

			}
		});
		if (selectAll == 0) {
			//push所有选中
			pngSels.addAll(imageList);
			selectAll = 1;
		} else {
			//清空选择数组
			pngSels.clear();
			selectAll = 0;
		}

		//加载默认的大图选择
		//清空大图选择
		pngSelBig.clear();
		if (pngSels.getCount() > 0) {
			pngSelBig.add(pngSels.first().id, pngSels.first());
		} else {
			var imList = me.getPngTabPalMini().query('image');
			var defaultImg = imList[0];
			pngSelBig.add(defaultImg.id, defaultImg);
		}

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		if(currPage == -1) {
			this.setDisabled(viewType ==0?true:true);
			return;
		}
		this.setDisabled(viewType ==0?false:true);
	}
});
//反选
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'selectToggle',
	tooltip: '反选',
	text: '反选',
	handler: function (button, event) {
		var me = this;
		var imageList = me.getPngTabPalMini().query('image');
		//清空选择数组
		pngSels.clear();
		Ext.Array.each(imageList, function (item, index, allItems) {
			var imgItem = item.getEl();
			if (imgItem.getStyle('border',true) == '1px solid black' || imgItem.getStyle('border',true) == 'black 1px solid') {
				imgItem.setStyle('border', '3px solid blue');
				pngSels.add(item.id, item);
			} else {
				imgItem.setStyle('border', '1px solid black');
			}
		});
		//加载默认的大图选择
		//清空大图选择
		pngSelBig.clear();
		if (pngSels.getCount() > 0) {
			pngSelBig.add(pngSels.first().id, pngSels.first());
		} else {
			var imList = me.getPngTabPalMini().query('image');
			var defaultImg = imList[0];
			pngSelBig.add(defaultImg.id, defaultImg);
		}

	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		if(currPage == -1) {
			this.setDisabled(viewType ==0?true:true);
			return;
		}
		this.setDisabled(viewType ==0?false:true);
	}
});

//视图变更
Ext.create('WS.action.viewFaxFileTab', {
	itemId: 'viewTypeChange',
	tooltip: '单页图',
	text: '单页图',
	iconCls: 'faxPngPageView',
	//enableToggle: true,
	handler: function (button, event) {
		var me = this;
		var palPngMini = me.getPngTabPalMini();
		var palPng = me.getPngTabPal();

		//切换
		if (viewType == 0) {
			me.getViewChangeBtn().setText('缩略图');
			me.getViewChangeBtn().setTooltip('缩略图');
			me.getViewChangeBtn().setIconCls('faxPngThumbView');
			viewType = 1;
			//触发TabChange
			var mainForm = Ext.getCmp('viewPortEast');
			//var tabBtnPng = mainForm.down('#btnPng');
			me.getTargetView().tabchange();
			//me.getTargetView().fireEvent('tabchange', me.getTargetView(), me.getPngTab(), me.getTargetView().getActiveTab());

			if (palPngMini) {
				palPngMini.hide();
			}
			if (palPng) {
				palPng.show();
			}
			//ToolBar按钮状态
			me.getPngTabToolBar().getComponent('rotateLeft').setDisabled(false);
			me.getPngTabToolBar().getComponent('rotateRight').setDisabled(false);
			me.getPngTabToolBar().getComponent('overturn').setDisabled(false);
			//判断页码
			var count = me.getPngTabToolBar().getComponent('txtCurrPage').getValue();
			if (count <= '1') {
				ActionBase.getAction('fistPage').setDisabled(true);
				ActionBase.getAction('prePage').setDisabled(true);
			} else {
				ActionBase.getAction('fistPage').setDisabled(false);
				ActionBase.getAction('prePage').setDisabled(false);
			}
			if (count >= currFaxFileTotal) {
				ActionBase.getAction('nextPage').setDisabled(true);
				ActionBase.getAction('lastPage').setDisabled(true);
			} else {
				ActionBase.getAction('nextPage').setDisabled(false);
				ActionBase.getAction('lastPage').setDisabled(false);
			}
			me.getPngTabToolBar().getComponent('txtCurrPage').setDisabled(false);
			me.getPngTabToolBar().getComponent('selectAll').setDisabled(true);
			me.getPngTabToolBar().getComponent('selectToggle').setDisabled(true);
			//fit
			me.getPngTabToolBar().down('#fistPage').setVisible(true);
			me.getPngTabToolBar().down('#prePage').setVisible(true);
			me.getPngTabToolBar().down('#tbPageTotal').setVisible(true);
			me.getPngTabToolBar().down('#txtCurrPage').setVisible(true);
			me.getPngTabToolBar().down('#nextPage').setVisible(true);
			me.getPngTabToolBar().down('#lastPage').setVisible(true);
			//mini
			//tabPngView.down('#txtMiniCurrPage').setValue(1);
			me.getPngTabToolBar().down('#txtMiniCurrPage').setVisible(false);
			me.getPngTabToolBar().down('#tbMiniPageTotal').setVisible(false);

		} else {
			me.getViewChangeBtn().setText('单页图');
			me.getViewChangeBtn().setTooltip('单页图');
			me.getViewChangeBtn().setIconCls('faxPngPageView');
			viewType = 0;

			if (palPngMini) {
				palPngMini.show();
			}
			if (palPng) {
				palPng.hide();
			}
			//ToolBar按钮状态
			me.getPngTabToolBar().getComponent('rotateLeft').setDisabled(true);
			me.getPngTabToolBar().getComponent('rotateRight').setDisabled(true);
			me.getPngTabToolBar().getComponent('overturn').setDisabled(true);
			me.getPngTabToolBar().getComponent('fistPage').setDisabled(true);
			me.getPngTabToolBar().getComponent('prePage').setDisabled(true);
			me.getPngTabToolBar().getComponent('txtCurrPage').setDisabled(true);
			me.getPngTabToolBar().getComponent('nextPage').setDisabled(true);
			me.getPngTabToolBar().getComponent('lastPage').setDisabled(true);
			me.getPngTabToolBar().getComponent('selectAll').setDisabled(false);
			me.getPngTabToolBar().getComponent('selectToggle').setDisabled(false);

			//fit
			me.getPngTabToolBar().down('#fistPage').setVisible(false);
			me.getPngTabToolBar().down('#prePage').setVisible(false);
			me.getPngTabToolBar().down('#tbPageTotal').setVisible(false);
			me.getPngTabToolBar().down('#txtCurrPage').setVisible(false);
			me.getPngTabToolBar().down('#nextPage').setVisible(false);
			me.getPngTabToolBar().down('#lastPage').setVisible(false);
			//mini
			//tabPngView.down('#txtMiniCurrPage').setValue(1);
			me.getPngTabToolBar().down('#txtMiniCurrPage').setVisible(true);
			me.getPngTabToolBar().down('#tbMiniPageTotal').setVisible(true);
			//变更toolbar 翻转、删除 按钮状态
			ActionBase.updateActions('viewFaxFileTab', 0,pngSels.getCount(),currFaxFileTotal,0);

		}
	},
	updateStatus: function (viewType,selsCount,totoalPage, currPage) {
		this.setDisabled(totoalPage == 0);
	}
});
//====================================================================================================================//
//=======================================viewFaxFileTab 控件加载函数========================================================//
//====================================================================================================================//
Ext.define('createHtmlBase', {
	createTpl: function(tplPal,uid,type) {

		var html = "";

		var param = {
			id:uid,
			sessiontoken:sessionToken,
			restype:type
		}
		//alert('call');
		WsCall.call('gettplinfo', param, function(response, opts) {
			tplPal.firstAdd = false;
			var data = Ext.JSON.decode(response.data);
			html += "<table cellspacing='0' class='myTable'><tbody>";
			Ext.Array.each(data, function(item,index) {
				if(index%3 == 0) {
					html += "<tr>"
				}
				if(item.dataType == 'dateTime') {
					item.dataDefault = template.dtRenderer(item.dataDefault);
				}
				var title = item.dataTitle==''?item.dataName:item.dataTitle;
				html += "<td class='lbTd'>"+title+":</td><td>&nbsp;"+item.dataDefault+"</td>";
				if(index%3 == 2) {
					html += "</tr>"
				}
			});
			html +="</tbody></table>";
			tplPal.update(html);
		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('消息', '加载模版信息失败');
			}
			tplPal.collapse();
		},false);
	},
	createAtt: function(record) {
		var vals = record.data;
		var attPal = viewFaxFileTab.down('#attInfo');
		var html = "";

		var fileId = vals.faxFileID;

		var param = {
			fileId:fileId,
			attach:vals.attach,
			sessiontoken:sessionToken,
			faxtype:currGrid.itemId
		}
		WsCall.call('getslavefileinfo', param, function(response, opts) {
			//alert(response.data);
			attPal.firstAdd = false;
			var deInfo = Ext.JSON.decode(response.data);
			createSlaveFGridStore(deInfo);
			slaveFGrid = createSlaveFileGrid(attPal,currGrid);
			attPal.add(slaveFGrid);
		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('附件信息', '加载附件信息失败');
			}
			attPal.collapse();
		}, true,'附件加载中...',Ext.getBody(),1);
	}
});

Ext.define('createAddressHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {
		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0'  class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'姓'+": </td><td>"+vals.lastName+"</td>";
		html += "<td class='lbTd' >"+'名'+": </td><td>"+vals.firstName+"</td>";
		html += "<td class='lbTd' >"+'显示名'+": </td><td>"+vals.dispName+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'客户编号'+": </td><td>"+vals.spareFaxNumber+"</td>";
		html += "<td class='lbTd' >"+'职位'+": </td><td>"+vals.title+"</td>";
		var gender = '';
		if(vals.gender == 0) {
			gender ='男';
		}
		if(vals.gender == 1) {
			gender ='女';
		}
		html += "<td class='lbTd' >"+'性别'+": </td><td>"+gender+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'组织'+": </td><td>"+vals.organization+"</td>";
		html += "<td class='lbTd' >"+'省'+": </td><td>"+vals.state+"</td>";
		html += "<td class='lbTd' >"+'市区'+": </td><td>"+vals.city+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'部门'+": </td><td>"+vals.department+"</td>";
		html += "<td class='lbTd' >"+'国家'+": </td><td>"+vals.country+"</td>";
		html += "<td class='lbTd' >"+'邮政编码'+": </td><td>"+vals.zipCode+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'地址'+": </td><td>"+vals.address+"</td>";
		html += "<td class='lbTd' >"+'国家代码'+": </td><td>"+vals.countryCode+"</td>";
		html += "<td class='lbTd' >"+'传真号码'+": </td><td>"+vals.faxNumber+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'电话号码'+": </td><td>"+vals.phoneNumber+"</td>";
		html += "<td class='lbTd' >"+'手机号'+": </td><td>"+vals.mobileNumber+"</td>";
		html += "<td class='lbTd' >"+'Email'+": </td><td>"+vals.email+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'个人网址'+": </td><td>"+vals.web+"</td>";
		html += "<td class='lbTd' >"+'即时通讯号码'+": </td><td>"+vals.IMNumber+"</td>";
		html += "<td class='lbTd' >"+'注释'+": </td><td>"+vals.comment+"</td></tr>";

		html +="</tbody></table>";

		return html;
	}
});

var createAddressHtml = new createAddressHtml();

//地址本对应详细资料form
function loadDetailFormForAddressgrid(record) {
	return Ext.create('Ext.form.Panel', {
		//title: '地址本',
		bodyPadding: 5,
		//bodyCls: 'panelFormBg',
		layout: {
			type: 'auto'
		},
		autoScroll: true,
		border: false,
		defaults: {
			xtype:'fieldset',
			collapsible:true
		},
		updateAll: function(record) {
			var me = this;
			var basePal = me.down('#baseInfo');

			basePal.update(createAddressHtml.createBase(record));
			// var tplPal = me.down('#tplInfo');
			// if(tplPal) {
			// tplPal.update(createInfaxHtml.createTpl(record,'infax'));
			// }

		},
		listeners: {
			afterrender: function(pal,opts) {
				var vals = record.data;
				pal.add({
					title:'基本信息',
					itemId:'baseInfo',
					listeners: {
						render: function(com) {
							com.update(createAddressHtml.createBase(record));
						}
					}
				});
				//是否加载表单数据
				// if(template && tb.getStore().getProxy().extraParams.template != '') {
				// pal.add({
				// title:'表单数据',
				// itemId:'tplInfo',
				// listeners: {
				// render: function(com) {
				// com.update(createInfaxHtml.createTpl(record,'infax'));
				// }
				// }
				// });
				// }

			}
		}
	});
}

//默认图片对应详细资料form
function loadDetailFormForDefaultPng() {
	return Ext.create('Ext.form.Panel', {
		//title: '默认图片',
		bodyPadding: 5,

		layout: {
			type: 'auto'
		},
		bodyStyle: {
			'background-image':'url(resources/images/WFWelcome.png) !important',
			'background-repeat': 'no-repeat',
			'background-color':'#FFFFFF'
		},
		autoScroll: true,
		border: false,
		defaults: {
			width: 1024,
			height:1583,
			xtype: 'image'
		}//,
		//html:"<img src='resources/images/WFWelcome.png'/>"
	});
}

Ext.define('createInfaxHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {
		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0' class='myTable''><tbody>";
		html += "<tr><td class='lbTd'>"+'流水号'+":&nbsp;</td><td>"+vals.inFaxID+"</td>";
		html += "<td class='lbTd' >"+'发件人'+":&nbsp;</td><td>"+vals.callerName+"</td>";
		html += "<td class='lbTd' >"+'呼叫者标识'+":&nbsp;</td><td>"+vals.callerID+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'发件人组织'+":&nbsp;</td><td>"+vals.callerOrganization+"</td>";
		html += "<td class='lbTd' >CSID:&nbsp;</td><td>"+vals.callerCSID+"</td>";
		var receiveDateTime = '';
		if(!vals.receiveDateTime.match('1970-0')) {
			receiveDateTime = UTCtoLocal(vals.receiveDateTime);
		}
		html += "<td class='lbTd' >"+'接收时间'+":&nbsp;</td><td>"+receiveDateTime+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'传真DID'+":&nbsp;</td><td>"+vals.DID+"</td>";
		html += "<td class='lbTd' >"+'主题'+":&nbsp;</td><td>"+vals.subject+"</td>";
		html += "<td class='lbTd' >"+'传真协议信息'+":&nbsp;</td><td>"+vals.protocol+"</td></tr>";

		html += "<tr><td class='lbTd'>DTMF:&nbsp;</td><td>"+vals.DTMF+"</td>";
		html += "<td class='lbTd' >"+'页数'+":&nbsp;</td><td>"+vals.pages+"</td>";
		var faxResolution = faxResolutionArr[vals.faxResolution];
		html += "<td class='lbTd' >"+'分辨率'+":&nbsp;</td><td>"+faxResolution+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'设备端口'+":&nbsp;</td><td>"+vals.portName+"</td>";
		var faxFlag = "<div><img src='resources/images/fax/flag/flag_blue.png' style='margin-bottom: -5px;'>&nbsp;" + faxFlagArr[vals.faxFlag] + "</div>";
		html += "<td class='lbTd' >"+'标签'+":&nbsp;</td><td>"+faxFlag+"</td>";
		html += "<td class='lbTd' >"+'传真文件ID'+":&nbsp;</td><td>"+vals.faxFileID+"</td></tr>";

		var duration = faxDuration(vals.duration);
		html += "<tr><td class='lbTd'>"+'持续时间'+":&nbsp;</td><td>"+duration+"</td>";

		var owner='';

		if(vals.owner.length==0) {
			owner = linkViewTitle1(FolderTree1.getSelectionModel().getSelection());
		} else {
			//owner = vals.owner;
			owner = owerInternational(vals.owner);
		}
		html += "<td class='lbTd' >"+'所属'+":&nbsp;</td><td colspan=3>"+owner+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";

		html +="</tbody></table>";
		return html;
	}
});
var createInfaxHtml = new createInfaxHtml();

//收件箱对应详细资料form
function loadDetailFormForInfaxgrid(record) {
	return Ext.create('Ext.form.Panel', {
		//title: '基本信息',
		bodyPadding: 5,
		//bodyCls: 'panelFormBg',
		layout: {
			type: 'auto'
		},
		border: false,
		autoScroll: true,
		defaults: {
			xtype:'fieldset',
			collapsible:true
		},
		updateAll: function(record) {
			var me = this;
			var basePal = me.down('#baseInfo');

			basePal.update(createInfaxHtml.createBase(record));
			var tplPal = me.down('#tplInfo');
			if(tplPal) {
				if(record.data.templateid!= 0) {
					tplPal.removeAll();
					tplPal.record = record;
					tplPal.firstAdd = true;
					tplPal.show();
					tplPal.collapse();
					tplPal.setTitle('表单数据'+template.getTplTilte(record.data.templateid));
					//createInfaxHtml.createTpl(tplPal,record.data.inFaxID,'INFAX');
				} else {
					tplPal.hide();
				}
			}
			var attPal = me.down('#attInfo');
			if(attPal) {
				if(record.data.attach.length > 0) {
					attPal.removeAll();
					attPal.record = record;
					attPal.firstAdd = true;
					attPal.show();
					attPal.collapse();
				} else {
					attPal.hide();
				}
			}
		},
		listeners: {
			afterrender: function(pal,opts) {
				var vals = record.data;
				pal.add({
					title:'基本信息',
					itemId:'baseInfo',
					listeners: {
						render: function(com) {
							com.update(createInfaxHtml.createBase(record));
						}
					}
				});
				//是否加载表单数据
				if(template) {
					var title = '表单数据:'+template.getTplTilte(record.data.templateid);
					pal.add({
						title:title,
						collapsed:true,
						hidden:record.data.templateid !=0?false:true,
						itemId:'tplInfo',
						record:'',
						firstAdd:true,
						listeners: {
							render: function(com) {
								com.toggleCmp.on('click', function(dd,tt,aa,ss) {
									if(!com.collapsed && com.firstAdd) {
										if(com.record != '') {
											createInfaxHtml.createTpl(com,com.record.data.inFaxID,'INFAX');
										} else {
											createInfaxHtml.createTpl(com,record.data.inFaxID,'INFAX');
										}

									}
								});
								// if(record.data.templateid !=0) {
								// createInfaxHtml.createTpl(com,record.data.inFaxID,'INFAX');
								// }
								//com.update(createInfaxHtml.createTpl(record,'infax'));
							}
						}
					});
				}
				//是否有附件
				pal.add({
					title:'附件信息',
					collapsed:true,
					hidden:vals.attach.length>0?false:true,
					itemId:'attInfo',
					record:'',
					firstAdd:true,
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createInfaxHtml.createAtt(com.record));
									} else {
										com.update(createInfaxHtml.createAtt(record));
									}
								}

							});
						}
					}
				});

			}
		}
	});
}

Ext.define('createOutfaxHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {
		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0'  class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'流水号'+":&nbsp;</td><td>"+vals.outFaxID+"</td>";
		html += "<td class='lbTd' >"+'收件人'+":&nbsp;</td><td>"+vals.recipient+"</td>";
		html += "<td class='lbTd' >"+'收件人手机'+":&nbsp;</td><td>"+vals.recipientMobileNumber+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'传真号码'+":&nbsp;</td><td>"+vals.faxNumber+"</td>";
		html += "<td class='lbTd' >"+'分机号'+":&nbsp;</td><td>"+vals.faxNumberExt+"</td>";
		html += "<td class='lbTd' >"+'收件人邮箱'+":&nbsp;</td><td>"+vals.recipientEmail+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'收件人组织'+":&nbsp;</td><td>"+vals.recipientOrganization+"</td>";
		html += "<td class='lbTd' >"+'主题'+":&nbsp;</td><td>"+vals.subject+"</td>";
		var sentDateTime='';
		if(!vals.sentDateTime.match('1970-0')) {
			sentDateTime = UTCtoLocal(vals.sentDateTime);
		}
		html += "<td class='lbTd' >"+'发送时间'+":&nbsp;</td><td>"+sentDateTime+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'总页数'+":&nbsp;</td><td>"+vals.pages+"</td>";
		html += "<td class='lbTd' >"+'发送页数'+":&nbsp;</td><td>"+vals.sentPages+"</td>";
		var scheduleDateTime = '';
		if(!vals.scheduleDateTime.match('1970-0')) {
			scheduleDateTime = UTCtoLocal(vals.scheduleDateTime);
		}
		html += "<td class='lbTd' >"+'安排发送时间'+":&nbsp;</td><td>"+scheduleDateTime+"</td></tr>";

		var duration = faxDuration(vals.duration);
		html += "<tr><td class='lbTd'>"+'持续时间'+":&nbsp;</td><td>"+duration+"</td>";
		html += "<td class='lbTd' >"+'设备端口'+":&nbsp;</td><td>"+vals.portName+"</td>";
		var retryInterval = faxDuration(vals.retryInterval);
		html += "<td class='lbTd' >"+'重试间隔'+":&nbsp;</td><td>"+retryInterval+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'实际重发次数'+":&nbsp;</td><td>"+vals.retryTime+"</td>";
		html += "<td class='lbTd' >"+'要求重发次数'+":&nbsp;</td><td>"+vals.desireRetryTime+"</td>";
		html += "<td class='lbTd' >"+'传真协议信息'+":&nbsp;</td><td>"+vals.protocol+"</td></tr>";

		var faxResolution = faxResolutionArr[vals.faxResolution];
		html += "<tr><td class='lbTd'>"+'分辨率'+":&nbsp;</td><td>"+faxResolution+"</td>";
		var status = "<div><img src='resources/images/fax/status/outstatus."+ vals.status + ".png' style='margin-bottom: -5px;'>&nbsp;" + statusArr[vals.status] +"</div>";
		html += "<td class='lbTd' >"+'传真状态'+":&nbsp;</td><td>"+status+"</td>";
		var faxFlag = "<div><img src='resources/images/fax/flag/flag_blue.png' style='margin-bottom: -5px;'>&nbsp;" + faxFlagArr[vals.faxFlag] + "</div>";
		html += "<td class='lbTd' >"+'标签'+":&nbsp;</td><td>"+faxFlag+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";

		html +="</tbody></table>";

		return html;
	}
});

var createOutfaxHtml = new createOutfaxHtml();

//发件箱对应详细资料form
function loadDetailFormForOutfaxgrid(record) {
	return Ext.create('Ext.form.Panel', {
		//title: '基本信息',
		bodyPadding: 5,
		//bodyCls: 'panelFormBg',
		layout: {
			type: 'auto'
		},
		border: false,
		autoScroll: true,
		defaults: {
			xtype:'fieldset',
			collapsible:true
		},
		updateAll: function(record) {
			var me = this;
			var basePal = me.down('#baseInfo');
			basePal.update(createOutfaxHtml.createBase(record));
			var tplPal = me.down('#tplInfo');

			if(tplPal) {
				if(record.data.templateid!= 0) {
					tplPal.removeAll();
					tplPal.record = record;
					tplPal.firstAdd = true;
					tplPal.show();
					tplPal.collapse();
					tplPal.setTitle('表单数据'+template.getTplTilte(record.data.templateid));
				} else {
					tplPal.hide();
				}
			}

			var attPal = me.down('#attInfo');
			if(attPal) {
				if(record.data.attach.length > 0) {
					attPal.removeAll();
					attPal.record = record;
					attPal.firstAdd = true;
					attPal.show();
					attPal.collapse();
				} else {
					attPal.hide();
				}
			}
		},
		listeners: {
			afterrender: function(pal,opts) {
				var vals = record.data;
				pal.add({
					title:'基本信息',
					itemId:'baseInfo',
					listeners: {
						render: function(com) {
							com.update(createOutfaxHtml.createBase(record));
						}
					}
				});
				//是否加载表单数据
				if(template) {
					var title = '表单数据:'+template.getTplTilte(record.data.templateid);
					pal.add({
						title:title,
						collapsed:true,
						hidden:record.data.templateid !=0?false:true,
						itemId:'tplInfo',
						record:'',
						firstAdd:true,
						listeners: {
							render: function(com) {
								com.toggleCmp.on('click', function(dd,tt,aa,ss) {
									if(!com.collapsed && com.firstAdd) {
										if(com.record != '') {
											createOutfaxHtml.createTpl(com,com.record.data.outFaxID,'OUTFAX');
										} else {
											createOutfaxHtml.createTpl(com,record.data.outFaxID,'OUTFAX');
										}

									}
								});
							}
						}
					});
				}
				//是否有附件
				pal.add({
					title:'附件信息',
					collapsed:true,
					hidden:vals.attach.length>0?false:true,
					itemId:'attInfo',
					record:'',
					firstAdd:true,
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createOutfaxHtml.createAtt(com.record));
									} else {
										com.update(createOutfaxHtml.createAtt(record));
									}
								}

							});
						}
					}
				});

			}
		}
	});
}

Ext.define('createSuccoutfaxHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {

		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0' class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'流水号'+":&nbsp;</td><td>"+vals.outFaxID+"</td>";
		html += "<td class='lbTd' >"+'收件人'+":&nbsp;</td><td>"+vals.recipient+"</td>";
		html += "<td class='lbTd' >"+'收件人手机'+":&nbsp;</td><td>"+vals.recipientMobileNumber+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'传真号码'+":&nbsp;</td><td>"+vals.faxNumber+"</td>";
		html += "<td class='lbTd' >"+'分机号'+":&nbsp;</td><td>"+vals.faxNumberExt+"</td>";
		html += "<td class='lbTd' >"+'收件人邮箱'+":&nbsp;</td><td>"+vals.recipientEmail+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'收件人组织'+":&nbsp;</td><td>"+vals.recipientOrganization+"</td>";
		html += "<td class='lbTd' >"+'主题'+":&nbsp;</td><td colspan=3>"+vals.subject+"</td></tr>";

		var sentDateTime='';
		if(!vals.sentDateTime.match('1970-0')) {
			sentDateTime = UTCtoLocal(vals.sentDateTime);
		}
		html += "<tr><td class='lbTd'>"+'发送时间'+":&nbsp;</td><td>"+sentDateTime+"</td>";
		var duration = faxDuration(vals.duration);
		html += "<td class='lbTd' >"+'持续时间'+":&nbsp;</td><td>"+duration+"</td>";
		var errCode = outFaxErrCodeArr[vals.errCode];
		html += "<td class='lbTd' >"+'错误原因'+":&nbsp;</td><td>"+errCode+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'总页数'+":&nbsp;</td><td>"+vals.pages+"</td>";
		html += "<td class='lbTd' >"+'发送页数'+":&nbsp;</td><td>"+vals.sentPages+"</td>";
		html += "<td class='lbTd' >"+'设备端口号'+":&nbsp;</td><td>"+vals.portName+"</td></tr>";

		var retryInterval = faxDuration(vals.retryInterval);
		html += "<tr><td class='lbTd'>"+'重试间隔'+":&nbsp;</td><td>"+retryInterval+"</td>";
		html += "<td class='lbTd' >"+'实际重发次数'+":&nbsp;</td><td>"+vals.retryTime+"</td>";
		html += "<td class='lbTd' >"+'要求重发次数'+":&nbsp;</td><td>"+vals.desireRetryTime+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'传真协议信息'+":&nbsp;</td><td>"+vals.protocol+"</td>";
		var status ='';
		if(vals.status =='9') {
			status="<div><img src='resources/images/fax/status/outstatus.9.png' style='margin-bottom: -5px;'>&nbsp;"+'成功'+"</div>";
		} else {
			status = "<div><img src='resources/images/fax/status/outstatus."+vals.status+".png' style='margin-bottom: -5px;'>&nbsp;"+'失败'+"</div>";
		}
		html += "<td class='lbTd' >"+'传真状态'+":&nbsp;</td><td>"+status+"</td>";
		var faxFlag = "<div><img src='resources/images/fax/flag/flag_blue.png' style='margin-bottom: -5px;'>&nbsp;" + faxFlagArr[vals.faxFlag] + "</div>";
		html += "<td class='lbTd' >"+'标签'+":&nbsp;</td><td>"+faxFlag+"</td></tr>";

		var faxResolution = faxResolutionArr[vals.faxResolution];
		html += "<tr><td class='lbTd'>"+'分辨率'+":&nbsp;</td><td>"+faxResolution+"</td>";
		var owner = linkViewTitle1(FolderTree1.getSelectionModel().getSelection());
		html += "<td class='lbTd' >"+'所属'+":&nbsp;</td><td colspan=3>"+owner+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";

		html +="</tbody></table>";

		return html;
	},
	createWfInfo: function(record) {

		var me = this;
		var wfPal = viewFaxFileTab.down('#wfInfo');
		wfPal.firstAdd = false;
		var vals = Ext.JSON.decode(record.data.tasks);
		var html = '';

		(new Ext.util.DelayedTask()).delay(100, function() {
			Ext.Array.each(vals, function(rec) {
				// html= me.createwf(rec,record);
				wfPal.add({
					xtype:'fieldset',
					collapsible:true,
					title:'任务'+'('+rec.workflowRuleName+')',
					html: me.createwf(rec,record)
				});
			});
		});
		//return html;
		//wfPal.update(html);

	},
	createwf: function(vals,record) {
		var html = "";
		html += "<table cellspacing='0' class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'流水号'+":&nbsp;</td><td>"+vals.workflowTaskID+"</td>";
		var workflowStatus = updateWfGridStatus(vals.workflowStatus,true,false,vals.workflowErrCode);
		html += "<td class='lbTd'>"+'状态'+":&nbsp;</td><td>"+workflowStatus+"</td>";
		html += "<td class='lbTd' >"+'发起人'+":&nbsp;</td><td>"+vals.userName+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'规则类别'+":&nbsp;</td><td>"+vals.workflowRuleName+"</td>";
		var startTime = '';
		if(!vals.startTime.match('1970-0')) {
			startTime = UTCtoLocal(vals.startTime);
		}
		html += "<td class='lbTd' >"+'开始时间'+":&nbsp;</td><td>"+startTime+"</td>";
		var endTime = '';
		if(!vals.endTime.match('1970-0')) {
			endTime = UTCtoLocal(vals.endTime);
		}
		html += "<td class='lbTd' >"+'完成时间'+":&nbsp;</td><td>"+endTime+"</td></tr>";

		html += "<tr><td class='lbTd' >"+'任务主题'+":&nbsp;</td><td colspan=5>"+vals.taskComment+"</td></tr>";

		html +="</tbody></table>";
		return html;
	}
});

var createSuccoutfaxHtml = new createSuccoutfaxHtml();

//已发件箱对应详细资料form
function loadDetailFormForSuccoutfaxgrid(record) {
	return Ext.create('Ext.form.Panel', {
		//title: '基本信息',
		bodyPadding: 5,
		//bodyCls: 'panelFormBg',
		layout: {
			type: 'auto'
		},
		border: false,
		autoScroll: true,
		defaults: {
			xtype:'fieldset',
			collapsible:true
		},
		updateAll: function(record) {
			var me = this;
			var basePal = me.down('#baseInfo');
			basePal.update(createSuccoutfaxHtml.createBase(record));
			var tplPal = me.down('#tplInfo');
			if(tplPal) {
				if(record.data.templateid!= 0) {
					tplPal.removeAll();
					tplPal.record = record;
					tplPal.firstAdd = true;
					tplPal.show();
					tplPal.collapse();
					tplPal.setTitle('表单数据'+template.getTplTilte(record.data.templateid));
				} else {
					tplPal.hide();
				}
			}

			var attPal = me.down('#attInfo');
			if(attPal) {
				if(record.data.attach.length > 0) {
					attPal.removeAll();
					attPal.record = record;
					attPal.firstAdd = true;
					attPal.show();
					attPal.collapse();
				} else {
					attPal.hide();
				}
			}

			var wfPal = me.down('#wfInfo');
			if(wfPal) {
				if(record.data.tasks != '[]') {
					wfPal.removeAll();
					wfPal.record = record;
					wfPal.firstAdd = true;
					wfPal.show();
					wfPal.collapse();
				} else {
					wfPal.hide();
				}
			}
		},
		listeners: {
			afterrender: function(pal,opts) {
				var vals = record.data;
				pal.add({
					title:'基本信息',
					itemId:'baseInfo',
					listeners: {
						render: function(com) {
							com.update(createSuccoutfaxHtml.createBase(record));
						}
					}
				});
				//是否加载表单数据
				if(template) {
					var title = '表单数据:'+template.getTplTilte(record.data.templateid);
					pal.add({
						title:title,
						collapsed:true,
						hidden:record.data.templateid !=0?false:true,
						itemId:'tplInfo',
						record:'',
						firstAdd:true,
						listeners: {
							render: function(com) {
								com.toggleCmp.on('click', function(dd,tt,aa,ss) {
									if(!com.collapsed && com.firstAdd) {
										if(com.record != '') {
											createSuccoutfaxHtml.createTpl(com,com.record.data.outFaxID,'OUTFAX');
										} else {
											createSuccoutfaxHtml.createTpl(com,record.data.outFaxID,'OUTFAX');
										}
									}
								});
								//com.update(createSuccoutfaxHtml.createTpl(record,'sucfax'));
							}
						}
					});
				}
				//是否有附件
				pal.add({
					title:'附件信息',
					collapsed:true,
					hidden:vals.attach.length>0?false:true,
					itemId:'attInfo',
					record:'',
					firstAdd:true,
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createSuccoutfaxHtml.createAtt(com.record));
									} else {
										com.update(createSuccoutfaxHtml.createAtt(record));
									}
								}

							});
						}
					}
				});

				//是否有工作流任务
				pal.add({
					title:'工作流任务',
					collapsed:true,
					hidden:vals.tasks != '[]' ?false:true,
					itemId:'wfInfo',
					record:'',
					firstAdd:true,
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createSuccoutfaxHtml.createWfInfo(com.record));
									} else {
										com.update(createSuccoutfaxHtml.createWfInfo(record));
									}
								}
							});
						}
					}
				});

			}
		}
	});
}

Ext.define('createDraftHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {

		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0' class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'收件人'+":&nbsp;</td><td>"+vals.recipient+"</td>";
		html += "<td class='lbTd'>"+'传真号码'+":&nbsp;</td><td>"+vals.faxNumber+"</td>";
		html += "<td class='lbTd'>"+'收件人手机'+":&nbsp;</td><td>"+vals.recipientMobile+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'收件人邮箱'+":&nbsp;</td><td>"+vals.recipientEmail+"</td>";
		html += "<td class='lbTd'>"+'收件人组织'+":&nbsp;</td><td>"+vals.recipientOrg+"</td>";
		html += "<td class='lbTd' >"+'内部收件人'+":&nbsp;</td><td>"+vals.userName+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'主题'+":&nbsp;</td><td>"+vals.subject+"</td>";
		var scheduleDateTime ='';
		if(!vals.scheduleDateTime.match('1970-0')) {
			scheduleDateTime = UTCtoLocal(vals.scheduleDateTime);
		}
		html += "<td class='lbTd' >"+'安排发送时间'+":&nbsp;</td><td>"+scheduleDateTime+"</td>";
		var retryInterval = faxDuration(vals.retryInterval);
		html += "<td class='lbTd' >"+'重试间隔'+":&nbsp;</td><td>"+retryInterval+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'要求重发次数'+":&nbsp;</td><td>"+vals.desireRetryTime+"</td>";
		var block = vals.block == '0' ? '否' : '是';
		html += "<td class='lbTd' >"+'是否阻塞'+":&nbsp;</td><td>"+block+"</td>";
		var emailReport = vals.emailReport == '0' ? '否' : '是';
		html += "<td class='lbTd' >"+'是否Email通知收件人'+":&nbsp;</td><td>"+emailReport+"</td></tr>";

		var msgReport = vals.msgReport == '0' ? '否' : '是';
		html += "<tr><td class='lbTd'>"+'是否短信通知收件人'+":&nbsp;</td><td>"+msgReport+"</td>";
		var addFaxHeader = vals.addFaxHeader == '0' ? '否' : '是';
		html += "<td class='lbTd'>"+'是否添加传真页眉'+":&nbsp;</td><td>"+addFaxHeader+"</td>";
		var useBroadcastPort = vals.useBroadcastPort == '0' ? '否' : '是';
		html += "<td class='lbTd' >"+'是否使用群发端口'+":&nbsp;</td><td>"+useBroadcastPort+"</td></tr>";

		var retryFromFirstPage = vals.retryFromFirstPage == '0' ? '否' : '是';
		html += "<tr><td class='lbTd'>"+'失败重试是否从第一页开始'+":&nbsp;</td><td>"+retryFromFirstPage+"</td>";
		var useHighResolution = vals.useHighResolution == '0' ? '否' : '是';
		html += "<td class='lbTd'>"+'是否使用200*200分辨率发送传真'+":&nbsp;</td><td colspan=3>"+useHighResolution+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";

		html +="</tbody></table>";

		return html;
	}
});
var createDraftHtml= new createDraftHtml();

//草稿箱对应详细资料form
function loadDetailFormForDraftgrid(record) {
	return Ext.create('Ext.form.Panel', {
		//title: '基本信息',
		bodyPadding: 5,
		//bodyCls: 'panelFormBg',
		layout: {
			type: 'auto'
		},
		border: false,
		autoScroll: true,
		defaults: {
			xtype:'fieldset',
			collapsible:true
		},
		updateAll: function(record) {
			var me = this;
			var basePal = me.down('#baseInfo');
			basePal.update(createDraftHtml.createBase(record));

			var attPal = me.down('#attInfo');
			if(attPal) {
				if(record.data.attach.length > 0) {
					attPal.removeAll();
					attPal.record = record;
					attPal.firstAdd = true;
					attPal.show();
					attPal.collapse();
				} else {
					attPal.hide();
				}
			}
		},
		listeners: {
			afterrender: function(pal,opts) {
				var vals = record.data;
				pal.add({
					title:'基本信息',
					itemId:'baseInfo',
					listeners: {
						render: function(com) {
							com.update(createDraftHtml.createBase(record));
						}
					}
				});

				//是否有附件
				pal.add({
					title:'附件信息',
					collapsed:true,
					hidden:vals.attach.length>0?false:true,
					itemId:'attInfo',
					record : '',
					firstAdd:true,
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createDraftHtml.createAtt(com.record));
									} else {
										com.update(createDraftHtml.createAtt(record));
									}
								}

							});
						}
					}
				});

			}
		}
	});
}

//====================================================================================================================//
//=======================================viewFaxFileTab 控件========================================================//
//====================================================================================================================//

//图片编辑器toolbar
Ext.define('ws.viewFax.tbImageEditor', {
	alias: 'widget.tbImageEditor',
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: ['tbImageEditor'],
	itemId: 'tbImageEditor',
	items: [{
		itemId: 'coverimage',
		text: '加盖图章',
		enableToggle: true,
		toggleGroup: 'tbImageEditor',
		listeners: {
			toggle: function (btn, pre, opts) {
				if (pre) {
					coverDragStateA = 1;
				} else {
					coverDragStateA = 0;
				}
			}
		}
	},{
		itemId: 'coverfont',
		text: '加盖文字',
		enableToggle: true,
		toggleGroup: 'tbImageEditor',
		listeners: {
			toggle: function (btn, pre, opts) {
				if (pre) {
					coverDragStateB = 1;
				} else {
					coverDragStateB = 0;
				}
			}
		}
	}
	]
});

//传真缩略图Panel
//MiniPanel
Ext.define('ws.viewFax.palFaxFileTabPngMini', {
	alias: 'widget.palFaxFileTabPngMini',
	extend: 'Ext.Panel',
	alternateClassName: ['palFaxFileTabPngMini'],
	itemId: 'palFaxFileTabPngMini',
	frame: false,
	layout: {
		type: 'auto',
		width: 100
	},
	bodyStyle: {
		background: '#DFE8F6'
	},
	autoScroll:true,
	defaults: {
		xtype: 'image',
		width: 100,
		height: 100,
		margin: '5 5 5 5',
		style: {
			'float':'left'
		}
	},
	//title: 'Mini传真图',
	items: []
});
//大图Panel
Ext.define('ws.viewFax.palFaxFileTabPng', {
	alias: 'widget.palFaxFileTabPng',
	extend: 'Ext.Panel',
	alternateClassName: ['palFaxFileTabPng'],
	itemId: 'palFaxFileTabPng',
	frame: false,
	autoScroll: false,
	bodyStyle: {
		background: '#DFE8F6'
	},
	//width: 1200,
	//height: 1200,
	margin: '5 5 5 50',
	layout: {
		type: 'auto'
	},
	style: {
		border: 'none'
	},
	defaults: {
		xtype: 'image',
		border:true
	},
	//title: 'Mini传真图',
	items: []
});

//====传真文件图工具栏====
Ext.define('ws.viewFax.tbFaxFileTabPng', {
	alias: 'widget.tbFaxFileTabPng',
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: ['tbFaxFileTabPng'],
	itemId: 'tbFaxFileTabPng',
	items: [ActionBase.getAction('rotateLeft'),
	"-", ActionBase.getAction('rotateRight'),
	"-", ActionBase.getAction('overturn'),
	"           ", "  ", "-", ActionBase.getAction('fistPage'),
	ActionBase.getAction('prePage'),
	"-",{
		//width:30,
		xtype: 'tbtext',
		text: '页数'
	},{
		itemId: 'txtMiniCurrPage',
		xtype: 'numberfield',
		width: 30,
		minValue: 1,
		hideTrigger: true,
		enableKeyEvents: true,
		selectOnFocus: true,
		submitValue: false,
		//disabled: true,
		margins: '-1 2 3 2',
		value: 1,
		listeners: {
			keypress : function(field, e, opts) {
				if (e.getKey() == e.ENTER) {
					field.fireEvent('blur',field);
				}
			},
			blur: function (com, opts) {
				if(miniCurPage == com.getValue()) {
					return;
				}
				miniCurPage = com.getValue();

				if (runner) {
					ifLoading = 0;
					runner.stopAll();
					//pngSels.clear();
					initAllFaxFileTabPngConfig(null,miniCurPage);
					gridSelsChange();
				}
				//alert(com.value);
				//设置大图的src pngContainerBig
				//pngContainerBig.setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + faxFileId + "&currpage=" + com.getValue() + "");

				//重设选中的大图数组pngSelBig
				// var imgNow = pngAllMini.getAt((com.getValue() - 1));
				// pngSelBig.clear();
				// pngSelBig.add(imgNow.id, imgNow);
			},
			change: function (com, nVal, oVal, opts) {
				if ((nVal > miniTotalPage && nVal != '1') || nVal < 1) {
					com.setValue(oVal);
				}
			} //change
		}

	},{
		//width:30,
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
		selectOnFocus: true,
		submitValue: false,
		margins: '-1 2 3 2',
		disabled: true,
		value: 1,
		listeners: {
			keypress : function(field, e, opts) {
				if (e.getKey() == e.ENTER) {
					field.fireEvent('blur',field);
				}
			},
			blur: function (com, opts) {
				//alert(com.value);
				//设置大图的src pngContainerBig
				pngContainerBig.setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + faxFileId + "&currpage=" + com.getValue() + "");

				//重设选中的大图数组pngSelBig
				//var imgNow = pngAllMini.getAt((com.getValue() - 1));
				//pngSelBig.clear();
				//pngSelBig.add(imgNow.id, imgNow);
			},
			change: function (com, nVal, oVal, opts) {
				if ((nVal > currFaxFileTotal && nVal != '1') || nVal < 1) {
					//alert('输入的页码超过了总页数！');
					if (oVal == currFaxFileTotal) {
						ActionBase.getAction('nextPage').setDisabled(true);
						ActionBase.getAction('lastPage').setDisabled(true);
					} else {
						ActionBase.getAction('nextPage').setDisabled(false);
						ActionBase.getAction('lastPage').setDisabled(false);
					}
					if (oVal == '1') {
						ActionBase.getAction('fistPage').setDisabled(true);
						ActionBase.getAction('prePage').setDisabled(true);
					} else {
						ActionBase.getAction('fistPage').setDisabled(false);
						ActionBase.getAction('prePage').setDisabled(false);
					}
					com.setValue(oVal);

				} else {
					if (nVal == currFaxFileTotal) {
						ActionBase.getAction('nextPage').setDisabled(true);
						ActionBase.getAction('lastPage').setDisabled(true);
					} else {
						ActionBase.getAction('nextPage').setDisabled(false);
						ActionBase.getAction('lastPage').setDisabled(false);
					}
					if (nVal == '1') {
						ActionBase.getAction('fistPage').setDisabled(true);
						ActionBase.getAction('prePage').setDisabled(true);
					} else {
						ActionBase.getAction('fistPage').setDisabled(false);
						ActionBase.getAction('prePage').setDisabled(false);
					}

				}

			} //change
		}

	},{
		itemId: 'tbPageTotal',
		xtype: 'tbtext',
		text: '共'+'   0'
	}, "&nbsp&nbsp&nbsp", "-", ActionBase.getAction('nextPage'),
	ActionBase.getAction('lastPage'),
	"-", '&nbsp', ActionBase.getAction('selectAll'),
	"-", ActionBase.getAction('selectToggle'),
	"-", ActionBase.getAction('viewTypeChange')]
});

//viewFaxFileTab类
Ext.define('ws.viewFax.viewFaxFileTab', {
	alias: 'widget.viewFaxFileTab',
	itemId: 'viewFaxFileTab',
	extend: 'Ext.panel.Panel',
	alternateClassName: ['viewFaxFileTab'],
	//width: 800,
	//height: 300,
	border:false,
	bodyBorder:false,
	layout: {
		type:'card',
		deferredRender:true
	},
	items: [{
		itemId: 'PngTab',
		//title: '传真图', //WsItemId.tbFaxFileTabPngId  tbFaxFileTabPng
		border:false,
		layout: 'auto',
		style:{
			'-moz-user-select':'none'
		},
		bodyStyle: {
			background: '#DFE8F6'
		},
		autoScroll: true,
		items: [{
			xtype: 'palFaxFileTabPngMini',
			border:false
		},{
			xtype: 'palFaxFileTabPng',
			border:false,
			hidden: true
		}],
		listeners: {
			afterrender: function (pal, opts) {
				var palDom = pal.getEl();
	
				//ie下取消选择
				palDom.dom.onselectstart= function() {
					return false;
				};
			}
		},
		dockedItems: [{
			xtype: 'tbFaxFileTabPng',
			listeners: {
				afterrender: function() {
					ActionBase.updateActions('viewFaxFileTab', 0,0,0,-1);
				}
			}
		}]
	},{
		itemId: 'detailTab',
		//title: '详细资料',
		border:false,
		layout: 'fit'
	},{
		itemId:'workflowTab',
		border:false,
		autoScroll:true,
		margin:'10 0 0 2',
		layout: 'auto',
		items:[]
	}],
	listeners: {
		afterrender: function (com, opts) {
			ActionBase.setTargetView('viewFaxFileTab', com);
			//mini
			com.down('#txtMiniCurrPage').setValue(1);
			com.down('#txtMiniCurrPage').setVisible(true);
			com.down('#tbMiniPageTotal').setVisible(true);
			//fit
			com.down('#fistPage').setVisible(false);
			com.down('#prePage').setVisible(false);
			com.down('#tbPageTotal').setVisible(false);
			com.down('#txtCurrPage').setVisible(false);
			com.down('#nextPage').setVisible(false);
			com.down('#lastPage').setVisible(false);
			// var detailPanel = com.down('#detailTab');
			//
			// if (detailFormForDefaultPng == "") {
			// detailFormForDefaultPng = loadDetailFormForDefaultPng();
			// }
			//
			// detailPanel.add(detailFormForDefaultPng);

		}
	},
	tabchange: function () {

		var me = this;

		var activeTab = me.getLayout().getActiveItem();
		if (activeTab.itemId == "PngTab" &&currGrid&& currGrid.itemId.toLowerCase() == 'infaxgrid') {
			//加载自动已读设置
			if (tb&&tb.getSelectionModel().hasSelection() && tb.getSelectionModel().getSelection()[0].data.version == "0") {
				setReadFlagTask.delay(userConfig.autoReadSec * 1000, function () {
					var records = tb.getSelectionModel().getSelection();
					if(records[0]) {
						records[0].set('version', '1');    //标记为已读
						tb.getStore().getProxy().extraParams.toTrash = undefined;
						tb.getStore().sync();
						records[0].commit(true); 		//将之前选中的数据设置脏数据为false
						getIsReadCount(Ext.StoreMgr.lookup('folderTrstoreId'),tb.getStore().getProxy().extraParams.folderid);
					}
				});
			}
		}

		if (faxFileId != 0) {
			//加载传真图信息
			//if (tab.activeTab.title == "传真图" && isLoaded == 0 && viewType == 0) {
			if (isLoaded == 0 && viewType == 0 && activeTab.itemId == "PngTab") {
				//清空缩略图数组
				pngAllMini.clear();
				//tbFaxFileTabPng  .up('#centerSouthView').down('#viewFaxFileTab')
				var tbPageTotal = me.down('#tbPageTotal');
				var tbMiniTotal = me.down('#txtMiniCurrPage');

				//palFaxFileTabPngMini
				var palPngContainer = me.down('#palFaxFileTabPngMini');
				var param = {};
				param.faxfileid = faxFileId;
				//param.action = "PngInit";
				//param.req = 'call';
				param.sessiontoken = sessionToken;
				
				var pngPageSize = 20;
				if(userConfig.miniPngSize == '1'){
					param.pngh=254;
					param.pngw =188;
					pngPageSize = 10;
				}
				//param.filepngname = 'filepng';
				//调用传真文件图片生成

				WsCall.call('filepng', param, function (response, opts) {
					//设置总页数
					currFaxFileTotal = response.data;
					tbPageTotal.setText('共'+'   '+ response.data);
					if(currFaxFileTotal%pngPageSize == 0) {
						miniTotalPage = parseInt(currFaxFileTotal/pngPageSize);
					} else {
						miniTotalPage = parseInt(currFaxFileTotal/pngPageSize)+1;
					}
					me.down('#tbMiniPageTotal').setText('共'+'   '+ miniTotalPage);
					//alert(miniCurPage + ":" +miniTotalPage+":"+(miniCurPage == miniTotalPage));

					var elseCount = 20;
					//如果是大缩略图，每页10个
					if(userConfig.miniPngSize == '1'){
						elseCount =10;						
					}
					if(miniCurPage == miniTotalPage) {
						if(currFaxFileTotal%pngPageSize != 0) {
							elseCount = currFaxFileTotal%pngPageSize;
						}
						//alert(elseCount);
					}
					var currCount = 0;
					var totalCount = response.data;

					//调用缩略图加载
					//alert(isLoaded+'s');
					if (isLoaded == 0) {
						//获取进度条
						var mainForm = Ext.getCmp('viewPortEast');
						var progressBar;
						var btnCancel;
						var btnContinue;

						runner = new Ext.util.TaskRunner();

						if(!Ext.isIE) {
							progressBar = southTb.down('#bottomProgressBar');
							btnCancel =southTb.down('#btnCancel');
							btnContinue = southTb.down('#btnContinue');

							btnCancel.un('click', cancelClick);
							btnCancel.on('click', cancelClick);

							btnContinue.un('click', continueClick);
							btnContinue.on('click', continueClick);
						}

						var updateClock = function () {
							isLoaded = 1;
							currCount++;
							//alert(currCount+':'+elseCount);
							//调用进度条
							if(!Ext.isIE) {
								progressBar.show();
								btnCancel.show();
								btnContinue.hide();
								progressBar.updateProgress(currCount / totalCount, '加载图片中,请等待...', false);
								//--
							}

							//if (currCount > totalCount) {

							if (currCount > elseCount) {
								runner.stopAll();
								runner = new Ext.util.TaskRunner();
								if(currCount == (elseCount+1) && miniCurPage !=miniTotalPage) {
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
											iconCls:miniCurPage ==(miniTotalPage-1)?'sendfaxBtnLast':'sendfaxBtnNext',
											iconAlign: 'right',
											disabled:miniCurPage ==miniTotalPage?true:false,
											text:miniCurPage ==(miniTotalPage-1)?'下'+(totalCount-pngPageSize*parseInt(miniCurPage))+'张':'下'+pngPageSize+'张',
											handler: function() {
												miniCurPage++;
												tbMiniTotal.setValue(miniCurPage);
												if (runner) {
													ifLoading = 0;
													runner.stopAll();
													//pngSels.clear();
													initAllFaxFileTabPngConfig(null,miniCurPage);
													gridSelsChange();
												}
											}
										}]
									});
									palPngContainer.add(tmpNextPage);

								}

								if(!Ext.isIE) {
									progressBar.updateProgress(1, '加载完毕 !', false);
									btnCancel.setDisabled(true);
								}

								//Ext.Msg.alert(currCount + "加载完毕!");
								//在Grid选择变化后重置
								//isLoaded = 0;//faxFileId=select
							} else {
								if(currCount == 1 && miniCurPage !=1) {
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
											disabled:miniCurPage ==1?true:false,
											scale: 'large',
											iconCls:miniCurPage ==2?'sendfaxBtnFirst':'sendfaxBtnPre',
											iconAlign: 'left',
											text:'上'+pngPageSize+'张',
											handler: function() {
												miniCurPage--;
												tbMiniTotal.setValue(miniCurPage);
												if (runner) {
													ifLoading = 0;
													runner.stopAll();
													//pngSels.clear();
													initAllFaxFileTabPngConfig(null,miniCurPage);
													gridSelsChange();
												}
											}
										}]
									});
									palPngContainer.add(tmpUpPage);
								}
								
								var pngCH=142,pngCW=100,pngH=127,pngW =94;
								//如果是横向大缩略图
								//if(winType &&winType.pngGroup == 'faxtodocsingle') {
								if(userConfig.miniPngSize == '1'){
									pngCH=280;
									pngCW = 205;
									pngH=254;
									pngW =188;
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
										width: pngW,
										height: pngH,
										style: {
											border: '1px solid black'
										},
										src: WsConf.Url + '?req=rc&rcname=loadminipng&fileid=' + faxFileId + '&currpage=' + (currCount+(miniCurPage-1)*pngPageSize)+'&pngCH='+pngCH,
										listeners: {

											afterrender: function (img, opts) {
												var imgDom = img.getEl();
												//装载缩略图数组
												pngAllMini.add(img.id, img);
												imgDom.on('click', function (eve) {
													//判断是否按下ctrl
													if(eve.ctrlKey) {
														shiftImg = img;
														var borderStyle = imgDom.getStyle('border',true);
														if (borderStyle == '1px solid black' || borderStyle == 'black 1px solid') {
															imgDom.setStyle('border', '3px solid blue');
															if (!pngSels.contains(img)) {
																pngSels.add(img.id, img);
															}

														} else {
															imgDom.setStyle('border', '1px solid black');
															if (pngSels.contains(img)) {
																pngSels.remove(img);
															}
														}
														//加载默认的大图选择
														//清空大图选择
														pngSelBig.clear();
														if (pngSels.getCount() > 0) {
															pngSelBig.add(pngSels.first().id, pngSels.first());
														} else {
															var imList = me.down('#palFaxFileTabPngMini').query('image');
															var defaultImg = imList[0];
															pngSelBig.add(defaultImg.id, defaultImg);
														}
														//变更toolbar 翻转、删除 按钮状态
														ActionBase.updateActions('viewFaxFileTab', 0,pngSels.getCount(),currFaxFileTotal,0);
														return;
													}
													//判断是否按下shift
													if(eve.shiftKey) {
														var imageList = me.down('#palFaxFileTabPngMini').query('image');
														var fistImg;

														//清空选择数组
														pngSels.clear();
														Ext.Array.each(imageList, function (item, index, allItems) {
															if(index == 0) {
																if(shiftImg !=0) {
																	fistImg = shiftImg;
																} else {
																	fistImg = item;
																}
															}
															var imgItem = item.getEl();
															imgItem.setStyle('border', '1px solid black'); //取消选中
															if(item.id >= fistImg.id && item.id <= img.id) {
																imgItem.setStyle('border', '3px solid blue'); //选中
																pngSels.add(item.id, item);
															}
															if(item.id <= fistImg.id && item.id >= img.id) {
																imgItem.setStyle('border', '3px solid blue'); //选中
																pngSels.add(item.id, item);
															}
															//alert(item.id+":"+fistImg.id);
															//alert(img.id);
														});
														//加载默认的大图选择
														//清空大图选择
														pngSelBig.clear();
														if (pngSels.getCount() > 0) {
															pngSelBig.add(pngSels.first().id, pngSels.first());
														} else {
															pngSelBig.add(img.id, img);
														}
														//变更toolbar 翻转、删除 按钮状态
														ActionBase.updateActions('viewFaxFileTab', 0,pngSels.getCount(),currFaxFileTotal,0);
														return;
													}
													shiftImg = img;
													var imageList = me.down('#palFaxFileTabPngMini').query('image');
													//清空选择数组
													pngSels.clear();
													Ext.Array.each(imageList, function (item, index, allItems) {
														var imgItem = item.getEl();
														imgItem.setStyle('border', '1px solid black'); //取消选中
														if(item.id == img.id) {
															imgItem.setStyle('border', '3px solid blue'); //选中
															pngSels.add(item.id, item);
														}
													});
													//加载默认的大图选择
													//清空大图选择
													pngSelBig.clear();
													if (pngSels.getCount() > 0) {
														pngSelBig.add(pngSels.first().id, pngSels.first());
													} else {
														pngSelBig.add(img.id, img);
													}
													//变更toolbar 翻转、删除 按钮状态
													ActionBase.updateActions('viewFaxFileTab', 0,pngSels.getCount(),currFaxFileTotal,0);
												});
												//双击
												imgDom.on('dblclick', function () {
													var imageList = me.down('#palFaxFileTabPngMini').query('image');
													//清空选择数组
													pngSels.clear();
													Ext.Array.each(imageList, function (item, index, allItems) {
														var imgItem = item.getEl();
														imgItem.setStyle('border', '1px solid black'); //取消选中
													});
													//var borderStyle = imgDom.getStyle('border');
													var borderStyle = imgDom.dom.style['border'];
													if (borderStyle == '1px solid black' || borderStyle == 'black 1px solid') {
														imgDom.setStyle('border', '3px solid blue');
														if (!pngSels.contains(img)) {
															pngSels.add(img.id, img);
														}

													}
													//加载默认的大图选择
													//清空大图选择
													pngSelBig.clear();
													if (pngSels.getCount() > 0) {
														pngSelBig.add(pngSels.first().id, pngSels.first());
													} else {
														var imList = me.down('#palFaxFileTabPngMini').query('image');
														var defaultImg = imList[0];
														pngSelBig.add(defaultImg.id, defaultImg);
													}
													//调用切换视图
													ActionBase.getAction('viewTypeChange').execute();

												});
												runner.stopAll();
												if (ifLoading == 1) {
													runner.start(task);
												}
											}
										}
									},{
										xtype: 'label',
										text: currCount+(miniCurPage-1)*pngPageSize
									}]
								});
								//加载png图片
								palPngContainer.add(pngContainer);

							}
						} //updateClock
						task = {
							run: updateClock,
							interval: 1 //0.01 second
						}
						runner.start(task);
					}

				}, function (response, opts) {
					var palPngMini = viewFaxFileTab.down('#palFaxFileTabPngMini');
					var msgStr = '';
					if(response.msg && response.msg !='') {
						msgStr = response.msg;
					}
					if(internationalCon[response.code]) {
						msgStr = internationalCon[response.code];
					}
					palPngMini.update('<span style="color:red;">&nbsp;&nbsp;<b>'+msgStr+'</b></span>');
					//Ext.Msg.alert('图片加载失败', response.msg);
				}, true);
			} //if tab 传真图

			//if (tab.activeTab.title == "传真图" && viewType == 1) {
			if (viewType == 1 && activeTab.itemId == "PngTab") {

				//tbFaxFileTabPng
				var tbPageTotal1 = me.down('#tbPageTotal');
				//palFaxFileTabPngBig
				var palPngContainerBig = me.down('#palFaxFileTabPng');
				//清空
				palPngContainerBig.removeAll();
				var param = {};
				param.faxfileid = faxFileId;
				//param.req = 'call';
				param.sessiontoken = sessionToken;
				//param.filepngname = 'filepng';
				//如果是横向大缩略图
				//if(winType &&winType.pngGroup == 'faxtodocsingle') {
			    var pngPageSize = 20;
				if(userConfig.miniPngSize == '1'){
					param.pngh=254;
					param.pngw =188;
					pngPageSize = 10;
				}

				WsCall.call('filepng', param, function (response, opts) {
					//设置总页数
					currFaxFileTotal = response.data;
					tbPageTotal1.setText('共'+'   '+ response.data);
					currCountBig = 0;
					var totalCount = response.data;
					currCountBig++;
					//如已有选择
					var itemSelect;
					//alert(pngSels.getCount());
					if (pngSels.getCount() > 0) {
						pngSels.sortByKey();
						itemSelect = pngSels.first();
						pngSelBig.clear();
						pngSelBig.add(itemSelect.id, itemSelect);
						var paraStr = itemSelect.src.substr(itemSelect.src.indexOf('?') + 1, itemSelect.src.length);
						var str = paraStr.split('&');
						var cpage = str[3].split('=')[1];
						currCountBig = cpage;
						//txtCurrPage
						var txtCurrPage = me.down('#txtCurrPage');
						txtCurrPage.setValue(cpage);
					} else {
						if (!(pngSelBig.getCount() > 0)) {
							var imList = me.down('#palFaxFileTabPngMini').query('image');
							if(imList && imList.length >0) {
								var defaultImg = imList[0];
								pngSelBig.clear();
								pngSelBig.add(defaultImg.id, defaultImg);
							}

							var txtCurrPage = me.down('#txtCurrPage');
							txtCurrPage.setValue((miniCurPage-1)*pngPageSize+1);
						}

					}

					isLoadedBig = 1;
					//在Grid选择变化后重置
					//isLoaded = 0;faxFileId=select
					//调用图加载

					currCountBig = me.down('#txtCurrPage').getValue();
					//alert(currCountBig);

					var param = {};
					param.sessiontoken = sessionToken;
					param.fileid = faxFileId;
					param.currpage= currCountBig;

					var fitImage = Ext.create('Ext.Img', {
						style: {
							border: '1px solid black'
						},
						//height:info.height,
						//width:info.width,
						//src:WsConf.Url + info.url,
						//src: WsConf.Url + '?req=rc&rcname=loadfitpng&fileid=' + myfilepngview.getFaxFileId() + '&currpage=' + myfilepngview.getCurrCountBig() + '&randomTime=' +(new Date()).getTime(),
						listeners: {
							afterrender: function (img, opts) {
								var imgDom = img.getEl();
								//大图双击
								imgDom.on('dblclick', function () {
									//调用切换视图
									ActionBase.getAction('viewTypeChange').execute();
								});
							}
						}
					});

					palPngContainerBig.add(fitImage);
					pngContainerBig = fitImage;
					WsCall.call('loadfitpng', param, function(response, opts) {
						var info = Ext.JSON.decode(response.data);
						fitImage.setSrc(WsConf.Url + info.url+'&randomTime='+ (new Date()).getTime());
						palPngContainerBig.setHeight(info.height +2);
						palPngContainerBig.setWidth(info.width + 20);

					}, function(response, opts) {

					}, true);
				}, function (response, opts) {
					Ext.Msg.alert('加载失败', response.msg);
				}, true);
			}
		}
	} //tabchange
});