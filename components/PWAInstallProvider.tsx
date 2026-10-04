'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAContextType {
  isInstallable: boolean;
  isStandalone: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  installApp: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isStandalone: false,
  isInstalled: false,
  isIOS: false,
  installApp: async () => {},
});

export function usePWA() {
  return useContext(PWAContext);
}

export default function PWAInstallProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    // 1. Detect standalone mode (already installed or running as PWA)
    const checkStandalone = () => {
      const standaloneQuery = window.matchMedia('(display-mode: standalone)').matches;
      const navigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const runningStandalone = standaloneQuery || navigatorStandalone;
      setIsStandalone(runningStandalone);
      if (runningStandalone) {
        setIsInstallable(false);
      }
      return runningStandalone;
    };

    const standalone = checkStandalone();

    // 2. Detect iOS environment
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // On iOS, if not standalone, we can consider it installable via Add to Home Screen
    if (isIOSDevice && !standalone) {
      setIsInstallable(true);
    }

    // 3. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Check for updates
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[Dugga Dekha] New PWA content available.');
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn('[Dugga Dekha] Service Worker registration failed:', err);
          });
      });
    }

    // 4. Capture native beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // 5. Handle appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      setShowManualModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    // If native prompt is available (Chrome, Edge, Android)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('[Dugga Dekha] Install prompt error:', err);
      }
      return;
    }

    // If native prompt is not supported (e.g. Safari on iOS or macOS)
    setShowManualModal(true);
  }, [deferredPrompt]);

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isStandalone,
        isInstalled,
        isIOS,
        installApp,
      }}
    >
      {children}

      {/* Manual Installation Instructions Modal (for iOS Safari & browsers without beforeinstallprompt) */}
      {showManualModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120E0C]/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowManualModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-sm w-full bg-[#180E0C] border-2 border-[#C9973E]/60 rounded-3xl p-6 shadow-2xl text-[#F7F0E2] space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#C9973E]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-xl border border-[#C9973E] bg-[#241714] overflow-hidden flex items-center justify-center p-0.5 shadow-md shrink-0">
                  <Image
                    src="/app-icon.png"
                    alt="Dugga Dekha App Icon"
                    width={40}
                    height={40}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#F7F0E2]">
                    Install Dugga Dekha
                  </h3>
                  <span className="text-[10px] text-[#E1BE68] font-semibold uppercase tracking-wider block">
                    Standalone Experience
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-lg text-[#F7F0E2]/70 hover:text-[#E1BE68] bg-[#241714] border border-[#C9973E]/30 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-3.5 text-xs text-[#F7F0E2]/90">
              <p className="leading-relaxed">
                Install <strong>Dugga Dekha</strong> to your home screen for quick offline access and a fullscreen app experience:
              </p>

              <div className="space-y-2.5 bg-[#241714] p-3.5 rounded-2xl border border-[#C9973E]/30">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#8F1D18] text-[#E1BE68] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-[#F7F0E2] block">
                      {isIOS ? 'Tap the Share Button' : 'Open Browser Menu'}
                    </span>
                    <span className="text-[11px] text-[#E1BE68]/90 flex items-center gap-1 mt-0.5">
                      {isIOS ? (
                        <>
                          <Share2 className="w-3 h-3 text-[#E1BE68]" />
                          <span>Tap the Share icon at the bottom of Safari</span>
                        </>
                      ) : (
                        <span>Tap the three dots (⋮) in your browser toolbar</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-[#C9973E]/20">
                  <div className="w-6 h-6 rounded-full bg-[#8F1D18] text-[#E1BE68] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-[#F7F0E2] block">
                      Select &quot;Add to Home Screen&quot;
                    </span>
                    <span className="text-[11px] text-[#E1BE68]/90 flex items-center gap-1 mt-0.5">
                      <PlusSquare className="w-3 h-3 text-[#E1BE68]" />
                      <span>Scroll down and tap &quot;Add to Home Screen&quot; or &quot;Install App&quot;</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowManualModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-bold uppercase tracking-wider transition-colors shadow-md border border-[#C9973E]/40 cursor-pointer"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </PWAContext.Provider>
  );
}
