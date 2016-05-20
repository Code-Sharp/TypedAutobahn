var connection = new autobahn.Connection({ url: "ws://127.0.0.1:8080/ws", realm: "realm1" });
connection.open();
var MySubscriberImpl = (function () {
    function MySubscriberImpl() {
    }
    MySubscriberImpl.prototype.onHeartbeat = function () {
        console.log("Heartbeat");
    };
    MySubscriberImpl.prototype.onTopic2 = function (number1, number2, c, d) {
        console.log("number1:" + number1 + " number2:" + number2 + " c:" + c + " d:" + d);
    };
    return MySubscriberImpl;
}());
connection.onopen = function (session, details) {
    var serviceProvider = new IMySubscriberProvider(session);
    var promise = serviceProvider.registerSubscriber(new MySubscriberImpl());
    promise.then(function (x) { return console.log("all registered!"); });
    //let serviceProvider = new IArgumentsServiceProvider(session);
    //var promise = serviceProvider.registerCallee(new ArgumentsServiceCallee());
    //promise.then(x => console.log("all registered!"));
    //var proxy = serviceProvider.getCalleeProxy();
    //proxy.ping().then(() => console.log("Pinged!"));
    //proxy.add2(2, 3).then(result => console.log("Add2:", result));
    //proxy.stars().then(res => console.log("Starred 1:", res));
    //proxy.stars("Homer").then(res => console.log("Starred 2:", res));
    //proxy.stars(null, 5).then(res => console.log("Starred 3:", res));
    //proxy.stars("Homer", 5).then(res => console.log("Starred 4:", res));
    //proxy.orders("coffee");
    //proxy.orders("coffee", 10);
};
