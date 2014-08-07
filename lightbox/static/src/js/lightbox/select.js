this.select_group = {
    _self: this,

    imagesSelected: [],

    deselect: function(image) {
        image.find('.ui-wrapper').css('box-shadow', '0px 0px 10px 3px #444');
        image.removeClass('selected');
        image.data('selected', false);
        image.draggable({
            alsoDrag: false
        });
        image.find('img').resizable('destroy');
        for (var i = 0; i < this.imagesSelected.length; i++) {
            if ($(this.imagesSelected[i]).attr('id') == image.attr('id')) {
                this.imagesSelected.splice(i, 1);
                i--;
            }
        }
        _self.toolbar.refresh();
    },

    select_image: function(image) {
        image.addClass('selected');
        image.data('selected', true);
        image.draggable({
            alsoDrag: ".selected"
        });

        image.find('img').resizable({
            aspectRatio: true,
            animate: false,
            alsoResize: '.image_active.selected, .image_active.selected > div, .image_active.selected > div > img',
            handles: "n, e, s, w",
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
        _self.select_group.imagesSelected.push(image);
        image.find('.ui-wrapper').css('boxShadow', '0px 0px 30px rgba(255, 246, 9, 1)');
        _self.toolbar.refresh();
    },

    select: function(image) {
        var grouped = false;
        if (image.hasClass('selected')) {
            if (image.data('group') && image.data('group').length) {
                grouped = true;
                var group = image.data('group');
                for (var i = 0; i < group.length; i++) {
                    var _image = $('#' + group[i]);
                    this.deselect(_image);
                }
                this.deselect(image);
            } else {
                grouped = false;
                this.deselect(image);
            }

            if (image.data('group_notes') && image.data('group_notes').length) {
                grouped = true;
                var group = image.data('group_notes');
                for (var i = 0; i < group.length; i++) {
                    var _image = $('#' + group[i]);
                    _image.removeClass('selected');
                }
            }
        } else {
            grouped = false;
            _self.toolbar.create(null, true);
            if (image.data('group') && image.data('group').length) {
                grouped = true;
                var group = image.data('group');
                for (var i = 0; i < group.length; i++) {
                    var _image = $('#' + group[i]);
                    this.select_image(_image);
                }
                this.select_image(image);
            } else {
                this.select_image(image);
            }

            if (image.data('group_notes') && image.data('group_notes').length) {
                grouped = true;
                var group = image.data('group_notes');
                for (var i = 0; i < group.length; i++) {
                    var _image = $('#' + group[i]);
                    _image.addClass('selected');
                }
            }
            _self.toolbar.show();
        }

        if (grouped) {
            _self.toolbar.selectors.buttons.group.html('Ungroup').addClass('ungroup');
        } else {
            _self.toolbar.selectors.buttons.group.html('Group').removeClass('ungroup');
        }

        _self.toolbar.refresh();

    },

    group: function() {

        var notes = $('.stickable_note.selected');
        var groupList = [];
        var groupNotes = [];
        if (_self.toolbar.selectors.buttons.group.hasClass('ungroup')) {

            for (var i = 0; i < this.imagesSelected.length; i++) {
                this.imagesSelected[i].data('group', []).data('group_notes', []);
            }

            notes.each(function() {
                $(this).data('group', []).data('group_notes', []);
            });

            _self.toolbar.selectors.buttons.group.html('Group').removeClass('ungroup');
        } else {

            for (var i = 0; i < this.imagesSelected.length; i++) {
                groupList.push(this.imagesSelected[i].attr('id'));
            }

            notes.each(function() {
                groupNotes.push($(this).attr('id'));
            });

            for (var i = 0; i < this.imagesSelected.length; i++) {
                var image = this.imagesSelected[i];
                var image_id = image.attr('id');
                var group = image.data('group');
                var copyGroup = groupList.slice(0);

                copyGroup = copyGroup.filter(function(x) {
                    return x !== image_id;
                });

                image.data('group', copyGroup).data('group_notes', groupNotes);
            }

            notes.each(function() {
                $(this).data('group', groupList).data('group_notes', groupNotes);
            });

            _self.toolbar.selectors.buttons.group.html('Ungroup').addClass('ungroup');
        }
    }
};