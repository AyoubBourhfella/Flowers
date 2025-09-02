import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  addFlowerCategory,
  removeFlowerCategory,
  addBouquetCategory,
  removeBouquetCategory,
  addTag,
  removeTag,
  addBadge,
  removeBadge,
} from '@/store/catalogMetaSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, RefreshCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CatalogMeta() {
  const dispatch = useAppDispatch();
  const { flowerCategories, bouquetCategories, tags, badges } = useAppSelector(
    (s) => s.catalogMeta
  );
  const [flowerCat, setFlowerCat] = useState('');
  const [bouquetCat, setBouquetCat] = useState('');
  const [tag, setTag] = useState('');
  const [badge, setBadge] = useState('');

  const pill = (label: string, onRemove: () => void) => (
    <motion.span
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ duration: 0.18 }}
      key={label}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium"
    >
      {label}
      <button onClick={onRemove} className="hover:text-pink-900">
        <X className="w-3 h-3" />
      </button>
    </motion.span>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Catalog Metadata</h1>
      <section className="space-y-4">
        <h2 className="font-medium">Flower Categories</h2>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {flowerCategories.map((c) => pill(c, () => dispatch(removeFlowerCategory(c))))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 max-w-sm">
          <Input
            value={flowerCat}
            onChange={(e) => setFlowerCat(e.target.value)}
            placeholder="Add category"
          />
          <Button
            size="sm"
            onClick={() => {
              dispatch(addFlowerCategory(flowerCat));
              setFlowerCat('');
            }}
            disabled={!flowerCat.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-medium">Bouquet Categories</h2>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {bouquetCategories.map((c) => pill(c, () => dispatch(removeBouquetCategory(c))))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 max-w-sm">
          <Input
            value={bouquetCat}
            onChange={(e) => setBouquetCat(e.target.value)}
            placeholder="Add category"
          />
          <Button
            size="sm"
            onClick={() => {
              dispatch(addBouquetCategory(bouquetCat));
              setBouquetCat('');
            }}
            disabled={!bouquetCat.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-medium">Tags</h2>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {tags.map((t) => pill(t, () => dispatch(removeTag(t))))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 max-w-sm">
          <Input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Add tag (e.g. limited)"
          />
          <Button
            size="sm"
            onClick={() => {
              dispatch(addTag(tag));
              setTag('');
            }}
            disabled={!tag.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-medium">Badges</h2>
        <p className="text-xs text-muted-foreground max-w-prose">
          Badges are short labels (e.g. New, Sale, Seasonal) displayed next to product titles.
          Create them here or inline while editing items.
        </p>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {badges.map((b) => pill(b, () => dispatch(removeBadge(b))))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 max-w-sm">
          <Input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="Add badge (e.g. New)"
          />
          <Button
            size="sm"
            onClick={() => {
              dispatch(addBadge(badge.trim()));
              setBadge('');
            }}
            disabled={
              !badge.trim() || badges.some((b) => b.toLowerCase() === badge.trim().toLowerCase())
            }
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </section>
    </div>
  );
}
