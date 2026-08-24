import { motion } from 'framer-motion';
import { FolderOpen, MessageSquare, Search, HardDrive, BarChart3, Shield, ChevronRight, XCircle, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import api from '@/lib/axios';
import { SiGithub } from 'react-icons/si';

const quickActions = [
  { to: '/projects', icon: FolderOpen,    label: 'Upload Project', desc: 'ZIP or GitHub',     iconBg: 'linear-gradient(145deg,#4caf50,#2e7d5b)' },
  { to: '/chat',     icon: MessageSquare, label: 'New Chat',        desc: 'Ask about code',    iconBg: 'linear-gradient(145deg,#66bb6a,#388e3c)' },
  { to: '/search',   icon: Search,        label: 'Search Code',     desc: 'Natural language',  iconBg: 'linear-gradient(145deg,#81c784,#2e7d5b)' },
];

const COLORS = ['var(--green-500)', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { activeProject, setActiveProject } = useProjectStore();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data.data),
    staleTime: 30_000,
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects?page=0&size=50').then(r => r.data.data),
  });

  const projects = projectsData?.content ?? [];

  const quickStats = [
    { icon: FolderOpen,    label: 'Projects',      value: stats?.totalProjects   ?? 0,  iconBg: 'linear-gradient(145deg,#4caf50,#2e7d5b)' },
    { icon: MessageSquare, label: 'Questions',     value: stats?.totalQuestions  ?? 0,  iconBg: 'linear-gradient(145deg,#66bb6a,#388e3c)' },
    { icon: Search,        label: 'Files Indexed', value: stats?.totalDocumentsIndexed ?? 0, iconBg: 'linear-gradient(145deg,#81c784,#2e7d5b)' },
    { icon: HardDrive,     label: 'Storage Used',  value: stats?.storageUsedFormatted ?? '0 B', iconBg: 'linear-gradient(145deg,#a5d6a7,#4caf50)' },
  ];

  // Language stats parsing
  const languageStats = activeProject?.languageStats 
    ? Object.entries(activeProject.languageStats).sort((a, b) => b[1] - a[1])
    : [];
  
  const totalLangFiles = languageStats.reduce((sum, [_, val]) => sum + val, 0);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            Welcome back,{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--green-600),var(--green-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user?.firstName}
            </span>{' '}👋
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Here's what's happening with your projects today.
          </p>
        </div>
        {activeProject && (
          <button 
            onClick={() => setActiveProject(null)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', background: '#fee2e2',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
            }}
          >
            Clear Selected Project
          </button>
        )}
      </motion.div>

      {/* Active Project Dashboard View */}
      {activeProject ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Active project card */}
          <div style={{
            padding: '1.5rem', borderRadius: '1.5rem', background: 'var(--bg)',
            boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
            display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '0.875rem',
                background: activeProject.sourceType === 'GITHUB' ? 'linear-gradient(145deg,#374151,#111827)' : 'linear-gradient(145deg,var(--green-500),var(--green-700))',
                boxShadow: '-3px -3px 8px rgba(255,255,255,0.5), 3px 3px 8px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {activeProject.sourceType === 'GITHUB' ? <SiGithub style={{ color: 'white', width: 20, height: 20 }} /> : <FolderOpen style={{ color: 'white', width: 20, height: 20 }} />}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Project</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>{activeProject.name}</h2>
              </div>
            </div>
            <Link to="/chat" className="btn-primary" style={{ textDecoration: 'none' }}>
              <MessageSquare style={{ width: 17, height: 17 }} />
              Open AI Chat
            </Link>
          </div>

          {/* Active stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--bg)', boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Files Indexed</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 0' }}>
                {activeProject.indexedFiles} / {activeProject.totalFiles}
              </p>
            </div>
            <div style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--bg)', boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Code Volume</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 0' }}>
                {activeProject.storageSizeFormatted}
              </p>
            </div>
            <div style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--bg)', boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Primary Language</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--green-600)', margin: '8px 0 0' }}>
                {activeProject.primaryLanguage ?? 'Unknown'}
              </p>
            </div>
            <div style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--bg)', boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Detected Framework</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 0' }}>
                {activeProject.frameworkDetected ?? 'None'}
              </p>
            </div>
          </div>

          {/* Codebase Visual Metrics & Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Chart: Language breakdown */}
            <div style={{
              padding: '1.5rem', borderRadius: '1.5rem', background: 'var(--bg)',
              boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
              display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 style={{ width: 18, height: 18, color: 'var(--green-500)' }} />
                Language Breakdown
              </h3>

              {languageStats.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {/* Visual stacked progress bar */}
                  <div style={{ height: 16, width: '100%', borderRadius: 99, overflow: 'hidden', display: 'flex', boxShadow: 'inset -2px -2px 5px var(--shadow-light), inset 2px 2px 5px var(--shadow-dark)' }}>
                    {languageStats.map(([lang, count], index) => {
                      const percentage = ((count / totalLangFiles) * 100).toFixed(1);
                      return (
                        <div 
                          key={lang} 
                          style={{
                            height: '100%', 
                            width: `${percentage}%`, 
                            backgroundColor: COLORS[index % COLORS.length]
                          }} 
                          title={`${lang}: ${percentage}%`}
                        />
                      );
                    })}
                  </div>

                  {/* List / Legend */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {languageStats.map(([lang, count], index) => {
                      const pct = ((count / totalLangFiles) * 100).toFixed(1);
                      return (
                        <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.825rem' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lang}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{pct}% ({count} files)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No language statistics available for this project.</p>
              )}
            </div>

            {/* Card: Architecture Layout */}
            <div style={{
              padding: '1.5rem', borderRadius: '1.5rem', background: 'var(--bg)',
              boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
              display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Architecture & Ingestion Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--shadow-dark)' }}>
                  <span>Source Code Source</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeProject.sourceType === 'GITHUB' ? 'GitHub URL' : 'ZIP Upload'}</strong>
                </div>
                {activeProject.githubUrl && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--shadow-dark)', overflow: 'hidden' }}>
                    <span>Repo URL</span>
                    <a href={activeProject.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--green-600)', textDecoration: 'none', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60%', fontWeight: 600 }}>
                      {activeProject.githubUrl.replace('https://github.com/', '')}
                    </a>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--shadow-dark)' }}>
                  <span>Indexing Status</span>
                  <strong style={{ color: 'var(--green-600)' }}>COMPLETED</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                  <span>Detected Framework</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeProject.frameworkDetected ?? 'Standard Layout'}</strong>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* fall back global dashboard stats */
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'var(--bg)', boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '0.875rem', marginBottom: '1rem',
                  background: stat.iconBg,
                  boxShadow: '-3px -3px 8px rgba(255,255,255,0.5), 3px 3px 8px rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <stat.icon style={{ width: 20, height: 20, color: 'white' }} />
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Select a Project List */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              padding: '2rem', borderRadius: '1.5rem', background: 'var(--bg)',
              boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <LayoutDashboard style={{ width: 18, height: 18, color: 'var(--green-500)' }} />
              Select a Project to View Metrics & Chat
            </h2>

            {projects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {projects.filter(p => p.status === 'READY').map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setActiveProject(p)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1rem 1.25rem', borderRadius: '1rem', cursor: 'pointer',
                      background: 'var(--bg)', boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)',
                      transition: 'all 0.22s'
                    }}
                    onMouseOver={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)';
                    }}
                    onMouseOut={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '0.75rem',
                        background: p.sourceType === 'GITHUB' ? '#374151' : 'var(--green-500)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {p.sourceType === 'GITHUB' ? <SiGithub style={{ color: 'white', width: 18, height: 18 }} /> : <FolderOpen style={{ color: 'white', width: 18, height: 18 }} />}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{p.totalFiles} files · {p.primaryLanguage ?? 'No primary language'}</span>
                      </div>
                    </div>
                    <ChevronRight style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active projects indexed. Go to <Link to="/projects" style={{ color: 'var(--green-600)', fontWeight: 600 }}>Projects</Link> to connect a repository.
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        style={{ padding: '2rem', borderRadius: '1.5rem', background: 'var(--bg)', boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)' }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,220px),1fr))', gap: '1rem' }}>
          {quickActions.map(({ to, icon: Icon, label, desc, iconBg }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '1.125rem 1.25rem', borderRadius: '1rem', textDecoration: 'none',
              background: 'var(--bg)', boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)',
              transition: 'all 0.22s',
            }}
              onMouseOver={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: '0.875rem', flexShrink: 0,
                background: iconBg,
                boxShadow: '-3px -3px 8px rgba(255,255,255,0.4), 3px 3px 8px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: 18, height: 18, color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
