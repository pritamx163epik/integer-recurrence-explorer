import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RecurrenceInputComponent } from './components/recurrence-input/recurrence-input.component';
import { RecurrenceDetailsComponent } from './components/recurrence-details/recurrence-details.component';
import { SequenceViewerComponent } from './components/sequence-viewer/sequence-viewer.component';

@NgModule({
  declarations: [AppComponent, RecurrenceInputComponent, SequenceViewerComponent, RecurrenceDetailsComponent],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
