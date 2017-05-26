"use strict";


class AsyncArray {
    constructor(array) {

        this.__PromissesArray = Promise.resolve(array);
    }

    forEachAsync(fn) {

        this.__PromissesArray
            .then((array) => {

                array.reduce((prev, item, index, array) => {
                    return prev.then(() =>
                        fn(item, index, array)
                    );
                }, Promise.resolve([]));

            })
            .catch(Promise.reject);
    }

    forEachAsyncConcurrent(fn) {
        return Promise.all(this.__PromissesArray.map(fn));
    }

    filterAsync(fn) {
        return this.__PromissesArray
            .then((array) => {

                return array.reduce((prev, item, index, array) => {
                    prev.then((result) =>
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

            }).catch(Promise.reject)
    }

    mapAsync(fn) {
        return this.__PromissesArray
            .then((array) => {
                return array.reduce((prev, item, index, array) =>
                        prev.then((result) =>
                            fn(item, index, array)
                                .then((newItem) => {
                                    result.push(newItem);
                                    return result;
                                })
                        )
                    , Promise.resolve([]));

            })
            .catch(Promise.reject);
    }

    mapAsyncConcurrent(fn) {
        return Promise.all(this.__PromissesArray.map(fn));
    }

    reduceAsync(fn, initial) {
        return this.__PromissesArray
            .then((array) => {
                return array.reduce((prev, item, index, array) =>
                        prev.then((result) =>
                            fn(result, item, index, array)
                        )
                    , Promise.resolve(initial));

            })
            .catch(Promise.reject);
    }
}
