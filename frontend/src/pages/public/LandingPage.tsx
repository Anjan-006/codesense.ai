import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Upload, MessageSquare, Search, FileText,
  Bug, Code2, TestTube, Workflow, Shield, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';

/* ── Motion ── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }),
};

/* ── Data ── */
const features = [
  { icon: MessageSquare, title: 'AI Chat',             desc: 'Ask anything about your codebase. Get expert answers with precise file and line references instantly.',        iconBg: 'linear-gradient(145deg,#4caf50,#2e7d5b)', iconColor: 'white' },
  { icon: FileText,      title: 'Auto Documentation',  desc: 'Generate production-ready README, API docs, and architecture diagrams directly from your code.',              iconBg: 'linear-gradient(145deg,#66bb6a,#388e3c)', iconColor: 'white' },
  { icon: Search,        title: 'Semantic Search',     desc: '"Where is JWT validated?" — search by intent, not keywords. Find any logic in seconds.',                     iconBg: 'linear-gradient(145deg,#81c784,#2e7d5b)', iconColor: 'white' },
  { icon: Bug,           title: 'Bug Analyzer',        desc: 'Drop a stack trace, get root cause analysis, impacted files, and step-by-step fix suggestions.',             iconBg: 'linear-gradient(145deg,#a5d6a7,#4caf50)', iconColor: 'white' },
  { icon: Code2,         title: 'Code Review',         desc: 'Surface dead code, SOLID violations, security vulnerabilities, and performance bottlenecks automatically.',   iconBg: 'linear-gradient(145deg,#4caf50,#1b5e20)', iconColor: 'white' },
  { icon: TestTube,      title: 'Test Generator',      desc: 'Auto-generate JUnit, Mockito, and integration tests with edge cases and realistic mock data.',                iconBg: 'linear-gradient(145deg,#66bb6a,#2e7d5b)', iconColor: 'white' },
  { icon: Workflow,      title: 'Architecture Viz',    desc: 'Interactive dependency graphs, call trees, and module maps that give you the full picture at a glance.',      iconBg: 'linear-gradient(145deg,#81c784,#388e3c)', iconColor: 'white' },
  { icon: Shield,        title: 'Enterprise Security', desc: 'JWT auth, rate limiting, ZIP bomb protection, and prompt injection prevention — all built in by default.',   iconBg: 'linear-gradient(145deg,#a5d6a7,#2e7d5b)', iconColor: 'white' },
];

const steps = [
  { num: '01', icon: Upload,        title: 'Upload or Connect',      desc: 'Drop a ZIP archive or link your GitHub repo. Java, Python, JS, TS, Go, Rust, C++ and more are supported.' },
  { num: '02', icon: Brain,         title: 'AI Indexes Everything',  desc: 'Our AI maps class hierarchies, extracts APIs, traces dependencies, and builds rich semantic embeddings.' },
  { num: '03', icon: MessageSquare, title: 'Ask, Build, Ship',       desc: 'Chat, generate docs, find bugs, write tests — everything you need to move fast in any codebase.' },
];

const pricingPlans = [
  {
    name: 'Starter', price: '$0', period: '/forever', popular: false,
    desc: 'Perfect for personal projects and exploration.',
    features: ['2 Projects', '50 AI Questions / month', '10 MB Storage', 'Community Support', 'Basic Code Search'],
    cta: 'Start for Free',
  },
  {
    name: 'Pro', price: '$29', period: '/month', popular: true,
    desc: 'For developers who live inside complex codebases.',
    features: ['Unlimited Projects', 'Unlimited AI Questions', '5 GB Storage', 'Priority Support', 'All AI Features', 'API Access', 'Team Sharing'],
    cta: 'Start Pro Trial',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', popular: false,
    desc: 'Tailored for large engineering organisations.',
    features: ['Everything in Pro', 'Unlimited Storage', 'SSO / SAML', 'Dedicated SLA', 'On-Premise Option', 'Custom Integrations', 'Audit Logs'],
    cta: 'Contact Sales',
  },
];

const stats = [
  { value: '8+',    label: 'Languages' },
  { value: '10×',   label: 'Faster Onboarding' },
  { value: '99.9%', label: 'Uptime' },
  { value: '500+',  label: 'Teams' },
];

/* ── Small neu-shadow card around stat ── */
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div style={{
    textAlign: 'center', padding: '1rem 1.5rem', borderRadius: '1rem',
    background: 'var(--bg)',
    boxShadow: '-6px -6px 14px var(--shadow-light), 6px 6px 14px var(--shadow-dark)',
    minWidth: 110,
  }}>
    <div style={{ fontSize: '1.75rem', fontWeight: 900, background: 'linear-gradient(135deg,var(--green-600),var(--green-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3, fontWeight: 500 }}>{label}</div>
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '8rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, var(--bg-light) 0%, var(--bg) 50%, var(--bg-dark) 100%)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '8%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'var(--bg)', boxShadow: '-12px -12px 28px var(--shadow-light), 12px 12px 28px var(--shadow-dark)', opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '3%', width: 200, height: 200, borderRadius: '50%', background: 'var(--bg)', boxShadow: '-8px -8px 20px var(--shadow-light), 8px 8px 20px var(--shadow-dark)', opacity: 0.4, pointerEvents: 'none' }} />

        <div className="container-lg" style={{ padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0.5rem 1.25rem', borderRadius: 99, marginBottom: '2.25rem',
              background: 'var(--bg)',
              boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)',
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--green-600)',
            }}
          >
            <Sparkles style={{ width: 14, height: 14, color: 'var(--green-500)' }} />
            Powered by GPT-4.1 &amp; Advanced RAG
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}
            style={{
              fontFamily: "'Syne','Inter',sans-serif",
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Understand Any Codebase
            <br />
            <span className="gradient-text">Like a Senior Engineer</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22 }}
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'var(--text-secondary)',
              maxWidth: 600, margin: '0 auto 3rem', lineHeight: 1.8,
            }}
          >
            Upload any project — AI deeply reads your architecture, dependencies &amp; business logic.
            Chat, generate docs, review code, and debug. All in one beautiful platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.34 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}
          >
            <button onClick={() => navigate('/register')} className="btn-primary">
              <Upload style={{ width: 18, height: 18 }} />
              Upload a Project
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button onClick={() => navigate('/register')} className="btn-outline">
              <SiGithub style={{ width: 18, height: 18 }} />
              Connect GitHub
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '4.5rem' }}
          >
            {stats.map((s) => <Stat key={s.label} {...s} />)}
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: 820, margin: '0 auto' }}
          >
            <div style={{
              background: 'var(--bg)',
              boxShadow: '-18px -18px 40px var(--shadow-light), 18px 18px 40px var(--shadow-dark)',
              borderRadius: '2rem', padding: '2rem',
            }}>
              {/* Window chrome */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.75rem' }}>
                {['#ff6b6b','#ffd93d','#6bcb77'].map((c, i) => (
                  <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: c, boxShadow: `inset -1px -1px 3px rgba(0,0,0,0.15)` }} />
                ))}
                <div style={{
                  flex: 1, height: 28, borderRadius: 8, marginLeft: 12,
                  background: 'var(--bg)',
                  boxShadow: 'inset -3px -3px 7px var(--shadow-light), inset 3px 3px 7px var(--shadow-dark)',
                  display: 'flex', alignItems: 'center', paddingLeft: 12,
                  fontSize: '0.72rem', color: 'var(--text-muted)',
                }}>
                  🔒 codesense.ai/chat
                </div>
              </div>

              {/* Chat — user */}
              <div style={{ display: 'flex', gap: 14, marginBottom: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg)',
                  boxShadow: '-3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: 'var(--green-600)',
                }}>U</div>
                <div style={{
                  background: 'var(--bg)',
                  boxShadow: 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)',
                  borderRadius: '0.25rem 1rem 1rem 1rem', padding: '0.875rem 1.25rem',
                  fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, textAlign: 'left',
                }}>
                  "Explain how authentication works in this Spring Boot app"
                </div>
              </div>

              {/* Chat — AI */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(145deg, var(--green-500), var(--green-600))',
                  boxShadow: '-3px -3px 8px rgba(255,255,255,0.6), 3px 3px 8px rgba(0,0,0,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Brain style={{ width: 18, height: 18, color: 'white' }} />
                </div>
                <div style={{
                  flex: 1, background: 'var(--bg)',
                  boxShadow: 'inset -4px -4px 10px var(--shadow-light), inset 4px 4px 10px var(--shadow-dark)',
                  borderRadius: '0.25rem 1rem 1rem 1rem', padding: '1.25rem', textAlign: 'left',
                }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
                    The auth flow uses <strong style={{ color: 'var(--green-600)' }}>JWT tokens</strong> with Spring Security.
                    Requests hit <strong style={{ color: 'var(--green-500)' }}>JwtAuthenticationFilter</strong> first, which validates the token before loading the user.
                  </p>
                  <div style={{
                    background: 'var(--bg)',
                    boxShadow: 'inset -3px -3px 8px var(--shadow-light), inset 3px 3px 8px var(--shadow-dark)',
                    borderRadius: '0.75rem', padding: '1rem',
                    fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--green-700)',
                    marginBottom: '1rem', lineHeight: 1.7,
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>// AuthController.java : 45</span><br />
                    @PostMapping(<span style={{ color: 'var(--green-500)' }}>"/login"</span>)<br />
                    <span style={{ color: 'var(--green-600)', fontWeight: 600 }}>public</span> AuthResponse login(...) {'{'}<br />
                    &nbsp;&nbsp;authManager.authenticate(...);<br />
                    &nbsp;&nbsp;<span style={{ color: 'var(--green-600)', fontWeight: 600 }}>return</span> jwtProvider.generateTokenPair(user);<br />
                    {'}'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['AuthController.java', 'JwtProvider.java', '94% confidence'].map(tag => (
                      <span key={tag} style={{
                        padding: '0.3rem 0.875rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                        color: 'var(--green-700)',
                        background: 'var(--bg)',
                        boxShadow: '-2px -2px 6px var(--shadow-light), 2px 2px 6px var(--shadow-dark)',
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="section" id="features" style={{ background: 'var(--bg-light)' }}>
        <div className="container-lg" style={{ padding: '0 1.5rem' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.span variants={fadeUp} custom={0} className="section-label">Features</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-title">
              Everything You Need to<br /><span className="gradient-text">Master Any Codebase</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="section-subtitle" style={{ margin: '0 auto' }}>
              From architecture analysis to bug detection — one AI-powered platform for your whole team.
            </motion.p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
            gap: '1.75rem',
          }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="feature-card"
              >
                <div className="icon-box" style={{ background: f.iconBg }}>
                  <f.icon style={{ width: 22, height: 22, color: f.iconColor }} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.625rem' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container-md" style={{ padding: '0 1.5rem' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4.5rem' }}
          >
            <motion.span variants={fadeUp} custom={0} className="section-label">How It Works</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-title">
              Three Steps to<br /><span className="gradient-text">Code Intelligence</span>
            </motion.h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'flex', gap: '2rem',
                  alignItems: 'flex-start',
                  background: 'var(--bg)',
                  boxShadow: '-10px -10px 24px var(--shadow-light), 10px 10px 24px var(--shadow-dark)',
                  borderRadius: '1.5rem', padding: '2rem',
                }}
              >
                {/* Step number bubble */}
                <div style={{
                  flexShrink: 0, width: 68, height: 68, borderRadius: '1.25rem',
                  background: 'linear-gradient(145deg, var(--green-500), var(--green-600))',
                  boxShadow: '-4px -4px 10px rgba(255,255,255,0.5), 4px 4px 10px rgba(0,0,0,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 2,
                }}>
                  <step.icon style={{ width: 28, height: 28, color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--green-500)', marginBottom: '0.5rem' }}>
                    Step {step.num}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.625rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.78 }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════ */}
      <section className="section" id="pricing" style={{ background: 'var(--bg-light)' }}>
        <div className="container-lg" style={{ padding: '0 1.5rem' }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.span variants={fadeUp} custom={0} className="section-label">Pricing</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="section-title">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="section-subtitle" style={{ margin: '0 auto' }}>
              No hidden fees. Cancel anytime. Start free — scale when ready.
            </motion.p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '2rem', alignItems: 'start',
          }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                style={{ position: 'relative' }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, var(--green-500), var(--green-600))',
                    color: 'white', fontSize: '0.7rem', fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '0.3rem 1.25rem', borderRadius: 99, whiteSpace: 'nowrap',
                    boxShadow: '-3px -3px 8px rgba(255,255,255,0.4), 3px 3px 8px rgba(0,0,0,0.15)',
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ paddingTop: plan.popular ? '0.75rem' : 0, marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.65 }}>{plan.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 'clamp(2.25rem,5vw,2.75rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{plan.period}</span>}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--bg)',
                        boxShadow: '-2px -2px 5px var(--shadow-light), 2px 2px 5px var(--shadow-dark)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CheckCircle2 style={{ width: 13, height: 13, color: 'var(--green-500)' }} />
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/register')}
                  className={plan.popular ? 'btn-primary' : 'btn-outline'}
                  style={{ width: '100%' }}
                >
                  {plan.cta}
                  {plan.popular && <ChevronRight style={{ width: 16, height: 16 }} />}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container-sm" style={{ padding: '0 1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'var(--bg)',
              boxShadow: '-20px -20px 48px var(--shadow-light), 20px 20px 48px var(--shadow-dark)',
              borderRadius: '2.5rem', padding: 'clamp(2.5rem, 6vw, 4.5rem)',
              textAlign: 'center',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 72, height: 72, borderRadius: '1.5rem', margin: '0 auto 1.75rem',
              background: 'linear-gradient(145deg, var(--green-500), var(--green-600))',
              boxShadow: '-6px -6px 14px rgba(255,255,255,0.6), 6px 6px 14px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain style={{ width: 32, height: 32, color: 'white' }} />
            </div>

            <h2 className="section-title" style={{ fontSize: 'clamp(1.75rem,5vw,2.75rem)', marginBottom: '1rem' }}>
              Ready to <span className="gradient-text">Understand</span><br />Your Code?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: 420, margin: '0 auto 2.5rem' }}>
              Join thousands of developers who navigate complex codebases in minutes, not days.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button onClick={() => navigate('/register')} className="btn-primary">
                Get Started — It's Free
                <ArrowRight style={{ width: 18, height: 18 }} />
              </button>
              <button onClick={() => navigate('/login')} className="btn-outline">
                Sign In
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              No credit card required · Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
