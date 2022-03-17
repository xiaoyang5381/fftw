import assert from "assert";
import isEven from "is-even";
import { isInteger, last, range } from "lodash";

export const MAX_SAFE_INTEGER_POW2= 2**52;
const pow2_ints = range(0,53).map(v=>2**v);
export function isPow2(n:number):boolean{
    assert(isInteger(n));
    assert(n<=MAX_SAFE_INTEGER_POW2);

    // TODO perf
    return pow2_ints.includes(n)
}

export const MAX_SAFE_BIN_POW2= 1<<30;
const pow2_bins= range(0,31).map(v=>1<<v);
export function isBinPow2(n:number):boolean{
    assert(isInteger(n));
    assert(n<=MAX_SAFE_BIN_POW2);

    // TODO perf
    return pow2_bins.includes(n);
}
