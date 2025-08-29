import React, { useState } from "react";
import { Shift, ScheduleMode } from "../../../app/types";
import { formatTime, getPositionInDay } from "../../../shared/lib/date";
import { checkDeviations } from "../../../entities/shift/lib";
import { Modal } from "../../../shared/ui/Modal/Modal";
import { ShiftDetails } from "../../../entities/shift/ui/ShiftDetails";
import "./ScheduleTable.css";

interface ScheduleTableProps {
  groupedData: { [employee: string]: { [date: string]: Shift[] } };
  factData: Shift[];
  days: Date[];
  mode: ScheduleMode;
}

interface SelectedShiftInfo {
  shift: Shift;
  deviations: ReturnType<typeof checkDeviations>;
  isFactShift?: boolean;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ groupedData, factData, days, mode }) => {
  const [selectedShift, setSelectedShift] = useState<SelectedShiftInfo | null>(null);

  const handlePlanShiftClick = (shift: Shift) => {
    const deviations =
      mode === "advanced" ? checkDeviations(shift, factData) : { isLate: false, isEarly: false, isAbsent: false, factShift: undefined };

    setSelectedShift({ shift, deviations, isFactShift: false });
  };

  const handleFactShiftClick = (planShift: Shift, factShift: Shift) => {
    const deviations = {
      isLate: new Date(factShift.start) > new Date(planShift.start),
      isEarly: new Date(factShift.end) < new Date(planShift.end),
      isAbsent: false,
      factStart: factShift.start,
      factEnd: factShift.end,
      factShift,
    };

    setSelectedShift({ shift: factShift, deviations, isFactShift: true });
  };

  const handleCloseModal = () => {
    setSelectedShift(null);
  };

  return (
    <div className="schedule-container">
      <table>
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Магазин</th>
            <th>Роль</th>
            {days.map((day) => (
              <th key={day.toISOString()}>
                {day.toLocaleDateString("ru-RU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((employee) => {
            const employeeData = groupedData[employee];
            const firstItem = Object.values(employeeData).flat()[0];

            return (
              <tr key={employee} className="employee-row">
                <td className="employee-row-element">{employee}</td>
                <td className="employee-row-element">{firstItem.store}</td>
                <td className="employee-row-element">{firstItem.role}</td>
                {days.map((day) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const shifts = employeeData[dateStr] || [];

                  return (
                    <td key={dateStr} className="time-cell">
                      {shifts.map((shift) => {
                        console.log(
                          "shift",
                          shifts.filter((s) => s.employee.includes("Сидоров"))
                        );
                        const deviations =
                          mode === "advanced"
                            ? checkDeviations(shift, factData)
                            : { isLate: false, isEarly: false, isAbsent: false, factShift: undefined };

                        return (
                          <div key={shift.id} className="shift-container">
                            <div
                              className={`shift plan-shift ${deviations.isLate ? "late" : ""} ${deviations.isEarly ? "early" : ""} ${
                                deviations.isAbsent ? "absent" : ""
                              }`}
                              style={{
                                left: `${getPositionInDay(shift.start, dateStr)}%`,
                                width: `${getPositionInDay(shift.end, dateStr) - getPositionInDay(shift.start, dateStr)}%`,
                              }}
                              onClick={() => handlePlanShiftClick(shift)}
                              title={`План: ${formatTime(shift.start)} - ${formatTime(shift.end)}\nКликните для подробной информации`}
                            />

                            {mode === "advanced" && deviations.factShift && (
                              <div
                                className="shift fact-shift"
                                style={{
                                  left: `${getPositionInDay(deviations.factShift.start, dateStr)}%`,
                                  width: `${
                                    getPositionInDay(deviations.factShift.end, dateStr) - getPositionInDay(deviations.factShift.start, dateStr)
                                  }%`,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFactShiftClick(shift, deviations.factShift!);
                                }}
                                title={`Факт: ${formatTime(deviations.factShift.start)} - ${formatTime(
                                  deviations.factShift.end
                                )}\nКликните для информации о фактическом времени`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal
        isOpen={!!selectedShift}
        onClose={handleCloseModal}
        title={selectedShift?.isFactShift ? "Фактическое время работы" : "Плановое время работы"}
      >
        {selectedShift && (
          <ShiftDetails
            shift={selectedShift.shift}
            factShift={selectedShift.deviations.factShift}
            isLate={selectedShift.deviations.isLate}
            isEarly={selectedShift.deviations.isEarly}
            isAbsent={selectedShift.deviations.isAbsent}
            showFactDetails={selectedShift.isFactShift}
          />
        )}
      </Modal>
    </div>
  );
};
