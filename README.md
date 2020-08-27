# TypeScript Project References Demo

This repo is forked from https://github.com/RyanCavanaugh/project-references-demo.  It is to test project references with webpack, ts-loader and ForkTsCheckerWebpackPlugin.



## Project references

With projectReferences = false the build will fail unless the references are pre-built:
```
yarn clean
npx webpack <- Module not found: Error: Can't resolve '../lib/zoo/zoo'
tsc -b
npx webpack <- OK
```

With projectReferences = true ts-loader will build the references at the start of the build:
```
yarn clean
npx webpack <- OK
```

If a change is made to src/index.ts and npx webpack run again, the change will be reflected in the final output dist/main.js

If a change is made to zoo/zoo.ts and npx webpack run again, the change will be reflected in both lib/zoo/zoo.js and the final output.  ts-loader causes the references to be rebuilt because they were out of date.

## Project references & transpileOnly

If an error is introduced in src/index.ts the error not be reported when npx webpack is run:
```
console.log(newZoo[0].namex);
```

If an error is introduced in animals/dog.ts the error will be reported when npx webpack is run and lib/animals/dog.ts will not be updated.  I believe this behaviour is expected.  transpileOnly will only affect files processed by directly ts-loader. ts-loader will initiate the build of referenced projects but any errors will be reported despite transpileOnly being set.  I don't consider this to be a bug although documentation would help to avoid confusion.

## Project references, transpileOnly & ForkTsCheckerWebpackPlugin

If the same error is introduced in src/index.ts the error will be reported when npx webpack is run.  This is as expected as transpileOnly in ts-loader turns off syntax checking and ForkTsCheckerWebpackPlugin turns it on again.

It is not clear to me what effect project references has on ForkTsCheckerWebpackPlugin.  The documentation says they are supported, but errors in project references will cannot be turned off by ts-loader, so they will be reported anyway.  I don't understand in what sense ForkTsCheckerWebpackPlugin is supporting project references but I also don't see any bug here.

I do notice that in watch mode after yarn clean I see the following output in watch mode:
```
Issues checking in progress...
Issues checking in progress...
Issues checking in progress...
Issues checking in progress...
```
On the next run I only see one line. So it looks as if ForkTsCheckerWebpackPlugin is checking each of the project references. As they will already be checked when ts-loader initiates the build this seems to be a duplicated effort, although as ForkTsChecker runs on a separate thread it probably does not affect performance.

## Watch mode

Setting watch: true in webpack.config.js works as you would expect.

After making changes to files the changes are reflected in the final output and in lib (if a project reference file is changed).  If transpileOnly is true errors in src/index.ts are not reported unless ForkTsCheckerWebpackPlugin is enabled, in which case they are.

## Summary

This is a limited example but I believe webpack, ts-loader, ForkTsCheckerWebpackPlugin are all behaving as expected with project references.  If someone has a repo with a counter example I would be pleased to take a look.

# Performance

With webpack-dev-server, once the initial build is complete, changes to src/index.ts are built within 100ms.  In larger projects this will be longer but it seems webpack and ts-loader do a great job and can rebuild after a single file change in less than a second.

Making a change in animals/dog.ts causes 2 compilations.  The first is the compilation of the reference which takes around 1 second and the second compilation is less than 100ms when the project is rebuilt using the new output in lib.  With webpack-dev-server both compilations are reported in the webpack log.  With webpack and watch: true only the second compilation is reported although a delay of around 1 second is noticeable before the second compilation starts.

If you turn off projectReferences in ts-loader and execute tsc -b -w in a different shell, the effect is the same.  You can see tsc -b -w takes around 1 second to compile the reference and then webpack builds the project. This is as expected because, under the hood, ts-loader is just using tsb to build the referenced projects.  It is just more convenient than having to run tsc separately.

## Performance Summary

This is a tiny project.  It is possible that with a larger project there will be a significant performance difference, but from this repo ts-loader appears to be behaving as expected.  I will generate more source files to investigate.

I have not considered startup time here.  I believe running tsc in a separate process could provide some benefit there for larger projects.