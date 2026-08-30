import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Loader2, MessageSquare, AlertCircle, ChevronDown, FolderOpen, Check } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { SiGithub } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message { role: 'user' | 'ai'; text: string; }

export default function ChatPage() {
  const { activeProject, setActiveProject } = useProjectStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects?page=0&size=50').then(r => r.data.data),
  });

  const projects = (projectsData?.content ?? []).filter((p: any) => p.status === 'READY');

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (activeProject) {
      setMessages([
        {
          role: 'ai',
          text: `👋 Hi! I'm your AI code assistant for **${activeProject.name}**. I have indexed ${activeProject.totalFiles} files. Ask me anything about this codebase — architecture, bugs, docs, or tests!`,
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [activeProject]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading || !activeProject) return;
    
    const userMsgText = input.trim();
    const userMsg: Message = { role: 'user', text: userMsgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post(`/projects/${activeProject.id}/chat`, { message: userMsgText });
      const aiReply = response.data.data || "I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Failed to get response from AI assistant.";
      toast.error(errMsg);
      setMessages(prev => [...prev, { role: 'ai', text: `❌ Error: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (project: any) => {
    setActiveProject(project);
    setShowSwitcher(false);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', height: 'calc(100vh - 4.5rem - 4rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>AI Chat</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {activeProject ? `Connected to ${activeProject.name}` : 'Select a project to start chatting'}
          </p>
        </div>

        {/* ── Project Switcher Dropdown ── */}
        {projects.length > 0 && (
          <div ref={switcherRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSwitcher(prev => !prev)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.5rem 1rem', borderRadius: '0.875rem', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 700,
                color: 'var(--text-primary)',
                background: 'var(--bg)',
                boxShadow: showSwitcher
                  ? 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)'
                  : '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)',
                transition: 'all 0.22s',
              }}
            >
              {activeProject ? (
                <>
                  <div style={{
                    width: 22, height: 22, borderRadius: '0.375rem', flexShrink: 0,
                    background: activeProject.sourceType === 'GITHUB' ? '#374151' : 'var(--green-500)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {activeProject.sourceType === 'GITHUB'
                      ? <SiGithub style={{ color: 'white', width: 11, height: 11 }} />
                      : <FolderOpen style={{ color: 'white', width: 11, height: 11 }} />}
                  </div>
                  <span style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeProject.name}
                  </span>
                </>
              ) : (
                <span>Select Project</span>
              )}
              <ChevronDown style={{
                width: 14, height: 14, color: 'var(--text-muted)',
                transition: 'transform 0.22s',
                transform: showSwitcher ? 'rotate(180deg)' : 'rotate(0deg)',
              }} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showSwitcher && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    width: 300, maxHeight: 340, overflowY: 'auto',
                    background: 'var(--bg)', borderRadius: '1.25rem', padding: '0.5rem',
                    boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.625rem 0.625rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Switch Project ({projects.length})
                  </div>

                  {projectsLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0.25rem' }}>
                      {[1, 2].map(i => (
                        <div key={i} style={{ height: 48, borderRadius: '0.75rem', background: 'var(--bg-dark)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {projects.map((p: any) => {
                        const isActive = activeProject?.id === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectProject(p)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                              padding: '0.625rem 0.75rem', borderRadius: '0.75rem', border: 'none',
                              cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
                              background: isActive ? 'var(--green-100)' : 'var(--bg)',
                              boxShadow: isActive
                                ? 'inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark)'
                                : 'none',
                            }}
                            onMouseOver={e => {
                              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-dark)';
                            }}
                            onMouseOut={e => {
                              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg)';
                            }}
                          >
                            <div style={{
                              width: 32, height: 32, borderRadius: '0.5rem', flexShrink: 0,
                              background: p.sourceType === 'GITHUB' ? '#374151' : 'var(--green-500)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {p.sourceType === 'GITHUB'
                                ? <SiGithub style={{ color: 'white', width: 14, height: 14 }} />
                                : <FolderOpen style={{ color: 'white', width: 14, height: 14 }} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '0.825rem', fontWeight: 700,
                                color: isActive ? 'var(--green-700)' : 'var(--text-primary)',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>
                                {p.totalFiles} files · {p.primaryLanguage ?? 'Mixed'}
                              </div>
                            </div>
                            {isActive && (
                              <Check style={{ width: 16, height: 16, color: 'var(--green-600)', flexShrink: 0 }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflow: 'auto', borderRadius: '1.5rem', padding: '1.5rem',
        background: 'var(--bg)',
        boxShadow: 'inset -8px -8px 20px var(--shadow-light), inset 8px 8px 20px var(--shadow-dark)',
        marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        {!activeProject ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: '1.5rem', textAlign: 'center', padding: '2rem'
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: '#fef3c7', color: '#d97706',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertCircle style={{ width: 30, height: 30 }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Project Selected</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
                {projects.length > 0
                  ? 'Use the project switcher above to select a project and start chatting.'
                  : projectsLoading
                    ? 'Loading your projects...'
                    : <>No indexed projects found. Go to <a href="/projects" style={{ color: 'var(--green-600)', fontWeight: 600, textDecoration: 'none' }}>Projects</a> to create one.</>
                }
              </p>
            </div>

            {/* Quick-select cards when no project is active */}
            {projects.length > 0 && (
              <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>
                  Your Projects
                </div>
                {projects.map((p: any) => (
                  <div 
                    key={p.id}
                    onClick={() => setActiveProject(p)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 1.125rem', borderRadius: '0.875rem', cursor: 'pointer',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '0.5rem',
                        background: p.sourceType === 'GITHUB' ? '#374151' : 'var(--green-500)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {p.sourceType === 'GITHUB' ? <SiGithub style={{ color: 'white', width: 15, height: 15 }} /> : <FolderOpen style={{ color: 'white', width: 15, height: 15 }} />}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{p.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.totalFiles} files · {p.primaryLanguage ?? 'Mixed'}</span>
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.6rem', borderRadius: 99, fontSize: '0.68rem', fontWeight: 700,
                      background: 'var(--green-100)', color: 'var(--green-700)',
                    }}>
                      Chat →
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projectsLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 440 }}>
                {[1, 2].map(i => (
                  <div key={i} style={{
                    height: 56, borderRadius: '0.875rem', background: 'var(--bg)',
                    boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', gap: 12,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'ai'
                  ? 'linear-gradient(145deg,var(--green-500),var(--green-600))'
                  : 'var(--bg)',
                boxShadow: msg.role === 'ai'
                  ? '-3px -3px 8px rgba(255,255,255,0.5), 3px 3px 8px rgba(0,0,0,0.12)'
                  : '-2px -2px 6px var(--shadow-light), 2px 2px 6px var(--shadow-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: msg.role === 'ai' ? 'white' : 'var(--green-700)',
              }}>
                {msg.role === 'ai' ? <Brain style={{ width: 16, height: 16 }} /> : 'U'}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '72%', padding: '0.875rem 1.125rem', borderRadius: msg.role === 'user' ? '1rem 0.25rem 1rem 1rem' : '0.25rem 1rem 1rem 1rem',
                fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-primary)',
                background: 'var(--bg)',
                boxShadow: msg.role === 'user'
                  ? '-5px -5px 12px var(--shadow-light), 5px 5px 12px var(--shadow-dark)'
                  : 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)',
              }}>
                {msg.role === 'ai' ? (
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
                )}
              </div>
            </motion.div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(145deg,var(--green-500),var(--green-600))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Brain style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <div style={{ padding: '0.875rem 1.25rem', borderRadius: '0.25rem 1rem 1rem 1rem', background: 'var(--bg)', boxShadow: 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(d => (
                <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-400)', animation: `bounce 1s ${d * 0.15}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {activeProject && (
        <div style={{
          display: 'flex', gap: 12, background: 'var(--bg)', padding: '0.75rem',
          borderRadius: '1.25rem',
          boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MessageSquare style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about your code…"
              className="neu-input"
            />
          </div>
          <button onClick={send} disabled={!input.trim() || loading} className="btn-primary"
            style={{ padding: '0 1.25rem', opacity: (!input.trim() || loading) ? 0.65 : 1 }}>
            {loading ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 0.8s linear infinite' }} /> : <Send style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
