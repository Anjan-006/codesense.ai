import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar, { useSidebarStore } from './Sidebar';
import Header from './Header';

/**
 * Layout for authenticated app pages.
 * Collapsible sidebar + header + scrollable content area.
 */
export default function AppLayout() {
  const { collapsed } = useSidebarStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <Header />
      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        style={{
          padding: '2rem 1.75rem',
          minHeight: 'calc(100vh - 4.5rem)',
          background: 'var(--bg-light)',
        }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
