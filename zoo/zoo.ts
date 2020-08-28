// import Animal from '../animals/index';
import { Dog, createDog } from '../animals/index';

import { GeneratedContent } from './generated/generatedindex'

const x = 47;

export function createZoo(): Array<Dog> {

    GeneratedContent();

    console.log(x);
    return [
        createDog()
    ];
}

