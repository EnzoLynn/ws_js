function loadSearchDataWin(sels, ruleCAMap) {
	var tmpItems = new Array();

	if(template.myWinGItems.getCount() > 0) {
		template.myWinGItems.each( function(items,index,alls) {
			var fsetTmp = {
				colspan:2,
				xtype:'fieldset',
				title:'',
				padding:'10 8 3 0',
				collapsible: true,
				defaultType: 'textfield',
				layout: {
					type:'table',
					columns:3
				},
				defaults: {
					width:745,
					labelAlign:'right',
					labelWidth:150
				},
				items :[]
			};
			
			Ext.Array.each(items, function(itm,ix,as) {
				if(ix == 0) {
					fsetTmp.title = itm.gtitle;
				}
				itm.disabled = true;
				var checkArr = {
					margin:'0 0 4 5',
					width:20,
					myCbLable:itm.fieldLabel,
					cbItemId:itm.itemId,
					itemId: 'ch_' + itm.itemId,
					mySqlType:itm.mySqlType,
					submitValue:false,
					xtype:'checkbox',
					listeners: {
						change: function (cb, nValue, oValue, opts) {
							//alert(cb.cbItemId);
							var me = this;
							var win = me.up('window');
							if (cb.getValue()) {
								win.down('#'+cb.cbItemId).setDisabled(false);
								//alert(cb.mySqlType+":"+cb.cbItemId);
							} else {
								win.down('#'+cb.cbItemId).setDisabled(true);
							}
						}
					}
				};
				fsetTmp.items.push(checkArr);
				fsetTmp.items.push(itm);
			});
			tmpItems.push(fsetTmp);
		});
	}

	if(template.myWinItems.length > 0) {
		Ext.Array.each(template.myWinItems, function(itm,ix,as) {
			itm.margin = '2 0 2 4';
			itm.disabled = true;
			var checkArr = {
				cellCls :'tplTdItems',
				margin:'0 0 10 14',
				width:20,
				myCbLable:itm.fieldLabel,
				cbItemId:itm.itemId,
				itemId: 'ch_' + itm.itemId,
				mySqlType:itm.mySqlType,
				submitValue:false,
				xtype:'checkbox',
				listeners: {
					change: function (cb, nValue, oValue, opts) {
						var me = this;
						var win = me.up('window');
						if (cb.getValue()) {
							win.down('#'+cb.cbItemId).setDisabled(false);
							//alert(cb.mySqlType+":"+cb.cbItemId);
						} else {
							win.down('#'+cb.cbItemId).setDisabled(true);
						}
					}
				}
			};
			tmpItems.push(checkArr);
			tmpItems.push(itm);
		});
	}

	return Ext.create('Ext.window.Window', {
		title: ruleCAMap ? '录入数据' : '表单数据模版查询',
		modal:true,
		height: 560,
		width: 810,
		resizable:false,
		bodyStyle: {
			overflow :'auto'
		},
		layout: {
			type: 'auto'
		},
		defaults: {
			margin:'2 2 0 5',
			width:770,
			labelAlign:'right',
			labelWidth:150
		},
		listeners: {
			afterrender: function(com,opts) {
				//读取状态保存
				//加载State
				if(myStates.searchState) {
					for (key in myStates.searchState) {
						if(key == 'stateSaved')
							continue;
						if(key == 'Matches') {
							var flag = myStates.searchState['Matches'];
							com.down('#macAll').setValue(flag);	
							com.down('#macRam').setValue(!flag);						
						}
						if(key == 'misty') {
							var flag = myStates.searchState['misty'];
							com.down('#misty').setValue(flag);
						}
						if(key == 'findall') {
							var flag = myStates.searchState['findall'];
							com.down('#findall').setValue(flag);
						}
					}
				}				
			}
		},
		items:[{
			xtype:'form',
			//height:520,			
			//height:'100%',
			////bodyCls: 'panelFormBg',
			frame: false,
			border: false,
			layout: {
				type:'table',
				columns:2
			},
			defaults: {
				margin:'5 0 5 8',
				width:760,
				labelAlign:'right',
				labelWidth:150
			},
			listeners:{
				afterrender:function(com){
					com.add(tmpItems);
				}
			},
			items:[{
				colspan:2,
				layout: {
					type:'table',
					columns:2
				},
				//bodyCls: 'panelFormBg',
				border:false,
				items:[{
					itemId: 'condiID',
					xtype:'fieldset',
					//title:'条件组合方式',
					width:380,
					margin:'0 0 0 0',
					padding:'10 8 3 4',
					collapsible: false,
					layout: {
						type:'table',
						columns:2
					},
					defaults: {
						labelAlign:'right',
						labelWidth:80,
						xtype:'radio'
					},
					items :[{
						submitValue:!ruleCAMap,
						margin:'0 0 5 10',
						boxLabel: '满足所有有效条件',
						name:  'Matches',
						inputValue: 'all',
						itemId:'macAll',
						checked:true,
						listeners: {
							change: function(com,nVal,oVal,opts) {
								myStates.searchState.Matches = nVal;
							}
						}
					},{
						submitValue:!ruleCAMap,
						margin:'0 0 5 10',
						itemId:'macRam',
						boxLabel: '满足任意有效条件',
						name: 'Matches',
						inputValue: 'ram'
					}]
				},{
					itemId: 'stringID',
					xtype:'fieldset',
					//title:'字串查询方式',
					width:360,
					margin:'0 0 0 20',
					padding:'10 8 3 10',
					collapsible: false,
					layout: {
						type:'table',
						columns:2
					},
					defaults: {
						labelAlign:'right',
						labelWidth:80
					},
					items :[{
						submitValue:!ruleCAMap,
						margin:'0 0 5 10',
						xtype:'checkbox',
						boxLabel: '字串模糊匹配',
						itemId:'misty',
						name:'misty',
						checked:true,
						listeners: {
							change: function(com,nVal,oVal,opts) {
								myStates.searchState.misty = nVal;
							}
						}
					},{
						submitValue:!ruleCAMap,
						margin:'0 0 5 10',
						xtype:'checkbox',
						boxLabel: '在所有子目录下查找',
						itemId:'findall',
						name:'findall',
						checked:false,
						listeners: {
							change: function(com,nVal,oVal,opts) {
								myStates.searchState.findall = nVal;
							}
						}
					}]
				}]
			}]
		}],
		//items: tmpItems,
		buttons:[{
			text:'重置',
			handler: function() {
				var me = this;
				me.up('window').down('form').getForm().reset();
			}
		},{
			text:'确定',
			handler: function() {
				var me = this;
//				var cgrid = currGrid.itemId.toLowerCase();
//				var treeid = getCurrTree().getSelectionModel().getSelection()[0].data.id;
//				var tplid = currGrid.getStore().getProxy().extraParams.template;
				var win = me.up('window');
				var winF = win.down('form');
				var form = winF.getForm();
				if (form.isValid()) {
					if(ruleCAMap) {		//规则设置录入表单数据
						var actParam = Ext.JSON.encode(form.getValues());
						ruleCAMap.add(ruleCAMap.paramType,ruleCAMap.get(ruleCAMap.paramType) + (actParam.length > 0 ? ',' :'') + actParam);
						win.close();
						return;
					}
					var dateFlag = false;
					var cbList = winF.query('checkboxfield');
					var queryCount = 0;
					Ext.Array.each(cbList, function(item,index,alls) {
						if(item.getValue() && item.itemId != 'misty' && item.getXType() != 'radiofield' && item.itemId != 'findall') {
							queryCount++;
							if(item.mySqlType == 'datetime' || item.mySqlType == 'time' || item.mySqlType == 'date') {
								var itmid = item.cbItemId;
								var timeStr =  winF.down('#'+itmid).getValue().split(',');
								var starTime = timeStr[0];
								var endTime = timeStr[1];
								if(endTime < starTime) {
									dateFlag = true;
									Ext.Msg.alert('表单数据模版查询',item.myCbLable+':'+'结束时间不能小于开始时间');
									return false;
								}
							}
						}
					});
					if(dateFlag) {
						return;
					}
					
					if(queryCount > 0) {
						//保存状态
						//保存变量并上传
						var tmpS = myStates.searchState;
						wsUserStates.setServerState('searchState',tmpS);

						currGrid.getStore().getProxy().extraParams.tplsearch = Ext.JSON.encode(form.getValues());
						//'',false,false,false,false,getCurrTree().itemId
						template.setTplGridTitle(currGrid, true, win.down('#findall').getValue(),getCurrTree().itemId);
						
						currGrid.loadGrid(true);
						modActionStates(currGrid, true);
						
						win.close();
					} else {
						win.close();
					}

				}
			}
		},{
			text:'取消',
			handler: function() {
				this.up('window').close();
			}
		}]
	});
}