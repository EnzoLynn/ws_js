//创建model
function createInfaxModel() {
	var tmpArr = new Array();
	infaxInfo.infaxModelMap.each( function(item,index,alls) {
		tmpArr.push(item);
	});
	Ext.define('WS.infax.Infaxmodel', {
		extend: 'Ext.data.Model',
		idProperty: 'inFaxID',
		alternateClassName: 'Infaxmodel',
		fields: tmpArr
	});

}