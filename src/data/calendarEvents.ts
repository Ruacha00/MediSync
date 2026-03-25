import type { CalendarEvent } from '@/types';

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'cal-001',
    title: 'Team Standup',
    startTime: '2026-03-25T09:00:00',
    endTime: '2026-03-25T09:30:00',
    location: 'Office - Room 301',
    isOutdoor: true,
    departureBuffer: 30,
  },
  {
    id: 'cal-002',
    title: 'Doctor Appointment',
    startTime: '2026-03-26T14:00:00',
    endTime: '2026-03-26T15:30:00',
    location: 'City General Hospital',
    isOutdoor: true,
    departureBuffer: 45,
  },
  {
    id: 'cal-003',
    title: 'Lunch with Client',
    startTime: '2026-03-25T12:00:00',
    endTime: '2026-03-25T13:30:00',
    location: 'Downtown Restaurant',
    isOutdoor: true,
    departureBuffer: 25,
  },
  {
    id: 'cal-004',
    title: 'Yoga Class',
    startTime: '2026-03-27T07:00:00',
    endTime: '2026-03-27T08:00:00',
    location: 'Community Center',
    isOutdoor: true,
    departureBuffer: 20,
  },
  {
    id: 'cal-005',
    title: 'Board Meeting',
    startTime: '2026-03-25T15:00:00',
    endTime: '2026-03-25T17:00:00',
    location: 'HQ Conference Room',
    isOutdoor: false,
    departureBuffer: 0,
  },
];
