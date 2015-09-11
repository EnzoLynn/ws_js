var myUrlPrefix;

//图片显示类 myfilepngview
Ext.define('filepngclass', {
	config: {
		totalCount:0,//总页数
		fileId:1,//文件id
		currPage:1,//当前位置
		sessiontoken:''
	},
	constructor: function (cfg) {
		this.totalCount = cfg.totalCount;
		this.fileId = cfg.fileId;
		this.sessiontoken = cfg.sessiontoken;
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

///================================imageEditor===================================================///
///================================imageEditor===================================================///
///================================imageEditor===================================================///
///================================imageEditor===================================================///
///================================imageEditor===================================================///

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

//图章序列
//var stampClsArr = new Ext.util.MixedCollection();

//imageEditor ActionBase
Ext.define('WS.tbnorth.imageEditor', {
	extend: 'WS.action.Base',
	category: 'imageEditor'
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
			// var png = me.getTargetView().down('#currImage');
			//
			// me.getTargetView().setHeight(png.getWidth()>1100?png.getWidth():1100);
			// me.getTargetView().setWidth(png.getHeight()>1100?png.getHeight():1100);
		}, function (response, opts) {
			Ext.Msg.alert('翻转失败', response.msg);
		}, true);
	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(false);
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
			// var png = me.getTargetView().down('#currImage');
			//
			// me.getTargetView().setHeight(png.getWidth()>1600?png.getWidth():1600);
			// me.getTargetView().setWidth(png.getHeight()>1600?png.getHeight():1600);
		}, function (response, opts) {
			Ext.Msg.alert('翻转失败', response.msg);
		}, true);
	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(false);
	}
});

//上下翻转  myfilepngview
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditoroverturn',
	tooltip: '上下翻转',
	//text: '上下翻转',
	iconCls: 'faxPngFlip',
	disabled: true,
	handler: function (button, event) {
		var me = this;
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
	iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
	disabled: true,
	handler: function (button, event) {
		var me = this;
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
		param.fileid = myFiles.fileId;
		param.currpage=1;

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			//palPng.setSrc(myFiles.pngArr[0]);
			palPng.setSrc(WsConf.Url +info.url);
		}, function(response, opts) {

		}, true);
		//设置按钮状态
		ActionBase.updateActions('imageEditor', myFiles.totalCount,1);
	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage==1);
	}
});
//上一页 imageEditor
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditorprePage',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
	disabled: true,
	handler: function (button, event) {
		var me = this;
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
			param.fileid = myFiles.fileId;
			param.currpage=oVal;

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				palPng.setSrc(WsConf.Url +info.url);
				//palPng.setSrc(myFiles.pngArr[oVal-1]);

			}, function(response, opts) {

			}, true);
			//设置按钮状态
			ActionBase.updateActions('imageEditor', myFiles.totalCount,oVal);
		}

	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage<=1);
	}
});
//下一页 imageEditor
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditornextPage',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		var oVal = me.getTargetView().down('#txtCurrPage').getValue();
		oVal++;
		if (oVal <= myFiles.totalCount) {
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
			param.fileid = myFiles.fileId;
			param.currpage=oVal;

			WsCall.call('loadfitpng', param, function(response, opts) {
				var info = Ext.JSON.decode(response.data);
				palPng.setSrc(WsConf.Url +info.url);
				//palPng.setSrc(myFiles.pngArr[oVal-1]);

			}, function(response, opts) {

			}, true);
			//me.getTargetView().down('#currImage').setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + myfilepngview.getFaxFileId() + "&currpage=" + oVal + "&randomTime"+(new Date()).getTime());
			//设置按钮状态
			ActionBase.updateActions('imageEditor', myFiles.totalCount,oVal);
		}

	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage>=totoalPage);
	}
});
//尾页  imageEditor
Ext.create('WS.tbnorth.imageEditor', {
	itemId: 'imageEditorlastPage',
	iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
	disabled: true,
	handler: function (button, event) {
		var me = this;
		me.getTargetView().down('#txtCurrPage').setValue(myFiles.totalCount);

		stampcls.getStampList().each( function(item,index,allits) {
			if(item.currPage == myFiles.totalCount || item.coverAll) {
				me.getTargetView().down('#'+item.keyId).show();
				return;
			}
			me.getTargetView().down('#'+item.keyId).hide();
		});
		var palPng = me.getTargetView().down('#currImage');

		var param = {};
		param.sessiontoken = sessionToken;
		param.fileid = myFiles.fileId;
		param.currpage=myFiles.totalCount;

		WsCall.call('loadfitpng', param, function(response, opts) {
			var info = Ext.JSON.decode(response.data);
			//palPng.setSrc(myFiles.pngArr[myFiles.pngArr.length-1]);
			palPng.setSrc(WsConf.Url +info.url);
		}, function(response, opts) {

		}, true);
		//me.getTargetView().down('#currImage').setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + myfilepngview.getFaxFileId() + "&currpage=" + myfilepngview.getCurrFaxFileTotal() + "&randomTime"+(new Date()).getTime());
		//设置按钮状态
		ActionBase.updateActions('imageEditor', myFiles.totalCount,myFiles.totalCount);

	},
	updateStatus: function (totoalPage, currPage) {
		this.setDisabled(currPage==totoalPage);
	}
});

//图片编辑器toolbar bottom

//图片编辑器toolbar top
Ext.define('ws.tbnorth.tbfilepngviewEditor', {
	alias: 'widget.tbfilepngviewEditor',
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: ['tbfilepngviewEditor'],
	itemId: 'tbfilepngviewEditor',
	layout: {
		overflowHandler: 'Menu'
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);	// 调用父类方法
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
				winImageEditor.down('#txtCurrPage').setValue(com.getValue());
				stampcls.getStampList().each( function(item,index,allits) {
					if(item.currPage == com.getValue() || item.coverAll) {
						winImageEditor.down('#'+item.keyId).show();
						return;
					}
					winImageEditor.down('#'+item.keyId).hide();
				});
				winImageEditor.down('#currImage').setSrc(WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + myfilepngview.getFaxFileId() + "&currpage=" + com.getValue() + "");
				//设置按钮状态
				ActionBase.updateActions('imageEditor', myfilepngview.getTotalCount(),oVal);

			},
			change: function (com, nVal, oVal, opts) {
				if ((nVal > myFiles.totalCount && nVal != '1') || nVal < 1) {
					//alert('输入的页码超过了总页数！');
					if (oVal == myfilepngview.getCurrFaxFileTotal()) {
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
					if (nVal == myFiles.totalCount) {
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
	ActionBase.getAction('imageEditorlastPage')
	]
});

//创建图片编辑器
function createImgEditor(edSrc,width1,height1) {
	return Ext.create('Ext.panel.Panel', {
		title: '文档编辑',
		modal: true,
		height:height1,
		width: width1,
		//toFrontOnShow:false,
		preventHeader:true,
		//baseCls:'',
		shadow:false,
		closable:false,
		renderTo:Ext.getBody(),
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
				border: '1px solid black'
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
				if(winImageEditor.myhideType && winImageEditor.myhideType == 1) {
					return true;
				}
				var stampCount = stampcls.getStampList().getCount();

				if(stampCount > 0 && !winImageEditor.isSaveStamp) {
					newMesB.show({
						title:'WaveFax FaxViewer',
						msg: '确定要(永久)存储批注吗？',
						buttons: Ext.MessageBox.YESNO,
						closable:false,
						fn: function(btn) {
							if (btn =="no") {
								winImageEditor.myhideType = 1;
								winImageEditor.close();
							} else {
								winImageEditor.myhideType = 1;
								sendSStamp();
								winImageEditor.close();
							}
						},
						icon: Ext.MessageBox.QUESTION
					});
					return false;
				} else {
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
					winImageEditor = '';
				}
				//保存按钮
				if(opts) {
					winImageEditor.isSaveStamp = false;
					winImageEditor.myhideType =2;
				}

			},
			afterrender: function (win, opts) {
				//设置按钮状态
				ActionBase.setTargetView('imageEditor', win);
				//ActionBase.updateActions('imageEditor', myfilepngview.getTotalCount(),-1);
				//设置起始的当前页数down('#txtCurrPage').setValue(oVal)
				var paraStr = edSrc.substr(edSrc.indexOf('?') + 1, edSrc.length);
				var str = paraStr.split('&');
				var fid = str[2].split('=')[1];
				var cpage = str[3].split('=')[1];
				win.down('#txtCurrPage').setValue(cpage);
				//盖章权限
				//win.down('#coverimage').setDisabled(roleInfoModel.get('signEle')==0?false:true);

				var body = win.getEl().down("div[class*='x-panel-body']");

				body.on('select', function() {
					return false;
				});
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

						function ceateDrawPanel(rId) {
							return	Ext.create('Ext.panel.Panel', {
								autoShow:true,
								id:rId,
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
									beforerender: function (com, opts) {
										mySignet1.setPanelDimension(com);
									},
									afterrender: function (com, opts) {

										var img = com.getEl();

										img.on('select', function() {
											return false;
										});
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

											temp.cX = com.getEl().getXY()[0]- win.down('#currImage').getEl().getXY()[0];
											temp.cY = com.getEl().getXY()[1]- win.down('#currImage').getEl().getXY()[1];

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

											stampcls.getStampList().eachKey( function(item) {
												if(com.id == item) {
													lineEditor.comId=com.id;
													lineEditor.show();
													return;
												}
											});
											e.stopEvent();
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
							pWidth =  Math.abs(stampTemp.pointArr[0].x - stampTemp.pointArr[1].x);
							pHeight = Math.abs(stampTemp.pointArr[0].y - stampTemp.pointArr[1].y);

							if(stampTemp.pointArr[0].x > stampTemp.pointArr[1].x) {
								penClass.minX = stampTemp.pointArr[1].x;
							} else {
								penClass.minX = stampTemp.pointArr[0].x;
							}

							if(stampTemp.pointArr[0].y > stampTemp.pointArr[1].y) {
								penClass.minY = stampTemp.pointArr[1].y;
							} else {
								penClass.minY = stampTemp.pointArr[0].y;
							}
						}

						stampTemp.width = pWidth;
						stampTemp.height= pHeight;

						var dd = Ext.create('Ext.draw.Component', {
							width: pWidth+'px',
							height: pHeight+'px',
							viewBox:false,
							autoSize:true,
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
								width: pWidth+'px',
								height: pHeight+'px',
								"stroke-width":stampTemp.penWidth,
								stroke:stampTemp.penColor
							}],
							listeners: {
								render: function (com, opts) {
									var img = com.getEl();
									var panelCon = com.up('panel');
									img.on('select', function() {
										return false;
									});
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

										temp.cX = panelCon.getEl().getXY()[0]- win.down('#currImage').getEl().getXY()[0];
										temp.cY = panelCon.getEl().getXY()[1]- win.down('#currImage').getEl().getXY()[1];

									});
									//img单击选中事件
									img.on('click', function (e, htmel, object, opts) {
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
									});
									//img双击事件
									img.on('dblclick', function (e, htmel, object, opts) {
										stampcls.getStampList().eachKey( function(item) {
											if(panelCon.id == item) {
												lineEditor.comId=panelCon.id;
												lineEditor.show();
												return;
											}
										});
										e.stopEvent();
									});
								}
							}
						});
						//panel5.removeAll();
						panel5.add(dd);
						win.add(panel5);

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

						//如果是手画线
						panel5.setPosition(penClass.minX+stampTemp.offLeft,penClass.minY+stampTemp.offTop);

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
								viewBox:false,
								autoSize:true,
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
									"stroke-width":stampTemp.penWidth,
									stroke:stampTemp.penColor
								}]
							});

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

							tempdd.setPosition(penClass.minX+stampTemp.offLeft,penClass.minY+stampTemp.offTop);

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
					if(stampcls.getHaveStamp()) {

						var ranKey = Ext.id();
						var panel5;

						//判断是文字图章还是图片图章or笔画
						if(stampTemp.stype == 0) {
							//var store = Ext.StoreMgr.lookup('coverimagegridStoreId');
							//var record = store.getById(stampTemp.stampId);
							var record = myFiles.stampArr[stampTemp.index1];
							//var mySignet1 = new	MySignetClass(record.data.stampWidth, record.data.stampHeight);
							var mySignet1 = new	MySignetClass(record.stampWidth, record.stampHeight);
							//var bgSrc = "url("+WsConf.Url+"?req=rc&rcname=loadstamp&stampid="+stampTemp.stampId+")";
							var bgSrc = "url("+record.stampUrl+")";
							function ceateSPanel(rId) {
								return	Ext.create('Ext.panel.Panel', {
									autoShow:true,
									id:rId,
									style: {
										'padding': '0 0 0 0',
										'background-color': 'transparent',
										'border': '1px dotted blue'
									},
									bodyStyle: {
										'background-image': bgSrc,//图章路径
										'background-repeat': 'no-repeat',
										'-moz-opacity': '0.7',
										'opacity':'0.7',
										'border': '0px dotted blue',
										'filter':"progid:DXImageTransform.Microsoft.Chroma(color='white')"
									},
									listeners: {
										beforerender: function (com, opts) {

											mySignet1.setPanelDimension(com);
										},
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

												temp.cX = com.getEl().getXY()[0]- win.down('#currImage').getEl().getXY()[0];
												temp.cY = com.getEl().getXY()[1]- win.down('#currImage').getEl().getXY()[1];

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
							//var store = Ext.StoreMgr.lookup('coverimagegridStoreId');
							//var record = store.getById(stampTemp.stampId);

							//if(record.data.enumEStampAuthType != EnumEStampAuthType.satpNone) {
							if(false) {
								var tempEX = e.getX();
								var tempEY = e.getY();
								var msgStr = '图章名称:'+ record.data.stampName;
								var fileText = '';
								if(record.data.enumEStampAuthType == EnumEStampAuthType.satpPassword) {
									fileText = '图章密码';
								}
								if(record.data.enumEStampAuthType == EnumEStampAuthType.satpAccountAuth) {
									fileText = '用户密码';
								}

								promWin = Ext.create('Ext.window.Window', {
									title: '请输入密码',
									height: 120,
									width: 300,
									modal:true,
									layout: 'auto',
									items:[{
										margin:'2 0 2 7',
										xtype:'label',
										text:msgStr
									},{
										width:280,
										xtype:'textfield',
										itemId:'txtPass',
										labelWidth:60,
										labelAlign:'right',
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
												if(myfilepngview.getCurrFaxFileTotal() > 1) {

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
												Ext.Msg.alert('密码错误',response.msg);
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
								//if(myfilepngview.getCurrFaxFileTotal() > 1) {
								if(myFiles.totalCount > 1) {
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
										beforerender: function (com, opts) {
											mySignet1.setPanelDimension(com);
										},
										render: function (com, opts) {

											var img = com.getEl();

											img.on('select', function() {
												return false;
											});
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
			}
		}
	}).show();
}

var myFiles;

function initPngConfig(fid,width,height) {
	//调用
	var param = {};
	//param.sessiontoken = sto;
	//param.user = us;
	param.fileid = fid;
	//调用
	WsCall.call('viewfax', param, function (response, opts) {
		var data = Ext.JSON.decode(response.data);

		myFiles = new filepngclass(data);
		//alert(myFiles.fileId);
		//alert(myFiles.stampArr[0].stampUrl);

		sessionToken = data.sessiontoken;
		//设置stampclass 初始值
		stampcls = new stampclass();
		stampcls.getStampList().clear();

		//图片编辑器
		var imSrc = WsConf.Url + "?req=rc&rcname=loadfitpng&fileid=" + myFiles.fileId + "&currpage=1&randomTime="+(new Date()).getTime();
		//var imSrc = '0001.png';
		winImageEditor = createImgEditor(imSrc,width,height);

		winImageEditor.down('#tbPageTotal').setText(myFiles.totalCount);
		//设置按钮状态
		ActionBase.updateActions('imageEditor', myFiles.totalCount,1);
	}, function (response, opts) {
		Ext.Msg.alert('失败', response.msg);
	}, true);
}

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady( function() {

	var myUrl = window.location.href;
	myUrlPrefix = myUrl.substring(0, myUrl.lastIndexOf('/') + 1);

	var queryString = window.location.search;
	var paraStr = queryString.substr(1, queryString.length);
	var str = paraStr.split('&');

	var fileid;

	Ext.Array.each(str, function(item,index,alls) {
		var tmpStr = item.split('=');
		if(tmpStr[0] =='fileid') {
			fileid =tmpStr[1];
		}
	});
	if(fileid) {
		var width = 1000;
		var height = 700;

		//alert(sesTk);
		//var sesTk = window.frameElement.src.
		initPngConfig(fileid,width,height);
		//alert(myFiles.getTotalCount());
		// tooltip
		Ext.tip.QuickTipManager.init();
	}else{
		Ext.Msg.alert('失败', '请输入文件id');
	}

	//alert(window.frameElement.src);
	//window.parent.document.getElementById('parentDiv').innerHTML = 'now';
	//var ll = document.body;
	//var width = parseInt(window.frameElement.width)-2;
	//var height = parseInt(window.frameElement.height)-2;
	// var sesTk = '0x6FFFFFFC';

});