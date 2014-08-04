/**
 * NA Map
 * 
 */

NA.Map = function(configObj) {
    this.data = [];
    this.id = null;
    
	this.markers = [];
	this.selectedMarker = null;
	this.body = $("body");
	this.overlay = null;
	this.content = null;
	this.map = null;
	this.mapDom = null;
	this.type = "map";
	this.zoom = 15;
	this.mapOptions = new Object();
	
	NA.Result.superclass.constructor.call(this, configObj);
}

Util.extend(NA.Map, NA, {
    drawMap : function() {
        var instance = this;
        var defaultLocation = null;
        if(this.selectedMarker != undefined)
        {
            defaultLocation = this.selectedMarker;
        }
        else
        {
            defaultLocation = this.markers[0].getLatLng();
            this.zoom = 13;
        }
        
        this.mapOptions = {
            zoom: this.zoom,
            center: defaultLocation
        };
        
        this.map = new google.maps.Map(
                        this.mapDom[0],
                        this.mapOptions
        );
        
        for(m in this.markers)
        {
            var marker = this.markers[m];
            marker.map = this.map;
            
            marker.render();
            
            marker.bind("click", function(context){
                instance.closeAllInfoWindows();
                context.infoWindow.open(instance.map, context.marker);
                context.hasInfoWindowOpened = true;
            })
        }
        this.bind("click", function(context){
            instance.closeAllInfoWindows();
        })
    },
    closeAllInfoWindows : function() {
        var instance = this;
        for(n in instance.markers)
        {
            var mark = instance.markers[n];
            if(mark.hasInfoWindowOpened)
            {
                mark.infoWindow.close();
            }
        }
    },
    hideOverlay : function() {
        this.overlay.remove();
        this.content.remove();
    },
    showOverlay : function() {
        var instance = this;
        this.overlay = $('<div class="pageOverlay"></div>');
        this.overlay.click(function(){
            instance.hideOverlay();
        });
        
        this.mapDom = $('<div class="map"></div>');
        var closeButton = $('<div class="closeButton"></div>');
        this.content = $('<div class="mapContent"></div>');
        this.content.append(this.mapDom);
        this.content.append(closeButton);
        
        closeButton.click(function(){
            instance.hideOverlay();
            return false;
        })
        
        this.body.append(this.overlay);
        this.body.append(this.content);
    },
    getLatLangByAddress : function(address, data, callback) {
        var geo = new google.maps.Geocoder;
        
        geo.geocode({'address':address}, function(results, status){
            if (status == google.maps.GeocoderStatus.OK) {
                if(typeof callback == 'function')
                {   
                    callback(results[0].geometry.location, data, false);
                }
            } 
            else 
            {
                if(window.console)
                {
                    console.log("No se ha encontrado la ubicación geográfica para " + address + ": " + status);
                }
                callback(false, data, true);
            }
       });
    },
    bind : function(event, handler) {
        var instance = this;
        var object = this.map;
        if(this.type == "marker")
        {
            object = this.marker;
        }
        
        google.maps.event.addListener(object, event, function(){
            handler(instance)
        });
    },
    render : function() {
        var instance = this;
        this.showOverlay();
        var i = 0;
        for(d in this.data)
        {
            var address = this.data[d].node.field_direcci_n + ', ' + this.data[d].node.field_barrio_localidad + ', ' + this.data[d].node.field_provincia;
            if(instance.data[d].node.nid == instance.id)
            {
                this.getLatLangByAddress(address, this.data[d].node, function(location, data, error) {
                    if(!error)
                    {
                        var marker = new NA.Map.Marker({
                            lat : location.lat(),
                            lng : location.lng(),
                            choosed : true,
                            data : data,
                            parent : instance
                        });
                        
                        instance.selectedMarker = new google.maps.LatLng(location.lat(), location.lng());
                        
                        instance.markers.push(marker);
                    }
                    i++;
                    if(i == instance.data.length)
                    {
                        instance.drawMap();
                    }
                })
            }
            else
            {
                this.selectedMarker = this.getLatLangByAddress(address, this.data[d].node, function(location, data, error) {
                    if(!error)
                    {
                        var marker = new NA.Map.Marker({
                            lat : location.lat(),
                            lng : location.lng(),
                            choosed : false,
                            data : data,
                            parent : instance
                        });
                        
                        instance.markers.push(marker);
                    }
                    i++;
                    if(i == instance.data.length)
                    {
                        instance.drawMap();
                    }
                })
            }
        }
    }
})

NA.Map.Marker = function(configObj) {
    this.map = null;
    this.lat = null;
    this.lng = null;
    this.choosed = false;
    this.data = [];
    this.marker = null;
    this.infoWindow = null;
    this.hasInfoWindowOpened = false;
    this.parent = null;
    
    NA.Map.Marker.superclass.constructor.call(this, configObj);
    
    this.load();
}

Util.extend(NA.Map.Marker, NA.Map, {
    load : function() {
        this.type = "marker";
    },
    getLatLng : function() {
        return new google.maps.LatLng(this.lat, this.lng);
    },
    render : function() {
        if(this.choosed)
        {
            var image = '/assets/images/markerBlue.png';
        }
        else
        {
            var image = '/assets/images/markerRed.png';
        }
        
        var marker = new google.maps.Marker({
            position: this.getLatLng(),
            map: this.map,
            icon: image
        });
        
        this.marker = marker;
        
        var days = eval('(' + this.data.dias + ')').dias;
        var popup = '\
                    <div class="toolTipContent">\
                        <h3>' + this.data.title + '</h3>\
                        <label>' + this.data.field_direcci_n + ', ' + this.data.field_barrio_localidad + '</label>\
                    </div>\
        ';
        
        this.bindPopup(popup);
        
        if(this.choosed)
        {
            this.infoWindow.open(this.map, this.marker);
            this.hasInfoWindowOpened = true;
        }
    },
    remove : function() {
        this.marker.setMap(null);
    },
    bindPopup : function(popup) {
        var instance = this;
        
        this.infoWindow = new google.maps.InfoWindow({
            content: popup,
            maxWidth : 380,
            maxHeight : 100
        });
    }
});