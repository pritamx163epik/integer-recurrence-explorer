import { Component, EventEmitter, Output } from '@angular/core';
import { RecurrenceCatalog, xorshiftFactory, lcg32Factory, weyl32Factory, lfsr32Factory, splitmix32Factory, rolMixFactory } from '../../services/recurrence-factory';
import { Recurrence, LambdaRecurrence } from '../../models/recurrence';

@Component({
  selector: 'app-recurrence-input',
  template: `
  <div class="recurrence-input" style="display:grid; gap:8px;">
    <label>
      Recurrence:
      <select [(ngModel)]="selectedKey" (ngModelChange)="onRecurrenceChanged($event)">
        <option *ngFor="let k of keys" [value]="k">{{k}}</option>
      </select>
    </label>


    <label>
      Initial conditions (space-separated):
      <input type="text" [(ngModel)]="initialText" placeholder="e.g. 0 1" />
    </label>

    <!-- Parameter inputs for specific generators -->
    <div *ngIf="selectedKey==='xorshift'" style="display:flex; gap:8px; align-items:end; flex-wrap:wrap;">
      <label>A: <input type="number" [(ngModel)]="xA" placeholder="13" /></label>
      <label>B: <input type="number" [(ngModel)]="xB" placeholder="17" /></label>
      <label>C: <input type="number" [(ngModel)]="xC" placeholder="5" /></label>
      <small>Shifts for xorshift (A,B,C)</small>
    </div>

    <div *ngIf="selectedKey==='lcg32'" style="display:flex; gap:8px; align-items:end; flex-wrap:wrap;">
      <label>a: <input type="number" [(ngModel)]="lcgA" placeholder="1664525" /></label>
      <label>c: <input type="number" [(ngModel)]="lcgC" placeholder="1013904223" /></label>
    </div>

    <div *ngIf="selectedKey==='weyl32'" style="display:flex; gap:8px; align-items:end; flex-wrap:wrap;">
      <label>omega: <input type="text" [(ngModel)]="weylOmega" placeholder="0x9E3779B9" /></label>
    </div>

    <div *ngIf="selectedKey==='lfsr32'" style="display:flex; gap:8px; align-items:end; flex-wrap:wrap;">
      <label>poly (hex): <input type="text" [(ngModel)]="lfsrPoly" placeholder="0x80200003" /></label>
    </div>

    <div *ngIf="selectedKey==='rolmix'" style="display:flex; gap:8px; align-items:end; flex-wrap:wrap;">
      <label>rot: <input type="number" [(ngModel)]="rolRot" placeholder="7" /></label>
    </div>

    <label>
      Length:
      <input type="number" [(ngModel)]="length" min="1" />
    </label>
    <label>
      Max value:
      <input type="number" [(ngModel)]="max" />
    </label>
    <label>
      Mode:
      <select [(ngModel)]="mode">
        <option value="mod">mod</option>
        <option value="bounce">bounce</option>
      </select>
    </label>
    <div style="display:flex; gap:8px;">
      <button (click)="onGenerate()">Generate</button>
      <button (click)="onPresetInitial()">Fill default initial</button>
    </div>
  </div>
  `
})
export class RecurrenceInputComponent {
  keys = Object.keys(RecurrenceCatalog).filter(k => (RecurrenceCatalog as any)[k] instanceof LambdaRecurrence);
  selectedKey = this.keys[0];
  initialText = '0 1';
  length = 32;
  max = Number.MAX_SAFE_INTEGER;
  mode: 'mod'|'bounce' = 'mod';
  @Output() generate = new EventEmitter<{recurrence: Recurrence, initial: number[], length: number, max: number, mode: 'mod'|'bounce'}>();

  // Parameter models with defaults
  xA: number = 13; xB: number = 17; xC: number = 5;
  lcgA: number = 1664525; lcgC: number = 1013904223;
  weylOmega: string = '0x9E3779B9';
  lfsrPoly: string = '0x80200003';
  rolRot: number = 7;

  parseInitial(text: string): number[] {
    if (!text || !text.trim()) return [];
    return text.trim().split(/\s+/).map(s => parseInt(s, 10));
  }

  onPresetInitial() {
    // If user selects a named recurrence, populate reasonable defaults
    const k = this.selectedKey;
    if (k === 'fibonacci') this.initialText = '0 1';
    else if (k === 'lucas') this.initialText = '2 1';
    else if (k === 'tribonacci') this.initialText = '0 0 1';
    else if (k === 'pell') this.initialText = '0 1';
    else if (k === 'padovan') this.initialText = '1 1 1';
    else if (k === 'perrin') this.initialText = '3 0 2';
    else if (k === 'collatz') this.initialText = '7';
    else if (k === 'xorshift') this.initialText = '123456789';
    else if (k === 'lcg32') this.initialText = '123456789';
    else if (k === 'weyl32') this.initialText = '123456789';
    else if (k === 'lfsr32') this.initialText = '1';
    else if (k === 'splitmix32') this.initialText = '123456789';
    else if (k === 'rolmix') this.initialText = '123456789';
    else if (k === 'recaman') this.initialText = '0';
    else this.initialText = '0 1';
  }

  onRecurrenceChanged(key: string) {
    this.selectedKey = key;
    // Automatically adjust initials on selection to avoid degenerate sequences
    this.onPresetInitial();
  }

  onGenerate() {
  let rec: Recurrence = (RecurrenceCatalog as any)[this.selectedKey];
    const initial = this.parseInitial(this.initialText);
    if (!initial || initial.length === 0) {
      alert('Please provide initial conditions as space-separated integers');
      return;
    }
    // Rebuild parameterized recurrences with current parameters
    if (this.selectedKey === 'xorshift') {
      const A = Number(this.xA) || 13;
      const B = Number(this.xB) || 17;
      const C = Number(this.xC) || 5;
      rec = xorshiftFactory(A,B,C);
    } else if (this.selectedKey === 'lcg32') {
      const a = Number(this.lcgA) || 1664525;
      const c = Number(this.lcgC) || 1013904223;
      rec = lcg32Factory(a,c);
    } else if (this.selectedKey === 'weyl32') {
      const omega = this.parseMaybeHex(this.weylOmega, 0x9E3779B9);
      rec = weyl32Factory(omega);
    } else if (this.selectedKey === 'lfsr32') {
      const poly = this.parseMaybeHex(this.lfsrPoly, 0x80200003);
      rec = lfsr32Factory(poly >>> 0);
    } else if (this.selectedKey === 'splitmix32') {
      rec = splitmix32Factory();
    } else if (this.selectedKey === 'rolmix') {
      const rot = Number(this.rolRot) || 7;
      rec = rolMixFactory(rot);
    }

    // Enforce safe defaults for single-term recurrences that degenerate on zero
    if (this.selectedKey === 'collatz') {
      if (!Number.isFinite(initial[0]) || initial[0] <= 0) initial[0] = 7;
    } else if (this.selectedKey === 'xorshift') {
      if (!Number.isFinite(initial[0]) || initial[0] === 0) initial[0] = 123456789;
    } else if (this.selectedKey === 'lfsr32') {
      if (!Number.isFinite(initial[0]) || initial[0] === 0) initial[0] = 1; // seed 0 locks LFSR
    }
    let max = Number(this.max);
    if (!max || isNaN(max) || max < 1) max = Number.MAX_SAFE_INTEGER;
    let length = Number(this.length);
    if (!length || isNaN(length) || length < initial.length) length = Math.max(initial.length, 1);
    this.generate.emit({recurrence: rec, initial, length, max, mode: this.mode});
  }

  private parseMaybeHex(text: string, fallback: number): number {
    if (!text) return fallback;
    const t = String(text).trim();
    if (/^0x[0-9a-fA-F]+$/.test(t)) {
      const v = parseInt(t, 16);
      return Number.isFinite(v) ? v >>> 0 : fallback;
    }
    const n = Number(t);
    return (Number.isFinite(n) ? (n >>> 0) : fallback);
  }
}
