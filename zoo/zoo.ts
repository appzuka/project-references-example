// import Animal from '../animals/index';
import { Dog, createDog } from '../animals/index';

const x = 47;

export function createZoo(): Array<Dog> {

    console.log(x);
    return [
        createDog()
    ];
}

