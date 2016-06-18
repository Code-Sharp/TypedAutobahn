/// <reference path="RealmServiceProviderBase.ts" />
import { CalleeProxyBase, RealmServiceProviderBase } from "./RealmServiceProviderBase";
class IArgumentsServiceMetadata {
}
IArgumentsServiceMetadata.ping = {
    uri: "com.arguments.ping",
    methodArguments: [],
    endpointProvider: (instance) => instance.ping
};
IArgumentsServiceMetadata.add2 = {
    uri: "com.arguments.add2",
    methodArguments: ["a", "b"],
    endpointProvider: (instance) => instance.add2
};
IArgumentsServiceMetadata.stars = {
    uri: "com.arguments.stars",
    methodArguments: ["nick", "stars"],
    endpointProvider: (instance) => instance.stars
};
IArgumentsServiceMetadata.orders = {
    uri: "com.arguments.orders",
    methodArguments: ["product", "limit"],
    endpointProvider: (instance) => instance.orders
};
class IArgumentsServiceProxyImpl extends CalleeProxyBase {
    constructor(session) {
        super(session);
    }
    ping() {
        return super.singleInvokeAsync(IArgumentsServiceMetadata.ping, []);
    }
    add2(a, b) {
        return super.singleInvokeAsync(IArgumentsServiceMetadata.add2, [a, b]);
    }
    stars(nick, stars) {
        return super.singleInvokeAsync(IArgumentsServiceMetadata.stars, [nick, stars]);
    }
    orders(product, limit) {
        return super.singleInvokeAsync(IArgumentsServiceMetadata.orders, [product, limit]);
    }
}
export class IArgumentsServiceProvider extends RealmServiceProviderBase {
    constructor(session) {
        super(session);
    }
    registerCallee(instance) {
        return super.registerMethodsAsCallee(instance, IArgumentsServiceMetadata.ping, IArgumentsServiceMetadata.add2, IArgumentsServiceMetadata.stars, IArgumentsServiceMetadata.orders);
    }
    registerSubscriber(instance) {
        return super.registerMethodsAsSubscriber(instance);
    }
    getCalleeProxy() {
        return new IArgumentsServiceProxyImpl(this._session);
    }
}
class IMySubscriberMetadata {
}
IMySubscriberMetadata.onHeartbeat = {
    uri: "com.myapp.heartbeat",
    methodArguments: [],
    endpointProvider: (instance) => instance.onHeartbeat
};
IMySubscriberMetadata.onTopic2 = {
    uri: "com.myapp.topic2",
    methodArguments: ["number1", "number2", "c", "d"],
    endpointProvider: (instance) => instance.onTopic2
};
class IMySubscriberProxyImpl extends CalleeProxyBase {
    constructor(session) {
        super(session);
    }
}
export class IMySubscriberProvider extends RealmServiceProviderBase {
    constructor(session) {
        super(session);
    }
    registerCallee(instance) {
        return super.registerMethodsAsCallee(instance);
    }
    registerSubscriber(instance) {
        return super.registerMethodsAsSubscriber(instance, IMySubscriberMetadata.onHeartbeat, IMySubscriberMetadata.onTopic2);
    }
    getCalleeProxy() {
        return new IMySubscriberProxyImpl(this._session);
    }
}
