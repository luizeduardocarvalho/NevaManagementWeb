export class CalendarDto {
  month: number;
  days: CalendarDayDto[];

  constructor(month: number, days: CalendarDayDto[]) {
    this.month = month;
    this.days = days;
  }
}

export class CalendarDayDto {
  dayNumber: number;
  appointments: CalendarAppointmentDto[];

  constructor(dayNumber: number, appointments: CalendarAppointmentDto[]) {
    this.dayNumber = dayNumber;
    this.appointments = appointments;
  }
}

export class CalendarAppointmentDto {
  startDate: Date;
  endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
