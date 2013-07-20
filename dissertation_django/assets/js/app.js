$(document).ready(function () {

    (function () {

        // Toolbox class
        $.fn.toolbar = {

            // Initialize the class, makes the options
            init: function (options) {

                this.default_options = {
                    'id': 'toolbar',
                    'container': 'body',
                    class: ''
                };

                $.extend(this.default_options, options);

            },

            // Check if the toolbar has been initialized
            exists: function () {
                try {
                    if (($('#' + this.default_options['id']).length !== 0)) {
                        return true;
                    } else {
                        return false;
                    }
                } catch(e){
                    return false;
                }
            },

            // Create the structure of the toolbar and put it on the screen
            create: function (options) {

                if ((this.exists() === false) && ($.fn.images_on_workspace().length > 0) && (typeof $selectedImage != "undefined")) {
                    var structure = '<div id=' + this.default_options['id'] + '>';
                    structure += "<div id='topToolbar'><span id='name_image'>Tools</span> <span title='Close toolbar' class='pull-right' id='closeToolbar'>x</span></div>";
                    $(this.default_options['container']).append(structure);
                    this.toolbox = $('#' + this.default_options['id']);
                    this.stylize();
                    var tools = this.makeTools();
                    this.toolbox.append(tools);
                    this.buttons();
                    $.fn.crop.init();
                } else {
                    console.log('Toolbar not initialized, or no images on workspace');
                }
                return false;
            },

            makeTools: function () {
                var tools = '<div id="tools">';
                /*var name_image = "<div class='tool'><span class='tool_label'>Manuscript</span>";
                name_image += "<div class='tool_value' id='name_image'></div></div>";*/
                var opacity = "<div class='tool'><span class='tool_label'>Opacity</span>";
                opacity += "<div id='slider' class='slider'></div></div>";
                var line = "<div class='line'></div>";
                tools += opacity;
                var brightness = "<div class='tool'><span class='tool_label'>Brightness</span>";
                brightness += "<div id='slider_brightness' class='slider'></div></div>";
                tools += brightness;
                var rotate = "<div class='tool'><span class='tool_label'>Rotate</span>";
                rotate += "<div id='slider_rotate' class='slider'></div></div>";
                tools += rotate;
                tools += "<div class='tool'><span class='tool_label'>Grayscale</span> <div class='slider'><input style='margin-bottom:10px;' type='checkbox' id='grayscale' /></div></div>";
                tools += line;
                var size = "<div class='tool'><span class='tool_label'>Size</span>";
                size += "<input class='small-input' type='text' id='set_width' /><span class='label_size'>Width</span><input class='small-input' type='text' id='set_height' /><span class='label_size'>Height</span><button style='margin-bottom:3%' id='set_size' class='btn btn-primary btn-small'>Set</button></div>";
                tools += size;
                var comment = "<div class='line' style='padding-top:5%'></div><div class='tool'><span class='tool_label'>Notes</span> <button id='createComment' class='btn btn-primary btn-small'><i class='icon-book'></i> Add Note</button></div>";
                 var crop = "<div class='line'></div><div class='tool'><span class='tool_label'>Crop</span> <button class='btn btn-primary btn-small crop_button'><i class='icon-resize-small'></i> Activate Crop</button> <button id='crop_image' class='btn btn-small btn-warning'>Crop Image!</button></div>";
                  var remove = "<div class='line'></div><div class='tool'><button class='btn btn-small btn-danger' id='removeImage'><i class='icon-remove'></i> Remove</button> <button class='btn btn-small btn-primary' id='reset_image'>Reset</button></div>";
                tools += comment + crop + remove;
                tools += "</div>";
                return tools;
            },

            opacity: function () {
                $("#slider").slider({
                    slide: function (event, ui) {
                        if ($.fn.images_on_workspace().length > 0) {
                            var opacity = (ui.value / 100);
                            $selectedImage.children().children('img').css('opacity', opacity);
                        }
                    }
                });
                return false;
            },

            brightness: function(){
               $("#slider_brightness").slider({
                    min: 100,
                    max: 300,
                    value: 200,
                    slide: function (event, ui) {
                        if ($.fn.images_on_workspace().length > 0) {
                            if(document.body.style.webkitFilter !== undefined){
                                $selectedImage.css('-webkit-filter', 'brightness(' + ui.value / 2 + '%)');
                            } else {
                                $selectedImage.css('polyfilter','brightness(' + ui.value / 2 + '%)');
                            }
                        }
                    }
                });
                return false; 
            },

            rotate: function(){

                $("#slider_rotate").slider({
                    min: -180,
                    max: 180,
                    value: 0,
                    slide: function (event, ui) {
                        $selectedImage.css('transform','rotate(' + ui.value + 'deg)');
                    }
                });


            },

            grayscale: function(button){

                if(button.is(':checked')){
                    $selectedImage.children().children('img').addClass('grayscale');
                } else {
                    $selectedImage.children().children('img').removeClass('grayscale');
                }

            },

            size: function(){

                /*
                var isNumber = function(o) {
                    return typeof o === 'number' && isFinite(o);
                };
                */
                var size = $selectedImage.data('size').split(',');
                var width = $('#set_width').val();
                var height = $('#set_height').val();
                var ratio = size[0] / size[1];
                var calc_height;
                var calc_width;

                if(width && !height){
                    calc_height = "auto"
                    calc_width = width;
                } else if(!width && height){
                    
                    calc_height = height;
                } else {
                    calc_height = height;
                    calc_width = width;
                }

                $selectedImage.children().css({
                    'width': calc_width,
                    'height': calc_height
                });

                $selectedImage.css({
                    'width': calc_width,
                    'height': calc_height
                });

                $selectedImage.children().children('img').css({
                    'width': calc_width,
                    'height': calc_height
                });

                this.refreshSize();

                var position = $selectedImage.offset();

                if(position['top'] < $(window).scrollTop() || position['left'] < $(window).scrollLeft()){
                    $selectedImage.animate({
                        "top": $(window).scrollTop() + 100,
                        "left": $(window).scrollLeft() + 100
                    }, 150);
                }

                $('#mini_' + $selectedImage.attr('id')).animate({
                    'width': parseInt($selectedImage.children().children('img').css('width')) / 25 + "px",
                    'height': parseInt($selectedImage.children().children('img').css('height')) / 30  + "px",
                }, 10);

            },

            reset: function(){

                var size = $selectedImage.data('size').split(',');

                $selectedImage.children().css({
                    'width': "180px",
                    'height': "auto",
                });

                if(document.body.style.webkitFilter !== undefined){

                    $selectedImage.css({
                        'width': "180px",
                        'height': "auto",
                        'transform': "rotate(0deg)",
                        '-webkit-filter': 'brightness(100%)'
                    });
                   
                } else {

                    $selectedImage.css({
                        'width': "180px",
                        'height': "auto",
                        'transform': "rotate(0deg)",
                        'polyfilter':'brightness(100%)'
                    });

                }
                
                 $selectedImage.children().children('img').css({
                        'width': "180px",
                        'height': "auto",
                        'opacity': 1
                });

                var position = $selectedImage.offset();

                if(position['top'] < $(window).scrollTop()  || position['left'] < $(window).scrollLeft()){
                    $selectedImage.animate({
                        "top": $(window).scrollTop() + 100,
                        "left": $(window).scrollLeft() + 100
                    }, 150);
                }

                $('#mini_' + $selectedImage.attr('id')).animate({
                    'width': parseInt($selectedImage.children().children('img').css('width')) / 25 + "px",
                    'height': parseInt($selectedImage.children().children('img').css('height')) / 30  + "px",
                }, 10);

                $('#grayscale').prop('checked', false);
                this.grayscale($('#grayscale'));
                this.refresh();

            },

            stylize: function () {
                this.toolbox.addClass('box').draggable({
                    stack: '.box',
                    cursor: "move",
                    appendTo: 'body'
                });
                return false;
            },

            show: function () {
                $('#button_toolbar').tooltip('hide').fadeOut().remove();
                this.toolbox.show();
                this.toolbox.animate({
                    "top": this.last_style['top'],
                        'left': this.last_style['left'],
                        'width': this.last_style['width'],
                        'height': this.last_style['height'],
                        'opacity': this.last_style['opacity']
                }, 250);
                return false;
            },

            hide: function () {
                $('#buttons').prepend("<img data-toggle='tooltip' title='Show Tools Box' id='button_toolbar' src='/static/img/tools.png' />");
                this.buttons_position = $('#button_toolbar').position();
                this.last_style = this.toolbox.css(['top', 'left', 'width', 'height', 'opacity']);
                this.toolbox.animate({
                    position: 'absolute',
                    top: this.buttons_position['top'],
                    left: this.buttons_position['left'],
                    width: 0,
                    height: 0,
                    opacity: 0
                }, {
                    duration: 310,
                    complete: function () {
                        $(this).hide();    
                        $('#button_toolbar').tooltip({
                            placement: 'bottom',
                            trigger: 'hover'
                        });
                        $('#button_toolbar').click(function () {
                            $.fn.toolbar.show();
                        });
                    }
                });
                return false;
            },

            buttons: function () {
                $('#closeToolbar').click(function () {
                    $.fn.toolbar.hide($(this));
                    this.is_hidden = true;
                });

                $('#createComment').click(function(){
                    $.fn.comments.init($selectedImage.attr('id'));
                });

                $('#reset_image').click(function(){
                    $.fn.toolbar.reset();
                });

                $('#set_size').click(function(){
                    $.fn.toolbar.size();
                });

                $('#grayscale').click(function(){
                    $.fn.toolbar.grayscale($(this));                   
                });

                $('#removeImage').click(function(){
                    if(typeof $selectedImage.data('is_letter') == "undefined" || $selectedImage.data('is_letter') == false){

                        $('#images_container').append($selectedImage.unbind().attr('style', '').draggable("destroy").removeClass('image_active').addClass('image').data('selected', false).children().children('img').resizable("destroy").css("box-shadow", "none").attr('style', '').parent('.image').children('.image_desc').css('box-shadow', 'none').parent(".image"));

                        $("#" + $selectedImage.attr('id')).click(function(){
                            $.fn.imagesBox.select_image($(this));
                        });
                    } else {

                        var image_id = $selectedImage.attr('id');
                        $('#letters_container').append($selectedImage.unbind().attr('style', '').draggable("destroy").removeClass('image_active').data('selected', false).children().children('img').resizable("destroy").css("box-shadow", "none").attr('style', '').addClass('letter').attr('id', image_id));
                        $selectedImage.remove();
                        $('#' + image_id).click(function(){
                            $.fn.letters.selectLetter($(this));
                        });
                    }
                    $('#mini_' + $selectedImage.attr('id')).remove();
                    $selectedImage = undefined;
                    $.fn.toolbar.toolbox.remove();
                });

                $('#crop_image').click(function(e){
                    e.preventDefault();
                    $.fn.crop.get_image();
                });

                this.opacity();
                this.brightness();
                this.rotate();

            },

            selectedImage: function(){
                if(($.fn.images_on_workspace().length > 0) && (typeof $selectedImage != "undefined")){
                    return $selectedImage;
                } else {
                    return undefined;
                }
            },

            refreshSize: function(){
                $('#set_width').val('');
                $('#set_height').val('');
                $('#set_width').attr("placeholder", $selectedImage.children().children('img').css('width').replace("px", ''));
                $('#set_height').attr("placeholder", $selectedImage.children().children('img').css('height').replace("px", ''));
            },

            refresh: function () {

                var features = function () {

                    var image = {};

                    String.prototype.getNums = function(){
                        var rx=/[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
                        mapN= this.match(rx) || [];
                        return mapN.map(Number);
                    };

                    var get_rotation = function(matrix){
                        if(matrix !== 'none') {
                            var values = matrix.split('(')[1].split(')')[0].split(',');
                            var a = values[0];
                            var b = values[1];
                            var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
                        } else { 
                            var angle = 0; 
                        }
                        return (angle < 0) ? angle += 360 : angle;
                    };

                    //Name
                    if ($.fn.images_on_workspace().length > 0) {
                        var name_image = $selectedImage.data('title');
                        image['name'] = name_image;
                        image['opacity'] = $selectedImage.children().children('img').css('opacity') * 100;
                        image['rotate'] = get_rotation($selectedImage.css('transform'));
                        if(document.body.style.webkitFilter !== undefined){
                            if($selectedImage.css('-webkit-filter') != "none"){
                                var brightness = $selectedImage.css('-webkit-filter').getNums() * 2 * 100;
                                image['brightness'] = brightness;
                            } else {
                                image['brightness'] = 200;
                            }
                        } else {
                            if(typeof document.getElementById($selectedImage.attr('id')).style.polyfilterStore != "undefined"){
                                var brightness = document.getElementById($selectedImage.attr('id')).style.polyfilterStore.getNums();
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
                $("#slider").slider("option", "value", image['opacity']);
                $('#slider_brightness').slider("option", "value", image['brightness']);
                $('#slider_rotate').slider("option", "value", image['rotate']);

                this.refreshSize();

                $('#name_image').html(image['name']);
            }

        };

        $.fn.imagesBox = {

            imagesSelected: [],
            imagesBox: $('#barLeft'),

            init: function(){
                this.buttons();
            },

            show: function(){
                $('#button_images').tooltip('hide').fadeOut().remove();
                this.imagesBox.show().draggable({
                    handle: '.top_box'
                });
                this.imagesBox.animate({
                    "top": "14%",
                    'left': "46%",
                    'width': "50%",
                    'height': "75%",
                    'opacity': 1
                }, 250);
                return false;
            },

            hide: function(){

                var button = " <img data-toggle='tooltip' title='Browse Manuscripts' id='button_images' src='/static/img/manuscript.png' />";
                $('#buttons').prepend(button);
                
                this.buttons_position = $('#button_images').position();
                

                this.imagesBox.show().animate({
                    position: 'absolute',
                    top: this.buttons_position['top'],
                    left: this.buttons_position['left'] + 300,
                    width: 0,
                    height: 0,
                    opacity: 0
                }, {
                    duration: 350,
                    complete: function () {
                        $(this).hide();
                        $('#button_images').tooltip({
                            placement: 'bottom',
                            trigger: 'hover'
                        });
                        $('#button_images').click(function () {
                            $.fn.imagesBox.show();
                        });
                    }
                });
                return false;
            },

            buttons: function () {
                $('#close_barLeft').click(function () {
                    $.fn.imagesBox.hide($(this));
                });

                $('#add_to_workspace').click(function(){
                    $.fn.imagesBox.to_workspace();
                });

                $('.image').click(function(){
                    $.fn.imagesBox.select_image($(this));
                });
            },

            is_selected: function(image){
                if(image.data('selected')){
                    return true;
                } else {
                    return false;
                }

            },

            select_image: function(image){    
                $currentImageSelected = image;
                var images = $.fn.imagesBox.imagesSelected;
                if($.fn.imagesBox.is_selected(image)){
                    image.data('selected', false);
                    image.children('img').css('boxShadow', '1px 0px 5px #444');
                    if(images.length == 0){
                        null;
                    } else {
                        for(i = 0; i < images.length; i++){
                            if(image.attr('id') == $(images[i]).attr('id')){
                                images.splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    if(typeof image != "undefined"){
                        $.fn.imagesBox.imagesSelected.push(image);
                        image.data('selected', true);
                        image.children('img').css('boxShadow', '0px 0px 18px 2px rgba(255, 246, 9, 1)');
                    }
                }


            },

            to_workspace: function(){
                var images = $.fn.imagesBox.imagesSelected;
                var images_on_workspace = $('.image');
                var page_position = $('#overview').offset();
                if(images.length > 0){
                    for(i = 0; i < images.length; i++){

                        var new_images = $(images[i]).unbind().removeClass('image').addClass('image_active').css({
                            'top': page_position['top'] - 500  + "px",
                            'left': page_position['left'] - 10 + "px"
                        });

                        $('#barRight').append(new_images);

                        // fires the event to select an image
                        $('.image_active').click(function () {
                            $(this).select();
                        });

                        $.fn.minimap.add_to_minimap($(images[i]).attr('id'));

                    }
                    $.fn.workspaceImages.init(); // Making images draggable
                    $.fn.imagesBox.imagesSelected = []; //restore the selected elements after dragged on workspace
                } else {
                    $('body').append("<div id='notification' class='notify notify-error'>You should insert at least one image.</div>");
                    $('#notification').notify({
                        "close-button": false,
                        "position": {'top':"12%", 'left': '70%'}
                    });
                }
            }

        }

        $.fn.workspaceImages = {

            init: function(){
                this.make_images_draggable();
            },

            make_images_draggable: function(){
                
                $('.image_active').draggable({
                    revert: false,
                    scroll: true,
                    opacity: 0.8,
                    stack: '.image_active',
                    cursor: "move",
                    drag: function (ui, event) {
                        position = $(this).offset();
                        $.fn.minimap.update_mini_map($(this).attr('id'));
                    }, 
                    stop: function(ui, event){
                        $(ui.helper).css('z-index', 0);
                    }
                }).children('img').css('width', '180px').resizable({
                    aspectRatio: true,
                    resize: function(event, ui){
                        $('#mini_' + ui.element.parent().attr('id')).animate({
                            'width': parseInt($(this).css('width')) / 25 + "px",
                            'height': parseInt($(this).css('height')) / 30  + "px",
                        }, 10);
                        $.fn.toolbar.refreshSize();
                    }
                });
            }
        }


        $.fn.comments = {

            notes: [],
            open: false,

            init: function(image, content, title, image_id){
                if($('.comment').length > 0){
                    $('.comment').focus();
                } else {
                    var uniqueid = function(){
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                        for( var i=0; i < 5; i++ )
                            text += possible.charAt(Math.floor(Math.random() * possible.length));

                        return text;
                    }

                    var image_comment = image + '_' + uniqueid();
                    var comment = this.make_comment(image_comment, image);
                    $('body').append(comment);
                    $('#' + image_comment).draggable({
                        handle: '.top_comment',
                        cursor: 'move',
                        stack: '.image',
                        appendTo: 'body',
                        zIndex: 401
                    });
                    if(content || title || image_id && image){
                        $('#' + image_comment).children('.comment_wrapper').children('.comment_content').html(content);
                        $('#' + image_comment).data('id', image_id);
                        $('#' + image_comment).children('.comment_wrapper').children('.commentTitle').val(title);
                    }
                    this.buttons(); 
                }
            },

            buttons: function(){
                 $('.removeComment').click(function(){
                    var notes = $.fn.comments.notes;
                    var note = $(this).parent().parent('.comment');
                    for(i = 0; i < notes.length; i++){
                        if(notes[i]['id'] == note.data('id')){
                            //delete notes[i];
                            $.fn.comments.notes.splice(i, 1);
                            break;
                        }
                    }
                    note.fadeOut().remove();
                });

                 $('.minimizeNote').click(function(){
                    $.fn.comments.minimizeNote($(this).parent().parent('.comment'));
                 });

                $('#bold').on("click", function(){document.execCommand('bold',false,null);});
                $('#italic').on("click", function(){document.execCommand('italic',false,null);});
                $('#underline').on("click", function(){document.execCommand('underline',false,null);});                
            },

            minimizeNote: function(note_this){
                var note_position = note_this.position();
                var note_content = note_this.children('.comment_wrapper').children('.comment_content').html();
                var note_title = note_this.children('.comment_wrapper').children('.commentTitle').val();
                var note_id = note_this.attr('id');
                var image_id = note_this.data('image');
                var note = {
                    'title': note_title,
                    'content': note_content,
                    'position': note_position,
                    'id': note_id,
                    'image': image_id
                }
                this.notes.push(note);

                // Updating notes into the window
                this.update_notes(note);
                if(!this.open){
                    var notes_button_position = $('#notes_button').position();
                } else {
                    var notes_button_position = $('#notes').position();
                }
                note_this.animate({
                    position: 'absolute',
                    top: notes_button_position['top'],
                    left: notes_button_position['left'] + 50,
                    width: 0,
                    height: 0,
                    opacity: 0
                }, {
                    duration: 250,
                    complete: function () {
                        $(this).hide().remove();
                    }
                });

            },

            make_comment: function(image, id_image){
                var comment = "<div class='comment' id='" + image + "' data-image = '" + id_image +"'>";
                comment += "<div class='top_comment'>";
                comment += "<button class='btn btn-small btn-danger removeComment' title='Remove note'><i class='icon-remove'></i> Remove</button>";
                comment += ' <div class="btn-group" data-toggle="buttons-checkbox"><button type="button" id="bold" class="btn btn-small">b</button><button type="button" id="italic" class="btn btn-small">i</button><button type="button" id="underline" class="btn btn-small">u</button></div> ';
                comment += "<span class='btn btn-small pull-right minimizeNote' title='Minimize note' style='font-weight:bold;'><i class='icon-remove'></i></span></div>";
                comment += "<div class='comment_wrapper'>";
                comment += "<input class='commentTitle' class='hidden' placeholder='Comment title here ...' />";
                comment += "<div class='comment_content' contenteditable></div></div>";       
                return comment;
            },


            hide_notes: function(button_position){
                $('#notes').animate({
                    "top": button_position['top'],
                    'left': button_position['left'] + 300,
                    'width': "0%",
                    'height': "0%",
                    'opacity': 0
                }, {
                    duration: 250,
                    complete: function () {
                        $(this).hide();
                        $('#notes_button').show();
                        $('#notes_button').tooltip({
                            placement: 'bottom',
                            trigger: 'hover'
                        });
                        /*$('#notes_button').click(function(){
                            $.fn.comments.show_notes()
                        });*/
                    }
                });
                this.open = false;
            },

            show_comment: function(note_button){
                if($('.comment').length == 0){
                    var notes = $.fn.comments.notes;
                    var note = note_button.parent().parent('.note');
                    for(i = 0; i < notes.length; i++){
                        if(notes[i]['id'] == note.data('id')){
                            var id = notes[i]['id'];
                            var image = notes[i]['image'];
                            var title = notes[i]['title'];
                            var content = notes[i]['content'];
                            var position = notes[i]['position'];
                            $(note).stop().animate({
                                position: "absolute",
                                top: notes[i]['position']['top'],
                                left: notes[i]['position']['left'],
                                backgroundColor: "rgb(0, 109, 204)",
                                width: "0px",
                                height: "0px",
                                opacity: 0
                            }, {
                                duration: 300,
                                complete: function () {
                                   $(this).hide();
                                   $.fn.comments.init(image, content, title, id);
                                   $('.comment').css({
                                        'position': "fixed",
                                        'top': position['top'],
                                        'left': position['left']
                                   });
                                }
                            });
                        }
                    }
                } else {
                    $('body').append("<div id='notification_comment' class='notify notify-error'>A note window is already open on the workspace.</div>");
                    $('#notification_comment').notify({
                        "close-button": false,
                        "position": {'top':"12%", 'left': '70%'}
                    });
                }
            },

            update_notes: function(note){
                var button_position = $('#notes_button').position();
                var notes_html = "<div class = 'note' data-id = '" + note['id'] + "'><span class='note_box_title'>" + note['title'] + "</span>" + 
                    "<p class='pull-right'><button class='btn btn-primary btn-small edit_comment_from_box'>Edit</button> <button class='btn btn-danger btn-small remove_comment_from_box'>Remove</button></p>" +
                    "<p class='note_box_content'>" + note['content'] + "</p></div>";
                
                $('#notes_container').append(notes_html);

                if($.fn.comments.notes.length == 0){
                    $('#notes_alert').fadeIn().html("No notes created");
                } else {
                    $('#notes_alert').fadeOut().html('');
                }

                $('.remove_comment_from_box').click(function(){
                    var notes = $.fn.comments.notes;
                    var note = $(this).parent().parent('.note');
                    for(i = 0; i < notes.length; i++){
                        if(notes[i]['id'] == note.data('id')){
                            //delete notes[i];
                            $.fn.comments.notes.splice(i, 1);
                            break;
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
                        complete: function () {
                           $(this).hide().remove();
                        }
                    });
                });

                $('.edit_comment_from_box').click(function(){
                    $.fn.comments.show_comment($(this));
                });

            },

            show_notes: function(){
                    var button_position = $('#notes_button').position();
                    $('#notes_button').hide();
                    $('#notes').show().animate({
                        "top": "16%",
                        'left': "46%",
                        'width': "50%",
                        'height': "75%",
                        'opacity': 1,
                        'z-index': 400
                    }, {
                        duration: 250,
                        complete: function () {
                            $('#notes_container').sortable();
                            $('#notes_button').tooltip({
                                placement: 'bottom',
                                trigger: 'hover'
                            });
                            $('#close_notes').click(function(){
                                $.fn.comments.hide_notes(button_position);
                            });


                        }
                    }).draggable({
                        handle: '.top_box'
                    });

                    if($.fn.comments.notes.length == 0){
                        $('#notes_alert').fadeIn().html("No notes created");
                    } else {
                        $('#notes_alert').fadeOut().html('');
                    }
                    this.open = true;
                
            },

            clean_notes: function(){
                $('.note').remove();
                this.notes = [];
            }

        }

        $.fn.crop = {

            init: function(data){
                this.buttons(data);
            },

            crop: function(image){
                var jcrop_api;
                
                var image_crop = $(image).children().children('img')
                image_crop.Jcrop({
                    keySupport: false,
                    setSelect: [
                        image_crop.width()/8,
                        image_crop.height()/8,
                        (image_crop.width()/4)*2,
                        (image_crop.height()/4)*2
                    ],

                    onSelect: function(){
                        jcrop_api = this;
                        $('#crop_image').fadeIn();

                    },

                    onChange: this.show_coords,

                    onRelease: function(){
                        jcrop_api = this;
                        jcrop_api.destroy();
                        $('.crop_button').removeClass('active');
                        $('#crop_image').fadeOut();
                    }
                });
            },

            show_coords: function(c){
                $.fn.crop.coords = [c.x, c.y, c.x2, c.y2];  
            },

            buttons: function(){
                $('.crop_button').click(function(){
                    if(!$(this).hasClass('active')){
                        $(this).addClass('active');
                        $.fn.crop.crop($selectedImage);
                    } else {
                        return false;
                    }
                });
                return false;
            },


            get_image: function(){
                var image = $selectedImage.children().children('img');

                var is_letter = function(){
                    if($selectedImage.data('is_letter')){
                        return true;
                    } else {
                        return false;
                    }
                }
                
                var width = image.width();
                var height = image.height();

                var data = {
                    'id': $selectedImage.attr('id'), 
                    'image': image.attr('src'), 
                    'is_letter': is_letter(),
                    'height': height, 
                    'width': width, 
                    'box': JSON.stringify($.fn.crop.coords),
                    'manuscript': $selectedImage.data('title')
                };

                $.ajax({
                    type:'POST',
                    url:'read-image/',
                    data: data,
                    beforeSend: function(){
                        if($('#letter_wait_box').length == 0){
                            var loader = "<div class='modal' id='letter_wait_box'><span id='letter_crop_status'>Cropping region ...</span><div id='letters_buttons_loading_box'><img src='/static/img/ajax-loader2.gif' /></div>";
                            $('body').append(loader)
                            $('#letter_wait_box').fadeIn();
                        } else {
                            $('#letters_buttons_loading_box').hide().fadeIn().html("<img src='/static/img/ajax-loader2.gif' />");
                            $('#letter_crop_status').hide().fadeIn().html("Cropping region ...");
                        }
                        /*
                        if($.fn.letters.open){
                            $('#top_box_letters').append('<img id="loading_letter_ajax" src="/static/img/ajax-loader.gif" />')
                        }
                        */
                    },     
                    success: function(data){
                        $.fn.letters.addLetter(data);
                        return false;
                    },
                    complete: function(){
                        if($.fn.letters.open == false){
                            var buttons = "<button id='open-letter-box' class='btn btn-primary'>Open Letters Window</button> <button class='btn btn-danger' id='close-letter-box'>Close</button>";
                            $('#letters_buttons_loading_box').hide().fadeIn().html(buttons);
                            $('#letter_crop_status').hide().fadeIn().html("Region cropped!");

                            $('#close-letter-box').click(function(){
                                $('#letter_wait_box').fadeOut().remove();
                            });

                            $('#open-letter-box').click(function(){
                                $('#letter_wait_box').fadeOut().remove();
                                $.fn.letters.open_lettersbox();
                            });

                            $('#letter_wait_box').data('completed', true);
                            return false;

                        } else {
                            $('#letter_wait_box').fadeOut().remove();
                            $('#importing_letter_ajax').fadeOut().remove();
                            return false;
                        }

                    },
                    error: function(){
                        var buttons = "<button id='open-letter-box' class='btn btn-primary'>Open Regions Window</button> <button class='btn btn-danger' id='close-letter-box'>Close</button>";
                            $('#letters_buttons_loading_box').hide().fadeIn().html(buttons);
                        $('#letter_crop_status').hide().fadeIn().html("Something went wrong. Try again.!");
                    }

                });
            }

        }

        $.fn.letters = {

            open: false,

            lettersSelected: [],

            letters: $('.letter'),

            init: function(data){
                this.buttons(data);
            },

            open_lettersbox: function(){
                var button_position = $('#letters_button').position();
                $('#letters_button').hide();
                $('#letters').show().animate({
                    "top": "14%",
                    'left': "43%",
                    'width': "50%",
                    'height': "75%",
                    'opacity': 1,
                    'z-index': 400
                }, {
                    duration: 250,
                    complete: function () {
                        $('#close_letters').click(function(){
                            $.fn.letters.hide_letters(button_position);
                        });

                        $('#compare_letters').click(function(){
                            var comparison = $.fn.letters.compare();
                            $.fn.letters.show_comparison(comparison);
                        });

                        $('#delete_letter').click(function(){
                            $.fn.letters.delete();
                            return false;
                        });

                        $('#add_letters').click(function(){
                            $.fn.letters.to_workspace();
                            return false;
                        });
                    }
                }).draggable({
                    handle: '.top_box'
                });
                this.open = true;
            },

            hide_letters: function(button_position){
                $('#letters').animate({
                    "top": button_position['top'],
                    'left': button_position['left'] + 300,
                    'width': "0%",
                    'height': "0%",
                    'opacity': 0
                }, {
                    duration: 250,
                    complete: function () {
                        $(this).hide();
                        $('#letters_button').show();
                    }
                });
                this.open = false;
            },

            addLetter: function(data){
                $('#letters_container').append(data);
                this.init($(data));
            },

            make_workable: function(letter){
                var wrap = $("<div id='image_" + letter.attr('id') + "' class='image_active'><img src='" + letter.attr('src') + "' /></div>");
                wrap.data('is_letter', true);
                $('#barRight').append(wrap);
                wrap.data("title", letter.data('title'));
                wrap.data('size', letter.data('size'));
                var page_position = $('#overview').offset();
                wrap.children().resizable({
                    aspectRatio: true,
                    resize: function(event, ui){
                        var element = $("#" + ui.element.parent().attr('id'));
                        $('#mini_' + ui.element.parent().attr('id')).animate({
                            'width': parseInt(element.css('width')) / 25 + "px",
                            'height': parseInt(element.css('height')) / 30 + "px",
                        }, 10);
                        $.fn.toolbar.refreshSize();
                    }
                });
                $('#image_' + letter.attr('id')).css(
                    {'top': page_position['top'] - 600, 'left': page_position['left']}
                ).draggable({
                    revert: false,
                    scroll: true,
                    opacity: 0.8,
                    stack: '.image_active',
                    cursor: "move",
                    aspectRatio:true,
                    drag: function (ui, event) {
                        position = $(this).offset();
                        $.fn.minimap.update_mini_map($(this).attr('id'));
                    }, 
                    stop: function(ui, event){
                        $(ui.helper).css('z-index', 0);
                    }
                });

                $('#image_' + letter.attr('id')).click(function(){
                    $(this).select();
                });

                $.fn.minimap.add_to_minimap('image_' + letter.attr('id'));
                letter.remove();
            },

            is_selected: function(letter){
                if(letter.data('selected')){
                    return true;
                } else {
                    return false;
                }
            },

            selectLetter: function(letter){
                $currentletterSelected = letter;
                var letters = this.lettersSelected;
                if(this.is_selected(letter)){
                    letter.data('selected', false);
                    letter.css('boxShadow', 'none');
                    if(letter.length == 0){
                        null;
                    } else {
                        for(i = 0; i < letters.length; i++){
                            if(letter.attr('id') == $(letters[i]).attr('id')){
                                this.lettersSelected.splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    if(typeof letter != "undefined"){
                        this.lettersSelected.push(letter);
                        letter.data('selected', true);
                        letter.css('boxShadow', '0px 0px 18px rgba(255, 246, 9, 0.94)');
                    }
                }
            },

            buttons: function(data){
                $('#' + data.attr('id')).click(function(){
                    $.fn.letters.selectLetter($(this));
                });

            },

            compare: function(file, file2){
                if(this.lettersSelected.length == 2){
                    var image1 = document.getElementById(this.lettersSelected[0].attr('id'));
                    var image2 = document.getElementById(this.lettersSelected[1].attr('id'));
                    resemble(image1).compareTo(image2).onComplete(function(data){
                        result = data;
                    }).ignoreAntialiasing();
                    return result;
                } else {
                    $('body').append("<div id='notification_letter_min' class='notify notify-error'>Choice two images to compare.</div>");
                    $("#notification_letter_min").notify({
                        "close-button":false
                    });
                }
            },

            show_comparison: function(data){
                var box_comparison = "<div class='modal box_containers' id='comparison_box'><div id='top_comparison_box' class='top_box'><span>" +
                "Images compared</span><span id='close_comparison_box' class='pull-right'><i class='icon-remove close_box'></i></div>";
                box_comparison += "<span style='margin:1%' class='pull-right'><button class='btn btn-small btn-primary' id='image_compared_to_workspace'>Add to workspace</button></span><div class='box_container' id='images_compared_div'><div><img data-is_generated='true' id='image_result_compared' src='" + data.getImageDataUrl() + "' /></div></div></div>";

                $('body').append(box_comparison);
                $('#comparison_box').show().animate({
                        "top": "30%",
                        'left': "60%",
                        'width': "30%",
                        'height': '50%',
                        'opacity': 1,
                        'z-index': 400
                    }, {
                        duration: 250,
                        complete: function () {
                            $('#close_comparison_box i').click(function(){
                                $.fn.letters.hide_box();
                            });

                            $('#image_result_compared').resizable({aspectRatio: true}).parent().draggable({
                                zIndex:0,
                                scroll: true
                            });
                        }
                }).draggable({
                    handle: '.top_box'
                }).resizable();

                $('#image_compared_to_workspace').click(function(){
                    $.fn.letters.make_workable($('#image_result_compared'));
                    $('#comparison_box').fadeOut().remove();
                });
            },

            delete: function(){
                if(this.lettersSelected.length > 0){
                    for(i = 0; i < this.lettersSelected.length; i++){
                        this.lettersSelected[i].fadeOut().remove();
                        delete $.fn.letters.lettersSelected[i];
                    }
                } else {
                    return false;
                }
                $.fn.letters.lettersSelected.clean(undefined);
            },

            to_workspace: function(){

                if(this.lettersSelected.length > 0){
                    for(i = 0; i < this.lettersSelected.length; i++){
                        $.fn.letters.make_workable(this.lettersSelected[i]);
                        delete $.fn.letters.lettersSelected[i];
                    }
                } else {
                    return false;
                }
                $.fn.letters.lettersSelected.clean(undefined);
            },

            hide_box: function(){
                $('#comparison_box').fadeOut().remove();
            }


        }

        $.fn.import = {

            manager: false,
            files: [],

            init: function(){

                this.buttons();
                this.refresh();

            },

            show: function(){
                if(this.manager == false){
                    var button_position = $('#load').position();
                    $('#import').css({
                        'top': button_position['top'],
                        'left': button_position['left'] + 300
                    });
                    $('#load').hide();
                    $('#import').show().animate({
                        "top": "14%",
                        'left': "46%",
                        'width': "40%",
                        'height': "15%",
                        'opacity': 1,
                        'z-index': 400
                    }, {
                        duration: 250,
                        complete: function () {
                            $('#close_import').click(function(){
                                $.fn.import.hide();
                            });


                            $('#open_load_from_pc').click(function(){
                                $.fn.import.show_manager();
                            });
                        }
                    }).draggable({
                        handle: '.top_box'
                    });
                } else {
                    $('#import').show().animate({
                        "top": "14%",
                        'left': "46%",
                        'width': "50%",
                        'height': "70%",
                        'opacity': 1,
                        'z-index': 400
                    }, {
                        duration: 250,
                    }).draggable({
                        handle: '.top_box'
                    }); 
                }
            },

            hide: function(){
                $('#load').show();
                var button_position = $('#load').position();

                $('#import').animate({
                    "top": button_position['top'],
                    'left': button_position['left'] + 300,
                    'width': "0%",
                    'height': "0%",
                    'opacity': 0
                }, {
                    duration: 350,
                    complete: function () {
                        $(this).hide();
                    }
                });

            },

            buttons: function(){

                $('#load').click(function(){
                    $.fn.import.show();
                });

            },

            refresh: function(){
               for(var i=0, len=localStorage.length; i<len; i++) {
                    var key = localStorage.key(i);
                    var value = localStorage[key];
                    try {
                      var json = JSON.parse(value);
                    } catch(e){
                        continue;
                    }
                    if(json['session_file']){
                        this.files.push([key, value]);
                    }
                }
            },

            refreshView: function(){
                var folder = '';
                for(i = 0; i < this.files.length; i++){
                    folder += "<div class='folder' id='" + this.files[i][0] + "'><img src='/static/img/folder.png' /><div class='folder_title'>" + this.files[i][0] + "</div></div>";
                }
                $("#import").children('.box_container').html(folder);
                $('.folder').click(function(){
                    $.fn.import.selectItem($(this));
                });
                $('.folder').dblclick(function(){
                    $.fn.import.loadFile($selectedItem.attr('id'));
                    $selectedItem.children('img').css('opacity', 1);
                    $selectedItem = undefined;
                });
            },

            selectItem: function(item){
                if (typeof $selectedItem != "undefined") {
                    $selectedItem.children('img').css('opacity', '1');
                }
                $selectedItem = item;
                $selectedItem.children('img').css('opacity', '0.5');
            },

            show_manager: function(){
                $('#import').show().animate({
                        'top': "16%",
                        'left': "45%",
                        'width': "50%",
                        'height': "70%",
                        'opacity': 1,
                        'z-index': 400
                    }, {
                        duration: 250,
                        complete: function () {
                            var folder = '';
                            var files = $.fn.import.files;
                            for(i = 0; i < files.length; i++){
                                folder += "<div class='folder' id='" + files[i][0] + "'><img src='/static/img/folder.png' /><div class='folder_title'>" + files[i][0] + "</div></div>";
                            }
                           
                            var breadcrumb = "<div class='breadcrumb'><li><a id='back_to_load'>Load a session</a> <span class='divider'>/</span></li><li class='active'>Local Manager</li> <li class='offset3' style='position:relative;right:1%;'><button id='load_session_button' class='btn btn-primary'>Load</button> <button id='delete_session_button'  class='btn btn-danger'>Delete</button></li></div>";
                            $('#top_load_box').fadeIn().html(breadcrumb);
                            $(this).children('.box_container').css('margin', 0).html(folder);

                            $('.folder').click(function(){
                                $.fn.import.selectItem($(this));
                            });

                            $('.folder').dblclick(function(){
                                if(typeof $selectedItem != "undefined"){
                                    $.fn.import.loadFile($selectedItem.attr('id'));
                                    $selectedItem.children('img').css('opacity', 1);
                                    $selectedItem = undefined;
                                } else {
                                    return false;
                                }
                            });

                            $('#load_session_button').click(function(){
                                if(typeof $selectedItem != "undefined"){
                                    $.fn.import.loadFile($selectedItem.attr('id'));
                                    $selectedItem.children('img').css('opacity', 1);
                                    $selectedItem = undefined;
                                } else {
                                    return false;
                                }
                            });

                            $('#delete_session_button').click(function(){
                                if(typeof $selectedItem != "undefined"){
                                    $.fn.import.delete_session($selectedItem.attr('id'));
                                    $selectedItem.children('img').css('opacity', 1);
                                    $selectedItem.fadeOut(300).remove();
                                    $selectedItem = undefined;
                                } else {
                                    return false;
                                }
                            });

                            $.fn.import.manager = true;
                            $('#back_to_load').click(function(){
                                    $('#top_load_box').fadeOut();
                                    var back = "<button id='open_load_from_pc' class='btn btn-primary'>Load from File</button> <button id='load_from_db' class='btn btn-primary disabled'>Load from your Account</button>";
                                    $("#import").children('.box_container').css('margin', "5%").html(back);
                                    $('#import').show().animate({
                                        "top": "14%",
                                        'left': "46%",
                                        'width': "40%",
                                        'height': "15%",
                                        'opacity': 1,
                                        'z-index': 400
                                    }, {
                                        duration: 250,
                                        complete: function(){
                                            $.fn.import.manager = false;
                                            $('#open_load_from_pc').click(function(){
                                                $.fn.import.show_manager();
                                            });
                                        }
                                    });
                                }).draggable();
                            }
                        });
            },

            delete_session: function(file){
                if (file in localStorage) localStorage.removeItem(file);
                for(i = 0; i < this.files.length; i++){
                    if(this.files[i][0] == file){
                        this.files.splice(i, 1);
                        break;
                    }
                }
            },

            loadFile: function(file){
                var file_session = localStorage.getItem(file);
                $.fn.import.parse(file_session);
                $('#import').fadeOut();
                $('#load').fadeIn();
            },

            parse: function(file){
                var json = JSON.parse(file);
                var images = [];
                var comments = [];
                var letters = [];
                var toolbar = json['session_properties']['toolbar'];
                for(i = 0; i < json['image_properties'].length; i++){ 
                    images.push(json['image_properties'][i]['image']);
                }
                for(i = 0; i < json['session_properties']['comments'].length; i++){ 
                    comments.push(json['session_properties']['comments'][i]) 
                }
                for(i = 0; i < json['session_properties']['letters'].length; i++){ 
                    console.log(json['session_properties']['letters'])
                    letters.push([json['session_properties']['letters'][i]['letter'], json['session_properties']['letters'][i]['src'], json['session_properties']['letters'][i]['size'] ]) 
                }
                this.reset();
                $.fn.import.reloadImages(images, json['image_properties']);
                $.fn.import.importComments(comments);
                $.fn.import.importLetters(letters);
                if(toolbar){
                   $.fn.import.restoreToolbar(toolbar);
                }
                $('html, body').animate({
                    scrollTop: json['session_properties']['window']['top'],
                    scrollLeft:json['session_properties']['window']['left']
                }, 1000);


            },

            reloadImages: function(images, images_properties){
                var images_loaded = [];
                var letters = [];
                for(i = 0; i < images.length; i++){
                    if((!images_properties[i]['properties']['is_letter'])){
                        $.ajax({
                            type: 'POST',
                            url: 'get-image-manuscript/',
                            data: {'image': images[i]},
                            async: false,
                            beforeSend: function(){
                                
                            },
                            success: function(data){
                                images_loaded.push(data);
                            },
                            complete: function(data){
                                
                            }
                        });
                    } else {
                        letters.push(images_properties[i]);
                    }
                }
                $.fn.import.printImages(images_loaded, images_properties);
                $.fn.import.printLetters(letters);
            },

            printLetters: function(images){
                for(i = 0; i < images.length; i++){
                    var src = unescape(images[i]['src']);
                    var image = "<div data-size = '" + images[i]['original_size'] + "' class='image_active' id='" + images[i]['image'] + "'><img src='" + unescape(src) + "' /></div>";
                    $('#barRight').append(image);
                    $("#" + images[i]['image']).css({
                            "position": "absolute",
                            "top": images[i]['position']['top'],
                            "left": images[i]['position']['left'],
                            "max-width": "none",
                            "z-index": images[i]['properties']['z-index']
                        }).draggable({
                            revert: false,
                            scroll: true,
                            opacity: 0.8,
                            stack: '.image_active',
                            cursor: "move",
                            aspectRatio:true,
                            drag: function (ui, event) {
                                position = $(this).offset();
                                $.fn.minimap.update_mini_map($(this).attr('id'));
                            }, 
                            stop: function(ui, event){
                                $(ui.helper).css('z-index', 0);
                            }
                        }).data("is_letter", true).children('img').css({
                            "width": images[i]['size']['width'],
                            'height': images[i]['size']['height']
                        }).resizable({
                            aspectRatio: true,
                            resize: function(event, ui){
                                var element = $("#" + ui.element.parent().attr('id'));
                                $('#mini_' + ui.element.attr('id')).animate({
                                    'width': parseInt(element.css('width')) / 25 + "px",
                                    'height': parseInt(element.css('height')) / 30  + "px",
                                }, 10);
                                $.fn.toolbar.refreshSize();
                            }
                        }).children('img').css({
                            "opacity": images[i]['properties']['opacity']
                        });

                        $('#' + images[i]['image']).click(function(){
                            $(this).select();
                        });

                        $.fn.minimap.add_to_minimap(images[i]['image']);
                }
            },

            printImages: function(images, images_properties){
                for(i = 0; i < images.length; i++){
                    var image = '<div data-size = "' + images_properties[i]['original_size'] + '" data-title = "' + images[i][2] + '" class="image_active" id = "' + parseInt(images[i][1]) + '">' + images[i][0] +  "<div class='image_desc'> <p><b>Manuscript</b>: " + images[i][2] + "</p> " + "<p><b>Repository</b>: " + images[i][3] +  "<p><b>Place</b>: " +  images[i][4] + "</p></div><br clear='all' /></div>";
                    $("#barRight").append(image)
                    if(images_properties[i]['image'] == images[i][1]){
                        $('#' + images[i][1]).css({
                            "position": "absolute",
                            "top": images_properties[i]['position']['top'],
                            "left": images_properties[i]['position']['left'],
                            "max-width": "none",
                            "max-height": "none",
                            "z-index": images_properties[i]['properties']['z-index']
                        }).draggable({
                            revert: false,
                            scroll: true,
                            opacity: 0.8,
                            stack: '.image_active',
                            cursor: "move",
                            drag: function (ui, event) {
                                position = $(this).offset();
                                $.fn.minimap.update_mini_map($(this).attr('id'));
                            }, 
                            stop: function(ui, event){
                                $(ui.helper).css('z-index', 0);
                            }
                        }).children('img').css({
                            "opacity": images_properties[i]['properties']['opacity'],
                            "max-width": "none",
                            "width": images_properties[i]['size']['width'],
                            'height': images_properties[i]['size']['height']
                        }).resizable({
                            aspectRatio: true,
                            resize: function(event, ui){
                                var element = $("#" + ui.attr('id'));
                                $('#mini_' + ui.element.parent().attr('id')).animate({
                                    'width': parseInt(element.css('width')) / 25 + "px",
                                    'height': parseInt(element.css('height')) / 30  + "px",
                                }, 10);
                                $.fn.toolbar.refreshSize();
                            }
                        });

                        $("#" + images[i][1]).click(function(){
                            $(this).select();
                        });

                        $.fn.minimap.add_to_minimap(images[i][1]);

                    }
                }
            },

            importComments: function(comments){
                $.fn.comments.notes = comments;
                for(i = 0; i < comments.length; i++){
                    $.fn.comments.update_notes(comments[i]);
                } 
            },

            importLetters: function(letters){
                for(i = 0; i < letters.length; i++){
                    console.log(letters[i])
                    letter = "<img class='letter' id='" + letters[i][0] + "' src ='" + unescape(letters[i][1]) + "' data-size = '" + letters[i][2] + "' />";
                    $.fn.letters.addLetter(letter);
                }
            },

            restoreToolbar: function(toolbar){
                var image = $('#' + toolbar['selectedImage']);
                image.select();
                $.fn.toolbar.init()
                $.fn.toolbar.create();
                $.fn.toolbar.refresh();
            },

            reset: function(){
                $.fn.comments.notes = [];
                $.fn.workspaceImages.imagesSelected = [];
                $.fn.letters.lettersSelected = [];
                $('.image_active').remove();
                $('.image').remove();
                $('.letter').remove();
                $.fn.minimap.clean_minimap();
                $.fn.comments.clean_notes();
                $selectedImage = undefined;
                if($.fn.toolbar.exists()){
                    $.fn.toolbar.toolbox.remove();
                }
            }

        }

        $.fn.minimap = {

            images: [],

            add_to_minimap: function(id){
                var image = $("#" + id);
                var position = image.offset();
                var top = position['top'] / $(window).height() * 30;
                var left = position['left'] / $(window).width() * 100;
                var size = image.css(['width', 'height']);
                var mini_id = 'mini_' + id;
                var element = $("<div></div>");
                element.data('image', id);
                element.attr('id', mini_id);
                element.attr('class', 'image_map');
                $('#overview').append(element);
                element.css({
                    "width": parseInt(size['width']) / 15 + "px",
                    "height": parseInt(size['height']) / 15 + "px",
                    "top": top,
                    "left": left
                });
                //this.make_scrollable("#mini_" + id);
                this.images.push(element); 
            },
            /*
            make_scrollable: function(map_image){

                $(map_image).click(function(){

                    var image = $(map_image).data('image');
                    var top = $("#" + image).css('top') - 100;
                    var left = $("#" + image).css('left') - 100;

                    $('html, body').animate({
                        scrollTop: top,
                        scrollLeft: left
                    }, 800);

                });

            },
            */
            update_mini_map: function(id){
                var image_on_workspace = $('#' + id);
                var image = {
                    'top': parseInt(image_on_workspace.css('top')) / $(window).height() * 22,
                    'left': parseInt(image_on_workspace.css('left')) / $(window).width() * 80
                };
                $("#mini_" + id).animate({
                    'left': image['left'],
                    'top': image['top']
                }, 0);
            },

            clean_minimap: function(){
                var images = this.images;
                for(i = 0; i < images.length; i++){ 
                    var id = $(images[i]).attr('id');
                    $('#' + id).remove(); 
                }
                this.images = [];
            }
        };

        $.fn.export = {

            init: function(){

                this.buttons();

            },

            show: function(){
                var button_position = $('#load').position();
                $('#export').css({
                    'top': button_position['top'],
                    'left': button_position['left'] + 200
                });
                $('#save').hide();

                $('#export').show().animate({
                    "top": "16%",
                    'left': "46%",
                    'width': "35%",
                    'height': "15%",
                    'opacity': 1,
                    'z-index': 400
                }, {
                    duration: 350,
                    complete: function () {
                        $('#close_export').click(function(){
                            $.fn.export.hide();
                        });
                    }
                }).draggable();
            },

            hide: function(){
                $('#save').show();
                var button_position = $('#save').position();
                $('#export').animate({
                    "top": button_position['top'],
                    'left': button_position['left'] + 300,
                    'width': "0%",
                    'height': "0%",
                    'opacity': 0
                }, {
                    duration: 350,
                    complete: function () {
                        $(this).hide();
                    }
                });

            },

            buttons: function(){
                $('#save').click(function(){
                    $.fn.export.show();
                });

                $('#save_to_pc').click(function(){
                    $.fn.export.main();
                });
            },
                
            exportImages: function(){
                var images = [];
                var workspace_images = $('.image_active');
                return workspace_images;
            },

            exportImagesProperties: function(images){
                var images_properties = [];
                for(i = 0; i < images.length; i++){

                    var position = function(){
                        var get_position = $(images[i]).offset();
                        return get_position;
                    };

                    var size = function(){
                        var dimension = $(images[i]).children().children('img').css(['width', "height"]);
                        return {"width": dimension['width'], 'height': dimension['height']};
                    };

                    var original_size = function(){
                        var size = $(images[i]).data('size');
                        console.log(size)
                        return size;
                    };

                    var zIndex = function(){
                        return $(images[i]).children().children('img').css('z-index');
                    };

                    var get_brightness = function(){

                        String.prototype.getNums= function(){
                            var rx=/[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
                            mapN= this.match(rx) || [];
                            return mapN.map(Number);
                        };
                        
                        var brightness = $("#slider_brightness").slider("option", "value");
                        
                        return brightness;
                    };

                    var propriety = {
                        'opacity': $(images[i]).children().children('img').css('opacity'),
                        'brightness': get_brightness(),
                        'is_letter': $(images[i]).data('is_letter')
                    };

                    var image = {
                        'image': $(images[i]).attr('id'),
                        'position': position(),
                        'size': size(),
                        'original_size': original_size(),
                        'properties': propriety,
                        "z-index": zIndex()
                    };

                    if($(images[i]).data('is_letter')){
                        var src = $(images[i]).children().children('img').attr('src');
                        image.src = src;
                    } else {
                        image.src = false;
                    }

                    images_properties.push(image);  
                    
                }

                return images_properties;
            },

            export_letters: function(){
                var letters_cropped = $('.letter');
                var letters = [];
                if(letters_cropped.length > 0){
                    for(i = 0; i < letters_cropped.length; i++){

                        var letter = {
                            'letter': $(letters_cropped[i]).attr('id'),
                            'src': $(letters_cropped[i]).attr('src'),
                            'size': $(letters_cropped[i]).data('size')
                        };

                        letters.push(letter);
                    }

                } else {

                    var letters = false;
                
                }

                return letters;

            },

            export_session_properties: function(){

                var create_toolbar = function(){
                    $.fn.toolbar.init();
                    if($.fn.toolbar.exists()){

                        var toolbar = {
                            'position': $.fn.toolbar.toolbox.position(),
                            'selectedImage': $selectedImage.attr('id')
                        };

                    } else {
                        var toolbar = false;
                    }

                    return toolbar;
                };

                var letters = this.export_letters();

                var windowPosition = function(){
                    return {'top': $(window).scrollTop(), 'left': $(window).scrollLeft()};
                };

                var general_properties = {
                    'toolbar': create_toolbar(),
                    'comments': $.fn.comments.notes,
                    'letters': letters,
                    'window': windowPosition()
                };

                return general_properties;

            },

            create: function(){
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

            main: function(){
           
                var data_session = $.fn.export.create();
                var item = $('#name_export').val();
                if(item != ''){
                    if(localStorage.getItem(item) == null){
                        localStorage.setItem(item, JSON.stringify(data_session));
                        var element = localStorage.getItem(item);
                        $.fn.import.files.push([item, element]);
                        if($.fn.import.manager){
                            $.fn.import.refreshView();
                        }
                        $('#export').fadeOut();
                        $('#save').fadeIn();
                    } else {
                        $('body').append("<div id='notification_save' class='notify notify-error'>The name chosen already exists. Please try again.</div>");
                        $('#notification_save').notify({
                            'close-button': false
                        });
                    }
                } else {
                    $('body').append("<div id='notification_save' class='notify notify-error'>Insert a valid name to save this session</div>");
                    $('#notification_save').notify({
                        'close-button': false
                    });
                }
               
            }
        };

        $.fn.align = {

            align: function(){
                var images = $('.image_active');
                for(i = 0; i < images.length; i++){
                    $(images[i]).css({
                        "float": "left",
                        "position":"relative",
                        "left": "2%"
                    });
                }
            }  

        };

        /*

        $.fn.menu = {

            init: function(){

                this.show();
                this.buttons();

            },

            show: function(){

            },

            hide: function(){

            },

            buttons: function(){

            }

        }

        */

        function main(){

            Array.prototype.clean = function(deleteValue) {
              for (var i = 0; i < this.length; i++) {
                if (this[i] == deleteValue) {         
                  this.splice(i, 1);
                  i--;
                }
              }
              return this;
            };

            $.fn.imagesBox.init(); // Launch window images function

            // Select an image and make it the image selected through the variable $selectedFeature
            $.fn.select = function () {
                if (typeof $selectedImage != "undefined") {
                    $selectedImage.children().css('box-shadow', 'none');
                }
                $selectedImage = $(this);
                $selectedImage.children().css('boxShadow', '0px 0px 18px rgba(255, 246, 9, 0.94)');
                $.fn.toolbar.init();
                if (!$.fn.toolbar.exists()) {
                    $.fn.toolbar.create();
                    $.fn.toolbar.refresh();
                } else {
                    $.fn.toolbar.refresh();
                }
                return false;
            };

            var images_on_minimap = [];

            // Check if the image is selected
            $.fn.is_selected = function () {
                if (typeof $selectedImage != "undefined" && $(this).attr('id') == $selectedImage.attr('id')) {
                    return true;
                } else {
                    return false;
                }
            };

            // Get the images on workspace
            $.fn.images_on_workspace = function () {
                var images = $('.image_active');
                return images;
            };

            $('img').tooltip({
                placement: 'bottom',
                trigger: 'hover'
            });
            
            $('#marker').draggable({
                scroll: false,
                opacity: 0.5,
                cursor:'move',
                containment: $('#overview'),
                appendTo:'body',
                revert:'invalid'
            });


            $(window).scroll(function(event){
                var position = {
                  'top': $(window).scrollTop() / $(window).height() * 19,
                  'left': $(window).scrollLeft() / $(window).width() * 120
                };
                $('#marker').animate({
                    'left': position['left'],
                    'top': position['top']
                }, 0);
            });

            $('#notes_button').click(function(){
                $.fn.comments.show_notes();
            });

            $('#letters_button').click(function(){
                $.fn.letters.open_lettersbox();
            }); 

            $.fn.export.init();
            $.fn.import.init();

        }

        main();
      
    })();

});