# TypeScript Project References Demo

This repo is forked from https://github.com/RyanCavanaugh/project-references-demo.  It is to compare the performance of project references with webpack & ts-loader vs webpack and tsc run in a separate process.

## Installation
```
yarn install
yarn generate
```
This will run the generate.ts script which will populate zoo/generated with as large a codebase as you wish. Using the settings:
```
const depths = [10,10];
const busyWork = 100;
```
the generated code will contain around 100 files in 2 layers each with 100 repeated blocks of code to give the compiler some work to do.

With webpack in watch mode I run <code>npx webpack</code>.  After the initial compile I make a change to <code>zoo/zoo.ts</code>.  Webpack reports 2 compiles (for reasons which are understood).  The first takes 3.2 seconds and the second 0.8s.

I then change the entrypoint in <code>webpack.config.js</code> to point to the compiled javascript:
```
  "entry": "src/index.js",
```
I again run webpack in watch mode and in a second shell run <code>tsc -b -w -v</code>.  After the initial compiles I change <code>zoo/zoo.ts</code>.  webpack reports a build time of around 1 second but this does not include the time it took <code>tsc</code> to rebuild the reference, which I manually timed at around 4 seconds (probably 3.x seconds if you subtract my reaction time.)

## Without Project References

I then changed <code>src/index.ts</code> so that it imports the TS code directly, instead of the compiled code in lib:
```
import { createZoo } from '../zoo/zoo';
import { Dog } from '../animals/dog';
```
Now we are not using project references - the TS code will be compiled on each run.  I also set projectReferences to false in <code>webpack.config.js</code>.  After starting webpack in watch mode I made a change in <code>zoo/zoo.ts</code>.  Webpack completed the incremental build in less than 1 second.  This is as expected - webpack only builds the files which are required to be rebuilt.

Of course, <code>tsc -b -w</code> should do this as well, so it is an open question why webpack+ts-loader is able to complete an incremental build faster than <code>tsc -b -w</code>.  Perhaps <code>tsc</code> takes longer because it needs to write its output to the file system.  Webpack in watch mode does this in memory.

I would assume that many people put relatively stable code into project references and gain performance by not having to rebuild the code each time webpack is started.  If other users are actively developing the code in a reference and are bothered by the time it takes to rebuild a referenced project then perhaps they would be advised to include the TypeScript source directly and gain from faster rebuild times.

## Conclusion

On this example, there is no significant difference in rebuild time between running <code>tsc -w</code> in a separate process versus using ts-loader to run it before the build.
