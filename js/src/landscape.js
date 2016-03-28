//import createjs from 'createjs'; //https://github.com/CreateJS/PreloadJS/issues/85
//import canvas from 'canvas';
//import createjs from 'node-easel';
//import renderTree from './partials/renderTree';
//import userControls from './partials/userControls';

import $ from 'jquery';
import createjs from 'createjs';
import easeljs from 'easeljs';

((config) => {
    $(document).ready(() => {

    // quick test
    var stage = new createjs.Stage(config.selector.canvas);
    var shape = new createjs.Shape();
    shape.graphics.beginFill('red').drawRect(0, 0, 120, 120);
    stage.addChild(shape);
    stage.update();

    // load bitmap of heightmap to canvas object using createjs
    // with the exact id handed over by an appConfig parameter
    // etc.

    });
})(appConfig);
