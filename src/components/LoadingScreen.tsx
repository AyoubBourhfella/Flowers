import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 loading-screen flex items-center justify-center">
      <div className="text-center">
        {/* Animated Flower Logo */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-sakura rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl animate-bounce">🌸</span>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">
          Sakura Blooms
        </h1>
        <p className="text-muted-foreground mb-8">Where Nature's Beauty Blooms</p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-sakura-light rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-4">Loading {progress}%</p>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-sakura-pink rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-sakura-light rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;