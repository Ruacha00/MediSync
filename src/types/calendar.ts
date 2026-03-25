export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  isOutdoor: boolean;
  departureBuffer: number;
}
