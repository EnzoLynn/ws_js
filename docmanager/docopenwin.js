

function initfaxfiledocopenwin(fileId) {

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

		docopenwin.getEl().mask('正在生成缩略图...');

		var maskTarget = docopenwin.down('#formFileId');

		var hidForm = docopenwin.down('#hidFileId');
		var hidLoaded = docopenwin.down('#hidLoaded');
		hidForm.setValue(data);

		var progressBar = docopenwin.down('bottomProgressBar');
		var btnCancel = docopenwin.down('#btnCancel');
		var btnContinue = docopenwin.down('#btnContinue');
		btnCancel.hide();
		btnContinue.hide();

		if(docopenwin.pngClass != '') {
			//清空
			var palPngContainer = docopenwin.down('#filepngviewMini');
			palPngContainer.removeAll();
			//清空缩略图数组
			docopenwin.pngClass.getPngAllMini().clear();
			//清空大图数组
			docopenwin.pngClass.getPngSelBig().clear();
			//清空选择数组
			docopenwin.pngClass.getPngSels().clear();
			//单页视图Img对象
			docopenwin.pngClass.setPngContainerBig("");
			//单页图全局currPage
			docopenwin.pngClass.setCurrCountBig(0);
			//当前传真总页数
			docopenwin.pngClass.setCurrFaxFileTotal(1);
			docopenwin.pngClass.setTotalCount(0);
			//
			docopenwin.pngClass.setMiniCurPage(1);
			docopenwin.pngClass.setMiniTotalPage(0);
			docopenwin.down('#tbMiniPageTotal').setText('共'+'   ' + 0);
			//
			var tbPageTotal = docopenwin.down('#tbPageTotal');
			tbPageTotal.setText('共'+'   ' + 0);
			docopenwin.pngClass.setInsertStartPage(0);
			docopenwin.pngClass.setTotalCount(0);
			docopenwin.pngClass.setCurrFaxFileTotal(1);
			//toolbar 按钮状态
			ActionBase.updateActions('filepngview', 0,docopenwin.pngClass.getPngSels().getCount(),docopenwin.pngClass.getTotalCount(),-1);
			//清除filePath 文本和 fileId

			hidForm.setValue("");
			//设置前后插入等按钮状态
			ActionBase.updateActions('acsendfaxwin', hidForm.getValue());
			if(hidForm.getValue() == '') {
				docopenwin.down('#txtMiniCurrPage').setDisabled(true);
			} else {
				docopenwin.down('#txtMiniCurrPage').setDisabled(false);
			}
			//重新设置totalPage
			//tbFaxFileTabPng
			//调用切换视图
			if(docopenwin.pngClass.getViewType() == 1) {
				ActionBase.getAction('filepngviewviewTypeChange').execute();
			}

			docopenwin.down('#filepngviewMini').setHeight(0);
			docopenwin.down('#filepngviewMini').doLayout();
			docopenwin.down('#panelfilepngview').doLayout();
		}

		//btnCancel.setDisabled(false);
		docopenwin.pngClass = new filepngviewclass();
		//wfhandlerwin.down('#filePath').setValue('tmp'+ranId);
		docopenwin.pngClass.setFaxFileId(data);

		//初始化图片浏览panel
		hidLoaded.setValue('1');
		docopenwin.pngClass.initMyfilepngMini(maskTarget, hidLoaded,0,data, function() {
			
			setPngMiniWH(docopenwin.pngClass,docopenwin,'');

			docopenwin.down('#filepngviewMini').doLayout();
			docopenwin.down('#panelfilepngview').doLayout();
			//callMask.hide();
			docopenwin.getEl().unmask();
			//隐藏进度条
			(new Ext.util.DelayedTask()).delay(1000, function() {
				progressBar.hide();
			});
		});
		//设置前后插入等按钮状态
		ActionBase.updateActions('acsendfaxwin', hidForm.getValue());

		if(hidForm.getValue() == '') {
			docopenwin.down('#txtMiniCurrPage').setDisabled(true);
		} else {
			docopenwin.down('#txtMiniCurrPage').setDisabled(false);
		}

	}, function() {

	},true,'正在转换...',docopenwin.getEl(),10);
}

function loaddocopenwin(record,resetwin) {
	var fileid = record.data.faxFileID;
	
	function myopwclose(fid) {
		var param1 = {};
		param1.fileId = fid;
		param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");
		//调用
		WsCall.call('deleteTempFiles', param1, function (response, opts) {
		}, function (response, opts) {
		}, true);
	}
	
	if(resetwin){
		resetwin.fileid = fileid;
		return resetwin;
	}

	return Ext.create('Ext.window.Window', {
		title: '文档管理',
		modal:true,
		iconCls:'editDoc',
		height: 420,//388,
		closeAction:'hide',
		shadow:!Ext.isIE,
		fileid:fileid,
		pngClass:'',
		pngGroup:'docopenwin',
		runner:false,
		//hideMode:'offsets',
		width: 910,
		collapsible: false,
		resizable: false,
		frame: false,
		border: false,
		closable:false,
		tools: [{
			type: 'close',
			handler: function() {
				var me = this;
				myopwclose(me.up('window').down('#hidFileId').getValue());
				me.up('window').close();
			}
		}],
		dockedItems: [{
			xtype: 'docstatusbar',
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
			xtype: 'baseviewpanel'
		},{
			margin:'5 0 0 650',
			xtype:'button',
			width:100,
			text:'保存',
			handler: function() {
				var me = this;
				var param = {};
				param.fileid = me.up('window').down('#hidFileId').getValue();
				param.docid = record.data.docID;				
				param.sessiontoken = Ext.util.Cookies.get("sessiontoken");

				WsCall.call('editdoc', param, function(response, opts) {								
					myopwclose(param.fileid);
					me.up('window').close();
					docGrid.loadGrid();
				}, function(response, opts) {
					if(!errorProcess(response.code)) {
						Ext.Msg.alert('失败', response.msg);
					}
				}, true,'加载中...',Ext.getBody(),50);				
			}
		},{
			margin:'5 0 0 15',
			xtype:'button',
			width:100,
			text:'取消',
			handler: function() {
				var me = this;
				myopwclose(me.up('window').down('#hidFileId').getValue());
				me.up('window').close();
			}
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
			beforedestroy: function() {
				myopwclose();
			},
			destroy: function () {
				docopenwin = '';
			},
			show: function (win, opts) {

				var progressBar = win.down('#bottomProgressBar');
				progressBar.hide();
				//win.down('#btnFaxInfoward').setDisabled(roleInfoModel.data.sendInbox == 1);
				ActionBase.updateActions('acdocaddwin', win.down('#hidFileId').getValue());
				if(win.down('#hidFileId').getValue() == '') {
					win.down('#txtMiniCurrPage').setDisabled(true);
				} else {
					win.down('#txtMiniCurrPage').setDisabled(false);
				}

				//var tmpStr = getSendRoleStr();
				win.down('#lblMessage').hide();
				win.down('#lblMessage').setText('');
				win.down('#submitMessage').hide();
				win.down('#submitMessage').setText('');
				win.down('#menuID').hide();
				win.down('#ptypeID').hide();
				win.down('#delAllFile').hide();

				var pal = win.down('#replacePal');
				pal.removeAll();
				pal.hide();				
				
				
				initfaxfiledocopenwin(win.fileid);

				win.down('#panelfilepngview').doLayout();

			}
		}
	});
}