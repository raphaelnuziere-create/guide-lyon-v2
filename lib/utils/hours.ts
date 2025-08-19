/**
 * Check if establishment is currently open
 */
export function isOpen(hours: Record<string, string>): boolean {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  
  const todayHours = hours[currentDay];
  if (!todayHours || todayHours === 'closed') return false;
  
  const [openTime, closeTime] = todayHours.split('-').map(t => t.trim());
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;
  
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

// Alias for compatibility
export const isOpenNow = isOpen;

/**
 * Format hours for display
 */
export function formatHours(hours: Record<string, string>): string {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  
  const todayHours = hours[currentDay];
  if (!todayHours || todayHours === 'closed') return 'Fermé aujourd\'hui';
  
  return `Aujourd'hui: ${todayHours}`;
}