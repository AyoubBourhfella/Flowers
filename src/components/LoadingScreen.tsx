import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { markLoadingEnd, markLoadingStart } from '@/store/timerSlice';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/branding';

interface LoadingScreenProps {
  onComplete: () => void;
  onReveal?: () => void; // fires when progress reaches 100, before unmount
}

const LoadingScreen = ({ onComplete, onReveal }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Mark precise loading start
    dispatch(markLoadingStart());

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setIsComplete(true);
          // Allow content to reveal behind the loader before it fully exits
          onReveal?.();
          // Mark precise loading end before completing
          dispatch(markLoadingEnd());
          // Start the transition sequence
          setTimeout(() => {
            onComplete();
          }, 1500); // Allow time for the zoom transition
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Slightly faster progress

    return () => clearInterval(progressTimer);
  }, [dispatch, onComplete, onReveal]);

  const textVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const brandName = BRAND_NAME;

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Background that fades out */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-50 via-white to-pink-100"
        initial={{ opacity: 1 }}
        animate={{ opacity: isComplete ? 0 : 1 }}
        transition={{ duration: 1, delay: isComplete ? 0.5 : 0 }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Animated Big Flower - This will zoom and position for hero */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: isComplete ? 0.3 : 1,
            rotate: 0,
            x: isComplete ? '-45vw' : 0,
            y: isComplete ? '-20vh' : 0,
          }}
          transition={{
            duration: isComplete ? 1.5 : 1.5,
            type: 'spring',
            stiffness: 50,
            delay: isComplete ? 0.2 : 0,
          }}
          className="relative mb-6"
        >
          <motion.div
            animate={{
              scale: isComplete ? [1, 1.5, 0] : [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
              opacity: isComplete ? 0 : 1,
            }}
            transition={{
              duration: isComplete ? 1 : 4,
              repeat: isComplete ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-300 to-pink-500 shadow-2xl"
          >
            <span className="text-5xl">🌸</span>
          </motion.div>
        </motion.div>

        {/* Brand Title with character animation */}
        <motion.h1
          className="font-playfair text-5xl font-bold text-pink-700 mb-2 overflow-hidden"
          initial="hidden"
          animate={isComplete ? 'exit' : 'visible'}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            exit: { opacity: 0, y: -50, transition: { duration: 0.8 } },
          }}
        >
          {brandName.split('').map((char, index) => (
            <motion.span key={index} variants={textVariants} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isComplete ? 0 : 1,
            y: isComplete ? -30 : 0,
          }}
          transition={{ duration: isComplete ? 0.8 : 1, delay: isComplete ? 0 : 1.5 }}
        >
          {BRAND_TAGLINE}
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="w-72 h-2 bg-pink-200 rounded-full overflow-hidden relative"
          animate={{
            opacity: isComplete ? 0 : 1,
            scale: isComplete ? 0.8 : 1,
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </motion.div>
        <motion.div
          className="mt-4 text-pink-600 font-semibold"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isComplete ? 0 : 1,
            y: isComplete ? 20 : 0,
          }}
          transition={{ duration: isComplete ? 0.8 : 1, delay: isComplete ? 0 : 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
