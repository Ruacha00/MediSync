import { useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { NotificationOverlay } from '@/components/NotificationOverlay';
import { DemoControlPanel } from '@/components/DemoControlPanel';
import { setPhoneFrameEl } from '@/lib/phoneFramePortal';

export function PatientLayout() {
  const phoneFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPhoneFrameEl(phoneFrameRef.current);
    return () => setPhoneFrameEl(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center gap-6">
      {/* Demo control panel — desktop only, left of phone */}
      <div className="hidden md:block md:mt-8 sticky top-8">
        <DemoControlPanel />
      </div>

      {/* Phone frame wrapper for desktop */}
      <div
        ref={phoneFrameRef}
        className="w-full max-w-[430px] min-h-screen md:min-h-0 md:h-[844px] md:my-8 bg-white md:rounded-[2.5rem] md:shadow-2xl md:border-[6px] md:border-gray-800 relative overflow-hidden"
      >
        {/* Notch (desktop only) */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-gray-800 rounded-b-2xl z-50" />

        {/* Push notification overlay */}
        <NotificationOverlay />

        {/* App content */}
        <div className="h-full overflow-y-auto pb-20 md:pt-7">
          <Outlet />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
