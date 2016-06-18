/// <reference path="RealmServiceProviderBase.ts" />
/// <reference path="CodeToGenerate.ts" />
import {ArgumentsServiceCallee} from "./UserCode";
import {IMySubscriberProvider,IArgumentsServiceProvider,IMySubscriber,IArgumentsService, MyClass} from "./CodeToGenerate";

var connection = new autobahn.Connection({ url: "ws://127.0.0.1:8080/ws", realm: "realm1" });
connection.open();

class MySubscriberImpl implements IMySubscriber {
    onHeartbeat(): void {
        console.log("Heartbeat");
    }

    onTopic2(number1: number, number2: number, c: string, d: MyClass): void {
        console.log(`number1:${number1} number2:${number2} c:${c} d:${d}`);
    }
}

class Program {
    async MyMethod(session : autobahn.Session) {
        let serviceProvider = new IArgumentsServiceProvider(session);

        var result = await serviceProvider.getCalleeProxy().add2(3, 4);
    }
}

connection.onopen = (session: autobahn.Session, details: any) => {
    let serviceProvider2 = new IMySubscriberProvider(session);

    var promise = serviceProvider2.registerSubscriber(new MySubscriberImpl());

    promise.then(x => console.log("all registered!"));

    let serviceProvider = new IArgumentsServiceProvider(session);

    var promise2 = serviceProvider.registerCallee(new ArgumentsServiceCallee());

    promise2.then(x => console.log("all registered!"));

    var proxy = serviceProvider.getCalleeProxy();

    proxy.ping().then(() => console.log("Pinged!"));
    proxy.add2(2, 3).then(result => console.log("Add2:", result));
    proxy.stars().then(res => console.log("Starred 1:", res));
    proxy.stars("Homer").then(res => console.log("Starred 2:", res));
    proxy.stars(null, 5).then(res => console.log("Starred 3:", res));
    proxy.stars("Homer", 5).then(res => console.log("Starred 4:", res));
    proxy.orders("coffee");
    proxy.orders("coffee", 10);
};
