/// <reference path="RealmServiceProviderBase.ts" />
/// <reference path="CodeToGenerate.ts" />
import {IArgumentsService} from "./CodeToGenerate";

export class ArgumentsServiceCallee implements IArgumentsService {
    private _orders: number[];

    constructor() {
        this._orders = [];

        for (let i = 0; i < 50; ++i) {
            this._orders.push(i);
        }
    }

    ping(): void {
    }

    add2(a: number, b: number): number {
        return (a + b);
    }

    stars(nick: string = "somebody", stars: number = 0): string {
        return (`${nick} starred ${stars}x`);
    }

    orders(product: string, limit: number = 5): string[] {
        return this._orders.slice(0, limit).map(index => `Product ${index}`);
    }
}