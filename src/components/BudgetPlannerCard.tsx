import React from 'react';
import { Wallet, CheckCircle, AlertTriangle, ArrowDownRight, IndianRupee, Car, Hotel, Utensils, Ticket, Sparkles } from 'lucide-react';
import type { BudgetBreakdown } from '../types';
import { LiveBadge } from './LiveBadge';

interface BudgetPlannerCardProps {
  budget: BudgetBreakdown;
  peopleCount: number;
  durationDays: number;
}

export const BudgetPlannerCard: React.FC<BudgetPlannerCardProps> = ({
  budget,
  peopleCount,
  durationDays,
}) => {
  const percentUsed = Math.min(100, Math.round((budget.totalEstimated / (budget.userBudget || 1)) * 100));
  const isOver = budget.totalEstimated > budget.userBudget;

  const items = [
    {
      label: 'Transportation',
      amount: budget.transportation,
      icon: Car,
      details: budget.transportationDetails,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Accommodation',
      amount: budget.accommodation,
      icon: Hotel,
      details: budget.accommodationDetails,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Food & Dining',
      amount: budget.food,
      icon: Utensils,
      details: budget.foodDetails,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Entry Tickets & Activities',
      amount: budget.entryTickets,
      icon: Ticket,
      details: budget.entryTicketsDetails,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Buffer & Miscellaneous',
      amount: budget.otherExpenses,
      icon: Sparkles,
      details: budget.otherExpensesDetails,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div
      id="budget-planner-card"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Estimated Budget & Breakdown</h3>
            <p className="text-xs text-slate-500">
              For {peopleCount} traveler{peopleCount > 1 ? 's' : ''} • {durationDays} Days / {Math.max(1, durationDays - 1)} Night{durationDays > 2 ? 's' : ''}
            </p>
          </div>
        </div>
        <LiveBadge type="ESTIMATED" label="Estimated Tariff" />
      </div>

      {/* Progress Bar and Summary */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
        <div className="flex items-end justify-between gap-2 mb-2">
          <div>
            <span className="text-xs text-slate-500 font-medium">Your Stated Budget</span>
            <div className="text-lg font-bold text-slate-900">
              {budget.currency}{budget.userBudget.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Total Estimated Cost</span>
            <div className={`text-xl font-extrabold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
              {budget.currency}{budget.totalEstimated.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Gauge bar */}
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOver ? 'bg-red-500' : percentUsed > 85 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-slate-600">
            {isOver ? (
              <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Exceeds budget by {budget.currency}{(budget.totalEstimated - budget.userBudget).toLocaleString()}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Comfortably within budget ({percentUsed}% utilized)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-semibold text-emerald-700">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Remaining: {budget.currency}{budget.remainingBudget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="py-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${item.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{item.label}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mt-0.5">{item.details}</p>
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-sm font-bold text-slate-800">
                  {budget.currency}{item.amount.toLocaleString()}
                </span>
                <p className="text-[10px] text-slate-400">
                  {Math.round((item.amount / (budget.totalEstimated || 1)) * 100)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>* Live prices may vary slightly based on seasonal surge and booking window.</span>
        <span className="font-semibold text-slate-700">Approx. {budget.currency}{budget.totalEstimated}</span>
      </div>
    </div>
  );
};
