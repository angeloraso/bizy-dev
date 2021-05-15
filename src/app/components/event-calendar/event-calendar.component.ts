import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';

export interface ICalendarEvent {
  name: string;
  date: Date;
  color: string;
}

@Component({
  selector: 'event-calendar',
  templateUrl: 'event-calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCalendarComponent implements OnChanges {
  @Input('date') viewDate: Date = new Date();
  @Input() selectCurrentDay: boolean = false;
  @Input() events: Array<ICalendarEvent>;
  @Output() clickDay = new EventEmitter<any>();

  calendarEvents: Array<CalendarEvent> = [];

  ngOnChanges() {
    this.calendarEvents = [];
    this.events.forEach(_event => {
      const calendarEvent: CalendarEvent = {
        title: _event.name,
        start: _event.date,
        end: _event.date,
        color: {
          primary: _event.color,
          secondary: this.lighthen(_event.color, 100)
        },
        allDay: true,
        actions: [],
        resizable: {
          beforeStart: false,
          afterEnd: false
        },
        draggable: false
      };
      this.calendarEvents.push(calendarEvent);
    });

    this.calendarEvents = [...this.calendarEvents];
  }

  lighthen(color: string, percent: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + percent)).toString(16)).substr(-2));
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.selectCurrentDay === true) ||
        events.length === 0
      ) {
        this.selectCurrentDay = false;
      } else {
        this.selectCurrentDay = true;
      }

      this.viewDate = date;
    }
  }
}
