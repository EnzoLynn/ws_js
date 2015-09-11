//保存图章
function sendSStamp(noClose,winType) {

	var slist = new Array();

	stampcls.getStampList().each( function(item,index,allitems) {
		var temp;
		//图片图章
		if(item.stype == 0) {
			if(item.coverAll) {
				for(var i =1;i<=winType.pngClass.getCurrFaxFileTotal();i++) {
					temp = {
						curpage:i,
						stampId:item.stampId,
						cX:item.cX,
						cY:item.cY,
						stype:item.stype
					};
					slist.push(temp);
				}
			} else {
				temp = {
					curpage:item.currPage,
					stampId:item.stampId,
					cX:item.cX,
					cY:item.cY,
					stype:item.stype
				};
				slist.push(temp);
			}
			if(winType.pngGroup == 'wfhandlerwin') {
				//winType.hadEdit= true;
				var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
				tmp.hadStamp= true;
			}
		}
		//文字图章
		if(item.stype == 1) {
			temp = {
				curpage:item.currPage,
				cX:item.cX,
				cY:item.cY,
				stype:item.stype,
				fontName:item.fontName,
				fontSize:item.fontSize,//字体大小
				fontColor:item.fontColor,//字体颜色
				isBold:item.isBold,//粗体
				isItalic:item.isItalic,//斜体
				isUnderLine:item.isUnderLine,//下划线
				isStrikeOut:item.isStrikeOut,//删除线
				content:item.content,//文字内容
				bgColor:item.bgColor,//背景颜色 白色透明
				width:item.width,
				height:item.height
			};
			slist.push(temp);
			if(winType.pngGroup == 'wfhandlerwin') {
				var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
				tmp.hadEdit= true;
				//winType.hadStamp= true;
			}
		}

		//手画线
		if(item.stype == 2) {
			var absNum = {
				x:0,
				y:0
			};
			var minX = 10000;
			var minY = 10000;
			Ext.Array.each(item.pointArr, function(point,index,all) {
				if(point.x < minX) {
					minX = point.x;
				}
				if(point.y < minY) {
					minY = point.y;
				}
			})
			absNum.x = minX - item.cX;
			absNum.y = minY- item.cY;

			Ext.Array.each(item.pointArr, function(point,index,all) {
				point.x -= absNum.x;
				point.y -= absNum.y;
			})
			temp = {
				curpage:item.currPage,
				cX:item.cX,
				cY:item.cY,
				stype:item.stype,
				penColor:item.penColor,
				penWidth:item.penWidth,
				path:Ext.JSON.encode(item.pointArr),
				width:item.width,
				height:item.height
			};
			slist.push(temp);
			if(winType.pngGroup == 'wfhandlerwin') {
				var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
				tmp.hadEdit= true;
				//winType.hadStamp= true;
			}
		}

		//直线
		if(item.stype == 3) {
			var absNum = {
				x:0,
				y:0
			};
			var minX;
			var minY;
			if(item.pointArr[0].x > item.pointArr[item.pointArr.length-1].x) {
				minX = item.pointArr[item.pointArr.length-1].x;
			} else {
				minX = item.pointArr[0].x;
			}

			absNum.x = minX - item.cX;
			if(item.pointArr[0].y > item.pointArr[item.pointArr.length-1].y) {
				minY = item.pointArr[item.pointArr.length-1].y;
			} else {
				minY = item.pointArr[0].y;
			}
			absNum.y = minY- item.cY;

			Ext.Array.each(item.pointArr, function(point,index,all) {
				point.x -= absNum.x;
				point.y -= absNum.y;
			})
			temp = {
				curpage:item.currPage,
				cX:item.cX,
				cY:item.cY,
				stype:item.stype,
				penColor:item.penColor,
				penWidth:item.penWidth,
				path:Ext.JSON.encode(item.pointArr),
				width:item.width,
				height:item.height
			};
			slist.push(temp);
			if(winType.pngGroup == 'wfhandlerwin') {
				var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
				tmp.hadEdit= true;
				//winType.hadStamp= true;
			}
		}

	});
	//Ext.Msg.alert('',Ext.JSON.encode(slist));
	//调用盖章接口
	var prStamp = newMesB.show({
		title: '保存批注',
		iconCls:'coverStamp',
		msg: '请稍候...',
		progressText: '正在保存...',
		width:300,
		progress:true,
		closable:false
	});
	// this hideous block creates the bogus progress
	var f = function(v) {
		var cV = v+1;
		if(cV == slist.length) {
			var i = cV/slist.length;
			prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
			(new Ext.util.DelayedTask()).delay(2000, function() {
				prStamp.hide();
				if(!noClose) {
					showFlash(winType);
				}
			});
		} else {
			var i = cV/slist.length;
			prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
		}
	};
	//调用
	function ireSStamps(sst,count) {
		var param = {};
		//param.currpage = me.getTargetView().down('#txtCurrPage').getValue();
		//alert(sst);
		var tempList = new Array();
		tempList.push(sst);
		param.stamplist = Ext.JSON.encode(tempList);
		//alert(Ext.JSON.encode(tempList));
		param.fileid = stampcls.fileId;
		param.sessiontoken = sessionToken;
		WsCall.call('savestamps', param, function (response, opts) {
			sendfaxwin.edit = true;	//有对传真文件进行编辑
			//最后1次调用后清空数据
			if(count == slist.length-1) {
				if(winImageEditor != '' && !noClose) {
					winImageEditor.isSaveStamp = true;
					winImageEditor.close();
				} else {//保存按钮
					winImageEditor.isSaveStamp = true;
					stampcls.getStampList().eachKey( function(item) {
						//alert(item);
						var curSel = winImageEditor.down('#'+item+'');
						winImageEditor.remove(curSel);
						//curSel.destory();
					});
					stampcls.getSelList().clear();
					winImageEditor.fireEvent('beforedestroy',winImageEditor,true);
					winImageEditor.fireEvent('destroy',winImageEditor,true);
					var palPng = winImageEditor.down('#currImage');
					var srcStr = palPng.src;
					if (srcStr.search("&randomTime") >= 0) {
						srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
					}
					palPng.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());

					//winImageEditor.fireEvent('show',winImageEditor);
				}
				//设置stampclass 初始值
				stampcls = new stampclass();
				if(noClose) {
					stampcls.fileId = winType.pngClass.getFaxFileId();
				}
				stampcls.getStampList().clear();

				if(winType.pngClass.getViewType() == 1) {
					var srcStr = winType.pngClass.getPngContainerBig().src;
					if (srcStr.search("&randomTime") >= 0) {
						srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
					}
					winType.pngClass.getPngContainerBig().setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
				}

				//刷新对应的图片
				winType.pngClass.getPngAllMini().each( function (item, index, allItems) {
					var srcStr = item.src;
					if (srcStr.search("&randomTime") >= 0) {
						srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
					}
					item.setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
				});
				//&randomTime"+(new Date()).getTime()
				//var bigImage = sendfaxwin.down('#filepngviewBig').down('image');
				(new Ext.util.DelayedTask()).delay(500, function() {
					f(count);
				});
			} else {
				f(count);
				count++;
				ireSStamps(slist[count],count);
			}

		}, function (response, opts) {
			f(slist.length-1);
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('失败', response.msg);
			}
		},false);
	}

	//调用
	//for (var i=0; i < slist.length; i++) {
	ireSStamps(slist[0],0);
	//};

}

//图章图层
Ext.define('MySignetClass', {
	isDrag: false,
	offsetLeft: 0,
	offsetTop: 0,
	width: 0,
	height: 0,
	isBorder:false,
	isResize:false,
	resType:'se',
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
//图章类
Ext.define('stampclass', {
	config: {
		haveStamp:false,//是否加载了图章
		haveDraw:false,//是否正在使用画笔
		haveLine:false,//是否正在使用直线
		isDrawing:false,//是否画
		stampList: new Ext.util.MixedCollection(),//加盖的图章信息 (key,value) key:Ext.id() value:{stampId:1,cX:100,cY:100}
		fileId:0,//目标文件id
		currPage:0,//目标文件页码
		selList:new Ext.util.MixedCollection()//选中的已有图章移动层
	},
	constructor: function (cfg) {
		this.initConfig(cfg);
	}
});

//画笔类
Ext.define('penDrawclass', {
	config: {
		minX:10000,
		minY:10000,
		maxX:0,
		maxY:0
	},
	constructor: function (cfg) {
		this.initConfig(cfg);
	}
});

function htmlFormat(html) {
	var eN = /\n|\r/g;
	html = html.replace(eN,'');
	var style = /<style.*<\/style>/gi;
	html = html.replace(style,'');
	var wN = /<w:[^>]*>.*<\/w:[^>]*>/gi;
	html = html.replace(wN,'');
	var pN = /<\/p>/gi;
	html = html.replace(pN,'<br\/>');
	var regex =   /<(?!br)[^>]*\/*>/gi;
	html = html.replace(regex,'');
	return html;
}

//根据stampTemp  生成html内容
function creatHtmlByStt(stt,html,curSel) {

	html = htmlFormat(html);

	if(!stt.isBold) {
		regex = /<\/*b>/g;
		html = html.replace(regex,'');
	} else {
		html = "<b>" + html +"</b>";
	}
	if(!stt.isItalic) {
		regex = /<\/*i>/g;
		html = html.replace(regex,'');
	} else {
		html = "<i>" + html +"</i>";
	}
	if(!stt.isUnderLine) {
		regex = /<\/*u>/g;
		html = html.replace(regex,'');
	} else {
		html = "<u>" + html +"</u>";
	}
	if(!stt.isStrikeOut) {
		regex = /<\/*del>/g;
		html = html.replace(regex,'');
	} else {
		html = "<del>" + html +"</del>";
	}
	if(curSel) {
		if(stt.bgColor == 'transparent') {
			curSel.getEl().setStyle({
				'background-color':'transparent'
			});
		} else {
			curSel.getEl().setStyle({
				'background-color':''+stt.bgColor+''
			});
		}

	}
	html = "<pre style='background-color:"+stt.bgColor+";color:"+stt.fontColor+";font-family:"+stt.fontName+";font-size:"+stt.fontSize+"px;line-height:"+stt.fontSize+"px;'>"+html+"</pre>";
	return html;
}

//图章序列
//var stampClsArr = new Ext.util.MixedCollection();

//imageEditor ActionBase
Ext.define('WS.tbnorth.imageEditor', {
	extend: 'WS.action.Base',
	category: 'imageEditor',
	getWinType: function() {
		return this.getTargetView().winType;
	}
});

//向左翻转
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditorrotateLeft',
	tooltip: '向左翻转',
	//text: '向左翻转',
	iconCls: 'faxPngRotateLeft',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getWinType();

		if(winType.pngGroup == 'wfhandlerwin') {
			var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
			tmp.hadEdit= true;
			//winType.hadStamp= true;
		}
		//alert(pngSelBig.first().src);
		//更新当前选择的大图，重设大图src,loadfitpng
		var curSrc = me.getTargetView().down('#currImage').src;
		var paraStr = curSrc.substr(curSrc.indexOf('?') + 1, curSrc.length);
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
			var srcStr = curSrc;
			if (srcStr.search("&randomTime") >= 0) {
				srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
			}
			me.getTargetView().down('#currImage').setSrc(srcStr + "&randomTime=" + (new Date()).getTime());

			if(winType.pngClass.getPngContainerBig() != '' && winType.pngClass.getPngContainerBig().setSrc) {
				var srcStr1 = winType.pngClass.getPngContainerBig().src;
				if (srcStr1.search("&randomTime") >= 0) {
					srcStr1 = srcStr1.substring(0, srcStr1.lastIndexOf('&'));
				}
				if(srcStr1 == srcStr) {
					var palPng = winType.down('#filepngviewBig');
					palPng.setHeight(winType.pngClass.getPngContainerBig().getWidth() +2);
					palPng.setWidth(winType.pngClass.getPngContainerBig().getHeight() +2);
					winType.pngClass.getPngContainerBig().setSrc(srcStr1 + "&randomTime=" + (new Date()).getTime());
				}

			}
			if(winType.pngClass.getPngSelBig().first()) {
				winType.pngClass.getPngSelBig().first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
			}
		}, function (response, opts) {
			Ext.Msg.alert('翻转失败', response.msg);
		}, true);
	},
	updateStatus: function (totoalPage, currPage) {
		var winType = this.getWinType();
		if(winType.faxpaperid&&winType.faxpaperid != '0') {
			this.setDisabled(true);
		} else {
			this.setDisabled(false);
		}

	}
});

//向右翻转
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditorrotateRight',
	tooltip: '向右翻转',
	//text: '向右翻转',
	iconCls: 'faxPngRotateRight',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getWinType();
		if(winType.pngGroup == 'wfhandlerwin') {
			var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
			tmp.hadEdit= true;
			//winType.hadStamp= true;
		}
		//更新当前选择的大图，重设大图src,loadfitpng
		var curSrc = me.getTargetView().down('#currImage').src;
		var paraStr = curSrc.substr(curSrc.indexOf('?') + 1, curSrc.length);
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
			var srcStr = curSrc;
			if (srcStr.search("&randomTime") >= 0) {
				srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
			}
			me.getTargetView().down('#currImage').setSrc(srcStr + "&randomTime=" + (new Date()).getTime());

			if(winType.pngClass.getPngContainerBig() != '' && winType.pngClass.getPngContainerBig().setSrc) {
				var srcStr1 = winType.pngClass.getPngContainerBig().src;
				if (srcStr1.search("&randomTime") >= 0) {
					srcStr1 = srcStr1.substring(0, srcStr1.lastIndexOf('&'));
				}
				if(srcStr1 == srcStr) {
					var palPng = winType.down('#filepngviewBig');
					palPng.setHeight(winType.pngClass.getPngContainerBig().getWidth() +2);
					palPng.setWidth(winType.pngClass.getPngContainerBig().getHeight() +2);
					winType.pngClass.getPngContainerBig().setSrc(srcStr1 + "&randomTime=" + (new Date()).getTime());
				}
			}
			if(winType.pngClass.getPngSelBig().first()) {
				winType.pngClass.getPngSelBig().first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
			}
		}, function (response, opts) {
			Ext.Msg.alert('翻转失败', response.msg);
		}, true);
	},
	updateStatus: function (totoalPage, currPage) {
		var winType = this.getWinType();
		if(winType.faxpaperid&&winType.faxpaperid != '0') {
			this.setDisabled(true);
		} else {
			this.setDisabled(false);
		}
	}
});

//上下翻转
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditoroverturn',
	tooltip: '上下翻转',
	//text: '上下翻转',
	iconCls: 'faxPngFlip',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getWinType();
		if(winType.pngGroup == 'wfhandlerwin') {
			var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
			tmp.hadEdit= true;
			//winType.hadStamp= true;
		}
		//更新当前选择的大图，重设大图src,loadfitpng
		var curSrc = me.getTargetView().down('#currImage').src;
		var paraStr = curSrc.substr(curSrc.indexOf('?') + 1, curSrc.length);
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
			var srcStr = curSrc;
			if (srcStr.search("&randomTime") >= 0) {
				srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
			}
			me.getTargetView().down('#currImage').setSrc(srcStr + "&randomTime=" + (new Date()).getTime());
			if(winType.pngClass.getPngContainerBig() != '' && winType.pngClass.getPngContainerBig().setSrc) {
				var srcStr1 = winType.pngClass.getPngContainerBig().src;
				if (srcStr1.search("&randomTime") >= 0) {
					srcStr1 = srcStr1.substring(0, srcStr1.lastIndexOf('&'));
				}
				if(srcStr1 == srcStr) {
					winType.pngClass.getPngContainerBig().setSrc(srcStr1 + "&randomTime=" + (new Date()).getTime());
				}

			}
			if(winType.pngClass.getPngSelBig().first()) {
				winType.pngClass.getPngSelBig().first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
			}
		}, function (response, opts) {
			Ext.Msg.alert('翻转失败', response.msg);
		}, true);
	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(false);
	}
});

//首页  imageEditor
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditorfistPage',
	tooltip: '首页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getWinType();
		me.getTargetView().down('#txtCurrPage').setValue(1);
		stampcls.getStampList().each( function(item,index,allits) {
			if(item.currPage == 1 || item.coverAll) {
				me.getTargetView().down('#'+item.keyId).show();
				return;
			}
			me.getTargetView().down('#'+item.keyId).hide();
		});
		var palPng = me.getTargetView().down('#currImage');

		var param = {};
		param.sessiontoken = sessionToken;
		param.fileid = winType.pngClass.getFaxFileId();
		param.currpage=1;
		param.load = true;

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			palPng.setSrc(WsConf.Url +info.url);

		}, function(response, opts) {

		}, true);
		//设置按钮状态
		ActionBase.updateActions('imageEditor', winType.pngClass.getTotalCount(),1);
	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage==1);
	}
});
//上一页 imageEditor
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditorprePage',
	tooltip: '上一页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getWinType();
		var oVal = me.getTargetView().down('#txtCurrPage').getValue();
		oVal--;
		if (oVal > 0) {
			me.getTargetView().down('#txtCurrPage').setValue(oVal);
			stampcls.getStampList().each( function(item,index,allits) {
				if(item.currPage == oVal || item.coverAll) {
					me.getTargetView().down('#'+item.keyId).show();
					return;
				}
				me.getTargetView().down('#'+item.keyId).hide();
			});
			var palPng = me.getTargetView().down('#currImage');

			var param = {};
			param.sessiontoken = sessionToken;
			param.fileid = winType.pngClass.getFaxFileId();
			param.currpage=oVal;
			param.load = true;
			if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
				param.fpid = winType.faxpaperid;
			}

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				palPng.setSrc(WsConf.Url +info.url);

			}, function(response, opts) {

			}, true);
			//设置按钮状态
			ActionBase.updateActions('imageEditor', winType.pngClass.getTotalCount(),oVal);
		}

	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage<=1);
	}
});
//下一页 imageEditor
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditornextPage',
	tooltip: '下一页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getWinType();
		var oVal = me.getTargetView().down('#txtCurrPage').getValue();
		oVal++;
		if (oVal <= winType.pngClass.getCurrFaxFileTotal()) {
			me.getTargetView().down('#txtCurrPage').setValue(oVal);
			stampcls.getStampList().each( function(item,index,allits) {
				if(item.currPage == oVal || item.coverAll) {
					me.getTargetView().down('#'+item.keyId).show();
					return;
				}
				me.getTargetView().down('#'+item.keyId).hide();
			});
			var palPng = me.getTargetView().down('#currImage');

			var param = {};
			param.sessiontoken = sessionToken;
			param.fileid = winType.pngClass.getFaxFileId();
			param.currpage=oVal;
			param.load = true;
			if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
				param.fpid = winType.faxpaperid;
			}

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				palPng.setSrc(WsConf.Url +info.url);

			}, function(response, opts) {

			}, true);
			//设置按钮状态
			ActionBase.updateActions('imageEditor', winType.pngClass.getTotalCount(),oVal);
		}

	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage>=parseInt(totoalPage));
	}
});
//尾页  imageEditor
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditorlastPage',
	tooltip: '尾页',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var winType = me.getWinType();
		me.getTargetView().down('#txtCurrPage').setValue(winType.pngClass.getCurrFaxFileTotal());

		stampcls.getStampList().each( function(item,index,allits) {
			if(item.currPage == winType.pngClass.getCurrFaxFileTotal() || item.coverAll) {
				me.getTargetView().down('#'+item.keyId).show();
				return;
			}
			me.getTargetView().down('#'+item.keyId).hide();
		});
		var palPng = me.getTargetView().down('#currImage');

		var param = {};
		param.sessiontoken = sessionToken;
		param.fileid = winType.pngClass.getFaxFileId();
		param.currpage=winType.pngClass.getCurrFaxFileTotal();
		param.load = true;
		if(winType.pngGroup == 'sendfax' && winType.faxpaperid && winType.faxpaperid != '0') {
			param.fpid = winType.faxpaperid;
		}

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			palPng.setSrc(WsConf.Url +info.url);

		}, function(response, opts) {

		}, true);
		//设置按钮状态
		ActionBase.updateActions('imageEditor', winType.pngClass.getTotalCount(),winType.pngClass.getCurrFaxFileTotal());

	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage==parseInt(totoalPage));
	}
});

//图片编辑器toolbar bottom

//图片编辑器toolbar top
Ext.define('ws.tbnorth.tbfilepngviewEditor', {
	alias: 'widget.tbfilepngviewEditor',
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: ['tbfilepngviewEditor'],
	itemId: 'tbfilepngviewEditor',
	initComponent : function() {
		var me = this;
		me.callParent(arguments);	// 调用父类方法

		//加载图章列表grid
		var store = Ext.StoreMgr.lookup('coverimagegridStoreId');
		var sessiontoken = store.getProxy().extraParams.sessiontoken = sessionToken;
		if(!sessiontoken || sessiontoken.length ==0) {
			//sessiontoken 无效 重新登陆
			if(win && win.isHidden()) {
				win.show();
			}
		}
		var menu = me.down('#coverimage').menu;
		var menu1 = me.down('#coverfont').menu;

		store.load( function(records, operation, success) {
			if(success) {
				for (var i=0; i < records.length; i++) {
					menu.insert(0, {
						text:records[i].data.stampName,
						stampId:records[i].data.stampID,
						xtype: 'menucheckitem',
						group:'imgstamp',
						listeners: {
							click: function(btn,e,opts) {
								//设置装状态
								stampcls.setHaveStamp(true);
								stampcls.setIsDrawing(false);
								stampcls.setHaveLine(false);
								stampTemp = {
									stampId:btn.stampId,
									cX:0,
									cY:0,
									coverAll:false,
									currPage:0,
									stype:0,
									keyId:''
								};
								me.down('#disStampName').setValue(btn.text);
								me.down('#coverimage').toggle(true);
								//alert(btn.stampId);
							}
						}
					});

				};
			}

		});
	},
	items: [ActionBase.getAction('imageEditorrotateLeft'),
	"-", ActionBase.getAction('imageEditorrotateRight'),
	"-", ActionBase.getAction('imageEditoroverturn'),ActionBase.getAction('imageEditorfistPage'),
	ActionBase.getAction('imageEditorprePage'),
	"-",{
		xtype: 'label',
		text: '页数'
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
		value: 1,
		listeners: {
			blur: function (com, opts) {
				var me = this;
				var winType = me.up('window').winType;
				winImageEditor.down('#txtCurrPage').setValue(com.getValue());
				stampcls.getStampList().each( function(item,index,allits) {
					if(item.currPage == com.getValue() || item.coverAll) {
						winImageEditor.down('#'+item.keyId).show();
						return;
					}
					winImageEditor.down('#'+item.keyId).hide();
				});
				winImageEditor.down('#currImage').setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + winType.pngClass.getFaxFileId() + "&currpage=" + com.getValue() + "");
				//设置按钮状态
				ActionBase.updateActions('imageEditor', winType.pngClass.getTotalCount(),com.getValue());

			},
			change: function (com, nVal, oVal, opts) {
				var me = this;
				var winType = me.up('window').winType;
				if(!winType) {
					return;
				}
				if ((nVal > winType.pngClass.getCurrFaxFileTotal() && nVal != '1') || nVal < 1) {
					//alert('输入的页码超过了总页数！');
					if (oVal == winType.pngClass.getCurrFaxFileTotal()) {
						ActionBase.getAction('imageEditornextPage').setDisabled(true);
						ActionBase.getAction('imageEditorlastPage').setDisabled(true);
					} else {
						ActionBase.getAction('imageEditornextPage').setDisabled(false);
						ActionBase.getAction('imageEditorlastPage').setDisabled(false);
					}
					if (oVal == '1') {
						ActionBase.getAction('imageEditorfistPage').setDisabled(true);
						ActionBase.getAction('imageEditorprePage').setDisabled(true);
					} else {
						ActionBase.getAction('imageEditorfistPage').setDisabled(false);
						ActionBase.getAction('imageEditorprePage').setDisabled(false);
					}
					com.setValue(oVal);

				} else {
					if (nVal == winType.pngClass.getCurrFaxFileTotal()) {
						ActionBase.getAction('imageEditornextPage').setDisabled(true);
						ActionBase.getAction('imageEditorlastPage').setDisabled(true);
					} else {
						ActionBase.getAction('imageEditornextPage').setDisabled(false);
						ActionBase.getAction('imageEditorlastPage').setDisabled(false);
					}
					if (nVal == '1') {
						ActionBase.getAction('imageEditorfistPage').setDisabled(true);
						ActionBase.getAction('imageEditorprePage').setDisabled(true);
					} else {
						ActionBase.getAction('imageEditorfistPage').setDisabled(false);
						ActionBase.getAction('imageEditorprePage').setDisabled(false);
					}

				}

			} //change
		}

	},{
		itemId: 'tbPageTotal',
		xtype: 'label',
		text: '共'+'   0'
	}, "&nbsp&nbsp&nbsp", "-", ActionBase.getAction('imageEditornextPage'),
	ActionBase.getAction('imageEditorlastPage'),'-',{
		itemId: 'coverimage',
		text:'加盖图章',
		tooltip: '加盖图章',
		iconCls:'coverStamp',
		xtype:'splitbutton',
		arrowAlign: 'right',
		enabletoggle:true,
		toggleGroup:'stampCover',
		menu :['-',{
			text: '查看图章',
			handler: function() {
				if(coverimgaegridwin == '') {
					coverimgaegridwin = loadcoverimgaegridwin();
				}
			}
		}],
		listeners: {
			click: function(btn,e,opts) {
				var me = this;
				var checkMenuItems = me.menu.items;
				var flag = false;
				var firstItem;
				checkMenuItems.each( function(item,index,allitems) {
					firstItem = item;
					if(item.checked) {
						item.fireEvent('click',item);
						btn.toggle(true);
						flag =true;
					}
				});
				if(!flag && firstItem) {
					if(firstItem.text == "查看图章") {
						btn.toggle(false);
						btn.fireEvent('arrowclick',btn,e);
						btn.showMenu();
					}
				}

			}
		}
	},{
		itemId: 'coverfont',
		tooltip: '文字批注',
		text:'文字批注',
		iconCls:'coverFont',
		xtype:'button',
		arrowAlign: 'right',
		enabletoggle:true,
		toggleGroup:'stampCover',
		listeners: {
			click: function(btn,e,opts) {
				var me = this;
				btn.toggle(true);
				//设置装状态
				stampcls.setHaveStamp(true);
				stampcls.setIsDrawing(false);
				stampcls.setHaveLine(false);

				if(preSTemp == '') {
					stampTemp = {
						stampId:btn.stampId,
						cX:0,
						cY:0,
						//coverAll:false,
						currPage:0,
						stype:1,
						fontName:'Tahoma',//字体名
						fontSize:'22',//字体大小
						fontColor:'#000000',//字体颜色
						isBold:false,//粗体
						isItalic:false,//斜体
						isUnderLine:false,//下划线
						isStrikeOut:false,//删除线
						content:'',//文字内容
						bgColor:'transparent',//背景颜色 白色透明
						width:150,
						height:50,
						keyId:''
					};
				} else {
					stampTemp = preSTemp;
					stampTemp.stampId=btn.stampId;
					stampTemp.cX=0;
					stampTemp.cY=0;
					stampTemp.currPage=0;
					stampTemp.stype=1;
					stampTemp.content='';//文字内容
					stampTemp.width=150;
					stampTemp.height=50;
					stampTemp.keyId='';
				}

				me.up('window').down('#disStampName').setValue('文字批注');
			}
		}

	},{
		itemId: 'coverline',
		tooltip: '手画线',
		text:'手画线',
		iconCls:'coverSLine',
		//disabled:true,
		//iconCls:'coverFont',
		xtype:'button',
		//arrowAlign: 'right',
		enabletoggle:true,
		toggleGroup:'stampCover',
		listeners: {
			click: function(btn,e,opts) {
				var me = this;
				btn.toggle(true);
				//设置装状态
				stampcls.setHaveStamp(true);
				stampcls.setHaveDraw(true);
				stampcls.setHaveLine(false);
				stampTemp = {
					stampId:btn.stampId,
					cX:0,
					cY:0,
					//coverAll:false,
					currPage:0,
					stype:2,
					width:150,
					height:50,
					offLeft:0,//偏移量
					offTop:0,
					penColor:'#0000FF',//画笔颜色
					penWidth:'4',//笔画宽度
					pointArr:new Array(),//笔画Path
					keyId:''
				};
				me.up('window').down('#disStampName').setValue('手画线');
			}
		}

	},{
		itemId: 'coverline1',
		tooltip: '直线',
		text:'直线',
		iconCls:'coverMLine',
		//disabled:true,
		//iconCls:'coverFont',
		xtype:'button',
		//arrowAlign: 'right',
		enabletoggle:true,
		toggleGroup:'stampCover',
		listeners: {
			click: function(btn,e,opts) {
				var me = this;
				btn.toggle(true);
				//设置装状态
				stampcls.setHaveStamp(true);
				stampcls.setHaveDraw(false);
				stampcls.setHaveLine(true);
				stampTemp = {
					stampId:btn.stampId,
					cX:0,
					cY:0,
					//coverAll:false,
					currPage:0,
					stype:3,
					width:150,
					height:50,
					offLeft:0,//偏移量
					offTop:0,
					penColor:'#0000FF',//画笔颜色
					penWidth:'4',//笔画宽度
					pointArr:new Array(),//笔画Path
					keyId:''
				};
				me.up('window').down('#disStampName').setValue('直线');
			}
		}
	},'-',{
		tooltip:'保存',
		text:'保存',
		iconCls:'saveDraft',
		handler: function() {
			var me = this;
			var winType = me.up('window').winType;
			if(stampcls.getStampList().getCount()>0) {
				newMesB.show({
					title:'WaveFax FaxViewer',
					msg: '确定要(永久)存储批注吗？',
					buttons: Ext.MessageBox.YESNO,
					closable:false,
					fn: function(btn) {
						if(btn=="yes") {
							//alert(stampcls.getStampList().getCount());
							sendSStamp(true,winType);
						}
					},
					icon: Ext.MessageBox.QUESTION
				});
			}
		}
	},'-',{
		tooltip:'删除',
		text:'删除',
		iconCls:'delAllFile',
		disabled:true,
		itemId:'delStamps',
		handler: function(btn) {
			//取消选择
			if(stampcls.getSelList() && stampcls.getSelList().getCount()>0) {
				var selDiv = stampcls.getSelList().getByKey('cursel');
				stampcls.getStampList().removeAtKey(selDiv.id);
				selDiv.destroy();
				stampcls.getSelList().clear();
				btn.setDisabled(true);
			}
		}
	},'->',{
		xtype:'displayfield',
		itemId:'disStampName',
		width:260,
		labelWidth:95,
		labelAlign:'right',
		fieldLabel:'当前图章'
	}
	]
});

//创建图片编辑器
function createImgEditor(edSrc,winType) {

	return Ext.create('Ext.window.Window', {
		title: '文档编辑',
		iconCls:'stampEditor',
		modal: true,
		height:560,
		width: 970,
		winType:false,
		autoScroll: true,
		maximizable: true,
		layout: 'absolute',
		items: [{
			itemId:'currImage',
			xtype: 'image',
			x: 10,
			y: 10,
			src: edSrc,
			style: {
				border: '1px solid black',
				'-moz-user-select':'none',
				'background-color':'#FFFFFF',
				'background-image':'none',
				'background-repeat': 'no-repeat'
			},
			listeners: {
				afterrender: function (img, opts) {

					var paraStr = edSrc.substr(edSrc.indexOf('?') + 1, edSrc.length);
					var str = paraStr.split('&');
					var fid = str[2].split('=')[1];
					var cpage = str[3].split('=')[1];
					stampcls.setFileId(fid);
					stampcls.setCurrPage(cpage);

					var imgDom = img.getEl();
					imgDom.dom.onselectstart= function() {
						return false;
					};
					imgDom.on('mouseover', function () {
						if(stampcls.getHaveStamp()) {
							imgDom.setStyle('cursor', 'pointer');
						}
					});
					imgDom.on('mouseout', function () {
						imgDom.setStyle('cursor', 'auto');
					});
				}
			}
		}],
		dockedItems: [{
			xtype: 'tbfilepngviewEditor'
		}],
		listeners: {
			beforedestroy: function(com,opts) {
				var me = this;
				var winType = me.winType;

				if(winImageEditor.myhideType && winImageEditor.myhideType == 1) {
					return true;
				}
				var stampCount = stampcls.getStampList().getCount();

				if(stampCount > 0 && !winImageEditor.isSaveStamp) {
					//winImageEditor.show();
					newMesB.show({
						title:'WaveFax FaxViewer',
						msg: '确定要(永久)存储批注吗？',
						buttons: Ext.MessageBox.YESNO,
						closable:false,
						fn: function(btn) {
							if (btn =="no") {
								winImageEditor.myhideType = 1;
								showFlash(winType);
								winImageEditor.close();
								//return true;
							} else {
								winImageEditor.myhideType = 1;
								sendSStamp(false,winType);
								winImageEditor.close();
								//return true;
							}
						},
						icon: Ext.MessageBox.QUESTION
					});
					return false;
				} else {
					if(opts != true) {
						if(winType.pngGroup != 'docopenwin') {
							showFlash(winType);
						}
					}
					return true;
				}

			},
			resize: function(win,width,height,opts) {
				var img = win.down('#currImage');
				if(img.getWidth()&& ((img.getWidth() >10&&!Ext.isIE)||(Ext.isIE &&img.getWidth() >31) )) {
					var posX = width-img.getWidth();
					if(posX < 10) {
						posX = 10;
					}
					if(Ext.isIE && img.getWidth() < 31) {
						posX = 10;
					}
					img.setPosition(posX/2,10);
					if(stampcls.getStampList() && stampcls.getStampList().getCount()>0) {
						stampcls.getStampList().each( function(item,index,allitems) {
							var divT = win.down('#'+item.keyId);
							divT.setPosition(item.cX+posX/2,item.cY+10);
						});
					}
				} else {
					var imgClock = function() {
						if(img.getWidth()&& img.getWidth() >10 && !Ext.isIE) {
							var posX = width-img.getWidth();
							if(posX < 10) {
								posX = 10;
							}
							if(Ext.isIE && img.getWidth() < 31) {
								posX = 10;
							}
							img.setPosition(posX/2,10);
							imgrunner.stopAll();
							imgrunner = new Ext.util.TaskRunner();
						}
						if(img.getWidth()&& img.getWidth() >31 && Ext.isIE) {
							var posX = width-img.getWidth();
							if(posX < 10) {
								posX = 10;
							}
							if(Ext.isIE && img.getWidth() < 31) {
								posX = 10;
							}
							img.setPosition(posX/2,10);

							imgrunner.stopAll();
							imgrunner = new Ext.util.TaskRunner();
						}
					};
					var imgtask = {
						run: imgClock,
						interval: 100 //1 second
					};
					imgrunner = new Ext.util.TaskRunner();
					imgrunner.start(imgtask);
				}

			},
			destroy: function (com,opts) {

				if(winImageEditor != '' && !opts) {
					//winImageEditor.close();
					winImageEditor = '';
				}
				//保存按钮
				if(opts) {
					winImageEditor.isSaveStamp = false;
					winImageEditor.myhideType =2;
				}
				
				if(opts && opts!= true) {
					var param1 = {
						fileid: winType.pngClass.getFaxFileId()
					};
					//调用
					WsCall.call('restoreangle', param1, function (response, opts) {
						//更新当前选择的大图，重设大图src,loadfitpng
						var paraStr = edSrc.substr(edSrc.indexOf('?') + 1, edSrc.length);
						var str = paraStr.split('&');
						var fid = str[2].split('=')[1];
						var cpage = str[3].split('=')[1];
						var srcStr = edSrc;
						if (srcStr.search("&randomTime") >= 0) {
							srcStr = srcStr.substring(0, srcStr.lastIndexOf('&'));
						}

						if(winType.pngClass.getPngContainerBig() != '' && winType.pngClass.getPngContainerBig().setSrc) {
							var srcStr1 = winType.pngClass.getPngContainerBig().src;
							if (srcStr1.search("&randomTime") >= 0) {
								srcStr1 = srcStr1.substring(0, srcStr1.lastIndexOf('&'));
							}
							if(srcStr1 == srcStr) {
								var palPng = winType.down('#filepngviewBig');
								palPng.setHeight(winType.pngClass.getPngContainerBig().getWidth() +2);
								palPng.setWidth(winType.pngClass.getPngContainerBig().getHeight() +2);
								winType.pngClass.getPngContainerBig().setSrc(srcStr1 + "&randomTime=" + (new Date()).getTime());
							}

						}
						if(winType.pngClass.getPngSelBig().first()) {
							winType.pngClass.getPngSelBig().first().setSrc(WsConf.Url + "?req=rc&rcname=loadminipng&fileid=" + fid + "&currpage=" + cpage + "&randomTime=" + (new Date()).getTime());
						}
					}, function (response, opts) {
					}, true);
				}

			},
			afterrender: function (win, opts) {

				//设置按钮状态
				ActionBase.setTargetView('imageEditor', win);
				ActionBase.updateActions('imageEditor', winType.pngClass.getTotalCount(),-1);
				//设置起始的当前页数down('#txtCurrPage').setValue(oVal)
				var paraStr = edSrc.substr(edSrc.indexOf('?') + 1, edSrc.length);
				var str = paraStr.split('&');
				var fid = str[2].split('=')[1];
				var cpage = str[3].split('=')[1];
				win.down('#txtCurrPage').setValue(cpage);
				//盖章权限
				win.down('#coverimage').setDisabled((roleInfoModel.get('signEle')==0&&serverInfoModel.get('faxSign')==0)?false:true);

				var body = win.getEl().down("div[class*='x-window-body']");

				// body.on('select', function() {
				// return false;
				// });
				//ie下取消选择
				body.dom.onselectstart= function() {
					return false;
				};
				body.on('mousedown', function(event, htmel, object, opts) {
					//如果未使用画笔  and 未使用直线
					if(!stampcls.getHaveDraw() && !stampcls.getHaveLine()) {
						return;
					}
					if(tempdd!='') {
						win.remove(tempdd);
						tempdd = '';
					}

					stampcls.setIsDrawing(true);
					penClass = new penDrawclass();
					stampTemp.pointArr = new Array();
					//如果是直线
					//if(stampcls.getHaveLine()) {
					var pX = parseInt(win.down('#currImage').getEl().getXY()[0]);
					var pY = parseInt(win.down('#currImage').getEl().getXY()[1]);
					var point = {
						x:event.getX()-pX,
						y:event.getY()-pY
					};
					stampTemp.pointArr.push(point);
					//}
					//alert(3);
					event.stopEvent();

				});
				body.on('mouseup', function(event, htmel, object, opts) {
					//如果未使用画笔 and 未使用直线
					if(!stampcls.getHaveDraw() && !stampcls.getHaveLine()) {
						return;
					}

					(new Ext.util.DelayedTask()).delay(100, function() {
						if(tempdd!='') {
							win.remove(tempdd);
							tempdd = '';
						}
					});
					//如果是直线
					//if(stampcls.getHaveLine()) {
					var pX = parseInt(win.down('#currImage').getEl().getXY()[0]);
					var pY = parseInt(win.down('#currImage').getEl().getXY()[1]);
					var point = {
						x:event.getX()-pX+1,
						y:event.getY()-pY+1
					};
					stampTemp.pointArr.push(point);
					//}
					//isDrawing = false;

					//如果是手画线
					if(stampcls.getHaveDraw()) {
						if(event.getX()-pX+1 > penClass.maxX) {
							penClass.maxX = parseInt(event.getX()-pX+1);
						}
						if(event.getY()-pY+1 > penClass.maxY) {
							penClass.maxY = parseInt(event.getY()-pY+1);
						}

						if(event.getX()-pX+1 < penClass.minX) {
							penClass.minX = parseInt(event.getX()-pX+1);
						}

						if(event.getY()-pY+1 < penClass.minY) {
							penClass.minY = parseInt(event.getY()-pY+1);
						}
					}
					var paStr = "";
					//alert(Ext.JSON.encode(stampTemp.pointArr));
					if(stampTemp.pointArr&&stampTemp.pointArr.length > 1) {
						Ext.Array.each(stampTemp.pointArr, function(point,index,all) {
							if(index==0) {
								paStr +="M"+point.x+" "+point.y+" ";

							} else {
								paStr += "L"+point.x+" "+point.y+" "
							}

						});
						var ranKey = Ext.id();
						var panel5;
						var mySignet1;
						//如果是手画线
						if(stampcls.getHaveDraw()) {
							mySignet1 = new MySignetClass(parseInt(penClass.maxX - penClass.minX)+15, parseInt(penClass.maxY - penClass.minY)+15);
						}
						//如果是直线
						if(stampcls.getHaveLine()) {

							mySignet1 = new MySignetClass(Math.abs(stampTemp.pointArr[0].x - stampTemp.pointArr[1].x)+15, Math.abs(stampTemp.pointArr[0].y - stampTemp.pointArr[1].y)+15);

						}

						//var mySignet1 = new	MySignetClass(200, 200);
						//alert(parseInt(penClass.maxX - penClass.minX)+":"+parseInt(penClass.maxY - penClass.minY));

						function ceateDrawPanel(rId) {
							return	Ext.create('Ext.panel.Panel', {
								autoShow:true,
								id:rId,
								width:mySignet1.width,
								height:mySignet1.height,
								style: {
									'padding': '0 0 0 0',
									'background-color': 'transparent',
									'border': '1px dotted blue',
									'-moz-user-select':'none'
								},
								bodyStyle: {
									'background-image': 'url(resources/images/s.gif)',//图路径
									'background-repeat': 'no-repeat',
									'background-color': 'transparent',
									'-moz-opacity': '1',
									'opacity':'1',
									'border': '0px dotted blue',
									'-moz-user-select':'none',
									'filter':"progid:DXImageTransform.Microsoft.Chroma(color='white')"
								},
								listeners: {
									// beforerender: function (com, opts) {
									// mySignet1.setPanelDimension(com);
									// },
									render: function (com, opts) {

										var img = com.getEl();

										// img.on('select', function() {
										// return false;
										// });
										//ie下取消选择
										img.dom.onselectstart= function() {
											return false;
										};
										img.on('mousedown', function (event, htmel, object, opts) {
											if(stampcls.getIsDrawing()) {
												return;
											}
											mySignet1.isDrag = true;

											mySignet1.offsetLeft = img.getX() - event.getX();
											mySignet1.offsetTop = img.getY() - event.getY();

										});
										win.getEl().on('mousemove', function (event, htmel, object, opts) {

											if (!mySignet1.isDrag)
												return;

											img.setStyle('cursor', 'pointer');

											com.setPagePosition(event.getX() + mySignet1.offsetLeft, event.getY() + mySignet1.offsetTop, false);

										});
										img.on('mouseup', function (event, htmel, object, opts) {
											if(stampcls.getIsDrawing()) {
												return;
											}
											mySignet1.isDrag = false;
											img.setStyle('cursor', 'auto');
											//移动后重置cX,cY
											var temp = stampcls.getStampList().getByKey(com.id);
											//- win.down('#currImage').getPosition()[0]
											temp.cX = com.getEl().getXY()[0]- win.down('#currImage').getEl().getXY()[0];
											temp.cY = com.getEl().getXY()[1]- win.down('#currImage').getEl().getXY()[1];
											//getPosition
											//stampcls.getStampList().add(com.id,temp);
										});
										//img单击选中事件
										img.on('click', function (e, htmel, object, opts) {
											//alert(com.id);
											stampcls.getStampList().eachKey( function(item) {
												if(com.id == item) {
													var curSel = win.down('#'+com.id+'');
													curSel.getEl().setStyle('border','1px solid blue');
													stampcls.getSelList().add('cursel',curSel);
													win.down('#delStamps').setDisabled(false);
												} else {
													var other = win.down('#'+item+'');
													other.getEl().setStyle('border','1px dotted blue');
												}
											});
											e.stopEvent();
											//win.down
										});
										//img双击事件
										img.on('dblclick', function (e, htmel, object, opts) {
											//alert(com.id);
											stampcls.getStampList().eachKey( function(item) {
												if(com.id == item) {
													lineEditor.comId=com.id;
													lineEditor.show();
													return;
												}
											});
											e.stopEvent();
											//win.down
										});
									}
								}
							});
						}

						panel5 =ceateDrawPanel(ranKey);

						var pWidth;
						var pHeight;
						//如果是手画线
						if(stampcls.getHaveDraw()) {
							pWidth = parseInt(penClass.maxX - penClass.minX);
							pHeight = parseInt(penClass.maxY - penClass.minY);

						}

						//如果是直线
						if(stampcls.getHaveLine()) {
							pWidth =  Math.abs(stampTemp.pointArr[0].x - stampTemp.pointArr[1].x)+ parseInt(stampTemp.penWidth)/2;//加上线宽/2
							pHeight = Math.abs(stampTemp.pointArr[0].y - stampTemp.pointArr[1].y)+ parseInt(stampTemp.penWidth);//加上线高

							if(stampTemp.pointArr[0].x > stampTemp.pointArr[1].x) {
								penClass.minX = stampTemp.pointArr[1].x;
							} else {
								penClass.minX = stampTemp.pointArr[0].x;
							}
							//alert(stampTemp.pointArr[0].y +":"+ stampTemp.pointArr[1].y);
							if(stampTemp.pointArr[0].y > stampTemp.pointArr[1].y) {
								penClass.minY = stampTemp.pointArr[1].y;
							} else {
								penClass.minY = stampTemp.pointArr[0].y;
							}
						}

						stampTemp.width = pWidth;
						stampTemp.height= pHeight;

						var dd = Ext.create('Ext.draw.Component', {
							width: pWidth,
							height: pHeight,
							style: {
								'background-color': 'transparent',
								'-moz-opacity': '1',
								'opacity':'1',
								'-moz-user-select':'none',
								'filter':'progid:DXImageTransform.Microsoft.Alpha(opacity=100)'
							},
							items: [{
								type: "path",
								opacity:1,
								path:paStr,
								style: {
									'background-color': 'transparent',
									'-moz-opacity': '1',
									'opacity':'1',
									'-moz-user-select':'none',
									'filter':'progid:DXImageTransform.Microsoft.Alpha(opacity=100)'
								},
								x:2,
								y:2,
								width: pWidth,
								height: pHeight,
								// path: "M1 1 Q50 50 220 223 Q233 220 420 423",
								"stroke-width":stampTemp.penWidth,
								stroke:stampTemp.penColor
							}],
							listeners: {
								render: function (com, opts) {

									var img = com.getEl();
									var panelCon = com.up('panel');
									// img.on('select', function() {
									// return false;
									// });
									//ie下取消选择
									img.dom.onselectstart= function() {
										return false;
									};
									img.on('mousedown', function (event, htmel, object, opts) {

										mySignet1.isDrag = true;

										mySignet1.offsetLeft = img.getX() - event.getX();
										mySignet1.offsetTop = img.getY() - event.getY();

									});
									win.getEl().on('mousemove', function (event, htmel, object, opts) {

										if (!mySignet1.isDrag)
											return;

										img.setStyle('cursor', 'pointer');

										panelCon.setPagePosition(event.getX() + mySignet1.offsetLeft, event.getY() + mySignet1.offsetTop, false);

									});
									img.on('mouseup', function (event, htmel, object, opts) {
										mySignet1.isDrag = false;
										img.setStyle('cursor', 'auto');
										//移动后重置cX,cY

										var temp = stampcls.getStampList().getByKey(panelCon.id);
										//- win.down('#currImage').getPosition()[0]
										temp.cX = panelCon.getEl().getXY()[0]- win.down('#currImage').getEl().getXY()[0];
										temp.cY = panelCon.getEl().getXY()[1]- win.down('#currImage').getEl().getXY()[1];

										//stampcls.getStampList().add(com.id,temp);
									});
									//img单击选中事件
									img.on('click', function (e, htmel, object, opts) {
										//alert(com.id);
										stampcls.getStampList().eachKey( function(item) {
											if(panelCon.id == item) {
												var curSel = win.down('#'+panelCon.id+'');
												curSel.getEl().setStyle('border','1px solid blue');
												stampcls.getSelList().add('cursel',curSel);
												win.down('#delStamps').setDisabled(false);
											} else {
												var other = win.down('#'+item+'');
												other.getEl().setStyle('border','1px dotted blue');
											}
										});
										e.stopEvent();
										//win.down
									});
									//img双击事件
									img.on('dblclick', function (e, htmel, object, opts) {
										//alert(com.id);
										stampcls.getStampList().eachKey( function(item) {
											if(panelCon.id == item) {
												lineEditor.comId=panelCon.id;
												lineEditor.show();
												return;
											}
										});
										e.stopEvent();
										//win.down
									});
								}
							}
						});

						panel5.add(dd);
						win.add(panel5);

						//panel5.setPagePosition(100,100, false);
						var img = win.down('#currImage');
						var posX = win.getWidth()-img.getWidth();
						if(posX < 10) {
							posX = 10;
						}
						if(Ext.isIE && img.getWidth() < 31) {
							posX = 10;
						}

						stampTemp.offLeft = posX/2;
						stampTemp.offTop =  10;
						//panel5.show();

						//panel5.setPosition(event.getX()- win.down('#currImage').getPosition()[0], event.getY()- win.down('#currImage').getPosition()[1], false);

						//如果是手画线
						//if(stampcls.getHaveDraw()) {
						panel5.setPosition(penClass.minX+stampTemp.offLeft,penClass.minY+stampTemp.offTop);
						//}
						//如果是直线
						//if(stampcls.getHaveLine()) {
						//panel5.setPosition(penClass.minX,penClass.minY);
						//}

						//alert(penClass.minX+":"+penClass.minY);

						//如果是手画线
						if(stampcls.getHaveDraw()) {
							win.down('#coverline').toggle(false);
						}
						//如果是直线
						if(stampcls.getHaveLine()) {
							win.down('#coverline1').toggle(false);
						}

						//重置toggle
						stampcls.setHaveStamp(false);
						stampcls.setHaveDraw(false);
						stampcls.setIsDrawing(false);
						stampcls.setHaveLine(false);
						win.down('#disStampName').setValue('');

						//点击后重置cX,cY
						stampTemp.cX = penClass.minX;
						stampTemp.cY = penClass.minY;
						stampTemp.currPage = win.down('#txtCurrPage').getValue();
						stampTemp.keyId = panel5.id;
						stampcls.getStampList().add(ranKey,stampTemp);

					}

					event.stopEvent();

				});
				body.on('mousemove', function(event, htmel, object, opts) {
					//penDrawclass

					//正在使用直线
					if(stampcls.getHaveLine()) {
						event.stopEvent();
						return;
					}

					//如果未使用画笔
					if(!stampcls.getHaveDraw()) {
						return;
					}
					//正在使用直线
					// if(stampcls.getHaveLine()) {
					// return;
					// }
					if(!stampcls.getIsDrawing()) {
						return;
					}

					var pX = parseInt(win.down('#currImage').getEl().getXY()[0]);
					var pY = parseInt(win.down('#currImage').getEl().getXY()[1]);

					if(event.getX()-pX > penClass.maxX) {
						penClass.maxX = parseInt(event.getX()-pX);
					}
					if(event.getY()-pY > penClass.maxY) {
						penClass.maxY = parseInt(event.getY()-pY);
					}

					if(event.getX()-pX < penClass.minX) {
						penClass.minX = parseInt(event.getX()-pX);
					}

					if(event.getY()-pY < penClass.minY) {
						penClass.minY = parseInt(event.getY()-pY);
					}

					drawlinedelay.cancel();

					var paStr = "";
					//alert(Ext.JSON.encode(pointArr));
					if(stampTemp.pointArr&&stampTemp.pointArr.length > 1) {
						Ext.Array.each(stampTemp.pointArr, function(point,index,all) {
							if(index==0) {
								paStr +="M"+point.x+" "+point.y+" ";

							} else {
								paStr += "L"+point.x+" "+point.y+" "
							}

						});
						drawlinedelay.delay(50, function() {
							if(tempdd!='') {
								win.remove(tempdd,true);
								tempdd = '';
							}

							tempdd = Ext.create('Ext.draw.Component', {
								width: parseInt(penClass.maxX - penClass.minX),
								height: parseInt(penClass.maxY - penClass.minY),
								style: {
									'background-color': 'transparent',
									'-moz-opacity': '1',
									'opacity':'1',
									'filter':'progid:DXImageTransform.Microsoft.Alpha(opacity=100)'
								},
								items: [{
									type: "path",
									opacity:1,
									path:paStr,
									style: {
										'background-color': 'transparent',
										'-moz-opacity': '1',
										'opacity':'1',
										'filter':'progid:DXImageTransform.Microsoft.Alpha(opacity=100)'
									},
									width: parseInt(penClass.maxX - penClass.minX),
									height: parseInt(penClass.maxY - penClass.minY),
									// path: "M1 1 Q50 50 220 223 Q233 220 420 423",
									"stroke-width":stampTemp.penWidth,
									stroke:stampTemp.penColor
								}]
							});
							//win.removeAll();
							win.add(tempdd);

							var img = win.down('#currImage');
							var posX = win.getWidth()-img.getWidth();
							if(posX < 10) {
								posX = 10;
							}
							if(Ext.isIE && img.getWidth() < 31) {
								posX = 10;
							}

							stampTemp.offLeft = posX/2;
							stampTemp.offTop =  10;
							//panel5.show();
							tempdd.setPosition(penClass.minX+stampTemp.offLeft,penClass.minY+stampTemp.offTop);
							//tempdd.setPagePosition(event.getX()- win.down('#currImage').getPosition()[0], event.getY()- win.down('#currImage').getPosition()[1], false);
							//tempdd.setPagePosition(penClass.minX+stampTemp.offLeft,penClass.minY+stampTemp.offTop);
						});
					}

					var point = {
						x:event.getX()-pX,
						y:event.getY()-pY
					};
					stampTemp.pointArr.push(point);
					event.stopEvent();
				});
				body.on('click', function (e, t, o,opts) {
					//取消选择
					if(stampcls.getSelList() && stampcls.getSelList().getCount()>0) {
						var selDiv = stampcls.getSelList().getByKey('cursel');
						selDiv.getEl().setStyle('border','1px dotted blue');
						stampcls.getSelList().clear();
						win.down('#delStamps').setDisabled(true);
					}
					//如果正在使用画笔
					if(stampcls.getIsDrawing()) {
						e.stopEvent();
						return;
					}

					//图片中的实际坐标位置
					//alert(e.browserEvent.layerX + ":" + e.browserEvent.layerY)e.browserEvent.clientX;
					if(stampcls.getHaveStamp()) {
						//调用call取得图章信息
						//var piX = hidStamp.getWidth();
						//var piY = hidStamp.getHeight();
						//var mySignet1 = new	MySignetClass(179, 116);//根据图片大小设置偏移量

						var ranKey = Ext.id();
						var panel5;

						//判断是文字图章还是图片图章or笔画
						if(stampTemp.stype == 0) {
							var store = Ext.StoreMgr.lookup('coverimagegridStoreId');
							var record = store.getById(stampTemp.stampId);
							var mySignet1 = new	MySignetClass(record.data.stampWidth, record.data.stampHeight);
							//var bgSrc = "url(resources/images/112.png)";//图章路径
							//req=rc&rcname=loadstamp&stampid=stampTemp.stampId)
							var bgSrc = "url("+WsConf.Url+"?req=rc&rcname=loadstamp&stampid="+stampTemp.stampId+")";
							function ceateSPanel(rId) {
								return	Ext.create('Ext.panel.Panel', {
									autoShow:true,
									id:rId,
									width:mySignet1.width,
									height:mySignet1.height,
									style: {
										'padding': '0 0 0 0',
										'background-color': 'transparent',
										'border': '1px dotted blue'
									},
									bodyStyle: {
										'background-image': bgSrc,//图章路径
										'background-repeat': 'no-repeat',
										//'background-color': 'transparent',
										'-moz-opacity': '0.7',
										'opacity':'0.7',
										'border': '0px dotted blue',
										'filter':"progid:DXImageTransform.Microsoft.Chroma(color='white')"
									},
									listeners: {
										// beforerender: function (com, opts) {
										//
										// mySignet1.setPanelDimension(com);
										// },
										render: function (com, opts) {

											var img = com.getEl();

											img.on('mousedown', function (event, htmel, object, opts) {

												mySignet1.isDrag = true;

												mySignet1.offsetLeft = img.getX() - event.getX();
												mySignet1.offsetTop = img.getY() - event.getY();

											});
											win.getEl().on('mousemove', function (event, htmel, object, opts) {

												if (!mySignet1.isDrag)
													return;

												img.setStyle('cursor', 'pointer');

												com.setPagePosition(event.getX() + mySignet1.offsetLeft, event.getY() + mySignet1.offsetTop, false);

											});
											img.on('mouseup', function (event, htmel, object, opts) {
												mySignet1.isDrag = false;
												img.setStyle('cursor', 'auto');
												//移动后重置cX,cY
												var temp = stampcls.getStampList().getByKey(com.id);
												//- win.down('#currImage').getPosition()[0]
												temp.cX = com.getEl().getXY()[0]- win.down('#currImage').getEl().getXY()[0];
												temp.cY = com.getEl().getXY()[1]- win.down('#currImage').getEl().getXY()[1];

												//stampcls.getStampList().add(com.id,temp);
											});
											//img单击选中事件
											img.on('click', function (e, htmel, object, opts) {
												//alert(com.id);
												stampcls.getStampList().eachKey( function(item) {
													if(com.id == item) {
														var curSel = win.down('#'+com.id+'');
														curSel.getEl().setStyle('border','1px solid blue');
														stampcls.getSelList().add('cursel',curSel);
														win.down('#delStamps').setDisabled(false);
													} else {
														var other = win.down('#'+item+'');
														other.getEl().setStyle('border','1px dotted blue');
													}
												});
												e.stopEvent();
												//win.down
											});
										}
									}
								});
							}

							panel5 =ceateSPanel(ranKey);
							//判断是否需要验证
							var store = Ext.StoreMgr.lookup('coverimagegridStoreId');
							var record = store.getById(stampTemp.stampId);
							//stampType:record.data.enumEStampAuthType,
							//stampName:record.data.stampName,
							if(record.data.enumEStampAuthType != EnumEStampAuthType.satpNone) {
								var tempEX = e.getX();
								var tempEY = e.getY();
								var msgStr = record.data.stampName;
								var fileText = '';
								if(record.data.enumEStampAuthType == EnumEStampAuthType.satpPassword) {
									fileText = "图章密码";
								}
								if(record.data.enumEStampAuthType == EnumEStampAuthType.satpAccountAuth) {
									fileText = "用户密码";
								}

								promWin = Ext.create('Ext.window.Window', {
									title: '请输入密码',
									height: 120,
									width: 300,
									modal:true,
									layout: 'auto',
									defaults: {
										margin:'5 0 0 4',
										width:280,
										labelWidth:110,
										labelAlign:'right'
									},
									items:[{
										xtype: 'displayfield',
										fieldLabel: '图章名称',
										value:msgStr
									},{
										xtype:'textfield',
										itemId:'txtPass',
										fieldLabel:fileText,
										inputType:'password'
									}],
									buttons:[{
										text:'确定',
										handler: function() {

											//调用验证图章密码接口
											//调用
											var param = {};
											param.stampId = stampTemp.stampId;
											param.type = stampTemp.type;
											param.pass = promWin.down('#txtPass').getValue();
											param.sessiontoken = sessionToken;
											promWin.close();
											//调用
											WsCall.call('checkstamppass', param, function (response, opts) {
												win.add(panel5);

												panel5.setPagePosition(tempEX, tempEY, false);
												//重置toggle
												stampcls.setHaveStamp(false);
												win.down('#disStampName').setValue('');
												win.down('#coverimage').toggle(false);
												//点击后重置cX,cY
												stampTemp.cX = tempEX - win.down('#currImage').getEl().getXY()[0];
												stampTemp.cY = tempEY - win.down('#currImage').getEl().getXY()[1];
												stampTemp.currPage = win.down('#txtCurrPage').getValue();
												stampTemp.keyId = panel5.id;
												//stampTemp.currPage
												stampcls.getStampList().add(ranKey,stampTemp);

												//判断页数是否大于1页
												if(winType.pngClass.getCurrFaxFileTotal() > 1) {

													//判断是否需要对每页签章
													newMesB.show({
														title:'WaveFax FaxViewer',
														msg: '是否对每页都签章？',
														buttons: Ext.MessageBox.YESNO,
														closable:false,
														buttonText: {
															yes: '是',
															no: '否'
														},
														fn: function(btn) {
															if(btn=="yes") {
																//设置是否对每页添加该图章
																var temp = stampcls.getStampList().getByKey(ranKey);
																temp.coverAll = true;
															}
														},
														icon: Ext.MessageBox.QUESTION
													});
												}

											}, function (response, opts) {
												if(!errorProcess(response.code)) {
													Ext.Msg.alert('密码错误',response.msg);
												}

											}, true);
										}
									},{
										text:'取消',
										handler: function() {
											promWin.close();
										}
									}],
									listeners: {
										show: function(com) {
											var hedt=com.down('#txtPass');
											if(hedt) {
												hedt.focus(false,50);
											}
										}
									}
								}).show();

								// Ext.MessageBox.prompt('请输入密码', msgStr, function showResultText(btn, text) {
								// //btn, text
								// if(btn == "ok") {
								//
								// }
								// });
							} else {
								win.add(panel5);

								panel5.setPagePosition(e.getX(), e.getY(), false);
								//重置toggle
								stampcls.setHaveStamp(false);
								win.down('#disStampName').setValue('');
								win.down('#coverimage').toggle(false);
								//点击后重置cX,cY
								stampTemp.cX = e.getX()- win.down('#currImage').getEl().getXY()[0];
								stampTemp.cY = e.getY()- win.down('#currImage').getEl().getXY()[1];
								stampTemp.currPage = win.down('#txtCurrPage').getValue();
								stampTemp.keyId = panel5.id;
								stampcls.getStampList().add(ranKey,stampTemp);

								//判断页数是否大于1页
								if(winType.pngClass.getCurrFaxFileTotal() > 1) {

									//判断是否需要对每页签章
									newMesB.show({
										title:'WaveFax FaxViewer',
										msg: '是否对每页都签章？',
										buttons: Ext.MessageBox.YESNO,
										closable:false,
										fn: function(btn) {
											if(btn=="yes") {
												//设置是否对每页添加该图章
												var temp = stampcls.getStampList().getByKey(ranKey);
												temp.coverAll = true;

											}
										},
										icon: Ext.MessageBox.QUESTION
									});
								}

							}//imgStamp else

						} else if(stampTemp.stype == 1) {//文字图章
							var mySignet1 = new	MySignetClass(150, 50);
							function ceateFPanel(rId) {
								return	Ext.create('Ext.panel.Panel', {
									autoShow:true,
									//resizable:true,
									width:mySignet1.width,
									height:mySignet1.height,
									baseCls:'',
									bodyCls:'',
									componentCls:'',
									id:rId,
									autoScroll:false,
									//html:'请双击添加文字',
									style: {
										'padding': '0 0 0 0',
										'background-color': 'transparent',
										'border': '1px dotted blue',
										'overflow-x':'hidden',
										'overflow-y':'hidden',
										'-moz-user-select':'none'
									},
									bodyStyle: {
										'background-image': 'url(resources/images/s.gif)',//图章路径
										'background-repeat': 'no-repeat',
										'background-color': 'transparent',
										'-moz-opacity': '0.7',
										'opacity':'0.7',
										'border': '0px dotted blue',
										'filter':"progid:DXImageTransform.Microsoft.Chroma(color='white')",
										//'word-wrap':'break-word',
										'overflow-x':'hidden',
										'overflow-y':'hidden',
										'-moz-user-select':'none'
									},
									listeners: {
										// beforerender: function (com, opts) {
										// mySignet1.setPanelDimension(com);
										// },
										render: function (com, opts) {

											var img = com.getEl();

											// img.on('select', function() {
											// return false;
											// });
											//ie下取消选择
											img.dom.onselectstart= function() {
												return false;
											};
											img.on('mousemove', function (event, htmel, object, opts) {
												if(!mySignet1.isResize) {
													img.setStyle('cursor', 'auto');
													mySignet1.isBorder = false;
												}

												if(Math.abs((event.getY() - img.getY())- img.getHeight()) <= 3 && Math.abs((event.getX() - img.getX()) - img.getWidth()) <= 3) {
													img.setStyle('cursor', 'se-resize');
													mySignet1.resType = 'se';
													mySignet1.isBorder = true;
													return;
												}
												if(Math.abs((event.getX() - img.getX()) - img.getWidth()) <= 3) {
													img.setStyle('cursor', 'e-resize');
													mySignet1.resType = 'e';
													mySignet1.isBorder = true;
												}
												if(Math.abs((event.getY() - img.getY())- img.getHeight()) <= 3) {
													img.setStyle('cursor', 's-resize');
													mySignet1.resType = 's';
													mySignet1.isBorder = true;
												}

											});
											img.on('mouseout', function (event, htmel, object, opts) {
												img.setStyle('cursor', 'auto');
											});
											img.on('mousedown', function (event, htmel, object, opts) {

												if(mySignet1.isBorder) {
													mySignet1.isDrag = false;
													mySignet1.isResize = true;
													e.stopEvent();
													return;
												} else {
													mySignet1.isDrag = true;
												}

												mySignet1.offsetLeft = img.getX() - event.getX();
												mySignet1.offsetTop = img.getY() - event.getY();

											});
											win.getEl().on('mousemove', function (event, htmel, object, opts) {
												if (!mySignet1.isDrag || mySignet1.isBorder)
													return;
												img.setStyle('cursor', 'pointer');
												com.setPagePosition(event.getX() + mySignet1.offsetLeft, event.getY() + mySignet1.offsetTop, false);

											});
											win.getEl().on('mouseup', function (event, htmel, object, opts) {
												if(mySignet1.isBorder) {
													if(mySignet1.isResize) {
														var img = com.getEl();
														var nW = 150; //150
														var nH = 50;//50
														if(mySignet1.resType == 'se') {
															nW = event.getX() - img.getX();
															nH = event.getY()  - img.getY();
														}
														if(mySignet1.resType == 's') {
															nW = img.getWidth();
															nH = event.getY()  - img.getY();
														}
														if(mySignet1.resType == 'e') {
															nW = event.getX() - img.getX();
															nH = img.getHeight();
														}
														var temp = stampcls.getStampList().getByKey(com.id);
														temp.width = nW;
														temp.height = nH;
														img.setWidth(nW);
														img.setHeight(nH);
														com.setWidth(nW);
														com.setHeight(nH);
														com.doLayout();
													}
													mySignet1.isResize = false;
													e.stopEvent();
													return;
												}
											});
											img.on('mouseup', function (event, htmel, object, opts) {
												if(mySignet1.isBorder) {
													return;
												}
												mySignet1.isDrag = false;
												img.setStyle('cursor', 'auto');
												//移动后重置cX,cY
												var temp = stampcls.getStampList().getByKey(com.id);
												//- win.down('#currImage').getPosition()[0]
												temp.cX = com.getEl().getXY()[0]- win.down('#currImage').getEl().getXY()[0];
												temp.cY = com.getEl().getXY()[1]- win.down('#currImage').getEl().getXY()[1];
												e.stopEvent();
												//stampcls.getStampList().add(com.id,temp);
											});
											//img单击选中事件
											img.on('click', function (e, htmel, object, opts) {
												if(mySignet1.isBorder) {
													e.stopEvent();
													return;
												}
												//alert(com.id);
												stampcls.getStampList().eachKey( function(item) {
													if(com.id == item) {
														var curSel = win.down('#'+com.id+'');
														curSel.getEl().setStyle('border','1px solid blue');
														stampcls.getSelList().add('cursel',curSel);
														win.down('#delStamps').setDisabled(false);
													} else {
														var other = win.down('#'+item+'');
														other.getEl().setStyle('border','1px dotted blue');
													}
												});
												e.stopEvent();
												//win.down
											});
											//img双击事件
											img.on('dblclick', function (e, htmel, object, opts) {
												//alert(com.id);
												stampcls.getStampList().eachKey( function(item) {
													if(com.id == item) {
														fontEditor.comId=com.id;
														fontEditor.show();
														return;
													}
												});
												e.stopEvent();
												//win.down
											});
										}
									}
								});
							}

							panel5 =ceateFPanel(ranKey);
							win.add(panel5);
							panel5.setPagePosition(e.getX(), e.getY(), false);
							//重置toggle
							stampcls.setHaveStamp(false);
							win.down('#disStampName').setValue('');
							win.down('#coverfont').toggle(false);
							//点击后重置cX,cY
							stampTemp.cX = e.getX()- win.down('#currImage').getEl().getXY()[0];
							stampTemp.cY = e.getY()- win.down('#currImage').getEl().getXY()[1];
							stampTemp.currPage = win.down('#txtCurrPage').getValue();
							stampTemp.keyId = panel5.id;
							stampcls.getStampList().add(ranKey,stampTemp);
							fontEditor.comId=ranKey;
							fontEditor.show();
						} else if(stampTemp.stype == 2) {//笔画线
							//alert('1');
						}
					}
				});
			},
			show: function(win) {
				if(winType.pngGroup == 'wfhandlerwin') {
					var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
					var rule;
					Ext.Array.each(Ext.JSON.decode(tmp.record.data.process), function(item) {
						if(item.activityStatus == '1' || item.activityStatus == '2') {
							rule = item.workflowAction;
							return false;
						}
					});
					if(workflowActionDis(rule,'EDIT_DOC')) {//编辑文档 -不能盖章
						win.down('#coverfont').hide();
						win.down('#coverline').hide();
						win.down('#coverline1').hide();
						win.down('#disStampName').hide();
						win.down('#imageEditorrotateLeft').hide();
						win.down('#imageEditorrotateRight').hide();
						win.down('#imageEditoroverturn').hide();
					}

					if(workflowActionDis(rule,'STAMP_DOC')) {//WaveFax签章 -只能盖章
						win.down('#coverimage').hide();

					}
				}
				//加载传真纸
				if(winType.pngGroup == 'sendfax') {
					var imgItem = win.down('#currImage').getEl();
					if(winType.faxpaperid != '0') {
						imgItem.dom.style.backgroundColor = 'transparent';
						imgItem.dom.style.backgroundImage = 'url('+WsConf.Url+'?req=rc&rcname=loadfaxpaper&type=big&fpid='+winType.faxpaperid+')';
						imgItem.dom.style.backgroundRepeat = 'no-repeat';
						//禁用左右旋转
						win.down('#imageEditorrotateLeft').setDisabled(true);
						win.down('#imageEditorrotateRight').setDisabled(true);

					} else {
						imgItem.dom.style.backgroundColor = '#FFFFFF';
						imgItem.dom.style.backgroundImage = 'none';
						imgItem.dom.style.backgroundRepeat = 'no-repeat';
					}
				}
			}
		}
	}).show();
}