//========================================追加收件人=========================================//

Ext.create('Ext.data.Store', {
	model: 'WS.tbnorth.superaddModel',
	storeId: 'superaddTarStore'
});

Ext.create('Ext.data.Store', {
	model: 'WS.tbnorth.superaddModel',
	pageSize: userConfig.gridPageSize,
	storeId: 'superaddStore',
	autoLoad: false,
	remoteSort: true,     //排序通过查询数据库
	sorters: [{
		property: 'phoneBookID',
		direction: 'DESC'
	}],
	autoSync: false,
	proxy: {
		type: 'ajax',
		//		url: 'WS/address/Address.json',
		api: {
			create  : WsConf.Url + '?action=create',
			read    : WsConf.Url + '?action=read',
			update  : WsConf.Url + '?action=update',
			destroy : WsConf.Url + '?action=destroy'
		},
		filterParam: 'filter',
		sortParam:'sort',
		directionParam:'dir',
		limitParam:'limit',
		startParam:'start',
		simpleSortMode: true,		//单一字段排序
		extraParams: {
			req:'dataset',
			dataname: 'address',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			sessiontoken: '',
			folderid: 0,
			refresh: null
		},
		reader : {
			type : 'json',
			root: 'dataset',
			seccessProperty: 'success',
			messageProperty: 'msg',
			totalProperty: 'total'
		},
		writer : {
			type : 'json',
			writeAllFields : false,
			allowSingle : false
			//			root: 'dataset'
		},
		actionMethods: 'POST'
	}

});

function selfSort1(sorters, direction, where,  doSort) {
	if (Ext.isArray(sorters) && sorters.length > 0) {
		sorters[0].sorterFn = function(o1, o2) {
			return o1.data[sorters[0].property]
			.localeCompare(o2.data[sorters[0].property]);
		}
	} else if (Ext.isObject(sorters)) {
		sorters.sorterFn = function(o1, o2) {
			return o1.data[sorters.property]
			.localeCompare(o2.data[sorters.property]);
		}
	}
	return this.sortOld(sorters,direction,where,doSort);
}

Ext.StoreMgr.lookup('superaddTarStore').sortOld = Ext.StoreMgr.lookup('superaddTarStore').sort;
Ext.StoreMgr.lookup('superaddTarStore').sort = selfSort1;

Ext.StoreMgr.lookup('superaddStore').sortOld = Ext.StoreMgr.lookup('superaddStore').sort;
Ext.StoreMgr.lookup('superaddStore').sort = selfSort1;

//base
Ext.define('WS.tbnorth.SDBase', {
	extend: 'Ext.grid.Panel',
	columnLines: true,
	multiSelect: true,
	columns : [{
		header: '显示名',
		dataIndex: 'dispName',
		flex: 1,
		renderer: function(value) {
			return "<div><img src='resources/images/grid/pbrecord.png' style='margin-bottom: -5px;'>&nbsp;" + value + '</div>';
		}
	},{
		header: '性别',
		dataIndex: 'gender',
		width:50,
		hidden:true,
		renderer: function(value) {
			if(value == '0') {
				return '男';
			} else {
				return '女';
			}
		}
	},{
		header: '组织',
		dataIndex: 'organization',
		hidden:true,
		width: 100
	},{
		header: '省/州',
		dataIndex: 'state',
		hidden:true,
		width: 70
	},{
		header: '市/区',
		dataIndex: 'city',
		hidden:true,
		width: 70
	},{
		header: '地址',
		dataIndex: 'address',
		hidden:true,
		width: 200
	},{
		header: '国家代码',
		dataIndex: 'countryCode',
		hidden:true,
		width: 120
	},{
		header: '传真号码',
		dataIndex: 'faxNumber',
		flex: 1
	},{
		header: '传真分机',
		dataIndex: 'faxNumberExt',
		flex: 1
	},{
		header: '电话号码',
		dataIndex: 'phoneNumber',
		hidden:true,
		width: 120
	},{
		header: '手机号码',
		dataIndex: 'mobileNumber',
		hidden:true,
		width: 120
	},{
		header: 'Email',
		dataIndex: 'email',
		hidden:true,
		width: 150
	},{
		header: '名',
		dataIndex: 'firstName',
		width: 80,
		hidden: true
	},{
		header: '姓',
		dataIndex: 'lastName',
		width: 80,
		hidden: true
	},{
		header: '职位',
		dataIndex: 'title',
		width: 80,
		hidden: true
	},{
		header: '部门',
		dataIndex: 'department',
		width: 80,
		hidden: true
	},{
		header: '国家',
		dataIndex: 'country',
		width: 80,
		hidden: true
	},{
		header: '邮政编码',
		dataIndex: 'zipCode',
		width: 80,
		hidden: true
	},{
		header: '个人网址',
		dataIndex: 'web',
		width: 80,
		hidden: true
	},{
		header: '即时通讯号码',
		dataIndex: 'iMNumber',
		width: 80,
		hidden: true
	},{
		header: '注释',
		dataIndex: 'comment',
		width: 80,
		hidden: true
	},{
		header: '电话号码分机',
		dataIndex: 'phoneNumberExt',
		width: 80,
		hidden: true
	},{
		header: '客户编号',
		dataIndex: 'spareFaxNumber',
		hidden:true,
		width: 100
	}

	]
});

Ext.define('WS.tbnorth.superaddgrid', {
	alternateClassName: ['superaddgrid'],
	alias: 'widget.superaddgrid',
	extend: 'WS.tbnorth.SDBase',
	//title: '通讯录',
	store: 'superaddStore',
	initComponent : function() {
		var me = this;
		var filter = '';
		me.callParent(arguments);

		me.getStore().getProxy().on('exception', function(proxy, response, operation) {
			var json = Ext.JSON.decode(response.responseText);
			var code = json.code;
			if(operation.action == "update" || operation.action == "destroy") {
				me.loadGrid(filter);		//
			}
			errorProcess(code);
			//根据operation 处理
		});
	},
	loadGrid: function(filter) {

		var me = this;
		var store = me.getStore();

		var sessiontoken = store.getProxy().extraParams.sessiontoken = getSessionToken();
		if(!sessiontoken || sessiontoken.length ==0) {
			return;
		}
		store.getProxy().extraParams.filter = filter;
		store.getProxy().extraParams.refresh = 1;
		store.load( function(records, operation, success) {
			var map = new Ext.util.HashMap();
			if(success) {
				Ext.StoreMgr.lookup('superaddTarStore').each( function(record,index,all) {
					map.add(record.data.phoneBookID,record.data.phoneBookID);
				});
				Ext.Array.each(records, function(rec,index,all) {
					if(map.contains(rec.data.phoneBookID)) {
						store.remove(rec);
					}
				});
			}
		});
		store.currentPage = 1;
		store.loadPage(1);
		store.getProxy().extraParams.refresh = null;
	}
});

Ext.define('WS.tbnorth.superaddTarget', {
	alternateClassName: ['superaddTarget'],
	alias: 'widget.superaddTarget',
	extend: 'WS.tbnorth.SDBase',
	title: '发送到',
	store: 'superaddTarStore'
});

//通讯录窗口grid用store
var addresspersonwinGridStore = Ext.create('Ext.data.Store', {
	model: 'WS.address.Addressmodel',
	storeId: 'addresspersonwinGridStoreId',
	autoLoad: false,
	//autoSync: false,
	proxy: {
		type: 'ajax',
		//        url: 'ws/address/Address.json',
		api: {
			create  : WsConf.Url + '?action=create',
			read    : WsConf.Url + '?action=read',
			update  : WsConf.Url + '?action=update',
			destroy : WsConf.Url + '?action=destroy'
		},
		filterParam: 'filter',
		sortParam: 'sort',
		directionParam: 'dir',
		limitParam: 'limit',
		startParam: 'start',
		simpleSortMode: true, 	//单一字段排序
		extraParams: {
			req: 'dataset',
			dataname: 'address',             //dataset名称，根据实际情况设置,数据库名
			restype: 'json',
			sessiontoken: '',
			refresh: null
		},
		reader: {
			type: 'json',
			root: 'dataset',
			seccessProperty: 'success',
			messageProperty: 'msg',
			totalProperty: 'total'
		},
		writer: {
			type: 'json',
			writeAllFields: false,
			allowSingle: false
		},
		actionMethods: 'POST'
	}

});

//通讯录用win
function loadaddresspersonwin(targetWin) {

	function selectRec(record,otherRecArr) {
		if(targetWin) {
			if(targetWin.getXType() == 'InforEmail') {	//转发到邮件
				var rece = targetWin.down('#receiveID');
				if(record.data.email.length > 0) {
					var receivers = rece.getValue();
					if(receivers == '') {
						receivers = record.data.email;
					} else {
						var recArr = receivers.split(';');
						for(var p in recArr) {
							if(record.data.email == recArr[p]) {
								addresspersonwin.close();
								rece.fireEvent("blur", rece);
								return;
							}
						}
						receivers += ';' + record.data.email
					}
					rece.setValue(receivers);
				}
				addresspersonwin.close();
				rece.fireEvent("blur", rece);
			} else if(targetWin.getXType() == 'ModeFaxInfo') {
				targetWin.down('#faxNum').setValue(record.data.faxNumber);
				targetWin.down('#faxNumExt').setValue(record.data.faxNumberExt);
				targetWin.down('#recipient').setValue(record.data.dispName);
				targetWin.down('#email').setValue(record.data.email);
				targetWin.down('#mobile').setValue(record.data.mobileNumber);
				targetWin.down('#organiz').setValue(record.data.organization);
				targetWin.down('#comment').setValue(record.data.comment);

				addresspersonwin.close();
				targetWin.down('#faxNum').fireEvent("blur", targetWin.down('#faxNum'));
			} else {
				targetWin.down('#faxNumID').setValue(record.data.faxNumber);
				targetWin.down('#faxNumExtID').setValue(record.data.faxNumberExt);
				targetWin.down('#recID').setValue(record.data.dispName);
				addresspersonwin.close();
				targetWin.down('#faxNumID').fireEvent("blur", targetWin.down('#faxNumID'));
			}
			return;
		}
		if(otherRecArr && otherRecArr.length>0) {
			var store = Ext.StoreMgr.lookup('linkmenGridStore');
			Ext.Array.each(otherRecArr, function(item) {
				var faxNum = covertToRightNumber(true,item.faxNumber);

				if(store.findRecord('faxNumber',faxNum) == null) {
					var r = Ext.ModelManager.create({
						dispName: item.dispName,
						faxNumber: faxNum,
						faxNumberExt:item.faxNumberExt,
						mobileNumber: item.mobileNumber,
						email: item.email,
						organization:item.organization,
						spareFaxNumber:item.spareFaxNumber
					}, 'WS.tbnorth.superaddModel');
					store.insert(0, r);
				}

			});
			//追加联系人用Array
			LinkMenArr = new Array();
			var smRecs = store.getRange();
			Ext.Array.each(smRecs, function(rec,index,allrecs) {
				var linkmanClass = {
					faxNumber:rec.data.faxNumber,
					subNumber:rec.data.faxNumberExt,
					faxReceiver:rec.data.dispName,
					email:rec.data.email,
					mobile:rec.data.mobileNumber,
					organization:rec.data.organization
				};
				LinkMenArr.push(linkmanClass);
			});
			if(LinkMenArr.length > 0) {
				sendfaxwin.down('#btnSuperadd').setText('追加收件人     已追加收件人:'+LinkMenArr.length+'位' );
			}

		}

		if(sendfaxwin.down('#faxNumber').getValue() =='') {
			sendfaxwin.down('#faxNumber').setValue(record.data.faxNumber);
			sendfaxwin.down('#subNumber').setValue(record.data.faxNumberExt);
			sendfaxwin.down('#faxReceiver').setValue(record.data.dispName);
			sendfaxwin.down('#e-mail').setValue(record.data.email);
			sendfaxwin.down('#mobile').setValue(record.data.mobileNumber);
			sendfaxwin.down('#organization').setValue(record.data.organization);
		} else {
			var store = Ext.StoreMgr.lookup('linkmenGridStore');
			var faxNum = covertToRightNumber(true,record.data.faxNumber);
			if(store.findRecord('faxNumber',faxNum) == null && faxNum !=sendfaxwin.down('#faxNumber').getValue()) {
				var r = Ext.ModelManager.create({
					dispName: record.data.dispName,
					faxNumber: faxNum,
					faxNumberExt:record.data.faxNumberExt,
					mobileNumber: record.data.mobileNumber,
					email: record.data.email,
					organization:record.data.organization,
					spareFaxNumber:record.data.spareFaxNumber
				}, 'WS.tbnorth.superaddModel');
				store.insert(0, r);
			}
			//追加联系人用Array
			LinkMenArr = new Array();
			var smRecs = store.getRange();
			Ext.Array.each(smRecs, function(rec,index,allrecs) {
				var linkmanClass = {
					faxNumber:rec.data.faxNumber,
					subNumber:rec.data.faxNumberExt,
					faxReceiver:rec.data.dispName,
					email:rec.data.email,
					mobile:rec.data.mobileNumber,
					organization:rec.data.organization
				};
				LinkMenArr.push(linkmanClass);
			});
			if(LinkMenArr.length > 0) {
				sendfaxwin.down('#btnSuperadd').setText('追加收件人     已追加收件人:'+LinkMenArr.length+'位' );
			}
		}

		addresspersonwin.close();
		sendfaxwin.down('#faxNumber').fireEvent("blur", sendfaxwin.down('#faxNumber'));

	}

	return Ext.create('Ext.window.Window', {
		title: "从通讯录选择收件人",
		iconCls: 'addressTitle',
		height: 420,
		width: 600,
		layout: {
			type: 'table',
			columns: 1
		},
		collapsible: false,
		resizable: false,
		frame: false,
		border: false,
		modal: true,
		defaults: {
			frame: false,
			border: false,
			width: 580,
			margin: '10 5 0 5',
			labelAlign: 'right'
		},
		items: [{
			fieldLabel: '通讯录目录',
			itemId: 'personCombo',
			xtype: 'triggerfield',
			value: '个人',
			onTriggerClick: function () {
				var me = this;
				var treeWinObj = {
					treeLoading: addressTreeLoading,
					curTreeWin: addresspersonwinTree1,
					winWidth: 474
				};
				triggleFun(me, 'addresspersonwinTree_store', function(store,records,models) {
					if(!models || models.length<=0)
						return;
					Ext.Array.each(models, function(item,index,alls) {
						var interStr = addrTreeInter(item.data.id);
						if(interStr != '') {
							item.data.text = interStr;
						}
					});
				}, function(store) {
					var extParam = store.getProxy().extraParams;
					//extParam.isOrgniz = undefined;
					//extParam.need = true;
					extParam.sessiontoken = Ext.util.Cookies.get("sessiontoken");
				}, treeWinObj, 'addressgrid1', function() {
					addresspersonwinTree1 = treeWinObj.curTreeWin;
					addressTreeLoading = treeWinObj.treeLoading;
				});
			}
		}

		,{
			fieldLabel: '快速查询',
			xtype: 'searchfield',
			store: searchStore
		},{
			height: 280,
			itemId: 'addressgrid1',
			xtype: 'addressgrid',
			border: true,
			preventHeader: true,
			dockedItems: [],
			viewConfig: {
				loadingText:'正在加载数据...'
			},
			columns: [{
				header: '客户编号',
				dataIndex: 'spareFaxNumber',
				width: 100,
				hidden: true,
				renderer: function (value, metaData, record) {
					return "<div><img src='resources/images/grid/inFax.png' style='margin-bottom: -5px;'>&nbsp;" + updateAddressRec(value,metaData, record)+ '</div>';
				}
			},{
				header: '显示名',
				dataIndex: 'dispName',
				flex: 0.4,
				renderer: function (value, metaData, record) {
					return "<div><img src='resources/images/grid/pbrecord.png' style='margin-bottom: -5px;'>&nbsp;" + updateAddressRec(value,metaData, record) + '</div>';
				}
			},{
				header: '传真号码',
				dataIndex: 'faxNumber',
				flex: 0.3,
				renderer:updateAddressRec
			},{
				header: '传真分机',
				dataIndex: 'faxNumberExt',
				flex: 0.3,
				hidden: (targetWin && targetWin.getXType() == 'InforEmail'),
				renderer:updateAddressRec
			},{
				header: 'Email',
				dataIndex: 'email',
				flex: 0.3,
				hidden: !(targetWin && targetWin.getXType() == 'InforEmail'),
				renderer:updateAddressRec

			}],
			listeners: {
				itemdblclick: function (view, record, item, index, e, opts) {
					if(targetWin && targetWin.getXType() == 'InforEmail') {
						selectRec(record);
						return;
					}
					if(record.data.faxNumber && record.data.faxNumber.length>0) {
						selectRec(record);
					} else {
						Ext.Msg.alert('消息','传真号码不能为空');
					}
				}
			},
			dockedItems: [{
				xtype: 'pagingtoolbar',
				itemId: 'pagingtoolbarID',
				store: 'addressId',
				dock: 'bottom',
				displayInfo: true,
				displayMsg: '第 {0} 到 {1} 条，共 {2} 条',
				emptyMsg: "没有记录",
				beforePageText: '页数',
				afterPageText: '共 {0}',
				items:[{
					text: '全选/取消',
					itemId: 'allselectID',
					handler: function() {
						var me = this;
						var grid = me.up('window').down('#addressgrid1');
						var sm = grid.getSelectionModel();
						for (var i=0; i<grid.getStore().getCount(); i++) {
							if(!sm.isSelected(i)) {
								sm.selectAll(true);
								return;
							} else {
								sm.deselect(i, true);
							}
						}

					}
				},{
					text: '反选',
					itemId: 'otherselectID',
					handler: function() {
						var me = this;
						var grid = me.up('window').down('#addressgrid1');
						var sm = grid.getSelectionModel();
						for (var i=0; i<grid.getStore().getCount(); i++) {
							if(sm.isSelected(i)) {
								sm.deselect(i, true);
							} else {
								sm.select(i, true);
							}
						}

					}
				}]
			}]
		}],
		buttons:[{
			text:'确定',
			handler: function() {
				var me = this;
				var grid = me.up('window').down('#addressgrid1');
				var sels = grid.getSelectionModel().getSelection();
				if(sels && sels.length > 0) {

					if(targetWin && targetWin.getXType() == 'InforEmail') {
						selectRec(sels[0]);
						return;
					}

					var otherRecArr = new Array();
					var fisrtRec = '';
					Ext.Array.each(sels, function(item) {
						if(item.data.faxNumber && item.data.faxNumber.length>0) {
							if(fisrtRec == '') {
								fisrtRec = item;
							} else {
								otherRecArr.push(item.data);
							}
						}
					});
					if(fisrtRec != '' || otherRecArr.length > 0) {
						selectRec(fisrtRec,otherRecArr);
					} else {
						Ext.Msg.alert('消息','传真号码不能为空');
					}

					//me.up('window').close();
				} else {
					Ext.Msg.alert('消息','请选择收件人');
				}

			}
		},{
			text:'取消',
			handler: function() {
				var me = this;
				me.up('window').close();
			}
		}],

		listeners: {
			destroy: function () {
				addresspersonwin = '';
				if (addresspersonwinTree1 != '') {
					addresspersonwinTree1.destroy();
				}
				addresspersonwinTree1 = '';
				addressTreeLoading = 0;
				Ext.StoreMgr.removeAtKey ('addresspersonwinTree_store');
				if(targetWin) {
					return;
				}
				showFlash(sendfaxwin);
			},
			show: function () {
				//this.getComponent('addressgrid').loadGrid();
				var currentgird = this.getComponent('addressgrid1');

				currentgird.getStore().getProxy().extraParams.folderid = 0;
				currentgird.loadGrid();
				//this.getComponent('addressgrid').getStore().loadData([]);

			},
			afterrender: function (win, opts) {
				win.getEl().on('click', function () {
					if (addresspersonwinTree1 != '') {
						addresspersonwinTree1.destroy();
					}
					addresspersonwinTree1 = '';
					addressTreeLoading = 0;

				});
				var header = win.header;

				header.getEl().on('mousedown', function () {

					if (addresspersonwinTree1 != '') {
						addresspersonwinTree1.destroy();
					}
					addresspersonwinTree1 = '';
					addressTreeLoading = 0;

				});
			}
		}
	}).show();

}

//追加收件人 用win
function loadsuperadditionwin() {

	return Ext.create('Ext.window.Window', {
		title: '追加收件人',
		iconCls: 'sendfaxPushAddr',
		height: 463,
		width: 882,
		layout: {
			type: 'table',
			columns: 3
		},
		collapsible: false,
		resizable: true,
		frame: false,
		border: false,
		modal: true,
		defaults: {
			margin: '5 5 5 5',
			labelAlign: 'right'
		},
		items: [{
			fieldLabel: '通讯录目录',
			width: 390,
			margin: '10 0 0 0',
			colspan:3,
			itemId: 'personCombo',
			xtype: 'triggerfield',
			value: '个人',
			onTriggerClick: function () {
				var me = this;
				var treeWinObj = {
					treeLoading: superadditionTreeLoading,
					curTreeWin: superadditionwinTree,
					winWidth: 285
				};
				triggleFun(me, 'superadditionwinTree_store', function(store,records,models) {
					if(!models || models.length<=0)
						return;
					Ext.Array.each(models, function(item,index,alls) {
						var interStr = addrTreeInter(item.data.id);
						if(interStr != '') {
							item.data.text = interStr;
						}
					});
				}, function(store) {
					var extParam = store.getProxy().extraParams;
					//extParam.isOrgniz = undefined;
					//extParam.need = true;
					extParam.sessiontoken = Ext.util.Cookies.get("sessiontoken");
				}, treeWinObj, 'sdSrc', function() {
					superadditionwinTree = treeWinObj.curTreeWin;
					superadditionTreeLoading = treeWinObj.treeLoading;
				});
			}
		},{
			xtype:'superaddgrid',
			width: 390,
			height: 350,
			itemId:'sdSrc',
			dockedItems:[{
				xtype: 'pagingtoolbar',
				itemId: 'pagingtoolbarID',
				store: 'superaddStore',
				dock: 'bottom',
				displayInfo: true,
				displayMsg: '第 {0} 到 {1} 条,共 {2} 条',
				emptyMsg: '没有记录',
				beforePageText: '页数',
				afterPageText: '共 {0}'
			}],
			listeners: {
				itemdblclick: function(view,record,item,index,e,opts) {
					var me = this;
					var w = me.up('window');
					var grid = w.down('#sdSrc');
					var tarGrid =  w.down('#sdTargetId');

					if(record.data.faxNumber == '' || record.data.faxNumber.length < 0) {
						Ext.Msg.alert('警告','您选择的收件人含有空传真号码！不能添加！');
						return;
					}
					var rec = record;
					rec.data.faxNumber =covertToRightNumber(true,rec.data.faxNumber);

					var map = new Ext.util.HashMap();
					Ext.StoreMgr.lookup('superaddTarStore').each( function(rcc,index,all) {
						map.add(rcc.data.faxNumber,rcc.data.faxNumber);
					});
					if(map.contains(record.data.faxNumber)) {
						Ext.Msg.alert('警告','您选择的收件人中含有重复信息！重复信息未能添加！');
						return;
					}

					tarGrid.getStore().add(rec);
					//grid.getStore().remove(record);

				}
			}
		},{
			xtype:'panel',
			width:60,
			height: 350,
			layout: {
				type:'vbox',
				align:'center'
			},
			border:false,
			//bodyCls: 'panelFormBg',

			defaults: {
				xtype:'button',
				width:50
			},
			items:[{
				xtype:'tbtext',
				text:'<br/><br/><br/><br/>'
			},{
				text:'>',
				tooltip:'移入发送',
				handler: function() {
					var me = this;
					var w = me.up('window');
					var grid = w.down('#sdSrc');
					if(grid.getSelectionModel().hasSelection()) {
						var tarGrid =  w.down('#sdTargetId');
						var sels = grid.getSelectionModel().getSelection();
						var dels = new Array();
						var isError = false;
						Ext.Array.each(sels, function(record,index,all) {
							if(record.data.faxNumber == '' || record.data.faxNumber.length < 0) {
								dels.push(record);
								isError = true;
								return;
							}
							record.data.faxNumber =covertToRightNumber(true,record.data.faxNumber);
						});
						var map = new Ext.util.HashMap();
						Ext.StoreMgr.lookup('superaddTarStore').each( function(record,index,all) {
							map.add(record.data.faxNumber,record.data.faxNumber);
						});
						Ext.Array.each(sels, function(rec,index,all) {
							if(!map.contains(rec.data.faxNumber)) {
								map.add(rec.data.faxNumber,rec.data.faxNumber);
							} else {
								//validRecords = Ext.Array.remove(validRecords,rec1);
								dels.push(rec);
								isError = true;
							}
						});
						Ext.Array.each(dels, function(delRec,index,all) {
							sels = Ext.Array.remove(sels,delRec);
						});
						//rec.data.faxNumber =covertToRightNumber(true,rec.data.faxNumber);
						tarGrid.getStore().add(sels);
						//grid.getStore().remove(sels);
						//Ext.StoreMgr.lookup('superaddStore').add(rec);
						if(isError) {
							Ext.Msg.alert('警告','您选择的收件人中含有空传真号码或重复数据！未能添加！');
						}
						//grid.getStore().remove(grid.getSelectionModel().getSelection());

					}
				}
			},{
				xtype:'tbtext',
				text:'<br/><br/>'
			},{
				xtype:'tbtext',
				text:'<br/>'
			},{
				text:'<',
				tooltip:'移出发送',
				handler: function() {
					var me = this;
					var w = me.up('window');
					var grid = w.down('#sdTargetId');
					if(grid.getSelectionModel().hasSelection()) {
						var tarGrid =  w.down('#sdSrc');
						//tarGrid.getStore().add(grid.getSelectionModel().getSelection());
						//tarGrid.getStore().sort();
						grid.getStore().remove(grid.getSelectionModel().getSelection());
					}
				}
			},{
				xtype:'tbtext',
				text:'<br/>'
			},{
				text:'<<',
				tooltip:'全部移出发送',
				handler: function() {
					var me = this;
					var w = me.up('window');
					var grid = w.down('#sdTargetId');
					var tarGrid =  w.down('#sdSrc');
					grid.getSelectionModel().selectAll();
					//tarGrid.getStore().add(grid.getSelectionModel().getSelection());
					//tarGrid.getStore().sort();
					grid.getStore().removeAll();

				}
			}]//fieldset items
		},{
			width: 390,
			height: 350,
			itemId: 'sdTargetId',
			xtype: 'superaddTarget',
			border: true,
			listeners: {
				itemdblclick: function(view,record,item,index,e,opts) {
					var me = this;
					var w = me.up('window');
					var grid = w.down('#sdTargetId');
					var tarGrid =  w.down('#sdSrc');
					//tarGrid.getStore().add(record);
					//tarGrid.getStore().sort();
					grid.getStore().remove(record);

				}
			}
		}],
		buttons: [{
			text: '确定',
			itemId: 'submit',
			formBind: true,
			handler: function() {
				var me = this;
				var w = me.up('window');
				w.down('#sdTargetId').getSelectionModel().selectAll();

				var sm = w.down('#sdTargetId').getSelectionModel();
				var smRecs = sm.getSelection();

				var map = new Ext.util.HashMap();

				Ext.StoreMgr.lookup('linkmenGridStore').each( function(record,index,all) {
					map.add(record.data.faxNumber,record.data.faxNumber);
				});
				Ext.Array.each(smRecs, function(rec,index,all) {
					if(rec.data.faxNumber == '' || rec.data.faxNumber.length < 0) {
						return;
					}
					if(!map.contains(rec.data.faxNumber)) {
						//rec.data.faxNumber =covertToRightNumber(true,rec.data.faxNumber);
						Ext.StoreMgr.lookup('linkmenGridStore').add(rec);
					}
				});
				w.close();

			}
		},{
			text: '取消',
			handler: function() {
				var me = this;
				me.up('window').close();
			}
		}],
		listeners: {
			destroy: function () {
				superadditionwin = '';
				if (superadditionwinTree != '') {
					superadditionwinTree.destroy();
				}
				superadditionwinTree = '';
				superadditionTreeLoading = 0;
				Ext.StoreMgr.removeAtKey ('superadditionwinTree_store');
			},
			show: function () {
				//this.getComponent('addressgrid').loadGrid();
				var currentgird = this.down('#sdSrc');

				currentgird.getStore().getProxy().extraParams.folderid = 0;
				currentgird.loadGrid();
				//this.getComponent('addressgrid').getStore().loadData([]);

			},
			afterrender: function (win, opts) {
				win.getEl().on('click', function () {
					if (superadditionwinTree != '') {
						superadditionwinTree.destroy();
					}
					superadditionwinTree = '';
					superadditionTreeLoading = 0;

				});
				var header = win.header;

				header.getEl().on('mousedown', function () {

					if (superadditionwinTree != '') {
						superadditionwinTree.destroy();
					}
					superadditionwinTree = '';
					superadditionTreeLoading = 0;

				});
			}
		}
	}).show();

}