import { Shift, ScheduleFilters, ScheduleMode } from "../../app/types";

export interface ScheduleWidgetProps {
  planData: Shift[];
  factData: Shift[];
  filters: ScheduleFilters;
  mode: ScheduleMode;
}
