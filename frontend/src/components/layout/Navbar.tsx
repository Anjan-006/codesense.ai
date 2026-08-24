import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Brain, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing',  href: '/#pricing' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
];

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--bg)',
        boxShadow: scrolled
          ? '-2px -2px 8px var(--shadow-light), 2px 2px 12px var(--shadow-dark)'
          : 'none',
        borderBottom: scrolled ? '1px solid var(--green-200)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container-lg" style={{ padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
            <div
              style={{
                width: 42, height: 42, borderRadius: '0.875rem',
                background: 'linear-gradient(145deg, var(--green-500), var(--green-600))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '-4px -4px 10px rgba(255,255,255,0.7), 4px 4px 10px rgba(0,0,0,0.12)',
              }}
            >
              <Brain style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <span
              style={{
                fontSize: '1.1rem', fontWeight: 800,
                background: 'linear-gradient(135deg, var(--green-600), var(--green-400))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}
            >
              CodeSense AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.5rem 1.125rem', borderRadius: '0.75rem',
                  fontSize: '0.9rem', fontWeight: 500,
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--green-600)';
                  el.style.background = 'var(--green-100)';
                  el.style.boxShadow = 'inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark)';
                }}
                onMouseOut={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--text-secondary)';
                  el.style.background = 'transparent';
                  el.style.boxShadow = 'none';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-outline"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{
              width: 42, height: 42, borderRadius: '0.75rem',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
              background: 'var(--bg)',
              boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', background: 'var(--bg)', borderTop: '1px solid var(--green-200)' }}
          >
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    fontSize: '0.9rem', fontWeight: 500,
                    color: 'var(--text-secondary)', textDecoration: 'none',
                    boxShadow: 'inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark)',
                    background: 'var(--bg)',
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12, borderTop: '1px solid var(--green-200)', marginTop: 4 }}>
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="btn-outline" style={{ width: '100%' }}>Sign In</button>
                <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="btn-primary" style={{ width: '100%' }}>Get Started Free</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
