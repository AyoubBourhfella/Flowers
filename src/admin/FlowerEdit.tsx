import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataProvider } from '@/services/dataProvider';
import type { FlowerItem } from '@/store/flowersSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const emptyFlower: FlowerItem = {
  id: '',
  slug: '',
  image: '',
  title: '',
  description: '',
  price: 0,
  rating: 0,
  reviews: 0,
  category: 'Misc',
};

export default function FlowerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [flower, setFlower] = useState<FlowerItem>(emptyFlower);
  useEffect(() => {
    if (!isNew) {
      dataProvider.listFlowers().then((list) => {
        const found = list.find((f) => f.id === id);
        if (found) setFlower(found);
      });
    }
  }, [id, isNew]);
  const save = async () => {
    if (isNew) {
      await dataProvider.createFlower({
        ...flower,
        id: flower.id || flower.slug || crypto.randomUUID(),
      });
    } else {
      await dataProvider.updateFlower(flower);
    }
    navigate('/admin/flowers');
  };
  const remove = async () => {
    if (!isNew && flower.id) {
      await dataProvider.deleteFlower(flower.id);
      navigate('/admin/flowers');
    }
  };
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">{isNew ? 'New Flower' : 'Edit Flower'}</h1>
      <div className="grid gap-4">
        <label className="grid gap-1 text-sm">
          ID (unique)
          <Input
            value={flower.id}
            onChange={(e) => setFlower({ ...flower, id: e.target.value })}
            placeholder="auto if blank when new"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Slug
          <Input
            value={flower.slug}
            onChange={(e) => setFlower({ ...flower, slug: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Title
          <Input
            value={flower.title}
            onChange={(e) => setFlower({ ...flower, title: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Image URL
          <Input
            value={flower.image}
            onChange={(e) => setFlower({ ...flower, image: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Price
          <Input
            type="number"
            value={flower.price}
            onChange={(e) => setFlower({ ...flower, price: parseFloat(e.target.value) })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Category
          <Input
            value={flower.category}
            onChange={(e) => setFlower({ ...flower, category: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Description
          <Input
            value={flower.description}
            onChange={(e) => setFlower({ ...flower, description: e.target.value })}
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
