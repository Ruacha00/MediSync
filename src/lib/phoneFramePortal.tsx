import { useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getPhoneFrameEl, subscribePhoneFrame } from '@/lib/phoneFramePortalStore';

export function PhoneFramePortal({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(getPhoneFrameEl());

  useEffect(() => {
    const update = () => setTarget(getPhoneFrameEl());
    update();
    return subscribePhoneFrame(update);
  }, []);

  if (!target) return null;
  return createPortal(children, target);
}
