import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import SakuraPetals from '@/components/SakuraPetals';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Falling Sakura Petals */}
      <SakuraPetals />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Product Showcase */}
      <ProductShowcase />
    </div>
  );
};

export default Index;
