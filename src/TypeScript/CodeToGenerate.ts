class ArgumentsServiceProvider extends RealmServiceProviderBase implements IContractRealmServiceProvider<IArgumentsService, IArgumentsServiceProxy> {
    constructor(session: autobahn.Session) {
        super(session);
    }

    public registerCallee(instance: IArgumentsService): When.Promise<autobahn.IRegistration[]> {
        return super.registerMethodsAsCallee(instance,
            ArgumentsServiceMetadata.ping,
            ArgumentsServiceMetadata.add2,
            ArgumentsServiceMetadata.stars,
            ArgumentsServiceMetadata.orders);
    }

    registerSubscriber(instance: IArgumentsService): When.Promise<autobahn.ISubscription[]> {
        return When.resolve<autobahn.ISubscription[]>([]);
    }

    getCalleeProxy(): IArgumentsServiceProxy {
         return new ArgumentsServiceProxy(this._session);
    }
}

interface IArgumentsService {
    ping(): When.Promise<void> | void;

    add2(a: number, b: number): When.Promise<number> | number;

    stars(nick: string, stars: number): When.Promise<string> | string;

    orders(product: string, limit: number): When.Promise<string[]> | string[];
}

interface IArgumentsServiceProxy {
    ping(): When.Promise<void>;

    add2(a: number, b: number): When.Promise<number>;

    stars(nick?: string, stars?: number): When.Promise<string>;

    orders(product: string, limit?: number): When.Promise<string[]>;
}

class ArgumentsServiceProxy extends CalleeProxyBase implements IArgumentsServiceProxy {
    constructor(session: autobahn.Session) {
        super(session);
    }

    ping(): When.Promise<void> {
        return super.singleInvokeAsync<void>(ArgumentsServiceMetadata.ping, []);
    }

    add2(a: number, b: number): When.Promise<number> {
        return super.singleInvokeAsync<number>(ArgumentsServiceMetadata.add2, [a, b]);
    }

    stars(nick?: string, stars?: number): When.Promise<string> {
        return super.singleInvokeAsync<string>(ArgumentsServiceMetadata.stars, [nick, stars]);
    }

    orders(product: string, limit?: number): When.Promise<string[]> {
        return super.singleInvokeAsync<string[]>(ArgumentsServiceMetadata.orders, [product, limit]);
    }
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