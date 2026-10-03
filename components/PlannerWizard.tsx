'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { METRO_STATIONS } from '@/data/metros';
import { CATEGORIES } from '@/data/categories';
import { PandalCategory, PujaPlan } from '@/data/types';
import { generatePujaPlan } from '@/lib/planner';
import { savePlan, isPandalSaved } from '@/lib/storage';
import {
  Sparkles,
  Clock,
  MapPin,
  Footprints,
  Bookmark,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface PlannerWizardProps {
  onPlanGenerated?: (plan: PujaPlan) => void;
  initialMetroId?: string;
}

export default function PlannerWizard({ onPlanGenerated, initialMetroId = 'kalighat' }: PlannerWizardProps) {
  const [metroId, setMetroId] = useState(initialMetroId);
  const [durationHours, setDurationHours] = useState(5);
  const [startTime, setStartTime] = useState('17:00');
  const [selectedCategories, setSelectedCategories] = useState<PandalCategory[]>([
    'must-visit',
    'traditional',
  ]);
  const [walkingPreference, setWalkingPreference] = useState<'light' | 'moderate' | 'dont-mind'>(
    'moderate'
  );

  const [generatedPlan, setGeneratedPlan] = useState<PujaPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleCategory = (cat: PandalCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleBuildPlan = () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setSuggestions([]);

    setTimeout(() => {
      const result = generatePujaPlan({
        metroId,
        durationHours,
        startTime,
        preferredCategories: selectedCategories,
        walkingPreference,
      });

      setIsGenerating(false);

      if (result.plan) {
        setGeneratedPlan(result.plan);
        setIsSaved(false);
        if (onPlanGenerated) onPlanGenerated(result.plan);
      } else {
        setErrorMsg(result.error || 'Could not generate route.');
        setSuggestions(result.suggestions || []);
      }
    }, 400);
  };

  const handleSaveCurrentPlan = () => {
    if (!generatedPlan) return;
    savePlan(generatedPlan);
    setIsSaved(true);
  };

  return (
    <div className="w-full space-y-6 text-[#171311]">
      {/* Wizard Input Form */}
      <div className="bg-[#FFFFFF] border border-[#D6A13A]/40 rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2.5 rounded-xl bg-[#F8F0DF] text-[#7E1815] border border-[#D6A13A]/50">
            <Sparkles className="w-5 h-5 text-[#B52B20]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#7E1815]">
              AI Puja Route Planner
            </h3>
            <p className="text-xs text-[#5A4E46]">
              Tell us your starting Metro and hours. We construct a practical, verified walking order.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          {/* 1. Starting Metro Station */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7E1815] mb-1.5">
              1. Starting Metro Station
            </label>
            <select
              value={metroId}
              onChange={(e) => setMetroId(e.target.value)}
              className="w-full bg-[#F8F0DF] border border-[#D6A13A]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#171311] focus:outline-none focus:border-[#7E1815]"
            >
              <optgroup label="South Kolkata">
                <option value="kalighat">Kalighat Metro</option>
                <option value="deshapriya-park">Deshapriya Park Corridor</option>
                <option value="netaji-bhavan">Netaji Bhavan Metro</option>
                <option value="jatin-das-park">Jatin Das Park Metro</option>
                <option value="rabindra-sarovar">Rabindra Sarovar Metro</option>
                <option value="mahanayak-uttam-kumar">Mahanayak Uttam Kumar (Tollygunge)</option>
                <option value="gitanjali">Gitanjali (Naktala)</option>
              </optgroup>
              <optgroup label="North Kolkata">
                <option value="sovabazar-sutanuti">Sovabazar–Sutanuti Metro</option>
                <option value="girish-park">Girish Park Metro</option>
                <option value="belgachia">Belgachia Metro</option>
                <option value="shyambazar">Shyambazar Metro</option>
              </optgroup>
              <optgroup label="Central Kolkata">
                <option value="mg-road">MG Road Metro</option>
                <option value="central">Central Metro</option>
                <option value="chandni-chowk">Chandni Chowk Metro</option>
              </optgroup>
              <optgroup label="East / West Metro">
                <option value="karunamoyee">Karunamoyee (Salt Lake)</option>
                <option value="city-centre">City Centre (Salt Lake)</option>
                <option value="sector-v">Sector V / New Town</option>
              </optgroup>
            </select>
          </div>

          {/* 2. Available Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7E1815] mb-1.5">
              2. Available Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5, 6].slice(0, 4).map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDurationHours(hrs)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    durationHours === hrs
                      ? 'bg-[#7E1815] text-[#F8F0DF] border-[#D6A13A] shadow-md'
                      : 'bg-[#F8F0DF] text-[#5A4E46] border-[#D6A13A]/30 hover:border-[#7E1815]'
                  }`}
                >
                  {hrs} hrs
                </button>
              ))}
            </div>
          </div>

          {/* 3. Start Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7E1815] mb-1.5">
              3. Starting Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#F8F0DF] border border-[#D6A13A]/40 rounded-xl px-3.5 py-2 text-sm text-[#171311] focus:outline-none focus:border-[#7E1815]"
            />
          </div>

          {/* 4. Walking Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7E1815] mb-1.5">
              4. Walking Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light' },
                { id: 'moderate', label: 'Moderate' },
                { id: 'dont-mind', label: "Don't Mind" },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWalkingPreference(w.id as any)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    walkingPreference === w.id
                      ? 'bg-[#7E1815] text-[#F8F0DF] border-[#D6A13A]'
                      : 'bg-[#F8F0DF] text-[#5A4E46] border-[#D6A13A]/30 hover:border-[#7E1815]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Preferred Categories (Section 83) */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#7E1815] mb-2">
            5. What Kind of Pujas Do You Want?
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    active
                      ? 'chip-category-selected'
                      : 'chip-category'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="mt-7 pt-4 border-t border-[#D6A13A]/25 flex items-center justify-between">
          <div className="text-xs text-[#5A4E46] hidden sm:block">
            Strictly uses verified Metro exits & pandal coordinates. No hallucinations.
          </div>
          <button
            onClick={handleBuildPlan}
            disabled={isGenerating}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#7E1815] hover:bg-[#B52B20] text-[#F8F0DF] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#7E1815]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#E7C46A]" />
            <span>{isGenerating ? 'BUILDING ITINERARY...' : 'BUILD MY PUJA PLAN'}</span>
          </button>
        </div>
      </div>

      {/* Error / Failure State */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 text-red-900 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#B52B20] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm mb-1">{errorMsg}</h4>
              {suggestions.length > 0 && (
                <div className="mt-2 text-xs text-red-800 space-y-1">
                  <p className="font-bold text-[#7E1815]">Suggestions:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESULT ITINERARY CONTAINER */}
      {generatedPlan && (
        <div className="bg-[#FFFFFF] border-2 border-[#D6A13A]/50 rounded-2xl p-5 sm:p-7 shadow-xl animate-fadeIn space-y-6">
          {/* Plan Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D6A13A]/25">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#7E1815] text-[#F8F0DF] px-2.5 py-0.5 rounded-full mb-1 inline-block">
                CURATED PUJA ITINERARY
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#7E1815]">
                {generatedPlan.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A4E46] mt-1.5 font-medium">
                <span className="flex items-center gap-1 text-[#B52B20] font-bold">
                  <Clock className="w-3.5 h-3.5" /> {generatedPlan.totalDuration}
                </span>
                <span>•</span>
                <span>{generatedPlan.stops.length} Pandals</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#7E1815]">
                  <Footprints className="w-3.5 h-3.5" /> {generatedPlan.estimatedDistance}
                </span>
                <span>•</span>
                <span>Starting {generatedPlan.preferences.startTime}</span>
              </div>
            </div>

            {/* Save / Share Plan Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveCurrentPlan}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#7E1815] hover:bg-[#B52B20] text-[#F8F0DF]'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'PLAN SAVED' : 'SAVE PLAN'}</span>
              </button>

              <Link
                href="/saved"
                className="px-3.5 py-2 rounded-full bg-[#F8F0DF] text-xs font-bold text-[#7E1815] border border-[#D6A13A]/40 hover:bg-[#EFE2C7]"
              >
                View Saved Plans
              </Link>
            </div>
          </div>

          {/* Timeline Steps (Sections 90 & 91: 01, 02 markers + gold line) */}
          <div className="relative pl-7 sm:pl-9 border-l-2 border-[#D6A13A] space-y-6 ml-3 sm:ml-4">
            {/* Metro Start Stop */}
            <div className="relative">
              <div className="absolute -left-[41px] sm:-left-[49px] top-0 w-9 h-9 rounded-full bg-[#7E1815] border-2 border-[#D6A13A] flex items-center justify-center text-sm shadow-md">
                🚇
              </div>
              <div className="bg-[#F8F0DF] border border-[#D6A13A]/30 rounded-xl p-3.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-[#B52B20]">METRO STARTING POINT</span>
                <h4 className="font-bold text-sm text-[#171311] mt-0.5">
                  {METRO_STATIONS.find((m) => m.id === metroId)?.name} Metro
                </h4>
                <p className="text-[#5A4E46] mt-1">
                  Arrive by {generatedPlan.preferences.startTime}. Take designated exit towards the first pandal.
                </p>
              </div>
            </div>

            {/* Pandal Itinerary Stops */}
            {generatedPlan.stops.map((stop, index) => {
              const orderNum = index + 1;
              const formattedNum = orderNum < 10 ? `0${orderNum}` : `${orderNum}`;
              return (
                <div key={stop.pandalId} className="relative">
                  {/* Down Arrow / Walking Time */}
                  <div className="absolute -left-[32px] sm:-left-[40px] -top-4 text-[10px] font-bold text-[#7E1815] bg-[#F8F0DF] px-2 py-0.2 rounded-full border border-[#D6A13A]/40 shadow-sm">
                    ↓ {stop.travelTime}
                  </div>

                  <div className="absolute -left-[41px] sm:-left-[49px] top-1 w-9 h-9 rounded-full bg-[#D6A13A] text-[#7E1815] font-bold text-xs flex items-center justify-center border-2 border-white shadow-md">
                    {formattedNum}
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 rounded-xl p-4 hover:border-[#D6A13A] transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#7E1815]">
                        {stop.visitTime} • Stop {formattedNum}
                      </span>
                      <span className="text-[11px] text-[#5A4E46] font-medium">
                        {stop.duration}
                      </span>
                    </div>

                    <h4 className="font-editorial text-lg font-bold text-[#171311]">
                      {stop.name}
                    </h4>
                    <p className="text-xs text-[#5A4E46] mt-0.5">
                      {stop.area} • Distance: {stop.distance}
                    </p>

                    {stop.instruction && (
                      <p className="text-xs text-[#5A4E46] mt-2 bg-[#F8F0DF] p-2.5 rounded-lg border border-[#D6A13A]/20 italic">
                        &quot;{stop.instruction}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#D6A13A]/20">
                      <Link
                        href={`/pandal/${stop.pandalId}`}
                        className="text-xs font-bold text-[#7E1815] hover:underline flex items-center gap-1"
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
        </div>
      )}
    </div>
  );
}
