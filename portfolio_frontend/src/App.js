import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchPortfolio, submitContact } from './api/client';

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// PUBLIC_INTERFACE
function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', message: string }

  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchPortfolio();
        if (mounted) setPortfolio(data);
      } catch (e) {
        if (mounted) {
          setAlert({
            type: 'error',
            message:
              'Could not load portfolio data from the backend. Ensure the backend is running and CORS is enabled.',
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // PUBLIC_INTERFACE
  const onSubmit = async (e) => {
    /** Submits contact form to backend. */
    e.preventDefault();
    setAlert(null);
    setSubmitting(true);
    try {
      await submitContact(form);
      setAlert({ type: 'success', message: 'Message sent. Thanks for reaching out!' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      const details = Array.isArray(err?.details)
        ? err.details.map((d) => `${d.field}: ${d.message}`).join(' ')
        : null;

      setAlert({
        type: 'error',
        message: details ? `${err.message} ${details}` : err.message || 'Something went wrong.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const profile = portfolio?.profile;
  const about = portfolio?.about;
  const skills = portfolio?.skills || [];
  const projects = portfolio?.projects || [];
  const social = portfolio?.social || [];

  return (
    <div className="app">
      <header className="header" role="banner">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-title">{profile?.name || 'Professional Portfolio'}</div>
            <div className="brand-badge">Ocean Professional</div>
          </div>

          <nav className="nav" aria-label="Primary">
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId('about'); }}>About</a>
            <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}>Projects</a>
            <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToId('skills'); }}>Skills</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Contact</a>
          </nav>

          <div className="header-cta">
            <button className="btn btn-secondary" type="button" onClick={() => scrollToId('contact')}>
              Hire Me
            </button>
            <a className="btn btn-primary" href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}>
              View Work
            </a>
          </div>
        </div>
      </header>

      <main className="main" role="main">
        <section className="hero">
          <div className="container hero-grid">
            <div className="card hero-card">
              <div className="hero-kicker">{profile?.role || 'Full Stack Developer'}</div>
              <h1 className="hero-title">
                {profile?.headline || 'Building modern web products with clean UI and solid engineering.'}
              </h1>
              <p className="hero-subtitle">
                {profile?.location ? `${profile.location} • ` : ''}
                API-driven portfolio powered by an Express backend and a React frontend.
              </p>

              <div className="hero-meta" aria-label="Quick facts">
                {profile?.email ? (
                  <span className="pill">
                    <strong>Email</strong> {profile.email}
                  </span>
                ) : null}
                <span className="pill">
                  <strong>Stack</strong> React + Express
                </span>
                <span className="pill">
                  <strong>Theme</strong> Ocean Professional
                </span>
              </div>
            </div>

            <aside className="card side-card" aria-label="Highlights">
              <h2 className="side-title">Highlights</h2>
              <ul className="side-list">
                {(about?.highlights || ['Clean UI', 'API-first', 'Responsive design']).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              {alert ? (
                <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {alert.message}
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container">
            <h2 className="section-title">About</h2>
            <div className="card project-card">
              <h3 className="card-title">{profile?.name || 'Your Name'}</h3>
              <p className="card-desc">
                {about?.summary ||
                  'Add your bio in the backend JSON file (portfolio_backend/src/data/portfolio.json).'}
              </p>
              <p className="form-hint">
                This page is data-driven: the frontend loads content from <code>/api/portfolio</code>.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="container">
            <h2 className="section-title">Projects</h2>

            {loading ? <div className="loading">Loading projects…</div> : null}

            <div className="grid-3" aria-label="Projects list">
              {projects.map((p) => (
                <article className="card project-card" key={p.id}>
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-desc">{p.description}</p>
                  <div className="tags" aria-label="Project tags">
                    {(p.tags || []).map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions">
                    {p.links?.demo ? (
                      <a className="btn" href={p.links.demo} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    ) : null}
                    {p.links?.source ? (
                      <a className="btn btn-primary" href={p.links.source} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="container">
            <h2 className="section-title">Skills</h2>
            <div className="grid-2" aria-label="Skills list">
              {skills.map((s) => (
                <div className="card skill-card" key={s.category}>
                  <h3 className="card-title">{s.category}</h3>
                  <p className="card-desc">{(s.items || []).join(' • ')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="container">
            <h2 className="section-title">Contact</h2>
            <div className="grid-2">
              <div className="card contact-card">
                <h3 className="card-title">Send a message</h3>
                <p className="card-desc">
                  This form POSTs to <code>/api/contact</code> and the backend stores submissions in a JSON file.
                </p>

                <form className="form" onSubmit={onSubmit}>
                  <div className="field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      value={form.name}
                      onChange={onChange('name')}
                      placeholder="Jane Doe"
                      autoComplete="name"
                      required
                      maxLength={80}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      value={form.email}
                      onChange={onChange('email')}
                      placeholder="jane@example.com"
                      autoComplete="email"
                      required
                      maxLength={160}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={onChange('message')}
                      placeholder="Tell me about your project…"
                      required
                      maxLength={2000}
                    />
                  </div>

                  <button className="btn btn-secondary" type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                  <p className="form-hint">
                    Tip: set <code>REACT_APP_API_BASE_URL</code> to point to your backend in production.
                  </p>
                </form>
              </div>

              <div className="card contact-card">
                <h3 className="card-title">Connect</h3>
                <p className="card-desc">
                  Prefer a quick link? Here are my social profiles.
                </p>

                <div className="card-actions" aria-label="Social links">
                  {social.map((s) => (
                    <a key={s.label} className="btn btn-primary" href={s.url} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  ))}
                </div>

                <p className="form-hint">
                  Backend docs: <code>/docs</code> (Swagger UI).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="small-muted">
            © {year} {profile?.name || 'Your Name'} — Built with Ocean Professional theme.
          </div>
          <div className="footer-links">
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId('about'); }}>About</a>
            <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}>Projects</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
