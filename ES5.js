"use strict";


function AsyncArray(array) {
    if (array instanceof Promise) {
        this.__PromissesArray = array;
    }

    else {
        this.__PromissesArray = Promise.resolve(array);
    }
}


AsyncArray.prototype.then = fn => {
    return this.__PromissesArray.then(fn);
};

AsyncArray.prototype.catch = fn => {
    return this.__PromissesArray.catch(fn);
};

AsyncArray.prototype.forEachAsync = fn => {
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
};

AsyncArray.prototype.forEachAsyncConcurrent = fn => {
    return new AsyncArray(Promise.all(this.__PromissesArray.map(fn)));
};

AsyncArray.prototype.filterAsync = fn => {
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
};

AsyncArray.prototype.mapAsync = fn => {
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
};

AsyncArray.prototype.mapAsyncConcurrent = fn => {
    return new AsyncArray(Promise.all(this.__PromissesArray.map(fn)));
};

AsyncArray.prototype.reduceAsync = (fn, initial) => {
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
};

