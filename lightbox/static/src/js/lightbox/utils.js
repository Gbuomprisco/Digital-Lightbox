this.utils = {

    fixZoom: function(evt, ui) {

        var zoom = $('#workspace1').css('zoom');
        var canvasHeight = $('#workspace1').height();
        var canvasWidth = $('#workspace1').width();
        ui.position.top = Math.round(ui.position.top / zoom);
        ui.position.left = Math.round(ui.position.left / zoom);

        // don't let draggable to get outside of the canvas
        if (ui.position.left < 0)
            ui.position.left = 0;
        if (ui.position.left + $(this).width() > canvasWidth)
            ui.position.left = canvasWidth - $(this).width();
        if (ui.position.top < 0)
            ui.position.top = 0;
        if (ui.position.top + $(this).height() > canvasHeight)
            ui.position.top = canvasHeight - $(this).height();
    },

    stringToXML: function(text) {
        try {
            var xml = null;

            if (window.DOMParser) {

                var parser = new DOMParser();
                xml = parser.parseFromString(text, "text/xml");

                var found = xml.getElementsByTagName("parsererror");

                if (!found || !found.length || !found[0].childNodes.length) {
                    return xml;
                }

                return null;
            } else {

                xml = new ActiveXObject("Microsoft.XMLDOM");

                xml.async = false;
                xml.loadXML(text);

                return xml;
            }
        } catch (e) {
            // suppress
        }
    },

    getParameter: function(paramName) {
        var searchString = window.location.search.substring(1),
            i, val, params = searchString.split("&");
        var parameters = [];
        for (i = 0; i < params.length; i++) {
            val = params[i].split("=");
            if (val[0] == paramName) {
                parameters.push(unescape(val[1]));
            }
        }
        return parameters;
    },

    getAspectRatio: function(width, height) {
        var ratio = width / height;
        return (Math.abs(ratio - 4 / 3) < Math.abs(ratio - 16 / 9)) ? '4:3' : '16:9';
    },

    getCookie: function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};