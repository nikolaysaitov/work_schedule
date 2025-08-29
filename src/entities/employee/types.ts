
import { Shift } from '../../app/types';
export interface Employee {
    name: string;
    store: string;
    role: string;
    shifts: Shift[];
  }
  
  export interface EmployeeStats {
    totalShifts: number;
    totalHours: number;
    lateCount: number;
    earlyLeaveCount: number;
  }