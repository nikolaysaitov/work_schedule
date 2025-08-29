import React, { useState, useMemo } from "react";
import { ScheduleFilters, ScheduleMode, Shift } from "../../../app/types";
import { FilterControls } from "../../../features/schedule-filter/ui/FilterControls";
import { ScheduleTable } from "../../../widgets/schedule/ui/ScheduleTable";
import { getUniqueStores, getUniqueEmployees } from "../../../entities/employee/lib";
import { isWithinFourDays } from "../../../shared/lib/date";
import { planData, factData } from "../model/mock";

export const SchedulePage: React.FC = () => {
  const [mode, setMode] = useState<ScheduleMode>("advanced");
  const [filters, setFilters] = useState<ScheduleFilters>({
    startDate: "2025-08-01",
    endDate: "2025-08-04",
    store: "all",
    employee: "all",
  });

  const validatedFilters = useMemo(() => {
    if (mode === "simple" && !isWithinFourDays(filters.startDate, filters.endDate)) {
      const endDate = new Date(filters.startDate);
      endDate.setDate(endDate.getDate() + 3);
      return { ...filters, endDate: endDate.toISOString().split("T")[0] };
    }
    return filters;
  }, [filters, mode]);

  const filteredPlan = useMemo(() => {
    return planData.filter((item) => {
      const itemDate = new Date(item.start).toISOString().split("T")[0];
      return (
        itemDate >= validatedFilters.startDate &&
        itemDate <= validatedFilters.endDate &&
        (validatedFilters.store === "all" || item.store === validatedFilters.store) &&
        (validatedFilters.employee === "all" || item.employee === validatedFilters.employee)
      );
    });
  }, [validatedFilters]);

  const filteredFact = useMemo(() => {
    return factData.filter((item) => {
      const itemDate = new Date(item.start).toISOString().split("T")[0];
      return itemDate >= validatedFilters.startDate && itemDate <= validatedFilters.endDate;
    });
  }, [validatedFilters]);

  const groupedData = useMemo(() => {
    const grouped: { [employee: string]: { [date: string]: Shift[] } } = {};

    filteredPlan.forEach((item) => {
      const date = new Date(item.start).toISOString().split("T")[0];
      if (!grouped[item.employee]) {
        grouped[item.employee] = {};
      }
      if (!grouped[item.employee][date]) {
        grouped[item.employee][date] = [];
      }
      grouped[item.employee][date].push(item);
    });

    return grouped;
  }, [filteredPlan]);

  const days = useMemo(() => {
    const daysArray: Date[] = [];
    const currentDate = new Date(validatedFilters.startDate);
    const endDateObj = new Date(validatedFilters.endDate);

    while (currentDate <= endDateObj) {
      daysArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return daysArray;
  }, [validatedFilters]);

  const stores = getUniqueStores(planData);
  const employees = getUniqueEmployees(planData);

  return (
    <div className="schedule-page">
      <h1>График работы сотрудников</h1>

      <FilterControls
        filters={validatedFilters}
        onFiltersChange={setFilters}
        stores={stores}
        employees={employees}
        mode={mode}
        onModeChange={setMode}
      />

      <ScheduleTable groupedData={groupedData} factData={filteredFact} days={days} mode={mode} />

      {mode === "advanced" && (
        <div className="legend">
          <h3>Условные обозначения:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "8px" }}>
              <span
                style={{ display: "inline-block", width: "20px", height: "15px", backgroundColor: "rgba(52, 152, 219, 0.7)", marginRight: "10px" }}
              ></span>
              Плановое время работы
            </li>
            <li style={{ marginBottom: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "15px",
                  background:
                    "repeating-linear-gradient(45deg, rgba(46, 204, 113, 0.6), rgba(46, 204, 113, 0.6) 5px, rgba(39, 174, 96, 0.6) 5px, rgba(39, 174, 96, 0.6) 10px)",
                  marginRight: "10px",
                }}
              ></span>
              Фактическое время работы
            </li>
            <li style={{ marginBottom: "8px" }}>
              <span style={{ display: "inline-block", width: "20px", height: "15px", border: "2px dashed #e74c3c", marginRight: "10px" }}></span>
              Опоздание
            </li>
            <li style={{ marginBottom: "8px" }}>
              <span style={{ display: "inline-block", width: "20px", height: "15px", border: "2px dotted #f39c12", marginRight: "10px" }}></span>
              Ранний уход
            </li>
            <li>
              <span
                style={{ display: "inline-block", width: "20px", height: "15px", backgroundColor: "rgba(231, 76, 60, 0.3)", marginRight: "10px" }}
              ></span>
              Прогул
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
