this.crop = {
    _self: this,
    active: false,

    init: function(data) {
        this.buttons(data);
    },

    crop: function(image) {
        var jcrop_api;

        var image_crop = image.find('img');
        $(image_crop).Jcrop({
            keySupport: false,
            setSelect: false,

            onSelect: function() {
                if ($(_self.workspaceImages.workspace).css('zoom') !== 1) {
                    $(_self.workspaceImages.workspace).css('zoom', 1);
                }
                image.css('transform', 'rotate(0deg)');
                jcrop_api = this;
                _self.crop.active = true;
                _self.toolbar.selectors.buttons.crop_image.fadeIn();
            },

            onChange: this.show_coords,

            onRelease: function() {
                jcrop_api = this;
                _self.crop.active = false;
                jcrop_api.destroy();
                _self.toolbar.selectors.buttons.cropButton.removeClass('active');
                _self.toolbar.selectors.buttons.crop_image.fadeOut();
            }
        });
    },

    show_coords: function(c) {
        _self.crop.coords = [c.x, c.y, c.x2, c.y2];
    },

    buttons: function() {
        _self.toolbar.selectors.buttons.cropButton.click(function() {

            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                _self.crop.crop($('.selected'));
            } else {
                return false;
            }
        });

        return false;
    },

    destroy: function() {

    },


    get_image: function() {
        var image = _self.select_group.imagesSelected[0];
        var width = image.find('img').width();
        var height = image.find('img').height();

        var is_letter = function() {
            if (image.data('is_letter') || image.data('external')) {
                return true;
            } else {
                return false;
            }
        };

        var data = {
            'id': image.attr('id'),
            'image': image.find('img').attr('src'),
            'is_letter': is_letter(),
            'height': height,
            'width': width,
            'box': JSON.stringify(_self.crop.coords),
            'manuscript': image.data('title'),
            'is_external': image.data('external')
        };

        try {
            $.ajax({
                type: 'POST',
                url: 'read-image/',
                data: data,
                beforeSend: function() {
                    if (!$('#letter_wait_box').length) {
                        var loader = "<div class='modal' id='letter_wait_box'><span id='letter_crop_status'>Cropping region ...</span><div id='letters_buttons_loading_box'><img src='/static/img/ajax-loader2.gif' /></div>";

                        _self.selectors.body.append(loader);
                        $('#letter_wait_box').fadeIn();

                    } else {
                        $('#letters_buttons_loading_box').hide().fadeIn().html("<img src='/static/img/ajax-loader2.gif' />");
                        $('#letter_crop_status').hide().fadeIn().html("Cropping region ...");
                    }
                    /*
                            if($.letters.open){
                                $('#top_box_letters').append('<img id="loading_letter_ajax" src="/static/img/ajax-loader.gif" />')
                            }
                            */
                },
                success: function(data) {
                    _self.letters.addLetter(data);
                    return false;
                },
                complete: function() {
                    var letter_wait_box = $('#letter_wait_box');
                    if (!_self.letters.open) {
                        var buttons = "<button id='open-letter-box' class='btn btn-primary'>Open Letters Window</button> <button class='btn btn-danger' id='close-letter-box'>Close</button>";

                        $('#letters_buttons_loading_box').hide().fadeIn().html(buttons);
                        $('#letter_crop_status').hide().fadeIn().html("Region cropped!");

                        $('#close-letter-box').click(function() {
                            letter_wait_box.fadeOut().remove();
                        });

                        $('#open-letter-box').click(function() {
                            letter_wait_box.fadeOut().remove();
                            _self.letters.open_lettersbox();
                        });

                        letter_wait_box.data('completed', true);

                    } else {
                        letter_wait_box.fadeOut().remove();
                        $('#importing_letter_ajax').fadeOut().remove();
                    }

                },
                error: function() {
                    var buttons = "<button id='open-letter-box' class='btn btn-primary'>Open Regions Window</button>";
                    buttons += " <button class='btn btn-danger' id='close-letter-box'>Close</button>";
                    $('#letters_buttons_loading_box').hide().fadeIn().html(buttons);
                    $('#letter_crop_status').hide().fadeIn().html("Something went wrong :(. Try again.!");
                }

            });
        } catch (e) {
            console.warn(e);
            var buttons = "<button id='open-letter-box' class='btn btn-primary'>Open Regions Window</button>";
            buttons += " <button class='btn btn-danger' id='close-letter-box'>Close</button>";
            $('#letters_buttons_loading_box').hide().fadeIn().html(buttons);
            $('#letter_crop_status').hide().fadeIn().html("Something went wrong :(. Try again.!");
        }
    }

};