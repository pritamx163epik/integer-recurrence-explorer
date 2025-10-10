import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RecurrenceInputComponent } from './components/recurrence-input/recurrence-input.component';
import { SequenceViewerComponent } from './components/sequence-viewer/sequence-viewer.component';

@NgModule({
  declarations: [AppComponent, RecurrenceInputComponent, SequenceViewerComponent],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
