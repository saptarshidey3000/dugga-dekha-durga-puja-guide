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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#D99A3D]/20">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B93624]">
          Local Device Storage
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC] mt-1">
          My Saved Itineraries & Pandals
        </h1>
        <p className="text-xs sm:text-sm text-[#D8CEBE]/80 mt-2 max-w-xl">
          Everything you save is safely stored right on your device for immediate offline reference during Puja.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#D99A3D]/20 pb-1">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'plans'
              ? 'border-[#B93624] text-[#FFF8EC]'
              : 'border-transparent text-[#D8CEBE]/70 hover:text-[#FFF8EC]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D99A3D]" />
          <span>My Puja Plans ({savedPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pandals')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'pandals'
              ? 'border-[#B93624] text-[#FFF8EC]'
              : 'border-transparent text-[#D8CEBE]/70 hover:text-[#FFF8EC]'
          }`}
        >
          <Bookmark className="w-4 h-4 text-[#D99A3D]" />
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
                  className="bg-[#0B223D] border border-[#D99A3D]/25 hover:border-[#D99A3D] rounded-2xl p-6 shadow-lg flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#D99A3D] font-bold uppercase mb-2">
                      <span>{plan.preferences?.area || 'Kolkata'}</span>
                      <span className="text-[#D8CEBE]/70 font-normal">Created {plan.createdAt}</span>
                    </div>

                    <h3 className="font-editorial text-2xl font-bold text-[#FFF8EC] mb-2">
                      🌸 {plan.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8CEBE] mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D99A3D]" /> {plan.totalDuration}
                      </span>
                      <span>•</span>
                      <span>{plan.stops.length} Pandals</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3.5 h-3.5 text-[#D99A3D]" /> {plan.estimatedDistance}
                      </span>
                    </div>

                    <div className="bg-[#071A2F] p-3 rounded-xl border border-[#D99A3D]/15 text-xs text-[#D8CEBE] space-y-1 mb-4">
                      <span className="font-bold text-[#FFF8EC] block text-[11px] uppercase text-[#D99A3D]">
                        Itinerary Stops:
                      </span>
                      {plan.stops.slice(0, 3).map((s, idx) => (
                        <div key={idx} className="truncate">
                          {idx + 1}. {s.name} ({s.visitTime})
                        </div>
                      ))}
                      {plan.stops.length > 3 && (
                        <span className="text-[10px] text-[#D99A3D] block">
                          +{plan.stops.length - 3} more stops...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#D99A3D]/15 flex items-center justify-between">
                    <button
                      onClick={() => setViewingPlan(plan)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B93624] text-[#FFF8EC] text-xs font-bold hover:bg-[#cf412e] transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW PLAN</span>
                    </button>

                    <button
                      onClick={() => setDeletingPlanId(plan.id)}
                      className="p-2 rounded-xl bg-[#071A2F] text-red-400 hover:text-red-300 border border-red-500/20 text-xs transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0B223D] border border-[#D99A3D]/25 rounded-2xl p-12 text-center max-w-md mx-auto">
              <Sparkles className="w-10 h-10 text-[#D99A3D]/50 mx-auto mb-3" />
              <h3 className="font-editorial text-2xl font-bold text-[#FFF8EC] mb-1">
                No Saved Puja Plans Yet
              </h3>
              <p className="text-xs text-[#D8CEBE]/80 mb-5 leading-relaxed">
                Tell the AI Planner how much time you have, generate a curated walking itinerary, and tap &quot;Save Plan&quot; to keep it here.
              </p>
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B93624] text-[#FFF8EC] text-xs font-bold shadow-md hover:bg-[#cf412e]"
              >
                <span>Launch AI Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
            <div className="bg-[#0B223D] border border-[#D99A3D]/25 rounded-2xl p-12 text-center max-w-md mx-auto">
              <Bookmark className="w-10 h-10 text-[#D99A3D]/50 mx-auto mb-3" />
              <h3 className="font-editorial text-2xl font-bold text-[#FFF8EC] mb-1">
                No Saved Pandals Yet
              </h3>
              <p className="text-xs text-[#D8CEBE]/80 mb-5 leading-relaxed">
                Browse our directory of Kolkata pandals and tap the bookmark icon to save your favorites for quick offline access.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B93624] text-[#FFF8EC] text-xs font-bold shadow-md hover:bg-[#cf412e]"
              >
                <span>Explore Pandals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* VIEW PLAN MODAL / DRAWER (Section 32: Pressing X means CLOSE UI, NOT DELETE PLAN) */}
      {viewingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B223D] border-2 border-[#D99A3D]/40 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-[#D99A3D]/20 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B93624] text-[#FFF8EC] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  SAVED ITINERARY
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#FFF8EC]">
                  {viewingPlan.title}
                </h3>
                <p className="text-xs text-[#D8CEBE] mt-1">
                  {viewingPlan.totalDuration} • {viewingPlan.stops.length} Pandals • {viewingPlan.estimatedDistance}
                </p>
              </div>

              {/* CLOSE BUTTON (X ONLY CLOSES, NEVER DELETES) */}
              <button
                onClick={() => setViewingPlan(null)}
                aria-label="Close Itinerary View"
                className="p-1.5 rounded-full bg-[#071A2F] text-[#D8CEBE] hover:text-[#FFF8EC] border border-[#D99A3D]/25"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Stops */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D99A3D]/30 space-y-5 ml-2">
              {viewingPlan.stops.map((stop, idx) => (
                <div key={stop.pandalId} className="relative">
                  <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 rounded-full bg-[#B93624] text-[#FFF8EC] text-xs font-bold flex items-center justify-center border border-[#FFF8EC]">
                    {idx + 1}
                  </div>

                  <div className="bg-[#071A2F] p-4 rounded-xl border border-[#D99A3D]/20">
                    <div className="flex items-center justify-between text-xs text-[#D99A3D] font-bold mb-1">
                      <span>{stop.visitTime}</span>
                      <span className="text-[#D8CEBE] font-normal">{stop.duration}</span>
                    </div>
                    <h4 className="font-editorial text-lg font-bold text-[#FFF8EC]">
                      {stop.name}
                    </h4>
                    <p className="text-xs text-[#D8CEBE]/80 mt-0.5">
                      {stop.area} • Walk: {stop.travelTime} ({stop.distance})
                    </p>
                    {stop.instruction && (
                      <p className="text-xs text-[#D8CEBE] mt-2 italic bg-[#0B223D] p-2 rounded-lg">
                        &quot;{stop.instruction}&quot;
                      </p>
                    )}
                    <div className="mt-3 pt-2 border-t border-[#D99A3D]/10">
                      <Link
                        href={`/pandal/${stop.pandalId}`}
                        onClick={() => setViewingPlan(null)}
                        className="text-xs text-[#D99A3D] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>View Pandal Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#D99A3D]/20 flex items-center justify-between">
              <button
                onClick={() => setDeletingPlanId(viewingPlan.id)}
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Plan</span>
              </button>

              <button
                onClick={() => setViewingPlan(null)}
                className="px-5 py-2 rounded-full bg-[#D99A3D] text-[#071A2F] text-xs font-bold hover:bg-[#f3bc65]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG (Section 32) */}
      {deletingPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B223D] border border-red-500/40 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#FFF8EC]">
              Delete Saved Plan?
            </h3>
            <p className="text-xs text-[#D8CEBE]/80">
              Are you sure you want to remove this Puja itinerary from your device? This cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingPlanId(null)}
                className="flex-1 py-2 rounded-xl bg-[#071A2F] text-xs font-semibold text-[#D8CEBE] hover:text-[#FFF8EC]"
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
