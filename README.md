# TypeScript Project References Demo

This branch is to test the behaviour of issue 1179 in ts-loader:

https://github.com/TypeStrong/ts-loader/issues/1179

## Installation
```
yarn install
```

## Demonstrating Behaviour in ts-loader

* npx webpack --watch
* rename packages/animals/foo.renametots to foo.ts
* edit packages/animals/dog.tsx

You will observe that the build fails because foo.ts was not included in tsconfig.json

## Demonstrating Behaviour in tsc

* reset packages/animals/foo.renametots and dog.tsx
* set projectReferences to false in webpack.config.js
* In one terminal cd to packages/zoo
* npx tsc -b -w -v
* In another terminal run
* npx webpack --watch

Make the same changes as above and observe that tsc correctly rebuilds the packages and then webpack correctly rebuilds the final app




