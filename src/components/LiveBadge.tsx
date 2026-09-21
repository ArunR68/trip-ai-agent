import React from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface LiveBadgeProps {
  type: 'LIVE_VERIFIED' | 'ESTIMATED';
  label?: string;
  size?: 'sm' | 'md';
}

export const LiveBadge: React.FC<LiveBadgeProps> = ({ type, label, size = 'sm' }) => {
  const isLive = type === 'LIVE_VERIFIED';
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      id={`badge-${type.toLowerCase()}`}
      className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClasses} ${
        isLive
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
      title={isLive ? 'Verified with live API or official tourism schedule' : 'Estimated standard tourism price / timing'}
    >
      {isLive ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{label || 'Live Verified'}</span>
        </>
      ) : (
        <>
          <HelpCircle className="w-3 h-3 text-amber-600" />
          <span>{label || 'Estimated'}</span>
        </>
      )}
    </span>
  );
};
