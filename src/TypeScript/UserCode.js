export class ArgumentsServiceCallee {
    constructor() {
        this._orders = [];
        for (let i = 0; i < 50; ++i) {
            this._orders.push(i);
        }
    }
    ping() {
    }
    add2(a, b) {
        return (a + b);
    }
    stars(nick = "somebody", stars = 0) {
        return (`${nick} starred ${stars}x`);
    }
    orders(product, limit = 5) {
        return this._orders.slice(0, limit).map(index => `Product ${index}`);
    }
}
