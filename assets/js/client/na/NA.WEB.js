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
        
        var button = $(".ui-normal");
        if(button.length > 0)
        {
            var newBut = new NA.UI.Element.Button({
                dom : button
            }).render();
        }
        
        var buttonGroup = $(".checkGroup");
        if(buttonGroup.length > 0)
        {
            var group = new NA.UI.Element.Button({
                dom : buttonGroup,
                buttonset : true
            }).render();
        }
        
        var buttonIcons = $(".ui-icons.ui-notext");
        if(buttonIcons.length > 0)
        {
            var iconsOnly = new NA.UI.Element.Button({
                dom : buttonIcons,
                icon : "ui-icon-locked",
                showText : false
            }).render();
        }
        
        var buttonIconsText = $(".ui-icons.ui-text");
        if(buttonIconsText.length > 0)
        {
            var iconsAndText = new NA.UI.Element.Button({
                dom : buttonIconsText,
                icon : "ui-icon-gear"
            }).render();
        }
        
        
        /*
         * Accordion Configutation Example
         * 
         */
        
        var accorionElement = $("#accordion");
        if(accorionElement.length > 0)
        {
            var accordion = new NA.UI.Element.Accordion({
                dom : accorionElement
            }).render();
        }
        
        
        /*
         * Datepicker Configutation Example
         * 
         */
        
        var datepickerElement = $("#datepicker");
        if(datepickerElement.length > 0)
        {
            var datepicker = new NA.UI.Element.DatePicker({
                dom : datepickerElement
            }).render();
        }
       
        
        /*
         * Combobox Configutation Example
         * 
         */
        var comboboxElement = $(".combobox, #combobox");
        if(comboboxElement.length > 0)
        {
            var combobox = new NA.UI.Element.Combobox({
                dom : comboboxElement
            }).render();
        }
        
        
        
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