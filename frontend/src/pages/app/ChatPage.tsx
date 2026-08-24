import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, Loader2, MessageSquare, AlertCircle, ChevronRight, FolderOpen } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { SiGithub } from 'react-icons/si';

interface Message { role: 'user' | 'ai'; text: string; }

export default function ChatPage() {
  const { activeProject, setActiveProject } = useProjectStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects?page=0&size=50').then(r => r.data.data),
  });

  const projects = projectsData?.content ?? [];

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
        {activeProject && (
          <button 
            onClick={() => setActiveProject(null)}
            style={{
              padding: '0.4rem 0.8rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600, color: '#ef4444', background: '#fee2e2',
              transition: 'all 0.2s'
            }}
          >
            Change Project
          </button>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Active Project Selected</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
                Please select one of your indexed projects below to initiate a context-aware codebase conversation.
              </p>
            </div>

            {projects.length > 0 ? (
              <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                {projects.filter(p => p.status === 'READY').map(p => (
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
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.totalFiles} files · {p.primaryLanguage ?? 'No primary language'}</span>
                      </div>
                    </div>
                    <ChevronRight style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                No active projects indexed. Go to <a href="/projects" style={{ color: 'var(--green-600)', fontWeight: 600, textDecoration: 'none' }}>Projects</a> to connect one.
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
                whiteSpace: 'pre-wrap',
                background: 'var(--bg)',
                boxShadow: msg.role === 'user'
                  ? '-5px -5px 12px var(--shadow-light), 5px 5px 12px var(--shadow-dark)'
                  : 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)',
              }}>
                {msg.text}
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
      `}</style>
    </div>
  );
}
