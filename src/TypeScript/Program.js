var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { ArgumentsServiceCallee } from "./UserCode";
import { IMySubscriberProvider, IArgumentsServiceProvider } from "./CodeToGenerate";
var connection = new autobahn.Connection({ url: "ws://127.0.0.1:8080/ws", realm: "realm1" });
connection.open();
class MySubscriberImpl {
    onHeartbeat() {
        console.log("Heartbeat");
    }
    onTopic2(number1, number2, c, d) {
        console.log(`number1:${number1} number2:${number2} c:${c} d:${d}`);
    }
}
class Program {
    MyMethod(session) {
        return __awaiter(this, void 0, void 0, function* () {
            let serviceProvider = new IArgumentsServiceProvider(session);
            var result = yield serviceProvider.getCalleeProxy().add2(3, 4);
        });
    }
}
connection.onopen = (session, details) => {
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
