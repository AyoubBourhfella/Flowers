import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataProvider } from '@/services/dataProvider';
import type { BouquetItem } from '@/store/bouquetsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const emptyBouquet: BouquetItem = {
  id: '',
  slug: '',
  image: '',
  title: '',
  description: '',
  price: 0,
  rating: 0,
  reviews: 0,
  category: 'Custom',
};

export default function BouquetEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [bouquet, setBouquet] = useState<BouquetItem>(emptyBouquet);
  useEffect(() => {
    if (!isNew) {
      dataProvider.listBouquets().then((list) => {
        const found = list.find((f) => f.id === id);
        if (found) setBouquet(found);
      });
    }
  }, [id, isNew]);
  const save = async () => {
    if (isNew) {
      await dataProvider.createBouquet({ ...bouquet, id: bouquet.id || crypto.randomUUID() });
    } else {
      await dataProvider.updateBouquet(bouquet);
    }
    navigate('/admin/bouquets');
  };
  const remove = async () => {
    if (!isNew && bouquet.id) {
      await dataProvider.deleteBouquet(bouquet.id);
      navigate('/admin/bouquets');
    }
  };
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">{isNew ? 'New Bouquet' : 'Edit Bouquet'}</h1>
      <div className="grid gap-4">
        <label className="grid gap-1 text-sm">
          ID
          <Input
            value={bouquet.id}
            onChange={(e) => setBouquet({ ...bouquet, id: e.target.value })}
            placeholder="auto if blank when new"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Title
          <Input
            value={bouquet.title}
            onChange={(e) => setBouquet({ ...bouquet, title: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Image URL
          <Input
            value={bouquet.image}
            onChange={(e) => setBouquet({ ...bouquet, image: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Price
          <Input
            type="number"
            value={bouquet.price}
            onChange={(e) => setBouquet({ ...bouquet, price: parseFloat(e.target.value) })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Category
          <Input
            value={bouquet.category}
            onChange={(e) => setBouquet({ ...bouquet, category: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Description
          <Input
            value={bouquet.description}
            onChange={(e) => setBouquet({ ...bouquet, description: e.target.value })}
          />
        </label>
      </div>
      <div className="flex gap-3">
        <Button size="sm" onClick={save}>
          {isNew ? 'Create' : 'Save'}
        </Button>
        {!isNew && (
          <Button size="sm" variant="destructive" onClick={remove}>
            Delete
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
