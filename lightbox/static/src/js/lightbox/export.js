this.export = {
    _self: this,
    open: false,

    init: function() {

        this.buttons();
    },

    show: function() {
        this.open = true;
        var button_position = $('#save').position();
        $('#save').hide();
        $('#export').css({
            "top": $('#buttons').position().top + button_position.top,
            'left': "2%"
        }).show().animate({
            "top": "20%",
            'left': "29%",
            'width': "42%",
            'height': "25%",
            'opacity': 1
        }, {
            duration: 350,
            complete: function() {
                $('#close_export').click(function() {
                    _self.export.hide();
                });
            }
        }).draggable();
    },

    hide: function() {
        this.open = false;
        $('#save').show();
        var button_position = $('#save').position();
        $('#export').animate({
            "top": $('#buttons').position().top + $('#save').position().top,
            'left': "2%",
            'width': "0%",
            'height': "0%",
            'opacity': 0
        }, {
            duration: 250,
            complete: function() {
                $(this).hide();
            }
        });

    },

    buttons: function() {

        $('#save').click(function() {
            _self.export.show();
        });

        $('#save_to_pc').click(function() {
            _self.export.main();
        });

    },

    exportImages: function() {
        var images = [];
        var workspace_images = $('.image_active');
        return workspace_images;
    },

    exportImagesProperties: function(images) {
        var images_properties = [];

        var position = function(image) {
            var get_position = image.offset();
            return get_position;
        };

        var original_size = function(image) {
            var size = image.data('size');
            return size;
        };

        var zIndex = function(image) {
            return image.find('img').css('z-index');
        };

        var size = function(image) {
            var dimension = image.find('img').css(['width', "height"]);
            return {
                "width": dimension['width'],
                'height': dimension['height']
            };
        };

        var get_brightness = function() {

            String.prototype.getNums = function() {
                var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
                    mapN = this.match(rx) || [];
                return mapN.map(Number);
            };

            var slider_brightness = $("#slider_brightness").slider("option", "value");
            var brightness;
            if (typeof slider_brightness != 'object') {
                brightness = slider_brightness;
            } else {
                brightness = 200;
            }

            return brightness;
        };

        for (var i = 0; i < images.length; i++) {

            var propriety = {
                'opacity': $(images[i]).find('img').css('opacity'),
                'brightness': get_brightness(),
                'filter': $(images[i]).find('img').css('-webkit-filter'),
                'transform': $(images[i]).find('img').css('transform'),
                'is_letter': $(images[i]).data('is_letter'),
                'classes': $(images[i]).find('img').attr('class')
            };

            var image = {
                'image': $(images[i]).attr('id'),
                'position': position($(images[i])),
                'size': size($(images[i])),
                'original_size': original_size($(images[i])),
                'properties': propriety,
                'workspace': $(images[i]).closest('.workspace').attr('id'),
                "z-index": zIndex($(images[i]))
            };

            if ($(images[i]).data('is_letter')) {
                var src = $(images[i]).find('img').attr('src');
                image.src = src;
            } else {
                image.src = false;
            }

            images_properties.push(image);

        }

        return images_properties;
    },

    export_letters: function() {
        var letters = _self.letters.regions;
        if (letters.length) {
            var manuscripts_extracted = [];
            var letters_extracted = [];
            for (var i = 0; i < letters.length; i++) {
                var region = {
                    'manuscript': letters[i].title,
                    'id': letters[i].id,
                    'letters': []
                };
                for (var j = 0; j < letters[i].letters.length; j++) {
                    var letter = {
                        'src': letters[i].letters[j].attr('src'),
                        'size': letters[i].letters[j].data('size'),
                        'id': letters[i].letters[j].attr('id'),
                        'manuscript': letters[i].letters[j].data('manuscript'),
                        'manuscript_id': letters[i].letters[j].data('manuscript').manuscript_id,
                        'title': letters[i].letters[j].data('manuscript').title
                    };
                    region.letters.push(letter);
                }
                manuscripts_extracted.push(region);
            }
            return manuscripts_extracted;
        } else {
            return false;
        }
    },

    export_session_properties: function() {

        var create_toolbar = function() {
            _self.toolbar.init();
            if (_self.toolbar.exists()) {

                var toolbar = {
                    'position': _self.toolbar.toolbox.position()
                };

            } else {
                var toolbar = false;
            }

            return toolbar;
        };

        var letters = this.export_letters();

        var windowPosition = function() {
            return {
                'top': $(window).scrollTop(),
                'left': $(window).scrollLeft()
            };
        };

        var general_properties = {
            'toolbar': create_toolbar(),
            'comments': _self.comments.notes,
            'letters': letters,
            'window': windowPosition()
        };

        return general_properties;

    },

    create: function() {
        var images = this.exportImages();
        var image_properties = this.exportImagesProperties(images);
        var session_properties = this.export_session_properties();
        var session = {
            'session_file': true,
            'session_properties': session_properties,
            'image_properties': image_properties
        };
        return session;
    },

    main: function() {

        var data_session = _self.export.create();
        var item = $('#name_export').val();
        if (item != '') {
            if (localStorage.getItem(item) === null) {
                localStorage.setItem(item, JSON.stringify(data_session));
                var element = localStorage.getItem(item);
                _self.import.files.push([item, element]);

                if (_self.import.manager) {
                    _self.import.refreshView();
                }

                $('#export').fadeOut();
                $('#save').fadeIn();

                $.fn.notify({
                    'type': 'success',
                    'text': 'Session successfully saved',
                    'close-button': true,
                    "position": {
                        'top': "8%",
                        'left': '79%'
                    }
                });

            } else {

                $.fn.notify({
                    'type': 'error',
                    'text': 'The name chosen already exists. Please try again',
                    'close-button': true,
                    "position": {
                        'top': "8%",
                        'left': '79%'
                    }
                });

            }
        } else {

            $.fn.notify({
                'type': 'error',
                'text': 'Insert a valid name to save this session',
                'close-button': true,
                "position": {
                    'top': "8%",
                    'left': '79%'
                }
            });

        }

    }
};