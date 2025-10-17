
import React, { useState } from 'react';
import type { CycleData } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
  cycleData: CycleData | null;
}

const Calendar: React.FC<CalendarProps> = ({ cycleData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = (date: Date, start: Date, end: Date): boolean => {
      const time = date.getTime();
      return time >= start.getTime() && time <= end.getTime();
  };

  const getDayClass = (day: Date): string => {
    let classes = 'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors duration-200';

    const today = new Date();
    today.setHours(0,0,0,0);
    const dayOnly = new Date(day);
    dayOnly.setHours(0,0,0,0);
    
    if (!cycleData) {
       if (isSameDay(dayOnly, today)) {
            return `${classes} bg-pink-200 text-pink-800 font-semibold`;
       }
       return classes;
    }

    // Generate period dates for multiple cycles (past, present, future)
    for (let i = -6; i <= 6; i++) {
        const cycleStartDate = new Date(cycleData.lastPeriodDate);
        cycleStartDate.setDate(cycleStartDate.getDate() + (i * (cycleData.nextPeriodStartDate.getTime() - cycleData.lastPeriodDate.getTime()) / (1000 * 3600 * 24)));
        const cycleEndDate = new Date(cycleStartDate);
        cycleEndDate.setDate(cycleEndDate.getDate() + cycleData.periodLength - 1);
        
        if (isInRange(dayOnly, cycleStartDate, cycleEndDate)) {
            classes += ' bg-pink-400 text-white font-medium';
            if (isSameDay(dayOnly, today)) classes += ' ring-2 ring-offset-2 ring-pink-500';
            return classes;
        }
    }
    
    // Generate fertile/ovulation dates for multiple cycles
    for (let i = -6; i <= 6; i++) {
        const cycleOvulationDate = new Date(cycleData.ovulationDate);
        cycleOvulationDate.setDate(cycleOvulationDate.getDate() + (i * (cycleData.nextPeriodStartDate.getTime() - cycleData.lastPeriodDate.getTime()) / (1000 * 3600 * 24)));
        
        const cycleFertileStart = new Date(cycleData.fertileWindowStart);
        cycleFertileStart.setDate(cycleFertileStart.getDate() + (i * (cycleData.nextPeriodStartDate.getTime() - cycleData.lastPeriodDate.getTime()) / (1000 * 3600 * 24)));

        const cycleFertileEnd = new Date(cycleData.fertileWindowEnd);
        cycleFertileEnd.setDate(cycleFertileEnd.getDate() + (i * (cycleData.nextPeriodStartDate.getTime() - cycleData.lastPeriodDate.getTime()) / (1000 * 3600 * 24)));

        if (isSameDay(dayOnly, cycleOvulationDate)) {
            classes += ' bg-purple-400 text-white font-semibold';
            if (isSameDay(dayOnly, today)) classes += ' ring-2 ring-offset-2 ring-purple-500';
            return classes;
        }

        if (isInRange(dayOnly, cycleFertileStart, cycleFertileEnd)) {
            classes += ' bg-teal-300 text-teal-800';
            if (isSameDay(dayOnly, today)) classes += ' ring-2 ring-offset-2 ring-teal-400';
            return classes;
        }
    }

    if (isSameDay(dayOnly, today)) {
        return `${classes} bg-slate-200 text-slate-800 font-semibold`;
    }

    return `${classes} hover:bg-slate-100`;
  };


  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <ChevronLeftIcon className="w-6 h-6 text-slate-500" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-700">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <ChevronRightIcon className="w-6 h-6 text-slate-500" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-medium text-slate-500 mb-2">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        days.push(
          <div key={day.toString()} className="flex justify-center items-center">
            <div className={`${getDayClass(day)} ${isCurrentMonth ? 'text-slate-800' : 'text-slate-400'}`}>
              {day.getDate()}
            </div>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1 sm:gap-2">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1 sm:space-y-2">{rows}</div>;
  };

  const renderLegend = () => {
    return (
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-pink-400"></div>
                <span>Period</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-teal-300"></div>
                <span>Fertile Window</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                <span>Ovulation</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                <span>Today</span>
            </div>
        </div>
    )
  }

  return (
    <div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderLegend()}
    </div>
  );
};

export default Calendar;
