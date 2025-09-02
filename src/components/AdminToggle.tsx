import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ENABLE_ADMIN } from '@/lib/branding';
import { LayoutDashboard, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminToggle() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'site' | 'admin'>(() =>
    location.pathname.startsWith('/admin') ? 'admin' : 'site'
  );

  useEffect(() => {
    setMode(location.pathname.startsWith('/admin') ? 'admin' : 'site');
  }, [location.pathname]);

  if (!ENABLE_ADMIN) return null;

  const toggle = () => {
    if (mode === 'admin') navigate('/');
    else navigate('/admin');
  };

  return (
    <AnimatePresence>
      <motion.button
        key="admintoggle"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        onClick={toggle}
        className="fixed bottom-5 right-5 z-[200] flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm font-medium hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="Toggle admin/site"
      >
        {mode === 'admin' ? (
          <Globe2 className="w-4 h-4" />
        ) : (
          <LayoutDashboard className="w-4 h-4" />
        )}
        {mode === 'admin' ? 'View Site' : 'Admin'}
      </motion.button>
    </AnimatePresence>
  );
}
