import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Code2, FileText, Loader2 } from 'lucide-react';

const examples = [
  'Where is JWT authentication implemented?',
  'How does the payment processing flow work?',
  'Find all database connection methods',
  'Which classes handle file upload logic?',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | { type: string; file: string; line: number; snippet: string }[]>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    // TODO: wire to real semantic search API
    setTimeout(() => {
      setResults([
        { type: 'method', file: 'src/auth/JwtFilter.java', line: 45, snippet: 'doFilterInternal() validates the JWT token from the Authorization header using JwtTokenProvider.validateToken()' },
        { type: 'class',  file: 'src/auth/JwtTokenProvider.java', line: 12, snippet: 'JwtTokenProvider generates and validates JWT tokens using HMAC-SHA256 signing' },
        { type: 'method', file: 'src/config/SecurityConfig.java', line: 38, snippet: 'addFilterBefore(jwtAuthFilter) registers the JWT filter before the standard auth filter chain' },
      ]);
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Semantic Search</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ask anything about your codebase in plain English</p>
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        style={{
          display: 'flex', gap: 12, marginBottom: '1.5rem',
          background: 'var(--bg)',
          boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
          borderRadius: '1.25rem', padding: '0.75rem',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. Where is authentication validated?"
            className="neu-input"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          className="btn-primary"
          style={{ padding: '0 1.5rem', opacity: (!query.trim() || loading) ? 0.65 : 1 }}
        >
          {loading ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 0.8s linear infinite' }} /> : <Sparkles style={{ width: 18, height: 18 }} />}
          {loading ? 'Searching…' : 'Search'}
        </button>
      </motion.div>

      {/* Example queries */}
      {results === null && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Try asking</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {examples.map(ex => (
              <button key={ex} onClick={() => setQuery(ex)} style={{
                padding: '0.5rem 1rem', borderRadius: 99, border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg)',
                boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = 'var(--green-700)'; (e.currentTarget as HTMLElement).style.boxShadow = 'inset -2px -2px 5px var(--shadow-light), inset 2px 2px 5px var(--shadow-dark)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.boxShadow = '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)'; }}
              >
                {ex}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{results.length} results for "{query}"</p>
          {results.map((r, i) => (
            <div key={i} style={{
              background: 'var(--bg)', borderRadius: '1.25rem', padding: '1.25rem 1.5rem',
              boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                {r.type === 'method'
                  ? <Code2 style={{ width: 16, height: 16, color: 'var(--green-600)' }} />
                  : <FileText style={{ width: 16, height: 16, color: 'var(--green-500)' }} />}
                <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-secondary)', fontWeight: 600 }}>{r.file}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Line {r.line}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>{r.snippet}</p>
            </div>
          ))}
        </motion.div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
