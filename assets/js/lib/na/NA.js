function NA(configObj) {
    this.loadConfig(configObj);
} 

NA.Util = function(){
    return {
        extend : function(subc, superc, overrides) {
            /*
             * This function was taken from YAHOO yui library
             * Copyright (c) 2007, Yahoo! Inc. All rights reserved.
             * Code licensed under the BSD License:
             * http://developer.yahoo.net/yui/license.txt
             * version: 2.3.0
             */
            if (!superc||!subc) {
                throw new Error("Util.extend failed, please check that " +
                                "all dependencies are included.");
            }
            var F = function() {};
            F.prototype=superc.prototype;
            subc.prototype=new F();
            subc.prototype.constructor=subc;
            subc.superclass=superc.prototype;
            if (superc.prototype.constructor == Object.prototype.constructor)
                superc.prototype.constructor=superc;
            if (overrides)
            {
                for (var i in overrides)
                {
                    subc.prototype[i]=overrides[i];
                }
            }
        },
        post : function(method, params, callback) {
            $.ajax({
                type: "GET",
                url: "/exampleJson/" + method + ".json",
                complete: function (xhr, status) {
                    if (status === 'error' || !xhr.responseText) {
                        if(window.console)
                        {
                            console.log(status);
                        }
                    }
                    else
                    {
                        callback(xhr.responseText);
                    }
                }
            });
        }
    }
};

var Util = new NA.Util();

NA.prototype = {
    loadConfig: function(configObj) {
        $.extend(this, configObj);
    }
};
