"use strict";

function AsyncArray(array) {
    this.__PromissesArray = Promise.resolve(array);

}
AsyncArray.prototype.forEachAsync = function (fn) {

    this.__PromissesArray
        .then((array) => {

            array.reduce((prev, item, index, array) => {
                return prev.then(() =>
                    fn(item, index, array)
                );
            }, Promise.resolve([]));

        })
        .catch(Promise.reject);
};

AsyncArray.prototype.forEachAsyncConcurrent = function (fn) {
    return Promise.all(this.__PromissesArray.map(fn));
};

AsyncArray.prototype.filterAsync = function (fn) {
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

        })
        .catch(Promise.reject);
};

AsyncArray.prototype.mapAsync = function (fn) {
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
};

AsyncArray.prototype.mapAsyncConcurrent = function (fn) {
    return Promise.all(this.__PromissesArray.map(fn));
};

AsyncArray.prototype.reduceAsync = function (fn, initial) {
    return this.__PromissesArray
        .then((array) => {
            return array.reduce((prev, item, index, array) =>
                    prev.then((result) =>
                        fn(result, item, index, array)
                    )
                , Promise.resolve(initial));

        })
        .catch(Promise.reject);
};

let newArr = new AsyncArray([1, 2, 3]);

newArr.forEachAsync((item, index, array) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
                console.log(item);
                resolve();
            }
            , 2000)
    })
});

newArr.filterAsync((item, index, array) => {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            if (item > 1)
                resolve(true);
            else
                resolve(false);
        }, 2000);

    });
}).then((res) => {
    console.log(res);
});

newArr.mapAsync((item, index, array) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(item + 10);
        }, 2000);

    });
}).then((res) => {
    console.log(res);
});

