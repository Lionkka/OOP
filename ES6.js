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
            .catch((err) => {

            });
    }

    filterAsync(fn) {
        return this.__PromissesArray
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
                    );
                }, Promise.resolve([]));

            })
            .catch((err) => {

            });
    }
}

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

        setTimeout(()=>{
            if (item > 1)
                resolve(true);
            else
                resolve(false);
        }, 2000);

    });
}).then((res)=>{
    console.log(res);
});

