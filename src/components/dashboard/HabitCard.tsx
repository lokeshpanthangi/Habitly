import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';

interface HabitCardProps {
  id: string;
  name: string;
  description?: string;
  completed: string[];
  streak: number;
  onToggle: (id: string, date: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
  startDate?: string;
  targetDays?: string[];
  highestStreak: number;
}

const HabitCard: React.FC<HabitCardProps> = ({
  id,
  name,
  description,
  completed,
  streak,
  onToggle,
  onDelete,
  onEdit,
  className,
  startDate,
  targetDays,
  highestStreak,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Generate array of dates for current week view
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open/close dropdown if not clicking the circle
    if ((e.target as HTMLElement).closest('button')) return;
    setOpen((prev) => !prev);
  };

  const previousWeek = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const nextWeek = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToCurrentWeek = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handleToggleDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    onToggle(id, dateString);
  };

  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return completed.includes(dateString);
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isTargetDay = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return Array.isArray(targetDays) && targetDays.includes(dayName);
  };

  const startDateObj = startDate ? parseISO(startDate) : new Date();
  const isAfterStartDate = (date: Date) => {
    // Allow marking today and any date after or equal to the start date
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d >= startDateObj;
  };

  return (
    <div
      className={cn(
        'relative bg-card rounded-lg border p-5 hover:shadow-sm transition-all duration-200 cursor-pointer',
        completed.length > 0 && 'border-accent/40 bg-accent/5',
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className={cn(
            'font-medium',
            completed.length > 0 && 'text-muted-foreground'
          )}>
            {name}
          </h3>
          {description && (
            <p className={cn(
              'text-sm text-muted-foreground mt-1',
              completed.length > 0 && 'text-muted-foreground/70'
            )}>
              {description}
            </p>
          )}
        </div>
        {/* Delete button */}
        {onDelete && (
          <button
            className="ml-2 p-2 rounded hover:bg-destructive/10 text-destructive transition"
            onClick={e => { e.stopPropagation(); onDelete(id); }}
            title="Delete Habit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          </button>
        )}
        {streak > 0 && (
          <div className={cn(
            'px-3 py-1 rounded-full text-xs font-medium bg-secondary',
            completed.length > 0 && 'bg-accent/20'
          )}>
            {streak} day{streak !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      {/* Dropdown details */}
      {open && (
        <div className="mt-4 w-full bg-card text-foreground rounded-xl p-6 shadow-md border border-border">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-semibold mb-1 text-foreground">{name}</div>
              <div className="text-muted-foreground text-base mb-2">
                Started on {startDate ? new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(targetDays) && targetDays.length > 0 ? (
                  targetDays.map((day: string) => (
                    <span key={day} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium">
                      {day.substring(0, 3)}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No target days</span>
                )}
              </div>
            </div>
          </div>
          {/* Week view for toggling completion */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <button className="text-lg px-2 text-muted-foreground" onClick={previousWeek}>&lt;</button>
              <button className="text-xs px-2 text-muted-foreground" onClick={goToCurrentWeek}>
                {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
              </button>
              <button className="text-lg px-2 text-muted-foreground" onClick={nextWeek}>&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
              {weekDates.map((date) => {
                const dayLabel = format(date, 'EEE');
                const dayNumber = format(date, 'd');
                const isActive = isAfterStartDate(date);
                const isComplete = isDateCompleted(date);
                const isCurrent = isToday(date);
                const isTarget = isTargetDay(date);
                return (
                  <button
                    key={date.toString()}
                    disabled={!isActive}
                    onClick={() => handleToggleDay(date)}
                    className={cn(
                      'flex flex-col h-12 items-center justify-center p-1 rounded text-xs font-medium',
                      !isActive && 'opacity-40',
                      isComplete && 'bg-accent text-accent-foreground',
                      isCurrent && 'ring-2 ring-primary',
                      isTarget && !isComplete && 'bg-secondary text-secondary-foreground',
                      !isTarget && 'opacity-70'
                    )}
                  >
                    <span>{dayLabel}</span>
                    <span>{dayNumber}</span>
                    {isComplete && <Check className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-8 border-t border-border pt-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-base">Current Streak:</span>
              <span className="font-bold text-lg text-foreground">{streak} days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-base">Best:</span>
              <span className="font-bold text-lg text-foreground">{highestStreak} days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
