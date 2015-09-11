//显示LinkPal
function showLinkPal(sel) {
	var centerPal = viewPortEast.down('#centerView');
	var linkPal = viewPortEast.down('#linkPal');			
	linkPal.setHeight(centerPal.getHeight());
	var re = /http/i;	  
	var linksrc = sel.data.linksrc;
	var rindex = linksrc.search(re);
	if(rindex != 0) {
		linksrc = 'http://' + linksrc;
	}
	//alert(linksrc);
	linkPal.update('<iframe style="border:0px;" width="100%" height="100%" src="'+linksrc+'"></iframe>');
}

//隐藏LinkPal
function hideLinkPal() {
	var linkPal = viewPortEast.down('#linkPal');
	linkPal.setHeight(0);
	linkPal.removeAll();
}

//返回对应Menu
function currGridMenu() {
	if(currGrid.itemId == 'Infaxgrid') {
		return infax_tbtnSetMenu;
	}
	if(currGrid.itemId == 'outfaxgrid') {
		return outfax_tbtnSetMenu;
	}
	if(currGrid.itemId == 'succoutfaxgrid') {
		return sucfax_tbtnSetMenu;
	}
	if(currGrid.itemId == 'DocGrid') {
		return docgrid_tbtnSetMenu;
	}
	if(currGrid.itemId == 'TaskGrid') {
		return taskgrid_tbtnSetMenu;
	}
	return null;
}

// 共享目录资源访问权限
function linkFolderPri(pri) {
	if(!pri) {
		return '';
	}
	var priStr = '';
	if (pri.folderPrivList == 1) { // 目录资源列表权限,可列出目录包含之资源
		priStr += '查看列表' + ',';
	}
	if (pri.folderPrivPrint == 1) { // 打印目录资源内容权限
		priStr += '打印' + ',';
	}
	if (pri.folderPrivView == 1) { // 查看目录资源内容权限(读取传真文件,语音留言内容等)
		priStr += '查看内容' + ',';
	}
	if (pri.folderPrivModify == 1) { // 修改目录包含之资源可修改属性权限,包括自定义表单数据
		priStr += '修改' + ',';
	}
	if (pri.folderPrivDelete == 1) { // 删除目录包含之资源权限
		priStr += '删除' + ',';
	}
	if (pri.folderPrivExport == 1) { // 下载及导出目录包含之资源权限
		priStr += '导出' + ',';
	}
	if (pri.folderPrivforword == 1) { // 转发目录包含之资源权限
		priStr += '转发' + ',';
	}
	if (pri.folderPrivMove == 1) { // 移动目录包含之资源权限
		priStr += '移动' + ',';
	}
	if (pri.folderPrivComment == 1) { // 修改或添加目录包含之资源注释权限
		priStr += '修改注释' + ',';
	}
	if (pri.folderPrivAdd == 1) { // 添加目录包含之资源权限(对DOCUMENT类型资源有效)
		priStr += '新建' + ',';
	}
	if (pri.folderPrivBackup == 1) { // 归档目录包含之资源权限
		priStr += '归档' + ',';
	}
	if (pri.folderPrivAdmin == 1) { // 目录管理员权限,包含上述所有权限以及授予目录用户权限,修改目录本身属性,删除目录,增添子目录权限
		priStr += '管理资源目录' + ',';
	}
	if(priStr == '') {
		return '无权限';
	}
	return priStr.substring(0, priStr.length - 1);
}

//权限tooltip用
function regeRoleTip(priv) {
	Ext.tip.QuickTipManager.register({
		target: gridTitle.el,
		title: '资源访问权限',
		text: linkFolderPri(priv),
		width: 300,
		dismissDelay: 10000 // Hide after 10 seconds hover
	});
}

//triggerfield控件的 onTriggerClick:
//curCmp: 当前triggerfield控件，treeLoading: 树窗口加载状态，
//loadFun: load回调函数， beforeloadFun: beforeload回调函数
//curTreeWin: 显示树窗口 , linkCmpId: 联动控件itemid	curTreeWinWidth: 树窗口宽度
function triggleFun(curCmp, treeStroreId, loadFun, beforeloadFun, treeWinObj, linkCmpId, callBackFn) {
	var win = curCmp.up('window');
	if(treeWinObj.treeLoading == 0) {
		var task = new Ext.util.DelayedTask( function () {
			treeWinObj.treeLoading = 1;
			var position = curCmp.getEl().getXY();
			Ext.StoreMgr.removeAtKey(treeStroreId);
			//组织目录树Store
			Ext.create('Ext.data.TreeStore', {
				model: 'addresspersonwinTree_Model',
				storeId: treeStroreId,
				defaultRootId: 'addrRoot',
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
						seccessProperty: 'success',
						messageProperty: 'msg'
					},
					actionMethods: 'POST'
				},
				root: {
					expanded: false,
					text: '通讯录',
					iconCls: 'fax'
				},
				listeners: {
					load:loadFun,
					beforeload: beforeloadFun
				}
			});

			if (treeWinObj.curTreeWin == '') {
				treeWinObj.curTreeWin = Ext.create('addresspersonwinTree', {
					store: treeStroreId,
					floating: true,
					preventHeader: true,
					style: {
						'left': position[0] + 105,
						'top': position[1] + 22
					},
					hidden: true,
					width: treeWinObj.winWidth,
					height: 200
				});
			}

			treeWinObj.curTreeWin.show(null, function () {
				treeWinObj.curTreeWin.setPagePosition(position[0] + 105, position[1] + 22);
			});
			treeWinObj.curTreeWin.un("selectionchange");
			treeWinObj.curTreeWin.on("selectionchange", function (view, seles, op) {
				(new Ext.util.DelayedTask()).delay(500, function() {
					if (treeWinObj.curTreeWin != '') {
						treeWinObj.curTreeWin.destroy();
						treeWinObj.curTreeWin = '';
						treeWinObj.treeLoading = 0;
						if(callBackFn) {
							callBackFn();
						}
					}
				});
				var val = linkViewTitle(seles,false,true);
				curCmp.setValue(val);
				treeWinObj.curTreeWin.hide();
				var currentgird = win.down('#' + linkCmpId);
				if (currentgird && currentgird.getStore) {
					currentgird.getStore().loadData([]);
				}
				currentgird.getStore().getProxy().extraParams.folderid = seles[0].data.id;
				currentgird.loadGrid();
			});
			if(callBackFn) {
				callBackFn();
			}
		}).delay(300);
		treeWinObj.treeLoading = 0;
	} else {
		if (treeWinObj.curTreeWin != '') {
			treeWinObj.curTreeWin.destroy();
			treeWinObj.curTreeWin = '';
			treeWinObj.treeLoading = 0;
			if(callBackFn) {
				callBackFn();
			}
		}
	}
}

//启动执行规则操作 验证操作是否完成， 完成后load数据
function executeRuleProcess(grid, okFun, ids) {
	var extraParams = grid.getStore().getProxy().extraParams;
	var paramP = {
		sessiontoken : getSessionToken(),
		filter: extraParams.filter,
		folderid: extraParams.folderid,
		template: extraParams.template,
		tplsearch: extraParams.tplsearch,
		folderFlag: extraParams.folderFlag,
		ids: ids ? ids : null
	};
	WsCall.call('startRuleExe', paramP, function(response, opts) {
		okFun();
	}, function(res) {
		if (!errorProcess(res.code)) {
			if(res.code == 0x6F000040) {
				var total = res.data;
				var progress = Ext.MessageBox.show({
					title: '请稍候...',
					msg: '需要处理的记录共'+ ' ' + total + ' '+'条',
					progressText: '正在处理',
					width:300,
					progress:true,
					closable:false
				});
				var taskRunner = new Ext.util.TaskRunner();
				var f = function() {
					var param = {
						sessiontoken : getSessionToken()
					};
					WsCall.call('rulecompleted', param, function(response, opts) {
						taskRunner.stopAll();
						progress.updateProgress(1, '已完成 '+ total + '/' + total);
						(new Ext.util.DelayedTask()).delay(200, function() {
							progress.hide();
							okFun();
						});
					}, function(res) {
						if (!errorProcess(res.code)) {
							var i = res.data / total;
							progress.updateProgress(i, '已完成 '+ res.data + '/' + total);
						}
					}, false);
				};
				(new Ext.util.DelayedTask( function() {
						taskRunner.start({
							run: function() {
								f();
							},
							interval: 2000
						});
					})).delay(200);
			}
		}
	}, false);
}

function hideFlash(winType) {
	if(isSurportFlash&&winType.faxFileUpload && winType.faxFileUpload.settings != null) {
		winType.down('#replacePal').hide();
		winType.faxFileUpload.setButtonDisabled(true);
		winType.faxFileUpload.setButtonText('<span class="grayText">'+'添加文件'+'</span>');
		winType.faxFileUpload.setButtonTextStyle('.grayText {color:#969696;font-size:12px;}');
	}
}

function showFlash(winType) {
	if(isSurportFlash&&winType.faxFileUpload&&userConfig.printerSrc=='0' && winType.pngGroup != 'wfhandlerwin' && winType.pngGroup != 'faxtodocsingle') {
		winType.down('#replacePal').show();
		winType.faxFileUpload.setButtonDisabled(false);
		winType.faxFileUpload.setButtonText('<span class="blackText">'+'添加文件'+'</span>');
		winType.faxFileUpload.setButtonTextStyle('.blackText {color:#FFFFFF;font-size:12px;}');
	}
}

//计算mini png panel 长宽
function setPngMiniWH(viewType,winType,type) {

	var barPageCount = 8;
	var pageSize = 20;
	var hSize = 152;
	if(userConfig.miniPngSize == '1') {
		barPageCount =4;
		pageSize = 10;
		hSize = 304;
	}
	if(type && type == 'bar') {
		var hei = 280,wid;
		wid = viewType.getTotalCount()*210;
		winType.down('#filepngviewMini').setWidth(wid);
		winType.down('#filepngviewMini').setHeight(hei);
	} else {

		if(winType.pngGroup != 'inputdatawin') {
			var hei;
			if(viewType.getImgCount() > pageSize) {
				if((viewType.getImgCount()+2)%barPageCount > 0) {
					hei = (((viewType.getImgCount()+2)/barPageCount)+1)*hSize;
				} else {
					hei = ((viewType.getImgCount()+2)/barPageCount)*hSize;
				}
			} else {
				if(viewType.getImgCount()> barPageCount&& (viewType.getImgCount())%barPageCount > 0) {
					hei = (((viewType.getImgCount())/barPageCount)+1)*hSize;
				} else {
					hei = (((viewType.getImgCount())/barPageCount)+1)*hSize;
				}
			}
			winType.down('#filepngviewMini').setHeight(hei);
		} else {
			var hei;
			var shortBarPageCount = barPageCount-1;
			if(viewType.getImgCount() > pageSize) {
				if((viewType.getImgCount()+2)%shortBarPageCount > 0) {
					hei = (((viewType.getImgCount()+2)/shortBarPageCount)+1)*hSize;
				} else {
					hei = ((viewType.getImgCount()+2)/shortBarPageCount)*hSize;
				}
			} else {
				if(viewType.getImgCount()> shortBarPageCount&& (viewType.getImgCount())%shortBarPageCount > 0) {
					hei = (((viewType.getImgCount())/shortBarPageCount)+1)*hSize;
				} else {
					hei = (((viewType.getImgCount())/shortBarPageCount)+1)*hSize;
				}
			}
			winType.down('#filepngviewMini').setHeight(hei);
		}

		// if(Ext.isIE6) {
		// winType.down('#filepngviewMini').setWidth(880);
		// }

	}

	//去掉背景图
	winType.down('baseviewpanel').setBodyStyle({
		'background-image':'none'
	});

}

//收藏或删除目录
//contTree-- 当前处理的树
function stowFolderFun(isAdd, folderid, contTree) {
	var paramP = {
		sessiontoken : getSessionToken(),
		isAdd: isAdd,
		folderid : folderid
	}
	WsCall.call('stowfolder', paramP, function(response, opts) {
		var store = FolderTree1.getStore();
		var scNode = store.getRootNode().childNodes[2];
		store.load({
			node: scNode,
			callback: function(records, operation, success) {
				scNode.collapse();
				scNode.expand();
			}
		});

		var store1 = docTree.getStore();
		var scNode1 = store1.getRootNode().childNodes[2];
		store1.load({
			node: scNode1,
			callback: function(records, operation, success) {
				scNode1.collapse();
				scNode1.expand();
				contTree.getSelectionModel().select(contTree == FolderTree1 ? scNode : scNode1, true);
			}
		});

	}, function(res) {
		if (!errorProcess(res.code)) {
			Ext.Msg.alert('失败', res.msg);
		}
	}, false);
}

//通报 所属 国际化
function owerInternational(srcStr) {
	srcStr = srcStr.replace('@shoujianxiang@','收件箱')
	.replace('@gxsjx@','共享收件箱')
	.replace('@gr@','个人')
	.replace('@gxwjj@','共享文件夹')
	.replace('@gx@','共享');

	return srcStr;
}

//判断当前Task操作权限
function workflowActionDis(rule,ruleStr) {
	if(rule.indexOf(ruleStr) != -1) {
		return false;
	}
	return true;
}

//tree国际化
function wfTreeInter(treeId,treeText) {
	if(treeId == 'wftask') {
		return '任务';
	}
	if(treeId == 'wfstart') {
		return '启动事项';
	}
	if(treeId == 'wfinit') {
		return '提交事项';
	}
	if(treeId == 'wfwait') {
		return '待办事项';
	}

	if(treeId == 'wfsub') {
		return '委托我的事项';
	}

	if(treeId == 'wfinon') {
		if(treeText!= '') {
			return '<b>'+'正在进行'+'('+treeText+')'+'</b>';
		}
		return '正在进行';
	}
	if(treeId == 'wfwaon') {
		if(treeText!= '') {
			return '<b>'+'正在进行'+'('+treeText+')'+'</b>';
		}
		return '正在进行';
	}
	if(treeId.indexOf('trwron') != -1) {	//--他人委任工作流
		if(treeText!= '') {
			return '<b>'+'正在进行'+'('+treeText+')'+'</b>';
		}
		return '正在进行';
	}
	if(treeId == 'wfinfis' || treeId == 'wfwafis' || treeId.indexOf('trwrfis') != -1) {
		return '已完成';
	}
	return '';
}

function docTreeInter(treeId) {
	if(treeId == 'gr') {
		return '个人';
	}
	if(treeId == WaveFaxConst.PublicRootFolderID) {
		return '共享';
	}
	if(treeId == WaveFaxConst.RecycleFolderID) {
		return '回收站';
	}
	if(treeId == WaveFaxConst.PublicRecycleFolderID) {
		return '回收站';
	}
	if(treeId == 'grsc') {
		return '目录收藏夹';
	}
	return '';
}

function addrTreeInter(treeId) {
	if(treeId == WaveFaxConst.RootFolderID) {
		return '个人';
	}
	if(treeId == WaveFaxConst.PublicRootFolderID) {
		return '共享';
	}
	return '';
}

function treeInternational(treeId) {
	//个人
	if(treeId == 'gr') {
		return '个人';
	}
	if(treeId == 'tr') {
		return '他人';
	}
	//共享
	if(treeId == WaveFaxConst.PublicRootFolderID) {
		return '共享收件箱';
	}
	//收件箱
	if(treeId == WaveFaxConst.RootFolderID || treeId == 'trwr') {
		return '收件箱';
	}
	//发件箱
	if(treeId == 'grfjx') {
		return '发件箱';
	}
	//已发件箱
	if(treeId == 'gryfjx') {
		return '已发件箱';
	}
	//草稿箱
	if(treeId == 'grcgx') {
		return '草稿箱';
	}
	//收件箱回收站
	if(treeId == WaveFaxConst.RecycleFolderID) {
		return '回收站';
	}

	//已发件箱回收站
	if(treeId == 'gryhsz') {
		return '回收站';
	}
	//共享收件箱回收站
	if(treeId == WaveFaxConst.PublicRecycleFolderID) {
		return '回收站';
	}
	if(treeId == 'grsc') {
		return '目录收藏夹';
	}
	return '';
}

// 获取cookie中的sessionToken
function getSessionToken() {
	var sessiontoken = Ext.util.Cookies.get('sessiontoken');
	//	if (sessiontoken.length == 0) {
	//
	//		// win.show();
	//	}
	return sessiontoken;
}

// 处理接口错误返回值 code
function errorProcess(code,swfokfun) {
	if (code == WaveFaxConst.ResSessionTokenError
	|| code == WaveFaxConst.ResSessionTimeOut) {
		// sessiontoken 无效 重新登陆
		if (win && win.isHidden()) {
			win.show();
		}
		return true;
	} else if (code == WaveFaxConst.ResPartialOK) {

		//		Ext.Msg.alert('错误', '操作部分成功完成');
		return true;
	} else if(code == WaveFaxConst.ResNoUserName) {
		Ext.Msg.alert('登录失败', '登录失败！无效用户名', function() {
			if(swfokfun) {
				swfokfun();
			}
		});
		return true;
	} else if(code == WaveFaxConst.ResPasswordError) {
		Ext.Msg.alert('登录失败', '登录失败！密码错误', function() {
			if(swfokfun) {
				swfokfun();
			}
		});
		return true;
	} else if(code == WaveFaxConst.ResUserInvalid) {
		Ext.Msg.alert('登录失败', '登录失败！用户被冻结或无效', function() {
			if(swfokfun) {
				swfokfun();
			}
		});
		return true;
	} else if(code == WaveFaxConst.ResDomainLoginFailed) {
		Ext.Msg.alert('登录失败', '登录失败！映射域登陆验证失败 ', function() {
			if(swfokfun) {
				swfokfun();
			}
		});
		return true;
	} else if(code == WaveFaxConst.ConServerError) {
		Ext.Msg.alert('连接失败', 'WaveFax应用服务连接失败，请稍后重试 ', function() {
			if(swfokfun) {
				swfokfun();
			}
		});
		return true;
	} else if(code == WaveFaxConst.ResOperationDeny) {
		Ext.Msg.alert('错误', '没有此项操作的权限', function() {
			if(swfokfun) {
				swfokfun();
			}
		});
		return true;
	} else {
		for(var item in internationalCon) {
			if(item == code) {
				if(item == 0x6F000036) {
					//打开下载窗口
					var obj = new Object();
					obj.name="dlprt";
					window.showModalDialog("wsdownload/dlwfprt.html",obj,"dialogWidth=400px;dialogHeight=300px;");
				} else {
					Ext.Msg.alert('错误', internationalCon[item], function() {
						if(swfokfun) {
							swfokfun();
						}
					});
				}

				return true;
			}
		}
		return false;
	}
}

// 处理日期
function UTCtoLocal(dateString) {
	var date = Ext.Date.parse(dateString + '+0000', 'Y-m-d H:i:sO');
	var m = Ext.util.Format.date(date, 'Y-m-d H:i:s');
	return m;
}

//本地时间根据i（天）计算偏移时间
function LocalToUTC(i) {
	var now = new Date();
	var offset = now.getTimezoneOffset() * 60 * 1000;
	var local = now.getTime();
	var resDate = new Date();
	resDate.setTime(local + offset - (i * 24 * 3600 * 1000));
	var m = Ext.util.Format.date(resDate, 'Y-m-d');
	return m;
}

//从现在向后推算 loacal时间
function nowToFuture(i) {
	var now = new Date();
	var local = now.getTime();
	var resDate = new Date();
	resDate.setTime(local + (i * 24 * 3600 * 1000));
	var m = Ext.util.Format.date(resDate, 'Y-m-d H:i:s');
	return m;
}

function LocalToUTCTime(i, endTime) {
	var now = new Date();
	var offset = now.getTimezoneOffset() * 60 * 1000;
	var local = now.getTime();
	var resDate = new Date();
	resDate.setTime(local + offset - (i * 24 * 3600 * 1000));
	var str = Ext.util.Format.date(resDate, 'Y-m-d');
	str = str + ' 00:00:00';
	var offDate = Ext.Date.parse(str, "Y-m-d H:i:s");
	if(endTime) {
		resDate.setTime(offDate.getTime() + (24*3600*1000 -1000) + offset);
	} else {
		resDate.setTime(offDate.getTime() + offset);
	}
	var m = Ext.util.Format.date(resDate, 'Y-m-d H:i:s');
	return m;
}

// 将本地date格式时间转化为utc时间的字符串
function LocalDateToUTCstr(date) {
	var offset = date.getTimezoneOffset() * 60 * 1000;
	var local = date.getTime();
	var resDate = new Date();
	resDate.setTime(local + offset);
	var m = Ext.util.Format.date(resDate, 'Y-m-d');
	return m;
}

function LocalDateToLongUTCstr(date) {
	var offset = date.getTimezoneOffset() * 60 * 1000;
	var local = date.getTime();
	var resDate = new Date();
	resDate.setTime(local + offset);
	var m = Ext.util.Format.date(resDate, 'Y-m-d H:i:s');
	return m;
}

function recordCssGet(record) {
	if(!template) {
		record.css = '';
		return record;
	}

	if(template.currTpl =='' || template.currStyle.getCount() <= 0) {
		record.css = '';
	}
	if(!record.css) {
		Ext.Array.each(record.data, function(rec) {
			for(var rc in rec) {
				var ckey = rc +'|'+rec[rc];
				var style = template.currStyle.get(ckey);
				if(style) {
					record.css = style;
					break;
				}
			}
			if(record.css)
				return false;
		});
		if(!record.css)
			record.css = '';
	}
	return record;
}

//地址本 record
function updateAddressRec(value, metaData, record) {
	if (record.get('faxNumber') == '' ||record.get('faxNumber').length == 0 ) {
		return "<span style='color:gray;'>"+ value +"</span>";
	} else {
		return value;
	}
}

// 处理收件箱grid record的显示
function updateRecord(value, metaData, record) {

	//无表单，且无样式
	record = recordCssGet(record);

	//alert(style);
	if (record.get('version') == '0') {
		if(record.css.length > 0) {
			return "<span style='"+record.css+"'>"+"<b>" + value + "</b>"+"</span>";
		} else {
			return "<b>" + value + "</b>";
		}
	} else {
		if(record.css.length > 0) {
			return "<span style='"+record.css+"'>"+value+"</span>";
		} else {
			return value;
		}
	}
}

function wfhascheck(process,tid) {
	var hascheck = false;
	var dataList = Ext.JSON.decode(process);
	Ext.Array.each(dataList, function(item) {
		if(item.activityStatus == '1' || item.activityStatus == '2') {

			var idList = Ext.JSON.decode(item.userids);
			Ext.Array.each(idList, function(uid) {
				if(tid.indexOf('trsub')!= -1) {
					//alert(tid.substring(5,tid.length));
					if(uid == parseInt(tid.substring(5,tid.length))) {
						hascheck = true;
					}
					return false;
				} else if(tid.indexOf('trwron')!= -1) {
					//alert(tid.substring(6,tid.length));
					if(uid == parseInt(tid.substring(6,tid.length))) {
						hascheck = true;
					}
					return false;
				} else if(uid == userInfoData.userID) {
					hascheck = true;
					return false;
				}
			});
			return false;
		}
	});
	return hascheck;
}

//workflow record显示
function updateRecordWf(value, metaData, record) {

	//无表单，且无样式
	//record = recordCssGet(record);

	var hascheck;
	var tid = wfTree.getSelectionModel().getSelection()[0].data.id;

	if(tid!= 'wfwaon' && tid!= 'wfwait' && tid.indexOf('trsub')== -1 && tid.indexOf('trwron')== -1) {
		hascheck = true;
	} else if(record.data.workflowStatus == 3) {
		hascheck = true;
	} else {
		hascheck = wfhascheck(record.data.process,tid);
	}

	//比对下当前步骤审批人列表 userInfoData.userID
	if(hascheck) {
		if( tid== 'wfwaon' || tid== 'wfwait' || tid.indexOf('trsub')!= -1 || tid.indexOf('trwron')!= -1) {
			if(record.data.workflowStatus == 3) {
				return value;
			}
			return "<b>"+value+"</b>";
		}
		return value;
	}

	return "<span style='color:#7F7F7F;'>"+value+"</span>";

}

//发件箱record显示处理 通用
function updateOutFaxRec(value, metaData, record) {
	record = recordCssGet(record);
	if(record.css.length > 0) {
		return "<span style='"+record.css+"'>"+value+"</span>";
	} else {
		return value;
	}
}

// 处理已发件箱grid record的显示
function updateSuccoutFaxRecord(value, metaData, record) {
	//return value;
	//无表单，且无样式
	record = recordCssGet(record);

	if (record.get('status') != '9') {
		if(record.css.length > 0) {
			return "<span style='"+record.css+"'>" + value + "</span>";
		} else {
			return "<span style='color:red;'>" + value + "</span>";
		}

	} else {
		if(record.css.length > 0) {
			return "<span style='"+record.css+"'>"+value+"</span>";
		} else {
			return value;
		}
	}
}

//工作流用
function updateWfGridErrCode(value) {
	//if(wfTree) {
	//var sel = wfTree.getSelectionModel().getSelection()[0];
	//if(sel.data.id == 'wfinfis' || sel.data.id == 'wfwafis') {
	if(value == '0') {//成功通过
		return '通过';
	} else if(value == '1') {//未通过，失败
		return '拒绝';
	} else if(value == '2') {//超时
		return '超时';
	} else if(value == '3') {//被取消
		return '取消';
	}
	// }else{
	// return '完成';
	// }
	//}
	return '';
}

function updateWfGridIcon(value, metaData, record) {
	var sval = record.get('workflowStatus');

	if(sval == '0') {//空闲状态,流程未启动(被用户暂停)
		//return '未启动';
		return "<span><img src='resources/images/workFlow/statues/wfidle.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
	} else if(sval == '1') {//运行状态,表示工作流任务正在等待用户进行某个操作
		//return '运行';
		return "<span><img src='resources/images/workFlow/statues/wfwait.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
	} else if(sval == '2') {//某个活动生在被执行,含义是正在被某用户处理,此状态表示此任务被锁定,其他人不能操作此任务
		//return '处理中';
		return "<span><img src='resources/images/workFlow/statues/wfactive.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
	} else if(sval == '3') {//工作流任务完成
		if(record) {
			var num = record.get('workflowErrCode');
			if(num == '0') {//成功通过
				//return '成功';
				return "<span><img src='resources/images/workFlow/statues/wfok.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
			} else if(num == '1') {//未通过，失败
				//return '失败';
				return "<span><img src='resources/images/workFlow/statues/wfrefused.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
			} else if(num == '2') {//超时
				//return '超时';
				return "<span><img src='resources/images/workFlow/statues/wfrefused.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
			} else if(num == '3') {//被取消
				//return '取消';
				return "<span><img src='resources/images/workFlow/statues/wfrefused.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
			}
			return "<span><img src='resources/images/workFlow/statues/wfidle.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
		}
	}
	return "<span><img src='resources/images/workFlow/statues/wfidle.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecordWf(value, metaData, record) + '</span>';
}

function updateWfGridStatus(value, metaData, record,code) {
	if(value == '0') {//空闲状态,流程未启动(被用户暂停)
		return '未启动';
	} else if(value == '1') {//运行状态,表示工作流任务正在等待用户进行某个操作
		return '运行';
	} else if(value == '2') {//某个活动生在被执行,含义是正在被某用户处理,此状态表示此任务被锁定,其他人不能操作此任务
		return '处理中';
	} else if(value == '3') {//工作流任务完成
		//return '完成';
		if(record) {
			return updateWfGridErrCode(record.get('workflowErrCode'));
		} else {
			if(code) {
				return updateWfGridErrCode(code);
			}
		}
	}
	return '';
}

function updataAcStatus(num) {
	if(num == '0') {//未分配
		return '未分配';
	} else if(num == '1') {//等待被处理
		return '等待被处理';
	} else if(num == '2') {//正在被处理
		return '正在被处理';
	} else if(num == '3') {//成功通过
		return '成功通过';
	} else if(num == '4') {//未通过,失败
		return '未通过';
	} else if(num == '5') {//超时
		return '超时';
	} else if(num == '6') {//此流程步骤被忽略
		return '此流程步骤被忽略';
	}
	return '';

}

function showTaskTip(eve,tipstr) {
	if(tipstr && tipstr!='' && !eve.tips) {
		eve.tips = true;
		Ext.tip.QuickTipManager.register({
			target: eve,
			//title: 'My Tooltip',
			text: tipstr,
			//width: 100,
			dismissDelay: 10000 // Hide after 10 seconds hover
		});

	}
}

//处理工作流缩略流程图
function updateWfTaskRecord(value, metaData, record) {
	value = Ext.JSON.decode(value);
	var html = '<span><table style="font-size:12px;"><tr>';
	var count =value.length;
	for(var i=0;i<count;i++) {
		var tipStr = getTaskTipStr(value[i].activityStatus,value[i].approver,record.data.taskComment);
		var color = getTaskStateColor(value[i].activityStatus);
		if(i == (count-1)) {
			html+='<td onmouseover=showTaskTip(this,"'+tipStr+'")  style="border:2px '+color+' solid;background-color:#e3e7f0;padding:2px 5px 2px 5px;">'+value[i].acttivityName+'</td>';
			break;
		}
		html+='<td onmouseover=showTaskTip(this,"'+tipStr+'")  style="border:2px '+color+' solid;background-color:#e3e7f0;padding:2px 5px 2px 5px;">'+value[i].acttivityName+'</td><td><img src="resources/images/workFlow/arrowS.png"/></td>';
	}
	html+='</tr></table></span>';
	return html;
}

function getTaskTipStr(num,approver,comment) {
	var str = comment==''?'任务说明:无':'任务说明:'+comment;
	if(num == '3') {//成功通过
		str = '审批人:'+approver;
	}
	return str;
}

//判断工作流task状态返回color
function getTaskStateColor(num,type) {
	var color = '#8F8F8F';
	if(type) {
		color = '#7e7e7e';
		if(num == '0') {//未分配

		} else if(num == '1') {//等待被处理
			color = '#3333cc';//blue
		} else if(num == '2') {//正在被处理
			color = '#1111ee';
		} else if(num == '3') {//成功通过
			color = '#33aa33';
		} else if(num == '4') {//未通过,失败
			color = '#cc5555';
		} else if(num == '5') {//超时
			color = '#cc5555';
		} else if(num == '6') {//此流程步骤被忽略
			//color = '#44dd44';
		}
	} else {
		color = '#8F8F8F';
		if(num == '0') {//未分配

		} else if(num == '1') {//等待被处理
			color = '#4444dd';//blue
		} else if(num == '2') {//正在被处理
			color = '#2222ff';
		} else if(num == '3') {//成功通过
			color = '#44bb44';
		} else if(num == '4') {//未通过,失败
			color = '#dd6666';
		} else if(num == '5') {//超时
			color = '#dd6666';
		} else if(num == '6') {//此流程步骤被忽略
			//color = '#44dd44';
		}
	}
	//0x20  //
	return color;
}

// 处理已发件箱 传真持续时间
function faxDuration(timeStr) {
	// var date = new Date();
	// date.setTime(timeStr * 1000 + date.getTimezoneOffset() * 60 * 1000);
	// var m = Ext.util.Format.date(date, 'H:i:s');
	// return m;
	var hour = parseInt(timeStr/3600);
	if(hour<10) {
		hour = '0'+hour;
	}
	var other = timeStr%3600;
	var minu = parseInt(other/60);
	if(minu<10) {
		minu = '0'+minu;
	}
	other = timeStr%60;
	var sec = parseInt(other);
	if(sec<10) {
		sec = '0'+sec;
	}
	var m = hour+':'+minu+':'+sec;
	return m;
}

// 构建ids数组
function buildFaxIDs(records, idName) {
	var faxids = new Array();
	for (var i = 0; i < records.length; i++) {
		faxids.push(records[i].get(idName));
	}
	return faxids;
}

// 自定义pagingtoolbar

Ext.define('WS.config.Mypagebar', {
	alias : 'widget.mypagebar',
	extend : 'Ext.toolbar.Paging',
	dock : 'bottom',
	displayInfo : true,
	displayMsg : '第'+' {0} '+'条到'+' {1} '+'条数据，共'+' {2} '+'条数据',
	emptyMsg : '没有记录',
	beforePageText : '页数',
	afterPageText : '共' + ' {0}',
	refreshText : '刷新当前页',
	firstText : '首页',
	lastText : '末页',
	nextText : '下页',
	prevText : '前页',
	layout : {
		overflowHandler : 'Menu'
	},
	listeners : {
		render : function(me) {
			me.down('#refresh').hide();
		}
	}

});

function initUpfilesPalItems(com) {
	if(isSurportFlash) {
		com.add({
			xtype:'container',
			width:63,
			height:23,
			frame:false,
			colspan:2,
			items:[{
				xtype:'container',
				frame:false,
				itemId:'spanButtonPlaceholder'
			}]
		});
		// com.add({
		// xtype:'container',
		// frame:false,
		// itemId:'spanButtonPlaceholder',
		// colspan:2
		// });
		com.add({
			xtype:'panel',
			border:false,
			width:800,
			colspan:2,
			itemId:'fsupList',
			listeners: {
				render: function(com) {

					slaveFilesQueueCol.each( function(item,index,alls) {
						com.add({
							xtype:'container',
							itemId:'cPal'+item.id+item.myid,
							myFile:item,
							layout:'hbox',
							defaults: {
								margin:'2 0 4 5'
							},
							items:[{
								xtype:'progressbar',
								width:280,
								value:1,
								itemId:item.myid+item.myid,
								text:item.name+','+'完成.'
							},{
								xtype:'displayfield',
								fieldLabel:'大小',
								labelWidth:60,
								width:130,
								labelAlign:'right',
								value:Ext.util.Format.fileSize(item.size)
							},{
								xtype:'displayfield',
								fieldLabel:'最后修改时间',
								labelWidth:120,
								width:290,
								labelAlign:'right',
								value:Ext.util.Format.date(item.modificationdate ,'Y-m-d H:i:s')
							},{
								xtype:'button',
								text:'取消',
								itemId:'del_'+item.id+item.myid,
								iconCls:'imgBtnDel',
								handler: function(com) {

									var file = com.up('container').myFile;

									//调用call
									var param1 = {};
									param1.filename = file.name;
									param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

									WsCall.call('delSlaveFile', param1, function (response, opts) {
										alert(file.name);
										if(slaveFilesQueueCol.containsKey(file.name)) {
											alert(file.name);
											slaveSwfHandler.myWin.down('#fsupList').remove('cPal'+file.id+file.myid);
											slaveFilesQueueCol.removeAtKey(file.name);
										}
										if(slaveFilesUpedCol.containsKey(file.name)) {
											alert(file.name+'=--');
											slaveSwfHandler.myWin.down('#fsupList').remove('cPal'+file.id+file.myid);
											slaveFilesUpedCol.removeAtKey(file.name);
											stopSwf = false;
										}

									}, function (response, opts) {
										if(!errorProcess(response.code)) {
											Ext.Msg.alert('删除失败', response.msg);
										}
									}, true,'正在从服务器删除文件...',Ext.getBody());
								}
							}]
						});
					});
				}
			}
		});

		// com.add({
		// xtype:'button',
		// itemId:'btnContinue',
		// disabled:true,
		// text:'全部继续',
		// handler: function() {
		// //upload1.startUpload();
		// }
		// });
		// com.add({
		// xtype:'button',
		// text:'全部取消',
		// colspan:2,
		// itemId:'btnCancel',
		// handler: function() {
		// slaveSwfHandler.cancelQueue();
		// }
		// });
		if(slaveUpload) {
			slaveUpload.destroy();
		}
		//4.1需要延迟加载
		(new Ext.util.DelayedTask()).delay(50, function() {
			initSwfUpload(com.up('window'));
		});
	} else {
		com.add({
			margin:'8 0 15 5',
			xtype:'button',
			itemId:'btnAddSl',
			width:140,
			height:26,
			text:'添加附件',
			tooltip:'添加附件',
			iconCls:'imgBtnAdd',
			cellCls:'tdWidth',
			handler: function() {
				var me = this;
				var files = me.up('#tabpalFiles').down('#fsFiles').query('form');
				if(files.length < 10) {
					me.up('#tabpalFiles').down('#fsFiles').add({
						xtype:'form',
						border:false,
						items:[{
							xtype:'filefield',
							name:'slavefiles',
							width:540,
							buttonText: '...',
							listeners: {
								change: function(com,value,eOpts) {
									var name = '';
									var index = value.indexOf('\\');

									if(index != -1) {
										index = value.lastIndexOf('\\');
										name = value.substring(index+1,value.length);
									} else {
										name = value;
									}
									if(slaveFilesQueueCol.containsKey(name)) {
										com.setRawValue('');
										Ext.Msg.alert('消息','已选择过'+name+',不能重复选择同名的文件上传');
									} else {
										slaveFilesQueueCol.add(name,name)
									}
								},
								afterrender: function(com) {
									com.reset();
								}
							}
						}]
					});
				} else {
					Ext.Msg.alert('消息','最多上传10个附件');
				}

			}
		});
		com.add({
			xtype:'button',
			width:140,
			height:26,
			itemId:'btnDelSl',
			text:'删除附件',
			margin:'8 0 15 10',
			tooltip:'删除附件',
			iconCls:'imgBtnDel',
			handler: function() {
				var me = this;
				var files = me.up('#tabpalFiles').down('#fsFiles').query('form');
				if(files.length > 1) {
					me.up('#tabpalFiles').down('#fsFiles').remove(files[files.length-1]);
				}

			}
		});
		com.add({
			itemId:'fsFiles',
			xtype:'panel',
			margin:'5 0 0 0',
			width:560,
			colspan:2,
			border:false
		});
	}

}

//附件控件
Ext.define('WS.config.upFilesPal', {
	alias : 'widget.upFilesPal',
	extend : 'Ext.panel.Panel',
	title:'附件',
	itemId:'tabpalFiles',
	width:850,
	border:false,
	height:400,
	autoScroll:true,
	layout: {
		type:'table',
		columns:2
	},
	listeners: {
		afterrender: function(com,opts) {
			//alert('render');
			com.removeAll();
			initUpfilesPalItems(com);
		}
	},
	items:[]
});

//上传附件用进度
function slaveUplPro(winType,okfun) {

	if(isSurportFlash) {
		if(okfun) {
			okfun();
		}
	} else if(winType) {
		var filesPal = winType.down('#fsFiles');
		if(filesPal) {
			//判断 提交 附件信息
			var files = filesPal.query('form');
			var fCount = 0;
			var formArr = new Array();
			Ext.Array.each(files, function(file,index,alls) {
				if(file.down('filefield').getValue() != '') {
					formArr.push(file);
				}
			});
			if(formArr.length > 0) {
				var prStamp = newMesB.show({
					title: '上传附件',
					iconCls:'coverStamp',
					msg: '请稍候...',
					progressText: '正在上传...',
					width:300,
					progress:true,
					closable:false
				});
				// this hideous block creates the bogus progress
				var f = function(v) {
					var cV = v+1;
					if(cV == formArr.length) {
						var i = cV/formArr.length;
						prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
						(new Ext.util.DelayedTask()).delay(2000, function() {
							prStamp.hide();
						});
					} else {
						var i = cV/formArr.length;
						prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
					}
				};
				var urlStr = WsConf.Url + "?req=call&callname=slaveupload&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "";
				function ireFormFileupload(form) {
					var newUrl;
					if(fCount == 0) {
						newUrl = urlStr +'&delete=1';
					} else {
						newUrl = urlStr;
					}
					if(fCount < formArr.length) {
						form.submit({
							url: newUrl,
							success: function(fp, o) {
								fCount++;
								ireFormFileupload(formArr[fCount]);
							},
							failure: function(form, action) {
								f(formArr.length-1);
								if(!errorProcess(action.result.code)) {
									Ext.Msg.alert('失败', '上传文件失败');
								}
							}
						});
						f(fCount);
					}
					if(fCount == formArr.length) {
						f(formArr.length-1);
						(new Ext.util.DelayedTask()).delay(2000, function() {
							if(okfun) {
								okfun();
							}
						});
					}

				}

				ireFormFileupload(formArr[fCount]);
			} else {
				if(okfun) {
					okfun();
				}
			}
		} else {
			if(okfun) {
				okfun();
			}
		}

	}
	//else if

}

//传真纸加载用进度
function faxpaperCover(winType,okfun) {
	var total = winType.pngClass.getTotalCount();

	var filid = winType.down('#hidFileId').getValue();
	var fpid = winType.faxpaperid;
	var fcount = 0;
	if(fpid && fpid!='0') {

		//调用盖章接口
		var prStamp = newMesB.show({
			title: '添加传真纸',
			iconCls:'coverStamp',
			msg: '请稍候...',
			progressText: '正在进行...',
			width:300,
			progress:true,
			closable:false
		});
		// this hideous block creates the bogus progress
		var f = function(v) {
			var cV = v+1;
			if(cV == total) {
				var i = cV/total;
				prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
				(new Ext.util.DelayedTask()).delay(2000, function() {
					prStamp.hide();
				});
			} else {
				var i = cV/total;
				prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
			}
		};
		//调用
		function ireCall(count) {

			var param = {
				fileid:filid,
				fpid:fpid,
				curpage:count+1
			};
			param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
			//调用
			WsCall.call('faxpapercover', param, function (response, opts) {
				if(count == total-1) {
					f(total-1);
					if(okfun) {
						okfun();
					}
				} else {
					fcount++;
					ireCall(fcount);
					(new Ext.util.DelayedTask()).delay(500, function() {
						f(fcount);
					});
				}

			}, function (response, opts) {
				f(total-1);
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('失败', response.msg);
				}
			},false);
		}

		//调用
		//for (var i=0; i < slist.length; i++) {
		ireCall(fcount);

	} else {
		if(okfun) {
			okfun();
		}
	}
}

//传真纸Menu用
function faxpaperMenuClick(winType,nVal) {
	if(winType.pngGroup == 'sendfax') {
		//if(sendfaxwin.pngClass.getViewType() == 1) {
		var palBig = winType.down('#filepngviewBig');
		var imageList1 = palBig.query('image');
		Ext.Array.each(imageList1, function (item, index, allItems) {
			var imgItem = item.getEl();
			if(nVal != '0') {
				imgItem.dom.style.backgroundColor = 'transparent';
				imgItem.dom.style.backgroundImage = 'url('+WsConf.Url+'?req=rc&rcname=loadfaxpaper&type=big&fpid='+nVal+')';
				imgItem.dom.style.backgroundRepeat = 'no-repeat';
			} else {
				imgItem.dom.style.backgroundColor = '#FFFFFF';
				imgItem.dom.style.backgroundImage = 'none';
				imgItem.dom.style.backgroundRepeat = 'no-repeat';
			}

		});
		//} else {
		var palMini = winType.down('#filepngviewMini');
		var imageList = palMini.query('image');
		Ext.Array.each(imageList, function (item, index, allItems) {
			var imgItem = item.getEl();
			if(nVal != '0') {
				imgItem.dom.style.backgroundColor = 'transparent';
				imgItem.dom.style.backgroundImage = 'url('+WsConf.Url+'?req=rc&rcname=loadfaxpaper&type=mini&fileid=' + sendfaxwin.pngClass.getFaxFileId() + '&fpid='+nVal+')';
				imgItem.dom.style.backgroundRepeat = 'no-repeat';
			} else {
				imgItem.dom.style.backgroundColor = '#FFFFFF';
				imgItem.dom.style.backgroundImage = 'none';
				imgItem.dom.style.backgroundRepeat = 'no-repeat';
			}
		});
		//}

		if(nVal != '0') {
			winType.faxpaperid = nVal;

			var itemSelect;
			var paraStr;
			var str;
			var cpage=1;

			if(winType.pngClass.viewType == 1) {
				itemSelect = winType.pngClass.getPngContainerBig();
				paraStr = itemSelect.src.substr(itemSelect.src.indexOf('?') + 1, itemSelect.src.length);
				str = paraStr.split('&');
				cpage = str[3].split('=')[1];
				var param = {};
				param.sessiontoken = sessionToken;
				param.fileid = winType.pngClass.getFaxFileId();
				param.currpage=cpage;
				if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
					param.fpid = winType.faxpaperid;
				}

				WsCall.call('loadfitpng', param, function(response, opts) {
					var info = Ext.JSON.decode(response.data);
					winType.pngClass.getPngContainerBig().setSrc(WsConf.Url +info.url);
					palBig.setHeight(info.height +2);
					palBig.setWidth(info.width + 2);
					//resetMiniForFP(info.pages,winType);
				}, function(response, opts) {

				}, true);
			}

		} else {
			winType.faxpaperid = '0';
		}
		winType.down('#filepngviewrotateLeft').setDisabled(!(nVal=='0'));
		winType.down('#filepngviewrotateRight').setDisabled(!(nVal=='0'));
	}
}

// 得到收件箱未读记录数
function getIsReadCount(tstore, nodeId) {
	if(nodeId.indexOf('trwr') != -1) {	//他人委任收件箱 不需要获取未读记录数
		return;
	}
	if(nodeId != WaveFaxConst.RecycleFolderID && nodeId != WaveFaxConst.PublicRecycleFolderID) {
		var oldTree = getCurrTree();
		(new Ext.util.DelayedTask( function() {

				var cuTr = getCurrTree();
				if(oldTree !=  cuTr) {
					return;
				}
				var record = tstore.getNodeById(nodeId);
				if(!record) {
					return;
				}
				var text = record.data.text;
				var setT = text;
				if (text.indexOf('(') != -1) {
					setT = text.substring(0, text.indexOf('(')).replace(/\([^\(\)]+\)/g, '').replace(
					/<[^>]*>/g, '');
				}

				var param = {
					sessiontoken : getSessionToken(),
					folderid : nodeId,
					treename:cuTr.itemId
				};

				WsCall.call('getIsRead', param, function(response, opts) {
					if (response.data > 0 && !cuTr.collapsed) {
						record.set('text', '<b>' + setT + '(' + response.data + ')</b>');

					}
					if (response.data == 0 && !cuTr.collapsed) {
						record.set('text',  setT);
					}
					record.commit();
				}, function(response, opts) {
					//Ext.Msg.alert(response.msg);
				}, false);
			})).delay(1000);
	}
}

// 获取用户信息
function getUserData(okfun, errfun) {
	var flag = false;
	if(template) {
		if(!serverInfoDis && serverInfoModel&&serverInfoModel.data.formData == 0) {
			flag = true;
		}
	}
	var param = {
		sessiontoken : sessionToken,
		flag:flag
	};
	WsCall.call('getUserData', param, function(response, opts) {

		var info = Ext.JSON.decode(response.data);
		userInfoData = info.userInfo;
		if ((!info || !info.userConfig) && errfun)
			errfun();

		userConfig.gridPageSize = info.userConfig.gridPageSize;
		//userConfig.gridPageSize = 1;
		userConfig.countryCode = info.userConfig.countryCode;
		userConfig.areaCode = info.userConfig.areaCode;
		userConfig.autoReadSec = info.userConfig.autoReadSec;
		userConfig.outfaxreSec = info.userConfig.outfaxreSec;
		userConfig.listAll = info.userConfig.listAll; // 目录列出不可查看记录内容的文件夹
		userConfig.addSource = info.userConfig.addSource; // 回复传真时添加原文档
		userConfig.viewDocPic = info.userConfig.viewDocPic; // 表单数据输入界面显示文档图
		userConfig.validateFront = info.userConfig.validateFront; // 提交工作流任务前先确认

		userConfig.myUserName = info.userConfig.myUserName; // 帐户类型
		userConfig.myEmail = info.userConfig.myEmail; // 接收邮件服务器
		userConfig.sendService = info.userConfig.sendService; // 发送邮件服务器
		userConfig.mailUserName = info.userConfig.mailUserName; // 登录信息用户名
		userConfig.mailPassWord = info.userConfig.mailPassWord; // 登录信息密码

		userConfig.msgtaskallow = info.userConfig.msgtaskallow; // 是否开启计算机通报
		userConfig.msgtaskinterval = info.userConfig.msgtaskinterval; // 计算机通报间隔时间
		// 秒
		userConfig.msgboxkeeptime = info.userConfig.msgboxkeeptime; // 消息窗口保持时间,0为不自动关闭
		// 秒

		userConfig.scDetailSend = info.userConfig.scDetailSend;// 发送选项—提交到服务器暂不发送
		userConfig.scProLever = info.userConfig.scProLever;// 发送选项—优先级
		userConfig.scFailCount = info.userConfig.scFailCount;// 发送选项—失败重试次数
		userConfig.scStepMin = info.userConfig.scStepMin;// 发送选项—重试间隔
		// 秒
		userConfig.scMesReciver = info.userConfig.scMesReciver;// 发送选项—短信通知收件人
		userConfig.scMailReciver = info.userConfig.scMailReciver;// 发送选项—邮件通知收件人
		userConfig.scPageHeader = info.userConfig.scPageHeader;// 发送选项—添加页眉
		userConfig.scTryFist = info.userConfig.scTryFist;// 发送选项—失败重试从第一页开始
		userConfig.scResolution = info.userConfig.scResolution;// 发送选项—使用200x200分辨率发送传真
		userConfig.scUsedGroupPort = info.userConfig.scUsedGroupPort;// 发送选项—使用群发端口

		userConfig.secType = info.userConfig.secType;
		userConfig.connPort = info.userConfig.connPort;
		userConfig.miniPngSize = info.userConfig.minipngSize;
		if(info.userConfig.inruleConfig.length == 0) {	//规则设置
			userConfig.inruleConfig = info.userConfig.inruleConfig;		//收件箱个人传真接收规则
		} else {
			userConfig.inruleConfig = Ext.JSON.decode(info.userConfig.inruleConfig);
		}

		//userConfig.printerSrc = info.userConfig.printerSrc;

		if(flag) {
			//formData
			template.createTemplateMenu(Ext.JSON.decode(info.userConfig.formData));
		}

		if (okfun) {
			okfun();
		}

	}, function(response, opts) {
		Ext.getBody().unmask();
		// if(loginLoading && loginLoading.hide) {
		// loginLoading.hide();
		// }
		if (errfun)
			errfun();
	}, false);
}

// 获取共享目录权限
function getCommDirRole(nId, okFun) {
	var param = {
		sessiontoken : getSessionToken(),
		folderId : nId
	};
	WsCall.call('commDirRole', param, function(response, opts) {
		var type = Ext.JSON.decode(response.data);

		if (type.folderPrivList == 0) {
			// 对不起您不具有查看此目录的权限
			//var mainForm = Ext.getCmp('viewPortEast');
			var mesStr = "<div><img src='resources/images/toolbar/warning.png' style='margin-bottom: -4px;'>&nbsp;" +'对不起您不具有查看此目录的权限' + '</div>';
			southTb.down('#lblMessage').setText(mesStr);
		} else {
			//var mainForm1 = Ext.getCmp('viewPortEast');
			southTb.down('#lblMessage').setText('');
		}

		okFun(type);
	}, function() {
		okFun();
	});
}

// 获取共享父节点目录权限
function getParentCommDirRole(nIds, okFun) {
	var param = {
		sessiontoken : getSessionToken(),
		folderIds : nIds
	};
	WsCall.call('parentCommDirRole', param, function(response, opts) {
		var type = Ext.JSON.decode(response.data);

		if (type.folderPrivList == 0) {
			// 对不起您不具有查看此目录的权限
			//var mainForm = Ext.getCmp('viewPortEast');
			var mesStr = "<div><img src='resources/images/toolbar/warning.png' style='margin-bottom: -4px;'>&nbsp;" + '对不起您不具有查看此目录的权限' + '</div>';
			southTb.down('#lblMessage').setText(mesStr);
		} else {
			//var mainForm1 = Ext.getCmp('viewPortEast');
			southTb.down('#lblMessage').setText('');
		}

		okFun(type);
	}, function() {
		okFun();
	});
}

//计算输入与字节数
function getInputBytes(input) {
	var bytes = 0;
	for(var i=0;i<input.length; i++) {
		var code = input.charCodeAt(i);
		if(code <= 255) {
			bytes += 1;
		} else if(code > 255) {
			bytes += 3;
		}
	}
	return bytes;
}

//拼接view的title 即如: 个人/收件箱
function linkViewTitle(treeSeles, rootVisable,noCurTree) {
	//	var tree = grid.up('#viewPortEastID').down('#FolderTree');
	//alert(treeSeles[0].data.text);
	if(treeSeles[0] && treeSeles[0].parentNode) {
		var strReverse = new Array();
		var depth1 = treeSeles[0].getDepth();

		var parentRoot1 = treeSeles[0].parentNode;
		if(rootVisable) {
			for (var i = 0; i < depth1; i++) {
				strReverse.push(parentRoot1.data.text);
				parentRoot1 = parentRoot1.parentNode;
			}
		} else {
			for (var i = 1; i < depth1; i++) {
				strReverse.push(parentRoot1.data.text);
				parentRoot1 = parentRoot1.parentNode;
			}
		}

		strReverse = strReverse.reverse();
		var str = '';
		if (strReverse.length > 0) {
			str = strReverse.join("/") + "/" + treeSeles[0].data.text;
		} else {
			str = treeSeles[0].data.text;
		}
		if(noCurTree) {
			if(treeSeles[0].data.othertitle && treeSeles[0].data.othertitle != '') {
				return str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'')+'--'+treeSeles[0].data.othertitle;
			} else {
				return str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
			}

		} else {
			if(treeSeles[0].data.othertitle && treeSeles[0].data.othertitle != '') {
				return getCurrTree().title+'/'+str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'')+'--'+treeSeles[0].data.othertitle;
			} else {
				return getCurrTree().title+'/'+str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
			}

		}
	} else if(treeSeles && treeSeles.parentNode) {
		var strReverse = new Array();
		var depth1 = treeSeles.getDepth();

		var parentRoot1 = treeSeles.parentNode;
		if(rootVisable) {
			for (var i = 0; i < depth1; i++) {
				strReverse.push(parentRoot1.data.text);
				parentRoot1 = parentRoot1.parentNode;
			}
		} else {
			for (var i = 1; i < depth1; i++) {
				strReverse.push(parentRoot1.data.text);
				parentRoot1 = parentRoot1.parentNode;
			}
		}

		strReverse = strReverse.reverse();
		var str = '';
		if (strReverse.length > 0) {
			str = strReverse.join("/") + "/" + treeSeles.data.text;
		} else {
			str = treeSeles.data.text;
		}

		if(noCurTree) {
			if(treeSeles[0].data.othertitle && treeSeles[0].data.othertitle != '') {
				return str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'')+'--'+treeSeles[0].data.othertitle;
			} else {
				return str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
			}

		} else {
			if(treeSeles[0].data.othertitle && treeSeles[0].data.othertitle != '') {
				return getCurrTree().title+'/'+str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'')+'--'+treeSeles[0].data.othertitle;
			} else {
				return getCurrTree().title+'/'+str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
			}
			//return getCurrTree().title+'/'+str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
		}

	}
}

function linkViewTitle1(treeSeles) {
	//	var tree = grid.up('#viewPortEastID').down('#FolderTree');
	//alert(treeSeles[0].data.text);
	if(treeSeles[0] && treeSeles[0].parentNode) {
		var strReverse = new Array();
		var depth1 = treeSeles[0].getDepth();

		var parentRoot1 = treeSeles[0];
		for (var i = depth1; i > 1; i--) {
			strReverse.push(parentRoot1.data.text);
			parentRoot1 = parentRoot1.parentNode;
		}
		strReverse = strReverse.reverse();
		var str = '';
		if (strReverse.length > 0) {
			if(parentRoot1.data.text.indexOf('个人') != -1)
				str = strReverse.join("/");
			else
				str = parentRoot1.data.text+"/"+ strReverse.join("/");
		}
		return str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
	}
}

function linkViewTitle2(treeSeles) {
	//	var tree = grid.up('#viewPortEastID').down('#FolderTree');
	//alert(treeSeles[0].data.text);
	if(treeSeles[0] && treeSeles[0].parentNode) {
		var strReverse = new Array();
		var depth1 = treeSeles[0].getDepth();

		var parentRoot1 = treeSeles[0];
		for (var i = depth1; i > 0; i--) {
			strReverse.push(parentRoot1.data.text);
			parentRoot1 = parentRoot1.parentNode;
		}
		strReverse = strReverse.reverse();
		var str = '';
		if (strReverse.length > 0) {
			if(parentRoot1.data.text.indexOf('文档管理') != -1)
				str = strReverse.join("/");
			else
				str = parentRoot1.data.text+"/"+ strReverse.join("/");
		}
		return str.replace(/\([^\(\)]+\)/g,'').replace(/<[^>]*>/g,'');
	}
}

//根据record拼接目录路径
function linkFolderText(rec) {
	var dirText = '';
	var strReverse = new Array();
	var depth1 = rec.getDepth();
	var parentRoot1 = rec.parentNode;
	for (var i = 0; i < depth1; i++) {
		strReverse.push(parentRoot1.data.text);
		parentRoot1 = parentRoot1.parentNode;
	}
	strReverse = strReverse.reverse();
	if (strReverse.length > 0) {
		dirtext = strReverse.join("/") + "/" + rec.data.text;
	} else {
		dirtext = rec.data.text;
	}
	return dirtext;
}

//修改过滤条件的状态
function modActionStates(grid, disabled) {
	var name = grid.itemId.toLowerCase();
	if(name == 'succoutfaxgrid') {
		grid.down('#suctimeID').setDisabled(disabled);
		grid.down('#sucstatusID').setDisabled(disabled);
		grid.down('#sucfaxFlagID').setDisabled(disabled);
		grid.down('#sucfaxTypeID').setDisabled(disabled);
		return;
	}
	if(name == 'outfaxgrid') {
		grid.down('#statusID').setDisabled(disabled);
		return;
	}
	if(name == 'infaxgrid' || name == 'docgrid') {
		grid.down('#menuID').setDisabled(disabled);
		grid.down('#faxFlagID').setDisabled(disabled);
		grid.down('#faxTypeID').setDisabled(disabled);
		return;
	}

	if(name == 'taskgrid') {
		grid.down('#menuID').setDisabled(disabled);
		grid.down('#wfstatusID').setDisabled(disabled);
		grid.down('#wfRuleType').setDisabled(disabled);
		return;
	}
}

//加载工具栏配置按钮
function loadtoolbtnSet(me,infax_tbtnSetMenu) {
	var infax_tArr = [];
	Ext.Array.each(me.items.items, function(item,index,alls) {
		if(item.xtype=='button' || item.xtype=='searchfield') {
			infax_tArr.push(item.itemId);
		}
	});
	//var mTmp = [];
	Ext.Array.each(infax_tArr, function(item,index,alls) {
		var tmp = me.down('#'+item);
		infax_tbtnSetMenu.add({
			itemId:'t'+item,
			text:tmp.text,
			checked:true,
			listeners: {
				checkchange: function(cb,checked,eOpts ) {
					tmp.setVisible(checked);
					//保存按钮状态
					if(myStates) {
						//保存变量并上传
						myStates.faxtoolBtn[item] = checked;
						var tmpS = myStates.faxtoolBtn;
						wsUserStates.setServerState('faxtoolBtn',tmpS);
					}

					//重置分隔符状态
					var newArr = [];
					Ext.Array.each(me.items.items, function(item,index,alls) {
						if(!item.hidden || item.xtype == 'tbseparator')
							newArr.push(item);
					});
					Ext.Array.each(newArr, function(item,index,alls) {

						var frontItem =item;

						var count = index+1;
						if(count >= alls.length) {
							return false;
						}
						var behindItem = alls[count];

						if(frontItem.xtype == 'tbseparator' && behindItem.xtype == 'tbseparator') {
							frontItem.setVisible(false);
							behindItem.setVisible(false);
						}
						if(frontItem.xtype != 'tbseparator' &&behindItem.xtype == 'tbseparator') {
							behindItem.setVisible(true);
						}
						if(frontItem.xtype == 'tbseparator' && behindItem.xtype != 'tbseparator') {
							frontItem.setVisible(true);
						}
					});
				}
			}
		});
	});
	me.add({
		arrowAlign:'bottom',
		height:20,
		itemId:'toolsBtnSet',
		tooltip: '工具条设置',
		menu:[{
			text:'添加/删除按钮',
			menu: infax_tbtnSetMenu
		}],
		listeners: {
			afterrender: function(com) {
				//读取服务器状态设置其选择
				if(myStates.faxtoolBtn) {
					for (key in myStates.faxtoolBtn) {
						if(!infax_tbtnSetMenu.down('#t'+key) || key == 'stateSaved')
							continue;
						infax_tbtnSetMenu.down('#t'+key).setChecked(myStates.faxtoolBtn[key]);
					}
				}

			}
		}
	});
}

var flexJoint_delay = new Ext.util.DelayedTask();

function setFlexJoint(me,adjWidth) {
	flexJoint_delay.cancel();
	flexJoint_delay.delay(500, function() {

		var sBtn = northTb.down('#sendfax').getWidth();
		var cBtn = northTb.down('#configer').getWidth();
		var rBtn = northTb.down('#receive').getWidth();

		var lPalWidth = sBtn+cBtn+rBtn+40*3+20;
		//alert(lPalWidth);
		var width1 = me.up('#viewPortEastID').down('#centerView').getWidth() - lPalWidth;
		width1 = width1 < 0?1:width1;
		if((width1+lPalWidth+198) > northTb.getWidth()) {
			width1 -= lPalWidth;
		}
		width1 = width1 < 0?1:width1;
		northTb.down('#gridTitle').setWidth(width1);

		var width = adjWidth - 198;
		width = width<0?1:width;
		var gwidht = northTb.down('#gridTitle').getWidth();

		if((width+lPalWidth+gwidht+198) > northTb.getWidth()) {
			width -= (lPalWidth+gwidht);
		}
		width = width<0?1:width;
		northTb.down('#flexJoint').setWidth(width);
	});
}

function myTextValidator(value,maxlength,minlength,fix) {
	if(fix) {
		if(getInputBytes(value) != maxlength) {
			var tpl = new Ext.Template('输入字符长度不符合要求,中文长度固定为: {0}, 英文长度固定为: {1}');
			return tpl.apply([parseInt(maxlength/3),maxlength]);
		}
	}

	if(maxlength) {
		if(getInputBytes(value) > maxlength) {
			var tpl = new Ext.Template('输入字符长度超过限制,中文长度: {0}, 英文长度: {1}');
			return tpl.apply([parseInt(maxlength/3),maxlength]);
		}
	}
	if(minlength) {
		if(getInputBytes(value) < minlength) {
			var tpl = new Ext.Template('输入字符长度不足,中文长度: {0}, 英文长度: {1}');
			return tpl.apply([parseInt(minlength/3),minlength]);
		}
	}

	return true;
}