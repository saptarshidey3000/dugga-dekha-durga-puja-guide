'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PujaPlan, Pandal } from '@/data/types';
import { PANDALS } from '@/data/pandals';
import {
  getSavedPlans,
  deletePlan,
  getSavedPandals,
  removeSavedPandal,
} from '@/lib/storage';
import PandalCard from '@/components/PandalCard';
import {
  Bookmark,
  Calendar,
  Clock,
  Footprints,
  Trash2,
  Eye,
  X,
  Compass,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export default function SavedContentPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'pandals'>('plans');
  const [savedPlans, setSavedPlans] = useState<PujaPlan[]>([]);
  const [savedPandalsList, setSavedPandalsList] = useState<Pandal[]>([]);
  const [viewingPlan, setViewingPlan] = useState<PujaPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const loadData = () => {
    const plans = getSavedPlans();
    setSavedPlans(plans);

    const savedPandalItems = getSavedPandals();
    const resolved = savedPandalItems
      .map((item) => PANDALS.find((p) => p.id === item.id))
      .filter(Boolean) as Pandal[];
    setSavedPandalsList(resolved);
  };

  useEffect(() => {
    loadData();

    const onPlansUpdated = () => loadData();
    const onPandalsUpdated = () => loadData();

    window.addEventListener('dugga-puja-plans-updated', onPlansUpdated);
    window.addEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
    return () => {
      window.removeEventListener('dugga-puja-plans-updated', onPlansUpdated);
      window.removeEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
    };
  }, []);

  const handleConfirmDelete = () => {
    if (!deletingPlanId) return;
    deletePlan(deletingPlanId);
    setDeletingPlanId(null);
    if (viewingPlan?.id === deletingPlanId) setViewingPlan(null);
  };

  const handleRemovePandal = (id: string) => {
    removeSavedPandal(id);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-[#F8F0DF] text-[#171311]">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#D6A13A]/30">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
          Local Device Storage
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#7E1815] mt-1">
          My Saved Itineraries & Pandals
        </h1>
        <p className="text-xs sm:text-sm text-[#5A4E46] mt-2 max-w-xl">
          Everything you save is safely stored right on your device for immediate offline reference during Puja.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#D6A13A]/30 pb-1">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'plans'
              ? 'border-[#7E1815] text-[#7E1815]'
              : 'border-transparent text-[#5A4E46] hover:text-[#7E1815]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#B52B20]" />
          <span>My Puja Plans ({savedPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pandals')}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'pandals'
              ? 'border-[#7E1815] text-[#7E1815]'
              : 'border-transparent text-[#5A4E46] hover:text-[#7E1815]'
          }`}
        >
          <Bookmark className="w-4 h-4 text-[#B52B20]" />
          <span>Saved Pandals ({savedPandalsList.length})</span>
        </button>
      </div>

      {/* TAB 1: SAVED PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {savedPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#FFFFFF] border border-[#D6A13A]/30 hover:border-[#D6A13A] rounded-2xl p-6 shadow-sm hover:shadow-xl flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#7E1815] font-bold uppercase mb-2">
                      <span>{plan.preferences?.area || 'Kolkata'}</span>
                      <span className="text-[#5A4E46] font-normal">Created {plan.createdAt}</span>
                    </div>

                    <h3 className="font-editorial text-2xl font-bold text-[#7E1815] mb-2">
                      🌸 {plan.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A4E46] mb-4">
                      <span className="flex items-center gap-1 font-semibold text-[#B52B20]">
                        <Clock className="w-3.5 h-3.5" /> {plan.totalDuration}
                      </span>
                      <span>•</span>
                      <span>{plan.stops.length} Pandals</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3.5 h-3.5 text-[#7E1815]" /> {plan.estimatedDistance}
                      </span>
                    </div>

                    <div className="bg-[#F8F0DF] p-3 rounded-xl border border-[#D6A13A]/25 text-xs text-[#171311] space-y-1 mb-4">
                      <span className="font-bold text-[#7E1815] block text-[11px] uppercase">
                        Itinerary Stops:
                      </span>
                      {plan.stops.slice(0, 3).map((s, idx) => (
                        <div key={idx} className="truncate text-[#5A4E46]">
                          {idx + 1}. {s.name} ({s.visitTime})
                        </div>
                      ))}
                      {plan.stops.length > 3 && (
                        <span className="text-[10px] text-[#7E1815] font-bold block">
                          +{plan.stops.length - 3} more stops...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#D6A13A]/20 flex items-center justify-between">
                    <button
                      onClick={() => setViewingPlan(plan)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7E1815] text-[#F8F0DF] text-xs font-bold hover:bg-[#B52B20] transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#E7C46A]" />
                      <span>VIEW PLAN</span>
                    </button>

                    <button
                      onClick={() => setDeletingPlanId(plan.id)}
                      className="p-2 rounded-xl bg-[#F8F0DF] text-red-600 hover:text-red-700 border border-red-300 text-xs transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
              <Sparkles className="w-10 h-10 text-[#D6A13A] mx-auto mb-3" />
              <h3 className="font-editorial text-2xl font-bold text-[#7E1815] mb-1">
                No Saved Puja Plans Yet
              </h3>
              <p className="text-xs text-[#5A4E46] mb-5 leading-relaxed">
                Tell the AI Planner how much time you have, generate a curated walking itinerary, and tap &quot;Save Plan&quot; to keep it here.
              </p>
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7E1815] text-[#F8F0DF] text-xs font-bold shadow-md hover:bg-[#B52B20]"
              >
                <span>Launch AI Planner</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E7C46A]" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED PANDALS */}
      {activeTab === 'pandals' && (
        <div className="space-y-6">
          {savedPandalsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPandalsList.map((pandal) => (
                <PandalCard key={pandal.id} pandal={pandal} />
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
              <Bookmark className="w-10 h-10 text-[#D6A13A] mx-auto mb-3" />
              <h3 className="font-editorial text-2xl font-bold text-[#7E1815] mb-1">
                No Saved Pandals Yet
              </h3>
              <p className="text-xs text-[#5A4E46] mb-5 leading-relaxed">
                Browse our directory of Kolkata pandals and tap the bookmark icon to save your favorites for quick offline access.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7E1815] text-[#F8F0DF] text-xs font-bold shadow-md hover:bg-[#B52B20]"
              >
                <span>Explore Pandals</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E7C46A]" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* VIEW PLAN MODAL / DRAWER */}
      {viewingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#D6A13A]/50 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6 text-[#171311]">
            <div className="flex items-start justify-between border-b border-[#D6A13A]/25 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#7E1815] text-[#F8F0DF] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  SAVED ITINERARY
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#7E1815]">
                  {viewingPlan.title}
                </h3>
                <p className="text-xs text-[#5A4E46] mt-1 font-medium">
                  {viewingPlan.totalDuration} • {viewingPlan.stops.length} Pandals • {viewingPlan.estimatedDistance}
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setViewingPlan(null)}
                aria-label="Close Itinerary View"
                className="p-1.5 rounded-full bg-[#F8F0DF] text-[#5A4E46] hover:text-[#7E1815] border border-[#D6A13A]/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Stops (Sections 90 & 91: 01, 02 markers + gold line) */}
            <div className="relative pl-7 sm:pl-9 border-l-2 border-[#D6A13A] space-y-5 ml-3">
              {viewingPlan.stops.map((stop, idx) => {
                const orderNum = idx + 1;
                const formattedNum = orderNum < 10 ? `0${orderNum}` : `${orderNum}`;
                return (
                  <div key={stop.pandalId} className="relative">
                    <div className="absolute -left-[40px] sm:-left-[48px] top-1 w-8 h-8 rounded-full bg-[#D6A13A] text-[#7E1815] text-xs font-bold flex items-center justify-center border border-white shadow-sm">
                      {formattedNum}
                    </div>

                    <div className="bg-[#F8F0DF] p-4 rounded-xl border border-[#D6A13A]/25">
                      <div className="flex items-center justify-between text-xs text-[#7E1815] font-bold mb-1">
                        <span>{stop.visitTime}</span>
                        <span className="text-[#5A4E46] font-normal">{stop.duration}</span>
                      </div>
                      <h4 className="font-editorial text-lg font-bold text-[#171311]">
                        {stop.name}
                      </h4>
                      <p className="text-xs text-[#5A4E46] mt-0.5">
                        {stop.area} • Walk: {stop.travelTime} ({stop.distance})
                      </p>
                      {stop.instruction && (
                        <p className="text-xs text-[#5A4E46] mt-2 italic bg-[#FFFFFF] p-2 rounded-lg border border-[#D6A13A]/20">
                          &quot;{stop.instruction}&quot;
                        </p>
                      )}
                      <div className="mt-3 pt-2 border-t border-[#D6A13A]/20">
                        <Link
                          href={`/pandal/${stop.pandalId}`}
                          onClick={() => setViewingPlan(null)}
                          className="text-xs text-[#7E1815] hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>View Pandal Details</span>
                          <ArrowRight className="w-3 h-3 text-[#B52B20]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#D6A13A]/25 flex items-center justify-between">
              <button
                onClick={() => setDeletingPlanId(viewingPlan.id)}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Plan</span>
              </button>

              <button
                onClick={() => setViewingPlan(null)}
                className="px-6 py-2.5 rounded-full bg-[#7E1815] text-[#F8F0DF] text-xs font-bold hover:bg-[#B52B20]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deletingPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FFFFFF] border border-red-300 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#7E1815]">
              Delete Saved Plan?
            </h3>
            <p className="text-xs text-[#5A4E46]">
              Are you sure you want to remove this Puja itinerary from your device? This cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingPlanId(null)}
                className="flex-1 py-2 rounded-xl bg-[#F8F0DF] text-xs font-bold text-[#5A4E46] hover:text-[#171311]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
