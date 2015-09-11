Ext.define('WS.lib.SearchField', {
    extend: 'Ext.form.field.Trigger',
    
    alias: 'widget.searchfield',
    
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    
    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    
    hasSearch : false,
    paramName : 'filter',
    
    initComponent: function(){
    	var me = this;
        me.callParent(arguments);
        me.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, me);
    },
    
    afterRender: function(){
    	var me = this;
        me.callParent();    
        me.triggerEl.item(0).up('td').setWidth(0);   
        me.triggerEl.item(0).setDisplayed('none');  
    },
    
    onTrigger1Click : function(){
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            val;
            
        if (me.hasSearch) {
            me.setValue('');
            proxy.extraParams[me.paramName] = '';
            proxy.extraParams.start = 0;
	        proxy.extraParams.refresh = 1;
	        store.load();
	        proxy.extraParams.refresh = null;
            me.hasSearch = false;   
            me.triggerEl.item(0).up('td').setWidth(0);         
            me.triggerEl.item(0).setDisplayed('none');
            me.doComponentLayout();
        }
    },

    onTrigger2Click : function(){
        var me = this,
            store = me.store,
            proxy = store.getProxy(),
            value = me.getValue();
            
        if (value.length < 1) {
            me.onTrigger1Click();
            return;
        }
        proxy.extraParams[me.paramName] = tplPrefix +"dispName like '%" + value + "%'";
        proxy.extraParams.start = 0;
        proxy.extraParams.refresh = 1;
        store.load();
        proxy.extraParams.refresh = null;
        me.hasSearch = true;         
        me.triggerEl.item(0).up('td').setWidth(17);
        me.triggerEl.item(0).setDisplayed('block');
        me.doComponentLayout();   
    }
});
