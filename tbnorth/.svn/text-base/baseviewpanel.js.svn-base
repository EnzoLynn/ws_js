Ext.define('WS.tbnorth.baseviewpanel', {
	alternateClassName: ['baseviewpanel'],
	alias: 'widget.baseviewpanel',
	extend: 'Ext.Panel',
	itemId: 'panelfilepngview',
	layout: 'auto',
	height: 332,
	bodyBorder:false,
	myTargetView:'',
	padding: '0 0 0 0',
	style: {
		'-moz-user-select':'none'
	},
	bodyStyle: {
		//'background-color': '#FFFFFF',
		//'background-image':'url(resources/images/faxbg.png) !important',
		//'background-repeat': 'no-repeat'
	},
	autoScroll: true,
	items: [],
	listeners: {
		afterrender: function (pal, opts) {
			var palDom = pal.getEl();

			//ie下取消选择
			palDom.dom.onselectstart= function() {
				return false;
			};
			
		}
	},
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);	// 调用父类方法

		me.add({
			xtype: 'filepngviewMini',
			bodyStyle: {				
				'background-color':'transparent'
			},
			margin: '0 0 0 0'
		});
		me.add({
			xtype: 'filepngviewBig',
			bodyStyle: {
				'background-color':'transparent'
			},
			hidden: true
		});

		me.addDocked({
			xtype: 'form',
			itemId: 'formFileId',
			bodyBorder:false,
			frame: false,
			border: false,
			dock: 'top',
			items:[{
				xtype: 'tbfilepngview'
				//border:false
			}]
		});

	}
});