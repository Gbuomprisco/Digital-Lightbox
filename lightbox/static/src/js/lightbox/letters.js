this.letters = {

    open: false,
    folderOpen: false,

    lettersSelected: [],

    regions: [],

    letters: $('.letter'),

    letters_div: $('#letters'),

    init: function(data) {

        this.buttons(data);

    },

    open_lettersbox: function() {
        var button_position = $('#letters_button').position();
        this.letters_div.css({
            'top': $('#buttons').position().top + button_position.top + 30,
            'left': "2%"
        });
        $('#letters_button').hide();
        this.letters_div.show().animate({
            "top": "5%",
            'left': "20%",
            'width': "60%",
            'height': "90%",
            'opacity': 1,
            'z-index': 400
        }, {
            duration: 250,
            complete: function() {
                $('#close_letters').unbind().click(function() {
                    _self.letters.hide_letters();
                });

                $('#compare_letters').unbind().click(function() {
                    var comparison = _self.letters.compare();
                    _self.letters.show_comparison(comparison);
                });

                $('#delete_letter').unbind().click(function() {
                    _self.letters.delete();
                });

                $('#load_xml').unbind().on('change', function(e) {
                    _self.letters.import_xml(e);
                });

                $('#export_xml').unbind().click(function() {
                    _self.letters.export_as_xml('xml');
                });

                $('#export_html').unbind().click(function() {
                    _self.letters.export_as_xml('html');
                });

                $('#add_letters').unbind().click(function() {
                    _self.letters.to_workspace();
                });


            }
        }).draggable({
            handle: '.top_box'
        });

        this.check_regions_length();

        this.open = true;
    },

    hide_letters: function() {
        $('#letters_button').show();
        var button_position = $('#letters_button').position();
        this.letters_div.animate({
            "top": button_position['top'],
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
        this.open = false;
    },

    updateLetters: function(data) {
        if (this.regions.length) {
            var manuscript_id = $(data).data('manuscript_id');
            if (!$(data).data('manuscript_id')) {
                manuscript_id = $(data).data('manuscript').id || $(data).data('manuscript').manuscript_id;
            }
            var flag = false;
            var letters = $(".letter");
            letters.unbind('click');
            var letters_container = $('#letters_container');
            for (var i = 0; i < this.regions.length; i++) {
                if (this.regions[i].id == manuscript_id) {
                    if ($(data).hasClass("letter")) {
                        this.regions[i].letters.push($(data));
                    }
                    if (this.folderOpen.status && this.folderOpen.manuscript ==
                        this.regions[i].id) {
                        var j = 0;
                        while (j < this.regions[i].letters.length) {
                            var letter = this.regions[i].letters[j];
                            letters_container.append(letter);
                            j++;
                        }
                    }
                    flag = true;
                }
            }
            if (!flag) {
                return false;
            }
            letters.click(function() {
                _self.letters.selectLetter($(this));
            });
            $('#export_xml').removeClass('disabled');
            $('#export_html').removeClass('disabled');
            return true;
        } else {
            $('#export_xml').removeClass('disabled');
            $('#export_html').removeClass('disabled');
            return false;
        }
    },

    check_regions_length: function() {
        if (_self.letters.regions.length) {
            $('#export_xml').removeClass('disabled');
            $('#export_html').removeClass('disabled');
        } else {
            $('#export_xml').addClass('disabled');
            $('#export_html').addClass('disabled');
        }
    },

    updateFolders: function(data) {
        var manuscript_title = $(data).data('manuscript');
        var manuscript_id = $(data).data('manuscript_id');
        var manuscript = $("<div>");
        manuscript.attr('class', 'manuscript_pack').addClass('col-md-2 col-sm-4');
        manuscript.attr('id', 'manuscript_' + manuscript_id);
        manuscript.data('title', manuscript_title);
        manuscript.append("<img src='/static/img/folder.png' />");
        manuscript.append("<div class='folder_title'>" + manuscript_title + "</div>");
        var is_selected = function() {
            if ($(data).data('selected')) {
                return true;
            } else {
                return false;
            }
        };
        var manuscripts = {
            'title': manuscript_title,
            'id': manuscript_id,
            'letters': []
        };
        this.regions.push(manuscripts);
        manuscript.data('manuscript', manuscripts);
        this.check_regions_length();
        return manuscript;
    },

    addLetter: function(data) {
        var manuscript_id = $(data).data('manuscript_id');
        var found = false;
        for (var j = 0; j < this.regions.length; j++) {
            if (this.regions[j].id == manuscript_id) {
                found = true;
            }
        }
        if (this.updateLetters(data) && found) {
            return false;
        } else {
            var manuscript = this.updateFolders(data);
            if (!this.folderOpen.status) {
                var letters_container = $('#letters_container');
                letters_container.append(manuscript);
            }
            this.init($(manuscript));
            this.updateLetters(data);
        }
    },

    update_regions_folders: function(update_window) {
        var regions = _self.letters.regions;
        var data, manuscript, manuscript_id, manuscript_title, manuscript_data;
        var letters_container = $('#letters_container');

        if (update_window) {
            letters_container.html('');
        }

        for (var i = 0; i < regions.length; i++) {
            manuscript_title = regions[i].title;
            manuscript_id = regions[i].id;

            manuscript = $("<div>");
            manuscript.attr('class', 'manuscript_pack').addClass('col-md-2 col-sm-4');
            manuscript.attr('id', 'manuscript_' + manuscript_id);
            manuscript.append("<img src='/static/img/folder.png' />");
            manuscript.append("<div class='folder_title'>" + manuscript_title + "</div>");

            manuscript_data = {
                'title': manuscript_title,
                'id': manuscript_id,
                'letters': []
            };

            for (var j = 0; j < regions[i].letters.length; j++) {
                data = regions[i].letters[j];
                manuscript_data.letters.push(regions[i].letters[j]);
            }

            manuscript.data('manuscript', manuscript_data);
            if (!$('#manuscript_' + manuscript_id).length) {
                letters_container.append(manuscript);
            }

        }

        if (update_window) {
            $('.manuscript_pack').unbind().click(function() {
                _self.letters.openFolder($(this));
                $(this).fadeOut();
            });
        }

    },

    make_workable: function(letter) {
        var wrap = $("<div id='image_" + letter.attr('id') + "' class='image_active'><img src='" + letter.attr('src') + "' /></div>");
        wrap.data('is_letter', true);
        $(_self.workspaceImages.workspace).append(wrap);
        if (typeof letter.data('title') == "undefined") {
            wrap.data("title", "Region");
        } else {
            wrap.data("title", letter.data('title'));
        }
        if (letter.data('size')) {
            wrap.data('size', (letter.data('size').split(',')[0] / 2) + "," + (letter.data('size').split(',')[1] / 2));
        }
        var page_position = $('#overview').offset();
        wrap.children().resizable({
            aspectRatio: true,
            resize: function(event, ui) {
                _self.toolbar.refreshSize();
                event.stopPropagation();
                return false;
            }
        });
        var left = $(window).scrollLeft();
        if ($('#image_' + letter.attr('id')).prev().length) {
            left = $('#image_' + letter.attr('id')).prev().position().left;
        }
        $('#image_' + letter.attr('id')).css({
            'top': page_position.top,
            'left': left
        }).draggable({
            revert: false,
            scroll: true,
            opacity: 0.8,
            stack: '.image_active',
            cursor: "move",
            aspectRatio: true,
            drag: function(ui, event) {
                position = $(this).offset();
                //_self.minimap.update_mini_map();
            },
            stop: function(ui, event) {
                $(ui.helper).css('z-index', 0);
            }
        });

        $('#image_' + letter.attr('id')).dblclick(function(event) {
            _self.select_group.select($(this));
            event.stopPropagation();
        });

        //_self.minimap.add_to_minimap('image_' + letter.attr('id'), letter.attr('src'));
        letter.remove();
    },

    is_selected: function(letter) {
        if (letter.data('selected')) {
            return true;
        } else {
            return false;
        }
    },

    selectLetter: function(letter) {
        var letters = this.lettersSelected;
        if (this.is_selected(letter)) {
            letter.data('selected', false);
            letter.css('box-shadow', '0px 0px 6px #666');
            if (letter.length) {
                for (var i = 0; i < letters.length; i++) {
                    if (letter.attr('id') == $(letters[i]).attr('id')) {
                        this.lettersSelected.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        } else {
            if (typeof letter != "undefined") {
                this.lettersSelected.push(letter);
                letter.data('selected', true);
                letter.css('boxShadow', '0px 0px 8px 6px rgba(255, 246, 9, 0.94)');
            }
        }
        var selected_letters_number = $('#selected_letters_number');
        selected_letters_number.html(this.lettersSelected.length + " selected");
    },

    buttons: function(data) {
        data.click(function() {
            _self.letters.openFolder(data);
        });
    },

    openFolder: function(data) {

        this.folderOpen = {
            status: true,
            manuscript: data.data('manuscript').id
        };

        var breadcrumb = $('<div>');

        breadcrumb.attr({
            'class': 'breadcrumb',
            'display': 'none',
            'id': 'breadcrumb_letters'
        });

        $('.manuscript_pack').fadeOut();
        $('#letters_container').append(breadcrumb.fadeIn(300));
        var li = "<li><a class='link' id='to_regions' data-toggle='tooltip' title='Go back to regions'>Regions</a></li>";
        li += "<li class='active'>" + data.data('manuscript').title + "</li>";
        li += "<li class='pull-right no-before'><span id='to_regions_icon' data-toggle='tooltip' title='Go back to regions' class='glyphicon glyphicon-arrow-left' style='cursor:pointer;'></span></li>";
        $('#breadcrumb_letters').html(li);
        var n = 0;
        this.updateLetters(data);

        var lettersSelected = _self.letters.lettersSelected;
        /*
        if (lettersSelected.length) {
            for (var i = 0; i < lettersSelected.length; i++) {
                console.log(lettersSelected[i].data())
                if (lettersSelected[i].data('manuscript_id') == data.data('manuscript').id) {
                    n++;
                    if (n > data.data('manuscript').letters.length) {
                        break;
                    } else {
                        for (var j = 0; j < data.data('manuscript').letters.length; j++) {
                            var letter = data.data('manuscript').letters[j];
                            if (lettersSelected[i].attr('id') == letter.attr('id')) {
                                letter.data('selected', true);
                            } else {
                                continue;
                            }
                        }
                    }
                }
            }
        }
        */
        if (lettersSelected.length) {
            for (var i = 0; i < lettersSelected.length; i++) {
                for (var j = 0; j < data.data('manuscript').letters.length; j++) {
                    var letter = data.data('manuscript').letters[j];
                    if (lettersSelected[i].attr('id') == letter.attr('id')) {
                        letter.data('selected', true);
                    } else {
                        if (i > lettersSelected.length) {
                            break;
                        }
                    }
                }

            }
        }

        i = 0;
        while (i < data.data('manuscript').letters.length) {
            var letter = data.data('manuscript').letters[i];
            $('#letters_container').append(letter.hide().fadeIn(300));
            letter.click(function() {
                _self.letters.selectLetter($(this));
            });
            i++;
        }


        $('#to_regions').click(function() {
            _self.letters.to_regions();
        });

        $('#to_regions_icon').click(function() {
            _self.letters.to_regions();
        });

        $('[data-toggle="tooltip"]').tooltip();
    },

    to_regions: function() {
        $('.letter').remove();
        $('.manuscript_pack').fadeIn(150);
        $('#breadcrumb_letters').slideUp().remove();
        _self.letters.folderOpen.status = false;
        this.check_regions_length();
        this.update_regions_folders(true);
    },


    compare: function(file, file2) {
        if (this.lettersSelected.length == 2) {
            var img1 = $("<img>");
            var img2 = $("<img>");

            img1.attr({
                'src': this.lettersSelected[0].attr('src'),
                'id': this.lettersSelected[0].attr('id')
            }).css({
                'display': 'none'
            });

            img2.attr({
                'src': this.lettersSelected[1].attr('src'),
                'id': this.lettersSelected[1].attr('id')
            }).css({
                'display': 'none'
            });

            _self.selectors.body.append(img1);
            _self.selectors.body.append(img2);

            var image1 = document.getElementById(img1.attr('id'));
            var image2 = document.getElementById(img2.attr('id'));

            resemble(image1).compareTo(image2).onComplete(function(data) {
                result = data;
            }).ignoreAntialiasing();

            img1.remove();
            img2.remove();

            return result;
        } else {
            $.fn.notify({
                'type': 'error',
                "close-button": true,
                'text': 'Choice two images to compare.'
            });
        }
    },

    show_comparison: function(data) {

        var box_comparison = "<div class='modal box_containers' id='comparison_box'><div id='top_comparison_box' class='top_box row-fluid'><span>" +
            "Images compared</span><span title='Close Window' id='close_comparison_box' class='pull-right'><span class='glyphicon glyphicon-remove close_box'></span></div>";

        box_comparison += "<span style='width:100%;background:#efefef;padding:1.5%;' class='pull-left'><button class='btn btn-sm btn-primary' id='image_compared_to_workspace'>Add to workspace</button></span><div class='box_container' id='images_compared_div'><div><img data-is_generated='true' data-workspace = '" + _self.workspaceImages.workspace + "' data-title='Region' id='image_result_compared' src='" + data.getImageDataUrl() + "' /></div></div></div>";

        _self.selectors.body.append(box_comparison);

        $('#comparison_box').show().animate({
            "top": "20%",
            'left': "24%",
            'width': "50%",
            'height': '70%',
            'opacity': 1,
            'z-index': 400
        }, {
            duration: 250,
            complete: function() {
                $('#close_comparison_box').click(function() {
                    $('#comparison_box').animate({
                        "top": "50%",
                        'left': "50%",
                        'width': "0%",
                        'height': '0%',
                        'opacity': 0
                    }, {
                        duration: 250,
                        complete: function() {
                            $(this).remove();
                        }
                    });
                });

                $('#image_result_compared').resizable({
                    aspectRatio: true
                }).parent().draggable({
                    zIndex: 0,
                    scroll: true,
                    containment: "#images_compared_div"
                });

            }
        }).draggable({
            handle: '.top_box'
        });

        $('#image_compared_to_workspace').click(function() {
            var image_result_compared = $('#image_result_compared');
            image_result_compared.data('workspace', _self.workspaceImages.workspace);
            image_result_compared.data('is-generated', true);
            _self.letters.make_workable(image_result_compared);

            $('#comparison_box').animate({
                'width': "0%",
                'height': '0%',
                'opacity': 0
            }, {
                duration: 250,
                complete: function() {
                    $(this).remove();
                }
            });

        });
    },

    make_arrays: function() {

        var regions = function() {
            var ids = [];
            for (var i = 0; i < _self.letters.regions.length; i++) {
                for (var j = 0; j < _self.letters.regions[i].letters.length; j++) {
                    ids.push(_self.letters.regions[i].letters[j].attr('id'));
                }
            }
            return ids;
        };

        var selected = function() {
            var ids = [];
            $.each(_self.letters.lettersSelected, function() {
                ids.push(this.attr('id'));
            });
            return ids;
        };

        var letters = {
            'regions': regions(),
            'letters': selected()
        };

        return letters;
    },

    delete: function() {
        var ids = this.make_arrays().regions;
        var ids2 = this.make_arrays().letters;
        if (this.lettersSelected.length) {
            for (var i = 0; i < ids2.length; i++) {
                for (var h = 0; h < ids.length; h++) {
                    if (ids2[i] == ids[h]) {
                        for (var j = 0; j < _self.letters.regions.length; j++) {
                            for (var n = 0; n < _self.letters.regions[j].letters.length; n++) {
                                if (_self.letters.regions[j].letters[n].attr('id') == ids2[i]) {
                                    _self.letters.regions[j].letters.splice(n, 1);
                                    n--;
                                    $('#' + ids2[i]).fadeOut().remove();
                                    if (!_self.letters.regions[j].letters.length) {
                                        _self.letters.to_regions();
                                        $("#manuscript_" + _self.letters.regions[j].id).fadeOut().remove();
                                        _self.letters.regions.splice(j, 1);
                                        j--;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.check_regions_length();
        } else {
            return false;
        }
        _self.letters.lettersSelected = [];
        var selected_letters_number = $('#selected_letters_number');
        selected_letters_number.html(this.lettersSelected.length + " selected");
    },

    to_workspace: function() {

        var regions = _self.letters.regions;

        _self.letters.lettersSelected.clean(undefined);

        if (this.lettersSelected.length) {
            for (var i = 0; i < this.lettersSelected.length; i++) {
                for (var j = 0; j < regions.length; j++) {
                    for (var c = 0; c < regions[j].letters.length; c++) {
                        if (regions[j].letters[c].attr('id') == this.lettersSelected[i].attr('id')) {
                            regions[j].letters.splice(c, 1);
                            c--;
                        }
                    }
                    if (!regions[j].letters.length) {
                        regions.splice(j, 1);
                        j--;
                    }
                }
                _self.letters.make_workable(this.lettersSelected[i]);
                _self.letters.lettersSelected.splice(i, 1);
                i--;
            }
        } else {
            return false;
        }

        var selected_letters_number = $('#selected_letters_number');
        selected_letters_number.html(this.lettersSelected.length + " selected");
        this.check_regions_length();
    },

    hide_box: function() {
        $('#comparison_box').fadeOut().remove();
    },

    export_as_xml: function(value) {
        var letters = _self.letters.regions;
        var xml = "<?xml version='1.0' encoding='UTF-8'?>\n";
        xml += '<regions>\n';
        for (var i = 0; i < letters.length; i++) {
            xml += "\t<manuscript>\n";
            xml += "\t\t<id>" + letters[i].id + "</id>\n";
            xml += "\t\t<title>" + letters[i].title + "</title>\n";
            for (var j = 0; j < letters[i].letters.length; j++) {
                var letter = $(letters[i].letters[j]);
                xml += "\t\t\t<letter>\n";
                xml += "\t\t\t\t<size>" + letter.data('size') + "</size>\n";
                xml += "\t\t\t\t<id>" + letter.attr('id') + "</id>\n";
                xml += "\t\t\t\t<src>" + letter.attr('src') + "</src>\n";
                xml += "\t\t\t\t<title>" + letter.data('title') + "</title>\n";
                xml += "</letter>\n";
            }
            xml += "\t</manuscript>\n";
        }
        xml += "</regions>";

        var contentType = 'text/xml';

        var getBlobURL = (window.URL && URL.createObjectURL.bind(URL)) ||
            (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
            window.createObjectURL;

        xmlFile = new Blob([xml], {
            type: contentType
        });

        var a = document.createElement('a');

        if (value == 'xml') {

            a.download = 'letters.xml';
            a.id = 'clickable_link';
            a.href = getBlobURL(xmlFile);
            a.textContent = 'Download XML';
            a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
            var window_link = $("<div id='window_link'>");
            window_link.append(a);

            var p = "<p><button id='close_window_link' style='margin-top:10%;' class='btn btn-danger btn-sm'>Close Window</button></p>";

            window_link.append(p);

            if (!$('#window_link').length) {
                _self.selectors.body.append(window_link.fadeIn(300));
                $('#close_window_link').on('click', function() {
                    window_link.fadeOut(300).remove();
                });
                $('#clickable_link').on('click', function() {
                    window_link.fadeOut(300).remove();
                });
            }

        } else {
            var XSLT_FILENAME = 'script.xsl';

            $.ajax({
                url: 'transform_xml/',
                type: 'POST',
                data: {
                    'xml': xml,
                    'xsl_filename': XSLT_FILENAME
                },
                success: function(data) {
                    a.download = 'digipal_images.html';
                    a.id = 'clickable_link';

                    var htmlFile = new Blob([data], {
                        type: contentType
                    });
                    a.href = getBlobURL(htmlFile);
                    a.textContent = 'Download HTML';
                    a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
                    var window_link = $("<div id='window_link'>");
                    window_link.append(a);

                    var p = "<p><button id='close_window_link' style='margin-top:10%;' class='btn btn-danger btn-sm'>Close Window</button></p>";

                    window_link.append(p);

                    if (!$('#window_link').length) {
                        _self.selectors.body.append(window_link.fadeIn(300));
                        $('#close_window_link').on('click', function() {
                            window_link.fadeOut(300).remove();
                        });
                        $('#clickable_link').on('click', function() {
                            window_link.fadeOut(300).remove();
                        });
                    }
                }
            });
        }
    },


    import_image: function(e) {
        var files = e.target.files;
        var file = files[0];

        var reader = new FileReader();
        reader.onload = function(ev) {
            var src = ev.target.result;
            var image = $('<img>');
            var wrap_image = $('<div>');
            var title;
            wrap_image.data('from_pc', true);
            wrap_image.data('is_letter', true);
            wrap_image.attr('id', uniqueid());
            wrap_image.data('size', this.width + ',' + this.height);
            image.attr('src', src);
            if (file.name !== undefined && file.name.length > 28) {
                title = file.name.substr(0, 25) + '...';
            } else {
                title = file.name;
            }
            wrap_image.data('title', title);
            wrap_image.append(image);
            _self.imagesBox.imagesSelected.push(wrap_image);
            _self.imagesBox.to_workspace();
            _self.imagesBox.imagesSelected = [];
            return false;
        };
        reader.readAsDataURL(file);
    },


    import_xml: function(e) {
        var files = e.target.files;
        var file = files[0];

        var reader = new FileReader();
        reader.onload = function(ev) {
            var letters = ev.target.result;
            var x2jsOptionsSample = new X2JS({
                escapeMode: false,
                attributePrefix: "_",
                arrayAccessForm: "none"
            });
            var x2js = new X2JS(x2jsOptionsSample);
            var xml = _self.utils.stringToXML(letters);
            var json = x2js.xml2json(xml);
            _self.letters.importLetters(json.regions.manuscript);
            _self.letters.check_regions_length();
        };
        reader.readAsText(file);
    },

    clean_array: function(array) {
        for (var i = 0; i < array.length; i++) {
            if (typeof array[i].id == "undefined") {
                array.splice(i, 1);
                i--;
            }
        }
        return array;
    },

    importLetters: function(array_letters) {
        var letters = array_letters;
        var array = [];
        var value, letter, i, g;
        if (letters.hasOwnProperty(length)) {
            for (var d = 0; d < letters.length; d++) {
                value = letters[d];
                for (i = 0; i < value.letter_asArray.length; i++) {
                    letter = $('<img>');
                    letter.attr('class', 'letter');
                    letter.data('manuscript', value.title);
                    letter.data('manuscript_id', value.id);
                    letter.attr('id', value.letter_asArray[i].id);
                    letter.attr('src', value.letter_asArray[i].src);
                    letter.data('size', value.letter_asArray[i].size);
                    letter.data('title', value.letter_asArray[i].title);
                    array.push(letter);
                }
            }
            for (g = 0; g < array.length; g++) {
                _self.letters.addLetter(array[g]);
            }
        } else {
            for (i = 0; i < letters.letter_asArray.length; i++) {
                letter = $('<img>');
                letter.attr('class', 'letter');
                letter.data('manuscript', letters.title);
                letter.data('manuscript_id', letters.id);
                letter.attr('id', letters.letter_asArray[i].id);
                letter.attr('src', letters.letter_asArray[i].src);
                letter.data('size', letters.letter_asArray[i].size);
                letter.data('title', letters.letter_asArray[i].title);
                array.push(letter);
            }
            for (g = 0; g < array.length; g++) {
                _self.letters.addLetter(array[g]);
            }
        }
    }
};