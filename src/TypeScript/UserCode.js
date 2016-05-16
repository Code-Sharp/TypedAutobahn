var ArgumentsServiceCallee = (function () {
    function ArgumentsServiceCallee() {
        this._orders = [];
        for (var i = 0; i < 50; ++i) {
            this._orders.push(i);
        }
    }
    ArgumentsServiceCallee.prototype.ping = function () {
    };
    ArgumentsServiceCallee.prototype.add2 = function (a, b) {
        return (a + b);
    };
    ArgumentsServiceCallee.prototype.stars = function (nick, stars) {
        if (nick === void 0) { nick = "somebody"; }
        if (stars === void 0) { stars = 0; }
        return (nick + " starred " + stars + "x");
    };
    ArgumentsServiceCallee.prototype.orders = function (product, limit) {
        if (limit === void 0) { limit = 5; }
        return this._orders.slice(0, limit).map(function (index) { return "Product " + index; });
    };
    return ArgumentsServiceCallee;
}());
