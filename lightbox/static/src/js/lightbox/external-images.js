this.loadExternalImages = {
    _self: this,
    init: function(parameter) {

        var parameters = this.parse(parameter);
        if (!parameters.length) {
            //$.imagesBox.show();
            return;
        }
        /*
        var button = " <img data-toggle='tooltip' title='Browse Manuscripts' id='button_images' src='/static/img/_manuscript.png' />";
        $('#buttons').prepend(button);

        $('#button_images').click(function() {
            $.imagesBox.show();
        });
        */
        var images_list = JSON.parse(parameters[0]);
        var images = [];

        for (i = 0; i < images_list.length; i++) {
            images.push(images_list[i]);
        }

        var data;
        if (parameter == 'images') {
            data = {
                'images': JSON.stringify(images)
            };
        } else {
            data = {
                'annotations': JSON.stringify(images)
            };
        }

        var request = $.get("images/", data);

        request.done(function(data) {
            if (_self.import.printImages(data)) {
                _self.imagesBox.to_workspace();
                $("#hidden_div").remove();
            }
        });


    },

    parse: function(parameter) {
        var parameters = _self.utils.getParameter(parameter);
        return parameters;
    }

};