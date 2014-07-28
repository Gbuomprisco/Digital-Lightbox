this.align = {
    _self: this,

    align: function(position) {
        var images = $('.selected');
        var page_position = $(window).scrollTop();

        for (var i = 0; i < images.length; i++) {
            img = $(images[i]);
            img.css('position', 'relative').css('margin', '10px');
            if (!img.index()) {
                if (position == 'Top') {
                    img.animate({
                        'top': 0,
                    }, 100);
                } else if (position == 'Bottom') {
                    page_position = $(window).height() - img.height();
                    img.animate({
                        'top': page_position,
                    }, 100);
                } else if (position == 'Center') {
                    page_position = ($(window).height() - img.height()) / 2;
                    img.animate({
                        'top': page_position,
                    }, 100);
                } else if (position == 'Left') {
                    img.animate({
                        'left': $(window).scrollLeft(),
                    }, 100);
                } else if (position == 'Right') {
                    img.animate({
                        'left': $(window).width() / 2,
                    }, 100);
                }
            } else {
                img.css({
                    'position': 'relative',
                });
                if (position == 'Top') {
                    img.animate({
                        'top': 0,
                    }, 100);
                } else if (position == 'Bottom') {
                    page_position = $(window).height() - img.height();
                    img.animate({
                        'top': page_position,
                    }, 100);
                } else if (position == 'Center') {
                    page_position = ($(window).height() - img.height()) / 2;
                    img.animate({
                        'top': page_position,
                    }, 100);
                } else if (position == 'Left') {
                    img.animate({
                        'left': $(window).scrollLeft(),
                    }, 100);
                } else if (position == 'Right') {
                    img.animate({
                        'left': $(window).width() / 2,
                    }, 100);
                }
            }
        }
    }

};