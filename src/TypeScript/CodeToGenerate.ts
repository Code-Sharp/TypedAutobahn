class IArgumentsServiceMetadata {
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

interface IArgumentsService {
    ping(): When.Promise<void> | void;

    add2(a: number, b: number): When.Promise<number> | number;

    stars(nick?: string, stars?: number): When.Promise<string> | string;

    orders(product: string, limit?: number): When.Promise<string[]> | string[];
}

interface IArgumentsServiceProxy {
    ping(): When.Promise<void>;

    add2(a: number, b: number): When.Promise<number>;

    stars(nick?: string, stars?: number): When.Promise<string>;

    orders(product: string, limit?: number): When.Promise<string[]>;
}

class IArgumentsServiceProxyImpl extends CalleeProxyBase implements IArgumentsServiceProxy {
    constructor(session: autobahn.Session) {
        super(session);
    }

    ping(): When.Promise<void> {
        return super.singleInvokeAsync<void>(IArgumentsServiceMetadata.ping, []);
    }

    add2(a: number, b: number): When.Promise<number> {
        return super.singleInvokeAsync<number>(IArgumentsServiceMetadata.add2, [a, b]);
    }

    stars(nick?: string, stars?: number): When.Promise<string> {
        return super.singleInvokeAsync<string>(IArgumentsServiceMetadata.stars, [nick, stars]);
    }

    orders(product: string, limit?: number): When.Promise<string[]> {
        return super.singleInvokeAsync<string[]>(IArgumentsServiceMetadata.orders, [product, limit]);
    }
}

class IMySubscriberMetadata {
    static onHeartbeat: IMethodInfo = {
        uri: "com.myapp.heartbeat",
        methodArguments: [],
        endpointProvider: (instance: IMySubscriber) => instance.onHeartbeat
    };

    static onTopic2: IMethodInfo = {
        uri: "com.myapp.topic2",
        methodArguments: ["number1", "number2", "c", "d"],
        endpointProvider: (instance: IMySubscriber) => instance.onTopic2
    };
}

interface IMySubscriber {
    onHeartbeat(): When.Promise<void> | void;

    onTopic2(number1: number, number2: number, c: string, d: MyClass): When.Promise<void> | void;
}

interface IMySubscriberProxy {
}

class IMySubscriberProxyImpl extends CalleeProxyBase implements IMySubscriberProxy {
    constructor(session: autobahn.Session) {
        super(session);
    }
}

interface MyClass {
    Counter: number;
    Foo: number[];
}

class IArgumentsServiceProvider extends RealmServiceProviderBase implements IContractRealmServiceProvider<IArgumentsService, IArgumentsServiceProxy> {
    constructor(session: autobahn.Session) {
        super(session);
    }

    public registerCallee(instance: IArgumentsService): When.Promise<autobahn.IRegistration[]> {
        return super.registerMethodsAsCallee(instance,
            IArgumentsServiceMetadata.ping,
            IArgumentsServiceMetadata.add2,
            IArgumentsServiceMetadata.stars,
            IArgumentsServiceMetadata.orders);
    }

    registerSubscriber(instance: IArgumentsService): When.Promise<autobahn.ISubscription[]> {
        return When.resolve<autobahn.ISubscription[]>([]);
    }

    getCalleeProxy(): IArgumentsServiceProxy {
        return new IArgumentsServiceProxyImpl(this._session);
    }
}

class IMySubscriberProvider extends RealmServiceProviderBase implements IContractRealmServiceProvider<IMySubscriber, IMySubscriberProxy> {
    constructor(session: autobahn.Session) {
        super(session);
    }

    public registerCallee(instance: IMySubscriber): When.Promise<autobahn.IRegistration[]> {
        return When.resolve<autobahn.IRegistration[]>([]);
    }

    registerSubscriber(instance: IMySubscriber): When.Promise<autobahn.ISubscription[]> {
        return super.registerMethodsAsSubscriber(instance,
            IMySubscriberMetadata.onHeartbeat,
            IMySubscriberMetadata.onTopic2);
    }

    getCalleeProxy(): IMySubscriberProxy {
        return new IMySubscriberProxyImpl(this._session);
    }
}