import React, { useState, useMemo } from 'react';
import { CycleData } from './types';
import Calendar from './components/Calendar';
import InfoCard from './components/InfoCard';
import { DropletIcon, CalendarDaysIcon, EggIcon, SparklesIcon, CycleIcon, PlusIcon, MinusIcon } from './components/Icons';

const App: React.FC = () => {
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const [lastPeriodDate, setLastPeriodDate] = useState<string>(todayISO);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);

  const cycleData = useMemo<CycleData | null>(() => {
    if (!lastPeriodDate || !cycleLength || cycleLength < 15 || cycleLength > 60) return null;

    const startDate = new Date(lastPeriodDate + 'T00:00:00');

    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const nextPeriodStartDate = addDays(startDate, cycleLength);
    const ovulationDate = addDays(nextPeriodStartDate, -14);
    const fertileWindowStart = addDays(ovulationDate, -5);
    const fertileWindowEnd = addDays(ovulationDate, 1);

    return {
      lastPeriodDate: startDate,
      nextPeriodStartDate,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd,
      periodLength,
    };
  }, [lastPeriodDate, cycleLength, periodLength]);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 text-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-pink-500 tracking-tight">Utero</h1>
          <p className="text-slate-500 mt-2 text-lg">Track your cycle with confidence</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Inputs & Predictions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">Cycle Details</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="last-period" className="flex items-center text-sm font-medium text-slate-600 mb-2">
                    <CalendarDaysIcon className="w-5 h-5 mr-2 text-slate-500" />
                    <span>First Day of Last Period</span>
                  </label>
                  <input
                    id="last-period"
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="w-full p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition text-slate-800"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-600 mb-2">
                    <CycleIcon className="w-5 h-5 mr-2 text-slate-500" />
                    <span>Average Cycle Length</span>
                  </label>
                  <div className="flex items-center justify-between bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setCycleLength(v => Math.max(15, v - 1))}
                      className="p-2 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Decrease cycle length"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold text-pink-500 w-24 text-center select-none" aria-live="polite">{cycleLength} days</span>
                    <button
                      onClick={() => setCycleLength(v => Math.min(60, v + 1))}
                      className="p-2 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Increase cycle length"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div>
                    <label className="flex items-center text-sm font-medium text-slate-600 mb-2">
                        <DropletIcon className="w-5 h-5 mr-2 text-slate-500" />
                        <span>Period Duration</span>
                    </label>
                    <div className="flex items-center justify-between bg-slate-100 rounded-lg p-1">
                        <button
                          onClick={() => setPeriodLength(v => Math.max(1, v - 1))}
                          className="p-2 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Decrease period duration"
                        >
                          <MinusIcon className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-bold text-pink-500 w-24 text-center select-none" aria-live="polite">{periodLength} days</span>
                        <button
                          onClick={() => setPeriodLength(v => Math.min(10, v + 1))}
                          className="p-2 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Increase period duration"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">Predictions</h2>
              <div className="space-y-3">
                <InfoCard 
                  title="Next Period" 
                  date={formatDate(cycleData?.nextPeriodStartDate)}
                  icon={<CalendarDaysIcon className="w-6 h-6 text-pink-500"/>}
                  color="pink"
                />
                <InfoCard 
                  title="Ovulation Day" 
                  date={formatDate(cycleData?.ovulationDate)}
                  icon={<EggIcon className="w-6 h-6 text-purple-500"/>}
                  color="purple"
                />
                <InfoCard 
                  title="Fertile Window Starts" 
                  date={formatDate(cycleData?.fertileWindowStart)}
                  icon={<SparklesIcon className="w-6 h-6 text-teal-500"/>}
                  color="teal"
                />
                 <InfoCard 
                  title="Fertile Window Ends" 
                  date={formatDate(cycleData?.fertileWindowEnd)}
                  icon={<SparklesIcon className="w-6 h-6 text-teal-500"/>}
                  color="teal"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Calendar */}
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <Calendar cycleData={cycleData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;