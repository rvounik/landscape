
var canvas, stage, container, gctx, map, player, rayArray = [], KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39, KEYCODE_UP = 38, KEYCODE_DOWN = 40, leftHeld, rightHeld, upHeld, downHeld, loaded = false; // set some *GASP* global vars
var fov = 70, depth = 80, steps = 8, maph = 300, mapw = 300, resx = 75, resy = 150, fps = 30, speed = 1.8; //engine config
var rayShift = mapw / resx, rotShift = fov / resx, pi = 3.14159265359; // some precalculations to improve engine speed
var oldrot, oldx, oldy;

function init() {
    // build up canvas & stage
    canvas = document.getElementById("mycanvas");
    stage = new createjs.Stage(canvas);

    // create 'ghost canvas' from which pixel data is subtracted
    ghostcanvas = document.createElement('canvas');
    ghostcanvas.height = canvas.height;
    ghostcanvas.width = canvas.width;
    gctx = ghostcanvas.getContext('2d');

    // load image assets
    map = new Image();
    map.src = "img/pic-heightmap.png";
    map.onload = createAssets;

    // register document key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // create ticker
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(fps);
}

function createAssets() {
    bitmap = new createjs.Bitmap(map);
    bitmap.x = bitmap.y = 0;
    stage.addChild(bitmap);
    stage.update();
    gctx.drawImage(map, 0, 0);

    //create the player
    player = new createjs.Shape();
    player.graphics.beginFill('#ff0000').drawRect(0, 0, 1, 1).endFill();
    stage.addChild(player);
    player.x = 208; // player needs to be at the global x=160, not the local one as initiated by this shape creation
    player.y = 105;
    player.rotation = 185;

    los = new createjs.Shape();
    los.graphics.setStrokeStyle(0.5);
    los.graphics.beginStroke("rgba(255,0,0,1)").moveTo(0, 0).lineTo(0, (0 - depth)).endStroke();
    stage.addChild(los);

    container = new createjs.Container();
    stage.addChild(container);
    container.x = 300;
    container.y = 300;

    createDebug();

    loaded = true; //all externals are loaded and assets are generated, set 'loaded' flag to true
}

function handleKeyDown(e) {
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_LEFT:
            leftHeld = true;
            return false;
        case KEYCODE_RIGHT:
            rightHeld = true;
            return false;
        case KEYCODE_UP:
            upHeld = true;
            break;
        case KEYCODE_DOWN:
            downHeld = true;
            break;
    }
}

function handleKeyUp(e) {
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_LEFT:
            leftHeld = false;
            break;
        case KEYCODE_RIGHT:
            rightHeld = false;
            break;
        case KEYCODE_UP:
            upHeld = false;
            break;
        case KEYCODE_DOWN:
            downHeld = false;
            break;
    }
}

function getRGB() {

    container.removeAllChildren(); // remove all previous shapes

    // get user height
    var imageData = gctx.getImageData(player.x, player.y, 1, 1);
    var userHeight = imageData.data[0];
    if (userHeight < 0) {
        userHeight = 0
    }

    containerbg = new createjs.Shape(); // background colour for container
    containerbg.graphics.beginFill('#98bfff').drawRect(0, 0, mapw, 0 - maph).endFill();
    containerbg.x = containerbg.y = 0;
    container.addChild(containerbg);

    for (a = 0; a < resx; a++) {
        oldx = player.x;
        oldy = player.y;
        calcrot = ((0 - player.rotation + 180) - (fov / 2)) + a * rotShift; // this is calculating the rotation shift of the current ray in the loop. determined by fov, player rotation and resolution
        for (b = 0; b < steps; b++) {
            var getCoords = getLineEndCoords(oldx, oldy, (depth / steps), calcrot); // for each of the rays x amount of steps are made 'along the ray' and..
            var imageData = gctx.getImageData(getCoords[0], getCoords[1], 1, 1); // ..on each position pixel data is read from the bitmap
            var height = imageData.data[0]; // since heightmap holds gray scales only (colour value 0-255), take just one of the rgb values, they will always be equal. stick with [0], which is red and declare it as height
            rayArray.push(height); // store height in array
            oldx = getCoords[0]; // next step is calculated from current x,y, so the old coords need to be stored in a var
            oldy = getCoords[1];

            /*
             //just as a test, plot dots on the returned x,y positions
             dot = new createjs.Shape();
             dot.graphics.beginFill('#ff0000').drawRect(0, 0, 1, 1).endFill(); //width + height of shape is determined by resolution of output
             stage.addChild(dot);
             dot.x = oldx;
             dot.y = oldy;
             */
        }
        rayArray.reverse(); // reverse the array, draw shapes first that are in the background
        for (c = 0; c < rayArray.length; c++) { // for each 'step' a shape is created, set to the size of the height that was read from the bitmap
            rayGfx = new createjs.Shape();
            blue = -150 - rayArray[c];
            if (blue < 0) {
                blue = 0
            }
            green = 255 * rayArray[c];
            red = 65536 * (55);
            color = (blue + green + red).toString(16); // quick conversion to hex
            rayGfx.graphics.beginFill('#' + color).drawRect(0, 0, mapw / resx, ((userHeight / 3) - rayArray[c])).endFill(); // width + height of shape is determined by selected output resolution
            rayGfx.x = (mapw - rayShift) - ((a * (rayShift))); // shift x amount of pixels according on resx
            container.addChild(rayGfx);
        }
        rayArray = [];
    }
}

function getLineEndCoords(originX, originY, hypotenuse, angle) { // feed it with angle and length of the 'opposite' (longest side) and it will calculate matching x,y coords.
    x = originX + (Math.sin(angle * (pi / 180))) * hypotenuse;
    y = originY + (Math.cos(angle * (pi / 180))) * hypotenuse;
    return [x, y];
}


function createDebug() {
    fps = new createjs.Text("fps", "14px Arial", "#fff");
    fps.x = fps.y = 10;
    stage.addChild(fps);
}

function handleTick() {
    if (loaded) {

        if (leftHeld) { // handle rotation
            player.rotation -= 3 * speed;
        } else if (rightHeld) {
            player.rotation += 3 * speed;
        }

        if (upHeld) { // handle translation
            player.x -= speed * Math.sin(player.rotation * (pi / -180));
            player.y -= speed * Math.cos(player.rotation * (pi / -180));
        } else if (downHeld) {
            player.x += speed * Math.sin(player.rotation * (pi / -180));
            player.y += speed * Math.cos(player.rotation * (pi / -180));
        }

        los.rotation = player.rotation;
        los.x = player.x;
        los.y = player.y;
    }
    if (oldrot == player.rotation && oldx == player.x && oldy == player.y) {
    } else {
        getRGB();
        oldrot = player.rotation;
        oldx = player.x;
        oldy = player.y;
    }
    fps.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    stage.update();
}

