import $ from 'jquery';

//import easeljs from 'easeljs/lib/easeljs-0.8.2.combined';

((config) => {

    $(document).ready(() => {

        // quick test
        var stage = new createjs.Stage(config.selector.canvas);
        var shape = new createjs.Shape();
        shape.graphics.beginFill('red').drawRect(100, 100, 100, 100);
        stage.addChild(shape);
        stage.update();

    });

})(appConfig);
