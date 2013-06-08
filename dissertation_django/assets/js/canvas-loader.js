$.fn.loadCanvas = function(images){

      this.stage = new Kinetic.Stage({
        container: "barRight",
        width: 2500,
        height: 2500
      });

      this.imagesGroup = new Kinetic.Group({
        x: 270,
        y: 100,
        draggable: true
      });

      this.layer = new Kinetic.Layer();
      this.layer.add(this.imagesGroup);
      this.stage.add(this.layer);

      this.stage.draw();

  function update(group, activeHandle) {
      var topLeft = group.get(".topLeft")[0],
          topRight = group.get(".topRight")[0],
          bottomRight = group.get(".bottomRight")[0],
          bottomLeft = group.get(".bottomLeft")[0],
          image = group.get(".image")[0],
          activeHandleName = activeHandle.getName(),
          newWidth,
          newHeight,
          imageX,
          imageY;

      // Update the positions of handles during drag.
      // This needs to happen so the dimension calculation can use the
      // handle positions to determine the new width/height.
      switch (activeHandleName) {
          case "topLeft":
              topRight.setY(activeHandle.getY());
              bottomLeft.setX(activeHandle.getX());
              break;
          case "topRight":
              topLeft.setY(activeHandle.getY());
              bottomRight.setX(activeHandle.getX());
              break;
          case "bottomRight":
              bottomLeft.setY(activeHandle.getY());
              topRight.setX(activeHandle.getX());
              break;
          case "bottomLeft":
              bottomRight.setY(activeHandle.getY());
              topLeft.setX(activeHandle.getX());
              break;
      }

      // Calculate new dimensions. Height is simply the dy of the handles.
      // Width is increased/decreased by a factor of how much the height changed.
      newHeight = bottomLeft.getY() - topLeft.getY();
      newWidth = image.getWidth() * newHeight / image.getHeight();

      // Move the image to adjust for the new dimensions.
      // The position calculation changes depending on where it is anchored.
      // ie. When dragging on the right, it is anchored to the top left,
      //     when dragging on the left, it is anchored to the top right.
      if(activeHandleName === "topRight" || activeHandleName === "bottomRight") {
          image.setPosition(topLeft.getX(), topLeft.getY());
      } else if(activeHandleName === "topLeft" || activeHandleName === "bottomLeft") {
          image.setPosition(topRight.getX() - newWidth, topRight.getY());
      }

      imageX = image.getX();
      imageY = image.getY();

      // Update handle positions to reflect new image dimensions
      topLeft.setPosition(imageX, imageY);
      topRight.setPosition(imageX + newWidth, imageY);
      bottomRight.setPosition(imageX + newWidth, imageY + newHeight);
      bottomLeft.setPosition(imageX, imageY + newHeight);

      // Set the image's size to the newly calculated dimensions
      if(newWidth && newHeight) {
          image.setSize(newWidth, newHeight);
      }
    }


    function addAnchor(group, x, y, name) {
      var stage = this.stage;
      var layer = this.layer;

      var anchor = new Kinetic.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 5,
        name: name,
        draggable: true,
        dragOnTop: false
      });

      anchor.on("dragmove", function() {
        update(group, this);
        layer.draw();
      });
      anchor.on("mousedown touchstart", function() {
        group.setDraggable(false);
        this.moveToTop();
      });
      anchor.on("dragend", function() {
        group.setDraggable(true);
        layer.draw();
      });
      // add hover styling
      anchor.on("mouseover", function() {
        var layer = this.getLayer();
        document.body.style.cursor = "pointer";
        this.setStrokeWidth(4);
        layer.draw();
      });
      anchor.on("mouseout", function() {
        var layer = this.getLayer();
        document.body.style.cursor = "default";
        this.setStrokeWidth(2);
        layer.draw();
      });

      //group.add(anchor);
    }

    function addImages(images){
      for(i = 0; i < images.length; i++){
        var new_image = new Kinetic.Image({
          x: 0,
          y: 0,
          image: images[i].image,
          width: 200,
          height: 138,
          name: "image",
          id: $(images[i]).attr('id')
        });

        this.imagesGroup.add(new_image);
      }

      addAnchor(this.imagesGroup, 0, 0, "topLeft");
      addAnchor(this.imagesGroup, 200, 0, "topRight");
      addAnchor(this.imagesGroup, 200, 138, "bottomRight");
      addAnchor(this.imagesGroup, 0, 138, "bottomLeft");

      this.imagesGroup.on("dragstart", function() {
        this.moveToTop();
      });
    }

    function loadImages(sources, callback) {
      var images = {};
      var loadedImages = 0;
      var numImages = 0;
      for(var src in sources) {
        numImages++;
      }
      for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
          if(++loadedImages >= numImages) {
            callback(images);
          }
        };
        images[src].src = sources[src].src;
      }
    }

    $.fn.get_canvas_images = function(){
      var images = this.stage.get('.image');
      return images;
    };

    $.fn.getImageById = function(id){
      var image = this.stage.get(id);
      return image;
    };

    loadImages(images, addImages);

};