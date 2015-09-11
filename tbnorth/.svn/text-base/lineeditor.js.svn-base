lineColorPicker = Ext.create('Ext.menu.ColorPicker', {
	value: '0000FF',
	handler: function(cm, color) {

		var temp = stampcls.getStampList().getByKey(lineEditor.comId);
		temp.penColor = '#'+color;
		lineEditor.down('#linecolorBtn').setText('颜色'+" <label style=background-color:#"+color+";>&nbsp;&nbsp;&nbsp;</label> ");

		var html = '<hr color='+temp.penColor+' size='+temp.penWidth+'/>';
		lineEditor.down('#preDis').update(html);
	}
});

function loadLineEditor() {
	//初始化笔画线编辑器
	return Ext.create('Ext.window.Window', {
		title: '线属性',
		modal:true,
		closeAction:'hide',
		height: 200,
		width: 400,
		resizable:false,
		layout: {
			type:'table',
			columns:2
		},
		defaults: {
			margin:'2 2 2 2',
			labelAlign:'right'
		},
		items:[{
			xtype:'button',
			itemId:'linecolorBtn',
			tooltip: '文字颜色',
			text:'颜色'+' <label style=background-color:#0000FF;>&nbsp;&nbsp;&nbsp;</label> ',
			menu: lineColorPicker
		},{
			xtype: 'numberfield',
			itemId:'lineWidth',
			fieldLabel: '线宽',
			value: 4,
			maxValue: 20,
			minValue: 4,
			maxText: '最大为20',
			minText: '最小为4',
			listeners: {
				spin: function(com,dir,opts) {
					var temp = stampcls.getStampList().getByKey(lineEditor.comId);
					//temp.penWidth = ''+com.getValue()+'';
					var html = '<hr color='+temp.penColor+' size='+com.getValue()+'/>';
					lineEditor.down('#preDis').update(html);
				},
				change: function(com,nVal,oVal,opts) {
					var temp = stampcls.getStampList().getByKey(lineEditor.comId);
					//temp.penWidth = ''+nVal+'';
					var html = '<hr color='+temp.penColor+' size='+nVal+'/>';
					lineEditor.down('#preDis').update(html);
				}
			}

		},{
			width:120,
			xtype:'displayfield',
			html:'预览:',
			colspan:2
		},{
			width:380,
			itemId:'preDis',
			xtype:'displayfield',
			html:'<hr color=#0000FF size=4/>',
			colspan:2
		}],
		buttons:[{
			text:'确定',
			handler: function() {
				var me = this;
				var win1 = me.up('window');
				if(!win1.down('#lineWidth').validate()) {
					return;
				}
				var temp = stampcls.getStampList().getByKey(lineEditor.comId);
				var newWidth = win1.down('#lineWidth').getValue();

				var flexNum = newWidth -temp.penWidth;
				temp.penWidth = ''+newWidth+'';
				var curSel = winImageEditor.down('#'+lineEditor.comId+'');
				curSel.removeAll();
				
				//根据线宽调整线坐标
				
				var paStr = '';
				Ext.Array.each(temp.pointArr, function(point,index,all) {
					if(index==0) {
						paStr +="M"+point.x+" "+point.y+" ";

					} else {
						paStr += "L"+point.x+" "+point.y+" "
					}

				});
				
				var dd = Ext.create('Ext.draw.Component', {
					width: temp.width+flexNum,
					height: temp.height+flexNum,
					//viewBox:false,
					//autoSize:true,
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
						x:2,
						y:2,
						width:  temp.width+flexNum,
						height: temp.height+flexNum,
						// path: "M1 1 Q50 50 220 223 Q233 220 420 423",
						"stroke-width":temp.penWidth,
						stroke:temp.penColor
					}]
				});
				curSel.setHeight(curSel.getHeight()+flexNum);
				curSel.setWidth(curSel.getWidth()+flexNum);
				temp.width += flexNum;
				temp.height += flexNum;
				curSel.add(dd);
				win1.close();
			}
		},{
			text:'取消',
			handler: function() {
				var me = this;
				me.up('window').close();
			}
		}],
		listeners: {
			show: function() {
				var me = this;
				var curSel = winImageEditor.down('#'+lineEditor.comId+'');
				var temp = stampcls.getStampList().getByKey(curSel.id);
				lineEditor.down('#lineWidth').setValue(temp.penWidth);
				var html = '<hr color='+temp.penColor+' size='+temp.penWidth+'/>';
				lineEditor.down('#preDis').update(html);
				lineEditor.down('#linecolorBtn').setText('颜色'+" <label style=background-color:"+temp.penColor+";>&nbsp;&nbsp;&nbsp;</label> ");
				lineColorPicker.picker.select(temp.penColor);
			}
		}

	});
}

