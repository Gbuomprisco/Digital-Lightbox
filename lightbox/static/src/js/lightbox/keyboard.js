this.keyboardEvents = {
    _self: this,
    init: function() {
        this.events();
    },

    events: function() {


        $(document).on('keydown', function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);

            if (e.altKey) {

                if (code == 78) {
                    if (_self.comments.open) {
                        _self.comments.hide_notes();
                    } else {
                        _self.comments.show_notes();
                    }
                }

                if (code == 73) {
                    if (!_self.imagesBox.open) {
                        _self.imagesBox.show();
                    } else {
                        _self.imagesBox.hide();
                    }
                }

                if (code == 82) {
                    if (_self.letters.open) {
                        _self.letters.hide_letters();
                    } else {
                        _self.letters.open_lettersbox();
                    }
                }

                if (code == 83) {
                    if (!_self.export.open) {
                        _self.export.show();
                    } else {
                        _self.export.hide();
                    }
                }

                if (code == 76) {
                    if (_self.import.open) {
                        _self.import.hide();
                    } else {
                        _self.import.show();
                    }
                }

                if (code == 77) {
                    if (_self.menu.open) {
                        _self.menu.hide();
                    } else {
                        _self.menu.show();
                    }
                }
            }


        });

    }

};