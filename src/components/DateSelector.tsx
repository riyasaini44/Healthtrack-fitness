import { CalendarDays } from 'lucide-react';

export default function DateSelector({
  label = 'Select Date',
  date,
  onChange,
}: {
  label?: string;
  date: string;
  onChange: (d: string) => void;
}) {
  return (
    <div>
      <label className="section-label mb-1.5 block">{label}</label>
      <div className="relative inline-block w-full sm:w-auto">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <CalendarDays className="w-4 h-4" />
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => onChange(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="input-field pl-10 w-full sm:w-auto"
        />
      </div>
    </div>
  );
}
