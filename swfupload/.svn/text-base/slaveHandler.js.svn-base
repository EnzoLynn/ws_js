//已选择的文件序列
var slaveFilesQueueCol = new Ext.util.MixedCollection();
//已上传的文件序列
var slaveFilesUpedCol = new Ext.util.MixedCollection();
var myidcount = 0;

Ext.define('swfUploadSlaveBaseHandler', {
	cancelQueue: function() {
		slaveUpload.stopUpload();
		var stats;
		do {
			stats = slaveUpload.getStats();
			slaveUpload.cancelUpload();
		} while (stats.files_queued !== 0);
		// slaveFilesUpedCol.each( function(file,index,alls) {
		// if(slaveFilesQueueCol.containsKey(file.name)) {
		// slaveFilesQueueCol.removeAtKey(file.name);
		// }
		// });
		slaveFilesQueueCol.each( function(file,index,alls) {
			slaveSwfHandler.myWin.down('#fsupList').remove('cPal'+file.id+file.myid);
			slaveFilesQueueCol.removeAtKey(file.name);
		});
		// slaveFilesUpedCol.each( function(file,index,alls) {
		// if(!slaveFilesQueueCol.containsKey(file.name)) {
		// slaveFilesQueueCol.add(file.name,file);
		// }
		// });
		if(slaveFilesUpedCol.getCount()<swfLimit) {
			stopSwf = false;
		}

	},
	removeOne: function(file,delServer) {

		if(delServer) {
			//调用call
			var param1 = {};
			param1.filename = file.name;
			param1.sessiontoken = Ext.util.Cookies.get("sessiontoken");

			WsCall.call('delSlaveFile', param1, function (response, opts) {

				// if(slaveFilesQueueCol.containsKey(file.name)) {
				// slaveSwfHandler.myWin.down('#fsupList').remove('cPal'+file.id);
				// slaveFilesQueueCol.removeAtKey(file.name);
				// //stopSwf = false;
				// }
				
				if(slaveFilesUpedCol.containsKey(file.name)) {
					slaveSwfHandler.myWin.down('#fsupList').remove('cPal'+file.id+file.myid);
					slaveFilesUpedCol.removeAtKey(file.name);
					stopSwf = false;
				}

			}, function (response, opts) {
				if(!errorProcess(response.code)) {
					Ext.Msg.alert('删除失败', response.msg);
				}
			}, true,'正在从服务器删除文件...',Ext.getBody());
		} else {
			slaveUpload.cancelUpload(file.id,file.name);
			//slaveSwfHandler.myWin.down('#fsupList').removeAll();
			var count = slaveUpload.getStats().files_queued;
			if(count<=0) {
				//slaveSwfHandler.myWin.down('#btnContinue').setDisabled(true);
			}
			slaveSwfHandler.myWin.down('#fsupList').remove('cPal'+file.id+file.myid);
			if(slaveFilesQueueCol.containsKey(file.name)) {
				slaveFilesQueueCol.removeAtKey(file.name);
				//stopSwf = false;
			}
			if(slaveFilesUpedCol.containsKey(file.name)) {
				slaveFilesUpedCol.removeAtKey(file.name);
				stopSwf = false;
			}
		}
		//slaveSwfHandler.changeListHtml();
	},
	changeListHtml: function(file) {
		//alert(file.myidcount);
		var upPal = slaveSwfHandler.myWin.down('#fsupList');
		//var file = slaveUpload.getQueueFile(fid);

		upPal.add({
			xtype:'container',
			itemId:'cPal'+file.id+file.myid,
			myFile:file,
			layout:'hbox',
			defaults: {
				margin:'2 0 4 5'
			},
			items:[{
				xtype:'progressbar',
				width:280,
				itemId:file.id+file.myid,
				//itemId:file.name.replace(/\./g, ''),
				text:file.name+','+'等待...'
			},{
				xtype:'displayfield',
				fieldLabel:'大小',
				labelWidth:60,
				width:130,
				labelAlign:'right',
				value:Ext.util.Format.fileSize(file.size)
			},{
				xtype:'displayfield',
				fieldLabel:'最后修改时间',
				labelWidth:120,
				width:290,
				labelAlign:'right',
				value:Ext.util.Format.date(file.modificationdate ,'Y-m-d H:i:s')
			},{
				xtype:'button',
				text:'取消',
				itemId:'del_'+file.id+file.myid,
				delServer:false,
				iconCls:'imgBtnDel',
				handler: function(com) {
					slaveSwfHandler.removeOne(com.up('container').myFile,com.delServer);
				}
			}]
		});
	},
	preLoad: function() {
		if (!this.support.loading) {
			//Ext.Msg.alert('消息','需要安装Flash Player 9.028  以上版本!');
			//Ext.Msg.alert("You need the Flash Player 9.028 or above to use SWFUpload.");
			return false;
		}
	},
	loadFailed: function() {
		Ext.Msg.alert('消息','SWFUpload加载失败!请稍后重试!');
		//Ext.Msg.alert("Something went wrong while loading SWFUpload. If this were a real application we'd clean up and then give you an alternative");
	},
	fileDialogStart: function() {

	},
	fileQueued: function(file) {
		// if(isUploading) {
		// return false;
		// }

		try {
			//alert(slaveFilesUpedCol.getCount()+":"+slaveFilesQueueCol.getCount());
			if(slaveFilesUpedCol.getCount() >= swfLimit||slaveFilesQueueCol.getCount() >=swfLimit
			||( slaveFilesQueueCol.getCount()>(swfLimit-slaveFilesUpedCol.getCount()))) {
				stopSwf = true;
				return;
			}
			if(slaveFilesQueueCol.containsKey(file.name) || slaveFilesUpedCol.containsKey(file.name)) {
				//this.stopUpload();
				this.cancelUpload(file.id);
				Ext.Msg.alert('错误','已选择过'+file.name+',不能重复选择同名的文件上传');
			} else {
				myidcount++;
				file.myid = myidcount;
				slaveFilesQueueCol.add(file.name,file);
				if(!( slaveFilesQueueCol.getCount()>(swfLimit-slaveFilesUpedCol.getCount()))) {
					//var fid = file.id;
					slaveSwfHandler.changeListHtml(file);
				} else {
					stopSwf = true;
				}

			}

			//slaveSwfHandler.myWin.down('#fsupList').update('Pending..');
		} catch (ex) {
			Ext.Msg.alert('错误',ex);
		}
	},
	fileQueueError: function(file, errorCode, message) {
		try {
			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
				Ext.Msg.alert('错误','超过了最大上传数限制.最多上传'+swfLimit+'个文件');
				//Ext.Msg.alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
				return;
			}
			switch (errorCode) {
				case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
					Ext.Msg.alert('错误','错误原因:文件过大,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
					Ext.Msg.alert('错误','错误原因:文件0字节,文件名:'+file.name+',文件大小: '+file.size);
					//,消息'+message
					//alert("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
					Ext.Msg.alert('错误','错误原因:不支持的文件类型,文件名:'+file.name+',文件大小: '+file.size);
					//alert("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
					Ext.Msg.alert('错误','超过了最大上传数限制.最多上传'+swfLimit+'个文件');
					//this.debug("You have selected too many files.  " +  (message > 1 ? "You may only add " +  message + " more files" : "You cannot add any more files."));
					break;
				default:
					if (file !== null) {
						//Ext.Msg.alert("Unhandled Error");
					}
					Ext.Msg.alert('错误','错误原因:'+ errorCode+',文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
			}
		} catch (ex) {
			Ext.Msg.alert('错误',ex);
		}
	},
	fileDialogComplete: function(numFilesSelected, numFilesQueued) {
		try {

			if(!stopSwf) {
				this.startUpload();
			} else {
				if(numFilesSelected > 0) {
					slaveSwfHandler.cancelQueue();
					Ext.Msg.alert('错误','超过了最大上传数限制.最多上传'+swfLimit+'个文件');
				}
				return;
			}

		} catch (ex) {
			//Ext.Msg.alert('错误1',ex);
		}
	},
	uploadStart: function(file) {		//isUploading = true;
		this.setButtonDisabled(true);
		this.setButtonText('<span class="grayText">'+'添加文件'+'</span>');
		this.setButtonTextStyle('.grayText {color:#969696;font-size:12px;}');
		//alert('start'+slaveFilesUpedCol.getCount()+stopSwf);
		if(!slaveFilesUpedCol.containsKey(file.name)) {
			slaveFilesUpedCol.add(file.name,file);
		}
		try {
			var xtype = slaveSwfHandler.myWin.getXType();
			if(xtype =='InForward') {
				slaveSwfHandler.myWin.down('#forwarUserDic').setDisabled(false);
				slaveSwfHandler.myWin.down('#submit').setDisabled(true);
				slaveSwfHandler.myWin.down('#btnCancel1').setDisabled(true);
				slaveSwfHandler.myWin.isuploading = true;
			} else if(xtype =='docattwin') {
				slaveSwfHandler.myWin.down('#btnOk1').setDisabled(true);
				slaveSwfHandler.myWin.down('#btnCancel1').setDisabled(true);

				slaveSwfHandler.myWin.isuploading = true;
			}

		} catch (ex) {
			//alert(ex);
		}
		return true;
	},
	uploadProgress: function(file1, bytesLoaded, bytesTotal) {
		try {

			var percent = bytesLoaded / bytesTotal;
			//alert(bytesLoaded/1024+'---'+bytesTotal/1024+'--'+percent);

			var file = slaveFilesQueueCol.get(file1.name);
			//alert(file.myid);
			slaveSwfHandler.myWin.down('#'+file.id+file.myid).updateProgress(percent,file.name+',上传中...');
		} catch (ex) {
			//Ext.Msg.alert('错误2',ex);
		}
	},
	uploadSuccess: function (file1, serverData) {
		try {
			var file = slaveFilesQueueCol.get(file1.name);
			//alert(file.myid);
			slaveSwfHandler.myWin.down('#'+file.id+file.myid).updateProgress(1,file.name+'完成.');
			slaveSwfHandler.myWin.down('#del_'+file.id+file.myid).delServer = true;
		} catch (ex) {
			//Ext.Msg.alert('错误3',ex);
		}
	},
	uploadComplete: function (file) {
		try {
			if(!slaveFilesUpedCol.containsKey(file.name)) {
				slaveFilesUpedCol.add(file.name,file);
			}
			//slaveFilesUpedCol.add(file.name,file);
			if (this.getStats().files_queued === 0) {
				//isUploading = false;
				this.setButtonText('<span class="blackText">'+'添加文件'+'</span>');
				this.setButtonTextStyle('.blackText {color:#FFFFFF;font-size:12px;}');
				this.setButtonDisabled(false);
				//slaveSwfHandler.myWin.down('#btnContinue').setDisabled(true);
				//slaveSwfHandler.myWin.down('#btnCancel').setDisabled(true);
				var xtype = slaveSwfHandler.myWin.getXType();
				if(xtype =='InForward') {
					slaveSwfHandler.myWin.down('#forwarUserDic').setDisabled(false);
					//slaveSwfHandler.myWin.down('#dirTab').setDisabled(false);
					slaveSwfHandler.myWin.down('#submit').setDisabled(false);
					slaveSwfHandler.myWin.down('#btnCancel1').setDisabled(false);
					slaveSwfHandler.myWin.isuploading = false;
				} else if(xtype =='docattwin') {
					slaveSwfHandler.myWin.down('#btnOk1').setDisabled(false);
					slaveSwfHandler.myWin.down('#btnCancel1').setDisabled(false);
					slaveSwfHandler.myWin.isuploading = false;
				}

				slaveFilesQueueCol.clear();
			} else {
				if(slaveFilesUpedCol.getCount() >= swfLimit) {
					//alert(slaveFilesUpedCol.getCount());
					return;
				} else {
					this.startUpload();
				}

			}
		} catch (ex) {
			//Ext.Msg.alert('错误4',ex);
		}
	},
	uploadError: function (file, errorCode, message) {
		try {
			//var progress = swfUploadWin.down('#message');
			switch (errorCode) {
				case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
					//progress.setStatus("Upload Error: " + message);
					Ext.Msg.alert('错误','错误原因:HTTP 错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
					//progress.setStatus("Configuration Error");
					Ext.Msg.alert('错误','错误原因:上传地址失效,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
					//progress.setStatus("Upload Failed.");
					Ext.Msg.alert('错误','错误原因:上传失败,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.IO_ERROR:
					//progress.setStatus("Server (IO) Error");
					Ext.Msg.alert('错误','错误原因:IO操作错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
					//progress.setStatus("Security Error");
					Ext.Msg.alert('错误','错误原因:安全错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
					//progress.setStatus("Upload limit exceeded.");
					Ext.Msg.alert('错误','错误原因:上传超过限制,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
					//progress.setStatus("File not found.");
					Ext.Msg.alert('错误','错误原因:文件未找到,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: The file was not found, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
					//progress.setStatus("Failed Validation.  Upload skipped.");
					Ext.Msg.alert('错误','错误原因:HTTP 错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
					//alert(this.getStats().files_queued);
					if (this.getStats().files_queued === 0) {
						//isUploading = false;
						this.setButtonText('<span class="blackText">'+'添加文件'+'</span>');
						this.setButtonTextStyle('.blackText {color:#FFFFFF;font-size:12px;}');
						this.setButtonDisabled(false);
					}
					if(slaveFilesQueueCol.containsKey(file.name)) {
						//slaveSwfHandler.myWin.down('#fsupList').remove('cPal'+file.id);
						//slaveFilesQueueCol.removeAtKey(file.name);
						stopSwf = false;
					}
					//progress.update("Cancelled");
					//progress.setCancelled();
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
					//progress.setStatus("Stopped");
					break;
				default:
					//progress.setStatus("Unhandled Error: " + error_code);
					Ext.Msg.alert('错误','错误代码: '+ errorCode + ',文件名: ' + file.name + ',文件大小: '+ file.size);
					break;
			}
		} catch (ex) {
			//Ext.Msg.alert('错误5',ex);
		}
	}
});

var faxFileHandler = {
	mouseClick: function() {
		try {
			//this.setButtonImageURL('ext4/resources/themes/images/default/btn/btn-default-small-over-bg.gif');
		} catch (ex) {
			//this.debug(ex);
		}
	},
	mouseOver: function() {
		try {
			//this.setButtonImageURL('ext4/resources/themes/images/default/btn/btn-default-small-over-bg.gif');
		} catch (ex) {
			//this.debug(ex);
		}
	},
	mouseOut: function() {
		try {
			//this.setButtonImageURL('ext4/resources/themes/images/default/btn/btn-default-small-bg.gif');
		} catch (ex) {
			//this.debug(ex);
		}
	},
	preLoad: function() {
		if (!this.support.loading) {
			//Ext.Msg.alert('消息','需要安装Flash Player 9.028  以上版本!');
			//Ext.Msg.alert("You need the Flash Player 9.028 or above to use SWFUpload.");
			return false;
		}
	},
	loadFailed: function() {
		Ext.Msg.alert('消息','SWFUpload加载失败!请稍后重试!');
		//Ext.Msg.alert("Something went wrong while loading SWFUpload. If this were a real application we'd clean up and then give you an alternative");
	},
	fileQueued: function(file) {
		try {

		} catch (ex) {
			Ext.Msg.alert('错误',ex);
		}
	},
	fileQueueError: function(file, errorCode, message) {
		try {
			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
				Ext.Msg.alert('错误','超过了最大上传数限制.最多上传1个文件');
				//Ext.Msg.alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
				return;
			}
			switch (errorCode) {
				case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
					Ext.Msg.alert('错误','错误原因:文件过大,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
					Ext.Msg.alert('错误','错误原因:文件0字节,文件名:'+file.name);
					//alert("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
					Ext.Msg.alert('错误','错误原因:不支持的文件类型,文件名:'+file.name+',文件大小: '+file.size);
					//alert("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
					Ext.Msg.alert('错误','超过了最大上传数限制.最多上传1个文件');
					//this.debug("You have selected too many files.  " +  (message > 1 ? "You may only add " +  message + " more files" : "You cannot add any more files."));
					break;
				default:
					if (file !== null) {
						//Ext.Msg.alert("Unhandled Error");
					}
					Ext.Msg.alert('错误','错误原因:'+ errorCode+',文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
			}
		} catch (ex) {
			Ext.Msg.alert('错误',ex);
		}
	},
	fileDialogComplete: function(numFilesSelected, numFilesQueued) {
		try {
			if(numFilesQueued > 0) {
				//this.setUploadURL(urlStr);
				this.startUpload();
			}
		} catch (ex) {
			//Ext.Msg.alert('错误1',ex);
		}
	},
	uploadStart: function(file) {
		try {
			this.setButtonDisabled(true);
			this.setButtonText('<span class="grayText">'+'添加文件'+'</span>');
			this.setButtonTextStyle('.grayText {color:#969696;font-size:12px;}');
			Ext.MessageBox.show({
				title: '消息',
				msg: '正在上传...',
				progressText: '等待文件上传,请稍候...',
				width:300,
				progress:true,
				closable:false
			});
		} catch (ex) {
		}
		return true;
	},
	uploadProgress: function(file, bytesLoaded, bytesTotal) {
		try {
			var percent = bytesLoaded / bytesTotal;
			Ext.MessageBox.updateProgress(percent,'已上传:'+ Math.round(100*percent)+'%');

			//slaveSwfHandler.myWin.down('#'+file.id).updateProgress(percent,file.name+',上传中...');
		} catch (ex) {
			//Ext.Msg.alert('错误2',ex);
		}
	},
	uploadSuccess: function (file, serverData) {
		try {
			var swfme = this;
			//alert(Ext.JSON.decode(serverData).data);
			Ext.MessageBox.updateProgress(1, '上传完毕.');

			var winType = faxFileHandler.myWin;
			var me = winType.down('#filePath');
			var maskTarget = me.up('form');
			var hidForm = winType.down('#hidFileId');
			var hidLoaded = winType.down('#hidLoaded');
			var hidUpFileType = winType.down('#UpFileType');
			//向后，向前插入
			var upfiletype = hidUpFileType.getValue();
			var fileId = hidForm.getValue();
			
			//alert(fileId);
			var form = me.up('form').getForm();

			//var tt = this.up('form').ownerCt;

			winType.edit = true;
			//正在转换  等待转换  delay50
			var param1 = {};
			param1.sessiontoken = sessionToken;			
			param1.fileId = Ext.JSON.decode(serverData).data;			
			param1.printer = 0;
			param1.ptType = userConfig.prType;//0doc 1photo
			if(userConfig.printerSrc == '1') {
				param1.printer = 1;
			}

			var lblM = winType.down('#submitMessage');
			lblM.show();
			if(lblM.text != '') {
				WsCall.call('submitFile', param1, function(response, opts) {
					hidForm.setValue(param1.fileId);
					lblM.setText('提交的文档是:' +"<img src='"+getFileIcon(v)+"' style='margin-bottom: -4px;'>" +  v);
				}, function(res) {
					Ext.Msg.alert('直接提交失败', res.msg);
				}, true, '正在提交文档...');
				return;
			}
			Ext.MessageBox.hide();
			// 调用
			tbfilepngview.faxCover(param1,maskTarget, hidForm, fileId, hidLoaded,upfiletype,me,file.name, function() {
				var pal = faxFileHandler.myWin.down('#replacePal');

				(new Ext.util.DelayedTask()).delay(100, function() {
					swfme.setButtonText('<span class="blackText">'+'添加文件'+'</span>');
					swfme.setButtonTextStyle('.blackText {color:#FFFFFF;font-size:12px;}');
					swfme.setButtonDisabled(false);
					// return;
					// if(faxFileUpload) {
					// faxFileUpload.destroy();
					// }
					// pal.removeAll();
					// pal.add({
					// xtype:'container',
					// frame:false,
					// itemId:'spanButtonPlaceholder',
					// listeners: {
					// render: function(com) {
					// initFaxUpload(com.up('window'));
					// }
					// }
					// });
				});
			});
		} catch (ex) {
			Ext.Msg.alert('错误3',ex);
		}
	},
	uploadComplete: function (file) {
		try {
			if (this.getStats().files_queued === 0) {

				//this.setButtonText('<span class="blackText">'+'添加文件'+'</span>');
				//this.setButtonTextStyle('.blackText {color:#FFFFFF;font-size:12px;}');
				//this.setButtonDisabled(false);

			} else {
				this.startUpload();
			}

		} catch (ex) {
			//Ext.Msg.alert('错误4',ex);
		}
	},
	uploadError: function (file, errorCode, message) {

		try {
			//var progress = swfUploadWin.down('#message');
			switch (errorCode) {
				case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
					//progress.setStatus("Upload Error: " + message);
					Ext.Msg.alert('错误','错误原因:HTTP 错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
					//progress.setStatus("Configuration Error");
					Ext.Msg.alert('错误','错误原因:上传地址失效,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
					//progress.setStatus("Upload Failed.");
					Ext.Msg.alert('错误','错误原因:上传失败,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.IO_ERROR:
					//progress.setStatus("Server (IO) Error");
					Ext.Msg.alert('错误','错误原因:IO操作错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
					//progress.setStatus("Security Error");
					Ext.Msg.alert('错误','错误原因:安全错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
					//progress.setStatus("Upload limit exceeded.");
					Ext.Msg.alert('错误','错误原因:上传超过限制,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
					//progress.setStatus("File not found.");
					Ext.Msg.alert('错误','错误原因:文件未找到,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: The file was not found, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
					//progress.setStatus("Failed Validation.  Upload skipped.");
					Ext.Msg.alert('错误','错误原因:HTTP 错误,文件名:'+file.name+',文件大小: '+file.size);
					//Ext.Msg.alert("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
					if (this.getStats().files_queued === 0) {
						this.setButtonText('<span class="blackText">'+'添加文件'+'</span>');
						this.setButtonTextStyle('.blackText {color:#FFFFFF;font-size:12px;}');
						this.setButtonDisabled(false);
					}
					//progress.update("Cancelled");
					//progress.setCancelled();
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
					//progress.setStatus("Stopped");
					break;
				default:
					//progress.setStatus("Unhandled Error: " + error_code);
					Ext.Msg.alert('错误','错误代码: ' + errorCode + ',文件名: ' + file.name + ',文件大小: '+ file.size);
					//Ext.Msg.alert('错误',"Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
			}
		} catch (ex) {
			//Ext.Msg.alert('错误5',ex);
		}
	}
}