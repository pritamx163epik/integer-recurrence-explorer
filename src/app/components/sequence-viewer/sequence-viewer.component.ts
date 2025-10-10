import { Component } from '@angular/core';
import { RecurrenceService } from '../../services/recurrence.service';

@Component({
  selector: 'app-sequence-viewer',
  template: `
  <div class="sequence-viewer" style="display:grid; gap:8px;">
    <div style="display:flex; gap:8px; align-items:center;">
      <button (click)="copy()">Copy to Clipboard</button>
      <button (click)="download()">Download .txt</button>
      <div style="margin-left:auto">Terms: {{seq.length}}</div>
    </div>
    <textarea [value]="seq.join(' ')" rows="8" style="width:100%; font-family:monospace;"></textarea>
  </div>
  `
})
export class SequenceViewerComponent {
  seq: number[] = [];
  constructor(private srv: RecurrenceService) {
    this.srv.sequence$.subscribe(s => this.seq = s);
  }

  copy() {
    this.srv.copyToClipboard().then(() => alert('Copied to clipboard')).catch(err => alert('Copy failed: ' + err));
  }

  download() {
    const blob = new Blob([this.seq.join(' ')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sequence.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
}
