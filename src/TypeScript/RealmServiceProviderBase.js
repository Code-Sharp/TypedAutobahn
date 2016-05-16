/// <reference path="typings/main.d.ts" />
var CalleeProxyBase = (function () {
    function CalleeProxyBase(session) {
        this._session = session;
    }
    CalleeProxyBase.prototype.singleInvokeAsync = function (method, methodArguments) {
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
    RealmServiceProviderBase.prototype.registerInstanceMethodInfoAsCallee = function (instance, methodInfo) {
        var converted = RealmServiceProviderBase.convertCallback(instance, methodInfo);
        var promise = this.registerMethodAsCallee(methodInfo, converted);
        return promise;
    };
    RealmServiceProviderBase.convertCallback = function (instance, methodInfo) {
        return function (argArray) { return methodInfo.endpointProvider(instance).apply(instance, argArray); };
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
