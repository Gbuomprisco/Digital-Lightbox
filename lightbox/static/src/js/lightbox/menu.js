this.menu = {
    _self: this,
    open: true,

    init: function() {
        this.buttons();
    },

    hide: function() {
        this.open = false;
        $('#buttons').animate({
            'left': '-10%'
        }, 300);
        $('#icon-up').css({
            'background-position': '-60px 0'
        });
    },

    show: function() {
        this.open = true;
        $('#buttons').animate({
            'left': '0'
        }, 300);
        $('#icon-up').css({
            'background-position': '-45px -15px'
        });
    },

    buttons: function() {
        $('#menu').click(function() {
            var status = _self.menu.open;
            if (!status) {
                _self.menu.show();
            } else {
                _self.menu.hide();
            }
        });
    }
};