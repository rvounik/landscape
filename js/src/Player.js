
export function someMethodThatLivesOutsideThePlayerClass() {
    return true;
}

/*
 let player = new createjs.Shape();
 player.graphics.beginFill('#ff0000').drawRect(0, 0, 1, 1).endFill();
 stage.addChild(player);
 */

export default class Player extends createjs.Shape {
    constructor(options) {
        super(); // since we are extending the Shape class, we call super() to inherit its props
        let c = new createjs.Shape();
        c.graphics
            .beginFill('#ff0000')
            .drawRect(0, 0, 1, 1).endFill();
        c.x = options.x;
        c.y = options.y;
        c.rotation = options.rotation;
    }
    /* some method in the Player class
     someMethodThatLivesInsideThePlayerClass() {
        return '(' + this.x + ', ' + this.y + ')';
    }
    */
}
