var onLanguageChange = true;//控制是否支持语言选项 true支持/false不支持
var onTemplateJs = true;//控制是否支持模版 true支持
var onLocalPrinter = true;//控制是否支持本地打印机
var onSwfUpload = true;//控制是否使用flash
var onWorkFlow = true;//控制是否使用工作流
//本地打印配置
var localPt = {
	ip:'127.0.0.1',
	port:'22222'
};

(function() {
	if(onTemplateJs) {
		document.write('<script type="text/javascript" src="WS/lib/DateTimeField.js"></script>');
		document.write('<script type="text/javascript" src="WS/config/TemplateControl.js"></script>');
		document.write('<script type="text/javascript" src="WS/template/inputDataWin.js"></script>');
		document.write('<script type="text/javascript" src="WS/template/searchDataWin.js"></script>');
		document.write('<script type="text/javascript" src="WS/template/templateAction.js"></script>');
		document.write('<script type="text/javascript" src="WS/template/templateGrid.js"></script>');
	}
	if(onWorkFlow){
		// document.write('<script type="text/javascript" src="WS/workflow/ruleGridTabView.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/passtasklistgrid.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/submitWfwin.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/workflowPng.js"></script>');
		
		
	}
	if(onSwfUpload){		
		isSurportFlash = isSurportFlash&&onSwfUpload;
	}else{		
		isSurportFlash = false;
	}	
	
})();