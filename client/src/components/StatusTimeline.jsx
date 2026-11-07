import React from 'react';
import {
  Check,
  Clock,
  Plane,
  Building,
  PackageCheck,
  AlertTriangle,
} from 'lucide-react';

const STEP_ICONS = {
  1: Clock,
  2: Check,
  3: Plane,
  4: Building,
  5: PackageCheck,
};

export default function StatusTimeline({ timeline = [], isCancelled = false, status = '' }) {
  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center text-red-700 dark:text-red-400 space-y-2">
        <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
        <h4 className="font-bold text-base">This Order Has Been Cancelled</h4>
        <p className="text-xs text-red-600 dark:text-red-300 max-w-sm mx-auto">
          This order was marked as cancelled. Any escrow deposit paid is subject to the store refund policy. Contact support for assistance.
        </p>
      </div>
    );
  }

  // Calculate percentage for horizontal active progress bar
  const totalSteps = timeline.length;
  const completedCount = timeline.filter((t) => t.isCompleted).length;
  const progressPercent =
    totalSteps > 1
      ? Math.min(100, Math.max(0, ((completedCount - 1) / (totalSteps - 1)) * 100))
      : 0;

  return (
    <div className="py-4">
      {/* Desktop / Tablet Horizontal Timeline (Monochrome Black & White) */}
      <div className="hidden sm:block">
        <div className="relative flex items-start justify-between">
          {/* Progress bar background */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-800 -z-0">
            {/* Dynamic black/white progress line */}
            <div
              className="h-full bg-slate-950 dark:bg-white transition-all duration-700 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {timeline.map((step, idx) => {
            const Icon = STEP_ICONS[step.stepNumber] || Check;

            return (
              <div
                key={step.key || idx}
                className="relative z-10 flex flex-col items-center text-center max-w-[140px]"
              >
                {/* Node Circle */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.isCompleted
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : step.isCurrent
                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 ring-4 ring-slate-200 dark:ring-slate-800 animate-pulse'
                      : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Title */}
                <div className="mt-3">
                  <span
                    className={`block text-xs font-bold ${
                      step.isCurrent
                        ? 'text-slate-950 dark:text-white'
                        : step.isCompleted
                        ? 'text-slate-900 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden space-y-4">
        {timeline.map((step, idx) => {
          const Icon = STEP_ICONS[step.stepNumber] || Check;
          const isLast = idx === timeline.length - 1;

          return (
            <div key={step.key || idx} className="relative flex items-start gap-3">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute top-8 left-4 -ml-px w-0.5 h-full ${
                    step.isCompleted
                      ? 'bg-slate-950 dark:bg-white'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                ></div>
              )}

              {/* Node Icon */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.isCompleted
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : step.isCurrent
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 ring-4 ring-slate-200 dark:ring-slate-800'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Step info */}
              <div className="min-w-0 pb-4">
                <span
                  className={`text-xs font-bold block ${
                    step.isCurrent
                      ? 'text-slate-950 dark:text-white'
                      : step.isCompleted
                      ? 'text-slate-900 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-snug mt-0.5">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
