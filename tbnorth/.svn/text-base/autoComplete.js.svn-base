var acDiv = '';

//自动完成控制类
var acSelItemsControl = {
	itemTotal:3,
	curItem : -1,
	itemList:new Ext.util.MixedCollection(),
	initAc: function(total) {
		var me = this;
		me.itemTotal = total;
		me.curItem = -1;
		me.itemList.clear();
	},
	upArrow: function() {
		var me = this;
		if(me.curItem > 0)
			me.curItem--;
		me.changCls();
	},
	downArrow: function() {
		var me = this;
		if(me.curItem < me.itemTotal-1)
			me.curItem++;
		me.changCls();
	},
	enter: function(field) {
		var me = this;
		var adiv =  acDiv.query('li');
		Ext.Array.each(adiv, function(li,index,allLi) {
			if(index == me.curItem) {
				field.setValue(li.innerHTML);
				return;
			}

		});
		acDiv.hide();
	},
	changCls: function() {
		var me = this;
		me.itemList.each( function(li,index,allLi) {
			if(index == me.curItem) {
				li.addCls('liHighlight');
				return;
			}
			li.removeCls('liHighlight');
		});
	},
	createAcDiv: function() {
		if(acDiv == '') {
			//Ext.core.DomHelper.append(document.body,msgCt, true);
			acDiv =  Ext.core.DomHelper.append(document.body, {
				id:'ac-div'
			}, true);
			Ext.core.DomHelper.applyStyles(acDiv, {
				width:'100px',
				height:'100px',
				border:'1px solid gray',
				'background-color':'white',
				position:'absolute',
				left:'-10000px',
				top:'-10000px',
				'z-index':100000
			});
			acDiv.hide();
		}
	},
	createAcUl: function(itemList,field) {//返回的数据,触发的控件 ""'','','"
		var fiel = field;
		var me = this;
		me.itemList.clear();
		var acul = Ext.core.DomHelper.append(acDiv, {
			tag: 'ul',
			id:'ac-ul'
		},true);

		var str = itemList;

		var liList = str.split(',');
		var tpl = Ext.core.DomHelper.createTemplate({
			tag: 'li',
			html: '{html}'
		});
		var re = /\'/g;
		var acLi='';
		for(var i = 0; i < liList.length; i++) {
			acLi = tpl.append(acul, {
				html:liList[i].replace(re,'')
			},true);
			me.itemList.add(i,acLi);
			acLi.on('mousedown', function() {
				fiel.setValue(this.dom.innerHTML);
				//alert(this.dom.innerHTML);
			});
			acLi.on('mouseenter', function() {
				me.itemList.each( function(li,index,allLi) {
					li.removeCls('liHighlight');
				});
				this.addCls('liHighlight');
			});
			acLi.on('mouseout', function() {
				me.itemList.each( function(li,index,allLi) {
					li.removeCls('liHighlight');
				});
				this.removeCls('liHighlight');
			});
		}

	},
	autoComplete: function(key,field,e) {
		if (e.getKey() == e.ENTER) {
			acSelItemsControl.enter(field);
			return;
		}
		if (e.getKey() == e.UP) {
			acSelItemsControl.upArrow();
			return;
		}
		if (e.getKey() == e.DOWN) {
			acSelItemsControl.downArrow();
			return;
		}
		acDiv.update('');
		//调用接口取数据
		// 调用
		var param = {
			field:key,//'subNumber',
			value:field.getValue()
		};
		WsCall.call('autoComplete', param, function(response, opts) {
			acDiv.update('');
			var itemList = response.data;
			var count = itemList.split(',');
			acSelItemsControl.initAc(count.length);
			acSelItemsControl.createAcUl(itemList,field);

			acDiv.setWidth(field.getWidth()-field.labelWidth);
			acDiv.setHeight(22*count.length);
			//acDiv.setLeftTop(field.getPosition()[0]+field.labelWidth,field.getPosition()[1]+20);
			//4.1
			acDiv.setLeftTop(field.getEl().getXY()[0]+field.labelWidth,field.getEl().getXY()[1]+20);
			acDiv.show();

		}, function(response, opts) {
		}, false);
	}
}