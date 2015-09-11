//附件上传用swf对象
var slaveUpload;
var slaveSwfHandler;
var swfLimit = 10;
var stopSwf = false;
//var isUploading = false;

//添加传真文件swf
//var faxFileUpload;

isSurportFlash = swfobject.hasFlashPlayerVersion("9.0.28");

var initFaxUpload = function(winType) {
	// if(faxFileUpload){
		// faxFileUpload.destroy();
	// }
	faxFileHandler.myWin = winType;
	var hidForm = winType.down('#hidFileId');
	var fileId = hidForm.getValue();
	var d = new Date();
	var ranId = "";
	ranId += d.getYear();
	ranId += d.getMonth();
	ranId += d.getDate();
	ranId += d.getHours();
	ranId += d.getMinutes();
	ranId += d.getSeconds();	
	
	var urlStr = WsConf.Url + "?req=call&callname=fileupload&isflash=0&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "&upfiletype=0&fileId="+fileId+"&randomid=tmp" + ranId;
	//var urlStr = WsConf.Url + "?req=call&callname=slaveupload&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "";
	//alert(fileId);
	var fType='',fDes = '支持的文件';
	Ext.Array.each(supportType, function(item,index,alls) {
		fType+='*.'+item+';';
	});
	var swfpal = winType.down('#spanButtonPlaceholder');
	
	winType.faxFileUpload = new SWFUpload({
		// Backend Settings
		upload_url: urlStr,

		// File Upload Settings
		file_size_limit : "102400",	// 100MB
		file_types : fType,
		file_types_description : fDes,
		file_upload_limit : 0,
		file_queue_limit : 0,

		// Event Handler Settings
		swfupload_preload_handler : faxFileHandler.preLoad,
		swfupload_load_failed_handler :  faxFileHandler.loadFailed,
		//file_dialog_start_handler :  slaveSwfHandler.fileDialogStart,
		file_queued_handler :  faxFileHandler.fileQueued,
		file_queue_error_handler :  faxFileHandler.fileQueueError,
		file_dialog_complete_handler :  faxFileHandler.fileDialogComplete,
		upload_start_handler :  faxFileHandler.uploadStart,
		upload_progress_handler :  faxFileHandler.uploadProgress,
		upload_error_handler :  faxFileHandler.uploadError,
		upload_success_handler :  faxFileHandler.uploadSuccess,
		upload_complete_handler :  faxFileHandler.uploadComplete,

		//mouse_click_handler : faxFileHandler.mouseClick,
		//mouse_over_handler : faxFileHandler.mouseOver,
		//mouse_out_handler : faxFileHandler.mouseOut,

		// Button Settings

		button_image_url : "resources/images/button/XPButtonUploadText_61x22.png",
		//button_placeholder_id :"spanButtonPlaceholder1",
		button_placeholder:swfpal.el.dom,
		button_text:'<span class="redText">'+'添加文件'+'</span>',
		button_text_left_padding : 5,
		button_text_style : ".redText {color:#FFFFFF;font-size:12px;}",	
		button_width: 61,
		button_height: 22,
		button_action : SWFUpload.BUTTON_ACTION.SELECT_FILE,

		// Flash Settings
		//flash_url : "WS/swfupload/swfupload.swf",
		flash_url:"resources/swfupload.swf",
		flash9_url : "resources/swfupload_fp9.swf",

		// Debug Settings
		debug: false
	}

	);

}
var initSwfUpload = function(winType) {
	stopSwf = false;
	slaveSwfHandler = new swfUploadSlaveBaseHandler();
	slaveSwfHandler.myWin = winType;
	var urlStr = WsConf.Url + "?req=call&callname=slaveupload&sessiontoken=" + Ext.util.Cookies.get("sessiontoken") + "";

	var fType='',fDes = '支持的文件';
	// Ext.Array.each(supportType, function(item,index,alls) {
		// fType+='*.'+item+';';
	// });
	var swfpal = winType.down('#spanButtonPlaceholder');

	slaveUpload = new SWFUpload({
		// Backend Settings
		upload_url: urlStr,

		// File Upload Settings
		file_size_limit : "102400",	// 100MB
		file_types : '*.*',
		file_types_description : fDes,
		file_upload_limit : 0,
		file_queue_limit : 0,

		// Event Handler Settings
		swfupload_preload_handler : slaveSwfHandler.preLoad,
		swfupload_load_failed_handler :  slaveSwfHandler.loadFailed,
		file_dialog_start_handler :  slaveSwfHandler.fileDialogStart,
		file_queued_handler :  slaveSwfHandler.fileQueued,
		file_queue_error_handler :  slaveSwfHandler.fileQueueError,
		file_dialog_complete_handler :  slaveSwfHandler.fileDialogComplete,
		upload_start_handler :  slaveSwfHandler.uploadStart,
		upload_progress_handler :  slaveSwfHandler.uploadProgress,
		upload_error_handler :  slaveSwfHandler.uploadError,
		upload_success_handler :  slaveSwfHandler.uploadSuccess,
		upload_complete_handler :  slaveSwfHandler.uploadComplete,

		// Button Settings
		button_image_url : "resources/images/button/XPButtonUploadText_61x22.png",
		button_text:'<span class="redText">'+'添加文件'+'</span>',
		button_text_left_padding : 5,
		button_text_style : ".redText {color:#FFFFFF;font-size:12px;}",
		//button_placeholder_id :"spanButtonPlaceholder1",
		button_placeholder:swfpal.el.dom,
		button_width: 61,
		button_height: 22,

		// Flash Settings
		//flash_url : "WS/swfupload/swfupload.swf",
		flash_url:"resources/swfupload.swf",
		flash9_url : "resources/swfupload_fp9.swf",

		// Debug Settings
		debug: false
	});
}