import { useState } from 'react';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  HERO_IMAGE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  saveBrandingOverrides,
} from '@/lib/branding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BrandingSettings() {
  const [form, setForm] = useState({
    siteName: BRAND_NAME,
    tagline: BRAND_TAGLINE,
    heroImage: HERO_IMAGE,
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
  });
  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">Branding</h1>
      <div className="grid gap-4">
        <label className="grid gap-1 text-sm">
          Name
          <Input value={form.siteName} onChange={(e) => update('siteName', e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Tagline
          <Input value={form.tagline} onChange={(e) => update('tagline', e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Hero Image URL
          <Input value={form.heroImage} onChange={(e) => update('heroImage', e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <Input value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Phone
          <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </label>
      </div>
      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={() => {
            saveBrandingOverrides({
              siteName: form.siteName,
              tagline: form.tagline,
              heroImage: form.heroImage,
              email: form.email,
              phone: form.phone,
            });
          }}
        >
          Save Overrides
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            localStorage.removeItem('branding-overrides');
            location.reload();
          }}
        >
          Reset
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Overrides stored locally. Refresh to see global hero update.
      </p>
    </div>
  );
}
