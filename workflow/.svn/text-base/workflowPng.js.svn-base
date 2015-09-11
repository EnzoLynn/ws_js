var drawComponent = '';
var showWf = false;

function initDrawWf(dataList) {
	dataList = Ext.JSON.decode(dataList);
	
	var tWidth = 114;
	var items = [{
		type: 'circle',
		fill: '#465880',
		radius: 20,
		x: 20,
		y: 40
	},{
		type: 'rect',
		width: 40,
		height: 40,
		fill: '#465880',
		x: 20,
		y: 20,
		group: 'rectangles'
	},{
		type: 'circle',
		fill: '#465880',
		radius: 20,
		x: 60,
		y: 40
	},{
		type: 'text',
		font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
		text: '开始',
		fill: '#FFF',
		x: 28,
		y:39,
		group: 'rectangles'
	},{
		type:'image',
		src:'resources/images/workFlow/arrow.png',
		width:32,
		height:32,
		x: 81,
		y:22
	}];

	var tW = 234*(dataList.length);
	tWidth+=tW;
	Ext.Array.each(dataList, function(item,index) {

		var tmpX = 114 + 200*index+34*index;

		var acTName = item.acttivityName;
		acTName = acTName.length <16?acTName:acTName.substring(0,16)+'...';

		//var aNameText = item.acttivityName.length <20?item.acttivityName:item.acttivityName.substring(0,20)+'...';
		var wAcFText = getWorkflowActionText(item.workflowAction);
		var wAcText = wAcFText.length <16?wAcFText:wAcFText.substring(0,16)+'...';
		var usersFText = '';

		Ext.Array.each(Ext.JSON.decode(item.userList), function(name) {
			usersFText+=name+',';
		});
		usersFText = usersFText.replace('@tijiaoren@','任务发起人');
		usersFText = usersFText.substring(0,usersFText.length-1);

		var bgtcolor = getTaskStateColor(item.activityStatus,1);

		var usersText = usersFText.length <16?usersFText:usersFText.substring(0,16)+'...';
		items.push({
			type: 'rect',
			width: 200,
			height: 70,
			fill: '#D3D7E0',
			x: tmpX,
			y: 0,
			group: 'rectangles'
		}, {
			type: 'rect',
			width: 198,
			height: 20,
			fill: bgtcolor,
			x: tmpX+1,
			y: 1
		}, {
			type: 'text',
			font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
			text: acTName,
			fill: '#FFF',
			x: tmpX+4,
			y:12,
			group: 'rectangles'
		}, {
			type:'image',
			src:'resources/images/workFlow/comment.png',
			width:16,
			height:16,
			x: tmpX+183,
			y:5,
			listeners: {
				render: function(com) {
					Ext.create('Ext.tip.ToolTip', {
						target: com.el,
						html: item.acttivityName,
						showDelay:500
					});
				}
			}
		}, {
			type:'path',
			path:'M'+tmpX+' 22 L'+(tmpX+200)+' 22',
			"stroke-width":1,
			stroke:'#7F7F7F'
		}, {
			type: 'text',
			font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
			text: wAcText,
			fill: '#000',
			x: tmpX+4,
			y:35,
			group: 'rectangles'
		}, {
			type:'image',
			src:'resources/images/workFlow/comment.png',
			width:16,
			height:16,
			x: tmpX+183,
			y:27,
			listeners: {
				render: function(com) {
					Ext.create('Ext.tip.ToolTip', {
						target: com.el,
						html: wAcFText,
						showDelay:500
					});
				}
			}
		}, {
			type:'path',
			path:'M'+tmpX+' 45 L'+(tmpX+200)+' 45',
			"stroke-width":1,
			stroke:'#7F7F7F'
		}, {
			type: 'text',
			font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
			text: usersText,
			fill: '#000',
			x: tmpX+4,
			y:57,
			group: 'rectangles'
		}, {
			type:'image',
			src:'resources/images/workFlow/comment.png',
			width:16,
			height:16,
			x: tmpX+183,
			y:49,
			listeners: {
				render: function(com) {
					Ext.create('Ext.tip.ToolTip', {
						target: com.el,
						html: usersFText,
						showDelay:500
					});
					// if ( Ext.isIE7 || Ext.isIE8 ) {
					// com.el.setLeftTop(tmpX+183+'px',49+'px');
					// }
				}
			}
		});

		var color = getTaskStateColor(item.activityStatus);

		items.push({
			type:'path',
			path:'M'+tmpX+' 0 L'+(tmpX+200)+' 0 L'+(tmpX+200)+' 70 L'+tmpX+' 70 Z',
			"stroke-width":2,
			stroke:color
		});

		//if(index != dataList.length-1) {
		items.push({
			type:'image',
			src:'resources/images/workFlow/arrow.png',
			width:32,
			height:32,
			x: tmpX+201,
			y:22
		});
		//tWidth+=30;
		//}
	});
	items.push({
		type: 'circle',
		fill: '#465880',
		radius: 20,
		x: tWidth+20,
		y: 40
	}, {
		type: 'rect',
		width: 40,
		height: 40,
		fill: '#465880',
		x:  tWidth+20,
		y: 20,
		group: 'rectangles',
		listeners: {
			render: function(com) {
				Ext.create('Ext.tip.ToolTip', {
					target: com.el,
					html: 'ok',
					showDelay:500
				});
			}
		}
	}, {
		type: 'circle',
		fill: '#465880',
		radius: 20,
		x: tWidth+60,
		y: 40
	}, {
		type: 'text',
		font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
		text: '结束',
		fill: '#FFF',
		x: tWidth+28,
		y:39,
		group: 'rectangles'
	});
	tWidth += 110;
	
	//添加颜色说明
	items.push({
		type: 'rect',
		width: 10,
		height: 10,
		fill: '#4444dd',
		x: 10,
		y: 90
	}, {
		type: 'text',
		font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
		text: '等待处理',
		fill: '#000',
		x: 22,
		y:96
	},{
		type: 'rect',
		width: 10,
		height: 10,
		fill: '#44bb44',
		x: 10,
		y: 105
	}, {
		type: 'text',
		font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
		text: '成功通过',
		fill: '#000',
		x: 22,
		y:111
	},{
		type: 'rect',
		width: 10,
		height: 10,
		fill: '#dd6666',
		x: 10,
		y: 120
	}, {
		type: 'text',
		font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
		text: '失败/超时',
		fill: '#000',
		x: 22,
		y:126
	},{
		type: 'rect',
		width: 10,
		height: 10,
		fill: '#8F8F8F',
		x: 10,
		y: 135
	}, {
		type: 'text',
		font:'12px/20px Tahoma,Verdana,Arial,sans-serif',
		text: '未分配',
		fill: '#000',
		x: 22,
		y:141
	});
	return Ext.create('Ext.draw.Component', {
		viewBox:false,
		width: tWidth,
		height: 300,
		items:items
	})
}