let Shape = window.createjs.Shape;

export class Circle extends Shape {
    constructor(options) {
        super();
        // The Shape class's constructor doesn't fire through the normal
        // ES6 constructor->super() function, so we have to initiate the
        // old way, and then return it as as the constructed object
        let c = new Shape();

        c.color = options.color;
        c.graphics
            .beginFill(options.color)
            .drawCircle(0, 0, options.radius);
        c.x = options.x;
        c.y = options.y;

        return c;
    }
}
