NA.UI = function(configObj) {
    this.elements = [];
    this.dom = null;
    this.container = null;

    NA.UI.superclass.constructor.call(this, configObj);
    this.init();
}

Util.extend(NA.UI, NA, {
    init : function() {
        throw new Error("Init method wasn't implemented!");
    },

    registerElement : function(element) {
        this.elements.push(element);
    },

    render : function() {
        for(var i = 0, it = this.elements.length; i < it; i++)
        {
            this.elements[i].render();
        }
    }
});

NA.UI.Element = function(configObj) {
    this.dom = null;
    this.container = null;
    this.children = [];
    this.debug = false;
    
    NA.UI.Element.superclass.constructor.call(this, configObj);

    if(this.container == null && this.dom != null)
    {
        this.container = this.dom.parent();
    }
}

Util.extend(NA.UI.Element, NA, {

    getContainer : function() {
        return this.container;
    },

    destroyDOM : function() {
        if(this.dom)
        {
            this.dom.stop();
            this.dom.unbind();
            this.dom.remove();
        }
    },

    destroy : function() {
        this.destroyDOM();
        for(var c = 0, ct = this.children.length; c < ct; c++)
        {
            this.children[c].destroy();
        }

        for (var key in this)
        {
            delete this[key];
        }
    },

    render : function() {
        throw new Error("Render method wasn't implemented!");
    }
});

NA.UI.Element.TopMenu = function(configObj) {
    NA.UI.Element.TopMenu.superclass.constructor.call(this, configObj);
    this.boot();
}

Util.extend(NA.UI.Element.TopMenu, NA.UI.Element, {
    boot : function(){
        this.setUpHover();
    },
    setUpHover : function() {
        var self = this;
        this.dom.find("li").hover(function() {
            $(this).addClass("hover");
            self.open($(this));
        }, function(){
            $(this).removeClass("hover");
            self.close($(this));
        })
    },
    open : function(menu) {
        menu.find('ul').show();
    },
    close : function(menu) {
        menu.find('ul').hide();
    }
})

NA.UI.Element.Button = function(configObj) {
    this.showText = true;
    this.icon = null;
    this.buttonset = false;
    NA.UI.Element.Button.superclass.constructor.call(this, configObj);
}

Util.extend(NA.UI.Element.Button, NA.UI.Element, {
    render : function() {
        var showText = true;
        if(this.icon)
        {
            showText = this.showText;
        }
        
        if(!this.buttonset)
        {
            this.dom.button({
                icons : {
                    primary : this.icon
                },
                text : showText
            });
        }
        else
        {
            this.dom.buttonset();
        }
    }
})



NA.UI.Element.Accordion = function(configObj) {
    NA.UI.Element.Accordion.superclass.constructor.call(this, configObj);
}

Util.extend(NA.UI.Element.Accordion, NA.UI.Element, {
    render : function() {
        this.dom.accordion();
    }
})

NA.UI.Element.DatePicker = function(configObj) {
    NA.UI.Element.DatePicker.superclass.constructor.call(this, configObj);
}

Util.extend(NA.UI.Element.DatePicker, NA.UI.Element, {
    render : function() {
        this.dom.datepicker();
    }
})

NA.UI.Element.Combobox = function(configObj) {
    NA.UI.Element.Combobox.superclass.constructor.call(this, configObj);
}

Util.extend(NA.UI.Element.Combobox, NA.UI.Element, {
    render : function() {
        this.dom.combobox();
    }
})

NA.UI.Element.Buttons = function(configObj) {
    NA.UI.Element.Buttons.superclass.constructor.call(this, configObj);
    this.boot();
}

Util.extend(NA.UI.Element.Buttons, NA.UI.Element, {
    boot : function(){
        this.setUpHover()
    },
    setUpHover : function() {
        this.dom.find("> li").each(function(){
            $(this).hover(function(){
                $(this).addClass("hover");
            }, function(){
                $(this).removeClass("hover");
            })
        })
    }
});