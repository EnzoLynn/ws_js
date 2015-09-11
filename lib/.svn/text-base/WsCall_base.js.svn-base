/**
 * @author blackhan
 */
Ext.define('WS.lib.WsCall', {
	alternateClassName: ['WsCall']
});

var constErrRes = {
	success:false,
	code:-1,
	msg:'response failed'
};
WsCall.addStatics({

	/**
	 * Call a server interface or function
	 * @fname {string} server interface/function name
	 * @param {object} call param
	 * @successCall {function} success callback function,callback params: result object {success:true,code:xxx,msg:xxx}, response: json call raw response object.
	 * @failureCall {function} success callback function,callback params: result object {success:false,code:xxx,msg:xxx}, response: json call raw response object.
	 * @showLoadMask {boolean} whether display loading mask
	 * @loadMsg {string} message displayed on loading mask
	 * @maskEl {element} element that loading mask displayed from
	 * @maskDelay {integer} delay time before loading mask displayed (ms)
	 */

	call: function(fname, param, successCall, failureCall, showLoadMask, loadMsg, maskEl,maskDelay,async) {
		constErrRes.msg = 'response failed (call:' + fname+')';
		param.req = 'call';
		param.callname = fname;
		var isAsync = async==false?async:true;
		var doslm = (typeof showLoadMask == 'undefined' || showLoadMask === null) || showLoadMask == true;
		if (doslm) {
			var callMask;
			var taskWait = new Ext.util.DelayedTask( function() {

				if (loadMsg) {
					callMask = maskEl ? maskEl : Ext.getBody();
					callMask.mask(loadMsg);
					// callMask = new Ext.LoadMask(maskEl ? maskEl : Ext.getBody(), {
					// msg: loadMsg
					// });
				} else {
					callMask = maskEl ? maskEl : Ext.getBody();
					callMask.mask('请稍候...');
					// callMask = new Ext.LoadMask(maskEl ? maskEl : Ext.getBody(), {
					// msg: "请稍候..."
					// });
				}
				//callMask.show();
			});
			taskWait.delay(maskDelay?maskDelay:800);
		}
		Ext.Ajax.request({
			url: WsConf.Url,
			method: 'POST',
			async:isAsync ,
			success: function(response, opts) {
				if (taskWait)
					taskWait.cancel();
				if (typeof callMask != 'undefined' && callMask !== null)
					callMask.unmask();
				//callMask.hide();
				if(response.responseText.length>0 && response.responseText != 'null') {
					var res = Ext.JSON.decode(response.responseText);
					if(res.success == true)
						successCall(res, response,opts);
					else
						failureCall(res,response, opts);
				} else {
					constErrRes.msg = 'response failed (call:' + fname+');' + response.responseText;
					failureCall(constErrRes,response, opts);
				}
			},
			failure: function(response, opts) {
				if (taskWait)
					taskWait.cancel();
				if (typeof callMask != 'undefined' && callMask !== null)
					callMask.unmask();
				//callMask.hide();
				failureCall(constErrRes,response, opts);
			},
			headers: {
				'AJaxCall': 'true'
			},
			params: param
		});
	},
	downloadFile: function(rcName, param) {
		var me = this;
		var sParam = Ext.Object.toQueryString(param);
		if (sParam.length > 0)
			sParam = '&' + sParam;
		var url = WsConf.Url + '?req=rc&rcname=' + rcName + sParam;
		if (typeof(me.iframe) == "undefined") {
			var iframe = document.createElement("iframe");
			me.iframe = iframe;
			document.body.appendChild(me.iframe);
		}
		me.iframe.src = url;
		me.iframe.style.display = "none";
	},
	callchain: function(callname) {
		var host = window.location.host;
		//alert(host);
		var name = userInfoData.accountName;
		var iframe = document.getElementById('callchain');
		if(iframe) {
			document.body.removeChild(iframe);
		}
		iframe = document.createElement("script");
		iframe.id="callchain";
		if (iframe.attachEvent) {//Ext.isIE
			iframe.onreadystatechange  = function() {
				if (this.readyState == "loaded") {
					
				}
			}
		} else {
			iframe.onload = function() {
				
			};
			iframe.onerror  = function() {
				
			}
		}		
		var ranid = Ext.id()+(new Date()).getTime();
		iframe.src = "http://"+localPt.ip+":"+localPt.port+"/ifram.html?call="+callname+"&hosturl="+host+"&sessiontoken="+sessionToken+"&username="+name+"&ranid="+ranid+"@";
		document.body.appendChild(iframe);
	},
	callOtherDomain: function(absPath,fileId,winType) {
		//alert( userConfig.prTwindow.location.hostname;ype);
		
		var path = encodeURI(absPath);
		var iframe = document.getElementById('otherDomain');
		if(iframe) {			
			document.body.removeChild(iframe);
		}
		var fid = fileId;

		var param = {};
		param.sessiontoken = sessionToken;

		// 调用
		WsCall.call('getjsessionid', param, function(response, opts) {
			var jsid = response.data;

			Ext.getBody().mask('正在使用本地打印机,请稍候...');
			//callMask.show();
			//JSESSIONID

			iframe = document.createElement("script");
			iframe.id="otherDomain";

			function afterifload() {
				var param = {};
				param.sessiontoken = sessionToken;
				//param.jsid = jsid;
				// 调用
				WsCall.call('getiframemsg', param, function(response, opts) {
					//callMask.hide();
					Ext.getBody().unmask();
					var data = response.data;
					iframeFileUp(data,winType);
				}, function(response, opts) {
					var fpa = winType.down('#filePath');
					if(fpa)
						fpa.reset();
					//callMask.hide();
					Ext.getBody().unmask();					
					if(response.code == 0x6F000125) {											
						return;
					}

					if(!errorProcess(response.code)) {						
						Ext.Msg.alert('失败', response.msg);
					}
				}, false);
			}

			if (iframe.attachEvent) {//Ext.isIE
				// iframe.attachEvent("onload", function() {
				// afterifload();
				// });
				iframe.onreadystatechange  = function() {
					if (this.readyState == "loaded") {						
						afterifload();
					}
				}
			} else {
				iframe.onload = function() {
					afterifload();
				};
				iframe.onerror  = function() {
					afterifload();
				}
			}			
			var host = window.location.host;
			var ranid = Ext.id()+(new Date()).getTime();
			iframe.src = "http://"+localPt.ip+":"+localPt.port+"/ifram.html?call=file&localurl="+host+"&pttype="+userConfig.prType+"&sessiontoken="+sessionToken+"&jsid="+jsid+"&fileid="+fid+"&ranid="+ranid+"@";
			document.body.appendChild(iframe);			

		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('失败', response.msg);
			}
		}, true,'',Ext.getBody(),10);
	}
});