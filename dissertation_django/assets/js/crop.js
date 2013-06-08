$(image).click(function(){
    $(image).children().children('img').Jcrop({
        bgColor:     'black',
        bgOpacity:   .4,
        setSelect:   [ 100, 100, 50, 50 ],
        aspectRatio: 16 / 9
    });
});