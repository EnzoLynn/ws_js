template = {
	tplidState:'',
	currTpl:'',
	currStyle:new Ext.util.MixedCollection(),//当前模版使用的样式
	saveTplInfo : new Ext.util.MixedCollection(),//已取好的模版数据
	myWinItems : new Array(),//当前创建好的无分组的items
	myWinGItems : new Ext.util.MixedCollection(),//当前创建好的有分组的items
	//wstemplates : new Array(),//保存的模版
	tplArr:new Array(),//模版用
	tplGridArr : new Array(),//模版表用data store,
	tplTableArr: {
		infax:new Array(),
		outfax:new Array(),
		sucfax:new Array(),
		docgrid:new Array(),
		taskgrid:new Array()
	},//表单数据详细信息用
	reGetTplStyle: function(tplid) {
		var me = this;
		me.currStyle.clear();
		var hdata = template.saveTplInfo.get(tplid);
		Ext.Array.each(hdata, function(item,index,alls) {
			if(item.enumValueType.length >0) {
				Ext.Array.each(item.enumValueType, function(evt) {
					var style  = evt.style;
					if(style != '') {
						me.currStyle.add(item.dataName+'|'+evt.enumValue,style);
					}
				});
			}
		});
	},
	createTemplateMenu: function(tdata) {
		var me = this;
		me.tplGridArr = new Array();
		Ext.Array.each(tdata, function(item,index,alls) {
			//if(index == 0) {
				//me.tplGridArr.push(['none','无','无']);
			//}
			me.tplGridArr.push([item.tempId,item.tempName,item.tempTitle]);
			me.tplArr.push([item.tempId,item.tempName,item.tempTitle]);
		});
	},
	//切换模版
	changeTemplate: function(tplStr,tmpText,cgrid,okfun,supressSet) {

		var me = this;
		if(tplStr == '') {
			if(cgrid == 'infaxgrid') {
				me.infaxBaseLoad('',false,okfun,supressSet);
			}
			if(cgrid == 'outfaxgrid') {
				me.outfaxBaseLoad('',false,okfun,supressSet);
			}
			if(cgrid == 'succoutfaxgrid') {
				me.sucfaxBaseLoad('',false,okfun,supressSet);
			}
			if(cgrid == 'docgrid') {
				me.docgridBaseLoad('',false,okfun,supressSet);
			}
			if(cgrid == 'taskgrid') {
				me.taskgridBaseLoad('',false,okfun,supressSet);
			}
			return;
		}
		//如果未保存过该模版信息
		if(!me.saveTplInfo.containsKey(tplStr)) {
			//调用Call 取得默认值
			var param = {};
			param.template = tplStr;
			param.sessiontoken = sessionToken;
			// 调用
			WsCall.call('getcolumn', param, function(response, opts) {
				var data = Ext.JSON.decode(response.data);
				if(cgrid == 'infaxgrid') {
					me.changeInfax(data,tplStr,tmpText,okfun,supressSet);
				}
				if(cgrid == 'outfaxgrid') {
					me.changeOutfax(data,tplStr,tmpText,okfun,supressSet);
				}
				if(cgrid == 'succoutfaxgrid') {
					me.changeSucfax(data,tplStr,tmpText,okfun,supressSet);
				}
				if(cgrid == 'docgrid') {
					me.changeDocgrid(data,tplStr,tmpText,okfun,supressSet);
				}
				if(cgrid == 'taskgrid') {
					me.changeTaskgrid(data,tplStr,tmpText,okfun,supressSet);
				}

			}, function(response, opts) {
				if(okfun) {
					okfun(currGrid);
				}
			}, false);
		} else {
			var hdata = me.saveTplInfo.get(tplStr);

			if(cgrid == 'infaxgrid') {
				me.changeInfax(hdata,tplStr,tmpText,okfun,supressSet);
			}
			if(cgrid == 'outfaxgrid') {
				me.changeOutfax(hdata,tplStr,tmpText,okfun,supressSet);
			}
			if(cgrid == 'succoutfaxgrid') {
				me.changeSucfax(hdata,tplStr,tmpText,okfun,supressSet);
			}
			if(cgrid == 'docgrid') {
				me.changeDocgrid(hdata,tplStr,tmpText,okfun,supressSet);
			}
			if(cgrid == 'taskgrid') {
				me.changeTaskgrid(hdata,tplStr,tmpText,okfun,supressSet);
			}
		}

	},
	dtRenderer: function(value, metaData, record) {
		var nval = value;
		if(record) {
			var nval = updateRecord(value, metaData, record);
		}

		return nval.replace('T',' ');
	},
	getTplTilte: function(tplid) {
		var ttitle='';
		Ext.Array.each(template.tplArr, function(item) {
			if(item[0] == tplid) {
				ttitle = item[2]+"("+item[1]+")";
				return false;
			}
		});
		return ttitle;
	},
	changeInfax: function(data,tplStr,tmpText,okfun,supressSet) {
		var me = this;
		me.tplTableArr.infax = new Array();

		if(!me.saveTplInfo.containsKey(tplStr)) {
			me.saveTplInfo.add(tplStr,data);
		}
		me.currStyle.clear();
		//template.currCss = '';

		Ext.Array.each(data, function(item,index,alls) {
			if(item.enumValueType.length >0) {
				Ext.Array.each(item.enumValueType, function(evt) {
					var style  = evt.style;
					if(style != '') {
						me.currStyle.add(item.dataName+'|'+evt.enumValue,style);
					}
				});
			}

			if(!infaxInfo.infaxModelMap.containsKey(item.dataName)) {
				infaxInfo.infaxModelMap.add(item.dataName, {
					name:item.dataName,
					type:'string'
				});
			}
			if(!infaxInfo.infaxColMap.containsKey(item.dataName)) {
				infaxInfo.infaxColMap.add(item.dataName, {
					id:tplStr+'1-'+item.dataName,
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					renderer:item.dataType=='dateTime'?me.dtRenderer:updateRecord,
					width: item.dataType=='dateTime'?220:160
				});
				me.tplTableArr.infax.push({
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					dataType:item.dataType
				});
			}

		});
		me.infaxBaseLoad(tplStr,tmpText,okfun,supressSet);
	},
	infaxBaseLoad: function(tplStr,tmpText,okfun,supressSet) {
		var me = this;
		createInfaxModel();
		createInfaxStroe();
		if(tb) {
			var tmpArr = new Array();

			//alert('infaxBaseLoad');

			//可比state对排序,控制可见
			// infaxInfo.infaxColMap.each( function(item,index,alls) {
			// tmpArr.push(item);
			// });
			me.currTpl = tplStr;
			tmpArr = sortGridColumns(myStates.infaxgridState.columns,infaxInfo.infaxColMap);
			//alert('ddd'+Ext.JSON.encode(tmpArr));
			tb.stateful = false;
			tb.reconfigure(Ext.data.StoreManager.lookup('infaxstoreId'),tmpArr);
			tb.stateful = true;
			//切换模版
			tb.getStore().getProxy().extraParams.template = tplStr;
			me.setTplStates(tplStr,tmpText,supressSet,false,false,getCurrTree().itemId);
		}
		if(okfun) {
			okfun(currGrid);
		}
	},
	changeOutfax: function(data,tplStr,tmpText,okfun,supressSet) {
		var me = this;
		me.tplTableArr.outfax = new Array();

		if(!me.saveTplInfo.containsKey(tplStr)) {
			me.saveTplInfo.add(tplStr,data);
		}
		me.currStyle.clear();
		//template.currCss = '';

		Ext.Array.each(data, function(item,index,alls) {
			if(item.enumValueType.length >0) {
				Ext.Array.each(item.enumValueType, function(evt) {
					var style  = evt.style;
					if(style != '') {
						me.currStyle.add(item.dataName+'|'+evt.enumValue,style);
					}
				});
			}

			if(!outfaxInfo.outfaxModelMap.containsKey(item.dataName)) {
				outfaxInfo.outfaxModelMap.add(item.dataName, {
					name:item.dataName,
					type:'string'
				});
			}
			if(!outfaxInfo.outfaxColMap.containsKey(item.dataName)) {
				outfaxInfo.outfaxColMap.add(item.dataName, {
					id:tplStr+'2-'+item.dataName,
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					renderer:item.dataType=='dateTime'?me.dtRenderer:updateRecord,
					width: 100
				});
				me.tplTableArr.outfax.push({
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					dataType:item.dataType
				});
			}
		});
		me.outfaxBaseLoad(tplStr,tmpText,okfun,supressSet);
	},
	outfaxBaseLoad: function(tplStr,tmpText,okfun,supressSet) {
		var me = this;
		createoutfaxModel();
		createOutFaxStore();
		if(outfax) {
			var tmpArr = new Array();
			// outfaxInfo.outfaxColMap.each( function(item,index,alls) {
			// tmpArr.push(item);
			// });
			me.currTpl = tplStr;
			tmpArr = sortGridColumns(myStates.outfaxgridState.columns,outfaxInfo.outfaxColMap);

			outfax.stateful = false;
			outfax.reconfigure(Ext.data.StoreManager.lookup('outfaxstoreId'),tmpArr);
			outfax.stateful = true;
			//切换模版
			outfax.getStore().getProxy().extraParams.template = tplStr;
			me.setTplStates(tplStr,tmpText,supressSet,false,false,getCurrTree().itemId);
		}
		if(okfun) {
			okfun(currGrid);
		}
	},
	changeSucfax: function(data,tplStr,tmpText,okfun,supressSet) {
		var me = this;
		me.tplTableArr.sucfax = new Array();

		if(!me.saveTplInfo.containsKey(tplStr)) {
			me.saveTplInfo.add(tplStr,data);
		}
		me.currStyle.clear();
		//template.currCss = '';

		Ext.Array.each(data, function(item,index,alls) {
			if(item.enumValueType.length >0) {
				Ext.Array.each(item.enumValueType, function(evt) {
					var style  = evt.style;
					if(style != '') {
						me.currStyle.add(item.dataName+'|'+evt.enumValue,style);
					}
				});
			}

			if(!sucfaxInfo.sucfaxModelMap.containsKey(item.dataName)) {
				sucfaxInfo.sucfaxModelMap.add(item.dataName, {
					name:item.dataName,
					type:'string'
				});
			}
			if(!sucfaxInfo.sucfaxColMap.containsKey(item.dataName)) {
				sucfaxInfo.sucfaxColMap.add(item.dataName, {
					id:tplStr+'3-'+item.dataName,
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					renderer:item.dataType=='dateTime'?me.dtRenderer:updateRecord,
					width: 100
				});
				me.tplTableArr.sucfax.push({
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					dataType:item.dataType
				});
			}
		});
		me.sucfaxBaseLoad(tplStr,tmpText,okfun,supressSet);
	},
	sucfaxBaseLoad: function(tplStr,tmpText,okfun,supressSet) {
		var me = this;
		createsucfaxModel();
		createSuccoutFaxStroe();
		if(succoutfax) {
			var tmpArr = new Array();
			// sucfaxInfo.sucfaxColMap.each( function(item,index,alls) {
			// tmpArr.push(item);
			// });
			me.currTpl = tplStr;
			tmpArr = sortGridColumns(myStates.succoutfaxgridState.columns,sucfaxInfo.sucfaxColMap);
			succoutfax.stateful = false;
			succoutfax.reconfigure(Ext.data.StoreManager.lookup('succoutfaxstoreId'),tmpArr);
			succoutfax.stateful = true;
			//切换模版
			succoutfax.getStore().getProxy().extraParams.template = tplStr;
			me.setTplStates(tplStr,tmpText,supressSet,false,false,getCurrTree().itemId);
		}
		if(okfun) {
			okfun(currGrid);
		}
	},
	changeDocgrid: function(data,tplStr,tmpText,okfun,supressSet) {
		var me = this;
		me.tplTableArr.docgrid = new Array();

		if(!me.saveTplInfo.containsKey(tplStr)) {
			me.saveTplInfo.add(tplStr,data);
		}
		me.currStyle.clear();
		//template.currCss = '';

		Ext.Array.each(data, function(item,index,alls) {
			if(item.enumValueType.length >0) {
				Ext.Array.each(item.enumValueType, function(evt) {
					var style  = evt.style;
					if(style != '') {
						me.currStyle.add(item.dataName+'|'+evt.enumValue,style);
					}
				});
			}

			if(!docManagerInfo.docManagerModelMap.containsKey(item.dataName)) {
				docManagerInfo.docManagerModelMap.add(item.dataName, {
					name:item.dataName,
					type:'string'
				});
			}
			if(!docManagerInfo.docManagerColMap.containsKey(item.dataName)) {
				docManagerInfo.docManagerColMap.add(item.dataName, {
					id:tplStr+'4-'+item.dataName,
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					renderer:item.dataType=='dateTime'?me.dtRenderer:updateRecord,
					width: item.dataType=='dateTime'?220:160
				});
				me.tplTableArr.docgrid.push({
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					dataType:item.dataType
				});
			}

		});
		me.docgridBaseLoad(tplStr,tmpText,okfun,supressSet);
	},
	docgridBaseLoad: function(tplStr,tmpText,okfun,supressSet) {
		var me = this;
		createDocgridModel();
		createDocgridStroe();
		if(docGrid) {
			var tmpArr = new Array();
			// docManagerInfo.docManagerColMap.each( function(item,index,alls) {
			// tmpArr.push(item);
			// });
			me.currTpl = tplStr;
			tmpArr = sortGridColumns(myStates.docgridState.columns,docManagerInfo.docManagerColMap);
			docGrid.stateful = false;
			docGrid.reconfigure(Ext.data.StoreManager.lookup('docgridstoreId'),tmpArr);
			docGrid.stateful = true;
			//切换模版
			docGrid.getStore().getProxy().extraParams.template = tplStr;
			me.setTplStates(tplStr,tmpText,supressSet,false,false,getCurrTree().itemId);
		}
		if(okfun) {
			okfun(currGrid);
		}
	},
	changeTaskgrid: function(data,tplStr,tmpText,okfun,supressSet) {
		var me = this;
		me.tplTableArr.taskgrid = new Array();

		if(!me.saveTplInfo.containsKey(tplStr)) {
			me.saveTplInfo.add(tplStr,data);
		}
		me.currStyle.clear();
		//template.currCss = '';

		Ext.Array.each(data, function(item,index,alls) {
			if(item.enumValueType.length >0) {
				Ext.Array.each(item.enumValueType, function(evt) {
					var style  = evt.style;
					if(style != '') {
						me.currStyle.add(item.dataName+'|'+evt.enumValue,style);
					}
				});
			}

			if(!taskInfo.taskModelMap.containsKey(item.dataName)) {
				taskInfo.taskModelMap.add(item.dataName, {
					name:item.dataName,
					type:'string'
				});
			}
			if(!taskInfo.taskColMap.containsKey(item.dataName)) {
				taskInfo.taskColMap.add(item.dataName, {
					id:tplStr+'5-'+item.dataName,
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					renderer:item.dataType=='dateTime'?me.dtRenderer:updateRecord,
					width: item.dataType=='dateTime'?220:160
				});
				me.tplTableArr.taskgrid.push({
					text: item.dataTitle==''?item.dataName:item.dataTitle,
					dataIndex: item.dataName,
					dataType:item.dataType
				});
			}

		});
		me.taskgridBaseLoad(tplStr,tmpText,okfun,supressSet);
	},
	taskgridBaseLoad: function(tplStr,tmpText,okfun,supressSet) {
		var me = this;
		createTaskgridModel();
		createTaskgridStroe();
		if(taskGrid) {
			var tmpArr = new Array();
			// docManagerInfo.docManagerColMap.each( function(item,index,alls) {
			// tmpArr.push(item);
			// });
			me.currTpl = tplStr;
			tmpArr = sortGridColumns(myStates.taskgridState.columns,taskInfo.taskColMap);
			taskGrid.stateful = false;
			taskGrid.reconfigure(Ext.data.StoreManager.lookup('taskgridstoreId'),tmpArr);
			taskGrid.stateful = true;
			//切换模版
			taskGrid.getStore().getProxy().extraParams.template = tplStr;
			me.setTplStates(tplStr,tmpText,supressSet,false,false,getCurrTree().itemId);
		}
		if(okfun) {
			okfun(currGrid);
		}
	},
	//tplSearch 表单数据查找时的title , findall 是否是表单数据查找在所有子目录下
	setTplStates: function(tid,tname,supressSet, tplSearch, findall,treename) {

		var sels = getCurrTree().getSelectionModel().getSelection();
		var str = '';
		var linkTitle = linkViewTitle(sels);

		// if(!sels[0]) {
		// sels[0] = tempItem;
		// linkTitle = linkViewTitle(sels[0]);
		// }

		var folderId = sels[0].data.id;
		if(tname) {
			if(tplSearch) {
				if(findall) {
					if(treename == 'FolderTree') {
						if(folderId == 'gryfjx' || folderId.indexOf('gryf') != -1) {
							linkTitle = '个人'+'/' + '已发件箱';
						} else if(folderId.indexOf('grxx') != -1 || folderId == 0) {
							linkTitle = '个人'+'/' + '收件箱';
						} else {
							linkTitle = '个人'+'/' + '共享收件箱';
						}
					}
					if(treename == 'docTree') {
						if(folderId == 'gr' || folderId.indexOf('grdc') != -1) {
							linkTitle = '个人';
						} else {
							linkTitle = '共享';
						}
					}
					if(treename == 'wfTree') {
						if(folderId == 'wftask') {
							linkTitle = '任务';
						} else {
							linkTitle = '任务';
						}
					}
				}

				str = '查找结果 {' + linkTitle+ ' ['+'表单数据模版:'+tname+']}';
			} else {
				str = linkTitle + ' ['+'表单数据模版:'+tname+']';
			}
		} else {
			str = linkTitle;
		}
		gridTitle.setTitle(str);
		if(supressSet) {
			return;
		}
		//调用设置服务器模版状态

		var param = {};
		param.folderid = folderId;
		param.tplid = tid;
		param.sessiontoken = sessionToken;
		param.treename = treename;
		// 调用
		WsCall.call('settplstate', param, function(response, opts) {
		}, function(response, opts) {
		},false);
	},
	setTplGridTitle: function(panel, tplSearch, findall,treename) {
		var me = this;
		var tName = false;
		var tStr = panel.getStore().getProxy().extraParams.template;
		var tmpText = '';
		Ext.Array.each(me.tplArr, function(item) {
			if(item[0] == tStr) {
				tName = item[1];
				tmpText =  item[2] + "("+ item[1]+")";
				return false;
			}
		});
		me.setTplStates(tStr,tmpText,true, tplSearch, findall,treename);
	},
	createContorl: function(tmpC,doSearch) {//根据模版dataType生成控件
		var me = this;
		//text
		if(tmpC.dataType=='token') {
			if(tmpC.groupName != '') {
				me.creText(tmpC,tmpC.groupName,tmpC.groupTitle,doSearch);
			} else {
				me.creText(tmpC,false,false,doSearch);
			}
		}
		if(tmpC.dataType=='string') {
			if(tmpC.groupName != '') {
				me.creText(tmpC,tmpC.groupName,tmpC.groupTitle,doSearch);
			} else {
				me.creText(tmpC,false,false,doSearch);
			}
		}
		//radio
		if(tmpC.dataType=='boolean') {
			if(tmpC.groupName != '') {
				me.creRadio(tmpC,tmpC.groupName,tmpC.groupTitle,doSearch);
			} else {
				me.creRadio(tmpC,false,false,doSearch);
			}
		}
		//date
		if(tmpC.dataType=='dateTime') {
			if(tmpC.groupName != '') {
				me.creDatetime(tmpC,tmpC.groupName,tmpC.groupTitle,1,doSearch);
			} else {
				me.creDatetime(tmpC,false,false,1,doSearch);
			}
		}
		if(tmpC.dataType=='date') {
			if(tmpC.groupName != '') {
				me.creDatetime(tmpC,tmpC.groupName,tmpC.groupTitle,0,doSearch);
			} else {
				me.creDatetime(tmpC,false,false,0,doSearch);
			}
		}
		if(tmpC.dataType=='time') {
			if(tmpC.groupName != '') {
				me.creDatetime(tmpC,tmpC.groupName,tmpC.groupTitle,2,doSearch);
			} else {
				me.creDatetime(tmpC,false,false,2,doSearch);
			}
		}

		//number
		if(tmpC.dataType=='long' ) {
			if(tmpC.groupName != '') {
				me.creNumber(tmpC,tmpC.groupName,tmpC.groupTitle,'long',doSearch);
			} else {
				me.creNumber(tmpC,false,false,'long',doSearch);
			}
		}
		if(tmpC.dataType=='int') {
			if(tmpC.groupName != '') {
				me.creNumber(tmpC,tmpC.groupName,tmpC.groupTitle,'int',doSearch);
			} else {
				me.creNumber(tmpC,false,false,'int',doSearch);
			}
		}
		if(tmpC.dataType=='double') {
			if(tmpC.groupName != '') {
				me.creNumber(tmpC,tmpC.groupName,tmpC.groupTitle,'double',doSearch);
			} else {
				me.creNumber(tmpC,false,false,'double',doSearch);
			}
		}
		//year month day
		if(tmpC.dataType=='gYear') {
			if(tmpC.groupName != '') {
				me.creYMD(tmpC,tmpC.groupName,tmpC.groupTitle,'gYear',doSearch);
			} else {
				me.creYMD(tmpC,false,false,'gYear',doSearch);
			}
		}
		if(tmpC.dataType=='gMonth') {
			if(tmpC.groupName != '') {
				me.creYMD(tmpC,tmpC.groupName,tmpC.groupTitle,'gMonth',doSearch);
			} else {
				me.creYMD(tmpC,false,false,'gMonth',doSearch);
			}
		}
		if(tmpC.dataType=='gDay') {
			if(tmpC.groupName != '') {
				me.creYMD(tmpC,tmpC.groupName,tmpC.groupTitle,'gDay',doSearch);
			} else {
				me.creYMD(tmpC,false,false,'gDay',doSearch);
			}
		}

	},
	creYMD: function(tmpc,gname,gtitle,type,doSearch) {//生成gyear
		var me = this;
		var tmp;
		var tMin;
		var tMax;
		var alDic = false;
		var tDe = 0;

		if(type == 'gYear') {
			tMin = 1900;
			tMax = 2600;
			tDe = Ext.util.Format.date(new Date(),'Y');
		}
		if(type == 'gMonth') {
			tMin = 1;
			tMax = 12;
			tDe = Ext.util.Format.date(new Date(),'m');
		}
		if(type == 'gDay') {
			tMin = 1;
			tMax = 31;
			tDe = Ext.util.Format.date(new Date(),'d');
		}

		tmp = {
			fieldLabel: tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
			itemId:tmpc.dataName,
			mySqlType:'int',
			name: tmpc.dataName,
			xtype: 'numberfield',
			maxText: '最大为'+tMax,
			minText: '最小为'+tMin,
			width:290,
			margin:'2 2 2 2',
			allowDecimals:alDic,
			value: doSearch?tDe:(tmpc.dataDefault == ''?tDe:tmpc.dataDefault.replace(/\-/g,'')),
			minValue:tMin,
			maxValue: tMax,
			blankText: '不能为空',
			allowBlank:false
		}

		if(gname) {
			tmp.gtitle = gtitle;
			tmp.colspan = 2;
			if(!me.myWinGItems.containsKey(gname)) {
				me.myWinGItems.add(gname,new Array());
			}
			me.myWinGItems.getByKey(gname).push(tmp);
		} else {
			me.myWinItems.push(tmp);
		}
	},
	creNumber: function(tmpc,gname,gtitle,type,doSearch) {//生成number
		var me = this;
		var tmp;
		var tMin;
		var tMax;
		var alDic = false;

		if(tmpc.enumValueType.length >0) {
			var tmpStore = Ext.create('Ext.data.Store', {
				fields: ['enumValue', 'style'],
				data :tmpc.enumValueType
			});
			tmp = {
				fieldLabel: tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
				editable: false,
				mySqlType:'int',
				xtype: 'combo',
				width: 360,
				margin:'2 0 2 2',
				displayField: 'enumValue',
				valueField: 'enumValue',
				itemId:tmpc.dataName,
				name: tmpc.dataName,
				value: doSearch?'':tmpc.dataDefault,
				store: tmpStore,
				queryMode: 'local'
			}
		} else {
			if(type == 'int') {
				tMin = tmpc.dataMin == ''?-2147483648:tmpc.dataMin;
				tMax = tmpc.dataMax ==''?2147483647:tmpc.dataMax;
			}
			if(type == 'long') {
				tMin = tmpc.dataMin == ''?-9223372036854775808:tmpc.dataMin;
				tMax = tmpc.dataMax ==''?9223372036854775807:tmpc.dataMax;
			}
			if(type == 'double') {
				tMin = tmpc.dataMin == ''?-1.79E308:tmpc.dataMin;
				tMax = tmpc.dataMax ==''?1.79E308:tmpc.dataMax;
				alDic = true;
			}

			tmp = {
				fieldLabel: tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
				itemId:tmpc.dataName,
				name: tmpc.dataName,
				mySqlType:'int',
				xtype: 'numberfield',
				maxText: '最大为'+tMax,
				minText: '最小为'+tMin,
				margin:'2 0 2 2',
				allowDecimals:alDic,
				decimalPrecision:6,
				value: doSearch?'':(tmpc.dataDefault == ''?(tmpc.dataMin==''?0:tmpc.dataMin):tmpc.dataDefault),
				width: 290,
				minValue:tMin,
				maxValue: tMax,
				blankText: '不能为空',
				allowBlank:doSearch?true:false
			}
		}

		if(gname) {
			tmp.gtitle = gtitle;
			tmp.colspan = 2;
			if(!me.myWinGItems.containsKey(gname)) {
				me.myWinGItems.add(gname,new Array());
			}
			me.myWinGItems.getByKey(gname).push(tmp);
		} else {
			me.myWinItems.push(tmp);
		}
	},
	creDatetime: function(tmpc,gname,gtitle,time,doSearch) {//生成Datetime
		var me = this;
		var tmp;
		if(time == 1) {//datetime
			if(tmpc.dataDefault == '') {
				tmpc.dataDefault = Ext.util.Format.date(new Date(),'Y-m-d H:i:s');
			} else {
				tmpc.dataDefault = Ext.util.Format.date(tmpc.dataDefault,'Y-m-d H:i:s');
				tmpc.dataDefault = tmpc.dataDefault;
			}
			var tmpDf = tmpc.dataDefault.split(' ');
			var timeDf = tmpDf[1].split(':');

			tmp = {
				xtype:'datetimefield',
				itemId:tmpc.dataName,
				margin:'2 0 2 2',
				fieldLabel : tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
				name:tmpc.dataName,

				mySqlType:'datetime',
				tmpcId:tmpc.dataName,
				//是否查询
				doSearch:doSearch,
				dateCfg: {
					value: doSearch?Ext.util.Format.date(new Date(),'Y-m-d'):tmpDf[0]
				},
				timeHCfg: {
					value: doSearch?0:timeDf[0]
				},
				timeMCfg: {
					value: doSearch?0:timeDf[1]
				},
				timeICfg: {
					value: doSearch?0:timeDf[2]
				},
				value:tmpc.dataDefault
			}

		} else if(time == 0) {
			if(doSearch) {
				tmp = {
					xtype:'datetimefield',
					itemId:tmpc.dataName,
					margin:'2 0 2 2',
					fieldLabel : tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
					name:tmpc.dataName,

					mySqlType:'date',
					tmpcId:tmpc.dataName,
					//是否查询
					doSearch:doSearch,
					dateCfg: {
						width:105,
						value: doSearch?Ext.util.Format.date(new Date(),'Y-m-d'):tmpDf[0]
					},
					timeHCfg: {},
					timeMCfg: {},
					timeICfg: {},
					value:tmpc.dataDefault
				}
			} else {
				tmp = {
					xtype: 'datefield',
					mySqlType:'date',
					itemId:tmpc.dataName,
					margin:'2 0 2 2',
					width:290,
					fieldLabel: tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
					name: tmpc.dataName,
					format: 'Y-m-d',
					value: doSearch?'':(tmpc.dataDefault==''?Ext.util.Format.date(new Date(),'Y-m-d'):tmpc.dataDefault),
					blankText: '不能为空',
					allowBlank:false
				}
			}

		} else if(time == 2) {//time

			var timeDf = tmpc.dataDefault.split(':');

			tmp = {
				xtype:'datetimefield',
				itemId:tmpc.dataName,
				margin:'2 0 2 2',
				fieldLabel : tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
				name:tmpc.dataName,
				mySqlType:'time',
				tmpcId:tmpc.dataName,
				//是否查询
				doSearch:doSearch,
				dateCfg: {},
				timeHCfg: {
					value: doSearch?0:timeDf[0]
				},
				timeMCfg: {
					value: doSearch?0:timeDf[1]
				},
				timeICfg: {
					value: doSearch?0:timeDf[2]
				},
				value:tmpc.dataDefault
			}
		}

		//tmp.isRule = isRule;
		if(gname) {
			tmp.gtitle = gtitle;
			tmp.colspan = 2;
			if(!me.myWinGItems.containsKey(gname)) {
				me.myWinGItems.add(gname,new Array());
			}
			me.myWinGItems.getByKey(gname).push(tmp);
		} else {
			me.myWinItems.push(tmp);
		}
	} ,
	creRadio: function(tmpc,gname,gtitle,doSearch) {//生成 radio
		var me = this;
		var tmp;

		var checkTrue = false;
		var checkFalse = false;
		if(tmpc.dataDefault != '') {
			if(tmpc.dataDefault == 'true') {
				checkTrue = true;
			}
			if(tmpc.dataDefault == 'false') {
				checkFalse = true;
			}
		}

		tmp = {
			xtype: 'fieldcontainer',
			mySqlType:'string',
			itemId:tmpc.dataName,
			margin:'2 0 2 2',
			width:350,
			fieldLabel : tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
			defaultType: 'radiofield',
			defaults: {
				flex: 1
			},
			layout: 'hbox',
			items: [{
				boxLabel: 'False',
				name:  tmpc.dataName,
				inputValue: false,
				checked:doSearch?true:checkFalse
			},{
				boxLabel: 'True',
				name: tmpc.dataName,
				inputValue: true,
				checked:checkTrue
			}
			]
		}

		if(gname) {
			tmp.gtitle = gtitle;
			tmp.colspan = 2;
			if(!me.myWinGItems.containsKey(gname)) {
				me.myWinGItems.add(gname,new Array());
			}
			me.myWinGItems.getByKey(gname).push(tmp);
		} else {
			me.myWinItems.push(tmp);
		}
	},
	creText: function(tmpc,gname,gtitle,doSearch) {//生成text
		var me = this;
		var tmp;

		if(tmpc.enumValueType.length >0) {
			var tmpStore = Ext.create('Ext.data.Store', {
				fields: ['enumValue', 'style'],
				data :tmpc.enumValueType
			});
			tmp = {
				fieldLabel: tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
				editable: false,
				mySqlType:'string',
				xtype: 'combo',
				width:360,
				margin:'2 0 2 2',
				displayField: 'enumValue',
				valueField: 'enumValue',
				itemId:tmpc.dataName,
				name: tmpc.dataName,
				value: doSearch?'':tmpc.dataDefault,
				store: tmpStore,
				queryMode: 'local'
			}
		} else {
			if(tmpc.dataKeep != '') {
				var xtype = 'textfield';
				if(tmpc.dataKeep >255) {
					xtype = 'textareafield';
				}
				tmp = {
					xtype: xtype,
					mySqlType:'string',
					itemId:tmpc.dataName,
					name: tmpc.dataName,
					fieldLabel: tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
					allowBlank: doSearch?true:((tmpc.dataKeep == '0') ?true:false),
					blankText: '不能为空',
					width:360,
					margin:'2 0 2 2',
					value: doSearch?'':tmpc.dataDefault,
					validator: function(val) {
						return myTextValidator(val,tmpc.dataKeep,tmpc.dataKeep,true);
					}
					// minLengthText:'长度固定为'+tmpc.dataKeep,
					// maxLengthText:'长度固定为'+tmpc.dataKeep,
					// minLength: tmpc.dataKeep,
					// maxLength: tmpc.dataKeep
				}
			} else {
				var tMin = tmpc.dataMin == ''?0:tmpc.dataMin;
				var tMax = tmpc.dataMax ==''?Number.MAX_VALUE:tmpc.dataMax;

				var length = tmpc.dataMin > tmpc.dataMax?tmpc.dataMin:(tmpc.dataMax==''?'':tmpc.dataMax);
				var xtype = 'textfield';
				if(length >255) {
					xtype = 'textareafield';
				}
				tmp = {
					xtype: xtype,
					mySqlType:'string',
					itemId:tmpc.dataName,
					name: tmpc.dataName,
					fieldLabel: tmpc.dataTitle==''?tmpc.dataName:tmpc.dataTitle,
					allowBlank: doSearch?true:((tmpc.dataMin == ''||tmpc.dataMin == '0') ?true:false),
					blankText: '不能为空',
					width:360,
					margin:'2 0 2 2',
					value: doSearch?'':tmpc.dataDefault,
					validator: function(val) {
						return myTextValidator(val,tMax,tMin);
					}
					// minLengthText:'长度最小为'+tMin,
					// maxLengthText:'长度最大为'+tMax,
					// minLength: tMin,
					// maxLength: tMax
				}
			}
		}

		if(gname) {
			tmp.gtitle = gtitle;
			tmp.colspan = 2;
			if(!me.myWinGItems.containsKey(gname)) {
				me.myWinGItems.add(gname,new Array());
			}
			me.myWinGItems.getByKey(gname).push(tmp);
		} else {
			me.myWinItems.push(tmp);
		}
	}
}