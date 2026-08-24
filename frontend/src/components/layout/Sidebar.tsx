import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, LayoutDashboard, FolderOpen, MessageSquare, Search,
  FileText, Settings, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { create } from 'zustand';

export const useSidebarStore = create<{ collapsed: boolean; toggle: () => void }>()(
  (set) => ({
    collapsed: false,
    toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  })
);

const mainNav = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard' },
  { icon: FolderOpen,      label: 'Projects',       path: '/projects' },
  { icon: MessageSquare,   label: 'Chat',           path: '/chat' },
  { icon: Search,          label: 'Search',         path: '/search' },
  { icon: FileText,        label: 'Documentation',  path: '/documentation' },
];

const bottomNav = [
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { collapsed, toggle } = useSidebarStore();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg)',
        boxShadow: '4px 0 20px var(--shadow-dark), -2px 0 10px var(--shadow-light)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        height: '4.5rem', display: 'flex', alignItems: 'center',
        padding: '0 1rem', flexShrink: 0,
        borderBottom: '1px solid var(--green-200)',
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', overflow: 'hidden' }}>
          <div style={{
            width: 38, height: 38, minWidth: 38, borderRadius: '0.75rem',
            background: 'linear-gradient(145deg, var(--green-500), var(--green-600))',
            boxShadow: '-3px -3px 8px rgba(255,255,255,0.6), 3px 3px 8px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Brain style={{ width: 19, height: 19, color: 'white' }} />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, var(--green-700), var(--green-500))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              CodeSense AI
            </motion.span>
          )}
        </Link>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {mainNav.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0.65rem 0.875rem', borderRadius: '0.875rem',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
                transition: 'all 0.2s',
                color: isActive ? 'var(--green-700)' : 'var(--text-secondary)',
                background: 'var(--bg)',
                boxShadow: isActive
                  ? 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)'
                  : '-2px -2px 5px var(--shadow-light), 2px 2px 5px var(--shadow-dark)',
              }}
            >
              <item.icon style={{ width: 19, height: 19, minWidth: 19, color: isActive ? 'var(--green-600)' : 'var(--text-muted)' }} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--green-500)', flexShrink: 0 }}
                />
              )}
            </Link>
          );
        })}

        {/* Admin section */}
        {isAdmin && (
          <>
            {!collapsed && (
              <div style={{ padding: '1rem 0.875rem 0.375rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-600)' }}>
                Admin
              </div>
            )}
            {collapsed && <div style={{ height: 12 }} />}
            <Link
              to="/admin"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0.65rem 0.875rem', borderRadius: '0.875rem',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
                color: location.pathname.startsWith('/admin') ? 'var(--green-700)' : 'var(--text-secondary)',
                background: 'var(--bg)',
                boxShadow: location.pathname.startsWith('/admin')
                  ? 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)'
                  : '-2px -2px 5px var(--shadow-light), 2px 2px 5px var(--shadow-dark)',
                transition: 'all 0.2s',
              }}
            >
              <Shield style={{ width: 19, height: 19, minWidth: 19, color: 'var(--text-muted)' }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>Admin Panel</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Bottom Nav */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--green-200)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {bottomNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0.65rem 0.875rem', borderRadius: '0.875rem',
              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
              color: location.pathname === item.path ? 'var(--green-700)' : 'var(--text-secondary)',
              background: 'var(--bg)',
              boxShadow: location.pathname === item.path
                ? 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)'
                : '-2px -2px 5px var(--shadow-light), 2px 2px 5px var(--shadow-dark)',
              transition: 'all 0.2s',
            }}
          >
            <item.icon style={{ width: 19, height: 19, minWidth: 19 }} />
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        style={{
          position: 'absolute', right: -14, top: '5.5rem',
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--bg)',
          boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', transition: 'all 0.2s',
          zIndex: 10,
        }}
        onMouseOver={e => (e.currentTarget as HTMLElement).style.color = 'var(--green-600)'}
        onMouseOut={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
      >
        {collapsed
          ? <ChevronRight style={{ width: 14, height: 14 }} />
          : <ChevronLeft style={{ width: 14, height: 14 }} />}
      </button>
    </motion.aside>
  );
}
