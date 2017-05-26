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
    return new AsyncArray(
        this.__PromissesArray
            .then(function (array) {

                array.reduce(function (prev, item, index, array) {
                    return prev.then(function(){
                        return fn(item, index, array);
                        }
                    )
                    ;
                }, Promise.resolve([]));

            })
    );
};

AsyncArray.prototype.forEachAsyncConcurrent = function (fn) {
    return new AsyncArray(Promise.all(this.__PromissesArray.map(fn)));
};

AsyncArray.prototype.filterAsync = function (fn) {
    return new AsyncArray(
        this.__PromissesArray
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

            })
    );
};

AsyncArray.prototype.mapAsync = function (fn) {
    return new AsyncArray(
        this.__PromissesArray
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
                }, Promise.resolve([])))
};

AsyncArray.prototype.mapAsyncConcurrent = function (fn) {
    return new AsyncArray(Promise.all(this.__PromissesArray.map(fn)));
};

AsyncArray.prototype.reduceAsync = function (fn, initial) {
    return new AsyncArray(
        this.__PromissesArray
            .then(function (array) {
                return array.reduce(function (prev, item, index, array) {
                        return prev.then(function (result) {
                                return fn(result, item, index, array);
                            }
                        )
                    }, Promise.resolve(initial)
                );
            })
    );
};