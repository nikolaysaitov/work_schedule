import React from "react";
import { ScheduleFilters } from "../../../app/types";
import { Button } from "../../../shared/ui/Button/Button";
import "./FilterControls.css";

interface FilterControlsProps {
  filters: ScheduleFilters;
  onFiltersChange: (filters: ScheduleFilters) => void;
  stores: string[];
  employees: string[];
  mode: "simple" | "advanced";
  onModeChange: (mode: "simple" | "advanced") => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFiltersChange, stores, employees, mode, onModeChange }) => {
  const handleFilterChange = (key: keyof ScheduleFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <>
      <div className="mode-toggle">
        <Button active={mode === "simple"} onClick={() => onModeChange("simple")}>
          Облегченный режим
        </Button>
        <Button active={mode === "advanced"} onClick={() => onModeChange("advanced")}>
          Расширенный режим
        </Button>
      </div>
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="start-date">Начальная дата:</label>
          <input type="date" id="start-date" value={filters.startDate} onChange={(e) => handleFilterChange("startDate", e.target.value)} />
        </div>

        <div className="filter-group">
          <label htmlFor="end-date">Конечная дата:</label>
          <input type="date" id="end-date" value={filters.endDate} onChange={(e) => handleFilterChange("endDate", e.target.value)} />
        </div>

        <div className="filter-group">
          <label htmlFor="store">Магазин:</label>
          <select id="store" value={filters.store} onChange={(e) => handleFilterChange("store", e.target.value)}>
            <option value="all">Все магазины</option>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="employee">Сотрудник:</label>
          <select id="employee" value={filters.employee} onChange={(e) => handleFilterChange("employee", e.target.value)}>
            <option value="all">Все сотрудники</option>
            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
