export const getArr = <T>(size: number, contents: T): T[] => {
  if (size < 0) {
    throw new Error('size must be a positive number');
  }
  const a: T[] = [];
  for (let i = 0; i < size; i++) {
    a.push(contents);
  }
  return a;
};

export const addToArr = <T>(arr: T[], toSize: number, contents: T): T[] => {
  const dt = toSize - arr.length;
  if (dt < 0) {
    throw new Error('toSize must be greather than the size of the array');
  }
  const a = getArr(dt, contents);
  return [...arr, ...a];
};

// Function that copares two arrays and makes sure every element is equal between them
// Will fail if elements are objects
export const eqArr = <T>(a: T[], b: T[]): boolean => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

// Datatype to rotate around an array
export class CircularArray<T> {
  arr: T[];
  index: number;

  constructor(arr: T[], startingIndex: number) {
    if (!arr.length) {
      throw new Error('array is empty');
    }
    this.arr = [...arr];
    this.index = startingIndex;
  }

  // Get the current element and mutate the array to push it to the back
  next(): T {
    const first = this.arr[this.index];
    this.index = (this.index + 1) % this.arr.length;

    return first;
  }

  // Get an item, relative to the current index
  i(relIndex: number): T {
    let i = this.getIndex(relIndex);

    return this.arr[i];
  }

  // Get the absolute index, relative to the current
  getIndex(relIndex: number): number {
    let i = this.index + relIndex;

    if (relIndex < 0) {
      while (i < 0) {
        i += this.arr.length;
      }
    }

    return i % this.arr.length;
  }
}

// Get last element of array
export const last = <T>(arr: T[]): T => arr[arr.length - 1];
