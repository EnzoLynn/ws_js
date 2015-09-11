//收件箱用
var infaxInfo = {
	infaxModelMap : new Ext.util.MixedCollection(),//当前model
	infaxColMap :  new Ext.util.MixedCollection(),//当前columns
	loadDefault: function() {
		var me = this;
		me.infaxModelMap.clear();
		me.infaxColMap.clear();
		//初始化fields
		var infaxModelArr = [{
			name: 'inFaxID',
			type: 'string'
		},{
			name: 'callerID',
			type: 'string'
		},{
			name: 'DID',
			type: 'string'
		},{
			name: 'callerCSID',
			type: 'string'
		},{
			name: 'callerOrganization',
			type: 'string'
		},{
			name: 'callerName',
			type: 'string'
		},{
			name: 'receiveDateTime',
			type: 'string'
		},{
			name: 'pages',
			type: 'string'
		},{
			name: 'faxResolution',
			type: 'string'
		},{
			name: 'portName',
			type: 'string'
		},{
			name: 'subject',
			type: 'string'
		},{
			name: 'comment',
			type: 'string'
		},{
			name: 'protocol',
			type: 'string'
		},{
			name: 'DTMF',
			type: 'string'
		},{
			name: 'faxFlag',
			type: 'string'
		},{
			name: 'faxFileID',
			type: 'string'
		},{
			name: 'version',
			type: 'string'
		},        //判断是否为已读 0 未读， 1 已读
		{
			name: 'duration',
			type: 'string'
		},{
			name: 'receiveDate',
			type: 'string'
		},{
			name: 'owner',
			type: 'string'
		},{
			name: 'waveFaxUserID',
			type: 'string'
		},{
			name: 'templateid',
			type: 'string'
		},{
			name: 'attach',
			type: 'string'
		}	//附件
		]

		Ext.Array.each(infaxModelArr, function(item,index,alls) {
			me.infaxModelMap.add(item.name,item);
		});
		//初始化columns
		var infaxColArr = [{
			id:'inFaxID',
			text: '流水号',
			dataIndex: 'inFaxID',
			width:100,
			renderer: function(value, metaData, record) {
				if(record.data.attach.length > 0) {
					return "<span><img src='resources/images/pub/attach.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecord(value, metaData, record) + '</span>';
				}
				return "<span><img src='resources/images/fax/inFax.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecord(value, metaData, record) + '</span>';
			}
		},{
			id:'callerCSID',
			text: 'CSID',
			dataIndex: 'callerCSID',
			renderer: updateRecord,
			width: 150
		},{
			id:'DID',
			text: '传真DID',
			dataIndex: 'DID',
			renderer: updateRecord,
			width: 150,
			hidden: true
		},{
			id:'callerID',
			text: '呼叫者标识',
			dataIndex: 'callerID',
			renderer: updateRecord,
			width: 150
		},{
			id:'callerOrganization',
			text: '发送者组织',
			dataIndex: 'callerOrganization',
			hidden: true,
			renderer: updateRecord,
			width: 150
		},{
			id:'callerName',
			text: '发送者名称',
			dataIndex: 'callerName',
			hidden: true,
			renderer: updateRecord,
			width: 150
		},{
			id:'receiveDateTime',
			text: '接收时间',
			dataIndex: 'receiveDateTime',
			width: 160,
			renderer: function(value, metaData, record) {
				return updateRecord(UTCtoLocal(value), metaData, record);
			}
		},{
			id:'pages',
			text: '传真页数',
			dataIndex: 'pages',
			renderer: updateRecord,
			width: 60
		},{
			id:'faxResolution',
			text: '分辨率',
			dataIndex: 'faxResolution',
			hidden: true,
			renderer: function(value, metaData, record) {
				return updateRecord(faxResolutionArr[value], metaData, record);
			}
		},{
			id:'portName',
			text: '使用的设备端口名称',
			dataIndex: 'portName',
			width: 150,
			renderer: updateRecord,
			hidden: true
		},{
			id:'subject',
			text: '主题',
			dataIndex: 'subject',
			width: 280,
			renderer: updateRecord,
			hidden: false
		},{
			id:'faxFlag',
			text: '传真标签',
			dataIndex: 'faxFlag',
			renderer: function(value, metaData, record) {
				return "<span><img src='resources/images/fax/flag/flag_blue.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecord(faxFlagArr[value], metaData, record) + '</span>';
			}
		},{
			id:'comment',
			text: '注释',
			dataIndex: 'comment',
			width: 300,
			renderer: updateRecord
		},{
			id:'protocol',
			text: '传真协议信息',
			dataIndex: 'protocol',
			hidden: true,
			width: 260,
			renderer: updateRecord
		},{
			id:'DTMF',
			text: '传真DTMF',
			dataIndex: 'DTMF',
			hidden: true,
			renderer: updateRecord
		},{
			id:'duration',
			text: '持续时间',
			dataIndex: 'duration',
			renderer: function(value, metaData, record) {
				return updateRecord(faxDuration(value), metaData, record);
			},
			hidden: true
		}
		]
		//可比state对排序,控制可见
		Ext.Array.each(infaxColArr, function(item,index,alls) {
			item.id = '11-'+item.id;
			me.infaxColMap.add(item.dataIndex,item);
		});
		//不用排序，取下width,hidden
		resumeGridColumns(myStates.infaxgridState.columns,me.infaxColMap);

	}
}

//发件箱用
var outfaxInfo = {
	outfaxModelMap : new Ext.util.MixedCollection(),//当前model
	outfaxColMap :  new Ext.util.MixedCollection(),//当前columns
	loadDefault: function() {
		var me = this;
		me.outfaxModelMap.clear();
		me.outfaxColMap.clear();
		//初始化fields
		var outfaxModelArr = [{
			name: 'outFaxID',
			type: 'string'
		},{
			name: 'templateid',
			type: 'string'
		},{
			name: 'recipient',
			type: 'string'
		},{
			name: 'faxNumber',
			type: 'string'
		},{
			name: 'faxNumberExt',
			type: 'string'
		},{
			name: 'sentDateTime',
			type: 'string'
		},{
			name: 'subject',
			type: 'string'
		},{
			name: 'pages',
			type: 'string'
		},{
			name: 'sentPages',
			type: 'string'
		},{
			name: 'priority',
			type: 'string'
		},{
			name: 'scheduleDateTime',
			type: 'string'
		},{
			name: 'status',
			type: 'string'
		},{
			name: 'comment',
			type: 'string'
		},{
			name: 'duration',
			type: 'string'
		},{
			name: 'portName',
			type: 'string'
		},{
			name: 'retryInterval',
			type: 'string'
		},{
			name: 'retryTime',
			type: 'string'
		},{
			name: 'desireRetryTime',
			type: 'string'
		},{
			name: 'protocol',
			type: 'string'
		},{
			name: 'recipientMobileNumber',
			type: 'string'
		},{
			name: 'recipientEmail',
			type: 'string'
		},{
			name: 'recipientOrganization',
			type: 'string'
		},{
			name: 'faxResolution',
			type: 'string'
		},{
			name: 'faxFileID',
			type: 'string'
		},{
			name: 'faxFlag',
			type: 'string'
		},{
			name:'tasks',
			type: 'string'
		},{
			name: 'attach',
			type: 'string'
		}	//附件
		]

		Ext.Array.each(outfaxModelArr, function(item,index,alls) {
			me.outfaxModelMap.add(item.name,item);
		});
		//初始化columns
		var outfaxColArr = [{
			id:'outFaxID',
			text: '流水号',
			dataIndex: 'outFaxID',
			width:100,
			renderer: function(value,metaData, record) {
				if(record.data.attach.length > 0) {
					return "<span><img src='resources/images/pub/attach.png' style='margin-bottom: -5px;'>&nbsp;" + updateOutFaxRec(value,metaData, record) + '</span>';
				}
				return "<span><img src='resources/images/fax/inFax.png' style='margin-bottom: -5px;'>&nbsp;" + updateOutFaxRec(value,metaData, record) + '</span>';
			}
		},{
			id:'recipient',
			text: '收件人',
			dataIndex: 'recipient',
			width: 150,
			renderer:updateOutFaxRec
		},{
			id:'faxNumber',
			text: '传真号码 ',
			dataIndex: 'faxNumber',
			width: 150,
			renderer: function(value, metaData, record) {
				if(record.get('faxNumberExt').length > 0) {
					return updateOutFaxRec(value + " X " + record.get('faxNumberExt'), metaData, record);
				} else {
					return updateOutFaxRec(value, metaData, record);
				}
			}
		},{
			id:'sentDateTime',
			text: '发送时间',
			dataIndex: 'sentDateTime',
			width: 120,
			renderer: function(value,metaData, record) {
				if(value.match('1970-0')) {
					return '';
				} else {
					return updateOutFaxRec(UTCtoLocal(value),metaData, record);
				}
			},
			hidden: true
		},{
			id:'subject',
			text: '主题',
			dataIndex: 'subject',
			width: 200,
			renderer:updateOutFaxRec
		},{
			id:'pages',
			text: '总页数',
			dataIndex: 'pages',
			width:60,
			renderer:updateOutFaxRec
		},{
			id:'sentPages',
			text: '发送页数',
			dataIndex: 'sentPages',
			width:60,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'priority',
			text: '优先度',
			dataIndex: 'priority',
			width:70,
			hidden: false,
			renderer:updateOutFaxRec
		},{
			id:'scheduleDateTime',
			text: '安排发送时间 ',
			dataIndex: 'scheduleDateTime',
			width: 140,
			hidden: true,
			renderer: function(value,metaData, record) {
				if(value.match('1970-0')) {
					return '';
				} else {
					return updateOutFaxRec(UTCtoLocal(value),metaData, record);
				}
			}
		},{
			id:'status',
			text: '发送状态',
			dataIndex: 'status',
			width: 150,
			renderer: function(value,metaData, record) {
				return "<span><img src='resources/images/fax/status/outstatus."+ value + ".png' style='margin-bottom: -5px;'>&nbsp;" +updateOutFaxRec(statusArr[value],metaData, record) +'</span>';

			}
		},{
			id:'comment',
			text: '注释',
			dataIndex: 'comment',
			width: 200,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'faxFlag',
			text: '标签',
			dataIndex: 'faxFlag',
			width: 200,
			hidden: false,
			renderer: function(value,metaData, record) {
				return "<span><img src='resources/images/fax/flag/flag_blue.png' style='margin-bottom: -5px;'>&nbsp;" + updateOutFaxRec(faxFlagArr[value],metaData, record) + '</span>';
			}
		},{
			id:'duration',
			text: '持续时间',
			dataIndex: 'duration',
			width: 100,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'portName',
			text: '设备端口号',
			dataIndex: 'portName',
			width: 80,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'retryInterval',
			text: '重试间隔',
			dataIndex: 'retryInterval',
			width: 80,
			hidden: true,
			renderer: function(value,metaData, record) {
				return updateOutFaxRec(faxDuration(value),metaData, record);
			}
		},{
			id:'retryTime',
			text: '实际重发次数',
			dataIndex: 'retryTime',
			width: 80,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'desireRetryTime',
			text: '要求重发次数',
			dataIndex: 'desireRetryTime',
			width: 80,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'protocol',
			text: '传真协议信息',
			dataIndex: 'protocol',
			width: 80,
			hidden: true,
			renderer:updateOutFaxRec
		},				//zehng
		{
			id:'recipientMobileNumber',
			text: '收件人手机',
			dataIndex: 'recipientMobileNumber',
			width: 80,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'recipientEmail',
			text: '收件人邮箱',
			dataIndex: 'recipientEmail',
			width: 80,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'recipientOrganization',
			text: '收件人组织',
			dataIndex: 'recipientOrganization',
			width: 80,
			hidden: true,
			renderer:updateOutFaxRec
		},{
			id:'faxResolution',
			text: '分辨率',
			dataIndex: 'faxResolution',
			width: 80,
			hidden: true,
			renderer: function(value,metaData, record) {
				return updateOutFaxRec(faxResolutionArr[value],metaData, record);
			}
		}]

		Ext.Array.each(outfaxColArr, function(item,index,alls) {
			item.id = '22-'+item.id;
			me.outfaxColMap.add(item.dataIndex,item);
		});
		//不用排序，取下width,hidden
		resumeGridColumns(myStates.outfaxgridState.columns,me.outfaxColMap);
	}
}

//已发件箱用
var sucfaxInfo = {
	sucfaxModelMap : new Ext.util.MixedCollection(),//当前model
	sucfaxColMap :  new Ext.util.MixedCollection(),//当前columns
	loadDefault: function() {
		var me = this;
		me.sucfaxModelMap.clear();
		me.sucfaxColMap.clear();
		//初始化fields
		var sucfaxModelArr = [{
			name: 'outFaxID',
			type: 'string'
		},{
			name: 'templateid',
			type: 'string'
		},{
			name: 'faxNumber',
			type: 'string'
		},{
			name: 'faxNumberExt',
			type: 'string'
		},{
			name: 'duration',
			type: 'string'
		},{
			name: 'errCode',
			type: 'string'
		},{
			name: 'pages',
			type: 'string'
		},{
			name: 'sentPages',
			type: 'string'
		},{
			name: 'recipient',
			type: 'string'
		},{
			name: 'subject',
			type: 'string'
		},{
			name: 'comment',
			type: 'string'
		},{
			name: 'sentDateTime',
			type: 'string'
		},{
			name: 'status',
			type: 'string'
		},{
			name: 'sentDate',
			type: 'string'
		},{
			name: 'portName',
			type: 'string'
		},{
			name: 'retryInterval',
			type: 'string'
		},{
			name: 'retryTime',
			type: 'string'
		},{
			name: 'desireRetryTime',
			type: 'string'
		},{
			name: 'protocol',
			type: 'string'
		},{
			name: 'recipientMobileNumber',
			type: 'string'
		},{
			name: 'recipientEmail',
			type: 'string'
		},{
			name: 'recipientOrganization',
			type: 'string'
		},{
			name: 'faxResolution',
			type: 'string'
		},{
			name: 'scheduleDateTime',
			type: 'string'
		},{
			name: 'priority',
			type: 'string'
		},{
			name: 'faxFileID',
			type: 'string'
		},{
			name: 'faxFlag',
			type: 'string'
		},{
			name:'tasks',
			type: 'string'
		},{
			name: 'attach',
			type: 'string'
		}	//附件
		]

		Ext.Array.each(sucfaxModelArr, function(item,index,alls) {
			me.sucfaxModelMap.add(item.name,item);
		});
		//初始化columns
		var sucfaxColArr = [{
			id:'outFaxID',
			text: '流水号',
			dataIndex: 'outFaxID',
			width: 100,
			renderer: function(value, metaData, record) {
				if(record.data.attach.length > 0) {
					return "<span><img src='resources/images/pub/attach.png' style='margin-bottom: -5px;'>&nbsp;" + updateSuccoutFaxRecord(value, metaData, record) + '</span>';
				}
				return "<span><img src='resources/images/fax/inFax.png' style='margin-bottom: -5px;'>&nbsp;" + updateSuccoutFaxRecord(value, metaData, record) + '</span>';

			}
		},{
			id:'recipient',
			text: '收件人',
			dataIndex: 'recipient',
			width:120,
			renderer: updateSuccoutFaxRecord
		},{
			id:'faxNumber',
			text: '传真号码',
			dataIndex: 'faxNumber',
			width: 150,
			renderer: function(value, metaData, record) {
				if(record.get('faxNumberExt').length > 0) {
					value = value + " X " + record.get('faxNumberExt');
				}
				return updateSuccoutFaxRecord(value,  metaData, record);
			}
		},{
			id:'sentDateTime',
			text: '发送时间',
			dataIndex: 'sentDateTime',
			width: 150,
			renderer: function(value, metaData, record) {
				return updateSuccoutFaxRecord(UTCtoLocal(value),  metaData, record);
			}
		},{
			id:'subject',
			text: '主题',
			dataIndex: 'subject',
			width: 200,
			renderer: updateSuccoutFaxRecord
		},{
			id:'comment',
			text: '注释',
			dataIndex: 'comment',
			width: 100,
			renderer: updateSuccoutFaxRecord,
			hidden: true
		},{
			id:'duration',
			text: '持续时间 ',
			dataIndex: 'duration',
			width: 100,
			renderer: function(value, metaData, record) {
				return updateSuccoutFaxRecord(faxDuration(value), metaData, record);
			},
			hidden: true
		},{
			id:'errCode',
			text: '错误原因',
			dataIndex: 'errCode',
			width: 120,
			renderer: function(value, metaData, record) {

				return updateSuccoutFaxRecord(outFaxErrCodeArr[value], metaData, record);
			}
		},{
			id:'pages',
			text: '总页数',
			dataIndex: 'pages',
			width: 60,
			renderer: updateSuccoutFaxRecord
		},{
			id:'sentPages',
			text: '发送页数',
			dataIndex: 'sentPages',
			width: 70,
			renderer: updateSuccoutFaxRecord
		},{
			id:'status',
			text: '发送状态',
			dataIndex: 'status',
			width: 120,
			renderer: function(value, metaData, record) {
				if(value == '9') {
					return "<span><img src='resources/images/fax/status/outstatus.9.png' style='margin-bottom: -5px;'>&nbsp;" + updateSuccoutFaxRecord('成功', metaData, record) +'</span>';
				} else {
					return "<span><img src='resources/images/fax/status/outstatus.8.png' style='margin-bottom: -5px;'>&nbsp; "+updateSuccoutFaxRecord('失败', metaData, record) +'</span>';
				}
			}
		},{
			id:'portName',
			text: '设备端口号',
			dataIndex: 'portName',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},{
			id:'retryInterval',
			text: '重试间隔',
			dataIndex: 'retryInterval',
			width: 80,
			hidden: true,
			renderer: function(value, metaData, record) {
				return updateSuccoutFaxRecord(faxDuration(value), metaData, record);
			}
		},{
			id:'retryTime',
			text: '实际重发次数',
			dataIndex: 'retryTime',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},{
			id:'desireRetryTime',
			text: '要求重发次数',
			dataIndex: 'desireRetryTime',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},{
			id:'protocol',
			text: '传真协议信息',
			dataIndex: 'protocol',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},				//zehng
		{
			id:'recipientMobileNumber',
			text: '收件人手机',
			dataIndex: 'recipientMobileNumber',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},{
			id:'recipientEmail',
			text: '收件人邮箱',
			dataIndex: 'recipientEmail',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},{
			id:'recipientOrganization',
			text: '收件人组织',
			dataIndex: 'recipientOrganization',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},{
			id:'faxResolution',
			text: '分辨率',
			dataIndex: 'faxResolution',
			width: 80,
			hidden: true,
			renderer: function(value, metaData, record) {
				return updateSuccoutFaxRecord(faxResolutionArr[value], metaData, record);
			}
		},{
			id:'scheduleDateTime',
			text: '安排发送时间',
			dataIndex: 'scheduleDateTime',
			width: 80,
			hidden: true,
			renderer: function(value, metaData, record) {
				if(value.match('1970-0')) {
					return '';
				} else {
					return updateSuccoutFaxRecord(UTCtoLocal(value), metaData, record);
				}
			}
		},{
			id:'priority',
			text: '优先度',
			dataIndex: 'priority',
			width: 80,
			hidden: true,
			renderer: updateSuccoutFaxRecord
		},{
			id:'faxFlag',
			text: '传真标签',
			dataIndex: 'faxFlag',
			renderer: function(value, metaData, record) {
				return "<span><img src='resources/images/fax/flag/flag_blue.png' style='margin-bottom: -5px;'>&nbsp;" + updateSuccoutFaxRecord(faxFlagArr[value], metaData, record) + '</span>';
			}
		}]

		Ext.Array.each(sucfaxColArr, function(item,index,alls) {
			item.id = '33-'+item.id;
			me.sucfaxColMap.add(item.dataIndex,item);
		});
		//不用排序，取下width,hidden
		resumeGridColumns(myStates.succoutfaxgridState.columns,me.sucfaxColMap);
	}
}

//文档管理用
var docManagerInfo = {
	docManagerModelMap : new Ext.util.MixedCollection(),//当前model
	docManagerColMap :  new Ext.util.MixedCollection(),//当前columns
	loadDefault: function() {
		var me = this;
		me.docManagerModelMap.clear();
		me.docManagerColMap.clear();
		//初始化fields
		var docManagerModelArr = [{
			name: 'docID',
			type: 'string'
		},{
			name: 'templateid',
			type: 'string'
		},{
			name: 'refDocID',
			type: 'string'
		},{
			name: 'customID',
			type: 'string'
		},{
			name: 'keyWord',
			type: 'string'
		},{
			name: 'resourceType',
			type: 'string'
		},{
			name: 'resourceIDs',
			type: 'string'
		},{
			name: 'serverID',
			type: 'string'
		},{
			name: 'faxFileID',
			type: 'string',
			mapping:'fileID'
		},{
			name: 'pages',
			type: 'string'
		},{
			name: 'attachingFileIDs',
			type: 'string'
		},{
			name: 'folderID',
			type: 'string'
		},{
			name: 'userName',
			type: 'string'
		},{
			name: 'isInRecycle',
			type: 'string'
		},{
			name: 'createUserID',
			type: 'string'
		},{
			name: 'createDateTime',
			type: 'string'
		},{
			name: 'createDate',
			type: 'string'
		},{
			name: 'lastMdfUserName',
			type: 'string'
		},{
			name: 'lastMdfDateTime',
			type: 'string'
		},{
			name: 'comment',
			type: 'string'
		},{
			name: 'docFlag',
			type: 'string'
		},{
			name: 'workflowStatus',
			type: 'string'
		},{
			name: 'version',
			type: 'string'//判断是否为已读 0 未读， 1 已读
		},{
			name:'owner',
			type:'string'
		},{
			name: 'attach',
			type: 'string'
		}	//附件
		]

		Ext.Array.each(docManagerModelArr, function(item,index,alls) {
			me.docManagerModelMap.add(item.name,item);
		});
		//初始化columns
		var docManagerColArr = [{
			id:'docID',
			text: '文档ID',
			dataIndex: 'docID',
			width: 100,
			renderer: function(value, metaData, record) {
				if(record.data.attach.length > 0) {
					return "<span><img src='resources/images/pub/attach.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecord(value, metaData, record) + '</span>';
				}
				return "<span><img src='resources/images/fax/inFax.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecord(value, metaData, record) + '</span>';
			}
		},{
			id:'refDocID',
			text: '参考文档文件ID',
			dataIndex: 'refDocID',
			renderer: function(value, metaData, record) {
				if(value == '0') {
					return '';
				}
				return updateRecord(value, metaData, record);
			},
			width: 150
		},{
			id:'customID',
			text: '自定义编号',
			dataIndex: 'customID',
			renderer: updateRecord,
			width: 150
		},{
			id:'keyWord',
			text: '关键字',
			dataIndex: 'keyWord',
			renderer: updateRecord,
			width: 150
		},{
			id:'resourceType',
			text: '资源类型',
			dataIndex: 'resourceType',
			renderer: function(value, metaData, record) {
				return updateRecord(docResourceType[value], metaData, record);
			}
		},{
			id:'pages',
			text: '页数',
			dataIndex: 'pages',
			renderer: updateRecord,
			width: 150
		},{
			id:'userName',
			text: '文档归档者',
			dataIndex: 'userName',
			renderer: updateRecord,
			width: 150
		},{
			id:'createDateTime',
			text: '创建时间',
			dataIndex: 'createDateTime',
			width: 160,
			renderer: function(value, metaData, record) {
				return updateRecord(UTCtoLocal(value), metaData, record);
			}
		},{
			id:'docFlag',
			text: '标签',
			dataIndex: 'docFlag',
			renderer: function(value, metaData, record) {
				return "<span><img src='resources/images/fax/flag/flag_blue.png' style='margin-bottom: -5px;'>&nbsp;" + updateRecord(faxFlagArr[value], metaData, record) + '</span>';
			}
		},{
			id:'comment',
			text: '注释',
			dataIndex: 'comment',
			width: 300,
			renderer: updateRecord
		},{
			id:'lastMdfUserName',
			text: '最后修改用户',
			dataIndex: 'lastMdfUserName',
			hidden: true,
			renderer: updateRecord
		},{
			id:'lastMdfDateTime',
			text: '最后修改时间',
			dataIndex: 'lastMdfDateTime',
			width: 160,
			renderer: function(value, metaData, record) {
				return updateRecord(UTCtoLocal(value), metaData, record);
			},
			hidden: true
		}]

		Ext.Array.each(docManagerColArr, function(item,index,alls) {
			item.id = '44-'+item.id;
			me.docManagerColMap.add(item.dataIndex,item);
		});
		//不用排序，取下width,hidden
		resumeGridColumns(myStates.docgridState.columns,me.docManagerColMap);
	}
}

//工作流任务用
var taskInfo = {
	taskModelMap : new Ext.util.MixedCollection(),//当前model
	taskColMap :  new Ext.util.MixedCollection(),//当前columns
	loadDefault: function() {
		var me = this;
		me.taskModelMap.clear();
		me.taskColMap.clear();
		//初始化fields
		var taskModelArr = [{
			name: 'workflowTaskID',
			type: 'string'
		},{
			name: 'templateid',
			type: 'string'
		},{
			name: 'workflowRuleID',
			type: 'string'
		},{
			name:'workflowRuleName',
			type:'string'
		},{
			name: 'currentWorkflowItemID',
			type: 'string'
		},{
			name: 'currentWorkflowItemName',
			type: 'string'
		},{
			name: 'serverID',
			type: 'string'
		},{
			name: 'userID',
			type: 'string'
		},{
			name: 'userName',
			type: 'string'
		},{
			name: 'taskComment',
			type: 'string'
		},{
			name: 'taskDataList',
			type: 'string'
		},{
			name: 'fileID',
			type: 'string'
		},{
			name: 'resourceID',
			type: 'string'
		},{
			name:'resourceType',
			type:'string'
		},{
			name: 'attachmentFileIDs',
			type: 'string'
		},{
			name: 'taskFlag',
			type: 'string'
		},{
			name: 'taskRefURL',
			type: 'string'
		},{
			name: 'taskExtData',
			type: 'string'
		},{
			name: 'faxFileID',
			type: 'string',
			mapping:'currentFileID'
		},{
			name: 'workflowStatus',
			type: 'string'
		},{
			name: 'workflowErrCode',
			type: 'string'
		},{
			name: 'startTime',
			type: 'string'
		},{
			name: 'endTime',
			type: 'string'
		},{
			name:'process',
			type:'string'
		},{
			name:'owner',
			type:'string'
		},{
			name:'workflowmasksub',
			type:'string'
		},{
			name: 'attach',
			type: 'string'
		}	//附件
		]

		Ext.Array.each(taskModelArr, function(item,index,alls) {
			me.taskModelMap.add(item.name,item);
		});
		//alert(wfTree.getSelectionModel().getSelection()[0].data.id.toString().indexOf('wfinon') == -1);
		//初始化columns
		var taskColArr = [{
			id:'workflowTaskID',
			text: '任务ID',
			groupable:false,
			dataIndex: 'workflowTaskID',
			width: 100,
			renderer: updateWfGridIcon
		},{
			text:'提交者',
			dataIndex:'userName',
			width:100,
			renderer: updateRecordWf
		},{
			id:'workflowRuleName',
			text: '规则类别',			
			dataIndex: 'workflowRuleName',
			renderer: function(value, metaData, record) {
				if(value == '0') {
					return '';
				}
				return updateRecordWf(value, metaData, record);
			},
			width: 150
		},{
			id:'taskFlag',
			text: '',			
			dataIndex: 'taskFlag',
			groupable:false,
			sortable:false,
			resizable:false,
			hideable:false,
			renderer: function(value, metaData, record) {				
				return "<img src='resources/images/workFlow/flag/wFlag"+value+".png'>";				
			},			
			width: 25
		},{
			id:'process',
			text: '工作流任务图',
			groupable:false,
			width:400,
			dataIndex: 'process',
			renderer: updateWfTaskRecord
		},{
			id:'workflowStatus',
			text: '状态',
			dataIndex: 'workflowStatus',
			renderer: function(value, metaData, record) {
				var nVal = updateWfGridStatus(value, metaData, record);
				return updateRecordWf(nVal, metaData, record);
			},
			width: 150
		},{
			id:'taskComment',
			text: '任务主题',
			dataIndex: 'taskComment',
			renderer: updateRecordWf,
			width: 200
		},{
			id:'startTime',
			text: '开始时间',
			dataIndex: 'startTime',
			width: 160,
			renderer: function(value, metaData, record) {
				return updateRecordWf(UTCtoLocal(value), metaData, record);
			}
		},{
			id:'endTime',
			text: '完成时间',
			dataIndex: 'endTime',
			width: 160,
			renderer: function(value, metaData, record) {
				return updateRecordWf(UTCtoLocal(value), metaData, record);
			}
		}]

		Ext.Array.each(taskColArr, function(item,index,alls) {
			item.id = '55-'+item.id;
			me.taskColMap.add(item.dataIndex,item);
		});
		//不用排序，取下width,hidden
		resumeGridColumns(myStates.taskgridState.columns,me.taskColMap);
	}
}




//工作流规则用
// var ruleInfo = {
	// ruleModelMap : new Ext.util.MixedCollection(),//当前model
	// ruleColMap :  new Ext.util.MixedCollection(),//当前columns
	// loadDefault: function() {
		// var me = this;
		// me.ruleModelMap.clear();
		// me.ruleColMap.clear();
		// //初始化fields
		// var ruleModelArr = [{
			// name: 'workflowRuleID',
			// type: 'string'
		// },{
			// name: 'workflowRuleName',
			// type: 'string'
		// },{
			// name: 'serverID',
			// type: 'string'
		// },{
			// name: 'pubFolderID',
			// type: 'string'
		// },{
			// name: 'workflowItemIDs',
			// type: 'string'
		// },{
			// name: 'userIDs',
			// type: 'string'
		// },{
			// name: 'userList',
			// type: 'string'
		// },{
			// name: 'wfCondition',
			// type: 'string'
		// },{
			// name: 'isActive',
			// type: 'string'
		// },{
			// name: 'createTime',
			// type: 'string'
		// },{
			// name: 'lastModifiedTime',
			// type: 'string'
		// },{
			// name: 'createUserID',
			// type: 'string'
		// },{
			// name: 'createUserName',
			// type: 'string'
		// },{
			// name:'process',
			// type:'string'
		// },{
			// name:'steps',
			// type:'string'
		// }]
// 
		// Ext.Array.each(ruleModelArr, function(item,index,alls) {
			// me.ruleModelMap.add(item.name,item);
		// });
		// //初始化columns
		// var ruleColArr = [{
			// id:'workflowRuleName',
			// header: '规则名称',
			// dataIndex: 'workflowRuleName',
			// width: 150
		// },{
			// id: 'userList',
			// header: '用户列表',
			// dataIndex: 'userList',
			// width: 200
		// },{
			// id: 'isActive',
			// header: '是否被激活',
			// dataIndex: 'isActive',
			// width: 70,
			// renderer: function(value, metaData, record) {
				// if(value){
					// return '是';
				// }
				// return '否';
			// }
		// },{
			// id: 'createTime',
			// header: '创建时间',
			// dataIndex: 'createTime',
			// width: 200,
			// renderer: function(value, metaData, record) {
				// return UTCtoLocal(value);
			// }
		// },{
			// id: 'lastModifiedTime',
			// header: '最后修改时间',
			// dataIndex: 'lastModifiedTime',
			// width: 120,
			// renderer: function(value, metaData, record) {
				// return UTCtoLocal(value);
			// }
		// },{
			// id: 'createUserName',
			// header: '创建人',
			// dataIndex: 'createUserName',
			// width: 200
		// }]
// 
		// Ext.Array.each(ruleColArr, function(item,index,alls) {
			// item.id = '66-'+item.id;
			// me.ruleColMap.add(item.dataIndex,item);
		// });
		// //不用排序，取下width,hidden
		// resumeGridColumns(myStates.wfrulegridState.columns,me.ruleColMap);
	// }
// }