export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

export enum ActivityType {
  Class = 'Class',
  Work = 'Work',
  Event = 'Event',
  Extra = 'Extracurricular',
  Study = 'Study' // Added by AI or User manually
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface ScheduleItem {
  id: string;
  title: string;
  type: ActivityType;
  day: DayOfWeek;
  startTime: string; // HH:mm 24h format
  endTime: string;   // HH:mm 24h format
  location?: string;
  priority: Priority;
  isAiSuggested?: boolean;
}

export interface AiSuggestion {
  title: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  reason: string; // Why the AI thinks this is a good time
}

export const DAYS_ORDER = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday
];