import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { User, Lock, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile',  label: 'Profile',       icon: User },
  { id: 'security', label: 'Security',       icon: Lock },
  { id: 'notifs',   label: 'Notifications',  icon: Bell },
];

function Field({ label, value, type = 'text', placeholder, readOnly }: { label: string; value: string; type?: string; placeholder?: string; readOnly?: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className="neu-input"
        style={{ paddingLeft: '1rem', opacity: readOnly ? 0.6 : 1, cursor: readOnly ? 'not-allowed' : 'text' }}
      />
    </div>
  );
}

function Toggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--green-200)' }}>
      <div>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 52, height: 28, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
          position: 'relative', transition: 'all 0.25s',
          background: on ? 'linear-gradient(145deg,var(--green-500),var(--green-600))' : 'var(--bg)',
          boxShadow: on
            ? '-3px -3px 8px rgba(255,255,255,0.4), 3px 3px 8px rgba(0,0,0,0.15)'
            : 'inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark)',
        }}
      >
        <span style={{
          position: 'absolute', top: 4, left: on ? 28 : 4,
          width: 20, height: 20, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.25s',
        }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    toast.success('Settings saved!');
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Settings</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage your account preferences</p>
      </motion.div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Sidebar tabs */}
        <div style={{
          width: 200, flexShrink: 0, borderRadius: '1.25rem', padding: '0.75rem',
          background: 'var(--bg)',
          boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.7rem 0.875rem', borderRadius: '0.875rem', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600, textAlign: 'left', transition: 'all 0.2s',
              color: activeTab === t.id ? 'var(--green-700)' : 'var(--text-secondary)',
              background: 'var(--bg)',
              boxShadow: activeTab === t.id
                ? 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)'
                : '-2px -2px 5px var(--shadow-light), 2px 2px 5px var(--shadow-dark)',
            }}>
              <t.icon style={{ width: 16, height: 16 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div style={{
          flex: 1, minWidth: 280, borderRadius: '1.5rem', padding: '2rem',
          background: 'var(--bg)',
          boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
        }}>
          {activeTab === 'profile' && (
            <div>
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--green-200)' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '1.25rem',
                  background: 'linear-gradient(145deg,var(--green-400),var(--green-600))',
                  boxShadow: '-5px -5px 12px rgba(255,255,255,0.5), 5px 5px 12px rgba(0,0,0,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 800, color: 'white',
                }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.firstName} {user?.lastName}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 }}>{user?.role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="First Name" value={user?.firstName ?? ''} placeholder="John" />
                  <Field label="Last Name" value={user?.lastName ?? ''} placeholder="Doe" />
                </div>
                <Field label="Email Address" value={user?.email ?? ''} readOnly />
                <Field label="Role" value={user?.role ?? ''} readOnly />
              </div>
              <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1.75rem', display: 'inline-flex' }}>
                <Save style={{ width: 16, height: 16 }} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <Field label="Current Password" value="" type="password" placeholder="••••••••" />
                <Field label="New Password" value="" type="password" placeholder="Min 8 characters" />
                <Field label="Confirm New Password" value="" type="password" placeholder="Repeat new password" />
              </div>
              <button onClick={handleSave} className="btn-primary" style={{ display: 'inline-flex' }}>
                <Shield style={{ width: 16, height: 16 }} /> Update Password
              </button>

              <div style={{ marginTop: '2rem', paddingTop: '1.75rem', borderTop: '1px solid var(--green-200)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Active Sessions</h3>
                <div style={{
                  padding: '1rem 1.25rem', borderRadius: '1rem',
                  background: 'var(--bg)',
                  boxShadow: 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--green-500)' }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Current Session</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chrome · Windows · Right now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifs' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Notification Preferences</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Choose what you want to be notified about</p>
              <Toggle label="Project Ready"         desc="When a project finishes indexing"          defaultOn />
              <Toggle label="AI Analysis Complete"  desc="When code review or bug analysis completes" defaultOn />
              <Toggle label="Weekly Summary"        desc="Get a weekly digest of your activity"      defaultOn />
              <Toggle label="Marketing Emails"      desc="Tips, tutorials and product updates" />
              <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                <Save style={{ width: 16, height: 16 }} /> Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
