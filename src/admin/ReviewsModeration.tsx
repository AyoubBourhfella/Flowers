import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { approveReview, rejectReview, deleteReview, Review } from '@/store/reviewsSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { RefreshCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type FilterKey = 'all' | 'pending' | 'approved' | 'rejected';

const ReviewsModeration = () => {
  const reviews = useAppSelector((s) => s.reviews.items);
  const dispatch = useAppDispatch();
  // Start with all to avoid showing only pending by default
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    return reviews.reduce(
      (acc, r) => {
        acc.total++;
        acc[r.status]++;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 } as Record<string, number>
    );
  }, [reviews]);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return reviews.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (search) {
        if (!r.productSlug.toLowerCase().includes(lower) && !r.name.toLowerCase().includes(lower)) {
          return false;
        }
      }
      return true;
    });
  }, [reviews, filter, search]);

  const grouped = useMemo(() => {
    if (filter !== 'all')
      return { single: true, lists: { [filter]: filtered } as Record<FilterKey, Review[]> };
    return {
      single: false,
      lists: {
        pending: filtered.filter((r) => r.status === 'pending'),
        approved: filtered.filter((r) => r.status === 'approved'),
        rejected: filtered.filter((r) => r.status === 'rejected'),
        all: filtered,
      } as Record<FilterKey, Review[]>,
    };
  }, [filtered, filter]);

  const bulkApprove = () => {
    const pendingIds = reviews.filter((r) => r.status === 'pending').map((r) => r.id);
    pendingIds.forEach((id) => dispatch(approveReview(id)));
  };

  const [refreshing, setRefreshing] = useState(false);
  function refresh() {
    setRefreshing(true);
    // Simulate reload from storage (could be API later)
    setTimeout(() => setRefreshing(false), 400);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Review Moderation</h1>
          <p className="text-xs text-muted-foreground">
            Manage, approve or reject customer feedback.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Pending {counts.pending}
            </span>
            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
              Approved {counts.approved}
            </span>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">
              Rejected {counts.rejected}
            </span>
            <span className="px-2 py-0.5 rounded bg-muted">Total {counts.total}</span>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
          <div className="flex flex-wrap gap-1">
            {(['all', 'pending', 'approved', 'rejected'] as FilterKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`text-xs px-3 py-1 rounded border transition ${
                  filter === k
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {k.charAt(0).toUpperCase() + k.slice(1)}
                {k === 'all' ? '' : ` (${counts[k]})`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search slug or name..."
              className="flex-1 md:flex-none border rounded px-2 py-1 bg-background text-xs"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={refresh}
              disabled={refreshing}
              className="text-xs"
              aria-busy={refreshing}
            >
              <RefreshCcw className={`w-3 h-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
            {(filter === 'all' || filter === 'pending') && counts.pending > 1 && (
              <Button size="sm" variant="outline" onClick={bulkApprove} className="text-xs">
                Approve All Pending
              </Button>
            )}
          </div>
        </div>
      </div>
      {grouped.single ? (
        <ReviewGrid
          items={filtered}
          onApprove={(id) => dispatch(approveReview(id))}
          onReject={(id) => dispatch(rejectReview(id))}
          onDelete={(id) => dispatch(deleteReview(id))}
        />
      ) : (
        <div className="space-y-10">
          {(['pending', 'approved', 'rejected'] as FilterKey[]).map((section) => {
            const list = grouped.lists[section];
            if (!list.length) return null;
            return (
              <div key={section} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wide">{section}</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted">{list.length}</span>
                </div>
                <ReviewGrid
                  items={list}
                  onApprove={(id) => dispatch(approveReview(id))}
                  onReject={(id) => dispatch(rejectReview(id))}
                  onDelete={(id) => dispatch(deleteReview(id))}
                />
              </div>
            );
          })}
          {!filtered.length && <p className="text-sm text-muted-foreground">No reviews.</p>}
        </div>
      )}
    </div>
  );
};

export default ReviewsModeration;

// Reusable grid component
interface ReviewGridProps {
  items: Review[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReviewGrid = ({ items, onApprove, onReject, onDelete }: ReviewGridProps) => {
  if (!items.length) return <p className="text-sm text-muted-foreground">No reviews.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence initial={false}>
        {items.map((r) => (
          <motion.div
            key={r.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 flex flex-col gap-3 border h-full">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-muted-foreground truncate max-w-[140px]">
                  {r.productSlug}
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    r.status === 'approved'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : r.status === 'rejected'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 inline-block ${
                      i < r.rating ? 'text-gold' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="text-sm font-medium truncate">{r.name}</div>
              <p className="text-xs leading-snug text-muted-foreground line-clamp-4">{r.comment}</p>
              {r.images && r.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {r.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt="review"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-auto">
                {r.status !== 'approved' && (
                  <Button size="sm" onClick={() => onApprove(r.id)}>
                    Approve
                  </Button>
                )}
                {r.status !== 'rejected' && (
                  <Button size="sm" variant="destructive" onClick={() => onReject(r.id)}>
                    Reject
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => onDelete(r.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
