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
  Navigation,
  ArrowRight,
  X,
  Share2,
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

    // Brief atmospheric visual delay to feel like genuine itinerary intelligence
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
    <div className="w-full space-y-6">
      {/* Wizard Input Form */}
      <div className="bg-[#0B223D] border border-[#D99A3D]/30 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-[#D99A3D]/15 text-[#D99A3D] border border-[#D99A3D]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#FFF8EC]">
              AI Puja Route Planner
            </h3>
            <p className="text-xs text-[#D8CEBE]/80">
              Tell us your starting Metro and hours. We construct a practical, verified walking order.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          {/* 1. Starting Metro Station */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D99A3D] mb-1.5">
              1. Starting Metro Station
            </label>
            <select
              value={metroId}
              onChange={(e) => setMetroId(e.target.value)}
              className="w-full bg-[#071A2F] border border-[#D99A3D]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF8EC] focus:outline-none focus:border-[#D99A3D]"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D99A3D] mb-1.5">
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
                      ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
                      : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
                  }`}
                >
                  {hrs} hrs
                </button>
              ))}
            </div>
          </div>

          {/* 3. Start Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D99A3D] mb-1.5">
              3. Starting Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#071A2F] border border-[#D99A3D]/30 rounded-xl px-3.5 py-2 text-sm text-[#FFF8EC] focus:outline-none focus:border-[#D99A3D]"
            />
          </div>

          {/* 4. Walking Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D99A3D] mb-1.5">
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
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                    walkingPreference === w.id
                      ? 'bg-[#D99A3D] text-[#071A2F] border-[#D99A3D] font-bold'
                      : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Preferred Categories */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#D99A3D] mb-2">
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
                      : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
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
        <div className="mt-7 pt-4 border-t border-[#D99A3D]/20 flex items-center justify-between">
          <div className="text-xs text-[#D8CEBE]/70 hidden sm:block">
            Strictly uses verified Metro exits & pandal coordinates. No hallucinations.
          </div>
          <button
            onClick={handleBuildPlan}
            disabled={isGenerating}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#B93624] to-[#cf412e] text-[#FFF8EC] font-bold text-sm tracking-wide shadow-xl shadow-[#B93624]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#D99A3D]" />
            <span>{isGenerating ? 'BUILDING ITINERARY...' : 'BUILD MY PUJA PLAN'}</span>
          </button>
        </div>
      </div>

      {/* Error / Failure State (Section 60) */}
      {errorMsg && (
        <div className="bg-[#B93624]/15 border border-[#B93624] rounded-2xl p-5 text-[#FFF8EC] animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#B93624] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">{errorMsg}</h4>
              {suggestions.length > 0 && (
                <div className="mt-2 text-xs text-[#D8CEBE] space-y-1">
                  <p className="font-bold text-[#D99A3D]">Suggestions:</p>
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

      {/* RESULT ITINERARY CONTAINER (Section 29) */}
      {generatedPlan && (
        <div className="bg-[#0B223D] border-2 border-[#D99A3D]/40 rounded-2xl p-5 sm:p-7 shadow-2xl animate-fadeIn space-y-6">
          {/* Plan Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D99A3D]/25">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#B93624] text-[#FFF8EC] px-2.5 py-0.5 rounded-full mb-1 inline-block">
                CURATED PUJA ITINERARY
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#FFF8EC]">
                {generatedPlan.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8CEBE] mt-1.5">
                <span className="flex items-center gap-1 text-[#D99A3D] font-semibold">
                  <Clock className="w-3.5 h-3.5" /> {generatedPlan.totalDuration}
                </span>
                <span>•</span>
                <span>{generatedPlan.stops.length} Pandals</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-[#D99A3D]" /> {generatedPlan.estimatedDistance}
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
                    : 'bg-[#B93624] hover:bg-[#cf412e] text-[#FFF8EC]'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'PLAN SAVED' : 'SAVE PLAN'}</span>
              </button>

              <Link
                href="/saved"
                className="px-3.5 py-2 rounded-full bg-[#071A2F] text-xs font-semibold text-[#D99A3D] border border-[#D99A3D]/30 hover:bg-[#0F2A4A]"
              >
                View Saved Plans
              </Link>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D99A3D]/30 space-y-6 ml-3 sm:ml-4">
            {/* Metro Start Stop */}
            <div className="relative">
              <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#071A2F] border-2 border-[#D99A3D] flex items-center justify-center text-sm shadow-md">
                🚇
              </div>
              <div className="bg-[#071A2F] border border-[#D99A3D]/20 rounded-xl p-3.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-[#D99A3D]">STARTING POINT</span>
                <h4 className="font-bold text-sm text-[#FFF8EC] mt-0.5">
                  {METRO_STATIONS.find((m) => m.id === metroId)?.name} Metro
                </h4>
                <p className="text-[#D8CEBE]/80 mt-1">
                  Arrive by {generatedPlan.preferences.startTime}. Take designated exit towards the first pandal.
                </p>
              </div>
            </div>

            {/* Pandal Itinerary Stops */}
            {generatedPlan.stops.map((stop, index) => (
              <div key={stop.pandalId} className="relative">
                {/* Down Arrow / Walking Time */}
                <div className="absolute -left-[28px] sm:-left-[36px] -top-4 text-[10px] font-bold text-[#D99A3D] bg-[#071A2F] px-1.5 py-0.2 rounded-full border border-[#D99A3D]/30">
                  ↓ {stop.travelTime}
                </div>

                <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full bg-[#B93624] text-[#FFF8EC] font-bold text-xs flex items-center justify-center border-2 border-[#FFF8EC] shadow-md">
                  {index + 1}
                </div>

                <div className="bg-[#071A2F]/90 border border-[#D99A3D]/25 rounded-xl p-4 hover:border-[#D99A3D]/60 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#D99A3D]">
                      {stop.visitTime} • Stop {index + 1}
                    </span>
                    <span className="text-[11px] text-[#D8CEBE]">
                      {stop.duration}
                    </span>
                  </div>

                  <h4 className="font-editorial text-lg font-bold text-[#FFF8EC]">
                    {stop.name}
                  </h4>
                  <p className="text-xs text-[#D8CEBE]/80 mt-0.5">
                    {stop.area} • Distance: {stop.distance}
                  </p>

                  {stop.instruction && (
                    <p className="text-xs text-[#D8CEBE] mt-2 bg-[#0B223D] p-2 rounded-lg border border-[#D99A3D]/10 italic">
                      &quot;{stop.instruction}&quot;
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#D99A3D]/15">
                    <Link
                      href={`/pandal/${stop.pandalId}`}
                      className="text-xs font-semibold text-[#D99A3D] hover:underline flex items-center gap-1"
                    >
                      <span>View Pandal Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
