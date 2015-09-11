Ext.define('createDocgirdHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {
		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0' class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'文档ID'+":&nbsp;</td><td>"+vals.docID+"</td>";
		var refDocID ='';
		if(vals.refDocID != '0') {
			refDocID = vals.refDocID;
		}
		html += "<td class='lbTd' >"+'参考文档文件ID'+":&nbsp;</td><td>"+refDocID+"</td>";
		html += "<td class='lbTd' >"+'自定义编号'+":&nbsp;</td><td>"+vals.customID+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'关键字'+":&nbsp;</td><td>"+vals.keyWord+"</td>";
		html += "<td class='lbTd' >"+'文档创建者'+":&nbsp;</td><td>"+vals.userName+"</td>";
		var createDateTime = '';
		if(!vals.createDateTime.match('1970-0')) {
			createDateTime = UTCtoLocal(vals.createDateTime);
		}
		html += "<td class='lbTd' >"+'创建时间'+":&nbsp;</td><td>"+createDateTime+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'最后修改用户'+":&nbsp;</td><td>"+vals.lastMdfUserName+"</td>";
		var lastMdfDateTime = '';
		if(!vals.lastMdfDateTime.match('1970-0')) {
			lastMdfDateTime = UTCtoLocal(vals.lastMdfDateTime);
		}
		html += "<td class='lbTd' >"+'最后修改时间'+":&nbsp;</td><td>"+lastMdfDateTime+"</td>";
		html += "<td class='lbTd' >"+'页数'+":&nbsp;</td><td>"+vals.pages+"</td></tr>";

		var reType = docResourceType[vals.resourceType];
		html += "<tr><td class='lbTd'>"+'文档来源类型:&nbsp;'+"</td><td>"+reType+"</td>";
		var owner='';
		if(vals.owner.length==0) {
			owner = linkViewTitle2(docTree.getSelectionModel().getSelection());
		} else {
			//owner = vals.owner;
			owner = owerInternational(vals.owner);
		}
		html += "<td class='lbTd' >"+'所属'+":&nbsp;</td><td colspan=3>"+owner+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";
		html +="</tbody></table>";
		return html;
	},
	createOrcList: function(record) {
		var me = this;
		var orcPal = viewFaxFileTab.down('#orcInfo');
		var vals = record.data;
		//调用call
		var param = {};
		//param.docid = vals.docID;
		param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
		param.resourceType = vals.resourceType;
		param.resourceIDs = vals.resourceIDs;

		WsCall.call('getorclist', param, function(response, opts) {
			var data = Ext.JSON.decode(response.data);
			orcPal.firstAdd = false;
			Ext.Array.each(data, function(item,index,alls) {
				orcPal.add({
					xtype:'fieldset',
					collapsible:true,
					title:'资源信息'+(index+1),
					html:me.createOrc(item,param.resourceType)
				});
			});
		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('失败', response.msg);
			}
		}, true,'加载中...',Ext.getBody(),50);
	},
	createOrc: function(record,type) {
		var vals = record;
		var html = "";

		if(type == 'INFAX') {
			html += "<table cellspacing='0' class='myTable'><tbody>";
			html += "<tr><td class='lbTd'>"+'流水号'+":&nbsp;</td><td>"+vals.inFaxID+"</td>";
			html += "<td class='lbTd' >"+'发件人'+":&nbsp;</td><td>"+vals.callerName+"</td>";
			html += "<td class='lbTd' >"+'呼叫者标识'+":&nbsp;</td><td>"+vals.callerID+"</td></tr>";

			html += "<tr><td class='lbTd'>"+'发件人组织'+":&nbsp;</td><td>"+vals.callerOrganization+"</td>";
			html += "<td class='lbTd' >CSID:&nbsp;</td><td>"+vals.callerCSID+"</td>";
			var receiveDateTime = '';
			if(!vals.receiveDateTime.match('1970-0')) {
				receiveDateTime = UTCtoLocal(vals.receiveDateTime);
			}
			html += "<td class='lbTd' >"+'接收时间'+":&nbsp;</td><td>"+receiveDateTime+"</td></tr>";

			html += "<tr><td class='lbTd'>"+'资源类型'+":&nbsp;</td><td colspan=5>"+docResourceType.INFAX+"</td></tr>";

			html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";
			html +="</tbody></table>";
			return html;
		}
		if(type == 'OUTFAX') {
			html += "<table cellspacing='0' class='myTable'><tbody>";
			html += "<tr><td class='lbTd'>"+'流水号'+":&nbsp;</td><td>"+vals.outFaxID+"</td>";
			html += "<td class='lbTd'>"+'传真号码'+":&nbsp;</td><td>"+vals.faxNumber+"</td>";
			html += "<td class='lbTd' >"+'发件人'+":&nbsp;</td><td>"+vals.sentUser+"</td></tr>";

			html += "<tr><td class='lbTd' >"+'收件人'+":&nbsp;</td><td>"+vals.recipient+"</td>";
			html += "<td class='lbTd' >"+'主题'+":&nbsp;</td><td>"+vals.subject+"</td>";
			var sentDateTime='';
			if(!vals.sentDateTime.match('1970-0')) {
				sentDateTime = UTCtoLocal(vals.sentDateTime);
			}
			html += "<td class='lbTd'>"+'发送时间'+":&nbsp;</td><td>"+sentDateTime+"</td></tr>";

			html += "<tr><td class='lbTd'>"+'资源类型'+":&nbsp;</td><td colspan=5>"+docResourceType.OUTFAX+"</td></tr>";
			html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";

			html +="</tbody></table>";
			return html;
		}

	}
});

var createDocgirdHtml = new createDocgirdHtml();

//收件箱对应详细资料form
function loadDetailFormForDocgrid(record) {
	return Ext.create('Ext.form.Panel', {
		bodyPadding: 5,
		////bodyCls: 'panelFormBg',
		layout: {
			type: 'auto'
		},
		defaults: {
			xtype:'fieldset',
			collapsible:true
		},
		border: false,
		autoScroll: true,
		updateAll: function(record) {
			var me = this;
			var basePal = me.down('#baseInfo');
			basePal.update(createDocgirdHtml.createBase(record));
			var tplPal = me.down('#tplInfo');
			if(tplPal) {
				if(record.data.templateid!= 0) {
					tplPal.removeAll();
					tplPal.record = record;
					tplPal.firstAdd = true;
					tplPal.show();
					tplPal.collapse();
					tplPal.setTitle('表单数据'+template.getTplTilte(record.data.templateid));					
				} else {
					tplPal.hide();
				}
			}
			var attPal = me.down('#attInfo');
			if(attPal) {
				if(record.data.attach.length > 0) {
					attPal.removeAll();
					attPal.record = record;
					attPal.firstAdd = true;
					attPal.show();
					attPal.collapse();
				} else {
					attPal.hide();
				}
			}
			var orcPal = me.down('#orcInfo');
			if(orcPal) {
				if(record.data.resourceIDs != 0) {
					orcPal.removeAll();
					orcPal.record = record;
					orcPal.firstAdd = true;
					orcPal.show();
					orcPal.collapse();
				} else {
					orcPal.hide();
				}
			}
		},
		listeners: {
			afterrender: function(pal,opts) {
				var vals = record.data;
				pal.add({
					title:'基本信息',
					itemId:'baseInfo',
					listeners: {
						render: function(com) {
							com.update(createDocgirdHtml.createBase(record));
						}
					}
				});
				//是否加载表单数据
				if(template) {
					var title = '表单数据:'+template.getTplTilte(record.data.templateid);
					pal.add({
						title:title,
						collapsed:true,
						hidden:record.data.templateid !=0?false:true,
						itemId:'tplInfo',
						record:'',
						firstAdd:true,
						listeners: {
							render: function(com) {
								com.toggleCmp.on('click', function(dd,tt,aa,ss) {
									if(!com.collapsed && com.firstAdd) {
										if(com.record != '') {
											createDocgirdHtml.createTpl(com,com.record.data.docID,'DOCUMENT');
										} else {
											createDocgirdHtml.createTpl(com,record.data.docID,'DOCUMENT');
										}

									}
								});		
							
								//com.update(createDocgirdHtml.createTpl(record,'docgrid'));
							}
						}
					});
				}
				//附件
				pal.add({
					title:'附件信息',
					collapsed:true,
					hidden:vals.attach.length>0?false:true,
					itemId:'attInfo',
					record:'',
					firstAdd:true,
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createDocgirdHtml.createAtt(com.record));
									} else {
										com.update(createDocgirdHtml.createAtt(record));
									}
								}
							});
						}
					}
				});

				pal.add({
					title:'原始资源信息',
					collapsed:true,
					hidden:vals.resourceIDs !=0 ?false:true,
					record:'',
					firstAdd:true,
					itemId:'orcInfo',
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createDocgirdHtml.createOrcList(com.record));
									} else {
										com.update(createDocgirdHtml.createOrcList(record));
									}
								}
							});
						}
					}
				});
			}
		},
		items:[]
		//html:createDocgirdHtml(record)
	});
}