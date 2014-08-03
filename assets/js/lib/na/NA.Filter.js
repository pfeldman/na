/**
 * NA Filter
 * 
 */

NA.Filter = function(configObj) {
    this.element = null;
    this.value = null;

    NA.Filter.superclass.constructor.call(this, configObj);
}

Util.extend(NA.Filter, NA, {
    getElement : function() {
        return this.element;
    },

    getValue : function() {
        return this.value;
    },

    hasValue : function(){
        return this.value != null && this.value != "";
    },

    setValue : function(value) {
        this.value = value;
    },

    load : function(callback) {
        if(typeof callback == "function")
        {
            callback();
        }
    },

    render : function() {
        var instance = this;
        this.load(function(){
            if(instance.element != null)
            {
                instance.element.render();
            }
        });

    }

});