Ext.define('WS.address.AddressSelfFilter', {	
	extend: 'Ext.window.Window',
	title: '自定义查询条件',
	iconCls: 'findaddrICON',
    height: 436,
    width: 360,
    border: false,
	bodyCls: 'panelFormBg',
    layout: 'hbox',
    resizable: false,
    modal: true,   //设置window为模态
    listeners: {
		afterrender: function(com,opts) {
			//读取状态保存
			//加载State
			if(myStates.searchState) {
				for (key in myStates.searchState) {
					if(key == 'stateSaved')
						continue;					
					if(key == 'allsrc') {
						var flag = myStates.searchState['allsrc'];
						com.down('#allsrcID').setValue(flag);
					}
					if(key == 'islike') {
						var flag = myStates.searchState['islike'];
						com.down('#islikeID').setValue(flag);
					}
				}
			}
		}
	},
	items:[{
		xtype: 'form',
    	width: 340,
		bodyPadding: 10,
		border: false,
		bodyCls: 'panelFormBg',
	    url: WsConf.Url,
	    itemId: 'formID',
	    items: [{
	   		xtype:'fieldset',
	   		padding: '5 10 5 10',
//			collapsible: true,
			defaultType: 'checkbox',
        	layout: 'hbox',
			items:[{
				boxLabel: '在所有资源子目录下查找',
				itemId: 'allsrcID',
				inputValue: '1',
				listeners: {
					change: function(com,nVal,oVal,opts) {
						myStates.searchState.allsrc = nVal;
					}
				}
			}, {
				padding: '0 0 0 40',
				boxLabel: '模糊查找',
				checked: true,
				itemId: 'islikeID',
				inputValue: '2',
				listeners: {
					change: function(com,nVal,oVal,opts) {
						myStates.searchState.islike = nVal;
					}
				}
			}]
	    },  {
	    	
	    	xtype:'fieldset',
//	    	collapsible: true,
	    	padding: '7 0 5 0',
	    	defaultType: 'textfield',
	    	items: [{
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'DispName',
	    		fieldLabel: '显示名',
	    		itemId: 'DispNameID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'LastName',
	    		fieldLabel: '姓',
	    		itemId: 'LastNameID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'FirstName',
	    		fieldLabel: '名',
	    		itemId: 'FirstNameID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'spareFaxNumber',
	    		fieldLabel: '客户编号',
	    		itemId: 'spareFaxNumberID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'FaxNumber',
	    		fieldLabel: '传真号码',
	    		itemId: 'FaxNumberID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'PhoneNumber',
	    		fieldLabel: '电话号码',
	    		itemId: 'PhoneNumberID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'MobileNumber',
	    		fieldLabel: '手机号码',
	    		itemId: 'MobileNumberID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'Email',
	    		fieldLabel: '电子邮箱',
	    		itemId: 'EmailID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'Organization',
	    		fieldLabel: '组织',
	    		itemId: 'OrganizationID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'State',
	    		fieldLabel: '省',
	    		itemId: 'StateID'
	    	}, {
	    		labelAlign: 'right',
	    		labelPad: 15,
	    		name: 'City',
	    		fieldLabel: '城市',
	    		itemId: 'CityID'
	    	}]
	    }]
	}],
		    buttons: [{
		        text: '重置',
		        handler: function() {
		        	var me = this;
		        	var w = me.up('window');
		        	var f = w.getComponent('formID');
		        	f.getForm().reset();
		        }
		    }, {
		        text: '确定',
		        formBind: true, //only enabled once the form is valid
		        handler: function() {
		        	var w = this.up('window');
		        	var filter = '';
		        	if(w.down('#allsrcID').getValue()) {
		        		//若在所有资源目录下查找 
		        		w.grid.getStore().getProxy().extraParams.folderFlag = 'all';
		        	}else {
		        		w.grid.getStore().getProxy().extraParams.folderFlag = '';
		        	}
		        	var isLike = w.down('#islikeID').getValue();
	        		var dispName = w.down('#DispNameID').getValue();
	        		if(dispName && dispName.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        			"upper("+tplPrefix +"dispName) like '%" + dispName.toUpperCase() + "%'"
		        			: tplPrefix + "dispName='" + dispName + "'");
	        		}
	        		var LastName = w.down('#LastNameID').getValue();
	        		if(LastName && LastName.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') + (isLike ? 
		        			"upper("+tplPrefix +"lastName) like '%" + LastName.toUpperCase() + "%'"
		        			: tplPrefix + "lastName='" + LastName + "'");
	        		}
	        		var FirstName = w.down('#FirstNameID').getValue();
	        		if(FirstName && FirstName.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			"upper("+tplPrefix +"firstName) like '%" + FirstName.toUpperCase() + "%'"
	        				: tplPrefix + "firstName='" + FirstName + "'");
	        		}
	        		var spareFaxNumber = w.down('#spareFaxNumberID').getValue(); //客户编号
	        		if(spareFaxNumber && spareFaxNumber.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			"upper("+tplPrefix +"spareFaxNumber) like '%" + spareFaxNumber.toUpperCase() + "%'"
	        				: tplPrefix + "spareFaxNumber='" + spareFaxNumber + "'");
	        		}
	        		var FaxNumber = w.down('#FaxNumberID').getValue();
	        		if(FaxNumber && FaxNumber.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			tplPrefix +"faxNumber like '%" + FaxNumber + "%'"
	        				: tplPrefix + "faxNumber='" + FaxNumber + "'");
	        		}
	        		var PhoneNumber = w.down('#PhoneNumberID').getValue();
	        		if(PhoneNumber  && PhoneNumber.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			tplPrefix +"phoneNumber like '%" + PhoneNumber + "%'"
	        				: tplPrefix + "phoneNumber='" + PhoneNumber + "'");
	        		}
	        		var MobileNumber = w.down('#MobileNumberID').getValue();
	        		if(MobileNumber && MobileNumber.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			tplPrefix +"mobileNumber like '%" + MobileNumber + "%'"
	        				: tplPrefix + "mobileNumber='" + MobileNumber + "'");
	        		}
	        		var Email = w.down('#EmailID').getValue();
	        		if(Email && Email.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			"upper("+tplPrefix +"email) like '%" + Email.toUpperCase() + "%'"
	        				: tplPrefix + "email='" + Email + "'");
	        		}
	        		var Organization = w.down('#OrganizationID').getValue();
	        		if(Organization && Organization.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			"upper("+tplPrefix +"organization) like '%" + Organization.toUpperCase() + "%'"
	        				: tplPrefix + "organization='" + Organization + "'");
	        		}
	        		var State = w.down('#StateID').getValue();
	        		if(State  && PhoneNumber.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			tplPrefix +"state like '%" + State + "%'"
	        				: tplPrefix + "state='" + State + "'");
	        		}
	        		var City = w.down('#CityID').getValue();
	        		if(City && City.length != 0) {
	        			filter += (filter.length > 0 ? ' and ': '') +(isLike ? 
		        			tplPrefix +"city like '%" + City + "%'"
	        				: tplPrefix + "city='" + City + "'");
	        		}
	        		if(filter.length == 0) {
						return;
					}
	        		//保存状态
					//保存变量并上传
					var tmpS = myStates.searchState;
					wsUserStates.setServerState('searchState',tmpS);
		        	
		        	w.grid.loadGrid(true,false,filter);
		        	if(w.down('#allsrcID').getValue()) {
		        		gridTitle.setTitle('查找结果 { 所有资源目录 }');
		        	} else {
		        		var str = linkViewTitle(addressTree1.getSelectionModel().getSelection());
		        		gridTitle.setTitle('查找结果 {' + str + '}');
		        	}
		        	w.close();
		        	
		        }
		    }, {
		        text: '取消',
		        handler: function() {
		            this.up('window').close();
		        }
		    }]
});