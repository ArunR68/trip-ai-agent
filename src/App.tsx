import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AiChatSection } from './components/AiChatSection';
import { TripResultView } from './components/TripResultView';
import { PopularDestinations } from './components/PopularDestinations';
import { FeaturesSection } from './components/FeaturesSection';
import { SavedTripsModal } from './components/SavedTripsModal';
import {
  fetchPopularDestinations,
  fetchSavedTrips,
  saveTripToStorage,
  deleteTripFromStorage,
  generateTripPlan,
} from './services/api';
import type { TripPlan, PopularDestination, TripQuery } from './types';
import { MessageSquare, Sparkles, X, CheckCircle } from 'lucide-react';

export default function App() {
  const [activePlan, setActivePlan] = useState<TripPlan | null>(null);
  const [popularDestinations, setPopularDestinations] = useState<PopularDestination[]>([]);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [showChatSection, setShowChatSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    // Initial data loading
    fetchPopularDestinations().then(setPopularDestinations).catch(() => {});
    fetchSavedTrips().then(setSavedTrips).catch(() => {});
  }, []);

  const handlePlanGenerated = (plan: TripPlan) => {
    setActivePlan(plan);
    setIsLoading(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePlanFromHero = async (promptText: string, structuredParams?: Partial<TripQuery>) => {
    setIsLoading(true);
    try {
      const plan = await generateTripPlan({
        prompt: promptText,
        ...structuredParams,
      });
      handlePlanGenerated(plan);
      showToast(`Trip plan for ${plan.destination} generated successfully!`);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      showToast('Could not complete planning. Opening AI chat assistant to help.');
      setShowChatSection(true);
      setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPopularDestination = async (dest: PopularDestination) => {
    setIsLoading(true);
    try {
      const prompt = `Plan a ${dest.idealDays}-day trip to ${dest.name} with a budget of ${dest.currency}${dest.budgetFrom * 1.2}. Focus on ${dest.tags.join(', ')}.`;
      const plan = await generateTripPlan({
        prompt,
        preferredDestination: dest.name,
        durationDays: dest.idealDays,
        budget: dest.budgetFrom * 1.2,
        currency: dest.currency,
        interests: dest.tags,
      });
      handlePlanGenerated(plan);
      showToast(`Personalized plan for ${dest.name} loaded!`);
    } catch {
      showToast(`Opening planner for ${dest.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = async (trip: TripPlan) => {
    await saveTripToStorage(trip);
    const updated = await fetchSavedTrips();
    setSavedTrips(updated);
    showToast(`"${trip.title}" saved to your trips!`);
  };

  const handleDeleteTrip = async (id: string) => {
    await deleteTripFromStorage(id);
    setSavedTrips((prev) => prev.filter((t) => t.id !== id));
    showToast('Trip removed from saved plans.');
  };

  const isCurrentPlanSaved = activePlan ? savedTrips.some((t) => t.id === activePlan.id) : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        savedTripsCount={savedTrips.length}
        onOpenSavedTrips={() => setIsSavedModalOpen(true)}
        onOpenChat={() => {
          setShowChatSection(true);
          setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
        onNewTrip={() => {
          setActivePlan(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onPlanTrip={handlePlanFromHero}
          isLoading={isLoading}
          onOpenChat={() => {
            setShowChatSection(true);
            setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }}
        />

        {/* AI Travel Chat Section (Visible when toggled or active) */}
        {showChatSection && (
          <div ref={chatRef} className="px-4 sm:px-6 py-8 bg-slate-100/70 border-y border-slate-200/80">
            <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">TourAI Travel Agent Chat</h2>
              </div>
              <button
                onClick={() => setShowChatSection(false)}
                className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                Hide Chat
              </button>
            </div>
            <AiChatSection onPlanGenerated={handlePlanGenerated} />
          </div>
        )}

        {/* Generated Trip Plan Result View */}
        {activePlan && (
          <div ref={resultRef} className="px-4 sm:px-6 pt-10 pb-8">
            <TripResultView
              tripPlan={activePlan}
              onSaveTrip={handleSaveTrip}
              isSaved={isCurrentPlanSaved}
              onNewPlan={() => {
                setActivePlan(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Popular Destinations Cards */}
        <PopularDestinations
          destinations={popularDestinations}
          onSelectDestination={handleSelectPopularDestination}
          isLoading={isLoading}
        />

        {/* Features Section */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              T
            </div>
            <span className="font-bold text-slate-200">TourAI</span>
            <span>– AI Travel Agent & Smart Trip Planner</span>
          </div>

          <p className="text-slate-500 text-center sm:text-right">
            Live climate powered by Open-Meteo • Reasoning powered by Google Gemini • Respects user budgets
          </p>
        </div>
      </footer>

      {/* Saved Trips Drawer / Modal */}
      <SavedTripsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setActivePlan(trip);
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
        onDeleteTrip={handleDeleteTrip}
      />
    </div>
  );
}
