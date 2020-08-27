import Animal from '.';
import { makeRandomName } from '../core/utilities';

//c
export interface Dog extends Animal {
    woof(): void;
    name: string;
}

export function createDog(): Dog {
    return ({
        size: "large",
        woof: function(this: Dog) {
            console.log(`${this.name} says "Woof 56"!`);
        },
        name: makeRandomName(),
        // deliberateError: 42
    });
}

