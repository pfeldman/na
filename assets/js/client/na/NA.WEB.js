NA.WEB = function(configObj) {
    NA.WEB.superclass.constructor.call(this, configObj);
    this.boot();
}

Util.extend(NA.WEB, NA, {
    boot : function() {
        this.initEvents();
    },
    initEvents : function(){
        var topMenu = new NA.UI.Element.TopMenu({
            dom : $('nav > .menu')
        })
        
        
        /*
         * Buttons configuration Example
         * 
         */
        
        var newBut = new NA.UI.Element.Button({
            dom : $(".ui-normal")
        }).render();
        
        var group = new NA.UI.Element.Button({
            dom : $(".checkGroup"),
            buttonset : true
        }).render();
        
        var iconsOnly = new NA.UI.Element.Button({
            dom : $(".ui-icons.ui-notext"),
            icon : "ui-icon-locked",
            showText : false
        }).render();
        
        var iconsAndText = new NA.UI.Element.Button({
            dom : $(".ui-icons.ui-text"),
            icon : "ui-icon-gear"
        }).render();
        
        
        /*
         * Accordion Configutation Example
         * 
         */
        
        var accordion = new NA.UI.Element.Accordion({
            dom : $("#accordion")
        }).render();
        
        
        /*
         * Datepicker Configutation Example
         * 
         */
        
        var datepicker = new NA.UI.Element.DatePicker({
            dom : $("#datepicker")
        }).render();
       
        
        /*
         * Combobox Configutation Example
         * 
         */
        
        var combobox = new NA.UI.Element.Combobox({
            dom : $("#combobox")
        }).render();
        
        
        
        var buttons = $('.buttons');
        if(buttons.length > 0)
        {
            var but = new NA.UI.Element.Buttons({
                dom : buttons
            })
        }
    }
})

$(function(){
    var web = new NA.WEB();
})