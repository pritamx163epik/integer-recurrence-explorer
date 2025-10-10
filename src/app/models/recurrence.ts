export interface Recurrence {
  name: string;
  description?: string;
  order: number; // number of previous terms used; if order===0 it's full-history or index-driven
  next(values: number[], index?: number): number;
}

export class LambdaRecurrence implements Recurrence {
  constructor(
    public name: string,
    public order: number,
    private rule: (values: number[], index?: number) => number
  ) {}

  next(values: number[], index = 0): number {
    return this.rule(values, index);
  }
}
