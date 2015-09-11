Ext.define('ws.docmanager.faxtodocsbar', {
	extend: 'Ext.toolbar.Toolbar',
	alternateClassName: 'faxtodocsbar',
	alias: 'widget.faxtodocsbar',
	itemId: 'faxtodocsbar',
	items: [{
		xtype: 'bottomProgressBar',
		width:200
	},{
		xtype: 'button',
		margin:'0 5 0 15',
		width:80,
		itemId: 'btnContinue',
		hidden: true,
		text: '继续'
	},{
		xtype: 'button',
		margin:'0 5 0 5',
		itemId: 'btnCancel',
		width:80,
		hidden: true,
		text: '取消'
	}]
});

//发送传真用win
function loadfaxtodoceditor(fileid) {
	return Ext.create('Ext.window.Window', {
		title: '编辑',
		modal:true,
		iconCls:'stampEditor',
		height: 388,
		//closeAction:'hide',
		shadow:!Ext.isIE,
		pngClass:'',
		pngGroup:'faxtodoc',
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
		tools: [{
			type: 'close',
			handler: function() {
				faxtodoceditor.hide();
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
			}]
		},{
			xtype: 'baseviewpanel'
		}],
		listeners: {
			afterrender: function(com,opts) {
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
						com.removeAll();
					}
				}

				com.pngClass.setFaxFileId(fileid);
				hidForm.setValue(fileid);
				//初始化图片浏览panel
				hidLoaded.setValue('1');
				com.pngClass.initMyfilepngMini(maskTarget, hidLoaded,upfiletype,fid, function() {
					
					setPngMiniWH(com.pngClass,com,'');
					
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
				faxtodoceditor = '';
			},
			show: function (win, opts) {

				if(faxtodoceditor.vvType && faxtodoceditor.vvType !=0) {
					ActionBase.updateActions('filepngview', faxtodoceditor.vvType.viewType,faxtodoceditor.vvType.selsCount,faxtodoceditor.vvType.totoalPage,faxtodoceditor.vvType.currPage);
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