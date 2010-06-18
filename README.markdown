Trapper.js is a super-awesome data binding engine for JavaScript. It's simple to use yourself:

    var car = new Trapper({make: "DeLorean", model: "DMC-12", speed: 27, gas: 0.85});
    
    car.bind('speed', function(speed){
    	console.log("We're going " + speed + " miles per hour!");
    });
    
    car.set('speed', 53);
    // → "We're going 53 miles per hour!"

You can put any data in a trapper, but arrays and plain objects get special treatment. You can dive as deep as you want when setting or getting with dot syntax (`auction.get("bidders.0.bid")`) or arrays (`workOrder.set(['time', 'start'], '8:30')`).

You can bind at any level of a `Trapper`, and even grab a reference to a value inside the structure:

    var speed = car.resolve('speed');
    
    speed.set(64);
    // → "We're going 64 miles per hour!"

Trapper works like magic with [`stencil.js`](http://github.com/Sidnicious/stencil.js), my `jquery-haml` templating library:

    $(document.body).stencil(['#speed', 'Current speed: ', {key: 'speed'}, ' MPH']);
    // → <div id="speed">Current speed: 53 MPH</div>
    speed.set('88');
    // → "We're going 88 miles per hour!"
    // → <div id="speed">Current speed: 88 MPH</div>

…even with directives like `children`:

var tags = new Trapper(['awesome', 'pink', 'fluffy', 'puppy']);
$('#tags').stencil({key: '', children:['%span', {key: ''}]});

`Trapper.js` is brand new! If you run into any problems, file an issue. If you want to help, send me a message or fork and hack away.