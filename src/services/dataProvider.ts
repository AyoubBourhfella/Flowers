import { USE_LARAVEL, LARAVEL_API_BASE } from '@/lib/branding';
import { store } from '@/store';
import { addFlower, updateFlower, deleteFlower, type FlowerItem } from '@/store/flowersSlice';
import { addBouquet, updateBouquet, deleteBouquet, type BouquetItem } from '@/store/bouquetsSlice';

async function laravelFetch(path: string, init?: RequestInit) {
  const url = `${LARAVEL_API_BASE}${path}`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const dataProvider = {
  async listFlowers(): Promise<FlowerItem[]> {
    if (!USE_LARAVEL) return store.getState().flowers.items;
    return laravelFetch('/flowers');
  },
  async createFlower(f: FlowerItem) {
    if (!USE_LARAVEL) store.dispatch(addFlower(f));
    else await laravelFetch('/flowers', { method: 'POST', body: JSON.stringify(f) });
  },
  async updateFlower(f: FlowerItem) {
    if (!USE_LARAVEL) store.dispatch(updateFlower(f));
    else await laravelFetch(`/flowers/${f.id}`, { method: 'PUT', body: JSON.stringify(f) });
  },
  async deleteFlower(id: string) {
    if (!USE_LARAVEL) store.dispatch(deleteFlower({ id }));
    else await laravelFetch(`/flowers/${id}`, { method: 'DELETE' });
  },
  async listBouquets(): Promise<BouquetItem[]> {
    if (!USE_LARAVEL) return store.getState().bouquets.items;
    return laravelFetch('/bouquets');
  },
  async createBouquet(b: BouquetItem) {
    if (!USE_LARAVEL) store.dispatch(addBouquet(b));
    else await laravelFetch('/bouquets', { method: 'POST', body: JSON.stringify(b) });
  },
  async updateBouquet(b: BouquetItem) {
    if (!USE_LARAVEL) store.dispatch(updateBouquet(b));
    else await laravelFetch(`/bouquets/${b.id}`, { method: 'PUT', body: JSON.stringify(b) });
  },
  async deleteBouquet(id: string) {
    if (!USE_LARAVEL) store.dispatch(deleteBouquet({ id }));
    else await laravelFetch(`/bouquets/${id}`, { method: 'DELETE' });
  },
};

export type DataProvider = typeof dataProvider;
