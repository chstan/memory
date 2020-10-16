import {productAppend} from "./func";
import {SelectOption} from "./types";

export class MMap<K, V> extends Map<K, V> {
   update(key: K, updateFn: (v: V, k: K) => V, defaultValue?: V) {
      const storedValue = this.get(key);
      if (storedValue !== undefined) {
          this.set(key, updateFn(storedValue, key));
      } else if (defaultValue !== undefined) {
          this.set(key, defaultValue);
      }
   }

   getInsert(key: K, defaultValue: V): V  {
     const storedValue = this.get(key);
     if (storedValue !== undefined) {
       return storedValue;
     }

     this.set(key, defaultValue);
     return defaultValue;
   }

   getOrThrow(key: K): V {
     const storedValue = this.get(key);
     if (storedValue === undefined) {
       throw new Error(`KeyError for ${key} in MMap`);
     }
     return storedValue;
   }
}

export function isObject(data: any, excludeFunction: boolean = true) : boolean {
  // JavaScript is a strange strange language,
  // we need to be careful about all kinds of things that look like Objects
  // including `null`, Arrays, and Functions

  if (data === null) {
    return false;
  }

  const type = typeof data;

  if (type === "function") {
    return !excludeFunction;
  }

  return type === "object";
}

export function hasAllProperties(properties: string[]) {
  return function (object: any): boolean {
    if (!isObject(object)) {
      return false;
    }

    for (const keyName of properties) {
      if (!Object.prototype.hasOwnProperty.call(object, keyName)) {
        return false;
      }
    }

    return true;
  };
}

function _range(n: number): number[] {
  return [...Array(n).keys()];
}

export const range = (...ns: number[]) => {
    return productAppend(...ns.map(_range));
};

export function findOption<T>(options: SelectOption<T>[], value: T): SelectOption<T> {
  return options.filter(o => o.value === value)[0];
}

export function findOptionByLabel<T>(options: SelectOption<T>[], label: string): SelectOption<T> {
  return options.filter(o => o.label === label)[0];
}

