import assert from "assert";
import { isArray, isNumber, isObject } from "lodash";
//TODO self contain
const { round, ceil, floor, PI, sign, sqrt, log, exp, cos, sin, tan, atan2, cosh, sinh } = Math;
const _2PI = 2 * PI;


export class Complex {
    constructor(
        public readonly r: number,
        public readonly i: number = 0) {
        assert(isNumber(r));
        assert(isNumber(i));
    }
    conjugate(): Complex {
        return new Complex(this.r, -this.i);
    }
    inverse(): Complex {
        // return this.conjugate().scale(1/this.magnitude());
        const { r, i } = this;
        const mag = sqrt(r * r + i * i);
        return new Complex(r / mag, (-i) / mag)
    }
    negate() {
        return new Complex(-this.r, -this.i);
    };
    multiply(b: Complex) {
        const { r: ra, i: ia } = this;
        const { r: rb, i: ib } = b;
        return new Complex(ra * rb - ia * ib, ra * ib + ia * rb);
    }
    scale(s: number): Complex {
        return new Complex(this.r * s, this.i * s);
    }
    divide(b: Complex) {
        //    return this.multiply(b.conjugate()).scale(1/b.magnitude())
        const { r: ra, i: ia } = this;
        const { r: rb, i: ib } = b;
        const rbc = rb;
        const ibc = -ib;
        const mag = sqrt(rb * rb + ib * ib);
        return new Complex(
            (ra * rbc - ia * ibc) / mag,
            (ra * ibc + ia * rbc) / mag)
    }
    add(b: Complex) {
        return new Complex(
            this.r + b.r,
            this.i + b.i
        )
    }
    subtract(b: Complex) {
        return new Complex(
            this.r - b.r,
            this.i - b.i
        )
    }

    pow(b: Complex) {
        // a^b = e^(b*log(a))
        return (b.multiply(this.log())).exp();
    }

    sqrt() {
        var mag = this.magnitude();
        const { r, i } = this;
        return new Complex(
            sqrt((mag + r) / 2),
            sign(i) * sqrt((mag - r) / 2)
        )
    }

    log(k: number = 0): Complex {
        return new Complex(
            log(this.magnitude()),
            this.angle() + _2PI * k
        );
    };

    exp(): Complex {
        //  e^(r+ib) = e^r * e^(ib) = e^r(cos(b) + i(sin(b))) 
        const { r, i } = this;
        const exp_r = exp(r);
        return new Complex(exp_r * cos(i), exp_r * sin(i));
    }

    sin(): Complex {
        const { r, i } = this;
        return new Complex(
            sin(r) * cosh(i),
            cos(r) * sinh(i)
        );
    }

    cos(): Complex {
        const { r, i } = this;
        return new Complex(
            cos(r) * cosh(i),
            -(sin(r) * sinh(i))
        );
    };

    tan(): Complex {
        const { r, i } = this;
        const divident = Math.cos(2 * r) + cosh(2 * i);
        return new Complex(
            Math.sin(2 * r) / divident,
            sinh(2 * i) / divident
        );
    }

    sinh(): Complex {
        const { r, i } = this;
        return new Complex(
            sinh(r) * cos(i),
            cosh(r) * sin(i)
        );
    }

    cosh(): Complex {

        const { r, i } = this;
        return new Complex(
            cosh(r) * cos(i),
            sinh(r) * sin(i)
        );
    }

    tanh(): Complex {
        const { r, i } = this;
        const divident = cosh(2 * r) + Math.cos(2 * i);
        return new Complex(
            sinh(2 * r) / divident,
            Math.sin(2 * i) / divident
        );
    }

    round(): Complex {
        return new Complex(round(this.r), round(this.i));
    }
    ceil(): Complex {
        return new Complex(ceil(this.r), ceil(this.i));
    }
    floor(): Complex {
        return new Complex(floor(this.r), floor(this.i));
    }

    equal(b: Complex): boolean {
        return this.r === b.r && this.i === b.i;
    }

    angle(): number {
        return atan2(this.i, this.r);
    }

    magnitude(): number {
        const { r, i } = this;
        return sqrt(r * r + i * i);
    }
    // alias
    mul(b: any): Complex { throw new Error("Method not implemented."); }
    sub(b: Complex): Complex { throw new Error("Method not implemented."); }
    neg(b: Complex): Complex { throw new Error("Method not implemented."); }
    conj(b: Complex): Complex { throw new Error("Method not implemented."); }
    div(b: Complex): Complex { throw new Error("Method not implemented."); }
    eq(b:Complex):boolean{ throw new Error("Method not implemented."); } 
    rad(): number{ throw new Error("Method not implemented."); }
    phi():number{ throw new Error("Method not implemented."); }

    // serialize/deserialize
    // 2 + 1i
    static isComplexString(str: string): boolean {
        return this.fromString(str) instanceof Complex;
    }
    /**
     * 
     * @param {string} str 
     * @returns {Complex|never}
     * @example 
     * 
     * - addition form
     *   - 1 + 0i 
     *   - 0 + 1i
     * - single real
     *   - 1
     * - single imaginary
     *   - i
     *   - 2i
     */
    static fromString(str: string): Complex | never {
        return this.parseRandI(str)
    }
    private static parseRandI(str: string) {
        if (str.includes('+')) {
            const [rStr, iStr] = str.split('+').map(raw => raw.trim());
            if (iStr.charAt(iStr.length - 1) !== 'i') {
                throw new SyntaxError(`${str} is not complex string, it has no "i"`)
            };
            const r = Number.parseFloat(rStr);
            const i = Number.parseFloat(iStr);
            this.assertNumStr(r, str, rStr);
            this.assertNumStr(i, str, iStr);

            return new Complex(r, i);
        }
        else {
            return this.parseSingle(str);
        }
    }

    private static parseSingle(str: string): Complex | never {
        if (str.includes('i')) {
            return this.parseIm(str);
        }
        else {
            const r = Number.parseFloat(str);
            this.assertNumStr(r, str, str)
            return new Complex(r, 0);
        }
    }
    private static parseIm(str: string) {
        if (str.charAt(str.length - 1) !== 'i') {
            throw new SyntaxError(`${str} is not complex string, it has no "i"`)
        };

        const i = Number.parseFloat(str);
        this.assertNumStr(i, str, str);

        return new Complex(0, i);
    }
    private static assertNumStr(n: number, str: string, nStr: string) {
        if (!isNumber(n)) {
            throw new SyntaxError(
                `${str} is not complex string, ${nStr} is not num string`)
        }
    }
    toString() {
        return `${this.r} + ${this.i}i`
    }
    toPrecision(k: number) {
        return `${this.r.toPrecision(k)} + ${this.i.toPrecision(k)}i`
    }

    toFixed(k: number) {
        return `${this.r.toFixed(k)} + ${this.i.toFixed(k)}i`
    }

    // factory
    clone(): Complex {
        return new Complex(this.r, this.i);
    }

    static unitI = new Complex(0, 1);
    static unitR = new Complex(1, 0);
    static zero = new Complex(0, 0);

    static from(vec2: Vec2Like): Complex;
    static from(eulerBase: EulerBase): Complex;
    static from(tup2: Tup2): Complex;
    static from(r: number, i?: number): Complex;
    static from(...args): Complex {
        const [fst, sec] = args
        if (isNumber(fst)) {
            return new Complex(fst, sec??0);
        }
        else if (isArray(fst)) {
            const [r, i] = fst;
            return new Complex(r, i);
        }
        else {
            assert(isObject(fst))
            const { x, y } = fst as Vec2Like;
            if (isNumber(x) && isNumber(y)) {
                return new Complex(x, y)
            }
            else {
                const { rad, phi } = fst as EulerBase
                assert(isNumber(rad));
                assert(isNumber(phi));
                return new Complex(rad * cos(phi), rad * sin(phi));
            }
        }
    }
}
type Vec2Like = { x: number, y: number };
type Tup2 = [number, number];
export type EulerBase = { rad: number, phi: number };

Complex.prototype.mul = Complex.prototype.multiply;
Complex.prototype.sub = Complex.prototype.subtract;
Complex.prototype.neg = Complex.prototype.negate;
Complex.prototype.conj = Complex.prototype.conjugate;
Complex.prototype.div = Complex.prototype.divide;
Complex.prototype.eq = Complex.prototype.equal;
Complex.prototype.rad = Complex.prototype.magnitude;
Complex.prototype.phi = Complex.prototype.angle;
