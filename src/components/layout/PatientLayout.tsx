import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function PatientLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center">
      {/* Phone frame wrapper for desktop */}
      <div className="w-full max-w-[430px] min-h-screen md:min-h-0 md:h-[844px] md:my-8 bg-white md:rounded-[2.5rem] md:shadow-2xl md:border-[6px] md:border-gray-800 relative overflow-hidden">
        {/* Notch (desktop only) */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-gray-800 rounded-b-2xl z-50" />

        {/* App content */}
        <div className="h-full overflow-y-auto pb-20 md:pt-7">
          <Outlet />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
