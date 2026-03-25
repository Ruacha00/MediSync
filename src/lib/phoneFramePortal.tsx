import { useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

let _el: HTMLElement | null = null;
const listeners = new Set<() => void>();

export function setPhoneFrameEl(el: HTMLElement | null) {
  _el = el;
  listeners.forEach((fn) => fn());
}

export function PhoneFramePortal({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(_el);

  useEffect(() => {
    const update = () => setTarget(_el);
    listeners.add(update);
    update();
    return () => { listeners.delete(update); };
  }, []);

  if (!target) return null;
  return createPortal(children, target);
}
