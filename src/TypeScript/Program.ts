/// <reference path="RealmServiceProviderBase.ts" />
/// <reference path="CodeToGenerate.ts" />
import * as autobahn from "autobahn";

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

        let result = await serviceProvider.getCalleeProxy().add2(3, 4);

        console.log(result);
    }

    async callAsync(session: autobahn.Session) {
        let serviceProvider = new IArgumentsServiceProvider(session);

        let proxy = serviceProvider.getCalleeProxy();

        await proxy.ping();

        console.log("Pinged!");

        let result = await proxy.add2(2, 3);
        console.log(`Add2: ${result}`);

        let starred = await proxy.stars();
        console.log(`Starred 1: ${starred}`);

        starred = await proxy.stars("Homer");
        console.log(`Starred 2: ${starred}`);

        starred = await proxy.stars(null, 5);
        console.log(`Starred 3: ${starred}`);

        starred = await proxy.stars("Homer", 5);
        console.log(`Starred 4: ${starred}`);

        let orders = await proxy.orders("coffee");
        console.log(`Orders 1: ${orders}`);

        orders = await proxy.orders("coffee", 10);
        console.log(`Orders 2: ${orders}`);
    }
}

connection.onopen = (session: autobahn.Session, details: any) => {
    let subscriberProvider = new IMySubscriberProvider(session);

    let subscribePromise = subscriberProvider.registerSubscriber(new MySubscriberImpl());

    subscribePromise.then(x => console.log("all registered!"));

    let argumentsProvider = new IArgumentsServiceProvider(session);

    let registerPromise = argumentsProvider.registerCallee(new ArgumentsServiceCallee());

    registerPromise.then(x => console.log("all registered!"));

    new Program().callAsync(session);
};
