import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Bell, LogOut } from 'lucide-react';
import { useSidebarStore } from './Sidebar';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/projects':      'Projects',
  '/chat':          'AI Chat',
  '/search':        'Semantic Search',
  '/documentation': 'Documentation',
  '/settings':      'Settings',
  '/admin':         'Admin Panel',
};

export default function Header() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { collapsed } = useSidebarStore();
  const location = useLocation();

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard';

  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: collapsed ? 72 : 260 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      style={{
        position: 'sticky', top: 0, zIndex: 30, height: '4.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.75rem',
        background: 'var(--bg)',
        boxShadow: '0 2px 12px var(--shadow-dark), 0 -1px 8px var(--shadow-light)',
        borderBottom: '1px solid var(--green-200)',
      }}
    >
      {/* Left — dynamic page title */}
      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        {pageTitle}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              width: 40, height: 40, borderRadius: '0.875rem', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', background: 'var(--bg)',
              boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark)';
              (e.currentTarget as HTMLElement).style.color = 'var(--green-600)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            }}
          >
            <Bell style={{ width: 17, height: 17 }} />
          </button>
          <span style={{
            position: 'absolute', top: -4, right: -4, width: 18, height: 18,
            borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-500), var(--green-600))',
            boxShadow: '-1px -1px 4px rgba(255,255,255,0.4), 1px 1px 4px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', color: 'white', fontWeight: 800,
          }}>3</span>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: 'var(--green-200)' }} />

        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: '0.875rem',
          background: 'linear-gradient(145deg, var(--green-400), var(--green-600))',
          boxShadow: '-3px -3px 8px rgba(255,255,255,0.6), 3px 3px 8px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 800, color: 'white', flexShrink: 0,
        }}>
          {initials}
        </div>

        {/* Name (hidden on small screens) */}
        <div className="hidden sm:block" style={{ lineHeight: 1.3 }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.firstName} {user?.lastName}</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role?.toLowerCase()}</p>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          title="Logout"
          style={{
            width: 38, height: 38, borderRadius: '0.875rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', background: 'var(--bg)',
            boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
            (e.currentTarget as HTMLElement).style.boxShadow = 'inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark)';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.boxShadow = '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)';
          }}
        >
          <LogOut style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </motion.header>
  );
}
