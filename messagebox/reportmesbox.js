var msgCt = '';

//计算机通报数据
Ext.define('cnotifyMessageClass', {
	config: {
		notifyType:0,//消息类型标识:0:ReceiveFax; 1:ReceiveVoice; 2:ReceiveSMS; 3:SentFaxOK; 4:SentFaxError; 5:SentSMSOK; 6:SentSMSError; 7:ReceiveApprovalFax; 8:ApprovalPassed; 9:ApprovalNotPassed; 10 AdminMsg; 99:CustomMsg(用于工作流自定义通报);
		param1:'',//	参数1
		param2:'',
		param3:''
	},
	constructor: function (cfg) {
		this.initConfig(cfg);
	}
});

var cnMsgList = new Array();

//加载计算机通报 弹出
function msgBoxTask() {

	(new Ext.util.DelayedTask( function() {
			taskMessageBoxRunner.stopAll();
			taskMessageBoxRunner = new Ext.util.TaskRunner();
			taskMessageBoxRunner.start({
				run: function() {
					//调用接口取值
					var param= {
						sessiontoken :sessionToken
					}
					//调用
					WsCall.call('msgreport', param, function (response, opts) {
						var msgInfos = Ext.JSON.decode(response.data);
						cnMsgList = new Array();
						Ext.Array.each(msgInfos, function(msg,index,allmsg) {
							cnMsgList.push(msg);							
						});						
						
						if(cnMsgList.length > 0) {
							taskMessageBoxRunner.stopAll();
							Ext.example.msg('WaveFax', cnMsgList);

							//自动关闭
							if(userConfig.msgboxkeeptime > 0) {
								(new Ext.util.DelayedTask( function() {		
									 							
										msgCt.hide();
										closeMsgBox();
									})).delay(userConfig.msgboxkeeptime*1000);
							}
						}

					}, function (response, opts) {
						//Ext.Msg.alert('失败', response.msg);
					}, false);
				},
				interval: userConfig.msgtaskinterval*1000 //5 second
			});
		})).delay(50);
}

function closeMsgBox() {

	var task = new Ext.util.DelayedTask( function() {
		//加载计算机通报task
		msgBoxTask();
	});
	task.delay(5000);

}

//计算机通报消息窗口控制类
var msgBoxControl = {
	msgList:[],
	curPage:0,
	total:0,
	firstMsg: function() {
		var divContent = document.getElementById('msgBoxContent');
		this.curPage = 0;
		divContent.innerHTML = this.createContent();
		this.updateStatus();
	},
	prevMsg: function() {
		var divContent = document.getElementById('msgBoxContent');
		if(this.curPage > 0) {
			this.curPage--;
		}
		divContent.innerHTML = this.createContent();
		this.updateStatus();
	},
	nextMsg: function() {
		var divContent = document.getElementById('msgBoxContent');
		if(this.curPage < this.total-1) {
			this.curPage++;
		}
		divContent.innerHTML = this.createContent();
		this.updateStatus();
	},
	lastMsg: function() {
		var divContent = document.getElementById('msgBoxContent');
		this.curPage = this.total-1;
		divContent.innerHTML = this.createContent();
		this.updateStatus();
	},
	updateStatus: function() {
		//imgBtnFirst
		var imgBtnFirst = document.getElementById('imgBtnFirst');
		var imgBtnPrev = document.getElementById('imgBtnPrev');
		var imgBtnNext = document.getElementById('imgBtnNext');
		var imgBtnLast = document.getElementById('imgBtnLast');

		imgBtnFirst.disabled = false;
		imgBtnFirst.src="resources/images/button/first.png";
		imgBtnPrev.disabled = false;
		imgBtnPrev.src="resources/images/button/prev.png";
		imgBtnNext.disabled = false;
		imgBtnNext.src="resources/images/button/next.png";
		imgBtnLast.disabled = false;
		imgBtnLast.src="resources/images/button/last.png";

		if(this.curPage == 0) {
			imgBtnFirst.disabled = true;
			imgBtnFirst.src="resources/images/button/first_disabled.png";
			imgBtnPrev.disabled = true;
			imgBtnPrev.src="resources/images/button/prev_disabled.png";
		}

		if(this.curPage == this.total-1) {
			imgBtnNext.disabled = true;
			imgBtnNext.src="resources/images/button/next_disabled.png";
			imgBtnLast.disabled = true;
			imgBtnLast.src="resources/images/button/last_disabled.png";
		}
	},
	createContent: function() {
		//cnmes.notifyType
		var type = this.msgList[this.curPage].notifyType;
		var html = "";
		if(type == 0) {
			html+='<p>'+this.msgList[this.curPage].param1+'</p>';
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">';
			html+='你有一封新传真'+'<br/>';
			html+='发件人'+':'+this.msgList[this.curPage].param2+'<br/>';

			html+='传真位置'+':'+owerInternational(this.msgList[this.curPage].param3)+'';
			html+='</div>';

			//自动刷新
			if(currGrid && currGrid.loadGrid && currGrid.itemId == 'Infaxgrid') {
				var tree = getCurrTree();
				var treeSeles = tree.getSelectionModel().getSelection();
				var store = currGrid.getStore();
				currGrid.loadGrid();				
				getIsReadCount(tree.getStore(), store.getProxy().extraParams.folderid);
			}
			
			return html;
		}
		if(type == 3) {
			html+='<p><img src="resources/images/fax/status/outstatus.9.png" />'+this.msgList[this.curPage].param1+'</p>';
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">';
			html+='<p>'+'发送成功'+'</p>';
			html+='<p>'+'收件人'+':'+this.msgList[this.curPage].param2+'</p>';
			html+='<p>'+'主题'+':'+this.msgList[this.curPage].param3+'</p>';
			html+='</div>';
			return html;
		}
		if(type == 4) {
			html+='<p><img src="resources/images/fax/status/outstatus.8.png" />'+this.msgList[this.curPage].param1+'</p>';
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">';
			html+='<p>'+'发送失败'+'</p>';
			html+='<p>'+'收件人'+':'+this.msgList[this.curPage].param2+'</p>';
			html+='<p>'+'主题'+':'+this.msgList[this.curPage].param3+'</p>';
			html+='</div>';			
			return html;
		}
		if(type == 7){	
			html+='<p>'+'有新文档等待你的审批'+'</p>';				
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">';
			html+='<br/>';
			html+='提交人'+':'+this.msgList[this.curPage].param2+'<br/>';

			html+='提交时间'+':'+owerInternational(this.msgList[this.curPage].param1)+'';
			html+='</div>';
			
			//自动刷新
			if(currGrid && currGrid.loadGrid && currGrid.itemId == 'TaskGrid') {				
				currGrid.loadGrid();				
			}
			return html;
		}
		if(type == 8){		
			html+='<p>'+'通过审批'+'</p>';	
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">';
			html+='任务ID'+':'+this.msgList[this.curPage].param2+'<br/>';
			html+='开始时间'+':'+this.msgList[this.curPage].param1+'<br/>';

			html+='结束时间'+':'+this.msgList[this.curPage].param3+'';
			html+='</div>';
			return html;
			
		}
		if(type == 9){		
			html+='<p>'+'未通过审批'+'</p>';	
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">';
			html+='任务ID'+':'+this.msgList[this.curPage].param2+'<br/>';
			html+='开始时间'+':'+this.msgList[this.curPage].param1+'<br/>';

			html+='结束时间'+':'+this.msgList[this.curPage].param3+'';
			html+='</div>';	
		
			return html;
		}
		if(type == 10) {
			//html+='<p>'+this.msgList[this.curPage].param1+'</p>';
			html+='<p>'+'系统消息'+'</p>';
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">'+this.msgList[this.curPage].param2+'</div>';

			return html;
		}
		if(type == 11){		
			html+='<p>'+'职责委任'+'</p>';	
			html+='<div style="width:290px;height:91px;overflow:auto;word-wrap:break-word;">';
			var msgSt = '';
			if(this.msgList[this.curPage].param3 != 0){
				var wrStr = '';
				if((this.msgList[this.curPage].param3 & 0x01) > 0){
					wrStr +='接收传真,';
				}
				if((this.msgList[this.curPage].param3 & 0x40) > 0){
					wrStr +='工作流审批,';
				}
				if((this.msgList[this.curPage].param3 & 0x20) > 0){
					wrStr +='管理员,';
				}
				wrStr = wrStr.substring(0,wrStr.length-1);
				msgSt = '赋予您的职责是'+':'+wrStr;
			}else{
				msgSt = '已经收回委任给你的职责';
			}
			html+='&nbsp;&nbsp;&nbsp;&nbsp;'+this.msgList[this.curPage].param2+'<br/>';
			html+= '&nbsp;&nbsp;&nbsp;&nbsp;'+msgSt+'<br/><br/>';
			html+='</div>';	
		
			return html;
		}

	}
}

Ext.example = function() {

	//根据消息类型生成html
	function createBox(title, cnMsgList) {
		var cnmsg = cnMsgList[0];
		msgBoxControl.msgList = cnMsgList;
		msgBoxControl.curPage = 0;
		msgBoxControl.total = cnMsgList.length;

		var html = '<hr width="100%" />';
		//html+=' <span class="msgClose"><input  type="image" src="resources/images/16/closex.png"  onclick="closeMsgBox()"/></span>';
		//cnmes.notifyType
		//html+='<h3>' + title + '</h3>';
		html+='<div id="msgBoxContent">';
		html+=msgBoxControl.createContent();
		html+='</div>';
		html+='<br/>';
		html+='<p>';
		html+='<input title='+'首页'+' id="imgBtnFirst" type="image" src="resources/images/button/first.png" onclick="msgBoxControl.firstMsg()"/>&nbsp;&nbsp;';
		html+='<input title='+'上一页'+' id="imgBtnPrev" type="image" src="resources/images/button/prev.png" onclick="msgBoxControl.prevMsg()"/>&nbsp;&nbsp;';
		html+='<input title='+'下一页'+' id="imgBtnNext" type="image" src="resources/images/button/next.png" onclick="msgBoxControl.nextMsg()"/>&nbsp;&nbsp;';
		html+='<input title='+'尾页'+' id="imgBtnLast" type="image" src="resources/images/button/last.png" onclick="msgBoxControl.lastMsg()"/>';
		html+="</p>";
		//html+='';
		return html;
	}

	return {
		msg : function(title, cnMsgList) {
			if(msgCt == '') {
				msgCt = Ext.create('Ext.window.Window', {
					//id:'msg-div',
					title:'&nbsp;&nbsp;<b>WaveFax '+'通报'+'</b>',
					//html:createBox(title, cnMsgList),
					floating:true,
					width:300,
					height:190,
					plain:true,
					resizable:false,
					baseCls:'msg-div',
					bodyBorder:'0 0 0 0',
					closable:false,
					tools:[{
						type:'close',
						handler: function(event, toolEl, panel) {
							//if(Ext.isIE) {
								msgCt.hide();
							// } else {
								// msgCt.getEl().ghost("b", {
									// delay: 300
								// });
							// }

							closeMsgBox();
						}
					}],
					listeners: {
						show: function() {

							msgCt.down("header").getEl().setStyle("cursor","move");

							msgCt.down("header").setPosition(3,3);
							msgCt.down("header").setWidth(290);
							// if(!Ext.isIE) {
								// msgCt.hide();
								// if(msgCt.el) {
									// msgCt.el.slideIn('b');
								// }
							// }

							//控制消息页码控制按钮状态
							msgBoxControl.updateStatus();
						},
						afterrender: function() {
							//msgCt.getEl().setVisible(false);
							// if(!Ext.isIE) {
								// if(!msgCt.isVisible()) {
									// msgCt.getEl().slideIn('b');
								// }
							// }

						}
					}

				});

				//Ext.core.DomHelper.append(document.body,msgCt, true);
				// msgCt = Ext.core.DomHelper.append(document.body, {
				// id:'msg-div'
				// }, true);
				// msgCt.getEl().setBottom(32);
				// msgCt.getEl().setRight(8);
			}
			msgCt.update(createBox(title, cnMsgList));
			//msgCt.center();
			msgCt.setPosition(Ext.getBody().getWidth()-320,Ext.getBody().getHeight()-224);
			msgCt.show();

			//var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
			// msgBox = Ext.core.DomHelper.append(msgCt, createBox(title, cnMsgList), true);
			// msgBox.hide();
			// msgBox.slideIn('t');

			//m.slideIn('t').ghost("b", { delay: 5000, remove: true});
		},
		init : function() {

		}
	};
}();

