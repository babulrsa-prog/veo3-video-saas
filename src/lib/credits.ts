// Simple in-memory credit store
// Production এ এটা database দিয়ে replace করতে হবে
const creditStore: Record<string, number> = {};

const FREE_CREDITS = 10;

export function getCredits(userId: string): number {
  if (creditStore[userId] === undefined) {
    creditStore[userId] = FREE_CREDITS;
  }
  return creditStore[userId];
}

export function deductCredit(userId: string): boolean {
  const current = getCredits(userId);
  if (current <= 0) return false;
  creditStore[userId] = current - 1;
  return true;
}

export function hasCredits(userId: string): boolean {
  return getCredits(userId) > 0;
}

export function resetCredits(userId: string): void {
  creditStore[userId] = FREE_CREDITS;
}