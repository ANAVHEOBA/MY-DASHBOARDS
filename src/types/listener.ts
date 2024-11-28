export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  _id?: string;
}

export interface DayAvailability {
  dayOfWeek: string;
  times: TimeSlot[];
  _id?: string;
}

export interface Listener {
  _id?: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'other';
  availability: DayAvailability[];
}

// Add this FormErrors interface
export interface FormErrors {
  name?: string;
  description?: string;
  gender?: string;
  availability?: string;
}

export interface ApiResponse {
  listener: Listener;
}