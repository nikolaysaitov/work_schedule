import { Shift } from '../../app/types';

export const getUniqueEmployees = (shifts: Shift[]): string[] => {
  return [...new Set(shifts.map(shift => shift.employee))];
};

export const getUniqueStores = (shifts: Shift[]): string[] => {
  return [...new Set(shifts.map(shift => shift.store))];
};

export const getEmployeesByStore = (shifts: Shift[], store: string): string[] => {
  return [...new Set(shifts
    .filter(shift => shift.store === store)
    .map(shift => shift.employee)
  )];
};