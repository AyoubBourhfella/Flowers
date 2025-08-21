import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  size: number;
}

const SakuraPetals = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      for (let i = 0; i < 20; i++) {
        newPetals.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 8,
          size: 0.7 + Math.random() * 0.6,
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            transform: `scale(${petal.size})`,
          }}
        />
      ))}
    </div>
  );
};

export default SakuraPetals;