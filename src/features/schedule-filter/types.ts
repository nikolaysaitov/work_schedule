import { ScheduleFilters } from '../../app/types';

export interface FilterProps {
  filters: ScheduleFilters;
  onFiltersChange: (filters: ScheduleFilters) => void;
  stores: string[];
  employees: string[];
  mode: 'simple' | 'advanced';
}