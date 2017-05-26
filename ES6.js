"use strict";


class AsyncArray {
    constructor(array) {
        if (array instanceof Promise) {
            console.log('promise in constructor');
            this.__PromissesArray = array;
        }

        else {
            console.log('array');
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

        return new AsyncArray(
            this.__PromissesArray
                .then((array) => {

                    array.reduce((prev, item, index, array) => {
                        return prev.then(() =>
                            fn(item, index, array)
                        );
                    }, Promise.resolve([]));

                })
        );
    }

    forEachAsyncConcurrent(fn) {
        return new AsyncArray(Promise.all(this.__PromissesArray.map(fn)));
    }

    filterAsync(fn) {
        return new AsyncArray(
            this.__PromissesArray
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

                })
        );
    }

    mapAsync(fn) {
        return new AsyncArray(
            this.__PromissesArray
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

                })
        );
    }

    mapAsyncConcurrent(fn) {
        return new AsyncArray(Promise.all(this.__PromissesArray.map(fn)));
    }

    reduceAsync(fn, initial) {
        return new AsyncArray(
            this.__PromissesArray
                .then((array) => {
                    return array.reduce((prev, item, index, array) => {
                            return prev.then((result) =>
                                fn(result, item, index, array)
                            )
                        }
                        , Promise.resolve(initial));

                })
        );
    }
}
