/**
 * Group List UI
 *
 */

NA.GroupList = function(){
    this.filters = [];
    this.resultList = null;
    this.stateFilter = null;
    this.cityFilter = null;
    
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
                instance.resultList.render();
            }
        });
        this.filters.push(this.stateFilter);
    }
})

/**
 * NA Group List Filter
 * 
 */

NA.GroupList.Filter = function(configObj) {
    NA.GroupList.Filter.superclass.constructor.call(this, configObj);
}

Util.extend(NA.GroupList.Filter, NA.Filter);

/**
 * NA State Filter
 * 
 */

NA.GroupList.Filter.State = function(configObj) {
    this.change = null;
    this.width = 200;
    
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
                width: this.width,
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
    this.width = 200;
    NA.GroupList.Filter.City.superclass.constructor.call(this, configObj);
    
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
                width: this.width,
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
    this.state = null;
    this.city = null;
    
    NA.GroupList.Result.superclass.constructor.call(this, configObj);
}

Util.extend(NA.GroupList.Result, NA.Result, {
    render : function(){
        var instance = this;
        var params = {};
        
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
            
            var groups = data.results.groups;
            instance.destroyRecords();
            for(g in groups)
            {
                var group = groups[g];
                var record = new NA.GroupList.Result.Record({
                    data : group,
                    dom : instance.dom.find(".results")
                }).render();
                instance.records.push(record);
            }
        })
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