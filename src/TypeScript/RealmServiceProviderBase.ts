/// <reference path="typings/main.d.ts" />

try {
    var autobahn = require('autobahn');
    var When = require('when');
} catch (e) {
    // When running in browser, AutobahnJS will
    // be included without a module system
    var When = autobahn.when;
}

interface IMethodInfo {
    uri: string;
    methodArguments: string[];
    endpointProvider?: (instance: any) => Function;
}

class CalleeProxyBase {
    private _session: autobahn.Session;

    constructor(session: autobahn.Session) {
        this._session = session;
    }

    protected singleInvokeAsync<T>(method: IMethodInfo, methodArguments: any[]): When.Promise<T> {
        return this._session.call<T>(method.uri, methodArguments);
    }
}

interface IContractRealmServiceProvider<TContract, TContractProxy> {
    registerCallee(instance: TContract): When.Promise<autobahn.IRegistration[]>;
    registerSubscriber(instance: TContract): When.Promise<autobahn.ISubscription[]>;
    getCalleeProxy(): TContractProxy;
}

class RealmServiceProviderBase {
    protected  _session: autobahn.Session;

    constructor(session: autobahn.Session) {
        this._session = session;
    }

    private registerMethodAsSubscriber(methodInfo: IMethodInfo,
        callback: (subscriberArguments: any[]) => any): When.Promise<autobahn.ISubscription> {

        var modifiedEndpoint = (args?: any[], kwargs?: any, details?: autobahn.IEvent) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            callback(methodArguments);
        };

        var promise = this._session.subscribe(methodInfo.uri, modifiedEndpoint);

        return promise;
    }

    protected registerInstanceMethodInfoAsCallee(instance: any, methodInfo: IMethodInfo): When.Promise<autobahn.IRegistration> {
        var converted =
            RealmServiceProviderBase.convertCallback(instance, methodInfo);

        var promise: When.Promise<autobahn.IRegistration> =
            this.registerMethodAsCallee(methodInfo, converted);

        return promise;
    }

    protected registerMethodsAsCallee(instance: any, ...methods: IMethodInfo[]): When.Promise<autobahn.IRegistration[]> {
        var registrations: When.Promise<autobahn.IRegistration>[] =
            methods.map(method => this.registerInstanceMethodInfoAsCallee(instance, method));

        return When.join<autobahn.IRegistration>(registrations);
    }

    protected registerInstanceMethodInfoAsSubscriber(instance: any, methodInfo: IMethodInfo): When.Promise<autobahn.ISubscription> {
        var converted =
            RealmServiceProviderBase.convertCallback(instance, methodInfo);

        var promise: When.Promise<autobahn.ISubscription> =
            this.registerMethodAsSubscriber(methodInfo, converted);

        return promise;
    }

    protected registerMethodsAsSubscriber(instance: any, ...methods: IMethodInfo[]): When.Promise<autobahn.ISubscription[]> {
        var subscriptions: When.Promise<autobahn.ISubscription>[] =
            methods.map(method => this.registerInstanceMethodInfoAsSubscriber(instance, method));

        return When.join<autobahn.ISubscription>(subscriptions);
    }


    private static convertCallback(instance: any, methodInfo: IMethodInfo): ((argArray: any[]) => any) {
        return (argArray: any[]) => methodInfo.endpointProvider(instance).apply(instance, argArray);
    }

    private registerMethodAsCallee(methodInfo: IMethodInfo,
        callback: (argArray: any[]) => any): When.Promise<autobahn.IRegistration> {

        var modifiedEndpoint = (args?: any[], kwargs?: any, details?: autobahn.IInvocation) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            return callback(methodArguments);
        };

        var promise = this._session.register(methodInfo.uri, modifiedEndpoint);

        return promise;
    }

    private extractArguments(args: any[], kwargs: any, methodInfo: IMethodInfo) {
        var methodArguments: any[] = [];

        let argsArray: any[] = args || [];

        let kwargsValue: any = kwargs || {};

        let argumentsMetadata = methodInfo.methodArguments;

        // Positional arguments have precedence
        methodArguments = argsArray.slice(0, argumentsMetadata.length);

        // Keyword arguments come later
        for (let i = argsArray.length; i < argumentsMetadata.length; i++) {
            var currentValue = kwargsValue[argumentsMetadata[i]];
            methodArguments.push(currentValue);
        }

        return methodArguments;
    }
}