"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = exports.CircularArray = exports.eqArr = exports.addToArr = exports.getArr = void 0;
const getArr = (size, contents) => {
    if (size < 0) {
        throw new Error('size must be a positive number');
    }
    const a = [];
    for (let i = 0; i < size; i++) {
        a.push(contents);
    }
    return a;
};
exports.getArr = getArr;
const addToArr = (arr, toSize, contents) => {
    const dt = toSize - arr.length;
    if (dt < 0) {
        throw new Error('toSize must be greather than the size of the array');
    }
    const a = (0, exports.getArr)(dt, contents);
    return [...arr, ...a];
};
exports.addToArr = addToArr;
// Function that copares two arrays and makes sure every element is equal between them
// Will fail if elements are objects
const eqArr = (a, b) => {
    return (Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]));
};
exports.eqArr = eqArr;
// Datatype to rotate around an array
class CircularArray {
    constructor(arr, startingIndex) {
        if (!arr.length) {
            throw new Error('array is empty');
        }
        this.arr = [...arr];
        this.index = startingIndex;
    }
    // Get the current element and mutate the array to push it to the back
    next() {
        const first = this.arr[this.index];
        this.index = (this.index + 1) % this.arr.length;
        return first;
    }
    // Get an item, relative to the current index
    i(relIndex) {
        let i = this.getIndex(relIndex);
        return this.arr[i];
    }
    // Get the absolute index, relative to the current
    getIndex(relIndex) {
        let i = this.index + relIndex;
        if (relIndex < 0) {
            while (i < 0) {
                i += this.arr.length;
            }
        }
        return i % this.arr.length;
    }
}
exports.CircularArray = CircularArray;
// Get last element of array
const last = (arr) => arr[arr.length - 1];
exports.last = last;
