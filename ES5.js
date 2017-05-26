"use strict";


function AsyncArray(array) {
    if (array instanceof Promise) {
        this.__PromissesArray = array;
    }

    else {
        this.__PromissesArray = Promise.resolve(array);
    }
}


AsyncArray.prototype.then = function (fn) {
    return this.__PromissesArray.then(fn);
};

AsyncArray.prototype.catch = function (fn) {
    return this.__PromissesArray.catch(fn);
};

AsyncArray.prototype.forEachAsync = function (fn) {
    this.__PromissesArray = this.__PromissesArray
        .then(function (array) {

            array.reduce(function (prev, item, index, array) {
                return prev.then(function () {
                        return fn(item, index, array);
                    }
                )
                    ;
            }, Promise.resolve([]));

        });
    return this;
}
AsyncArray.prototype.forEachAsyncConcurrent = function (fn) {
    this.__PromissesArray = Promise.all(this.__PromissesArray.map(fn));
    return this;
};

AsyncArray.prototype.filterAsync = function (fn) {
    this.__PromissesArray = this.__PromissesArray
        .then(function (array) {

            return array.reduce(function (prev, item, index, array) {
                return prev.then(function (result) {
                        return fn(item, index, array)
                            .then(function (isPass) {
                                if (isPass) {
                                    result.push(item);
                                    return result;
                                }
                                return result;
                            })
                    }
                )
            }, Promise.resolve([]));

        });
    return this;
};

AsyncArray.prototype.mapAsync = function (fn) {
    this.__PromissesArray = this.__PromissesArray
        .then(function (array) {
            return array.reduce(function (prev, item, index, array) {
                    return prev
                        .then(function (result) {
                                return fn(item, index, array)
                                    .then(function (newItem) {
                                        result.push(newItem);
                                        return result;
                                    })
                            }
                        )
                }
            )
        }, Promise.resolve([]));
    return this;
};

AsyncArray.prototype.mapAsyncConcurrent = function (fn) {
    this.__PromissesArray = Promise.all(this.__PromissesArray.map(fn));
    return this;
};

AsyncArray.prototype.reduceAsync = function (fn, initial) {
    this.__PromissesArray = this.__PromissesArray
        .then(function (array) {
            return array.reduce(function (prev, item, index, array) {
                    return prev.then(function (result) {
                            return fn(result, item, index, array);
                        }
                    )
                }, Promise.resolve(initial)
            );
        });
    return this;
};