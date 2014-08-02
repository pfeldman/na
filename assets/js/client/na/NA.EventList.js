/**
 * Events List UI
 *
 */

NA.EventList = function(){
    this.filters = [];
    this.resultList = null;
    this.monthFilter = null;
    
    NA.EventList.superclass.constructor.call(this, {
        container : $(".eventsList")
    });
}

Util.extend(NA.EventList, NA.UI, {
    init : function() {
        this.load();
    },
    load : function() {
        var instance = this;
        this.resultList = new NA.EventList.Result({
            dom : $(".eventsList"),
            autostart : true
        })
        
        this.monthFilter = new NA.EventList.Filter.Month({
            UI: this,
            change: function(obj, item) {
                instance.resultList.month = item.value;
                instance.resultList.render();
            }
        })
        this.filters.push(this.monthFilter);
    }
})

/**
 * NA Event List Filter
 * 
 */

NA.EventList.Filter = function(configObj) {
    NA.EventList.Filter.superclass.constructor.call(this, configObj);
}

Util.extend(NA.EventList.Filter, NA.Filter);


/**
 * NA Event List Filter Month
 * 
 */
NA.EventList.Filter.Month = function(configObj) {
    this.change = null;
    this.width = 200;
    
    NA.EventList.Filter.Month.superclass.constructor.call(this, configObj);
    
    this.render();
}

Util.extend(NA.EventList.Filter.Month, NA.EventList.Filter, {
    render : function(callback) {
        var instance = this;
        var comboboxElement = this.UI.container.find(".months");
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
    }
});

NA.EventList.Result = function(configObj) {
    this.month = null;
    
    NA.EventList.Result.superclass.constructor.call(this, configObj);
}

Util.extend(NA.EventList.Result, NA.Result, {
    render : function(){
        var instance = this;
        var params = {};
        
        if(this.month != null)
        {
            params.month = this.month;
        }
        
        instance.showOverlay();
        Util.post("events", params, function(data) {
            var data = eval("(" + data + ")");
            
            var events = data.events;
            instance.destroyRecords();
            for(e in events)
            {
                var event = events[e];
                var records = new NA.EventList.Result.Record({
                    data : event,
                    dom : instance.dom.find(".results")
                }).render();
                
            }
        })
    }
});

/**
 * NA Event List Record
 * 
 */

NA.EventList.Result.Record = function(configObj) {
    this.data = [];
    this.overlay = null;
    this.window = $(window.top);
    this.body = $("body");
    this.openedPicture = null;
    
    NA.EventList.Result.Record.superclass.constructor.call(this, configObj);
}

Util.extend(NA.EventList.Result.Record, NA.EventList.Result, {
    render : function() {
        var instance = this;
        
        daysOfWeek = new Object();
        daysOfWeek[0] = "Domingo";
        daysOfWeek[1] = "Lunes";
        daysOfWeek[2] = "Martes";
        daysOfWeek[3] = "Miércoles";
        daysOfWeek[4] = "Jueves";
        daysOfWeek[5] = "Viernes";
        daysOfWeek[6] = "Sábado";
        
        monthsNames = new Object();
        monthsNames[0] = "Enero";
        monthsNames[1] = "Febrero";
        monthsNames[2] = "Marzo";
        monthsNames[3] = "Abril";
        monthsNames[4] = "Mayo";
        monthsNames[5] = "Junio";
        monthsNames[6] = "Julio";
        monthsNames[7] = "Agosto";
        monthsNames[8] = "Septiembre";
        monthsNames[9] = "Octubre";
        monthsNames[10] = "Noviembre";
        monthsNames[11] = "Diciembre";
        
        var parent = $('<li></li>');
        var leftPart = $('<div class="leftPart"></div>');
        var rightPart = $('<div class="rightPart"></div>')
        
        leftPart.append('<h3>' + this.data.title + '</h3>');
        
        var date = this.data.date.split(" ");
        var time = date[1].split(":");
        
        var hour = time[0];
        var minutes = time[1];
        
        date = date[0].split('-');
        var year = date[0];
        var month = parseInt(date[1]) - 1;
        var day = date[2];

        var dateObject = new Date();
        dateObject.setDate(day);
        dateObject.setMonth(month);
        dateObject.setFullYear(year);
        
        var dayOfWeek = dateObject.getDay();
        
        var dateStr = daysOfWeek[dayOfWeek] + " " + parseInt(day) + " de " + monthsNames[month] + " de " + year + " a las " + time[0] + ":" + time[1];
        leftPart.append('<label><b>Fecha:</b> ' + dateStr + '</label>');
        leftPart.append('<label><b>Lugar:</b> ' + this.data.place + ', ' + this.data.state + ', ' + this.data.city + '</label>');
        leftPart.append('<span class="remark">' + this.data.remarks + '</span>');
        
        var eventPicture = $('<img src="' + this.data.picture_uri + '" />')
        rightPart.append(eventPicture);
        
        eventPicture.click(function(){
            instance.showOverlay();
            instance.openedPicture = eventPicture.clone();
            instance.body.append(instance.openedPicture);
            instance.openedPicture.addClass("clonedPicture");
            instance.openedPicture.css({
                top : eventPicture.offset().top - instance.body.scrollTop(),
                left : eventPicture.offset().left,
                "max-height" : eventPicture.height()
            });
            
            var difference = (parseInt(window.innerHeight) - 50 - instance.openedPicture.width()) * -1;
            
            instance.openedPicture.animate({
                "max-height" : parseInt(window.innerHeight) - 50,
                top : "20px",
                left : "50%",
                "margin-left" : difference / 2 + 50
            }, 300);
        })
        
        parent.append(leftPart);
        parent.append(rightPart);
        this.dom.append(parent);
        
    },
    showOverlay : function() {
        var instance = this;
        this.overlay = $('<div class="pageOverlay"></div>');
        this.overlay.click(function(){
            instance.hideOverlay();
        })
        this.body.append(this.overlay);
    },
    hideOverlay : function() {
        this.overlay.remove();
        this.openedPicture.remove();
    }
})

$(function(){
    var eventList = new NA.EventList();
})