/// <reference path="typings/main.d.ts" />
interface IMethodInfo {
    uri: string;
    methodArguments: string[];
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

    protected registerMethodAsSubscriber(methodInfo: IMethodInfo,
        callback: (...subscriberArguments: any[]) => any): When.Promise<autobahn.ISubscription> {

        var modifiedEndpoint = (args?: any[], kwargs?: any, details?: autobahn.IEvent) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            callback(methodArguments);
        };

        var promise = this._session.subscribe(methodInfo.uri, modifiedEndpoint);

        return promise;
    }

    protected registerMethodAsCallee(methodInfo: IMethodInfo,
        callback: (...procedureArguments: any[]) => any): When.Promise<autobahn.IRegistration> {

        var modifiedEndpoint = (args?: any[], kwargs?: any, details?: autobahn.IInvocation) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            return callback(methodArguments);
        };

        var promise = this._session.register(methodInfo.uri, modifiedEndpoint);

        return promise;
    }

    private extractArguments(args: any[], kwargs: any, methodInfo : IMethodInfo) {
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