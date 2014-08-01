/**
 * Group List UI
 *
 */

NA.GroupList = function(){
    this.filters = [];
    this.resultList = null;
    this.stateFilter = null;
    
    NA.GroupList.superclass.constructor.call(this, {
        container : $(".searchGroup")
    });
}

Util.extend(NA.GroupList, NA.UI, {
    init : function() {
        this.load();
    },
    load : function() {
        var instance = this;
        this.resultList = new NA.GroupList.Result({
            dom : $(".searchGroup")
        });
        
        this.cityFilter = new NA.GroupList.Filter.City({
            UI: this,
            change: function(obj, item) {
                instance.resultList.city = item.value;
                if(instance.resultList.paginator)
                {
                    instance.resultList.paginator.page = 1;
                }
                instance.resultList.render();
            }
        });
        this.filters.push(this.cityFilter);
        
        this.cityFilter.element.disable();
        
        this.stateFilter = new NA.GroupList.Filter.State({
            UI: this,
            change: function(obj, item) {
                instance.resultList.state = item.value;
                instance.cityFilter.update(item.value);
                if(instance.resultList.paginator)
                {
                    instance.resultList.paginator.page = 1;
                }
                instance.resultList.render();
            }
        });
        this.filters.push(this.stateFilter);
    }
})
    

/**
 * NA Filter
 * 
 */

NA.GroupList.Filter = function(configObj) {
    this.element = null;
    this.value = null;

    NA.GroupList.Filter.superclass.constructor.call(this, configObj);
}

Util.extend(NA.GroupList.Filter, NA, {
    destroy : function() {
        this.destroyChildren();
        this.element.destroy();
    },

    destroyChildren : function(){
        if(this.child != null)
        {
            this.child.destroy();
            this.child = null;
        }
    },

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

    reload : function() {
        if(this.element != null)
        {
            this.element.destroy();
            this.data = [];
            this.load();
            this.render();
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

    },

    reset : function() {
        this.setValue(null);
    },

    update: function(obj, item, scope) {
        if(scope.getValue() != item.value)
        {
            scope.setValue(item.value);
            scope.UI.refresh();
            scope.UI.triggerSearch();
        }
    }

});


/**
 * NA State Filter
 * 
 */

NA.GroupList.Filter.State = function(configObj) {
    this.change = null;
    NA.GroupList.Filter.State.superclass.constructor.call(this, configObj);
    
    this.render();
}

Util.extend(NA.GroupList.Filter.State, NA.GroupList.Filter, {
    render : function(callback) {
        var instance = this;
        var comboboxElement = this.UI.container.find(".state");
        if(comboboxElement.length > 0)
        {
            this.element = new NA.UI.Element.Combobox({
                dom: this.UI.container.find(".state"),
                width: 200,
                changeEvent: function(obj, item) {
                    if(typeof instance.change == "function")
                    {
                        instance.change(obj, item);
                    }
                }
            });
            this.element.render();
            
            this.value = comboboxElement.val();
        }
    }
})


/**
 * NA City Filter
 * 
 */

NA.GroupList.Filter.City = function(configObj) {
    this.change = null;
    NA.GroupList.Filter.State.superclass.constructor.call(this, configObj);
    
    this.render();
}

Util.extend(NA.GroupList.Filter.City, NA.GroupList.Filter, {
    render : function(callback) {
        var instance = this;
        var comboboxElement = this.UI.container.find(".city");
        if(comboboxElement.length > 0)
        {
            this.element = new NA.UI.Element.Combobox({
                dom: comboboxElement,
                width: 200,
                changeEvent: function(obj, item) {
                    if(typeof instance.change == "function")
                    {
                        instance.change(obj, item);
                    }
                }
            });
            this.element.render();
            this.value = comboboxElement.val();
        }
    },
    hideOverlay : function() {
        this.element.enable();
        this.element.getObject().find(".smallAjax").remove();
    },
    showOverlay : function() {
        this.element.disable();
        this.element.getObject().append('<div class="smallAjax"></div>');
    },
    update : function(state) {
        var instance = this;
        this.showOverlay();
        var params = {
            state : state
        };
        
        Util.post("cities", params, function(cities){
            cities = eval(cities);
            var options = instance.element.dom.find("option");
            options.slice(1).remove();
            
            for(c in cities)
            {
                var city = cities[c];
                instance.element.dom.append('<option value="' + city.code + '">' + city.name + '</option>');
            }
            instance.element.refresh();
            instance.hideOverlay();
        })
    }
})


/**
 * NA Result List
 * 
 */

NA.GroupList.Result = function(configObj) {
    this.records = [];
    this.paginator = null;
    this.autostart = false;
    this.state = null;
    this.city = null;
    this.usePaginator = false;
    
    NA.GroupList.Result.superclass.constructor.call(this, configObj);
    this.load();
}

Util.extend(NA.GroupList.Result, NA, {
    destroyRecords : function(){
        this.dom.find(".results *").remove();
    },
    showOverlay : function(){
        this.dom.find(".results").append('<div class=ajaxLoadingBig></div>');
    },
    render : function(){
        var instance = this;
        var params = {};
        if(this.paginator == null)
        {
            params.page = 1;
        }
        
        if(this.city != null)
        {
            params.city = this.city;
        }
        
        if(this.state != null)
        {
            params.state = this.state;
        }
        
        instance.showOverlay();
        Util.post("records", params, function(data) {
            var data = eval("(" + data + ")");
            if(this.paginator == null && this.usePaginator)
            {
                var page = 1;
                instance.paginator = new NA.GroupList.Result.Paginator({
                    page : page,
                    dom : instance.dom.find(".paginator"),
                    pages : data.results.pages
                })
            }
            else if(this.usePaginator)
            {
                this.paginator.pages = data.results.pages;
                this.paginator.render();
            }
            
            var groups = data.results.groups;
            instance.destroyRecords();
            for(g in groups)
            {
                var group = groups[g];
                var record = new NA.GroupList.Result.Record({
                    data : group,
                    dom : instance.dom.find(".results")
                }).render();
            }
        })
    },
    load: function() {
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

/**
 * NA Result List Paginator
 * 
 */

NA.GroupList.Result.Paginator = function(configObj) {
    this.page = 1;
    this.pages = null;
    NA.GroupList.Result.Paginator.superclass.constructor.call(this, configObj);
}

Util.extend(NA.GroupList.Result.Paginator, NA.GroupList.Result, {
    destroy : function(){
        this.dom.find("*").remove();
    },
    render : function(){
        /*this.destroy();
        var buttons = [];
        if(this.page > 1)
        {
            buttons.push($('<a class="page' + (this.page - 1) + ' previous" href="#"></a>'));
            this.dom.append(buttons[buttons.length - 1]);
            
            buttons.push($('<a class="page' + (this.page - 1) + ' page" href="#">' + (this.page - 1) + '</a>'));
            this.dom.append(buttons[buttons.length - 1]);
        }
        buttons.push($('<span class="current page">' + this.page + '</span>'));
        this.dom.append(buttons[buttons.length - 1]);
        
        if(this.page + 1 <= this.pages)
        {
            buttons.push($('<a class="page' + (this.page + 1) + ' page" href="#">' + (this.page + 1) + '</a>'));
            this.dom.append(buttons[buttons.length - 1]);
        }
        if(this.page + 2 <= this.pages)
        {
            buttons.push($('<a class="page' + (this.page + 2) + ' page" href="#">' + (this.page + 2) + '</a>'));
            this.dom.append(buttons[buttons.length - 1]);
        }
        if(this.page + 4 <= this.pages)
        {
            buttons.push($('<span class="more page">...</span>'));
            this.dom.append(buttons[buttons.length - 1]);
            
            buttons.push($('<a class="page' + this.pages + ' page" href="#">' + this.pages + '</a>'));
            this.dom.append(buttons[buttons.length - 1]);
        }
        else if(this.page + 3 <= this.pages)
        {
            buttons.push($('<a class="page' + this.pages + ' page" href="#">' + this.pages + '</a>'));
            this.dom.append(buttons[buttons.length - 1]);
        }
        if(this.page + 1 <= this.pages)
        {
            buttons.push($('<a class="page' + (this.page + 1) + ' next" href="#"></a>'));
            this.dom.append(buttons[buttons.length - 1]);
        }*/
    }
});

/**
 * NA Result List Record
 * 
 */

NA.GroupList.Result.Record = function(configObj) {
    this.data = [];
    
    NA.GroupList.Result.Record.superclass.constructor.call(this, configObj);
}

Util.extend(NA.GroupList.Result.Record, NA.GroupList.Result, {
    render : function(){
        var days = new Object();
        days["Monday"] = "Lunes";
        days["Tuesday"] = "Martes";
        days["Wednesday"] = "Miércoles";
        days["Thursday"] = "Jueves";
        days["Friday"] = "Viernes";
        days["Saturday"] = "Sábado";
    
        var properties = new Object();
        properties["X"] = "Ofrece Certificado para Juez";
        properties["NF"] = "No Fumadores";
        properties["A"] = "Reunión Abierta";
        properties["AF"] = "Abre los feriados";
        properties["C"] = "Reunión Cerrada";
        properties["D"] = "Desayuno";
        properties["E"] = "Escritura";
        properties["IE"] = "Intereses Especiales";
        properties["L"] = "Literatura";
        properties["M"] = "Sólo Mujeres";
        properties["P"] = "Pasos";
        properties["T"] = "Tradiciones";
        properties["RL"] = "Reunión para Recién llegados";
        properties["10+"] = "Para 10 años limpios ó mas";
    
        var record = $('<li></li>');
        record.append('<a href="#"><h3>' + this.data.title + '</h3></a>');
        record.append('<label>' + this.data.address + '<label>');
        var dates = this.data.dates;
        
        var datesObject = $('<ul></ul>');
        for(d in dates)
        {
            var dateObject = $('<li></li>');
            var date = dates[d];
            dateObject.append('<label class="day">' + days[date.day] + '</label>');
            dateObject.append('<label class="time">' + date.startTime + ' a ' + date.endTime + '</label>');
            dateObject.append('<label>-</label>');
            datesObject.append(dateObject);
            
            var props = date.properties;
            var propsTranslated = [];
            for(p in props)
            {
                var prop = properties[props[p]];
                propsTranslated.push(prop);
            }
            dateObject.append('<label class="types">' + propsTranslated.join(", ") + '</label>');
        }
        record.append(datesObject);
        
        var props = this.data.properties;
        for(p in props)
        {
            var prop = properties[props[p]];
            record.append('<span class="feature">' + prop + '</span>');
        }
        
        this.dom.append(record);
    }
})
$(function(){
    var groupList = new NA.GroupList();
})