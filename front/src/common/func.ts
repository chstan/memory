import Lazy from "lazy.js";

export function identity<T>(x: T): T {
    return x;
}

export function toEnum(arr: string[]): object {
    return Object.fromEntries(arr.map(v => [v, v]));
}

export function toActionCase(s: string): string {
    return s.toUpperCase().replace(" ", "_");
}

export function toActionsEnum(descriptions: string[]) {
    return toEnum(descriptions.map(toActionCase));
}

export function concatItems(...arrsOrItems: any[]): any[] {
    return (Lazy as any)(arrsOrItems).map((v: any) => Array.isArray(v) ? v : [v])
      .reduce((total: any[], summand: any) => total.concat(summand), []);
}

function _product<A, B>(as: A[], bs: B[]): ([A,B])[] {
    const results = [];
    for (const a of as) {
        for (const b of bs) {
            results.push([a, b] as [A, B]);
            //results.push(append ? [...(a as any), b] : [a, b]);
        }
    }
    return results;
}
function _productAppend<A, B>(as: A[][], bs: B[]): (A|B)[][] {
    const results = [];
    for (const a of as) {
        for (const b of bs) {
            results.push([...a, b]);
        }
    }
    return results;
}

export function productAppend(...arrs: any[][]): any[] {
    const [first, ...rest] = arrs;
    return (Lazy as any)(rest).reduce((agg: unknown[][], current: unknown[]) => _productAppend(agg, current), first.map((x: any) => [x]));
}

export function argMax(items: any): number {
    const v: any[] = [].map.call(items, (item: any, index: number) => [item, index]);
    return v.reduce((agg, current) => (agg[0] >= current[0] ? agg : current))[1];
}
export function argMin(items: any): number {
    const v: any[] = [].map.call(items, (item: any, index: number) => [item, index]);
    return v.reduce((agg, current) => (agg[0] <= current[0] ? agg : current))[1];
}

export function fdot<A, B>(f: (arg: A) => B, g: (...args: any) => A) : (...args: any) => B {
    return (...args) => f(g(...args));
}

export function arraysEqual(a: Array<any>, b: Array<any>): boolean {
    if (a === null || b === null) return false;
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}