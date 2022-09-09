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
