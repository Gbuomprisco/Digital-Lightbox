/**
 * Application Toolbar object
 * @namespace toolbar
 */

this.toolbar = {

    _self: this,
    selectors: null,

    /**
     * Initializing the toolbar
     * @namespace init
     * @param {Object} options
     */

    init: function(options) {

        this.default_options = {
            'id': 'toolbar',
            'container': 'body'
        };

        $.extend(this.default_options, options);

        // Create the toolbar
        this.create(null, false);
    },

    /**
     * Checks if the toolbar has been initialized and exists in the DOM
     */

    exists: function() {
        return $('#toolbar').length;
    },

    is_visible: function() {
        return $('#toolbar').css('display') == 'block';
    },

    /**
     * Creates the toolbar
     * @namespace create
     * @param {Object} options
     * @param {Boolean} specifies whether the toolbar should be showed or not
     */
    create: function(options, show) {
        if (this.exists() && this.is_visible()) {
            return false;
        }
        if (!(this.exists()) && ($('.image_active').length) || !show) {
            _self.selectors.body.append('<div id="toolbar"></div>');
            this.toolbox = $('#toolbar');
            this.toolbox.dblclick(function(event) {
                event.stopPropagation();
                return false;
            });
            this.makeTools();
            if (show) {
                this.toolbox.show();
            }
        } else {
            console.warn('Toolbar not initialized, or no images on workspace');
            return false;
        }

    },


    /**
     * Disables all controls in the toolbar
     */

    disable: function() {

        $.each(this.selectors.sliders, function() {
            if (this.hasClass("ui-slider")) {
                this.slider('option', 'disabled', true);
            }

        });

        $.each(this.selectors.buttons, function() {
            this.attr('disabled', 'disabled');
        });

        //$('#toolbar button').addClass('disabled').attr('disabled', true);
        this.selectors.title.html("No images selected");
        this.selectors.buttons.crop_image.fadeOut();
        this.selectors.buttons.cropButton.removeClass('active');
        this.selectors.buttons.selectAll.attr('disabled', false).removeClass('disabled');
    },

    /**
     * Enables all toolbar controls
     */

    enable: function() {

        var excludes = ["group", "createComment", "compare_toolbar", "crop_button"];

        $.each(this.selectors.sliders, function() {
            this.slider('option', 'disabled', false);
        });

        $.each(this.selectors.buttons, function() {
            if (excludes.indexOf(this.attr('id')) < 0 && !this.hasClass("crop_button")) {
                this.attr('disabled', false).removeClass('disabled');
            }
        });

        //$('#toolbar button').removeClass('disabled').attr('disabled', false);

    },


    /**
     * Caches all selectors in the toolbar over the application
     */

    makeSelectors: function() {
        _self.toolbar.selectors = {
            sliders: {
                opacity: $('#slider'),
                brightness: $("#slider_brightness"),
                rotate: $('#slider_rotate'),
                size: $('#slider_size')
            },
            buttons: {
                grayscale: $('#grayscale'),
                invert: $('#invert'),
                contrast: $('#contrast'),
                createComment: $('#createComment'),
                crop_image: $('#crop_image'),
                compare: $('#compare_toolbar'),
                cropButton: $('.crop_button'),
                selectAll: $('#select_all'),
                deselectAll: $('#deselect_all'),
                alignButton: $('#align'),
                alignButtons: $('.align'),
                reset: $('#reset_image'),
                remove: $('#removeImage'),
                clone: $('#clone'),
                flipx: $('#flip-x'),
                flipy: $('#flip-y'),
                group: $('#group')
            },
            title: $('#name_image')
        };
    },

    /**
     * Loads toolbar template
     */

    makeTools: function() {
        this.toolbox.load('/static/js/tools_template.html', function() {
            _self.toolbar.makeSelectors();
            _self.toolbar.stylize();
            _self.toolbar.buttons();

            // Checks if the browser has a webkit engine or not
            if (document.body.style.webkitFilter === undefined) {
                _self.toolbar.selectors.buttons.contrast.remove();
            }
            _self.crop.init();
        });

    },

    /**
     * Opacity slider
     * Takes as slider DOM element the one selected as opacity selector
     */
    opacity: function() {
        var slider_opacity = this.selectors.sliders.opacity;
        slider_opacity.slider({
            disabled: true,
            slide: function(event, ui) {
                if (_self.images_on_workspace().length) {
                    var opacity = (ui.value / 100);
                    $.each(_self.select_group.imagesSelected, function() {
                        var mini_image = $("#" + _self.minimap.namespace + this.attr('id'));
                        this.find('img').css('opacity', opacity);
                        mini_image.css('opacity', opacity);
                    });
                }
            }
        });

    },

    /**
     * Brightness slider
     * Takes as slider DOM element the one selected as brightness selector
     */

    brightness: function() {
        var slider_brightness = this.selectors.sliders.brightness;
        slider_brightness.slider({
            min: 100,
            max: 300,
            disabled: true,
            value: 200,
            slide: function(event, ui) {
                $.each(_self.select_group.imagesSelected, function() {
                    if (_self.images_on_workspace().length) {
                        var mini_image = $("#" + _self.minimap.namespace + this.attr('id'));
                        if (document.body.style.webkitFilter !== undefined) {
                            this.css('-webkit-filter', 'brightness(' + ui.value / 2 + '%)');
                            mini_image.css('-webkit-filter', 'brightness(' + ui.value / 2 + '%)');
                        } else {
                            this.css('polyfilter', 'brightness(' + ui.value / 2 + '%)');
                            mini_image.css('-webkit-filter', 'brightness(' + ui.value / 2 + '%)');
                        }
                    }
                });
            }
        });
    },

    /**
     * Brightness slider
     * Takes as slider DOM element the one selected as rotate selector
     */

    rotate: function() {
        var slider_rotate = this.selectors.sliders.rotate;
        slider_rotate.slider({
            min: -180,
            max: 180,
            disabled: true,
            value: 0,
            step: 6,
            slide: function(event, ui) {
                $.each(_self.select_group.imagesSelected, function() {
                    var mini_image = $("#" + _self.minimap.namespace + this.attr('id'));
                    this.css('transform', 'rotate(' + ui.value + 'deg)');
                    mini_image.css('transform', 'rotate(' + ui.value + 'deg)');
                });
            }
        });
    },

    flip: function(button, direction) {

        var isActive = button.hasClass('active');
        var _class = 'flippedY';
        if (direction == 'x') {
            _class = 'flippedX';
        }
        $.each(_self.select_group.imagesSelected, function() {
            if (!isActive) {
                if (!$(this).find('img').hasClass(_class)) {
                    $(this).find('img').addClass(_class);
                }
            } else {
                $(this).find('img').removeClass(_class);
            }
        });

        if (isActive) {
            button.removeClass('active');
        } else {
            button.addClass('active');
        }
    },

    /**
     * Applies a given filter
     * @param button {JQuery DOM object} the button to trigger the function
     * @param filter {String} in ('grayscale', 'invert', 'contrast') as filter to be used
     */

    apply_filter: function(button, filter, toggle) {

        var imagesSelected = _self.select_group.imagesSelected;
        if (toggle !== undefined && !toggle) {
            $.each(imagesSelected, function() {
                var mini_image = $("#" + _self.minimap.namespace + this.attr('id'));
                this.find('img').removeClass(filter);
                mini_image.removeClass(filter);
                button.removeClass('active');
            });

        } else {
            if (!button.hasClass('active')) {
                $.each(imagesSelected, function() {
                    var mini_image = $("#" + _self.minimap.namespace + this.attr('id'));
                    if (!(this.find('img').hasClass(filter))) {
                        this.find('img').addClass(filter);
                        mini_image.addClass(filter);
                    }
                    button.addClass('active');
                });

            } else {
                $.each(imagesSelected, function() {
                    var mini_image = $("#" + _self.minimap.namespace + this.attr('id'));
                    if ((this.find('img').hasClass(filter))) {
                        this.find('img').removeClass(filter);
                        mini_image.removeClass(filter);
                    }
                    button.removeClass('active');
                });
            }
        }
    },

    /**
     * Set images size
     */
    size: function() {
        var slider_size = this.selectors.sliders.size;
        slider_size.slider({
            min: 10,
            max: 2000,
            disabled: true,
            value: 180,
            slide: function(event, ui) {
                $.each(_self.select_group.imagesSelected, function() {

                    var calc_width = ui.value;

                    this.children().css({
                        'width': calc_width
                    });

                    this.css({
                        'width': calc_width
                    });

                    this.find('img').css({
                        'width': calc_width
                    });

                    var position = this.offset();

                    if (position['top'] < $(window).scrollTop() || position['left'] < $(window).scrollLeft()) {
                        this.animate({
                            "top": $(window).scrollTop() + 100,
                            "left": $(window).scrollLeft() + 100
                        }, 150);
                    }

                    $("#" + _self.minimap.namespace + this.attr('id')).animate({
                        'width': parseInt(this.find('img').css('width')) / _self.minimap.width + "px",
                        'height': parseInt(this.find('img').css('height')) / _self.minimap.height + "px"
                    }, 10);

                });
            }
        });
        this.refreshSize();
    },

    /**
     * Compares two images selected
     */
    compare_toolbar: function() {
        var images = $('.selected');
        if (images.length == 2) {

            var image_src1 = $(images[0]).find('img');
            var image_src2 = $(images[1]).find('img');
            var images_urls = [image_src1.attr('src'), image_src2.attr('src')];

            $.ajax({
                type: 'POST',
                url: 'return_base64/',
                data: {
                    'images': JSON.stringify(images_urls)
                },

                success: function(data) {
                    var img1 = $("<img>");
                    var img2 = $("<img>");

                    img1.attr({
                        'src': data[0],
                        'id': 'image_compare1'
                    }).css({
                        'display': 'none'
                    });

                    img2.attr({
                        'src': data[1],
                        'id': 'image_compare2'
                    }).css({
                        'display': 'none'
                    });

                    _self.selectors.body.append(img1);
                    _self.selectors.body.append(img2);

                    var image1 = document.getElementById('image_compare1');

                    var image2 = document.getElementById('image_compare2');

                    /**
                     * Calls resemble library compare function
                     */
                    resemble(image1).compareTo(image2).onComplete(function(data) {
                        result = data;
                    }).ignoreAntialiasing();

                    img1.remove();
                    img2.remove();

                    _self.letters.show_comparison(result);
                }
            });

        } else {
            $.fn.notify({
                'type': 'error',
                "close-button": true,
                'text': 'Choice two images to compare.'
            });
        }
    },

    clone: function() {
        var id = uniqueid();
        var images = _self.select_group.imagesSelected;
        var workspace = _self.workspaceImages.workspace;
        for (var i = 0; i < images.length; i++) {
            var image = $(images[i]);
            var new_image = image.clone().attr('id', id);
            new_image.data('is_clone', true);
            new_image.data('title', image.data('title') + " (clone)");
            new_image.data('original', image.attr('id'));
            new_image.data('selected', false);
            new_image.removeClass('selected');
            new_image.css({
                'position': 'absolute',
                'left': image.position().left + image.find('img').css('width') + 10,
                'top': image.css('top')
            });
            new_image.find('img').unwrap().removeClass('ui-resizable');
            new_image.find('.ui-resizable-handle').remove();
            //new_image.find('.ui-wrapper').css('box-shadow', '0px 0px 10px 3px #444');
            //new_image.draggable(_self.workspaceImages.draggableOptions);
            _self.imagesBox.imagesSelected.push(new_image);
        }
        _self.imagesBox.to_workspace();
    },

    /**
     * Select all images with class .image_active
     */

    selectAll: function() {

        var images = $(_self.workspaceImages.workspace).find('.image_active');
        _self.select_group.imagesSelected = [];

        $.each(images, function() {

            $(this).addClass('selected');
            $(this).data('selected', true);
            $(this).draggable({
                alsoDrag: ".selected"
            });

            $(this).find('img').resizable({
                aspectRatio: true,
                animate: true,
                alsoResize: 'image_active.selected, image_active.selected > div, image_active.selected > div > img',
                resize: function(event, ui) {
                    if (_self.select_group.imagesSelected.length <= 1) {
                        $("#" + _self.minimap.namespace + ui.element.parent().attr('id')).animate({
                            'width': parseInt($(this).css('width')) / _self.minimap.width + "px"
                        }, 10);
                    } else {
                        $.each($('.selected'), function() {
                            $("#" + _self.minimap.namespace + $(this).attr('id')).animate({
                                'width': parseInt($(this).children().css('width')) / _self.minimap.width + "px",
                                'height': parseInt($(this).children().css('height')) / _self.minimap.height + "px"
                            }, 10);
                        });
                    }
                    _self.toolbar.refreshSize();
                    event.stopPropagation();
                    return false;
                }
            });
            $(this).find('.ui-wrapper').css('boxShadow', '0px 0px 30px rgba(255, 246, 9, 1)');
            _self.select_group.imagesSelected.push($(this));

        });

        var open_notes = $('#open_notes');
        if (open_notes.length) {
            open_notes.fadeOut().remove();
        }

        this.refresh();
        var create_comment_button = _self.toolbar.selectors.buttons.createComment;
        if (_self.select_group.imagesSelected.length == 1) {
            _self.toolbar.selectors.buttons.cropButton.removeClass('disabled');
            create_comment_button.removeClass('disabled').click(function() {
                var id = _self.select_group.imagesSelected[0].attr('id');
                _self.comments.init(false, id, false, false, false, false, false, false);
            });

            _self.comments.check_notes();

        } else {
            _self.toolbar.selectors.buttons.cropButton.addClass('disabled');
            create_comment_button.addClass('disabled');
            open_notes.fadeOut().remove();
        }
    },

    /**
     * Deselects all images with class .image_active
     */
    deselectAll: function() {
        var images = $(_self.workspaceImages.workspace).find('.image_active.selected');

        $.each(images, function() {
            _self.select_group.deselect($(this));
        });

        $('#open_notes').fadeOut().remove();
        this.refresh();
    },

    /**
     * Resets all images selected through select_group Class
     */
    reset: function() {
        $.each(_self.select_group.imagesSelected, function() {

            var mini_image = $("#" + _self.minimap.namespace + this.attr('id'));
            var size = this.data('size').split(',');

            var width = '180px';
            var height = 'auto';

            if (this.data('external')) {
                width = this.data('size').split(',')[0] / 2;
                height = this.data('size').split(',')[1] / 2;
            }

            this.children().css({
                'width': width,
                'height': "auto"
            });

            if (document.body.style.webkitFilter !== undefined) {

                this.css({
                    'width': width,
                    'height': height,
                    '-webkit-transform': "rotate(0deg)",
                    'transform': "rotate(0deg)",
                    '-webkit-filter': 'brightness(100%)'
                });

            } else {

                this.css({
                    'width': width,
                    'height': height,
                    '-moz-transform': "rotate(0deg)",
                    '-o-transform': "rotate(0deg)",
                    '-ms-transform': "rotate(0deg)",
                    'transform': "rotate(0deg)",
                    'polyfilter': 'brightness(100%)'
                });

            }

            this.find('img').css({
                'width': width,
                'height': height,
                '-webkit-transform': "rotateX(0deg) rotateY(0deg)",
                '-moz-transform': "rotateX(0deg) rotateY(0deg)",
                '-o-transform': "rotateX(0deg) rotateY(0deg)",
                '-ms-transform': "rotateX(0deg) rotateY(0deg)",
                'transform': "rotateX(0deg) rotateY(0deg)",
                'opacity': 1
            });

            var position = this.offset();

            if (position['top'] < $(window).scrollTop() || position['left'] < $(window).scrollLeft()) {
                this.animate({
                    "top": $(window).scrollTop() + 100,
                    "left": $(window).scrollLeft() + 100
                }, 150);
            }

            $("#" + _self.minimap.namespace + this.attr('id')).animate({
                'width': parseInt(this.find('img').css('width')) / 40 + "px",
                'height': parseInt(this.find('img').css('height')) / 30 + "px"
            }, 10);

            _self.toolbar.selectors.buttons.grayscale.prop('checked', false);

        });

        this.refresh();
        this.refreshSize();
        this.apply_filter(_self.toolbar.selectors.buttons.grayscale, 'grayscale', false);
        this.apply_filter(_self.toolbar.selectors.buttons.invert, 'invert', false);
        this.apply_filter(_self.toolbar.selectors.buttons.contrast, 'contrast', false);

    },

    /**
     * Set toolbar's class and makes it draggable
     */

    stylize: function() {

        this.toolbox.addClass('box').draggable({
            stack: '.box',
            cursor: "move",
            appendTo: 'body'
        });

    },

    /**
     * Shows the toolbar
     */

    show: function() {

        var button_toolbar = $('#button_toolbar');
        button_toolbar.tooltip('hide').fadeOut().remove();
        if (!this.last_style) {
            this.last_style = this.toolbox.css(['top', 'left', 'width', 'height', 'opacity']);
        }
        this.toolbox.show().animate({
            "top": this.last_style['top'],
            'left': this.last_style['left'],
            'width': this.last_style['width'],
            'height': this.last_style['height'],
            'opacity': this.last_style['opacity']
        }, 250);

    },

    /**
     * Hides the toolbar
     */

    hide: function() {

        var buttons = $('#buttons');
        if (!$('#button_toolbar').length) {
            buttons.prepend("<div data-toggle='tooltip' data-placement='right' data-container='body' title='Tools' id='button_toolbar' class='glyphicon glyphicon-cog'></div>");
        }
        var button_toolbar = $('#button_toolbar');

        this.last_style = this.toolbox.css(['top', 'left', 'width', 'height', 'opacity']);

        this.toolbox.animate({
            position: 'absolute',
            top: buttons.position().top + 30,
            left: "2%",
            width: 0,
            height: 0,
            opacity: 0
        }, {
            duration: 250,
            complete: function() {
                $(this).hide();
                button_toolbar.tooltip({
                    placement: 'right',
                    trigger: 'hover'
                }).click(function() {
                    _self.toolbar.show();
                });
            }
        });

    },

    /**
     * Attaches events to buttons
     */

    buttons: function() {

        $('#closeToolbar').click(function() {
            _self.toolbar.hide($(this));
            this.is_hidden = true;
        });

        this.selectors.buttons.reset.click(function() {
            _self.toolbar.reset();
        });

        this.selectors.buttons.grayscale.click(function() {
            _self.toolbar.apply_filter($(this), 'grayscale');
        });

        this.selectors.buttons.invert.click(function() {
            _self.toolbar.apply_filter($(this), 'invert');
        });

        if (document.body.style.webkitFilter !== undefined) {
            this.selectors.buttons.contrast.click(function() {
                _self.toolbar.apply_filter($(this), 'contrast');
            });
        }

        this.selectors.buttons.alignButtons.click(function() {
            _self.align.align($(this).text());
        });

        this.selectors.buttons.compare.click(function() {
            _self.toolbar.compare_toolbar();
        });

        this.selectors.buttons.remove.click(function() {

            $.each(_self.select_group.imagesSelected, function() {
                $("#" + _self.minimap.namespace + $(this).attr('id')).remove();
                _self.toolbar.disable();
                $(this).remove();
            });

            _self.select_group.imagesSelected = [];

            var toolbar_popover = $('#toolbar .popover');
            if (toolbar_popover.length) {
                toolbar_popover.remove();
            }
        });

        this.selectors.buttons.crop_image.click(function(e) {
            _self.crop.get_image();
        });

        this.selectors.buttons.selectAll.click(function() {
            _self.toolbar.selectAll();
        });


        $('#clone').click(function() {
            _self.toolbar.clone();
        });

        this.selectors.buttons.deselectAll.click(function() {
            _self.toolbar.deselectAll();
        });

        this.selectors.buttons.flipx.click(function() {
            _self.toolbar.flip($(this), 'x');

        });

        this.selectors.buttons.flipy.click(function() {
            _self.toolbar.flip($(this), 'y');

        });

        this.selectors.buttons.group.click(function() {
            _self.select_group.group();
        });

        this.selectors.buttons.createComment.click(function() {
            var id = _self.select_group.imagesSelected[0].attr('id');
            _self.comments.init(false, id, false, false, false, false, false, false);
        });

        this.opacity();
        this.brightness();
        this.rotate();
        this.size();

    },

    /**
     * Refresh toolbar sliders according to images' size
     */

    refreshSize: function() {
        var size;
        if (_self.select_group.imagesSelected.length) {
            $.each(_self.select_group.imagesSelected, function() {
                size = parseInt(this.find('img').css('width'));
            });
            this.selectors.sliders.size.slider('option', 'value', (size));
        }
    },

    /**
     * Refreshes toolbar according to images
     */

    refresh: function() {
        var images_group = $('#images_group');
        images_group.popover('destroy');
        if (!this.selectors) {
            this.makeSelectors();
        }
        $.each(_self.select_group.imagesSelected, function(index, value) {
            var features = function() {

                var image = {};

                String.prototype.getNums = function() {
                    var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
                        mapN = this.match(rx) || [];
                    return mapN.map(Number);
                };

                var get_rotation = function(matrix) {
                    var angle;
                    if (matrix !== 'none') {
                        var values = matrix.split('(')[1].split(')')[0].split(',');
                        var a = values[0];
                        var b = values[1];
                        angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                    } else {
                        angle = 0;
                    }
                    return (angle < 0) ? angle += 360 : angle;
                };

                var name_image;
                var name_image_element = _self.toolbar.selectors.title;
                if (_self.images_on_workspace().length) {
                    name_image = value.data('title');
                    if (_self.select_group.imagesSelected.length > 1) {

                        image['name'] = "<span id='images_group'>" + _self.select_group.imagesSelected.length + " images selected</span>";

                        name_image_element.html(image['name']);

                        $('#images_group').popover({
                            trigger: 'click',
                            placement: 'right',
                            title: 'Images selected',
                            container: '#toolbar',
                            html: true,
                            content: function() {
                                var s = '';
                                $.each(_self.select_group.imagesSelected, function() {
                                    var position = this.offset();
                                    var top = position.top;
                                    var left = position.left;

                                    var title = function(title) {
                                        if (title.length > 25) {
                                            return title.substr(0, 25) + '...';
                                        } else {
                                            return title;
                                        }
                                    };

                                    s += "<p data-image = '" + this.attr('id') + "'";
                                    s += "class='images_selected row-fluid'>";
                                    s += "<span data-coords = " + top + "," + left + " class = 'title-image-selected col-lg-9'";
                                    s += " title = 'Go to " + this.data('title') + "'>" + title(this.data('title')) + "</span>";
                                    s += " <span data-image = " + this.attr('id') + " title='Hide Image' class='icons-tool col-lg-1 hide-image glyphicon glyphicon-eye-close'></span> <span data-image = '" + this.attr('id') + "'";
                                    s += "title='Delete Image' class='icons-tool col-lg-1 delete-image glyphicon glyphicon-trash'></span></p>";
                                });
                                return s;
                            }

                        });

                        $('#images_group').on('shown.bs.popover', function() {
                            $('.images_selected .title-image-selected').click(function() {
                                var coords = $(this).data('coords').split(',');
                                $('html, body').animate({
                                    scrollTop: coords[0] - 100,
                                    scrollLeft: coords[1] - 100
                                }, 500);
                            });


                            function hide() {
                                var id = $(this).data('image');
                                $('#' + id).fadeOut();
                                $(this).removeClass('glyphicon-eye-close');
                                $(this).removeClass('hide-image');
                                $(this).addClass('glyphicon-eye-open');
                                $(this).attr('title', 'Show Image');
                                $(this).addClass('show-image');
                                $(this).unbind();
                                $(this).on('click', show);
                            }

                            function show() {
                                var id = $(this).data('image');
                                $('#' + id).fadeIn();
                                $(this).removeClass('glyphicon-eye-open');
                                $(this).removeClass('show-image');
                                $(this).addClass('glyphicon-eye-close');
                                $(this).attr('title', 'Hide Image');
                                $(this).addClass('hide-image');
                                $(this).unbind();
                                $(this).on('click', hide);
                            }

                            $('.hide-image').on('click', hide);

                            $('.title-image-selected').hover(function() {
                                var id = $(this).parent().data('image');
                                $("#" + _self.minimap.namespace + id).animate({
                                    "box-shadow": "0px 0px 8px red"
                                }, 50);
                            });

                            $('.images_selected').mouseout(function() {
                                var id = $(this).data('image');
                                $("#" + _self.minimap.namespace + id).animate({
                                    "box-shadow": "0px 0px 2px #444"
                                }, 50);
                            });

                            $('.delete-image').click(function() {
                                var id = $(this).data('image');
                                $('#' + id).fadeOut().remove();
                                var imagesSelected = _self.select_group.imagesSelected;
                                for (var i = 0; i < imagesSelected.length; i++) {
                                    if ($(imagesSelected[i]).attr('id') == id) {
                                        imagesSelected.splice(i, 1);
                                        i--;
                                    }
                                }

                                $("#" + _self.minimap.namespace + id).remove();
                                _self.toolbar.refresh();

                                if (_self.select_group.imagesSelected.length) {
                                    _self.toolbar.enable();
                                } else {
                                    _self.toolbar.disable();
                                }

                                var crop_button = $('.crop_button');
                                if (_self.select_group.imagesSelected.length == 1) {
                                    crop_button.removeClass('disabled');
                                } else {
                                    crop_button.addClass('disabled');
                                }

                                _self.comments.check_notes();
                            });
                        });
                    } else {

                        if (name_image !== undefined && name_image.length > 28) {
                            image['name'] = name_image.substr(0, 28) + '...';
                        } else {
                            image['name'] = name_image;
                        }

                        name_image_element.html(image['name']);
                        name_image_element.attr('title', name_image);

                    }

                    image['opacity'] = value.find('img').css('opacity') * 100;
                    image['rotate'] = get_rotation(value.css('transform'));
                    image['width'] = value.find('img').css('width');

                    if (value.find('img').hasClass('flippedX')) {
                        _self.toolbar.selectors.buttons.flipx.addClass("active");
                    }

                    if (value.find('img').hasClass('flippedY')) {
                        _self.toolbar.selectors.buttons.flipy.addClass("active");
                    }

                    if (value.find('img').hasClass('invert')) {
                        _self.toolbar.selectors.buttons.invert.addClass("active");
                    }

                    var brightness;
                    if (document.body.style.webkitFilter !== undefined) {

                        if (value.css('-webkit-filter') != "none") {
                            brightness = value.css('-webkit-filter').getNums() * 2 * 100;
                            image['brightness'] = brightness;
                        } else {
                            image['brightness'] = 200;
                        }

                    } else {
                        if (typeof document.getElementById(value.attr('id')).style.polyfilterStore != "undefined") {
                            brightness = document.getElementById(value.attr('id')).style.polyfilterStore.getNums();
                            image['brightness'] = brightness * 2;
                        } else {
                            image['brightness'] = 200;
                        }
                    }
                } else {
                    name_image = '';
                    image['opacity'] = 100;
                    image['brightness'] = 200;
                }
                return image;
            };

            var image = features();
            _self.toolbar.selectors.sliders.opacity.slider("option", "value", image['opacity']);
            _self.toolbar.selectors.sliders.brightness.slider("option", "value", image['brightness']);
            _self.toolbar.selectors.sliders.rotate.slider("option", "value", image['rotate']);
        });

        if (_self.select_group.imagesSelected.length == 1) {
            _self.toolbar.selectors.buttons.cropButton.removeClass('disabled').attr("disabled", false);
            _self.toolbar.selectors.buttons.createComment.removeClass('disabled').attr("disabled", false);
            _self.toolbar.selectors.buttons.group.addClass('disabled').attr("disabled", true);
            _self.comments.check_notes();

        } else {
            _self.toolbar.selectors.buttons.cropButton.addClass('disabled').attr("disabled", true);
            _self.toolbar.selectors.buttons.createComment.addClass('disabled').attr("disabled", true);
            $('#open_notes').fadeOut().remove();
        }

        if (_self.select_group.imagesSelected.length == 2) {
            _self.toolbar.selectors.buttons.compare.removeClass('disabled').attr('disabled', false);
        } else {
            _self.toolbar.selectors.buttons.compare.addClass('disabled').attr('disabled', true);
        }

        if (_self.select_group.imagesSelected.length >= 2 || (_self.select_group.imagesSelected.length &&
            $('.stickable_note.selected').length) || $('.stickable_note.selected').length >= 2) {
            _self.toolbar.selectors.buttons.group.removeClass('disabled').attr("disabled", false);
        } else {
            _self.toolbar.selectors.buttons.group.addClass('disabled').attr("disabled", true);
        }

        _self.toolbar.refreshSize();

        if (_self.select_group.imagesSelected.length) {
            _self.toolbar.enable();
        } else {
            _self.toolbar.disable();
        }

    }

};