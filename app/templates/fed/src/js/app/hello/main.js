define(function(require) {
    require('./style.css');
    var Spinning = require('./spinning');
    var s = new Spinning('#container');
    s.render();
});



