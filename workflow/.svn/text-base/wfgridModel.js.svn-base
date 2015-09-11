//创建model
function createTaskgridModel() {
	var tmpArr = new Array();	
	taskInfo.taskModelMap.each( function(item,index,alls) {
		tmpArr.push(item);
	});
	Ext.define('WS.workFlow.Taskgridmodel', {
		extend: 'Ext.data.Model',
		idProperty: 'workflowTaskID',
		alternateClassName: 'Taskgridmodel',
		fields: tmpArr
	});

}