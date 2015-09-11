Ext.define('createTaskgirdHtml', {
	extend: 'createHtmlBase',
	createBase: function(record) {
		var vals = record.data;
		var html = "";
		html += "<table cellspacing='0' class='myTable'><tbody>";
		html += "<tr><td class='lbTd'>"+'任务ID'+":&nbsp;</td><td>"+vals.workflowTaskID+"</td>";
		html += "<td class='lbTd' >"+'资源ID'+":&nbsp;</td><td>"+vals.resourceID+"</td>";
		html += "<td class='lbTd' >"+'发起人'+":&nbsp;</td><td>"+vals.userName+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'规则类别'+":&nbsp;</td><td>"+vals.workflowRuleName+"</td>";
		var startTime = '';
		if(!vals.startTime.match('1970-0')) {
			startTime = UTCtoLocal(vals.startTime);
		}
		html += "<td class='lbTd' >"+'开始时间'+":&nbsp;</td><td>"+startTime+"</td>";
		var endTime = '';
		if(!vals.endTime.match('1970-0')) {
			endTime = UTCtoLocal(vals.endTime);
		}
		html += "<td class='lbTd' >"+'完成时间'+":&nbsp;</td><td>"+endTime+"</td></tr>";

		var workflowStatus = updateWfGridStatus(vals.workflowStatus,true,record);
		html += "<tr><td class='lbTd'>"+'状态'+":&nbsp;</td><td>"+workflowStatus+"</td>";
		var taskFlag  = "<span><img src='resources/images/workFlow/flag/wFlag"+vals.taskFlag+".png' style='margin-bottom: -5px;'>&nbsp;"+taskFlagArr[vals.taskFlag]+"</span>";
		
		
		html += "<td class='lbTd' >"+'任务标志'+":&nbsp;</td><td>"+taskFlag+"</td>";
		html += "<td class='lbTd' >"+'任务主题'+":&nbsp;</td><td>"+vals.taskComment+"</td></tr>";

		var resourceType = docResourceType[vals.resourceType];
		html += "<tr><td class='lbTd'>"+'资源类型'+":&nbsp;</td><td>"+resourceType+"</td>";
		html += "<td class='lbTd'>"+'当前步骤'+":&nbsp;</td><td colspan=3>"+vals.currentWorkflowItemName+"</td></tr>";
		if(wfTree.getSelectionModel().getSelection()[0].data.id.toString().indexOf('trwr') != -1){
			html += "<td class='lbTd'>"+'委托人'+":&nbsp;</td><td colspan=5>"+vals.workflowmasksub+"</td>";
		}
		

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
		param.resourceIDs = vals.resourceID;
		param.fileid = vals.fileID;

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
			html += "<tr><td class='lbTd'>"+'资源ID'+":&nbsp;</td><td>"+vals.inFaxID+"</td>";
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
		if(type == 'DOCUMENT') {
			html += "<table cellspacing='0' class='myTable'><tbody>";
			html += "<tr><td class='lbTd'>"+'流水号'+":&nbsp;</td><td>"+vals.outFaxID+"</td>";
			html += "<td class='lbTd'>"+'关键字'+":&nbsp;</td><td>"+vals.faxNumber+"</td>";
			html += "<td class='lbTd' >"+'文档创建者'+":&nbsp;</td><td>"+vals.sentUser+"</td></tr>";

			html += "<tr><td class='lbTd' >"+'最后修改用户'+":&nbsp;</td><td>"+vals.recipient+"</td>";
			var sentDateTime='';
			if(!vals.sentDateTime.match('1970-0')) {
				sentDateTime = UTCtoLocal(vals.sentDateTime);
			}
			html += "<td class='lbTd' >"+'创建时间'+":&nbsp;</td><td>"+sentDateTime+"</td>";
			var sentDateTime='';
			if(!vals.sentDateTime.match('1970-0')) {
				sentDateTime = UTCtoLocal(vals.sentDateTime);
			}
			html += "<td class='lbTd'>"+'最后修改时间'+":&nbsp;</td><td>"+sentDateTime+"</td></tr>";

			html += "<tr><td class='lbTd'>"+'资源类型'+":&nbsp;</td><td colspan=5>"+docResourceType.OUTFAX+"</td></tr>";
			html += "<tr><td class='lbTd'>"+'注释'+":&nbsp;</td><td colspan=5>"+vals.comment+"</td></tr>";

			html +="</tbody></table>";
			return html;
		}

	},
	createTaskList: function(process) {
		var me = this;
		var taskPal = viewFaxFileTab.down('#taskInfo');
		taskPal.firstAdd = false;
		(new Ext.util.DelayedTask()).delay(100, function() {
			Ext.Array.each(process, function(item,index,alls) {
				taskPal.add({
					xtype:'fieldset',
					collapsible:true,
					title:'步骤'+(index+1)+':'+item.acttivityName,
					html:me.createTask(item)
				});
			});
			viewFaxFileTab.doLayout();
		});
	},
	createTask: function(process) {
		var vals = process;
		var html = "";

		html += "<table cellspacing='0' class='myTable'><tbody>";
		var activityStatus = updataAcStatus(vals.activityStatus);
		html += "<tr><td class='lbTd'>"+'状态'+":&nbsp;</td><td>"+activityStatus+"</td>";
		var approver = '&nbsp;';
		if(vals.approver.length > 0) {
			approver =vals.approver;
		}
		html += "<td class='lbTd' >"+'实际审批人'+":&nbsp;</td><td colspan=3>"+approver+"</td></tr>";

		var userList =  Ext.JSON.decode(vals.userList);
		var usersFText = '';
		Ext.Array.each(userList, function(name) {
			usersFText+=name+',';
		});
		usersFText = usersFText.replace('@tijiaoren@','任务发起人');
		usersFText = usersFText.substring(0,usersFText.length-1);
		html += "<tr><td class='lbTd'>"+'审批者列表'+":&nbsp;</td><td colspan=5>"+usersFText+"</td></tr>";

		html += "<tr><td class='lbTd'>"+'处理意见'+":&nbsp;</td><td colspan=5>"+vals.taskNote+"</td></tr>";
		html +="</tbody></table>";
		return html;

	},
	createWorkFlow: function(record) {
		//getwfinfo
		var me = this;
		var workflowPal = viewFaxFileTab.down('#workflowInfo');
		var vals = record.data;
		//调用call
		var param = {};
		//param.docid = vals.docID;
		param.sessiontoken = Ext.util.Cookies.get("sessiontoken");
		param.taskid = vals.workflowTaskID;

		WsCall.call('getwfinfo', param, function(response, opts) {
			var data = Ext.JSON.decode(response.data);
			workflowPal.firstAdd = false;
			var html = '';
			Ext.Array.each(data, function(item,index,alls) {
				//[2012-03-16 08:44:30]
				var time = item.substring(1,20);
				time = UTCtoLocal(time);
				var otStr = item.substring(21,item.length);
				html+= '['+time+'] '+otStr+'<br/>';
			});
			workflowPal.update(html);
		}, function(response, opts) {
			if(!errorProcess(response.code)) {
				Ext.Msg.alert('失败', response.msg);
			}
		}, true,'加载中...',Ext.getBody(),50);
	}
});

var createTaskgirdHtml = new createTaskgirdHtml();

//收件箱对应详细资料form
function loadDetailFormForTaskgrid(record) {
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
			basePal.update(createTaskgirdHtml.createBase(record));
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
				if(record.data.resourceID != 0 && (record.data.resourceType =='INFAX'||record.data.resourceType =='OUTFAX')) {
					orcPal.removeAll();
					orcPal.record = record;
					orcPal.firstAdd = true;
					orcPal.show();
					orcPal.collapse();
				} else {
					orcPal.hide();
				}
			}
			var taskPal = me.down('#taskInfo');
			if(taskPal) {
				var reVal = Ext.JSON.decode(record.data.process);
				if(reVal.length > 0) {
					taskPal.removeAll();
					taskPal.record = reVal;
					taskPal.firstAdd = true;
					taskPal.show();
					var process = Ext.JSON.decode(record.data.process);
					taskPal.update(createTaskgirdHtml.createTaskList(process));
					taskPal.collapse();

				} else {
					taskPal.hide();
				}
			}
			var workflowPal = me.down('#workflowInfo');
			if(workflowPal) {
				if(record.data.resourceIDs != 0) {
					workflowPal.removeAll();
					workflowPal.record = record;
					workflowPal.firstAdd = true;
					workflowPal.show();
					workflowPal.collapse();
				} else {
					workflowPal.hide();
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
							com.update(createTaskgirdHtml.createBase(record));
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
											createTaskgirdHtml.createTpl(com,com.record.data.resourceID,com.record.data.resourceType);
										} else {
											createTaskgirdHtml.createTpl(com,record.data.resourceID,record.data.resourceType);
										}

									}
								});
								//com.update(createTaskgirdHtml.createTpl(record,'taskgrid'));
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
										com.update(createTaskgirdHtml.createAtt(com.record));
									} else {
										com.update(createTaskgirdHtml.createAtt(record));
									}
								}
							});
						}
					}
				});

				var flag = record.data.resourceID != 0 && (record.data.resourceType =='INFAX'||record.data.resourceType =='OUTFAX');

				pal.add({
					title:'原始资源信息',
					collapsed:true,
					hidden:flag ?false:true,
					record:'',
					firstAdd:true,
					itemId:'orcInfo',
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createTaskgirdHtml.createOrcList(com.record));
									} else {
										com.update(createTaskgirdHtml.createOrcList(record));
									}
								}
							});
						}
					}
				});

				pal.add({
					title:'步骤',
					collapsed:true,
					//hidden:vals.resourceIDs !=0 ?false:true,
					record:'',
					firstAdd:true,
					itemId:'taskInfo',
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									var process = Ext.JSON.decode(record.data.process);
									com.update(createTaskgirdHtml.createTaskList(process));
								}
							});
						}
					}
				});

				pal.add({
					title:'任务日志',
					collapsed:true,
					//hidden:vals.resourceIDs !=0 ?false:true,
					record:'',
					firstAdd:true,
					itemId:'workflowInfo',
					listeners: {
						render: function(com) {
							com.toggleCmp.on('click', function(dd,tt,aa,ss) {
								if(!com.collapsed && com.firstAdd) {
									if(com.record != '') {
										com.update(createTaskgirdHtml.createWorkFlow(com.record));
									} else {
										com.update(createTaskgirdHtml.createWorkFlow(record));
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