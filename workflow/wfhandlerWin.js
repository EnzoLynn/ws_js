var  wfreceviewin = '';

function initfaxfilewfwin(fileId,wftid) {

	var d = new Date();
	var ranId = "";
	ranId += d.getYear();
	ranId += d.getMonth();
	ranId += d.getDate();
	ranId += d.getHours();
	ranId += d.getMinutes();
	ranId += d.getSeconds();
	ranId += d.getMilliseconds();
	ranId += Math.random();

	var param = {
		fileId:fileId,
		randomId:'tmp'+ranId
	};
	param.sessiontoken = sessionToken;
	param.copy = true;

	WsCall.call('maketempfax', param, function (response, opts) {
		var data = response.data;

		wfhandlerwin.getEl().mask('正在生成缩略图...');

		var maskTarget = wfhandlerwin.down('#formFileId');

		var hidForm = wfhandlerwin.down('#hidFileId');
		var hidLoaded = wfhandlerwin.down('#hidLoaded');
		hidForm.setValue(data);

		var progressBar = wfhandlerwin.getComponent('wfstatusbar').getComponent('bottomProgressBar');
		var btnCancel = wfhandlerwin.getComponent('wfstatusbar').getComponent('btnCancel');
		var btnContinue = wfhandlerwin.getComponent('wfstatusbar').getComponent('btnContinue');
		btnCancel.hide();
		btnContinue.hide();

		if(wfhandlerwin.pngClass != '') {
			//清空
			var palPngContainer = wfhandlerwin.down('#filepngviewMini');
			palPngContainer.removeAll();
			//清空缩略图数组
			wfhandlerwin.pngClass.getPngAllMini().clear();
			//清空大图数组
			wfhandlerwin.pngClass.getPngSelBig().clear();
			//清空选择数组
			wfhandlerwin.pngClass.getPngSels().clear();
			//单页视图Img对象
			wfhandlerwin.pngClass.setPngContainerBig("");
			//单页图全局currPage
			wfhandlerwin.pngClass.setCurrCountBig(0);
			//当前传真总页数
			wfhandlerwin.pngClass.setCurrFaxFileTotal(1);
			wfhandlerwin.pngClass.setTotalCount(0);
			//
			wfhandlerwin.pngClass.setMiniCurPage(1);
			wfhandlerwin.pngClass.setMiniTotalPage(0);
			wfhandlerwin.down('#tbMiniPageTotal').setText('共'+'   ' + 0);
			//
			var tbPageTotal = wfhandlerwin.down('#tbPageTotal');
			tbPageTotal.setText('共'+'   ' + 0);
			wfhandlerwin.pngClass.setInsertStartPage(0);
			wfhandlerwin.pngClass.setTotalCount(0);
			wfhandlerwin.pngClass.setCurrFaxFileTotal(1);
			//toolbar 按钮状态
			ActionBase.updateActions('filepngview', 0,wfhandlerwin.pngClass.getPngSels().getCount(),wfhandlerwin.pngClass.getTotalCount(),-1);
			//清除filePath 文本和 fileId

			hidForm.setValue("");
			//设置前后插入等按钮状态
			ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
			if(hidForm.getValue() == '') {
				wfhandlerwin.down('#txtMiniCurrPage').setDisabled(true);
			} else {
				wfhandlerwin.down('#txtMiniCurrPage').setDisabled(false);
			}
			//重新设置totalPage
			//tbFaxFileTabPng
			//调用切换视图
			if(wfhandlerwin.pngClass.getViewType() == 1) {
				ActionBase.getAction('filepngviewviewTypeChange').execute();
			}

			//wfhandlerwin.down('#filepngviewMini').setHeight(0);
			//wfhandlerwin.down('#filepngviewMini').doLayout();
			//wfhandlerwin.down('#panelfilepngview').doLayout();
		}

		//btnCancel.setDisabled(false);
		wfhandlerwin.pngClass = new filepngviewclass();
		//wfhandlerwin.down('#filePath').setValue('tmp'+ranId);
		wfhandlerwin.pngClass.setFaxFileId(data);

		//装载批量数据
		var taskTmp = wfhandlerwin.mytasklist.get(wftid);
		if(taskTmp) {
			taskTmp.fileid = data;
		}

		//初始化图片浏览panel
		hidLoaded.setValue('1');
		wfhandlerwin.pngClass.initMyfilepngMini(maskTarget, hidLoaded,0,data, function() {
			setPngMiniWH(wfhandlerwin.pngClass,wfhandlerwin,'');

			//wfhandlerwin.down('#filepngviewMini').doLayout();
			//wfhandlerwin.down('#panelfilepngview').doLayout();
			//callMask.hide();
			wfhandlerwin.getEl().unmask();
			//隐藏进度条
			(new Ext.util.DelayedTask()).delay(1000, function() {
				progressBar.hide();
			});
		});
		//设置前后插入等按钮状态
		ActionBase.updateActions('acsendfaxwin', hidForm.getValue());

		if(hidForm.getValue() == '') {
			wfhandlerwin.down('#txtMiniCurrPage').setDisabled(true);
		} else {
			wfhandlerwin.down('#txtMiniCurrPage').setDisabled(false);
		}

	}, function() {

	},true,'正在转换...',wfhandlerwin.getEl(),10);
}

function slaveTaskDownload() {
	var param = {
		sfileid: slaveTask_RightMenu.sfileid,
		faxfileid:slaveTask_RightMenu.faxfileid,
		downType: 'slavefile',
		fileName: slaveTask_RightMenu.fileName,
		sessiontoken: getSessionToken()
	}
	WsCall.downloadFile('download', param);
}

Ext.create('Ext.data.ArrayStore', {
	//model: 'defaultgridModel',
	storeId: 'wfrewinGridStore',
	fields: [{
		name: 'outFaxID',
		type: 'string'
	},{
		name: 'waveFaxUserID',
		type: 'string'
	},{
		name:'waveFaxPubFolderID',
		type:'string'
	},{
		name: 'faxNumber',
		type: 'string'
	},{
		name: 'faxNumberExt',
		type: 'string'
	},{
		name: 'sentUser',
		type: 'string'
	},{
		name: 'recipient',
		type: 'string'
	},{
		name: 'comment',
		type: 'string'
	},{
		name: 'recipientEmail',
		type: 'string'
	},{
		name: 'recipientMobileNumber',
		type: 'string'
	},{
		name: 'recipientOrganization',
		type: 'string'
	},{
		name: 'subject',
		type: 'string'
	}
	],
	autoLoad: false,
	data: []
});

Ext.define('WS.workflow.wfrewinGrid', {
	alternateClassName: ['wfrewinGrid'],
	alias: 'widget.wfrewinGrid',
	extend: 'Ext.grid.Panel',
	store: 'wfrewinGridStore',
	title:'传真信息列表',
	multiSelect: true,
	viewConfig: {
		loadMask:false
	},
	columns: [{
		text: '流水号',
		dataIndex: 'outFaxID',
		width: 80
	},{
		text: '号码',
		dataIndex: 'faxNumber',
		width: 150
	},{
		text: '发件人',
		dataIndex: 'sentUser',
		width: 100
	},{
		text: '收件人',
		dataIndex: 'recipient',
		width: 100
	},{
		text: '注释',
		dataIndex: 'comment',
		width: 200
	}
	]
});

//wfReceive
function loadwfreceviewin(record,rule,tmpr) {
	return Ext.create('Ext.window.Window', {
		title:'传真信息',
		height:300,
		width:650,
		layout:'fit',
		modal:true,
		//closeAction:'hide',
		items:[{
			xtype:'wfrewinGrid',
			listeners: {
				itemdblclick: function(view,record,htmlel,index,e,opts) {
					var me = this;
					var win = Ext.create('WS.outfax.ModeFaxInfo', {
						outFaxID: record.get('outFaxID'),
						grid:false,
						orcrecord:record
					});

					win.down('form').getForm().loadRecord(record);
					win.show('', function() {
						if(record.data.waveFaxUserID == 0 && record.data.waveFaxPubFolderID == 0) {//外部
							win.down('#faxNum').focus(true);
						}

						win.down('#subject').setDisabled(true);
						if(workflowActionDis(rule,'EDIT_RECIPIENT')) {
							win.down('#faxNum').setDisabled(true);
							win.down('#faxNumExt').setDisabled(true);
							win.down('#email').setDisabled(true);
							win.down('#mobile').setDisabled(true);
							win.down('#recipient').setDisabled(true);
							win.down('#organiz').setDisabled(true);
						}
						if(workflowActionDis(rule,'COMMENT_FAX')) {
							win.down('#comment').setDisabled(true);
						}
						if(record.data.waveFaxUserID != 0 || record.data.waveFaxPubFolderID != 0) {//内部
							win.down('#faxNum').setDisabled(true);
							win.down('#faxNumExt').setDisabled(true);
							win.down('#email').setDisabled(true);
							win.down('#mobile').setDisabled(true);
							win.down('#recipient').setDisabled(true);
							win.down('#organiz').setDisabled(true);
						}
					});
				},
				afterrender: function(grid) {
					var vals = record.data;

					if(tmpr) {
						grid.getStore().loadData(Ext.JSON.decode(tmpr.recicoment));
						//alert(1);
						return;
					}
					//调用call
					var param = {};
					//param.docid = vals.docID;
					param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
					param.resourceType = vals.resourceType;
					param.resourceIDs = vals.resourceID;
					param.fileid = vals.fileID;

					WsCall.call('getorclist', param, function(response, opts) {
						var data = Ext.JSON.decode(response.data);
						grid.getStore().loadData(data);
					}, function(response, opts) {
						if(!errorProcess(response.code)) {
							Ext.Msg.alert('失败', response.msg);
						}
					}, true,'加载中...',Ext.getBody(),50);
				}
			}
		}],
		buttons:[{
			text:'确定',
			handler: function() {
				var me = this;
				var grid = me.up('window').down('wfrewinGrid');
				var sm = grid.getSelectionModel();
				sm.selectAll(true);
				var sels = sm.getSelection();
				//alert(sels.length);
				var reArr = new Array();
				Ext.Array.each(sels, function(sel) {
					reArr.push(sel.data);
				});
				var tmp = wfhandlerwin.mytasklist.get(record.data.workflowTaskID);
				tmp.hadComent = true;
				tmp.recicoment = Ext.JSON.encode(reArr);
				//wfhandlerwin.recicoment = Ext.JSON.encode(reArr);
				//alert(Ext.JSON.encode(reArr));
				me.up('window').close();

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

//wfcomentwin
function loadwfcomentwin(record) {
	return Ext.create('Ext.window.Window', {
		title:'注释',
		height:195,
		width:350,
		modal:true,
		items:[{
			xtype:'textarea',
			margin:'4 2 2 4',
			itemId:'comTxta',
			fieldLabel: '注释',
			labelWidth:100,
			rows:6,
			width:330,
			labelAlign:'top',
			validator: function(val) {
				return myTextValidator(val,250);
			}
		}],
		buttons:[{
			text:'确定',
			handler: function() {
				var me = this;
				var txtAr = me.up('window').down('textarea');
				if(txtAr.isValid()) {
					var tmp = wfhandlerwin.mytasklist.get(record.data.workflowTaskID);
					tmp.hadComent = true;
					tmp.wfcoment = txtAr.getValue();
					//wfhandlerwin.hadComent = true;
					//wfhandlerwin.wfcoment = txtAr.getValue();
					me.up('window').close();
				}
			}
		},{
			text:'取消',
			handler: function() {
				var me = this;
				// var tmp = wfhandlerwin.mytasklist.get(record.data.workflowTaskID);
				// if(tmp && tmp.wfcoment !='') {
				// var txtAr = me.up('window').down('textarea');
				// txtAr.setValue(tmp.wfcoment);
				// }
				me.up('window').close();
			}
		}]
	});
}

//创建一个上下文菜单
var slaveTask_RightMenu = Ext.create('Ext.menu.Menu', {
	items: [{
		itemId:'slaveFDownload',
		iconCls: 'infaxdownloadICON',
		text:'下载附件',
		handler: function() {
			slaveTaskDownload();
		}
	}]
});

//工作流处理用win
function loadwfhandlerwin(rule,item,record,taskobj,resetWin) {
	
	
	
	//检查已做的处理
	function checkBeen(mywin) {

		var tmpR = wfhandlerwin.mytasklist.get(mywin.record.data.workflowTaskID);

		var rulstr =getWorkflowActionText(mywin.myrule);
		if(mywin.record.data.resourceType != 'OUTFAX') {
			rulstr = rulstr.replace('填写收件人'+',','');
			rulstr = rulstr.replace('填写收件人','');
		}
		rulstr = rulstr.replace('浏览文档'+',','');
		rulstr = rulstr.replace('浏览文档','');

		//'填写收件人,';
		if((!workflowActionDis(mywin.myrule,'EDIT_RECIPIENT')|| !workflowActionDis(mywin.myrule,'COMMENT_FAX'))
		&& mywin.record.data.resourceType == 'OUTFAX'  ) {
			if(tmpR.recicoment != '') {
				rulstr = rulstr.replace('填写收件人'+',','');
				rulstr = rulstr.replace('填写收件人','');
				rulstr = rulstr.replace('设置文档注释'+',','');
				rulstr = rulstr.replace('设置文档注释','');
			}
		}

		//'编辑文件内容,';
		if(!workflowActionDis(mywin.myrule,'EDIT_DOC')) {
			if(tmpR.hadEdit == true) {
				rulstr = rulstr.replace('编辑文件内容'+',','');
				rulstr = rulstr.replace('编辑文件内容','');
			}
		}

		//'设置文档注释,';
		if(!workflowActionDis(mywin.myrule,'COMMENT_FAX') &&  mywin.record.data.resourceType != 'OUTFAX') {
			if(tmpR.hadComent == true) {
				rulstr = rulstr.replace('设置文档注释'+',','');
				rulstr = rulstr.replace('设置文档注释','');
			}
		}

		//'完成电子表单内容,';
		if(!workflowActionDis(mywin.myrule,'EDITFORM_DOC')) {
			if(tmpR.tplstr != '') {
				rulstr = rulstr.replace('录入表单数据'+',','');
				rulstr = rulstr.replace('录入表单数据','');
			}
		}

		//'WaveFax签章,';
		if(!workflowActionDis(mywin.myrule,'STAMP_DOC')) {
			if(tmpR.hadStamp == true) {
				rulstr = rulstr.replace('WaveFax签章'+',','');
				rulstr = rulstr.replace('WaveFax签章','');
			}
		}
		return rulstr;
	}

	function closeWfWin(me) {
		//判断是否锁定
		var mywin = me.up('window');
		var param = {};

		if(mywin.taskobj) {

			var gobj = new Array();
			Ext.Array.each(mywin.taskobj, function(rec) {
				gobj.push({
					taskid:rec.data.workflowTaskID,
					itemid:rec.data.currentWorkflowItemID
				});
			});
			param.taskobj =Ext.JSON.encode(gobj);
		} else {
			var sobj = new Array();
			sobj.push({
				taskid:mywin.record.data.workflowTaskID,
				itemid:mywin.record.data.currentWorkflowItemID
			});
			param.taskobj = Ext.JSON.encode(sobj);
		}

		//param.docid = vals.docID;
		param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
		param.block = false;

		var fileid = mywin.down('#hidFileId').getValue();
		var fileids='';
		mywin.mytasklist.each( function(item) {
			if(item.fileid != '') {
				fileids+=item.fileid+',';
			}
		});
		if(fileids != '') {
			fileids = fileids.substring(0,fileids.length-1);
		}
		WsCall.call('locktask', param, function(response, opts) {

			var param1 = {};
			param1.fileids = fileids;
			param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
			//调用
			WsCall.call('deleteTempFiles', param1, function (response, opts) {
			}, function (response, opts) {
			}, true);
			if(currGrid && currGrid.loadGrid) {
				currGrid.getStore().load();
			}
		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				var param1 = {};
				param1.fileids = fileids;
				param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
				//调用
				WsCall.call('deleteTempFiles', param1, function (response, opts) {
				}, function (response, opts) {
				}, true);
				Ext.Msg.alert('失败', response.msg);
			}
			if(currGrid && currGrid.loadGrid) {
				currGrid.getStore().load();
			}
		}, true,'加载中...',Ext.getBody(),50);
		mywin.close();
	}

	if(resetWin) {
		//resetWin.setTitle('任务处理面板'+'('+item.acttivityName+')');
		//重置
		resetWin.mytasklist.clear();
		resetWin.pngClass='';		
		resetWin.myrule=rule;
		resetWin.runner=false;
		resetWin.curWfTid='';
		
		resetWin.tplstr='';
		resetWin.tplid='none';
		resetWin.wfcoment='';
		resetWin.recicoment='';
		resetWin.hadComent=false;
		resetWin.hadEdit=false;
		resetWin.hadStamp=false;
		resetWin.record=record;
		resetWin.taskobj=taskobj;
		
		wfwinshow(resetWin,resetWin.record,resetWin.myrule);

		
		//装载数据
		resetWin.curWfTid = resetWin.record.data.workflowTaskID;
		resetWin.mytasklist.add(resetWin.record.data.workflowTaskID, {
			tplstr:'',
			tplid:'none',
			wfcoment:'',
			recicoment:'',
			hadComent:false,
			hadEdit:false,
			hadStamp:false,
			record:resetWin.record,
			fileid:''
		});
		resetWin.down('#ptgridPal').removeAll();
		//添加批量审批窗口
		if(resetWin.taskobj) {
			var gData = new Array();
			Ext.Array.each(resetWin.taskobj, function(rec) {
				gData.push({
					workflowTaskID:rec.data.workflowTaskID,
					faxfileid:rec.data.faxFileID
				});
				resetWin.mytasklist.add(rec.data.workflowTaskID, {
					tplstr:'',
					tplid:'none',
					wfcoment:'',
					recicoment:'',
					hadComent:false,
					hadEdit:false,
					hadStamp:false,
					record:rec,
					fileid:''
				});
			});
			Ext.data.StoreManager.lookup('passtasklistGridStore').loadData(gData);
			resetWin.down('#ptgridPal').add({
				xtype:'passtasklistGrid',
				width:88,
				height:358
			});
			resetWin.down('#ptgridPal').setWidth(90);
			resetWin.down('#fsComPal').setWidth(970);
			resetWin.setWidth(1000);			
		} else {			
			resetWin.down('#ptgridPal').setWidth(0);
			resetWin.setWidth(910);
			resetWin.down('#fsComPal').setWidth(880);
			//resetWin.center();
		}
		return resetWin;
	}

	return Ext.create('Ext.window.Window', {
		title: '任务处理面板'+'('+item.acttivityName+')',
		modal:true,
		iconCls:'docAdd',
		height: 579,
		closeAction:'hide',
		shadow:!Ext.isIE,
		pngClass:'',
		pngGroup:'wfhandlerwin',
		defaultFitPng:true,
		myrule:rule,
		runner:false,
		curWfTid:'',
		mytasklist:new Ext.util.MixedCollection(),
		tplstr:'',
		tplid:'none',
		wfcoment:'',
		recicoment:'',
		hadComent:false,
		hadEdit:false,
		hadStamp:false,
		record:record,
		taskobj:taskobj,
		hideMode:'offsets',
		width: 1000,
		layout: 'anchor',
		collapsible: false,
		resizable: false,
		frame: false,
		border: false,
		closable:false,
		tools: [{
			type: 'close',
			handler: function() {
				closeWfWin(this);
			}
		}],
		defaults: {
			frame: false,
			border: false
		},
		dockedItems: [{
			xtype: 'wfstatusbar',
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
			}]
		},{
			xtype:'container',
			layout: {
				type:'table',
				columns:2
			},
			items:[{
				xtype:'container',
				rowspan:2,
				width:90,
				//height:358,
				itemId:'ptgridPal',
				items:[]
			},{
				xtype: 'baseviewpanel',
				width:900
			},{
				xtype:'container',
				//width:880,
				title:'附件',
				items:[{
					xtype:'toolbar',
					autoScroll:true,
					itemId:'attToolbar',
					defaults: {
						xtype: 'tbtext',
						height:18,
						listeners: {
							afterrender: function(com,opts) {
								var comEl = com.el;
								comEl.on('click', function() {
									var allL = com.up('container').query('tbtext');
									Ext.Array.each(allL, function(item) {
										item.el.setStyle('border','none');
									});
									comEl.setStyle('border','1px solid blue');
									//alert(com.sid);
								});
								comEl.on('contextmenu', function(e) {
									var allL = com.up('container').query('tbtext');
									Ext.Array.each(allL, function(item) {
										item.el.setStyle('border','none');
									});
									comEl.setStyle('border','1px solid blue');
									e.stopEvent();

									slaveTask_RightMenu.sfileid = com.sid;
									slaveTask_RightMenu.faxfileid = record.data.faxFileID;
									slaveTask_RightMenu.fileName = com.sname;
									slaveTask_RightMenu.showAt(e.getXY());
								});
							}
						}
					},
					items:[]
				}]
			}]
		},{
			xtype: 'form',
			itemId:'wfBaseForm',
			layout: {
				type:'anchor'
			},
			////bodyCls: 'panelFormBg',
			frame: false,
			border: false,
			items: [{
				xtype:'fieldset',
				title:'任务审批',
				layout: {
					type:'table',
					columns:2
				},
				collapsable:false,
				margin: '0 0 0 10',
				height:134,
				itemId:'fsComPal',
				width:970,
				defaults: {
					xtype: 'textfield',
					labelAlign: 'right',
					margin: '2 0 2 10',
					labelPad: 1,
					labelWidth: 120,
					width: 400,
					frame: false,
					border: false
				},
				items:[{
					xtype:'displayfield',
					fieldLabel: '任务主题',
					width:800,
					colspan:2,
					itemId:'customid'
				},{
					xtype: 'fieldcontainer',
					fieldLabel: '审批结果',
					colspan:2,
					width:400,
					style: {
						'font-weight':'bolder'
					},
					layout:'hbox',
					defaults: {
						name: 'contorl',
						margin:'0 4 0 4',
						style: {
							'font-weight':'bolder'
						},
						xtype:'radio'
					},
					items:[{
						boxLabel:'通过',
						itemId:'passed',
						checked:true
					},{
						boxLabel:'拒绝',
						margin:'0 4 0 20',
						style: {
							'font-weight':'bolder',
							'color':'red'
						}
					}]
				},{
					xtype:'textarea',
					fieldLabel: '处理意见',
					width:800,
					rows:2,
					itemId:'comment',
					validator: function(val) {
						return myTextValidator(val,250);
					}
				}]

			}]
		},{
			xtype:'container',
			margin:'5 5 0 650',
			defaults: {
				margin:'0 5 0 10',
				width:100,
				xtype:'button'
			},
			items:[{
				text:'完成',
				handler: function() {
					var form = wfhandlerwin.down('#wfBaseForm').getForm();
					if(!form.isValid()) {
						return;
					}

					function subings(tmpr,okfun,nocheck) {
						//alert(docaddwin.down('#hidFileId').getValue());// tmp.fileid==''?record.data.faxfileid:tmp.fileid;
						var fileid = tmpr.fileid;
						var passed = wfhandlerwin.down('#passed').getValue();
						var comment = wfhandlerwin.down('#comment').getValue();
						if(fileid != '' || nocheck) {
							//调用Call 上传文档信息
							var param = {};
							param.taskid = tmpr.record.data.workflowTaskID;
							param.itemid = tmpr.record.data.currentWorkflowItemID;
							param.resourceid = tmpr.record.data.resourceID;
							param.resourcetype = tmpr.record.data.resourceType;
							//taskExtData
							param.hadedit = tmpr.hadEdit || tmpr.hadStamp;
							param.curid = tmpr.record.data.faxFileID;

							param.fileid = fileid;
							param.tplid = tmpr.tplid;
							param.tplstr = tmpr.tplstr;
							//param.treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
							param.passed = passed;
							param.comment = comment;
							//需要判断是否修改过注释、收件人
							param.hadcoment = tmpr.hadComent;
							param.wfcoment = tmpr.wfcoment;
							param.recicoment = tmpr.recicoment;
							param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

							WsCall.call('dotaskaction', param, function(response, opts) {
								var param1 = {};
								param1.fileId = fileid;
								param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
								//调用
								WsCall.call('deleteTempFiles', param1, function (response, opts) {
								}, function (response, opts) {
								}, true);
								if(okfun) {
									okfun();
								}
							}, function(response, opts) {
								if(!errorProcess(response.code)) {
									Ext.Msg.alert('失败', response.msg);
								}
							}, true,'加载中...',Ext.getBody(),50);
						} else {
							Ext.Msg.alert('提示','请添加至少1个文件');
						}
					}

					var tmp = wfhandlerwin.mytasklist.get(wfhandlerwin.curWfTid);
					var lcount = wfhandlerwin.mytasklist.getCount();
					if(lcount>1) {

						//alert('p');
						var prStamp = newMesB.show({
							title: '批量审批',
							iconCls:'doApprs',
							msg: '请稍候...',
							progressText: '正在提交审批...',
							width:300,
							progress:true,
							closable:false
						});

						// this hideous block creates the bogus progress
						var f = function(v) {
							var cV = v+1;
							if(cV == lcount) {
								var i = cV/lcount;
								prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
								(new Ext.util.DelayedTask()).delay(2000, function() {
									prStamp.hide();
								});
							} else {
								var i = cV/lcount;
								prStamp.updateProgress(i, '已完成 '+Math.round(100*i)+'% ');
							}
						};
						wfhandlerwin.mytasklist.each( function(item,index) {
							if(index < lcount) {
								subings(item,false,true);
								f(index);
							}
							if(index == lcount-1) {
								f(lcount-1);
								(new Ext.util.DelayedTask()).delay(2000, function() {
									wfhandlerwin.close();
									(new Ext.util.DelayedTask()).delay(2000, function() {
										taskGrid.getStore().load();
									},false);
								},false);
							}
						});
					} else {
						var str = checkBeen(wfhandlerwin);
						var tmpr = wfhandlerwin.mytasklist.get(wfhandlerwin.record.data.workflowTaskID);
						if(str == '') {
							subings(tmpr, function() {
								wfhandlerwin.close();
								(new Ext.util.DelayedTask()).delay(1000, function() {
									taskGrid.getStore().load();
								},false);
							});
						} else {
							newMesB.show({
								title:'消息',
								msg: '您还有如下的审批操作没有完成:'+'<br/>'+str+'<br/>'+'是否确定通过?',
								buttons: Ext.MessageBox.YESNO,
								closable:false,
								fn: function(btn) {
									if (btn =="yes") {
										subings(tmpr, function() {
											wfhandlerwin.close();
											taskGrid.loadGrid();
										});
									}
								},
								icon: Ext.MessageBox.QUESTION
							});
						}
					}

				}
			},{
				text:'取消',
				handler: function() {
					closeWfWin(this);
				}
			}]
		}],
		listeners: {
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
			hide:function(){
				if(wfcomentwin != '') {
					wfcomentwin.destroy();
					wfcomentwin = '';
				}
				if(wfreceviewin!= '') {
					wfreceviewin.destroy();
					wfreceviewin = '';
				}
				if(wf_inputDataWin != '') {
					//wf_inputDataWin.destroy();
					//wf_inputDataWin = '';
					wf_inputDataWin.myreset = true;
				}
			},
			destroy: function () {

				//wfhandlerwin = '';

				if(wfcomentwin != '') {
					wfcomentwin.destroy();
					wfcomentwin = '';
				}
				if(wfreceviewin!= '') {
					wfreceviewin.destroy();
					wfreceviewin = '';
				}
				if(wf_inputDataWin != '') {
					//wf_inputDataWin.destroy();
					//wf_inputDataWin = '';
					wf_inputDataWin.myreset = true;
				}
			},
			show: function (win, opts) {	
				if(win.hasloaded){					
					return;
				}			
				win.hasloaded = true;
				wfwinshow(win,win.record,win.myrule);

				//重置
				win.mytasklist.clear();
				//装载数据
				win.curWfTid = win.record.data.workflowTaskID;
				win.mytasklist.add(win.record.data.workflowTaskID, {
					tplstr:'',
					tplid:'none',
					wfcoment:'',
					recicoment:'',
					hadComent:false,
					hadEdit:false,
					hadStamp:false,
					record:win.record,
					fileid:''
				});

				//添加批量审批窗口
				if(win.taskobj) {
					var gData = new Array();
					Ext.Array.each(win.taskobj, function(rec) {
						gData.push({
							workflowTaskID:rec.data.workflowTaskID,
							faxfileid:rec.data.faxFileID
						});
						win.mytasklist.add(rec.data.workflowTaskID, {
							tplstr:'',
							tplid:'none',
							wfcoment:'',
							recicoment:'',
							hadComent:false,
							hadEdit:false,
							hadStamp:false,
							record:rec,
							fileid:''
						});
					});
					Ext.data.StoreManager.lookup('passtasklistGridStore').loadData(gData);
					win.down('#ptgridPal').add({
						xtype:'passtasklistGrid',
						width:88,
						height:358
					});

				} else {
					win.down('#ptgridPal').setWidth(0);
					win.setWidth(910);
					win.down('#fsComPal').setWidth(880);
					win.center();
				}

				//alert(wfhandlerwin.curWfTid);
				//alert(win.pngClass.getFaxFileId());
			}
		}
	});

}