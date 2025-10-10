import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recurrence } from '../models/recurrence';

@Injectable({ providedIn: 'root' })
export class RecurrenceService {
    private seq$ = new BehaviorSubject<number[]>([]);
    get sequence$(): Observable<number[]> { return this.seq$.asObservable(); }

    run(recurrence: Recurrence, initial: number[], length: number, maxValue: number = Number.MAX_SAFE_INTEGER, mode: 'mod'|'bounce'='mod') {
        if(!initial||initial.length===0) throw new Error('Initial conditions required');
    // Always use exactly 'order' initial values, pad with zeros if too short, or use first 'order' if too long
    let init = initial.slice(0, recurrence.order);
    while (init.length < recurrence.order) init.unshift(0);
    const seq: number[] = init.slice();
        for(let i=seq.length;i<length;i++){
            const needed = recurrence.order;
            let window = seq.slice(Math.max(0, i - needed), i);
            if (window.length < needed) {
                window = Array(needed - window.length).fill(0).concat(window);
            }
            let next = recurrence.next(window,i);
            next = this.applyMax(next,maxValue,mode);
            seq.push(Math.trunc(next));
        }
        this.seq$.next(seq);
    }

    private applyMax(value:number,max:number,mode:'mod'|'bounce'):number{
        if(!Number.isFinite(max) || max===Number.MAX_SAFE_INTEGER) return value;
        if(max<=0) return 0;
        if(mode==='mod') return ((value%max)+max)%max;
        const period = 2*(max-1);
        let k = ((value%period)+period)%period;
        if(k>=max) k=period-k;
        return k;
    }

    copyToClipboard(): Promise<void>{
        return navigator.clipboard.writeText(this.seq$.value.join(' '));
    }
}