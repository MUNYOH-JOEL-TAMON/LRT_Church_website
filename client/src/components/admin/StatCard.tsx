import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
}

/**
 * StatCard: A KPI metric card used on the Admin Dashboard overview.
 * Displays a label, big value, optional subtitle, and an icon.
 */
const StatCard = ({ label, value, subtitle, icon, color = 'text-primary' }: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-current/10 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-heading font-extrabold text-slate-800">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
