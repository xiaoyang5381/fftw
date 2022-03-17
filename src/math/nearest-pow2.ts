import assert from "assert";
import { last, lastIndexOf, range } from "lodash";
import { isNegative } from "./is-negtive";

const MAX_SAFE_INTEGER_POW2= 2**52;
const pow2_ints = range(0,53).map(v=>2**v);
export function nearestPow2(n:number){
    assert(n<=MAX_SAFE_INTEGER_POW2);
    if(isNegative(n) || n === 0){ return 1;}

    const lesses = pow2_ints.filter(v=>v<=n)
    assert(lesses.length>0);
    const less = last(lesses) as number;
    if(less === n){return n} 
    else{
        const more = pow2_ints[lesses.length];
        
        const dM = more -n;
        const dl = n - less
        return dM<dl?more:less;
    }
}