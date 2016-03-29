import $ from 'jquery'; // confused as hell. how can you call methods from jquery INSIDE the anon func ((config){} ? thats whats being done in psybizz index.js too! how does this work??
let createjs = window.createjs; // easeljs/createjs has modularity issues, this is the way to include it currenctly. please see https://gist.github.com/iamkether/752e381e03ddcb78f637
import { Circle } from './shapes/circle'; // lets start by having an external class for a rectangular shape that can be imported here

((config) => {

    $(document).ready(() => {
        // in here you put click handlers and such
    });

    // actual app code goes here, outside the document.ready to keep those separated

    // init the canvas and set some.. globals. OH NO NOT AGAIN.. what am I doing wrong?
    let stage = new createjs.Stage(config.selector.canvas);
    let scaleInc = 0;
    let inc = 0;

    // now construct a disc from the imported Circle class and hand over its constructor props (there is another word for that, I forgot)
    let disc = new Circle({
        x: 100,
        y: 100,
        radius: 50,
        color: 'red'
    });

    // add the instance to the stage
    stage.addChild(disc);

    // add the createjs' ticker function
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(config.fps);

    // define ticker
    function handleTick() {
        // do something dynamic
        disc.scaleX = disc.scaleY = 1 + scaleInc;
        scaleInc += (Math.sin(inc)/100);
        inc += 0.05;
        stage.update();
    }

})(appConfig);


