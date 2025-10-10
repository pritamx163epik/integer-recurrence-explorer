import { RecurrenceService } from './recurrence.service';
import { LambdaRecurrence } from '../models/recurrence';

describe('RecurrenceService', () => {
  it('generates Fibonacci with first-N initials [0,1]', () => {
    const svc = new RecurrenceService();
    const fib = new LambdaRecurrence('Fibonacci', 2, ([a,b]) => a + b);
    // Use same path as GUI: run()
    // length 10 should produce the canonical first 10 terms
    // initial longer/shorter handling is done in service; provide exact [0,1]
    (svc as any).seq$.next([]);
    svc.run(fib, [0,1], 10);
    let got: number[] = [];
    (svc as any).sequence$.subscribe((s: number[]) => got = s);
    expect(got).toEqual([0,1,1,2,3,5,8,13,21,34]);
  });

  it('uses first-N if more initials are provided (Fibonacci [0,1,2])', () => {
    const svc = new RecurrenceService();
    const fib = new LambdaRecurrence('Fibonacci', 2, ([a,b]) => a + b);
    svc.run(fib, [0,1,2], 8); // should use [0,1] as first-N
    let got: number[] = [];
    (svc as any).sequence$.subscribe((s: number[]) => got = s);
    expect(got.slice(0,8)).toEqual([0,1,1,2,3,5,8,13]);
  });

  it('pads with zeros when not enough initials (Fibonacci [1])', () => {
    const svc = new RecurrenceService();
    const fib = new LambdaRecurrence('Fibonacci', 2, ([a,b]) => a + b);
    svc.run(fib, [1], 6); // should treat as [0,1]
    let got: number[] = [];
    (svc as any).sequence$.subscribe((s: number[]) => got = s);
    expect(got.slice(0,6)).toEqual([0,1,1,2,3,5]);
  });
});
