import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.sass']
})
export class DatePickerComponent implements OnInit {
  @Input()
  date: Date = new Date();

  @Output() UpdateTime = new EventEmitter<Date>();
  constructor() {}

  ngOnInit() {}

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const oldDate = new Date(event.value);
    const date = this.getDate(oldDate);
    if (this.date !== date) {
      this.UpdateTime.emit(date);
    }
  }
  getDate(d: Date): Date {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }
}
