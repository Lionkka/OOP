"use strict";

class AsyncArray {
    constructor(array) {
        if (array instanceof Promise) {
            this.__PromissesArray = array;
        }

        else {
            this.__PromissesArray = Promise.resolve(array);
        }
    }

    then(fn) {
        return this.__PromissesArray.then(fn);
    }

    catch(fn) {
        return this.__PromissesArray.catch(fn);
    }

    forEachAsync(fn) {
        this.__PromissesArray = this.__PromissesArray
            .then((array) => {

                array.reduce((prev, item, index, array) => {
                    return prev.then(() =>
                        fn(item, index, array)
                    );
                }, Promise.resolve([]));

            });
        return this;
    }

    forEachAsyncConcurrent(fn) {
        this.__PromissesArray = Promise.all(this.__PromissesArray.map(fn));
        return this;
    }

    filterAsync(fn) {
        this.__PromissesArray = this.__PromissesArray
            .then((array) => {

                return array.reduce((prev, item, index, array) => {
                    return prev.then((result) =>
                        fn(item, index, array)
                            .then((isPass) => {
                                if (isPass) {
                                    result.push(item);
                                    return result;
                                }
                                return result;
                            })
                    )
                }, Promise.resolve([]));

            });

        return this;
    }

    mapAsync(fn) {
        this.__PromissesArray = this.__PromissesArray
            .then((array) => {
                return array.reduce((prev, item, index, array) => {
                        return prev.then((result) =>
                            fn(item, index, array)
                                .then((newItem) => {
                                    result.push(newItem);
                                    return result;
                                })
                        )
                    }
                    , Promise.resolve([]));

            });
        return this;
    }

    mapAsyncConcurrent(fn) {
        this.__PromissesArray = Promise.all(this.__PromissesArray.map(fn));
        return this;
    }

    reduceAsync(fn, initial) {
        this.__PromissesArray = this.__PromissesArray
            .then((array) => {
                return array.reduce((prev, item, index, array) => {
                        return prev.then((result) =>
                            fn(result, item, index, array)
                        )
                    }
                    , Promise.resolve(initial));

            });
        return this;
    }
}
module.exports = AsyncArray;