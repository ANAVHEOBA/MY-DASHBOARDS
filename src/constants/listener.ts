export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

export const DEFAULT_TIME_SLOTS = {
  weekday: [
    { startTime: '09:00', endTime: '12:00' },
    { startTime: '13:00', endTime: '17:00' }
  ],
  weekend: [
    { startTime: '10:00', endTime: '14:00' }
  ]
};

export const SPECIALTIES = [
  'ANXIETY',
  'DEPRESSION',
  'RELATIONSHIPS',
  'STRESS',
  'TRAUMA',
  'GRIEF',
  'SELF_ESTEEM'
] as const;

export const LANGUAGES = [
  'ENGLISH',
  'SPANISH',
  'FRENCH',
  'GERMAN',
  'MANDARIN',
  'ARABIC'
] as const;

export const GENDERS = [
  'male',
  'female',
  'other'
] as const;