'use client';

import { SavedPandal, PujaPlan } from '@/data/types';

export const SAVED_PANDALS_KEY = 'dugga-saved-pandals';
export const PUJA_PLANS_KEY = 'dugga-puja-plans';

export function getSavedPandals(): SavedPandal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_PANDALS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved pandals:', e);
    return [];
  }
}

export function savePandal(id: string): SavedPandal[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedPandals();
    if (!current.some((item) => item.id === id)) {
      const updated = [{ id, savedAt: new Date().toISOString() }, ...current];
      localStorage.setItem(SAVED_PANDALS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('dugga-saved-pandals-updated'));
      return updated;
    }
    return current;
  } catch (e) {
    console.error('Failed to save pandal:', e);
    return [];
  }
}

export function removeSavedPandal(id: string): SavedPandal[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedPandals();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(SAVED_PANDALS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('dugga-saved-pandals-updated'));
    return updated;
  } catch (e) {
    console.error('Failed to remove saved pandal:', e);
    return [];
  }
}

export function isPandalSaved(id: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getSavedPandals();
  return current.some((item) => item.id === id);
}

export function getSavedPlans(): PujaPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PUJA_PLANS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved plans:', e);
    return [];
  }
}

export function savePlan(plan: PujaPlan): PujaPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedPlans();
    // If plan with same id exists, update it; otherwise prepend
    const existingIndex = current.findIndex((p) => p.id === plan.id);
    let updated: PujaPlan[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = plan;
    } else {
      updated = [plan, ...current];
    }
    localStorage.setItem(PUJA_PLANS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('dugga-puja-plans-updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save plan:', e);
    return [];
  }
}

export function deletePlan(planId: string): PujaPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedPlans();
    const updated = current.filter((p) => p.id !== planId);
    localStorage.setItem(PUJA_PLANS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('dugga-puja-plans-updated'));
    return updated;
  } catch (e) {
    console.error('Failed to delete plan:', e);
    return [];
  }
}
