import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FolderOpen, Upload, Plus, X, Trash2,
  CheckCircle2, AlertCircle, Loader2, ExternalLink,
  FileArchive, ChevronRight
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { projectApi } from '@/features/projects/api/projectApi';
import type { Project } from '@/types/project.types';
import { useProjectStore } from '@/store/projectStore';

/* ── Status helpers ── */
const statusConfig = {
  READY:      { label: 'Ready',      icon: CheckCircle2, color: 'var(--green-600)', bg: 'var(--green-100)' },
  UPLOADING:  { label: 'Uploading',  icon: Loader2,      color: '#3b82f6',          bg: '#dbeafe' },
  PROCESSING: { label: 'Indexing',   icon: Loader2,      color: '#f59e0b',          bg: '#fef3c7' },
  FAILED:     { label: 'Failed',     icon: AlertCircle,  color: '#ef4444',          bg: '#fee2e2' },
  DELETED:    { label: 'Deleted',    icon: AlertCircle,  color: '#6b7280',          bg: '#f3f4f6' },
};

/* ── Upload modal ── */
function UploadModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'zip' | 'github'>('zip');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const zipMutation = useMutation({
    mutationFn: () => projectApi.uploadZip(name, description, file!),
    onSuccess: () => {
      toast.success('Project uploaded successfully!');
      qc.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(msg);
    },
  });

  const githubMutation = useMutation({
    mutationFn: () => projectApi.connectGithub({ name, description, sourceType: 'GITHUB', githubUrl }),
    onSuccess: () => {
      toast.success('GitHub project connected!');
      qc.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to connect GitHub repo.';
      toast.error(msg);
    },
  });

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith('.zip')) { setFile(f); if (!name) setName(f.name.replace('.zip', '')); }
    else toast.error('Only .zip files are accepted');
  }, [name]);

  const canSubmit = tab === 'zip'
    ? name.trim() && file
    : name.trim() && githubUrl.trim();
  const isPending = zipMutation.isPending || githubMutation.isPending;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(232,240,234,0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 540, background: 'var(--bg)',
          boxShadow: '-20px -20px 48px var(--shadow-light), 20px 20px 48px var(--shadow-dark)',
          borderRadius: '2rem', padding: '2rem',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            New Project
          </h2>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
            background: 'var(--bg)', color: 'var(--text-muted)',
            boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: '1.5rem', padding: 4,
          background: 'var(--bg)',
          boxShadow: 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)',
          borderRadius: '0.875rem',
        }}>
          {[{ id: 'zip', icon: FileArchive, label: 'Upload ZIP' }, { id: 'github', icon: SiGithub, label: 'GitHub URL' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as 'zip' | 'github')} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '0.6rem 1rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
              background: tab === t.id ? 'linear-gradient(145deg,var(--green-500),var(--green-600))' : 'transparent',
              color: tab === t.id ? 'white' : 'var(--text-secondary)',
              boxShadow: tab === t.id ? '-3px -3px 8px rgba(255,255,255,0.3), 3px 3px 8px rgba(0,0,0,0.15)' : 'none',
            }}>
              <t.icon style={{ width: 15, height: 15 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Project Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="My Awesome Project"
              className="neu-input" style={{ paddingLeft: '1rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional project description..."
              rows={2} style={{
                width: '100%', padding: '0.875rem 1rem', borderRadius: '0.875rem', border: 'none',
                resize: 'none', fontFamily: 'Inter,sans-serif', fontSize: '0.9rem',
                color: 'var(--text-primary)', outline: 'none',
                background: 'var(--bg)',
                boxShadow: 'inset -4px -4px 10px var(--shadow-light), inset 4px 4px 10px var(--shadow-dark)',
              }} />
          </div>

          {tab === 'zip' ? (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ZIP File *</label>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  cursor: 'pointer', borderRadius: '1rem', padding: '1.75rem',
                  textAlign: 'center', transition: 'all 0.2s',
                  background: 'var(--bg)',
                  boxShadow: dragging
                    ? 'inset -4px -4px 10px var(--shadow-light), inset 4px 4px 10px var(--shadow-dark), 0 0 0 2px var(--green-400)'
                    : 'inset -4px -4px 10px var(--shadow-light), inset 4px 4px 10px var(--shadow-dark)',
                }}
              >
                <input ref={fileRef} type="file" accept=".zip" style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) { setFile(f); if (!name) setName(f.name.replace('.zip', '')); }
                  }} />
                {file ? (
                  <div>
                    <FileArchive style={{ width: 32, height: 32, color: 'var(--green-500)', margin: '0 auto 0.75rem' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <Upload style={{ width: 32, height: 32, color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Drop your ZIP here or click to browse</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Max 100MB · .zip files only</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>GitHub Repository URL *</label>
              <div style={{ position: 'relative' }}>
                <SiGithub style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="neu-input" />
              </div>
            </div>
          )}

          <button
            onClick={() => tab === 'zip' ? zipMutation.mutate() : githubMutation.mutate()}
            disabled={!canSubmit || isPending}
            className="btn-primary"
            style={{ width: '100%', opacity: (!canSubmit || isPending) ? 0.6 : 1, marginTop: '0.25rem' }}
          >
            {isPending ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 0.8s linear infinite' }} /> : <Plus style={{ width: 18, height: 18 }} />}
            {isPending ? 'Creating Project…' : 'Create Project'}
          </button>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Project Card ── */
function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  const navigate = useNavigate();
  const { setActiveProject } = useProjectStore();
  const cfg = statusConfig[project.status] ?? statusConfig.FAILED;
  const StatusIcon = cfg.icon;
  const isAnimated = project.status === 'UPLOADING' || project.status === 'PROCESSING';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg)', borderRadius: '1.5rem', padding: '1.5rem',
        boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '0.875rem', flexShrink: 0,
            background: project.sourceType === 'GITHUB' ? 'linear-gradient(145deg,#374151,#111827)' : 'linear-gradient(145deg,var(--green-500),var(--green-700))',
            boxShadow: '-3px -3px 8px rgba(255,255,255,0.5), 3px 3px 8px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {project.sourceType === 'GITHUB'
              ? <SiGithub style={{ width: 20, height: 20, color: 'white' }} />
              : <FileArchive style={{ width: 20, height: 20, color: 'white' }} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.name}
            </h3>
            {project.description && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {project.description}
              </p>
            )}
          </div>
        </div>
        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          padding: '0.3rem 0.75rem', borderRadius: 99,
          background: cfg.bg, color: cfg.color,
          fontSize: '0.72rem', fontWeight: 700,
        }}>
          <StatusIcon style={{ width: 12, height: 12, animation: isAnimated ? 'spin 1s linear infinite' : 'none' }} />
          {cfg.label}
        </div>
      </div>

      {/* Progress bar if indexing */}
      {(project.status === 'UPLOADING' || project.status === 'PROCESSING') && (
        <div style={{ background: 'var(--bg)', borderRadius: 99, height: 6, boxShadow: 'inset -2px -2px 5px var(--shadow-light), inset 2px 2px 5px var(--shadow-dark)' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: 'linear-gradient(90deg,var(--green-400),var(--green-600))',
            width: `${Math.max(project.indexingProgress, 5)}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {project.primaryLanguage && (
          <span style={{ padding: '0.2rem 0.625rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: 'var(--green-100)', color: 'var(--green-700)' }}>
            {project.primaryLanguage}
          </span>
        )}
        {project.frameworkDetected && (
          <span style={{ padding: '0.2rem 0.625rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: 'var(--bg-dark)', color: 'var(--text-secondary)' }}>
            {project.frameworkDetected}
          </span>
        )}
        <span style={{ padding: '0.2rem 0.625rem', borderRadius: 99, fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-dark)' }}>
          {project.totalFiles} files · {project.storageSizeFormatted}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, paddingTop: '0.25rem', borderTop: '1px solid var(--green-200)' }}>
        {project.status === 'READY' && (
          <button style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '0.6rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-700)',
            background: 'var(--bg)',
            boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
            transition: 'all 0.2s',
          }}
            onClick={() => { setActiveProject(project); navigate('/chat'); }}
            onMouseOver={e => (e.currentTarget as HTMLElement).style.boxShadow = 'inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark)'}
            onMouseOut={e => (e.currentTarget as HTMLElement).style.boxShadow = '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)'}
          >
            <ChevronRight style={{ width: 15, height: 15 }} /> Open Chat
          </button>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '0.6rem 0.875rem', borderRadius: '0.75rem',
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)',
            background: 'var(--bg)',
            boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <ExternalLink style={{ width: 14, height: 14 }} />
          </a>
        )}
        <button onClick={() => onDelete(project.id)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0.6rem 0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
          background: 'var(--bg)', color: '#ef4444',
          boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
          transition: 'all 0.2s',
        }}
          onMouseOver={e => (e.currentTarget as HTMLElement).style.boxShadow = 'inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark)'}
          onMouseOut={e => (e.currentTarget as HTMLElement).style.boxShadow = '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)'}
        >
          <Trash2 style={{ width: 15, height: 15 }} />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ProjectsPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.listProjects(),
    select: r => r.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectApi.deleteProject(id),
    onSuccess: () => { toast.success('Project deleted'); qc.invalidateQueries({ queryKey: ['projects'] }); },
    onError: () => toast.error('Failed to delete project'),
  });

  const projects = data?.content ?? [];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Projects</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{data?.totalElements ?? 0} projects total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus style={{ width: 18, height: 18 }} />
          New Project
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 140, borderRadius: '1.5rem', background: 'var(--bg)',
              boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem', borderRadius: '2rem',
          background: 'var(--bg)',
          boxShadow: '-14px -14px 32px var(--shadow-light), 14px 14px 32px var(--shadow-dark)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '1.5rem', margin: '0 auto 1.5rem',
            background: 'linear-gradient(145deg,var(--green-400),var(--green-600))',
            boxShadow: '-5px -5px 12px rgba(255,255,255,0.5), 5px 5px 12px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FolderOpen style={{ width: 32, height: 32, color: 'white' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No projects yet</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>Upload a ZIP file or connect a GitHub repository to get started.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'inline-flex' }}>
            <Plus style={{ width: 17, height: 17 }} /> Create Your First Project
          </button>
        </div>
      )}

      {/* Projects grid */}
      {projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: '1.5rem' }}>
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} onDelete={id => deleteMutation.mutate(id)} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && <UploadModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
