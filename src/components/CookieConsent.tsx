import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { trackEvent, setAnalyticsConsent, isAnalyticsEnabled } from '@/lib/analytics';
import { Checkbox } from '@/components/ui/checkbox';

export type ConsentState = {
  essential: true; // always true
  preferences: boolean;
  analytics: boolean;
};

const STORAGE_KEY = 'pf_cookie_consent_v1';

function readStored(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

function writeStored(c: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch (e) {
    // ignore write errors
  }
}

export const CookieConsentBanner = () => {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [prefs, setPrefs] = useState({ preferences: true, analytics: true });
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (!stored) {
      setOpen(true);
    } else {
      setConsent(stored);
      setAnalyticsConsent(stored.analytics);
    }
  }, []);

  const acceptAll = () => {
    const c: ConsentState = { essential: true, preferences: true, analytics: true };
    writeStored(c);
    setConsent(c);
    setOpen(false);
    setAnalyticsConsent(true);
    trackEvent('consent_accept_all');
  };

  const rejectNonEssential = () => {
    const c: ConsentState = { essential: true, preferences: false, analytics: false };
    writeStored(c);
    setConsent(c);
    setOpen(false);
    setAnalyticsConsent(false);
    trackEvent('consent_reject');
  };

  const saveSelected = () => {
    const c: ConsentState = {
      essential: true,
      preferences: prefs.preferences,
      analytics: prefs.analytics,
    };
    writeStored(c);
    setConsent(c);
    setOpen(false);
    setAnalyticsConsent(c.analytics);
    trackEvent('consent_customize', { prefs: c.preferences, analytics: c.analytics });
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-lg z-50">
      <div className="rounded-xl border shadow-xl bg-white/90 backdrop-blur p-5 space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-base mb-1">We value your privacy</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            We use essential cookies to make this site work. With your consent we also use
            preference and analytics cookies to understand usage and improve the experience. Read
            our{' '}
            <a href="/privacy" className="underline text-primary">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/cookie-policy" className="underline text-primary">
              Cookie Policy
            </a>
            .
          </p>
        </div>
        {showPanel && (
          <div className="grid gap-3 border rounded-lg p-3 bg-muted/30">
            <label className="flex items-start gap-2 text-xs">
              <Checkbox checked disabled className="mt-0.5" />
              <span>
                <span className="font-medium">Essential</span> – Required for core functionality.
              </span>
            </label>
            <label className="flex items-start gap-2 text-xs">
              <Checkbox
                className="mt-0.5"
                checked={prefs.preferences}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, preferences: Boolean(v) }))}
              />
              <span>
                <span className="font-medium">Preferences</span> – Remember settings like theme.
              </span>
            </label>
            <label className="flex items-start gap-2 text-xs">
              <Checkbox
                className="mt-0.5"
                checked={prefs.analytics}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, analytics: Boolean(v) }))}
              />
              <span>
                <span className="font-medium">Analytics</span> – Help us understand usage.
              </span>
            </label>
          </div>
        )}
        <div className="flex flex-wrap gap-2 justify-end">
          {!showPanel && (
            <Button variant="outline" size="sm" onClick={() => setShowPanel(true)}>
              Customize
            </Button>
          )}
          {showPanel && (
            <Button variant="secondary" size="sm" onClick={() => setShowPanel(false)}>
              Basic
            </Button>
          )}
          {showPanel && (
            <Button variant="outline" size="sm" onClick={rejectNonEssential}>
              Reject
            </Button>
          )}
          {showPanel && (
            <Button size="sm" onClick={saveSelected}>
              Save
            </Button>
          )}
          {!showPanel && (
            <Button variant="outline" size="sm" onClick={rejectNonEssential}>
              Reject
            </Button>
          )}
          <Button size="sm" onClick={acceptAll}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsDebugger = () => {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setEnabled(isAnalyticsEnabled());
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem('pf_analytics_events_v1');
        if (raw) {
          const arr = JSON.parse(raw) as unknown[];
          setCount(arr.length);
        }
      } catch (e) {
        // ignore
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);
  if (!import.meta.env.DEV) return null;
  return (
    <div className="fixed bottom-2 right-2 text-[10px] px-2 py-1 bg-black/60 text-white rounded">
      analytics {enabled ? 'on' : 'off'} • events {count}
    </div>
  );
};
