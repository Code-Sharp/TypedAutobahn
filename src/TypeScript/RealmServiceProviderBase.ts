/// <reference path="typings/main.d.ts" />
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

    protected singleInvokeAsync<T>(method: IMethodInfo, ...methodArguments: any[]) {
        return this._session.call(method.uri, methodArguments);
    }
}

class RealmServiceProviderBase {
    private _session: autobahn.Session;

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

interface IContractRealmServiceProvider<TContract> {
    registerCallee(instance: TContract): When.Promise<autobahn.IRegistration[]>;
    registerSubscriber(instance: TContract): When.Promise<autobahn.ISubscription[]>;
}

class ArgumentsServiceProvider extends RealmServiceProviderBase implements IContractRealmServiceProvider<IArgumentsService> {
    constructor(session: autobahn.Session) {
         super(session);
    }

    public registerCallee(instance: IArgumentsService): When.Promise<autobahn.IRegistration[]> {
        return When.join(super.registerInstanceMethodInfoAsCallee(instance, ArgumentsServiceMetadata.ping),
            super.registerInstanceMethodInfoAsCallee(instance, ArgumentsServiceMetadata.add2),
            super.registerInstanceMethodInfoAsCallee(instance, ArgumentsServiceMetadata.stars),
            super.registerInstanceMethodInfoAsCallee(instance, ArgumentsServiceMetadata.orders));
    }

    registerSubscriber(instance: IArgumentsService): When.Promise<autobahn.ISubscription[]> {
        return When.resolve<autobahn.ISubscription[]>([]);
    }
}

class ArgumentsService {
    private _methodInfo1: IMethodInfo = {
        uri: "com.arguments.ping",
        methodArguments: []
    };

    private _methodInfo2: IMethodInfo = {
        uri: "com.arguments.add2",
        methodArguments: ["a", "b"]
    };

    private _methodInfo3: IMethodInfo = {
        uri: "com.arguments.stars",
        methodArguments: ["nick", "stars"]
    };

    private _methodInfo4: IMethodInfo = {
        uri: "com.arguments.stars",
        methodArguments: ["product", "limit"]
    };
}


interface IArgumentsService {
    ping(): When.Promise<void>;

    add2(a: number, b: number): When.Promise<number>;

    stars(nick: string, stars: number): When.Promise<string>;

    orders(product: string, limit: number): When.Promise<string[]>;
}



abstract class ArgumentsServiceMetadata {
    static ping: IMethodInfo = {
        uri: "com.arguments.ping",
        methodArguments: [],
        endpointProvider: (instance: IArgumentsService) => instance.ping
    };

    static add2: IMethodInfo = {
        uri: "com.arguments.add2",
        methodArguments: ["a", "b"],
        endpointProvider: (instance: IArgumentsService) => instance.add2
    };

    static stars: IMethodInfo = {
        uri: "com.arguments.stars",
        methodArguments: ["nick", "stars"],
        endpointProvider: (instance: IArgumentsService) => instance.stars
    };

    static orders: IMethodInfo = {
        uri: "com.arguments.orders",
        methodArguments: ["product", "limit"],
        endpointProvider: (instance: IArgumentsService) => instance.orders
    };
}