/// <reference path="typings/main.d.ts" />
import * as autobahn from 'autobahn';
import * as When from 'when';

export interface IMethodInfo {
    uri: string;
    methodArguments: string[];
    endpoint?: (instance: any, argArray : any[]) => any;
}

export interface StringKeyedDictionary<TValue> {
    [key: string]: TValue;
}

export interface NumberKeyedDictionary<TValue> {
    [key: number]: TValue;
}

export class CalleeProxyBase {
    private _session: autobahn.Session;

    constructor(session: autobahn.Session) {
        this._session = session;
    }

    protected singleInvokeAsync<T>(method: IMethodInfo, methodArguments: any[]): When.Promise<T> {
        // TODO: check if unspecified methodArguments (i.e. arguments which are equal to void 0) 
        // TODO: are optional, and if so, omit them.
        return this._session.call<T>(method.uri, methodArguments);
    }
}

export interface IContractRealmServiceProvider<TContract, TContractProxy> {
    registerCallee(instance: TContract): When.Promise<autobahn.IRegistration[]>;
    registerSubscriber(instance: TContract): When.Promise<autobahn.ISubscription[]>;
    getCalleeProxy(): TContractProxy;
}

export class RealmServiceProviderBase {
    protected  _session: autobahn.Session;

    constructor(session: autobahn.Session) {
        this._session = session;
    }

    protected registerMethodsAsCallee(instance: any, ...methods: IMethodInfo[]): When.Promise<autobahn.IRegistration[]> {
        let registrations: When.Promise<autobahn.IRegistration>[] =
            methods.map(method => this.registerInstanceMethodInfoAsCallee(instance, method));

        return When.join<autobahn.IRegistration>(registrations);
    }

    protected registerInstanceMethodInfoAsCallee(instance: any, methodInfo: IMethodInfo): When.Promise<autobahn.IRegistration> {
        let converted =
            RealmServiceProviderBase.getCallback(instance, methodInfo);

        let promise: When.Promise<autobahn.IRegistration> =
            this.registerCalleeCallback(methodInfo, converted);

        return promise;
    }

    private registerCalleeCallback(methodInfo: IMethodInfo,
        callback: (argArray: any[]) => any): When.Promise<autobahn.IRegistration> {

        let modifiedEndpoint = (args?: any[], kwargs?: any, details?: autobahn.IInvocation) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            return callback(methodArguments);
        };

        let promise = this._session.register(methodInfo.uri, modifiedEndpoint);

        return promise;
    }

    protected registerMethodsAsSubscriber(instance: any, ...methods: IMethodInfo[]): When.Promise<autobahn.ISubscription[]> {
        let subscriptions: When.Promise<autobahn.ISubscription>[] =
            methods.map(method => this.registerInstanceMethodInfoAsSubscriber(instance, method));

        return When.join<autobahn.ISubscription>(subscriptions);
    }

    protected registerInstanceMethodInfoAsSubscriber(instance: any, methodInfo: IMethodInfo): When.Promise<autobahn.ISubscription> {
        let converted =
            RealmServiceProviderBase.getCallback(instance, methodInfo);

        let promise: When.Promise<autobahn.ISubscription> =
            this.registerSubscriberCallback(methodInfo, converted);

        return promise;
    }

    private registerSubscriberCallback(methodInfo: IMethodInfo,
        callback: (subscriberArguments: any[]) => any): When.Promise<autobahn.ISubscription> {

        let modifiedEndpoint = (args?: any[], kwargs?: any, details?: autobahn.IEvent) => {
            let methodArguments = this.extractArguments(args, kwargs, methodInfo);
            callback(methodArguments);
        };

        let promise = this._session.subscribe(methodInfo.uri, modifiedEndpoint);

        return promise;
    }

    private static getCallback(instance: any, methodInfo: IMethodInfo): ((argArray: any[]) => any) {
        return (argArray: any[]) => methodInfo.endpoint(instance, argArray);
    }

    private extractArguments(args: any[], kwargs: any, methodInfo: IMethodInfo) {
        let methodArguments: any[] = [];

        let argsArray: any[] = args || [];

        let kwargsValue: any = kwargs || {};

        let argumentsMetadata = methodInfo.methodArguments;

        // Positional arguments have precedence
        methodArguments = argsArray.slice(0, argumentsMetadata.length);

        // Keyword arguments come later
        for (let i = argsArray.length; i < argumentsMetadata.length; i++) {
            let currentArgumentsName: string = argumentsMetadata[i];
            let currentValue: any = kwargsValue[currentArgumentsName];

            methodArguments.push(currentValue);
        }

        return methodArguments;
    }
}