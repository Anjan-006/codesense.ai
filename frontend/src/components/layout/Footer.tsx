import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { SiGithub, SiX } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa';

const footerLinks = {
  Product:  ['Features', 'Pricing', 'Documentation', 'Changelog'],
  Company:  ['About', 'Blog', 'Careers', 'Contact'],
  Legal:    ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR'],
};

const socials = [
  { Icon: SiGithub,     href: '#', label: 'GitHub' },
  { Icon: SiX,          href: '#', label: 'X' },
  { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--green-200)' }}>
      <div className="container-lg" style={{ padding: '4rem 2rem 2.5rem' }}>

        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
          gap: '2.5rem', marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2', minWidth: 200 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem', textDecoration: 'none' }}>
              <div style={{
                width: 42, height: 42, borderRadius: '0.875rem',
                background: 'linear-gradient(145deg, var(--green-500), var(--green-600))',
                boxShadow: '-4px -4px 10px rgba(255,255,255,0.7), 4px 4px 10px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Brain style={{ width: 20, height: 20, color: 'white' }} />
              </div>
              <span style={{
                fontSize: '1.05rem', fontWeight: 800,
                background: 'linear-gradient(135deg, var(--green-600), var(--green-400))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                CodeSense AI
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.85, maxWidth: 260, marginBottom: '1.75rem' }}>
              AI-powered code intelligence. Understand any codebase like a senior engineer — instantly.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label} href={href} aria-label={label}
                  style={{
                    width: 42, height: 42, borderRadius: '0.875rem',
                    background: 'var(--bg-dark)',
                    boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', transition: 'all 0.22s', textDecoration: 'none',
                  }}
                  onMouseOver={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = 'inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark)';
                    el.style.color = 'var(--green-600)';
                  }}
                  onMouseOut={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)';
                    el.style.color = 'var(--text-muted)';
                  }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, items]) => (
            <div key={heading}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-700)', marginBottom: '1.25rem' }}>
                {heading}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {items.map(item => (
                  <li key={item}>
                    <Link
                      to="#"
                      style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseOver={e => (e.currentTarget as HTMLElement).style.color = 'var(--green-600)'}
                      onMouseOut={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '2rem', borderTop: '1px solid var(--green-200)',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} CodeSense AI, Inc. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Built with ❤️ for developers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
