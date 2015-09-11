function createoutfaxModel() {
	var tmpArr = new Array();
	outfaxInfo.outfaxModelMap.each( function(item,index,alls) {
		tmpArr.push(item);
	});
	Ext.define('WS.outfax.Outfaxmodel', {
		extend: 'Ext.data.Model',
		idProperty: 'outFaxID',
		alternateClassName: ['outfaxmodel'],
		fields: tmpArr
	});
}