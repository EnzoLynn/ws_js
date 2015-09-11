//创建model
function createDocgridModel() {
	var tmpArr = new Array();	
	docManagerInfo.docManagerModelMap.each( function(item,index,alls) {
		tmpArr.push(item);
	});
	Ext.define('WS.docmanager.Docgridmodel', {
		extend: 'Ext.data.Model',
		idProperty: 'docID',
		alternateClassName: 'Docgridmodel',
		fields: tmpArr
	});

}