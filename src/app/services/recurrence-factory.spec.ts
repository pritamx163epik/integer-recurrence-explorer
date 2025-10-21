import { RecurrenceCatalog } from './recurrence-factory';
describe('RecurrenceCatalog',()=>{
    it('Fibonacci with [0,1] initial',()=>{
        const fib = RecurrenceCatalog.fibonacci;
        const seq=[0,1];
        for(let i=2;i<10;i++) seq.push(fib.next([seq[i-2],seq[i-1]]));
        expect(seq.slice(0,10)).toEqual([0,1,1,2,3,5,8,13,21,34]);
    });
    it('Fibonacci',()=>{
        const fib = RecurrenceCatalog.fibonacci;
        const seq=[0,1];
        for(let i=2;i<10;i++) seq.push(fib.next(seq.slice(i-2,i)));
        expect(seq.slice(0,10)).toEqual([0,1,1,2,3,5,8,13,21,34]);
    });
    it('Lucas',()=>{
        const luc = RecurrenceCatalog.lucas;
        const seq=[2,1];
        for(let i=2;i<10;i++) seq.push(luc.next(seq.slice(i-2,i)));
        expect(seq.slice(0,10)).toEqual([2,1,3,4,7,11,18,29,47,76]);
    });
    it('Tribonacci',()=>{
        const tri = RecurrenceCatalog.tribonacci;
        const seq=[0,0,1];
        for(let i=3;i<10;i++) seq.push(tri.next(seq.slice(i-3,i)));
        expect(seq.slice(0,10)).toEqual([0,0,1,1,2,4,7,13,24,44]);
    });
    it('Pell',()=>{
        const pell = RecurrenceCatalog.pell;
        const seq=[0,1];
        for(let i=2;i<10;i++) seq.push(pell.next(seq.slice(i-2,i)));
        expect(seq.slice(0,10)).toEqual([0,1,2,5,12,29,70,169,408,985]);
    });
    it('Padovan',()=>{
        const padovan = RecurrenceCatalog.padovan;
        const seq=[1,1,1];
        for(let i=3;i<10;i++) seq.push(padovan.next([seq[i-3],seq[i-2],seq[i-1]]));
        expect(seq.slice(0,10)).toEqual([1,1,1,2,2,3,4,5,7,9]);
    });
    it('Perrin',()=>{
        const perrin = RecurrenceCatalog.perrin;
        const seq=[3,0,2];
        for(let i=3;i<10;i++) seq.push(perrin.next([seq[i-3],seq[i-2],seq[i-1]]));
        expect(seq.slice(0,10)).toEqual([3,0,2,3,2,5,5,7,10,12]);
    });
    it('Collatz',()=>{
        const collatz = RecurrenceCatalog.collatz;
        let n = 7;
        const seq = [n];
        for(let i=1;i<10;i++) seq.push(collatz.next([seq[i-1]]));
        expect(seq.slice(0,10)).toEqual([7,22,11,34,17,52,26,13,40,20]);
    });

    it('Xorshift defaults (seed 1 -> 270369)', () => {
        const xs = RecurrenceCatalog.xorshift; // default shifts 13,17,5
        const next = xs.next([1]);
        expect(next).toBe(270369);
        // zero seed stays zero
        expect(xs.next([0])).toBe(0);
    });

    it('LCG32 defaults (seed 0 -> c)', () => {
        const lcg = RecurrenceCatalog.lcg32; // a=1664525, c=1013904223
        const next = lcg.next([0]);
        expect(next).toBe(1013904223 | 0);
    });

    it('Weyl32 constant step equals omega', () => {
        const weyl = RecurrenceCatalog.weyl32; // omega = 0x9E3779B9
        const seed = 123456789;
        const seq = [seed];
        for(let i=1;i<6;i++) seq.push(weyl.next([seq[i-1]]));
        const omega = (0x9E3779B9 | 0);
        for(let i=1;i<seq.length;i++){
            expect(((seq[i] - seq[i-1]) | 0)).toBe(omega);
        }
    });

    it('LFSR32 with seed 1 first step is poly', () => {
        const lfsr = RecurrenceCatalog.lfsr32; // poly=0x80200003
        const next = lfsr.next([1]);
        // 0x80200003 as signed 32-bit = -2145386493
        expect(next).toBe(-2145386493);
        // seed 0 stays 0 (degenerate), ensure behavior consistent
        expect(lfsr.next([0])).toBe(0);
    });

    it('SplitMix32 produces changing non-degenerate values', () => {
        const sm = RecurrenceCatalog.splitmix32;
        const seed = 0;
        const a = sm.next([seed]);
        const b = sm.next([a]);
        const c = sm.next([b]);
        expect(typeof a).toBe('number');
        expect(typeof b).toBe('number');
        expect(typeof c).toBe('number');
        // Expect the values to change across steps
        expect(new Set([a,b,c]).size).toBe(3);
    });

    it('ROL-Mix default rot=7: seed 1 -> 129', () => {
        const rm = RecurrenceCatalog.rolmix;
        const next = rm.next([1]);
        expect(next).toBe(129);
        // seed 0 -> 0 due to XOR/shift/rot of zero
        expect(rm.next([0])).toBe(0);
    });

    it('Popcount(i) first 10', () => {
        const pc = RecurrenceCatalog.popcount;
        const seq:number[] = [];
        for(let i=0;i<10;i++) seq.push(pc.next([], i));
        expect(seq).toEqual([0,1,1,2,1,2,2,3,1,2]);
    });

});