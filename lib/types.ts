export interface Topic {
  id: string;
  title: string;
  totalDays: number;
}

export interface DayEntry {
  day: number;
  title?: string;
  imagePath?: string;
  driveUrl?: string;
}
