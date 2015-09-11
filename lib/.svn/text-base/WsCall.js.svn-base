/**
 * @author blackhan
 */
Ext.define('WS.lib.WsCall', {alternateClassName: 'WsCall'});

var constErrRes = {success:false,code:-1,msg:'response failed'};
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
	
    call: function(fname, param, successCall, failureCall, showLoadMask, loadMsg, maskEl,maskDelay){
        param.req = 'call';
        param.callname = fname;
        var doslm = (typeof showLoadMask == 'undefined' || showLoadMask === null) || showLoadMask == true;
        if (doslm) {
            var callMask;
            var taskWait = new Ext.util.DelayedTask(function(){
            
                if (loadMsg) {
                    callMask = new Ext.LoadMask(maskEl ? maskEl : Ext.getBody(), {
                        msg: loadMsg
                    });
                }
                else {
                    callMask = new Ext.LoadMask(maskEl ? maskEl : Ext.getBody(), {
                        msg: "请稍候..."
                    });
                }
                callMask.show();
            });
            taskWait.delay(maskDelay?maskDelay:800);
        }
        Ext.Ajax.request({
            url: WsConf.Url,
            method: 'POST',
            success: function(response, opts){
                if (taskWait) 
                    taskWait.cancel();
                if (typeof callMask != 'undefined' && callMask !== null) 
                    callMask.hide();
				if(response.responseText.length>0)
				{
					var res = Ext.JSON.decode(response.responseText);
					if(res.success)
						successCall(res, response,opts);
					else
						failureCall(res,response, opts);
				}
				else 
					failureCall(constErrRes,response, opts);
            },
            failure: function(response, opts){
                if (taskWait) 
                    taskWait.cancel();
                if (typeof callMask != 'undefined' && callMask !== null) 
                    callMask.hide();
                failureCall(constErrRes,response, opts);
            },
            headers: {
                'AJaxCall': 'true'
            },
            params: param
        });
    },
    
    
    downloadFile: function(rcName, param){
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
    }
});
