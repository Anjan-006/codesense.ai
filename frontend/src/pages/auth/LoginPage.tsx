import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 4.5rem)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1.25rem',
      background: 'linear-gradient(160deg, var(--bg-light) 0%, var(--bg) 60%, var(--bg-dark) 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <div style={{
          background: 'var(--bg)',
          boxShadow: '-18px -18px 40px var(--shadow-light), 18px 18px 40px var(--shadow-dark)',
          borderRadius: '2rem', padding: 'clamp(2rem, 5vw, 3rem)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '1.25rem', margin: '0 auto 1.25rem',
              background: 'linear-gradient(145deg, var(--green-500), var(--green-600))',
              boxShadow: '-6px -6px 14px rgba(255,255,255,0.6), 6px 6px 14px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain style={{ width: 28, height: 28, color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Welcome Back</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sign in to continue to CodeSense AI</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com" className="neu-input" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--green-600)', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="neu-input" style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                  {showPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoggingIn} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', opacity: isLoggingIn ? 0.7 : 1 }}>
              {isLoggingIn
                ? <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <><span>Sign In</span><ArrowRight style={{ width: 17, height: 17 }} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.75rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--green-600)', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
