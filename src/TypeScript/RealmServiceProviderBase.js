export class CalleeProxyBase {
    constructor(session) {
        this._session = session;
    }
    singleInvokeAsync(method, methodArguments) {
        return this._session.call(method.uri, methodArguments);
    }
}
export class RealmServiceProviderBase {
    constructor(session) {
        this._session = session;
    }
    registerMethodAsSubscriber(methodInfo, callback) {
        var modifiedEndpoint = (args, kwargs, details) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            callback(methodArguments);
        };
        var promise = this._session.subscribe(methodInfo.uri, modifiedEndpoint);
        return promise;
    }
    registerInstanceMethodInfoAsCallee(instance, methodInfo) {
        var converted = RealmServiceProviderBase.convertCallback(instance, methodInfo);
        var promise = this.registerMethodAsCallee(methodInfo, converted);
        return promise;
    }
    registerMethodsAsCallee(instance, ...methods) {
        var registrations = methods.map(method => this.registerInstanceMethodInfoAsCallee(instance, method));
        return When.join(registrations);
    }
    registerInstanceMethodInfoAsSubscriber(instance, methodInfo) {
        var converted = RealmServiceProviderBase.convertCallback(instance, methodInfo);
        var promise = this.registerMethodAsSubscriber(methodInfo, converted);
        return promise;
    }
    registerMethodsAsSubscriber(instance, ...methods) {
        var subscriptions = methods.map(method => this.registerInstanceMethodInfoAsSubscriber(instance, method));
        return When.join(subscriptions);
    }
    static convertCallback(instance, methodInfo) {
        return (argArray) => methodInfo.endpointProvider(instance).apply(instance, argArray);
    }
    registerMethodAsCallee(methodInfo, callback) {
        var modifiedEndpoint = (args, kwargs, details) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            return callback(methodArguments);
        };
        var promise = this._session.register(methodInfo.uri, modifiedEndpoint);
        return promise;
    }
    extractArguments(args, kwargs, methodInfo) {
        var methodArguments = [];
        let argsArray = args || [];
        let kwargsValue = kwargs || {};
        let argumentsMetadata = methodInfo.methodArguments;
        // Positional arguments have precedence
        methodArguments = argsArray.slice(0, argumentsMetadata.length);
        // Keyword arguments come later
        for (let i = argsArray.length; i < argumentsMetadata.length; i++) {
            let currentArgumentsName = argumentsMetadata[i];
            let currentValue = undefined;
            //// TODO: check if argument is optional, and if so, set it to default value
            //if (kwargsValue.hasOwnProperty(currentArgumentsName)) {
            currentValue = kwargsValue[currentArgumentsName];
            //}
            methodArguments.push(currentValue);
        }
        return methodArguments;
    }
}
