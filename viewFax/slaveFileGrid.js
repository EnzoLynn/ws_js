function slaveGridDownload() {
	var sels = slaveFGrid.getSelectionModel().getSelection();

	var param = {
		sfileid: sels[0].data.fileId,
		faxfileid:currGrid.getSelectionModel().getSelection()[0].data.faxFileID,
		downType: 'slavefile',
		fileName: sels[0].data.fileName,
		sessiontoken: getSessionToken()
	}
	WsCall.downloadFile('download', param);
}

//创建一个上下文菜单
var slaveFileGrid_RightMenu = Ext.create('Ext.menu.Menu', {
	items: [{
		itemId:'slaveFDownload',
		disabled:true,
		iconCls: 'infaxdownloadICON',
		text:'下载附件',
		handler: function() {
			slaveGridDownload();
		}
	}]
});

function getFileIcon(suffix) {
	var src = 'resources/images/fileimg/';
	var tmpSuf = suffix.toLowerCase().substring(suffix.lastIndexOf('.')+1,suffix.length);
	if(tmpSuf == '7z')
		return src +'7z.png';
	if(tmpSuf == 'bmp')
		return src +'bmp.png';
	if(tmpSuf == 'bz2')
		return src +'bz2.png';
	if(tmpSuf == 'csv')
		return src +'csv.png';
	if(tmpSuf == 'dll')
		return src +'dll.png';
	if(tmpSuf == 'doc')
		return src +'doc.png';
	if(tmpSuf == 'docx')
		return src +'docx.png';
	if(tmpSuf == 'gif')
		return src +'gif.png';
	if(tmpSuf == 'gz')
		return src +'gz.png';
	if(tmpSuf == 'inf')
		return src +'inf.png';
	if(tmpSuf == 'ini')
		return src +'ini.png';
	if(tmpSuf == 'jpg')
		return src +'jpg.png';
	if(tmpSuf == 'log')
		return src +'log.png';
	if(tmpSuf == 'mdb')
		return src +'mdb.png';
	if(tmpSuf == 'mdbx')
		return src +'mdbx.png';
	if(tmpSuf == 'mp3')
		return src +'mp3.png';
	if(tmpSuf == 'msi')
		return src +'msi.png';
	if(tmpSuf == 'pdf')
		return src +'pdf.png';
	if(tmpSuf == 'png')
		return src +'png.png';
	if(tmpSuf == 'ppt')
		return src +'ppt.png';
	if(tmpSuf == 'pptx')
		return src +'pptx.png';
	if(tmpSuf == 'rar')
		return src +'rar.png';
	if(tmpSuf == 'tar')
		return src +'tar.png';
	if(tmpSuf == 'tgz')
		return src +'tgz.png';
	if(tmpSuf == 'tif')
		return src +'tif.png';
	if(tmpSuf == 'txt')
		return src +'txt.png';
	if(tmpSuf == 'xls')
		return src +'xls.png';
	if(tmpSuf == 'xlsx')
		return src +'xlsx.png';
	if(tmpSuf == 'xps')
		return src +'xps.png';
	if(tmpSuf == 'zip')
		return src +'zip.png';

	return src +'def.png';
}

//=====================================================================================//
//=============================defaultgrid    store    ================================//
//=====================================================================================//
function createSlaveFGridStore(slaveFGridArr) {
	Ext.StoreMgr.removeAtKey ('slaveFileGridStoreId');
	Ext.create('Ext.data.ArrayStore', {
		//model: 'defaultgridModel',
		storeId: 'slaveFileGridStoreId',
		fields: [{
			name: 'fileId',
			type: 'string'
		},{
			name: 'fileName',
			type: 'string'
		}
		],
		autoLoad: false,
		pageSize: 10,
		data: slaveFGridArr
	});
}

//=====================================================================================//
//=============================defaultgrid             ================================//
//=====================================================================================//

Ext.define('ws.viewFax.slaveFileGrid', {
	alternateClassName: ['slaveFileGrid'],
	alias: 'widget.slaveFileGrid',
	extend: 'Ext.grid.Panel',
	store: 'slaveFileGridStoreId',
	viewConfig: {
		loadMask:false
	},
	//bodyCls: 'panelFormBg',
	columns: [{
		text: '编号',
		dataIndex: 'fileId',
		hidden: true
	},{
		text: '文件名',
		dataIndex: 'fileName',
		flex: 1,
		renderer: function(value, metaData, record) {
			return "<div><img src='"+getFileIcon(value)+"' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';
		}
	}
	],
	listeners: {		
		itemclick: function(grid,record,hitem,index,e,opts) {
			if(!e.ctrlKey && !e.shiftKey) {
				var sm = grid.getSelectionModel();
				sm.deselectAll(true);
				sm.select(record,true,false);
			}
		},
		itemcontextmenu: function(view,rec,item,index,e,opts) {
			e.stopEvent();
			var me = this;
			me.getSelectionModel().select(rec);
			slaveFileGrid_RightMenu.showAt(e.getXY());
		},
		beforeitemmousedown: function(view, record, item, index, e, options) {
			if (e.button == 2)
				return false;
			return true;
		},
		selectionchange: function(view, seles, op) {
			slaveFileGrid_RightMenu.down('#slaveFDownload').setDisabled(!(seles.length == 1));
		},
		itemdblclick: function() {
			newMesB.show({
				title : '下载',
				msg : '确定要下载该文件吗？',
				buttons : Ext.MessageBox.YESNO,
				closable : true,
				fn : function(btn) {
					if (btn == "yes") {
						slaveGridDownload();
					}
				},
				icon : Ext.MessageBox.QUESTION
			});
		}
	}
});

function createSlaveFileGrid(divid,cugd) {
	return Ext.create('ws.viewFax.slaveFileGrid', {
		store:Ext.data.StoreManager.lookup('slaveFileGridStoreId')	
		//grid:cugd,
		//renderTo:divid
	});
}

