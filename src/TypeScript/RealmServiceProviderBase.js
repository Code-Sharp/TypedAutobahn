/// <reference path="typings/main.d.ts" />
var CalleeProxyBase = (function () {
    function CalleeProxyBase(session) {
        this._session = session;
    }
    CalleeProxyBase.prototype.singleInvokeAsync = function (method) {
        var methodArguments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            methodArguments[_i - 1] = arguments[_i];
        }
        return this._session.call(method.uri, methodArguments);
    };
    return CalleeProxyBase;
}());
var RealmServiceProviderBase = (function () {
    function RealmServiceProviderBase(session) {
        this._session = session;
    }
    RealmServiceProviderBase.prototype.registerMethodAsSubscriber = function (methodInfo, callback) {
        var _this = this;
        var modifiedEndpoint = function (args, kwargs, details) {
            var methodArguments = _this.extractArguments(args, kwargs, methodInfo);
            callback(methodArguments);
        };
        var promise = this._session.subscribe(methodInfo.uri, modifiedEndpoint);
        return promise;
    };
    RealmServiceProviderBase.prototype.registerMethodAsCallee = function (methodInfo, callback) {
        var _this = this;
        var modifiedEndpoint = function (args, kwargs, details) {
            var methodArguments = _this.extractArguments(args, kwargs, methodInfo);
            return callback(methodArguments);
        };
        var promise = this._session.register(methodInfo.uri, modifiedEndpoint);
        return promise;
    };
    RealmServiceProviderBase.prototype.extractArguments = function (args, kwargs, methodInfo) {
        var methodArguments = [];
        var argsArray = args || [];
        var kwargsValue = kwargs || {};
        var argumentsMetadata = methodInfo.methodArguments;
        // Positional arguments have precedence
        methodArguments = argsArray.slice(0, argumentsMetadata.length);
        // Keyword arguments come later
        for (var i = argsArray.length; i < argumentsMetadata.length; i++) {
            var currentValue = kwargsValue[argumentsMetadata[i]];
            methodArguments.push(currentValue);
        }
        return methodArguments;
    };
    return RealmServiceProviderBase;
}());
var ArgumentsService = (function () {
    function ArgumentsService() {
        this._methodInfo1 = {
            uri: "com.arguments.ping",
            methodArguments: []
        };
        this._methodInfo2 = {
            uri: "com.arguments.add2",
            methodArguments: ["a", "b"]
        };
        this._methodInfo3 = {
            uri: "com.arguments.stars",
            methodArguments: ["nick", "stars"]
        };
        this._methodInfo4 = {
            uri: "com.arguments.stars",
            methodArguments: ["product", "limit"]
        };
    }
    return ArgumentsService;
}());
var ArgumentsServiceBase = (function () {
    function ArgumentsServiceBase() {
    }
    Object.defineProperty(ArgumentsServiceBase, "Metadata", {
        get: function () {
            return [
                ArgumentsServiceBase._methodInfo1,
                ArgumentsServiceBase._methodInfo2,
                ArgumentsServiceBase._methodInfo3,
                ArgumentsServiceBase._methodInfo4
            ];
        },
        enumerable: true,
        configurable: true
    });
    ArgumentsServiceBase._methodInfo1 = {
        uri: "com.arguments.ping",
        methodArguments: [],
        endpoint: ArgumentsServiceBase.prototype.Ping
    };
    ArgumentsServiceBase._methodInfo2 = {
        uri: "com.arguments.add2",
        methodArguments: ["a", "b"],
        endpoint: ArgumentsServiceBase.prototype.Add2
    };
    ArgumentsServiceBase._methodInfo3 = {
        uri: "com.arguments.stars",
        methodArguments: ["nick", "stars"],
        endpoint: ArgumentsServiceBase.prototype.Stars
    };
    ArgumentsServiceBase._methodInfo4 = {
        uri: "com.arguments.orders",
        methodArguments: ["product", "limit"],
        endpoint: ArgumentsServiceBase.prototype.Orders
    };
    return ArgumentsServiceBase;
}());
