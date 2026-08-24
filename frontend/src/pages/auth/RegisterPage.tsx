import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RegisterPage() {
  const { register, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form);
  };

  const strength = form.password.length >= 12 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 5 ? 2 : form.password.length > 0 ? 1 : 0;
  const strengthColors = ['var(--bg-dark)', '#ef4444', '#f59e0b', '#3b82f6', 'var(--green-500)'];

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
        style={{ width: '100%', maxWidth: 480 }}
      >
        <div style={{
          background: 'var(--bg)',
          boxShadow: '-18px -18px 40px var(--shadow-light), 18px 18px 40px var(--shadow-dark)',
          borderRadius: '2rem', padding: 'clamp(2rem, 5vw, 3rem)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '1.25rem', margin: '0 auto 1.25rem',
              background: 'linear-gradient(145deg, var(--green-400), var(--green-600))',
              boxShadow: '-6px -6px 14px rgba(255,255,255,0.6), 6px 6px 14px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain style={{ width: 28, height: 28, color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Create Account</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Start understanding codebases in minutes</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {[
                { field: 'firstName', label: 'First Name', placeholder: 'John' },
                { field: 'lastName',  label: 'Last Name',  placeholder: 'Doe' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input type="text" required value={(form as any)[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={placeholder} className="neu-input" />
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com" className="neu-input" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters" className="neu-input" style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                  {showPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {[1,2,3,4].map(n => (
                    <div key={n} style={{
                      flex: 1, height: 4, borderRadius: 99,
                      background: n <= strength ? strengthColors[strength] : 'var(--shadow-dark)',
                      boxShadow: n <= strength ? 'inset -1px -1px 2px rgba(255,255,255,0.3), inset 1px 1px 2px rgba(0,0,0,0.1)' : 'inset -1px -1px 3px var(--shadow-light), inset 1px 1px 3px var(--shadow-dark)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <a href="#" style={{ color: 'var(--green-600)', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: 'var(--green-600)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>.
            </p>

            <button type="submit" disabled={isRegistering} className="btn-primary" style={{ width: '100%', opacity: isRegistering ? 0.7 : 1 }}>
              {isRegistering
                ? <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <><span>Create Account</span><ArrowRight style={{ width: 17, height: 17 }} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.75rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--green-600)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
