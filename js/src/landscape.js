import $ from 'jquery'; // confused as hell. how can you call methods from jquery INSIDE the anon func ((config){} ? thats whats being done in psybizz index.js too! how does this work??
let createjs = window.createjs; // easeljs/createjs has modularity issues, this is the way to include it currently. please see https://gist.github.com/iamkether/752e381e03ddcb78f637
// reuse for ray assets etc: import { Circle } from './shapes/circle'; // lets start by having an external class for a circular shape that can be imported here

((config) => {
    // todo: we need these as globals throughout the app. is it okay to store them here?
    let leftHeld = false;
    let rightHeld = false;
    let upHeld = false;
    let downHeld = false;
    let rayArray = [];

    $(document).ready(() => {
        const KEYCODE_LEFT = 37;
        const KEYCODE_RIGHT = 39;
        const KEYCODE_UP = 38;
        const KEYCODE_DOWN = 40;

        document.onkeydown = function(event) {
            switch (event.keyCode) {
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
        };

        document.onkeyup = function(event) {
            switch (event.keyCode) {
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
        };

        // init application
        init();
    });

    function init() {
        const canvas = document.getElementById(config.selector.canvas);
        const stage = new createjs.Stage(canvas);

        // create 'ghost canvas' from which pixel data is subtracted
        const ghostcanvas = document.createElement('canvas');
        ghostcanvas.height = canvas.height;
        ghostcanvas.width = canvas.width;
        const gctx = ghostcanvas.getContext('2d');

        // load image assets
        let map = new Image();
        map.src = 'web/assets/img/pic-heightmap.png';
        map.onload = function() {
            const bitmap = new createjs.Bitmap(map);
            bitmap.x = bitmap.y = 0;
            stage.addChild(bitmap);
            stage.update();
            gctx.drawImage(map, 0, 0);

            // create the player
            const player = new createjs.Shape();
            player.graphics.beginFill('#ff0000').drawRect(0, 0, 1, 1).endFill();
            stage.addChild(player);
            player.x = 208; // player needs to be at the global x=160, not the local one as initiated by this shape creation
            player.y = 105;
            player.rotation = 185;

            const los = new createjs.Shape();
            los.graphics.setStrokeStyle(.5);
            los.graphics.beginStroke('rgba(255, 0, 0, 1)').moveTo(0, 0).lineTo(0, (0 - config.config.depth)).endStroke();
            stage.addChild(los);

            const container = new createjs.Container();
            stage.addChild(container);
            container.x = 300;
            container.y = 300;

            // create ticker
            createjs.Ticker.addEventListener('tick', handleTick).bind(this);
            createjs.Ticker.setFPS(config.config.fps);
        };
    }

    function handleTick() {
        if (leftHeld) { // handle rotation
            player.rotation -= 3 * config.config.speed;
        } else if (rightHeld) {
            player.rotation += 3 * config.config.speed;
        }

        if (upHeld) { // handle translation
            player.x -= config.config.speed * Math.sin(player.rotation * (config.config.pi / -180));
            player.y -= config.config.speed * Math.cos(player.rotation * (config.config.pi / -180));
        } else if (downHeld) {
            player.x += config.config.speed * Math.sin(player.rotation * (config.config.pi / -180));
            player.y += config.config.speed * Math.cos(player.rotation * (config.config.pi / -180));
        }

        los.rotation = player.rotation;
        los.x = player.x;
        los.y = player.y;

        if (oldrot == player.rotation && oldx == player.x && oldy == player.y) {
        } else {
            getRGB();
            oldrot = player.rotation;
            oldx = player.x;
            oldy = player.y;
        }

        stage.update();
    }

    function getRGB() {
        // todo: import this

        container.removeAllChildren(); // remove all previous shapes

        // get user height
        let imageData = gctx.getImageData(player.x, player.y, 1, 1);
        let userHeight = imageData.data[0];
        if (userHeight < 0) {
            userHeight = 0;
        }

        let containerbg = new createjs.Shape(); // background colour for container
        containerbg.graphics.beginFill('#98bfff').drawRect(0, 0, config.config.mapw, 0 - config.config.maph).endFill();
        containerbg.x = containerbg.y = 0;
        container.addChild(containerbg);

        for (let a = 0; a < config.config.resx; a++) {
            let oldx = player.x;
            let oldy = player.y;
            let calcrot = ((0 - player.rotation + 180) - (config.config.fov / 2)) + a * rotShift; // this is calculating the rotation shift of the current ray in the loop. determined by fov, player rotation and resolution
            for (let b = 0; b < config.config.steps; b++) {
                let getCoords = getLineEndCoords(oldx, oldy, (config.config.depth / config.config.steps), calcrot); // for each of the rays x amount of steps are made 'along the ray' and..
                let imageData = gctx.getImageData(getCoords[0], getCoords[1], 1, 1); // ..on each position pixel data is read from the bitmap
                let height = imageData.data[0]; // since heightmap holds gray scales only (colour value 0-255), take just one of the rgb values, they will always be equal. stick with [0], which is red and declare it as height
                rayArray.push(height); // store height in array
                oldx = getCoords[0]; // next step is calculated from current x,y, so the old coords need to be stored in a var
                oldy = getCoords[1];
            }
            rayArray.reverse(); // reverse the array, draw shapes first that are in the background
            for (let c = 0; c < rayArray.length; c++) { // for each 'step' a shape is created, set to the size of the height that was read from the bitmap
                let rayGfx = new createjs.Shape();
                let blue = -150 - rayArray[c];
                if (blue < 0) {
                    blue = 0;
                }
                let green = 255 * rayArray[c];
                let red = 65536 * (55);
                let color = (blue + green + red).toString(16); // quick conversion to hex
                rayGfx.graphics.beginFill('#' + color).drawRect(0, 0, config.config.mapw / config.config.resx, ((userHeight / 3) - rayArray[c])).endFill(); // width + height of shape is determined by selected output resolution
                rayGfx.x = (config.config.mapw - rayShift) - ((a * (rayShift))); // shift x amount of pixels according on resx
                container.addChild(rayGfx);
            }
            rayArray = [];
        }
    }

    function getLineEndCoords(originX, originY, hypotenuse, angle) { // feed it with angle and length of the 'opposite' (longest side) and it will calculate matching x,y coords.
        let x = originX + (Math.sin(angle * (config.config.pi / 180))) * hypotenuse;
        let y = originY + (Math.cos(angle * (config.config.pi / 180))) * hypotenuse;
        return [x, y];
    }

})(appConfig);
