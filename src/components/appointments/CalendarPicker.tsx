"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  endDate?: string;
  onEndDateSelect?: (date: string) => void;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function toDateStr(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

export default function CalendarPicker({ selectedDate, onDateSelect, endDate, onEndDateSelect }: CalendarPickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"days" | "months">("days");
  const ref = useRef<HTMLDivElement>(null);

  const selDate = new Date(selectedDate + "T00:00:00");
  const [viewYear, setViewYear] = useState(selDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selDate.getMonth());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setViewMode("days");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true });
  }

  // Next month fill
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  function isSelected(dateStr: string) {
    if (dateStr === selectedDate) return true;
    if (endDate && dateStr === endDate) return true;
    return false;
  }

  function isInRange(dateStr: string) {
    if (!endDate) return false;
    return dateStr > selectedDate && dateStr < endDate;
  }

  function handleDayClick(cell: typeof cells[0]) {
    const dateStr = toDateStr(cell.year, cell.month, cell.day);
    if (!onEndDateSelect) {
      onDateSelect(dateStr);
      setOpen(false);
    } else {
      // Range selection: first click = start, second = end
      if (!selectedDate || (selectedDate && endDate) || dateStr < selectedDate) {
        onDateSelect(dateStr);
        onEndDateSelect(dateStr);
      } else {
        onEndDateSelect(dateStr);
        setOpen(false);
      }
    }
    if (!cell.isCurrentMonth) {
      setViewMonth(cell.month);
      setViewYear(cell.year);
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  // Display label
  function displayLabel() {
    const d = new Date(selectedDate + "T00:00:00");
    const day = d.getDate();
    const mon = MONTHS[d.getMonth()];
    const yr = d.getFullYear();

    if (endDate && endDate !== selectedDate) {
      const e = new Date(endDate + "T00:00:00");
      const eDay = e.getDate();
      const eMon = MONTHS[e.getMonth()];
      const eYr = e.getFullYear();
      if (yr === eYr) {
        return `${day} ${mon} - ${eDay} ${eMon} ${eYr}`;
      }
      return `${day} ${mon} ${yr} - ${eDay} ${eMon} ${eYr}`;
    }
    return `${day} ${mon} ${yr}`;
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const d = new Date(selectedDate + "T00:00:00");
            d.setDate(d.getDate() - 1);
            const newDate = toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
            onDateSelect(newDate);
            if (onEndDateSelect) onEndDateSelect(newDate);
          }}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() => { setOpen(!open); setViewMode("days"); setViewYear(selDate.getFullYear()); setViewMonth(selDate.getMonth()); }}
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-[#111824] hover:bg-gray-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
            <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {displayLabel()}
        </button>

        <button
          onClick={() => {
            const d = new Date(selectedDate + "T00:00:00");
            d.setDate(d.getDate() + 1);
            const newDate = toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
            onDateSelect(newDate);
            if (onEndDateSelect) onEndDateSelect(newDate);
          }}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-30 p-4 w-[280px]">
          {viewMode === "days" ? (
            <>
              {/* Month/year header */}
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setViewMode("months")}
                  className="text-sm font-semibold text-[#111824] hover:text-[#4361EE] transition-colors"
                >
                  {FULL_MONTHS[viewMonth]} {viewYear}
                </button>
                <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7">
                {cells.map((cell, i) => {
                  const dateStr = toDateStr(cell.year, cell.month, cell.day);
                  const selected = isSelected(dateStr);
                  const inRange = isInRange(dateStr);
                  const isToday = dateStr === todayStr;

                  return (
                    <button
                      key={i}
                      onClick={() => handleDayClick(cell)}
                      className={`w-9 h-9 text-sm rounded-md flex items-center justify-center transition-colors ${
                        selected
                          ? "bg-[#4361EE] text-white font-semibold"
                          : inRange
                          ? "bg-blue-50 text-[#4361EE]"
                          : cell.isCurrentMonth
                          ? "text-[#111824] hover:bg-gray-100"
                          : "text-gray-300"
                      } ${isToday && !selected ? "font-bold" : ""}`}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Year header */}
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setViewYear(viewYear - 1)} className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-[#111824]">{viewYear}</span>
                <button onClick={() => setViewYear(viewYear + 1)} className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => {
                      setViewMonth(i);
                      setViewMode("days");
                    }}
                    className={`py-2 text-sm rounded-lg transition-colors ${
                      i === viewMonth && viewYear === selDate.getFullYear()
                        ? "bg-[#4361EE] text-white font-semibold"
                        : "text-[#111824] hover:bg-gray-100"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
