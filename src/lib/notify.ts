export function canNotify(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}
export async function requestNotifyPermission(): Promise<boolean> {
  if (!canNotify()) return false;
  if (Notification.permission === 'granted') return true;
  const r = await Notification.requestPermission();
  return r === 'granted';
}
export function sendNotification(title: string, body?: string) {
  if (!canNotify() || Notification.permission !== 'granted') return;
  try { new Notification(title, { body }); } catch { /* ignore */ }
}
