import { Animal, Size } from './animal';
import { makeRandomName } from '@myscope/core';

import rawtxt from "../assets/raw.txt";
// import { rawtxt } from '../assets/raw';
// const rawtxt = 'GGG1'

interface Dog extends Animal {
    woof(): void;
    name: string;
}

const sizes = "small medium large".split(' ');
const barks = "Woof Yap Growl".split(' ');

function createDog(): Dog {
    return ({
        size: sizes[Math.floor(Math.random() * sizes.length)] as Size,
        woof: function(this: Dog) {
            return(`${rawtxt} : ${this.name} saysy ${barks[Math.floor(Math.random() * barks.length)]}!`);
        },
        name: makeRandomName(),
        // deliberateError: 42
    });
}

export {
  Dog,
  createDog
}


