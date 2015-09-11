var onLanguageChange = true;//控制是否支持语言选项 true支持/false不支持
var onTemplateJs = true;//控制是否支持模版 true支持
var onRulesJs = true;//控制是否支持规则 true支持
var onLocalPrinter = true;//控制是否支持本地打印机
var onDocManager = true;//控制是否支持文档管理
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
	if(onRulesJs) {
		document.write('<script type="text/javascript" src="WS/tbnorth/FaxRuleWin.js"></script>');
	}
	if(onDocManager){
		document.write('<script type="text/javascript" src="WS/docmanager/faxtodocEditor.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/faxtodocwin.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/faxtodocsinglewin.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docstatusbar.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docTree.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docgridTabView.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docgridAction.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docgridmodel.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docgridstore.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docgrid.js"></script>');		
		document.write('<script type="text/javascript" src="WS/docmanager/docAddWin.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docmanagerSelfFilter.js"></script>');
		document.write('<script type="text/javascript" src="WS/docmanager/docopenwin.js"></script>');
	}
	if(onWorkFlow){
		// document.write('<script type="text/javascript" src="WS/workflow/ruleGridTabView.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/passtasklistgrid.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/submitWfwin.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/workflowPng.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/wfTree.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/wfgridTabView.js"></script>');
		//document.write('<script type="text/javascript" src="WS/workflow/wfRuleGrid.js"></script>');
		//document.write('<script type="text/javascript" src="WS/workflow/wfDfGrid.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/wfgridAction.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/wfgridModel.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/wfgridStore.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/wfGrid.js"></script>');	
		document.write('<script type="text/javascript" src="WS/workflow/wfstatusbar.js"></script>');
		document.write('<script type="text/javascript" src="WS/workflow/wfhandlerWin.js"></script>');	
		document.write('<script type="text/javascript" src="WS/workflow/wfGridSelfFilter.js"></script>');
		
	}
	if(onSwfUpload){		
		isSurportFlash = isSurportFlash&&onSwfUpload;
	}else{		
		isSurportFlash = false;
	}
})();