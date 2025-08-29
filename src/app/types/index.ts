export interface Shift {
    id: number;
    employee: string;
    store: string;
    role: string;
    start: string;
    end: string;
  }
  
  export interface ShiftWithDeviations extends Shift {
    isLate?: boolean;
    isEarly?: boolean;
    isAbsent?: boolean;
    factStart?: string;
    factEnd?: string;
  }
  
  export interface ScheduleFilters {
    startDate: string;
    endDate: string;
    store: string;
    employee: string;
  }
  
  export type ScheduleMode = 'simple' | 'advanced';