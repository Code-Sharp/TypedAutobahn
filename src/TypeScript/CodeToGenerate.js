var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArgumentsServiceProvider = (function (_super) {
    __extends(ArgumentsServiceProvider, _super);
    function ArgumentsServiceProvider(session) {
        _super.call(this, session);
    }
    ArgumentsServiceProvider.prototype.registerCallee = function (instance) {
        return autobahn.when.join(_super.prototype.registerInstanceMethodInfoAsCallee.call(this, instance, ArgumentsServiceMetadata.ping), _super.prototype.registerInstanceMethodInfoAsCallee.call(this, instance, ArgumentsServiceMetadata.add2), _super.prototype.registerInstanceMethodInfoAsCallee.call(this, instance, ArgumentsServiceMetadata.stars), _super.prototype.registerInstanceMethodInfoAsCallee.call(this, instance, ArgumentsServiceMetadata.orders));
    };
    ArgumentsServiceProvider.prototype.registerSubscriber = function (instance) {
        return When.resolve([]);
    };
    ArgumentsServiceProvider.prototype.getCalleeProxy = function () {
        return new ArgumentsServiceProxy(this._session);
    };
    return ArgumentsServiceProvider;
}(RealmServiceProviderBase));
var ArgumentsServiceProxy = (function (_super) {
    __extends(ArgumentsServiceProxy, _super);
    function ArgumentsServiceProxy(session) {
        _super.call(this, session);
    }
    ArgumentsServiceProxy.prototype.ping = function () {
        return _super.prototype.singleInvokeAsync.call(this, ArgumentsServiceMetadata.ping, []);
    };
    ArgumentsServiceProxy.prototype.add2 = function (a, b) {
        return _super.prototype.singleInvokeAsync.call(this, ArgumentsServiceMetadata.add2, [a, b]);
    };
    ArgumentsServiceProxy.prototype.stars = function (nick, stars) {
        return _super.prototype.singleInvokeAsync.call(this, ArgumentsServiceMetadata.stars, [nick, stars]);
    };
    ArgumentsServiceProxy.prototype.orders = function (product, limit) {
        return _super.prototype.singleInvokeAsync.call(this, ArgumentsServiceMetadata.orders, [product, limit]);
    };
    return ArgumentsServiceProxy;
}(CalleeProxyBase));
var ArgumentsServiceMetadata = (function () {
    function ArgumentsServiceMetadata() {
    }
    ArgumentsServiceMetadata.ping = {
        uri: "com.arguments.ping",
        methodArguments: [],
        endpointProvider: function (instance) { return instance.ping; }
    };
    ArgumentsServiceMetadata.add2 = {
        uri: "com.arguments.add2",
        methodArguments: ["a", "b"],
        endpointProvider: function (instance) { return instance.add2; }
    };
    ArgumentsServiceMetadata.stars = {
        uri: "com.arguments.stars",
        methodArguments: ["nick", "stars"],
        endpointProvider: function (instance) { return instance.stars; }
    };
    ArgumentsServiceMetadata.orders = {
        uri: "com.arguments.orders",
        methodArguments: ["product", "limit"],
        endpointProvider: function (instance) { return instance.orders; }
    };
    return ArgumentsServiceMetadata;
}());
