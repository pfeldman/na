/**
 * NA Result List
 * 
 */

NA.Result = function(configObj) {
    this.records = [];
    this.autostart = false;
    this.resultParent = null;
    
    NA.Result.superclass.constructor.call(this, configObj);
    this.load();
}

Util.extend(NA.Result, NA, {
    destroyRecords : function(){
        this.resultParent.find("*").remove();
    },
    showOverlay : function() {
        this.resultParent.append('<div class=ajaxLoadingBig></div>');
    },
    render : function() {
        throw new Error("Render method wasn't implemented!");
    },
    load: function() {
        if(this.resultParent == null)
        {
            this.resultParent = this.dom.find(".results");
        }
        if(this.autostart)
        {
            this.render();
        }
        else
        {
            this.dom.find(".results").append('<em>Por favor, elija una provincia para inicar</em>');
        }
    }
});