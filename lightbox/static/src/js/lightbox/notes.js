this.comments = {
    _self: this,
    notes: [],
    open: false,
    openFolder: false,
    currentFolder: null,

    init: function(bool, image, content, title, image_id, size, position) {
        var comment_element = $('.comment');
        if (comment_element.length) {
            comment_element.focus();
        } else {
            var image_comment, comment;
            var body = $('body');
            if (bool) {
                image_comment = image_id;
                comment = this.make_comment(image_comment, image);
                body.append(comment);
                $('#' + image_comment).children('.comment_wrapper').children('.comment_content').html(content);
                $('#' + image_comment).data('id', image_id);
                $('#' + image_comment).data('image_note', image);

                $('#' + image_comment).children('.comment_wrapper').children('.commentTitle').val(title);
                $('#' + image_comment).animate({
                    'position': 'fixed',
                    'top': position.top,
                    'left': position.left,
                    'height': size.height,
                    'width': size.width
                }, 100);

            } else {
                image_comment = "note_" + image + '_' + uniqueid();
                comment = this.make_comment(image_comment, image);
                body.append(comment);
                title = $('#' + image).data('title');
                $('#' + image_comment).data('image_note', image);
                $('#' + image_comment).data('title', title);
            }

            $('#' + image_comment).draggable({
                handle: '.top_comment',
                cursor: 'move',
                stack: 'div',
                appendTo: 'body',
                zIndex: 1000
            }).resizable({
                maxHeight: 600,
                maxWidth: 700,
                minHeight: 300,
                minWidth: 350
            });

            this.buttons();

            $('#notes_alert').hide().html('');
        }
    },

    buttons: function() {

        $('.removeComment').click(function() {
            var notes = _self.comments.notes;
            var note = $(this).parent().parent('.comment');

            for (var i = 0; i < notes.length; i++) {
                for (var j = 0; j < notes[j].notes.length; j++) {
                    if (notes[i].notes[j].id == note.data('id')) {
                        _self.comments.notes[i].notes.splice(j, 1);
                        j--;
                    }
                }
            }

            if ($("#stickable_note_" + note.data('id')).length) {
                $("#stickable_note_" + note.data('id')).remove();
            }

            note.fadeOut().remove();
            var notes_alert = $('#notes_alert');
            if (!_self.comments.notes.length) {
                notes_alert.show().html("No notes created");
            } else {
                notes_alert.hide().html('');
            }

            _self.comments.update_notes();

            $.fn.notify({
                'text': 'Note successfully removed',
                'type': 'success',
                'close_button': true,
                "position": {
                    'top': '8%',
                    'left': '79%'
                }
            });

        });


        $('.minimizeNote').click(function() {
            _self.comments.minimizeNote($(this).parent().parent('.comment'));
            _self.comments.check_notes();
        });

        var state = function(command) {
            var result = document.queryCommandState(command);
            return result;
        };


        $('.comment_content').on('keyup', function() {

            if (state('bold')) {
                $('#bold').addClass('active');
            } else {
                $('#bold').removeClass('active');
            }

            if (state('italic')) {
                $('#italic').addClass('active');
            } else {
                $('#italic').removeClass('active');
            }

            if (state('underline')) {
                $('#underline').addClass('active');
            } else {
                $('#underline').removeClass('active');
            }

            if (state('underline')) {
                $('#underline').addClass('active');
            } else {
                $('#underline').removeClass('active');
            }

            if (state('insertUnorderedList')) {
                $('#list').addClass('active');
            } else {
                $('#list').removeClass('active');
            }

            if (state('formatBlock')) {
                $('#heading').addClass('active');
            } else {
                $('#heading').removeClass('active');
            }

        });

        $('#bold').on("click", function() {
            document.execCommand('bold', false, null);
        });

        $('#italic').on("click", function() {
            document.execCommand('italic', false, null);
        });

        $('#underline').on("click", function() {
            document.execCommand('underline', false, null);
        });

        $('#link').on("click", function() {
            var selected = document.getSelection();
            document.execCommand("insertHTML", false, "<a href='" + selected + "'>" + selected + "</a>");
        });

        $('#list').on('click', function() {
            document.execCommand("insertUnorderedList", false, null);
        });

        $('#heading').on('click', function() {
            document.execCommand("formatBlock", false, "<h3>");
        });


    },

    check_notes: function() {
        if (_self.select_group.imagesSelected.length == 1) {
            var image = _self.select_group.imagesSelected[0];
            var notes = _self.comments.notes;
            var createComment = $('#createComment');
            if (!$('#open_notes').length) {
                for (var i = 0; i < notes.length; i++) {
                    if (notes[i].image == image.attr('id')) {
                        var button = $("<button class = 'btn btn-sm btn-warning' id='open_notes'>Open notes</button>");
                        createComment.after(button.hide().fadeIn());
                        break;
                    }
                }
            }
            $('#open_notes').unbind().on('click', function() {
                _self.comments.open_notes(image);
            });
        }
    },

    minimizeNote: function(note_this) {
        var note_position = note_this.position();
        var note_content, note_title;
        if (note_this.hasClass('readable_comment')) {
            note_content = note_this.children('.readable_comment_wrapper').children('.readable_comment_content').html();
            note_title = note_this.children('.readable_comment_wrapper').children('.readable_comment_commentTitle').val();
        } else {
            note_content = note_this.children('.comment_wrapper').children('.comment_content').html();
            note_title = note_this.children('.comment_wrapper').children('.commentTitle').val();
        }
        var note_id = note_this.attr('id');
        var image_id = note_this.data('image_note');
        var title = note_this.data('title');

        var size = {
            "height": note_this.css('height'),
            "width": note_this.css('width')
        };

        var note = {
            'title': note_title,
            'content': note_content,
            'position': note_position,
            'id': note_id,
            'image': image_id,
            'image_title': title,
            'size': size
        };

        $('#stickable_note_' + note_id).html(note_content);

        var flag = false;

        for (var i = 0; i < this.notes.length; i++) {
            if (this.notes[i].image == image_id) {
                flag = false;
                break;
            } else {
                flag = true;
            }
        }


        // Updating notes into the window
        if (flag || !this.notes.length) {

            var image = {
                'image': note.image,
                'title': note.image_title,
                'notes': [note]
            };

            this.notes.push(image);

        } else {
            flag = false;
            outerloop: for (i = 0; i < this.notes.length; i++) {
                innerloop: for (var j = 0; j < this.notes[i].notes.length; j++) {
                    if (this.notes[i].notes[j].id == note_id) {
                        flag = false;
                        break outerloop;
                    } else {
                        flag = true;
                        break outerloop;
                    }
                }
            }
            if (flag) {
                for (i = 0; i < this.notes.length; i++) {
                    if (this.notes[i].image == image_id) {
                        this.notes[i].notes.push(note);
                        break;
                    }
                }
            } else {
                this.notes[i].notes[j].size = size;
                this.notes[i].notes[j].content = note_content;
                this.notes[i].notes[j].title = note_title;
                this.notes[i].notes[j].position = note_position;
            }

        }

        var notes_button_position;
        var notes_div = $('#notes');
        if (!this.open) {
            notes_button_position = {
                'top': $('#notes_button').position().top,
                'left': "2%"
            };
        } else {
            if (notes_div.find(".note:last-child").length) {
                var notes_last_child_position = notes_div.find(".note:last-child").position();
                notes_button_position = {
                    'top': notes_last_child_position.top,
                    'left': notes_last_child_position.left + 50
                };

            } else {

                notes_button_position = {
                    'top': notes_div.position().top,
                    'left': notes_div.position().left + 50
                };

            }
        }

        if (this.openFolder) {
            var note_2 = '';
            if (this.currentFolder == note.image) {
                note_2 += this.create_note(note.title, note.id, note.content);
            }

            $('#notes_container').append(note_2);
            _self.comments.events_on_notes();
        }

        note_this.animate({
            top: notes_button_position['top'],
            left: notes_button_position['left'],
            width: 0,
            height: 0,
            opacity: 0
        }, {
            duration: 250,
            complete: function() {
                $(this).hide().remove();
            }
        });

        this.update_notes();
    },

    make_comment: function(image, id_image) {
        var comment = "<div class='comment' id='" + image + "' data-image = '" + id_image + "'>";
        comment += "<div class='top_comment'>";
        comment += "<button class='btn btn-sm btn-danger removeComment' title='Delete Note'><span class='glyphicon glyphicon-remove'></span> Delete</button>";
        comment += "<div class='pull-right minimizeNote' title='Save note'><button class='btn btn-success btn-sm'><span style='font-weight:bold;color:white;cursor:pointer;' class='glyphicon glyphicon-ok'></span> Save</button></div></div>";
        comment += "<div class='comment_wrapper'>";
        comment += "<input class='commentTitle' class='hidden' placeholder='Title ...' />";
        comment += "<div class='comment_content' contenteditable></div>";
        comment += ' <div id="rich_buttons" class="btn-group" data-toggle="buttons-checkbox"><button type="button" id="bold" class="btn btn-sm" title="bold">B</button><button type="button" id="italic" class="btn btn-sm" title="italic">I</button><button type="button" id="underline" class="btn btn-sm" title="underline">U</button><button type="button" id="heading" class="btn btn-sm" title="heading"><span class="glyphicon glyphicon-header"></button><button type="button" id="link" class="btn btn-sm" title="link"><span class="glyphicon glyphicon-globe"></button><button type="button" id="list" class="btn btn-sm" title="list"><span class="glyphicon glyphicon-list"></button></div></div>';

        return comment;
    },

    makeReadableComment: function(image, id_image, title, content) {
        var comment = "<div class='readable_comment' id='" + image + "' data-image = '" + id_image + "' data-image_note = '" + id_image + "'>";
        comment += "<span class='pull-right minimizeNote' title='Minimize note' style='margin:2%;'><span style='font-weight:bold;color:#444;font-size:15px;cursor:pointer;margin:0.5%;' class='glyphicon glyphicon-remove'></span></span>";
        comment += "<div class='readable_comment_wrapper'>";
        comment += "<span class='readable_comment_commentTitle' class='hidden'>" + title + "</span>";
        comment += "<div class='readable_comment_content'>" + content + "</div></div</div>";
        return comment;
    },

    events_on_notes: function() {
        var notes = this.notes;
        $('.note .remove_comment_from_box').click(function() {
            var note = $(this).closest('.note');
            for (var i = 0; i < notes.length; i++) {
                for (var j = 0; j < notes[i].notes.length; j++) {
                    if (notes[i].notes[j].id == note.data('id')) {
                        _self.comments.notes[i].notes.splice(j, 1);
                        if ($("#stickable_note_" + note.data('id')).length) {
                            $("#stickable_note_" + note.data('id')).remove();
                        }
                        j--;
                    }
                }
            }
            $(note).stop().animate({
                position: "absolute",
                width: "0px",
                height: "0px",
                backgroundColor: "red",
                opacity: 0
            }, {
                duration: 300,
                complete: function() {
                    $(this).hide().remove();
                }
            });

            var notes_alert = $('#notes_alert');
            if (!notes.length) {
                notes_alert.fadeIn().html("No notes created");
                _self.comments.es();
            } else {
                notes_alert.hide().html('');
            }
            _self.comments.update_notes();
        });

        $('.edit_comment_from_box').unbind().click(function() {
            _self.comments.show_comment($(this));
        });

        $('.read_note').unbind().click(function() {
            _self.comments.read_note($(this));
        });

        $('.stick_to_workspace').on('click', function() {
            _self.comments.stick($(this));
        });
    },

    stick: function(note_button) {
        var notes = this.notes;
        var note = note_button.closest('.note');
        for (var i = 0; i < notes.length; i++) {
            for (var j = 0; j < notes[i].notes.length; j++) {
                if (notes[i].notes[j].id == note.data('id')) {
                    var id = notes[i].notes[j].id;
                    var image = notes[i].notes[j].image;
                    var title = notes[i].notes[j].title;
                    var content = notes[i].notes[j].content;
                    _self.comments.create_stickable_note(id, image, title, content);
                }
            }
        }
        _self.comments.hide_notes();
    },

    create_stickable_note: function(id, image, title, content) {
        var note = $('<span class="stickable_note" id="stickable_note_' + id + '" contenteditable>');
        var notes = this.notes;
        var contents = content;
        if (!$('#stickable_note_' + id).length) {
            note.data({
                'id': id,
                'image': image,
                'title': title
            }).append(content).draggable({
                alsoDrag: false,
                delay: 100
            }).on('click', function(event) {
                $(this).focus();
            }).on("dblclick", function(event) {

                var group, _image, i;

                if ($(this).hasClass("selected")) {
                    if ($(this).data('group') && $(this).data('group').length) {
                        group = $(this).data('group');
                        for (i = 0; i < group.length; i++) {
                            _image = $("#" + group[i]);
                            _self.select_group.deselect(_image);
                        }
                    }
                    if ($(this).data('group_notes') && $(this).data('group_notes').length) {
                        group = $(this).data('group_notes');
                        for (i = 0; i < group.length; i++) {
                            _image = $("#" + group[i]);
                            _image.removeClass('selected');
                        }
                    }
                    $(this).removeClass("selected");
                    note.draggable({
                        delay: 100,
                        alsoDrag: false
                    });
                    $(this).blur();
                } else {
                    if ($(this).data('group') && $(this).data('group').length) {
                        group = $(this).data('group');
                        for (i = 0; i < group.length; i++) {
                            _image = $("#" + group[i]);
                            _self.select_group.select_image(_image);
                        }
                    }
                    if ($(this).data('group_notes') && $(this).data('group_notes').length) {
                        group = $(this).data('group_notes');
                        for (i = 0; i < group.length; i++) {
                            _image = $("#" + group[i]);
                            _image.addClass('selected');
                        }
                    }
                    $(this).addClass("selected");
                    note.draggable({
                        alsoDrag: ".selected",
                        delay: 100
                    });
                    $(this).focus();
                }
                _self.toolbar.refresh();
                event.stopPropagation();
            }).on('contextmenu', function() {
                return false;
            }).on("blur", function() {
                if (contents != $(this).html()) {
                    for (var i = 0; i < notes.length; i++) {
                        for (var j = 0; j < notes[i].notes.length; j++) {
                            if (notes[i].notes[j].id == id) {
                                notes[i].notes[j].content = $(this).html();
                            }
                        }
                    }
                    contents = $(this).html();
                }
            }).css({
                'top': $("#" + image).position().top,
                'left': $("#" + image).position().left
            }).resizable();
            $(_self.workspaceImages.workspace).append(note);
        }
    },

    hide_notes: function() {
        var notes_button = $('#notes_button');
        notes_button.show();
        var button_position = notes_button.position();
        $('#notes').animate({
            "top": $('#buttons').position().top + button_position['top'],
            'left': "2%",
            'width': "0%",
            'height': "0%",
            'opacity': 0
        }, {
            duration: 250,
            complete: function() {
                $(this).hide();

                notes_button.tooltip({
                    placement: 'right',
                    trigger: 'hover'
                });

                /*$('#notes_button').click(function(){
                            $.comments.show_notes()
                        });*/
            }
        });

        this.open = false;
    },

    create_note: function(title, id, content) {
        var notes_html = "<div class = 'note' data-id = '" + id + "'><p style='padding:0' class='note_box_title col-lg-9 col-lm-9 col-xs-9'>" + title + "</p>";
        notes_html += "<span title='Edit Note' class='glyphicon glyphicon-pencil edit_comment_from_box'></span> ";
        notes_html += "<span title='Stick to workspace' class='glyphicon glyphicon-send stick_to_workspace'></span>";
        notes_html += " <span title='Delete Note' class='glyphicon glyphicon-remove remove_comment_from_box'></span></p><div class='note_box_content'>" + content + "</div></div>";
        return notes_html;
    },

    open_notes: function(image) {
        var folder = $("<div>");
        folder.data('image', image.attr('id'));
        folder.data('image_title', image.data('title'));
        if (this.open && !this.openFolder) {
            this.openFolder_notes(folder);
        } else if (this.open && this.openFolder && this.currentFolder == image.attr('id')) {
            return;
        } else {
            this.show_notes();
            this.openFolder_notes(folder);
        }
    },

    read_note: function(note_button) {
        var notes = this.notes;
        var note = note_button.parent().parent('.note');
        for (var i = 0; i < notes.length; i++) {
            for (var j = 0; j < notes[i].notes.length; j++) {
                if (notes[i].notes[j].id == note.data('id')) {
                    var id = notes[i].notes[j].id;
                    var image = notes[i].notes[j].image;
                    var title = notes[i].notes[j].title;
                    var content = notes[i].notes[j].content;
                    var position = notes[i].notes[j].position;
                    var size = notes[i].notes[j].size;
                    $(note).animate({
                        'top': position.top,
                        'left': position.left,
                        'width': size.width,
                        'height': size.height,
                        'opacity': 1
                    }, {
                        duration: 400,
                        complete: function() {
                            $(this).hide();
                            var comment = _self.comments.makeReadableComment(id, image, title, content);
                            _self.selectors.body.append(comment);
                            $(".readable_comment").draggable().resizable().find(".minimizeNote").click(function() {
                                var comment_element = $(this).parent('.readable_comment');
                                _self.comments.minimizeNote(comment_element);
                            });
                        }
                    });
                }
            }
        }
    },

    show_comment: function(note_button) {
        if (!$('.comment').length) {
            var notes = this.notes;
            var note = note_button.closest('.note');
            for (var i = 0; i < notes.length; i++) {
                for (var j = 0; j < notes[i].notes.length; j++) {
                    if (notes[i].notes[j].id == note.data('id')) {
                        var id = notes[i].notes[j].id;
                        var image = notes[i].notes[j].image;
                        var title = notes[i].notes[j].title;
                        var content = notes[i].notes[j].content;
                        var position = notes[i].notes[j].position;
                        var size = notes[i].notes[j].size;
                        $(note).animate({
                            'top': position.top,
                            'left': position.left,
                            'width': size.width,
                            'height': size.height,
                            'opacity': 1
                        }, {
                            duration: 400,
                            complete: function() {
                                $(this).hide();
                                _self.comments.init(true, image, content, title, id, size, position);
                            }
                        });
                    }
                }
            }
        } else {

            $.fn.notify({
                'type': 'error',
                "close-button": true,
                "position": {
                    'top': "8%",
                    'left': '80%'
                },
                'text': 'A note window is already open on the workspace.'
            });
        }
    },

    openFolder_notes: function(image_note) {
        this.openFolder = true;
        this.currentFolder = image_note.data('image');
        var breadcrumb = $('<div>');
        var folder = image_note.data('image');
        var breadcrumb_notes = $('#breadcrumb_notes');
        var notes_alert = $('#notes_alert');
        var notes_container = $('#notes_container');
        breadcrumb.attr({
            'class': 'breadcrumb',
            'display': 'none',
            'id': 'breadcrumb_notes'
        }).css({
            'border-bottom': '1px solid #ddd'
        });
        if (!breadcrumb_notes.length) {
            $('#breadcrumb_notes_container').append(breadcrumb);
            var li = "<li><a class='link' id='to_notes'>Notes</a></li>";
            li += "<li class='active'>" + image_note.data('image_title') + "</li>";
            li += "<li class='pull-right no-before'><span style='cursor:pointer;' id='to_notes_icon' class='glyphicon glyphicon-arrow-left'></span></li>";
            breadcrumb.html(li).show();
        }

        $('#to_notes').click(function() {
            _self.comments.back_to_notes();
        });

        $('#to_notes_icon').click(function() {
            _self.comments.back_to_notes();
        });

        var note = '';

        for (var i = 0; i < this.notes.length; i++) {
            if (this.notes[i].image == image_note.data('image')) {
                for (var j = 0; j < this.notes[i].notes.length; j++) {
                    note += this.create_note(this.notes[i].notes[j].title, this.notes[i].notes[j].id, this.notes[i].notes[j].content);
                }
            }
        }

        notes_container.html(note);
        _self.comments.events_on_notes();
        if (!_self.comments.notes.length) {
            notes_alert.show().html("No notes created");
        } else {
            notes_alert.hide().html('');
        }

        $('.note_folders').fadeOut(100).remove();
    },

    back_to_notes: function() {
        $('#breadcrumb_notes').add('.note').hide().remove();
        this.openFolder = false;
        this.currentFolder = null;
        $('#notes_container').html('');
        this.update_notes();
    },

    update_notes: function() {
        var notes = this.notes;
        var folders = $('.note_folders');
        if (!this.openFolder) {
            for (var i = 0; i < notes.length; i++) {
                var id = $(folders[i]).data('image');
                if (notes[i].image != id) {
                    var folder = $("<div class='note_folders col-lg-3'><img src='/static/img/folder-documents.png' /><span class='note_folders_title'></span></div>");
                    folder.data('image', notes[i].image);
                    folder.data('image_title', notes[i].title);
                    folder.children('span').html(notes[i].title);
                    $('#notes_container').append(folder);
                    folder.click(function() {
                        _self.comments.openFolder_notes($(this));
                    });
                }
            }
        }
        this.clean_notes_array();
        this.check_notes();
    },

    show_notes: function() {
        var button_position = $('#notes_button').position();
        $('#notes').css({
            "top": $('#buttons').position().top + button_position.top,
            'left': "2%"
        }).show().animate({
            "top": "5%",
            'left': "20%",
            'width': "60%",
            'height': "90%",
            'opacity': 1,
            'z-index': 400
        }, {
            duration: 250,
            complete: function() {
                $('#notes_button').hide();
                //$('#notes_container').sortable();
                $('#notes_button').tooltip({
                    placement: 'right',
                    trigger: 'hover'
                });

                $('#close_notes').click(function() {
                    _self.comments.hide_notes();
                });
            }
        }).draggable({
            handle: '.top_box'
        });

        if (!_self.comments.notes.length) {
            $('#notes_alert').fadeIn().html("No notes created");
        } else {
            $('#notes_alert').fadeOut().html('');
        }

        this.open = true;

    },

    clean_notes: function() {
        $('.note').remove();
        this.notes = [];
    },

    clean_notes_array: function() {
        var notes = this.notes;
        var flag = false;

        for (var i = 0; i < notes.length; i++) {
            if (!notes[i].notes.length) {

                if (notes[i].image == _self.select_group.imagesSelected[0].attr('id')) {
                    $('#open_notes').fadeOut(300).remove();
                }
                flag = true;

                $('.note_folders').data('image', notes[i].image).remove();
                _self.comments.notes.splice(i, 1);
                i--;

            } else {
                flag = false;
            }
        }
        if (flag) {

            if (this.openFolder) {
                this.back_to_notes();
            }

        }

    }

};