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