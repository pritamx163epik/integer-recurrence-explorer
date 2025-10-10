import { Component } from '@angular/core';
import { RecurrenceService } from './services/recurrence.service';
import { RecurrenceCatalog } from './services/recurrence-factory';

@Component({
  selector: 'app-root',
  template: `
  <div style="padding:12px; max-width:900px; margin:auto">
    <h1>Integer Recurrence Explorer</h1>
    <app-recurrence-input (generate)="onGenerate($event)"></app-recurrence-input>
    <hr />
    <app-sequence-viewer></app-sequence-viewer>
  </div>
  `
})
export class AppComponent {
  keys = Object.keys(RecurrenceCatalog);
  constructor(private svc: RecurrenceService) {}

  onGenerate(payload: {recurrence: any, initial: number[], length: number, max: number, mode: 'mod'|'bounce'}) {
    this.svc.run(payload.recurrence, payload.initial, payload.length, payload.max, payload.mode);
  }
}
