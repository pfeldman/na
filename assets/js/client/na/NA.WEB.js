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
            dom : $('.top-menu')
        })
        
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