
import React from 'react';

interface InfoCardProps {
  title: string;
  date: string;
  icon: React.ReactNode;
  color: 'pink' | 'purple' | 'teal';
}

const colorClasses = {
    pink: 'bg-pink-100 border-pink-200',
    purple: 'bg-purple-100 border-purple-200',
    teal: 'bg-teal-100 border-teal-200',
}

const InfoCard: React.FC<InfoCardProps> = ({ title, date, icon, color }) => {
  return (
    <div className={`p-4 rounded-lg flex items-center space-x-4 border ${colorClasses[color]}`}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-base font-semibold text-slate-800">{date}</p>
      </div>
    </div>
  );
};

export default InfoCard;
