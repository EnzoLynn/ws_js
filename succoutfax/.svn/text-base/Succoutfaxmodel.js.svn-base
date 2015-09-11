function createsucfaxModel() {
	var tmpArr = new Array();
	sucfaxInfo.sucfaxModelMap.each( function(item,index,alls) {
		tmpArr.push(item);
	});
	Ext.define('WS.succoutfax.Succoutfaxmodel', {
		extend: 'Ext.data.Model',
		idProperty: 'outFaxID',
		alternateClassName: ['succoutfaxmodel'],
		fields: tmpArr
	});
}