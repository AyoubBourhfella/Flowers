import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

const variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: 'blur(6px)',
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
} as const;

export const PageTransition = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
