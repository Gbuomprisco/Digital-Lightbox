this.is_selected = function() {
    if (typeof $selectedImage != "undefined" && $(this).attr('id') == $selectedImage.attr('id')) {
        return true;
    } else {
        return false;
    }
};

this.images_on_workspace = function() {
    var images = $('.image_active');
    return images;
};

this.init = function() {
    _self = this;

    _self.menu.init();
    _self.imagesBox.init(); // Launch window images function

    _self.export.init();
    _self.import.init();
    _self.keyboardEvents.init();

    Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };


    // Changes XML to JSON

    var images_on_minimap = [];

    // Check if the image is selected


    // Get the images on workspace


    $('#buttons *[data-toggle="tooltip"]').tooltip({
        placement: 'right',
        trigger: 'hover'
    });

    $('#topbar *[data-toggle="tooltip"]').tooltip({
        placement: 'bottom',
        container: 'body',
        trigger: 'hover'
    });

    $('#marker').draggable({
        scroll: false,
        opacity: 0.5,
        cursor: 'move',
        containment: $('#overview'),
        appendTo: 'body',
        revert: 'invalid'
    });


    $(window).scroll(function(event) {
        var position = {
            'top': $(window).scrollTop() / $(document).height() * 180,
            'left': $(window).scrollLeft() / $(document).width() * 250
        };
        $('#marker').animate({
            'left': position['left'],
            'top': position['top']
        }, 0);
    });


    $('#notes_button').click(function() {
        _self.comments.show_notes();
        if (_self.comments.openFolder) {
            _self.comments.back_to_notes();
        }
    });

    $('#letters_button').click(function() {
        _self.letters.open_lettersbox();
    });

    var zoom_in = $('#zoom_in');
    var zoom_out = $('#zoom_out');
    var move_left = $("#move_left");
    var move_right = $("#move_right");
    var counter_zoom = $('#counter_zoom');
    var zoom_value = 1;
    var workspaces = $('.workspace');
    var switchers = $('.workspace-switcher');
    var isWebkit = 'WebkitAppearance' in document.documentElement.style;
    $(_self.workspaceImages.workspace).fadeIn(50);

    function zoom(arg, event, value) {

        if (arg == 'in') {
            zoom_value += value;
        } else {
            zoom_value -= value;
        }
        var workspace = $(_self.workspaceImages.workspace);
        if (document.body.style.webkitFilter !== undefined) {
            workspace.animate({
                "zoom": zoom_value
            }, 400, function() {
                _self.selectors.html.add(_self.selectors.body).animate({
                    left: zoom_value * _self.selectors.body.position().left,
                    top: zoom_value * _self.selectors.body.position().top
                }, 0);
            });
        } else {

            workspace.css({
                "-moz-transform": "scale(" + zoom_value + ")",
                "-moz-transform-origin": "50% 100%",
                "-o-transform": "scale(" + zoom_value + ")",
                "-o-transform-origin": "50% 100%",
                "-ms-transform": "scale(" + zoom_value + ")",
                "-ms-transform-origin": "50% 100%"
            });

            var val_sx = _self.selectors.body.position().left;
            var val_top = _self.selectors.body.position().top;

            _self.selectors.html.add(_self.selectors.body).animate({
                left: val_sx - (zoom_value * 100),
                top: val_top - (zoom_value * 100)
            }, 0);
        }

        counter_zoom.fadeIn().html(Math.floor(zoom_value * 100) + '%' + " <span class='caret'></span>");

    }

    function move(direction, val) {
        var value;
        var sx = $(window).scrollLeft();

        if (direction == 'dx') {
            value = sx + val;
        } else {
            value = sx - val;
        }

        _self.selectors.html.animate({
            scrollLeft: value
        }, 350);

        _self.selectors.body.animate({
            scrollLeft: value
        }, 350);

    }

    zoom_in.click(function(event) {
        if (!$(this).data('disabled')) {
            zoom('in', event, _self.defaults.toolbar.zoomIn);
        }
    });

    zoom_out.click(function(event) {
        if (!$(this).data('disabled')) {
            zoom('out', event, _self.defaults.toolbar.zoomOut);
        }
    });

    move_left.click(function(event) {
        move('sx', _self.defaults.toolbar.moveLeft);
    });

    move_right.click(function(event) {
        move('dx', _self.defaults.toolbar.moveRight);
    });

    zoom_in.add(zoom_out).add(move_left).add(move_right).dblclick(function(event) {
        event.stopPropagation();
    });

    var windows_flag = 0;

    var workspace_button = $('#workspace');

    function restore_window() {

        //zoom_in.add(zoom_out).add(move_left).add(move_right).css("color", "#000");

        //workspaces.each(function() {
        //$(this).attr("style", {});
        //});
        $('#container').css('background', 'background-color: #444');
        workspaces.css({
            'background': '#444',
            'display': 'none',
            "overflow": "visible"
        });
        $(_self.workspaceImages.workspace).css("display", "block");

        workspaces.animate({
            'zoom': zoom_value,
            "background": "#444"
        }, 150).css({
            'margin': '0',
            '-moz-transform': 'none',
            '-ms-transform': 'none',
            '-o-transform': 'none'
        }).removeClass('toggle');

        $('#container').css({
            'background': '#444',
            'padding': 0
        });

        $('#overview').show();

        $("html, body").css('background', '#444');

        windows_flag = 0;
        counter_zoom.fadeIn().html(Math.floor(zoom_value * 100) + '%' + " <span class='caret'></span>");

        var images = $(".image_active");
        $.each(images, function() {
            var id = $(this).attr('id');
            if (_self.workspaceImages.workspace != $(this).data('workspace')) {
                $("#" + _self.minimap.namespace + id).css({
                    'display': 'none'
                });
            } else {
                $("#" + _self.minimap.namespace + id).css({
                    'display': 'block'
                });
            }
        });

        if (!isWebkit) {
            $('#workspace1').removeClass('workspace-absolute-1');
            $('#workspace2').removeClass('workspace-absolute-2');
            $('#workspace3').removeClass('workspace-absolute-3');
            $('#workspace4').removeClass('workspace-absolute-4');
        }

        switchers.removeClass('active');
        $('[data-id="' + _self.workspaceImages.workspace + '"]').addClass('active');
        $('#zoom_in').add('#zoom_out').data('disabled', false).removeClass('disabled');
        //workspaces.selectable("enable");
        _self.menu.show();
    }

    uniqueid = function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    workspace_button.on('click', function() {
        //workspaces.selectable("disable");
        if (!windows_flag) {

            var set_size = $('#set_size');
            var zoom_value = (100 / workspaces.length - 3) * 2;
            workspaces.css({
                "display": "block",
                'background-color': '#666',
                'margin': '0.1%',
                'margin-top': "0",
                "overflow": "hidden",
                "-moz-transform": "scale(" + zoom_value / 100 + ")",
                "-moz-transform-origin": "0 0",
                "-o-transform": "scale(" + zoom_value / 100 + ")",
                "-o-transform-origin": "0 0",
                "-ms-transform": "scale(" + zoom_value / 100 + ")",
                "-ms-transform-origin": "0 0"
            }).animate({
                'zoom': zoom_value + '%',
                "width": $(window).width(),
                "height": $(window).height()
            }, 100).addClass('toggle');
            windows_flag = 1;

            if (!isWebkit) {
                $('#workspace1').addClass('workspace-absolute-1');
                $('#workspace2').addClass('workspace-absolute-2');
                $('#workspace3').addClass('workspace-absolute-3');
                $('#workspace4').addClass('workspace-absolute-4');
            }

            set_size.attr('disabled', true).addClass('disabled');
            _self.selectors.body.css('width', 'auto');
            _self.selectors.html.css('width', 'auto');
            $('#container').css({
                'background': 'rgba(0, 0, 0, 0.6)',
                'padding-left': '8%',
                "padding-top": '4%'
            });
            $('#overview').hide();
            $("html, body").css('background', '#000');
            //zoom_in.add(zoom_out).add(move_left).add(move_right).css("color", "#fff");
            _self.menu.hide();

            $('.toggle').unbind('click').on('click', function(e) {
                if (_self.workspaceImages.workspace !== "#" + $(this).attr('id')) {
                    var images = $(_self.workspaceImages.workspace).find('.image_active.selected');
                    images.each(function() {
                        _self.select_group.deselect($(this));
                    });
                    _self.toolbar.refresh();
                }
                _self.workspaceImages.workspace = "#" + $(this).attr('id');

                restore_window();
                set_size.attr('disabled', false).removeClass('disabled');
            });

            $('#zoom_in').add('#zoom_out').data('disabled', true).addClass('disabled');
        } else {
            restore_window();
        }
    });

    if (!_self.defaults.development) {
        document.onmousedown = disableclick;
    }

    function disableclick(event) {
        $(document).on('contextmenu', function() {
            return false;
        });

        if (event.button == 2) {
            return false;
        }
    }

    function handleFiles(files) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = onFileReadComplete;
        reader.readAsText(file);
    }

    if (_self.utils.getParameter('images').length || _self.utils.getParameter('annotations').length) {
        _self.loadExternalImages.init('images');
        _self.loadExternalImages.init('annotations');
        _self.imagesBox.hide();
    }

    var window_width = $(document).width();
    var window_height = $(document).height();
    workspaces.css({
        "width": $(window).width() * 2,
        "height": $(window).height() * 2
    });
    $(document).on('resize', function() {
        $(_self.workspaceImages.workspace).css({
            "width": $(this).width(),
            "height": $(this).height()
        });
    });

    var overview = $('#overview');

    overview.css({
        'height': (window_height / 7.5),
        'width': (window_width / 190)
    });

    var requestRunning = false;

    overview.click(function(event) {
        event.stopPropagation();

        if (requestRunning) { // don't do anything if an AJAX request is pending
            return;
        }

        requestRunning = true;
        var body = _self.selectors.body;
        var x = (event.offsetX || event.clientX - $(event.target).position().left);
        var y = (event.offsetY || event.clientY - $(event.target).position().top);
        var top = (y / $(this).height()) * 100;
        var left = (x / $(this).width()) * 100;
        var scrollLeft = ((body.width() / 100) * left) - 100;
        var scrollTop = ((body.height() / 100) * top) - 100;

        _self.selectors.body.animate({
            scrollLeft: scrollLeft,
            scrollTop: scrollTop
        }, 800);

        _self.selectors.html.animate({
            scrollLeft: scrollLeft,
            scrollTop: scrollTop
        }, 800);

        var pointer = $('<div>');
        pointer.addClass('pointer');

        pointer.css({
            position: 'absolute',
            left: x,
            top: y
        });

        $(this).append(pointer);

        setTimeout(function() {
            pointer.remove();
        }, 1000);

        requestRunning = false;
    });

    switchers.on('click', function() {
        var workspace = $(this).data('id');
        switchers.removeClass('active');
        $(this).addClass('active');
        var images = $(_self.workspaceImages.workspace).find('.image_active.selected');
        images.each(function() {
            _self.select_group.deselect($(this));
        });
        _self.toolbar.refresh();
        if (workspace !== _self.workspaceImages.workspace) {
            workspaces.css('display', 'none');
            $(workspace).fadeIn(100);
            _self.selectors.body.animate({
                scrollLeft: $(_self.workspaceImages.workspace).position().left,
                scrollTop: $(_self.workspaceImages.workspace).position().top
            }, 200, function() {
                _self.workspaceImages.workspace = workspace;
            });
            workspaces.selectable({
                selected: function(event, ui) {
                    if ($(ui.selected).hasClass('image_active') && !$(ui.selected).hasClass('selected')) {
                        _self.select_group.select_image($(ui.selected));
                    }
                }
            });
        }
    });

    switchers.droppable({
        accept: ".selected",
        activeClass: "ui-state-hover",
        hoverClass: "ui-state-active",
        drop: function(event, ui) {
            for (var i = 0; i < _self.select_group.imagesSelected.length; i++) {
                $($(this).data('id')).append(_self.select_group.imagesSelected[i]);
            }
            _self.toolbar.deselectAll();
            $(this).removeClass('switcher-drop');
            var workspace = $(_self.workspaceImages.workspace);
            if (!workspace.find('.image_active').length) {
                $(this).trigger('click');
            }
        },
        over: function() {
            $(this).data('original-title', 'Move images to Workspace' + $(this).data('index'));
            $(this).addClass('switcher-drop');
        },
        out: function() {
            $(this).data('original-title', 'Go to Workspace ' + $(this).data('index'));
            $(this).removeClass('switcher-drop');
        }
    });

    workspaces.on('dblclick', function(event) {
        if (!_self.crop.active) {
            _self.toolbar.deselectAll();
        }
        $('.stickable_note').removeClass('selected');
        event.stopPropagation();
    });


    $('#load_image').unbind().on('change', function(e) {
        _self.letters.import_image(e);
    });



    $('.zoom-button').on('click', function() {
        var zoom = $(this).data('zoom');
        if (document.body.style.webkitFilter !== undefined) {
            $(_self.workspaceImages.workspace).animate({
                "zoom": zoom / 100
            }, 200);
        } else {
            $(_self.workspaceImages.workspace).css({
                "-moz-transform": "scale(" + zoom / 100 + ")",
                "-moz-transform-origin": "50% 100%",
                "-o-transform": "scale(" + zoom / 100 + ")",
                "-o-transform-origin": "50% 100%",
                "-ms-transform": "scale(" + zoom / 100 + ")",
                "-ms-transform-origin": "50% 100%"
            });
        }
        zoom_value = zoom / 100;
        $('#counter_zoom').html(zoom + '%' + " <span class='caret'></span>");
    });


    // creating csrf token for Django
    var csrftoken = _self.utils.getCookie('csrftoken');
    $.ajaxSetup({
        headers: {
            "X-CSRFToken": csrftoken
        }
    });

    $('#search').typeahead({
        source: array_pages
    });

    $("[data-toggle='tooltip']").tooltip();

    $('#back_to_digipal').on('click', function() {
        var url = _self.utils.getParameter('from');
        var UrlDigipal;
        if (!url.length) {
            UrlDigipal = "http://" + location.host;
            location.href = UrlDigipal;
        } else {
            var urlArray = url[0].split('/');
            urlArray[urlArray.length - 1] = (urlArray[urlArray.length - 1]);
            UrlDigipal = urlArray.join('/');
            location.href = "http://" + location.host + UrlDigipal;
        }
    });


    workspaces.selectable({
        selected: function(event, ui) {
            if ($(ui.selected).hasClass('image_active') && !$(ui.selected).hasClass('selected')) {
                _self.select_group.select($(ui.selected));
            }
            if ($(ui.selected).hasClass('stickable_note') && !$(ui.selected).hasClass('selected')) {
                $(ui.selected).addClass('selected');
            }
        },
        delay: 50
    });

    _self.toolbar.init();

};