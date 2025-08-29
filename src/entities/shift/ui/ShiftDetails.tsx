import React from "react";
import { Shift } from "../../../app/types";
import { formatDuration, formatDateTime } from "../../../shared/lib/date";
import "./ShiftDetails.css";
interface ShiftDetailsProps {
  shift: Shift;
  factShift?: Shift;
  isLate?: boolean;
  isEarly?: boolean;
  isAbsent?: boolean;
  showFactDetails?: boolean;
}

export const ShiftDetails: React.FC<ShiftDetailsProps> = ({ shift, factShift, isAbsent, showFactDetails = false }) => {
  const calculateDeviation = () => {
    if (!factShift) return null;

    const planStart = new Date(shift.start);
    const planEnd = new Date(shift.end);
    const actualStart = new Date(factShift.start);
    const actualEnd = new Date(factShift.end);

    const startDeviation = (actualStart.getTime() - planStart.getTime()) / (1000 * 60);
    const endDeviation = (actualEnd.getTime() - planEnd.getTime()) / (1000 * 60);
    const durationDeviation = (actualEnd.getTime() - actualStart.getTime() - (planEnd.getTime() - planStart.getTime())) / (1000 * 60);

    return { startDeviation, endDeviation, durationDeviation };
  };

  const deviations = calculateDeviation();

  return (
    <div className="shift-details">
      <h4>Информация о {showFactDetails ? "фактической" : "плановой"} смене</h4>

      {!showFactDetails ? (
        <div className="detail-section">
          <h5>Плановое время</h5>
          <p>
            <strong>Начало:</strong> {formatDateTime(shift.start)}
          </p>
          <p>
            <strong>Окончание:</strong> {formatDateTime(shift.end)}
          </p>
          <p>
            <strong>Длительность:</strong> {formatDuration(shift.start, shift.end)}
          </p>
        </div>
      ) : (
        <div className="detail-section">
          <h5>Фактическое время</h5>
          <p>
            <strong>Начало:</strong> {formatDateTime(factShift!.start)}
          </p>
          <p>
            <strong>Окончание:</strong> {formatDateTime(factShift!.end)}
          </p>
          <p>
            <strong>Длительность:</strong> {formatDuration(factShift!.start, factShift!.end)}
          </p>
        </div>
      )}

      {factShift && !showFactDetails && (
        <div className="detail-section">
          <h5>Что-то пошло не так:</h5>
          {deviations && (
            <>
              {deviations.startDeviation > 0 && (
                <p className="deviation late">
                  <strong>Опоздание:</strong> {Math.abs(deviations.startDeviation)} минут
                </p>
              )}
              {deviations.startDeviation < 0 && (
                <p className="deviation early">
                  <strong>Пришел раньше:</strong> {Math.abs(deviations.startDeviation)} минут
                </p>
              )}
              {deviations.endDeviation < 0 && (
                <p className="deviation early">
                  <strong>Ушел раньше:</strong> {Math.abs(deviations.endDeviation)} минут
                </p>
              )}
              {deviations.endDeviation > 0 && (
                <p className="deviation">
                  <strong>Задержался:</strong> {Math.abs(deviations.endDeviation)} минут
                </p>
              )}
              {deviations.durationDeviation !== 0 && (
                <p className={deviations.durationDeviation > 0 ? "deviation" : "deviation early"}>
                  <strong>Разница по времени:</strong> {Math.abs(deviations.durationDeviation)} минут
                </p>
              )}
            </>
          )}
        </div>
      )}

      {isAbsent && !showFactDetails && (
        <div className="detail-section">
          <p className="deviation absent">
            <strong>Отметка:</strong> Прогул
          </p>
        </div>
      )}

      <div className="detail-section">
        <h5>Общая информация</h5>
        <p>
          <strong>Сотрудник:</strong> {shift.employee}
        </p>
        <p>
          <strong>Магазин:</strong> {shift.store}
        </p>
        <p>
          <strong>Должность:</strong> {shift.role}
        </p>
        <p>
          <strong>Дата:</strong>{" "}
          {new Date(shift.start).toLocaleDateString("ru-RU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* {factShift && showFactDetails && (
        <div className="detail-section">
          <h5>Плановое время для сравнения</h5>
          <p>
            <strong>Начало:</strong> {formatDateTime(shift.start)}
          </p>
          <p>
            <strong>Окончание:</strong> {formatDateTime(shift.end)}
          </p>
          <p>
            <strong>Длительность:</strong> {formatDuration(shift.start, shift.end)}
          </p>
        </div>
      )} */}
    </div>
  );
};
