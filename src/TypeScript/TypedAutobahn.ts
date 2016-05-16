/// <reference path="typings/main.d.ts" />
interface IMethodInfo {
    procedureUri: string;
    methodArguments: string[];
}

class ServiceProxy {
    private _session: autobahn.Session;

    constructor(session: autobahn.Session) {
        this._session = session;
    }

    protected callAsync<TResult>(methodInfo: IMethodInfo, procedureArguments: any[]): When.Promise<TResult> {
        var promise = this._session.call<TResult>
        (methodInfo.procedureUri,
            procedureArguments,
            {},
            <autobahn.ICallOptions>{});

        return promise;
    }

    protected registerCallee(methodInfo: IMethodInfo,
        callback: (...procedureArguments: any[]) => any): When.Promise<autobahn.IRegistration> {

        var myEndpoint = (args?: any[], kwargs?: any, details?: autobahn.IInvocation) => {
            let methodArguments: any[] = [];

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

            return callback(methodArguments);
        };

        var promise = this._session.register(methodInfo.procedureUri, myEndpoint);

        return promise;
    }
}