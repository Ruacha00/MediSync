let phoneFrameEl: HTMLElement | null = null
const listeners = new Set<() => void>()

export function getPhoneFrameEl() {
  return phoneFrameEl
}

export function setPhoneFrameEl(el: HTMLElement | null) {
  phoneFrameEl = el
  listeners.forEach((listener) => listener())
}

export function subscribePhoneFrame(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
