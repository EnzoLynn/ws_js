

Ext.define('createRulegirdHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {
		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0' class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'规则类别'+": </td><td>"+vals.workflowRuleName+"</td>";
		var isActive = '否';
		if(vals.isActive){
			isActive = '是';
		}
		html += "<td class='lbTd' >"+'是否被激活'+": </td><td>"+isActive+"</td>";
		html += "<td class='lbTd' >"+'创建人'+": </td><td>"+vals.createUserName+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'规则ID'+": </td><td>"+vals.workflowRuleName+"</td>";
		var createTime = '';
		if(!vals.createTime.match('1970-0')) {
			createTime = UTCtoLocal(vals.createTime);
		}
		html += "<td class='lbTd' >"+'创建时间'+": </td><td>"+createTime+"</td>";
		var lastModifiedTime = '';
		if(!vals.lastModifiedTime.match('1970-0')) {
			lastModifiedTime = UTCtoLocal(vals.lastModifiedTime);
		}
		html += "<td class='lbTd' >"+'最后修改时间'+": </td><td>"+lastModifiedTime+"</td></tr>";

		

		html +="</tbody></table>";
		return html;
	},
	createTaskList: function(record) {
		var me = this;
		var taskPal = viewFaxFileTab.down('#taskInfo');	
		var steps = Ext.JSON.decode(record.data.steps);
		Ext.Array.each(steps, function(item,index,alls) {
			taskPal.add({
				xtype:'fieldset',
				collapsible:true,
				title:'步骤'+(index+1)+':'+item.itemName,
				html:me.createTask(item)
			});
		});
	},
	createTask: function(step) {
		var vals = step;
		var html = "";

		html += "<table cellspacing='0' class='myTable'><tbody>";		
		html += "<tr><td class='lbTd'>"+'名称'+": </td><td>"+vals.itemName+"</td>";	
		var acType = getWorkflowActionText(vals.acType);	
		html += "<td class='lbTd' >"+'操作类型'+": </td><td colspan=3>"+acType+"</td></tr>";
		
		
		var userList = Ext.JSON.decode(vals.userList);
		var usersFText = '';
		Ext.Array.each(userList, function(name) {
			usersFText+=name+',';
		});		
		usersFText = usersFText.replace('@tijiaoren@','任务发起人');		
		usersFText = usersFText.substring(0,usersFText.length-1);			
		html += "<tr><td class='lbTd'>"+'审批者列表'+": </td><td colspan=5>"+usersFText+"</td></tr>";

		var timeout = wfDuration(vals.timeout);
		html += "<tr><td class='lbTd'>"+'超时时限'+": </td><td>"+timeout+"</td>";
		
		html +="</tbody></table>";
		return html;

	}
});

var createRulegirdHtml = new createRulegirdHtml();

//收件箱对应详细资料form
function loadDetailFormForRulegrid(record) {
	return Ext.create('Ext.form.Panel', {
		bodyPadding: 5,
		////bodyCls: 'panelFormBg',
		layout: {
			type: 'anchor'
		},
		defaults: {
			xtype:'fieldset',
			collapsible:true
		},
		border: false,
		autoScroll: true,
		updateAll: function(record) {
			var me = this;
			var basePal = me.down('#baseInfo');
			basePal.update(createRulegirdHtml.createBase(record));
			
			
			var taskPal = me.down('#taskInfo');
			taskPal.removeAll();
			taskPal.update(createRulegirdHtml.createTaskList(record));

		},
		listeners: {
			afterrender: function(pal,opts) {
				var vals = record.data;
				pal.add({
					title:'基本信息',
					itemId:'baseInfo',
					listeners: {
						render: function(com) {
							com.update(createRulegirdHtml.createBase(record));
						}
					}
				});

				pal.add({
					title:'任务步骤序列',					
					itemId:'taskInfo',
					listeners: {
						render: function(com) {
							com.update(createRulegirdHtml.createTaskList(record));
						}
					}
				});
			}
		},
		items:[]
		//html:createDocgirdHtml(record)
	});
}