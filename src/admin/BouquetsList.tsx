import { useEffect, useState, useMemo } from 'react';
import { dataProvider } from '@/services/dataProvider';
import { type BouquetItem } from '@/store/bouquetsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCcw,
  Search,
  XCircle,
  ChevronsUpDown,
  Check,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { addBouquetCategory, addBadge } from '@/store/catalogMetaSlice';
import ImageDropInput from '@/components/admin/ImageDropInput';
import { Textarea } from '@/components/ui/textarea';

export default function BouquetsList() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<BouquetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BouquetItem | null>(null);
  const [saving, setSaving] = useState(false);
  const tagVocabulary = useAppSelector((s) => s.catalogMeta.tags);
  const categories = useAppSelector((s) => s.catalogMeta.bouquetCategories);
  const badges = useAppSelector((s) => s.catalogMeta.badges);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [badgeSearch, setBadgeSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');

  async function load() {
    setLoading(true);
    const data = await dataProvider.listBouquets();
    setItems(data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(
      (i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  function openNew() {
    setDraft({
      id: '',
      slug: '',
      image: '',
      title: '',
      description: '',
      price: 0,
      rating: 0,
      reviews: 0,
      category: 'Custom',
      tags: [],
    });
    setDialogOpen(true);
  }
  function openEdit(item: BouquetItem) {
    setDraft({ ...item });
    setDialogOpen(true);
  }
  async function persist() {
    if (!draft) return;
    setSaving(true);
    if (items.find((i) => i.id === draft.id)) await dataProvider.updateBouquet(draft);
    else
      await dataProvider.createBouquet({
        ...draft,
        id: draft.id || draft.slug || crypto.randomUUID(),
      });
    await load();
    setSaving(false);
    setDialogOpen(false);
  }
  async function confirmDelete() {
    if (deleteId) {
      await dataProvider.deleteBouquet(deleteId);
      await load();
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          Bouquets{' '}
          {loading && (
            <span className="text-xs font-normal text-muted-foreground animate-pulse">
              Loading…
            </span>
          )}
        </h1>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-9 w-48"
            />
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            className="h-9"
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? 'Refreshing' : 'Refresh'}
          >
            <RefreshCcw
              className={`w-4 h-4 mr-1 transition-transform ${loading ? 'animate-spin' : ''}`}
            />
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Button size="sm" onClick={openNew} className="h-9">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden bg-white/70 backdrop-blur">
        <table className="w-full text-sm">
          <thead className="bg-pink-50/60 text-muted-foreground">
            <tr>
              <th className="py-2 px-3 text-left font-medium">Title</th>
              <th className="py-2 px-3 text-left font-medium hidden md:table-cell">Category</th>
              <th className="py-2 px-3 text-left font-medium">Price</th>
              <th className="w-0" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.map((f) => (
                <motion.tr
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="border-t hover:bg-pink-50/40"
                >
                  <td className="py-2 px-3 font-medium flex items-center gap-2">
                    {f.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                        {f.badge}
                      </span>
                    )}
                    {f.title}
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-muted-foreground">
                    {f.category}
                  </td>
                  <td className="py-2 px-3">${f.price.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(f)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeleteId(f.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!loading && filtered.length === 0 && (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    No bouquets match your search.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
        {loading && <div className="p-6 text-sm text-muted-foreground">Loading...</div>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {draft?.id && items.find((i) => i.id === draft.id) ? 'Edit Bouquet' : 'New Bouquet'}
            </DialogTitle>
            <DialogDescription>Manage bouquet details.</DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="grid gap-6">
              <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-6">
                  <section className="space-y-4">
                    <h4 className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                      Basic Info
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="grid gap-1 text-xs">
                        <span>Title</span>
                        <Input
                          value={draft.title}
                          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-1 text-xs">
                        <span>Slug</span>
                        <Input
                          value={draft.slug}
                          onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-1 text-xs">
                        <span>Category</span>
                        <Popover open={catOpen} onOpenChange={setCatOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-between h-8"
                              role="combobox"
                              aria-expanded={catOpen}
                            >
                              {draft.category || 'Select category'}
                              <ChevronsUpDown className="w-4 h-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-64" align="start">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder="Search categories..."
                                value={catSearch}
                                onValueChange={(v) => setCatSearch(v)}
                              />
                              <CommandList>
                                <CommandEmpty className="p-2 text-xs text-muted-foreground">
                                  No results.
                                </CommandEmpty>
                                <CommandGroup heading="Categories">
                                  {categories
                                    .filter(
                                      (c) =>
                                        !catSearch ||
                                        c.toLowerCase().includes(catSearch.toLowerCase())
                                    )
                                    .map((c) => (
                                      <CommandItem
                                        key={c}
                                        value={c}
                                        onSelect={() => {
                                          setDraft({ ...draft, category: c });
                                          setCatOpen(false);
                                          setCatSearch('');
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            draft.category === c ? 'opacity-100' : 'opacity-0'
                                          }`}
                                        />
                                        {c}
                                      </CommandItem>
                                    ))}
                                  {catSearch &&
                                    !categories.some(
                                      (c) => c.toLowerCase() === catSearch.toLowerCase()
                                    ) && (
                                      <CommandItem
                                        value={catSearch}
                                        onSelect={() => {
                                          const newCat = catSearch.trim();
                                          if (newCat) {
                                            dispatch(addBouquetCategory(newCat));
                                            setDraft({ ...draft, category: newCat });
                                          }
                                          setCatOpen(false);
                                          setCatSearch('');
                                        }}
                                      >
                                        <Plus className="mr-2 h-4 w-4" /> Create "{catSearch}"
                                      </CommandItem>
                                    )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid gap-1 text-xs">
                        <span>Badge</span>
                        <Popover open={badgeOpen} onOpenChange={setBadgeOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-between h-8 w-full"
                              role="combobox"
                              aria-expanded={badgeOpen}
                            >
                              {draft.badge || '(none)'}
                              <ChevronsUpDown className="w-4 h-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-64" align="start">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder="Search badges..."
                                value={badgeSearch}
                                onValueChange={(v) => setBadgeSearch(v)}
                              />
                              <CommandList>
                                <CommandEmpty className="p-2 text-xs text-muted-foreground">
                                  No results.
                                </CommandEmpty>
                                <CommandGroup heading="Badges">
                                  {badges
                                    .filter(
                                      (b) =>
                                        !badgeSearch ||
                                        b.toLowerCase().includes(badgeSearch.toLowerCase())
                                    )
                                    .map((b) => (
                                      <CommandItem
                                        key={b}
                                        value={b}
                                        onSelect={() => {
                                          setDraft({ ...draft, badge: b });
                                          setBadgeOpen(false);
                                          setBadgeSearch('');
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            draft.badge === b ? 'opacity-100' : 'opacity-0'
                                          }`}
                                        />
                                        {b}
                                      </CommandItem>
                                    ))}
                                  {badgeSearch &&
                                    !badges.some(
                                      (b) => b.toLowerCase() === badgeSearch.toLowerCase()
                                    ) && (
                                      <CommandItem
                                        value={badgeSearch}
                                        onSelect={() => {
                                          const newB = badgeSearch.trim();
                                          if (newB) {
                                            dispatch(addBadge(newB));
                                            setDraft({ ...draft, badge: newB });
                                          }
                                          setBadgeOpen(false);
                                          setBadgeSearch('');
                                        }}
                                      >
                                        <Plus className="mr-2 h-4 w-4" /> Create "{badgeSearch}"
                                      </CommandItem>
                                    )}
                                  {draft.badge && (
                                    <CommandItem
                                      value="(none)"
                                      onSelect={() => {
                                        setDraft({ ...draft, badge: undefined });
                                        setBadgeOpen(false);
                                      }}
                                    >
                                      (Clear badge)
                                    </CommandItem>
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid gap-1 text-xs">
                        <span>Price</span>
                        <Input
                          type="number"
                          value={draft.price}
                          onChange={(e) =>
                            setDraft({ ...draft, price: parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>
                  </section>
                  <section className="space-y-3">
                    <h4 className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                      Description
                    </h4>
                    <Textarea
                      rows={4}
                      value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    />
                  </section>
                  <section className="space-y-4">
                    <h4 className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(draft.tags || []).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 flex items-center gap-1 text-[11px]"
                        >
                          {t}
                          <button
                            onClick={() =>
                              setDraft({
                                ...draft,
                                tags: (draft.tags || []).filter((x) => x !== t),
                              })
                            }
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="h-8"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-8"
                        disabled={!tagInput.trim()}
                        onClick={() => {
                          const val = tagInput.trim().toLowerCase();
                          if (!val) return;
                          if (!(draft.tags || []).includes(val))
                            setDraft({ ...draft, tags: [...(draft.tags || []), val] });
                          setTagInput('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {tagVocabulary.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tagVocabulary
                          .filter((tv) => !(draft.tags || []).includes(tv))
                          .slice(0, 12)
                          .map((tv) => (
                            <button
                              key={tv}
                              onClick={() =>
                                setDraft({ ...draft, tags: [...(draft.tags || []), tv] })
                              }
                              className="text-[10px] px-2 py-0.5 rounded bg-muted hover:bg-pink-100 transition"
                            >
                              {tv}
                            </button>
                          ))}
                      </div>
                    )}
                  </section>
                </div>
                <div className="md:col-span-4 space-y-4">
                  <h4 className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                    Image
                  </h4>
                  <ImageDropInput
                    value={draft.image}
                    onChange={(val) => setDraft({ ...draft, image: val || '' })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" disabled={saving} onClick={persist}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Bouquet</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
