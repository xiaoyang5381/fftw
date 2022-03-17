import assert from "assert";
import isEven from "is-even";
import { clone, isInteger, range } from "lodash";
import { Complex } from "./math/complex";
import { isPow2 } from "./math/is-pow2";


const _2PI = 2 * Math.PI
const { cos, sin } = Math;

export function fft(arr: Complex[]) {
    const { length } = arr;
    if (length === 1) { return arr; }
    assert(isPow2(length));
    const [even, odd] = e_o_ptn(arr);

    const fft_even = fft(even);
    const fft_odd = fft(odd);

    //   merge
    const wn = new Complex(cos(_2PI /length), sin(_2PI /length))
    let w = Complex.unitR;
    const half_len = length / 2
    const result = Array.from<Complex>({ length });
    for (let k = 0; k < half_len; k++) {
        const wk_odd = w.mul(fft_odd[k])
        result[k] = fft_even[k].add(wk_odd);
        result[k + half_len] = fft_even[k].sub(wk_odd);

        w = w.mul(wn);
    }

    return result
}

function e_o_ptn<T>(arr: T[]): [T[], T[]] {
    assert(isPow2(arr.length))

    let ie_o = 0;
    const even = Array.from<T>({ length: arr.length / 2 });
    const odd = Array.from<T>({ length: arr.length / 2 });

    let i_a = 0;
    while (i_a < arr.length) {
        even[ie_o] = arr[i_a];
        odd[ie_o] = arr[i_a + 1];
        ie_o += 1;
        i_a += 2;
    }

    return [even, odd];
}
