import { PropsWithChildren, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { markContentShown } from '@/store/timerSlice';

// Global loader wrapper so it always shows on first app mount
const AppLoader = ({ children }: PropsWithChildren) => {
  const [showLoader, setShowLoader] = useState(true);
  const dispatch = useAppDispatch();

  return (
    <>
      {children}
      <AnimatePresence>
        {showLoader && (
          <LoadingScreen
            onComplete={() => {
              setShowLoader(false);
              dispatch(markContentShown());
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AppLoader;
