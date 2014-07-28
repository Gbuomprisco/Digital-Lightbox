this.minimap = {
    _self: this,
    width: 10,
    height: 10,
    namespace: 'mini_',
    images: [],

    add_to_minimap: function(id, src) {
        var image = $("#" + id);
        var position = image.offset();
        var top = position['top'] / $(window).height() * 28;
        var left = position['left'] / $(window).width() * 20.5;
        var size = image.css(['width', 'height']);
        var mini_id = this.namespace + id;
        var element = $("<img>");
        element.data('image', id);
        element.attr('id', mini_id);
        element.attr('class', 'image_map');
        element.attr('src', src);
        $('#overview').append(element);

        if (_self.workspaceImages.workspace == _self.defaults.workspace2) {
            top = top * 2;
            left = left * 2;
        }

        element.css({
            "width": parseInt(size['width']) / this.width + "px",
            "height": parseInt(size['height']) / this.height + "px",
            "top": top,
            "left": left
        });

        if (_self.workspaceImages.workspace != image.data('workspace')) {
            element.css({
                'display': 'none'
            });

        }
        this.make_scrollable(element);
        this.images.push(element);
    },

    make_scrollable: function(map_image) {
        $(map_image).click(function(event) {
            var image = map_image.data('image');
            var position = $('#' + image).offset();

            _self.selectors.html.animate({
                scrollTop: position.top - 100,
                scrollLeft: position.left - 100
            }, 800);

            _self.selectors.body.animate({
                scrollTop: position.top - 100,
                scrollLeft: position.left - 100
            }, 800);
            event.stopPropagation();
        });

    },

    update_mini_map: function(ui) {
        if (typeof ui != "undefined") {
            var top, left, image;
            if (ui.helper.hasClass('selected')) {
                $.each($('.image_active'), function() {
                    top = parseInt($(this).css('top')) / $(window).height() * 28;
                    left = parseInt($(this).css('left')) / $(window).width() * 20.5;
                    if (_self.workspaceImages.workspace == _self.defaults.workspace2) {
                        top = top * 2;
                        left = left * 2;
                    }
                    image = {
                        'top': top,
                        'left': left
                    };
                    $("#" + _self.minimap.namespace + $(this).attr('id')).animate({
                        'left': image['left'],
                        'top': image['top']
                    }, 0);
                });
            } else {
                var element = ui.helper;
                top = (parseInt(element.css('top')) / $(window).height()) * 28;
                left = (parseInt(element.css('left')) / $(window).width()) * 20.5;

                if (_self.workspaceImages.workspace == _self.defaults.workspace2) {
                    top = top * 2;
                    left = left * 2;
                }

                $("#" + _self.minimap.namespace + element.attr('id')).animate({
                    'left': left,
                    'top': top
                }, 0);

            }
        }

    },

    clean_minimap: function() {
        var images = this.images;
        for (var i = 0; i < images.length; i++) {
            var id = $(images[i]).attr('id');
            $('#' + id).remove();
        }
        this.images = [];
    }
};