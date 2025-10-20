import { LambdaRecurrence } from '../models/recurrence';

// --- 32-bit helpers for bit-pattern generators ---
function toI32(x: number): number { return x | 0; }
function u32(x: number): number { return x >>> 0; }
function rotl32(x: number, r: number): number {
    r &= 31; return toI32((x << r) | (x >>> (32 - r)));
}
function popcount32(x: number): number {
    x = u32(x);
    x = x - ((x >>> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
    return (((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
}

// Padovan: a(n) = a(n-2) + a(n-3)
// Perrin:  a(n) = a(n-2) + a(n-3)
function padovanRecurrence() {
    return new LambdaRecurrence('Padovan', 3, ([a, b, c]) => b + a);
    // Actually, Padovan is a(n) = a(n-2) + a(n-3), so ([a, b, c]) = [a(n-3), a(n-2), a(n-1)]
}

function perrinRecurrence() {
    return new LambdaRecurrence('Perrin', 3, ([a, b, c]) => b + a);
    // Perrin: a(n) = a(n-2) + a(n-3)
}

function xorshiftFactory(shiftA = 13, shiftB = 17, shiftC = 5) {
    return new LambdaRecurrence(`Xorshift ${shiftA},${shiftB},${shiftC}`, 1, ([x]) => {
        let v = x | 0;
        v ^= (v << shiftA);
        v ^= (v >>> shiftB);
        v ^= (v << shiftC);
        return v | 0;
    });
}

// Linear Congruential Generator (Numerical Recipes)
function lcg32Factory(a = 1664525, c = 1013904223) {
    return new LambdaRecurrence(`LCG a=${a} c=${c}`, 1, ([x]) => toI32(Math.imul(a, x | 0) + c));
}

// Weyl sequence (additive constant step on 32-bit ring)
function weyl32Factory(omega = 0x9E3779B9) {
    return new LambdaRecurrence(`Weyl omega=${omega >>> 0}`, 1, ([x]) => toI32((x | 0) + (omega | 0)));
}

// 32-bit Galois LFSR with a common polynomial (avoid seed 0)
function lfsr32Factory(poly = 0x80200003) {
    return new LambdaRecurrence(`LFSR32 poly=${(poly >>> 0).toString(16)}`, 1, ([x]) => {
        let v = x >>> 0;
        const lsb = v & 1;
        v >>>= 1;
        if (lsb) v ^= poly >>> 0;
        return toI32(v);
    });
}

// SplitMix32 step (good bit diffusion)
function splitmix32Factory() {
    return new LambdaRecurrence('SplitMix32', 1, ([x]) => {
        let z = toI32((x | 0) + 0x9E3779B9);
        z ^= z >>> 16; z = toI32(Math.imul(z, 0x7FEB352D));
        z ^= z >>> 15; z = toI32(Math.imul(z, 0x846CA68B));
        z ^= z >>> 16;
        return z;
    });
}

// Rotate/XOR mixing step
function rolMixFactory(rot = 7) {
    return new LambdaRecurrence(`ROL-Mix rot=${rot}`, 1, ([x]) => {
        let v = x | 0;
        v = toI32(rotl32(v, rot) ^ v ^ (v >>> 3));
        return v;
    });
}

// Index-driven bit-pattern sequences
const grayCode = new LambdaRecurrence('Gray code (index)', 0, (_: number[], i = 0) => toI32((i ^ (i >>> 1))));
const thueMorse = new LambdaRecurrence('Thue-Morse (index parity)', 0, (_: number[], i = 0) => popcount32(i) & 1);
const popcountSeq = new LambdaRecurrence('Popcount(i)', 0, (_: number[], i = 0) => popcount32(i));
const vdc2 = new LambdaRecurrence('Van der Corput base-2 (bit-reverse)', 0, (_: number[], i = 0) => {
    let x = i >>> 0, y = 0;
    for (let k = 0; k < 32; k++) { y = (y << 1) | (x & 1); x >>>= 1; }
    return toI32(y);
});

const RecurrenceCatalog: { [key: string]: any } = {
    fibonacci: new LambdaRecurrence('Fibonacci', 2, ([a, b]) => a + b),
    lucas: new LambdaRecurrence('Lucas', 2, ([a, b]) => a + b),
    tribonacci: new LambdaRecurrence('Tribonacci', 3, ([a, b, c]) => a + b + c),
    pell: new LambdaRecurrence('Pell', 2, ([a, b]) => 2 * b + a),
    padovan: new LambdaRecurrence('Padovan', 3, ([a, b, c]) => b + a), // a(n) = a(n-2) + a(n-3)
    perrin: new LambdaRecurrence('Perrin', 3, ([a, b, c]) => b + a),   // a(n) = a(n-2) + a(n-3)
    collatz: new LambdaRecurrence('Collatz', 1, ([n]) => {
        // Guard against NaN and non-positive values to avoid degenerate sequences under max handling
        if (!Number.isFinite(n) || n <= 0) return 0;
        return n % 2 === 0 ? Math.floor(n / 2) : 3 * n + 1;
    }),
    // Index-driven sequences
    gray: grayCode,
    thueMorse: thueMorse,
    popcount: popcountSeq,
    vdc2: vdc2,
    // Default Xorshift with standard parameters; UI can override via factory
    xorshift: xorshiftFactory(),
    lcg32: lcg32Factory(),
    weyl32: weyl32Factory(),
    lfsr32: lfsr32Factory(),
    splitmix32: splitmix32Factory(),
    rolmix: rolMixFactory(),
    xorshiftFactory
};

export { RecurrenceCatalog };
export {
    xorshiftFactory,
    lcg32Factory,
    weyl32Factory,
    lfsr32Factory,
    splitmix32Factory,
    rolMixFactory
};