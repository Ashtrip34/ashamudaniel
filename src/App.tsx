import { FormEvent, useEffect, useState } from "react";

const skills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Java",
  "Tailwind",
  "Node.js",
  "Express",
  "Web Development",
];

const projects = [
  {
    title: "The Luxe Closet",
    description:
      "A luxury e-commerce platform built for premium fashion retail, focused on product presentation, clean browsing, and conversion-ready shopping flows.",
    stack: ["React", "E-commerce", "Design System", "Web Development"],
    liveUrl: "https://the-luxe-closet.vercel.app",
    mockup: "commerce",
  },
  {
    title: "Lekki Eko Real Estate",
    description:
      "A property showcase platform for the Lagos luxury market, designed around location clarity, visual confidence, and buyer trust.",
    stack: ["Web Design", "Real Estate", "Property Platform", "Responsive UI"],
    liveUrl: "https://lagos-white.vercel.app",
    mockup: "realestate",
  },
  {
    title: "TrustLink",
    description:
      "A trust infrastructure platform for African commerce. It helps buyers verify sellers and builds portable reputation through Trust Scores, verified reviews, and deal flow.",
    stack: ["React", "TypeScript", "Tailwind", "Node.js", "Express", "SQL"],
    liveUrl: "https://trust-link.com.ng",
    mockup: "trustlink",
  },
  {
    title: "TruSync",
    description:
      "A lead management platform that helps companies capture, track, and manage incoming leads efficiently from one focused workspace.",
    stack: ["React", "TypeScript", "Tailwind", "Node.js", "Express"],
    liveUrl: "https://trusync.vercel.app",
    mockup: "trusync",
  },
  {
    title: "ALOGY",
    description:
      "A real-time financial dashboard concept for consolidating market data, position tracking, and scheduling for time-sensitive trading operations.",
    stack: ["Flutter", "Python", "JavaScript", "Firebase", "Dashboards"],
    mockup: "dashboard",
  },
] as const;

function BrowserChrome({ url }: { url?: string }) {
  return (
    <div className="mock-browser">
      <div className="browser-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {url ? (
        <a className="mock-url" href={url} target="_blank" rel="noopener noreferrer">
          {url.replace(/^https?:\/\//, "")}
        </a>
      ) : null}
    </div>
  );
}

function TrustLinkPreviewBody() {
  return (
    <div className="mock-content">
      <div className="trust-score">
        <span>Trust Score</span>
        <strong>87</strong>
      </div>
      <div className="mock-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="mock-pill-row">
        <span>Verified seller</span>
        <span>Deal flow</span>
      </div>
    </div>
  );
}

function TrustLinkMockup() {
  return (
    <div className="project-mockup" aria-label="TrustLink product mockup">
      <BrowserChrome />
      <TrustLinkPreviewBody />
    </div>
  );
}

function TruSyncPreviewBody() {
  return (
    <div className="mock-dashboard">
      <div className="dashboard-stat">
        <span>New leads</span>
        <strong>48</strong>
      </div>
      <div className="dashboard-stat">
        <span>Qualified</span>
        <strong>19</strong>
      </div>
      <div className="lead-list" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function TruSyncMockup() {
  return (
    <div className="project-mockup" aria-label="TruSync product mockup">
      <BrowserChrome />
      <TruSyncPreviewBody />
    </div>
  );
}

function PortfolioPreviewBody({ label }: { label: string }) {
  return (
    <div className="portfolio-preview">
      <div className="preview-hero" />
      <div className="preview-grid" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="preview-title">{label}</div>
    </div>
  );
}

function PortfolioMockup({ label }: { label: string }) {
  return (
    <div className="project-mockup" aria-label={`${label} product mockup`}>
      <BrowserChrome />
      <PortfolioPreviewBody label={label} />
    </div>
  );
}

function ProjectFallbackPreview({
  type,
  title,
}: {
  type: (typeof projects)[number]["mockup"];
  title: string;
}) {
  if (type === "trustlink") return <TrustLinkPreviewBody />;
  if (type === "trusync") return <TruSyncPreviewBody />;
  return <PortfolioPreviewBody label={title} />;
}

function LiveProjectPreview({
  type,
  title,
  liveUrl,
}: {
  type: (typeof projects)[number]["mockup"];
  title: string;
  liveUrl: string;
}) {
  const [shouldLoadFrame, setShouldLoadFrame] = useState(false);
  const canEmbedLivePreview = type !== "trustlink";

  return (
    <div
      className={`project-mockup live-project${shouldLoadFrame ? " is-loading-live" : ""}`}
      aria-label={`${title} live website preview`}
    >
      <BrowserChrome url={liveUrl} />
      {shouldLoadFrame && canEmbedLivePreview ? (
        <div className="live-frame-shell">
          <iframe
            src={liveUrl}
            title={`${title} live website`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="live-preview-shell">
          <ProjectFallbackPreview type={type} title={title} />
          <div className="live-preview-actions">
            {canEmbedLivePreview ? (
              <button className="preview-load-button" type="button" onClick={() => setShouldLoadFrame(true)}>
                Load live preview
              </button>
            ) : (
              <a className="preview-load-button" href={liveUrl} target="_blank" rel="noopener noreferrer">
                Open live site
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectMockup({
  type,
  title,
  liveUrl,
}: {
  type: (typeof projects)[number]["mockup"];
  title: string;
  liveUrl?: string;
}) {
  if (liveUrl) return <LiveProjectPreview type={type} title={title} liveUrl={liveUrl} />;
  if (type === "trustlink") return <TrustLinkMockup />;
  if (type === "trusync") return <TruSyncMockup />;
  return <PortfolioMockup label={title} />;
}

function App() {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(element => element.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    revealElements.forEach(element => revealObserver.observe(element));

    return () => revealObserver.disconnect();
  }, []);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const status = form.querySelector(".form-status");

    if (!email || !phone || !message) {
      if (status) status.textContent = "Add your email, contact number, and message first.";
      return;
    }

    const subject = encodeURIComponent("Portfolio inquiry for Bluephes");
    const body = encodeURIComponent(
      `Name: ${name || "Not provided"}\nEmail: ${email}\nContact: ${phone}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:ashamudaniel4161@gmail.com?subject=${subject}&body=${body}`;

    if (status) status.textContent = "Opening your email app.";
    form.reset();
  };

  return (
    <>
      <header className="site-header">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="brand" href="#home" aria-label="Bluephes home">
            <span className="brand-mark" aria-hidden="true">
              <img src="/photo-placeholder.png" alt="" />
            </span>
            <span>Bluephes</span>
          </a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero section-panel">
          <div className="container hero-grid reveal">
            <div className="hero-copy">
              <p className="eyebrow">Bluephes Web Development</p>
              <h1>Send us your idea. We bring it to life.</h1>
              <p className="hero-title">Full-Stack Developer - React &middot; Node.js &middot; TypeScript</p>
              <p className="hero-tagline">Share what you want to build, and I will turn it into a fast, modern web product people can actually use.</p>
              <div className="hero-actions" aria-label="Hero actions">
                <a className="btn btn-primary" href="#projects">View Work</a>
                <a className="btn btn-secondary" href="#contact">Send Your Idea</a>
              </div>
            </div>

            <div className="hero-profile" aria-label="Bluephes profile">
              <a href="/photo-placeholder.png" target="_blank" rel="noreferrer" className="hero-photo" aria-label="Open full portrait of Daniel">
                <img src="/photo-placeholder.png" alt="Portrait of Daniel, Bluephes" />
              </a>
              <div className="hero-profile-meta">
                <span>Available for web products</span>
                <strong>React &middot; TypeScript &middot; Node.js</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-panel">
          <div className="container about-grid reveal">
            <div className="section-heading">
              <p className="eyebrow">About</p>
              <h2>Builder with product sense and backend discipline.</h2>
            </div>
            <div className="about-card about-card-text">
              <div className="about-copy">
                <p>I am Daniel, known as Bluephes, a full-stack developer focused on modern web apps that are clean, fast, and useful.</p>
                <p>I build with React, TypeScript, Node.js, and Express, then shape the product around real user flows instead of decoration.</p>
                <p>My edge is turning messy business problems into sharp interfaces, reliable APIs, and systems people can trust.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section-panel projects-section">
          <div className="container reveal">
            <div className="section-heading section-heading-wide">
              <p className="eyebrow">Projects</p>
              <h2>Selected work built around trust, capture, and operational clarity.</h2>
            </div>

            <div className="projects-grid">
              {projects.map(project => (
                <article className="project-card" key={project.title}>
                  <ProjectMockup
                    type={project.mockup}
                    title={project.title}
                    liveUrl={"liveUrl" in project ? project.liveUrl : undefined}
                  />
                  <div className="project-content">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                    <div className="badge-row" aria-label={`${project.title} stack`}>
                      {project.stack.map(item => <span key={item}>{item}</span>)}
                    </div>
                    <div className="project-actions">
                      {"liveUrl" in project ? (
                        <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Site</a>
                      ) : (
                        <span className="text-link is-disabled">Live link coming soon</span>
                      )}
                      <span className="text-link is-disabled">GitHub coming soon</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section-panel">
          <div className="container reveal">
            <div className="section-heading">
              <p className="eyebrow">Skills</p>
              <h2>Tools I use to ship practical web products.</h2>
            </div>
            <div className="skills-grid" aria-label="Technical skills">
              {skills.map(skill => <span key={skill}>{skill}</span>)}
            </div>
          </div>
        </section>

        <section id="contact" className="section-panel contact-section">
          <div className="container contact-grid reveal">
            <div className="section-heading">
              <p className="eyebrow">Contact</p>
              <h2>Send your idea and let us build it into something real.</h2>
              <p className="section-copy">Share your email, contact number, and the product, website, or feature you have in mind.</p>
            </div>
            <div className="contact-card">
              <a className="contact-link" href="mailto:ashamudaniel4161@gmail.com">
                <span>Email</span>
                <strong>ashamudaniel4161@gmail.com</strong>
              </a>
              <a className="contact-link" href="https://wa.me/2349033583385" target="_blank" rel="noopener noreferrer">
                <span>WhatsApp</span>
                <strong>+2349033583385</strong>
              </a>
              <form id="contact-form" className="contact-form" onSubmit={handleContactSubmit} noValidate>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" />
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" required />
                <label htmlFor="phone">Contact</label>
                <input id="phone" name="phone" type="tel" placeholder="+234..." required />
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} placeholder="Send your idea and what you want it to do" required />
                <button className="btn btn-primary" type="submit">Start Email</button>
                <p className="form-status" role="status" aria-live="polite" />
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>&copy; 2026 Bluephes. Built for the web.</p>
          <div className="footer-links">
            <a href="https://github.com/Ashtrip34" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://x.com/bluephes" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://www.linkedin.com/in/ashamu-daniel-366829367" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
