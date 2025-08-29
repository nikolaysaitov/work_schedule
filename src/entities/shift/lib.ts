import { Shift } from '../../app/types';
import { ShiftDeviations } from './types';

export const checkDeviations = (planShift: Shift, factShifts: Shift[]): ShiftDeviations & { factShift?: Shift } => {
  const factShift = factShifts.find(f => f.id === planShift.id);
  
  if (!factShift) {
    return { 
      isLate: false, 
      isEarly: false, 
      isAbsent: true,
      factShift: undefined
    };
  }

  const planStart = new Date(planShift.start);
  const planEnd = new Date(planShift.end);
  const factStart = new Date(factShift.start);
  const factEnd = new Date(factShift.end);

  return {
    isLate: factStart > planStart,
    isEarly: factEnd < planEnd,
    isAbsent: false,
    factStart: factShift.start,
    factEnd: factShift.end,
    factShift
  };
};