Ext.define('WS.infax.InforEmail', {
	extend: 'Ext.window.Window',
	alternateClassName: ['InforEmail'],
	alias: 'widget.InforEmail',
	title: '转发到邮件',
	iconCls: 'resendfax',
    height: 320,
    width: 620,
    closeAction: 'hide',
    border: false,
	bodyCls: 'panelFormBg',
    itemId: 'inforEID',
    listeners: {
		hide: function(win) {
			win.down('#forEmailID').getForm().reset();
		}    
    },
    items:[{
    	xtype: 'form',
		height: 260,
//    	width: 600,
		bodyPadding: 10,
	    url: WsConf.Url,
	    itemId: 'forEmailID',
	    border: false,
	    bodyCls: 'panelFormBg',
	    defalults: {
				labelWidth: 80
		},
    	items: [{
    		border: false,
    		bodyCls: 'panelFormBg',
    		layout: 'hbox',
    		items: [{
	    		name: 'receive',
		    	itemId: 'receiveID',
		    	xtype: 'textfield',
		    	fieldLabel: '收件人',
		    	allowBlank: false,
				blankText: '收件人不能为空',
				width: 490
				
	    	}, {
	    		margin: '0 0 0 2',
				xtype: 'button',
				width: 90,
				text: '通讯录',
				iconCls: 'addressTitle',
				handler: function () {
					if (addresspersonwin == '') {
						createSAddressStroe();						
						addresspersonwin = loadaddresspersonwin(this.up('window'));						
					}
				}
						
	    	}]
    	}, {
    		margin: '7 0 0 0',
	    	name: 'subject',
	    	xtype: 'textfield',
	    	itemId: 'subjectID',
	    	fieldLabel: '主题',
	    	width: 580
	    }, {
	    	name: 'multipart',
	    	xtype: 'displayfield',
	    	itemId: 'multipartID',
	    	fieldLabel: '附件'
	    }, {
	    	width: 580,
	    	height: 168,
	    	name: 'content',
	    	xtype: 'textarea',
	    	itemId: 'contentID',
	    	fieldLabel: '邮件内容'
	    }]
    }],
    buttons: [{
	        text: '确定',
	        itemId: 'submit',
	        formBind: true,
	        handler: function() {
	        	var me = this;
	        	var w = me.up('window');
	        	var sm = w.grid.getSelectionModel();
				var records = sm.getSelection();
				var typeGrid = w.grid.getXType();
				var buildId = '';
				if (typeGrid == 'Infaxgrid') {
					buildId = 'inFaxID';
				}else if (typeGrid == 'docgrid') {
					buildId = 'docID';
				}
				var param = {
					sessiontoken: getSessionToken(),
					receiver: w.down('#receiveID').getValue(),
					subject: w.down('#subjectID').getValue(),
					faxids: Ext.JSON.encode(buildFaxIDs(records, buildId)),
					fileIds: Ext.JSON.encode(buildFaxIDs(records, 'faxFileID')),
					content: w.down('#contentID').getValue()
				};
				WsCall.call('inforEmail', param, function(response, opts) {
					Ext.Msg.alert('成功', '转发到邮件操作成功');
				}, function(response, opts) {
					Ext.Msg.alert('失败', response.msg);
				});	
				w.hide();
	        }
	    },{
	        text: '取消',
	        handler: function() {
	        	var me = this;
	        	me.up('window').hide();
	        }
	 }]
});