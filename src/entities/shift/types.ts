import { Shift } from '../../app/types';

export interface ShiftDeviations {
  isLate: boolean;
  isEarly: boolean;
  isAbsent: boolean;
  factStart?: string;
  factEnd?: string;
  factShift?: Shift;
}