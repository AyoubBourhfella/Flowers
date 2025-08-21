import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  addStem,
  decrementStem,
  setStemQuantity,
  setName,
  saveCurrent,
  resetBuilder,
  selectBuilder,
  selectBuilderTotal,
  selectSavedBouquets,
  deleteSaved,
} from '@/store/customBouquetSlice';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Save, RefreshCcw, Flower2, Info } from 'lucide-react';
import { showPrices } from '@/lib/featureFlags';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const CustomBouquet = () => {
  const dispatch = useAppDispatch();
  const flowers = useAppSelector((s) => s.flowers.items);
  const builder = useAppSelector(selectBuilder);
  const total = useAppSelector(selectBuilderTotal);
  const saved = useAppSelector(selectSavedBouquets);

  return (
    <div className="container mx-auto px-4 pt-24 pb-24 flex flex-col gap-16">
      <div>
        <Breadcrumbs />
      </div>
      <header className="max-w-3xl space-y-4">
        <h1 className="font-playfair text-4xl font-bold flex items-center gap-3">
          <Flower2 className="w-8 h-8 text-primary" /> Build Your Bouquet
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Choose stems and craft a personalized arrangement.
          {showPrices
            ? ' Pricing is estimated per stem using product prices ÷ 8 for a simple heuristic.'
            : ' Final pricing will be provided on request once your design is saved.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            value={builder.name}
            onChange={(e) => dispatch(setName(e.target.value))}
            placeholder="Name your bouquet (optional)"
            className="w-full sm:w-72 rounded-md border border-sakura-pink/30 bg-background/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(resetBuilder())}
              className="gap-1"
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </Button>
            <Button
              size="sm"
              onClick={() => dispatch(saveCurrent())}
              disabled={builder.stems.length === 0}
              className="gap-1"
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-semibold text-xl">Available Flowers</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {flowers.map((f) => {
              const perStem = (f.price / 8).toFixed(2);
              return (
                <motion.div
                  key={f.id}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-sakura-pink/30 bg-gradient-to-br from-muted/40 to-background p-4 flex flex-col gap-3 shadow-sm"
                >
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-h-[56px]">
                    <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-1">
                      {f.title}
                    </h3>
                    {showPrices ? (
                      <p className="text-xs text-muted-foreground">${perStem} / stem</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Add stem</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dispatch(addStem({ flower: f }))}
                    className="mt-auto"
                  >
                    Add Stem
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Builder Panel */}
        <div className="sticky top-24 space-y-6">
          <div className="rounded-2xl border border-sakura-pink/30 bg-background/70 backdrop-blur-md p-5 shadow-md">
            <h2 className="font-semibold text-lg mb-4">Current Bouquet</h2>
            {builder.stems.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No stems added yet. Choose from the catalog.
              </p>
            )}
            <ul className="space-y-4">
              {builder.stems.map((s) => (
                <li key={s.id} className="flex gap-3 items-center">
                  <img src={s.image} alt={s.title} className="w-12 h-12 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={s.title}>
                      {s.title}
                    </p>
                    {showPrices && (
                      <p className="text-[11px] text-muted-foreground">
                        ${s.price.toFixed(2)} / stem
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => dispatch(decrementStem({ id: s.id }))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <input
                      value={s.quantity}
                      onChange={(e) =>
                        dispatch(
                          setStemQuantity({ id: s.id, quantity: Number(e.target.value) || 0 })
                        )
                      }
                      className="w-12 h-8 text-center text-sm rounded-md border border-sakura-pink/30 bg-background/70 focus:outline-none"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        const flower = flowers.find((f) => f.id === s.id);
                        if (flower) dispatch(addStem({ flower }));
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {showPrices ? (
              <div className="mt-6 flex items-center justify-between text-sm font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            ) : (
              <div className="mt-6 text-[11px] text-muted-foreground flex gap-2 items-start">
                <Info className="w-3.5 h-3.5 mt-0.5 text-primary" /> Save your design and we'll
                calculate a tailored quote.
              </div>
            )}
          </div>
          {saved.length > 0 && (
            <div className="rounded-2xl border border-sakura-pink/30 bg-background/70 backdrop-blur-md p-5 shadow-md space-y-4">
              <h3 className="font-semibold text-sm">Saved Bouquets</h3>
              <ul className="space-y-3 max-h-[260px] overflow-auto pr-1">
                {saved.map((b) => (
                  <li
                    key={b.id}
                    className="border border-sakura-pink/20 rounded-lg p-3 flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate" title={b.name}>
                        {b.name}
                      </span>
                      <button
                        onClick={() => dispatch(deleteSaved({ id: b.id }))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-muted-foreground">
                      {b.stems.reduce((a, s) => a + s.quantity, 0)} stems
                      {showPrices && ' • $' + b.totalPrice.toFixed(2)}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {b.stems.slice(0, 6).map((s) => (
                        <span
                          key={s.id}
                          className="px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20 text-[10px]"
                        >
                          {s.title.split(' ')[0]}×{s.quantity}
                        </span>
                      ))}
                      {b.stems.length > 6 && (
                        <span className="text-[10px] px-1.5 py-0.5">
                          +{b.stems.length - 6} more
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CustomBouquet;
