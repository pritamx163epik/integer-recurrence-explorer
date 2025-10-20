import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recurrence-details',
  template: `
  <div class="recurrence-details app-container" style="margin-top:12px;">
    <h3 style="margin-top:0">About: {{ title }}</h3>
    <div *ngIf="formula">
      <strong>Formula</strong>
      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre-wrap; background: var(--muted); color: var(--text); border:1px solid var(--border); padding:8px; border-radius:6px;">{{ formula }}</div>
    </div>
    <div *ngIf="notes" style="margin-top:8px;">
      <strong>Notes</strong>
      <div>{{ notes }}</div>
    </div>
    <div *ngIf="initialHint" style="margin-top:8px;">
      <strong>Typical initials</strong>
      <div>{{ initialHint }}</div>
    </div>
  </div>
  `
})
export class RecurrenceDetailsComponent {
  @Input() key: string = '';
  @Input() xA: number = 13; @Input() xB: number = 17; @Input() xC: number = 5; // xorshift
  @Input() lcgA: number = 1664525; @Input() lcgC: number = 1013904223;        // lcg32
  @Input() weylOmega: string = '0x9E3779B9';                                   // weyl32
  @Input() lfsrPoly: string = '0x80200003';                                    // lfsr32
  @Input() rolRot: number = 7;                                                 // rolmix

  get title(): string {
    const k = this.key;
    const map: any = {
      fibonacci: 'Fibonacci sequence',
      lucas: 'Lucas numbers',
      tribonacci: 'Tribonacci sequence',
      pell: 'Pell numbers',
      padovan: 'Padovan sequence',
      perrin: 'Perrin sequence',
      collatz: 'Collatz map',
      gray: 'Gray code (index‑driven)',
      thueMorse: 'Thue‑Morse sequence (index parity)',
      popcount: 'Hamming weight of index',
      vdc2: 'Van der Corput base‑2 (bit‑reverse)',
      xorshift: 'Xorshift (32‑bit)',
      lcg32: 'Linear Congruential Generator (32‑bit)',
      weyl32: 'Weyl sequence (32‑bit additive)',
      lfsr32: 'Galois LFSR (32‑bit)',
      splitmix32: 'SplitMix32 step',
      rolmix: 'ROL‑Mix (rotate/xor)'
    };
    return map[k] ?? k;
  }

  get formula(): string {
    switch (this.key) {
      case 'fibonacci':
        return 'a(n) = a(n-1) + a(n-2)';
      case 'lucas':
        return 'a(n) = a(n-1) + a(n-2)';
      case 'tribonacci':
        return 'a(n) = a(n-1) + a(n-2) + a(n-3)';
      case 'pell':
        return 'a(n) = 2·a(n-1) + a(n-2)';
      case 'padovan':
        return 'a(n) = a(n-2) + a(n-3)';
      case 'perrin':
        return 'a(n) = a(n-2) + a(n-3)';
      case 'collatz':
        return 'a(n+1) = { a(n)/2  if a(n) is even;  3·a(n) + 1  if a(n) is odd }';
      case 'gray':
        return 'a(i) = i XOR (i >>> 1)  (computed from index i)';
      case 'thueMorse':
        return 'a(i) = popcount(i) mod 2  (parity of set bits in i)';
      case 'popcount':
        return 'a(i) = number of 1‑bits in binary expansion of i';
      case 'vdc2':
        return 'a(i) = bit‑reversal of 32‑bit index i (Van der Corput base‑2)';
      case 'xorshift':
        return `x ← x ⊕ (x << ${this.xA});  x ← x ⊕ (x >>> ${this.xB});  x ← x ⊕ (x << ${this.xC}) (on 32‑bit)`;
      case 'lcg32':
        return `x ← (a·x + c) mod 2^32,  with a = ${this.lcgA}, c = ${this.lcgC}`;
      case 'weyl32':
        return `x ← (x + ω) mod 2^32,  with ω = ${this.weylOmega}`;
      case 'lfsr32':
        return `Right‑shift LFSR; if LSB was 1 then x ← x ⊕ poly,  poly = ${this.lfsrPoly}`;
      case 'splitmix32':
        return 'x ← x + 0x9E3779B9;  z ← x;  z ^= z>>>16; z *= 0x7FEB352D; z ^= z>>>15; z *= 0x846CA68B; z ^= z>>>16 (mod 2^32)';
      case 'rolmix':
        return `x ← (rotl(x, ${this.rolRot}) ⊕ x ⊕ (x >>> 3)) (on 32‑bit)`;
      default:
        return '';
    }
  }

  get notes(): string {
    switch (this.key) {
      case 'fibonacci':
        return 'Classic order‑2 linear recurrence. Typical initials: 0, 1.';
      case 'lucas':
        return 'Same recurrence as Fibonacci but different initials. Typical initials: 2, 1.';
      case 'tribonacci':
        return 'Order‑3 analogue of Fibonacci. Typical initials: 0, 0, 1.';
      case 'pell':
        return 'Order‑2 linear recurrence with characteristic x^2 − 2x − 1.';
      case 'padovan':
        return 'Non‑consecutive order terms (n−2 and n−3). Typical initials: 1, 1, 1.';
      case 'perrin':
        return 'Shares the Padovan relation with different initials: 3, 0, 2.';
      case 'collatz':
        return 'Iterates the 3n+1 map; defined for positive integers only.';
      case 'gray':
        return 'Binary‑reflected Gray code; successive values differ by one bit. Index‑driven, initials are ignored.';
      case 'thueMorse':
        return 'Balanced automatic sequence from index parity; 0/1 values. Index‑driven, initials are ignored.';
      case 'popcount':
        return 'Hamming weight of the index i. Index‑driven, initials are ignored.';
      case 'vdc2':
        return 'Bit‑reversal of the 32‑bit index; produces a low‑discrepancy permutation over 32‑bit integers.';
      case 'xorshift':
        return 'Bitwise PRNG on 32‑bit integers; quality depends on shift triplet (A,B,C). Avoid zero seed.';
      case 'lcg32':
        return 'Classic PRNG: multiply‑add modulo 2^32. Period and quality depend on parameters a and c.';
      case 'weyl32':
        return 'Deterministic additive walk on the 32‑bit ring; often used as a mixing component.';
      case 'lfsr32':
        return 'Galois form LFSR; seed must be non‑zero. Polynomial chooses the tap pattern.';
      case 'splitmix32':
        return 'A 32‑bit variant of SplitMix step with strong bit diffusion; useful for hashing/mixing.';
      case 'rolmix':
        return 'Simple rotate/xor mix step operating on 32‑bit words.';
      default:
        return '';
    }
  }

  get initialHint(): string {
    switch (this.key) {
      case 'fibonacci': return '0 1';
      case 'lucas': return '2 1';
      case 'tribonacci': return '0 0 1';
      case 'pell': return '0 1';
      case 'padovan': return '1 1 1';
      case 'perrin': return '3 0 2';
      case 'collatz': return 'Positive integer, e.g., 7';
      case 'gray': return 'Index‑driven; initials are ignored';
      case 'thueMorse': return 'Index‑driven; initials are ignored';
      case 'popcount': return 'Index‑driven; initials are ignored';
      case 'vdc2': return 'Index‑driven; initials are ignored';
      case 'xorshift': return 'Non‑zero 32‑bit seed, e.g., 123456789';
      case 'lcg32': return 'Any 32‑bit seed';
      case 'weyl32': return 'Any 32‑bit seed; ω often 0x9E3779B9';
      case 'lfsr32': return 'Seed must be non‑zero';
      case 'splitmix32': return 'Any 32‑bit seed';
      case 'rolmix': return 'Any 32‑bit seed';
      default: return '';
    }
  }
}
