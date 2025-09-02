import { useState } from 'react';
import { saveBrandingOverrides, SHOW_PRICES } from '@/lib/branding';
import { Switch } from '@/components/ui/switch';

export default function FeatureFlagsSettings() {
  const [showPrices, setShowPrices] = useState(SHOW_PRICES);
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">Feature Flags</h1>
      <div className="flex items-center justify-between border rounded-md p-4">
        <div>
          <p className="font-medium text-sm">Show Prices</p>
          <p className="text-xs text-muted-foreground">
            Toggle visibility of product pricing (local override)
          </p>
        </div>
        <Switch checked={showPrices} onCheckedChange={(v) => setShowPrices(!!v)} />
      </div>
      <button
        className="text-sm bg-pink-600 text-white px-3 py-1.5 rounded-md"
        onClick={() => saveBrandingOverrides({ showPrices })}
      >
        Save
      </button>
      <p className="text-xs text-muted-foreground">Overrides only affect local slice mode.</p>
    </div>
  );
}
