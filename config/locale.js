var lang_type;//控制当前语言 0中文/1英文

(function() {
	lang_type = Ext.util.Cookies.get("ws_language");
	if(lang_type) {
		if(lang_type =='0') {
			document.write('<script type="text/javascript" src="local/rc_zh_cn.js"></script>');
			document.write('<script type="text/javascript" src="ext4/locale/ext-lang-zh_CN.js"></script>');
			return;
		}
		if(lang_type =='1') {
			document.write('<script type="text/javascript" src="local/rc_en.js"></script>');
			document.write('<script type="text/javascript" src="ext4/locale/ext-lang-en.js"></script>');
			return;
		}
		lang_type = '0';
		document.write('<script type="text/javascript" src="local/rc_zh_cn.js"></script>');
		document.write('<script type="text/javascript" src="ext4/locale/ext-lang-zh_CN.js"></script>');
	} else {
		lang_type = '0';
		document.write('<script type="text/javascript" src="local/rc_zh_cn.js"></script>');
		document.write('<script type="text/javascript" src="ext4/locale/ext-lang-zh_CN.js"></script>');
	}

})();

if(Ext.isIE) {
	if(Ext.ieVersion<8) {
		if(!!(window.attachEvent && !window.opera)) {
			alert("Your IE version is unsupported, please use IE8/9.");
			var loadingDiv = document.getElementById('loadingDiv');
			if(loadingDiv)
				document.body.removeChild(loadingDiv);
			document.execCommand("stop");
		} else {
			alert("Your IE version is unsupported, please use IE8/9.");
			var loadingDiv = document.getElementById('loadingDiv');
			if(loadingDiv)
				document.body.removeChild(loadingDiv);
			window.stop();
		}
	}

}


