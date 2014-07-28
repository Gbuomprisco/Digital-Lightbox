this.workspaceImages = {
    _self: this,
    beingDragged: false,
    workspace: this.defaults.selectors.workspace1,
    draggableOptions: {
        revert: 'valid',
        opacity: 0.7,
        stack: '.image_active',
        cursor: "move",
        scroll: true,

        drag: function(event, ui) {
            position = $(this).offset();
            _self.minimap.update_mini_map(ui);
        },
        stop: function(event, ui) {
            $(event.toElement).one('click', function(e) {
                e.stopImmediatePropagation();
            });
        }
    },

    init: function() {
        //var workspaces = $('.workspace');
        //workspaces.fadeOut();
        //$(this.workspace).fadeIn();
        this.make_images_draggable();
    },

    make_images_draggable: function() {
        var draggableOptions = this.draggableOptions;
        $('.image_active').draggable(draggableOptions).children('img').addClass('img-responsive');
    }

};