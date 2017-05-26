"use strict";

const AsyncArray5 = require('./ES6');
const AsyncArray6 = require('./ES6');

let array5  = new AsyncArray5([1,2,3,8,4,2,7,8,43,2,56,87,98,4,23,2,1]);
let array6  = new AsyncArray6([1,2,3,8,4,2,7,8,43,2,56,87,98,4,23,2,1]);

array5.filterAsync(filterArray)
    .reduceAsync(reduceArray,'')
    .then(function (array) {
        console.log(array);
    })
    .catch(function (err) {
        console.log(err);
    });

array6.filterAsync(filterArray)
    .reduceAsync(reduceArray,'')
    .then(function (array) {
        console.log(array);
    })
    .catch(function (err) {
        console.log(err);
    });

function filterArray(item, index, array) {
    return new Promise(function(resolve, reject){
        setTimeout(function () {
            if(item < 10){
                resolve(true);
            }
            else {
                resolve(false);
            }
        },200);
    });
}

function reduceArray(prev, item, index, array) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(prev +'-'+ item);
        },200);
    });    
}
