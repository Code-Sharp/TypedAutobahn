var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IArgumentsServiceMetadata = (function () {
    function IArgumentsServiceMetadata() {
    }
    IArgumentsServiceMetadata.ping = {
        uri: "com.arguments.ping",
        methodArguments: [],
        endpointProvider: function (instance) { return instance.ping; }
    };
    IArgumentsServiceMetadata.add2 = {
        uri: "com.arguments.add2",
        methodArguments: ["a", "b"],
        endpointProvider: function (instance) { return instance.add2; }
    };
    IArgumentsServiceMetadata.stars = {
        uri: "com.arguments.stars",
        methodArguments: ["nick", "stars"],
        endpointProvider: function (instance) { return instance.stars; }
    };
    IArgumentsServiceMetadata.orders = {
        uri: "com.arguments.orders",
        methodArguments: ["product", "limit"],
        endpointProvider: function (instance) { return instance.orders; }
    };
    return IArgumentsServiceMetadata;
}());
var IArgumentsServiceProxyImpl = (function (_super) {
    __extends(IArgumentsServiceProxyImpl, _super);
    function IArgumentsServiceProxyImpl(session) {
        _super.call(this, session);
    }
    IArgumentsServiceProxyImpl.prototype.ping = function () {
        return _super.prototype.singleInvokeAsync.call(this, IArgumentsServiceMetadata.ping, []);
    };
    IArgumentsServiceProxyImpl.prototype.add2 = function (a, b) {
        return _super.prototype.singleInvokeAsync.call(this, IArgumentsServiceMetadata.add2, [a, b]);
    };
    IArgumentsServiceProxyImpl.prototype.stars = function (nick, stars) {
        return _super.prototype.singleInvokeAsync.call(this, IArgumentsServiceMetadata.stars, [nick, stars]);
    };
    IArgumentsServiceProxyImpl.prototype.orders = function (product, limit) {
        return _super.prototype.singleInvokeAsync.call(this, IArgumentsServiceMetadata.orders, [product, limit]);
    };
    return IArgumentsServiceProxyImpl;
}(CalleeProxyBase));
var IMySubscriberMetadata = (function () {
    function IMySubscriberMetadata() {
    }
    IMySubscriberMetadata.onHeartbeat = {
        uri: "com.myapp.heartbeat",
        methodArguments: [],
        endpointProvider: function (instance) { return instance.onHeartbeat; }
    };
    IMySubscriberMetadata.onTopic2 = {
        uri: "com.myapp.topic2",
        methodArguments: ["number1", "number2", "c", "d"],
        endpointProvider: function (instance) { return instance.onTopic2; }
    };
    return IMySubscriberMetadata;
}());
var IMySubscriberProxyImpl = (function (_super) {
    __extends(IMySubscriberProxyImpl, _super);
    function IMySubscriberProxyImpl(session) {
        _super.call(this, session);
    }
    return IMySubscriberProxyImpl;
}(CalleeProxyBase));
var IArgumentsServiceProvider = (function (_super) {
    __extends(IArgumentsServiceProvider, _super);
    function IArgumentsServiceProvider(session) {
        _super.call(this, session);
    }
    IArgumentsServiceProvider.prototype.registerCallee = function (instance) {
        return _super.prototype.registerMethodsAsCallee.call(this, instance, IArgumentsServiceMetadata.ping, IArgumentsServiceMetadata.add2, IArgumentsServiceMetadata.stars, IArgumentsServiceMetadata.orders);
    };
    IArgumentsServiceProvider.prototype.registerSubscriber = function (instance) {
        return When.resolve([]);
    };
    IArgumentsServiceProvider.prototype.getCalleeProxy = function () {
        return new IArgumentsServiceProxyImpl(this._session);
    };
    return IArgumentsServiceProvider;
}(RealmServiceProviderBase));
var IMySubscriberProvider = (function (_super) {
    __extends(IMySubscriberProvider, _super);
    function IMySubscriberProvider(session) {
        _super.call(this, session);
    }
    IMySubscriberProvider.prototype.registerCallee = function (instance) {
        return When.resolve([]);
    };
    IMySubscriberProvider.prototype.registerSubscriber = function (instance) {
        return _super.prototype.registerMethodsAsSubscriber.call(this, instance, IMySubscriberMetadata.onHeartbeat, IMySubscriberMetadata.onTopic2);
    };
    IMySubscriberProvider.prototype.getCalleeProxy = function () {
        return new IMySubscriberProxyImpl(this._session);
    };
    return IMySubscriberProvider;
}(RealmServiceProviderBase));
